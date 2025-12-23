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

/**
 * Unified validation message interface for both errors and warnings
 */
export interface ValidationMessage {
  file: string;
  line?: number;
  message: string;
  severity: 'error' | 'warning';
}
