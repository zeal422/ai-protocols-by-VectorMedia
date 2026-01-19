# AI-Protocols Development Guidelines

**Version:** 2.3.5 | **MCP Server:** 2.3.2 | **Author:** VectorMedia | **License:** MIT

## Project Overview

AI-Protocols is a framework that routes AI assistants to specialized protocols based on task requirements. It provides 19 specialized protocols, 23 MCP tools across 8 modules, and 7 guided workflows for zero-error development.

- **Primary Languages:** TypeScript, JavaScript, Markdown
- **Runtime:** Node.js 18+
- **Key Dependencies:** `@modelcontextprotocol/sdk`, `zod`, `js-yaml`, `vitest`
- **Supported Stacks:** JavaScript/TypeScript, Python, Go, Rust, Java, C#
- **Supported Frameworks:** React, Vue, Svelte, Express, FastAPI, Django, Spring

## Quick Start

```bash
# Build MCP server
cd protocols-mcp && npm install && npm run build

# Run tests
npm test

# Validate protocols
node scripts/validate-protocols.js
```

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `BRAIN/` | 19 specialized protocols (the core intelligence) |
| `BRAIN/workflows/` | 7 guided step-by-step workflows |
| `protocols-mcp/src/` | MCP server implementation (8 modules) |
| `configurations/` | AI tool configs (Cursor, Cline, Claude, Gemini, etc.) |
| `examples/` | Working project templates (Node-Express, React-TypeScript) |
| `docs/` | Documentation, FAQ, troubleshooting |
| `scripts/` | Validation tools |
| `cli/` | Interactive setup CLI |

## Key Files

| File | Purpose |
|------|---------|
| `BRAIN/MASTER_PROTOCOL.md` | Main orchestrator - start here for any task |
| `protocols-mcp/src/index.ts` | MCP server entry point |
| `protocols-mcp/src/tools/protocol-tools.ts` | MCP tool implementations (23 tools) |
| `HOW_TO_USE.md` | Quick reference for triggers and MCP setup |
| `SYSTEM_GUIDE.md` | Detailed architecture documentation |

## Protocol Trigger Commands

Use these prefixes in prompts to activate specific protocols:

| Trigger | Protocol | Use For |
|---------|----------|---------|
| `FULLINDEX` | codebase_indexing | New project exploration, architecture mapping |
| `MDAP` | mdap_protocol | High-stakes refactors, zero-error execution |
| `DEEPDIVE` | debug_protocol | Scientific method debugging |
| `COMPREHENSIVE` | code_review_protocol | Four-pillar code review |
| `FULLSPEC` | test_automation_protocol | 100% test coverage for critical code |
| `AUTODEBUG` | error_fix_protocol | Auto-fix errors with severity classification |
| `SAFEREFACTOR` | refactor_protocol | Safe refactoring with impact analysis |
| `ULTRATHINK` | moreFRONTend-PROTOCOL | Advanced UI/UX and frontend architecture |
| `ANTI-GENERIC` | FRONTandBACKend-PROTOCOL | Full-stack development |
| `APIDESIGN` | api_design_protocol | REST/GraphQL design |
| `PERFAUDIT` | performance_protocol | Performance optimization |
| `SECAUDIT` | security_audit_protocol | OWASP Top 10 + prompt injection checks |
| `A11YCHECK` | accessibility_protocol | WCAG accessibility compliance |
| `FULLARIA` | aria_accessibility_protocol | Advanced ARIA/screen reader optimization |
| `BESTPRACTICES` | best_practices_protocol | Universal health checks |
| `GITFLOW` | git_workflow_protocol | Git workflow standards |
| `BIGPAPPA` | bigpappa_protocol_reviewANDfixes | Comprehensive code audit |

## MCP Server Modules (8)

