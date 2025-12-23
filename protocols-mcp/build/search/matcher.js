export class SearchMatcher {
    /**
     * Full-text search across protocols
     */
    search(index, query, options) {
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
        const results = [];
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
    fuzzyMatch(index, name) {
        const results = [];
        for (const [protocolName, searchable] of index.protocols) {
            const similarity = this.levenshteinSimilarity(name.toLowerCase(), protocolName.toLowerCase());
            if (similarity > 0.3) {
                results.push({ protocol: protocolName, similarity });
            }
        }
        return results.sort((a, b) => b.similarity - a.similarity);
    }
    calculateScore(queryTokens, searchable) {
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
    findMatches(queryTokens, content) {
        const matches = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (queryTokens.some(token => lowerLine.includes(token))) {
                matches.push(line.trim());
                if (matches.length >= 3)
                    break;
            }
        }
        return matches;
    }
    extractExcerpt(queryTokens, content, contextLength = 150) {
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
    levenshteinSimilarity(a, b) {
        const distance = this.levenshteinDistance(a, b);
        const maxLength = Math.max(a.length, b.length);
        return maxLength === 0 ? 1 : 1 - distance / maxLength;
    }
    levenshteinDistance(a, b) {
        const matrix = [];
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
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[b.length][a.length];
    }
}
//# sourceMappingURL=matcher.js.map