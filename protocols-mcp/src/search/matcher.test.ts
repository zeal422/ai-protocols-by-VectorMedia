import { describe, it, expect, beforeEach } from 'vitest';
import { SearchMatcher } from './matcher.js';
import type { SearchIndex } from './indexer.js';

describe('SearchMatcher', () => {
  let matcher: SearchMatcher;
  let mockIndex: SearchIndex;

  beforeEach(() => {
    matcher = new SearchMatcher();
    
    mockIndex = {
      protocols: new Map([
        ['debug_protocol', {
          metadata: {
            id: 'debug_protocol',
            fileName: 'debug_protocol.md',
            name: 'debug_protocol',
            title: 'Debug Protocol: Scientific Method',
            triggers: ['DEEPDIVE'],
            category: 'Debugging',
            tags: ['troubleshooting', 'error-analysis'],
            difficulty: 'intermediate',
            purpose: 'Scientific method debugging',
            filePath: 'BRAIN/',
            version: '2.3.5',
            prerequisites: [],
            worksWellWith: [],
            platformTags: [],
            stackSpecific: {},
            hasFrontmatter: false
          },
          content: 'Debug Protocol content with error handling',
          tokens: ['debug', 'protocol', 'error', 'handling']
        }],
        ['test_automation_protocol', {
          metadata: {
            id: 'test_automation_protocol',
            fileName: 'test_automation_protocol.md',
            name: 'test_automation_protocol',
            title: 'Test Automation Protocol',
            triggers: ['FULLSPEC'],
            category: 'Testing',
            tags: ['testing', 'coverage'],
            difficulty: 'intermediate',
            purpose: 'Test automation for mission-critical code',
            filePath: 'BRAIN/',
            version: '2.3.5',
            prerequisites: [],
            worksWellWith: [],
            platformTags: [],
            stackSpecific: {},
            hasFrontmatter: false
          },
          content: 'Test Automation Protocol content',
          tokens: ['test', 'automation', 'protocol']
        }]
      ]),
      triggerMap: new Map([
        ['DEEPDIVE', ['debug_protocol']],
        ['FULLSPEC', ['test_automation_protocol']]
      ]),
      categoryMap: new Map([
        ['Debugging', ['debug_protocol']],
        ['Testing', ['test_automation_protocol']]
      ])
    };
  });

  describe('search', () => {
    it('should find protocols by keyword', () => {
      const results = matcher.search(mockIndex, 'debug');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].protocol).toBe('debug_protocol');
    });

    it('should score results by relevance', () => {
      const results = matcher.search(mockIndex, 'debug protocol');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThan(0);
    });

    it('should filter by category when provided', () => {
      const results = matcher.search(mockIndex, 'protocol', { category: 'Testing' });

      expect(results.every(r => r.protocol === 'test_automation_protocol' || r.protocol.includes('test'))).toBe(true);
    });

    it('should return empty array for non-matching query', () => {
      const results = matcher.search(mockIndex, 'xyz123nonexistent');

      expect(results).toEqual([]);
    });

    it('should include matches information', () => {
      const results = matcher.search(mockIndex, 'debug');

      if (results.length > 0) {
        expect(results[0].matches).toBeDefined();
        expect(Array.isArray(results[0].matches)).toBe(true);
      }
    });

    it('should include excerpt in results', () => {
      const results = matcher.search(mockIndex, 'debug');

      if (results.length > 0) {
        expect(results[0].excerpt).toBeDefined();
        expect(typeof results[0].excerpt).toBe('string');
      }
    });
  });

  describe('fuzzyMatch', () => {
    it('should find similar protocol names with typos', () => {
      const results = matcher.fuzzyMatch(mockIndex, 'debug_protcol');

      expect(results.length).toBeGreaterThan(0);
      if (results.length > 0) {
        expect(results[0].protocol).toBe('debug_protocol');
      }
    });

    it('should return top matches sorted by similarity', () => {
      const results = matcher.fuzzyMatch(mockIndex, 'test_automation');

      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        expect(results[0].similarity).toBeGreaterThan(0.3);
      }
    });

    it('should have similarity scores between 0 and 1', () => {
      const results = matcher.fuzzyMatch(mockIndex, 'debug');

      results.forEach(result => {
        expect(result.similarity).toBeGreaterThanOrEqual(0);
        expect(result.similarity).toBeLessThanOrEqual(1);
      });
    });

    it('should return maximum 5 results', () => {
      const results = matcher.fuzzyMatch(mockIndex, 'protocol');

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should handle exact matches with high similarity', () => {
      const results = matcher.fuzzyMatch(mockIndex, 'debug_protocol');

      if (results.length > 0) {
        expect(results[0].similarity).toBe(1);
      }
    });
  });

  describe('Levenshtein distance', () => {
    it('should calculate edit distance correctly', () => {
      const distance1 = matcher['levenshteinDistance']('cat', 'cat');
      expect(distance1).toBe(0);

      const distance2 = matcher['levenshteinDistance']('cat', 'cut');
      expect(distance2).toBe(1);

      const distance3 = matcher['levenshteinDistance']('cat', 'dog');
      expect(distance3).toBe(3);
    });

    it('should calculate similarity score', () => {
      const similarity = matcher['levenshteinSimilarity']('debug', 'debbug');

      expect(similarity).toBeGreaterThan(0.5);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('contextualizeResults', () => {
    it('should apply context bonuses to results', () => {
      const results = matcher.search(mockIndex, 'debug');

      const context = {
        language: 'typescript' as const,
        framework: 'react' as const,
        projectType: 'frontend' as const,
        testFramework: 'jest' as const,
        packageManager: 'npm' as const,
        hasDocker: false,
        hasCI: false,
        hasGit: false,
        dependencies: [],
        devDependencies: [],
        detected: true
      };

      const contextualized = matcher['contextualizeResults'](results, context);

      expect(contextualized.length).toBeGreaterThan(0);
    });

    it('should mark context relevance', () => {
      const results = matcher.search(mockIndex, 'debug');

      if (results.length > 0) {
        expect(['high', 'medium', 'low', undefined]).toContain(results[0].contextRelevance);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty search query', () => {
      const results = matcher.search(mockIndex, '');

      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle whitespace-only query', () => {
      const results = matcher.search(mockIndex, '   ');

      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle special characters in query', () => {
      const results = matcher.search(mockIndex, '@#$%^&*');

      expect(Array.isArray(results)).toBe(true);
    });

    it('should be case-insensitive', () => {
      const resultsLower = matcher.search(mockIndex, 'debug');
      const resultsUpper = matcher.search(mockIndex, 'DEBUG');

      expect(resultsLower.length).toBe(resultsUpper.length);
    });
  });
});
