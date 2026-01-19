import { describe, it, expect } from 'vitest';
import {
  ProtocolError,
  SessionNotFoundError,
  ArtifactNotFoundError,
  DatabaseError,
  ValidationErrorExt,
  ValidationError,
  ValidationWarning,
  ValidationResult
} from '../../src/types/errors.js';
import {
  SessionStatusSchema,
  ArtifactTypeSchema,
  FindingSchema,
  RecommendationSchema,
  StandardResultSchema
} from '../../src/types/execution.js';
import {
  Language,
  Framework,
  ProjectType,
  TestFramework,
  PackageManager,
  LanguageSchema,
  FrameworkSchema,
  ProjectContextSchema
} from '../../src/types/project-context.js';

describe('Error Classes', () => {
  describe('ProtocolError', () => {
    it('should create error with message, code, and details', () => {
      const error = new ProtocolError('Test error', 'TEST_CODE', { key: 'value' });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ key: 'value' });
      expect(error.name).toBe('ProtocolError');
    });

    it('should be instanceof Error', () => {
      const error = new ProtocolError('Test', 'CODE');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('SessionNotFoundError', () => {
    it('should create error with sessionId in details', () => {
      const error = new SessionNotFoundError('session-123');

      expect(error.message).toBe('Session not found: session-123');
      expect(error.code).toBe('SESSION_NOT_FOUND');
      expect(error.details).toEqual({ sessionId: 'session-123' });
      expect(error instanceof ProtocolError).toBe(true);
    });
  });

  describe('ArtifactNotFoundError', () => {
    it('should create error with artifactId in details', () => {
      const error = new ArtifactNotFoundError('artifact-456');

      expect(error.message).toBe('Artifact not found: artifact-456');
      expect(error.code).toBe('ARTIFACT_NOT_FOUND');
      expect(error.details).toEqual({ artifactId: 'artifact-456' });
      expect(error instanceof ProtocolError).toBe(true);
    });
  });

  describe('DatabaseError', () => {
    it('should create error with message and optional details', () => {
      const error = new DatabaseError('Connection failed', { host: 'localhost' });

      expect(error.message).toBe('Connection failed');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.details).toEqual({ host: 'localhost' });
      expect(error instanceof ProtocolError).toBe(true);
    });

    it('should work without details', () => {
      const error = new DatabaseError('Unknown error');

      expect(error.message).toBe('Unknown error');
      expect(error.details).toBeUndefined();
      expect(error instanceof ProtocolError).toBe(true);
    });
  });

  describe('ValidationErrorExt', () => {
    it('should create validation error with errors array', () => {
      const errors: ValidationError[] = [
        { field: 'name', message: 'Required', code: 'REQUIRED' },
        { field: 'email', message: 'Invalid format', code: 'INVALID', value: 'bad' }
      ];
      const error = new ValidationErrorExt('Validation failed', errors);

      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ errors });
      expect(error instanceof ProtocolError).toBe(true);
    });
  });
});

describe('Validation Types', () => {
  describe('ValidationError', () => {
    it('should have correct structure', () => {
      const error: ValidationError = {
        field: 'test',
        message: 'Test error',
        code: 'TEST',
        value: 'bad-value'
      };

      expect(error.field).toBe('test');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST');
      expect(error.value).toBe('bad-value');
    });
  });

  describe('ValidationWarning', () => {
    it('should have correct structure', () => {
      const warning: ValidationWarning = {
        field: 'config',
        message: 'Consider using HTTPS',
        code: 'DEPRECATED',
        value: 'http://localhost'
      };

      expect(warning.field).toBe('config');
      expect(warning.message).toBe('Consider using HTTPS');
      expect(warning.code).toBe('DEPRECATED');
    });
  });

  describe('ValidationResult', () => {
    it('should have correct structure', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: []
      };

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('can contain errors and warnings', () => {
      const result: ValidationResult = {
        valid: false,
        errors: [{ field: 'name', message: 'Required', code: 'REQUIRED' }],
        warnings: [{ field: 'email', message: 'Consider using business email', code: 'SUGGESTION' }]
      };

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.warnings.length).toBe(1);
    });
  });
});

