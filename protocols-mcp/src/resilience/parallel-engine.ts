import {
  StandardResult,
  ExecutionSession,
  AggregatedResult
} from '../types/execution.js';
import { WorkflowStep } from '../search/workflow-builder.js';
import { DependencyResolver } from '../intelligence/dependency-resolver.js';
import { randomUUID } from 'crypto';

export type ConflictType = 'file_modification' | 'state_modification' | 'resource_access';

export type ConflictSeverity = 'low' | 'medium' | 'high';

export type ConflictResolutionStrategy = 'merge' | 'abort' | 'sequential';

export interface ConflictInfo {
  protocols: string[];
  conflictType: ConflictType;
  severity: ConflictSeverity;
  resolution: string;
  conflictingFiles?: string[];
  conflictingResources?: string[];
}

export interface ExecutionStage {
  stageId: string;
  protocols: string[];
  dependencies: string[];
  runInParallel: boolean;
  estimatedDuration: number;
}

export interface ParallelWorkflow {
  stages: ExecutionStage[];
  maxParallel: number;
  conflictStrategy: ConflictResolutionStrategy;
  totalEstimatedDuration: number;
}

export interface ParallelExecutionResult {
  stageResults: Map<string, StandardResult[]>;
  conflictsDetected: ConflictInfo[];
  totalTime: number;
  parallelizationFactor: number;
  aggregatedResult: AggregatedResult;
}

export interface ParallelPlanOptions {
  maxParallel?: number;
  conflictStrategy?: ConflictResolutionStrategy;
  conservativeMode?: boolean;
}

export class ParallelExecutionEngine {
  private dependencyResolver: DependencyResolver;
  private defaultMaxParallel: number;
  private defaultConflictStrategy: ConflictResolutionStrategy;

  constructor(
    dependencyResolver: DependencyResolver,
    options: {
      defaultMaxParallel?: number;
      defaultConflictStrategy?: ConflictResolutionStrategy;
    } = {}
  ) {
    this.dependencyResolver = dependencyResolver;
    this.defaultMaxParallel = options.defaultMaxParallel ?? 4;
    this.defaultConflictStrategy = options.defaultConflictStrategy ?? 'abort';
  }

  async planParallelExecution(
    workflows: WorkflowStep[],
    options: ParallelPlanOptions = {}
  ): Promise<ParallelWorkflow> {
    const maxParallel = options.maxParallel ?? this.defaultMaxParallel;
    const conflictStrategy = options.conflictStrategy ?? this.defaultConflictStrategy;

    const parallelizableGroups = await this.identifyParallelizableGroups(workflows);
    const stages = await this.buildExecutionStages(parallelizableGroups, workflows);
    const totalDuration = this.calculateTotalDuration(stages);

    return {
      stages,
      maxParallel,
      conflictStrategy,
      totalEstimatedDuration: totalDuration
    };
  }

  async detectConflicts(
    workflows: WorkflowStep[],
    _options: ParallelPlanOptions = {}
  ): Promise<ConflictInfo[]> {
    const conflicts: ConflictInfo[] = [];
    const protocolFileAccess = new Map<string, Set<string>>();

    for (const workflow of workflows) {
      const fileAccess = await this.analyzeProtocolFileAccess(workflow.protocolName);
      protocolFileAccess.set(workflow.protocolName, fileAccess);
    }

    for (const [protocol1, files1] of protocolFileAccess) {
      for (const [protocol2, files2] of protocolFileAccess) {
        if (protocol1 >= protocol2) continue;

        const commonFiles = new Set([...files1].filter(x => files2.has(x)));
        if (commonFiles.size > 0) {
          conflicts.push({
            protocols: [protocol1, protocol2],
            conflictType: 'file_modification',
            severity: commonFiles.size > 2 ? 'high' : 'medium',
            resolution: 'sequential',
            conflictingFiles: Array.from(commonFiles)
          });
        }
      }
    }

    const stateConflicts = await this.detectStateConflicts(workflows);
    conflicts.push(...stateConflicts);

    return conflicts;
  }

