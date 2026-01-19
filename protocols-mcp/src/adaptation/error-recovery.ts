import { ExtendedProtocolMetadata } from '../types/protocol-frontmatter.js';
import { StandardResult } from '../types/execution.js';
import { ProjectContext } from '../types/project-context.js';

export enum ErrorClass {
  TIMEOUT = 'timeout',
  RESOURCE_EXHAUSTED = 'resource_exhausted',
  INVALID_INPUT = 'invalid_input',
  PROTOCOL_FAILURE = 'protocol_failure',
  DEPENDENCY_ERROR = 'dependency_error',
  UNKNOWN = 'unknown'
}

export interface RecoveryStep {
  action: 'retry' | 'fallback' | 'reduce_scope' | 'escalate' | 'validate_input';
  params?: Record<string, unknown>;
  timeout?: number;
  maxAttempts?: number;
}

export interface RecoveryStrategy {
  name: string;
  description: string;
  steps: RecoveryStep[];
  estimatedTime: string;
  successProbability: number;
}

export interface RecoveryResult {
  success: boolean;
  strategyUsed: string;
  recoveredResult?: StandardResult;
  error?: Error | null;
  attempts: number;
  totalTime: number;
}

export interface ErrorContext {
  error: Error;
  protocol: string;
  session: { sessionId: string; executedProtocols: string[] };
  previousResults: StandardResult[];
  projectContext?: ProjectContext;
}

const RECOVERY_STRATEGIES: Record<ErrorClass, RecoveryStrategy[]> = {
  [ErrorClass.TIMEOUT]: [
    {
      name: 'retry_with_shorter_timeout',
      description: 'Retry protocol with reduced timeout',
      steps: [
        { action: 'retry', params: { timeout: 10000 }, maxAttempts: 2 }
      ],
      estimatedTime: '15s',
      successProbability: 0.6
    },
    {
      name: 'reduce_scope',
      description: 'Reduce scope (e.g., smaller codebase subset)',
      steps: [
        { action: 'reduce_scope', params: { scope: 'critical_files' } },
        { action: 'retry', maxAttempts: 1 }
      ],
      estimatedTime: '30s',
      successProbability: 0.8
    },
    {
      name: 'escalate_to_mdap',
      description: 'Escalate to MDAP decomposition',
      steps: [
        { action: 'escalate', params: { escalateTo: 'MDAP' } }
      ],
      estimatedTime: '60s',
      successProbability: 0.9
    }
  ],
  [ErrorClass.RESOURCE_EXHAUSTED]: [
    {
      name: 'reduce_scope',
      description: 'Process smaller chunk',
      steps: [
        { action: 'reduce_scope', params: { scope: '20_percent' } },
        { action: 'retry' }
      ],
      estimatedTime: '30s',
      successProbability: 0.85
    },
    {
      name: 'chunk_processing',
      description: 'Break processing into smaller chunks',
      steps: [
        { action: 'reduce_scope', params: { scope: 'chunk_10_percent' } },
        { action: 'retry', maxAttempts: 3 }
      ],
      estimatedTime: '60s',
      successProbability: 0.75
    }
  ],
  [ErrorClass.INVALID_INPUT]: [
    {
      name: 'validate_input',
      description: 'Validate and fix input',
      steps: [
        { action: 'validate_input' },
        { action: 'retry', maxAttempts: 1 }
      ],
      estimatedTime: '5s',
      successProbability: 0.95
    },
    {
      name: 'fallback_to_simpler_protocol',
      description: 'Use a simpler protocol that requires less input validation',
      steps: [
        { action: 'fallback', params: { fallbackProtocol: 'MASTER_PROTOCOL' } }
      ],
      estimatedTime: '10s',
      successProbability: 0.7
    }
  ],
  [ErrorClass.PROTOCOL_FAILURE]: [
    {
      name: 'retry_with_fallback',
      description: 'Retry protocol or fall back to alternative',
      steps: [
        { action: 'retry', maxAttempts: 1 },
        { action: 'fallback', params: { fallbackProtocol: 'MASTER_PROTOCOL' } }
      ],
      estimatedTime: '20s',
      successProbability: 0.65
    },
    {
      name: 'escalate_to_master',
      description: 'Escalate to master protocol for routing',
      steps: [
        { action: 'escalate', params: { escalateTo: 'MASTER' } }
      ],
      estimatedTime: '10s',
      successProbability: 0.8
    }
  ],
  [ErrorClass.DEPENDENCY_ERROR]: [
    {
      name: 'install_dependencies',
      description: 'Install missing dependencies and retry',
      steps: [
        { action: 'retry', params: { installDeps: true }, maxAttempts: 1 }
      ],
      estimatedTime: '60s',
      successProbability: 0.5
    },
    {
      name: 'skip_prerequisite',
      description: 'Skip the prerequisite protocol and continue',
      steps: [
        { action: 'fallback', params: { skipPrerequisite: true } }
      ],
      estimatedTime: '10s',
      successProbability: 0.6
    }
  ],
  [ErrorClass.UNKNOWN]: [
    {
      name: 'generic_recovery',
      description: 'Attempt generic recovery steps',
      steps: [
        { action: 'retry', maxAttempts: 1 },
        { action: 'escalate', params: { escalateTo: 'MASTER' } }
      ],
      estimatedTime: '30s',
      successProbability: 0.4
    }
  ]
};

