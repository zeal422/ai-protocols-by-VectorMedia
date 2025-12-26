import { ProtocolMetadata } from '../types/index.js';

/**
 * Extract metadata from protocol markdown file
 * Looks for trigger commands, categories, and descriptions
 */
export function extractMetadata(fileName: string, content: string): ProtocolMetadata {
  // Only remove trailing .md extension
  const name = fileName.replace(/\.md$/, '');
  
  // Extract title (first H1 heading only - starts with # followed by space)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : name;

  // Extract triggers - look for patterns
  const triggers = extractTriggers(content);

  // Extract category from mapping
  const category = inferCategory(name, content);

  // Extract purpose/description (first paragraph after title)
  const purpose = extractPurpose(content);

  return {
    fileName,
    name,
    title,
    triggers,
    category,
    purpose,
    filePath: 'BRAIN/'
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
