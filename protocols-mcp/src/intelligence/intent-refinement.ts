/**
 * User Intent Refinement Engine
 * Detects ambiguities in task descriptions and generates clarifying questions
 */

import { analyzeTaskIntent, getTaskTimeEstimate } from '../search/task-analyzer.js';
import type { TaskType } from '../search/task-analyzer.js';

export interface TaskScope {
  fileCount: 'single' | 'multiple' | 'codebase' | 'unknown';
  componentCount: 'single' | 'multiple' | 'system' | 'unknown';
  timeframe: 'immediate' | 'short' | 'medium' | 'long' | 'unknown';
}

export interface TaskIntent {
  description: string;
  taskType: TaskType;
  confidence: number;
  ambiguities: Ambiguity[];
  scope: TaskScope;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTime: string;
}

export type AmbiguityType = 'task_type' | 'scope' | 'priority' | 'language' | 'framework' | 'context';

export interface Ambiguity {
  type: AmbiguityType;
  question: string;
  possibleAnswers: string[];
  severity: 'critical' | 'high' | 'medium';
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'free_text';
  options?: string[];
  required: boolean;
  relatedTo: AmbiguityType[];
}

export interface UserFeedback {
  questionId: string;
  answer: string | string[];
  timestamp: Date;
}

export interface RefinedIntent {
  originalDescription: string;
  initialIntent: TaskIntent;
  clarifications: UserFeedback[];
  refinedIntent: TaskIntent;
  confidenceImprovement: number;
}

interface KeywordPattern {
  keywords: string[];
  answers: string[];
  type: AmbiguityType;
  severity: 'critical' | 'high' | 'medium';
}

const TASK_TYPE_AMBIGUITY_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['fix', 'bug', 'issue', 'problem', 'broken'],
    answers: ['debug', 'refactor', 'error_fix'],
    type: 'task_type',
    severity: 'high'
  },
  {
    keywords: ['improve', 'better', 'enhance'],
    answers: ['optimize', 'refactor', 'test'],
    type: 'task_type',
    severity: 'high'
  },
  {
    keywords: ['build', 'create', 'add', 'implement', 'develop'],
    answers: ['build'],
    type: 'task_type',
    severity: 'medium'
  },
  {
    keywords: ['check', 'review', 'verify'],
    answers: ['audit', 'debug'],
    type: 'task_type',
    severity: 'medium'
  }
];

const SCOPE_AMBIGUITY_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['this', 'it', 'the thing', 'that'],
    answers: ['single'],
    type: 'scope',
    severity: 'critical'
  },
  {
    keywords: ['entire', 'whole', 'all', 'codebase'],
    answers: ['codebase'],
    type: 'scope',
    severity: 'high'
  },
  {
    keywords: ['module', 'component', 'service'],
    answers: ['multiple'],
    type: 'scope',
    severity: 'medium'
  }
];

const PRIORITY_AMBIGUITY_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['urgent', 'asap', 'now', 'immediately', 'critical'],
    answers: ['high'],
    type: 'priority',
    severity: 'high'
  },
  {
    keywords: ['eventually', 'when possible', 'sometime'],
    answers: ['low'],
    type: 'priority',
    severity: 'low' as 'medium'
  },
  {
    keywords: ['important', 'soon'],
    answers: ['medium'],
    type: 'priority',
    severity: 'medium'
  }
];

