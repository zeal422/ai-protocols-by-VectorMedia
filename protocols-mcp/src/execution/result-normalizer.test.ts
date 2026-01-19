import { describe, it, expect, beforeEach } from 'vitest';
import { ResultNormalizer } from '../../src/execution/result-normalizer.js';
import { StandardResult } from '../../src/types/execution.js';
import { ProjectContext } from '../../src/types/project-context.js';

describe('ResultNormalizer', () => {
  let normalizer: ResultNormalizer;

  beforeEach(() => {
    normalizer = new ResultNormalizer();
  });

  describe('normalizeProtocolResult', () => {
    it('should normalize debug protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('debug_protocol', {
        findings: [{ id: 'f1', severity: 'high', title: 'Test', description: 'Desc' }],
        executionTime: 100
      });

      expect(result.protocolName).toBe('debug_protocol');
      expect(result.executionTime).toBe(100);
      expect(result.findings.length).toBe(1);
      expect(result.findings[0].category).toBe('debug');
    });

    it('should normalize code review protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('code_review_protocol', {
        findings: [{ id: 'f1', severity: 'medium', title: 'Code Review', description: 'Review' }],
        recommendations: [{ id: 'r1', priority: 'high', action: 'Refactor', description: 'Fix it' }],
        executionTime: 200
      });

      expect(result.protocolName).toBe('code_review_protocol');
      expect(result.findings[0].category).toBe('code_review');
      expect(result.recommendations.length).toBe(1);
    });

    it('should normalize test automation protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('test_automation_protocol', {
        testResults: [{ id: 't1', name: 'test_a', status: 'passed' }],
        executionTime: 150
      });

      expect(result.protocolName).toBe('test_automation_protocol');
      expect(result.findings.length).toBe(1);
      expect(result.findings[0].title).toContain('test_a');
    });

    it('should normalize security audit protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('security_audit_protocol', {
        vulnerabilities: [{ id: 'v1', name: 'SQL Injection', severity: 'critical', description: 'Fix' }],
        executionTime: 300
      });

      expect(result.protocolName).toBe('security_audit_protocol');
      expect(result.findings[0].category).toBe('security');
      expect(result.findings[0].severity).toBe('critical');
    });

    it('should normalize performance protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('performance_protocol', {
        bottlenecks: [{ id: 'b1', name: 'Slow query', description: 'Fix' }],
        executionTime: 250
      });

      expect(result.protocolName).toBe('performance_protocol');
      expect(result.findings[0].category).toBe('performance');
    });

    it('should normalize refactor protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('refactor_protocol', {
        issues: [{ id: 'i1', title: 'Complex function', description: 'Refactor' }],
        executionTime: 180
      });

      expect(result.protocolName).toBe('refactor_protocol');
      expect(result.findings[0].category).toBe('refactor');
    });

    it('should normalize accessibility protocol results', async () => {
      const result = await normalizer.normalizeProtocolResult('accessibility_protocol', {
        issues: [{ id: 'a1', title: 'Missing alt text', description: 'Add alt' }],
        executionTime: 120
      });

      expect(result.protocolName).toBe('accessibility_protocol');
      expect(result.findings[0].category).toBe('accessibility');
    });

    it('should use generic normalizer for unknown protocols', async () => {
      const result = await normalizer.normalizeProtocolResult('unknown_protocol', {
        findings: [{ severity: 'info', title: 'Test', description: 'Test' }],
        executionTime: 50
      });

      expect(result.protocolName).toBe('unknown_protocol');
    });

    it('should handle empty results', async () => {
      const result = await normalizer.normalizeProtocolResult('debug_protocol', {});

      expect(result.protocolName).toBe('debug_protocol');
      expect(result.findings).toEqual([]);
      expect(result.recommendations).toEqual([]);
    });
  });

  describe('aggregateResults', () => {
    it('should aggregate multiple results', async () => {
      const results: StandardResult[] = [
        {
          protocolName: 'debug_protocol',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [{ findingId: 'f1', severity: 'high', category: 'debug', title: 'Issue 1', description: 'Desc' }],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'debug', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
        },
        {
          protocolName: 'code_review_protocol',
          executionTime: 200,
          timestamp: new Date(),
          success: true,
          findings: [{ findingId: 'f2', severity: 'medium', category: 'code', title: 'Issue 2', description: 'Desc' }],
          recommendations: [{ recommendationId: 'r1', priority: 'high', action: 'Fix', description: 'Fix it' }],
          artifacts: [],
          nextSteps: [{ stepId: 's1', action: 'Next step', reason: 'Because', optional: false }],
          metrics: { protocolName: 'code_review', executionTime: 200, cacheHits: 5, cacheMisses: 5, cacheHitRate: 0.5, memoryUsage: 100, success: true }
        }
      ];

      const aggregated = await normalizer.aggregateResults(results);

      expect(aggregated.protocolsExecuted).toBe(2);
      expect(aggregated.totalDuration).toBe(300);
      expect(aggregated.findings.length).toBe(2);
      expect(aggregated.recommendations.length).toBe(1);
      expect(aggregated.nextSteps.length).toBe(1);
      expect(aggregated.metrics.totalCacheHits).toBe(5);
      expect(aggregated.metrics.totalCacheMisses).toBe(5);
    });

    it('should throw error for empty results', async () => {
      await expect(normalizer.aggregateResults([])).rejects.toThrow('No results to aggregate');
    });

    it('should calculate correct metrics', async () => {
      const results: StandardResult[] = [
        {
          protocolName: 'p1',
          executionTime: 100,
          timestamp: new Date(),
          success: true,
          findings: [],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'p1', executionTime: 100, cacheHits: 10, cacheMisses: 10, cacheHitRate: 0.5, memoryUsage: 100, success: true }
        },
        {
          protocolName: 'p2',
          executionTime: 200,
          timestamp: new Date(),
          success: false,
          findings: [],
          recommendations: [],
          artifacts: [],
          nextSteps: [],
          metrics: { protocolName: 'p2', executionTime: 200, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 200, success: false }
        }
      ];

      const aggregated = await normalizer.aggregateResults(results);

      expect(aggregated.metrics.averageProtocolDuration).toBe(150);
      expect(aggregated.metrics.peakMemoryUsage).toBe(200);
      expect(aggregated.metrics.successRate).toBe(0.5);
    });
  });

  describe('extractFindings', () => {
    it('should extract findings from result', () => {
      const result: StandardResult = {
        protocolName: 'test',
        executionTime: 100,
        timestamp: new Date(),
        success: true,
        findings: [
          { findingId: 'f1', severity: 'high', category: 'test', title: 'Finding 1', description: 'Desc' },
          { findingId: 'f2', severity: 'medium', category: 'test', title: 'Finding 2', description: 'Desc' }
        ],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const findings = normalizer.extractFindings(result);

      expect(findings.length).toBe(2);
      expect(findings[0].findingId).toBe('f1');
    });
  });

  describe('suggestNextSteps', () => {
    it('should suggest debug protocol for critical findings', () => {
      const result: StandardResult = {
        protocolName: 'test',
        executionTime: 100,
        timestamp: new Date(),
        success: true,
        findings: [
          { findingId: 'f1', severity: 'critical', category: 'test', title: 'Critical Issue', description: 'Desc' }
        ],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const nextSteps = normalizer.suggestNextSteps(result, {
        sessionId: 'session-1',
        projectContext: {} as ProjectContext,
        protocolCount: 1,
        findingsSoFar: []
      });

      expect(nextSteps.length).toBeGreaterThan(0);
      expect(nextSteps.some(s => s.protocolName === 'debug_protocol')).toBe(true);
      expect(nextSteps.some(s => s.action === 'Debug critical findings')).toBe(true);
    });

    it('should suggest applying recommendations', () => {
      const result: StandardResult = {
        protocolName: 'test',
        executionTime: 100,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [
          { recommendationId: 'r1', priority: 'high', action: 'Fix this', description: 'Do it' }
        ],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const nextSteps = normalizer.suggestNextSteps(result, {
        sessionId: 'session-1',
        projectContext: {} as ProjectContext,
        protocolCount: 1,
        findingsSoFar: []
      });

      expect(nextSteps.some(s => s.action.includes('recommendations'))).toBe(true);
    });

    it('should suggest reviewing warnings', () => {
      const result: StandardResult = {
        protocolName: 'test',
        executionTime: 100,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        warnings: [{ warningId: 'w1', warningType: 'deprecation', message: 'Old API', timestamp: new Date() }],
        metrics: { protocolName: 'test', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      const nextSteps = normalizer.suggestNextSteps(result, {
        sessionId: 'session-1',
        projectContext: {} as ProjectContext,
        protocolCount: 1,
        findingsSoFar: []
      });

      expect(nextSteps.some(s => s.action.includes('warnings'))).toBe(true);
    });
  });

  describe('validateResult', () => {
    it('should return true for valid result', () => {
      const result: StandardResult = {
        protocolName: 'test',
        executionTime: 100,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: 100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      expect(normalizer.validateResult(result)).toBe(true);
    });

    it('should return false for invalid result', () => {
      const result = {
        protocolName: 'test',
        executionTime: -100,
        timestamp: new Date(),
        success: true,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: { protocolName: 'test', executionTime: -100, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: true }
      };

      expect(normalizer.validateResult(result as StandardResult)).toBe(false);
    });
  });
});
