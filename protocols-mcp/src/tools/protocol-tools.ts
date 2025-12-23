// @ts-ignore - SDK types may not match exactly
import { Server } from "@modelcontextprotocol/sdk/server/index";
// @ts-ignore - SDK types may not match exactly
import { StdioServerTransport } from "@modelcontextprotocol/sdk/client/stdio";
// @ts-ignore - SDK types may not match exactly
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ProtocolScanner } from "../scanner/protocol-scanner.js";
import { ContentIndexer } from "../search/indexer.js";
import { SearchMatcher } from "../search/matcher.js";
import { createErrorResponse, ProtocolError } from "../utils/error-handler.js";
import * as fs from 'fs/promises';
import path from 'path';

// Tool schemas
const GetProtocolSchema = z.object({
  name: z.string().describe("Protocol name or filename")
});

const ListProtocolsSchema = z.object({
  category: z.string().optional().describe("Filter by category")
});

const GetProtocolByTriggerSchema = z.object({
  trigger: z.string().describe("Trigger command")
});

const SearchProtocolsSchema = z.object({
  query: z.string().describe("Search query"),
  category: z.string().optional().describe("Filter by category")
});

const FuzzyMatchProtocolSchema = z.object({
  name: z.string().describe("Approximate protocol name")
});

// Tool definitions for ListTools response
const TOOLS = [
  {
    name: "get_protocol",
    description: "Retrieve a specific protocol by name (e.g., 'MASTER_PROTOCOL', 'debug_protocol')",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Protocol name or filename" }
      },
      required: ["name"]
    }
  },
  {
    name: "list_protocols",
    description: "List all available protocols with metadata",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Filter by category" }
      },
      required: []
    }
  },
  {
    name: "get_protocol_by_trigger",
    description: "Find protocol by trigger command (e.g., 'DEEPDIVE', 'FULLINDEX')",
    inputSchema: {
      type: "object",
      properties: {
        trigger: { type: "string", description: "Trigger command" }
      },
      required: ["trigger"]
    }
  },
  {
    name: "search_protocols",
    description: "Search protocols by keywords with relevance scoring",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        category: { type: "string", description: "Filter by category" }
      },
      required: ["query"]
    }
  },
  {
    name: "fuzzy_match_protocol",
    description: "Find protocol by approximate name (handles typos)",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Approximate protocol name" }
      },
      required: ["name"]
    }
  }
];

export function registerProtocolTools(
  server: Server,
  scanner: ProtocolScanner,
  indexer: ContentIndexer,
  matcher: SearchMatcher,
  protocolsRoot: string
): void {
  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
    const { name, arguments: args } = request.params;
    
    try {
      switch (name) {
        case "get_protocol": {
          const { name: protocolName } = GetProtocolSchema.parse(args);
          const protocol = await scanner.getProtocol(protocolName);
          
          if (!protocol) {
            throw new ProtocolError(
              `Protocol '${protocolName}' not found`,
              'PROTOCOL_NOT_FOUND',
              { availableProtocols: (await scanner.scanProtocols()).map(p => p.name) }
            );
          }

          // Security: validate path stays within protocolsRoot
          const rawPath = path.join(protocol.filePath, protocol.fileName);
          const resolvedPath = path.resolve(protocolsRoot, rawPath);
          const resolvedRoot = path.resolve(protocolsRoot);
          
          const relativePath = path.relative(resolvedRoot, resolvedPath);
          if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
            throw new ProtocolError(
              `Invalid protocol path for '${protocolName}'`,
              'INVALID_PATH'
            );
          }

          // Async file reading
          const content = await fs.readFile(resolvedPath, 'utf-8');

          return {
            content: [{
              type: "text",
              text: `# ${protocol.title}\n\n**Triggers:** ${protocol.triggers.join(', ') || 'None'}\n**Category:** ${protocol.category}\n\n---\n\n${content}`
            }]
          };
        }

        case "list_protocols": {
          const { category } = ListProtocolsSchema.parse(args);
          let protocols = await scanner.scanProtocols();
          
          if (category) {
            protocols = protocols.filter(p => p.category === category);
          }

          const formatted = protocols.map(p => ({
            name: p.name,
            title: p.title,
            triggers: p.triggers,
            category: p.category,
            purpose: p.purpose
          }));

          return {
            content: [{
              type: "text",
              text: JSON.stringify(formatted, null, 2)
            }]
          };
        }

        case "get_protocol_by_trigger": {
          const { trigger } = GetProtocolByTriggerSchema.parse(args);
          const protocol = await scanner.getProtocolByTrigger(trigger);
          
          if (!protocol) {
            throw new ProtocolError(
              `No protocol found for trigger '${trigger}'`,
              'TRIGGER_NOT_FOUND'
            );
          }

          // Security: validate path stays within protocolsRoot
          const rawPath = path.join(protocol.filePath, protocol.fileName);
          const resolvedPath = path.resolve(protocolsRoot, rawPath);
          const resolvedRoot = path.resolve(protocolsRoot);
          
          const relativePath = path.relative(resolvedRoot, resolvedPath);
          if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
            throw new ProtocolError(
              `Invalid protocol path for '${protocol.name}'`,
              'INVALID_PATH'
            );
          }

          // Async file reading
          const content = await fs.readFile(resolvedPath, 'utf-8');

          return {
            content: [{
              type: "text",
              text: `# ${protocol.title}\n\n**Trigger:** ${trigger}\n\n---\n\n${content}`
            }]
          };
        }

        case "search_protocols": {
          const { query, category } = SearchProtocolsSchema.parse(args);
          const index = indexer.getIndex();
          if (!index) {
            throw new ProtocolError('Search index not initialized', 'INDEX_ERROR');
          }

          const results = matcher.search(index, query, { category });

          if (results.length === 0) {
            return {
              content: [{
                type: "text",
                text: `No results found for query: "${query}"`
              }]
            };
          }

          const formatted = results.map(r => ({
            protocol: r.protocol,
            score: r.score,
            excerpt: r.excerpt,
            matches: r.matches.slice(0, 2)
          }));

          return {
            content: [{
              type: "text",
              text: JSON.stringify(formatted, null, 2)
            }]
          };
        }

        case "fuzzy_match_protocol": {
          const { name: fuzzyName } = FuzzyMatchProtocolSchema.parse(args);
          const index = indexer.getIndex();
          if (!index) {
            throw new ProtocolError('Search index not initialized', 'INDEX_ERROR');
          }

          const results = matcher.fuzzyMatch(index, fuzzyName);

          if (results.length === 0) {
            return {
              content: [{
                type: "text",
                text: `No similar protocols found for: "${fuzzyName}"`
              }]
            };
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(results.slice(0, 5), null, 2)
            }]
          };
        }

        default:
          throw new ProtocolError(`Unknown tool: ${name}`, 'UNKNOWN_TOOL');
      }
    } catch (error) {
      if (error instanceof ProtocolError) {
        return createErrorResponse(error);
      }
      if (error instanceof z.ZodError) {
        return {
          content: [{
            type: "text",
            text: `Invalid arguments: ${error.message}`
          }],
          isError: true
        };
      }
      throw error;
    }
  });
}
