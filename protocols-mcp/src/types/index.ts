// Re-export extended metadata types
export { ExtendedProtocolMetadata, ProtocolFrontmatter, DifficultyEnum, CategoryEnum, validateFrontmatter, hasFrontmatter } from './protocol-frontmatter.js';

export interface ProtocolMetadata {
  fileName: string;
  name: string;
  title: string;
  triggers: string[];
  category: string;
  purpose: string;
  filePath: string;
}

export interface IDEConfig {
  name: string;
  files: string[];
  description: string;
}

export interface ExampleProject {
  name: string;
  description: string;
  language: string;
  framework: string;
  features: string[];
}

export interface ValidationResult {
  success: boolean;
  issues: ValidationMessage[];
  score: number;
}

export interface ValidationMessage {
  file: string;
  line?: number;
  message: string;
  severity: 'error' | 'warning';
}

// Export new Phase 1 types
export * from './project-context.js';
export * from './execution.js';
export * from './database.js';
export { ProtocolError as ProtocolErrorType, SessionNotFoundError, ArtifactNotFoundError, DatabaseError, ValidationErrorExt } from './errors.js';
