export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export class ProtocolError extends Error {
  code: string;
  details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'ProtocolError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ProtocolError.prototype);
  }
}

export class SessionNotFoundError extends ProtocolError {
  constructor(sessionId: string) {
    super(`Session not found: ${sessionId}`, 'SESSION_NOT_FOUND', { sessionId });
    Object.setPrototypeOf(this, SessionNotFoundError.prototype);
  }
}

export class ArtifactNotFoundError extends ProtocolError {
  constructor(artifactId: string) {
    super(`Artifact not found: ${artifactId}`, 'ARTIFACT_NOT_FOUND', { artifactId });
    Object.setPrototypeOf(this, ArtifactNotFoundError.prototype);
  }
}

export class DatabaseError extends ProtocolError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationErrorExt extends ProtocolError {
  constructor(message: string, errors: ValidationError[]) {
    super(message, 'VALIDATION_ERROR', { errors });
    Object.setPrototypeOf(this, ValidationErrorExt.prototype);
  }
}
