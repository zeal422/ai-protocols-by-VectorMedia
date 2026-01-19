import { z } from 'zod';
import { ExecutionSession, Artifact, Metric } from './execution.js';
import type { SessionFilter, ArtifactFilter } from './execution.js';

export type { SessionFilter, ArtifactFilter };

export interface DatabaseConfig {
  type: 'file' | 'sqlite' | 'postgresql';
  path?: string;
  connectionString?: string;
  poolSize: number;
  timeout: number;
}

export interface DatabaseConnection {
  query: <T>(sql: string, params?: unknown[]) => Promise<T[]>;
  execute: (sql: string, params?: unknown[]) => Promise<DatabaseResult>;
  transaction: <T>(callback: (conn: DatabaseConnection) => Promise<T>) => Promise<T>;
  close: () => Promise<void>;
}

export interface DatabaseResult {
  changes: number;
  lastInsertRowid?: number;
}

export interface StorageAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  createSession(session: ExecutionSession): Promise<void>;
  getSession(sessionId: string): Promise<ExecutionSession | null>;
  updateSession(sessionId: string, updates: Partial<ExecutionSession>): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  listSessions(filter?: SessionFilter): Promise<ExecutionSession[]>;
  createArtifact(artifact: Artifact): Promise<void>;
  getArtifact(artifactId: string): Promise<Artifact | null>;
  deleteArtifact(artifactId: string): Promise<void>;
  listArtifacts(filter?: ArtifactFilter): Promise<Artifact[]>;
  recordMetric(metric: Metric): Promise<void>;
  getMetrics(sessionId: string): Promise<Metric[]>;
  cleanupExpiredArtifacts(olderThan: Date): Promise<number>;
}

export interface Migration {
  version: string;
  name: string;
  up: (storage: StorageAdapter) => Promise<void>;
  down: (storage: StorageAdapter) => Promise<void>;
}

export const DatabaseConfigSchema = z.object({
  type: z.enum(['file', 'sqlite', 'postgresql']),
  path: z.string().optional(),
  connectionString: z.string().optional(),
  poolSize: z.number().int().positive(),
  timeout: z.number().int().positive()
});
