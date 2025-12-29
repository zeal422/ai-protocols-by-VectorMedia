import { z } from 'zod';

/**
 * YAML Front-Matter Schema for Protocols
 * Validates the structured metadata at the top of each protocol markdown file
 */

export const DifficultyEnum = z.enum(['beginner', 'intermediate', 'advanced']);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const CategoryEnum = z.enum([
  'Debugging',
  'Testing',
  'Architecture',
  'Frontend',
  'Accessibility',
  'Security',
  'Performance',
  'Quality',
  'Refactoring',
  'VersionControl',
  'Auditing',
  'Configuration',
  'Core'
]);
export type Category = z.infer<typeof CategoryEnum>;

export const ProtocolFrontmatterSchema = z.object({
  id: z.string().describe('Unique identifier for the protocol'),
  version: z.string().describe('Semantic version (e.g., 1.0.0)'),
  triggers: z.array(z.string()).min(1).describe('Uppercase trigger commands'),
  category: CategoryEnum.describe('Primary category for the protocol'),
  tags: z.array(z.string()).describe('Searchable tags for the protocol'),
  difficulty: DifficultyEnum.describe('Difficulty level for users'),
  timeEstimate: z.string().optional().describe('Estimated time to complete (e.g., "30-60m")'),
  prerequisites: z.array(z.string()).optional().default([]).describe('Prerequisite protocols or knowledge'),
  worksWellWith: z.array(z.string()).optional().default([]).describe('Related/complementary protocols'),
  platformTags: z.array(z.string()).optional().default([]).describe('Applicable platforms (e.g., frontend, backend, fullstack)'),
  stackSpecific: z.record(z.boolean()).optional().default({}).describe('Language/framework specific (e.g., node: true, python: true)')
});

export type ProtocolFrontmatter = z.infer<typeof ProtocolFrontmatterSchema>;

/**
 * Extended metadata combining frontmatter + inferred data
 */
export interface ExtendedProtocolMetadata {
  id: string;
  fileName: string;
  name: string;
  title: string;
  triggers: string[];
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  timeEstimate?: string;
  purpose: string;
  filePath: string;
  version: string;
  prerequisites: string[];
  worksWellWith: string[];
  platformTags: string[];
  stackSpecific: Record<string, boolean>;
  hasFrontmatter: boolean; // Track if frontmatter was explicitly provided
}

/**
 * Validate frontmatter YAML data
 */
export function validateFrontmatter(data: unknown): ProtocolFrontmatter {
  return ProtocolFrontmatterSchema.parse(data);
}

/**
 * Check if required frontmatter fields are present
 */
export function hasFrontmatter(frontmatter: unknown): boolean {
  try {
    ProtocolFrontmatterSchema.parse(frontmatter);
    return true;
  } catch {
    return false;
  }
}
