import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ExecutionSession, Artifact, Metric, Finding, Recommendation, NextStep, ArtifactReference, Checkpoint, StandardResult } from '../types/execution.js';
import { ProjectContext } from '../types/project-context.js';
import type { SessionFilter, ArtifactFilter } from '../types/execution.js';
import {
  StorageAdapter,
  DatabaseConnection,
  DatabaseConfig
} from '../types/database.js';
import { DatabaseError } from '../types/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORAGE_DIR = join(__dirname, '..', '..', '.storage');
const SESSIONS_FILE = join(STORAGE_DIR, 'sessions.json');
const ARTIFACTS_FILE = join(STORAGE_DIR, 'artifacts.json');
const METRICS_FILE = join(STORAGE_DIR, 'metrics.json');

interface SerializedSession {
  sessionId: string;
  taskDescription: string;
  projectContext: Record<string, unknown>;
  executionStack: SerializedExecution[];
  sharedContext: Record<string, unknown>;
  metrics: Record<string, unknown>;
  checkpoints: SerializedCheckpoint[];
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface SerializedExecution {
  protocolName: string;
  trigger: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  result: Record<string, unknown>;
  status: string;
  artifactIds: string[];
}

interface SerializedCheckpoint {
  checkpointId: string;
  sessionId: string;
  protocolName: string;
  timestamp: string;
  executionStack: SerializedExecution[];
  sharedContext: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

interface SerializedArtifact {
  artifactId: string;
  sessionId: string;
  protocolName: string;
  artifactType: string;
  data: unknown;
  createdAt: string;
  expiresAt: string;
  size: number;
  tags: string[];
}

export class FileStorage implements StorageAdapter {
  private sessions: Map<string, ExecutionSession> = new Map();
  private artifacts: Map<string, Artifact> = new Map();
  private metrics: Map<string, Metric[]> = new Map();
  private initialized = false;

  async connect(): Promise<void> {
    await this.ensureStorageDir();
    await this.loadData();
    this.initialized = true;
  }

  async disconnect(): Promise<void> {
    await this.saveData();
    this.initialized = false;
  }

  private async ensureStorageDir(): Promise<void> {
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (error) {
      throw new DatabaseError(`Failed to create storage directory: ${error}`, { dir: STORAGE_DIR });
    }
  }

  private async loadData(): Promise<void> {
    try {
      const [sessionsData, artifactsData, metricsData] = await Promise.all([
        this.safeReadJson<SerializedSession[]>(SESSIONS_FILE, []),
        this.safeReadJson<SerializedArtifact[]>(ARTIFACTS_FILE, []),
        this.safeReadJson<Array<[string, Metric[]]>>(METRICS_FILE, [])
      ]);

      this.sessions = new Map(sessionsData.map((s) => [s.sessionId, this.hydrateSession(s)]));
      this.artifacts = new Map(artifactsData.map((a) => [a.artifactId, this.hydrateArtifact(a)]));
      this.metrics = new Map(metricsData);
    } catch (error) {
      throw new DatabaseError(`Failed to load storage data: ${error}`);
    }
  }

  private async saveData(): Promise<void> {
    try {
      await Promise.all([
        fs.writeFile(SESSIONS_FILE, JSON.stringify(Array.from(this.sessions.values()), null, 2)),
        fs.writeFile(ARTIFACTS_FILE, JSON.stringify(Array.from(this.artifacts.values()), null, 2)),
        fs.writeFile(METRICS_FILE, JSON.stringify(Array.from(this.metrics.entries()), null, 2))
      ]);
    } catch (error) {
      throw new DatabaseError(`Failed to save storage data: ${error}`);
    }
  }

  private async safeReadJson<T>(path: string, defaultValue: T): Promise<T> {
    try {
      const data = await fs.readFile(path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return defaultValue;
      }
      throw error;
    }
  }

  private hydrateSession(data: SerializedSession): ExecutionSession {
    return {
      sessionId: data.sessionId,
      taskDescription: data.taskDescription,
      projectContext: data.projectContext as unknown as ProjectContext,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      status: data.status as ExecutionSession['status'],
      metadata: data.metadata as ExecutionSession['metadata'],
      executionStack: data.executionStack.map((e) => ({
        protocolName: e.protocolName,
        trigger: e.trigger,
        startTime: new Date(e.startTime),
        endTime: e.endTime ? new Date(e.endTime) : undefined,
        duration: e.duration,
        status: e.status as 'running' | 'completed' | 'failed',
        artifactIds: e.artifactIds,
        result: {
          protocolName: e.result.protocolName as string || e.protocolName,
          executionTime: (e.result.executionTime as number) || 0,
          timestamp: new Date(e.result.timestamp as string),
          success: (e.result.success as boolean) ?? true,
          findings: (e.result.findings as Finding[]) || [],
          recommendations: (e.result.recommendations as Recommendation[]) || [],
          artifacts: (e.result.artifacts as ArtifactReference[]) || [],
          nextSteps: (e.result.nextSteps as NextStep[]) || [],
          metrics: {
            protocolName: e.protocolName,
            executionTime: (e.result.executionTime as number) || 0,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: 0,
            success: (e.result.success as boolean) ?? true
          }
        }
      })),
      sharedContext: new Map(Object.entries(data.sharedContext)),
      artifacts: {},
      checkpoints: data.checkpoints.map((c) => ({
        checkpointId: c.checkpointId,
        sessionId: c.sessionId,
        protocolName: c.protocolName,
        timestamp: new Date(c.timestamp),
        executionStack: c.executionStack.map((e) => ({
          protocolName: e.protocolName,
          trigger: e.trigger,
          startTime: new Date(e.startTime),
          endTime: e.endTime ? new Date(e.endTime) : undefined,
          duration: e.duration,
          status: e.status as 'running' | 'completed' | 'failed',
          artifactIds: e.artifactIds,
          result: e.result as unknown as StandardResult
        })),
        sharedContext: new Map(Object.entries(c.sharedContext)),
        metadata: c.metadata as unknown as Checkpoint['metadata']
      })),
      metrics: {
        sessionId: data.sessionId,
        metrics: [],
        startTime: new Date(data.createdAt)
      }
    };
  }