  async executeInParallel(
    stages: ExecutionStage[],
    session: ExecutionSession
  ): Promise<ParallelExecutionResult> {
    const startTime = Date.now();
    const stageResults = new Map<string, StandardResult[]>();
    const allConflicts: ConflictInfo[] = [];

    for (const stage of stages) {
      if (stage.runInParallel && stage.protocols.length > 1) {
        const results = await this.executeStageInParallel(stage, session);
        stageResults.set(stage.stageId, results);
        const _parallelCount = stage.protocols.length;

        const conflicts = await this.detectConflictsForResults(results);
        allConflicts.push(...conflicts);
      } else {
        const results: StandardResult[] = [];
        for (const protocolName of stage.protocols) {
          const result = await this.executeProtocol(protocolName, session);
          results.push(result);
        }
        stageResults.set(stage.stageId, results);
        const _sequentialCount = stage.protocols.length;
      }
    }

    const totalTime = Date.now() - startTime;
    const theoreticalSequentialTime = this.calculateTheoreticalSequentialTime(stageResults);
    const parallelizationFactor = theoreticalSequentialTime > 0 
      ? theoreticalSequentialTime / totalTime 
      : 1;

    const aggregatedResult = await this.aggregateResults(session, stageResults);

    return {
      stageResults,
      conflictsDetected: allConflicts,
      totalTime,
      parallelizationFactor,
      aggregatedResult
    };
  }

  async mergeResults(results: StandardResult[]): Promise<AggregatedResult> {
    const allFindings = results.flatMap(r => r.findings);
    const allRecommendations = results.flatMap(r => r.recommendations);
    const _allArtifacts = results.flatMap(r => r.artifacts);
    const allNextSteps = results.flatMap(r => r.nextSteps);

    const totalDuration = results.reduce((sum, r) => sum + r.executionTime, 0);
    const successCount = results.filter(r => r.success).length;
    const successRate = results.length > 0 ? successCount / results.length : 1;

    const cacheHits = results.reduce((sum, r) => sum + r.metrics.cacheHits, 0);
    const cacheMisses = results.reduce((sum, r) => sum + r.metrics.cacheMisses, 0);
    const overallCacheHitRate = cacheHits + cacheMisses > 0 
      ? cacheHits / (cacheHits + cacheMisses) 
      : 0;
    const peakMemoryUsage = Math.max(...results.map(r => r.metrics.memoryUsage));

    return {
      sessionId: '',
      taskDescription: '',
      protocolsExecuted: results.length,
      totalDuration,
      findings: this.deduplicateFindings(allFindings),
      recommendations: this.deduplicateRecommendations(allRecommendations),
      summary: this.generateSummary(results),
      nextSteps: this.mergeNextSteps(allNextSteps),
      metrics: {
        protocolsExecuted: results.length,
        totalDuration,
        averageProtocolDuration: totalDuration / results.length,
        totalCacheHits: cacheHits,
        totalCacheMisses: cacheMisses,
        overallCacheHitRate,
        peakMemoryUsage,
        successRate
      }
    };
  }

  private async identifyParallelizableGroups(
    workflows: WorkflowStep[]
  ): Promise<string[][]> {
    const groups: string[][] = [];
    const processed = new Set<string>();

    for (const workflow of workflows) {
      if (processed.has(workflow.protocolName)) continue;

      const group = await this.findCompatibleProtocols(workflow.protocolName, workflows, processed);
      groups.push(group);
      group.forEach(p => processed.add(p));
    }

    return groups;
  }

  private async findCompatibleProtocols(
    protocolName: string,
    workflows: WorkflowStep[],
    _processed: Set<string>
  ): Promise<string[]> {
    const compatible = [protocolName];
    const dependencies = await this.dependencyResolver.getDependencies(protocolName);
    const dependents = await this.dependencyResolver.getDependents(protocolName);

    for (const workflow of workflows) {
      if (workflow.protocolName === protocolName) continue;

      const workflowDependencies = await this.dependencyResolver.getDependencies(workflow.protocolName);
      const workflowDependents = await this.dependencyResolver.getDependents(workflow.protocolName);

      const hasDirectDependency = dependencies.includes(workflow.protocolName) || 
        workflowDependencies.includes(protocolName);
      const hasCircularDependency = dependents.includes(workflow.protocolName) || 
        workflowDependents.includes(protocolName);

      if (!hasDirectDependency && !hasCircularDependency) {
        compatible.push(workflow.protocolName);
      }
    }

    return compatible;
  }

