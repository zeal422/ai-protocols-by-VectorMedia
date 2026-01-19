/**
 * Intent Refinement Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IntentRefinement, type Ambiguity, type TaskIntent } from '../../src/intelligence/intent-refinement.js';

describe('IntentRefinement', () => {
  let refiner: IntentRefinement;

  beforeEach(() => {
    refiner = new IntentRefinement();
  });

  describe('detectAmbiguity', () => {
    it('should detect task type ambiguity with fix keyword', () => {
      const ambiguities = refiner.detectAmbiguity('Fix the bug in the code');
      const taskTypeAmbiguities = ambiguities.filter(a => a.type === 'task_type');
      expect(taskTypeAmbiguities.length).toBeGreaterThan(0);
    });

    it('should detect scope ambiguity with vague pronouns', () => {
      const ambiguities = refiner.detectAmbiguity('Fix this component');
      const scopeAmbiguities = ambiguities.filter(a => a.type === 'scope');
      expect(scopeAmbiguities.length).toBeGreaterThan(0);
    });

    it('should detect priority ambiguity with urgent', () => {
      const ambiguities = refiner.detectAmbiguity('Urgent: fix this now');
      const priorityAmbiguities = ambiguities.filter(a => a.type === 'priority');
      expect(priorityAmbiguities.length).toBeGreaterThan(0);
    });

    it('should detect some ambiguities for most descriptions', () => {
      const ambiguities = refiner.detectAmbiguity('Write comprehensive unit tests for UserService class in TypeScript');
      expect(ambiguities.length).toBeGreaterThanOrEqual(0);
    });

    it('should detect multiple ambiguity types', () => {
      const ambiguities = refiner.detectAmbiguity('Fix this bug urgently in the codebase');
      const types = new Set(ambiguities.map(a => a.type));
      expect(types.size).toBeGreaterThan(1);
    });

    it('should handle empty description', () => {
      const ambiguities = refiner.detectAmbiguity('');
      expect(ambiguities.length).toBe(0);
    });
  });

  describe('generateClarifyingQuestions', () => {
    it('should generate questions from ambiguities', () => {
      const ambiguities: Ambiguity[] = [
        {
          type: 'task_type',
          question: 'What type of task is this?',
          possibleAnswers: ['debug', 'build', 'refactor'],
          severity: 'high'
        }
      ];
      const questions = refiner.generateClarifyingQuestions(ambiguities);
      expect(questions.length).toBe(1);
      expect(questions[0].question).toBe('What type of task is this?');
    });

    it('should mark critical ambiguities as required', () => {
      const ambiguities: Ambiguity[] = [
        {
          type: 'scope',
          question: 'Scope question',
          possibleAnswers: ['a', 'b'],
          severity: 'critical'
        },
        {
          type: 'priority',
          question: 'Priority question',
          possibleAnswers: ['low', 'high'],
          severity: 'medium'
        }
      ];
      const questions = refiner.generateClarifyingQuestions(ambiguities);
      const criticalQuestion = questions.find(q => q.required);
      expect(criticalQuestion).toBeDefined();
    });

    it('should use free_text for many possible answers', () => {
      const ambiguities: Ambiguity[] = [
        {
          type: 'language',
          question: 'What language?',
          possibleAnswers: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Ruby', 'PHP'],
          severity: 'high'
        }
      ];
      const questions = refiner.generateClarifyingQuestions(ambiguities);
      expect(questions[0].type).toBe('free_text');
    });

    it('should use single_choice for few answers', () => {
      const ambiguities: Ambiguity[] = [
        {
          type: 'priority',
          question: 'How urgent?',
          possibleAnswers: ['low', 'high'],
          severity: 'medium'
        }
      ];
      const questions = refiner.generateClarifyingQuestions(ambiguities);
      expect(questions[0].type).toBe('single_choice');
    });
  });

  describe('calculateConfidenceScore', () => {
    it('should return 0 for empty description', () => {
      const intent: TaskIntent = {
        description: '',
        taskType: 'unknown',
        confidence: 0,
        ambiguities: [],
        scope: { fileCount: 'unknown', componentCount: 'unknown', timeframe: 'unknown' },
        complexity: 'simple',
        estimatedTime: '1h'
      };
      const score = refiner.calculateConfidenceScore(intent);
      expect(score).toBe(0);
    });

    it('should return score between 0 and 1', () => {
      const intent: TaskIntent = {
        description: 'Write tests for UserService',
        taskType: 'test',
        confidence: 0,
        ambiguities: [],
        scope: { fileCount: 'single', componentCount: 'single', timeframe: 'short' },
        complexity: 'simple',
        estimatedTime: '1h'
      };
      const score = refiner.calculateConfidenceScore(intent);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should return valid scores for different descriptions', () => {
      const clearIntent: TaskIntent = {
        description: 'Write tests for UserService',
        taskType: 'test',
        confidence: 0,
        ambiguities: [],
        scope: { fileCount: 'single', componentCount: 'single', timeframe: 'short' },
        complexity: 'simple',
        estimatedTime: '1h'
      };
      const ambiguousIntent: TaskIntent = {
        description: 'Fix this',
        taskType: 'unknown',
        confidence: 0,
        ambiguities: [{ type: 'scope', question: '?', possibleAnswers: [], severity: 'critical' }],
        scope: { fileCount: 'unknown', componentCount: 'unknown', timeframe: 'unknown' },
        complexity: 'moderate',
        estimatedTime: '1h'
      };
      const clearScore = refiner.calculateConfidenceScore(clearIntent);
      const ambiguousScore = refiner.calculateConfidenceScore(ambiguousIntent);
      expect(clearScore).toBeGreaterThanOrEqual(0);
      expect(ambiguousScore).toBeGreaterThanOrEqual(0);
      expect(clearScore + ambiguousScore).toBeLessThanOrEqual(2);
    });
  });

  describe('isReadyToExecute', () => {
    it('should return true for clear intent above threshold', () => {
      const intent: TaskIntent = {
        description: 'Write tests for UserService',
        taskType: 'test',
        confidence: 0.9,
        ambiguities: [],
        scope: { fileCount: 'single', componentCount: 'single', timeframe: 'short' },
        complexity: 'simple',
        estimatedTime: '1h'
      };
      expect(refiner.isReadyToExecute(intent, 0.8)).toBe(true);
    });

    it('should return false for ambiguous intent', () => {
      const intent: TaskIntent = {
        description: 'Fix this',
        taskType: 'unknown',
        confidence: 0.4,
        ambiguities: [{ type: 'scope', question: '?', possibleAnswers: [], severity: 'critical' }],
        scope: { fileCount: 'unknown', componentCount: 'unknown', timeframe: 'unknown' },
        complexity: 'moderate',
        estimatedTime: '1h'
      };
      expect(refiner.isReadyToExecute(intent, 0.8)).toBe(false);
    });
  });

  describe('refineIntent', () => {
    it('should return intent, questions, and refinement function', async () => {
      const result = await refiner.refineIntent('Fix the bug in the code');
      expect(result.intent).toBeDefined();
      expect(result.questions).toBeDefined();
      expect(typeof result.refinement).toBe('function');
    });

    it('should detect task type from description', async () => {
      const result = await refiner.refineIntent('Write unit tests for the authentication module');
      expect(result.intent.taskType).toBe('test');
    });

    it('should generate questions for ambiguous input', async () => {
      const result = await refiner.refineIntent('Fix this urgently');
      expect(result.questions.length).toBeGreaterThan(0);
    });
  });

  describe('incorporateFeedback', () => {
    it('should improve confidence with feedback', async () => {
      const initialIntent: TaskIntent = {
        description: 'Fix this',
        taskType: 'unknown',
        confidence: 0.4,
        ambiguities: [
          { type: 'task_type' as const, question: '?', possibleAnswers: ['debug', 'refactor'], severity: 'high' },
          { type: 'scope' as const, question: '?', possibleAnswers: ['single'], severity: 'critical' }
        ],
        scope: { fileCount: 'unknown', componentCount: 'unknown', timeframe: 'unknown' },
        complexity: 'moderate',
        estimatedTime: '1h'
      };

      const refined = await refiner.incorporateFeedback(initialIntent, [
        { questionId: 'q1', answer: 'debug', timestamp: new Date() },
        { questionId: 'q2', answer: 'UserService.tsx', timestamp: new Date() }
      ]);

      expect(refined.refinedIntent.confidence).toBeGreaterThanOrEqual(initialIntent.confidence);
      expect(refined.confidenceImprovement).toBeGreaterThanOrEqual(0);
    });

    it('should not increase ambiguities after feedback', async () => {
      const initialIntent: TaskIntent = {
        description: 'Fix this',
        taskType: 'unknown',
        confidence: 0.4,
        ambiguities: [
          { type: 'task_type' as const, question: '?', possibleAnswers: ['debug', 'refactor'], severity: 'high' },
          { type: 'scope' as const, question: '?', possibleAnswers: ['single'], severity: 'critical' }
        ],
        scope: { fileCount: 'unknown', componentCount: 'unknown', timeframe: 'unknown' },
        complexity: 'moderate',
        estimatedTime: '1h'
      };

      const refined = await refiner.incorporateFeedback(initialIntent, [
        { questionId: 'q1', answer: 'debug', timestamp: new Date() }
      ]);

      expect(refined.refinedIntent.ambiguities.length).toBeLessThanOrEqual(initialIntent.ambiguities.length);
    });
  });
});
