#!/usr/bin/env node
/**
 * Interactive CLI for AI Development Protocols Setup
 */
const { prompt } = require('enquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

const PROTOCOL_ROOT = path.join(__dirname, '..');

async function main() {
  console.log(chalk.blue.bold('\n🚀 AI Development Protocols Setup\n'));

  try {
    // Step 1: Framework Selection
    const frameworkAnswer = await prompt({
      type: 'select',
      name: 'framework',
      message: 'What framework are you using?',
      choices: [
        { name: 'node', message: 'Node.js + Express' },
        { name: 'react', message: 'React + TypeScript' },
        { name: 'nextjs', message: 'Next.js' },
        { name: 'python', message: 'Python + FastAPI' },
        { name: 'none', message: 'None / Manual setup' },
      ],
    });

    // Step 2: AI Tool Selection
    const aiToolAnswer = await prompt({
      type: 'multiselect',
      name: 'tools',
      message: 'Which AI assistant(s) do you use?',
      choices: [
        { name: 'cursor', message: 'Cursor' },
        { name: 'cline', message: 'Cline / RooCode' },
        { name: 'copilot', message: 'GitHub Copilot' },
        { name: 'gemini', message: 'Gemini' },
        { name: 'vscode', message: 'VS Code (general)' },
      ],
    });

    // Step 3: Focus Areas
    const focusAnswer = await prompt({
      type: 'multiselect',
      name: 'focus',
      message: 'What do you want to focus on?',
      choices: [
        { name: 'security', message: '🔐 Security auditing' },
        { name: 'testing', message: '🧪 Testing automation' },
        { name: 'performance', message: '⚡ Performance optimization' },
        { name: 'accessibility', message: '♿ Accessibility' },
        { name: 'all', message: '✨ Everything (recommended)' },
      ],
    });

    // Step 4: Copy Core Files
    const spinner = ora('Setting up protocols...').start();

    const targetDir = process.cwd();
    
    // Copy MASTER_PROTOCOL.md
    await fs.copy(
      path.join(PROTOCOL_ROOT, 'MASTER_PROTOCOL.md'),
      path.join(targetDir, 'MASTER_PROTOCOL.md')
    );

    // Copy BRAIN folder
    await fs.copy(
      path.join(PROTOCOL_ROOT, 'BRAIN'),
      path.join(targetDir, 'BRAIN')
    );

    // Copy docs folder
    await fs.copy(
      path.join(PROTOCOL_ROOT, 'docs'),
      path.join(targetDir, 'docs')
    );

    spinner.succeed('Core protocols installed');

    // Step 5: Configure AI Tools
    const configSpinner = ora('Configuring AI tools...').start();

    if (aiToolAnswer.tools.includes('cursor')) {
      await fs.copy(
        path.join(PROTOCOL_ROOT, 'configurations/cursor/.cursorrules'),
        path.join(targetDir, '.cursorrules')
      );
      configSpinner.info('✅ Cursor configured (.cursorrules)');
    }

    if (aiToolAnswer.tools.includes('cline')) {
      await fs.copy(
        path.join(PROTOCOL_ROOT, 'configurations/cline/.clinerules'),
        path.join(targetDir, '.clinerules')
      );
      configSpinner.info('✅ Cline configured (.clinerules)');
    }

    if (aiToolAnswer.tools.includes('copilot')) {
      await fs.ensureDir(path.join(targetDir, '.github'));
      await fs.copy(
        path.join(PROTOCOL_ROOT, 'configurations/copilot/copilot-instructions.md'),
        path.join(targetDir, '.github/copilot-instructions.md')
      );
      configSpinner.info('✅ GitHub Copilot configured');
    }

    if (aiToolAnswer.tools.includes('vscode')) {
      await fs.ensureDir(path.join(targetDir, '.vscode'));
      await fs.copy(
        path.join(PROTOCOL_ROOT, 'configurations/vscode/settings.json'),
        path.join(targetDir, '.vscode/settings.json')
      );
      configSpinner.info('✅ VS Code configured');
    }

    configSpinner.succeed('AI tools configured');

    // Step 6: Copy Example (if selected)
    if (frameworkAnswer.framework !== 'none') {
      const exampleSpinner = ora('Copying example project...').start();

      if (frameworkAnswer.framework === 'node') {
        await fs.copy(
          path.join(PROTOCOL_ROOT, 'examples/node-express'),
          path.join(targetDir, 'example')
        );
        exampleSpinner.succeed('Node.js example copied to ./example/');
      } else if (frameworkAnswer.framework === 'react') {
        await fs.copy(
          path.join(PROTOCOL_ROOT, 'examples/react-typescript'),
          path.join(targetDir, 'example')
        );
        exampleSpinner.succeed('React example copied to ./example/');
      } else {
        exampleSpinner.info('No example available for this framework');
      }
    }

    // Step 7: Copy Configuration Templates
    const templateSpinner = ora('Installing configuration templates...').start();

    await fs.copy(
      path.join(PROTOCOL_ROOT, 'configurations/eslint.config.js'),
      path.join(targetDir, 'eslint.config.js')
    );

    await fs.copy(
      path.join(PROTOCOL_ROOT, 'configurations/prettier.config.js'),
      path.join(targetDir, 'prettier.config.js')
    );

    templateSpinner.succeed('Configuration templates installed');

    // Step 8: Copy Validation Scripts
    await fs.ensureDir(path.join(targetDir, 'scripts'));
    await fs.copy(
      path.join(PROTOCOL_ROOT, 'scripts'),
      path.join(targetDir, 'scripts')
    );

    // Step 9: Validation
    console.log(chalk.blue('\n🔍 Running validation...\n'));

    const { spawn } = require('child_process');
    const validation = spawn('node', [path.join(targetDir, 'scripts/validate-protocols.js')]);

    validation.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    validation.on('close', (code) => {
      if (code === 0) {
        // Success
        console.log(chalk.green.bold('\n✅ Setup Complete!\n'));

        console.log(chalk.blue('📚 Next Steps:\n'));
        console.log('1. Read the Quick Start guide:');
        console.log(chalk.cyan('   cat docs/QUICK_START.md\n'));

        console.log('2. Try your first command:');
        console.log(chalk.cyan('   "Use MASTER_PROTOCOL with COMPREHENSIVE to review my code"\n'));

        if (frameworkAnswer.framework !== 'none') {
          console.log('3. Explore the example project:');
          console.log(chalk.cyan('   cd example'));
          console.log(chalk.cyan('   npm install'));
          console.log(chalk.cyan('   npm test\n'));
        }

        console.log(chalk.blue('📖 Documentation:'));
        console.log(chalk.cyan('   • MASTER_PROTOCOL.md - Main orchestrator'));
        console.log(chalk.cyan('   • docs/COMMANDS.md - All trigger commands'));
        console.log(chalk.cyan('   • docs/QUICK_REFERENCE.md - Cheat sheet'));
        console.log(chalk.cyan('   • docs/TROUBLESHOOTING.md - Common issues\n'));

        console.log(chalk.gray('Happy coding! 🚀\n'));
      } else {
        console.log(chalk.yellow('\n⚠️  Setup completed with warnings.'));
        console.log(chalk.yellow('Run validation again: node scripts/validate-protocols.js\n'));
      }
    });
  } catch (error) {
    console.error(chalk.red('\n❌ Error during setup:'), error.message);
    console.log(chalk.yellow('\nFor help, see: docs/TROUBLESHOOTING.md\n'));
    process.exit(1);
  }
}

main();
