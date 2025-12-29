import { ProtocolMetadata } from '../types/index.js';
import { ExtendedProtocolMetadata, validateFrontmatter, hasFrontmatter } from '../types/protocol-frontmatter.js';
import * as yaml from 'js-yaml';

/**
 * Extract metadata from protocol markdown file
 * Supports YAML front-matter with fallback to inferred metadata
 */
export function extractMetadata(fileName: string, content: string): ExtendedProtocolMetadata {
  // Only remove trailing .md extension
  const name = fileName.replace(/\.md$/, '');
  
  // Try to extract YAML front-matter first
  let frontmatterData: any = null;
  let hasFrontmatterBlock = false;
  // Support both Unix (LF) and Windows (CRLF) line endings
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  if (frontmatterMatch) {
    try {
      frontmatterData = yaml.load(frontmatterMatch[1]);
      hasFrontmatterBlock = hasFrontmatter(frontmatterData);
    } catch (error) {
      // Invalid YAML, fall back to inferred
      console.warn(`Warning: Invalid YAML front-matter in ${fileName}:`, error);
    }
  }
  
  // Extract title (first H1 heading only - starts with # followed by space)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : name;

  // Extract triggers - use frontmatter or infer
  const triggers = frontmatterData?.triggers || extractTriggers(content);

  // Extract category - use frontmatter or infer
  const category = frontmatterData?.category || inferCategory(name, content);

  // Extract purpose/description (first paragraph after title)
  const purpose = extractPurpose(content);

  return {
    id: frontmatterData?.id || name,
    fileName,
    name,
    title,
    triggers,
    category,
    tags: frontmatterData?.tags || extractTags(name, title),
    difficulty: frontmatterData?.difficulty || 'intermediate',
    timeEstimate: frontmatterData?.timeEstimate,
    purpose,
    filePath: 'BRAIN/',
    version: frontmatterData?.version || '1.0.0',
    prerequisites: frontmatterData?.prerequisites || [],
    worksWellWith: frontmatterData?.worksWellWith || [],
    platformTags: frontmatterData?.platformTags || inferPlatformTags(name),
    stackSpecific: frontmatterData?.stackSpecific || inferStackSpecific(name),
    hasFrontmatter: hasFrontmatterBlock
  };
}

