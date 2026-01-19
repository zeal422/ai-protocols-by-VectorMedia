import { describe, it, expect, beforeEach } from 'vitest';
import {
  ErrorRecoverySystem,
  ErrorClass,
  RecoveryStrategy,
  ErrorContext
} from './error-recovery.js';
import { ExtendedProtocolMetadata } from '../types/protocol-frontmatter.js';

const createMockProtocol = (overrides: Partial<ExtendedProtocolMetadata> = {}): ExtendedProtocolMetadata => ({
  id: 'test-protocol',
  fileName: 'test-protocol.md',
  name: 'test_protocol',
  title: 'Test Protocol',
  triggers: ['TEST'],
  category: 'Testing',
  tags: ['test', 'validation'],
  difficulty: 'intermediate',
  purpose: 'Test protocol for unit testing',
  filePath: 'BRAIN/',
  version: '1.0.0',
  prerequisites: [],
  worksWellWith: [],
  platformTags: ['fullstack'],
  stackSpecific: {},
  hasFrontmatter: true,
  ...overrides
});

const mockProtocols: ExtendedProtocolMetadata[] = [
  createMockProtocol({ name: 'debug_protocol', prerequisites: [] }),
  createMockProtocol({ name: 'error_fix_protocol', prerequisites: ['debug_protocol'] }),
  createMockProtocol({ name: 'mdap_protocol', prerequisites: ['codebase_indexing_protocol'] }),
  createMockProtocol({ name: 'MASTER_PROTOCOL', prerequisites: [] })
];

const createErrorContext = (error: Error, protocol: string): ErrorContext => ({
  error,
  protocol,
  session: { sessionId: 'test-session', executedProtocols: ['debug_protocol'] },
  previousResults: []
});