  private hydrateArtifact(data: SerializedArtifact): Artifact {
    return {
      artifactId: data.artifactId,
      sessionId: data.sessionId,
      protocolName: data.protocolName,
      artifactType: data.artifactType as Artifact['artifactType'],
      data: data.data,
      createdAt: new Date(data.createdAt),
      expiresAt: new Date(data.expiresAt),
      size: data.size,
      tags: data.tags
    };
  }

  async createSession(session: ExecutionSession): Promise<void> {
    this.sessions.set(session.sessionId, session);
    await this.saveData();
  }

  async getSession(sessionId: string): Promise<ExecutionSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async updateSession(sessionId: string, updates: Partial<ExecutionSession>): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new DatabaseError(`Session not found: ${sessionId}`);
    }
    this.sessions.set(sessionId, { ...session, ...updates, updatedAt: new Date() });
    await this.saveData();
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    await this.saveData();
  }

  async listSessions(filter?: SessionFilter): Promise<ExecutionSession[]> {
    let sessions = Array.from(this.sessions.values());

    if (filter) {
      sessions = sessions.filter((session) => {
        if (filter.status && session.status !== filter.status) return false;
        if (filter.userId && session.metadata.userId !== filter.userId) return false;
        if (filter.aiTool && session.metadata.aiTool !== filter.aiTool) return false;
        if (filter.createdAfter && session.createdAt < filter.createdAfter) return false;
        if (filter.createdBefore && session.createdAt > filter.createdBefore) return false;
        if (filter.tags && filter.tags.length > 0) {
          const sessionTags = session.metadata.tags || [];
          if (!filter.tags.every((tag: string) => sessionTags.includes(tag))) return false;
        }
        return true;
      });
    }

    return sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createArtifact(artifact: Artifact): Promise<void> {
    this.artifacts.set(artifact.artifactId, artifact);
    await this.saveData();
  }

  async getArtifact(artifactId: string): Promise<Artifact | null> {
    return this.artifacts.get(artifactId) || null;
  }

  async deleteArtifact(artifactId: string): Promise<void> {
    this.artifacts.delete(artifactId);
    await this.saveData();
  }

  async listArtifacts(filter?: ArtifactFilter): Promise<Artifact[]> {
    let artifacts = Array.from(this.artifacts.values());

    if (filter) {
      artifacts = artifacts.filter((artifact) => {
        if (filter.sessionId && artifact.sessionId !== filter.sessionId) return false;
        if (filter.protocolName && artifact.protocolName !== filter.protocolName) return false;
        if (filter.artifactType && artifact.artifactType !== filter.artifactType) return false;
        if (filter.expiresBefore && artifact.expiresAt > filter.expiresBefore) return false;
        if (filter.expiresAfter && artifact.expiresAt < filter.expiresAfter) return false;
        if (filter.tags && filter.tags.length > 0) {
          if (!filter.tags.every((tag: string) => artifact.tags.includes(tag))) return false;
        }
        return true;
      });
    }

    return artifacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async recordMetric(metric: Metric): Promise<void> {
    const metrics = this.metrics.get(metric.sessionId) || [];
    metrics.push(metric);
    this.metrics.set(metric.sessionId, metrics);
    await this.saveData();
  }

  async getMetrics(sessionId: string): Promise<Metric[]> {
    return this.metrics.get(sessionId) || [];
  }

  async cleanupExpiredArtifacts(olderThan: Date): Promise<number> {
    let count = 0;
    for (const [artifactId, artifact] of this.artifacts.entries()) {
      if (artifact.expiresAt < olderThan) {
        this.artifacts.delete(artifactId);
        count++;
      }
    }
    if (count > 0) {
      await this.saveData();
    }
    return count;
  }
}

export class DatabaseManager {
  private storage: StorageAdapter;
  private connection: DatabaseConnection;

  constructor(_config: DatabaseConfig = { type: 'file', poolSize: 10, timeout: 5000 }) {
    this.storage = new FileStorage();
    this.connection = this.wrapConnection(this.storage);
  }

  private wrapConnection(storage: StorageAdapter): DatabaseConnection {
    return {
      query: async <T>(): Promise<T[]> => {
        return [] as T[];
      },
      execute: async (): Promise<{ changes: number }> => {
        return { changes: 0 };
      },
      transaction: async <T>(callback: (conn: DatabaseConnection) => Promise<T>): Promise<T> => {
        return callback(this.connection);
      },
      close: async (): Promise<void> => {
        await storage.disconnect();
      }
    };
  }

  async initialize(): Promise<void> {
    await this.storage.connect();
  }

  async disconnect(): Promise<void> {
    await this.storage.disconnect();
  }

  getStorage(): StorageAdapter {
    return this.storage;
  }

  getConnection(): DatabaseConnection {
    return this.connection;
  }
}