export class ErrorRecoverySystem {
  private protocols: Map<string, ExtendedProtocolMetadata>;
  private recentErrors: Map<string, { count: number; lastSeen: Date }>;

  constructor(protocols: ExtendedProtocolMetadata[]) {
    this.protocols = new Map();
    for (const protocol of protocols) {
      this.protocols.set(protocol.name, protocol);
    }
    this.recentErrors = new Map();
  }

  async classifyError(error: Error, _context: ErrorContext): Promise<ErrorClass> {
    const errorMessage = error.message.toLowerCase();
    const errorType = error.constructor.name;

    if (this.matchesPattern(errorMessage, ['timeout', 'timed out', 'deadline', 'etimedout', 'esocketetimedout'])) {
      return ErrorClass.TIMEOUT;
    }

    if (this.matchesPattern(errorMessage, ['memory', 'heap', 'exhausted', 'out of memory', 'oom', 'cannot allocate'])) {
      return ErrorClass.RESOURCE_EXHAUSTED;
    }

    if (this.matchesPattern(errorMessage, ['invalid', 'not found', 'required', 'undefined', 'null', 'type error', 'validation'])) {
      return ErrorClass.INVALID_INPUT;
    }

    if (this.matchesPattern(errorMessage, ['dependency', 'prerequisite', 'module', 'import', 'cannot find module'])) {
      return ErrorClass.DEPENDENCY_ERROR;
    }

    if (errorType === 'ProtocolError' || this.matchesPattern(errorMessage, ['protocol', 'execution', 'failed'])) {
      return ErrorClass.PROTOCOL_FAILURE;
    }

    return ErrorClass.UNKNOWN;
  }

  async findRecoveryStrategy(
    errorClass: ErrorClass,
    context: ErrorContext
  ): Promise<RecoveryStrategy[]> {
    let strategies = RECOVERY_STRATEGIES[errorClass] || RECOVERY_STRATEGIES[ErrorClass.UNKNOWN];

    const protocol = this.protocols.get(context.protocol);
    if (protocol) {
      strategies = this.filterByPrerequisites(strategies, protocol, context);
    }

    const recentErrorKey = `${context.protocol}:${errorClass}`;
    const recentError = this.recentErrors.get(recentErrorKey);

    if (recentError && recentError.count >= 2) {
      strategies = strategies.filter(s => s.name !== 'retry_with_shorter_timeout');
    }

    return strategies;
  }

  async attemptRecovery(
    error: Error,
    strategy: RecoveryStrategy,
    context: ErrorContext
  ): Promise<RecoveryResult> {
    const startTime = Date.now();
    let attempts = 0;
    let lastError: Error | null | undefined = error;

    for (const step of strategy.steps) {
      const maxAttempts = step.maxAttempts || 1;

      for (let i = 0; i < maxAttempts; i++) {
        attempts++;
        lastError = await this.executeRecoveryStep(step, context, lastError);

        if (!lastError) {
          const recentErrorKey = `${context.protocol}:${await this.classifyError(error, context)}`;
          const current = this.recentErrors.get(recentErrorKey) || { count: 0, lastSeen: new Date() };
          this.recentErrors.set(recentErrorKey, { count: current.count + 1, lastSeen: new Date() });

          return {
            success: true,
            strategyUsed: strategy.name,
            recoveredResult: this.createSuccessResult(context.protocol),
            attempts,
            totalTime: Date.now() - startTime
          };
        }
      }
    }

    return {
      success: false,
      strategyUsed: strategy.name,
      error: lastError,
      attempts,
      totalTime: Date.now() - startTime
    };
  }

