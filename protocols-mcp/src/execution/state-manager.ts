import { v4 as uuidv4 } from 'uuid';
import {
  Artifact,
  ArtifactType,
  ArtifactInfo
} from '../types/execution.js';
import { StorageAdapter } from '../types/database.js';
import { ArtifactNotFoundError, DatabaseError } from '../types/errors.js';

const ARTIFACT_TTL_MS: Record<ArtifactType, number> = {
  findings: 24 * 60 * 60 * 1000,
  recommendations: 24 * 60 * 60 * 1000,
  code_suggestions: 60 * 60 * 1000,
  test_results: 6 * 60 * 60 * 1000,
  metrics: 24 * 60 * 60 * 1000,
  errors: 24 * 60 * 60 * 1000,
  warnings: 24 * 60 * 60 * 1000,
  other: 60 * 60 * 1000
};

interface CacheEntry {
  artifact: Artifact;
  expiresAt: Date;
}

export class StateManager {
  private storage: StorageAdapter;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly maxCacheSize = 500;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  async setSharedState(sessionId: string, key: string, value: unknown): Promise<void> {
    const artifact: Artifact = {
      artifactId: uuidv4(),
      sessionId,
      protocolName: 'state_manager',
      artifactType: 'other',
      data: value,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + ARTIFACT_TTL_MS.other),
      size: JSON.stringify(value).length,
      tags: ['shared_state', key]
    };

    await this.storage.createArtifact(artifact);
    this.addToCache(artifact);
  }

  async getSharedState(sessionId: string, key: string): Promise<unknown> {
    const artifacts = await this.storage.listArtifacts({
      sessionId,
      tags: ['shared_state', key]
    });

    if (artifacts.length === 0) {
      return null;
    }

    const latestArtifact = artifacts.sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];

    return latestArtifact.data;
  }

  async deleteSharedState(sessionId: string, key: string): Promise<void> {
    const artifacts = await this.storage.listArtifacts({
      sessionId,
      tags: ['shared_state', key]
    });

    for (const artifact of artifacts) {
      await this.storage.deleteArtifact(artifact.artifactId);
      this.cache.delete(artifact.artifactId);
    }
  }

  async cacheArtifact(
    sessionId: string,
    artifactType: ArtifactType,
    data: unknown,
    ttl?: string
  ): Promise<string> {
    const ttlMs = ttl ? this.parseTTL(ttl) : ARTIFACT_TTL_MS[artifactType];
    const artifactId = uuidv4();

    const artifact: Artifact = {
      artifactId,
      sessionId,
      protocolName: 'cache',
      artifactType,
      data,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + ttlMs),
      size: JSON.stringify(data).length,
      tags: [artifactType]
    };

    await this.storage.createArtifact(artifact);
    this.addToCache(artifact);

    return artifactId;
  }

  async retrieveArtifact(sessionId: string, artifactId: string): Promise<unknown> {
    const cached = this.cache.get(artifactId);
    if (cached && cached.expiresAt > new Date()) {
      return cached.artifact.data;
    }

    const artifact = await this.storage.getArtifact(artifactId);
    if (!artifact) {
      throw new ArtifactNotFoundError(artifactId);
    }

    if (artifact.sessionId !== sessionId) {
      throw new DatabaseError(`Artifact ${artifactId} does not belong to session ${sessionId}`);
    }

    this.addToCache(artifact);
    return artifact.data;
  }

  async listArtifacts(
    sessionId: string,
    type?: ArtifactType
  ): Promise<ArtifactInfo[]> {
    const artifacts = await this.storage.listArtifacts({
      sessionId,
      artifactType: type
    });

    return artifacts.map(artifact => ({
      artifactId: artifact.artifactId,
      sessionId: artifact.sessionId,
      protocolName: artifact.protocolName,
      artifactType: artifact.artifactType,
      createdAt: artifact.createdAt,
      expiresAt: artifact.expiresAt,
      size: artifact.size,
      tags: artifact.tags
    }));
  }

  async isCacheValid(artifactId: string): Promise<boolean> {
    try {
      const artifact = await this.storage.getArtifact(artifactId);
      if (!artifact) {
        return false;
      }

      const isValid = artifact.expiresAt > new Date();
      if (!isValid) {
        await this.storage.deleteArtifact(artifactId);
        this.cache.delete(artifactId);
      }

      return isValid;
    } catch {
      return false;
    }
  }

  async invalidateCache(sessionId: string): Promise<void> {
    const artifacts = await this.storage.listArtifacts({ sessionId });

    for (const artifact of artifacts) {
      this.cache.delete(artifact.artifactId);
    }
  }

  async cleanupExpiredArtifacts(): Promise<number> {
    const now = new Date();
    let count = 0;

    for (const [artifactId, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(artifactId);
        count++;
      }
    }

    const dbCount = await this.storage.cleanupExpiredArtifacts(now);
    return count + dbCount;
  }

  private addToCache(artifact: Artifact): void {
    if (this.cache.size >= this.maxCacheSize) {
      const entries = Array.from(this.cache.entries());
      const expiredEntries = entries.filter((entry) => entry[1].expiresAt < new Date());

      for (const [id] of expiredEntries) {
        this.cache.delete(id);
      }

      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }
    }

    this.cache.set(artifact.artifactId, {
      artifact,
      expiresAt: artifact.expiresAt
    });
  }

  private parseTTL(ttl: string): number {
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return ARTIFACT_TTL_MS.other;
    }

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return ARTIFACT_TTL_MS.other;
    }
  }
}
