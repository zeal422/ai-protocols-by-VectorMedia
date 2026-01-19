import {
  StandardResult,
  Finding,
  Recommendation,
  NextStep,
  AggregatedResult,
  ArtifactReference,
  ArtifactType
} from '../types/execution.js';
import { ProjectContext } from '../types/project-context.js';
import { v4 as uuidv4 } from 'uuid';

export interface ExecutionContext {
  sessionId: string;
  projectContext: ProjectContext;
  protocolCount: number;
  findingsSoFar: Finding[];
}

interface ProtocolResult {
  findings?: unknown[];
  recommendations?: unknown[];
  artifacts?: unknown[];
  nextSteps?: unknown[];
  executionTime?: number;
  success?: boolean;
  errors?: unknown[];
  warnings?: unknown[];
  testResults?: unknown[];
  vulnerabilities?: unknown[];
  bottlenecks?: unknown[];
  issues?: unknown[];
}

export class ResultNormalizer {
  private adapterMap: Map<string, ProtocolAdapter>;

  constructor() {
    this.adapterMap = new Map<string, ProtocolAdapter>([
      ['debug_protocol', new DebugProtocolAdapter()],
      ['code_review_protocol', new CodeReviewProtocolAdapter()],
      ['test_automation_protocol', new TestAutomationProtocolAdapter()],
      ['security_audit_protocol', new SecurityAuditProtocolAdapter()],
      ['performance_protocol', new PerformanceProtocolAdapter()],
      ['refactor_protocol', new RefactorProtocolAdapter()],
      ['accessibility_protocol', new AccessibilityProtocolAdapter()]
    ]);
  }

  async normalizeProtocolResult(
    protocolName: string,
    result: unknown
  ): Promise<StandardResult> {
    const adapter = this.adapterMap.get(protocolName);

    if (!adapter) {
      return this.genericNormalize(protocolName, result);
    }

    return adapter.adapt(result);
  }

  async aggregateResults(results: StandardResult[]): Promise<AggregatedResult> {
    if (results.length === 0) {
      throw new Error('No results to aggregate');
    }

    const allFindings = results.flatMap(r => r.findings);
    const allRecommendations = results.flatMap(r => r.recommendations);
    const allNextSteps = results.flatMap(r => r.nextSteps);

    const totalDuration = results.reduce((sum, r) => sum + r.executionTime, 0);
    const successCount = results.filter(r => r.success).length;
    const totalCacheHits = results.reduce((sum, r) => sum + r.metrics.cacheHits, 0);
    const totalCacheMisses = results.reduce((sum, r) => sum + r.metrics.cacheMisses, 0);
    const peakMemoryUsage = Math.max(...results.map(r => r.metrics.memoryUsage));

    const aggregatedMetrics = {
      protocolsExecuted: results.length,
      totalDuration,
      averageProtocolDuration: totalDuration / results.length,
      totalCacheHits,
      totalCacheMisses,
      overallCacheHitRate: totalCacheHits / (totalCacheHits + totalCacheMisses),
      peakMemoryUsage,
      successRate: successCount / results.length
    };

    return {
      sessionId: '',
      taskDescription: '',
      protocolsExecuted: results.length,
      totalDuration,
      findings: allFindings,
      recommendations: allRecommendations,
      summary: this.generateSummary(results, aggregatedMetrics),
      nextSteps: this.prioritizeNextSteps(allNextSteps, allFindings),
      metrics: aggregatedMetrics
    };
  }

  extractFindings(result: StandardResult): Finding[] {
    return result.findings;
  }

  suggestNextSteps(
    result: StandardResult,
    _context: ExecutionContext
  ): NextStep[] {
    const nextSteps: NextStep[] = [];

    if (result.findings.some(f => f.severity === 'critical')) {
      nextSteps.push({
        stepId: uuidv4(),
        protocolName: 'debug_protocol',
        trigger: 'DEEPDIVE',
        action: 'Debug critical findings',
        reason: 'Critical issues require immediate investigation',
        optional: false,
        estimatedEffort: '1-2 hours'
      });
    }

    if (result.recommendations.length > 0) {
      nextSteps.push({
        stepId: uuidv4(),
        action: 'Apply recommendations',
        reason: `${result.recommendations.length} recommendations pending`,
        optional: true,
        estimatedEffort: '2-4 hours'
      });
    }

    if (result.warnings && result.warnings.length > 0) {
      nextSteps.push({
        stepId: uuidv4(),
        action: 'Review warnings',
        reason: `${result.warnings.length} warnings detected`,
        optional: true,
        estimatedEffort: '30 minutes'
      });
    }

    return nextSteps;
  }

  validateResult(result: StandardResult): boolean {
    return (
      typeof result.protocolName === 'string' &&
      typeof result.executionTime === 'number' &&
      result.executionTime >= 0 &&
      Array.isArray(result.findings) &&
      Array.isArray(result.recommendations) &&
      Array.isArray(result.artifacts) &&
      Array.isArray(result.nextSteps) &&
      typeof result.success === 'boolean'
    );
  }

