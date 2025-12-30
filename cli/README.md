# ai-protocols CLI

Interactive CLI for setting up ai-protocols in your project.

## Usage

### NPX (Recommended)
```bash
npx @ai-protocols/init
```

### Global Install
```bash
npm install -g @ai-protocols/init
ai-protocols-init
```

### From Source
```bash
cd cli
npm install
node index.js
```

## What It Does

1. **Prompts for Configuration**
   - Framework selection (Node.js, React, Python, Go, Rust, Java, etc.)
   - AI tool selection (Cursor, Cline, Copilot, Gemini, etc.)
   - Focus areas (Security, Testing, Performance, Accessibility, etc.)

2. **Installs Protocols & Workflows** (v2.3.5)
   - Copies MASTER_PROTOCOL.md (main orchestrator)
   - Copies BRAIN/ (19 specialized protocols with YAML metadata)
   - Copies BRAIN/workflows/ (7 guided workflow templates)
   - Copies documentation and SYSTEM_GUIDE.md

3. **Configures AI Tools**
   - Creates `.cursorrules` for Cursor (with all 19 protocols + triggers)
   - Creates `.clinerules` for Cline/RooCode (with all 19 protocols + triggers)
   - Configures Copilot instructions
   - Configures Gemini system instructions
   - Sets up VS Code settings

4. **Enables Intelligent Features** (NEW v2.3.5)
   - MCP server setup for route_task tool (intelligent task routing)
   - Project context detection (auto-detects React, Node, Python, Go, Rust, Java)
   - Context-aware search configuration
   - Workflow templates for structured processes

5. **Copies Examples**
   - Optional project templates (Node.js Express, React TypeScript)
   - Working code demonstrations
   - Test suites with examples

6. **Validates Setup**
   - Runs validation script (36/36 checks)
   - Provides next steps
   - Links to SYSTEM_GUIDE.md and documentation

## Interactive Prompts

### Framework
- Node.js + Express
- React + TypeScript
- Next.js
- Python + FastAPI
- None / Manual setup

### AI Tools (Multiple Selection)
- Cursor
- Cline / RooCode
- GitHub Copilot
- Gemini
- VS Code (general)

### Focus Areas (Multiple Selection)
- 🔐 Security auditing
- 🧪 Testing automation
- ⚡ Performance optimization
- ♿ Accessibility
- ✨ Everything (recommended)

## Output Structure

```
your-project/
├── MASTER_PROTOCOL.md          # Main orchestrator
├── BRAIN/                      # 19 specialized protocols
├── docs/                       # Documentation
├── scripts/                    # Validation scripts
├── .cursorrules               # Cursor config (if selected)
├── .clinerules                # Cline config (if selected)
├── .github/                   # Copilot config (if selected)
├── .vscode/                   # VS Code settings (if selected)
├── eslint.config.js           # ESLint configuration
├── prettier.config.js         # Prettier configuration
└── example/                   # Example project (if selected)
```

## Requirements

- Node.js 14+
- npm or yarn

## Development

```bash
# Install dependencies
npm install

# Test locally
node index.js

# Publish (maintainers only)
npm publish
```

## Troubleshooting

If setup fails:
1. Check Node.js version: `node --version` (need 14+)
2. Ensure write permissions in target directory
3. Try manual setup from docs/QUICK_START.md

## License

MIT
