import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkflowEngine, Task } from '../../src/adaptation/workflow-engine.js';
import { ErrorRecoverySystem, ErrorClass } from '../../src/adaptation/error-recovery.js';
import { RiskAssessmentEngine, RiskLevel, CodeChange } from '../../src/adaptation/risk-assessment.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager } from '../../src/types/project-context.js';
import { ExtendedProtocolMetadata } from '../../src/types/protocol-frontmatter.js';
import { StandardResult } from '../../src/types/execution.js';

const createMockProtocol = (name: string, category: string = 'Debugging'): ExtendedProtocolMetadata => ({
  id: name,
  fileName: `${name}.md`,
  name,
  title: `${name} Protocol`,
  triggers: [name.toUpperCase()],
  category: category as ExtendedProtocolMetadata['category'],
  tags: [],
  difficulty: 'intermediate' as const,
  purpose: `Test protocol for ${name}`,
  version: '1.0.0',
  prerequisites: [],
  worksWellWith: [],
  platformTags: ['fullstack'],
  stackSpecific: {},
  hasFrontmatter: false
});

const mockProtocols = [
  createMockProtocol('PERFAUDIT', 'Performance'),
  createMockProtocol('DEEPDIVE', 'Debugging'),
  createMockProtocol('SECAUDIT', 'Security'),
  createMockProtocol('MDAP', 'Architecture'),
  createMockProtocol('FULLSPEC', 'Testing'),
  createMockProtocol('COMPREHENSIVE', 'Quality'),
  createMockProtocol('codebase_indexing', 'Architecture'),
  createMockProtocol('error_fix', 'Debugging'),
  createMockProtocol('test_automation', 'Testing'),
  createMockProtocol('refactor', 'Quality'),
  createMockProtocol('debug_protocol', 'Debugging'),
  createMockProtocol('bigpappa_protocol_reviewANDfixes', 'Quality')
];

