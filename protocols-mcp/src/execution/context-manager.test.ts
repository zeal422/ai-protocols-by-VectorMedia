import { describe, it, expect, beforeEach } from 'vitest';
import { SessionManager } from '../../src/execution/context-manager.js';
import { ExecutionSession, Artifact, Metric, SessionFilter } from '../../src/types/execution.js';
import { ProjectContext, Language, Framework, ProjectType, TestFramework, PackageManager } from '../../src/types/project-context.js';
import { StorageAdapter } from '../../src/types/database.js';
import { SessionNotFoundError, ProtocolError } from '../../src/types/errors.js';

const mockProjectContext: ProjectContext = {
  language: Language.TypeScript,
  framework: Framework.Express,
  projectType: ProjectType.Backend,
  testFramework: TestFramework.Jest,
  packageManager: PackageManager.NPM,
  hasDocker: false,
  hasCI: false,
  hasGit: true,
  dependencies: ['express', 'zod'],
  devDependencies: ['jest', 'typescript'],
  detected: true
};

const createMockStorage = (): StorageAdapter => {
  const sessions = new Map<string, ExecutionSession>();
  const artifacts = new Map<string, Artifact>();
  const metrics = new Map<string, Metric[]>();

  return {
    async connect() {},
    async disconnect() {},
    async createSession(session: ExecutionSession) {
      sessions.set(session.sessionId, session);
    },
    async getSession(sessionId: string) {
      return sessions.get(sessionId) || null;
    },
    async updateSession(sessionId: string, updates: Partial<ExecutionSession>) {
      const session = sessions.get(sessionId);
      if (session) {
        sessions.set(sessionId, { ...session, ...updates, updatedAt: new Date() } as ExecutionSession);
      }
    },
    async deleteSession(sessionId: string) {
      sessions.delete(sessionId);
    },
    async listSessions(filter?: SessionFilter) {
      let results = Array.from(sessions.values());
      if (filter?.status) {
        results = results.filter(s => s.status === filter.status);
      }
      return results;
    },
    async createArtifact(artifact: Artifact) {
      artifacts.set(artifact.artifactId, artifact);
    },
    async getArtifact(artifactId: string) {
      return artifacts.get(artifactId) || null;
    },
    async deleteArtifact(artifactId: string) {
      artifacts.delete(artifactId);
    },
    async listArtifacts() {
      return Array.from(artifacts.values());
    },
    async recordMetric(metric: Metric) {
      const sessionMetrics = metrics.get(metric.sessionId) || [];
      sessionMetrics.push(metric);
      metrics.set(metric.sessionId, sessionMetrics);
    },
    async getMetrics(sessionId: string) {
      return metrics.get(sessionId) || [];
    },
    async cleanupExpiredArtifacts() {
      return 0;
    }
  };
};

describe('SessionManager', () => {
  let storage: StorageAdapter;
  let sessionManager: SessionManager;

  beforeEach(() => {
    storage = createMockStorage();
    sessionManager = new SessionManager(storage);
  });

  describe('createSession', () => {
    it('should create a new session and return sessionId', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should create session with correct properties', async () => {
      const taskDescription = 'Test task';
      const metadata = { userId: 'user123', aiTool: 'cursor' };
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext, metadata);

      const session = await sessionManager.getSession(sessionId);

      expect(session.sessionId).toBe(sessionId);
      expect(session.taskDescription).toBe(taskDescription);
      expect(session.projectContext).toEqual(mockProjectContext);
      expect(session.status).toBe('active');
      expect(session.metadata).toEqual(metadata);
      expect(session.executionStack).toEqual([]);
      expect(session.sharedContext).toBeInstanceOf(Map);
      expect(session.artifacts).toEqual({});
      expect(session.checkpoints).toEqual([]);
    });
  });

  describe('getSession', () => {
    it('should retrieve an existing session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      const session = await sessionManager.getSession(sessionId);

      expect(session).toBeDefined();
      expect(session?.sessionId).toBe(sessionId);
    });

    it('should throw SessionNotFoundError for non-existent session', async () => {
      await expect(sessionManager.getSession('non-existent-id')).rejects.toThrow(SessionNotFoundError);
    });

    it('should cache sessions', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      await sessionManager.getSession(sessionId);
      const session2 = await sessionManager.getSession(sessionId);

      expect(session2).toBeDefined();
      expect(session2?.sessionId).toBe(sessionId);
    });
  });

  describe('updateSession', () => {
    it('should update session properties', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      await sessionManager.updateSession(sessionId, { status: 'paused' });

      const session = await sessionManager.getSession(sessionId);
      expect(session.status).toBe('paused');
    });
  });

  describe('pauseSession', () => {
    it('should pause an active session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      await sessionManager.pauseSession(sessionId);

      const session = await sessionManager.getSession(sessionId);
      expect(session.status).toBe('paused');
    });
  });

  describe('resumeSession', () => {
    it('should resume a paused session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);
      await sessionManager.pauseSession(sessionId);

      await sessionManager.resumeSession(sessionId);

      const session = await sessionManager.getSession(sessionId);
      expect(session.status).toBe('active');
    });

    it('should throw error when resuming non-paused session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      await expect(sessionManager.resumeSession(sessionId)).rejects.toThrow(ProtocolError);
    });
  });

  describe('closeSession', () => {
    it('should close session and return SessionResult', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      const result = await sessionManager.closeSession(sessionId);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(sessionId);
      expect(result.taskDescription).toBe(taskDescription);
      expect(result.status).toBe('completed');
      expect(result.protocolsExecuted).toBe(0);
    });

    it('should throw error when closing already closed session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);
      await sessionManager.closeSession(sessionId);

      await expect(sessionManager.closeSession(sessionId)).rejects.toThrow(ProtocolError);
    });
  });

  describe('deleteSession', () => {
    it('should delete a completed session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);
      await sessionManager.closeSession(sessionId);

      await sessionManager.deleteSession(sessionId);

      await expect(sessionManager.getSession(sessionId)).rejects.toThrow(SessionNotFoundError);
    });

    it('should throw error when deleting active session', async () => {
      const taskDescription = 'Test task';
      const sessionId = await sessionManager.createSession(taskDescription, mockProjectContext);

      await expect(sessionManager.deleteSession(sessionId)).rejects.toThrow(ProtocolError);
    });
  });

  describe('listActiveSessions', () => {
    it('should list only active sessions', async () => {
      const _sessionId1 = await sessionManager.createSession('Task 1', mockProjectContext);
      const _sessionId2 = await sessionManager.createSession('Task 2', mockProjectContext);

      const sessions = await sessionManager.listActiveSessions();

      expect(sessions.length).toBe(2);
      expect(sessions.every(s => s.status === 'active')).toBe(true);
    });

    it('should not include paused sessions', async () => {
      const _sessionId1 = await sessionManager.createSession('Task 1', mockProjectContext);
      const sessionId2 = await sessionManager.createSession('Task 2', mockProjectContext);
      await sessionManager.pauseSession(sessionId2);

      const sessions = await sessionManager.listActiveSessions();

      expect(sessions.length).toBe(1);
      expect(sessions[0].sessionId).toBe(_sessionId1);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should return 0 when no sessions to cleanup', async () => {
      const taskDescription = 'Test task';
      await sessionManager.createSession(taskDescription, mockProjectContext);

      const count = await sessionManager.cleanupExpiredSessions(new Date());

      expect(count).toBe(0);
    });
  });
});