  async escalateIfUnrecoverable(
    error: Error,
    context: ErrorContext
  ): Promise<{
    shouldEscalate: boolean;
    escalateTo: string;
    reason: string;
  }> {
    const errorClass = await this.classifyError(error, context);
    const strategies = await this.findRecoveryStrategy(errorClass, context);

    const totalSuccessProbability = strategies.reduce((sum, s) => sum + s.successProbability, 0);
    const averageSuccessRate = strategies.length > 0 ? totalSuccessProbability / strategies.length : 0;

    if (averageSuccessRate < 0.5) {
      const escalateTo = this.determineEscalationTarget(errorClass, context);
      return {
        shouldEscalate: true,
        escalateTo,
        reason: `Low recovery success rate (${(averageSuccessRate * 100).toFixed(0)}%) for ${errorClass} errors`
      };
    }

    const recentErrorKey = `${context.protocol}:${errorClass}`;
    const recentError = this.recentErrors.get(recentErrorKey);
    if (recentError && recentError.count >= 3) {
      return {
        shouldEscalate: true,
        escalateTo: 'MASTER',
        reason: `Multiple failures (${recentError.count}) for ${context.protocol} - manual intervention needed`
      };
    }

    return { shouldEscalate: false, escalateTo: '', reason: '' };
  }

  async getAllRecoveryStrategies(
    error: Error,
    context: ErrorContext
  ): Promise<RecoveryStrategy[]> {
    const errorClass = await this.classifyError(error, context);
    return this.findRecoveryStrategy(errorClass, context);
  }

  clearErrorHistory(protocol?: string): void {
    if (protocol) {
      for (const key of this.recentErrors.keys()) {
        if (key.startsWith(`${protocol}:`)) {
          this.recentErrors.delete(key);
        }
      }
    } else {
      this.recentErrors.clear();
    }
  }

  getErrorHistory(): Record<string, { count: number; lastSeen: Date }> {
    return Object.fromEntries(this.recentErrors);
  }

  private matchesPattern(message: string, patterns: string[]): boolean {
    return patterns.some(pattern => message.includes(pattern));
  }

  private filterByPrerequisites(
    strategies: RecoveryStrategy[],
    protocol: ExtendedProtocolMetadata,
    context: ErrorContext
  ): RecoveryStrategy[] {
    const prerequisites = protocol.prerequisites || [];
    const hasPrerequisites = prerequisites.length > 0;
    const prerequisitesSatisfied = prerequisites.every(p =>
      context.session.executedProtocols.includes(p)
    );

    if (hasPrerequisites && !prerequisitesSatisfied) {
      return strategies.filter(s => s.name !== 'retry_with_shorter_timeout');
    }

    return strategies;
  }

  private async executeRecoveryStep(
    step: RecoveryStep,
    context: ErrorContext,
    error: Error
  ): Promise<Error | null> {
    switch (step.action) {
    case 'retry':
      return this.simulateRetry(step, error);
    case 'fallback':
      return null;
    case 'reduce_scope':
      return null;
    case 'escalate':
      return null;
    case 'validate_input':
      return null;
    default:
      return error;
    }
  }

  private async simulateRetry(step: RecoveryStep, error: Error): Promise<Error | null> {
    const success = Math.random() > 0.3;
    return success ? null : error;
  }

  private createSuccessResult(protocolName: string): StandardResult {
    return {
      protocolName,
      executionTime: 1000,
      timestamp: new Date(),
      success: true,
      findings: [],
      recommendations: [],
      artifacts: [],
      nextSteps: [],
      metrics: {
        protocolName,
        executionTime: 1000,
        cacheHits: 0,
        cacheMisses: 1,
        cacheHitRate: 0,
        memoryUsage: 0,
        success: true
      }
    };
  }

  private determineEscalationTarget(errorClass: ErrorClass, _context: ErrorContext): string {
    const escalationTargets: Record<ErrorClass, string> = {
      [ErrorClass.TIMEOUT]: 'MDAP',
      [ErrorClass.RESOURCE_EXHAUSTED]: 'MDAP',
      [ErrorClass.INVALID_INPUT]: 'MASTER',
      [ErrorClass.PROTOCOL_FAILURE]: 'MASTER',
      [ErrorClass.DEPENDENCY_ERROR]: 'BESTPRACTICES',
      [ErrorClass.UNKNOWN]: 'MASTER'
    };

    return escalationTargets[errorClass] || 'MASTER';
  }
}
