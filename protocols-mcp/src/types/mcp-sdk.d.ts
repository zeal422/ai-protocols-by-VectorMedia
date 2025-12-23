// Type declarations for @modelcontextprotocol/sdk
// This helps TypeScript resolve the module imports

declare module '@modelcontextprotocol/sdk/dist/server/index.js' {
  import { Server } from '@modelcontextprotocol/sdk/dist/server/index';
  export { Server };
}

declare module '@modelcontextprotocol/sdk/dist/server/stdio.js' {
  import { StdioServerTransport } from '@modelcontextprotocol/sdk/dist/server/stdio';
  export { StdioServerTransport };
}

declare module '@modelcontextprotocol/sdk/dist/types.js' {
  export * from '@modelcontextprotocol/sdk/dist/types';
}
