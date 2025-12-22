/**
 * Authentication Routes following API Design Protocol
 * Standard endpoints with proper status codes
 */
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { validate, userRegisterSchema, userLoginSchema } from '../utils/validation';
import { userStore, toUserResponse, User } from '../models/User';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler';
import { authRateLimiter } from '../middleware/rateLimiter';
import { logSecurityEvent } from '../config/logger';

const router = Router();

// Register endpoint
router.post('/register', authRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input (SECAUDIT - prevent injection)
    const data = validate(userRegisterSchema, req.body);

    // Check if user exists
    const existingUser = Array.from(userStore.values()).find(u => u.email === data.email);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password (SECAUDIT - bcrypt with proper cost)
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user: User = {
      id: uuidv4(),
      email: data.email,
      name: data.name,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userStore.set(user.id, user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log security event
    logSecurityEvent('user_registered', { userId: user.id, email: user.email });

    // API Design Protocol - 201 Created with consistent envelope
    res.status(201).json({
      data: {
        user: toUserResponse(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login endpoint
router.post('/login', authRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const data = validate(userLoginSchema, req.body);

    // Find user
    const user = Array.from(userStore.values()).find(u => u.email === data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      logSecurityEvent('login_failed', { email: data.email, reason: 'invalid_password' });
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logSecurityEvent('login_success', { userId: user.id, email: user.email });

    // API Design Protocol - 200 OK with data envelope
    res.json({
      data: {
        user: toUserResponse(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