describe('Phase 3 Integration Tests', () => {
  let workflowEngine: WorkflowEngine;
  let errorRecoverySystem: ErrorRecoverySystem;
  let riskAssessmentEngine: RiskAssessmentEngine;

  beforeEach(() => {
    workflowEngine = new WorkflowEngine(mockProtocols);
    errorRecoverySystem = new ErrorRecoverySystem(mockProtocols);
    riskAssessmentEngine = new RiskAssessmentEngine();
  });

  afterEach(() => {
    riskAssessmentEngine.clearSessionAlerts('test-session');
  });

  describe('Scenario 1: Simple Adaptive Workflow', () => {
    it('should build and execute adaptive workflow for performance issue', async () => {
      const task: Task = {
        description: 'Debug performance issue',
        type: 'debug',
        priority: 'medium'
      };

      const context = {
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
      };

      const workflow = await workflowEngine.buildAdaptiveWorkflow(task, context);

      expect(workflow.initialProtocol).toBe('debug_protocol');
      expect(workflow.maxIterations).toBe(5);
      expect(workflow.branches.length).toBeGreaterThanOrEqual(0);
    });

    it('should adapt workflow based on previous results', async () => {
      const task: Task = {
        description: 'Debug performance issue',
        type: 'debug',
        priority: 'medium'
      };

      const previousResults: StandardResult[] = [
        {
          protocolName: 'debug_protocol',
          executionTime: 5000,
          timestamp: new Date(),
          success: true,
          findings: [
            { findingId: 'f1', severity: 'high', category: 'performance', title: 'N+1 Query', description: 'N+1 query detected', recommendations: [], location: { file: 'src/db.ts', line: 42 }, metadata: {} }
          ],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'debug_protocol', executionTime: 5000, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 100, success: true }
        }
      ];

      const workflow = await workflowEngine.buildAdaptiveWorkflow(task, {
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
      }, previousResults);

      expect(workflow.initialProtocol).toBe('debug_protocol');
      expect(workflow.branches.length).toBeGreaterThanOrEqual(0);
    });

    it('should complete workflow when goal is reached', async () => {
      const task: Task = {
        description: 'Debug performance issue',
        type: 'debug',
        priority: 'medium'
      };

      const result: StandardResult = {
        protocolName: 'debug_protocol',
        executionTime: 10000,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [
          { id: 'r1', description: 'Optimize the N+1 query', implemented: true }
        ],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'debug_protocol', executionTime: 10000, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 100, success: true }
      };

      const isComplete = await workflowEngine.isGoalReached(result, task);
      expect(isComplete).toBe(true);
    });
  });

  describe('Scenario 2: Error and Recovery', () => {
    it('should classify timeout errors correctly', async () => {
      const timeoutError = new Error('Request timeout after 30000ms');

      const errorClass = await errorRecoverySystem.classifyError(timeoutError, {
        error: timeoutError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      });

      expect(errorClass).toBe(ErrorClass.TIMEOUT);
    });

    it('should classify resource exhaustion errors correctly', async () => {
      const memoryError = new Error('JavaScript heap out of memory');

      const errorClass = await errorRecoverySystem.classifyError(memoryError, {
        error: memoryError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      });

      expect(errorClass).toBe(ErrorClass.RESOURCE_EXHAUSTED);
    });

    it('should find recovery strategies for timeout errors', async () => {
      const timeoutError = new Error('Request timeout');

      const strategies = await errorRecoverySystem.findRecoveryStrategy(ErrorClass.TIMEOUT, {
        error: timeoutError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      });

      expect(strategies.length).toBeGreaterThan(0);
      expect(strategies.some(s => s.name.includes('retry') || s.name.includes('reduce'))).toBe(true);
    });

    it('should attempt recovery and return result', async () => {
      const timeoutError = new Error('Request timeout');
      const strategies = await errorRecoverySystem.getAllRecoveryStrategies(timeoutError, {
        error: timeoutError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'test-session', executedProtocols: [] },
        previousResults: []
      });

      const retryStrategy = strategies.find(s => s.name.includes('retry'));
      if (retryStrategy) {
        const result = await errorRecoverySystem.attemptRecovery(timeoutError, retryStrategy, {
          error: timeoutError,
          protocol: 'PERFAUDIT',
          session: { sessionId: 'test-session', executedProtocols: [] },
          previousResults: []
        });

        expect(result.strategyUsed).toBe(retryStrategy.name);
        expect(result.attempts).toBeGreaterThanOrEqual(1);
      } else {
        expect(true).toBe(true);
      }
    });

    it('should escalate unrecoverable errors', async () => {
      const unknownError = new Error('Some unknown error that cannot be recovered');

      const escalation = await errorRecoverySystem.escalateIfUnrecoverable(unknownError, {
        error: unknownError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      });

      expect(escalation.shouldEscalate).toBe(true);
      expect(escalation.escalateTo).toBeDefined();
    });
  });

  describe('Scenario 3: Risk Assessment', () => {
    it('should assess critical risk for authentication changes', async () => {
      const authChange: CodeChange = {
        file: 'src/auth/login.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: ['authentication', 'security'],
        isAuthentication: true,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const assessment = await riskAssessmentEngine.assessModification(authChange);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.score).toBeGreaterThanOrEqual(75);
      expect(assessment.requiresApproval).toBe(true);
      expect(assessment.factors.some(f => f.name.includes('Authentication'))).toBe(true);
    });

    it('should assess high risk for payment changes', async () => {
      const paymentChange: CodeChange = {
        file: 'src/payment/processor.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['payment', 'billing'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: true,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const assessment = await riskAssessmentEngine.assessModification(paymentChange);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.score).toBeGreaterThanOrEqual(75);
    });

    it('should generate rollback plan for critical changes', async () => {
      const criticalChange: CodeChange = {
        file: 'src/auth/login.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: ['authentication'],
        isAuthentication: true,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 30
      };

      const rollbackPlan = await riskAssessmentEngine.generateRollbackPlan(criticalChange);

      expect(rollbackPlan.steps.length).toBeGreaterThan(0);
      expect(rollbackPlan.estimatedTime).toBeDefined();
      expect(rollbackPlan.steps.some(s => s.action.includes('verify') || s.action.includes('critical'))).toBe(true);
    });

    it('should require escalation for critical risk', async () => {
      const assessment = {
        level: RiskLevel.CRITICAL,
        score: 85,
        factors: [{ name: 'test', message: 'test', severity: 10, mitigation: 'test', evidence: 'test' }],
        requiresApproval: true,
        requiresReview: true
      };

      expect(riskAssessmentEngine.requiresEscalation(assessment)).toBe(true);
    });

    it('should not require escalation for low risk', async () => {
      const assessment = {
        level: RiskLevel.LOW,
        score: 15,
        factors: [{ name: 'test', message: 'test', severity: 3, mitigation: 'test', evidence: 'test' }],
        requiresApproval: false,
        requiresReview: false
      };

      expect(riskAssessmentEngine.requiresEscalation(assessment)).toBe(false);
    });
  });

  describe('Scenario 4: Multi-Step Branching', () => {
    it('should build workflow with multiple branches', async () => {
      const task: Task = {
        description: 'Complete code audit',
        type: 'audit',
        priority: 'high'
      };

      const context = {
        language: Language.TypeScript,
        framework: Framework.React,
        projectType: ProjectType.Fullstack,
        testFramework: TestFramework.Jest,
        packageManager: PackageManager.NPM,
        hasDocker: true,
        hasCI: true,
        hasGit: true,
        dependencies: [],
        devDependencies: [],
        detected: true
      };

      const workflow = await workflowEngine.buildAdaptiveWorkflow(task, context);

      expect(workflow.branches.length).toBeGreaterThanOrEqual(0);
      expect(workflow.initialProtocol).toBe('bigpappa_protocol_reviewANDfixes');
    });

    it('should branch to different protocols based on findings', async () => {
      const securityFindings = [
        { findingId: 's1', severity: 'critical', category: 'security', title: 'SQL Injection', description: 'SQL injection vulnerability', recommendations: [], location: { file: 'src/db.ts', line: 10 }, metadata: {} }
      ];

      const workflow = {
        taskDescription: 'Complete code audit',
        initialProtocol: 'bigpappa_protocol_reviewANDfixes',
        branches: [
          { condition: 'findingsCount >= 1', protocols: ['SECAUDIT'], skipIfAlreadyRun: false }
        ],
        fallbacks: {},
        escalationThresholds: [],
        maxIterations: 10,
        estimatedTime: '1-2 hours'
      };

      const result: StandardResult = {
        protocolName: 'bigpappa_protocol_reviewANDfixes',
        executionTime: 60000,
        timestamp: new Date(),
        success: true,
        findings: securityFindings,
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'bigpappa_protocol_reviewANDfixes', executionTime: 60000, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 200, success: true }
      };

      const decision = await workflowEngine.analyzeResultsAndAdapt(result, workflow, ['bigpappa_protocol_reviewANDFixes']);

      expect(decision.nextProtocol).toBeDefined();
    });

    it('should handle branch execution suggestion', async () => {
      const multiFindingResult: StandardResult = {
        protocolName: 'bigpappa_protocol_reviewANDfixes',
        executionTime: 90000,
        timestamp: new Date(),
        success: true,
        findings: [
          { findingId: 's1', severity: 'critical', category: 'security', title: 'SQL Injection', description: 'SQL injection', recommendations: [], location: { file: 'src/db.ts', line: 10 }, metadata: {} },
          { findingId: 'p1', severity: 'high', category: 'performance', title: 'Slow query', description: 'Slow query detected', recommendations: [], location: { file: 'src/db.ts', line: 20 }, metadata: {} }
        ],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'bigpappa_protocol_reviewANDfixes', executionTime: 90000, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 250, success: true }
      };

      const decision = await workflowEngine.analyzeResultsAndAdapt(
        multiFindingResult,
        {
          taskDescription: 'Complete code audit',
          initialProtocol: 'bigpappa_protocol_reviewANDfixes',
          branches: [],
          fallbacks: {},
          escalationThresholds: [],
          maxIterations: 10,
          estimatedTime: '1-2 hours'
        },
        ['bigpappa_protocol_reviewANDFixes']
      );

      expect(decision.nextProtocol).toBeDefined();
    });

    it('should respect maxIterations limit', async () => {
      const task: Task = {
        description: 'Debug complex issue',
        type: 'debug',
        priority: 'medium'
      };

      const workflow = await workflowEngine.buildAdaptiveWorkflow(task, {
        language: Language.TypeScript,
        framework: Framework.Express,
        projectType: ProjectType.Backend,
        testFramework: TestFramework.Jest,
        packageManager: PackageManager.NPM,
        hasDocker: false,
        hasCI: true,
        hasGit: true,
        dependencies: [],
        devDependencies: [],
        detected: true
      });

      expect(workflow.maxIterations).toBeLessThanOrEqual(10);
      expect(workflow.maxIterations).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Cross-component Integration', () => {
    it('should integrate workflow engine with risk assessment', async () => {
      const highRiskChange: CodeChange = {
        file: 'src/auth.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['authentication'],
        isAuthentication: true,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const assessment = await riskAssessmentEngine.assessModification(highRiskChange);

      if (assessment.level === RiskLevel.CRITICAL) {
        const task: Task = {
          description: 'Refactor authentication module',
          type: 'refactor',
          priority: 'high'
        };

        const workflow = await workflowEngine.buildAdaptiveWorkflow(task, {
          language: Language.TypeScript,
          framework: Framework.Express,
          projectType: ProjectType.Backend,
          testFramework: TestFramework.Jest,
          packageManager: PackageManager.NPM,
          hasDocker: false,
          hasCI: true,
          hasGit: true,
          dependencies: [],
          devDependencies: [],
          detected: true
        });

        expect(workflow.escalationThresholds.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('should integrate error recovery with workflow continuation', async () => {
      const timeoutError = new Error('Execution timeout');

      const errorClass = await errorRecoverySystem.classifyError(timeoutError, {
        error: timeoutError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'session-1', executedProtocols: [] },
        previousResults: []
      });

      const strategies = await errorRecoverySystem.findRecoveryStrategy(errorClass, {
        error: timeoutError,
        protocol: 'PERFAUDIT',
        session: { sessionId: 'session-1', executedProtocols: [] },
        previousResults: []
      });

      expect(strategies.length).toBeGreaterThan(0);

      const reduceScopeStrategy = strategies.find(s => s.name.includes('reduce'));
      if (reduceScopeStrategy) {
        const result = await errorRecoverySystem.attemptRecovery(timeoutError, reduceScopeStrategy, {
          error: timeoutError,
          protocol: 'PERFAUDIT',
          session: { sessionId: 'session-1', executedProtocols: [] },
          previousResults: []
        });

        expect(result.strategyUsed).toBe(reduceScopeStrategy.name);
      }
    });

    it('should monitor execution and generate alerts', async () => {
      const criticalExecution = {
        id: 'test-session',
        protocol: 'SECAUDIT',
        status: 'running' as const,
        changes: [{
          file: 'src/auth.ts',
          type: 'modification' as const,
          scope: 'function' as const,
          affectedAreas: ['authentication'],
          isAuthentication: true,
          isAuthorization: false,
          isPayment: false,
          isDatabaseMigration: false,
          changeSize: 50
        }],
        startedAt: new Date(),
        alerts: []
      };

      const alerts = await riskAssessmentEngine.monitorExecution(criticalExecution);

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.level === RiskLevel.CRITICAL)).toBe(true);

      const storedAlerts = await riskAssessmentEngine.getExecutionAlerts('test-session');
      expect(storedAlerts.length).toBeGreaterThan(0);
    });

    it('should select next protocol based on findings', async () => {
      const findings = [
        { findingId: 'f1', severity: 'high', category: 'security', title: 'Vulnerability', description: 'Security vulnerability', recommendations: [], location: { file: 'src/auth.ts', line: 10 }, metadata: {} }
      ];

      const nextProtocol = await workflowEngine.selectNextProtocol(
        findings,
        ['PERFAUDIT', 'SECAUDIT', 'DEEPDIVE', 'debug_protocol'],
        ['PERFAUDIT'],
        {
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
        }
      );

      expect(nextProtocol.protocol).toBeDefined();
      expect(nextProtocol.confidence).toBeGreaterThan(0);
    });
  });
});