describe('Execution Type Schemas', () => {
  describe('SessionStatusSchema', () => {
    it('should validate valid session statuses', () => {
      const validStatuses = ['active', 'paused', 'completed', 'failed', 'archived'];
      validStatuses.forEach(status => {
        const result = SessionStatusSchema.safeParse(status);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid session statuses', () => {
      const result = SessionStatusSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('ArtifactTypeSchema', () => {
    it('should validate valid artifact types', () => {
      const validTypes = ['findings', 'recommendations', 'code_suggestions', 'test_results', 'metrics', 'errors', 'warnings', 'other'];
      validTypes.forEach(type => {
        const result = ArtifactTypeSchema.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid artifact types', () => {
      const result = ArtifactTypeSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('FindingSchema', () => {
    it('should validate valid finding', () => {
      const finding = {
        findingId: 'f1',
        severity: 'high',
        category: 'security',
        title: 'SQL Injection',
        description: 'Potential SQL injection'
      };

      const result = FindingSchema.safeParse(finding);
      expect(result.success).toBe(true);
    });

    it('should validate finding with optional fields', () => {
      const finding = {
        findingId: 'f1',
        severity: 'critical',
        category: 'security',
        title: 'SQL Injection',
        description: 'Found SQL injection vulnerability',
        location: 'src/db.ts:42',
        codeSnippet: 'query = "SELECT * FROM " + table',
        impact: 'Full database compromise',
        evidence: ['Evidence 1'],
        tags: ['security', 'sql']
      };

      const result = FindingSchema.safeParse(finding);
      expect(result.success).toBe(true);
    });

    it('should reject invalid severity', () => {
      const finding = {
        findingId: 'f1',
        severity: 'invalid',
        category: 'test',
        title: 'Test',
        description: 'Test'
      };

      const result = FindingSchema.safeParse(finding);
      expect(result.success).toBe(false);
    });
  });

  describe('RecommendationSchema', () => {
    it('should validate valid recommendation', () => {
      const rec = {
        recommendationId: 'r1',
        priority: 'high',
        action: 'Use parameterized queries',
        description: 'Replace string concatenation with parameterized queries'
      };

      const result = RecommendationSchema.safeParse(rec);
      expect(result.success).toBe(true);
    });

    it('should validate recommendation with optional fields', () => {
      const rec = {
        recommendationId: 'r1',
        priority: 'critical',
        action: 'Use parameterized queries',
        description: 'Replace string concatenation',
        codeExample: 'db.query("SELECT * FROM users WHERE id = ?", [id])',
        impact: 'Prevents SQL injection',
        effort: 'significant'
      };

      const result = RecommendationSchema.safeParse(rec);
      expect(result.success).toBe(true);
    });
  });

  describe('StandardResultSchema', () => {
    it('should validate valid standard result', () => {
      const result = {
        protocolName: 'security_audit',
        executionTime: 1500,
        timestamp: new Date().toISOString(),
        success: true,
        findings: [],
        recommendations: [],
        artifacts: [],
        nextSteps: [],
        metrics: {
          protocolName: 'security_audit',
          executionTime: 1500,
          cacheHits: 0,
          cacheMisses: 0,
          cacheHitRate: 0,
          memoryUsage: 50000,
          success: true
        }
      };

      const parseResult = StandardResultSchema.safeParse(result);
      expect(parseResult.success).toBe(true);
    });
  });
});

describe('Project Context Types', () => {
  describe('Language Enum', () => {
    it('should have all expected values', () => {
      expect(Language.JavaScript).toBe('javascript');
      expect(Language.TypeScript).toBe('typescript');
      expect(Language.Python).toBe('python');
      expect(Language.Go).toBe('go');
      expect(Language.Rust).toBe('rust');
      expect(Language.Java).toBe('java');
      expect(Language.CSharp).toBe('csharp');
      expect(Language.Unknown).toBe('unknown');
    });
  });

  describe('Framework Enum', () => {
    it('should have all expected values', () => {
      expect(Framework.React).toBe('react');
      expect(Framework.Vue).toBe('vue');
      expect(Framework.Svelte).toBe('svelte');
      expect(Framework.Express).toBe('express');
      expect(Framework.FastAPI).toBe('fastapi');
      expect(Framework.Django).toBe('django');
      expect(Framework.Spring).toBe('spring');
      expect(Framework.None).toBe('none');
      expect(Framework.Unknown).toBe('unknown');
    });
  });

  describe('ProjectType Enum', () => {
    it('should have all expected values', () => {
      expect(ProjectType.Frontend).toBe('frontend');
      expect(ProjectType.Backend).toBe('backend');
      expect(ProjectType.Fullstack).toBe('fullstack');
      expect(ProjectType.DevOps).toBe('devops');
      expect(ProjectType.Library).toBe('library');
      expect(ProjectType.Unknown).toBe('unknown');
    });
  });

  describe('TestFramework Enum', () => {
    it('should have all expected values', () => {
      expect(TestFramework.Jest).toBe('jest');
      expect(TestFramework.Vitest).toBe('vitest');
      expect(TestFramework.Pytest).toBe('pytest');
      expect(TestFramework.GoTest).toBe('go-test');
      expect(TestFramework.Unknown).toBe('unknown');
    });
  });

  describe('PackageManager Enum', () => {
    it('should have all expected values', () => {
      expect(PackageManager.NPM).toBe('npm');
      expect(PackageManager.Yarn).toBe('yarn');
      expect(PackageManager.PNPM).toBe('pnpm');
      expect(PackageManager.PIP).toBe('pip');
      expect(PackageManager.Cargo).toBe('cargo');
      expect(PackageManager.Maven).toBe('maven');
      expect(PackageManager.Unknown).toBe('unknown');
    });
  });

  describe('LanguageSchema', () => {
    it('should validate valid languages', () => {
      ['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'csharp', 'unknown'].forEach(lang => {
        const result = LanguageSchema.safeParse(lang);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid languages', () => {
      const result = LanguageSchema.safeParse('ruby');
      expect(result.success).toBe(false);
    });
  });

  describe('FrameworkSchema', () => {
    it('should validate valid frameworks', () => {
      ['react', 'vue', 'svelte', 'express', 'fastapi', 'django', 'spring', 'none', 'unknown'].forEach(fw => {
        const result = FrameworkSchema.safeParse(fw);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ProjectContextSchema', () => {
    it('should validate valid project context', () => {
      const context = {
        language: 'typescript',
        framework: 'express',
        projectType: 'backend',
        testFramework: 'jest',
        packageManager: 'npm',
        hasDocker: false,
        hasCI: true,
        hasGit: true,
        dependencies: ['express', 'zod'],
        devDependencies: ['jest', 'typescript'],
        detected: true
      };

      const result = ProjectContextSchema.safeParse(context);
      expect(result.success).toBe(true);
    });

    it('should reject invalid project context', () => {
      const context = {
        language: 'ruby',
        framework: 'rails',
        projectType: 'backend',
        testFramework: 'rspec',
        packageManager: 'bundler',
        hasDocker: false,
        hasCI: false,
        hasGit: true,
        dependencies: [],
        devDependencies: [],
        detected: true
      };

      const result = ProjectContextSchema.safeParse(context);
      expect(result.success).toBe(false);
    });
  });
});
