#!/usr/bin/env node
// @ts-ignore - MCP SDK types may not be fully compatible
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// @ts-ignore - MCP SDK types may not be fully compatible
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// @ts-ignore - MCP SDK types may not be fully compatible
import { InitializeRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ProtocolScanner } from "./scanner/protocol-scanner.js";
import { ContentIndexer } from "./search/indexer.js";
import { SearchMatcher } from "./search/matcher.js";
import { registerProtocolTools } from "./tools/protocol-tools.js";
import { resolveProtocolsRoot } from "./utils/path-resolver.js";
import * as fs from 'fs/promises';
import path from 'path';

const SERVER_INFO = {
  name: "ai-protocols",
  version: "2.0.0"
};

const SERVER_CAPABILITIES = {
  tools: {},
  resources: {}
};

async function main() {
  // Create server with info and capabilities
  const server = new Server(SERVER_INFO, {
    capabilities: SERVER_CAPABILITIES
  });

  try {
    // Initialize core components
    const protocolsRoot = resolveProtocolsRoot();
    console.error(`Protocols root: ${protocolsRoot}`);

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

    // Handle initialization
    server.setRequestHandler(InitializeRequestSchema, async () => {
      return {
        protocolVersion: "2024-11-05",
        capabilities: SERVER_CAPABILITIES,
        serverInfo: SERVER_INFO
      };
    });

    // Register tools
    registerProtocolTools(server, scanner, indexer, matcher, protocolsRoot);

    // Start server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AI Protocols MCP server v2.0 running on stdio");
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught rejections from main()
main().catch(err => {
  console.error("Uncaught error in main:", err && err.stack ? err.stack : err);
  process.exit(1);
});
