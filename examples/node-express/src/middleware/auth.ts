/**
 * Authentication Middleware following Security Audit Protocol
 * JWT validation with proper error handling
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler';
import { logSecurityEvent } from '../config/logger';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify token (SECAUDIT - expired tokens rejected)
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    // Log failed authentication attempt (SECAUDIT protocol)
    logSecurityEvent('auth_failure', {
      ip: req.ip,
      path: req.path,
      reason: error instanceof Error ? error.message : 'unknown',
    });

    next(new UnauthorizedError('Invalid or expired token'));
  }
};
