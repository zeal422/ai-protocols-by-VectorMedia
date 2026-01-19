import { v4 as uuidv4 } from 'uuid';
import {
  ExecutionSession,
  SessionStatus,
  SessionInfo,
  Metric,
  ArtifactType,
  SessionMetadata,
  SessionFilter,
  Finding,
  Recommendation,
  NextStep
} from '../types/execution.js';
import { ProjectContext } from '../types/project-context.js';
import { StorageAdapter } from '../types/database.js';
import { SessionNotFoundError, ProtocolError } from '../types/errors.js';

export interface SessionResult {
  sessionId: string;
  taskDescription: string;
  status: SessionStatus;
  protocolsExecuted: number;
  totalDuration: number;
  findings: Finding[];
  recommendations: Recommendation[];
  artifacts: Array<{ artifactId: string; artifactType: ArtifactType; createdAt: Date; size: number }>;
  summary: string;
  nextSteps: NextStep[];
}

export class SessionManager {
  private storage: StorageAdapter;
  private cache: Map<string, ExecutionSession> = new Map();
  private readonly maxCacheSize = 100;
  private readonly cacheTTL = 60 * 60 * 1000;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  async createSession(
    taskDescription: string,
    context: ProjectContext,
    metadata?: SessionMetadata
  ): Promise<string> {
    const sessionId = uuidv4();
    const now = new Date();

    const session: ExecutionSession = {
      sessionId,
      taskDescription,
      projectContext: context,
      executionStack: [],
      sharedContext: new Map(),
      artifacts: {},
      metrics: {
        sessionId,
        metrics: [],
        startTime: now
      },
      checkpoints: [],
      createdAt: now,
      updatedAt: now,
      status: 'active',
      metadata: metadata || {}
    };

    await this.storage.createSession(session);
    this.addToCache(session);

    await this.recordMetric(sessionId, 'session_created', 1, 'count');

    return sessionId;
  }

  async getSession(sessionId: string): Promise<ExecutionSession> {
    const cached = this.cache.get(sessionId);
    if (cached) {
      return cached;
    }

    const session = await this.storage.getSession(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    this.addToCache(session);
    return session;
  }

  async updateSession(
    sessionId: string,
    updates: Partial<ExecutionSession>
  ): Promise<void> {
    const existing = await this.getSession(sessionId);
    const updated = { ...existing, ...updates, updatedAt: new Date() };

    await this.storage.updateSession(sessionId, updated);
    this.cache.set(sessionId, updated);
  }

  async closeSession(sessionId: string): Promise<SessionResult> {
    const session = await this.getSession(sessionId);

    if (session.status === 'completed' || session.status === 'failed') {
      throw new ProtocolError(`Session already closed: ${sessionId}`, 'SESSION_ALREADY_CLOSED');
    }

    const totalDuration = Date.now() - session.createdAt.getTime();
    const allFindings = session.executionStack.flatMap(e => e.result.findings);
    const allRecommendations = session.executionStack.flatMap(e => e.result.recommendations);
    const allNextSteps = session.executionStack.flatMap(e => e.result.nextSteps);
    const allArtifacts = Object.values(session.artifacts);

    const result: SessionResult = {
      sessionId: session.sessionId,
      taskDescription: session.taskDescription,
      status: 'completed',
      protocolsExecuted: session.executionStack.length,
      totalDuration,
      findings: allFindings,
      recommendations: allRecommendations,
      artifacts: allArtifacts.map(a => ({
        artifactId: a.artifactId,
        artifactType: a.artifactType,
        createdAt: a.createdAt,
        size: a.size
      })),
      summary: `Executed ${session.executionStack.length} protocols in ${Math.round(totalDuration / 1000)}s`,
      nextSteps: allNextSteps
    };

    await this.updateSession(sessionId, { status: 'completed' });
    await this.recordMetric(sessionId, 'session_closed', 1, 'count');

    return result;
  }

  async listActiveSessions(filters?: SessionFilter): Promise<SessionInfo[]> {
    const sessions = await this.storage.listSessions({
      ...filters,
      status: 'active'
    });

    return sessions.map(session => this.toSessionInfo(session));
  }

  async pauseSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, { status: 'paused' });
    await this.recordMetric(sessionId, 'session_paused', 1, 'count');
  }

  async resumeSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session.status !== 'paused') {
      throw new ProtocolError(`Cannot resume session that is not paused: ${sessionId}`, 'INVALID_SESSION_STATE');
    }
    await this.updateSession(sessionId, { status: 'active' });
    await this.recordMetric(sessionId, 'session_resumed', 1, 'count');
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);

    if (session.status === 'active') {
      throw new ProtocolError(`Cannot delete active session: ${sessionId}`, 'CANNOT_DELETE_ACTIVE_SESSION');
    }

    await this.storage.deleteSession(sessionId);
    this.cache.delete(sessionId);

    await this.recordMetric(sessionId, 'session_deleted', 1, 'count');
  }

  async cleanupExpiredSessions(olderThan: Date): Promise<number> {
    const sessions = await this.storage.listSessions();
    let count = 0;

    for (const session of sessions) {
      if (session.updatedAt < olderThan && session.status !== 'active') {
        await this.deleteSession(session.sessionId);
        count++;
      }
    }

    return count;
  }

  private addToCache(session: ExecutionSession): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(session.sessionId, session);
  }

  private toSessionInfo(session: ExecutionSession): SessionInfo {
    const completedExecutions = session.executionStack.filter(e => e.status === 'completed');
    const totalDuration = completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      sessionId: session.sessionId,
      taskDescription: session.taskDescription,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      protocolCount: session.executionStack.length,
      duration: totalDuration
    };
  }

  private async recordMetric(
    sessionId: string,
    metricType: string,
    value: number,
    unit: string
  ): Promise<void> {
    const metric: Metric = {
      metricId: uuidv4(),
      sessionId,
      protocolName: 'session_manager',
      metricType: metricType as Metric['metricType'],
      value,
      unit,
      timestamp: new Date()
    };

    await this.storage.recordMetric(metric);
  }
}
