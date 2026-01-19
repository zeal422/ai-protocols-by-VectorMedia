/**
 * Metrics Collector Unit Tests
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { MetricsCollector, type ProtocolExecutionRecord, type WorkflowExecutionRecord } from '../../src/intelligence/metrics-collector.js';

interface MockStorage {
  connect: Mock;
  disconnect: Mock;
  createSession: Mock;
  getSession: Mock;
  updateSession: Mock;
  deleteSession: Mock;
  listSessions: Mock;
  createArtifact: Mock;
  getArtifact: Mock;
  deleteArtifact: Mock;
  listArtifacts: Mock;
  recordMetric: Mock;
  getMetrics: Mock;
  cleanupExpiredArtifacts: Mock;
}

function createMockStorage(): MockStorage {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    createSession: vi.fn().mockResolvedValue(undefined),
    getSession: vi.fn().mockResolvedValue(null),
    updateSession: vi.fn().mockResolvedValue(undefined),
    deleteSession: vi.fn().mockResolvedValue(undefined),
    listSessions: vi.fn().mockResolvedValue([]),
    createArtifact: vi.fn().mockResolvedValue(undefined),
    getArtifact: vi.fn().mockResolvedValue(null),
    deleteArtifact: vi.fn().mockResolvedValue(undefined),
    listArtifacts: vi.fn().mockResolvedValue([]),
    recordMetric: vi.fn().mockResolvedValue(undefined),
    getMetrics: vi.fn().mockResolvedValue([]),
    cleanupExpiredArtifacts: vi.fn().mockResolvedValue(0)
  };
}

describe('MetricsCollector', () => {
  let metricsCollector: MetricsCollector;
  let mockStorage: MockStorage;

  beforeEach(async () => {
    mockStorage = createMockStorage();
    metricsCollector = new MetricsCollector(mockStorage as unknown as import('../../src/types/database.js').StorageAdapter);
    await metricsCollector.initialize();
  });

  describe('recordProtocolExecution', () => {
    it('should record a successful execution', async () => {
      const execution: ProtocolExecutionRecord = {
        sessionId: 'session-1',
        protocolName: 'debug',
        trigger: 'DEEPDIVE',
        startTime: new Date(),
        endTime: new Date(Date.now() + 5000),
        executionTime: 5000,
        success: true,
        findingsCount: 5,
        artifactsCached: 2
      };

      await metricsCollector.recordProtocolExecution(execution);

      const history = await metricsCollector.getExecutionHistory('debug');
      expect(history.length).toBe(1);
      expect(history[0].success).toBe(true);
    });

    it('should record a failed execution', async () => {
      const execution: ProtocolExecutionRecord = {
        sessionId: 'session-2',
        protocolName: 'fullspec',
        trigger: 'FULLSPEC',
        startTime: new Date(),
        endTime: new Date(Date.now() + 10000),
        executionTime: 10000,
        success: false,
        errorType: 'TIMEOUT',
        findingsCount: 0,
        artifactsCached: 0
      };

      await metricsCollector.recordProtocolExecution(execution);

      const history = await metricsCollector.getExecutionHistory('fullspec');
      expect(history.length).toBe(1);
      expect(history[0].success).toBe(false);
    });

    it('should track multiple executions per protocol', async () => {
      for (let i = 0; i < 5; i++) {
        await metricsCollector.recordProtocolExecution({
          sessionId: `session-${i}`,
          protocolName: 'test',
          trigger: 'TEST',
          startTime: new Date(),
          endTime: new Date(Date.now() + 1000),
          executionTime: 1000,
          success: i % 2 === 0,
          findingsCount: i,
          artifactsCached: 0
        });
      }

      const history = await metricsCollector.getExecutionHistory('test');
      expect(history.length).toBe(5);
    });
  });

  describe('recordWorkflowExecution', () => {
    it('should record a workflow execution', async () => {
      const workflow: WorkflowExecutionRecord = {
        sessionId: 'session-1',
        taskDescription: 'Debug authentication issue',
        taskType: 'debug',
        protocols: [
          {
            sessionId: 'session-1',
            protocolName: 'fullindex',
            trigger: 'FULLINDEX',
            startTime: new Date(),
            endTime: new Date(Date.now() + 5000),
            executionTime: 5000,
            success: true,
            findingsCount: 3,
            artifactsCached: 1
          }
        ],
        totalTime: 5000,
        success: true,
        completedProtocols: 1,
        failedProtocols: 0
      };

      await metricsCollector.recordWorkflowExecution(workflow);
    });
  });

  describe('getProtocolEffectiveness', () => {
    it('should return 0 effectiveness for protocol with no executions', async () => {
      const effectiveness = await metricsCollector.getProtocolEffectiveness('unknown');
      expect(effectiveness.protocol).toBe('unknown');
      expect(effectiveness.successRate).toBe(0);
      expect(effectiveness.usageCount).toBe(0);
    });

    it('should calculate success rate correctly', async () => {
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordProtocolExecution({
          sessionId: `session-${i}`,
          protocolName: 'test',
          trigger: 'TEST',
          startTime: new Date(),
          endTime: new Date(Date.now() + 1000),
          executionTime: 1000,
          success: i < 8,
          findingsCount: i,
          artifactsCached: 0
        });
      }

      const effectiveness = await metricsCollector.getProtocolEffectiveness('test');
      expect(effectiveness.successRate).toBe(0.8);
      expect(effectiveness.usageCount).toBe(10);
    });
  });

  describe('getAllProtocolEffectiveness', () => {
    it('should return effectiveness for all tracked protocols', async () => {
      await metricsCollector.recordProtocolExecution({
        sessionId: 'session-1',
        protocolName: 'debug',
        trigger: 'DEEPDIVE',
        startTime: new Date(),
        endTime: new Date(Date.now() + 1000),
        executionTime: 1000,
        success: true,
        findingsCount: 5,
        artifactsCached: 1
      });

      await metricsCollector.recordProtocolExecution({
        sessionId: 'session-2',
        protocolName: 'audit',
        trigger: 'SECAUDIT',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2000),
        executionTime: 2000,
        success: true,
        findingsCount: 10,
        artifactsCached: 2
      });

      const allEffectiveness = await metricsCollector.getAllProtocolEffectiveness();
      expect(allEffectiveness.length).toBe(2);
      expect(allEffectiveness.map(e => e.protocol).sort()).toEqual(['audit', 'debug']);
    });
  });

  describe('getWorkflowEffectiveness', () => {
    it('should return 0 for workflow with no executions', async () => {
      const effectiveness = await metricsCollector.getWorkflowEffectiveness('unknown');
      expect(effectiveness.successRate).toBe(0);
      expect(effectiveness.usageCount).toBe(0);
    });

    it('should calculate workflow success rate', async () => {
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordWorkflowExecution({
          sessionId: `session-${i}`,
          taskDescription: 'Debug task',
          taskType: 'debug',
          protocols: [],
          totalTime: 5000,
          success: i < 7,
          completedProtocols: i < 7 ? 2 : 0,
          failedProtocols: i >= 7 ? 2 : 0
        });
      }

      const effectiveness = await metricsCollector.getWorkflowEffectiveness('debug');
      expect(effectiveness.successRate).toBe(0.7);
      expect(effectiveness.usageCount).toBe(10);
    });
  });

  describe('getMostEffectiveCombinations', () => {
    it('should return empty for task type with no executions', async () => {
      const combinations = await metricsCollector.getMostEffectiveCombinations('audit');
      expect(combinations).toEqual([]);
    });

    it('should return combinations sorted by recommendation score', async () => {
      for (let i = 0; i < 5; i++) {
        await metricsCollector.recordWorkflowExecution({
          sessionId: `session-${i}`,
          taskDescription: 'Debug task',
          taskType: 'debug',
          protocols: [
            { sessionId: `session-${i}`, protocolName: 'fullindex', trigger: 'FULLINDEX', startTime: new Date(), endTime: new Date(Date.now() + 1000), executionTime: 1000, success: true, findingsCount: 2, artifactsCached: 1 },
            { sessionId: `session-${i}`, protocolName: 'debug', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 2000), executionTime: 2000, success: i < 4, findingsCount: 5, artifactsCached: 2 }
          ],
          totalTime: 3000,
          success: i < 4,
          completedProtocols: i < 4 ? 2 : 1,
          failedProtocols: i >= 4 ? 1 : 0
        });
      }

      const combinations = await metricsCollector.getMostEffectiveCombinations('debug');
      expect(combinations.length).toBe(1);
      expect(combinations[0].successRate).toBe(0.8);
    });
  });

  describe('optimizeWorkflow', () => {
    it('should return optimized workflow suggestions when best combination has high success rate', async () => {
      for (let i = 0; i < 5; i++) {
        await metricsCollector.recordWorkflowExecution({
          sessionId: `session-${i}`,
          taskDescription: 'Debug task',
          taskType: 'debug',
          protocols: [
            { sessionId: `session-${i}`, protocolName: 'fullindex', trigger: 'FULLINDEX', startTime: new Date(), endTime: new Date(Date.now() + 1000), executionTime: 1000, success: true, findingsCount: 2, artifactsCached: 1 },
            { sessionId: `session-${i}`, protocolName: 'deepdive', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 2000), executionTime: 2000, success: true, findingsCount: 5, artifactsCached: 2 }
          ],
          totalTime: 3000,
          success: true,
          completedProtocols: 2,
          failedProtocols: 0
        });
      }

      const optimization = await metricsCollector.optimizeWorkflow(
        { protocols: ['debug'] },
        'debug'
      );

      expect(optimization.optimized.protocols).toEqual(['fullindex', 'deepdive']);
      expect(optimization.confidence).toBeGreaterThan(0.7);
    });

    it('should return original workflow when no effective combinations exist', async () => {
      for (let i = 0; i < 3; i++) {
        await metricsCollector.recordWorkflowExecution({
          sessionId: `session-${i}`,
          taskDescription: 'Debug task',
          taskType: 'debug',
          protocols: [
            { sessionId: `session-${i}`, protocolName: 'debug', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 5000), executionTime: 5000, success: false, findingsCount: 0, artifactsCached: 0 }
          ],
          totalTime: 5000,
          success: false,
          completedProtocols: 0,
          failedProtocols: 1
        });
      }

      const optimization = await metricsCollector.optimizeWorkflow(
        { protocols: ['debug', 'test'] },
        'debug'
      );

      expect(optimization.optimized.protocols).toEqual(['debug', 'test']);
      expect(optimization.expectedTimeReduction).toBe(0);
      expect(optimization.confidence).toBe(0.5);
    });
  });

  describe('getStatistics', () => {
    it('should return empty statistics for no data', async () => {
      const stats = await metricsCollector.getStatistics();
      expect(stats.totalWorkflows).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.mostUsedProtocols).toEqual([]);
    });

    it('should return statistics with workflow executions', async () => {
      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-1',
        taskDescription: 'Debug authentication',
        taskType: 'debug',
        protocols: [
          { sessionId: 'session-1', protocolName: 'fullindex', trigger: 'FULLINDEX', startTime: new Date(), endTime: new Date(Date.now() + 1000), executionTime: 1000, success: true, findingsCount: 3, artifactsCached: 1 },
          { sessionId: 'session-1', protocolName: 'deepdive', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 2000), executionTime: 2000, success: true, findingsCount: 5, artifactsCached: 2 }
        ],
        totalTime: 3000,
        success: true,
        completedProtocols: 2,
        failedProtocols: 0
      });

      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-2',
        taskDescription: 'Debug database issue',
        taskType: 'debug',
        protocols: [
          { sessionId: 'session-2', protocolName: 'fullindex', trigger: 'FULLINDEX', startTime: new Date(), endTime: new Date(Date.now() + 1000), executionTime: 1000, success: true, findingsCount: 2, artifactsCached: 1 },
          { sessionId: 'session-2', protocolName: 'deepdive', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 2000), executionTime: 2000, success: false, findingsCount: 0, artifactsCached: 0 }
        ],
        totalTime: 3000,
        success: false,
        completedProtocols: 1,
        failedProtocols: 1
      });

      const stats = await metricsCollector.getStatistics();
      expect(stats.totalWorkflows).toBe(2);
      expect(stats.successRate).toBe(0.5);
      expect(stats.averageTime).toBe(3000);
      expect(stats.mostUsedProtocols).toContain('fullindex');
      expect(stats.mostUsedProtocols).toContain('deepdive');
    });

    it('should track protocol usage frequency correctly', async () => {
      for (let i = 0; i < 5; i++) {
        await metricsCollector.recordWorkflowExecution({
          sessionId: `session-${i}`,
          taskDescription: 'Debug task',
          taskType: 'debug',
          protocols: [
            { sessionId: `session-${i}`, protocolName: 'fullindex', trigger: 'FULLINDEX', startTime: new Date(), endTime: new Date(Date.now() + 1000), executionTime: 1000, success: true, findingsCount: 2, artifactsCached: 1 },
            { sessionId: `session-${i}`, protocolName: 'deepdive', trigger: 'DEEPDIVE', startTime: new Date(), endTime: new Date(Date.now() + 2000), executionTime: 2000, success: true, findingsCount: 5, artifactsCached: 2 }
          ],
          totalTime: 3000,
          success: true,
          completedProtocols: 2,
          failedProtocols: 0
        });
      }

      const stats = await metricsCollector.getStatistics();
      expect(stats.mostUsedProtocols[0]).toBe('fullindex');
    });
  });

  describe('query', () => {
    it('should return empty results when no workflows match', async () => {
      const results = await metricsCollector.query({ taskType: 'debug' });
      expect(results).toEqual([]);
    });

    it('should filter workflows by task type', async () => {
      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-1',
        taskDescription: 'Debug task',
        taskType: 'debug',
        protocols: [],
        totalTime: 5000,
        success: true,
        completedProtocols: 1,
        failedProtocols: 0
      });

      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-2',
        taskDescription: 'Build task',
        taskType: 'build',
        protocols: [],
        totalTime: 10000,
        success: true,
        completedProtocols: 1,
        failedProtocols: 0
      });

      const debugResults = await metricsCollector.query({ taskType: 'debug' });
      expect(debugResults.length).toBe(1);
      expect(debugResults[0].taskType).toBe('debug');

      const buildResults = await metricsCollector.query({ taskType: 'build' });
      expect(buildResults.length).toBe(1);
      expect(buildResults[0].taskType).toBe('build');
    });

    it('should filter workflows by time range', async () => {
      const pastTime = new Date(Date.now() - 86400000);
      const futureTime = new Date(Date.now() + 86400000);

      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-1',
        taskDescription: 'Past task',
        taskType: 'debug',
        protocols: [],
        totalTime: 5000,
        success: true,
        completedProtocols: 1,
        failedProtocols: 0
      });

      await metricsCollector.recordWorkflowExecution({
        sessionId: 'session-2',
        taskDescription: 'Current task',
        taskType: 'debug',
        protocols: [],
        totalTime: 5000,
        success: true,
        completedProtocols: 1,
        failedProtocols: 0
      });

      const results = await metricsCollector.query({
        taskType: 'debug',
        timeRange: { start: pastTime, end: futureTime }
      });

      expect(results.length).toBe(2);
    });
  });

  describe('getExecutionHistory', () => {
    it('should return empty for unknown protocol', async () => {
      const history = await metricsCollector.getExecutionHistory('unknown');
      expect(history).toEqual([]);
    });

    it('should return execution history for known protocol', async () => {
      await metricsCollector.recordProtocolExecution({
        sessionId: 'session-1',
        protocolName: 'test',
        trigger: 'TEST',
        startTime: new Date(),
        endTime: new Date(Date.now() + 1000),
        executionTime: 1000,
        success: true,
        findingsCount: 5,
        artifactsCached: 1
      });

      const history = await metricsCollector.getExecutionHistory('test');
      expect(history.length).toBe(1);
      expect(history[0].protocolName).toBe('test');
    });
  });

  describe('clear', () => {
    it('should clear all recorded data', async () => {
      await metricsCollector.recordProtocolExecution({
        sessionId: 'session-1',
        protocolName: 'test',
        trigger: 'TEST',
        startTime: new Date(),
        endTime: new Date(Date.now() + 1000),
        executionTime: 1000,
        success: true,
        findingsCount: 5,
        artifactsCached: 1
      });

      await metricsCollector.clear();

      const history = await metricsCollector.getExecutionHistory('test');
      expect(history).toEqual([]);
    });
  });
});
