# How to Use the AI Protocols MCP Server

The AI Protocols MCP Server exposes your development protocols as tools that AI assistants (Claude, Cursor, etc.) can use to provide consistent, high-quality responses.

## What is an MCP Server?

MCP (Model Context Protocol) is a standardized way for AI assistants to interact with external tools and resources. Your protocols MCP server makes all 17 development protocols available as tools that any MCP-compatible AI can call.

## Features

- **5 Protocol Tools**: get_protocol, list_protocols, get_protocol_by_trigger, search_protocols, fuzzy_match_protocol
- **Dynamic Discovery**: Automatically discovers all protocols in the BRAIN/ directory
- **Smart Search**: Full-text search with relevance scoring and fuzzy matching
- **Trigger Mapping**: Automatically maps trigger commands to protocols
- **Production Ready**: TypeScript strict mode, comprehensive error handling, path traversal prevention

## Quick Start

### 1. Build the Server

```bash
cd protocols-mcp
npm install
npm run build
```

### 2. Test with Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

This opens an interactive console where you can test all available tools.

---

## Available Tools

### `get_protocol`

Retrieve a specific protocol by name.

**Parameters:**
```json
{
  "name": "debug_protocol"
}
```

**Example:**
```
User: "Show me the debugging protocol"
AI calls: get_protocol({ name: "debug_protocol" })
```

**Available protocol names:**
- `MASTER_PROTOCOL`
- `code_review_protocol`
- `debug_protocol`
- `error_fix_protocol`
- `test_automation_protocol`
- `moreFRONTend-PROTOCOL`
- `FRONTandBACKend-PROTOCOL`
- `bigpappa_protocol_reviewANDfixes`
- `codebase_indexing_protocol`
- `OPTIMIZED_LINT_SETUP`
- `security_audit_protocol`
- `accessibility_protocol`
- `git_workflow_protocol`
- `api_design_protocol`
- `performance_protocol`
- `mdap_protocol`
- `refactor_protocol`

---

### `list_protocols`

List all available protocols with their metadata.

**Parameters:**
```json
{
  "category": "Debugging"  // Optional filter
}
```

**Categories:** Quality, Debugging, Testing, Security, Accessibility, Performance, Version Control, Architecture, Frontend, Backend, Core, Refactoring, Configuration, Audit

**Example:**
```
User: "What protocols are available for debugging?"
AI calls: list_protocols({ category: "Debugging" })
```

---

### `get_protocol_by_trigger`

Find a protocol by its trigger command.

**Parameters:**
```json
{
  "trigger": "DEEPDIVE"
}
```

**Available triggers:**
| Trigger | Protocol |
|---------|----------|
| `MASTER` | MASTER_PROTOCOL |
| `DEEPDIVE` | debug_protocol |
| `COMPREHENSIVE` | code_review_protocol |
| `SECAUDIT` | security_audit_protocol |
| `A11YCHECK` | accessibility_protocol |
| `GITFLOW` | git_workflow_protocol |
| `APIDESIGN` | api_design_protocol |
| `PERFAUDIT` | performance_protocol |
| `FULLINDEX` | codebase_indexing_protocol |
| `REFACTOR` | refactor_protocol |
| `ULTRATHINK` | moreFRONTend-PROTOCOL |
| `BIGPAPPA` | bigpappa_protocol_reviewANDfixes |
| `MDAP` | mdap_protocol |

**Example:**
```
User: "I need a deep system analysis"
AI calls: get_protocol_by_trigger({ trigger: "DEEPDIVE" })
```

---

### `search_protocols`

Search protocols by keywords with relevance scoring.

**Parameters:**
```json
{
  "query": "error handling",
  "category": "Backend"  // Optional
}
```

**Example:**
```
User: "How should I handle API errors?"
AI calls: search_protocols({ query: "error handling API" })
```

Returns ranked results with relevance scores and excerpts.

---

### `fuzzy_match_protocol`

Find a protocol by approximate name (handles typos).

**Parameters:**
```json
{
  "name": "debg"
}
```

**Example:**
```
User: "I need the debg protocol"
AI calls: fuzzy_match_protocol({ name: "debg" })
```

Returns similar protocol names with similarity scores.

---