function generateUniqueId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export class IntentRefinement {
  private ambiguityPatterns: KeywordPattern[];

  constructor() {
    this.ambiguityPatterns = [
      ...TASK_TYPE_AMBIGUITY_PATTERNS,
      ...SCOPE_AMBIGUITY_PATTERNS,
      ...PRIORITY_AMBIGUITY_PATTERNS
    ];
  }

  detectAmbiguity(description: string): Ambiguity[] {
    const lowerDescription = description.toLowerCase();
    const ambiguities: Ambiguity[] = [];

    for (const pattern of this.ambiguityPatterns) {
      const matchedKeywords = pattern.keywords.filter(kw => lowerDescription.includes(kw));
      if (matchedKeywords.length > 0) {
        ambiguities.push({
          type: pattern.type,
          question: this.generateQuestion(pattern, matchedKeywords),
          possibleAnswers: pattern.answers,
          severity: pattern.severity
        });
      }
    }

    const hasVaguePronouns = /\b(this|it|that|these|those)\b/i.test(description) &&
      !description.match(/\b(this|it|that|these|those)\s+(file|component|module|function|class|method)\b/i);

    if (hasVaguePronouns) {
      ambiguities.push({
        type: 'scope',
        question: 'What specific component, file, or area are you referring to?',
        possibleAnswers: ['specific file path', 'specific component name', 'general area'],
        severity: 'critical'
      });
    }

    if (!lowerDescription.match(/\.(js|ts|py|go|java|rs|cpp|c)$/i) &&
        (lowerDescription.includes('code') || lowerDescription.includes('function') || lowerDescription.includes('component'))) {
      ambiguities.push({
        type: 'language',
        question: 'What programming language is this code in?',
        possibleAnswers: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'Other'],
        severity: 'high'
      });
    }

    return ambiguities;
  }

  private generateQuestion(pattern: KeywordPattern, matchedKeywords: string[]): string {
    const keywordText = matchedKeywords.join(', ');

    switch (pattern.type) {
    case 'task_type':
      return `You mentioned "${keywordText}" - are you looking to debug/fix an issue, refactor existing code, or build something new?`;
    case 'scope':
      return `What is the scope of the "${keywordText}" reference? Is it a specific file, multiple components, or the entire codebase?`;
    case 'priority':
      return `How urgent is this "${keywordText}" request?`;
    case 'language':
      return 'What programming language are you working with?';
    case 'framework':
      return 'What framework or library are you using?';
    default:
      return `Could you clarify what you mean by "${keywordText}"?`;
    }
  }

  generateClarifyingQuestions(ambiguities: Ambiguity[]): ClarifyingQuestion[] {
    const questions: ClarifyingQuestion[] = [];
    const processedTypes = new Set<AmbiguityType>();

    for (const ambiguity of ambiguities) {
      if (processedTypes.has(ambiguity.type)) continue;
      processedTypes.add(ambiguity.type);

      const isFreeText = ambiguity.possibleAnswers.length > 4 ||
                        ambiguity.possibleAnswers.some(a => a.length > 30);

      questions.push({
        id: generateUniqueId(),
        question: ambiguity.question,
        type: isFreeText ? 'free_text' : 'single_choice',
        options: isFreeText ? undefined : ambiguity.possibleAnswers,
        required: ambiguity.severity === 'critical',
        relatedTo: [ambiguity.type]
      });
    }

    return questions.sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0));
  }

  calculateConfidenceScore(intent: TaskIntent): number {
    if (!intent.description || intent.description.trim().length === 0) {
      return 0;
    }

    const baseConfidence = 0.4;
    const ambiguityPenalty = Math.min(intent.ambiguities.length * 0.1, 0.3);
    const clarityBonus = intent.description.length > 50 ? 0.1 : 0;
    const specificityBonus = intent.scope.fileCount !== 'unknown' ? 0.1 : 0;

    return Math.min(1, Math.max(0, baseConfidence + (1 - ambiguityPenalty) + clarityBonus + specificityBonus));
  }

  isReadyToExecute(intent: TaskIntent, threshold: number = 0.8): boolean {
    const confidence = this.calculateConfidenceScore(intent);
    const criticalAmbiguities = intent.ambiguities.filter(a => a.severity === 'critical');

    return confidence >= threshold && criticalAmbiguities.length === 0;
  }

  async refineIntent(
    description: string
  ): Promise<{
    intent: TaskIntent;
    questions: ClarifyingQuestion[];
    refinement: (feedback: UserFeedback[]) => Promise<RefinedIntent>;
  }> {
    const taskType = analyzeTaskIntent(description);
    const ambiguities = this.detectAmbiguity(description);

    const initialIntent: TaskIntent = {
      description,
      taskType,
      confidence: 0,
      ambiguities,
      scope: this.detectScope(description),
      complexity: this.detectComplexity(description, taskType),
      estimatedTime: getTaskTimeEstimate(taskType)
    };

    initialIntent.confidence = this.calculateConfidenceScore(initialIntent);

    const questions = this.generateClarifyingQuestions(ambiguities);

    const refinement = async (feedback: UserFeedback[]): Promise<RefinedIntent> => {
      return this.incorporateFeedback(initialIntent, feedback);
    };

    return { intent: initialIntent, questions, refinement };
  }

  async incorporateFeedback(
    initialIntent: TaskIntent,
    feedback: UserFeedback[]
  ): Promise<RefinedIntent> {
    const resolvedTypes = new Set<AmbiguityType>();

    for (const fb of feedback) {
      const answerStr = Array.isArray(fb.answer) ? fb.answer[0] : fb.answer;
      const relatedAmbiguity = initialIntent.ambiguities.find(
        a => a.question.includes(answerStr.substring(0, 10))
      );
      if (relatedAmbiguity) {
        resolvedTypes.add(relatedAmbiguity.type);
      }
    }

    const unresolvedAmbiguities = initialIntent.ambiguities.filter(
      a => !resolvedTypes.has(a.type)
    );

    let refinedConfidence = this.calculateConfidenceScore(initialIntent);

    const feedbackResolution = feedback.length / (feedback.length + unresolvedAmbiguities.length + 1);
    refinedConfidence = Math.min(1, refinedConfidence + feedbackResolution * 0.3);

    const refinedIntent: TaskIntent = {
      ...initialIntent,
      ambiguities: unresolvedAmbiguities,
      confidence: refinedConfidence
    };

    const confidenceImprovement = refinedIntent.confidence - initialIntent.confidence;

    return {
      originalDescription: initialIntent.description,
      initialIntent,
      clarifications: feedback,
      refinedIntent,
      confidenceImprovement
    };
  }

  private detectScope(description: string): TaskScope {
    const lowerDescription = description.toLowerCase();

    let fileCount: TaskScope['fileCount'] = 'unknown';
    if (lowerDescription.match(/\b(file|path|component|module)\s+["']?[\w/.-]+["']?/i) ||
        lowerDescription.match(/\.tsx?\.|\.py$|\.go$|\.java$/i)) {
      fileCount = 'single';
    }
    if (lowerDescription.includes('entire') || lowerDescription.includes('whole') ||
        lowerDescription.includes('codebase') || lowerDescription.includes('all files')) {
      fileCount = 'codebase';
    }
    if (lowerDescription.includes('multiple') || lowerDescription.includes('several')) {
      fileCount = 'multiple';
    }

    let componentCount: TaskScope['componentCount'] = 'unknown';
    if (lowerDescription.includes('function') || lowerDescription.includes('method') ||
        lowerDescription.includes('class')) {
      componentCount = 'single';
    }
    if (lowerDescription.includes('system') || lowerDescription.includes('architecture')) {
      componentCount = 'system';
    }

    let timeframe: TaskScope['timeframe'] = 'unknown';
    if (lowerDescription.includes('asap') || lowerDescription.includes('urgent')) {
      timeframe = 'immediate';
    } else if (lowerDescription.includes('quick') || lowerDescription.includes('simple')) {
      timeframe = 'short';
    } else if (lowerDescription.includes('major') || lowerDescription.includes('refactor')) {
      timeframe = 'long';
    }

    return { fileCount, componentCount, timeframe };
  }

  private detectComplexity(description: string, taskType: TaskType): TaskIntent['complexity'] {
    const complexityIndicators = {
      simple: ['simple', 'quick', 'basic', 'easy', 'small'],
      moderate: ['moderate', 'standard', 'normal'],
      complex: ['complex', 'major', 'extensive', 'thorough', 'comprehensive', 'entire', 'whole']
    };

    const lowerDescription = description.toLowerCase();

    for (const indicator of complexityIndicators.complex) {
      if (lowerDescription.includes(indicator)) return 'complex';
    }

    for (const indicator of complexityIndicators.simple) {
      if (lowerDescription.includes(indicator)) return 'simple';
    }

    if (taskType === 'refactor' || taskType === 'audit' || taskType === 'optimize') {
      return 'complex';
    }

    if (taskType === 'setup' || taskType === 'document') {
      return 'simple';
    }

    return 'moderate';
  }
}
