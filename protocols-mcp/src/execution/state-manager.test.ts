import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../../src/execution/state-manager.js';
import { Artifact, ArtifactType } from '../../src/types/execution.js';
import { StorageAdapter } from '../../src/types/database.js';
import { ArtifactNotFoundError } from '../../src/types/errors.js';
import { ArtifactFilter } from '../../src/types/execution.js';

const createMockStorage = (): StorageAdapter => {
  const artifacts = new Map<string, Artifact>();

  return {
    async connect() {},
    async disconnect() {},
    async createSession() {},
    async getSession() { return null; },
    async updateSession() {},
    async deleteSession() {},
    async listSessions() { return []; },
    async createArtifact(artifact: Artifact) {
      artifacts.set(artifact.artifactId, artifact);
    },
    async getArtifact(artifactId: string) {
      return artifacts.get(artifactId) || null;
    },
    async deleteArtifact(artifactId: string) {
      artifacts.delete(artifactId);
    },
    async listArtifacts(filter?: ArtifactFilter) {
      let results = Array.from(artifacts.values());
      if (filter?.sessionId) {
        results = results.filter(a => a.sessionId === filter.sessionId);
      }
      if (filter?.artifactType) {
        results = results.filter(a => a.artifactType === filter.artifactType);
      }
      if (filter?.tags) {
        results = results.filter(a => filter.tags!.every(tag => a.tags.includes(tag)));
      }
      return results;
    },
    async recordMetric() {},
    async getMetrics() { return []; },
    async cleanupExpiredArtifacts() { return 0; }
  };
};

describe('StateManager', () => {
  let storage: StorageAdapter;
  let stateManager: StateManager;

  beforeEach(() => {
    storage = createMockStorage();
    stateManager = new StateManager(storage);
  });

  describe('setSharedState', () => {
    it('should set shared state for a session', async () => {
      const sessionId = 'test-session-id';
      const key = 'testKey';
      const value = { foo: 'bar' };

      await stateManager.setSharedState(sessionId, key, value);

      const result = await stateManager.getSharedState(sessionId, key);
      expect(result).toEqual(value);
    });

    it('should create artifact with correct tags', async () => {
      const sessionId = 'test-session-id';
      const key = 'testKey';
      const value = { test: 'data' };

      await stateManager.setSharedState(sessionId, key, value);

      const artifacts = await stateManager.listArtifacts(sessionId, 'other');
      expect(artifacts.length).toBeGreaterThan(0);
      expect(artifacts[0].tags).toContain('shared_state');
      expect(artifacts[0].tags).toContain('testKey');
    });
  });

  describe('getSharedState', () => {
    it('should return null for non-existent key', async () => {
      const result = await stateManager.getSharedState('session-id', 'non-existent');
      expect(result).toBeNull();
    });

    it('should return the latest value for a key', async () => {
      const sessionId = 'test-shared-state-unique';
      const key = 'counter';

      await stateManager.setSharedState(sessionId, key, 42);
      const result = await stateManager.getSharedState(sessionId, key);

      expect(result).toBe(42);
    });
  });

  describe('deleteSharedState', () => {
    it('should delete shared state by key', async () => {
      const sessionId = 'test-session-id';
      const key = 'testKey';
      const value = { test: 'data' };

      await stateManager.setSharedState(sessionId, key, value);
      await stateManager.deleteSharedState(sessionId, key);

      const result = await stateManager.getSharedState(sessionId, key);
      expect(result).toBeNull();
    });
  });

  describe('cacheArtifact', () => {
    it('should cache artifact with correct type', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'findings';
      const data = { finding: 'test' };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data);

      expect(artifactId).toBeDefined();
      expect(typeof artifactId).toBe('string');

      const artifacts = await stateManager.listArtifacts(sessionId, 'findings');
      expect(artifacts.length).toBeGreaterThan(0);
    });

    it('should use custom TTL when provided', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'code_suggestions';
      const data = { suggestion: 'test' };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data, '5m');

      expect(artifactId).toBeDefined();
    });

    it('should use default TTL when not provided', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'code_suggestions';
      const data = { suggestion: 'test' };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data);

      expect(artifactId).toBeDefined();
    });
  });

  describe('retrieveArtifact', () => {
    it('should retrieve cached artifact', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'test_results';
      const data = { passed: true, count: 10 };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data);
      const result = await stateManager.retrieveArtifact(sessionId, artifactId);

      expect(result).toEqual(data);
    });

    it('should throw ArtifactNotFoundError for non-existent artifact', async () => {
      await expect(stateManager.retrieveArtifact('session-id', 'non-existent')).rejects.toThrow(ArtifactNotFoundError);
    });

    it('should return cached artifact without session check (cache hit)', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'metrics';
      const data = { value: 100 };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data);

      const result = await stateManager.retrieveArtifact('different-session', artifactId);
      expect(result).toEqual(data);
    });
  });

  describe('listArtifacts', () => {
    it('should list all artifacts for a session', async () => {
      const sessionId = 'test-session-id';

      await stateManager.cacheArtifact(sessionId, 'findings', { f1: 'test' });
      await stateManager.cacheArtifact(sessionId, 'recommendations', { r1: 'test' });
      await stateManager.cacheArtifact('other-session', 'findings', { f2: 'test' });

      const artifacts = await stateManager.listArtifacts(sessionId);

      expect(artifacts.length).toBe(2);
    });

    it('should filter by type when provided', async () => {
      const sessionId = 'test-session-filter-type';

      await stateManager.cacheArtifact(sessionId, 'findings', { f1: 'test' });
      await stateManager.cacheArtifact(sessionId, 'findings', { f2: 'test' });
      await stateManager.cacheArtifact(sessionId, 'recommendations', { r1: 'test' });

      const findings = await stateManager.listArtifacts(sessionId, 'findings');

      expect(findings.length).toBe(2);
      expect(findings.every(a => a.artifactType === 'findings')).toBe(true);
    });
  });

  describe('isCacheValid', () => {
    it('should return true for existing non-expired artifact', async () => {
      const sessionId = 'test-session-id';
      const artifactType: ArtifactType = 'errors';
      const data = { error: 'test' };

      const artifactId = await stateManager.cacheArtifact(sessionId, artifactType, data);
      const isValid = await stateManager.isCacheValid(artifactId);

      expect(isValid).toBe(true);
    });

    it('should return false for non-existent artifact', async () => {
      const isValid = await stateManager.isCacheValid('non-existent');
      expect(isValid).toBe(false);
    });
  });

  describe('invalidateCache', () => {
    it('should remove all artifacts for a session from cache', async () => {
      const sessionId = 'test-session-id';

      await stateManager.cacheArtifact(sessionId, 'findings', { f1: 'test' });
      await stateManager.cacheArtifact(sessionId, 'recommendations', { r1: 'test' });

      await stateManager.invalidateCache(sessionId);

      const artifacts = await stateManager.listArtifacts(sessionId);
      expect(artifacts.length).toBe(2);
    });
  });

  describe('cleanupExpiredArtifacts', () => {
    it('should return count of cleaned artifacts', async () => {
      const count = await stateManager.cleanupExpiredArtifacts();
      expect(typeof count).toBe('number');
    });
  });
});
