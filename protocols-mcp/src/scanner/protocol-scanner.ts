import * as fs from 'fs/promises';
import fssync from 'fs';
import path from 'path';
import { ProtocolMetadata } from '../types/index.js';
import { extractMetadata } from './metadata-extractor.js';
import { handleError } from '../utils/error-handler.js';

export class ProtocolScanner {
  private brainPath: string;
  private cache: ProtocolMetadata[] | null = null;

  constructor(protocolsRootPath: string) {
    this.brainPath = path.join(protocolsRootPath, 'BRAIN');
    
    // Validate that BRAIN directory exists and is accessible
    this.validateBrainPath();
  }

  /**
   * Validate that the BRAIN directory exists and is accessible
   */
  private validateBrainPath(): void {
    try {
      const stats = fssync.statSync(this.brainPath);
      if (!stats.isDirectory()) {
        throw new Error(`BRAIN path is not a directory: ${this.brainPath}`);
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`BRAIN directory not found at: ${this.brainPath}`);
      }
      throw new Error(`BRAIN directory is not accessible: ${this.brainPath}`);
    }
  }

  /**
   * Scan BRAIN/ directory and extract all protocol metadata
   * Implements caching for performance
   */
  async scanProtocols(): Promise<ProtocolMetadata[]> {
    if (this.cache) return this.cache;

    try {
      const files = await fs.readdir(this.brainPath);
      const protocols: ProtocolMetadata[] = [];

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(this.brainPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const metadata = extractMetadata(file, content);
        
        protocols.push(metadata);
      }

      this.cache = protocols;
      return protocols;
    } catch (error) {
      throw handleError(error, 'Failed to scan protocols directory');
    }
  }

  /**
   * Get protocol by exact name
   */
  async getProtocol(name: string): Promise<ProtocolMetadata | null> {
    const protocols = await this.scanProtocols();
    const normalizedName = name.replace(/\.md$/, ''); // Only remove trailing .md
    return protocols.find(p => 
      p.fileName === name || 
      p.fileName === `${normalizedName}.md` ||
      p.name === normalizedName ||
      p.name === name
    ) || null;
  }

  /**
   * Find protocol by trigger command
   */
  async getProtocolByTrigger(trigger: string): Promise<ProtocolMetadata | null> {
    const protocols = await this.scanProtocols();
    const normalizedTrigger = trigger.toUpperCase();
    return protocols.find(p => 
      p.triggers.includes(normalizedTrigger)
    ) || null;
  }

  /**
   * Clear cache (for testing)
   */
  clearCache(): void {
    this.cache = null;
  }
}
