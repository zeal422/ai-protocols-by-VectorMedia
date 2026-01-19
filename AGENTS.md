# AI-Protocols Development Guidelines

**Project Version:** 2.3.5  
**Last Updated:** 2026-01-07  
**Status:** Official Release (Zero-Error MDAP Suite)

This document provides essential information for developers working on the AI-Protocols project. Refer to this file before starting any task.

> **Quick Start:** See `docs/QUICK_START.md` for 5-minute setup. Use `MASTER_PROTOCOL.md` as your orchestrator for all tasks.

## Table of Contents

1. [Quick Navigation](#quick-navigation)
2. [Getting Started (5 Minutes)](#getting-started-5-minutes)
3. [Project Repository Structure](#project-repository-structure)
4. [Protocol Selection Quick Reference](#protocol-selection-quick-reference)
5. [Best Practices & Conventions](#best-practices--conventions)
6. [Common Development Workflows](#common-development-workflows)
7. [Development Commands](#development-commands)
8. [Working with Protocols](#working-with-protocols)
9. [Developer Checklist](#developer-checklist)
10. [MCP Server Integration](#mcp-server-integration)
11. [Linting & Code Quality](#linting--code-quality)
12. [Zero-Error Workflow](#zero-error-workflow)
13. [AI Tool Integration Tips](#ai-tool-integration-tips)
14. [Project Vision & Roadmap](#project-vision--roadmap)
15. [Safety Rules Summary](#safety-rules-summary)
16. [Getting Help](#getting-help)

---

## Project Overview

**AI-Protocols** is a comprehensive framework that routes AI assistants to specialized protocols based on task requirements. The framework ensures:
- Context-aware protocol selection
- Codebase respect and safety
- Zero-hallucination, evidence-based responses
- Consistent development practices across projects

**Languages Supported:** JavaScript, TypeScript, Python, Go, Rust, Java  
**Frameworks Supported:** React, Vue, Express, FastAPI, Django, Spring

**Author:** VectorMedia  
**License:** MIT

---

## Quick Navigation

| Task | Use This |
|------|----------|
| **Starting a new task** | MASTER_PROTOCOL.md |
| **Need protocol guidance?** | Use MCP tools or `route_task` |
| **AI tool setup** | See `configurations/` directory |
| **Having issues?** | Check `docs/TROUBLESHOOTING.md` |
| **Understanding the system** | See SYSTEM_GUIDE.md |
| **Code examples** | See `examples/` directory |
| **Quick command reference** | See `docs/QUICK_REFERENCE.md` |

---

## Getting Started (5 Minutes)

### 1. Understand the Core Concept
The framework uses **19 specialized protocols** in the `BRAIN/` directory. Each protocol handles a specific task type (debugging, testing, refactoring, security, etc.). Use `MASTER_PROTOCOL.md` to orchestrate which protocol to use.

### 2. Set Up MCP Server (Optional but Recommended)
```bash
cd protocols-mcp
npm install && npm run build
```

Then add to your AI client (Claude Desktop, Cursor, Cline):
```json
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["/path/to/protocols-mcp/build/index.js"]
    }
  }
}
```

### 3. Configure Your AI Tool
- **Cursor**: Copy `.cursorrules` file from `configurations/cursor/`
- **Cline/RooCode**: Copy `.clinerules` file from `configurations/cline/`
- **Claude Desktop**: Use instructions from `configurations/claude/`

### 4. Start Using Protocols
Prefix your task with a trigger command:
```
DEEPDIVE: Why is the login endpoint returning 401 errors?
FULLSPEC: Write comprehensive tests for the UserService class
SECAUDIT: Check the API endpoints for OWASP vulnerabilities
```

---

## Core Technologies & Stack

### Primary Languages
- **TypeScript** - Primary language for protocols-mcp and configuration
- **JavaScript** - Supporting scripts and CLI tools
- **Markdown** - Protocol documentation and system guides

### Key Frameworks & Tools
- **Node.js** - Runtime for MCP server and CLI
- **Model Context Protocol (MCP)** - Framework for integrating protocols as tools
- **Express.js** - Backend example framework
- **React + TypeScript** - Frontend example framework
- **Jest** - Testing framework
- **ESLint & Prettier** - Code quality and formatting

### Example Project Stacks
- **Node-Express:** Express, TypeScript, Jest, Supertest, Zod, Winston, Helmet, JWT
- **React-TypeScript:** React 18, Vite, TypeScript, Vitest, React Testing Library, Zod

---

## Project Repository Structure

### Root Level Files
| File | Purpose |
|------|---------|
| `MASTER_PROTOCOL.md` | **Start here** - Orchestrates all protocol selection and routing |
| `AGENTS.md` | This file - Developer guidelines and best practices |
| `README.md` | Main project documentation and overview |
| `HOW_TO_USE.md` | Quick reference for activating protocols and MCP server |
| `SYSTEM_GUIDE.md` | Detailed system architecture and workflow documentation |
| `IMP_SUMMARY.md` | Gap analysis and improvement roadmap for future development |

### Directory Structure & Key Files

### BRAIN/ Directory (19 Specialized Protocols)
Contains the protocol implementations organized by task type:

**Core Protocols:**
- `MASTER_PROTOCOL.md` - Unified routing and orchestration
- `codebase_indexing_protocol.md` (Trigger: `FULLINDEX`) - Mapping architecture and dependencies
- `mdap_protocol.md` (Trigger: `MDAP`) - High-stakes refactors with zero-error scaling
- `debug_protocol.md` (Trigger: `DEEPDIVE`) - Scientific method debugging

**Development Protocols:**
- `code_review_protocol.md` (Trigger: `COMPREHENSIVE`) - Four-pillar code review
- `test_automation_protocol.md` (Trigger: `FULLSPEC`) - Mission-critical test coverage
- `error_fix_protocol.md` (Trigger: `AUTODEBUG`) - Auto-fixing with severity classification
- `refactor_protocol.md` (Trigger: `SAFEREFACTOR`) - Safe refactoring with impact analysis

**Specialization Protocols:**
- `moreFRONTend-PROTOCOL.md` (Trigger: `ULTRATHINK`) - Advanced UI/UX and frontend architecture
- `FRONTandBACKend-PROTOCOL.md` (Trigger: `ANTI-GENERIC`) - Full-stack development
- `api_design_protocol.md` (Trigger: `APIDESIGN`) - REST/GraphQL design
- `performance_protocol.md` (Trigger: `PERFAUDIT`) - Performance optimization

**Safety & Quality Protocols:**
- `security_audit_protocol.md` (Trigger: `SECAUDIT`) - OWASP Top 10 + prompt injection checks
- `accessibility_protocol.md` (Trigger: `A11YCHECK`) - WCAG accessibility standards
- `aria_accessibility_protocol.md` (Trigger: `FULLARIA`) - Advanced screen reader optimization
- `best_practices_protocol.md` (Trigger: `BESTPRACTICES`) - Universal health checks
- `git_workflow_protocol.md` (Trigger: `GITFLOW`) - Git and version control standards

**Specialized Tools:**
- `bigpappa_protocol_reviewANDfixes.md` (Trigger: `BIGPAPPA`) - Comprehensive code audit
- `OPTIMIZED_LINT_SETUP.md` - Lint configuration best practices

### BRAIN/workflows/ Directory (7 Guided Workflows)
Pre-built step-by-step workflows for common tasks:
- `code-review-workflow.md`
- `debug-workflow.md`
- `feature-workflow.md`
- `performance-workflow.md`
- `refactor-workflow.md`
- `security_audit_workflow.md`
- `accessibility-workflow.md`

### configurations/ Directory
AI Tool Configurations:
- `claude/` - Claude Desktop configuration and system instructions
- `cursor/` - Cursor IDE rules (`.cursorrules`)
- `cline/` - Cline/RooCode rules (`.clinerules`)
- `copilot/` - GitHub Copilot instructions
- `gemini/` - Google Gemini system instructions
- `kilocode/` - Kilocode configuration
- `opencode/` - OpenCode configuration
- `vscode/` - VS Code settings
- `base-config.json` - Base configuration template
- `eslint.config.js` - ESLint configuration
- `prettier.config.js` - Prettier configuration
- `tsconfig.base.json` - Base TypeScript configuration

### examples/ Directory
Working project templates:
- `node-express/` - Node.js + Express + TypeScript backend example
- `react-typescript/` - React + TypeScript + Vite frontend example

Both include:
- Complete test suites (unit, integration, e2e where applicable)
- ESLint and Prettier configuration
- CI/CD workflows (GitHub Actions)
- Security best practices (auth, rate limiting, validation)

### protocols-mcp/ Directory
MCP Server Implementation:
- `src/index.ts` - Main MCP server entry point
- `src/scanner/` - Protocol scanning and metadata extraction
- `src/search/` - Protocol searching, indexing, and matching
- `src/types/` - TypeScript type definitions and MCP SDK types
- `src/utils/` - Utilities for path resolution and project context detection
- `build/index.js` - Compiled executable

### cli/ Directory
Interactive setup CLI:
- `index.js` - Main CLI entry point
- `init.js` - Initialization logic
- Prompts for framework, AI tools, and focus areas
- Auto-configures AI tool rules and protocols

### docs/ Directory
Comprehensive Documentation:
- `QUICK_START.md` - Get started in 5 minutes
- `QUICK_REFERENCE.md` - Quick command reference
- `COMMANDS.md` - All trigger commands explained
- `FAQ.md` - Frequently asked questions
- `SCENARIOS.md` - Real-world scenario walkthroughs
- `CASE_STUDIES.md` - Implementation examples
- `TROUBLESHOOTING.md` - Common issues and solutions
- `CHANGELOG.md` - Version history
- `UNIVERSAL_INTEGRATION.md` - Integration with multiple AI tools

### scripts/ Directory
Validation and setup tools:
- `validate-protocols.js` - Node.js validation script
- `validate-protocols.sh` - Bash validation script
- `validate-protocols.ps1` - PowerShell validation script

---

## Protocol Selection Quick Reference

Use these trigger commands to activate specific protocols:

| Trigger | Protocol | Best For |
|---------|----------|----------|
| `FULLINDEX` | codebase_indexing | New project exploration, architecture mapping |
| `MDAP` | mdap_protocol | High-stakes refactors, zero-error execution |
| `DEEPDIVE` | debug_protocol | Complex debugging with multi-layer investigation |
| `COMPREHENSIVE` | code_review_protocol | Thorough code review with Four Pillars analysis |
| `FULLSPEC` | test_automation_protocol | 100% test coverage for mission-critical code |
| `AUTODEBUG` | error_fix_protocol | Auto-fixing errors with severity classification |
| `SAFEREFACTOR` | refactor_protocol | Safe refactoring with impact analysis |
| `ULTRATHINK` | moreFRONTend-PROTOCOL | Advanced UI/UX design and frontend architecture |
| `ANTI-GENERIC` | FRONTandBACKend-PROTOCOL | Full-stack development patterns |
| `APIDESIGN` | api_design_protocol | REST/GraphQL design and validation |
| `PERFAUDIT` | performance_protocol | Performance optimization and profiling |
| `SECAUDIT` | security_audit_protocol | Security auditing (OWASP Top 10) |
| `A11YCHECK` | accessibility_protocol | WCAG accessibility compliance |
| `FULLARIA` | aria_accessibility_protocol | Advanced ARIA and screen reader optimization |
| `BESTPRACTICES` | best_practices_protocol | General health checks and stack detection |
| `GITFLOW` | git_workflow_protocol | Git workflow and version control |
| `BIGPAPPA` | bigpappa_protocol_reviewANDfixes | Comprehensive code audit and fixes |

---

## Best Practices & Conventions

### Universal Development Rules

**Codebase Respect:**
- Never modify UI/design/styling unless explicitly requested
- Never change architecture without permission
- Always analyze existing patterns first, then follow them
- Always preserve naming conventions, file structures, and code style

**Evidence-Based Development:**
- No speculation - verify by reading actual code
- Always check for existing implementations before creating new ones
- Always look for config files (package.json, tsconfig.json, etc.)
- Check library versions and available features

**Zero Hallucination Policy:**
- If uncertain, say "I need to check [specific file/pattern]"
- Never invent APIs, functions, or patterns that don't exist
- Always base suggestions on actual codebase patterns
- Confirm before making significant changes

### Severity Classification for Changes

- 🟢 **SAFE** (auto-fix always): Formatting, unused imports, semicolons, type annotations
- 🟡 **LOW-RISK** (confirm first): Simple refactors, straightforward improvements
- 🟠 **MODERATE** (show diff): Logic changes, API modifications, behavioral changes
- 🔴 **HIGH-RISK** (never auto): Database migrations, authentication, payments, critical business logic

### Naming Conventions

**TypeScript/JavaScript:**
- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useAuth.ts`)
- Utilities/Functions: camelCase (e.g., `formatDate.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Files: Match export name or kebab-case for utilities

**Project Files:**
- Protocol files: `descriptive-name-protocol.md`
- Configuration: `*.config.js` or `.*.json`
- Workflow files: `workflow-name-workflow.md`

### TypeScript & Type Safety

- Always use explicit return types for functions
- Use strict mode: `"strict": true` in tsconfig.json
- Prefer `interface` for public APIs, `type` for internal types
- Use `Zod` for runtime validation of external data
- Document complex types with JSDoc comments

### Testing Standards

**Coverage Requirements:**
- Business-critical code: 100% coverage
- Core features: 80%+ coverage
- Utilities: 70%+ coverage
- UI components: 75%+ coverage (interaction tests)

**Test Quality:**
- Clear, descriptive test names
- Obvious inputs and expected outputs
- Specific assertions (not generic)
- Helpful error messages
- Test both happy path and edge cases

### Security Best Practices

- Never commit secrets or API keys
- Use `.env.example` files to document required variables
- Validate all user input with Zod or similar
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Hash passwords with bcrypt
- Use JWT with appropriate expiration
- Add CORS, Helmet headers for defense

### Accessibility (WCAG 2.1 Level AA)

- Use semantic HTML elements
- Provide alt text for images
- Ensure color contrast ratios (4.5:1 for text)
- Support keyboard navigation (Tab, Enter, Escape)
- Use ARIA labels where necessary
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Run accessibility audits with axe-core

### Frontend Best Practices

- Detect existing UI library (Shadcn, Radix, MUI) - always use it
- Follow component patterns from existing codebase
- Use React hooks for state management
- Memoize expensive computations with `useMemo`
- Optimize renders with `React.memo` when appropriate
- Use `useCallback` for event handlers in lists
- Consider performance: lazy load, code split
- Use TypeScript strict mode for components

### Backend Best Practices

- Separate concerns: routes, middleware, services, models
- Use dependency injection for testability
- Implement proper error handling and logging
- Validate request data before processing
- Use connection pooling for databases
- Cache frequently accessed data
- Implement graceful shutdown handling
- Document API endpoints with examples

---

## MCP Server Integration

The MCP server (v2.3.2) exposes all 19 protocols and 7 workflows as dynamic MCP tools. It provides intelligent task routing and protocol discovery with full project context awareness.

### Architecture Overview

**Main Entry Point:** `protocols-mcp/src/index.ts`
- Initializes MCP Server with stdio transport
- Detects project context automatically
- Builds full-text search index on startup
- Registers 6 protocol tools

**Key Components:**

1. **ProtocolScanner** (`scanner/protocol-scanner.ts`)
   - Scans `BRAIN/` directory for all `.md` files
   - Implements caching for performance (one-time scan per session)
   - Methods: `scanProtocols()`, `getProtocol(name)`, `getProtocolByTrigger(trigger)`
   - Path validation for security (prevents directory traversal)

2. **MetadataExtractor** (`scanner/metadata-extractor.ts`)
   - Extracts metadata from protocol markdown files
   - Supports YAML front-matter (optional) with fallback to inferred metadata
   - Extracts: title (H1), triggers, category, purpose, tags, difficulty, prerequisites
   - Known trigger mappings for all 19 protocols (e.g., `debug_protocol` → `DEEPDIVE`)
   - Infers platform tags (frontend/backend/fullstack) and stack-specific support

3. **ContentIndexer** (`search/indexer.ts`)
   - Builds searchable index from protocol metadata and content
   - Creates three index maps:
     - `protocols`: Maps protocol name → {metadata, content, tokens}
     - `triggerMap`: Maps trigger → list of protocol names
     - `categoryMap`: Maps category → list of protocol names
   - Tokenizes content for full-text search
   - Prevents duplicate entries in reverse indexes

4. **SearchMatcher** (`search/matcher.ts`)
   - Full-text search with scoring algorithm
   - Fuzzy matching using Levenshtein distance (similarity > 0.3)
   - Context-aware result reranking based on ProjectContext
   - Scoring weights: Title (10) > Trigger (8) > Purpose (5) > Content (≤10)
   - Excerpt extraction for preview

5. **TaskAnalyzer** (`search/task-analyzer.ts`)
   - Analyzes user task description and infers intent type
   - Task types: `debug`, `build`, `refactor`, `audit`, `optimize`, `test`, `setup`, `unknown`
   - Returns difficulty and time estimates
   - Maps task type to relevant tags

6. **WorkflowBuilder** (`search/workflow-builder.ts`)
   - Builds protocol workflows for each task type
   - Hardcoded task-to-protocols mapping (can be static or context-optimized)
   - Generates workflow steps with: order, protocolName, trigger, reason, optional flag, prerequisite
   - Provides shortcuts for quick vs. comprehensive workflows
   - Pre-defined prerequisites (e.g., `MDAP` requires `FULLINDEX`)

7. **ProjectContextDetector** (`utils/project-context-detector.ts`)
   - Auto-detects tech stack by scanning for config files
   - **Detects:**
     - Language: JavaScript/TypeScript, Python, Go, Rust, Java, C#
     - Frameworks: React, Vue, Svelte, Express, FastAPI, Django, Spring
     - Project Type: Frontend, Backend, Fullstack, DevOps, Library
     - Test Framework: Jest, Vitest, Pytest, Go test
     - Package Manager: npm, yarn, pnpm, pip, cargo, maven
     - Docker and CI/CD presence (GitHub Actions, GitLab CI, CircleCI, Jenkins)
   - Returns `ProjectContext` object with all metadata and `detected: boolean` flag

8. **PathResolver** (`utils/path-resolver.ts`)
   - Resolves protocols root path portably
   - Priority: `PROTOCOLS_PATH` env var > package location > dev location
   - Works for both installed packages and development mode

### Setup (30 seconds)

1. **Build the MCP server:**
   ```bash
   cd protocols-mcp
   npm install && npm run build
   ```

2. **Connect to your AI client:**
   
   For **Claude Desktop**, add to `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "ai-protocols": {
         "command": "node",
         "args": ["/path/to/protocols-mcp/build/index.js"]
       }
     }
   }
   ```

   For **Cursor**, add to `settings.json`:
   ```json
   {
     "mcpServers": {
       "ai-protocols": {
         "command": "node",
         "args": ["/path/to/protocols-mcp/build/index.js"]
       }
     }
   }
   ```

   For **Cline**, configure in VS Code MCP settings similarly.

### MCP Tools Available (6 tools)

1. **`get_protocol(name: string)`**
   - Retrieves full protocol content by exact name or filename
   - Returns: Protocol title, triggers, category, and full markdown content
   - Example: `get_protocol('debug_protocol')` or `get_protocol('MASTER_PROTOCOL.md')`
   - Error handling: Returns available protocols list if not found

2. **`list_protocols(category?: string)`**
   - Lists all available protocols with metadata
   - Filters by category if provided (Quality, Debugging, Security, Frontend, etc.)
   - Returns JSON array of: {name, title, triggers, category, purpose}
   - Use for browsing when unsure which protocol to use

3. **`get_protocol_by_trigger(trigger: string)`**
   - Finds protocol by trigger command (e.g., DEEPDIVE, FULLINDEX, SECAUDIT)
   - Case-insensitive matching
   - Returns full protocol content like `get_protocol`
   - Error handling: Lists available triggers if not found

4. **`search_protocols(query: string, category?: string)`**
   - Full-text search across all protocols
   - Natural language keywords (e.g., "error handling", "ui design", "unit tests")
   - Applies project context for relevance scoring (if detected)
   - Returns scored results with excerpts and context relevance tags
   - Results marked: ✓ (high), ~ (medium), or no mark (low relevance)

5. **`fuzzy_match_protocol(name: string)`**
   - Typo-tolerant protocol search
   - Uses Levenshtein distance algorithm
   - Returns top 5 matches with similarity scores
   - Fallback when exact name or trigger doesn't work

6. **`route_task(description: string, taskType?: string)`**
   - **Intelligent task routing** - THE KEY TOOL FOR WORKFLOW GENERATION
   - Analyzes task description to infer intent (debug, build, refactor, etc.)
   - Allows manual override of task type
   - Returns formatted workflow with:
     - Task difficulty (beginner/intermediate/advanced)
     - Estimated time to complete
     - Project context info (if detected)
     - Numbered protocol steps with triggers and reasoning
     - Quick shortcuts for different approaches
   - Example: `route_task('Fix this authentication bug')` → suggests DEEPDIVE protocol

### How the System Works (Data Flow)

```
User Request
    ↓
MCP Tool Call (one of 6 tools)
    ↓
Protocol Scanner: Scan BRAIN/ → ProtocolMetadata[]
    ↓
Metadata Extractor: Parse frontmatter/infer metadata → ExtendedProtocolMetadata
    ↓
Content Indexer: Build search index from metadata + file content
    ↓
Search Matcher: Score/rank results using query + optional ProjectContext
    ↓
Result Formatting & Return to User
```

### Current Limitations (Gap Analysis from IMP_SUMMARY.md)

The MCP server is **well-structured but static**:

**Missing Features:**
- ❌ No cross-protocol state sharing (each protocol independent, no session)
- ❌ No adaptive workflows (hardcoded task→protocols mapping, no branching on findings)
- ❌ No protocol interdependency enforcement (prerequisites declared but not validated)
- ❌ No real-time feedback loops (no learning from success/failure)
- ❌ No long-running task checkpoints (no resume capability)
- ❌ No result standardization (each protocol returns different format)
- ❌ No autonomous error recovery (single protocol failure = task failure)
- ❌ No safety-aware escalation (high-risk changes not auto-escalated)

**Why It Matters:** Today, you must manually run each protocol. The system can't automatically adapt if findings suggest different protocols, share computation between protocols, or recover from errors intelligently.

---

## Using the MCP Server in Practice

### Example Workflows

**Scenario 1: Finding a Protocol for a Specific Task**
```
User: "I need to debug a performance issue"
→ Call route_task("I need to debug a performance issue")
→ System infers: Task type = 'optimize'
→ Returns workflow: FULLINDEX → PERFAUDIT → Test → Review
→ User runs: get_protocol_by_trigger('PERFAUDIT')
→ Gets full performance audit protocol
```

**Scenario 2: Searching for Something Vague**
```
User: "How do I ensure my component is accessible?"
→ Call search_protocols("accessibility component")
→ System detects: React project (from package.json)
→ Boosts relevance of aria_accessibility_protocol and accessibility_protocol
→ Returns ranked results with context tags: ✓ Matches your tech stack
```

**Scenario 3: Using a Known Trigger**
```
User: "Use COMPREHENSIVE to review this code"
→ Call get_protocol_by_trigger('COMPREHENSIVE')
→ Returns: code_review_protocol with full content
→ User can immediately apply Four Pillars framework
```

**Scenario 4: Discovering Available Options**
```
User: "What protocols exist for security?"
→ Call list_protocols('Security')
→ Returns all security-related protocols with purposes
→ User can browse and decide which is appropriate
```

### Integration with Project Context

When you connect the MCP server to a project:

1. **Auto-detection on startup:**
   ```bash
   $ cd my-react-project
   $ # Server starts and detects:
   # ✓ Language: typescript
   # ✓ Framework: react
   # ✓ Project Type: frontend
   # ✓ Test Framework: jest
   # ✓ Has Docker: yes
   # ✓ Has CI/CD: yes
   ```

2. **Context-aware search results:**
   - All searches prioritize frontend protocols for React projects
   - Python-specific guidance suppressed (not relevant)
   - Accessibility protocols boosted (critical for frontend)
   - Search results tagged with relevance: "✓ Matches your tech stack"

3. **Task routing personalized:**
   - `route_task("build a form")` suggests React component patterns
   - Workflow recommendations consider your existing tech stack
   - Time estimates adjusted based on framework expertise signals

### Metadata System (YAML Front-Matter)

Protocols can include optional YAML front-matter for richer metadata:

```yaml
---
id: debug_protocol
version: 2.3.5
triggers: [DEEPDIVE]
category: Debugging
tags: [troubleshooting, root-cause, scientific-method]
difficulty: intermediate
timeEstimate: "30-60m"
prerequisites: [codebase_indexing_protocol]
worksWellWith: [test_automation_protocol, code_review_protocol]
platformTags: [fullstack]
stackSpecific:
  node: true
  python: true
  go: true
---

# Protocol Content Here...
```

**Note:** This is optional. Protocols without frontmatter still work—metadata is inferred from content.

### Type System

All data structures are strongly typed with Zod validation:

```typescript
// Protocol metadata
interface ExtendedProtocolMetadata {
  id: string;                    // Unique identifier
  fileName: string;              // e.g., "debug_protocol.md"
  name: string;                  // e.g., "debug_protocol"
  title: string;                 // e.g., "Debug Protocol: Scientific Method"
  triggers: string[];            // e.g., ["DEEPDIVE"]
  category: Category;            // Enum: Debugging, Testing, Security, etc.
  tags: string[];               // Searchable tags
  difficulty: Difficulty;        // beginner | intermediate | advanced
  timeEstimate?: string;        // e.g., "30-60m"
  purpose: string;              // First paragraph of protocol
  version: string;              // Semantic version
  prerequisites: string[];      // Required protocols to run first
  worksWellWith: string[];      // Complementary protocols
  platformTags: string[];       // frontend | backend | fullstack
  stackSpecific: Record<string, boolean>;  // Language/framework specific
  hasFrontmatter: boolean;      // Whether frontmatter was provided
}

// Project context
interface ProjectContext {
  language: Language;              // javascript | typescript | python | go | rust | java | csharp | unknown
  framework: Framework;            // react | vue | svelte | express | fastapi | django | spring | none | unknown
  projectType: ProjectType;        // frontend | backend | fullstack | devops | library | unknown
  testFramework: TestFramework;    // jest | vitest | pytest | go-test | unknown
  packageManager: PackageManager;  // npm | yarn | pnpm | pip | cargo | maven | unknown
  hasDocker: boolean;
  hasCI: boolean;
  hasGit: boolean;
  dependencies: string[];         // npm/python dependencies
  devDependencies: string[];      // dev-only dependencies
  detected: boolean;              // Whether context was auto-detected
}

// Search result
interface SearchResult {
  protocol: string;               // Protocol name
  score: number;                 // Relevance score
  matches: string[];             // Matching lines from content
  excerpt: string;               // Context snippet
  contextRelevance?: 'high' | 'medium' | 'low';  // Based on ProjectContext
}

// Workflow for task
interface WorkflowStep {
  order: number;                 // Step sequence
  protocolName: string;          // e.g., "debug_protocol"
  trigger: string;               // e.g., "DEEPDIVE"
  reason: string;                // Why this step
  optional: boolean;             // Only first step is mandatory
  prerequisite?: string;         // Protocol that must run first
}
```

---

## CLI Setup Tool

Use the interactive CLI to set up protocols in a new or existing project:

### Usage

```bash
# Via npx (recommended)
npx @ai-protocols/init

# Global install
npm install -g @ai-protocols/init
ai-protocols-init

# From source
cd cli
npm install
node index.js
```

### What It Does

1. **Prompts for Configuration**
   - Framework selection (Node.js, React, Python, Go, etc.)
   - AI tool selection (Cursor, Cline, Copilot, Gemini, VS Code)
   - Focus areas (Security, Testing, Performance, Accessibility)

2. **Installs Protocols**
   - Copies MASTER_PROTOCOL.md
   - Copies BRAIN/ directory (19 protocols)
   - Copies BRAIN/workflows/ (7 workflows)
   - Copies documentation

3. **Configures AI Tools**
   - Creates `.cursorrules` for Cursor
   - Creates `.clinerules` for Cline/RooCode
   - Configures Copilot, Gemini, VS Code

4. **Enables MCP Server**
   - Sets up protocol discovery
   - Enables route_task tool
   - Configures project context detection

5. **Copies Examples (optional)**
   - Node.js + Express template
   - React + TypeScript template
   - Working test suites

6. **Validates Setup**
   - Runs 36-point validation
   - Provides next steps

---

## Common Development Workflows

### 🐛 Debugging a Bug

**When to use:** Something is broken, errors are occurring, behavior is unexpected

**Steps:**
1. Trigger: `DEEPDIVE` to use the Scientific Method debugging protocol
2. Gather information: logs, error messages, reproduction steps
3. Form hypotheses about root cause (rank by likelihood)
4. Test each hypothesis systematically
5. Isolate the problem to smallest possible scope
6. Verify the fix works and doesn't break related functionality

**Example:**
```
DEEPDIVE: Users report getting 401 errors after login redirect. 
The JWT token appears to be set but not sent in subsequent requests.
```

### ✅ Writing Tests

**When to use:** Need comprehensive test coverage, ensuring code reliability

**Steps:**
1. Trigger: `FULLSPEC` to use test automation protocol
2. Determine coverage targets (100% for critical paths, 80%+ for core features)
3. Write tests following existing codebase patterns
4. Test both happy path and edge cases
5. Ensure tests are clear and maintainable
6. Achieve target coverage and verify tests pass

**Example:**
```
FULLSPEC: Write comprehensive tests for the UserService class.
Ensure all authentication flows are covered, including error cases.
Target: 100% coverage for auth paths, 80%+ overall.
```

### 🔍 Code Review

**When to use:** Evaluating code quality, catching issues before merge

**Steps:**
1. Trigger: `COMPREHENSIVE` to use Four Pillars code review
2. Evaluate: **Correctness** (does it work?), **Readability** (is it clear?), **Performance** (is it efficient?), **Maintainability** (will it age well?)
3. Check for anti-patterns, security issues, performance problems
4. Provide structured feedback with specific examples
5. Suggest improvements with rationale

**Example:**
```
COMPREHENSIVE: Review src/components/Dashboard.tsx for production readiness.
Check for performance issues, accessibility compliance, and best practices.
```

### ♻️ Refactoring Code

**When to use:** Improving code quality, architectural changes, technical debt

**Steps:**

**For standard refactors:**
1. Trigger: `SAFEREFACTOR` to use safe refactoring protocol
2. Map affected code areas and dependencies
3. Plan changes with impact analysis
4. Execute in small, verifiable steps
5. Run all tests to verify no regressions

**For high-stakes refactors:**
1. Trigger: `MDAP` for zero-error multi-step approach
2. Map entire codebase and dependencies (`FULLINDEX`)
3. Create detailed implementation plan with MDAP decomposition
4. Execute changes in atomic steps with verification
5. Comprehensive testing and code review

**Example:**
```
SAFEREFACTOR: Consolidate duplicate utility functions in src/utils/
into a shared library. Map dependencies first, then refactor with tests.
```

### 🏗️ Building New Features

**When to use:** Implementing new functionality, adding features

**Steps:**
1. Use `ANTI-GENERIC` (full-stack) or `ULTRATHINK` (frontend design)
2. Analyze existing patterns and conventions
3. Design API/components following established patterns
4. Implement with test coverage
5. Get code review before merge
6. Document any new patterns or APIs

**Example:**
```
ANTI-GENERIC: Design and implement a new payment processing feature.
Follow existing service patterns. Include API design, database schema, 
tests, and security considerations.
```

### 🔒 Security Review

**When to use:** Auditing for vulnerabilities, security hardening

**Steps:**
1. Trigger: `SECAUDIT` to use security audit protocol
2. Check OWASP Top 10 categories relevant to your code
3. Review authentication and authorization
4. Check for injection vulnerabilities, data exposure, etc.
5. Verify secrets are not hardcoded
6. Check dependency security

**Example:**
```
SECAUDIT: Review the API endpoints in src/routes/ for security vulnerabilities.
Check for authentication bypass, injection attacks, and data exposure issues.
```

### ♿ Accessibility Check

**When to use:** Ensuring UI is accessible to all users

**Steps:**

**For general accessibility:**
1. Trigger: `A11YCHECK` for WCAG compliance
2. Verify semantic HTML elements
3. Check color contrast ratios (4.5:1 minimum)
4. Ensure keyboard navigation works
5. Test with screen readers

**For advanced ARIA optimization:**
1. Trigger: `FULLARIA` for screen reader optimization
2. Optimize ARIA labels and live regions
3. Ensure proper heading hierarchy
4. Test with NVDA, JAWS, or VoiceOver

**Example:**
```
A11YCHECK: Review src/components/SearchBar.tsx for accessibility compliance.
Ensure keyboard navigation, color contrast, and screen reader support.
```

### ⚡ Performance Optimization

**When to use:** Application is slow, need to optimize

**Steps:**
1. Trigger: `PERFAUDIT` to use performance audit protocol
2. Profile the application (identify bottlenecks)
3. Analyze database queries, render performance, bundle size
4. Implement optimizations (caching, lazy loading, code splitting)
5. Measure improvement with before/after metrics

**Example:**
```
PERFAUDIT: The Dashboard page loads in 8 seconds. Profile and optimize.
Check React render performance, API response times, and bundle size.
```

### 🔄 Starting a New Task (General)

1. **Understand the request** - What is being asked?
2. **Select a protocol** - Use MASTER_PROTOCOL.md or MCP `route_task` tool
3. **Analyze codebase** - Read relevant files, understand patterns
4. **Plan approach** - Draft implementation strategy
5. **Execute atomically** - Make small, verifiable changes
6. **Verify** - Test, validate, get feedback

---

## Linting & Code Quality

The protocols-mcp codebase uses a comprehensive ESLint configuration with TypeScript support to ensure code quality, type safety, and security.

### ESLint Configuration

**Location:** `configurations/eslint.config.js`

**Features:**
- ✅ Type-aware linting (requires TypeScript compilation)
- ✅ Strict type safety rules
- ✅ Async/await safety (MCP critical)
- ✅ Security best practices
- ✅ Code quality standards
- ✅ Automatic code fixing

### Linting Commands

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Type checking only
npm run type-check

# Complete validation (type-check + lint + tests)
npm run validate
```

### Rule Categories

1. **Type Safety (CRITICAL)** - 7 rules
   - No `any` type usage
   - Strict null/undefined checks
   - Boolean expression strictness

2. **Explicit Returns (REQUIRED)** - 3 rules
   - All functions must declare return types
   - All code paths must return
   - Module boundaries must be typed

3. **Async/Await (MCP CRITICAL)** - 4 rules
   - No floating promises
   - Proper async handling
   - Promise type safety

4. **Code Quality** - 8 rules
   - Unused variables detection
   - Prefer const over let
   - Nullish coalescing

5. **Naming Conventions** - camelCase/PascalCase/UPPER_CASE

6. **Security** - No eval, no dynamic functions

7. **Code Style** - Semicolons, single quotes, 2-space indent

8. **Comments** - TODO/FIXME detection

### Common Linting Errors & Fixes

**Error: "no-explicit-any"**
```typescript
// ❌ Bad
const data: any = {};

// ✅ Good
interface Data { [key: string]: unknown; }
const data: Data = {};
```

**Error: "no-floating-promises"**
```typescript
// ❌ Bad
scanner.scanProtocols();

// ✅ Good
await scanner.scanProtocols();
```

**Error: "explicit-function-return-type"**
```typescript
// ❌ Bad
async function getData() {
  return await fetch('/api');
}

// ✅ Good
async function getData(): Promise<Response> {
  return await fetch('/api');
}
```

**Error: "no-unused-vars"**
```typescript
// ❌ Bad
const unused = getValue();

// ✅ Good
const _unused = getValue(); // Mark as intentional
```

### VS Code Integration

1. Install ESLint extension by Microsoft
2. Auto-fix on save is configured in `.vscode/settings.json`
3. ESLint will automatically fix issues when you save a file

### CI/CD Integration

Add to `.github/workflows/lint.yml`:

```yaml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate
```

### Documentation

- **Full Reference:** `protocols-mcp/LINTING.md`
- **Implementation Guide:** `protocols-mcp/LINTING_IMPLEMENTATION.md`

### Performance Notes

- **First lint run:** 5-10 seconds (TypeScript compilation)
- **Subsequent runs:** 1-2 seconds (cached)
- **Auto-fix:** 2-3 seconds
- **Type-check only:** 3-5 seconds

---

## Development Commands

### MCP Server Development
```bash
# Build the MCP server
cd protocols-mcp
npm install && npm run build

# Watch mode for development
npm run dev

# Run MCP server tests
npm test

# Test individual test files
npm run test:watch

# Debug with MCP Inspector (interactive testing)
npm run inspector

# Type checking
npm run type-check

# ESLint validation
npm run lint
npm run lint:fix

# Complete validation
npm run validate
```

### CLI Setup Tool
```bash
# From source
cd cli
npm install
node index.js       # Run interactive setup

# Via npx (if published)
npx @ai-protocols/init
```

### Validation & Testing
```bash
# Validate all protocols exist and are properly formatted
node scripts/validate-protocols.js    # Node.js
bash scripts/validate-protocols.sh    # Bash
powershell scripts/validate-protocols.ps1  # PowerShell
```

### Example Projects
```bash
# Node.js + Express Backend
cd examples/node-express
npm install
npm run dev         # Start development server on port 3001
npm test            # Run test suite
npm run lint        # Check code quality

# React + TypeScript Frontend
cd examples/react-typescript
npm install
npm run dev         # Start Vite dev server on port 5173
npm test            # Run test suite with Vitest
npm run lint        # Check code quality
```

### Useful Development Commands

**Check Node.js version:**
```bash
node --version      # Should be 14+ (ideally 18+)
```

**Rebuild after protocol changes:**
```bash
cd protocols-mcp && npm run build
```

**Clear build artifacts:**
```bash
cd protocols-mcp && rm -rf build && npm run build
```

**Test protocol scanning:**
```bash
cd protocols-mcp && npm run test -- protocol-scanner
```

---

## Troubleshooting Common Issues

### MCP Server Not Connecting
- Verify Node.js version is 14+ (check with `node --version`)
- Rebuild: `cd protocols-mcp && npm run build`
- Check file permissions on build/index.js
- Use `npm run inspector` to debug protocol loading

### Protocol Not Found
- Use `fuzzy_match_protocol` for typo-tolerant search
- Check protocol names in `BRAIN/` directory
- Use `list_protocols()` to browse available protocols

### Changes Not Taking Effect
- Stop the AI tool and restart to reload protocols
- Clear MCP server cache if applicable
- Verify file paths in configuration
- Check that protocols-mcp has been rebuilt after changes

### Tests Failing
- Ensure dependencies are installed: `npm install`
- Check Node.js version compatibility
- Review test output for specific error messages
- Use `npm run test:watch` for iterative debugging

---

## Zero-Error Workflow

The framework emphasizes a 4-phase loop for zero-error execution:

1. **Reconnaissance**: Map tech stack and dependencies using `FULLINDEX`
2. **Strategic Planning**: Draft implementation plan using `MDAP` decomposition
3. **Atomic Execution**: Make tiny, verifiable edits with proof of correctness
4. **Verification**: Run validation scripts and tests to prove success

If an AI starts circular reasoning or outputs >700 tokens without results, it's in a correlated failure state. **Action:** Stop, clear context, and re-trigger using `MDAP`.

---

## AI Tool Integration Tips

### Cursor IDE
- Use `.cursorrules` file in project root (copy from `configurations/cursor/`)
- Prefix prompts with trigger commands: `DEEPDIVE:`, `FULLSPEC:`, `SECAUDIT:`
- Set `autoApply: false` in Cursor settings to review changes before applying
- Use `@` references to include file context in prompts

### Cline / RooCode
- Use `.clinerules` file in project root (copy from `configurations/cline/`)
- Cline can apply changes to files directly, so be explicit about what to modify
- Ask Cline to follow specific protocols by name
- Chain multiple protocols by asking for sequential steps

### Claude Desktop / Claude.ai
- Add MCP server to `claude_desktop_config.json`
- Use custom instructions from `configurations/claude/`
- Reference protocols by name: "Use debug_protocol to investigate..."
- Ask Claude to use `route_task` MCP tool for workflow guidance

### GitHub Copilot
- Use instructions from `configurations/copilot/`
- Inline comments referencing protocols help guide code suggestions
- Less powerful than dedicated tools but good for quick coding help

### Google Gemini
- Use system instructions from `configurations/gemini/`
- Paste protocol content directly when you need specific guidance
- Good for brainstorming and design discussions

### General Tips for All Tools
- **Be specific**: "Debug using DEEPDIVE protocol" is better than "Fix this bug"
- **Include context**: Paste relevant code or error messages
- **Use examples**: Show what you expect as output
- **Reference patterns**: "Follow the pattern used in src/utils/"
- **Ask for verification**: "Verify this works by showing test output"

---

## Project Vision & Roadmap

### Current State (v2.3.5)
✅ 19 well-designed protocols  
✅ MCP server with 6 tools  
✅ Project context detection  
✅ Task routing and workflow generation  
✅ Comprehensive documentation  

### Future Improvements (See IMP_SUMMARY.md)
- Adaptive workflows based on findings
- Cross-protocol state sharing
- Real-time feedback loops
- Autonomous error recovery
- Long-running task checkpoints
- Protocol versioning and compatibility
- Multi-language specialization
- Collaborative multi-agent orchestration

For detailed analysis of gaps and roadmap, see `IMP_SUMMARY.md`.

---

## Additional Resources

- **Quick Start:** See `docs/QUICK_START.md` for 5-minute setup
- **Full Documentation:** See `docs/` directory
- **System Architecture:** See `SYSTEM_GUIDE.md`
- **Project Overview:** See `PROJECT_OVERVIEW.md`
- **Setup Guide:** See `HOW_TO_USE.md`
- **Example Projects:** See `examples/` directory

---

## Safety Rules Summary

### NEVER Without Permission
- 🔴 Modify authentication logic
- 🔴 Change payment/billing code
- 🔴 Perform database migrations
- 🔴 Modify UI design or styling
- 🔴 Change architecture without discussion

### ALWAYS Verify First
- Read actual code before suggesting changes
- Check existing implementations
- Verify library versions and APIs
- Analyze impact on related code
- Test changes thoroughly

### SAFE To Auto-Fix
- 🟢 Formatting and style issues
- 🟢 Unused imports
- 🟢 Semicolon consistency
- 🟢 Type annotation additions

---

## Working with Protocols

### How to Use a Protocol

1. **Choose the right protocol** - Match your task to the appropriate protocol using the table above
2. **Read the protocol** - Open the `.md` file in `BRAIN/` directory
3. **Follow the steps** - Protocols are structured with numbered steps and examples
4. **Apply the framework** - Each protocol has specific guidance for your task type

### Modifying Protocols

**When to modify:**
- Adding new guidance based on team experience
- Updating for new versions of frameworks
- Adding language-specific examples
- Improving clarity or organization

**How to modify safely:**
1. Make changes directly to the `.md` files in `BRAIN/`
2. Rebuild the MCP server: `cd protocols-mcp && npm run build`
3. Test with MCP Inspector: `npm run inspector`
4. Validate all protocols: `node scripts/validate-protocols.js`

### Creating New Protocols

**When you need a new protocol:**
- Task type not covered by existing protocols
- Specialized workflow for your team's patterns
- Language or framework-specific guidance

**Steps:**
1. Create new file in `BRAIN/` with name: `descriptive-name-protocol.md`
2. Include YAML frontmatter (optional but recommended):
```yaml
---
id: your-protocol-id
version: 1.0.0
triggers: [YOUR_TRIGGER]
category: Your Category
difficulty: intermediate
timeEstimate: "1-2 hours"
---
```
3. Structure with clear sections and numbered steps
4. Add examples and verification steps
5. Update `MASTER_PROTOCOL.md` to reference the new protocol
6. Rebuild MCP server and validate

---

## Developer Checklist

### Before Starting Work

- [ ] Read MASTER_PROTOCOL.md for task guidance
- [ ] Identify which protocol to use
- [ ] Check existing code patterns and conventions
- [ ] Review relevant documentation in `docs/`
- [ ] Ensure Node.js version is 18+ (`node --version`)

### During Development

- [ ] Follow protocol steps systematically
- [ ] Write tests as you go (don't leave for the end)
- [ ] Use TypeScript with strict mode enabled
- [ ] Run linting regularly: `npm run lint:fix`
- [ ] Commit frequently with descriptive messages
- [ ] Test edge cases, not just happy path

### Before Committing

- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Type checking passes: `npm run type-check`
- [ ] Code follows project conventions
- [ ] Changes are documented (comments, tests explain why)
- [ ] No debugging code left behind (console.log, etc.)

### For Protocol Updates

- [ ] Changes follow existing structure
- [ ] Metadata (title, triggers) are accurate
- [ ] Examples are tested and relevant
- [ ] No hardcoded paths or environment variables
- [ ] Validated with `scripts/validate-protocols.js`
- [ ] MCP server rebuilt: `npm run build`

---

## Getting Help

1. Check `docs/TROUBLESHOOTING.md` for common issues
2. Review relevant protocol in `BRAIN/` directory
3. Check `docs/FAQ.md` for frequent questions
4. Review example projects in `examples/` directory
5. Run validation with `scripts/validate-protocols.js`
6. Use MCP Inspector to debug: `npm run inspector`

---

## Complete Codebase Implementation Reference

This section documents EVERY file in protocols-mcp with complete implementation details.

### File Structure

```
protocols-mcp/
├── src/
│   ├── index.ts                    # MCP Server entry point
│   ├── scanner/
│   │   ├── protocol-scanner.ts     # Scans BRAIN/ directory
│   │   └── metadata-extractor.ts   # Extracts protocol metadata
│   ├── search/
│   │   ├── indexer.ts              # Builds search index
│   │   ├── matcher.ts              # Full-text search & fuzzy matching
│   │   ├── task-analyzer.ts        # Analyzes task intent
│   │   └── workflow-builder.ts     # Builds protocol workflows
│   ├── tools/
│   │   └── protocol-tools.ts       # MCP tool implementations
│   ├── types/
│   │   ├── index.ts                # Core type exports
│   │   ├── protocol-frontmatter.ts # Protocol metadata schema
│   │   └── mcp-sdk.d.ts           # MCP SDK type declarations
│   ├── utils/
│   │   ├── error-handler.ts        # Error handling
│   │   ├── path-resolver.ts        # Path resolution
│   │   └── project-context-detector.ts  # Tech stack detection
│   ├── prompts/                    # Reserved for future custom prompts
│   └── resources/                  # Reserved for future code examples
├── build/
│   └── index.js                    # Compiled MCP server executable
├── package.json
└── tsconfig.json
```

### 1. Core Entry Point: `src/index.ts`

**Purpose:** Initializes and runs the MCP server

**Flow:**
1. Define SERVER_INFO (name: "ai-protocols", version: "2.3.2")
2. Create MCP Server instance with stdio transport
3. Resolve protocols root path (env var → package location → dev location)
4. Detect project context (auto-detects tech stack)
5. Create ProtocolScanner, ContentIndexer, SearchMatcher
6. Scan all protocols from BRAIN/ directory
7. Read file content for each protocol (with security validation)
8. Build search index from metadata + content
9. Register 6 MCP tools via registerProtocolTools()
10. Start server on stdio transport

**Security:** Path validation prevents directory traversal attacks

**Error Handling:** Logs warnings for unreadable protocols, continues gracefully

### 2. Scanner: `src/scanner/protocol-scanner.ts`

**Class:** ProtocolScanner

**Constructor:**
- Takes `protocolsRootPath` as parameter
- Constructs `brainPath = join(protocolsRootPath, 'BRAIN')`
- Validates BRAIN directory exists and is accessible

**Methods:**

1. **scanProtocols()** → Promise<ProtocolMetadata[]>
   - Reads all `.md` files from BRAIN/ directory
   - For each file, calls `extractMetadata(filename, content)`
   - Caches result in `this.cache` (one-time scan per session)
   - Returns array of ProtocolMetadata

2. **getProtocol(name)** → Promise<ProtocolMetadata | null>
   - Normalizes name (removes `.md` suffix)
   - Searches protocols for match by: fileName, name, or normalized name
   - Returns protocol metadata or null

3. **getProtocolByTrigger(trigger)** → Promise<ProtocolMetadata | null>
   - Normalizes trigger to uppercase
   - Searches for protocol with matching trigger
   - Returns protocol metadata or null

4. **clearCache()** → void
   - Used for testing, clears cached protocols

### 3. Metadata Extraction: `src/scanner/metadata-extractor.ts`

**Function:** extractMetadata(fileName: string, content: string) → ExtendedProtocolMetadata

**Process:**

1. **Extract Title:**
   - Regex: `/^#\s+(.+)$/m` (first H1 heading only)
   - Fallback to filename if no title found

2. **Extract YAML Front-Matter (Optional):**
   - Regex: `/^---\r?\n([\s\S]*?)\r?\n---/` (supports Unix LF and Windows CRLF)
   - Parsed with js-yaml library
   - Validated with Zod schema ProtocolFrontmatterSchema

3. **Extract Triggers:**
   - Pattern 1: Regex pattern matching "Trigger: COMMAND" in content
   - Pattern 2: Known trigger mapping (hardcoded for all 19 protocols)
   - Example: `debug_protocol` → [`DEEPDIVE`]
   - Deduped and collected into array

4. **Infer Category:**
   - If frontmatter provided, use that
   - Otherwise, infer from filename keywords
   - Example: "debug" → "Debugging", "security" → "Security"

5. **Extract Purpose:**
   - Get first paragraph after title (max 2 lines, 200 characters)
   - Used for search preview

6. **Extract/Infer Other Fields:**
   - tags: From name and title keywords
   - difficulty: Frontmatter or default "intermediate"
   - timeEstimate: Frontmatter optional
   - prerequisites: Frontmatter or empty array
   - worksWellWith: Frontmatter or empty array
   - platformTags: Inferred from name (frontend/backend/fullstack)
   - stackSpecific: Inferred (all stacks by default)
   - version: Frontmatter or "1.0.0"
   - filePath: Always "BRAIN/"
   - hasFrontmatter: Boolean flag

**Known Trigger Mappings:**
```
MASTER_PROTOCOL → MASTER
code_review_protocol → COMPREHENSIVE
debug_protocol → DEEPDIVE
error_fix_protocol → AUTODEBUG
test_automation_protocol → FULLSPEC
codebase_indexing_protocol → FULLINDEX
mdap_protocol → MDAP, MILLIONSTEP
refactor_protocol → REFACTOR
security_audit_protocol → SECAUDIT
accessibility_protocol → A11YCHECK
aria_accessibility_protocol → FULLARIA
api_design_protocol → APIDESIGN
performance_protocol → PERFAUDIT
best_practices_protocol → BESTPRACTICES
bigpappa_protocol_reviewANDfixes → BIGPAPPA
git_workflow_protocol → GITFLOW
moreFRONTend-PROTOCOL → ULTRATHINK
FRONTandBACKend-PROTOCOL → ANTI-GENERIC
```

### 4. Search Indexing: `src/search/indexer.ts`

**Class:** ContentIndexer

**Interface SearchIndex:**
```typescript
{
  protocols: Map<string, SearchableProtocol>;
  triggerMap: Map<string, string[]>;
  categoryMap: Map<string, string[]>;
}
```

**Interface SearchableProtocol:**
```typescript
{
  metadata: ProtocolMetadata;
  content: string;
  tokens: string[];
}
```

**Method: buildIndex(protocols, contentMap)**

1. Create empty SearchIndex
2. For each protocol:
   - Get content from contentMap (keyed by `{filePath}/{fileName}`)
   - Tokenize content (lowercase, remove special chars, split by whitespace, filter tokens < 3 chars)
   - Store in `protocols` Map with protocol.name as key
   - Add trigger entries to `triggerMap` (one trigger → many protocols possible)
   - Add category entry to `categoryMap`
   - Prevent duplicates in reverse indexes
3. Return built index

**Tokenization:** Splits content into searchable tokens, filters out short tokens (< 3 chars)

### 5. Search Matching: `src/search/matcher.ts`

**Class:** SearchMatcher

**Method: search(index, query, options?)**

1. Parse query into tokens (split by whitespace, filter empty)
2. For each protocol in index:
   - Filter by category if specified
   - Calculate score using calculateScore()
   - Find matches in content
   - Extract excerpt around matches
   - Only include if score > minScore
3. Sort results by score descending
4. Return array of SearchResult

**Scoring Algorithm:**
- Title match: +10 points
- Trigger match: +8 points
- Purpose match: +5 points
- Content token match: +1 per token (max 10 per query token)
- Total = sum of all matches for all query tokens

**Method: fuzzyMatch(index, name)**

1. For each protocol:
   - Calculate Levenshtein similarity between input and protocol name
   - Keep if similarity > 0.3
2. Sort by similarity descending
3. Return top matches

**Levenshtein Distance:** Measures edit distance between strings (insertions, deletions, substitutions)

**Method: contextualizeResults(results, context)**

1. For each result:
   - Calculate contextBonus based on ProjectContext
   - Language match: +5 bonus + "high" relevance
   - Framework match: +5 bonus + "high" relevance
   - Platform type match: +3 bonus + "medium" relevance
   - Update score with bonus
2. Re-sort by new score
3. Return reranked results

### 6. Task Analysis: `src/search/task-analyzer.ts`

**Task Types:**
```
debug, build, refactor, audit, optimize, test, setup, document, unknown
```

**Function: analyzeTaskIntent(description)**

1. Create scoring object for each task type
2. For each task type's keywords:
   - Check if keyword appears in description (case-insensitive)
   - Increment score for that task type
3. Return task type with highest score (ties break to first match)

**Keywords per Task Type:**
```
debug: bug, fix, error, broken, crash, fail, issue, problem, debug, deepdive, trace, investigate
build: build, create, new, feature, implement, develop, add, make, write component, design, architecture
refactor: refactor, restructure, reorganize, rewrite, clean, cleanup, improve, modernize, upgrade, deprecate
audit: audit, review, check, inspect, analyze, examine, assess, evaluate, scan, verify
optimize: optimize, performance, slow, fast, speed, efficient, bottleneck, profile, bench, scale
test: test, coverage, suite, spec, unit test, integration test, e2e, mock, stub
setup: setup, configure, init, initialize, install, provision, scaffold, template
document: document, doc, readme, comment, example, guide, tutorial, jsdoc
```

**Function: getTaskDifficulty(taskType)**
- Returns: beginner | intermediate | advanced
- Example: setup → beginner, refactor → advanced

**Function: getTaskTimeEstimate(taskType)**
- Returns human-readable estimate
- Example: debug → "30-60m", build → "2-4 hours"

**Function: getTaskTags(taskType)**
- Returns searchable tags per task type
- Example: debug → [troubleshooting, error-analysis, root-cause, reproduction]

### 7. Workflow Building: `src/search/workflow-builder.ts`

**Interface WorkflowStep:**
```typescript
{
  order: number;              // 1, 2, 3, ...
  protocolName: string;       // e.g., "debug_protocol"
  trigger: string;            // e.g., "DEEPDIVE"
  reason: string;             // Why this step
  optional: boolean;          // First step mandatory, rest optional
  prerequisite?: string;      // Protocol that must run first
}
```

**Task-to-Protocols Mapping (Hardcoded):**
```
debug: [debug_protocol, error_fix_protocol, test_automation_protocol, code_review_protocol]
build: [codebase_indexing_protocol, best_practices_protocol, test_automation_protocol, code_review_protocol]
refactor: [codebase_indexing_protocol, mdap_protocol, refactor_protocol, test_automation_protocol, code_review_protocol]
audit: [bigpappa_protocol_reviewANDfixes, security_audit_protocol, code_review_protocol, performance_protocol]
optimize: [codebase_indexing_protocol, performance_protocol, test_automation_protocol, code_review_protocol]
test: [test_automation_protocol, code_review_protocol]
setup: [best_practices_protocol, git_workflow_protocol]
document: [best_practices_protocol, code_review_protocol]
unknown: [MASTER_PROTOCOL]
```

**Prerequisites (Hardcoded):**
```
mdap_protocol: requires codebase_indexing_protocol
performance_protocol: requires codebase_indexing_protocol
test_automation_protocol: requires codebase_indexing_protocol
bigpappa_protocol_reviewANDfixes: requires codebase_indexing_protocol
```

**Function: buildWorkflow(taskType, context?)**
1. Get protocol list for task type
2. Convert to WorkflowStep array with order, trigger, reason
3. Mark all steps except first as optional
4. Add prerequisite if exists
5. Optionally reorder based on ProjectContext (not implemented yet)
6. Return steps

**Function: getWorkflowShortcuts(taskType)**
- Returns preset shortcut workflows
- Example: debug → "Quick fix" (only error_fix_protocol) or "Full investigation" (all protocols)

**Function: formatWorkflow(steps, taskType)**
- Returns markdown-formatted workflow for display

### 8. MCP Tools: `src/tools/protocol-tools.ts`

**Tool Definitions (TOOLS array):**
- Array of 6 tool definitions with name, description, inputSchema

**Function: registerProtocolTools(server, scanner, indexer, matcher, protocolsRoot, projectContext?)**

Sets up two request handlers on MCP server:

1. **ListToolsRequestSchema Handler:**
   - Returns: { tools: TOOLS }

2. **CallToolRequestSchema Handler:**
   - Parses tool name and arguments
   - Routes to appropriate handler
   - Catches and formats errors

**Tool Handlers:**

**1. get_protocol**
- Validates: name (string)
- Gets protocol from scanner
- Validates path (prevents directory traversal)
- Reads file content
- Returns: markdown with title, triggers, category, content

**2. list_protocols**
- Validates: category (optional string)
- Gets all protocols from scanner
- Filters by category if provided
- Returns: JSON array of {name, title, triggers, category, purpose}

**3. get_protocol_by_trigger**
- Validates: trigger (string)
- Gets protocol from scanner by trigger
- Validates path
- Reads file content
- Returns: markdown with title, trigger, content

**4. search_protocols**
- Validates: query (string), category (optional)
- Gets search index from indexer
- Calls matcher.search(index, query, {category})
- Applies context if ProjectContext detected
- Formats results with relevance tags (✓ high, ~ medium, no mark = low)
- Returns: markdown with ranked results and excerpts

**5. fuzzy_match_protocol**
- Validates: name (string)
- Gets search index
- Calls matcher.fuzzyMatch(index, name)
- Returns top 5 matches with similarity scores as JSON

**6. route_task**
- Validates: description (string), taskType (optional override)
- Calls analyzeTaskIntent(description)
- Optionally overrides with provided taskType
- Gets difficulty, timeEstimate from task analyzer
- Builds workflow via buildWorkflow()
- Formats response with:
  - Task description and type
  - Difficulty and estimated time
  - Project context if detected
  - Workflow steps with triggers
  - Shortcuts for different approaches
- Returns: markdown formatted workflow

**Error Handling:**
- Try-catch wraps each tool handler
- ProtocolError instances return formatted error response
- Zod validation errors return validation message
- Other errors are re-thrown

### 9. Project Context Detection: `src/utils/project-context-detector.ts`

**Interface ProjectContext:**
```typescript
{
  language: Language;           // javascript | typescript | python | go | rust | java | csharp | unknown
  framework: Framework;         // react | vue | svelte | express | fastapi | django | spring | none | unknown
  projectType: ProjectType;     // frontend | backend | fullstack | devops | library | unknown
  testFramework: TestFramework; // jest | vitest | pytest | go-test | unknown
  packageManager: PackageManager; // npm | yarn | pnpm | pip | cargo | maven | unknown
  hasDocker: boolean;
  hasCI: boolean;
  hasGit: boolean;
  dependencies: string[];
  devDependencies: string[];
  detected: boolean;
}
```

**Function: detectProjectContext(rootPath)**

Scans files in order, stops at first match:

1. **package.json (Node.js/JavaScript)**
   - If detected: language = typescript (if devDeps.typescript) else javascript
   - Framework: react, vue, svelte, express (frontend/backend based)
   - Test: jest, vitest
   - Package manager: npm, yarn (check lock files), pnpm
   - Stores dependencies and devDependencies

2. **pyproject.toml (Python)**
   - If detected: language = python
   - Framework: django, fastapi (based on content)
   - Test: pytest (based on content)
   - Package manager: pip
   - Project type: backend

3. **requirements.txt (Python)**
   - If detected: language = python, package manager = pip

4. **go.mod (Go)**
   - If detected: language = go, test = go-test, type = backend

5. **Cargo.toml (Rust)**
   - If detected: language = rust, package manager = cargo, type = backend

6. **pom.xml (Java/Maven)**
   - If detected: language = java, package manager = maven, type = backend

7. **Dockerfile**
   - If detected: hasDocker = true

8. **CI/CD Detection**
   - Checks: `.github/workflows`, `.gitlab-ci.yml`, `.circleci`, `Jenkinsfile`
   - Sets: hasCI = true

9. **Git**
   - Checks: `.git` directory
   - Sets: hasGit = true

**Function: describeContext(context)**
- Returns human-readable description of detected context

**Function: getRelevantTags(context)**
- Returns searchable tags based on context
- Example: React → [frontend, ui-ux, accessibility, react, component]

### 10. Path Resolution: `src/utils/path-resolver.ts`

**Function: resolveProtocolsRoot()**

Resolution priority:
1. PROTOCOLS_PATH environment variable (if set)
2. Package location: go up from build/utils/ to find BRAIN
3. Dev location: check parent directory for BRAIN
4. Throw error if not found

Handles both installed packages and development mode

### 11. Error Handling: `src/utils/error-handler.ts`

**Class ProtocolError extends Error:**
```typescript
{
  message: string;
  code: string;          // Error code for categorization
  details?: any;         // Additional context
}
```

**Function: handleError(error, context)**
- If already ProtocolError: return as-is
- If Error: wrap in ProtocolError with context
- Otherwise: create ProtocolError with "Unknown error"

**Function: createErrorResponse(error)**
- Returns MCP error response format
- Format: `Error [${code}]: ${message}`
- Sets isError = true

### 12. Type System: `src/types/`

**protocol-frontmatter.ts:**
- Zod schema for YAML frontmatter validation
- Enums: Difficulty (beginner, intermediate, advanced)
- Enums: Category (Debugging, Testing, Architecture, Frontend, etc.)
- Interfaces: ProtocolFrontmatter, ExtendedProtocolMetadata
- Validation functions: validateFrontmatter(), hasFrontmatter()

**index.ts:**
- Re-exports all types
- ProtocolMetadata, IDEConfig, ExampleProject, ValidationResult, ValidationMessage

**mcp-sdk.d.ts:**
- Type declarations for @modelcontextprotocol/sdk
- Module declarations for proper TypeScript resolution

### Data Flow: Complete End-to-End

**Example: User calls route_task("Fix this bug")**

1. User calls MCP tool: `route_task(description="Fix this bug")`
2. Server receives CallToolRequestSchema
3. Protocol-tools.ts handler processes:
   - Validates input with Zod
   - Calls analyzeTaskIntent("Fix this bug")
   - TaskAnalyzer scores "debug" highest (matches keywords: fix, bug)
   - Returns taskType = "debug"
4. Gets difficulty = "intermediate", timeEstimate = "30-60m"
5. Calls buildWorkflow("debug", projectContext)
   - WorkflowBuilder returns: [
       {order: 1, protocolName: "debug_protocol", trigger: "DEEPDIVE", reason: "Use scientific method...", optional: false},
       {order: 2, protocolName: "error_fix_protocol", trigger: "AUTODEBUG", reason: "Quick fix...", optional: true},
       ...
     ]
6. Formats response as markdown
7. Returns to user with workflow steps and shortcuts
8. User calls get_protocol_by_trigger("DEEPDIVE")
9. Scanner finds protocol with DEEPDIVE trigger
10. Reads file and returns full protocol content

**Search Example: User searches "error handling"**

1. User calls `search_protocols(query="error handling")`
2. Gets search index from indexer
3. Calls matcher.search(index, "error handling", {})
4. Tokenizes query: ["error", "handling"]
5. For each protocol:
   - Scores title, trigger, purpose, content for token matches
   - Calculates total score
6. If ProjectContext detected (e.g., React):
   - Reranks results
   - Boosts error_fix_protocol (frontend-relevant)
   - Tags results with contextRelevance
7. Returns sorted results with excerpts

---

This completes the 101% comprehensive codebase documentation. Any LLM reading this should now fully understand every component, every function, every data structure, and every data flow in the protocols-mcp system.
