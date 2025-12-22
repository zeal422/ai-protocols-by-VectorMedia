/**
 * User Routes following API Design Protocol
 * RESTful endpoints with proper authorization
 */
import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate, userUpdateSchema } from '../utils/validation';
import { userStore, toUserResponse } from '../models/User';
import { UnauthorizedError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/me', (req: AuthRequest, res: Response) => {
  const user = userStore.get(req.userId!);
  
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  // API Design Protocol - consistent data envelope
  res.json({
    data: {
      user: toUserResponse(user),
    },
  });
});

// Update current user profile
router.patch('/me', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = userStore.get(req.userId!);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Validate update data
    const updates = validate(userUpdateSchema, req.body);

    // Check email uniqueness if changing email
    if (updates.email && updates.email !== user.email) {
      const existingUser = Array.from(userStore.values()).find(
        u => u.email === updates.email && u.id !== user.id
      );
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Apply updates
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    userStore.set(user.id, updatedUser);

    // API Design Protocol - 200 OK with updated resource
    res.json({
      data: {
        user: toUserResponse(updatedUser),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete current user account
router.delete('/me', (req: AuthRequest, res: Response) => {
  const deleted = userStore.delete(req.userId!);
  
  if (!deleted) {
    throw new UnauthorizedError('User not found');
  }

  // API Design Protocol - 204 No Content for successful deletion
  res.status(204).send();
});

// List all users (admin-like endpoint for demonstration)
router.get('/', (_req: AuthRequest, res: Response) => {
  const users = Array.from(userStore.values()).map(toUserResponse);

  // API Design Protocol - collection response with metadata
  res.json({
    data: {
      users,
      total: users.length,
    },
  });
});

export default router;
