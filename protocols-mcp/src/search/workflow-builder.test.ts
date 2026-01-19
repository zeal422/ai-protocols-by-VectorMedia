import { describe, it, expect } from 'vitest';
import { buildWorkflow, getWorkflowShortcuts } from './workflow-builder.js';
import type { ProjectContext } from '../utils/project-context-detector.js';

const allTaskTypes = ['debug', 'build', 'refactor', 'audit', 'optimize', 'test', 'setup', 'unknown'] as const;

describe('WorkflowBuilder', () => {
  const mockContext: ProjectContext = {
    language: 'typescript',
    framework: 'react',
    projectType: 'frontend',
    testFramework: 'jest',
    packageManager: 'npm',
    hasDocker: false,
    hasCI: false,
    hasGit: false,
    dependencies: [],
    devDependencies: [],
    detected: true
  };

  describe('buildWorkflow', () => {
    it('should build workflow for debug task', () => {
      const workflow = buildWorkflow('debug');

      expect(Array.isArray(workflow)).toBe(true);
      expect(workflow.length).toBeGreaterThan(0);
    });

    it('should build workflow for build task', () => {
      const workflow = buildWorkflow('build');

      expect(Array.isArray(workflow)).toBe(true);
      expect(workflow[0].order).toBe(1);
    });

    it('should build workflow for refactor task', () => {
      const workflow = buildWorkflow('refactor');

      expect(Array.isArray(workflow)).toBe(true);
      expect(workflow.length).toBeGreaterThanOrEqual(3);
    });

    it('should build workflow for audit task', () => {
      const workflow = buildWorkflow('audit');

      expect(Array.isArray(workflow)).toBe(true);
      expect(workflow.length).toBeGreaterThan(0);
    });

    it('should build workflow for optimize task', () => {
      const workflow = buildWorkflow('optimize');

      expect(Array.isArray(workflow)).toBe(true);
    });

    it('should build workflow for test task', () => {
      const workflow = buildWorkflow('test');

      expect(Array.isArray(workflow)).toBe(true);
    });

    it('should build workflow for setup task', () => {
      const workflow = buildWorkflow('setup');

      expect(Array.isArray(workflow)).toBe(true);
    });

    it('should build workflow for unknown task', () => {
      const workflow = buildWorkflow('unknown');

      expect(Array.isArray(workflow)).toBe(true);
    });
  });

  describe('Workflow structure', () => {
    it('should have correct step ordering', () => {
      const workflow = buildWorkflow('debug');

      workflow.forEach((step, index) => {
        expect(step.order).toBe(index + 1);
      });
    });

    it('should mark first step as required', () => {
      const workflow = buildWorkflow('debug');

      expect(workflow[0].optional).toBe(false);
    });

    it('should mark subsequent steps as optional', () => {
      const workflow = buildWorkflow('debug');

      if (workflow.length > 1) {
        for (let i = 1; i < workflow.length; i++) {
          expect(workflow[i].optional).toBe(true);
        }
      }
    });

    it('should include protocol names', () => {
      const workflow = buildWorkflow('debug');

      workflow.forEach(step => {
        expect(step.protocolName).toBeDefined();
        expect(typeof step.protocolName).toBe('string');
        expect(step.protocolName.length).toBeGreaterThan(0);
      });
    });

    it('should include trigger commands', () => {
      const workflow = buildWorkflow('debug');

      workflow.forEach(step => {
        expect(step.trigger).toBeDefined();
        expect(typeof step.trigger).toBe('string');
        expect(step.trigger.length).toBeGreaterThan(0);
      });
    });

    it('should include reasons', () => {
      const workflow = buildWorkflow('debug');

      workflow.forEach(step => {
        expect(step.reason).toBeDefined();
        expect(typeof step.reason).toBe('string');
        expect(step.reason.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Prerequisites handling', () => {
    it('should include prerequisites for refactor workflow', () => {
      const workflow = buildWorkflow('refactor');

      // Refactor workflow should have MDAP which requires FULLINDEX
      const hasPrerequisites = workflow.some(step => step.prerequisite !== undefined);
      expect(hasPrerequisites).toBe(true);
    });

    it('should link MDAP to FULLINDEX', () => {
      const workflow = buildWorkflow('refactor');

      const mdapStep = workflow.find(step => step.protocolName === 'mdap_protocol');
      if (mdapStep) {
        expect(mdapStep.prerequisite).toBeDefined();
      }
    });

    it('should include prerequisites for optimize workflow', () => {
      const workflow = buildWorkflow('optimize');

      const hasPrerequisites = workflow.some(step => step.prerequisite !== undefined);
      expect(hasPrerequisites).toBe(true);
    });
  });

  describe('Context-aware workflows', () => {
    it('should accept project context', () => {
      const workflow = buildWorkflow('debug', mockContext);

      expect(Array.isArray(workflow)).toBe(true);
      expect(workflow.length).toBeGreaterThan(0);
    });

    it('should work without context', () => {
      const workflowWithContext = buildWorkflow('debug', mockContext);
      const workflowWithoutContext = buildWorkflow('debug');

      expect(workflowWithContext.length).toBe(workflowWithoutContext.length);
    });
  });

  describe('getWorkflowShortcuts', () => {
    it('should return shortcuts for debug task', () => {
      const shortcuts = getWorkflowShortcuts('debug');

      expect(shortcuts).toBeDefined();
      expect(typeof shortcuts).toBe('object');
    });

    it('should return shortcuts for build task', () => {
      const shortcuts = getWorkflowShortcuts('build');

      expect(shortcuts).toBeDefined();
    });

    it('should return shortcuts for refactor task', () => {
      const shortcuts = getWorkflowShortcuts('refactor');

      expect(shortcuts).toBeDefined();
    });

    it('should have multiple shortcut options', () => {
      const shortcuts = getWorkflowShortcuts('debug');

      expect(Object.keys(shortcuts).length).toBeGreaterThan(0);
    });

    it('shortcuts should include workflow data', () => {
      const shortcuts = getWorkflowShortcuts('debug');

      Object.values(shortcuts).forEach(shortcut => {
        expect(Array.isArray(shortcut)).toBe(true);
      });
    });
  });

  describe('All task types', () => {
    it('should support all task types', () => {
      allTaskTypes.forEach(taskType => {
        const workflow = buildWorkflow(taskType as typeof allTaskTypes[number]);
        expect(Array.isArray(workflow)).toBe(true);
      });
    });

    it('should return non-empty workflows for all task types', () => {
      allTaskTypes.forEach(taskType => {
        const workflow = buildWorkflow(taskType as typeof allTaskTypes[number]);
        expect(workflow.length).toBeGreaterThan(0);
      });
    });

    it('should have valid structure for all task types', () => {
      allTaskTypes.forEach(taskType => {
        const workflow = buildWorkflow(taskType as typeof allTaskTypes[number]);

        workflow.forEach(step => {
          expect(step.order).toBeGreaterThan(0);
          expect(step.protocolName).toBeDefined();
          expect(step.trigger).toBeDefined();
          expect(step.reason).toBeDefined();
          expect(typeof step.optional).toBe('boolean');
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle unknown task type gracefully', () => {
      const workflow = buildWorkflow('unknown_task_type' as unknown as typeof allTaskTypes[number]);

      expect(Array.isArray(workflow)).toBe(true);
    });

    it('should maintain consistency across calls', () => {
      const workflow1 = buildWorkflow('debug');
      const workflow2 = buildWorkflow('debug');

      expect(workflow1.length).toBe(workflow2.length);
      workflow1.forEach((step, index) => {
        expect(step.protocolName).toBe(workflow2[index].protocolName);
        expect(step.trigger).toBe(workflow2[index].trigger);
      });
    });

    it('should work with different project contexts', () => {
      const backendContext: ProjectContext = {
        ...mockContext,
        framework: 'express' as const,
        projectType: 'backend' as const
      };

      const workflow1 = buildWorkflow('debug', mockContext);
      const workflow2 = buildWorkflow('debug', backendContext);

      expect(workflow1.length).toBe(workflow2.length);
    });
  });
});
