/**
 * Error Handler following Debug Protocol
 * Generic errors in production, detailed in development
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  // Log error (never log sensitive data - SECAUDIT protocol)
  logger.error('Error occurred', {
    code,
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Generic error response (SECAUDIT - don't leak stack traces)
  res.status(statusCode).json({
    error: {
      code,
      message: process.env.NODE_ENV === 'production'
        ? 'An error occurred processing your request'
        : err.message,
    },
  });
};

export class ValidationError extends Error implements AppError {
  statusCode = 422;
  code = 'VALIDATION_ERROR';
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  isOperational = true;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
