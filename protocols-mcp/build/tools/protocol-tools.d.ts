import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ProtocolScanner } from '../scanner/protocol-scanner.js';
import { ContentIndexer } from '../search/indexer.js';
import { SearchMatcher } from '../search/matcher.js';
import { ProjectContext } from '../types/project-context.js';
import { DependencyResolver } from '../intelligence/dependency-resolver.js';
import { IntentRefinement } from '../intelligence/intent-refinement.js';
import { MetricsCollector } from '../intelligence/metrics-collector.js';
import { WorkflowEngine } from '../adaptation/workflow-engine.js';
import { ErrorRecoverySystem } from '../adaptation/error-recovery.js';
import { RiskAssessmentEngine } from '../adaptation/risk-assessment.js';
export declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            category: {
                type: string;
                description: string;
            };
            name?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            trigger: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            category: {
                type: string;
                description: string;
            };
            name?: undefined;
            trigger?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            description: {
                type: string;
                description: string;
            };
            taskType: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            protocol: {
                type: string;
                description: string;
            };
            includeOptional: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            description: {
                type: string;
                description: string;
            };
            clarifications: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        questionId: {
                            type: string;
                        };
                        answer: {
                            type: string;
                        };
                    };
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
            protocolName: {
                type: string;
                description: string;
            };
            executionTimeMs: {
                type: string;
                description: string;
            };
            success: {
                type: string;
                description: string;
            };
            findingsCount: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            taskType: {
                type: string;
                description: string;
            };
            currentProtocols: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            protocol: {
                type: string;
                description: string;
            };
            timeRange: {
                type: string;
                description: string;
                properties: {
                    start: {
                        type: string;
                    };
                    end: {
                        type: string;
                    };
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            taskDescription: {
                type: string;
                description: string;
            };
            projectContext: {
                type: string;
                description: string;
                properties: {
                    language: {
                        type: string;
                    };
                    framework: {
                        type: string;
                    };
                    projectType: {
                        type: string;
                    };
                };
            };
            previousResults: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        protocol: {
                            type: string;
                        };
                        findingsCount: {
                            type: string;
                        };
                        success: {
                            type: string;
                        };
                    };
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            file: {
                type: string;
                description: string;
            };
            changeType: {
                type: string;
                enum: string[];
                description: string;
            };
            scope: {
                type: string;
                enum: string[];
                description: string;
            };
            affectedAreas: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            isAuthentication: {
                type: string;
                description: string;
            };
            isAuthorization: {
                type: string;
                description: string;
            };
            isPayment: {
                type: string;
                description: string;
            };
            isDatabaseMigration: {
                type: string;
                description: string;
            };
            changeSize: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            errorMessage: {
                type: string;
                description: string;
            };
            protocol: {
                type: string;
                description: string;
            };
            context: {
                type: string;
                description: string;
                properties: {
                    sessionId: {
                        type: string;
                    };
                    executedProtocols: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            errorClass: {
                type: string;
                description: string;
            };
            strategyName: {
                type: string;
                description: string;
            };
            sessionId: {
                type: string;
                description: string;
            };
            protocol: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
            level: {
                type: string;
                enum: string[];
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
            checkpointType: {
                type: string;
                enum: string[];
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            checkpointId: {
                type: string;
                description: string;
            };
            sessionId: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            protocols: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        protocolName: {
                            type: string;
                        };
                        trigger: {
                            type: string;
                        };
                        order: {
                            type: string;
                        };
                    };
                };
            };
            sessionId: {
                type: string;
                description: string;
            };
            maxParallel: {
                type: string;
                description: string;
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            results: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        protocolName: {
                            type: string;
                        };
                        success: {
                            type: string;
                        };
                        findings: {
                            type: string;
                        };
                        executionTime: {
                            type: string;
                        };
                    };
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            role: {
                type: string;
                enum: string[];
                description: string;
            };
            capabilities: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            metadata: {
                type: string;
                description: string;
                properties: {
                    version: {
                        type: string;
                    };
                    provider: {
                        type: string;
                    };
                    model: {
                        type: string;
                    };
                };
            };
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            protocol?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            agentIds?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            protocol: {
                type: string;
                description: string;
            };
            agentIds: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            name?: undefined;
            category?: undefined;
            trigger?: undefined;
            query?: undefined;
            description?: undefined;
            taskType?: undefined;
            includeOptional?: undefined;
            clarifications?: undefined;
            sessionId?: undefined;
            protocolName?: undefined;
            executionTimeMs?: undefined;
            success?: undefined;
            findingsCount?: undefined;
            currentProtocols?: undefined;
            timeRange?: undefined;
            taskDescription?: undefined;
            projectContext?: undefined;
            previousResults?: undefined;
            file?: undefined;
            changeType?: undefined;
            scope?: undefined;
            affectedAreas?: undefined;
            isAuthentication?: undefined;
            isAuthorization?: undefined;
            isPayment?: undefined;
            isDatabaseMigration?: undefined;
            changeSize?: undefined;
            errorMessage?: undefined;
            context?: undefined;
            errorClass?: undefined;
            strategyName?: undefined;
            level?: undefined;
            checkpointType?: undefined;
            checkpointId?: undefined;
            protocols?: undefined;
            maxParallel?: undefined;
            results?: undefined;
            role?: undefined;
            capabilities?: undefined;
            metadata?: undefined;
        };
        required: string[];
    };
})[];
export declare function registerProtocolTools(server: Server, scanner: ProtocolScanner, indexer: ContentIndexer, matcher: SearchMatcher, protocolsRoot: string, projectContext?: ProjectContext, dependencyResolver?: DependencyResolver, intentRefinement?: IntentRefinement, metricsCollector?: MetricsCollector, workflowEngine?: WorkflowEngine, errorRecoverySystem?: ErrorRecoverySystem, riskAssessmentEngine?: RiskAssessmentEngine): void;
//# sourceMappingURL=protocol-tools.d.ts.map