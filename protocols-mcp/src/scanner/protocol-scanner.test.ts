import { describe, it, expect } from 'vitest';
import { ProtocolScanner } from './protocol-scanner.js';

describe('ProtocolScanner', () => {
  describe('basic functionality', () => {
    it('should create scanner instance', () => {
      const scanner = new ProtocolScanner('..');
      expect(scanner).toBeDefined();
    });

    it('should have scanProtocols method', async () => {
      const scanner = new ProtocolScanner('..');
      expect(typeof scanner.scanProtocols).toBe('function');
    });

    it('should have getProtocol method', async () => {
      const scanner = new ProtocolScanner('..');
      expect(typeof scanner.getProtocol).toBe('function');
    });

    it('should have getProtocolByTrigger method', async () => {
      const scanner = new ProtocolScanner('..');
      expect(typeof scanner.getProtocolByTrigger).toBe('function');
    });

    it('should have clearCache method', () => {
      const scanner = new ProtocolScanner('..');
      expect(typeof scanner.clearCache).toBe('function');
    });
  });

  describe('protocol scanning', () => {
    it('scanProtocols returns promise', () => {
      const scanner = new ProtocolScanner('..');
      const result = scanner.scanProtocols();
      expect(result instanceof Promise).toBe(true);
    });

    it('getProtocol returns promise', async () => {
      const scanner = new ProtocolScanner('..');
      const result = scanner.getProtocol('debug_protocol');
      expect(result instanceof Promise).toBe(true);
    });

    it('getProtocolByTrigger returns promise', async () => {
      const scanner = new ProtocolScanner('..');
      const result = scanner.getProtocolByTrigger('DEEPDIVE');
      expect(result instanceof Promise).toBe(true);
    });
  });
});
