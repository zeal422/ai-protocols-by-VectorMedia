import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MultiAgentOrchestrator, createMockAgent } from './multi-agent-orchestration.js';
import { DependencyResolver } from '../intelligence/dependency-resolver.js';
import { WorkflowStep } from '../search/workflow-builder.js';

describe('MultiAgentOrchestrator', () => {
  let orchestrator: MultiAgentOrchestrator;
  let mockDependencyResolver: DependencyResolver;

  beforeEach(() => {
    mockDependencyResolver = {
      getDependencies: vi.fn().mockResolvedValue([]),
      getDependents: vi.fn().mockResolvedValue([]),
      resolvePrerequisites: vi.fn().mockResolvedValue([]),
      validateChain: vi.fn().mockResolvedValue({ valid: true, issues: [] }),
      detectCircularDependencies: vi.fn().mockResolvedValue([]),
      buildExecutionGraph: vi.fn().mockResolvedValue({
        nodes: new Map(),
        edges: new Map(),
        topologicalSort: [],
        hasCycles: false
      }),
      getExecutionOrder: vi.fn().mockResolvedValue([]),
      shouldRunBefore: vi.fn().mockResolvedValue(true),
      getProtocolMetadata: vi.fn().mockReturnValue(undefined),
      getAllProtocolNames: vi.fn().mockReturnValue([])
    } as unknown as DependencyResolver;

    orchestrator = new MultiAgentOrchestrator(mockDependencyResolver, {
      defaultMaxAgents: 10,
      defaultFailoverEnabled: true,
      defaultLoadBalancingStrategy: 'capability-based'
    });
  });

  describe('registerAgent', () => {
    it('should register a new agent', async () => {
      const agentData = {
        name: 'Test Agent',
        role: 'specialist' as const,
        capabilities: ['debug_protocol', 'test_automation_protocol'],
        metadata: { version: '1.0.0' }
      };

      const agent = await orchestrator.registerAgent(agentData);

      expect(agent.id).toBeDefined();
      expect(agent.name).toBe('Test Agent');
      expect(agent.role).toBe('specialist');
      expect(agent.capabilities).toContain('debug_protocol');
      expect(agent.status).toBe('available');
      expect(agent.currentProtocols).toEqual([]);
    });

    it('should set default performance metrics', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Test Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      expect(agent.performanceMetrics.totalTasksCompleted).toBe(0);
      expect(agent.performanceMetrics.totalTasksFailed).toBe(0);
      expect(agent.performanceMetrics.successRate).toBe(1);
    });
  });

  describe('assignProtocolToAgent', () => {
    it('should assign protocol to capable agent', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Specialist',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      const assignment = await orchestrator.assignProtocolToAgent('debug_protocol', [agent]);

      expect(assignment).not.toBeNull();
      expect(assignment?.protocol).toBe('debug_protocol');
      expect(assignment?.agent.id).toBe(agent.id);
      expect(assignment?.estimatedTime).toBeDefined();
    });

    it('should return null for non-capable agents', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Reviewer',
        role: 'reviewer',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const assignment = await orchestrator.assignProtocolToAgent('debug_protocol', [agent]);

      expect(assignment).toBeNull();
    });

    it('should return null for busy agents', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Busy Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      agent.status = 'busy';

      const assignment = await orchestrator.assignProtocolToAgent('debug_protocol', [agent]);

      expect(assignment).toBeNull();
    });
  });

  describe('coordinateExecution', () => {
    it('should execute workflows on multiple agents', async () => {
      const agent1 = await orchestrator.registerAgent({
        name: 'Agent 1',
        role: 'specialist',
        capabilities: ['debug_protocol', 'test_automation_protocol'],
        metadata: { version: '1.0.0' }
      });

      const agent2 = await orchestrator.registerAgent({
        name: 'Agent 2',
        role: 'specialist',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const workflows: WorkflowStep[] = [
        {
          order: 1,
          protocolName: 'debug_protocol',
          trigger: 'DEEPDIVE',
          reason: 'Need to debug',
          optional: false
        },
        {
          order: 2,
          protocolName: 'code_review_protocol',
          trigger: 'COMPREHENSIVE',
          reason: 'Need review',
          optional: false
        }
      ];

      const result = await orchestrator.coordinateExecution(
        workflows,
        [agent1.id, agent2.id]
      );

      expect(result.success).toBe(true);
      expect(result.assignments.length).toBe(2);
      expect(result.results.size).toBe(2);
      expect(result.failures.size).toBe(0);
    });

    it('should handle agent failures gracefully', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      agent.status = 'error';

      const workflows: WorkflowStep[] = [
        {
          order: 1,
          protocolName: 'debug_protocol',
          trigger: 'DEEPDIVE',
          reason: 'Need debug',
          optional: false
        }
      ];

      const result = await orchestrator.coordinateExecution(
        workflows,
        [agent.id]
      );

      expect(result.failures.size).toBe(1);
    });

    it('should return failure for empty agent list', async () => {
      const workflows: WorkflowStep[] = [
        {
          order: 1,
          protocolName: 'debug_protocol',
          trigger: 'DEEPDIVE',
          reason: 'Need debug',
          optional: false
        }
      ];

      const result = await orchestrator.coordinateExecution(workflows, []);

      expect(result.success).toBe(false);
      expect(result.results.size).toBe(0);
    });
  });

  describe('handleAgentFailure', () => {
    it('should mark agent as error and reassign protocols', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      agent.status = 'available';
      agent.currentProtocols = ['debug_protocol'];

      await orchestrator.handleAgentFailure(agent.id);

      const updatedAgent = await orchestrator.getAgentStatus(agent.id);
      expect(updatedAgent?.status).toBe('error');
    });
  });

  describe('getAgentStatus', () => {
    it('should return agent by id', async () => {
      const registeredAgent = await orchestrator.registerAgent({
        name: 'Test Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      const agent = await orchestrator.getAgentStatus(registeredAgent.id);

      expect(agent).not.toBeNull();
      expect(agent?.name).toBe('Test Agent');
    });

    it('should return null for non-existent agent', async () => {
      const agent = await orchestrator.getAgentStatus('non-existent');

      expect(agent).toBeNull();
    });
  });

  describe('listAgents', () => {
    it('should list all agents', async () => {
      await orchestrator.registerAgent({
        name: 'Agent 1',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });
      await orchestrator.registerAgent({
        name: 'Agent 2',
        role: 'coordinator',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const agents = await orchestrator.listAgents();

      expect(agents).toHaveLength(2);
    });

    it('should filter agents by role', async () => {
      await orchestrator.registerAgent({
        name: 'Specialist',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });
      await orchestrator.registerAgent({
        name: 'Coordinator',
        role: 'coordinator',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const specialists = await orchestrator.listAgents({ role: 'specialist' });

      expect(specialists).toHaveLength(1);
      expect(specialists[0].role).toBe('specialist');
    });

    it('should filter agents by status', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      agent.status = 'busy';

      const availableAgents = await orchestrator.listAgents({ status: 'available' });
      const busyAgents = await orchestrator.listAgents({ status: 'busy' });

      expect(availableAgents.length).toBe(0);
      expect(busyAgents.length).toBe(1);
    });

    it('should filter agents by capability', async () => {
      await orchestrator.registerAgent({
        name: 'Debug Agent',
        role: 'specialist',
        capabilities: ['debug_protocol', 'test_automation_protocol'],
        metadata: { version: '1.0.0' }
      });
      await orchestrator.registerAgent({
        name: 'Review Agent',
        role: 'specialist',
        capabilities: ['code_review_protocol'],
        metadata: { version: '1.0.0' }
      });

      const debugAgents = await orchestrator.listAgents({ capability: 'debug_protocol' });

      expect(debugAgents).toHaveLength(1);
      expect(debugAgents[0].capabilities).toContain('debug_protocol');
    });
  });

  describe('removeAgent', () => {
    it('should remove agent', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      const removed = await orchestrator.removeAgent(agent.id);

      expect(removed).toBe(true);
      expect(await orchestrator.getAgentStatus(agent.id)).toBeNull();
    });

    it('should return false for non-existent agent', async () => {
      const removed = await orchestrator.removeAgent('non-existent');

      expect(removed).toBe(false);
    });
  });

  describe('updateAgentMetadata', () => {
    it('should update agent metadata', async () => {
      const agent = await orchestrator.registerAgent({
        name: 'Agent',
        role: 'specialist',
        capabilities: ['debug_protocol'],
        metadata: { version: '1.0.0' }
      });

      const updated = await orchestrator.updateAgentMetadata(agent.id, {
        version: '2.0.0',
        model: 'gpt-4'
      });

      expect(updated).toBe(true);
      const retrieved = await orchestrator.getAgentStatus(agent.id);
      expect(retrieved?.metadata.version).toBe('2.0.0');
      expect(retrieved?.metadata.model).toBe('gpt-4');
    });
  });

  describe('createMockAgent', () => {
    it('should create agent with default values', () => {
      const agent = createMockAgent();

      expect(agent.id).toBeDefined();
      expect(agent.name).toBe('Test Agent');
      expect(agent.role).toBe('specialist');
      expect(agent.capabilities).toContain('debug_protocol');
      expect(agent.status).toBe('available');
    });

    it('should allow overriding values', () => {
      const agent = createMockAgent({
        name: 'Custom Agent',
        role: 'coordinator',
        status: 'busy'
      });

      expect(agent.name).toBe('Custom Agent');
      expect(agent.role).toBe('coordinator');
      expect(agent.status).toBe('busy');
    });
  });
});
