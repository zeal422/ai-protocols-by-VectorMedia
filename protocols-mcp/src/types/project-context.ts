import { z } from 'zod';

export enum Language {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Python = 'python',
  Go = 'go',
  Rust = 'rust',
  Java = 'java',
  CSharp = 'csharp',
  Unknown = 'unknown'
}

export enum Framework {
  React = 'react',
  Vue = 'vue',
  Svelte = 'svelte',
  Express = 'express',
  FastAPI = 'fastapi',
  Django = 'django',
  Spring = 'spring',
  None = 'none',
  Unknown = 'unknown'
}

export enum ProjectType {
  Frontend = 'frontend',
  Backend = 'backend',
  Fullstack = 'fullstack',
  DevOps = 'devops',
  Library = 'library',
  Unknown = 'unknown'
}

export enum TestFramework {
  Jest = 'jest',
  Vitest = 'vitest',
  Pytest = 'pytest',
  GoTest = 'go-test',
  Unknown = 'unknown'
}

export enum PackageManager {
  NPM = 'npm',
  Yarn = 'yarn',
  PNPM = 'pnpm',
  PIP = 'pip',
  Cargo = 'cargo',
  Maven = 'maven',
  Unknown = 'unknown'
}

export interface ProjectContext {
  language: Language;
  framework: Framework;
  projectType: ProjectType;
  testFramework: TestFramework;
  packageManager: PackageManager;
  hasDocker: boolean;
  hasCI: boolean;
  hasGit: boolean;
  dependencies: string[];
  devDependencies: string[];
  detected: boolean;
}

export const LanguageSchema = z.enum([
  'javascript', 'typescript', 'python', 'go', 'rust', 'java', 'csharp', 'unknown'
]);

export const FrameworkSchema = z.enum([
  'react', 'vue', 'svelte', 'express', 'fastapi', 'django', 'spring', 'none', 'unknown'
]);

export const ProjectTypeSchema = z.enum([
  'frontend', 'backend', 'fullstack', 'devops', 'library', 'unknown'
]);

export const TestFrameworkSchema = z.enum([
  'jest', 'vitest', 'pytest', 'go-test', 'unknown'
]);

export const PackageManagerSchema = z.enum([
  'npm', 'yarn', 'pnpm', 'pip', 'cargo', 'maven', 'unknown'
]);

export const ProjectContextSchema = z.object({
  language: LanguageSchema,
  framework: FrameworkSchema,
  projectType: ProjectTypeSchema,
  testFramework: TestFrameworkSchema,
  packageManager: PackageManagerSchema,
  hasDocker: z.boolean(),
  hasCI: z.boolean(),
  hasGit: z.boolean(),
  dependencies: z.array(z.string()),
  devDependencies: z.array(z.string()),
  detected: z.boolean()
});
