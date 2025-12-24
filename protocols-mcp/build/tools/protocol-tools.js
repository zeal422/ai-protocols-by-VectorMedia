// @ts-ignore - SDK types may not match exactly
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
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
        description: "Retrieve a specific protocol by its exact name or filename (e.g., 'MASTER_PROTOCOL', 'debug_protocol'). Use this when you already know which protocol is needed for the task.",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Protocol name or filename (e.g., 'debug_protocol')" }
            },
            required: ["name"]
        }
    },
    {
        name: "list_protocols",
        description: "List all available protocols with metadata. Use this to browse available capabilities or when you are unsure which specialized protocol to use.",
        inputSchema: {
            type: "object",
            properties: {
                category: { type: "string", description: "Filter by category (e.g., 'Quality', 'Debugging', 'Security', 'Accessibility', 'Frontend')" }
            },
            required: []
        }
    },
    {
        name: "get_protocol_by_trigger",
        description: "Find and retrieve a protocol using a specific trigger command (e.g., 'DEEPDIVE', 'FULLINDEX', 'SECAUDIT'). This is the preferred way to fetch a protocol when a user mentions a specific trigger keyword.",
        inputSchema: {
            type: "object",
            properties: {
                trigger: { type: "string", description: "Trigger command (e.g., 'DEEPDIVE')" }
            },
            required: ["trigger"]
        }
    },
    {
        name: "search_protocols",
        description: "Search for protocols using natural language keywords (e.g., 'error handling', 'ui design', 'unit tests'). Use this when the user's request is vague or doesn't match a known trigger.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query keywords" },
                category: { type: "string", description: "Optional filter by category" }
            },
            required: ["query"]
        }
    },
    {
        name: "fuzzy_match_protocol",
        description: "Find a protocol by approximate name (handles typos or partial names). Use this if 'get_protocol' fails due to a naming mismatch.",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Approximate protocol name" }
            },
            required: ["name"]
        }
    }
];
export function registerProtocolTools(server, scanner, indexer, matcher, protocolsRoot) {
    // Handle list tools request
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: TOOLS };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            switch (name) {
                case "get_protocol": {
                    const { name: protocolName } = GetProtocolSchema.parse(args);
                    const protocol = await scanner.getProtocol(protocolName);
                    if (!protocol) {
                        throw new ProtocolError(`Protocol '${protocolName}' not found`, 'PROTOCOL_NOT_FOUND', { availableProtocols: (await scanner.scanProtocols()).map(p => p.name) });
                    }
                    // Security: validate path stays within protocolsRoot
                    const rawPath = path.join(protocol.filePath, protocol.fileName);
                    const resolvedPath = path.resolve(protocolsRoot, rawPath);
                    const resolvedRoot = path.resolve(protocolsRoot);
                    const relativePath = path.relative(resolvedRoot, resolvedPath);
                    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
                        throw new ProtocolError(`Invalid protocol path for '${protocolName}'`, 'INVALID_PATH');
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
                        throw new ProtocolError(`No protocol found for trigger '${trigger}'`, 'TRIGGER_NOT_FOUND');
                    }
                    // Security: validate path stays within protocolsRoot
                    const rawPath = path.join(protocol.filePath, protocol.fileName);
                    const resolvedPath = path.resolve(protocolsRoot, rawPath);
                    const resolvedRoot = path.resolve(protocolsRoot);
                    const relativePath = path.relative(resolvedRoot, resolvedPath);
                    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
                        throw new ProtocolError(`Invalid protocol path for '${protocol.name}'`, 'INVALID_PATH');
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
        }
        catch (error) {
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
//# sourceMappingURL=protocol-tools.js.map