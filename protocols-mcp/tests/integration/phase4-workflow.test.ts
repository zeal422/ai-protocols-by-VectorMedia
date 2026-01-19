import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CheckpointSystem } from '../../src/resilience/checkpoint-system.js';
import { ParallelExecutionEngine, createMockWorkflowStep } from '../../src/resilience/parallel-engine.js';
import { MultiAgentOrchestrator } from '../../src/resilience/multi-agent-orchestration.js';
import { DependencyResolver } from '../../src/intelligence/dependency-resolver.js';
import { DatabaseManager } from '../../src/storage/database.js';
import { ExecutionSession, Checkpoint } from '../../src/types/execution.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager } from '../../src/types/project-context.js';
import { randomUUID } from 'crypto';

interface MockSessionData extends ExecutionSession {
  _checkpoints?: Checkpoint[];
}

function createMockSession(overrides: Partial<ExecutionSession> = {}): MockSessionData {
  const sessionId = overrides.sessionId || randomUUID();
  const session: MockSessionData = {
    sessionId,
    taskDescription: 'Test session',
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
    _checkpoints: [],
    ...overrides
  };
  return session;
}

describe('Phase 4: Resilience Integration Tests', () => {
  describe('Checkpoint & Resume Workflow', () => {
    let mockStorage: Record<string, vi.Mock>;
    let mockDb: DatabaseManager;
    let checkpointSystem: CheckpointSystem;
    let sessionStore: Map<string, MockSessionData>;

    beforeEach(() => {
      sessionStore = new Map();

      mockStorage = {
        connect: vi.fn().mockResolvedValue(undefined),
        disconnect: vi.fn().mockResolvedValue(undefined),
        createSession: vi.fn().mockImplementation(async (session: ExecutionSession) => {
          sessionStore.set(session.sessionId, session as MockSessionData);
        }),
        getSession: vi.fn().mockImplementation(async (sessionId: string) => {
          return sessionStore.get(sessionId) || null;
        }),
        updateSession: vi.fn().mockImplementation(async (sessionId: string, updates: Partial<ExecutionSession>) => {
          const session = sessionStore.get(sessionId);
          if (session) {
            Object.assign(session, updates);
            if (updates.checkpoints) {
              session._checkpoints = updates.checkpoints;
            }
          }
        }),
        deleteSession: vi.fn().mockResolvedValue(undefined),
        listSessions: vi.fn().mockImplementation(async (filter?: { status?: string; sessionId?: string }) => {
          const sessions = Array.from(sessionStore.values());
          if (filter?.status) {
            return sessions.filter(s => s.status === filter.status);
          }
          if (filter?.sessionId) {
            return sessions.filter(s => s.sessionId === filter.sessionId);
          }
          return sessions;
        }),
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
        maxCheckpointsPerSession: 10,
        checkpointRetentionDays: 7
      });
    });

    it('should create checkpoint, list it, and resume from it', async () => {
      const sessionId = 'test-session-123';
      const mockSession = createMockSession({ sessionId });
      sessionStore.set(sessionId, mockSession);

      const checkpointId = await checkpointSystem.createCheckpoint(mockSession, {
        checkpointType: 'manual',
        description: 'Integration test checkpoint'
      });

      expect(checkpointId).toBeDefined();
      expect(typeof checkpointId).toBe('string');

      const checkpoints = await checkpointSystem.listCheckpoints(sessionId);
      expect(checkpoints.length).toBe(1);
      expect(checkpoints[0].checkpointId).toBe(checkpointId);

      const checkpoint = await checkpointSystem.getCheckpointById(checkpointId);
      expect(checkpoint).toBeDefined();
      expect(checkpoint?.metadata.checkpointType).toBe('manual');

      const resumeResult = await checkpointSystem.resumeFromCheckpoint(checkpointId, sessionId);
      expect(resumeResult.status).toBe('active');
      expect(resumeResult.sessionId).toBe(sessionId);
    });

    it('should handle automatic checkpoints during error recovery', async () => {
      const sessionId = 'error-recovery-session';
      const mockSession = createMockSession({
        sessionId,
        projectContext: {
          language: Language.Python,
          framework: Framework.FastAPI,
          projectType: ProjectType.Backend,
          testFramework: TestFramework.Pytest,
          packageManager: PackageManager.PIP,
          hasDocker: true,
          hasCI: true,
          hasGit: true,
          dependencies: [],
          devDependencies: [],
          detected: true
        },
        status: 'failed'
      });
      sessionStore.set(sessionId, mockSession);

      const checkpointId = await checkpointSystem.createCheckpoint(mockSession, {
        checkpointType: 'error_recovery',
        description: 'Auto-checkpoint after error'
      });

      expect(checkpointId).toBeDefined();

      const checkpoint = await checkpointSystem.getCheckpointById(checkpointId);
      expect(checkpoint).toBeDefined();
      expect(checkpoint?.metadata.checkpointType).toBe('error_recovery');
    });
  });

  describe('Parallel Execution Workflow', () => {
    let mockDependencyResolver: DependencyResolver;
    let parallelEngine: ParallelExecutionEngine;

    beforeEach(() => {
      mockDependencyResolver = {
        getDependencies: vi.fn().mockResolvedValue([]),
        getDependents: vi.fn().mockResolvedValue([]),
        resolvePrerequisites: vi.fn().mockResolvedValue([]),
        validateChain: vi.fn().mockResolvedValue({ valid: true, issues: [] }),
        detectCircularDependencies: vi.fn().mockResolvedValue([]),
        buildExecutionGraph: vi.fn().mockResolvedValue({
          nodes: new Map(),
          edges: new Map(),
          topologicalSort: [],
          hasCycles: false
        }),
        getExecutionOrder: vi.fn().mockResolvedValue([]),
        shouldRunBefore: vi.fn().mockResolvedValue(true),
        getProtocolMetadata: vi.fn().mockReturnValue(undefined),
        getAllProtocolNames: vi.fn().mockReturnValue([])
      } as unknown as DependencyResolver;

      parallelEngine = new ParallelExecutionEngine(mockDependencyResolver, {
        defaultMaxParallel: 4,
        defaultConflictStrategy: 'abort'
      });
    });

    it('should plan and execute independent protocols in parallel', async () => {
      const workflows = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('test_automation_protocol'),
        createMockWorkflowStep('code_review_protocol')
      ];

      const plan = await parallelEngine.planParallelExecution(workflows, {
        maxParallel: 3,
        conflictStrategy: 'abort'
      });

      expect(plan.stages.length).toBeGreaterThan(0);
      expect(plan.maxParallel).toBe(3);

      const conflicts = await parallelEngine.detectConflicts(workflows);
      expect(Array.isArray(conflicts)).toBe(true);

      const session = createMockSession();
      const result = await parallelEngine.executeInParallel(plan.stages, session);
      expect(result.stageResults.size).toBeGreaterThan(0);
      expect(result.conflictsDetected.length).toBe(0);
    });

    it('should detect conflicts between protocols', async () => {
      const workflows = [
        createMockWorkflowStep('security_audit_protocol'),
        createMockWorkflowStep('refactor_protocol')
      ];

      mockDependencyResolver.getDependencies.mockImplementation((protocol: string) => {
        if (protocol === 'security_audit_protocol') {
          return Promise.resolve(['codebase_indexing_protocol']);
        }
        if (protocol === 'refactor_protocol') {
          return Promise.resolve(['security_audit_protocol']);
        }
        return Promise.resolve([]);
      });

      const conflicts = await parallelEngine.detectConflicts(workflows);
      expect(conflicts.length).toBeGreaterThan(0);

      const plan = await parallelEngine.planParallelExecution(workflows);
      expect(plan.stages.length).toBeGreaterThanOrEqual(2);
    });

    it('should merge results from parallel execution', async () => {
      const workflows = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('test_automation_protocol')
      ];

      await parallelEngine.planParallelExecution(workflows);

      const mockResults = [
        {
          protocolName: 'debug_protocol',
          executionTime: 1500,
          timestamp: new Date(),
          success: true,
          findings: [{ findingId: 'f1', severity: 'medium' as const, category: 'bug', title: 'Bug found', description: 'A bug was found' }],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'debug_protocol', executionTime: 1500, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
        },
        {
          protocolName: 'test_automation_protocol',
          executionTime: 2000,
          timestamp: new Date(),
          success: true,
          findings: [],
          recommendations: [{ recommendationId: 'r1', priority: 'high' as const, action: 'Fix issue', description: 'Should fix the bug' }],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'test_automation_protocol', executionTime: 2000, cacheHits: 1, cacheMisses: 0, cacheHitRate: 1, memoryUsage: 0, success: true }
        }
      ];

      const merged = await parallelEngine.mergeResults(mockResults);
      expect(merged.findings.length).toBe(1);
      expect(merged.recommendations.length).toBe(1);
      expect(merged.protocolsExecuted).toBe(2);
    });
  });

  describe('Multi-Agent Orchestration Workflow', () => {
    let mockDependencyResolver: DependencyResolver;
    let orchestrator: MultiAgentOrchestrator;

    beforeEach(() => {
      mockDependencyResolver = {
        getDependencies: vi.fn().mockResolvedValue([]),
        getDependents: vi.fn().mockResolvedValue([]),
        resolvePrerequisites: vi.fn().mockResolvedValue([]),
        validateChain: vi.fn().mockResolvedValue({ valid: true, issues: [] }),
        detectCircularDependencies: vi.fn().mockResolvedValue([]),
        buildExecutionGraph: vi.fn().mockResolvedValue({
          nodes: new Map(),
          edges: new Map(),
          topologicalSort: [],
          hasCycles: false
        }),
        getExecutionOrder: vi.fn().mockResolvedValue([]),
        shouldRunBefore: vi.fn().mockResolvedValue(true),
        getProtocolMetadata: vi.fn().mockReturnValue(undefined),
        getAllProtocolNames: vi.fn().mockReturnValue([])
      } as unknown as DependencyResolver;

      orchestrator = new MultiAgentOrchestrator(mockDependencyResolver, {
        defaultMaxAgents: 5,
        defaultFailoverEnabled: true,
        defaultLoadBalancingStrategy: 'capability-based'
      });
    });

    it('should register agents and assign protocols', async () => {
      const debugAgent = await orchestrator.registerAgent({
        name: 'Debug Specialist',
        role: 'specialist',
        capabilities: ['debug_protocol', 'error_fix_protocol'],
        metadata: { version: '1.0.0', provider: 'test', model: 'gpt-4' }
      });

      expect(debugAgent.id).toBeDefined();
      expect(debugAgent.status).toBe('available');

      const reviewAgent = await orchestrator.registerAgent({
        name: 'Code Reviewer',
        role: 'reviewer',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      expect(reviewAgent.id).toBeDefined();
      expect(reviewAgent.role).toBe('reviewer');

      const assignment = await orchestrator.assignProtocolToAgent('debug_protocol', [debugAgent]);
      expect(assignment).not.toBeNull();
      expect(assignment?.agent.id).toBe(debugAgent.id);
      expect(assignment?.protocol).toBe('debug_protocol');

      const agents = await orchestrator.listAgents();
      expect(agents.length).toBe(2);
    });

    it('should coordinate execution across multiple agents', async () => {
      const agent1 = await orchestrator.registerAgent({
        name: 'Agent 1',
        role: 'specialist',
        capabilities: ['debug_protocol', 'test_automation_protocol'],
        metadata: { version: '1.0.0' }
      });

      const agent2 = await orchestrator.registerAgent({
        name: 'Agent 2',
        role: 'specialist',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const workflows = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('code_review_protocol')
      ];

      const result = await orchestrator.coordinateExecution(workflows, [agent1.id, agent2.id]);

      expect(result.success).toBe(true);
      expect(result.assignments.length).toBe(2);
      expect(result.results.size).toBe(2);
      expect(result.failures.size).toBe(0);
    });

    it('should handle agent failures and reassign protocols', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Failing Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      agent.status = 'available';
      agent.currentProtocols = ['debug_protocol'];

      await orchestrator.handleAgentFailure(agent.id);

      const updatedAgent = await orchestrator.getAgentStatus(agent.id);
      expect(updatedAgent?.status).toBe('error');

      const removed = await orchestrator.removeAgent(agent.id);
      expect(removed).toBe(true);

      const afterRemove = await orchestrator.getAgentStatus(agent.id);
      expect(afterRemove).toBeNull();
    });

    it('should update agent metadata', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Updatable Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      const updated = await orchestrator.updateAgentMetadata(agent.id, {
        version: '2.0.0',
        model: 'gpt-4-turbo'
      });

      expect(updated).toBe(true);

      const retrieved = await orchestrator.getAgentStatus(agent.id);
      expect(retrieved?.metadata.version).toBe('2.0.0');
      expect(retrieved?.metadata.model).toBe('gpt-4-turbo');
    });
  });

  describe('End-to-End Resilience Workflow', () => {
    it('should complete full workflow: checkpoint, parallel execution, multi-agent coordination', async () => {
      const sessionId = 'e2e-test-session';
      const sessionStore = new Map<string, MockSessionData>();

      const mockStorage = {
        connect: vi.fn().mockResolvedValue(undefined),
        disconnect: vi.fn().mockResolvedValue(undefined),
        createSession: vi.fn().mockImplementation(async (session: ExecutionSession) => {
          sessionStore.set(session.sessionId, session as MockSessionData);
        }),
        getSession: vi.fn().mockImplementation(async (sessionId: string) => {
          return sessionStore.get(sessionId) || null;
        }),
        updateSession: vi.fn().mockImplementation(async (sessionId: string, updates: Partial<ExecutionSession>) => {
          const session = sessionStore.get(sessionId);
          if (session) {
            Object.assign(session, updates);
          }
        }),
        deleteSession: vi.fn().mockResolvedValue(undefined),
        listSessions: vi.fn().mockImplementation(async () => {
          return Array.from(sessionStore.values());
        }),
        createArtifact: vi.fn().mockResolvedValue(undefined),
        getArtifact: vi.fn().mockResolvedValue(null),
        deleteArtifact: vi.fn().mockResolvedValue(undefined),
        listArtifacts: vi.fn().mockResolvedValue([]),
        recordMetric: vi.fn().mockResolvedValue(undefined),
        getMetrics: vi.fn().mockResolvedValue([]),
        cleanupExpiredArtifacts: vi.fn().mockResolvedValue(0)
      };

      const mockDb = {
        getStorage: () => mockStorage
      } as unknown as DatabaseManager;

      const checkpointSystem = new CheckpointSystem(mockDb, {
        maxCheckpointsPerSession: 10,
        checkpointRetentionDays: 7
      });

      const mockDependencyResolver = {
        getDependencies: vi.fn().mockResolvedValue([]),
        getDependents: vi.fn().mockResolvedValue([]),
        resolvePrerequisites: vi.fn().mockResolvedValue([]),
        validateChain: vi.fn().mockResolvedValue({ valid: true, issues: [] }),
        detectCircularDependencies: vi.fn().mockResolvedValue([]),
        buildExecutionGraph: vi.fn().mockResolvedValue({
          nodes: new Map(),
          edges: new Map(),
          topologicalSort: [],
          hasCycles: false
        }),
        getExecutionOrder: vi.fn().mockResolvedValue([]),
        shouldRunBefore: vi.fn().mockResolvedValue(true),
        getProtocolMetadata: vi.fn().mockReturnValue(undefined),
        getAllProtocolNames: vi.fn().mockReturnValue([])
      } as unknown as DependencyResolver;

      const parallelEngine = new ParallelExecutionEngine(mockDependencyResolver, {
        defaultMaxParallel: 4,
        defaultConflictStrategy: 'abort'
      });

      const orchestrator = new MultiAgentOrchestrator(mockDependencyResolver, {
        defaultMaxAgents: 5,
        defaultFailoverEnabled: true,
        defaultLoadBalancingStrategy: 'capability-based'
      });

      const mockSession = createMockSession({ sessionId });
      sessionStore.set(sessionId, mockSession);

      const checkpointId = await checkpointSystem.createCheckpoint(mockSession, {
        checkpointType: 'manual',
        description: 'E2E test checkpoint before parallel execution'
      });

      expect(checkpointId).toBeDefined();

      const agent = await orchestrator.registerAgent({
        name: 'E2E Agent',
        role: 'specialist',
        capabilities: ['debug_protocol', 'test_automation_protocol'],
        metadata: { version: '1.0.0' }
      });

      expect(agent.id).toBeDefined();

      const workflows = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('test_automation_protocol')
      ];

      const plan = await parallelEngine.planParallelExecution(workflows);
      expect(plan.stages.length).toBeGreaterThan(0);

      const assignment = await orchestrator.assignProtocolToAgent('debug_protocol', [agent]);
      expect(assignment).not.toBeNull();

      const result = await orchestrator.coordinateExecution(workflows, [agent.id]);
      expect(result.success).toBe(true);

      const resumeResult = await checkpointSystem.resumeFromCheckpoint(checkpointId, sessionId);
      expect(resumeResult.status).toBe('active');
    });
  });
});
