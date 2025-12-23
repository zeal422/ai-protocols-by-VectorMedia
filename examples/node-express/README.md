# Node.js + Express Example

Production-ready REST API demonstrating ai-protocols.

## 🎯 What This Demonstrates

This example showcases proper implementation of multiple protocols:

- **SECAUDIT**: JWT authentication, rate limiting, security headers
- **APIDESIGN**: RESTful endpoints, consistent error handling, versioning
- **FULLSPEC**: Comprehensive test coverage (unit, integration, security)
- **COMPREHENSIVE**: Clean code following Four Pillars
- **DEBUG**: Proper error handling and logging

## 📦 Features

- ✅ JWT Authentication with bcrypt password hashing
- ✅ Rate limiting (global + auth-specific)
- ✅ Security middleware (Helmet, CORS)
- ✅ Input validation with Zod schemas
- ✅ Structured logging (Winston)
- ✅ Comprehensive test suite (Jest + Supertest)
- ✅ CI/CD ready (GitHub Actions)
- ✅ TypeScript with strict mode

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env

# Edit .env with your values:
# JWT_SECRET=your-secret-key-change-in-production
# PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
# Server starts on http://localhost:3000
```

### 4. Run Tests
```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── server.ts              # Main application entry
├── config/
│   └── logger.ts          # Winston logging configuration
├── middleware/
│   ├── auth.ts            # JWT authentication middleware
│   ├── errorHandler.ts    # Error handling (Debug protocol)
│   └── rateLimiter.ts     # Rate limiting (Security protocol)
├── routes/
│   ├── auth.ts            # Login/register endpoints
│   └── users.ts           # User CRUD endpoints
├── models/
│   └── User.ts            # User model and types
└── utils/
    └── validation.ts      # Zod validation schemas

tests/
├── unit/
│   └── validation.test.ts # Unit tests for validation
├── integration/
│   └── users.test.ts      # API integration tests
└── security/
    └── auth.test.ts       # Security-focused tests
```

## 🔐 API Endpoints

### Authentication

**POST /api/v1/auth/register**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'

# Response: { "data": { "user": {...}, "token": "..." } }
```

**POST /api/v1/auth/login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'

# Response: { "data": { "user": {...}, "token": "..." } }
```

### User Management (Requires Authentication)

**GET /api/v1/users/me**
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response: { "data": { "user": {...} } }
```

**PATCH /api/v1/users/me**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Jane Doe" }'

# Response: { "data": { "user": {...} } }
```

**DELETE /api/v1/users/me**
```bash
curl -X DELETE http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response: 204 No Content
```

**GET /api/v1/users** (List all users)
```bash
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response: { "data": { "users": [...], "total": 5 } }
```

## 🧪 Running Tests

```bash
# All tests with coverage
npm run test:coverage

# Expected coverage:
# - Statements: 70%+
# - Branches: 70%+
# - Functions: 70%+
# - Lines: 70%+
```

**Test Categories:**
- **Unit Tests**: Validation logic, utilities
- **Integration Tests**: API endpoints, authentication flow
- **Security Tests**: Rate limiting, JWT validation, input sanitization

## 🔒 Security Features (SECAUDIT Protocol)

1. **Password Security**
   - Bcrypt hashing with cost factor 12
   - Minimum 8 characters with complexity requirements
   - Passwords never logged or exposed in responses

2. **Rate Limiting**
   - Global: 100 requests per 15 minutes
   - Auth endpoints: 5 attempts per 15 minutes
   - Prevents brute force attacks

3. **JWT Security**
   - Tokens expire after 7 days (configurable)
   - Signed with strong secret
   - Validated on every protected route

4. **Input Validation**
   - All inputs validated with Zod schemas
   - SQL injection prevention (parameterized queries)
   - XSS prevention (input sanitization)

5. **Security Headers**
   - Helmet.js for standard security headers
   - CORS configured (not open to all origins)
   - Content-Security-Policy enabled

6. **Error Handling**
   - Generic errors in production (no stack traces)
   - Detailed errors in development
   - Security events logged

## 📊 Protocol Compliance

### ✅ SECAUDIT (Security Audit)
- Rate limiting on all endpoints
- JWT authentication properly implemented
- No secrets in code or logs
- Input validation prevents injection
- Security headers via Helmet

### ✅ APIDESIGN (API Design)
- RESTful endpoints with proper HTTP methods
- Consistent error response format
- API versioning (/api/v1/)
- Proper status codes (200, 201, 204, 401, 422)
- Response envelopes: `{ data: {...} }`

### ✅ FULLSPEC (Testing)
- 70%+ code coverage
- Unit tests for business logic
- Integration tests for API flows
- Security-specific test suite
- All edge cases covered

### ✅ COMPREHENSIVE (Code Review)
- Four Pillars: Correctness, Readability, Performance, Maintainability
- TypeScript strict mode
- No `any` types allowed
- Consistent naming conventions
- Proper error handling everywhere

### ✅ DEBUG (Error Handling)
- Structured logging with Winston
- Error types (ValidationError, UnauthorizedError)
- No sensitive data in logs
- Stack traces only in development

## 🚀 Deployment

### Environment Variables
```bash
# Required
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-secret-key-min-32-chars

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### Build & Run
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### CI/CD
GitHub Actions workflow included (`.github/workflows/ci.yml`):
- Runs on Node.js 18.x and 20.x
- Executes linter
- Runs all tests with coverage
- Security audit (npm audit)

## 🔧 Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with watch mode |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run validate` | Run lint + tests |

## 📚 Learning Resources

- [BRAIN/MASTER_PROTOCOL.md](../../BRAIN/MASTER_PROTOCOL.md) - Main protocol orchestrator
- [SECAUDIT Protocol](../../BRAIN/security_audit_protocol.md) - Security best practices
- [APIDESIGN Protocol](../../BRAIN/api_design_protocol.md) - API design patterns
- [FULLSPEC Protocol](../../BRAIN/test_automation_protocol.md) - Testing strategy
- [DEBUG Protocol](../../BRAIN/debug_protocol.md) - Error handling

## 💡 Tips for Adapting to Your Project

1. **Add Database**: Replace in-memory `userStore` with actual database (PostgreSQL, MongoDB, etc.)
2. **Add More Routes**: Follow patterns in `routes/users.ts` and `routes/auth.ts`
3. **Customize Validation**: Modify Zod schemas in `utils/validation.ts`
4. **Add Features**: Follow protocols for each feature (APIDESIGN → SECAUDIT → FULLSPEC → COMPREHENSIVE)
5. **Enhance Security**: Add 2FA, OAuth, password reset, etc.

## 🐛 Troubleshooting

**Tests failing with JWT_SECRET error:**
```bash
# Make sure .env file exists
cp .env.example .env
# Run tests again
npm test
```

**Port 3000 already in use:**
```bash
# Change PORT in .env
echo "PORT=3001" >> .env
```

**TypeScript errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT - Use this as a template for your projects!

---

**This example demonstrates production-ready code following ai-protocols.**  
Built with: Node.js 18+, Express, TypeScript, JWT, Bcrypt, Zod, Jest, Winston