describe('ErrorRecoverySystem', () => {
  let system: ErrorRecoverySystem;

  beforeEach(() => {
    system = new ErrorRecoverySystem(mockProtocols);
  });

  describe('classifyError', () => {
    it('should classify timeout errors', async () => {
      const timeoutError = new Error('Request timeout after 30000ms');
      const context = createErrorContext(timeoutError, 'debug_protocol');

      const result = await system.classifyError(timeoutError, context);

      expect(result).toBe(ErrorClass.TIMEOUT);
    });

    it('should classify resource exhausted errors', async () => {
      const memoryError = new Error('JavaScript heap out of memory');
      const context = createErrorContext(memoryError, 'debug_protocol');

      const result = await system.classifyError(memoryError, context);

      expect(result).toBe(ErrorClass.RESOURCE_EXHAUSTED);
    });

    it('should classify invalid input errors', async () => {
      const validationError = new Error('Invalid input: name is required');
      const context = createErrorContext(validationError, 'debug_protocol');

      const result = await system.classifyError(validationError, context);

      expect(result).toBe(ErrorClass.INVALID_INPUT);
    });

    it('should classify dependency errors', async () => {
      const dependencyError = new Error('Cannot find module express');
      const context = createErrorContext(dependencyError, 'debug_protocol');

      const result = await system.classifyError(dependencyError, context);

      expect(result).toBe(ErrorClass.DEPENDENCY_ERROR);
    });

    it('should classify protocol failure errors', async () => {
      const protocolError = new Error('Protocol execution failed');
      const context = createErrorContext(protocolError, 'debug_protocol');

      const result = await system.classifyError(protocolError, context);

      expect(result).toBe(ErrorClass.PROTOCOL_FAILURE);
    });

    it('should classify unknown errors', async () => {
      const unknownError = new Error('Something unexpected happened');
      const context = createErrorContext(unknownError, 'debug_protocol');

      const result = await system.classifyError(unknownError, context);

      expect(result).toBe(ErrorClass.UNKNOWN);
    });

    it('should be case insensitive when classifying errors', async () => {
      const upperCaseError = new Error('TIMEOUT EXCEPTION');
      const context = createErrorContext(upperCaseError, 'debug_protocol');

      const result = await system.classifyError(upperCaseError, context);

      expect(result).toBe(ErrorClass.TIMEOUT);
    });
  });

  describe('findRecoveryStrategy', () => {
    it('should return timeout strategies for timeout errors', async () => {
      const timeoutError = new Error('Timeout');
      const context = createErrorContext(timeoutError, 'debug_protocol');

      const strategies = await system.findRecoveryStrategy(ErrorClass.TIMEOUT, context);

      expect(strategies.length).toBeGreaterThan(0);
      expect(strategies.some(s => s.name === 'retry_with_shorter_timeout')).toBe(true);
      expect(strategies.some(s => s.name === 'reduce_scope')).toBe(true);
    });

    it('should return resource exhausted strategies', async () => {
      const memoryError = new Error('Out of memory');
      const context = createErrorContext(memoryError, 'debug_protocol');

      const strategies = await system.findRecoveryStrategy(ErrorClass.RESOURCE_EXHAUSTED, context);

      expect(strategies.length).toBeGreaterThan(0);
      expect(strategies.some(s => s.name === 'reduce_scope')).toBe(true);
    });

    it('should return invalid input strategies', async () => {
      const validationError = new Error('Invalid input');
      const context = createErrorContext(validationError, 'debug_protocol');

      const strategies = await system.findRecoveryStrategy(ErrorClass.INVALID_INPUT, context);

      expect(strategies.length).toBeGreaterThan(0);
      expect(strategies.some(s => s.name === 'validate_input')).toBe(true);
    });

    it('should filter strategies based on prerequisites', async () => {
      const protocolWithPrereqs = createMockProtocol({
        name: 'test_protocol',
        prerequisites: ['nonexistent_prerequisite']
      });
      const systemWithPrereqs = new ErrorRecoverySystem([
        ...mockProtocols,
        protocolWithPrereqs
      ]);

      const error = new Error('Test error');
      const context: ErrorContext = {
        error,
        protocol: 'test_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const strategies = await systemWithPrereqs.findRecoveryStrategy(
        ErrorClass.PROTOCOL_FAILURE,
        context
      );

      expect(strategies.some(s => s.name === 'retry_with_shorter_timeout')).toBe(false);
    });

    it('should return unknown strategies for unknown errors', async () => {
      const unknownError = new Error('Unknown error');
      const context = createErrorContext(unknownError, 'debug_protocol');

      const strategies = await system.findRecoveryStrategy(ErrorClass.UNKNOWN, context);

      expect(strategies.length).toBeGreaterThan(0);
      expect(strategies.some(s => s.name === 'generic_recovery')).toBe(true);
    });
  });

  describe('attemptRecovery', () => {
    it('should attempt recovery with given strategy', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategy: RecoveryStrategy = {
        name: 'test_strategy',
        description: 'Test strategy',
        steps: [{ action: 'retry', maxAttempts: 1 }],
        estimatedTime: '10s',
        successProbability: 0.5
      };

      const result = await system.attemptRecovery(error, strategy, context);

      expect(result.strategyUsed).toBe('test_strategy');
      expect(result.attempts).toBeGreaterThanOrEqual(1);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
    });

    it('should return success when recovery succeeds', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategy: RecoveryStrategy = {
        name: 'successful_strategy',
        description: 'Test strategy',
        steps: [{ action: 'fallback' }],
        estimatedTime: '5s',
        successProbability: 1.0
      };

      const result = await system.attemptRecovery(error, strategy, context);

      expect(result.success).toBe(true);
      expect(result.recoveredResult).toBeDefined();
      expect(result.recoveredResult?.success).toBe(true);
    });

    it('should return failure when recovery fails', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategy: RecoveryStrategy = {
        name: 'failing_strategy',
        description: 'Test strategy',
        steps: [{ action: 'retry', maxAttempts: 1 }],
        estimatedTime: '5s',
        successProbability: 0.0
      };

      const result = await system.attemptRecovery(error, strategy, context);

      expect(result.attempts).toBeGreaterThanOrEqual(1);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
    });

    it('should track attempt count', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategy: RecoveryStrategy = {
        name: 'multi_attempt_strategy',
        description: 'Test strategy',
        steps: [{ action: 'retry', maxAttempts: 3 }],
        estimatedTime: '15s',
        successProbability: 0.5
      };

      const result = await system.attemptRecovery(error, strategy, context);

      expect(result.attempts).toBeGreaterThanOrEqual(1);
    });
  });

  describe('escalateIfUnrecoverable', () => {
    it('should escalate when recovery success rate is low', async () => {
      const systemWithLowSuccess = new ErrorRecoverySystem([
        createMockProtocol({ name: 'test_protocol', prerequisites: [] })
      ]);

      const error = new Error('Unknown error');
      const context: ErrorContext = {
        error,
        protocol: 'test_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const result = await systemWithLowSuccess.escalateIfUnrecoverable(error, context);

      expect(result.shouldEscalate).toBe(true);
      expect(result.escalateTo).toBeDefined();
    });

    it('should escalate when error recovery keeps failing', async () => {
      const systemWithUnknownProtocol = new ErrorRecoverySystem([
        createMockProtocol({ name: 'unknown_protocol', prerequisites: [] })
      ]);

      const error = new Error('Unknown error');
      const context: ErrorContext = {
        error,
        protocol: 'unknown_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const result = await systemWithUnknownProtocol.escalateIfUnrecoverable(error, context);

      expect(result.shouldEscalate).toBe(true);
      expect(result.escalateTo).toBeDefined();
    });

    it('should not escalate for recoverable errors', async () => {
      const validationError = new Error('Invalid input');
      const context = createErrorContext(validationError, 'debug_protocol');

      const result = await system.escalateIfUnrecoverable(validationError, context);

      expect(result.shouldEscalate).toBe(false);
    });

    it('should determine correct escalation target when escalating', async () => {
      const systemWithUnknownProtocol = new ErrorRecoverySystem([
        createMockProtocol({ name: 'unknown_protocol', prerequisites: [] })
      ]);

      const unknownError = new Error('Some random error');
      const context: ErrorContext = {
        error: unknownError,
        protocol: 'unknown_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const result = await systemWithUnknownProtocol.escalateIfUnrecoverable(unknownError, context);

      expect(result.shouldEscalate).toBe(true);
      expect(result.escalateTo).toBe('MASTER');
    });
  });

  describe('getAllRecoveryStrategies', () => {
    it('should return all strategies for an error', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategies = await system.getAllRecoveryStrategies(error, context);

      expect(strategies.length).toBeGreaterThan(0);
    });

    it('should include fallback strategies', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      const strategies = await system.getAllRecoveryStrategies(error, context);

      const hasGenericRecovery = strategies.some(s => s.name === 'generic_recovery');
      expect(hasGenericRecovery).toBe(true);
    });
  });

  describe('error history management', () => {
    it('should clear error history for specific protocol', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      await system.escalateIfUnrecoverable(error, context);
      await system.escalateIfUnrecoverable(error, context);
      await system.escalateIfUnrecoverable(error, context);

      system.clearErrorHistory('debug_protocol');

      const history = system.getErrorHistory();
      const debugProtocolErrors = Object.keys(history).filter(k => k.startsWith('debug_protocol:'));
      expect(debugProtocolErrors.length).toBe(0);
    });

    it('should clear all error history', async () => {
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      await system.escalateIfUnrecoverable(error, context);

      system.clearErrorHistory();

      const history = system.getErrorHistory();
      expect(Object.keys(history).length).toBe(0);
    });

    it('should clear error history for specific protocol', async () => {
      const systemForHistory = new ErrorRecoverySystem(mockProtocols);
      const error = new Error('Test error');
      const context = createErrorContext(error, 'debug_protocol');

      await systemForHistory.escalateIfUnrecoverable(error, context);
      systemForHistory.clearErrorHistory('debug_protocol');

      const history = systemForHistory.getErrorHistory();
      const debugProtocolErrors = Object.keys(history).filter(k => k.startsWith('debug_protocol:'));
      expect(debugProtocolErrors.length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty protocols list', async () => {
      const emptySystem = new ErrorRecoverySystem([]);
      const error = new Error('Test error');
      const context: ErrorContext = {
        error,
        protocol: 'unknown_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const strategies = await emptySystem.findRecoveryStrategy(ErrorClass.UNKNOWN, context);

      expect(strategies.length).toBeGreaterThan(0);
    });

    it('should handle unknown protocol', async () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        error,
        protocol: 'unknown_protocol',
        session: { sessionId: 'test', executedProtocols: [] },
        previousResults: []
      };

      const strategies = await system.findRecoveryStrategy(ErrorClass.TIMEOUT, context);

      expect(strategies.length).toBeGreaterThan(0);
    });

    it('should handle empty error message', async () => {
      const error = new Error('');
      const context = createErrorContext(error, 'debug_protocol');

      const errorClass = await system.classifyError(error, context);

      expect(errorClass).toBe(ErrorClass.UNKNOWN);
    });
  });
});
