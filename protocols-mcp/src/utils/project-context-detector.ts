import fs from 'fs';
import path from 'path';

/**
 * Project context detection
 * Scans for common files and infers tech stack, language, framework
 */

export type Language = 'javascript' | 'typescript' | 'python' | 'go' | 'rust' | 'java' | 'csharp' | 'unknown';
export type Framework = 'react' | 'vue' | 'svelte' | 'express' | 'fastapi' | 'django' | 'spring' | 'none' | 'unknown';
export type ProjectType = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'library' | 'unknown';
export type TestFramework = 'jest' | 'vitest' | 'pytest' | 'go-test' | 'unknown';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'pip' | 'cargo' | 'maven' | 'unknown';

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

const DEFAULT_CONTEXT: ProjectContext = {
  language: 'unknown',
  framework: 'unknown',
  projectType: 'unknown',
  testFramework: 'unknown',
  packageManager: 'unknown',
  hasDocker: false,
  hasCI: false,
  hasGit: false,
  dependencies: [],
  devDependencies: [],
  detected: false
};

/**
 * Check if a file exists
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Detect project context by scanning for common files
 */
export async function detectProjectContext(rootPath: string): Promise<ProjectContext> {
  const context: ProjectContext = { ...DEFAULT_CONTEXT };

  try {
    // Detect package.json (Node.js/JavaScript)
    const packageJsonPath = path.join(rootPath, 'package.json');
    if (fileExists(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        context.packageManager = 'npm';
        
        // Detect language
        if (pkg.devDependencies?.typescript) {
          context.language = 'typescript';
        } else {
          context.language = 'javascript';
        }
        
        // Detect framework
        if (pkg.dependencies?.react || pkg.devDependencies?.react) {
          context.framework = 'react';
          context.projectType = 'frontend';
        } else if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
          context.framework = 'vue';
          context.projectType = 'frontend';
        } else if (pkg.dependencies?.svelte || pkg.devDependencies?.svelte) {
          context.framework = 'svelte';
          context.projectType = 'frontend';
        } else if (pkg.dependencies?.express) {
          context.framework = 'express';
          context.projectType = 'backend';
        } else if (Object.keys(pkg.dependencies || {}).length > 0 || Object.keys(pkg.devDependencies || {}).length > 0) {
          // If has dependencies but no recognized framework, it's likely backend/utility
          context.projectType = 'backend';
        } else {
          // If minimal/no dependencies, default to fullstack
          context.projectType = 'fullstack';
        }
        
        // Detect test framework
        if (pkg.devDependencies?.jest) {
          context.testFramework = 'jest';
        } else if (pkg.devDependencies?.vitest) {
          context.testFramework = 'vitest';
        }
        
        // Detect package manager used (check lock files)
        if (fileExists(path.join(rootPath, 'yarn.lock'))) {
          context.packageManager = 'yarn';
        } else if (fileExists(path.join(rootPath, 'pnpm-lock.yaml'))) {
          context.packageManager = 'pnpm';
        }
        
        // Store dependencies
        context.dependencies = Object.keys(pkg.dependencies || {});
        context.devDependencies = Object.keys(pkg.devDependencies || {});
        context.detected = true;
      } catch (error) {
        // Ignore parse errors
      }
    }

    // Detect pyproject.toml (Python)
    if (!context.detected) {
      const pyprojectPath = path.join(rootPath, 'pyproject.toml');
      if (fileExists(pyprojectPath)) {
        context.language = 'python';
        context.packageManager = 'pip';
        
        // Try to detect framework
        const content = fs.readFileSync(pyprojectPath, 'utf-8');
        if (content.includes('django')) {
          context.framework = 'django';
          context.projectType = 'backend';
        } else if (content.includes('fastapi')) {
          context.framework = 'fastapi';
          context.projectType = 'backend';
        } else {
          context.projectType = 'backend';
        }
        
        if (content.includes('pytest')) {
          context.testFramework = 'pytest';
        }
        
        context.detected = true;
      }
    }

    // Detect requirements.txt (Python)
    if (!context.detected) {
      const reqPath = path.join(rootPath, 'requirements.txt');
      if (fileExists(reqPath)) {
        context.language = 'python';
        context.packageManager = 'pip';
        context.projectType = 'backend';
        context.detected = true;
      }
    }

    // Detect go.mod (Go)
    if (!context.detected) {
      if (fileExists(path.join(rootPath, 'go.mod'))) {
        context.language = 'go';
        context.packageManager = 'unknown';
        context.testFramework = 'go-test';
        context.projectType = 'backend';
        context.detected = true;
      }
    }

    // Detect Cargo.toml (Rust)
    if (!context.detected) {
      if (fileExists(path.join(rootPath, 'Cargo.toml'))) {
        context.language = 'rust';
        context.packageManager = 'cargo';
        context.projectType = 'backend';
        context.detected = true;
      }
    }

    // Detect pom.xml (Java/Maven)
    if (!context.detected) {
      if (fileExists(path.join(rootPath, 'pom.xml'))) {
        context.language = 'java';
        context.packageManager = 'maven';
        context.framework = 'none'; // Don't assume Spring - could be other frameworks
        context.projectType = 'backend';
        context.detected = true;
      }
    }

    // Detect Dockerfile
    if (fileExists(path.join(rootPath, 'Dockerfile'))) {
      context.hasDocker = true;
      if (!context.projectType || context.projectType === 'unknown') {
        context.projectType = 'devops';
      }
    }

    // Detect CI/CD
    if (fileExists(path.join(rootPath, '.github', 'workflows'))) {
      context.hasCI = true;
    }
    if (fileExists(path.join(rootPath, '.gitlab-ci.yml')) || 
        fileExists(path.join(rootPath, '.circleci')) ||
        fileExists(path.join(rootPath, 'Jenkinsfile'))) {
      context.hasCI = true;
    }

    // Detect git
    if (fileExists(path.join(rootPath, '.git'))) {
      context.hasGit = true;
    }

    return context;
  } catch (error) {
    console.error('Error detecting project context:', error);
    return DEFAULT_CONTEXT;
  }
}

