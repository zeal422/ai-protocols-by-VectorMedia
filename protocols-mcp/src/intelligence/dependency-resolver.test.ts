/**
 * Dependency Resolver Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyResolver } from '../../src/intelligence/dependency-resolver.js';
import type { ExtendedProtocolMetadata } from '../../src/types/index.js';

interface ProtocolWithPrerequisites extends ExtendedProtocolMetadata {
  prerequisites: string[];
}

function createProtocol(name: string, prerequisites: string[] = []): ProtocolWithPrerequisites {
  return {
    id: name,
    fileName: `${name}.md`,
    name,
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} Protocol`,
    triggers: [name.toUpperCase()],
    category: 'Core',
    tags: [],
    difficulty: 'intermediate',
    purpose: 'Test protocol',
    filePath: 'BRAIN/',
    version: '1.0.0',
    prerequisites,
    worksWellWith: [],
    platformTags: ['fullstack'],
    stackSpecific: {},
    hasFrontmatter: false
  };
}

describe('DependencyResolver', () => {
  let resolver: DependencyResolver;

  beforeEach(() => {
    const protocols: ProtocolWithPrerequisites[] = [
      createProtocol('fullindex'),
      createProtocol('mdap', ['fullindex']),
      createProtocol('fullspec', ['fullindex']),
      createProtocol('debug'),
      createProtocol('audit', ['fullindex', 'mdap'])
    ];
    resolver = new DependencyResolver(protocols);
  });

  describe('resolvePrerequisites', () => {
    it('should return empty array for protocol with no dependencies', async () => {
      const prereqs = await resolver.resolvePrerequisites('fullindex');
      expect(prereqs).toEqual([]);
    });

    it('should return direct dependencies', async () => {
      const prereqs = await resolver.resolvePrerequisites('mdap');
      expect(prereqs).toContain('fullindex');
      expect(prereqs.length).toBe(1);
    });

    it('should return transitive dependencies', async () => {
      const prereqs = await resolver.resolvePrerequisites('audit');
      expect(prereqs).toContain('fullindex');
      expect(prereqs).toContain('mdap');
      expect(prereqs.length).toBe(2);
    });

    it('should return empty for unknown protocol', async () => {
      const prereqs = await resolver.resolvePrerequisites('unknown_protocol');
      expect(prereqs).toEqual([]);
    });
  });

  describe('validateChain', () => {
    it('should validate simple chain', async () => {
      const result = await resolver.validateChain(['fullindex', 'mdap']);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should return valid when prerequisites are met', async () => {
      const result = await resolver.validateChain(['mdap']);
      expect(result.valid).toBe(true);
    });

    it('should detect unknown protocols', async () => {
      const result = await resolver.validateChain(['fullindex', 'unknown']);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.type === 'unknown_protocol')).toBe(true);
    });

    it('should return recommended order', async () => {
      const result = await resolver.validateChain(['mdap', 'fullindex']);
      expect(result.recommendedOrder).toBeDefined();
      expect(result.recommendedOrder!.length).toBeGreaterThan(0);
    });
  });

  describe('detectCircularDependencies', () => {
    it('should detect no cycles in simple chain', async () => {
      const cycles = await resolver.detectCircularDependencies();
      expect(cycles).toHaveLength(0);
    });

    it('should detect circular dependency', async () => {
      const cyclicProtocols: ProtocolWithPrerequisites[] = [
        createProtocol('a', ['b']),
        createProtocol('b', ['a'])
      ];
      const cyclicResolver = new DependencyResolver(cyclicProtocols);
      const cycles = await cyclicResolver.detectCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);
    });

    it('should detect self-dependency', async () => {
      const selfDepProtocols: ProtocolWithPrerequisites[] = [
        createProtocol('self', ['self'])
      ];
      const selfDepResolver = new DependencyResolver(selfDepProtocols);
      const cycles = await selfDepResolver.detectCircularDependencies();
      expect(cycles.length).toBeGreaterThan(0);
    });
  });

  describe('buildExecutionGraph', () => {
    it('should build graph with correct structure', async () => {
      const graph = await resolver.buildExecutionGraph(['fullindex', 'mdap']);
      expect(graph.nodes.has('fullindex')).toBe(true);
      expect(graph.nodes.has('mdap')).toBe(true);
      expect(graph.edges.has('mdap')).toBe(true);
    });

    it('should detect cycles in graph', async () => {
      const cyclicProtocols: ProtocolWithPrerequisites[] = [
        createProtocol('a', ['b']),
        createProtocol('b', ['a'])
      ];
      const cyclicResolver = new DependencyResolver(cyclicProtocols);
      const graph = await cyclicResolver.buildExecutionGraph(['a', 'b']);
      expect(graph.hasCycles).toBe(true);
    });
  });

  describe('getExecutionOrder', () => {
    it('should return protocols in some order', async () => {
      const order = await resolver.getExecutionOrder(['mdap', 'fullspec', 'fullindex']);
      expect(order.length).toBe(3);
      expect(order).toContain('fullindex');
      expect(order).toContain('mdap');
      expect(order).toContain('fullspec');
    });

    it('should handle protocol with no dependencies', async () => {
      const order = await resolver.getExecutionOrder(['debug']);
      expect(order).toContain('debug');
    });

    it('should handle diamond dependency pattern', async () => {
      const diamondProtocols: ProtocolWithPrerequisites[] = [
        createProtocol('root'),
        createProtocol('left', ['root']),
        createProtocol('right', ['root']),
        createProtocol('top', ['left', 'right'])
      ];
      const diamondResolver = new DependencyResolver(diamondProtocols);
      const order = await diamondResolver.getExecutionOrder(['top', 'left', 'right', 'root']);
      expect(order.length).toBe(4);
      expect(order).toContain('root');
      expect(order).toContain('top');
    });
  });

  describe('shouldRunBefore', () => {
    it('should return boolean result', async () => {
      const result1 = await resolver.shouldRunBefore('fullindex', 'mdap');
      const result2 = await resolver.shouldRunBefore('mdap', 'fullindex');
      expect(typeof result1).toBe('boolean');
      expect(typeof result2).toBe('boolean');
    });
  });

  describe('getProtocolMetadata', () => {
    it('should return metadata for known protocol', () => {
      const metadata = resolver.getProtocolMetadata('fullindex');
      expect(metadata).toBeDefined();
      expect(metadata!.name).toBe('fullindex');
    });

    it('should return undefined for unknown protocol', () => {
      const metadata = resolver.getProtocolMetadata('unknown');
      expect(metadata).toBeUndefined();
    });
  });

  describe('getAllProtocolNames', () => {
    it('should return all protocol names', () => {
      const names = resolver.getAllProtocolNames();
      expect(names).toContain('fullindex');
      expect(names).toContain('mdap');
      expect(names).toContain('fullspec');
      expect(names).toContain('debug');
      expect(names).toContain('audit');
    });
  });
});