## AI Assistant Integration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["C:/CODING/---PROTOCOLS---by-VM/protocols-mcp/build/index.js"],
      "env": {}
    }
  }
}
```

### Cursor

Add to your `.cursorrules` or Cursor settings:

```json
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["C:/CODING/---PROTOCOLS---by-VM/protocols-mcp/build/index.js"]
    }
  }
}
```

### Cline (VSCode)

Add to `.clinerules`:

```json
{
  "mcp": {
    "servers": {
      "ai-protocols": {
        "command": "node",
        "args": ["C:/CODING/---PROTOCOLS---by-VM/protocols-mcp/build/index.js"]
      }
    }
  }
}
```

### KiloCode

Add to your KiloCode configuration:

```json
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["C:/CODING/---PROTOCOLS---by-VM/protocols-mcp/build/index.js"]
    }
  }
}
```

---

## Usage Examples

### Example 1: Debugging a Bug

**User:** "There's a bug in my authentication flow - users can't log in"

**AI Workflow:**
1. Calls `get_protocol_by_trigger({ trigger: "DEEPDIVE" })` → Gets debug_protocol
2. Uses the debug protocol's Scientific Method approach
3. Asks clarifying questions about reproduction steps
4. Proposes hypotheses and experiments

### Example 2: Code Review Request

**User:** "Can you review this PR?"

**AI Workflow:**
1. Calls `list_protocols({ category: "Quality" })` → Lists quality protocols
2. Calls `get_protocol({ name: "code_review_protocol" })` → Gets full protocol
3. Applies the Four Pillars (Correctness, Readability, Performance, Maintainability)
4. Provides structured feedback

### Example 3: Frontend Development

**User:** "Create a new React component for user profile"

**AI Workflow:**
1. Calls `get_protocol({ name: "moreFRONTend-PROTOCOL" })` → Gets frontend protocol
2. Checks for existing UI library (Shadcn, Radix, etc.)
3. Follows existing component patterns
4. Ensures accessibility compliance

### Example 4: Security Audit

**User:** "Audit this codebase for security vulnerabilities"

**AI Workflow:**
1. Calls `get_protocol_by_trigger({ trigger: "SECAUDIT" })` → Gets security protocol
2. Applies OWASP Top 10 checklist
3. Scans for secret detection
4. Reviews auth/authorization logic
5. Generates audit report with CVSS scores

---

## Protocol Categories

| Category | Protocols |
|----------|-----------|
| **Core** | MASTER_PROTOCOL, mdap_protocol |
| **Quality** | code_review_protocol, test_automation_protocol |
| **Debugging** | debug_protocol, error_fix_protocol |
| **Frontend** | moreFRONTend-PROTOCOL |
| **Backend** | FRONTandBACKend-PROTOCOL |
| **Architecture** | api_design_protocol, codebase_indexing_protocol, bigpappa_protocol_reviewANDfixes |
| **Security** | security_audit_protocol |
| **Accessibility** | accessibility_protocol |
| **Performance** | performance_protocol |
| **Version Control** | git_workflow_protocol |
| **Refactoring** | refactor_protocol |
| **Configuration** | OPTIMIZED_LINT_SETUP |
| **Audit** | bigpappa_protocol_reviewANDfixes |

---

## Troubleshooting

### "Protocol not found"

Make sure the protocol name matches exactly (case-insensitive). Use `list_protocols` to see all available protocols.

### "No results for search"

Try different keywords or use `list_protocols` to browse by category.

### Server won't start

1. Ensure Node.js 18+ is installed
2. Run `npm install` in the `protocols-mcp` directory
3. Run `npm run build` to compile TypeScript
4. Check that the protocols path is correct

---

## Updating Protocols

The MCP server automatically discovers protocols in the `BRAIN/` directory. To add a new protocol:

1. Create a new `.md` file in `BRAIN/`
2. Add a title with `#` heading
3. Add triggers to the `knownTriggers` mapping in [`src/scanner/metadata-extractor.ts`](protocols-mcp/src/scanner/metadata-extractor.ts)
4. Rebuild: `npm run build`

The new protocol will automatically appear in `list_protocols` and be searchable.

---

## File Structure

```
protocols-mcp/
├── src/
│   ├── index.ts              # Main entry point
│   ├── scanner/              # Protocol discovery
│   │   ├── protocol-scanner.ts
│   │   └── metadata-extractor.ts
│   ├── search/               # Search functionality
│   │   ├── indexer.ts
│   │   └── matcher.ts
│   ├── tools/                # MCP tools
│   │   └── protocol-tools.ts
│   └── utils/                # Utilities
│       ├── path-resolver.ts
│       └── error-handler.ts
├── build/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

---

## Changelog

### Latest Updates (All Fixes Implemented)

#### Priority 1: Critical Security & Stability
- Added `.catch()` handler to `main()` for unhandled promise rejections
- Path traversal prevention: All file operations now validate paths using `path.resolve()` and `path.relative()` to ensure paths stay within `protocolsRoot`
- Async I/O: Replaced all `fs.readFileSync` with `await fs.readFile()` for non-blocking operations

#### Priority 2: Error Handling
- Added try-catch around file reading in index loop with warning logs
- BRAIN directory validation in `ProtocolScanner` constructor
- Null safety in `tokenize()`: `const safeContent = content ?? ''`
- Guard against undefined category: `protocol.category ?? 'uncategorized'`
- Validate triggers array before iteration with `Array.isArray()`

#### Priority 3: TypeScript Improvements
- Enabled strict mode in `tsconfig.json` with all strict flags
- Renamed `ValidationError` → `ValidationMessage` in `src/types/index.ts`
- Added `@ts-ignore` with comments for SDK type mismatches

#### Priority 4: Code Quality
- Fixed H1 detection: `line.startsWith('#')` → `/^#\s/.test(line)` for proper markdown parsing
- Fixed `.md` suffix: `fileName.replace('.md', '')` → `fileName.replace(/\.md$/, '')` using regex
- Normalized trigger matching with lowercase + alphanumeric normalization
- Empty token handling: Added `.filter(token => token.length > 0)`
- Duplicate prevention in index building using `includes()` check

#### Priority 5: Build Configuration
- Fixed cross-platform chmod in `package.json`
- Set author to "VectorMedia"
- Updated shebang handling

#### Priority 6: Test Improvements
- Added assertions before incrementing `passed` counter
- Split try-catch blocks for individual test assertions
- Extracted duplicated `buildContentMap()` helper function

**Test Results:** All 6 integration tests pass successfully!

---

## Learn More

- [MCP Documentation](https://modelcontextprotocol.io)
- [Protocol Source](BRAIN/MASTER_PROTOCOL.md)
- [Protocol Collection](BRAIN/)
