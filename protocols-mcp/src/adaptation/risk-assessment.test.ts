import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RiskAssessmentEngine, RiskLevel, CodeChange } from './risk-assessment.js';

describe('RiskAssessmentEngine', () => {
  let engine: RiskAssessmentEngine;

  beforeEach(() => {
    engine = new RiskAssessmentEngine();
  });

  afterEach(() => {
    engine.clearSessionAlerts('test-session');
  });

  describe('assessModification', () => {
    it('should return LOW risk for single-line trivial changes', async () => {
      const change: CodeChange = {
        file: 'src/utils/helper.ts',
        type: 'modification',
        scope: 'single_line',
        affectedAreas: ['utils'],
        changeSize: 1,
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.LOW);
      expect(assessment.score).toBeLessThan(25);
      expect(assessment.requiresApproval).toBe(false);
    });

    it('should return CRITICAL risk for authentication changes', async () => {
      const change: CodeChange = {
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

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.score).toBeGreaterThanOrEqual(75);
      expect(assessment.factors.some(f => f.name.includes('Authentication'))).toBe(true);
    });

    it('should return CRITICAL risk for payment processing changes', async () => {
      const change: CodeChange = {
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

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.score).toBeGreaterThanOrEqual(75);
    });

    it('should return CRITICAL risk for database migrations', async () => {
      const change: CodeChange = {
        file: 'migrations/2024_01_create_users.sql',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['database', 'schema'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: true,
        changeSize: 200
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.score).toBeGreaterThanOrEqual(55);
    });

    it('should return CRITICAL risk for architecture changes', async () => {
      const change: CodeChange = {
        file: 'src/core/app.ts',
        type: 'modification',
        scope: 'architecture',
        affectedAreas: ['core', 'all-modules'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 300
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.CRITICAL);
      expect(assessment.factors.some(f => f.name.includes('Architecture'))).toBe(true);
    });

    it('should return LOW risk for module-level changes', async () => {
      const change: CodeChange = {
        file: 'src/services/user/service.ts',
        type: 'modification',
        scope: 'module',
        affectedAreas: ['services', 'user-module'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.LOW);
      expect(assessment.score).toBeLessThan(30);
    });

    it('should flag large changes with higher risk', async () => {
      const smallChange: CodeChange = {
        file: 'src/file.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['general'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const largeChange: CodeChange = {
        file: 'src/file.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['general'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 600
      };

      const smallAssessment = await engine.assessModification(smallChange);
      const largeAssessment = await engine.assessModification(largeChange);

      expect(largeAssessment.score).toBeGreaterThan(smallAssessment.score);
      expect(largeAssessment.factors.some(f => f.message.includes('Large changes'))).toBe(true);
    });

    it('should identify multiple risk factors', async () => {
      const change: CodeChange = {
        file: 'src/auth/payment.ts',
        type: 'modification',
        scope: 'module',
        affectedAreas: ['authentication', 'payment', 'security'],
        isAuthentication: true,
        isAuthorization: false,
        isPayment: true,
        isDatabaseMigration: false,
        changeSize: 400
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.factors.length).toBeGreaterThan(1);
      expect(assessment.level).toBe(RiskLevel.CRITICAL);
    });

    it('should suggest appropriate reviewer', async () => {
      const authChange: CodeChange = {
        file: 'src/auth/login.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: ['authentication'],
        isAuthentication: true,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const paymentChange: CodeChange = {
        file: 'src/payment/charge.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['payment'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: true,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const authAssessment = await engine.assessModification(authChange);
      const paymentAssessment = await engine.assessModification(paymentChange);

      expect(authAssessment.suggestedReviewer).toBe('Senior Security Engineer');
      expect(paymentAssessment.suggestedReviewer).toBe('Payment Specialist');
    });

    it('should not suggest reviewer for low-risk changes', async () => {
      const change: CodeChange = {
        file: 'src/utils/helper.ts',
        type: 'modification',
        scope: 'single_line',
        affectedAreas: ['utils'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 1
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.suggestedReviewer).toBeUndefined();
    });

    it('should handle file creation with appropriate risk', async () => {
      const change: CodeChange = {
        file: 'src/new-feature.ts',
        type: 'creation',
        scope: 'file',
        affectedAreas: ['new-feature'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.level).toBe(RiskLevel.LOW);
    });

    it('should handle file deletion with appropriate risk', async () => {
      const change: CodeChange = {
        file: 'src/old-feature.ts',
        type: 'deletion',
        scope: 'file',
        affectedAreas: ['old-feature'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 100
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.factors.some(f => f.message.includes('deletion'))).toBe(true);
    });
  });

  describe('requiresConfirmation', () => {
    it('should return true for HIGH risk', () => {
      expect(engine.requiresConfirmation(RiskLevel.HIGH)).toBe(true);
    });

    it('should return true for CRITICAL risk', () => {
      expect(engine.requiresConfirmation(RiskLevel.CRITICAL)).toBe(true);
    });

    it('should return false for MEDIUM risk', () => {
      expect(engine.requiresConfirmation(RiskLevel.MEDIUM)).toBe(false);
    });

    it('should return false for LOW risk', () => {
      expect(engine.requiresConfirmation(RiskLevel.LOW)).toBe(false);
    });
  });

  describe('generateRollbackPlan', () => {
    it('should generate rollback steps for file modification', async () => {
      const change: CodeChange = {
        file: 'src/utils/helper.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: ['utils'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 20
      };

      const plan = await engine.generateRollbackPlan(change);

      expect(plan.steps.length).toBeGreaterThan(0);
      expect(plan.estimatedTime).toBeDefined();
      expect(plan.dataImpact).toBeDefined();
      expect(plan.userImpact).toBeDefined();
      expect(plan.steps.some(s => s.action === 'revert_changes')).toBe(true);
    });

    it('should include database verification for migrations', async () => {
      const change: CodeChange = {
        file: 'migrations/2024_01_add_column.sql',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['database'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: true,
        changeSize: 50
      };

      const plan = await engine.generateRollbackPlan(change);

      expect(plan.steps.some(s => s.action === 'verify_database')).toBe(true);
    });

    it('should include critical path verification for critical changes', async () => {
      const change: CodeChange = {
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

      const plan = await engine.generateRollbackPlan(change);

      expect(plan.steps.some(s => s.action === 'verify_critical_paths')).toBe(true);
    });

    it('should generate different steps for file creation vs deletion', async () => {
      const creationChange: CodeChange = {
        file: 'src/new-file.ts',
        type: 'creation',
        scope: 'file',
        affectedAreas: [],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const deletionChange: CodeChange = {
        file: 'src/old-file.ts',
        type: 'deletion',
        scope: 'file',
        affectedAreas: [],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const creationPlan = await engine.generateRollbackPlan(creationChange);
      const deletionPlan = await engine.generateRollbackPlan(deletionChange);

      expect(creationPlan.steps.some(s => s.action === 'remove_created_file')).toBe(true);
      expect(deletionPlan.steps.some(s => s.action === 'restore_deleted_file')).toBe(true);
    });

    it('should estimate longer time for architecture changes', async () => {
      const smallChange: CodeChange = {
        file: 'src/utils/helper.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: ['utils'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 10
      };

      const architectureChange: CodeChange = {
        file: 'src/core.ts',
        type: 'modification',
        scope: 'architecture',
        affectedAreas: ['core'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 500
      };

      const smallPlan = await engine.generateRollbackPlan(smallChange);
      const archPlan = await engine.generateRollbackPlan(architectureChange);

      const smallTime = parseInt(smallPlan.estimatedTime.replace(/\D/g, ''));
      const archTime = parseInt(archPlan.estimatedTime.replace(/\D/g, ''));
      expect(smallTime).toBeLessThan(archTime);
    });
  });

  describe('monitorExecution', () => {
    it('should generate alerts for critical changes', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'SECAUDIT',
        status: 'running' as const,
        changes: [{
          file: 'src/auth/login.ts',
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

      const alerts = await engine.monitorExecution(execution);

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts.some(a => a.level === RiskLevel.CRITICAL)).toBe(true);
    });

    it('should generate high alerts for high-risk changes', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'PERFAUDIT',
        status: 'running' as const,
        changes: [{
          file: 'migrations/large_migration.sql',
          type: 'modification' as const,
          scope: 'file' as const,
          affectedAreas: ['database'],
          isAuthentication: false,
          isAuthorization: false,
          isPayment: false,
          isDatabaseMigration: true,
          changeSize: 300
        }],
        startedAt: new Date(),
        alerts: []
      };

      const alerts = await engine.monitorExecution(execution);

      expect(alerts.some(a => a.level === RiskLevel.HIGH || a.level === RiskLevel.CRITICAL)).toBe(true);
    });

    it('should not generate alerts for low-risk changes', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'FULLSPEC',
        status: 'running' as const,
        changes: [{
          file: 'src/utils/helper.ts',
          type: 'modification' as const,
          scope: 'single_line' as const,
          affectedAreas: ['utils'],
          isAuthentication: false,
          isAuthorization: false,
          isPayment: false,
          isDatabaseMigration: false,
          changeSize: 1
        }],
        startedAt: new Date(),
        alerts: []
      };

      const alerts = await engine.monitorExecution(execution);

      expect(alerts.length).toBe(0);
    });

    it('should store alerts for later retrieval', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'MDAP',
        status: 'running' as const,
        changes: [{
          file: 'src/auth/payment.ts',
          type: 'modification' as const,
          scope: 'file' as const,
          affectedAreas: ['authentication', 'payment'],
          isAuthentication: true,
          isAuthorization: false,
          isPayment: true,
          isDatabaseMigration: false,
          changeSize: 100
        }],
        startedAt: new Date(),
        alerts: []
      };

      await engine.monitorExecution(execution);
      const alerts = await engine.getExecutionAlerts('test-session');

      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should filter alerts by level', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'SECAUDIT',
        status: 'running' as const,
        changes: [{
          file: 'src/auth/login.ts',
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

      await engine.monitorExecution(execution);
      const criticalAlerts = await engine.getExecutionAlerts('test-session', RiskLevel.CRITICAL);
      const highAlerts = await engine.getExecutionAlerts('test-session', RiskLevel.HIGH);

      expect(criticalAlerts.length).toBeGreaterThan(0);
      expect(highAlerts.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getExecutionAlerts', () => {
    it('should return empty array for unknown session', async () => {
      const alerts = await engine.getExecutionAlerts('unknown-session');

      expect(alerts).toEqual([]);
    });

    it('should return all alerts when no level specified', async () => {
      const execution = {
        id: 'test-session',
        protocol: 'SECAUDIT',
        status: 'running' as const,
        changes: [{
          file: 'src/auth/login.ts',
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

      await engine.monitorExecution(execution);
      const alerts = await engine.getExecutionAlerts('test-session');

      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  describe('requiresEscalation', () => {
    it('should return true for CRITICAL risk', () => {
      const assessment = {
        level: RiskLevel.CRITICAL,
        score: 85,
        factors: [{ name: 'test', message: 'test', severity: 10, mitigation: 'test', evidence: 'test' }],
        requiresApproval: true,
        requiresReview: true
      };

      expect(engine.requiresEscalation(assessment)).toBe(true);
    });

    it('should return true for HIGH risk with high-severity factors', () => {
      const assessment = {
        level: RiskLevel.HIGH,
        score: 60,
        factors: [{ name: 'test', message: 'test', severity: 9, mitigation: 'test', evidence: 'test' }],
        requiresApproval: true,
        requiresReview: true
      };

      expect(engine.requiresEscalation(assessment)).toBe(true);
    });

    it('should return false for HIGH risk with low-severity factors', () => {
      const assessment = {
        level: RiskLevel.HIGH,
        score: 55,
        factors: [{ name: 'test', message: 'test', severity: 4, mitigation: 'test', evidence: 'test' }],
        requiresApproval: true,
        requiresReview: true
      };

      expect(engine.requiresEscalation(assessment)).toBe(false);
    });

    it('should return false for MEDIUM risk', () => {
      const assessment = {
        level: RiskLevel.MEDIUM,
        score: 35,
        factors: [{ name: 'test', message: 'test', severity: 5, mitigation: 'test', evidence: 'test' }],
        requiresApproval: false,
        requiresReview: true
      };

      expect(engine.requiresEscalation(assessment)).toBe(false);
    });
  });

  describe('risk scoring edge cases', () => {
    it('should handle empty affected areas', async () => {
      const change: CodeChange = {
        file: 'src/test.ts',
        type: 'modification',
        scope: 'function',
        affectedAreas: [],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 10
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.score).toBeDefined();
      expect(assessment.level).toBeDefined();
    });

    it('should handle zero change size', async () => {
      const change: CodeChange = {
        file: 'src/test.ts',
        type: 'modification',
        scope: 'single_line',
        affectedAreas: ['general'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 0
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.score).toBeLessThan(50);
    });

    it('should cap score at 100', async () => {
      const change: CodeChange = {
        file: 'src/auth/payment.ts',
        type: 'modification',
        scope: 'architecture',
        affectedAreas: ['authentication', 'payment', 'security', 'core'],
        isAuthentication: true,
        isAuthorization: true,
        isPayment: true,
        isDatabaseMigration: false,
        changeSize: 1000
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.score).toBeLessThanOrEqual(100);
    });

    it('should handle files with critical patterns in name', async () => {
      const change: CodeChange = {
        file: 'src/security-jwt-auth.ts',
        type: 'modification',
        scope: 'file',
        affectedAreas: ['security'],
        isAuthentication: false,
        isAuthorization: false,
        isPayment: false,
        isDatabaseMigration: false,
        changeSize: 50
      };

      const assessment = await engine.assessModification(change);

      expect(assessment.factors.some(f => f.name.includes('security') || f.name.includes('JWT'))).toBe(true);
    });
  });
});