/**
 * Get human-readable description of context
 */
export function describeContext(context: ProjectContext): string {
  if (!context.detected) {
    return 'No project context detected';
  }

  const parts: string[] = [];
  
  if (context.language !== 'unknown') {
    parts.push(`Language: ${context.language}`);
  }
  
  if (context.framework !== 'unknown' && context.framework !== 'none') {
    parts.push(`Framework: ${context.framework}`);
  }
  
  if (context.projectType !== 'unknown') {
    parts.push(`Type: ${context.projectType}`);
  }
  
  if (context.testFramework !== 'unknown') {
    parts.push(`Tests: ${context.testFramework}`);
  }
  
  if (context.hasDocker) {
    parts.push('Has Docker');
  }
  
  if (context.hasCI) {
    parts.push('Has CI/CD');
  }
  
  return parts.join(', ');
}

/**
 * Check if context matches a specific language
 */
export function isLanguage(context: ProjectContext, lang: Language): boolean {
  return context.language === lang;
}

/**
 * Check if context matches a specific framework
 */
export function isFramework(context: ProjectContext, fw: Framework): boolean {
  return context.framework === fw;
}

/**
 * Get relevant protocol tags based on context
 */
export function getRelevantTags(context: ProjectContext): string[] {
  const tags: string[] = [];

  if (context.projectType === 'frontend') {
    tags.push('frontend', 'ui-ux', 'accessibility');
  } else if (context.projectType === 'backend') {
    tags.push('backend', 'api', 'database');
  } else if (context.projectType === 'fullstack') {
    tags.push('fullstack', 'integration');
  }

  if (context.language === 'typescript' || context.language === 'javascript') {
    tags.push('javascript', 'typescript', 'node');
  } else if (context.language === 'python') {
    tags.push('python');
  } else if (context.language === 'go') {
    tags.push('go', 'golang');
  } else if (context.language === 'rust') {
    tags.push('rust');
  }

  if (context.framework === 'react') {
    tags.push('react', 'component');
  } else if (context.framework === 'vue') {
    tags.push('vue');
  } else if (context.framework === 'express') {
    tags.push('express', 'rest-api');
  }

  if (context.hasDocker) {
    tags.push('docker', 'devops');
  }

  if (context.hasCI) {
    tags.push('ci-cd', 'automation');
  }

  return [...new Set(tags)]; // Remove duplicates
}
