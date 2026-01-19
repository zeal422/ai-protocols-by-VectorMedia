import { randomUUID } from 'crypto';
import {
  ExecutionSession,
  Checkpoint,
  ProtocolExecution,
  StandardResult
} from '../types/execution.js';
import { ProjectContext, Language, Framework, ProjectType, TestFramework, PackageManager } from '../types/project-context.js';
import { DatabaseManager } from '../storage/database.js';

export interface CheckpointInfo {
  checkpointId: string;
  sessionId: string;
  protocolName: string;
  timestamp: Date;
  checkpointType: 'manual' | 'automatic' | 'error_recovery';
  description?: string;
  protocolCount: number;
}

export interface CheckpointCreateOptions {
  checkpointType?: 'manual' | 'automatic' | 'error_recovery';
  description?: string;
}

export interface SessionState {
  sessionId: string;
  taskDescription: string;
  projectContext: ProjectContext;
  executionStack: ProtocolExecution[];
  sharedContext: Record<string, unknown>;
  artifacts: Record<string, {
    artifactId: string;
    protocolName: string;
    artifactType: string;
    data: unknown;
    createdAt: Date;
    expiresAt: Date;
    size: number;
    tags: string[];
  }>;
  status: 'active' | 'paused' | 'completed' | 'failed' | 'archived';
  metadata: Record<string, unknown>;
}

export class CheckpointSystem {
  private db: DatabaseManager;
  private maxCheckpointsPerSession: number;
  private checkpointRetentionDays: number;

  constructor(
    db: DatabaseManager,
    options: {
      maxCheckpointsPerSession?: number;
      checkpointRetentionDays?: number;
    } = {}
  ) {
    this.db = db;
    this.maxCheckpointsPerSession = options.maxCheckpointsPerSession ?? 10;
    this.checkpointRetentionDays = options.checkpointRetentionDays ?? 7;
  }

  async createCheckpoint(
    session: ExecutionSession,
    options: CheckpointCreateOptions = {}
  ): Promise<string> {
    const checkpointId = randomUUID();
    const checkpointType = options.checkpointType ?? 'automatic';
    const description = options.description;

    const checkpoint: Checkpoint = {
      checkpointId,
      sessionId: session.sessionId,
      protocolName: session.executionStack.length > 0
        ? session.executionStack[session.executionStack.length - 1].protocolName
        : 'initial',
      timestamp: new Date(),
      executionStack: [...session.executionStack],
      sharedContext: new Map(session.sharedContext),
      metadata: {
        checkpointType,
        description,
        protocolCount: session.executionStack.length
      }
    };

    const storage = this.db.getStorage();
    const existingSession = await storage.getSession(session.sessionId);
    
    if (!existingSession) {
      throw new Error(`Session not found: ${session.sessionId}`);
    }

    const updatedCheckpoints = [...existingSession.checkpoints, checkpoint];

    if (updatedCheckpoints.length > this.maxCheckpointsPerSession) {
      updatedCheckpoints.splice(0, updatedCheckpoints.length - this.maxCheckpointsPerSession);
    }

    await storage.updateSession(session.sessionId, {
      checkpoints: updatedCheckpoints,
      status: 'paused',
      updatedAt: new Date()
    });

    return checkpointId;
  }

  async saveCheckpoint(checkpointId: string, state: SessionState): Promise<void> {
    const storage = this.db.getStorage();
    const session = await storage.getSession(state.sessionId);
    
    if (!session) {
      throw new Error(`Session not found: ${state.sessionId}`);
    }

    const checkpointIndex = session.checkpoints.findIndex(c => c.checkpointId === checkpointId);
    if (checkpointIndex === -1) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    session.checkpoints[checkpointIndex] = {
      ...session.checkpoints[checkpointIndex],
      executionStack: state.executionStack,
      sharedContext: new Map(Object.entries(state.sharedContext))
    };

    await storage.updateSession(state.sessionId, {
      checkpoints: session.checkpoints,
      updatedAt: new Date()
    });
  }

  async listCheckpoints(sessionId: string): Promise<CheckpointInfo[]> {
    const storage = this.db.getStorage();
    const session = await storage.getSession(sessionId);
    
    if (!session) {
      return [];
    }

    return session.checkpoints.map(checkpoint => ({
      checkpointId: checkpoint.checkpointId,
      sessionId: checkpoint.sessionId,
      protocolName: checkpoint.protocolName,
      timestamp: checkpoint.timestamp,
      checkpointType: checkpoint.metadata.checkpointType,
      description: checkpoint.metadata.description,
      protocolCount: checkpoint.metadata.protocolCount
    }));
  }

  async resumeFromCheckpoint(checkpointId: string): Promise<ExecutionSession> {
    const storage = this.db.getStorage();
    
    const sessions = await storage.listSessions();
    const session = sessions.find(s => 
      s.checkpoints.some(c => c.checkpointId === checkpointId)
    );

    if (!session) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    const checkpoint = session.checkpoints.find(c => c.checkpointId === checkpointId);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    const restoredSession: ExecutionSession = {
      ...session,
      executionStack: checkpoint.executionStack.map(exec => ({
        ...exec,
        startTime: new Date(exec.startTime),
        endTime: exec.endTime ? new Date(exec.endTime) : undefined
      })),
      sharedContext: new Map(checkpoint.sharedContext),
      checkpoints: session.checkpoints,
      status: 'active',
      updatedAt: new Date()
    };

    await storage.updateSession(session.sessionId, {
      executionStack: restoredSession.executionStack,
      sharedContext: restoredSession.sharedContext,
      status: 'active',
      updatedAt: new Date()
    });

    return restoredSession;
  }

