import { z } from 'zod';
import { ProtocolError } from '../utils/error-handler.js';

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export const CodeChangeSchema = z.object({
  file: z.string(),
  type: z.enum(['creation', 'modification', 'deletion']),
  scope: z.enum(['single_line', 'function', 'file', 'module', 'architecture']),
  affectedAreas: z.array(z.string()).default([]),
  isAuthentication: z.boolean().default(false),
  isAuthorization: z.boolean().default(false),
  isPayment: z.boolean().default(false),
  isDatabaseMigration: z.boolean().default(false),
  changeSize: z.number().default(0)
}).strict();

export type CodeChange = z.infer<typeof CodeChangeSchema>;

export interface RiskFactor {
  name: string;
  message: string;
  severity: number;
  mitigation: string;
  evidence: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactor[];
  requiresApproval: boolean;
  requiresReview: boolean;
  suggestedReviewer?: string;
}

export interface RollbackStep {
  action: string;
  command?: string;
  params?: Record<string, unknown>;
  verification: string;
}

export interface RollbackPlan {
  steps: RollbackStep[];
  estimatedTime: string;
  dataImpact: string;
  userImpact: string;
}

export interface RiskAlert {
  timestamp: Date;
  level: RiskLevel;
  message: string;
  affectedProtocol: string;
  suggestedAction: string;
  requiresImmediateAction: boolean;
}

export interface ProtocolExecution {
  id: string;
  protocol: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  changes: CodeChange[];
  startedAt: Date;
  alerts: RiskAlert[];
}

interface RiskRule {
  condition: (change: CodeChange) => boolean;
  severity: number;
  message: string;
  mitigation: string;
}

const RISK_RULES: RiskRule[] = [
  {
    condition: (change: CodeChange) => change.isAuthentication,
    severity: 10,
    message: 'Authentication logic changes are critical',
    mitigation: 'Require senior developer review and approval. Test all authentication flows.'
  },
  {
    condition: (change: CodeChange) => change.isPayment,
    severity: 9,
    message: 'Payment processing changes are high-risk',
    mitigation: 'Require payment specialist review. Implement rollback plan before changes.'
  },
  {
    condition: (change: CodeChange) => change.isDatabaseMigration,
    severity: 8,
    message: 'Database migrations require careful handling',
    mitigation: 'Create backup before migration. Test on staging environment first.'
  },
  {
    condition: (change: CodeChange) => change.scope === 'architecture',
    severity: 7,
    message: 'Architecture changes affect multiple systems',
    mitigation: 'Conduct architectural review. Update documentation and communicate changes.'
  },
  {
    condition: (change: CodeChange) => change.changeSize > 500,
    severity: 5,
    message: 'Large changes introduce more risk',
    mitigation: 'Consider breaking into smaller PRs. Increase test coverage.'
  },
  {
    condition: (change: CodeChange) => change.changeSize > 200,
    severity: 3,
    message: 'Medium-sized changes need thorough review',
    mitigation: 'Ensure comprehensive test coverage for affected areas.'
  },
  {
    condition: (change: CodeChange) => change.type === 'deletion',
    severity: 4,
    message: 'Code deletion removes functionality',
    mitigation: 'Verify no dependencies. Document removed functionality.'
  },
  {
    condition: (change: CodeChange) => change.scope === 'module',
    severity: 4,
    message: 'Module-level changes have broad impact',
    mitigation: 'Review all module consumers. Update module exports documentation.'
  },
  {
    condition: (change: CodeChange) => change.scope === 'file',
    severity: 2,
    message: 'File-level changes affect local functionality',
    mitigation: 'Ensure tests cover all functions in the file.'
  },
  {
    condition: (change: CodeChange) => change.scope === 'function',
    severity: 1,
    message: 'Function-level changes are localized',
    mitigation: 'Verify function behavior with unit tests.'
  }
];

const SCOPE_MULTIPLIERS: Record<string, number> = {
  single_line: 1,
  function: 2,
  file: 3,
  module: 5,
  architecture: 10
};

const CRITICAL_AREAS: string[] = [
  'auth',
  'authentication',
  'login',
  'password',
  'payment',
  'billing',
  'credit',
  'card',
  'database',
  'migration',
  'security'
];

