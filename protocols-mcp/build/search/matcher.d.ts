import { SearchIndex } from './indexer.js';
import { ProjectContext } from '../utils/project-context-detector.js';
export interface SearchResult {
    protocol: string;
    score: number;
    matches: string[];
    excerpt: string;
    contextRelevance?: 'high' | 'medium' | 'low';
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
    /**
     * Re-rank search results based on project context
     * Prioritizes protocols relevant to user's tech stack
     */
    contextualizeResults(results: SearchResult[], context: ProjectContext): SearchResult[];
    private calculateScore;
    private findMatches;
    private extractExcerpt;
    private levenshteinSimilarity;
    private levenshteinDistance;
}
//# sourceMappingURL=matcher.d.ts.map