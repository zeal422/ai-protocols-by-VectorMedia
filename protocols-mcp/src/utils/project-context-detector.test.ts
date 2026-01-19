import { describe, it, expect } from 'vitest';
import { detectProjectContext } from './project-context-detector.js';

describe('ProjectContextDetector', () => {
  describe('detectProjectContext', () => {
    it('should return ProjectContext object', async () => {
      const context = await detectProjectContext('/nonexistent/path');

      expect(context).toBeDefined();
      expect(context.language).toBeDefined();
      expect(context.framework).toBeDefined();
      expect(context.projectType).toBeDefined();
      expect(typeof context.detected).toBe('boolean');
    });

    it('should have all required fields', async () => {
      const context = await detectProjectContext('/test/path');

      expect(context.language).toBeDefined();
      expect(context.framework).toBeDefined();
      expect(context.projectType).toBeDefined();
      expect(context.testFramework).toBeDefined();
      expect(context.packageManager).toBeDefined();
      expect(typeof context.hasDocker).toBe('boolean');
      expect(typeof context.hasCI).toBe('boolean');
      expect(typeof context.hasGit).toBe('boolean');
      expect(Array.isArray(context.dependencies)).toBe(true);
      expect(Array.isArray(context.devDependencies)).toBe(true);
      expect(typeof context.detected).toBe('boolean');
    });

    it('should set detected to false for non-existent path', async () => {
      const context = await detectProjectContext('/nonexistent/path/xyz');

      expect(context.detected).toBe(false);
    });

    it('should default to unknown values when no project found', async () => {
      const context = await detectProjectContext('/nonexistent');

      expect(['unknown', undefined]).toContain(context.language);
      expect(['unknown', undefined]).toContain(context.framework);
    });
  });

  describe('Default context', () => {
    it('should have boolean flags', async () => {
      const context = await detectProjectContext('/test');

      expect(typeof context.hasDocker).toBe('boolean');
      expect(typeof context.hasCI).toBe('boolean');
      expect(typeof context.hasGit).toBe('boolean');
    });

    it('should have array for dependencies', async () => {
      const context = await detectProjectContext('/test');

      expect(Array.isArray(context.dependencies)).toBe(true);
      expect(Array.isArray(context.devDependencies)).toBe(true);
    });

    it('should have detected flag', async () => {
      const context = await detectProjectContext('/test');

      expect(typeof context.detected).toBe('boolean');
    });
  });

  describe('Current directory detection', () => {
    it('should detect current directory', async () => {
      const context = await detectProjectContext('.');

      expect(context).toBeDefined();
      expect(typeof context.detected).toBe('boolean');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty path', async () => {
      const context = await detectProjectContext('');

      expect(context).toBeDefined();
    });

    it('should handle root path', async () => {
      const context = await detectProjectContext('/');

      expect(context).toBeDefined();
    });

    it('should return valid context even if detection fails', async () => {
      const context = await detectProjectContext('/this/path/should/not/exist/xyz/abc/def');

      expect(context).toBeDefined();
      expect(context.detected).toBe(false);
    });
  });

  describe('Type safety', () => {
    it('should return strongly typed context', async () => {
      const context = await detectProjectContext('.');

      expect(typeof context.language).toBe('string');
      expect(typeof context.framework).toBe('string');
      expect(typeof context.projectType).toBe('string');
    });

    it('should have consistent types across calls', async () => {
      const context1 = await detectProjectContext('/path1');
      const context2 = await detectProjectContext('/path2');

      expect(typeof context1.detected).toBe(typeof context2.detected);
      expect(Array.isArray(context1.dependencies)).toBe(Array.isArray(context2.dependencies));
    });
  });
});