  async deleteCheckpoint(checkpointId: string): Promise<void> {
    const storage = this.db.getStorage();
    
    const sessions = await storage.listSessions();
    const session = sessions.find(s => 
      s.checkpoints.some(c => c.checkpointId === checkpointId)
    );

    if (!session) {
      throw new Error(`Checkpoint not found: ${checkpointId}`);
    }

    const filteredCheckpoints = session.checkpoints.filter(
      c => c.checkpointId !== checkpointId
    );

    await storage.updateSession(session.sessionId, {
      checkpoints: filteredCheckpoints,
      updatedAt: new Date()
    });
  }

  async cleanupCheckpoints(olderThan: Date): Promise<number> {
    const storage = this.db.getStorage();
    const sessions = await storage.listSessions();
    let deletedCount = 0;

    for (const session of sessions) {
      const filteredCheckpoints = session.checkpoints.filter(
        checkpoint => checkpoint.timestamp >= olderThan
      );
      
      const deleted = session.checkpoints.length - filteredCheckpoints.length;
      if (deleted > 0) {
        await storage.updateSession(session.sessionId, {
          checkpoints: filteredCheckpoints,
          updatedAt: new Date()
        });
        deletedCount += deleted;
      }
    }

    return deletedCount;
  }

  async validateCheckpoint(checkpointId: string): Promise<boolean> {
    const storage = this.db.getStorage();
    
    const sessions = await storage.listSessions();
    const session = sessions.find(s => 
      s.checkpoints.some(c => c.checkpointId === checkpointId)
    );

    if (!session) {
      return false;
    }

    const checkpoint = session.checkpoints.find(c => c.checkpointId === checkpointId);
    if (!checkpoint) {
      return false;
    }

    if (!checkpoint.checkpointId || !checkpoint.sessionId) {
      return false;
    }

    if (checkpoint.executionStack.length < 0) {
      return false;
    }

    for (const execution of checkpoint.executionStack) {
      if (!execution.protocolName || !execution.trigger) {
        return false;
      }
    }

    return true;
  }

  async getCheckpointById(checkpointId: string): Promise<Checkpoint | null> {
    const storage = this.db.getStorage();
    
    const sessions = await storage.listSessions();
    const session = sessions.find(s => 
      s.checkpoints.some(c => c.checkpointId === checkpointId)
    );

    if (!session) {
      return null;
    }

    return session.checkpoints.find(c => c.checkpointId === checkpointId) || null;
  }

  async getLatestCheckpoint(sessionId: string): Promise<Checkpoint | null> {
    const storage = this.db.getStorage();
    const session = await storage.getSession(sessionId);
    
    if (!session || session.checkpoints.length === 0) {
      return null;
    }

    const sortedCheckpoints = [...session.checkpoints].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return sortedCheckpoints[0];
  }

  async getCheckpointCount(sessionId: string): Promise<number> {
    const storage = this.db.getStorage();
    const session = await storage.getSession(sessionId);
    
    if (!session) {
      return 0;
    }

    return session.checkpoints.length;
  }
}

export function createMockExecutionSession(
  overrides: Partial<ExecutionSession> = {}
): ExecutionSession {
  const sessionId = randomUUID();
  
  return {
    sessionId,
    taskDescription: 'Test session for checkpoint',
    projectContext: {
      language: Language.TypeScript,
      framework: Framework.React,
      projectType: ProjectType.Frontend,
      testFramework: TestFramework.Jest,
      packageManager: PackageManager.NPM,
      hasDocker: false,
      hasCI: true,
      hasGit: true,
      dependencies: [],
      devDependencies: [],
      detected: true
    },
    executionStack: [],
    sharedContext: new Map(),
    artifacts: {},
    checkpoints: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    metadata: {},
    metrics: {
      sessionId,
      metrics: [],
      startTime: new Date()
    },
    ...overrides
  };
}

export function createMockProtocolExecution(
  protocolName: string,
  overrides: Partial<ProtocolExecution> = {}
): ProtocolExecution {
  return {
    protocolName,
    trigger: `TEST_${protocolName.toUpperCase()}`,
    startTime: new Date(),
    status: 'completed',
    result: createMockStandardResult(protocolName),
    artifactIds: [],
    ...overrides
  };
}

export function createMockStandardResult(
  protocolName: string,
  overrides: Partial<StandardResult> = {}
): StandardResult {
  return {
    protocolName,
    executionTime: Math.random() * 1000,
    timestamp: new Date(),
    success: true,
    findings: [],
    recommendations: [],
    artifacts: [],
    nextSteps: [],
    metrics: {
      protocolName,
      executionTime: Math.random() * 1000,
      cacheHits: Math.floor(Math.random() * 10),
      cacheMisses: Math.floor(Math.random() * 5),
      cacheHitRate: Math.random(),
      memoryUsage: Math.random() * 1000000,
      success: true
    },
    ...overrides
  };
}
