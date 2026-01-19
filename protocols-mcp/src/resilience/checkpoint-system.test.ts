import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from 'vitest';
import { CheckpointSystem, createMockExecutionSession, createMockProtocolExecution } from './checkpoint-system.js';
import { DatabaseManager } from '../storage/database.js';
import { ExecutionSession, Checkpoint } from '../types/execution.js';
import { StorageAdapter } from '../types/database.js';

describe('CheckpointSystem', () => {
  let checkpointSystem: CheckpointSystem;
  let mockDb: DatabaseManager;
  let mockStorage: StorageAdapter & {
    getSession: MockInstance<(sessionId: string) => Promise<ExecutionSession | null>>;
    updateSession: MockInstance<(sessionId: string, updates: Partial<ExecutionSession>) => Promise<void>>;
    listSessions: MockInstance<(filter?: { status?: string; sessionId?: string }) => Promise<ExecutionSession[]>>;
  };

  beforeEach(() => {
    mockStorage = {
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined),
      createSession: vi.fn().mockResolvedValue(undefined),
      getSession: vi.fn().mockResolvedValue(null),
      updateSession: vi.fn().mockResolvedValue(undefined),
      deleteSession: vi.fn().mockResolvedValue(undefined),
      listSessions: vi.fn().mockResolvedValue([]),
      createArtifact: vi.fn().mockResolvedValue(undefined),
      getArtifact: vi.fn().mockResolvedValue(null),
      deleteArtifact: vi.fn().mockResolvedValue(undefined),
      listArtifacts: vi.fn().mockResolvedValue([]),
      recordMetric: vi.fn().mockResolvedValue(undefined),
      getMetrics: vi.fn().mockResolvedValue([]),
      cleanupExpiredArtifacts: vi.fn().mockResolvedValue(0)
    };

    mockDb = {
      getStorage: () => mockStorage
    } as unknown as DatabaseManager;

    checkpointSystem = new CheckpointSystem(mockDb, {
      maxCheckpointsPerSession: 5,
      checkpointRetentionDays: 7
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createCheckpoint', () => {
    it('should create a checkpoint with auto type by default', async () => {
      const session = createMockExecutionSession();
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session);

      expect(checkpointId).toBeDefined();
      expect(typeof checkpointId).toBe('string');
      expect(mockStorage.updateSession).toHaveBeenCalled();
    });

    it('should create a checkpoint with manual type when specified', async () => {
      const session = createMockExecutionSession();
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session, {
        checkpointType: 'manual',
        description: 'Manual backup before risky operation'
      });

      expect(checkpointId).toBeDefined();
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          status: 'paused'
        })
      );
    });

    it('should preserve execution stack in checkpoint', async () => {
      const session = createMockExecutionSession({
        executionStack: [
          createMockProtocolExecution('protocol1'),
          createMockProtocolExecution('protocol2')
        ]
      });
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session);

      expect(checkpointId).toBeDefined();
      expect(typeof checkpointId).toBe('string');
      expect(mockStorage.updateSession).toHaveBeenCalled();
    });

    it('should create a checkpoint with manual type when specified (duplicate)', async () => {
      const session = createMockExecutionSession();
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session, {
        checkpointType: 'manual',
        description: 'Manual backup before risky operation'
      });

      expect(checkpointId).toBeDefined();
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          status: 'paused'
        })
      );
    });

    it('should preserve execution stack in checkpoint (duplicate)', async () => {
      const session = createMockExecutionSession({
        executionStack: [
          createMockProtocolExecution('protocol1'),
          createMockProtocolExecution('protocol2')
        ]
      });
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session);

      expect(checkpointId).toBeDefined();
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          checkpoints: expect.arrayContaining([
            expect.objectContaining({
              executionStack: expect.arrayContaining([
                expect.objectContaining({ protocolName: 'protocol1' }),
                expect.objectContaining({ protocolName: 'protocol2' })
              ])
            })
          ])
        })
      );
    });

    it('should preserve shared context in checkpoint', async () => {
      const session = createMockExecutionSession();
      session.sharedContext.set('key1', 'value1');
      session.sharedContext.set('key2', { nested: 'value' });
      mockStorage.getSession.mockResolvedValue(session);

      const checkpointId = await checkpointSystem.createCheckpoint(session);

      expect(checkpointId).toBeDefined();
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          checkpoints: expect.arrayContaining([
            expect.objectContaining({
              sharedContext: expect.any(Map)
            })
          ])
        })
      );
    });

    it('should limit checkpoints to maxPerSession', async () => {
      const session = createMockExecutionSession();
      const existingCheckpoints: Checkpoint[] = Array.from({ length: 5 }, (_, i) => ({
        checkpointId: `existing-${i}`,
        sessionId: session.sessionId,
        protocolName: 'test',
        timestamp: new Date(),
        executionStack: [],
        sharedContext: new Map(),
        metadata: { checkpointType: 'automatic' as const, protocolCount: 0 }
      }));
      session.checkpoints = existingCheckpoints;
      mockStorage.getSession.mockResolvedValue(session);

      await checkpointSystem.createCheckpoint(session);

      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          checkpoints: expect.arrayContaining([
            expect.objectContaining({ checkpointId: 'existing-1' }),
            expect.objectContaining({ checkpointId: 'existing-2' }),
            expect.objectContaining({ checkpointId: 'existing-3' }),
            expect.objectContaining({ checkpointId: 'existing-4' })
          ])
        })
      );
    });

    it('should throw error if session not found', async () => {
      mockStorage.getSession.mockResolvedValue(null);

      await expect(checkpointSystem.createCheckpoint(createMockExecutionSession())).rejects.toThrow(
        'Session not found'
      );
    });
  });

  describe('listCheckpoints', () => {
    it('should return empty array for non-existent session', async () => {
      mockStorage.getSession.mockResolvedValue(null);

      const checkpoints = await checkpointSystem.listCheckpoints('non-existent');

      expect(checkpoints).toEqual([]);
    });

    it('should return all checkpoints for a session', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          {
            checkpointId: 'cp-1',
            sessionId: 'session-1',
            protocolName: 'protocol1',
            timestamp: new Date('2024-01-01'),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'manual' as const, protocolCount: 1 }
          },
          {
            checkpointId: 'cp-2',
            sessionId: 'session-1',
            protocolName: 'protocol2',
            timestamp: new Date('2024-01-02'),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'automatic' as const, protocolCount: 2 }
          }
        ]
      });
      mockStorage.getSession.mockResolvedValue(session);

      const checkpoints = await checkpointSystem.listCheckpoints('session-1');

      expect(checkpoints).toHaveLength(2);
      expect(checkpoints[0].checkpointId).toBe('cp-1');
      expect(checkpoints[1].checkpointId).toBe('cp-2');
    });
  });

  describe('resumeFromCheckpoint', () => {
    it('should restore session state from checkpoint', async () => {
      const session = createMockExecutionSession({
        executionStack: [
          createMockProtocolExecution('old-protocol')
        ],
        status: 'completed'
      });
      const checkpoint: Checkpoint = {
        checkpointId: 'cp-1',
        sessionId: session.sessionId,
        protocolName: 'old-protocol',
        timestamp: new Date(),
        executionStack: [
          createMockProtocolExecution('new-protocol')
        ],
        sharedContext: new Map([['restored-key', 'restored-value']]),
        metadata: { checkpointType: 'manual' as const, protocolCount: 1 }
      };
      session.checkpoints = [checkpoint];
      mockStorage.getSession.mockResolvedValue(session);
      mockStorage.listSessions.mockResolvedValue([session]);

      const restoredSession = await checkpointSystem.resumeFromCheckpoint('cp-1');

      expect(restoredSession.status).toBe('active');
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          status: 'active'
        })
      );
    });

    it('should throw error if checkpoint not found', async () => {
      mockStorage.listSessions.mockResolvedValue([]);

      await expect(checkpointSystem.resumeFromCheckpoint('non-existent')).rejects.toThrow(
        'Checkpoint not found'
      );
    });
  });

  describe('deleteCheckpoint', () => {
    it('should remove checkpoint from session', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          {
            checkpointId: 'cp-1',
            sessionId: 'session-1',
            protocolName: 'protocol1',
            timestamp: new Date(),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'manual' as const, protocolCount: 1 }
          },
          {
            checkpointId: 'cp-2',
            sessionId: 'session-1',
            protocolName: 'protocol2',
            timestamp: new Date(),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'automatic' as const, protocolCount: 2 }
          }
        ]
      });
      mockStorage.listSessions.mockResolvedValue([session]);

      await checkpointSystem.deleteCheckpoint('cp-1');

      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          checkpoints: expect.arrayContaining([
            expect.objectContaining({ checkpointId: 'cp-2' })
          ])
        })
      );
    });

    it('should throw error if checkpoint not found', async () => {
      mockStorage.listSessions.mockResolvedValue([]);

      await expect(checkpointSystem.deleteCheckpoint('non-existent')).rejects.toThrow(
        'Checkpoint not found'
      );
    });
  });

  describe('cleanupCheckpoints', () => {
    it('should remove checkpoints older than specified date', async () => {
      const oldCheckpoint: Checkpoint = {
        checkpointId: 'old-cp',
        sessionId: 'session-1',
        protocolName: 'old-protocol',
        timestamp: new Date('2023-01-01'),
        executionStack: [],
        sharedContext: new Map(),
        metadata: { checkpointType: 'automatic' as const, protocolCount: 1 }
      };
      const newCheckpoint: Checkpoint = {
        checkpointId: 'new-cp',
        sessionId: 'session-1',
        protocolName: 'new-protocol',
        timestamp: new Date('2024-01-01'),
        executionStack: [],
        sharedContext: new Map(),
        metadata: { checkpointType: 'automatic' as const, protocolCount: 2 }
      };
      const session = createMockExecutionSession({
        checkpoints: [oldCheckpoint, newCheckpoint]
      });
      mockStorage.listSessions.mockResolvedValue([session]);

      const deletedCount = await checkpointSystem.cleanupCheckpoints(
        new Date('2023-06-01')
      );

      expect(deletedCount).toBe(1);
      expect(mockStorage.updateSession).toHaveBeenCalledWith(
        session.sessionId,
        expect.objectContaining({
          checkpoints: expect.arrayContaining([
            expect.objectContaining({ checkpointId: 'new-cp' })
          ])
        })
      );
    });

    it('should return 0 if no checkpoints to delete', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          {
            checkpointId: 'new-cp',
            sessionId: 'session-1',
            protocolName: 'new-protocol',
            timestamp: new Date('2024-01-01'),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'automatic' as const, protocolCount: 1 }
          }
        ]
      });
      mockStorage.listSessions.mockResolvedValue([session]);

      const deletedCount = await checkpointSystem.cleanupCheckpoints(
        new Date('2023-01-01')
      );

      expect(deletedCount).toBe(0);
      expect(mockStorage.updateSession).not.toHaveBeenCalled();
    });
  });

  describe('validateCheckpoint', () => {
    it('should return true for valid checkpoint', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          {
            checkpointId: 'valid-cp',
            sessionId: 'session-1',
            protocolName: 'protocol1',
            timestamp: new Date(),
            executionStack: [
              createMockProtocolExecution('protocol1')
            ],
            sharedContext: new Map(),
            metadata: { checkpointType: 'automatic' as const, protocolCount: 1 }
          }
        ]
      });
      mockStorage.listSessions.mockResolvedValue([session]);

      const isValid = await checkpointSystem.validateCheckpoint('valid-cp');

      expect(isValid).toBe(true);
    });

    it('should return false for non-existent checkpoint', async () => {
      mockStorage.listSessions.mockResolvedValue([]);

      const isValid = await checkpointSystem.validateCheckpoint('non-existent');

      expect(isValid).toBe(false);
    });

    it('should return false if checkpoint has missing required fields', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          {
            checkpointId: '',
            sessionId: 'session-1',
            protocolName: 'protocol1',
            timestamp: new Date(),
            executionStack: [],
            sharedContext: new Map(),
            metadata: { checkpointType: 'automatic' as const, protocolCount: 0 }
          }
        ]
      });
      mockStorage.listSessions.mockResolvedValue([session]);

      const isValid = await checkpointSystem.validateCheckpoint('');

      expect(isValid).toBe(false);
    });
  });

  describe('getLatestCheckpoint', () => {
    it('should return the most recent checkpoint', async () => {
      const oldCheckpoint: Checkpoint = {
        checkpointId: 'old-cp',
        sessionId: 'session-1',
        protocolName: 'old-protocol',
        timestamp: new Date('2024-01-01'),
        executionStack: [],
        sharedContext: new Map(),
        metadata: { checkpointType: 'automatic' as const, protocolCount: 1 }
      };
      const newCheckpoint: Checkpoint = {
        checkpointId: 'new-cp',
        sessionId: 'session-1',
        protocolName: 'new-protocol',
        timestamp: new Date('2024-01-02'),
        executionStack: [],
        sharedContext: new Map(),
        metadata: { checkpointType: 'automatic' as const, protocolCount: 2 }
      };
      const session = createMockExecutionSession({
        checkpoints: [oldCheckpoint, newCheckpoint]
      });
      mockStorage.getSession.mockResolvedValue(session);

      const latest = await checkpointSystem.getLatestCheckpoint('session-1');

      expect(latest?.checkpointId).toBe('new-cp');
    });

    it('should return null for session with no checkpoints', async () => {
      const session = createMockExecutionSession();
      mockStorage.getSession.mockResolvedValue(session);

      const latest = await checkpointSystem.getLatestCheckpoint('session-1');

      expect(latest).toBeNull();
    });
  });

  describe('getCheckpointCount', () => {
    it('should return the number of checkpoints for a session', async () => {
      const session = createMockExecutionSession({
        checkpoints: [
          { checkpointId: 'cp-1', sessionId: 'session-1', protocolName: 'p1', timestamp: new Date(), executionStack: [], sharedContext: new Map(), metadata: { checkpointType: 'automatic' as const, protocolCount: 1 } },
          { checkpointId: 'cp-2', sessionId: 'session-1', protocolName: 'p2', timestamp: new Date(), executionStack: [], sharedContext: new Map(), metadata: { checkpointType: 'automatic' as const, protocolCount: 2 } },
          { checkpointId: 'cp-3', sessionId: 'session-1', protocolName: 'p3', timestamp: new Date(), executionStack: [], sharedContext: new Map(), metadata: { checkpointType: 'automatic' as const, protocolCount: 3 } }
        ]
      });
      mockStorage.getSession.mockResolvedValue(session);

      const count = await checkpointSystem.getCheckpointCount('session-1');

      expect(count).toBe(3);
    });

    it('should return 0 for non-existent session', async () => {
      mockStorage.getSession.mockResolvedValue(null);

      const count = await checkpointSystem.getCheckpointCount('non-existent');

      expect(count).toBe(0);
    });
  });
});
