import { ProtocolMetadata } from '../types/index.js';
export declare class ProtocolScanner {
    private brainPath;
    private cache;
    constructor(protocolsRootPath: string);
    /**
     * Validate that the BRAIN directory exists and is accessible
     */
    private validateBrainPath;
    /**
     * Scan BRAIN/ directory and extract all protocol metadata
     * Implements caching for performance
     */
    scanProtocols(): Promise<ProtocolMetadata[]>;
    /**
     * Get protocol by exact name
     */
    getProtocol(name: string): Promise<ProtocolMetadata | null>;
    /**
     * Find protocol by trigger command
     */
    getProtocolByTrigger(trigger: string): Promise<ProtocolMetadata | null>;
    /**
     * Clear cache (for testing)
     */
    clearCache(): void;
}
//# sourceMappingURL=protocol-scanner.d.ts.map