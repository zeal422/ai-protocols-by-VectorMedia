// @ts-ignore - SDK types may not match exactly
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createErrorResponse, ProtocolError } from "../utils/error-handler.js";
import { analyzeTaskIntent, getTaskDifficulty, getTaskTimeEstimate } from "../search/task-analyzer.js";
import { buildWorkflow, formatWorkflow, getWorkflowShortcuts } from "../search/workflow-builder.js";
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
const RouteTaskSchema = z.object({
    description: z.string().describe("Description of what you need to do"),
    taskType: z.string().optional().describe("Override task type (debug, build, refactor, audit, optimize, test, setup)")
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
    },
    {
        name: "route_task",
        description: "Intelligent task routing - describe what you need to do and get a recommended protocol sequence. Analyzes your task intent and suggests the best protocol(s) to follow, with optional context-aware personalization.",
        inputSchema: {
            type: "object",
            properties: {
                description: { type: "string", description: "Description of what you need to do (e.g., 'Fix this bug', 'Build a React component', 'Refactor the auth module')" },
                taskType: { type: "string", description: "Optional: override task type (debug, build, refactor, audit, optimize, test, setup)" }
            },
            required: ["description"]
        }
    }
];
export function registerProtocolTools(server, scanner, indexer, matcher, protocolsRoot, projectContext) {
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
                    let results = matcher.search(index, query, { category });
                    // Apply context-aware filtering if project context available
                    if (projectContext && projectContext.detected) {
                        results = matcher.contextualizeResults(results, projectContext);
                    }
                    if (results.length === 0) {
                        return {
                            content: [{
                                    type: "text",
                                    text: `No results found for query: "${query}"`
                                }]
                        };
                    }
                    // Build response with context information
                    let responseText = `# Search Results for: "${query}"\n\n`;
                    if (projectContext && projectContext.detected) {
                        responseText += `**Search personalized for:** ${projectContext.language}, ${projectContext.framework || 'N/A'}\n\n`;
                    }
                    const formatted = results.map((r, i) => {
                        let item = `${i + 1}. **${r.protocol}** (Score: ${r.score})`;
                        if (r.contextRelevance === 'high') {
                            item += ' ✓ Matches your tech stack';
                        }
                        else if (r.contextRelevance === 'medium') {
                            item += ' ~ Partially relevant to your stack';
                        }
                        item += `\n   ${r.excerpt}\n`;
                        return item;
                    }).join('\n');
                    responseText += formatted;
                    return {
                        content: [{
                                type: "text",
                                text: responseText
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
                case "route_task": {
                    const { description, taskType: overrideTaskType } = RouteTaskSchema.parse(args);
                    // Analyze task intent - validate result is valid TaskType
                    let inferredTaskType = analyzeTaskIntent(description);
                    if (overrideTaskType) {
                        // Validate override is a valid task type
                        const validTypes = ['debug', 'build', 'refactor', 'audit', 'optimize', 'test', 'setup'];
                        if (validTypes.includes(overrideTaskType)) {
                            inferredTaskType = overrideTaskType;
                        }
                        else {
                            // Emit warning for invalid override
                            console.warn(`Warning: Invalid taskType override "${overrideTaskType}". Valid types are: ${validTypes.join(', ')}. Using inferred type: "${inferredTaskType}"`);
                        }
                    }
                    const difficulty = getTaskDifficulty(inferredTaskType);
                    const timeEstimate = getTaskTimeEstimate(inferredTaskType);
                    // Build workflow
                    const workflow = buildWorkflow(inferredTaskType, projectContext);
                    // Format response
                    let response = `# Task Routing: ${inferredTaskType.toUpperCase()}\n\n`;
                    response += `**Task Description:** ${description}\n\n`;
                    response += `**Difficulty:** ${difficulty}\n`;
                    response += `**Estimated Time:** ${timeEstimate}\n`;
                    if (projectContext && projectContext.detected) {
                        const framework = projectContext.framework && projectContext.framework !== 'unknown' ? projectContext.framework : 'none';
                        response += `**Project Context:** ${projectContext.language}, Framework: ${framework}\n`;
                    }
                    response += `\n## Recommended Protocol Sequence\n\n`;
                    response += formatWorkflow(workflow, inferredTaskType);
                    // Add shortcuts
                    const shortcuts = getWorkflowShortcuts(inferredTaskType);
                    if (Object.keys(shortcuts).length > 0) {
                        response += `\n## Quick Shortcuts\n\n`;
                        for (const [name, protocols] of Object.entries(shortcuts)) {
                            response += `**${name}:** ${protocols.join(' → ')}\n`;
                        }
                    }
                    response += `\n---\n\n**Next Step:** Use trigger commands above or call \`get_protocol\` to retrieve full protocol content.\n`;
                    return {
                        content: [{
                                type: "text",
                                text: response
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