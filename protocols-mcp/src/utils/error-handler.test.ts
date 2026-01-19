import { describe, it, expect } from 'vitest';
import { ProtocolError, handleError, createErrorResponse } from './error-handler.js';

describe('Error Handler', () => {
  describe('ProtocolError class', () => {
    it('should create ProtocolError with message and code', () => {
      const error = new ProtocolError('Test error', 'TEST_CODE');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('ProtocolError');
    });

    it('should create ProtocolError with details', () => {
      const details = { key: 'value' };
      const error = new ProtocolError('Test error', 'TEST_CODE', details);

      expect(error.details).toEqual(details);
    });

    it('should extend Error class', () => {
      const error = new ProtocolError('Test', 'CODE');

      expect(error instanceof Error).toBe(true);
    });

    it('should have proper error stack', () => {
      const error = new ProtocolError('Test error', 'TEST_CODE');

      expect(error.stack).toBeDefined();
      expect(error.stack?.includes('ProtocolError')).toBe(true);
    });

    it('should allow creating error without details', () => {
      const error = new ProtocolError('Test', 'CODE');

      expect(error.details).toBeUndefined();
    });
  });

  describe('handleError function', () => {
    it('should pass through ProtocolError as-is', () => {
      const original = new ProtocolError('Test', 'CODE');
      const handled = handleError(original, 'context');

      expect(handled).toBe(original);
    });

    it('should wrap regular Error in ProtocolError', () => {
      const original = new Error('Regular error');
      const handled = handleError(original, 'test_context');

      expect(handled).toBeInstanceOf(ProtocolError);
      expect(handled.code).toBeDefined();
    });

    it('should wrap unknown error types in ProtocolError', () => {
      const handled = handleError('string error', 'context');

      expect(handled).toBeInstanceOf(ProtocolError);
    });

    it('should include context in error code', () => {
      const original = new Error('Test');
      const handled = handleError(original, 'scanner');

      expect(handled.code).toBeDefined();
      expect(handled.code.length).toBeGreaterThan(0);
    });

    it('should preserve error message', () => {
      const message = 'Original error message';
      const original = new Error(message);
      const handled = handleError(original, 'context');

      expect(handled.message).toContain(message);
    });

    it('should handle null context', () => {
      const original = new Error('Test');
      const handled = handleError(original, '');

      expect(handled).toBeInstanceOf(ProtocolError);
    });
  });

  describe('createErrorResponse function', () => {
    it('should create error response object', () => {
      const error = new ProtocolError('Test error', 'CODE');
      const response = createErrorResponse(error);

      expect(response).toBeDefined();
      expect(response.isError).toBe(true);
    });

    it('should include error message in response', () => {
      const error = new ProtocolError('Test message', 'CODE');
      const response = createErrorResponse(error);

      expect(response.content[0].text).toContain('Test message');
    });

    it('should include error code in response', () => {
      const error = new ProtocolError('Test', 'ERROR_CODE');
      const response = createErrorResponse(error);

      expect(response.content[0].text).toContain('ERROR_CODE');
    });

    it('should have correct response structure', () => {
      const error = new ProtocolError('Test', 'CODE');
      const response = createErrorResponse(error);

      expect(response.content).toBeDefined();
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content[0].type).toBe('text');
      expect(typeof response.content[0].text).toBe('string');
    });

    it('should format error message properly', () => {
      const error = new ProtocolError('Something went wrong', 'INTERNAL_ERROR');
      const response = createErrorResponse(error);

      const text = response.content[0].text;
      expect(text).toMatch(/Error \[INTERNAL_ERROR\]/);
      expect(text).toContain('Something went wrong');
    });

    it('should set isError flag to true', () => {
      const error = new ProtocolError('Test', 'CODE');
      const response = createErrorResponse(error);

      expect(response.isError).toBe(true);
    });
  });

  describe('Error codes', () => {
    it('should handle validation errors', () => {
      const error = new ProtocolError('Invalid input', 'VALIDATION_ERROR', {
        field: 'name',
        reason: 'required'
      });

      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details?.field).toBe('name');
    });

    it('should handle not found errors', () => {
      const error = new ProtocolError('Protocol not found', 'NOT_FOUND', {
        protocol: 'debug_protocol'
      });

      expect(error.code).toBe('NOT_FOUND');
      expect(error.details?.protocol).toBe('debug_protocol');
    });

    it('should handle server errors', () => {
      const error = new ProtocolError('Internal error', 'INTERNAL_ERROR');

      expect(error.code).toBe('INTERNAL_ERROR');
    });

    it('should handle configuration errors', () => {
      const error = new ProtocolError('Config error', 'CONFIG_ERROR', {
        file: 'eslint.config.js'
      });

      expect(error.code).toBe('CONFIG_ERROR');
    });
  });

  describe('Error details', () => {
    it('should support string details', () => {
      const error = new ProtocolError('Error', 'CODE', { reason: 'test reason' });

      expect(error.details?.reason).toBe('test reason');
    });

    it('should support numeric details', () => {
      const error = new ProtocolError('Error', 'CODE', { statusCode: 404 });

      expect(error.details?.statusCode).toBe(404);
    });

    it('should support complex details', () => {
      const details: Record<string, unknown> = {
        nested: { key: 'value' },
        array: [1, 2, 3]
      };
      const error = new ProtocolError('Error', 'CODE', details);

      expect((error.details as Record<string, unknown>)?.nested).toBeDefined();
      expect((error.details as Record<string, unknown>)?.array).toEqual([1, 2, 3]);
    });

    it('should allow details to be undefined', () => {
      const error = new ProtocolError('Error', 'CODE');

      expect(error.details).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle error with very long message', () => {
      const longMessage = 'x'.repeat(10000);
      const error = new ProtocolError(longMessage, 'CODE');

      expect(error.message.length).toBeGreaterThan(1000);
    });

    it('should handle error with special characters', () => {
      const message = 'Error: <script>alert("xss")</script>';
      const error = new ProtocolError(message, 'CODE');

      expect(error.message).toContain('<script>');
    });

    it('should handle error with newlines', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      const error = new ProtocolError(message, 'CODE');

      expect(error.message).toContain('\n');
    });

    it('should handle empty error message', () => {
      const error = new ProtocolError('', 'CODE');

      expect(error.message).toBe('');
    });

    it('should handle error with unicode', () => {
      const message = 'Error: 你好世界 🌍';
      const error = new ProtocolError(message, 'CODE');

      expect(error.message).toContain('你好');
    });
  });

  describe('Response formatting', () => {
    it('should format response consistently', () => {
      const error1 = new ProtocolError('Test1', 'CODE1');
      const error2 = new ProtocolError('Test2', 'CODE2');

      const response1 = createErrorResponse(error1);
      const response2 = createErrorResponse(error2);

      expect(response1.content[0].type).toBe(response2.content[0].type);
      expect(response1.isError).toBe(response2.isError);
    });

    it('should escape special characters in response', () => {
      const error = new ProtocolError('Error with "quotes"', 'CODE');
      const response = createErrorResponse(error);

      expect(response.content[0].text).toBeDefined();
    });
  });
});