  private genericNormalize(protocolName: string, result: unknown): StandardResult {
    if (typeof result === 'object' && result !== null) {
      const r = result as ProtocolResult;

      if (r.findings && Array.isArray(r.findings)) {
        return this.toStandardResult(protocolName, r);
      }
    }

    return this.toStandardResult(protocolName, {});
  }

  private toStandardResult(protocolName: string, result: ProtocolResult): StandardResult {
    return {
      protocolName,
      executionTime: result.executionTime || 0,
      timestamp: new Date(),
      success: result.success !== false,
      findings: (result.findings || []).map((f) => this.normalizeFinding(f)),
      recommendations: (result.recommendations || []).map((r) => this.normalizeRecommendation(r)),
      artifacts: (result.artifacts || []).map((a) => this.normalizeArtifact(a)),
      nextSteps: (result.nextSteps || []).map((n) => this.normalizeNextStep(n)),
      metrics: {
        protocolName,
        executionTime: result.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: result.success !== false
      },
      errors: result.errors as StandardResult['errors'],
      warnings: result.warnings as StandardResult['warnings']
    };
  }

  private normalizeFinding(finding: unknown): Finding {
    const f = finding as Record<string, unknown>;
    return {
      findingId: (f.id as string) || uuidv4(),
      severity: (f.severity as Finding['severity']) || 'info',
      category: (f.category as string) || 'general',
      title: (f.title as string) || 'Untitled Finding',
      description: (f.description as string) || '',
      location: f.location as string | undefined,
      codeSnippet: f.codeSnippet as string | undefined,
      impact: f.impact as string | undefined,
      evidence: f.evidence as string[] | undefined,
      tags: (f.tags as string[]) || []
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || (r.title as string) || 'No action specified',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      impact: r.impact as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }

  private normalizeArtifact(artifact: unknown): ArtifactReference {
    const a = artifact as Record<string, unknown>;
    return {
      artifactId: (a.id as string) || (a.artifactId as string) || uuidv4(),
      artifactType: (a.type as ArtifactType) || (a.artifactType as ArtifactType) || 'other',
      description: (a.description as string) || '',
      relevanceScore: a.relevanceScore as number | undefined
    };
  }

  private normalizeNextStep(step: unknown): NextStep {
    const s = step as Record<string, unknown>;
    return {
      stepId: (s.id as string) || (s.stepId as string) || uuidv4(),
      protocolName: s.protocolName as string | undefined,
      trigger: s.trigger as string | undefined,
      action: (s.action as string) || '',
      reason: (s.reason as string) || '',
      optional: s.optional !== false,
      estimatedEffort: s.estimatedEffort as string | undefined
    };
  }

  private generateSummary(
    results: StandardResult[],
    metrics: AggregatedResult['metrics']
  ): string {
    const protocols = results.map(r => r.protocolName).join(', ');
    const findingsCount = results.reduce((sum, r) => sum + r.findings.length, 0);
    const criticalFindings = results.reduce(
      (sum, r) => sum + r.findings.filter(f => f.severity === 'critical').length,
      0
    );

    return `Executed ${results.length} protocols (${protocols}) in ${Math.round(metrics.totalDuration / 1000)}s. Found ${findingsCount} findings, including ${criticalFindings} critical issues.`;
  }

  private prioritizeNextSteps(nextSteps: NextStep[], _findings: Finding[]): NextStep[] {
    const criticalSteps = nextSteps.filter(s => !s.optional);
    const optionalSteps = nextSteps.filter(s => s.optional);

    const prioritizedOptional = optionalSteps.sort((a, b) => {
      const aHasCritical = a.reason?.toLowerCase().includes('critical') ? 0 : 1;
      const bHasCritical = b.reason?.toLowerCase().includes('critical') ? 0 : 1;
      return aHasCritical - bHasCritical;
    });

    return [...criticalSteps, ...prioritizedOptional];
  }
}

interface ProtocolAdapter {
  adapt(result: unknown): StandardResult;
}

class DebugProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'debug_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: r.success !== false,
      findings: (r.findings || []).map((f) => this.normalizeFinding(f)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'debug_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: r.success !== false
      }
    };
  }

  private normalizeFinding(finding: unknown): Finding {
    const f = finding as Record<string, unknown>;
    return {
      findingId: (f.id as string) || uuidv4(),
      severity: (f.severity as Finding['severity']) || 'info',
      category: (f.category as string) || 'debug',
      title: (f.title as string) || 'Debug Finding',
      description: (f.description as string) || '',
      location: f.location as string | undefined,
      codeSnippet: f.codeSnippet as string | undefined,
      impact: f.impact as string | undefined,
      evidence: f.evidence as string[] | undefined,
      tags: ['debug', ...((f.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Fix issue',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      impact: r.impact as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class CodeReviewProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'code_review_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: true,
      findings: (r.findings || []).map((f) => this.normalizeFinding(f)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'code_review_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };
  }

  private normalizeFinding(finding: unknown): Finding {
    const f = finding as Record<string, unknown>;
    return {
      findingId: (f.id as string) || uuidv4(),
      severity: (f.severity as Finding['severity']) || 'medium',
      category: (f.category as string) || 'code_review',
      title: (f.title as string) || 'Code Review Finding',
      description: (f.description as string) || '',
      location: f.location as string | undefined,
      codeSnippet: f.codeSnippet as string | undefined,
      impact: f.impact as string | undefined,
      tags: ['code_review', ...((f.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Refactor code',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      impact: r.impact as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class TestAutomationProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'test_automation_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: r.success !== false,
      findings: (r.testResults || []).map((t) => this.normalizeTestFinding(t)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'test_automation_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: r.success !== false
      }
    };
  }

  private normalizeTestFinding(test: unknown): Finding {
    const t = test as Record<string, unknown>;
    return {
      findingId: (t.id as string) || uuidv4(),
      severity: (t.status as string) === 'failed' ? 'high' : 'medium',
      category: 'test',
      title: `Test: ${t.name || 'Unknown'}`,
      description: (t.message as string) || 'Test result',
      location: t.file as string | undefined,
      codeSnippet: t.code as string | undefined,
      impact: (t.status as string) === 'failed' ? 'Test failure' : 'Test passes',
      tags: ['test']
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Write test',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class SecurityAuditProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'security_audit_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: true,
      findings: (r.vulnerabilities || []).map((v) => this.normalizeVulnerability(v)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'security_audit_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };
  }

  private normalizeVulnerability(vuln: unknown): Finding {
    const v = vuln as Record<string, unknown>;
    return {
      findingId: (v.id as string) || uuidv4(),
      severity: (v.severity as Finding['severity']) || 'high',
      category: 'security',
      title: (v.name as string) || 'Security Issue',
      description: (v.description as string) || '',
      location: v.location as string | undefined,
      impact: v.impact as string | undefined,
      tags: ['security', ...((v.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'high',
      action: (r.action as string) || 'Fix vulnerability',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class PerformanceProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'performance_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: true,
      findings: (r.bottlenecks || []).map((b) => this.normalizeBottleneck(b)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'performance_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };
  }

  private normalizeBottleneck(bottleneck: unknown): Finding {
    const b = bottleneck as Record<string, unknown>;
    return {
      findingId: (b.id as string) || uuidv4(),
      severity: (b.severity as Finding['severity']) || 'medium',
      category: 'performance',
      title: (b.name as string) || 'Performance Issue',
      description: (b.description as string) || '',
      location: b.location as string | undefined,
      impact: b.impact as string | undefined,
      tags: ['performance', ...((b.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Optimize code',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class RefactorProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'refactor_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: r.success !== false,
      findings: (r.issues || []).map((i) => this.normalizeIssue(i)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'refactor_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: r.success !== false
      }
    };
  }

  private normalizeIssue(issue: unknown): Finding {
    const i = issue as Record<string, unknown>;
    return {
      findingId: (i.id as string) || uuidv4(),
      severity: (i.severity as Finding['severity']) || 'medium',
      category: 'refactor',
      title: (i.title as string) || 'Refactor Finding',
      description: (i.description as string) || '',
      location: i.location as string | undefined,
      codeSnippet: i.codeSnippet as string | undefined,
      tags: ['refactor', ...((i.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Refactor code',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}

class AccessibilityProtocolAdapter implements ProtocolAdapter {
  adapt(result: unknown): StandardResult {
    const r = result as ProtocolResult;

    return {
      protocolName: 'accessibility_protocol',
      executionTime: r.executionTime || 0,
      timestamp: new Date(),
      success: true,
      findings: (r.issues || []).map((i) => this.normalizeA11yIssue(i)),
      recommendations: (r.recommendations || []).map((rec) => this.normalizeRecommendation(rec)),
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: 'accessibility_protocol',
        executionTime: r.executionTime || 0,
        cacheHits: 0,
        cacheMisses: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };
  }

  private normalizeA11yIssue(issue: unknown): Finding {
    const i = issue as Record<string, unknown>;
    return {
      findingId: (i.id as string) || uuidv4(),
      severity: (i.severity as Finding['severity']) || 'medium',
      category: 'accessibility',
      title: (i.title as string) || 'Accessibility Issue',
      description: (i.description as string) || '',
      location: i.location as string | undefined,
      codeSnippet: i.codeSnippet as string | undefined,
      tags: ['a11y', ...((i.tags as string[]) || [])]
    };
  }

  private normalizeRecommendation(rec: unknown): Recommendation {
    const r = rec as Record<string, unknown>;
    return {
      recommendationId: (r.id as string) || uuidv4(),
      priority: (r.priority as Recommendation['priority']) || 'medium',
      action: (r.action as string) || 'Fix accessibility issue',
      description: (r.description as string) || '',
      codeExample: r.codeExample as string | undefined,
      effort: r.effort as Recommendation['effort'] | undefined
    };
  }
}
