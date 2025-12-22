/**
 * Unit Tests for Validation following FULLSPEC Protocol
 */
import { validate, userRegisterSchema, userLoginSchema, sanitizeString } from '../../src/utils/validation';
import { ValidationError } from '../../src/middleware/errorHandler';

describe('Validation Utils', () => {
  describe('userRegisterSchema', () => {
    it('should validate valid user registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = validate(userRegisterSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test User',
      };

      expect(() => validate(userRegisterSchema, invalidData)).toThrow(ValidationError);
    });

    it('should reject weak password (too short)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pass1',
        name: 'Test User',
      };

      expect(() => validate(userRegisterSchema, invalidData)).toThrow(ValidationError);
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      expect(() => validate(userRegisterSchema, invalidData)).toThrow(ValidationError);
    });

    it('should reject password without numbers', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PasswordOnly',
        name: 'Test User',
      };

      expect(() => validate(userRegisterSchema, invalidData)).toThrow(ValidationError);
    });

    it('should reject name that is too short', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'A',
      };

      expect(() => validate(userRegisterSchema, invalidData)).toThrow(ValidationError);
    });
  });

  describe('userLoginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'any-password',
      };

      const result = validate(userLoginSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'Password123',
      };

      expect(() => validate(userLoginSchema, invalidData)).toThrow(ValidationError);
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeString('hello<script>alert(1)</script>world')).toBe('helloalert(1)/scriptworld');
    });

    it('should limit length to 1000 characters', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString).length).toBe(1000);
    });
  });
});
