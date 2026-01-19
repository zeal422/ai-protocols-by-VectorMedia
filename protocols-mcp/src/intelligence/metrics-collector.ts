/**
 * Metrics & Analytics Collector
 * Tracks protocol effectiveness and provides analytics insights
 */

import type { TaskType } from '../search/task-analyzer.js';
import type { StorageAdapter } from '../types/database.js';

export interface ProtocolExecutionRecord {
  sessionId: string;
  protocolName: string;
  trigger: string;
  startTime: Date;
  endTime: Date;
  executionTime: number;
  success: boolean;
  errorType?: string;
  findingsCount: number;
  artifactsCached: number;
}

export interface WorkflowExecutionRecord {
  sessionId: string;
  taskDescription: string;
  taskType: TaskType;
  protocols: ProtocolExecutionRecord[];
  totalTime: number;
  success: boolean;
  completedProtocols: number;
  failedProtocols: number;
}

export interface EffectivenessScore {
  protocol: string;
  successRate: number;
  averageExecutionTime: number;
  averageFindingsPerExecution: number;
  usageCount: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface WorkflowStats {
  taskType: string;
  protocolCombination: string[];
  executionCount: number;
  averageTime: number;
  successRate: number;
  recommendationScore: number;
}

export interface AnalyticsQuery {
  taskType?: TaskType;
  protocolName?: string;
  timeRange?: { start: Date; end: Date };
  minExecutions?: number;
}

export interface FailurePattern {
  protocol: string;
  errorType: string;
  frequency: number;
  lastOccurrence: Date;
  mitigation?: string;
}

interface CachedExecution {
  protocolName: string;
  startTime: Date;
  endTime: Date;
  success: boolean;
  findingsCount: number;
}

interface WorkflowData {
  taskType: TaskType;
  protocols: string[];
  startTime: Date;
  totalTime: number;
  success: boolean;
}

export class MetricsCollector {
  private storage: StorageAdapter;
  private protocolExecutions: Map<string, CachedExecution[]>;
  private workflowExecutions: Map<string, WorkflowData[]>;
  private initialized: boolean = false;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.protocolExecutions = new Map();
    this.workflowExecutions = new Map();
  }

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('MetricsCollector not initialized. Call initialize() first.');
    }
  }

  async recordProtocolExecution(execution: ProtocolExecutionRecord): Promise<void> {
    this.ensureInitialized();

    const executions = this.protocolExecutions.get(execution.protocolName) || [];
    executions.push({
      protocolName: execution.protocolName,
      startTime: execution.startTime,
      endTime: execution.endTime,
      success: execution.success,
      findingsCount: execution.findingsCount
    });
    this.protocolExecutions.set(execution.protocolName, executions);
  }

  async recordWorkflowExecution(execution: WorkflowExecutionRecord): Promise<void> {
    this.ensureInitialized();

    const data: WorkflowData = {
      taskType: execution.taskType,
      protocols: execution.protocols.map(p => p.protocolName),
      startTime: execution.protocols[0]?.startTime || new Date(),
      totalTime: execution.totalTime,
      success: execution.success
    };

    const executions = this.workflowExecutions.get(execution.taskType) || [];
    executions.push(data);
    this.workflowExecutions.set(execution.taskType, executions);
  }

  async getProtocolEffectiveness(protocol: string): Promise<EffectivenessScore> {
    this.ensureInitialized();

    const executions = this.protocolExecutions.get(protocol) || [];
    const totalExecutions = executions.length;

    if (totalExecutions === 0) {
      return {
        protocol,
        successRate: 0,
        averageExecutionTime: 0,
        averageFindingsPerExecution: 0,
        usageCount: 0,
        trend: 'stable'
      };
    }

    const successfulExecutions = executions.filter(e => e.success).length;
    const totalFindings = executions.reduce((sum, e) => sum + e.findingsCount, 0);
    const totalTime = executions.reduce((sum, e) =>
      sum + (e.endTime.getTime() - e.startTime.getTime()), 0
    );

    const recentExecutions = executions.slice(-10);
    const olderExecutions = executions.slice(-20, -10);

    let trend: EffectivenessScore['trend'] = 'stable';
    if (recentExecutions.length > 5 && olderExecutions.length > 0) {
      const recentSuccessRate = recentExecutions.filter(e => e.success).length / recentExecutions.length;
      const olderSuccessRate = olderExecutions.filter(e => e.success).length / olderExecutions.length;

      if (recentSuccessRate > olderSuccessRate + 0.1) {
        trend = 'improving';
      } else if (recentSuccessRate < olderSuccessRate - 0.1) {
        trend = 'declining';
      }
    }

    return {
      protocol,
      successRate: successfulExecutions / totalExecutions,
      averageExecutionTime: totalTime / totalExecutions,
      averageFindingsPerExecution: totalFindings / totalExecutions,
      usageCount: totalExecutions,
      trend
    };
  }

  async getAllProtocolEffectiveness(): Promise<EffectivenessScore[]> {
    this.ensureInitialized();

    const results: EffectivenessScore[] = [];
    for (const protocol of this.protocolExecutions.keys()) {
      const effectiveness = await this.getProtocolEffectiveness(protocol);
      results.push(effectiveness);
    }
    return results.sort((a, b) => b.usageCount - a.usageCount);
  }

  async getWorkflowEffectiveness(taskType: TaskType): Promise<EffectivenessScore> {
    this.ensureInitialized();

    const executions = this.workflowExecutions.get(taskType) || [];
    const totalExecutions = executions.length;

    if (totalExecutions === 0) {
      return {
        protocol: `workflow_${taskType}`,
        successRate: 0,
        averageExecutionTime: 0,
        averageFindingsPerExecution: 0,
        usageCount: 0,
        trend: 'stable'
      };
    }

    const successfulExecutions = executions.filter(e => e.success).length;
    const totalTime = executions.reduce((sum, e) => sum + e.totalTime, 0);

    return {
      protocol: `workflow_${taskType}`,
      successRate: successfulExecutions / totalExecutions,
      averageExecutionTime: totalTime / totalExecutions,
      averageFindingsPerExecution: 0,
      usageCount: totalExecutions,
      trend: 'stable'
    };
  }

  async getMostEffectiveCombinations(
    taskType: TaskType,
    limit: number = 5
  ): Promise<WorkflowStats[]> {
    this.ensureInitialized();

    const executions = this.workflowExecutions.get(taskType) || [];
    const combinationMap = new Map<string, WorkflowData[]>();

    for (const execution of executions) {
      const key = execution.protocols.join(',');
      const existing = combinationMap.get(key) || [];
      existing.push(execution);
      combinationMap.set(key, existing);
    }

    const stats: WorkflowStats[] = [];
    for (const [protocols, comboExecutions] of combinationMap) {
      const successful = comboExecutions.filter(e => e.success).length;
      const totalTime = comboExecutions.reduce((sum, e) => sum + e.totalTime, 0);

      const successRate = successful / comboExecutions.length;
      const avgTime = totalTime / comboExecutions.length;

      const recommendationScore = successRate * 0.7 + (1 / (1 + avgTime / 60000)) * 0.3;

      stats.push({
        taskType,
        protocolCombination: protocols.split(','),
        executionCount: comboExecutions.length,
        averageTime: avgTime,
        successRate,
        recommendationScore
      });
    }

    return stats
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  async query(_query: AnalyticsQuery): Promise<WorkflowExecutionRecord[]> {
    this.ensureInitialized();

    const results: WorkflowExecutionRecord[] = [];

    for (const [taskType, executions] of this.workflowExecutions) {
      if (_query.taskType && taskType !== _query.taskType) continue;

      for (const execution of executions) {
        if (_query.timeRange) {
          if (execution.startTime < _query.timeRange.start ||
              execution.startTime > _query.timeRange.end) {
            continue;
          }
        }

        results.push({
          sessionId: '',
          taskDescription: '',
          taskType: execution.taskType,
          protocols: [],
          totalTime: execution.totalTime,
          success: execution.success,
          completedProtocols: execution.success ? execution.protocols.length : 0,
          failedProtocols: execution.success ? 0 : execution.protocols.length
        });
      }
    }

    return results;
  }

  async optimizeWorkflow(
    _current: { protocols: string[] },
    taskType: TaskType
  ): Promise<{
    optimized: { protocols: string[] };
    expectedTimeReduction: number;
    confidence: number;
  }> {
    this.ensureInitialized();

    const bestCombinations = await this.getMostEffectiveCombinations(taskType, 1);
    const currentWorkflow = await this.getWorkflowEffectiveness(taskType);

    let optimizedProtocols: string[];
    let expectedTimeReduction: number;
    let confidence: number;

    if (bestCombinations.length > 0 && bestCombinations[0].successRate > 0.7) {
      optimizedProtocols = bestCombinations[0].protocolCombination;
      const avgTime = bestCombinations[0].averageTime;
      const currentAvgTime = currentWorkflow.averageExecutionTime;

      expectedTimeReduction = currentAvgTime > 0
        ? ((currentAvgTime - avgTime) / currentAvgTime) * 100
        : 0;
      confidence = bestCombinations[0].recommendationScore;
    } else {
      optimizedProtocols = _current.protocols;
      expectedTimeReduction = 0;
      confidence = 0.5;
    }

    return {
      optimized: { protocols: optimizedProtocols },
      expectedTimeReduction: Math.max(0, expectedTimeReduction),
      confidence: Math.min(1, Math.max(0, confidence))
    };
  }

  async getStatistics(_timeRange?: { start: Date; end: Date }): Promise<{
    totalWorkflows: number;
    successRate: number;
    averageTime: number;
    mostUsedProtocols: string[];
    failurePatterns: FailurePattern[];
  }> {
    this.ensureInitialized();

    let totalWorkflows = 0;
    let successfulWorkflows = 0;
    let totalTime = 0;
    const protocolUsage = new Map<string, number>();

    for (const [_taskType, executions] of this.workflowExecutions) {
      totalWorkflows += executions.length;
      totalTime += executions.reduce((sum, e) => sum + e.totalTime, 0);
      successfulWorkflows += executions.filter(e => e.success).length;

      for (const execution of executions) {
        for (const protocol of execution.protocols) {
          protocolUsage.set(protocol, (protocolUsage.get(protocol) || 0) + 1);
        }
      }
    }

    const sortedProtocols = Array.from(protocolUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([protocol]) => protocol);

    const failurePatterns: FailurePattern[] = [];

    return {
      totalWorkflows,
      successRate: totalWorkflows > 0 ? successfulWorkflows / totalWorkflows : 0,
      averageTime: totalWorkflows > 0 ? totalTime / totalWorkflows : 0,
      mostUsedProtocols: sortedProtocols,
      failurePatterns
    };
  }

  async getExecutionHistory(protocolName: string): Promise<CachedExecution[]> {
    this.ensureInitialized();
    return this.protocolExecutions.get(protocolName) || [];
  }

  async clear(): Promise<void> {
    this.protocolExecutions.clear();
    this.workflowExecutions.clear();
  }
}
