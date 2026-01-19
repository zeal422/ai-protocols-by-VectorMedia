import { randomUUID } from 'crypto';
import { StandardResult } from '../types/execution.js';
import { WorkflowStep } from '../search/workflow-builder.js';
import { DependencyResolver } from '../intelligence/dependency-resolver.js';

export type AgentRole = 'specialist' | 'coordinator' | 'reviewer';

export type AgentStatus = 'available' | 'busy' | 'error' | 'offline';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: string[];
  currentProtocols: string[];
  status: AgentStatus;
  lastActive: Date;
  performanceMetrics: AgentPerformanceMetrics;
  metadata: AgentMetadata;
}

export interface AgentMetadata {
  version?: string;
  provider?: string;
  model?: string;
  maxConcurrentTasks?: number;
  supportedProtocols?: string[];
}

export interface AgentPerformanceMetrics {
  totalTasksCompleted: number;
  totalTasksFailed: number;
  averageExecutionTime: number;
  successRate: number;
  lastExecutionTime?: number;
}

export interface AgentAssignment {
  agent: Agent;
  protocol: string;
  estimatedTime: string;
  priority: number;
  assignedAt: Date;
}

export interface MultiAgentExecutionResult {
  assignments: AgentAssignment[];
  results: Map<string, StandardResult>;
  failures: Map<string, Error>;
  totalDuration: number;
  success: boolean;
}

export interface MultiAgentCoordinationOptions {
  maxAgents?: number;
  failoverEnabled?: boolean;
  loadBalancingStrategy?: 'round-robin' | 'least-busy' | 'capability-based';
}