const CRITICAL_PATTERNS = [
  /auth/i,
  /login/i,
  /password/i,
  /payment/i,
  /billing/i,
  /credit/i,
  /security/i,
  /jwt/i,
  /oauth/i
];

const REVIEWER_SUGGESTIONS: Record<string, string> = {
  authentication: 'Senior Security Engineer',
  payment: 'Payment Specialist',
  database: 'Database Administrator',
  architecture: 'Principal Architect'
};

export class RiskAssessmentEngine {
  private alertStore: Map<string, RiskAlert[]> = new Map();

  async assessModification(change: CodeChange): Promise<RiskAssessment> {
    try {
      const baseScore = this.calculateBaseScore(change);
      const scopeMultiplier = this.getScopeMultiplier(change.scope);
      const affectedAreaMultiplier = this.getAffectedAreaMultiplier(change.affectedAreas);

      let score = baseScore * scopeMultiplier * affectedAreaMultiplier;

      score = Math.min(100, Math.max(0, Math.round(score)));

      const level = this.determineRiskLevel(score);
      const factors = await this.identifyRiskFactors(change);
      const requiresApproval = this.requiresApproval(level);
      const requiresReview = this.requiresCodeReview(level, change);
      const suggestedReviewer = this.suggestReviewer(change);

      return {
        level,
        score,
        factors,
        requiresApproval,
        requiresReview,
        suggestedReviewer
      };
    } catch (error) {
      throw new ProtocolError(
        `Failed to assess modification risk: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RISK_ASSESSMENT_ERROR',
        { change }
      );
    }
  }

  requiresConfirmation(risk: RiskLevel): boolean {
    return risk === RiskLevel.HIGH || risk === RiskLevel.CRITICAL;
  }

  async generateRollbackPlan(change: CodeChange): Promise<RollbackPlan> {
    const steps: RollbackStep[] = [];
    const estimatedTime = this.estimateRollbackTime(change);
    const { dataImpact, userImpact } = this.assessRollbackImpact(change);

    if (change.type === 'creation') {
      steps.push({
        action: 'remove_created_file',
        command: `git checkout HEAD -- ${change.file}`,
        verification: `Verify ${change.file} no longer exists or matches previous state`
      });

      if (change.affectedAreas.length > 0) {
        steps.push({
          action: 'restore_imports',
          command: 'Check and restore any imports of the removed file',
          verification: 'Ensure no import errors in affected files'
        });
      }
    } else if (change.type === 'modification') {
      steps.push({
        action: 'revert_changes',
        command: `git checkout HEAD -- ${change.file}`,
        verification: `Verify ${change.file} matches the previous commit`
      });

      if (this.isCriticalChange(change)) {
        steps.push({
          action: 'verify_critical_paths',
          command: 'Run critical path tests',
          verification: 'All critical functionality tests pass'
        });
      }
    } else if (change.type === 'deletion') {
      steps.push({
        action: 'restore_deleted_file',
        command: `git checkout HEAD -- ${change.file}`,
        verification: `Verify ${change.file} is restored`
      });

      if (change.affectedAreas.length > 0) {
        steps.push({
          action: 'verify_dependencies',
          command: 'Check all files that depended on the deleted code',
          verification: 'No dependency errors or missing references'
        });
      }
    }

    if (change.isDatabaseMigration) {
      steps.push({
        action: 'verify_database',
        command: 'Run database integrity checks',
        verification: 'Database schema and data integrity confirmed'
      });
    }

    steps.push({
      action: 'final_verification',
      params: { change },
      verification: 'Run full test suite to confirm rollback success'
    });

    return {
      steps,
      estimatedTime,
      dataImpact,
      userImpact
    };
  }

  async monitorExecution(execution: ProtocolExecution): Promise<RiskAlert[]> {
    const alerts: RiskAlert[] = [];

    for (const change of execution.changes) {
      const assessment = await this.assessModification(change);

      if (assessment.level === RiskLevel.CRITICAL) {
        alerts.push({
          timestamp: new Date(),
          level: RiskLevel.CRITICAL,
          message: `Critical risk detected in ${change.file}: ${assessment.factors.map(f => f.message).join(', ')}`,
          affectedProtocol: execution.protocol,
          suggestedAction: 'Halt execution and require approval before proceeding',
          requiresImmediateAction: true
        });
      } else if (assessment.level === RiskLevel.HIGH) {
        alerts.push({
          timestamp: new Date(),
          level: RiskLevel.HIGH,
          message: `High risk detected in ${change.file}`,
          affectedProtocol: execution.protocol,
          suggestedAction: 'Continue with enhanced monitoring and review',
          requiresImmediateAction: false
        });
      }

      for (const factor of assessment.factors) {
        if (factor.severity >= 8) {
          alerts.push({
            timestamp: new Date(),
            level: RiskLevel.HIGH,
            message: factor.message,
            affectedProtocol: execution.protocol,
            suggestedAction: factor.mitigation,
            requiresImmediateAction: factor.severity >= 9
          });
        }
      }
    }

    execution.alerts = alerts;
    this.storeAlerts(execution.id, alerts);

    return alerts;
  }

  async getExecutionAlerts(sessionId: string, level?: RiskLevel): Promise<RiskAlert[]> {
    const alerts = this.alertStore.get(sessionId) || [];

    if (level) {
      return alerts.filter(alert => alert.level === level);
    }

    return alerts;
  }

  requiresEscalation(assessment: RiskAssessment): boolean {
    return assessment.level === RiskLevel.CRITICAL ||
           (assessment.level === RiskLevel.HIGH && assessment.factors.some(f => f.severity >= 8));
  }

  private calculateBaseScore(change: CodeChange): number {
    let baseScore = 0;

    for (const rule of RISK_RULES) {
      if (rule.condition(change)) {
        baseScore += rule.severity;
      }
    }

    if (change.isAuthorization) {
      baseScore += 15;
    }

    if (change.isAuthentication) {
      baseScore += 20;
    }

    if (change.isPayment) {
      baseScore += 20;
    }

    if (change.isDatabaseMigration) {
      baseScore += 15;
    }

    if (this.affectsCriticalPath(change.affectedAreas)) {
      baseScore += 10;
    }

    return baseScore;
  }

  private getScopeMultiplier(scope: string): number {
    return SCOPE_MULTIPLIERS[scope] || 1;
  }

  private getAffectedAreaMultiplier(affectedAreas: string[]): number {
    const criticalCount = affectedAreas.filter(area =>
      CRITICAL_AREAS.some(critical => area.toLowerCase().includes(critical))
    ).length;

    if (criticalCount > 0) {
      return 2;
    }

    const hasCommonDependencies = affectedAreas.some(area =>
      area.includes('common') ||
      area.includes('shared') ||
      area.includes('util')
    );

    if (hasCommonDependencies) {
      return 1.5;
    }

    return 1;
  }

  private determineRiskLevel(score: number): RiskLevel {
    if (score >= 80) {
      return RiskLevel.CRITICAL;
    } else if (score >= 55) {
      return RiskLevel.HIGH;
    } else if (score >= 30) {
      return RiskLevel.MEDIUM;
    }
    return RiskLevel.LOW;
  }

  private async identifyRiskFactors(change: CodeChange): Promise<RiskFactor[]> {
    const factors: RiskFactor[] = [];

    for (const rule of RISK_RULES) {
      if (rule.condition(change)) {
        const evidence = this.generateEvidence(change, rule);
        factors.push({
          name: rule.message,
          message: rule.message,
          severity: rule.severity,
          mitigation: rule.mitigation,
          evidence
        });
      }
    }

    const criticalPatterns = this.detectCriticalPatterns(change);
    for (const pattern of criticalPatterns) {
      if (!factors.some(f => f.name.includes(pattern.name))) {
        factors.push({
          name: pattern.message,
          message: pattern.message,
          severity: pattern.severity,
          mitigation: pattern.mitigation,
          evidence: `File ${change.file} matches critical pattern: ${pattern.name}`
        });
      }
    }

    return factors.sort((a, b) => b.severity - a.severity);
  }

  private generateEvidence(change: CodeChange, _rule: RiskRule): string {
    const parts: string[] = [];

    parts.push(`File: ${change.file}`);
    parts.push(`Type: ${change.type}`);
    parts.push(`Scope: ${change.scope}`);

    if (change.changeSize > 0) {
      parts.push(`Size: ${change.changeSize} lines`);
    }

    if (change.affectedAreas.length > 0) {
      parts.push(`Affected areas: ${change.affectedAreas.join(', ')}`);
    }

    return parts.join(' | ');
  }

  private detectCriticalPatterns(change: CodeChange): Array<{name: string; severity: number; message: string; mitigation: string}> {
    const patterns: Array<{name: string; severity: number; message: string; mitigation: string}> = [];
    const fileName = change.file.toLowerCase();

    for (const pattern of CRITICAL_PATTERNS) {
      if (pattern.test(fileName)) {
        const match = pattern.source.match(/[a-z]+/i)?.[0] || 'critical';
        patterns.push({
          name: `${match} related file`,
          severity: 8,
          message: `File appears to be ${match}-related`,
          mitigation: `Ensure changes to ${match} functionality are thoroughly tested.`
        });
      }
    }

    return patterns;
  }

  private affectsCriticalPath(affectedAreas: string[]): boolean {
    return affectedAreas.some(area =>
      CRITICAL_PATTERNS.some(pattern => pattern.test(area))
    );
  }

  private isCriticalChange(change: CodeChange): boolean {
    return change.isAuthentication ||
           change.isPayment ||
           change.isAuthorization ||
           change.isDatabaseMigration ||
           change.scope === 'architecture';
  }

  private requiresApproval(level: RiskLevel): boolean {
    return level === RiskLevel.HIGH || level === RiskLevel.CRITICAL;
  }

  private requiresCodeReview(level: RiskLevel, change: CodeChange): boolean {
    if (level === RiskLevel.LOW && change.scope === 'single_line') {
      return false;
    }
    return level !== RiskLevel.LOW || change.type !== 'creation';
  }

  private suggestReviewer(change: CodeChange): string | undefined {
    for (const area of change.affectedAreas) {
      const lowerArea = area.toLowerCase();
      for (const [key, reviewer] of Object.entries(REVIEWER_SUGGESTIONS)) {
        if (lowerArea.includes(key)) {
          return reviewer;
        }
      }
    }

    if (change.isPayment) {
      return 'Payment Specialist';
    }
    if (change.isAuthentication) {
      return 'Senior Security Engineer';
    }
    if (change.scope === 'architecture') {
      return 'Principal Architect';
    }

    return undefined;
  }

  private estimateRollbackTime(change: CodeChange): string {
    const baseTime = 5;

    if (change.scope === 'architecture') {
      return `${baseTime + 30}-${baseTime + 60} minutes`;
    }
    if (change.scope === 'module') {
      return `${baseTime + 15}-${baseTime + 30} minutes`;
    }
    if (change.type === 'deletion') {
      return `${baseTime + 10}-${baseTime + 20} minutes`;
    }

    return `${baseTime}-${baseTime + 10} minutes`;
  }

  private assessRollbackImpact(change: CodeChange): { dataImpact: string; userImpact: string } {
    let dataImpact: string;
    let userImpact: string;

    if (change.isDatabaseMigration) {
      dataImpact = 'High - Database schema and data may be affected';
      userImpact = 'High - Users may experience temporary service disruption';
    } else if (change.isPayment) {
      dataImpact = 'Medium - Payment records may need reconciliation';
      userImpact = 'Medium - Payment processing may be temporarily unavailable';
    } else if (change.scope === 'architecture') {
      dataImpact = 'Medium - Multiple services may be affected';
      userImpact = 'Medium - Multiple features may be impacted';
    } else if (change.type === 'deletion') {
      dataImpact = 'Low - No data loss expected';
      userImpact = 'Low - Feature unavailability until redeployment';
    } else {
      dataImpact = 'Low - Changes are reversible';
      userImpact = 'Low - Minimal user impact expected';
    }

    return { dataImpact, userImpact };
  }

  private storeAlerts(sessionId: string, alerts: RiskAlert[]): void {
    const existing = this.alertStore.get(sessionId) || [];
    this.alertStore.set(sessionId, [...existing, ...alerts]);
  }

  clearSessionAlerts(sessionId: string): void {
    this.alertStore.delete(sessionId);
  }
}

export const riskAssessmentEngine = new RiskAssessmentEngine();
