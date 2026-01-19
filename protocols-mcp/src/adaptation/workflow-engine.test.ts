import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowEngine, Task, AdaptiveWorkflow } from './workflow-engine.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager, ProjectContext } from '../types/project-context.js';
import { ExtendedProtocolMetadata } from '../types/protocol-frontmatter.js';
import { Finding, StandardResult } from '../types/execution.js';

const createMockProtocol = (overrides: Partial<ExtendedProtocolMetadata> = {}): ExtendedProtocolMetadata => ({
  id: 'test-protocol',
  fileName: 'test-protocol.md',
  name: 'test_protocol',
  title: 'Test Protocol',
  triggers: ['TEST'],
  category: 'Testing',
  tags: ['test', 'validation'],
  difficulty: 'intermediate',
  purpose: 'Test protocol for unit testing',
  filePath: 'BRAIN/',
  version: '1.0.0',
  prerequisites: [],
  worksWellWith: [],
  platformTags: ['fullstack'],
  stackSpecific: {},
  hasFrontmatter: true,
  ...overrides
});

const createMockProjectContext = (overrides = {}): ProjectContext => ({
  language: Language.TypeScript,
  framework: Framework.Express,
  projectType: ProjectType.Backend,
  testFramework: TestFramework.Jest,
  packageManager: PackageManager.NPM,
  hasDocker: true,
  hasCI: true,
  hasGit: true,
  dependencies: ['express', 'typescript'],
  devDependencies: ['jest', 'eslint'],
  detected: true,
  ...overrides
});

const mockProtocols: ExtendedProtocolMetadata[] = [
  createMockProtocol({
    name: 'debug_protocol',
    tags: ['debug', 'troubleshooting'],
    prerequisites: [],
    worksWellWith: ['error_fix_protocol', 'test_automation_protocol']
  }),
  createMockProtocol({
    name: 'error_fix_protocol',
    tags: ['error', 'fix'],
    prerequisites: ['debug_protocol'],
    worksWellWith: ['test_automation_protocol']
  }),
  createMockProtocol({
    name: 'test_automation_protocol',
    tags: ['test', 'automation'],
    prerequisites: [],
    worksWellWith: ['code_review_protocol']
  }),
  createMockProtocol({
    name: 'code_review_protocol',
    tags: ['review', 'quality'],
    prerequisites: [],
    worksWellWith: []
  }),
  createMockProtocol({
    name: 'performance_protocol',
    tags: ['performance', 'optimization'],
    prerequisites: [],
    worksWellWith: []
  }),
  createMockProtocol({
    name: 'security_audit_protocol',
    tags: ['security', 'audit'],
    prerequisites: [],
    worksWellWith: []
  }),
  createMockProtocol({
    name: 'bigpappa_protocol_reviewANDfixes',
    tags: ['audit', 'comprehensive'],
    prerequisites: [],
    worksWellWith: []
  }),
  createMockProtocol({
    name: 'MDAP',
    tags: ['mdap', 'high-stakes'],
    prerequisites: [],
    worksWellWith: []
  }),
  createMockProtocol({
    name: 'MASTER_PROTOCOL',
    tags: ['master', 'orchestrator'],
    prerequisites: [],
    worksWellWith: []
  })
];

