/**
 * User Model
 * In production, this would connect to a database
 */

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transform user to response (never expose password hash - SECAUDIT)
export const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// In-memory storage (for demonstration only)
export const userStore: Map<string, User> = new Map();
