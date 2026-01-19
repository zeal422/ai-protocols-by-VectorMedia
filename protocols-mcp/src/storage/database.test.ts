import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileStorage, DatabaseManager } from '../../src/storage/database.js';
import { ExecutionSession, Artifact, Metric } from '../../src/types/execution.js';
import { ProjectContext, Language, Framework, ProjectType, TestFramework, PackageManager } from '../../src/types/project-context.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testStorageDir = path.join(__dirname, '..', '..', '.test-storage');

const cleanupTestStorage = (): void => {
  try {
    fs.rmSync(testStorageDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
};

const mockProjectContext: ProjectContext = {
  language: Language.TypeScript,
  framework: Framework.Express,
  projectType: ProjectType.Backend,
  testFramework: TestFramework.Jest,
  packageManager: PackageManager.NPM,
  hasDocker: false,
  hasCI: false,
  hasGit: true,
  dependencies: ['express'],
  devDependencies: ['jest'],
  detected: true
};

const generateUniqueId = (): string => uuidv4();

const createTestSession = (sessionId: string): ExecutionSession => ({
  sessionId,
  taskDescription: 'Test session',
  projectContext: mockProjectContext,
  executionStack: [],
  sharedContext: new Map(),
  artifacts: {},
  metrics: {
    sessionId,
    metrics: [],
    startTime: new Date()
  },
  checkpoints: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  metadata: {}
});

const createTestArtifact = (artifactId: string, sessionId: string): Artifact => ({
  artifactId,
  sessionId,
  protocolName: 'test',
  artifactType: 'findings',
  data: { test: 'data' },
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 3600000),
  size: 100,
  tags: ['test']
});

describe('FileStorage', () => {
  beforeEach(() => {
    cleanupTestStorage();
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  describe('Session CRUD', () => {
    it('should create and retrieve a session', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const sessionId = generateUniqueId();
      const session = createTestSession(sessionId);
      await storage.createSession(session);

      const retrieved = await storage.getSession(sessionId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.sessionId).toBe(sessionId);

      await storage.disconnect();
    });

    it('should return null for non-existent session', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const result = await storage.getSession('non-existent-session-id');
      expect(result).toBeNull();

      await storage.disconnect();
    });

    it('should update session status', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const sessionId = generateUniqueId();
      await storage.createSession(createTestSession(sessionId));
      await storage.updateSession(sessionId, { status: 'completed' });

      const retrieved = await storage.getSession(sessionId);
      expect(retrieved?.status).toBe('completed');

      await storage.disconnect();
    });

    it('should delete a session', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const sessionId = generateUniqueId();
      await storage.createSession(createTestSession(sessionId));
      await storage.deleteSession(sessionId);

      const result = await storage.getSession(sessionId);
      expect(result).toBeNull();

      await storage.disconnect();
    });
  });

  describe('Artifact CRUD', () => {
    it('should create and retrieve an artifact', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const artifactId = generateUniqueId();
      const sessionId = generateUniqueId();
      const artifact = createTestArtifact(artifactId, sessionId);
      await storage.createArtifact(artifact);

      const retrieved = await storage.getArtifact(artifactId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.artifactId).toBe(artifactId);

      await storage.disconnect();
    });

    it('should delete an artifact', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const artifactId = generateUniqueId();
      const sessionId = generateUniqueId();
      await storage.createArtifact(createTestArtifact(artifactId, sessionId));
      await storage.deleteArtifact(artifactId);

      const result = await storage.getArtifact(artifactId);
      expect(result).toBeNull();

      await storage.disconnect();
    });
  });

  describe('Metrics', () => {
    it('should record and retrieve metrics', async () => {
      const storage = new FileStorage();
      await storage.connect();

      const sessionId = generateUniqueId();
      const metric: Metric = {
        metricId: generateUniqueId(),
        sessionId,
        protocolName: 'test',
        metricType: 'execution_time',
        value: 100,
        unit: 'ms',
        timestamp: new Date()
      };

      await storage.recordMetric(metric);
      const metrics = await storage.getMetrics(sessionId);
      expect(metrics.length).toBe(1);
      expect(metrics[0].value).toBe(100);

      await storage.disconnect();
    });
  });
});

describe('DatabaseManager', () => {
  beforeEach(() => {
    cleanupTestStorage();
  });

  afterEach(() => {
    cleanupTestStorage();
  });

  it('should initialize and disconnect successfully', async () => {
    const dbManager = new DatabaseManager();
    await dbManager.initialize();
    await dbManager.disconnect();
  });

  it('should return StorageAdapter from getStorage', () => {
    const dbManager = new DatabaseManager();
    const storage = dbManager.getStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.connect).toBe('function');
    expect(typeof storage.createSession).toBe('function');
  });

  it('should return DatabaseConnection from getConnection', () => {
    const dbManager = new DatabaseManager();
    const connection = dbManager.getConnection();
    expect(connection).toBeDefined();
    expect(typeof connection.query).toBe('function');
    expect(typeof connection.execute).toBe('function');
    expect(typeof connection.close).toBe('function');
  });
});