describe('WorkflowEngine', () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine(mockProtocols);
  });

  describe('buildAdaptiveWorkflow', () => {
    it('should build workflow for debug task type', () => {
      const task: Task = {
        description: 'Debug performance issue',
        type: 'debug',
        priority: 'high'
      };

      const workflow = engine.buildAdaptiveWorkflow(task, createMockProjectContext());

      expect(workflow.taskDescription).toBe('Debug performance issue');
      expect(workflow.initialProtocol).toBe('debug_protocol');
      expect(workflow.maxIterations).toBeGreaterThanOrEqual(5);
      expect(workflow.escalationThresholds.length).toBeGreaterThanOrEqual(1);
    });

    it('should build workflow for build task type', () => {
      const task: Task = {
        description: 'Create new feature',
        type: 'build',
        priority: 'medium'
      };

      const workflow = engine.buildAdaptiveWorkflow(task, createMockProjectContext());

      expect(workflow.initialProtocol).toBe('codebase_indexing_protocol');
      expect(workflow.branches.length).toBeGreaterThanOrEqual(1);
    });

    it('should build workflow for audit task type', () => {
      const task: Task = {
        description: 'Comprehensive code audit',
        type: 'audit',
        priority: 'high'
      };

      const workflow = engine.buildAdaptiveWorkflow(task, createMockProjectContext());

      expect(workflow.initialProtocol).toBe('bigpappa_protocol_reviewANDfixes');
      expect(workflow.fallbacks).toBeDefined();
    });

    it('should build workflow for optimize task type', () => {
      const task: Task = {
        description: 'Optimize database queries',
        type: 'optimize',
        priority: 'high'
      };

      const workflow = engine.buildAdaptiveWorkflow(task, createMockProjectContext());

      expect(workflow.initialProtocol).toBe('codebase_indexing_protocol');
    });

    it('should set higher maxIterations for critical priority', () => {
      const lowPriorityTask: Task = { description: 'Low priority', type: 'debug', priority: 'low' };
      const criticalPriorityTask: Task = { description: 'Critical', type: 'debug', priority: 'critical' };

      const lowWorkflow = engine.buildAdaptiveWorkflow(lowPriorityTask, createMockProjectContext());
      const criticalWorkflow = engine.buildAdaptiveWorkflow(criticalPriorityTask, createMockProjectContext());

      expect(criticalWorkflow.maxIterations).toBeGreaterThan(lowWorkflow.maxIterations);
    });

    it('should estimate time based on task type', () => {
      const debugTask: Task = { description: 'Debug', type: 'debug', priority: 'medium' };
      const refactorTask: Task = { description: 'Refactor', type: 'refactor', priority: 'medium' };

      const debugWorkflow = engine.buildAdaptiveWorkflow(debugTask, createMockProjectContext());
      const refactorWorkflow = engine.buildAdaptiveWorkflow(refactorTask, createMockProjectContext());

      expect(debugWorkflow.estimatedTime).toBeDefined();
      expect(refactorWorkflow.estimatedTime).toBeDefined();
    });

    it('should add frontend-specific branches for frontend projects', () => {
      const task: Task = { description: 'Frontend audit', type: 'audit', priority: 'medium' };
      const frontendContext = createMockProjectContext({ projectType: ProjectType.Frontend });

      const workflow = engine.buildAdaptiveWorkflow(task, frontendContext);

      const hasFrontendBranch = workflow.branches.some(b =>
        b.protocols.includes('moreFRONTend-PROTOCOL')
      );
      expect(hasFrontendBranch).toBe(true);
    });

    it('should add fullstack-specific branches for fullstack projects', () => {
      const task: Task = { description: 'Fullstack audit', type: 'audit', priority: 'medium' };
      const fullstackContext = createMockProjectContext({ projectType: ProjectType.Fullstack });

      const workflow = engine.buildAdaptiveWorkflow(task, fullstackContext);

      const hasFullstackBranch = workflow.branches.some(b =>
        b.protocols.includes('FRONTandBACKend-PROTOCOL')
      );
      expect(hasFullstackBranch).toBe(true);
    });

    it('should use unknown task type fallback', () => {
      const task: Task = { description: 'Unknown task', type: 'unknown', priority: 'low' };

      const workflow = engine.buildAdaptiveWorkflow(task, createMockProjectContext());

      expect(workflow.initialProtocol).toBe('MASTER_PROTOCOL');
    });
  });

  describe('executeStep', () => {
    it('should execute step and return decision', async () => {
      const session = { sessionId: 'test-session', executedProtocols: [] };

      const { result, decision } = await engine.executeStep(
        { protocolName: 'debug_protocol' },
        session
      );

      expect(result.protocolName).toBe('debug_protocol');
      expect(result.success).toBe(true);
      expect(decision.confidence).toBeGreaterThan(0);
      expect(decision.alternatives).toBeDefined();
    });

    it('should return empty result for unknown protocol', async () => {
      const session = { sessionId: 'test-session', executedProtocols: [] };

      const { result, decision } = await engine.executeStep(
        { protocolName: 'unknown_protocol' },
        session
      );

      expect(result.success).toBe(false);
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(decision.confidence).toBe(0);
    });

    it('should suggest prerequisites as next steps', async () => {
      mockProtocols.find(p => p.name === 'debug_protocol');
      const modifiedProtocols = mockProtocols.map(p =>
        p.name === 'debug_protocol'
          ? { ...p, prerequisites: ['codebase_indexing_protocol'] }
          : p
      );
      const engineWithPrereqs = new WorkflowEngine(modifiedProtocols);

      const session = { sessionId: 'test-session', executedProtocols: [] };

      const { result } = await engineWithPrereqs.executeStep(
        { protocolName: 'debug_protocol' },
        session
      );

      expect(result.nextSteps.length).toBeGreaterThan(0);
      expect(result.nextSteps[0].protocolName).toBe('codebase_indexing_protocol');
    });
  });

  describe('analyzeResultsAndAdapt', () => {
    it('should continue workflow when goal not reached', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug issue',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {},
        escalationThresholds: [],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [{ findingId: 'f1', severity: 'medium', category: 'performance', title: 'Slow query', description: 'Query is slow' }],
        recommendations: [],
        artifacts: [],
        nextSteps: [{ stepId: 's1', protocolName: 'error_fix_protocol', action: 'Fix error', reason: 'Recommendation', optional: false }],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const decision = await engine.analyzeResultsAndAdapt(result, workflow, ['debug_protocol']);

      expect(decision.nextProtocol).toBeDefined();
    });

    it('should escalate when multiple critical findings', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug issue',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {},
        escalationThresholds: [],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [
          { findingId: 'f1', severity: 'critical', category: 'security', title: 'SQL Injection', description: 'Vulnerability' },
          { findingId: 'f2', severity: 'critical', category: 'security', title: 'XSS', description: 'Vulnerability' },
          { findingId: 'f3', severity: 'critical', category: 'security', title: 'CSRF', description: 'Vulnerability' }
        ],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const decision = await engine.analyzeResultsAndAdapt(result, workflow, ['debug_protocol']);

      expect(decision.escalate).toBe(true);
      expect(decision.escalateTo).toBe('MDAP');
    });

    it('should handle errors and suggest fallback', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug issue',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {
          debug_protocol: ['error_fix_protocol', 'test_automation_protocol']
        },
        escalationThresholds: [],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: false,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: false },
        errors: [{ errorId: 'e1', errorType: 'TIMEOUT', message: 'Timeout', recoverable: true, timestamp: new Date() }]
      };

      const decision = await engine.analyzeResultsAndAdapt(result, workflow, []);

      expect(decision.nextProtocol).toBe('error_fix_protocol');
    });
  });

  describe('escalateIfNeeded', () => {
    it('should escalate when critical findings threshold met', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {},
        escalationThresholds: [
          { condition: 'criticalFindings >= 2', escalateTo: 'MDAP', reason: 'Multiple critical findings', requiresUserApproval: true }
        ],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const findings: Finding[] = [
        { findingId: 'f1', severity: 'critical', category: 'security', title: 'Issue 1', description: 'Critical' },
        { findingId: 'f2', severity: 'critical', category: 'security', title: 'Issue 2', description: 'Critical' }
      ];

      const result = await engine.escalateIfNeeded(findings, ['debug_protocol'], workflow);

      expect(result.shouldEscalate).toBe(true);
      expect(result.escalateTo).toBe('MDAP');
      expect(result.requiresApproval).toBe(true);
    });

    it('should not escalate when below threshold', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {},
        escalationThresholds: [
          { condition: 'criticalFindings >= 3', escalateTo: 'MDAP', reason: 'Multiple critical findings', requiresUserApproval: true }
        ],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const findings: Finding[] = [
        { findingId: 'f1', severity: 'critical', category: 'security', title: 'Issue 1', description: 'Critical' }
      ];

      const result = await engine.escalateIfNeeded(findings, ['debug_protocol'], workflow);

      expect(result.shouldEscalate).toBe(false);
    });

    it('should auto-escalate after 3+ critical findings even without explicit threshold', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Debug',
        initialProtocol: 'debug_protocol',
        branches: [],
        fallbacks: {},
        escalationThresholds: [],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const findings: Finding[] = [
        { findingId: 'f1', severity: 'critical', category: 'security', title: 'Issue 1', description: 'Critical' },
        { findingId: 'f2', severity: 'critical', category: 'security', title: 'Issue 2', description: 'Critical' },
        { findingId: 'f3', severity: 'critical', category: 'security', title: 'Issue 3', description: 'Critical' }
      ];

      const result = await engine.escalateIfNeeded(findings, ['debug_protocol'], workflow);

      expect(result.shouldEscalate).toBe(true);
    });
  });

  describe('selectNextProtocol', () => {
    it('should select protocol based on findings relevance', async () => {
      const findings: Finding[] = [
        { findingId: 'f1', severity: 'medium', category: 'performance', title: 'Slow query', description: 'Query performance issue' }
      ];

      const result = await engine.selectNextProtocol(
        findings,
        ['debug_protocol', 'performance_protocol', 'code_review_protocol'],
        [],
        createMockProjectContext()
      );

      expect(result.protocol).toBe('performance_protocol');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should skip already used protocols', async () => {
      const findings: Finding[] = [
        { findingId: 'f1', severity: 'medium', category: 'performance', title: 'Slow query', description: 'Query performance issue' }
      ];

      const result = await engine.selectNextProtocol(
        findings,
        ['debug_protocol', 'performance_protocol'],
        ['performance_protocol'],
        createMockProjectContext()
      );

      expect(result.protocol).not.toBe('performance_protocol');
    });

    it('should fallback to MASTER_PROTOCOL when no suitable protocol', async () => {
      const result = await engine.selectNextProtocol(
        [],
        ['unknown_protocol'],
        [],
        createMockProjectContext()
      );

      expect(result.protocol).toBe('MASTER_PROTOCOL');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should prefer protocols with high success metrics', async () => {
      engine.updateMetrics('debug_protocol', true, 500);
      engine.updateMetrics('performance_protocol', false, 3000);

      const findings: Finding[] = [];

      const result = await engine.selectNextProtocol(
        findings,
        ['debug_protocol', 'performance_protocol'],
        [],
        createMockProjectContext()
      );

      expect(result.protocol).toBe('debug_protocol');
    });
  });

  describe('isGoalReached', () => {
    it('should return true when no critical findings and no high priority recommendations', async () => {
      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [{ findingId: 'f1', severity: 'low', category: 'style', title: 'Style', description: 'Minor style issue' }],
        recommendations: [{ recommendationId: 'r1', priority: 'low', action: 'Fix style', description: 'Minor fix' }],
        artifacts: [],
        nextSteps: [{ stepId: 's1', action: 'Done', reason: 'Complete', optional: true }],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const task: Task = { description: 'Debug', type: 'debug', priority: 'medium' };

      const reached = await engine.isGoalReached(result, task);

      expect(reached).toBe(true);
    });

    it('should return false when critical findings present', async () => {
      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [{ findingId: 'f1', severity: 'critical', category: 'security', title: 'Critical', description: 'Critical issue' }],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const task: Task = { description: 'Debug', type: 'debug', priority: 'medium' };

      const reached = await engine.isGoalReached(result, task);

      expect(reached).toBe(false);
    });

    it('should return false when high priority recommendations present', async () => {
      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [{ recommendationId: 'r1', priority: 'high', action: 'Fix critical', description: 'Critical fix needed' }],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const task: Task = { description: 'Debug', type: 'debug', priority: 'medium' };

      const reached = await engine.isGoalReached(result, task);

      expect(reached).toBe(false);
    });

    it('should return false when execution failed', async () => {
      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: false,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: false }
      };

      const task: Task = { description: 'Debug', type: 'debug', priority: 'medium' };

      const reached = await engine.isGoalReached(result, task);

      expect(reached).toBe(false);
    });

    it('should return true when all next steps are optional', async () => {
      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [
          { stepId: 's1', action: 'Optional step 1', reason: 'Nice to have', optional: true },
          { stepId: 's2', action: 'Optional step 2', reason: 'Enhancement', optional: true }
        ],
        metrics: { protocolName: 'debug', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const task: Task = { description: 'Debug', type: 'debug', priority: 'medium' };

      const reached = await engine.isGoalReached(result, task);

      expect(reached).toBe(true);
    });
  });

  describe('updateMetrics', () => {
    it('should update success rate and execution time', () => {
      engine.updateMetrics('debug_protocol', true, 500);
      engine.updateMetrics('debug_protocol', true, 600);
      engine.updateMetrics('debug_protocol', false, 700);

      const metrics = (engine as unknown as { metricsCollector: Map<string, { successRate: number; avgExecutionTime: number }> }).metricsCollector.get('debug_protocol');

      expect(metrics).toBeDefined();
      expect(metrics!.successRate).toBeLessThan(1);
      expect(metrics!.avgExecutionTime).toBeGreaterThan(500);
    });
  });

  describe('complex branching scenarios', () => {
    it('should respect maxIterations limit', () => {
      const lowPriorityTask: Task = { description: 'Low priority', type: 'debug', priority: 'low' };
      const criticalPriorityTask: Task = { description: 'Critical', type: 'debug', priority: 'critical' };

      const lowWorkflow = engine.buildAdaptiveWorkflow(lowPriorityTask, createMockProjectContext());
      const criticalWorkflow = engine.buildAdaptiveWorkflow(criticalPriorityTask, createMockProjectContext());

      expect(criticalWorkflow.maxIterations).toBeGreaterThan(lowWorkflow.maxIterations);
      expect(criticalWorkflow.maxIterations).toBeLessThanOrEqual(10);
    });

    it('should skip branch if already run and skipIfAlreadyRun is true', async () => {
      const workflow: AdaptiveWorkflow = {
        taskDescription: 'Test',
        initialProtocol: 'test_protocol',
        branches: [
          { condition: 'findingsCount >= 1', protocols: ['code_review_protocol'], skipIfAlreadyRun: true }
        ],
        fallbacks: {},
        escalationThresholds: [],
        maxIterations: 5,
        estimatedTime: '30 minutes'
      };

      const result: StandardResult = {
        protocolName: 'test_protocol',
        executionTime: 1000,
        timestamp: new Date(),
        success: true,
        findings: [{ findingId: 'f1', severity: 'medium', category: 'test', title: 'Finding', description: 'Test finding' }],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: 1000, cacheHits: 0, cacheMisses: 1, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const decision = await engine.analyzeResultsAndAdapt(result, workflow, ['code_review_protocol']);

      expect(decision.nextProtocol).not.toBe('code_review_protocol');
    });

    it('should respect maxIterations limit', () => {
      const criticalTask: Task = { description: 'Critical task', type: 'debug', priority: 'critical' };
      const workflow = engine.buildAdaptiveWorkflow(criticalTask, createMockProjectContext());

      expect(workflow.maxIterations).toBeLessThanOrEqual(10);
      expect(workflow.maxIterations).toBeGreaterThanOrEqual(5);
    });
  });

  describe('edge cases', () => {
    it('should handle empty findings array', async () => {
      const result = await engine.selectNextProtocol(
        [],
        ['debug_protocol', 'code_review_protocol'],
        [],
        createMockProjectContext()
      );

      expect(result.protocol).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should handle when all protocols have been used', async () => {
      const result = await engine.selectNextProtocol(
        [{ findingId: 'f1', severity: 'medium', category: 'test', title: 'Test', description: 'Test finding' }],
        ['debug_protocol', 'code_review_protocol'],
        ['debug_protocol', 'code_review_protocol'],
        createMockProjectContext()
      );

      expect(result.protocol).toBe('MASTER_PROTOCOL');
    });

    it('should handle conflicting findings (security + performance)', async () => {
      const findings: Finding[] = [
        { findingId: 'f1', severity: 'critical', category: 'security', title: 'Security issue', description: 'Security vulnerability' },
        { findingId: 'f2', severity: 'high', category: 'performance', title: 'Perf issue', description: 'Performance problem' }
      ];

      const result = await engine.selectNextProtocol(
        findings,
        ['security_audit_protocol', 'performance_protocol', 'code_review_protocol'],
        [],
        createMockProjectContext()
      );

      expect(result.protocol).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });
  });
});