  private async buildExecutionStages(
    parallelizableGroups: string[][],
    workflows: WorkflowStep[]
  ): Promise<ExecutionStage[]> {
    const stages: ExecutionStage[] = [];
    let stageIndex = 0;

    for (const group of parallelizableGroups) {
      const stageId = `stage-${stageIndex++}`;
      const dependencies = await this.findStageDependencies(group, workflows);

      const estimatedDuration = await this.estimateStageDuration(group);

      stages.push({
        stageId,
        protocols: group,
        dependencies,
        runInParallel: group.length > 1,
        estimatedDuration
      });
    }

    return stages;
  }

  private async findStageDependencies(
    group: string[],
    workflows: WorkflowStep[]
  ): Promise<string[]> {
    const dependencies = new Set<string>();

    for (const protocolName of group) {
      const protocolDependencies = await this.dependencyResolver.getDependencies(protocolName);
      for (const dep of protocolDependencies) {
        const depWorkflow = workflows.find(w => w.protocolName === dep);
        if (depWorkflow && !group.includes(dep)) {
          dependencies.add(depWorkflow.trigger);
        }
      }
    }

    return Array.from(dependencies);
  }

  private async estimateStageDuration(protocols: string[]): Promise<number> {
    let totalDuration = 0;
    for (const protocolName of protocols) {
      const deps = await this.dependencyResolver.getDependencies(protocolName);
      totalDuration += 100 + deps.length * 50;
    }
    return totalDuration;
  }

  private calculateTotalDuration(stages: ExecutionStage[]): number {
    let total = 0;
    for (const stage of stages) {
      if (stage.runInParallel) {
        total += stage.estimatedDuration;
      } else {
        total += stage.estimatedDuration;
      }
    }
    return total;
  }

  private calculateTheoreticalSequentialTime(
    stageResults: Map<string, StandardResult[]>
  ): number {
    let total = 0;
    for (const results of stageResults.values()) {
      for (const result of results) {
        total += result.executionTime;
      }
    }
    return total;
  }

  private async analyzeProtocolFileAccess(protocolName: string): Promise<Set<string>> {
    const files = new Set<string>();
    
    const dependencies = await this.dependencyResolver.getDependencies(protocolName);
    
    const protocolFilePatterns: Record<string, string[]> = {
      'code_review_protocol': ['src/**/*.ts', 'src/**/*.js', '**/*.md'],
      'debug_protocol': ['src/**/*.ts', 'src/**/*.js', 'logs/**/*'],
      'test_automation_protocol': ['src/**/*.test.ts', 'src/**/*.test.js', 'tests/**/*'],
      'security_audit_protocol': ['src/**/*', 'config/**/*', '.env*'],
      'refactor_protocol': ['src/**/*.ts', 'src/**/*.js'],
      'performance_protocol': ['src/**/*', 'package.json'],
      'accessibility_protocol': ['src/**/*.{ts,tsx,js,jsx}'],
      'bigpappa_protocol_reviewANDfixes': ['src/**/*', '**/*.{ts,js,md}']
    };

    const patterns = protocolFilePatterns[protocolName] || ['src/**/*'];
    patterns.forEach(pattern => files.add(pattern));

    dependencies.forEach(dep => {
      const depPatterns = protocolFilePatterns[dep];
      if (depPatterns) {
        depPatterns.forEach(p => files.add(p));
      }
    });

    return files;
  }

