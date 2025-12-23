import { SearchIndex } from './indexer.js';
export interface SearchResult {
    protocol: string;
    score: number;
    matches: string[];
    excerpt: string;
}
export declare class SearchMatcher {
    /**
     * Full-text search across protocols
     */
    search(index: SearchIndex, query: string, options?: {
        category?: string;
        minScore?: number;
    }): SearchResult[];
    /**
     * Fuzzy match protocol name
     */
    fuzzyMatch(index: SearchIndex, name: string): Array<{
        protocol: string;
        similarity: number;
    }>;
    private calculateScore;
    private findMatches;
    private extractExcerpt;
    private levenshteinSimilarity;
    private levenshteinDistance;
}
//# sourceMappingURL=matcher.d.ts.map