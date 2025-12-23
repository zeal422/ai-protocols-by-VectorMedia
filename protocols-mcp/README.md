# ai-protocols MCP Server

An MCP (Model Context Protocol) server that exposes the ai-protocols for use with AI assistants like Claude, Cursor, and other MCP-compatible clients.

## Features

- **5 Protocol Tools**: get_protocol, list_protocols, get_protocol_by_trigger, search_protocols, fuzzy_match_protocol
- **Dynamic Discovery**: Automatically discovers all protocols in the BRAIN/ directory
- **Smart Search**: Full-text search with relevance scoring and fuzzy matching
- **Trigger Mapping**: Automatically maps trigger commands to protocols
- **Production Ready**: TypeScript strict mode, comprehensive error handling, path traversal prevention

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
| `search_protocols` | Search protocols | `{ query: string, category?: string }` |
| `fuzzy_match_protocol` | Find by approximate name | `{ name: string }` |

## Example Usage

```
User: "Get the debug protocol"
Assistant: calls get_protocol with name="debug_protocol"

User: "What protocols are available?"
Assistant: calls list_protocols

User: "Search for error handling"
Assistant: calls search_protocols with query="error handling"
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

## License

MIT
