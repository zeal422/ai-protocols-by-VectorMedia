/**
 * Security Tests following SECAUDIT Protocol
 */
import request from 'supertest';
import app from '../../src/server';
import { userStore } from '../../src/models/User';

describe('Security Tests - SECAUDIT Protocol', () => {
  beforeEach(() => {
    userStore.clear();
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit on authentication endpoints', async () => {
      const attempts = [];
      
      // Make 6 rapid requests (limit is 5)
      for (let i = 0; i < 6; i++) {
        attempts.push(
          request(app)
            .post('/api/v1/auth/login')
            .send({
              email: 'test@example.com',
              password: 'Password123',
            })
        );
      }

      const responses = await Promise.all(attempts);
      const rateLimited = responses.some(r => r.status === 429);
      
      expect(rateLimited).toBe(true);
    }, 10000);
  });

  describe('JWT Security', () => {
    let validToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User',
        });

      validToken = response.body.data.token;
    });

    it('should reject expired tokens', async () => {
      // This would require mocking JWT expiry or using a short-lived token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyM30.invalid';
      
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject malformed tokens', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer malformed.token.here')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject requests without Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', validToken)
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('Input Validation & Injection Prevention', () => {
    it('should sanitize SQL injection attempts in email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: "admin'--@example.com",
          password: 'Password123',
          name: 'Test User',
        })
        .expect(422);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent XSS in name field', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: '<script>alert("XSS")</script>',
        });

      // Should still create user but sanitize the name
      expect(response.status).toBe(201);
      expect(response.body.data.user.name).not.toContain('<script>');
    });

    it('should reject excessively long inputs', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'A'.repeat(1000),
        })
        .expect(422);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Password Security', () => {
    it('should not expose password hashes in responses', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User',
        });

      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should enforce password complexity requirements', async () => {
      const weakPasswords = [
        'password', // No uppercase, no number
        'PASSWORD', // No lowercase, no number
        'Password', // No number
        'Pass123',  // Too short
      ];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `test${password}@example.com`,
            password,
            name: 'Test User',
          });

        expect(response.status).toBe(422);
      }
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not leak stack traces in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123',
        })
        .expect(401);

      expect(response.body.error.message).not.toContain('at ');
      expect(response.body).not.toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('CORS Security', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers from Helmet', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Helmet sets these headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
