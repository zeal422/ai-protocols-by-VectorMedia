import { SearchIndex, SearchableProtocol } from './indexer.js';
import { ProjectContext } from '../utils/project-context-detector.js';

export interface SearchResult {
  protocol: string;
  score: number;
  matches: string[];
  excerpt: string;
  contextRelevance?: 'high' | 'medium' | 'low';
}

export class SearchMatcher {
  /**
   * Full-text search across protocols
   */
  search(index: SearchIndex, query: string, options?: {
    category?: string;
    minScore?: number;
  }): SearchResult[] {
    // Handle empty or whitespace-only queries
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return [];
    }
    
    const queryTokens = trimmedQuery.toLowerCase().split(/\s+/).filter(token => token.length > 0);
    
    // If all tokens were filtered out, return empty results
    if (queryTokens.length === 0) {
      return [];
    }
    
    const results: SearchResult[] = [];

    for (const [name, searchable] of index.protocols) {
      // Filter by category if specified
      if (options?.category && searchable.metadata.category !== options.category) {
        continue;
      }

      const score = this.calculateScore(queryTokens, searchable);
      if (score > (options?.minScore || 0)) {
        results.push({
          protocol: name,
          score,
          matches: this.findMatches(queryTokens, searchable.content),
          excerpt: this.extractExcerpt(queryTokens, searchable.content)
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Fuzzy match protocol name
   */
  fuzzyMatch(index: SearchIndex, name: string): Array<{ protocol: string; similarity: number }> {
    const results: Array<{ protocol: string; similarity: number }> = [];

    for (const [protocolName, searchable] of index.protocols) {
      const similarity = this.levenshteinSimilarity(
        name.toLowerCase(),
        protocolName.toLowerCase()
      );

      if (similarity > 0.3) {
        results.push({ protocol: protocolName, similarity });
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Re-rank search results based on project context
   * Prioritizes protocols relevant to user's tech stack
   */
  contextualizeResults(results: SearchResult[], context: ProjectContext): SearchResult[] {
    if (!context.detected) {
      return results;
    }

    // Re-score based on context
    const contextualizedResults = results.map(result => {
      let contextBonus = 0;
      let languageMatched = false;
      let frameworkMatched = false;
      let platformMatched = false;
      
      // Simple context matching based on protocol name patterns
      const lowerName = result.protocol.toLowerCase();
      const lowerLanguage = context.language?.toLowerCase() || '';
      const lowerFramework = context.framework?.toLowerCase() || '';

      // Language-specific boost
      if (lowerLanguage && lowerName.includes(lowerLanguage)) {
        contextBonus += 5;
        languageMatched = true;
      }

      // Framework-specific boost
      if (lowerFramework && lowerFramework !== 'unknown' && lowerName.includes(lowerFramework)) {
        contextBonus += 5;
        frameworkMatched = true;
      }

      // Platform type boost
      if (context.projectType === 'frontend') {
        if (lowerName.includes('frontend') || lowerName.includes('react') || lowerName.includes('accessibility') || lowerName.includes('aria')) {
          contextBonus += 3;
          platformMatched = true;
        }
      } else if (context.projectType === 'backend') {
        if (lowerName.includes('backend') || lowerName.includes('api') || lowerName.includes('database') || lowerName.includes('performance')) {
          contextBonus += 3;
          platformMatched = true;
        }
      }

      // Determine relevance based on matches and contextBonus
      // languageMatched || frameworkMatched already implies contextBonus >= 5
      let relevance: 'high' | 'medium' | 'low' = 'low';
      if (languageMatched || frameworkMatched) {
        relevance = 'high';
      } else if (contextBonus >= 3) {
        relevance = 'medium';
      }

      return {
        ...result,
        score: result.score + contextBonus,
        contextRelevance: relevance
      };
    });

    // Re-sort by new score
    return contextualizedResults.sort((a, b) => b.score - a.score);
  }

  private calculateScore(queryTokens: string[], searchable: SearchableProtocol): number {
    let score = 0;
    const lowerTitle = searchable.metadata.title.toLowerCase();
    const lowerPurpose = searchable.metadata.purpose.toLowerCase();

    for (const token of queryTokens) {
      // Title match (highest weight)
      if (lowerTitle.includes(token)) {
        score += 10;
      }

      // Trigger match
      if (searchable.metadata.triggers.some(t => t.toLowerCase().includes(token))) {
        score += 8;
      }

      // Purpose match
      if (lowerPurpose.includes(token)) {
        score += 5;
      }

      // Token match (content)
      const tokenCount = searchable.tokens.filter(t => t.includes(token)).length;
      score += Math.min(tokenCount, 10);
    }

    return score;
  }

  private findMatches(queryTokens: string[], content: string): string[] {
    const matches: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (queryTokens.some(token => lowerLine.includes(token))) {
        matches.push(line.trim());
        if (matches.length >= 3) break;
      }
    }

    return matches;
  }

  private extractExcerpt(queryTokens: string[], content: string, contextLength = 150): string {
    // Find first matching token position
    const lowerContent = content.toLowerCase();
    let firstMatchIndex = -1;
    
    for (const token of queryTokens) {
      const index = lowerContent.indexOf(token);
      if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
        firstMatchIndex = index;
      }
    }

    if (firstMatchIndex === -1) {
      return content.substring(0, contextLength) + '...';
    }

    const start = Math.max(0, firstMatchIndex - contextLength / 2);
    const end = Math.min(content.length, firstMatchIndex + contextLength / 2);
    
    return (start > 0 ? '...' : '') + 
           content.substring(start, end) + 
           (end < content.length ? '...' : '');
  }

  private levenshteinSimilarity(a: string, b: string): number {
    const distance = this.levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}
