import { ExtendedProtocolMetadata } from '../types/protocol-frontmatter.js';
import { Finding, StandardResult } from '../types/execution.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager, ProjectContext } from '../types/project-context.js';

export interface WorkflowDecision {
  nextProtocol?: string;
  alternatives: string[];
  reason: string;
  confidence: number;
  escalate: boolean;
  escalateTo?: string;
}

export interface ExecutionBranch {
  condition: string;
  protocols: string[];
  skipIfAlreadyRun: boolean;
}

export interface AdaptiveWorkflow {
  taskDescription: string;
  initialProtocol: string;
  branches: ExecutionBranch[];
  fallbacks: Record<string, string[]>;
  escalationThresholds: EscalationThreshold[];
  maxIterations: number;
  estimatedTime: string;
}

export interface EscalationThreshold {
  condition: string;
  escalateTo: string;
  reason: string;
  requiresUserApproval: boolean;
}

export interface Task {
  description: string;
  type: 'debug' | 'build' | 'refactor' | 'audit' | 'optimize' | 'test' | 'setup' | 'document' | 'unknown';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requirements?: string[];
}

const TASK_TYPE_MAPPING: Record<string, string[]> = {
  debug: ['debug_protocol', 'error_fix_protocol', 'test_automation_protocol', 'code_review_protocol'],
  build: ['codebase_indexing_protocol', 'best_practices_protocol', 'test_automation_protocol', 'code_review_protocol'],
  refactor: ['codebase_indexing_protocol', 'mdap_protocol', 'refactor_protocol', 'test_automation_protocol', 'code_review_protocol'],
  audit: ['bigpappa_protocol_reviewANDfixes', 'security_audit_protocol', 'code_review_protocol', 'performance_protocol'],
  optimize: ['codebase_indexing_protocol', 'performance_protocol', 'test_automation_protocol', 'code_review_protocol'],
  test: ['test_automation_protocol', 'code_review_protocol'],
  setup: ['best_practices_protocol', 'git_workflow_protocol'],
  document: ['best_practices_protocol', 'code_review_protocol'],
  unknown: ['MASTER_PROTOCOL']
};

export class WorkflowEngine {
  private protocols: Map<string, ExtendedProtocolMetadata>;
  private metricsCollector: Map<string, { successRate: number; avgExecutionTime: number }>;

  constructor(protocols: ExtendedProtocolMetadata[]) {
    this.protocols = new Map();
    for (const protocol of protocols) {
      this.protocols.set(protocol.name, protocol);
    }
    this.metricsCollector = new Map();
  }

  buildAdaptiveWorkflow(
    task: Task,
    context: ProjectContext,
    _previousResults?: StandardResult[]
  ): AdaptiveWorkflow {
    const taskType = task.type;
    const initialProtocols = TASK_TYPE_MAPPING[taskType] || TASK_TYPE_MAPPING['unknown'];
    const initialProtocol = initialProtocols[0];

    const branches: ExecutionBranch[] = this.generateBranches(taskType, context);
    const fallbacks: Record<string, string[]> = this.generateFallbacks(taskType);
    const escalationThresholds = this.generateEscalationThresholds(taskType);

    return {
      taskDescription: task.description,
      initialProtocol,
      branches,
      fallbacks,
      escalationThresholds,
      maxIterations: this.calculateMaxIterations(task),
      estimatedTime: this.estimateTime(taskType, context)
    };
  }

