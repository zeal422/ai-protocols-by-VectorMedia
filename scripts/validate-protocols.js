#!/usr/bin/env node
/**
 * Protocol Validation Script (Cross-platform)
 * Verifies ai-protocols setup
 */
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function checkDirectory(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function getProtocolVersion() {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');
    const match = content.match(/version-(\d+\.\d+\.\d+)/);
    return match ? match[1] : 'unknown';
  } catch {
    return 'unknown';
  }
}

function detectIDE() {
  const detections = [];
  
  if (checkFile('.cursorrules')) detections.push('Cursor');
  if (checkFile('.clinerules')) detections.push('Cline');
  if (checkFile('.roocodes')) detections.push('RooCode');
  if (checkFile('.github/copilot-instructions.md')) detections.push('GitHub Copilot');
  if (checkDirectory('.vscode')) detections.push('VSCode');
  
  return detections;
}

function main() {
  log('\n🔍 ai-protocols Validation\n', 'blue');
  
  let score = 0;
  let total = 0;
  const issues = [];

  // 1. Check core files
  log('📋 Core Files:', 'blue');
  const coreFiles = [
    'README.md',
    'HOW_TO_USE.md',
  ];

  coreFiles.forEach(file => {
    total++;
    if (checkFile(file)) {
      log(`  ✅ ${file}`, 'green');
      score++;
    } else {
      log(`  ❌ ${file}`, 'red');
      issues.push(`Missing core file: ${file}`);
    }
  });

  // 2. Check BRAIN protocols
  log('\n🧠 BRAIN Protocols:', 'blue');
  const protocols = [
    'MASTER_PROTOCOL.md',
    'mdap_protocol.md',
    'code_review_protocol.md',
    'debug_protocol.md',
    'error_fix_protocol.md',
    'test_automation_protocol.md',
    'moreFRONTend-PROTOCOL.md',
    'FRONTandBACKend-PROTOCOL.md',
    'bigpappa_protocol_reviewANDfixes.md',
    'codebase_indexing_protocol.md',
    'security_audit_protocol.md',
    'accessibility_protocol.md',
    'performance_protocol.md',
    'refactor_protocol.md',
    'api_design_protocol.md',
    'git_workflow_protocol.md',
    'OPTIMIZED_LINT_SETUP.md',
    'aria_accessibility_protocol.md',
    'best_practices_protocol.md',
  ];

  let protocolsFound = 0;
  protocols.forEach(protocol => {
    total++;
    const filePath = path.join('BRAIN', protocol);
    if (checkFile(filePath)) {
      score++;
      protocolsFound++;
    } else {
      issues.push(`Missing protocol: ${filePath}`);
    }
  });

  log(`  ${protocolsFound}/${protocols.length} protocols present`, 
      protocolsFound === protocols.length ? 'green' : 'yellow');

  // 3. Check documentation
  log('\n📚 Documentation:', 'blue');
  const docs = [
    'docs/COMMANDS.md',
    'docs/UNIVERSAL_INTEGRATION.md',
    'docs/CHANGELOG.md',
    'docs/FAQ.md',
    'docs/TROUBLESHOOTING.md',
    'docs/SCENARIOS.md',
    'docs/CASE_STUDIES.md',
    'docs/QUICK_START.md',
    'docs/QUICK_REFERENCE.md',
  ];

  docs.forEach(doc => {
    total++;
    if (checkFile(doc)) {
      log(`  ✅ ${doc}`, 'green');
      score++;
    } else {
      log(`  ❌ ${doc}`, 'red');
      issues.push(`Missing doc: ${doc}`);
    }
  });

  // 4. Check examples
  log('\n💡 Examples:', 'blue');
  const examples = [
    'examples/node-express/package.json',
    'examples/react-typescript/package.json',
  ];

  examples.forEach(example => {
    total++;
    if (checkFile(example)) {
      log(`  ✅ ${example}`, 'green');
      score++;
    } else {
      log(`  ❌ ${example}`, 'red');
      issues.push(`Missing example: ${example}`);
    }
  });

  // 5. Check configurations
  log('\n⚙️  Configuration Templates:', 'blue');
  const configs = [
    'configurations/cursor/.cursorrules',
    'configurations/cline/.clinerules',
    'configurations/eslint.config.js',
    'configurations/prettier.config.js',
  ];

  configs.forEach(config => {
    total++;
    if (checkFile(config)) {
      log(`  ✅ ${config}`, 'green');
      score++;
    } else {
      log(`  ❌ ${config}`, 'red');
      issues.push(`Missing config: ${config}`);
    }
  });

  // Detect IDE integration
  log('\n🔧 IDE Integration:', 'blue');
  const detectedIDEs = detectIDE();
  if (detectedIDEs.length > 0) {
    log(`  ✅ Detected: ${detectedIDEs.join(', ')}`, 'green');
  } else {
    log('  ⚠️  No IDE configuration detected', 'yellow');
    issues.push('Consider adding IDE-specific configuration (.cursorrules, .clinerules, etc.)');
  }

  // Version info
  log('\n📌 Version Information:', 'blue');
  const version = getProtocolVersion();
  log(`  Protocol Version: ${version}`, 'blue');

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  const percentage = Math.round((score / total) * 100);
  const status = percentage === 100 ? '✅ EXCELLENT' : 
                 percentage >= 80 ? '✅ GOOD' : 
                 percentage >= 60 ? '⚠️  NEEDS IMPROVEMENT' : '❌ INCOMPLETE';
  
  log(`\nValidation Score: ${score}/${total} (${percentage}%)`, 
      percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');
  log(`Status: ${status}\n`, percentage >= 80 ? 'green' : 'yellow');

  // Recommendations
  if (issues.length > 0) {
    log('💡 Recommendations:', 'yellow');
    issues.forEach(issue => log(`  • ${issue}`, 'yellow'));
    log('');
  }

  // Exit code
  process.exit(percentage >= 80 ? 0 : 1);
}

main();