  private async detectStateConflicts(workflows: WorkflowStep[]): Promise<ConflictInfo[]> {
    const conflicts: ConflictInfo[] = [];

    const stateModifyingProtocols = ['refactor_protocol', 'debug_protocol', 'security_audit_protocol'];
    const stateModifyingWorkflows = workflows.filter(w => 
      stateModifyingProtocols.includes(w.protocolName)
    );

    if (stateModifyingWorkflows.length > 1) {
      conflicts.push({
        protocols: stateModifyingWorkflows.map(w => w.protocolName),
        conflictType: 'state_modification',
        severity: 'high',
        resolution: 'sequential'
      });
    }

    return conflicts;
  }

  private async detectConflictsForResults(
    results: StandardResult[]
  ): Promise<ConflictInfo[]> {
    const conflicts: ConflictInfo[] = [];

    const modifyingProtocols = results.filter(r => 
      r.recommendations.some(rec => 
        rec.action.toLowerCase().includes('modify') || 
        rec.action.toLowerCase().includes('change')
      )
    );

    if (modifyingProtocols.length > 1) {
      conflicts.push({
        protocols: modifyingProtocols.map(r => r.protocolName),
        conflictType: 'file_modification',
        severity: 'medium',
        resolution: 'merge'
      });
    }

    return conflicts;
  }

  private async executeStageInParallel(
    stage: ExecutionStage,
    session: ExecutionSession
  ): Promise<StandardResult[]> {
    const promises = stage.protocols.map(protocolName => 
      this.executeProtocol(protocolName, session)
    );
    return Promise.all(promises);
  }

  private async executeProtocol(
    protocolName: string,
    _session: ExecutionSession
  ): Promise<StandardResult> {
    return {
      protocolName,
      executionTime: Math.random() * 500 + 100,
      timestamp: new Date(),
      success: true,
      findings: [],
      recommendations: [],
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName,
        executionTime: Math.random() * 500 + 100,
        cacheHits: Math.floor(Math.random() * 10),
        cacheMisses: Math.floor(Math.random() * 5),
        cacheHitRate: Math.random(),
        memoryUsage: Math.random() * 1000000,
        success: true
      }
    };
  }

  private async aggregateResults(
    session: ExecutionSession,
    stageResults: Map<string, StandardResult[]>
  ): Promise<AggregatedResult> {
    const allResults: StandardResult[] = [];
    for (const results of stageResults.values()) {
      allResults.push(...results);
    }
    return this.mergeResults(allResults);
  }

  private deduplicateFindings(findings: StandardResult['findings']): StandardResult['findings'] {
    const seen = new Set<string>();
    return findings.filter(finding => {
      const key = `${finding.category}-${finding.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private deduplicateRecommendations(
    recommendations: StandardResult['recommendations']
  ): StandardResult['recommendations'] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      const key = `${rec.priority}-${rec.action}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private generateSummary(results: StandardResult[]): string {
    const successCount = results.filter(r => r.success).length;
    const totalFindings = results.reduce((sum, r) => sum + r.findings.length, 0);
    const totalRecommendations = results.reduce((sum, r) => sum + r.recommendations.length, 0);

    return `Executed ${results.length} protocols (${successCount} successful). ` +
      `Found ${totalFindings} findings and generated ${totalRecommendations} recommendations.`;
  }

  private mergeNextSteps(
    nextSteps: StandardResult['nextSteps']
  ): StandardResult['nextSteps'] {
    const seen = new Set<string>();
    const merged: StandardResult['nextSteps'] = [];

    for (const step of nextSteps) {
      const key = `${step.action}-${step.protocolName || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(step);
      }
    }

    return merged.sort((a, b) => (a.optional === b.optional ? 0 : a.optional ? 1 : -1));
  }
}

export function createMockWorkflowStep(
  protocolName: string,
  overrides: Partial<WorkflowStep> = {}
): WorkflowStep {
  return {
    order: 1,
    protocolName,
    trigger: `TEST_${protocolName.toUpperCase()}`,
    reason: `Testing ${protocolName}`,
    optional: false,
    stepId: `step-${randomUUID().slice(0, 8)}`,
    ...overrides
  };
}
