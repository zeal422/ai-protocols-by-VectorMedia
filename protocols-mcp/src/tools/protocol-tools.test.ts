import { describe, it, expect } from 'vitest';
import { TOOLS } from './protocol-tools.js';

describe('Protocol Tools', () => {
  describe('Tool definitions', () => {
    it('should have tools defined', () => {
      expect(TOOLS).toBeDefined();
      expect(Array.isArray(TOOLS)).toBe(true);
    });

    it('should have get_protocol tool', () => {
      const tool = TOOLS.find(t => t.name === 'get_protocol');
      expect(tool).toBeDefined();
      expect(tool?.description).toBeDefined();
    });

    it('should have list_protocols tool', () => {
      const tool = TOOLS.find(t => t.name === 'list_protocols');
      expect(tool).toBeDefined();
    });

    it('should have get_protocol_by_trigger tool', () => {
      const tool = TOOLS.find(t => t.name === 'get_protocol_by_trigger');
      expect(tool).toBeDefined();
    });

    it('should have search_protocols tool', () => {
      const tool = TOOLS.find(t => t.name === 'search_protocols');
      expect(tool).toBeDefined();
    });

    it('should have fuzzy_match_protocol tool', () => {
      const tool = TOOLS.find(t => t.name === 'fuzzy_match_protocol');
      expect(tool).toBeDefined();
    });

    it('should have route_task tool', () => {
      const tool = TOOLS.find(t => t.name === 'route_task');
      expect(tool).toBeDefined();
    });
  });

  describe('Tool metadata', () => {
    it('each tool should have name', () => {
      TOOLS.forEach(tool => {
        expect(tool.name).toBeDefined();
        expect(typeof tool.name).toBe('string');
        expect(tool.name.length).toBeGreaterThan(0);
      });
    });

    it('each tool should have description', () => {
      TOOLS.forEach(tool => {
        expect(tool.description).toBeDefined();
        expect(typeof tool.description).toBe('string');
      });
    });

    it('each tool should have inputSchema', () => {
      TOOLS.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(typeof tool.inputSchema).toBe('object');
      });
    });

    it('each tool should have unique name', () => {
      const names = TOOLS.map(t => t.name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('Tool schemas', () => {
    it('all schemas should have properties', () => {
      TOOLS.forEach(tool => {
        const schema = tool.inputSchema as Record<string, unknown>;
        expect(schema.properties).toBeDefined();
        expect(typeof schema.properties).toBe('object');
      });
    });

    it('all schemas should have type', () => {
      TOOLS.forEach(tool => {
        const schema = tool.inputSchema as Record<string, unknown>;
        expect(schema.type).toBeDefined();
      });
    });
  });

  describe('Tool descriptions', () => {
    it('tools should have meaningful descriptions', () => {
      TOOLS.forEach(tool => {
        expect(tool.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle tools array access', () => {
      expect(TOOLS[0]).toBeDefined();
      expect(TOOLS[TOOLS.length - 1]).toBeDefined();
    });

    it('should allow iteration over tools', () => {
      let count = 0;
      TOOLS.forEach(() => {
        count++;
      });

      expect(count).toBeGreaterThan(0);
    });

    it('should allow mapping tools', () => {
      const names = TOOLS.map(t => t.name);

      expect(names.length).toBeGreaterThan(0);
      expect(names.every(n => typeof n === 'string')).toBe(true);
    });
  });
});
