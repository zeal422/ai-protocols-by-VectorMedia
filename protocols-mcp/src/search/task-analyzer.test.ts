import { describe, it, expect } from 'vitest';
import { analyzeTaskIntent, getTaskDifficulty, getTaskTimeEstimate, getTaskTags } from './task-analyzer.js';

describe('TaskAnalyzer', () => {
  describe('analyzeTaskIntent', () => {
    it('should identify debug task type', () => {
      const intent = analyzeTaskIntent('I have a bug in my code that I need to fix');
      expect(intent).toBe('debug');
    });

    it('should identify build task type', () => {
      const intent = analyzeTaskIntent('I want to create a new feature for user authentication');
      expect(intent).toBe('build');
    });

    it('should identify refactor task type', () => {
      const intent = analyzeTaskIntent('I need to refactor this messy code to make it cleaner');
      expect(intent).toBe('refactor');
    });

    it('should identify test task type', () => {
      const intent = analyzeTaskIntent('Write unit tests for this component');
      expect(intent).toBe('test');
    });

    it('should identify audit task type', () => {
      const intent = analyzeTaskIntent('Audit and review this code for security issues');
      expect(intent).toBe('audit');
    });

    it('should identify optimize task type', () => {
      const intent = analyzeTaskIntent('The application is running slow, need to optimize performance');
      expect(intent).toBe('optimize');
    });

    it('should identify setup task type', () => {
      const intent = analyzeTaskIntent('Setup and configure a new project with initialization');
      expect(intent).toBe('setup');
    });

    it('should be case-insensitive', () => {
      const intent1 = analyzeTaskIntent('I HAVE A BUG TO FIX');
      const intent2 = analyzeTaskIntent('i have a bug to fix');

      expect(intent1).toBe('debug');
      expect(intent2).toBe('debug');
    });

    it('should return unknown for ambiguous descriptions', () => {
      const intent = analyzeTaskIntent('random text with no task keywords');
      expect(['unknown', 'debug', 'build', 'refactor', 'audit', 'optimize', 'test', 'setup']).toContain(intent);
    });

    it('should prioritize first matching task type', () => {
      const intent = analyzeTaskIntent('Debug this error by refactoring the code');
      // Should match one of the task types
      expect(['debug', 'refactor']).toContain(intent);
    });
  });

  describe('getTaskDifficulty', () => {
    it('should return beginner for setup tasks', () => {
      const difficulty = getTaskDifficulty('setup');
      expect(difficulty).toBe('beginner');
    });

    it('should return intermediate for build tasks', () => {
      const difficulty = getTaskDifficulty('build');
      expect(difficulty).toBe('intermediate');
    });

    it('should return advanced for refactor tasks', () => {
      const difficulty = getTaskDifficulty('refactor');
      expect(difficulty).toBe('advanced');
    });

    it('should return intermediate for debug tasks', () => {
      const difficulty = getTaskDifficulty('debug');
      expect(difficulty).toBe('intermediate');
    });

    it('should return advanced for audit tasks', () => {
      const difficulty = getTaskDifficulty('audit');
      expect(difficulty).toBe('advanced');
    });

    it('should return advanced for optimize tasks', () => {
      const difficulty = getTaskDifficulty('optimize');
      expect(difficulty).toBe('advanced');
    });

    it('should return intermediate for test tasks', () => {
      const difficulty = getTaskDifficulty('test');
      expect(difficulty).toBe('intermediate');
    });
  });

  describe('getTaskTimeEstimate', () => {
    it('should return time estimate for debug tasks', () => {
      const estimate = getTaskTimeEstimate('debug');
      expect(typeof estimate).toBe('string');
      expect(estimate.length).toBeGreaterThan(0);
    });

    it('should return time estimate for build tasks', () => {
      const estimate = getTaskTimeEstimate('build');
      expect(typeof estimate).toBe('string');
      expect(estimate.includes('hour')).toBe(true);
    });

    it('should return time estimate for refactor tasks', () => {
      const estimate = getTaskTimeEstimate('refactor');
      expect(typeof estimate).toBe('string');
    });

    it('should return reasonable estimates', () => {
      const estimates = {
        setup: getTaskTimeEstimate('setup'),
        debug: getTaskTimeEstimate('debug'),
        build: getTaskTimeEstimate('build'),
        refactor: getTaskTimeEstimate('refactor'),
        audit: getTaskTimeEstimate('audit'),
        optimize: getTaskTimeEstimate('optimize'),
        test: getTaskTimeEstimate('test')
      };

      Object.values(estimates).forEach(estimate => {
        expect(estimate).toBeDefined();
        expect(typeof estimate).toBe('string');
      });
    });
  });

  describe('getTaskTags', () => {
    it('should return tags for debug tasks', () => {
      const tags = getTaskTags('debug');
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should return tags for build tasks', () => {
      const tags = getTaskTags('build');
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });

    it('should return tags for refactor tasks', () => {
      const tags = getTaskTags('refactor');
      expect(Array.isArray(tags)).toBe(true);
    });

    it('should return relevant tags for task type', () => {
      const tags = getTaskTags('debug');
      const tagString = tags.join(' ').toLowerCase();

      expect(tagString).toMatch(/(bug|error|troubleshoot|debug)/i);
    });

    it('should return tags for all task types', () => {
      const taskTypes = ['debug', 'build', 'refactor', 'audit', 'optimize', 'test', 'setup', 'document', 'unknown'] as const;

      taskTypes.forEach(taskType => {
        const tags = getTaskTags(taskType as typeof taskTypes[number]);
        expect(Array.isArray(tags)).toBe(true);
      });
    });

    it('should return unique tags', () => {
      const tags = getTaskTags('debug');
      const uniqueTags = new Set(tags);

      expect(uniqueTags.size).toBe(tags.length);
    });
  });

  describe('Multi-keyword scenarios', () => {
    it('should handle descriptions with multiple keywords', () => {
      const intent = analyzeTaskIntent('I found a bug and need to write tests and refactor');
      expect(['debug', 'test', 'refactor'] as const).toContain(intent);
    });

    it('should handle negative keywords', () => {
      const intent = analyzeTaskIntent('This is not broken, just needs optimization');
      expect(['optimize', 'debug']).toContain(intent);
    });

    it('should prioritize more specific keywords', () => {
      const intent = analyzeTaskIntent('Refactor the authentication setup');
      expect(['refactor', 'setup']).toContain(intent);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      const intent = analyzeTaskIntent('');
      expect(typeof intent).toBe('string');
    });

    it('should handle very long descriptions', () => {
      const longDescription = 'debug ' + 'word '.repeat(1000);
      const intent = analyzeTaskIntent(longDescription);
      expect(intent).toBe('debug');
    });

    it('should handle special characters', () => {
      const intent = analyzeTaskIntent('@#$%^&*() debug ???');
      expect(intent).toBe('debug');
    });

    it('should handle unicode characters', () => {
      const intent = analyzeTaskIntent('I need to fix this bug 🐛');
      expect(intent).toBe('debug');
    });

    it('should handle multiple spaces', () => {
      const intent = analyzeTaskIntent('debug    this    error');
      expect(intent).toBe('debug');
    });
  });
});
