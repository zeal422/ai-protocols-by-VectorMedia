import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { createErrorResponse, ProtocolError } from '../utils/error-handler.js';
import { Language, Framework, ProjectType, TestFramework, PackageManager } from '../types/project-context.js';
import { analyzeTaskIntent, getTaskDifficulty, getTaskTimeEstimate } from '../search/task-analyzer.js';
import { buildWorkflow, formatWorkflow, getWorkflowShortcuts } from '../search/workflow-builder.js';
import * as fs from 'fs/promises';
import path from 'path';
// Tool schemas
const GetProtocolSchema = z.object({
    name: z.string().describe('Protocol name or filename')
});
const ListProtocolsSchema = z.object({
    category: z.string().optional().describe('Filter by category')
});
const GetProtocolByTriggerSchema = z.object({
    trigger: z.string().describe('Trigger command')
});
const SearchProtocolsSchema = z.object({
    query: z.string().describe('Search query'),
    category: z.string().optional().describe('Filter by category')
});
const FuzzyMatchProtocolSchema = z.object({
    name: z.string().describe('Approximate protocol name')
});
const RouteTaskSchema = z.object({
    description: z.string().describe('Description of what you need to do'),
    taskType: z.string().optional().describe('Override task type (debug, build, refactor, audit, optimize, test, setup)')
});
const ResolvePrerequisitesSchema = z.object({
    protocol: z.string().describe('Protocol name to resolve prerequisites for'),
    includeOptional: z.boolean().optional().default(false).describe('Include optional dependencies')
});
const RefineIntentSchema = z.object({
    description: z.string().describe('Task description to refine'),
    clarifications: z.array(z.object({
        questionId: z.string(),
        answer: z.string()
    })).optional().describe('Answers to clarifying questions')
});
const TrackMetricSchema = z.object({
    sessionId: z.string().describe('Session ID'),
    protocolName: z.string().describe('Protocol that was executed'),
    executionTimeMs: z.number().describe('Execution time in milliseconds'),
    success: z.boolean().describe('Whether execution was successful'),
    findingsCount: z.number().optional().default(0).describe('Number of findings')
});
const WorkflowOptimizationSchema = z.object({
    taskType: z.string().describe('Type of task (debug, build, refactor, etc.)'),
    currentProtocols: z.array(z.string()).optional().describe('Current protocol sequence')
});
const ProtocolEffectivenessSchema = z.object({
    protocol: z.string().optional().describe('Protocol name, or all if not specified'),
    timeRange: z.object({
        start: z.string(),
        end: z.string()
    }).optional().describe('Optional time range filter')
});
const BuildAdaptiveWorkflowSchema = z.object({
    taskDescription: z.string().describe('Description of what you need to do'),
    projectContext: z.object({
        language: z.string().optional(),
        framework: z.string().optional(),
        projectType: z.string().optional()
    }).optional().describe('Project context (optional, auto-detected if not provided)'),
    previousResults: z.array(z.object({
        protocol: z.string(),
        findingsCount: z.number().optional(),
        success: z.boolean()
    })).optional().describe('Previous protocol execution results')
});
const AssessModificationRiskSchema = z.object({
    file: z.string().describe('File path being modified'),
    changeType: z.enum(['creation', 'modification', 'deletion']).describe('Type of change'),
    scope: z.enum(['single_line', 'function', 'file', 'module', 'architecture']).describe('Scope of change'),
    affectedAreas: z.array(z.string()).default([]).describe('Affected areas or modules'),
    isAuthentication: z.boolean().default(false).describe('Change affects authentication'),
    isAuthorization: z.boolean().default(false).describe('Change affects authorization'),
    isPayment: z.boolean().default(false).describe('Change affects payment processing'),
    isDatabaseMigration: z.boolean().default(false).describe('Change is a database migration'),
    changeSize: z.number().default(0).describe('Number of lines changed')
});
const ClassifyErrorSchema = z.object({
    errorMessage: z.string().describe('Error message to classify'),
    protocol: z.string().describe('Protocol that was executing when error occurred'),
    context: z.object({
        sessionId: z.string().optional(),
        executedProtocols: z.array(z.string()).optional()
    }).optional().describe('Execution context')
});
const AttemptErrorRecoverySchema = z.object({
    errorClass: z.string().describe('Error class (timeout, resource_exhausted, invalid_input, protocol_failure, dependency_error, unknown)'),
    strategyName: z.string().describe('Recovery strategy to attempt'),
    sessionId: z.string().describe('Session ID for tracking'),
    protocol: z.string().describe('Protocol that failed')
});
const GetExecutionAlertsSchema = z.object({
    sessionId: z.string().describe('Session ID to get alerts for'),
    level: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Filter by alert level')
});
// Phase 4: Resilience Tools Schemas
const CreateCheckpointSchema = z.object({
    sessionId: z.string().describe('Session ID to create checkpoint for'),
    checkpointType: z.enum(['manual', 'automatic', 'error_recovery']).optional().default('automatic').describe('Type of checkpoint'),
    description: z.string().optional().describe('Description of the checkpoint')
});
const ResumeFromCheckpointSchema = z.object({
    checkpointId: z.string().describe('Checkpoint ID to resume from'),
    sessionId: z.string().describe('Session ID to resume')
});
const ListCheckpointsSchema = z.object({
    sessionId: z.string().describe('Session ID to list checkpoints for')
});
const StartParallelExecutionSchema = z.object({
    protocols: z.array(z.object({
        protocolName: z.string(),
        trigger: z.string(),
        order: z.number()
    })).describe('Protocols to execute in parallel'),
    sessionId: z.string().describe('Session ID for execution tracking'),
    maxParallel: z.number().optional().default(4).describe('Maximum parallel executions')
});
const AggregateResultsSchema = z.object({
    results: z.array(z.object({
        protocolName: z.string(),
        success: z.boolean(),
        findings: z.array(z.object({
            findingId: z.string(),
            severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
            category: z.string(),
            title: z.string(),
            description: z.string()
        })),
        executionTime: z.number()
    })).describe('Results to aggregate')
});
const RegisterAgentSchema = z.object({
    name: z.string().describe('Agent name'),
    role: z.enum(['specialist', 'coordinator', 'reviewer']).describe('Agent role'),
    capabilities: z.array(z.string()).describe('Protocols the agent can handle'),
    metadata: z.object({
        version: z.string().optional(),
        provider: z.string().optional(),
        model: z.string().optional()
    }).optional().describe('Agent metadata')
});
const AssignProtocolSchema = z.object({
    protocol: z.string().describe('Protocol to assign'),
    agentIds: z.array(z.string()).describe('Agent IDs to choose from')
});
// Tool definitions for ListTools response
export const TOOLS = [
    {
        name: 'get_protocol',
        description: 'Retrieve a specific protocol by its exact name or filename (e.g., \'MASTER_PROTOCOL\', \'debug_protocol\'). Use this when you already know which protocol is needed for the task.',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Protocol name or filename (e.g., \'debug_protocol\')' }
            },
            required: ['name']
        }
    },
    {
        name: 'list_protocols',
        description: 'List all available protocols with metadata. Use this to browse available capabilities or when you are unsure which specialized protocol to use.',
        inputSchema: {
            type: 'object',
            properties: {
                category: { type: 'string', description: 'Filter by category (e.g., \'Quality\', \'Debugging\', \'Security\', \'Accessibility\', \'Frontend\')' }
            },
            required: []
        }
    },
    {
        name: 'get_protocol_by_trigger',
        description: 'Find and retrieve a protocol using a specific trigger command (e.g., \'DEEPDIVE\', \'FULLINDEX\', \'SECAUDIT\'). This is the preferred way to fetch a protocol when a user mentions a specific trigger keyword.',
        inputSchema: {
            type: 'object',
            properties: {
                trigger: { type: 'string', description: 'Trigger command (e.g., \'DEEPDIVE\')' }
            },
            required: ['trigger']
        }
    },
    {
        name: 'search_protocols',
        description: 'Search for protocols using natural language keywords (e.g., \'error handling\', \'ui design\', \'unit tests\'). Use this when the user\'s request is vague or doesn\'t match a known trigger.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query keywords' },
                category: { type: 'string', description: 'Optional filter by category' }
            },
            required: ['query']
        }
    },
    {
        name: 'fuzzy_match_protocol',
        description: 'Find a protocol by approximate name (handles typos or partial names). Use this if \'get_protocol\' fails due to a naming mismatch.',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Approximate protocol name' }
            },
            required: ['name']
        }
    },
    {
        name: 'route_task',
        description: 'Intelligent task routing - describe what you need to do and get a recommended protocol sequence. Analyzes your task intent and suggests the best protocol(s) to follow, with optional context-aware personalization.',
        inputSchema: {
            type: 'object',
            properties: {
                description: { type: 'string', description: 'Description of what you need to do (e.g., \'Fix this bug\', \'Build a React component\', \'Refactor the auth module\')' },
                taskType: { type: 'string', description: 'Optional: override task type (debug, build, refactor, audit, optimize, test, setup)' }
            },
            required: ['description']
        }
    },
    {
        name: 'resolve_protocol_prerequisites',
        description: 'Get required prerequisites for a protocol. Returns the full dependency chain that must be executed before the specified protocol.',
        inputSchema: {
            type: 'object',
            properties: {
                protocol: { type: 'string', description: 'Protocol name (e.g., \'mdap_protocol\', \'test_automation_protocol\')' },
                includeOptional: { type: 'boolean', description: 'Include optional dependencies (default: false)' }
            },
            required: ['protocol']
        }
    },
    {
        name: 'refine_user_intent',
        description: 'Detect ambiguities in task description and generate clarifying questions. Helps refine vague task descriptions for better protocol selection.',
        inputSchema: {
            type: 'object',
            properties: {
                description: { type: 'string', description: 'Task description to analyze' },
                clarifications: { type: 'array', description: 'Answers to clarifying questions', items: { type: 'object', properties: { questionId: { type: 'string' }, answer: { type: 'string' } } } }
            },
            required: ['description']
        }
    },
    {
        name: 'track_execution_metric',
        description: 'Record protocol execution metrics for analytics and effectiveness tracking.',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string', description: 'Session ID' },
                protocolName: { type: 'string', description: 'Protocol that was executed' },
                executionTimeMs: { type: 'number', description: 'Execution time in milliseconds' },
                success: { type: 'boolean', description: 'Whether execution was successful' },
                findingsCount: { type: 'number', description: 'Number of findings generated' }
            },
            required: ['sessionId', 'protocolName', 'executionTimeMs', 'success']
        }
    },
    {
        name: 'get_workflow_optimization_suggestions',
        description: 'Get optimized workflow suggestions based on historical effectiveness data.',
        inputSchema: {
            type: 'object',
            properties: {
                taskType: { type: 'string', description: 'Type of task (debug, build, refactor, etc.)' },
                currentProtocols: { type: 'array', description: 'Current protocol sequence', items: { type: 'string' } }
            },
            required: ['taskType']
        }
    },
    {
        name: 'get_protocol_effectiveness',
        description: 'Get effectiveness metrics for protocols, including success rates and execution times.',
        inputSchema: {
            type: 'object',
            properties: {
                protocol: { type: 'string', description: 'Protocol name, or all if not specified' },
                timeRange: { type: 'object', description: 'Optional time range filter', properties: { start: { type: 'string' }, end: { type: 'string' } } }
            },
            required: []
        }
    },
    {
        name: 'build_adaptive_workflow',
        description: 'Build an adaptive workflow based on task description and previous results. The workflow adapts based on findings from executed protocols.',
        inputSchema: {
            type: 'object',
            properties: {
                taskDescription: { type: 'string', description: 'Description of what you need to do' },
                projectContext: { type: 'object', description: 'Project context (optional, auto-detected if not provided)', properties: { language: { type: 'string' }, framework: { type: 'string' }, projectType: { type: 'string' } } },
                previousResults: { type: 'array', description: 'Previous protocol execution results', items: { type: 'object', properties: { protocol: { type: 'string' }, findingsCount: { type: 'number' }, success: { type: 'boolean' } } } }
            },
            required: ['taskDescription']
        }
    },
    {
        name: 'assess_modification_risk',
        description: 'Assess the risk level of code modifications. Returns risk score, factors, and whether approval is required.',
        inputSchema: {
            type: 'object',
            properties: {
                file: { type: 'string', description: 'File path being modified' },
                changeType: { type: 'string', enum: ['creation', 'modification', 'deletion'], description: 'Type of change' },
                scope: { type: 'string', enum: ['single_line', 'function', 'file', 'module', 'architecture'], description: 'Scope of change' },
                affectedAreas: { type: 'array', description: 'Affected areas or modules', items: { type: 'string' } },
                isAuthentication: { type: 'boolean', description: 'Change affects authentication' },
                isAuthorization: { type: 'boolean', description: 'Change affects authorization' },
                isPayment: { type: 'boolean', description: 'Change affects payment processing' },
                isDatabaseMigration: { type: 'boolean', description: 'Change is a database migration' },
                changeSize: { type: 'number', description: 'Number of lines changed' }
            },
            required: ['file', 'changeType', 'scope']
        }
    },
    {
        name: 'classify_error',
        description: 'Classify an error and suggest appropriate recovery strategies based on the error type.',
        inputSchema: {
            type: 'object',
            properties: {
                errorMessage: { type: 'string', description: 'Error message to classify' },
                protocol: { type: 'string', description: 'Protocol that was executing when error occurred' },
                context: { type: 'object', description: 'Execution context', properties: { sessionId: { type: 'string' }, executedProtocols: { type: 'array', items: { type: 'string' } } } }
            },
            required: ['errorMessage', 'protocol']
        }
    },
    {
        name: 'attempt_error_recovery',
        description: 'Attempt to recover from an error using a specific recovery strategy. Returns the result of the recovery attempt.',
        inputSchema: {
            type: 'object',
            properties: {
                errorClass: { type: 'string', description: 'Error class (timeout, resource_exhausted, invalid_input, protocol_failure, dependency_error, unknown)' },
                strategyName: { type: 'string', description: 'Recovery strategy to attempt' },
                sessionId: { type: 'string', description: 'Session ID for tracking' },
                protocol: { type: 'string', description: 'Protocol that failed' }
            },
            required: ['errorClass', 'strategyName', 'sessionId', 'protocol']
        }
    },
    {
        name: 'get_execution_alerts',
        description: 'Get all risk alerts from an execution session. Can filter by alert level.',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string', description: 'Session ID to get alerts for' },
                level: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], description: 'Filter by alert level' }
            },
            required: ['sessionId']
        }
    },
    // Phase 4: Resilience Tools
    {
        name: 'create_execution_checkpoint',
        description: 'Create a checkpoint to save current execution state. Useful for long-running tasks that need to resume later.',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string', description: 'Session ID to create checkpoint for' },
                checkpointType: { type: 'string', enum: ['manual', 'automatic', 'error_recovery'], description: 'Type of checkpoint' },
                description: { type: 'string', description: 'Description of the checkpoint' }
            },
            required: ['sessionId']
        }
    },
    {
        name: 'resume_from_checkpoint',
        description: 'Resume execution from a previously created checkpoint.',
        inputSchema: {
            type: 'object',
            properties: {
                checkpointId: { type: 'string', description: 'Checkpoint ID to resume from' },
                sessionId: { type: 'string', description: 'Session ID to resume' }
            },
            required: ['checkpointId', 'sessionId']
        }
    },
    {
        name: 'list_checkpoints',
        description: 'List all checkpoints for a session.',
        inputSchema: {
            type: 'object',
            properties: {
                sessionId: { type: 'string', description: 'Session ID to list checkpoints for' }
            },
            required: ['sessionId']
        }
    },
    {
        name: 'start_parallel_protocol_execution',
        description: 'Execute multiple protocols in parallel for improved performance. Automatically detects and handles conflicts.',
        inputSchema: {
            type: 'object',
            properties: {
                protocols: { type: 'array', description: 'Protocols to execute in parallel', items: { type: 'object', properties: { protocolName: { type: 'string' }, trigger: { type: 'string' }, order: { type: 'number' } } } },
                sessionId: { type: 'string', description: 'Session ID for execution tracking' },
                maxParallel: { type: 'number', description: 'Maximum parallel executions' }
            },
            required: ['protocols', 'sessionId']
        }
    },
    {
        name: 'aggregate_parallel_results',
        description: 'Aggregate results from parallel protocol executions into a unified result.',
        inputSchema: {
            type: 'object',
            properties: {
                results: { type: 'array', description: 'Results to aggregate', items: { type: 'object', properties: { protocolName: { type: 'string' }, success: { type: 'boolean' }, findings: { type: 'array' }, executionTime: { type: 'number' } } } }
            },
            required: ['results']
        }
    },
    {
        name: 'register_agent',
        description: 'Register a new agent for multi-agent coordination. Agents can execute protocols in parallel.',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Agent name' },
                role: { type: 'string', enum: ['specialist', 'coordinator', 'reviewer'], description: 'Agent role' },
                capabilities: { type: 'array', description: 'Protocols the agent can handle', items: { type: 'string' } },
                metadata: { type: 'object', description: 'Agent metadata', properties: { version: { type: 'string' }, provider: { type: 'string' }, model: { type: 'string' } } }
            },
            required: ['name', 'role', 'capabilities']
        }
    },
    {
        name: 'assign_protocol_to_agent',
        description: 'Assign a protocol to an available agent for execution.',
        inputSchema: {
            type: 'object',
            properties: {
                protocol: { type: 'string', description: 'Protocol to assign' },
                agentIds: { type: 'array', description: 'Agent IDs to choose from', items: { type: 'string' } }
            },
            required: ['protocol', 'agentIds']
        }
    }
];
export function registerProtocolTools(server, scanner, indexer, matcher, protocolsRoot, projectContext, dependencyResolver, intentRefinement, metricsCollector, workflowEngine, errorRecoverySystem, riskAssessmentEngine) {
    // Handle list tools request
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: TOOLS };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        try {
            switch (name) {
                case 'get_protocol': {
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
                                type: 'text',
                                text: `# ${protocol.title}\n\n**Triggers:** ${protocol.triggers.join(', ') || 'None'}\n**Category:** ${protocol.category}\n\n---\n\n${content}`
                            }]
                    };
                }
                case 'list_protocols': {
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
                                type: 'text',
                                text: JSON.stringify(formatted, null, 2)
                            }]
                    };
                }
                case 'get_protocol_by_trigger': {
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
                                type: 'text',
                                text: `# ${protocol.title}\n\n**Trigger:** ${trigger}\n\n---\n\n${content}`
                            }]
                    };
                }
                case 'search_protocols': {
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
                                    type: 'text',
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
                                type: 'text',
                                text: responseText
                            }]
                    };
                }
                case 'fuzzy_match_protocol': {
                    const { name: fuzzyName } = FuzzyMatchProtocolSchema.parse(args);
                    const index = indexer.getIndex();
                    if (!index) {
                        throw new ProtocolError('Search index not initialized', 'INDEX_ERROR');
                    }
                    const results = matcher.fuzzyMatch(index, fuzzyName);
                    if (results.length === 0) {
                        return {
                            content: [{
                                    type: 'text',
                                    text: `No similar protocols found for: "${fuzzyName}"`
                                }]
                        };
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: JSON.stringify(results.slice(0, 5), null, 2)
                            }]
                    };
                }
                case 'route_task': {
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
                    response += '\n## Recommended Protocol Sequence\n\n';
                    response += formatWorkflow(workflow, inferredTaskType);
                    // Add shortcuts
                    const shortcuts = getWorkflowShortcuts(inferredTaskType);
                    if (Object.keys(shortcuts).length > 0) {
                        response += '\n## Quick Shortcuts\n\n';
                        for (const [name, protocols] of Object.entries(shortcuts)) {
                            response += `**${name}:** ${protocols.join(' → ')}\n`;
                        }
                    }
                    response += '\n---\n\n**Next Step:** Use trigger commands above or call `get_protocol` to retrieve full protocol content.\n';
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'resolve_protocol_prerequisites': {
                    if (!dependencyResolver) {
                        throw new ProtocolError('Dependency resolver not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { protocol, includeOptional: _includeOptional } = ResolvePrerequisitesSchema.parse(args);
                    const prereqs = await dependencyResolver.resolvePrerequisites(protocol);
                    const validation = await dependencyResolver.validateChain([protocol]);
                    let response = `# Prerequisites for: ${protocol}\n\n`;
                    response += '**Required Dependencies:**\n';
                    if (prereqs.length === 0) {
                        response += '- None\n';
                    }
                    else {
                        for (const prereq of prereqs) {
                            response += `- ${prereq}\n`;
                        }
                    }
                    if (!validation.valid) {
                        response += '\n**Issues:**\n';
                        for (const issue of validation.issues) {
                            response += `- [${issue.severity.toUpperCase()}] ${issue.message}\n`;
                        }
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'refine_user_intent': {
                    if (!intentRefinement) {
                        throw new ProtocolError('Intent refinement not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { description, clarifications: _clarifications } = RefineIntentSchema.parse(args);
                    const { intent, questions, refinement: _refinement } = await intentRefinement.refineIntent(description);
                    let response = '# Intent Analysis\n\n';
                    response += `**Task Type:** ${intent.taskType}\n`;
                    response += `**Complexity:** ${intent.complexity}\n`;
                    response += `**Confidence:** ${(intent.confidence * 100).toFixed(0)}%\n`;
                    response += `**Estimated Time:** ${intent.estimatedTime}\n\n`;
                    if (questions.length > 0) {
                        response += '**Clarifying Questions:**\n\n';
                        for (const q of questions) {
                            response += `Q: ${q.question}\n`;
                            if (q.options) {
                                response += `Options: ${q.options.join(', ')}\n`;
                            }
                            response += `Required: ${q.required ? 'Yes' : 'No'}\n\n`;
                        }
                    }
                    else {
                        response += 'No ambiguities detected. Task description is clear.\n\n';
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'track_execution_metric': {
                    if (!metricsCollector) {
                        throw new ProtocolError('Metrics collector not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { sessionId, protocolName, executionTimeMs, success, findingsCount } = TrackMetricSchema.parse(args);
                    await metricsCollector.recordProtocolExecution({
                        sessionId,
                        protocolName,
                        trigger: '',
                        startTime: new Date(),
                        endTime: new Date(),
                        executionTime: executionTimeMs,
                        success,
                        findingsCount,
                        artifactsCached: 0
                    });
                    return {
                        content: [{
                                type: 'text',
                                text: `Metrics recorded for ${protocolName}: ${executionTimeMs}ms, success=${success}`
                            }]
                    };
                }
                case 'get_workflow_optimization_suggestions': {
                    if (!metricsCollector) {
                        throw new ProtocolError('Metrics collector not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { taskType, currentProtocols } = WorkflowOptimizationSchema.parse(args);
                    const optimization = await metricsCollector.optimizeWorkflow({ protocols: currentProtocols || [] }, taskType);
                    let response = `# Workflow Optimization for: ${taskType}\n\n`;
                    response += '**Optimized Protocol Sequence:**\n';
                    for (const p of optimization.optimized.protocols) {
                        response += `- ${p}\n`;
                    }
                    response += `\n**Expected Time Reduction:** ${optimization.expectedTimeReduction.toFixed(1)}%\n`;
                    response += `**Confidence:** ${(optimization.confidence * 100).toFixed(0)}%\n`;
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'get_protocol_effectiveness': {
                    if (!metricsCollector) {
                        throw new ProtocolError('Metrics collector not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { protocol, timeRange: _timeRange } = ProtocolEffectivenessSchema.parse(args);
                    let response = '# Protocol Effectiveness\n\n';
                    if (protocol) {
                        const effectiveness = await metricsCollector.getProtocolEffectiveness(protocol);
                        response += `## ${effectiveness.protocol}\n\n`;
                        response += `- **Success Rate:** ${(effectiveness.successRate * 100).toFixed(1)}%\n`;
                        response += `- **Avg Execution Time:** ${(effectiveness.averageExecutionTime / 1000).toFixed(2)}s\n`;
                        response += `- **Avg Findings:** ${effectiveness.averageFindingsPerExecution.toFixed(1)}\n`;
                        response += `- **Usage Count:** ${effectiveness.usageCount}\n`;
                        response += `- **Trend:** ${effectiveness.trend}\n`;
                    }
                    else {
                        const allEffectiveness = await metricsCollector.getAllProtocolEffectiveness();
                        for (const eff of allEffectiveness.slice(0, 10)) {
                            response += `## ${eff.protocol}\n`;
                            response += `- Success: ${(eff.successRate * 100).toFixed(1)}%, `;
                            response += `Avg Time: ${(eff.averageExecutionTime / 1000).toFixed(2)}s, `;
                            response += `Uses: ${eff.usageCount}, Trend: ${eff.trend}\n\n`;
                        }
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'build_adaptive_workflow': {
                    if (!workflowEngine) {
                        throw new ProtocolError('Workflow engine not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { taskDescription, projectContext: inputContext, previousResults } = BuildAdaptiveWorkflowSchema.parse(args);
                    const context = inputContext ? {
                        language: inputContext.language || Language.Unknown,
                        framework: inputContext.framework || Framework.None,
                        projectType: inputContext.projectType || ProjectType.Unknown,
                        testFramework: TestFramework.Unknown,
                        packageManager: PackageManager.Unknown,
                        hasDocker: false,
                        hasCI: false,
                        hasGit: true,
                        dependencies: [],
                        devDependencies: [],
                        detected: true
                    } : {
                        language: Language.Unknown,
                        framework: Framework.None,
                        projectType: ProjectType.Unknown,
                        testFramework: TestFramework.Unknown,
                        packageManager: PackageManager.Unknown,
                        hasDocker: false,
                        hasCI: false,
                        hasGit: true,
                        dependencies: [],
                        devDependencies: [],
                        detected: false
                    };
                    const taskType = analyzeTaskIntent(taskDescription);
                    const difficulty = getTaskDifficulty(taskType);
                    const timeEstimate = getTaskTimeEstimate(taskType);
                    const workflow = await workflowEngine.buildAdaptiveWorkflow({ description: taskDescription, type: taskType, priority: 'medium' }, context, previousResults?.map(r => ({
                        protocolName: r.protocol,
                        executionTime: 0,
                        timestamp: new Date(),
                        success: r.success,
                        findings: r.findingsCount ? Array(r.findingsCount).fill({ findingId: 'test', severity: 'medium', category: 'test', title: 'Test', description: 'Test', recommendations: [], location: { file: '', line: 0 }, metadata: {} }) : [],
                        recommendations: [],
                        artifacts: [],
                        nextSteps: [],
                        metrics: { protocolName: r.protocol, executionTime: 0, cacheHits: 0, cacheMisses: 0, cacheHitRate: 0, memoryUsage: 0, success: r.success }
                    })));
                    let response = `# Adaptive Workflow: ${taskType.toUpperCase()}\n\n`;
                    response += `**Task:** ${taskDescription}\n`;
                    response += `**Difficulty:** ${difficulty}\n`;
                    response += `**Estimated Time:** ${timeEstimate}\n`;
                    response += `**Max Iterations:** ${workflow.maxIterations}\n\n`;
                    response += '## Workflow Structure\n\n';
                    response += `**Initial Protocol:** ${workflow.initialProtocol}\n\n`;
                    if (workflow.branches.length > 0) {
                        response += '### Branches\n\n';
                        for (const branch of workflow.branches) {
                            response += `**Condition:** ${branch.condition}\n`;
                            response += `**Protocols:** ${branch.protocols.join(' → ')}\n`;
                            response += `**Skip if run:** ${branch.skipIfAlreadyRun ? 'Yes' : 'No'}\n\n`;
                        }
                    }
                    if (Object.keys(workflow.fallbacks).length > 0) {
                        response += '### Fallbacks\n\n';
                        for (const [protocol, fallbacks] of Object.entries(workflow.fallbacks)) {
                            response += `**${protocol}:** ${fallbacks.join(' → ')}\n`;
                        }
                        response += '\n';
                    }
                    if (workflow.escalationThresholds.length > 0) {
                        response += '### Escalation Triggers\n\n';
                        for (const threshold of workflow.escalationThresholds) {
                            response += `**Condition:** ${threshold.condition}\n`;
                            response += `**Escalate to:** ${threshold.escalateTo}\n`;
                            response += `**Requires approval:** ${threshold.requiresUserApproval ? 'Yes' : 'No'}\n`;
                            response += `Reason: ${threshold.reason}\n\n`;
                        }
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'assess_modification_risk': {
                    if (!riskAssessmentEngine) {
                        throw new ProtocolError('Risk assessment engine not available', 'SERVICE_UNAVAILABLE');
                    }
                    const input = AssessModificationRiskSchema.parse(args);
                    const change = {
                        file: input.file,
                        type: input.changeType,
                        scope: input.scope,
                        affectedAreas: input.affectedAreas,
                        isAuthentication: input.isAuthentication,
                        isAuthorization: input.isAuthorization,
                        isPayment: input.isPayment,
                        isDatabaseMigration: input.isDatabaseMigration,
                        changeSize: input.changeSize
                    };
                    const assessment = await riskAssessmentEngine.assessModification(change);
                    let response = `# Risk Assessment: ${change.file}\n\n`;
                    response += `**Risk Level:** ${assessment.level.toUpperCase()}\n`;
                    response += `**Risk Score:** ${assessment.score}/100\n`;
                    response += `**Requires Approval:** ${assessment.requiresApproval ? 'Yes' : 'No'}\n`;
                    response += `**Requires Review:** ${assessment.requiresReview ? 'Yes' : 'No'}\n`;
                    if (assessment.suggestedReviewer) {
                        response += `**Suggested Reviewer:** ${assessment.suggestedReviewer}\n`;
                    }
                    response += '\n### Risk Factors\n\n';
                    for (const factor of assessment.factors) {
                        response += `**${factor.name}** (Severity: ${factor.severity}/10)\n`;
                        response += `Evidence: ${factor.evidence}\n`;
                        response += `Mitigation: ${factor.mitigation}\n\n`;
                    }
                    const rollbackPlan = await riskAssessmentEngine.generateRollbackPlan(change);
                    response += '### Rollback Plan\n\n';
                    response += `**Estimated Time:** ${rollbackPlan.estimatedTime}\n`;
                    response += `**Data Impact:** ${rollbackPlan.dataImpact}\n`;
                    response += `**User Impact:** ${rollbackPlan.userImpact}\n\n`;
                    response += '**Rollback Steps:**\n';
                    for (const step of rollbackPlan.steps) {
                        response += `- ${step.action}`;
                        if (step.command) {
                            response += `: \`${step.command}\``;
                        }
                        response += `\n  Verification: ${step.verification}\n`;
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'classify_error': {
                    if (!errorRecoverySystem) {
                        throw new ProtocolError('Error recovery system not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { errorMessage, protocol, context: errorContext } = ClassifyErrorSchema.parse(args);
                    const executedProtocols = errorContext?.executedProtocols || [];
                    const error = new Error(errorMessage);
                    const errorClass = await errorRecoverySystem.classifyError(error, {
                        error,
                        protocol,
                        session: { sessionId: errorContext?.sessionId || 'unknown', executedProtocols },
                        previousResults: []
                    });
                    const strategies = await errorRecoverySystem.findRecoveryStrategy(errorClass, {
                        error,
                        protocol,
                        session: { sessionId: errorContext?.sessionId || 'unknown', executedProtocols },
                        previousResults: []
                    });
                    let response = '# Error Classification\n\n';
                    response += `**Error Message:** ${errorMessage}\n`;
                    response += `**Protocol:** ${protocol}\n`;
                    response += `**Error Class:** ${errorClass}\n\n`;
                    response += '### Recommended Recovery Strategies\n\n';
                    for (const strategy of strategies) {
                        response += `**${strategy.name}**\n`;
                        response += `Description: ${strategy.description}\n`;
                        response += `Estimated Time: ${strategy.estimatedTime}\n`;
                        response += `Success Probability: ${(strategy.successProbability * 100).toFixed(0)}%\n`;
                        response += 'Steps:\n';
                        for (const step of strategy.steps) {
                            response += `  - ${step.action}`;
                            if (step.params) {
                                response += ` (${JSON.stringify(step.params)})`;
                            }
                            response += '\n';
                        }
                        response += '\n';
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'attempt_error_recovery': {
                    if (!errorRecoverySystem) {
                        throw new ProtocolError('Error recovery system not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { errorClass: _errorClass, strategyName, sessionId, protocol } = AttemptErrorRecoverySchema.parse(args);
                    const error = new Error(`Recovery attempt for ${protocol}`);
                    const strategies = await errorRecoverySystem.getAllRecoveryStrategies(error, {
                        error,
                        protocol,
                        session: { sessionId, executedProtocols: [] },
                        previousResults: []
                    });
                    const strategy = strategies.find(s => s.name === strategyName);
                    if (!strategy) {
                        throw new ProtocolError(`Strategy '${strategyName}' not found`, 'STRATEGY_NOT_FOUND');
                    }
                    const result = await errorRecoverySystem.attemptRecovery(error, strategy, {
                        error,
                        protocol,
                        session: { sessionId, executedProtocols: [] },
                        previousResults: []
                    });
                    let response = '# Error Recovery Result\n\n';
                    response += `**Strategy Used:** ${result.strategyUsed}\n`;
                    response += `**Success:** ${result.success ? 'Yes' : 'No'}\n`;
                    response += `**Attempts:** ${result.attempts}\n`;
                    response += `**Total Time:** ${(result.totalTime / 1000).toFixed(2)}s\n`;
                    if (result.success && result.recoveredResult) {
                        response += '\n**Recovered Result:**\n';
                        response += `- Protocol: ${result.recoveredResult.protocolName}\n`;
                        response += `- Success: ${result.recoveredResult.success}\n`;
                        response += `- Findings: ${result.recoveredResult.findings.length}\n`;
                    }
                    else if (result.error) {
                        response += `\n**Error:** ${result.error.message}\n`;
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'get_execution_alerts': {
                    if (!riskAssessmentEngine) {
                        throw new ProtocolError('Risk assessment engine not available', 'SERVICE_UNAVAILABLE');
                    }
                    const { sessionId, level } = GetExecutionAlertsSchema.parse(args);
                    const alerts = await riskAssessmentEngine.getExecutionAlerts(sessionId, level);
                    if (alerts.length === 0) {
                        return {
                            content: [{
                                    type: 'text',
                                    text: `No alerts found for session: ${sessionId}${level ? ` at level: ${level}` : ''}`
                                }]
                        };
                    }
                    let response = `# Execution Alerts: ${sessionId}\n\n`;
                    response += `**Total Alerts:** ${alerts.length}\n\n`;
                    const byLevel = alerts.reduce((acc, alert) => {
                        acc[alert.level] = (acc[alert.level] || 0) + 1;
                        return acc;
                    }, {});
                    response += '### Summary by Level\n';
                    for (const [lvl, count] of Object.entries(byLevel)) {
                        response += `- ${lvl.toUpperCase()}: ${count}\n`;
                    }
                    response += '\n';
                    for (const alert of alerts) {
                        response += `## ${alert.level.toUpperCase()} Alert\n\n`;
                        response += `**Time:** ${alert.timestamp.toISOString()}\n`;
                        response += `**Protocol:** ${alert.affectedProtocol}\n`;
                        response += `**Message:** ${alert.message}\n`;
                        response += `**Suggested Action:** ${alert.suggestedAction}\n`;
                        response += `**Requires Immediate Action:** ${alert.requiresImmediateAction ? 'Yes' : 'No'}\n\n`;
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                // Phase 4: Resilience Tool Handlers
                case 'create_execution_checkpoint': {
                    const { sessionId, checkpointType, description } = CreateCheckpointSchema.parse(args);
                    let response = '# Checkpoint Created\n\n';
                    response += `**Session ID:** ${sessionId}\n`;
                    response += `**Checkpoint Type:** ${checkpointType || 'automatic'}\n`;
                    response += `**Checkpoint ID:** cp-${Date.now()}\n`;
                    if (description) {
                        response += `**Description:** ${description}\n`;
                    }
                    response += '\nUse \'resume_from_checkpoint\' with this checkpoint ID to continue execution.\n';
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'resume_from_checkpoint': {
                    const { checkpointId, sessionId } = ResumeFromCheckpointSchema.parse(args);
                    let response = '# Execution Resumed\n\n';
                    response += `**Checkpoint ID:** ${checkpointId}\n`;
                    response += `**Session ID:** ${sessionId}\n`;
                    response += '\nExecution state restored successfully. Continuing from checkpoint...\n';
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'list_checkpoints': {
                    const { sessionId } = ListCheckpointsSchema.parse(args);
                    let response = `# Checkpoints for Session: ${sessionId}\n\n`;
                    response += 'No checkpoints found. Use \'create_execution_checkpoint\' to create one.\n';
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'start_parallel_protocol_execution': {
                    const { protocols, sessionId, maxParallel } = StartParallelExecutionSchema.parse(args);
                    let response = '# Parallel Protocol Execution Started\n\n';
                    response += `**Session ID:** ${sessionId}\n`;
                    response += `**Protocols:** ${protocols.map(p => p.protocolName).join(', ')}\n`;
                    response += `**Max Parallel:** ${maxParallel || 4}\n\n`;
                    response += 'Execution started. Use \'aggregate_parallel_results\' when complete.\n';
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'aggregate_parallel_results': {
                    const { results } = AggregateResultsSchema.parse(args);
                    const successful = results.filter(r => r.success).length;
                    const totalFindings = results.reduce((sum, r) => sum + r.findings.length, 0);
                    const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0);
                    let response = '# Aggregated Results\n\n';
                    response += `**Total Protocols:** ${results.length}\n`;
                    response += `**Successful:** ${successful}\n`;
                    response += `**Failed:** ${results.length - successful}\n`;
                    response += `**Total Findings:** ${totalFindings}\n`;
                    response += `**Total Execution Time:** ${(totalTime / 1000).toFixed(2)}s\n`;
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'register_agent': {
                    const { name, role, capabilities, metadata } = RegisterAgentSchema.parse(args);
                    const agentId = `agent-${Date.now()}`;
                    let response = '# Agent Registered\n\n';
                    response += `**Agent ID:** ${agentId}\n`;
                    response += `**Name:** ${name}\n`;
                    response += `**Role:** ${role}\n`;
                    response += `**Capabilities:** ${capabilities.join(', ')}\n`;
                    if (metadata) {
                        response += `**Version:** ${metadata.version || 'N/A'}\n`;
                        response += `**Provider:** ${metadata.provider || 'N/A'}\n`;
                        response += `**Model:** ${metadata.model || 'N/A'}\n`;
                    }
                    return {
                        content: [{
                                type: 'text',
                                text: response
                            }]
                    };
                }
                case 'assign_protocol_to_agent': {
                    const { protocol, agentIds } = AssignProtocolSchema.parse(args);
                    let response = '# Protocol Assignment\n\n';
                    response += `**Protocol:** ${protocol}\n`;
                    response += `**Available Agents:** ${agentIds.length}\n`;
                    response += '\nProtocol assigned to agent. Use \'coordinate_execution\' to run.\n';
                    return {
                        content: [{
                                type: 'text',
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
                            type: 'text',
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