function extractTriggers(content: string): string[] {
  const triggers: string[] = [];
  
  // Pattern 1: "Trigger Command: COMMAND" or "Trigger: COMMAND"
  const triggerPattern = /(?:Trigger|Command):\s*['"]?([A-Z0-9]+)['"]?/gi;
  let match;
  while ((match = triggerPattern.exec(content)) !== null) {
    triggers.push(match[1].toUpperCase());
  }

  // Pattern 2: Known trigger mapping from QUICK_REFERENCE.md
  const knownTriggers: Record<string, string[]> = {
    'MASTER_PROTOCOL': ['MASTER'],
    'code_review_protocol': ['COMPREHENSIVE'],
    'debug_protocol': ['DEEPDIVE'],
    'error_fix_protocol': ['AUTODEBUG'],
    'test_automation_protocol': ['FULLSPEC'],
    'moreFRONTend-PROTOCOL': ['ULTRATHINK'],
    'FRONTandBACKend-PROTOCOL': ['ANTI-GENERIC'],
    'bigpappa_protocol_reviewANDfixes': ['BIGPAPPA'],
    'codebase_indexing_protocol': ['FULLINDEX'],
    'security_audit_protocol': ['SECAUDIT'],
    'accessibility_protocol': ['A11YCHECK'],
    'git_workflow_protocol': ['GITFLOW'],
    'api_design_protocol': ['APIDESIGN'],
    'performance_protocol': ['PERFAUDIT'],
    'mdap_protocol': ['MDAP', 'MILLIONSTEP'],
    'refactor_protocol': ['REFACTOR'],
    'aria_accessibility_protocol': ['FULLARIA'],
    'best_practices_protocol': ['BESTPRACTICES']
  };

  const baseName = content.match(/^#\s+(.+)$/m)?.[1] || '';
  
  // Normalize baseName for matching: lowercase, remove non-alphanumeric except spaces
  const normalizedBaseName = baseName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  
  for (const [key, triggerList] of Object.entries(knownTriggers)) {
    // Normalize key: lowercase, remove protocol suffix, remove non-alphanumeric
    const normalizedKey = key.toLowerCase()
      .replace(/(_protocol|-protocol)$/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    if (normalizedBaseName.includes(normalizedKey)) {
      triggers.push(...triggerList);
    }
  }

  return [...new Set(triggers)];
}

function inferCategory(name: string, content: string): string {
  const categoryMap: Record<string, string> = {
    'code_review': 'Quality',
    'debug': 'Debugging',
    'error_fix': 'Debugging',
    'test': 'Testing',
    'security': 'Security',
    'accessibility': 'Accessibility',
    'performance': 'Performance',
    'git': 'Version Control',
    'api': 'Architecture',
    'frontend': 'Frontend',
    'backend': 'Backend',
    'mdap': 'Core',
    'refactor': 'Refactoring',
    'codebase': 'Architecture',
    'master': 'Core',
    'bigpappa': 'Audit',
    'optimized': 'Configuration'
  };

  const lowerName = name.toLowerCase();
  for (const [key, category] of Object.entries(categoryMap)) {
    if (lowerName.includes(key)) {
      return category;
    }
  }

  return 'General';
}

function extractPurpose(content: string): string {
  // Get first paragraph after title
  const lines = content.split('\n');
  let purposeLines: string[] = [];
  let foundTitle = false;

  for (const line of lines) {
    // Only detect H1 (exactly "# " at start of line)
    if (/^#\s/.test(line) && !foundTitle) {
      foundTitle = true;
      continue;
    }
    
    if (foundTitle && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      purposeLines.push(line.trim());
      if (purposeLines.length >= 2) break;
    }
  }

  return purposeLines.join(' ').substring(0, 200);
}

function extractTags(name: string, title: string): string[] {
  const tags: string[] = [];
  
  // Extract from name
  const nameParts = name.toLowerCase().split(/[-_]/);
  tags.push(...nameParts.filter(p => p.length > 2));
  
  // Extract from title
  const titleWords = title.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3 && !['role', 'system', 'protocol'].includes(w));
  tags.push(...titleWords);
  
  return [...new Set(tags)].slice(0, 10); // Limit to 10 tags
}

function inferPlatformTags(name: string): string[] {
  const lowerName = name.toLowerCase();
  const platforms: string[] = [];
  
  if (lowerName.includes('frontend') || lowerName.includes('front-end')) {
    platforms.push('frontend');
  }
  if (lowerName.includes('backend') || lowerName.includes('back-end')) {
    platforms.push('backend');
  }
  if (lowerName.includes('react') || lowerName.includes('vue') || lowerName.includes('svelte')) {
    platforms.push('frontend');
  }
  if (lowerName.includes('api') || lowerName.includes('design')) {
    platforms.push('backend');
  }
  if (lowerName.includes('git') || lowerName.includes('workflow')) {
    platforms.push('fullstack');
  }
  if (lowerName.includes('security') || lowerName.includes('audit') || lowerName.includes('performance')) {
    platforms.push('fullstack');
  }
  if (lowerName.includes('accessibility') || lowerName.includes('aria')) {
    platforms.push('frontend');
  }
  
  // Default to fullstack if no specific platform detected
  if (platforms.length === 0) {
    platforms.push('fullstack');
  }
  
  return [...new Set(platforms)];
}

function inferStackSpecific(name: string): Record<string, boolean> {
  const stackSpecific: Record<string, boolean> = {};
  const lowerName = name.toLowerCase();
  
  // Most protocols work with all stacks
  stackSpecific['node'] = true;
  stackSpecific['python'] = true;
  stackSpecific['go'] = true;
  stackSpecific['java'] = true;
  stackSpecific['rust'] = true;
  
  // Some are more specific
  if (lowerName.includes('react') || lowerName.includes('frontend')) {
    stackSpecific['node'] = true;
    stackSpecific['javascript'] = true;
    stackSpecific['typescript'] = true;
  }
  
  return stackSpecific;
}
