import { ProtocolMetadata } from '../types/index.js';
export interface SearchIndex {
    protocols: Map<string, SearchableProtocol>;
    triggerMap: Map<string, string[]>;
    categoryMap: Map<string, string[]>;
}
export interface SearchableProtocol {
    metadata: ProtocolMetadata;
    content: string;
    tokens: string[];
}
export declare class ContentIndexer {
    private index;
    /**
     * Build searchable index from protocols
     */
    buildIndex(protocols: ProtocolMetadata[], contentMap: Map<string, string>): SearchIndex;
    /**
     * Tokenize content for searching
     * @param content - Content to tokenize (can be null or undefined)
     */
    private tokenize;
    getIndex(): SearchIndex | null;
}
//# sourceMappingURL=indexer.d.ts.map