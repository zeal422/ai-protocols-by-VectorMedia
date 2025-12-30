import { TaskType } from './task-analyzer.js';

// Re-export TaskType for convenience
export type { TaskType };
import { ProjectContext } from '../utils/project-context-detector.js';

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  order: number;
  protocolName: string;
  trigger: string;
  reason: string;
  optional: boolean;
  prerequisite?: string;
}

/**
 * Complete workflow definition
 */
export interface Workflow {
  name: string;
  taskType: TaskType;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: WorkflowStep[];
  shortcuts?: Record<string, string[]>;
}

/**
 * Task type to protocol workflow mapping
 */
const TASK_WORKFLOWS: Record<TaskType, string[]> = {
  debug: [
    'debug_protocol',
    'error_fix_protocol',
    'test_automation_protocol',
    'code_review_protocol'
  ],
  build: [
    'codebase_indexing_protocol',
    'best_practices_protocol',
    'test_automation_protocol',
    'code_review_protocol'
  ],
  refactor: [
    'codebase_indexing_protocol',
    'mdap_protocol',
    'refactor_protocol',
    'test_automation_protocol',
    'code_review_protocol'
  ],
  audit: [
    'bigpappa_protocol_reviewANDfixes',
    'security_audit_protocol',
    'code_review_protocol',
    'performance_protocol'
  ],
  optimize: [
    'codebase_indexing_protocol',
    'performance_protocol',
    'test_automation_protocol',
    'code_review_protocol'
  ],
  test: [
    'test_automation_protocol',
    'code_review_protocol'
  ],
  setup: [
    'best_practices_protocol',
    'git_workflow_protocol'
  ],
  document: [
    'best_practices_protocol',
    'code_review_protocol'
  ],
  unknown: [
    'MASTER_PROTOCOL'
  ]
};

/**
 * Protocol trigger mapping
 */
const PROTOCOL_TRIGGERS: Record<string, string> = {
  'debug_protocol': 'DEEPDIVE',
  'error_fix_protocol': 'AUTODEBUG',
  'test_automation_protocol': 'FULLSPEC',
  'codebase_indexing_protocol': 'FULLINDEX',
  'mdap_protocol': 'MDAP',
  'refactor_protocol': 'REFACTOR',
  'code_review_protocol': 'COMPREHENSIVE',
  'security_audit_protocol': 'SECAUDIT',
  'performance_protocol': 'PERFAUDIT',
  'best_practices_protocol': 'BESTPRACTICES',
  'bigpappa_protocol_reviewANDfixes': 'BIGPAPPA',
  'MASTER_PROTOCOL': 'MASTER',
  'git_workflow_protocol': 'GITFLOW',
  'api_design_protocol': 'APIDESIGN',
  'accessibility_protocol': 'A11YCHECK',
  'aria_accessibility_protocol': 'FULLARIA',
  'moreFRONTend-PROTOCOL': 'ULTRATHINK',
  'FRONTandBACKend-PROTOCOL': 'ANTI-GENERIC'
};

/**
 * Build workflow for a task type
 */
export function buildWorkflow(
  taskType: TaskType,
  context?: ProjectContext
): WorkflowStep[] {
  const protocolNames = TASK_WORKFLOWS[taskType] || TASK_WORKFLOWS['unknown'];
  
  const steps: WorkflowStep[] = protocolNames.map((name, index) => ({
    order: index + 1,
    protocolName: name,
    trigger: PROTOCOL_TRIGGERS[name] || name,
    reason: getReasonForStep(taskType, name, index),
    optional: index > 0, // Only first step is mandatory
    prerequisite: getPrerequisiteForStep(name)
  }));

  // Re-order based on context if available
  if (context) {
    return prioritizeByContext(steps, context);
  }

  return steps;
}

/**
 * Get reasoning text for a workflow step
 */