1. **scanner/** - Protocol scanning and metadata extraction
2. **search/** - Full-text search, indexing, task analysis, workflow building
3. **tools/** - 23 MCP tool implementations
4. **adaptation/** - Workflow engine, error recovery, risk assessment
5. **resilience/** - Checkpoints, parallel execution, multi-agent orchestration
6. **intelligence/** - Dependency resolution, intent refinement, metrics
7. **execution/** - Context management, state management, result normalization
8. **storage/** - File-based persistence for sessions/metrics

## Development Commands

```bash
# MCP Server
cd protocols-mcp
npm run build          # Build TypeScript
npm run dev            # Watch mode
npm test               # Run vitest tests
npm run test:coverage  # Coverage report
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix lint issues
npm run type-check     # TypeScript validation
npm run validate       # Full validation (type-check + lint + test)
npm run inspector      # Debug with MCP Inspector

# Validation
node scripts/validate-protocols.js    # Validate all protocols
```

## Code Conventions

### TypeScript
- Use explicit return types for all functions
- Enable strict mode (`"strict": true`)
- Prefer `interface` for public APIs, `type` for internal
- Use `zod` for runtime validation
- No `any` types - use `unknown` with type guards

### Naming
- Components: `PascalCase` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase` with "use" prefix (e.g., `useAuth.ts`)
- Functions/Utils: `camelCase` (e.g., `formatDate.ts`)
- Constants: `SCREAMING_SNAKE_CASE`
- Protocol files: `descriptive-name-protocol.md`

### Testing
- Test framework: `vitest`
- Co-locate tests with source files (`.test.ts` suffix)
- Target 80%+ coverage for core features, 100% for critical paths
- Include both happy path and edge cases

## Safety Rules

### 🔴 NEVER Auto-Modify (Require Explicit Permission)
- Authentication/authorization logic
- Payment/billing code
- Database migrations
- UI design/styling (unless explicitly requested)
- Architecture changes

### 🟠 Show Diff First
- Business logic changes
- API contract modifications
- Behavioral changes

### 🟢 Safe to Auto-Fix
- Formatting and style issues
- Unused imports
- Semicolon consistency
- Type annotation additions

## Zero-Error Workflow

Follow this 4-phase loop for reliable execution:

1. **Reconnaissance:** Map tech stack with `FULLINDEX`
2. **Strategic Planning:** Draft plan using `MDAP` decomposition
3. **Atomic Execution:** Make small, verifiable changes
4. **Verification:** Run tests and validation scripts

**Red Flag:** If AI outputs >700 tokens without results or circular reasoning, stop, clear context, and re-trigger with `MDAP`.

## MCP Server Integration

Add to your AI client config (Claude Desktop, Cursor, Cline):

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

### Key MCP Tools
- `get_protocol(name)` - Get protocol by name
- `list_protocols(category?)` - Browse all protocols
- `get_protocol_by_trigger(trigger)` - Find by trigger command
- `search_protocols(query, category?)` - Full-text search
- `fuzzy_match_protocol(name)` - Typo-tolerant search
- `route_task(description, taskType?)` - Intelligent task routing

## Adding/Modifying Protocols

1. Create/edit file in `BRAIN/` with format: `descriptive-name-protocol.md`
2. Optional: Add YAML frontmatter for metadata
3. Rebuild MCP server: `cd protocols-mcp && npm run build`
4. Validate: `node scripts/validate-protocols.js`
5. Update `MASTER_PROTOCOL.md` to reference new protocol

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP server not connecting | Check Node.js 18+, rebuild with `npm run build` |
| Protocol not found | Use `fuzzy_match_protocol` or `list_protocols()` |
| Changes not taking effect | Restart AI tool, rebuild MCP server |
| Tests failing | Run `npm install`, check Node version |

## Resources

- **Quick Start:** `docs/QUICK_START.md`
- **Commands Reference:** `docs/COMMANDS.md`
- **FAQ:** `docs/FAQ.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Changelog:** `docs/CHANGELOG.md`
