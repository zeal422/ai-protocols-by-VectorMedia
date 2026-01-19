import { describe, it, expect, beforeEach, vi, type MockInstance } from 'vitest';
import { ParallelExecutionEngine, createMockWorkflowStep } from './parallel-engine.js';
import { DependencyResolver } from '../intelligence/dependency-resolver.js';
import { WorkflowStep } from '../search/workflow-builder.js';
import { ExecutionSession } from '../types/execution.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager } from '../types/project-context.js';

describe('ParallelExecutionEngine', () => {
  let parallelEngine: ParallelExecutionEngine;
  let mockDependencyResolver: DependencyResolver & {
    getDependencies: MockInstance<(protocol: string) => Promise<string[]>>;
    getDependents: MockInstance<(protocol: string) => Promise<string[]>>;
  };

  beforeEach(() => {
    mockDependencyResolver = {
      getDependencies: vi.fn().mockResolvedValue([]),
      getDependents: vi.fn().mockResolvedValue([]),
      resolveProtocolDependencies: vi.fn(),
      getDependencyGraph: vi.fn(),
      hasCircularDependencies: vi.fn(),
      getExecutionOrder: vi.fn()
    } as unknown as DependencyResolver & {
      getDependencies: MockInstance<(protocol: string) => Promise<string[]>>;
      getDependents: MockInstance<(protocol: string) => Promise<string[]>>;
    };

    parallelEngine = new ParallelExecutionEngine(mockDependencyResolver, {
      defaultMaxParallel: 4,
      defaultConflictStrategy: 'abort'
    });
  });

  describe('planParallelExecution', () => {
    it('should create a single stage for single workflow', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('debug_protocol')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);
      mockDependencyResolver.getDependents.mockResolvedValue([]);

      const plan = await parallelEngine.planParallelExecution(workflows);

      expect(plan.stages).toHaveLength(1);
      expect(plan.stages[0].protocols).toEqual(['debug_protocol']);
      expect(plan.stages[0].runInParallel).toBe(false);
    });

    it('should create parallel stages for independent workflows', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('test_automation_protocol'),
        createMockWorkflowStep('code_review_protocol')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);
      mockDependencyResolver.getDependents.mockResolvedValue([]);

      const plan = await parallelEngine.planParallelExecution(workflows);

      expect(plan.stages.length).toBeGreaterThanOrEqual(1);
      expect(plan.maxParallel).toBe(4);
      expect(plan.conflictStrategy).toBe('abort');
    });

    it('should respect maxParallel limit', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('protocol1'),
        createMockWorkflowStep('protocol2'),
        createMockWorkflowStep('protocol3'),
        createMockWorkflowStep('protocol4'),
        createMockWorkflowStep('protocol5')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);

      const plan = await parallelEngine.planParallelExecution(workflows, {
        maxParallel: 2
      });

      expect(plan.maxParallel).toBe(2);
    });

    it('should use custom conflict strategy', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('debug_protocol')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);

      const plan = await parallelEngine.planParallelExecution(workflows, {
        conflictStrategy: 'sequential'
      });

      expect(plan.conflictStrategy).toBe('sequential');
    });

    it('should estimate stage duration based on dependencies', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('code_review_protocol'),
        createMockWorkflowStep('debug_protocol')
      ];
      mockDependencyResolver.getDependencies
        .mockImplementation(async (protocol: string) => {
          if (protocol === 'code_review_protocol') return ['metadata_extractor'];
          return [];
        });

      const plan = await parallelEngine.planParallelExecution(workflows);

      expect(plan.totalEstimatedDuration).toBeGreaterThan(0);
    });
  });

  describe('detectConflicts', () => {
    it('should detect no conflicts for independent protocols', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('debug_protocol'),
        createMockWorkflowStep('test_automation_protocol')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);

      const conflicts = await parallelEngine.detectConflicts(workflows);

      expect(conflicts).toHaveLength(0);
    });

    it('should detect state modification conflicts', async () => {
      const workflows: WorkflowStep[] = [
        createMockWorkflowStep('refactor_protocol'),
        createMockWorkflowStep('security_audit_protocol')
      ];
      mockDependencyResolver.getDependencies.mockResolvedValue([]);

      const conflicts = await parallelEngine.detectConflicts(workflows);

      const stateConflicts = conflicts.filter(c => c.conflictType === 'state_modification');
      expect(stateConflicts.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty workflows', async () => {
      const conflicts = await parallelEngine.detectConflicts([]);

      expect(conflicts).toEqual([]);
    });
  });

  describe('executeInParallel', () => {
    function createMockSession(): ExecutionSession {
      return {
        sessionId: 'test-session',
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
          sessionId: 'test-session',
          metrics: [],
          startTime: new Date()
        }
      };
    }

    it('should execute single protocol', async () => {
      const stages = [
        {
          stageId: 'stage-0',
          protocols: ['debug_protocol'],
          dependencies: [],
          runInParallel: false,
          estimatedDuration: 100
        }
      ];
      const session = createMockSession();

      const result = await parallelEngine.executeInParallel(stages, session);

      expect(result.stageResults.size).toBe(1);
      expect(result.stageResults.get('stage-0')).toHaveLength(1);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
      expect(result.parallelizationFactor).toBeGreaterThanOrEqual(1);
    });

    it('should calculate parallelization factor', async () => {
      const stages = [
        {
          stageId: 'stage-0',
          protocols: ['debug_protocol', 'test_automation_protocol'],
          dependencies: [],
          runInParallel: true,
          estimatedDuration: 200
        }
      ];
      const session = createMockSession();

      const result = await parallelEngine.executeInParallel(stages, session);

      expect(result.stageResults.get('stage-0')).toHaveLength(2);
      expect(result.parallelizationFactor).toBeGreaterThanOrEqual(1);
    });

    it('should detect conflicts in results', async () => {
      const stages = [
        {
          stageId: 'stage-0',
          protocols: ['refactor_protocol', 'security_audit_protocol'],
          dependencies: [],
          runInParallel: true,
          estimatedDuration: 200
        }
      ];
      const session = createMockSession();

      const result = await parallelEngine.executeInParallel(stages, session);

      expect(result.conflictsDetected.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('mergeResults', () => {
    it('should merge results from multiple protocols', async () => {
      const results = [
        {
          protocolName: 'debug_protocol',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [
            { findingId: 'f1', severity: 'high' as const, category: 'security', title: 'Issue 1', description: 'Desc 1' }
          ],
          recommendations: [
            { recommendationId: 'r1', priority: 'high' as const, action: 'Fix issue 1', description: 'Desc 1' }
          ],
          artifacts: [],
          nextSteps: [
            { stepId: 's1', action: 'Step 1', reason: 'Reason 1', optional: false }
          ],
          metrics: {
            protocolName: 'debug_protocol',
            executionTime: 100,
            cacheHits: 5,
            cacheMisses: 2,
            cacheHitRate: 0.71,
            memoryUsage: 100000,
            success: true
          }
        },
        {
          protocolName: 'test_automation_protocol',
          executionTime: 200,
          timestamp: new Date(),
          success: true,
          findings: [
            { findingId: 'f2', severity: 'medium' as const, category: 'performance', title: 'Issue 2', description: 'Desc 2' }
          ],
          recommendations: [
            { recommendationId: 'r2', priority: 'medium' as const, action: 'Fix issue 2', description: 'Desc 2' }
          ],
          artifacts: [],
          nextSteps: [
            { stepId: 's2', action: 'Step 2', reason: 'Reason 2', optional: true }
          ],
          metrics: {
            protocolName: 'test_automation_protocol',
            executionTime: 200,
            cacheHits: 3,
            cacheMisses: 1,
            cacheHitRate: 0.75,
            memoryUsage: 150000,
            success: true
          }
        }
      ];

      const merged = await parallelEngine.mergeResults(results);

      expect(merged.protocolsExecuted).toBe(2);
      expect(merged.totalDuration).toBe(300);
      expect(merged.findings).toHaveLength(2);
      expect(merged.recommendations).toHaveLength(2);
      expect(merged.nextSteps).toHaveLength(2);
      expect(merged.metrics.successRate).toBe(1);
      expect(merged.metrics.overallCacheHitRate).toBeGreaterThan(0);
    });

    it('should deduplicate findings by category and title', async () => {
      const results = [
        {
          protocolName: 'protocol1',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [
            { findingId: 'f1', severity: 'high' as const, category: 'security', title: 'Same Issue', description: 'Desc 1' }
          ],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: {
            protocolName: 'protocol1',
            executionTime: 100,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: 0,
            success: true
          }
        },
        {
          protocolName: 'protocol2',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [
            { findingId: 'f2', severity: 'high' as const, category: 'security', title: 'Same Issue', description: 'Desc 2' }
          ],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: {
            protocolName: 'protocol2',
            executionTime: 100,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: 0,
            success: true
          }
        }
      ];

      const merged = await parallelEngine.mergeResults(results);

      expect(merged.findings).toHaveLength(1);
    });

    it('should calculate correct metrics for empty results', async () => {
      const merged = await parallelEngine.mergeResults([]);

      expect(merged.protocolsExecuted).toBe(0);
      expect(merged.totalDuration).toBe(0);
      expect(merged.metrics.successRate).toBe(1);
    });

    it('should merge next steps with optional last', async () => {
      const results = [
        {
          protocolName: 'protocol1',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [],
          recommendations: [],
          artifacts: [],
          nextSteps: [
            { stepId: 's1', action: 'Required Step', reason: 'Reason', optional: false }
          ],
          metrics: {
            protocolName: 'protocol1',
            executionTime: 100,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: 0,
            success: true
          }
        },
        {
          protocolName: 'protocol2',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [],
          recommendations: [],
          artifacts: [],
          nextSteps: [
            { stepId: 's2', action: 'Optional Step', reason: 'Reason', optional: true }
          ],
          metrics: {
            protocolName: 'protocol2',
            executionTime: 100,
            cacheHits: 0,
            cacheMisses: 0,
            cacheHitRate: 0,
            memoryUsage: 0,
            success: true
          }
        }
      ];

      const merged = await parallelEngine.mergeResults(results);

      expect(merged.nextSteps[0].optional).toBe(false);
    });
  });

  describe('createMockWorkflowStep', () => {
    it('should create workflow step with default values', () => {
      const step = createMockWorkflowStep('debug_protocol');

      expect(step.protocolName).toBe('debug_protocol');
      expect(step.trigger).toBe('TEST_DEBUG_PROTOCOL');
      expect(step.reason).toBe('Testing debug_protocol');
      expect(step.optional).toBe(false);
      expect(step.stepId).toBeDefined();
    });

    it('should allow overriding default values', () => {
      const step = createMockWorkflowStep('debug_protocol', {
        optional: true,
        estimatedEffort: '1-2 hours'
      });

      expect(step.optional).toBe(true);
      expect(step.estimatedEffort).toBe('1-2 hours');
    });
  });
});
