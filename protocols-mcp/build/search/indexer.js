export class ContentIndexer {
    index = null;
    /**
     * Build searchable index from protocols
     */
    buildIndex(protocols, contentMap) {
        const index = {
            protocols: new Map(),
            triggerMap: new Map(),
            categoryMap: new Map()
        };
        for (const protocol of protocols) {
            // Use unique key combining filePath and fileName to match index.ts
            const uniqueKey = `${protocol.filePath}/${protocol.fileName}`;
            const content = contentMap.get(uniqueKey) || '';
            const tokens = this.tokenize(content);
            index.protocols.set(protocol.name, {
                metadata: protocol,
                content,
                tokens
            });
            // Build trigger reverse index
            // Guard against undefined/null triggers
            if (protocol.triggers && Array.isArray(protocol.triggers)) {
                for (const trigger of protocol.triggers) {
                    const existing = index.triggerMap.get(trigger) || [];
                    // Prevent duplicates
                    if (!existing.includes(protocol.name)) {
                        existing.push(protocol.name);
                        index.triggerMap.set(trigger, existing);
                    }
                }
            }
            // Build category index - guard against undefined category
            const categoryKey = protocol.category ?? 'uncategorized';
            const categoryExisting = index.categoryMap.get(categoryKey) || [];
            // Prevent duplicates
            if (!categoryExisting.includes(protocol.name)) {
                categoryExisting.push(protocol.name);
                index.categoryMap.set(categoryKey, categoryExisting);
            }
        }
        this.index = index;
        return index;
    }
    /**
     * Tokenize content for searching
     * @param content - Content to tokenize (can be null or undefined)
     */
    tokenize(content) {
        // Handle null/undefined by defaulting to empty string
        const safeContent = content ?? '';
        return safeContent
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 2);
    }
    getIndex() {
        return this.index;
    }
}
//# sourceMappingURL=indexer.js.map