import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ProtocolScanner } from "../scanner/protocol-scanner.js";
import { ContentIndexer } from "../search/indexer.js";
import { SearchMatcher } from "../search/matcher.js";
import { ProjectContext } from "../utils/project-context-detector.js";
export declare function registerProtocolTools(server: Server, scanner: ProtocolScanner, indexer: ContentIndexer, matcher: SearchMatcher, protocolsRoot: string, projectContext?: ProjectContext): void;
//# sourceMappingURL=protocol-tools.d.ts.map