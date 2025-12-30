/**
 * Task Intent Analysis
 * Analyzes user task descriptions and infers intent type
 */

export type TaskType = 
  | 'debug'
  | 'build'
  | 'refactor'
  | 'audit'
  | 'optimize'
  | 'test'
  | 'setup'
  | 'document'
  | 'unknown';

/**
 * Keywords for each task type
 */
const TASK_KEYWORDS: Record<TaskType, string[]> = {
  debug: ['bug', 'fix', 'error', 'broken', 'crash', 'fail', 'issue', 'problem', 'debug', 'deepdive', 'trace', 'investigate'],
  build: ['build', 'create', 'new', 'feature', 'implement', 'develop', 'add', 'make', 'write component', 'design', 'architecture'],
  refactor: ['refactor', 'restructure', 'reorganize', 'rewrite', 'clean', 'cleanup', 'improve', 'modernize', 'upgrade', 'deprecate'],
  audit: ['audit', 'review', 'check', 'inspect', 'analyze', 'examine', 'assess', 'evaluate', 'scan', 'verify'],
  optimize: ['optimize', 'performance', 'slow', 'fast', 'speed', 'efficient', 'bottleneck', 'profile', 'bench', 'scale'],
  test: ['test', 'coverage', 'suite', 'spec', 'unit test', 'integration test', 'e2e', 'mock', 'stub'],
  setup: ['setup', 'configure', 'init', 'initialize', 'install', 'provision', 'scaffold', 'template'],
  document: ['document', 'doc', 'readme', 'comment', 'example', 'guide', 'tutorial', 'jsdoc'],
  unknown: []
};
/**
 * Analyze user task description and infer task type
 */
export function analyzeTaskIntent(description: string): TaskType {
  const lower = description.toLowerCase();
  
  // Score each task type
  const scores: Record<TaskType, number> = {
    debug: 0,
    build: 0,
    refactor: 0,
    audit: 0,
    optimize: 0,
    test: 0,
    setup: 0,
    document: 0,
    unknown: 0
  };

  for (const [taskType, keywords] of Object.entries(TASK_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        scores[taskType as TaskType]++;
      }
    }
  }

  // Find highest scored type
  let bestType: TaskType = 'unknown';
  let bestScore = 0;

  for (const [taskType, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = taskType as TaskType;
    }
  }

  return bestType;
}

/**
 * Get difficulty level for a task type
 */
export function getTaskDifficulty(taskType: TaskType): 'beginner' | 'intermediate' | 'advanced' {
  const difficultyMap: Record<TaskType, 'beginner' | 'intermediate' | 'advanced'> = {
    debug: 'intermediate',
    build: 'intermediate',
    refactor: 'advanced',
    audit: 'advanced',
    optimize: 'advanced',
    test: 'intermediate',
    setup: 'beginner',
    document: 'beginner',
    unknown: 'intermediate'
  };

  return difficultyMap[taskType];
}

/**
 * Get estimated time for a task type
 */
export function getTaskTimeEstimate(taskType: TaskType): string {
  const timeMap: Record<TaskType, string> = {
    debug: '30-60m',
    build: '2-4 hours',
    refactor: '1-3 hours',
    audit: '2-4 hours',
    optimize: '2-4 hours',
    test: '1-2 hours',
    setup: '30-45m',
    document: '1-2 hours',
    unknown: '1-2 hours'
  };

  return timeMap[taskType];
}

/**
 * Get related tags for a task type
 */
export function getTaskTags(taskType: TaskType): string[] {
  const tagsMap: Record<TaskType, string[]> = {
    debug: ['troubleshooting', 'error-analysis', 'root-cause', 'reproduction'],
    build: ['feature-development', 'architecture', 'design', 'implementation'],
    refactor: ['code-quality', 'technical-debt', 'modernization', 'safety'],
    audit: ['code-review', 'quality-assurance', 'compliance', 'assessment'],
    optimize: ['performance', 'efficiency', 'scalability', 'bottleneck-analysis'],
    test: ['coverage', 'automation', 'validation', 'verification'],
    setup: ['configuration', 'initialization', 'installation', 'provisioning'],
    document: ['documentation', 'clarity', 'examples', 'guides'],
    unknown: ['general', 'miscellaneous']
  };

  return tagsMap[taskType];
}
