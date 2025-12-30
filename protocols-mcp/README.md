# ai-protocols MCP Server (v2.3.5)

An MCP (Model Context Protocol) server that exposes the ai-protocols for use with AI assistants like Claude, Cursor, and other MCP-compatible clients.

## Features

- **6 Protocol Tools**: get_protocol, list_protocols, get_protocol_by_trigger, search_protocols, fuzzy_match_protocol, route_task (NEW)
- **Intelligent Task Routing**: `route_task` analyzes user intent and recommends protocol sequences
- **Project Context Detection**: Auto-detects React, Node, Python, Go, Rust, Java, Docker, CI/CD
- **Context-Aware Search**: Results personalized to user's tech stack
- **7 Workflow Templates**: Guided workflows for refactoring, debugging, security, code review, features, performance, accessibility
- **Dynamic Discovery**: Automatically discovers all protocols in the BRAIN/ directory
- **Smart Search**: Full-text search with relevance scoring, fuzzy matching, and semantic understanding
- **Trigger Mapping**: Automatically maps trigger commands to protocols
- **Production Ready**: TypeScript strict mode, comprehensive error handling, path traversal prevention, Windows/Unix support

## Installation

```bash
cd protocols-mcp
npm install
npm run build
```

## Usage

### Run with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

### Configure for Claude Desktop

Add to your MCP settings:

```json
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["/path/to/your/project/protocols-mcp/build/index.js"],
      "env": {
        "PROTOCOLS_PATH": "/path/to/your/project"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Arguments |
|------|-------------|-----------|
| `get_protocol` | Retrieve a specific protocol | `{ name: string }` |
| `list_protocols` | List all protocols | `{ category?: string }` |
| `get_protocol_by_trigger` | Find protocol by trigger | `{ trigger: string }` |
| `search_protocols` | Search protocols (context-aware) | `{ query: string, category?: string }` |
| `fuzzy_match_protocol` | Find by approximate name | `{ name: string }` |
| `route_task` (NEW) | Intelligent task routing | `{ description: string, taskType?: string }` |

## Example Usage

```
User: "Get the debug protocol"
Assistant: calls get_protocol with name="debug_protocol"

User: "What protocols are available?"
Assistant: calls list_protocols

User: "Search for error handling"
Assistant: calls search_protocols with query="error handling"

User: "Fix this React bug"
Assistant: calls route_task with description="Fix this React bug"
Result: Recommends debug → error_fix → test → code_review workflow
```

## Project Structure

```
protocols-mcp/
├── src/
│   ├── index.ts              # Main entry point
│   ├── scanner/              # Protocol discovery
│   ├── tools/                # MCP tools
│   ├── search/               # Search functionality
│   ├── utils/                # Utilities
│   └── types/                # TypeScript types
├── build/                    # Compiled output
├── package.json
└── tsconfig.json
```

## Building

```bash
npm run build
```

## Documentation

For more information, see:
- [Architecture Analysis](_HOW_ALL_WORKS/ARCHITECTURE_ANALYSIS.md)
- [Quick Start Guide](QUICK_START_NEW_FEATURES.md)
- [Workflow Templates](BRAIN/workflows/)
- [All Protocols](BRAIN/)

## License

MIT

---

**Version:** 2.3.5  
**Last Updated:** 2025-12-29  
**Status:** Production Ready
