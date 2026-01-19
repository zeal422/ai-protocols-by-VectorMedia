#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { InitializeRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ProtocolScanner } from './scanner/protocol-scanner.js';
import { ContentIndexer } from './search/indexer.js';
import { SearchMatcher } from './search/matcher.js';
import { registerProtocolTools } from './tools/protocol-tools.js';
import { resolveProtocolsRoot } from './utils/path-resolver.js';
import { detectProjectContext, describeContext } from './utils/project-context-detector.js';
import { DependencyResolver } from './intelligence/dependency-resolver.js';
import { IntentRefinement } from './intelligence/intent-refinement.js';
import { MetricsCollector } from './intelligence/metrics-collector.js';
import { WorkflowEngine } from './adaptation/workflow-engine.js';
import { ErrorRecoverySystem } from './adaptation/error-recovery.js';
import { RiskAssessmentEngine } from './adaptation/risk-assessment.js';
import { FileStorage } from './storage/database.js';
import * as fs from 'fs/promises';
import path from 'path';

const SERVER_INFO = {
  name: 'ai-protocols',
  version: '2.3.2'
};

const SERVER_CAPABILITIES = {
  tools: {},
  resources: {}
};

async function main(): Promise<void> {
  // Create server with info and capabilities
  const server = new Server(SERVER_INFO, {
    capabilities: SERVER_CAPABILITIES
  });

  try {
    // Initialize core components
    const protocolsRoot = resolveProtocolsRoot();
    console.error(`Protocols root: ${protocolsRoot}`);

    // Detect project context
    console.error('Detecting project context...');
    const projectContext = await detectProjectContext(protocolsRoot);
    console.error(`Project context: ${describeContext(projectContext)}`);

    const scanner = new ProtocolScanner(protocolsRoot);
    const indexer = new ContentIndexer();
    const matcher = new SearchMatcher();

    // Build search index
    console.error('Building search index...');
    const protocols = await scanner.scanProtocols();
    const contentMap = new Map<string, string>();
    let readErrors = 0;

    for (const protocol of protocols) {
      try {
        // Security: validate path stays within protocolsRoot
        const rawPath = path.join(protocol.filePath, protocol.fileName);
        const resolvedPath = path.resolve(protocolsRoot, rawPath);
        const resolvedRoot = path.resolve(protocolsRoot);
        
        // Check for path traversal attempt
        const relativePath = path.relative(resolvedRoot, resolvedPath);
        if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
          console.error(`Warning: Skipping protocol with invalid path: ${protocol.name}`);
          readErrors++;
          continue;
        }

        // Async file reading
        const content = await fs.readFile(resolvedPath, 'utf-8');
        // Use unique key combining filePath and fileName to prevent collisions
        const uniqueKey = `${protocol.filePath}/${protocol.fileName}`;
        contentMap.set(uniqueKey, content);
      } catch (error) {
        console.error(`Warning: Failed to read protocol ${protocol.fileName}:`, 
          error instanceof Error ? error.message : error);
        readErrors++;
      }
    }

    if (readErrors > 0) {
      console.error(`Warning: ${readErrors} protocol(s) could not be read`);
    }
    
    indexer.buildIndex(protocols, contentMap);
    console.error(`Indexed ${protocols.length} protocols`);

    // Initialize Phase 2 services
    console.error('Initializing Phase 2 intelligence services...');
    const dependencyResolver = new DependencyResolver(protocols);
    const intentRefinement = new IntentRefinement();
    
    const storage = new FileStorage();
    await storage.connect();
    const metricsCollector = new MetricsCollector(storage);
    await metricsCollector.initialize();
    console.error('Phase 2 services initialized');

    // Initialize Phase 3 adaptation services
    console.error('Initializing Phase 3 adaptation services...');
    const workflowEngine = new WorkflowEngine(protocols);
    const errorRecoverySystem = new ErrorRecoverySystem(protocols);
    const riskAssessmentEngine = new RiskAssessmentEngine();
    console.error('Phase 3 adaptation services initialized');

    // Handle initialization
    server.setRequestHandler(InitializeRequestSchema, async () => {
      return {
        protocolVersion: '2024-11-05',
        capabilities: SERVER_CAPABILITIES,
        serverInfo: SERVER_INFO
      };
    });

    // Register tools with Phase 2 services
    registerProtocolTools(
      server, 
      scanner, 
      indexer, 
      matcher, 
      protocolsRoot, 
      undefined,
      dependencyResolver,
      intentRefinement,
      metricsCollector,
      workflowEngine,
      errorRecoverySystem,
      riskAssessmentEngine
    );

    // Start server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('AI Protocols MCP server v2.0 running on stdio');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught rejections from main()
main().catch(err => {
  console.error('Uncaught error in main:', err && err.stack ? err.stack : err);
  process.exit(1);
});