function getReasonForStep(taskType: TaskType, protocolName: string, index: number): string {
  const reasons: Record<TaskType, Record<number, string>> = {
    debug: {
      0: 'Use scientific method to find and fix the bug',
      1: 'Quick fix for simple errors',
      2: 'Add tests to prevent regression',
      3: 'Review fix before merging'
    },
    build: {
      0: 'Understand existing codebase structure',
      1: 'Follow best practices for this tech stack',
      2: 'Ensure test coverage for new code',
      3: 'Review code quality before merge'
    },
    refactor: {
      0: 'Map the codebase before refactoring',
      1: 'Plan the refactoring in detail',
      2: 'Execute refactoring safely',
      3: 'Verify new code passes tests',
      4: 'Final review before merge'
    },
    audit: {
      0: 'Comprehensive system audit',
      1: 'Security vulnerability scan',
      2: 'Code quality review',
      3: 'Performance analysis'
    },
    optimize: {
      0: 'Find performance bottlenecks',
      1: 'Optimize and measure impact',
      2: 'Verify performance improvements',
      3: 'Code review of optimizations'
    },
    test: {
      0: 'Plan test coverage strategy',
      1: 'Review tests for quality'
    },
    setup: {
      0: 'Follow best practices for setup',
      1: 'Configure git workflow'
    },
    document: {
      0: 'Follow documentation best practices',
      1: 'Review documentation quality'
    },
    unknown: {
      0: 'Start with master protocol routing'
    }
  };

  return reasons[taskType]?.[index] || `Execute ${protocolName}`;
}

/**
 * Get prerequisite for a protocol
 */
function getPrerequisiteForStep(protocolName: string): string | undefined {
  const prerequisites: Record<string, string> = {
    'mdap_protocol': 'codebase_indexing_protocol',
    'performance_protocol': 'codebase_indexing_protocol',
    'test_automation_protocol': 'codebase_indexing_protocol',
    'bigpappa_protocol_reviewANDfixes': 'codebase_indexing_protocol'
  };

  return prerequisites[protocolName];
}

/**
 * Re-prioritize workflow steps based on project context
 */
function prioritizeByContext(steps: WorkflowStep[], context: ProjectContext): WorkflowStep[] {
  // For now, just return as-is
  // In future, could reorder based on context-specific priorities
  return steps;
}

/**
 * Get workflow shortcuts (skip-able steps)
 */
export function getWorkflowShortcuts(taskType: TaskType): Record<string, string[]> {
  const shortcuts: Record<TaskType, Record<string, string[]>> = {
    debug: {
      'Quick fix': ['error_fix_protocol'],
      'Full investigation': ['debug_protocol', 'test_automation_protocol', 'code_review_protocol']
    },
    build: {
      'Familiar codebase': ['test_automation_protocol', 'code_review_protocol'],
      'New project': ['codebase_indexing_protocol', 'best_practices_protocol', 'test_automation_protocol']
    },
    refactor: {
      'Small refactor': ['refactor_protocol', 'test_automation_protocol', 'code_review_protocol'],
      'Large refactor': ['codebase_indexing_protocol', 'mdap_protocol', 'refactor_protocol', 'test_automation_protocol']
    },
    audit: {
      'Security focus': ['security_audit_protocol'],
      'Performance focus': ['performance_protocol'],
      'Full audit': ['bigpappa_protocol_reviewANDfixes']
    },
    optimize: {
      'Quick optimization': ['performance_protocol'],
      'Thorough analysis': ['codebase_indexing_protocol', 'performance_protocol', 'test_automation_protocol']
    },
    test: {
      'Unit tests only': ['test_automation_protocol'],
      'Full coverage': ['test_automation_protocol', 'code_review_protocol']
    },
    setup: {
      'Minimal setup': ['best_practices_protocol'],
      'Complete setup': ['best_practices_protocol', 'git_workflow_protocol']
    },
    document: {
      'Quick docs': ['best_practices_protocol'],
      'Comprehensive': ['best_practices_protocol', 'code_review_protocol']
    },
    unknown: {
      'Get started': ['MASTER_PROTOCOL']
    }
  };

  return shortcuts[taskType] || {};
}

/**
 * Format workflow for display
 */
export function formatWorkflow(steps: WorkflowStep[], taskType: TaskType): string {
  let output = `## Workflow: ${taskType.toUpperCase()}\n\n`;
  
  for (const step of steps) {
    const marker = step.optional ? '📋' : '✅';
    output += `${marker} **Step ${step.order}:** ${step.protocolName}\n`;
    output += `   **Trigger:** \`${step.trigger}\`\n`;
    output += `   **Purpose:** ${step.reason}\n`;
    if (step.prerequisite) {
      output += `   **Note:** ${step.prerequisite}\n`;
    }
    output += '\n';
  }

  return output;
}