export class MultiAgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private dependencyResolver: DependencyResolver;
  private defaultMaxAgents: number;
  private defaultFailoverEnabled: boolean;
  private defaultLoadBalancingStrategy: 'round-robin' | 'least-busy' | 'capability-based';

  constructor(
    dependencyResolver: DependencyResolver,
    options: {
      defaultMaxAgents?: number;
      defaultFailoverEnabled?: boolean;
      defaultLoadBalancingStrategy?: 'round-robin' | 'least-busy' | 'capability-based';
    } = {}
  ) {
    this.dependencyResolver = dependencyResolver;
    this.defaultMaxAgents = options.defaultMaxAgents ?? 10;
    this.defaultFailoverEnabled = options.defaultFailoverEnabled ?? true;
    this.defaultLoadBalancingStrategy = options.defaultLoadBalancingStrategy ?? 'capability-based';
  }

  async registerAgent(agent: Omit<Agent, 'id' | 'currentProtocols' | 'status' | 'lastActive' | 'performanceMetrics'>): Promise<Agent> {
    const newAgent: Agent = {
      ...agent,
      id: randomUUID(),
      currentProtocols: [],
      status: 'available',
      lastActive: new Date(),
      performanceMetrics: {
        totalTasksCompleted: 0,
        totalTasksFailed: 0,
        averageExecutionTime: 0,
        successRate: 1
      }
    };

    this.agents.set(newAgent.id, newAgent);
    return newAgent;
  }

  async assignProtocolToAgent(
    protocol: string,
    agents: Agent[]
  ): Promise<AgentAssignment | null> {
    const suitableAgents = agents.filter(agent => 
      agent.status === 'available' && 
      agent.capabilities.includes(protocol)
    );

    if (suitableAgents.length === 0) {
      return null;
    }

    const selectedAgent = this.selectAgent(suitableAgents, protocol);

    if (!selectedAgent) {
      return null;
    }

    const estimatedTime = await this.estimateExecutionTime(selectedAgent, protocol);

    return {
      agent: selectedAgent,
      protocol,
      estimatedTime,
      priority: 1,
      assignedAt: new Date()
    };
  }

  async coordinateExecution(
    workflows: WorkflowStep[],
    agentIds: string[],
    options: MultiAgentCoordinationOptions = {}
  ): Promise<MultiAgentExecutionResult> {
    const _maxAgents = options.maxAgents ?? this.defaultMaxAgents;
    const failoverEnabled = options.failoverEnabled ?? this.defaultFailoverEnabled;
    const _loadBalancingStrategy = options.loadBalancingStrategy ?? this.defaultLoadBalancingStrategy;

    const startTime = Date.now();
    const agents = agentIds
      .map(id => this.agents.get(id))
      .filter((a): a is Agent => a !== undefined);

    if (agents.length === 0) {
      return {
        assignments: [],
        results: new Map(),
        failures: new Map(),
        totalDuration: Date.now() - startTime,
        success: false
      };
    }

    const assignments: AgentAssignment[] = [];
    const results = new Map<string, StandardResult>();
    const failures = new Map<string, Error>();

    for (const workflow of workflows) {
      let assignment = await this.assignProtocolToAgent(workflow.protocolName, agents);

      if (!assignment && failoverEnabled) {
        assignment = await this.findFallbackAgent(workflow.protocolName, agents);
      }

      if (assignment) {
        assignments.push(assignment);
        assignment.agent.status = 'busy';
        assignment.agent.currentProtocols.push(workflow.protocolName);

        try {
          const result = await this.executeOnAgent(assignment.agent, workflow);
          results.set(workflow.protocolName, result);

          assignment.agent.performanceMetrics.totalTasksCompleted++;
          assignment.agent.performanceMetrics.averageExecutionTime = 
            (assignment.agent.performanceMetrics.averageExecutionTime * 
              (assignment.agent.performanceMetrics.totalTasksCompleted - 1) +
              result.executionTime) / assignment.agent.performanceMetrics.totalTasksCompleted;
          assignment.agent.performanceMetrics.successRate = 
            assignment.agent.performanceMetrics.totalTasksCompleted /
            (assignment.agent.performanceMetrics.totalTasksCompleted + 
              assignment.agent.performanceMetrics.totalTasksFailed);
          assignment.agent.performanceMetrics.lastExecutionTime = result.executionTime;
        } catch (error) {
          failures.set(workflow.protocolName, error as Error);
          assignment.agent.performanceMetrics.totalTasksFailed++;
        } finally {
          assignment.agent.status = 'available';
          assignment.agent.currentProtocols = assignment.agent.currentProtocols.filter(
            p => p !== workflow.protocolName
          );
          assignment.agent.lastActive = new Date();
        }
      } else {
        failures.set(workflow.protocolName, new Error('No suitable agent found'));
      }
    }

    return {
      assignments,
      results,
      failures,
      totalDuration: Date.now() - startTime,
      success: failures.size === 0
    };
  }

  async handleAgentFailure(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return;
    }

    agent.status = 'error';

    const reassignments = await this.reassignProtocols(agent);

    for (const reassignment of reassignments) {
      try {
        await this.executeOnAgent(reassignment.agent, {
          order: 1,
          protocolName: reassignment.protocol,
          trigger: `REASSIGNED_${reassignment.protocol.toUpperCase()}`,
          reason: 'Original agent failed',
          optional: false
        });
      } catch {
        // Reassignment failed, protocol will need manual intervention
      }
    }
  }

  async getAgentStatus(agentId: string): Promise<Agent | null> {
    return this.agents.get(agentId) || null;
  }

  async listAgents(filter?: {
    role?: AgentRole;
    status?: AgentStatus;
    capability?: string;
  }): Promise<Agent[]> {
    let agents = Array.from(this.agents.values());

    if (filter) {
      if (filter.role) {
        agents = agents.filter(a => a.role === filter.role);
      }
      if (filter.status) {
        agents = agents.filter(a => a.status === filter.status);
      }
      if (filter.capability) {
        agents = agents.filter(a => a.capabilities.includes(filter.capability!));
      }
    }

    return agents;
  }

  async removeAgent(agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    if (agent.currentProtocols.length > 0) {
      await this.reassignProtocols(agent);
    }

    this.agents.delete(agentId);
    return true;
  }

  async updateAgentMetadata(agentId: string, metadata: Partial<AgentMetadata>): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    agent.metadata = { ...agent.metadata, ...metadata };
    return true;
  }

  private selectAgent(agents: Agent[], protocol: string): Agent | null {
    switch (this.defaultLoadBalancingStrategy) {
    case 'round-robin':
      return this.roundRobinSelect(agents);
    case 'least-busy':
      return this.leastBusySelect(agents);
    case 'capability-based':
    default:
      return this.capabilityBasedSelect(agents, protocol);
    }
  }

  private roundRobinSelect(agents: Agent[]): Agent {
    return agents[Math.floor(Math.random() * agents.length)];
  }

  private leastBusySelect(agents: Agent[]): Agent {
    return agents.reduce((min, agent) => 
      agent.currentProtocols.length < min.currentProtocols.length ? agent : min
    );
  }

  private capabilityBasedSelect(agents: Agent[], protocol: string): Agent {
    const agentsWithProtocol = agents.filter(a => a.capabilities.includes(protocol));
    if (agentsWithProtocol.length === 0) {
      return agents[Math.floor(Math.random() * agents.length)];
    }
    return agentsWithProtocol[Math.floor(Math.random() * agentsWithProtocol.length)];
  }

  private async estimateExecutionTime(agent: Agent, protocol: string): Promise<string> {
    const baseTime = 30000;
    const protocolComplexity = await this.estimateProtocolComplexity(protocol);
    const agentExperience = agent.performanceMetrics.averageExecutionTime;

    const estimatedMs = baseTime * protocolComplexity * (agentExperience > 0 ? 0.8 : 1);

    if (estimatedMs < 60000) {
      return `${Math.round(estimatedMs / 1000)}s`;
    } else if (estimatedMs < 3600000) {
      return `${Math.round(estimatedMs / 60000)}m`;
    } else {
      return `${Math.round(estimatedMs / 3600000)}h`;
    }
  }

  private async estimateProtocolComplexity(protocol: string): Promise<number> {
    const dependencies = await this.dependencyResolver.getDependencies(protocol);
    return 1 + dependencies.length * 0.1;
  }

  private async executeOnAgent(agent: Agent, workflow: WorkflowStep): Promise<StandardResult> {
    await new Promise(resolve => setTimeout(resolve, 10));

    return {
      protocolName: workflow.protocolName,
      executionTime: Math.random() * 1000 + 100,
      timestamp: new Date(),
      success: true,
      findings: [],
      recommendations: [],
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName: workflow.protocolName,
        executionTime: Math.random() * 1000 + 100,
        cacheHits: Math.floor(Math.random() * 10),
        cacheMisses: Math.floor(Math.random() * 5),
        cacheHitRate: Math.random(),
        memoryUsage: Math.random() * 1000000,
        success: true
      }
    };
  }

  private async findFallbackAgent(protocol: string, agents: Agent[]): Promise<AgentAssignment | null> {
    const fallbackAgents = agents.filter(a => a.status === 'available');
    if (fallbackAgents.length === 0) {
      return null;
    }

    const fallbackAgent = fallbackAgents[Math.floor(Math.random() * fallbackAgents.length)];
    const estimatedTime = await this.estimateExecutionTime(fallbackAgent, protocol);

    return {
      agent: fallbackAgent,
      protocol,
      estimatedTime,
      priority: 2,
      assignedAt: new Date()
    };
  }

  private async reassignProtocols(failedAgent: Agent): Promise<{ agent: Agent; protocol: string }[]> {
    const reassignments: { agent: Agent; protocol: string }[] = [];
    const otherAgents = Array.from(this.agents.values()).filter(
      a => a.id !== failedAgent.id && a.status === 'available'
    );

    for (const protocol of failedAgent.currentProtocols) {
      const suitableAgents = otherAgents.filter(a => 
        a.capabilities.includes(protocol)
      );

      if (suitableAgents.length > 0) {
        const fallbackAgent = suitableAgents[Math.floor(Math.random() * suitableAgents.length)];
        reassignments.push({ agent: fallbackAgent, protocol });
      }
    }

    return reassignments;
  }
}

export function createMockAgent(
  overrides: Partial<Agent> = {}
): Agent {
  return {
    id: randomUUID(),
    name: 'Test Agent',
    role: 'specialist',
    capabilities: ['debug_protocol', 'test_automation_protocol', 'code_review_protocol'],
    currentProtocols: [],
    status: 'available',
    lastActive: new Date(),
    performanceMetrics: {
      totalTasksCompleted: 10,
      totalTasksFailed: 0,
      averageExecutionTime: 500,
      successRate: 1
    },
    metadata: {
      version: '1.0.0',
      provider: 'test',
      model: 'test-model'
    },
    ...overrides
  };
}
