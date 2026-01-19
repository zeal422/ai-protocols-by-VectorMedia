// Re-export extended metadata types
export { DifficultyEnum, CategoryEnum, validateFrontmatter, hasFrontmatter } from './protocol-frontmatter.js';
// Export new Phase 1 types
export * from './project-context.js';
export * from './execution.js';
export * from './database.js';
export { ProtocolError as ProtocolErrorType, SessionNotFoundError, ArtifactNotFoundError, DatabaseError, ValidationErrorExt } from './errors.js';
//# sourceMappingURL=index.js.map