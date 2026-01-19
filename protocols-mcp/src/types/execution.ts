import { z } from 'zod';
import { ProjectContext } from './project-context.js';

export type SessionStatus = 'active' | 'paused' | 'completed' | 'failed' | 'archived';

export interface ExecutionSession {
  sessionId: string;
  taskDescription: string;
  projectContext: ProjectContext;
  executionStack: ProtocolExecution[];
  sharedContext: Map<string, unknown>;
  artifacts: ArtifactStore;
  metrics: MetricsCollector;
  checkpoints: Checkpoint[];
  createdAt: Date;
  updatedAt: Date;
  status: SessionStatus;
  metadata: SessionMetadata;
}

export interface ProtocolExecution {
  protocolName: string;
  trigger: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result: StandardResult;
  status: 'running' | 'completed' | 'failed';
  error?: Error;
  artifactIds: string[];
}

export type ArtifactType =
  | 'findings'
  | 'recommendations'
  | 'code_suggestions'
  | 'test_results'
  | 'metrics'
  | 'errors'
  | 'warnings'
  | 'other';

export interface ArtifactStore {
  [artifactId: string]: Artifact;
}

export interface Artifact {
  artifactId: string;
  sessionId: string;
  protocolName: string;
  artifactType: ArtifactType;
  data: unknown;
  createdAt: Date;
  expiresAt: Date;
  size: number;
  tags: string[];
}

export interface ArtifactInfo {
  artifactId: string;
  sessionId: string;
  protocolName: string;
  artifactType: ArtifactType;
  createdAt: Date;
  expiresAt: Date;
  size: number;
  tags: string[];
}

export interface ArtifactFilter {
  sessionId?: string;
  protocolName?: string;
  artifactType?: ArtifactType;
  expiresBefore?: Date;
  expiresAfter?: Date;
  tags?: string[];
}

export interface SessionMetadata {
  userId?: string;
  aiTool?: string;
  gitBranch?: string;
  source?: string;
  tags?: string[];
}

export interface SessionInfo {
  sessionId: string;
  taskDescription: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
  protocolCount: number;
  duration: number;
}

export interface SessionFilter {
  userId?: string;
  aiTool?: string;
  status?: SessionStatus;
  createdAfter?: Date;
  createdBefore?: Date;
  tags?: string[];
}

export interface Checkpoint {
  checkpointId: string;
  sessionId: string;
  protocolName: string;
  timestamp: Date;
  executionStack: ProtocolExecution[];
  sharedContext: Map<string, unknown>;
  metadata: CheckpointMetadata;
}

export interface CheckpointMetadata {
  checkpointType: 'manual' | 'automatic' | 'error_recovery';
  description?: string;
  protocolCount: number;
}

export interface MetricsCollector {
  sessionId: string;
  metrics: Metric[];
  startTime: Date;
  endTime?: Date;
}

export interface Metric {
  metricId: string;
  sessionId: string;
  protocolName: string;
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: string[];
}

export type MetricType =
  | 'execution_time'
  | 'cache_hit_rate'
  | 'memory_usage'
  | 'artifact_count'
  | 'finding_count'
  | 'recommendation_count'
  | 'error_count'
  | 'warning_count';

export interface StandardResult {
  protocolName: string;
  executionTime: number;
  timestamp: Date;
  success: boolean;
  findings: Finding[];
  recommendations: Recommendation[];
  artifacts: ArtifactReference[];
  nextSteps: NextStep[];
  metrics: ExecutionMetrics;
  errors?: ProtocolError[];
  warnings?: ProtocolWarning[];
}

export interface Finding {
  findingId: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  location?: string;
  codeSnippet?: string;
  impact?: string;
  evidence?: string[];
  tags?: string[];
}

export interface Recommendation {
  recommendationId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  description: string;
  codeExample?: string;
  impact?: string;
  effort?: 'quick' | 'moderate' | 'significant';
}

export interface NextStep {
  stepId: string;
  protocolName?: string;
  trigger?: string;
  action: string;
  reason: string;
  optional: boolean;
  estimatedEffort?: string;
}

export interface ArtifactReference {
  artifactId: string;
  artifactType: ArtifactType;
  description: string;
  relevanceScore?: number;
}

export interface ExecutionMetrics {
  protocolName: string;
  executionTime: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  memoryUsage: number;
  success: boolean;
}

export interface ProtocolError {
  errorId: string;
  errorType: string;
  message: string;
  stackTrace?: string;
  recoverable: boolean;
  timestamp: Date;
}

export interface ProtocolWarning {
  warningId: string;
  warningType: string;
  message: string;
  suggestion?: string;
  timestamp: Date;
}

export interface AggregatedResult {
  sessionId: string;
  taskDescription: string;
  protocolsExecuted: number;
  totalDuration: number;
  findings: Finding[];
  recommendations: Recommendation[];
  summary: string;
  nextSteps: NextStep[];
  metrics: AggregatedMetrics;
}

export interface AggregatedMetrics {
  protocolsExecuted: number;
  totalDuration: number;
  averageProtocolDuration: number;
  totalCacheHits: number;
  totalCacheMisses: number;
  overallCacheHitRate: number;
  peakMemoryUsage: number;
  successRate: number;
}

export const SessionStatusSchema = z.enum(['active', 'paused', 'completed', 'failed', 'archived']);
export const ArtifactTypeSchema = z.enum([
  'findings', 'recommendations', 'code_suggestions', 'test_results',
  'metrics', 'errors', 'warnings', 'other'
]);

export const FindingSchema = z.object({
  findingId: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string().optional(),
  codeSnippet: z.string().optional(),
  impact: z.string().optional(),
  evidence: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

export const RecommendationSchema = z.object({
  recommendationId: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  action: z.string(),
  description: z.string(),
  codeExample: z.string().optional(),
  impact: z.string().optional(),
  effort: z.enum(['quick', 'moderate', 'significant']).optional()
});

export const StandardResultSchema = z.object({
  protocolName: z.string(),
  executionTime: z.number().nonnegative(),
  timestamp: z.coerce.date(),
  success: z.boolean(),
  findings: z.array(FindingSchema),
  recommendations: z.array(RecommendationSchema),
  artifacts: z.array(z.object({
    artifactId: z.string(),
    artifactType: ArtifactTypeSchema,
    description: z.string(),
    relevanceScore: z.number().min(0).max(1).optional()
  })),
  nextSteps: z.array(z.any()),
  metrics: z.any(),
  errors: z.array(z.any()).optional(),
  warnings: z.array(z.any()).optional()
});