  async executeStep(
    step: { protocolName: string },
    _session: { sessionId: string; executedProtocols: string[] }
  ): Promise<{ result: StandardResult; decision: WorkflowDecision }> {
    const protocol = this.protocols.get(step.protocolName);

    if (!protocol) {
      return {
        result: this.createEmptyResult(step.protocolName),
        decision: {
          alternatives: [],
          reason: `Protocol ${step.protocolName} not found`,
          confidence: 0,
          escalate: false
        }
      };
    }

    const metrics = this.metricsCollector.get(step.protocolName);
    const suggestedNextSteps = protocol.prerequisites.length > 0
      ? protocol.prerequisites.map(p => ({
        stepId: `step-${Date.now()}`,
        protocolName: p,
        action: `Execute ${p}`,
        reason: 'Required prerequisite',
        optional: false
      }))
      : [];

    const result: StandardResult = {
      protocolName: step.protocolName,
      executionTime: metrics?.avgExecutionTime || 1000,
      timestamp: new Date(),
      success: true,
      findings: [],
      recommendations: [],
      artifacts: [],
      nextSteps: suggestedNextSteps,
      metrics: {
        protocolName: step.protocolName,
        executionTime: metrics?.avgExecutionTime || 1000,
        cacheHits: 0,
        cacheMisses: 1,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };

    const decision: WorkflowDecision = {
      nextProtocol: suggestedNextSteps[0]?.protocolName,
      alternatives: this.getAlternatives(step.protocolName),
      reason: 'Protocol executed successfully',
      confidence: metrics?.successRate || 0.8,
      escalate: false
    };

    return { result, decision };
  }

  async analyzeResultsAndAdapt(
    result: StandardResult,
    workflow: AdaptiveWorkflow,
    executedProtocols: string[]
  ): Promise<WorkflowDecision> {
    if (result.errors && result.errors.length > 0) {
      return this.handleError(result, workflow, executedProtocols);
    }

    if (await this.isGoalReached(result, { description: workflow.taskDescription, type: 'unknown', priority: 'medium' })) {
      return {
        alternatives: [],
        reason: 'Goal reached - task completed successfully',
        confidence: 1,
        escalate: false
      };
    }

    const findings = result.findings;
    const findingsCount = findings.length;
    const criticalFindings = findings.filter(f => f.severity === 'critical').length;

    for (const branch of workflow.branches) {
      let conditionMet = false;

      if (branch.condition === 'hasFrontendFindings') {
        conditionMet = findings.some(f =>
          ['ui', 'frontend', 'react', 'vue', 'css', 'html'].some(keyword =>
            f.category.toLowerCase().includes(keyword) || f.title.toLowerCase().includes(keyword)
          )
        );
      } else if (branch.condition === 'hasBackendFindings') {
        conditionMet = findings.some(f =>
          ['api', 'backend', 'database', 'server'].some(keyword =>
            f.category.toLowerCase().includes(keyword) || f.title.toLowerCase().includes(keyword)
          )
        );
      } else if (branch.condition.startsWith('findingsCount')) {
        try {
          conditionMet = new Function('findingsCount', `return ${branch.condition}`)(findingsCount);
        } catch {
          conditionMet = false;
        }
      } else if (branch.condition.startsWith('criticalFindings')) {
        try {
          conditionMet = new Function('criticalFindings', `return ${branch.condition}`)(criticalFindings);
        } catch {
          conditionMet = false;
        }
      }

      if (conditionMet) {
        const availableBranchProtocols = branch.protocols.filter(p => !executedProtocols.includes(p) || !branch.skipIfAlreadyRun);
        if (availableBranchProtocols.length > 0) {
          return {
            nextProtocol: availableBranchProtocols[0],
            alternatives: availableBranchProtocols.slice(1),
            reason: `Branch condition met: ${branch.condition}`,
            confidence: 0.8,
            escalate: false
          };
        }
      }
    }

    const escalationDecision = await this.escalateIfNeeded(
      findings,
      executedProtocols,
      workflow
    );

    if (escalationDecision.shouldEscalate) {
      return {
        escalate: true,
        escalateTo: escalationDecision.escalateTo,
        reason: escalationDecision.reason || 'Escalation required',
        confidence: 0.9,
        alternatives: []
      };
    }

    const nextProtocol = await this.selectNextProtocol(
      findings,
      this.getAvailableProtocols(workflow),
      executedProtocols,
      { language: Language.Unknown, framework: Framework.None, projectType: ProjectType.Unknown, testFramework: TestFramework.Unknown, packageManager: PackageManager.Unknown, hasDocker: false, hasCI: false, hasGit: false, dependencies: [], devDependencies: [], detected: false }
    );

    return {
      nextProtocol: nextProtocol.protocol,
      alternatives: this.getAlternatives(nextProtocol.protocol),
      reason: nextProtocol.reason,
      confidence: nextProtocol.confidence,
      escalate: false
    };
  }

  async escalateIfNeeded(
    findings: Finding[],
    executedProtocols: string[],
    workflow: AdaptiveWorkflow
  ): Promise<{
    shouldEscalate: boolean;
    escalateTo?: string;
    reason?: string;
    requiresApproval: boolean;
  }> {
    const criticalFindings = findings.filter(f => f.severity === 'critical' || f.severity === 'high');

    for (const threshold of workflow.escalationThresholds) {
      if (this.evaluateBranchCondition(threshold.condition, findings, executedProtocols)) {
        return {
          shouldEscalate: true,
          escalateTo: threshold.escalateTo,
          reason: threshold.reason,
          requiresApproval: threshold.requiresUserApproval
        };
      }
    }

    if (criticalFindings.length >= 3) {
      return {
        shouldEscalate: true,
        escalateTo: 'MDAP',
        reason: 'Multiple critical/high findings detected - MDAP decomposition recommended',
        requiresApproval: true
      };
    }

    return { shouldEscalate: false, requiresApproval: false };
  }

  async selectNextProtocol(
    findings: Finding[],
    availableProtocols: string[],
    usedProtocols: string[],
    _context: ProjectContext
  ): Promise<{
    protocol: string;
    reason: string;
    confidence: number;
  }> {
    const protocolScores: { protocol: string; score: number; reason: string }[] = [];

    for (const protocolName of availableProtocols) {
      if (usedProtocols.includes(protocolName)) continue;

      const protocol = this.protocols.get(protocolName);
      if (!protocol) continue;

      let score = 0;
      let reason = '';

      const relevanceScore = this.calculateRelevanceScore(findings, protocol);
      score += relevanceScore.score;
      reason = relevanceScore.reason;

      const complementarityBonus = this.calculateComplementarityBonus(protocol, usedProtocols);
      score += complementarityBonus;

      const prerequisitesMet = this.checkPrerequisitesMet(protocol, usedProtocols);
      if (!prerequisitesMet) continue;

      const metricsBonus = this.calculateMetricsBonus(protocolName);
      score += metricsBonus;

      protocolScores.push({ protocol: protocolName, score, reason: reason || 'Protocol relevant to findings' });
    }

    if (protocolScores.length === 0) {
      return {
        protocol: 'MASTER_PROTOCOL',
        reason: 'No suitable protocol found - falling back to MASTER_PROTOCOL',
        confidence: 0.3
      };
    }

    protocolScores.sort((a, b) => b.score - a.score);

    const best = protocolScores[0];
    return {
      protocol: best.protocol,
      reason: best.reason,
      confidence: Math.min(best.score / 100, 0.95)
    };
  }

  async isGoalReached(result: StandardResult, _task: Task): Promise<boolean> {
    if (!result.success) return false;

    const hasCriticalFindings = result.findings.some(f => f.severity === 'critical');
    if (hasCriticalFindings) return false;

    const hasHighPriorityRecommendations = result.recommendations.some(r => r.priority === 'critical' || r.priority === 'high');
    if (hasHighPriorityRecommendations) return false;

    if (result.nextSteps.length === 0) return true;

    const allOptional = result.nextSteps.every(step => step.optional);
    return allOptional;
  }

  updateMetrics(protocolName: string, success: boolean, executionTime: number): void {
    const existing = this.metricsCollector.get(protocolName) || { successRate: 0.8, avgExecutionTime: executionTime };

    const newSuccessRate = existing.successRate * 0.7 + (success ? 1 : 0) * 0.3;
    const newAvgExecutionTime = existing.avgExecutionTime * 0.7 + executionTime * 0.3;

    this.metricsCollector.set(protocolName, {
      successRate: newSuccessRate,
      avgExecutionTime: newAvgExecutionTime
    });
  }

  private generateBranches(taskType: string, context: ProjectContext): ExecutionBranch[] {
    const branches: ExecutionBranch[] = [];

    if (['audit', 'optimize', 'refactor', 'build'].includes(taskType)) {
      branches.push({
        condition: 'findingsCount > 5',
        protocols: ['code_review_protocol'],
        skipIfAlreadyRun: true
      });
    }

    if (taskType === 'audit' || taskType === 'refactor') {
      branches.push({
        condition: 'findingsCount > 10',
        protocols: ['security_audit_protocol'],
        skipIfAlreadyRun: true
      });
    }

    if (context.projectType === 'frontend') {
      branches.push({
        condition: 'hasFrontendFindings',
        protocols: ['moreFRONTend-PROTOCOL'],
        skipIfAlreadyRun: true
      });
    }

    if (context.projectType === 'fullstack') {
      branches.push({
        condition: 'hasBackendFindings',
        protocols: ['FRONTandBACKend-PROTOCOL'],
        skipIfAlreadyRun: true
      });
    }

    return branches;
  }

  private generateFallbacks(_taskType: string): Record<string, string[]> {
    const fallbacks: Record<string, string[]> = {
      debug_protocol: ['error_fix_protocol', 'test_automation_protocol'],
      mdap_protocol: ['refactor_protocol', 'code_review_protocol'],
      performance_protocol: ['codebase_indexing_protocol', 'test_automation_protocol'],
      security_audit_protocol: ['bigpappa_protocol_reviewANDfixes', 'code_review_protocol'],
      default: ['MASTER_PROTOCOL']
    };

    return fallbacks;
  }

  private generateEscalationThresholds(_taskType: string): EscalationThreshold[] {
    const thresholds: EscalationThreshold[] = [
      {
        condition: 'criticalFindings >= 3',
        escalateTo: 'MDAP',
        reason: 'Multiple critical findings detected',
        requiresUserApproval: true
      },
      {
        condition: 'executionTime > 300000',
        escalateTo: 'MASTER',
        reason: 'Execution exceeding 5 minutes',
        requiresUserApproval: false
      }
    ];

    return thresholds;
  }

  private calculateMaxIterations(task: Task): number {
    const baseIterations = 5;
    const priorityMultiplier = task.priority === 'critical' ? 2 : task.priority === 'high' ? 1.5 : 1;
    return Math.min(Math.floor(baseIterations * priorityMultiplier), 10);
  }

  private estimateTime(taskType: string, context: ProjectContext): string {
    const baseTimeMinutes: Record<string, number> = {
      debug: 30,
      build: 60,
      refactor: 120,
      audit: 90,
      optimize: 60,
      test: 45,
      setup: 30,
      document: 20,
      unknown: 45
    };

    let time = baseTimeMinutes[taskType] || 45;

    if (context.projectType === 'fullstack') {
      time *= 1.5;
    }

    if (context.hasCI) {
      time *= 0.8;
    }

    if (time <= 30) return '< 30 minutes';
    if (time <= 60) return '30-60 minutes';
    if (time <= 120) return '1-2 hours';
    return '2+ hours';
  }

  private handleError(
    result: StandardResult,
    workflow: AdaptiveWorkflow,
    executedProtocols: string[]
  ): WorkflowDecision {
    for (const [protocol, fallbacks] of Object.entries(workflow.fallbacks)) {
      const protocolHasRun = executedProtocols.includes(protocol);
      const currentProtocolMatches = protocol === workflow.initialProtocol && executedProtocols.length === 0;

      if (protocolHasRun || currentProtocolMatches) {
        for (const fallback of fallbacks) {
          if (!executedProtocols.includes(fallback)) {
            return {
              nextProtocol: fallback,
              alternatives: fallbacks.filter(f => f !== fallback),
              reason: `Error in ${protocol} - falling back to ${fallback}`,
              confidence: 0.5,
              escalate: false
            };
          }
        }
      }
    }

    return {
      alternatives: [],
      reason: `Error occurred: ${result.errors?.[0]?.message || 'Unknown error'}`,
      confidence: 0,
      escalate: true,
      escalateTo: 'MASTER'
    };
  }

  private evaluateBranchCondition(condition: string, findings: Finding[], executedProtocols: string[]): boolean {
    const findingsCount = findings.length;
    const criticalFindings = findings.filter(f => f.severity === 'critical').length;
    const highFindings = findings.filter(f => f.severity === 'high').length;

    if (condition === 'hasFrontendFindings') {
      return findings.some(f => ['ui', 'frontend', 'react', 'vue', 'css', 'html'].some(keyword =>
        f.category.toLowerCase().includes(keyword) || f.title.toLowerCase().includes(keyword)
      ));
    }

    if (condition === 'hasBackendFindings') {
      return findings.some(f => ['api', 'backend', 'database', 'server'].some(keyword =>
        f.category.toLowerCase().includes(keyword) || f.title.toLowerCase().includes(keyword)
      ));
    }

    try {
      const evalResult = new Function('findingsCount', 'criticalFindings', 'highFindings', 'executedProtocols', `
        return ${condition};
      `)(findingsCount, criticalFindings, highFindings, executedProtocols);

      return evalResult;
    } catch {
      return false;
    }
  }

  private calculateRelevanceScore(findings: Finding[], protocol: ExtendedProtocolMetadata): { score: number; reason: string } {
    let score = 0;
    let reason = '';

    const protocolName = protocol.name.toLowerCase();
    const protocolTags = new Set([
      ...protocol.tags.map(t => t.toLowerCase()),
      ...protocol.platformTags.map(t => t.toLowerCase())
    ]);

    for (const finding of findings) {
      const findingCategory = finding.category.toLowerCase();
      const findingTags = finding.tags?.map(t => t.toLowerCase()) || [];
      const findingTitle = finding.title.toLowerCase();
      const findingDescription = finding.description.toLowerCase();

      for (const tag of protocolTags) {
        if (findingCategory.includes(tag) ||
            findingTags.some(t => t.includes(tag)) ||
            findingTitle.includes(tag) ||
            findingDescription.includes(tag)) {
          score += 10;
          reason = `Protocol matches finding: ${finding.title}`;
        }
      }

      if (protocolName.includes(findingCategory) || findingCategory.includes(protocolName.replace('_', ''))) {
        score += 15;
        reason = `Protocol ${protocol.name} directly matches finding category: ${findingCategory}`;
      }

      if (protocolName === 'performance_protocol' && findingCategory === 'performance') {
        score += 25;
        reason = 'Performance protocol perfectly matches performance findings';
      }

      if (protocolName === 'security_audit_protocol' && findingCategory === 'security') {
        score += 25;
        reason = 'Security audit protocol perfectly matches security findings';
      }

      if (protocolName === 'debug_protocol' && ['error', 'bug', 'issue'].some(keyword =>
        findingTitle.includes(keyword) || findingDescription.includes(keyword)
      )) {
        score += 20;
        reason = 'Debug protocol matches debugging findings';
      }
    }

    if (findings.length === 0) {
      score = 5;
      reason = 'No findings - baseline score';
    }

    return { score, reason };
  }

  private calculateComplementarityBonus(protocol: ExtendedProtocolMetadata, usedProtocols: string[]): number {
    const worksWith = protocol.worksWellWith || [];
    let bonus = 0;

    for (const related of worksWith) {
      if (usedProtocols.includes(related)) {
        bonus += 5;
      }
    }

    return bonus;
  }

  private checkPrerequisitesMet(protocol: ExtendedProtocolMetadata, usedProtocols: string[]): boolean {
    const prerequisites = protocol.prerequisites || [];
    return prerequisites.every(p => usedProtocols.includes(p));
  }

  private calculateMetricsBonus(protocolName: string): number {
    const metrics = this.metricsCollector.get(protocolName);
    if (!metrics) return 2;

    const successBonus = metrics.successRate * 2;
    const speedBonus = Math.max(0, 5 - metrics.avgExecutionTime / 60000);

    return successBonus + speedBonus;
  }

  private getAlternatives(protocolName: string): string[] {
    const protocol = this.protocols.get(protocolName);
    if (!protocol) return [];

    return protocol.worksWellWith || [];
  }

  private getAvailableProtocols(workflow: AdaptiveWorkflow): string[] {
    const protocols = new Set<string>();

    protocols.add(workflow.initialProtocol);

    for (const branch of workflow.branches) {
      for (const protocol of branch.protocols) {
        protocols.add(protocol);
      }
    }

    for (const fallbacks of Object.values(workflow.fallbacks)) {
      for (const protocol of fallbacks) {
        protocols.add(protocol);
      }
    }

    for (const threshold of workflow.escalationThresholds) {
      protocols.add(threshold.escalateTo);
    }

    return Array.from(protocols);
  }

  private createEmptyResult(protocolName: string): StandardResult {
    return {
      protocolName,
      executionTime: 0,
      timestamp: new Date(),
      success: false,
      findings: [],
      recommendations: [],
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName,
        executionTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: false
      },
      errors: [{
        errorId: `err-${Date.now()}`,
        errorType: 'PROTOCOL_NOT_FOUND',
        message: `Protocol ${protocolName} not found`,
        recoverable: true,
        timestamp: new Date()
      }]
    };
  }
}
