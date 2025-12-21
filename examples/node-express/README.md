# Node.js + Express Example Setup

This example shows how to integrate AI Development Protocols into a Node.js backend project.

## File Structure

```
your-node-project/
├── CLAUDE.md                 # Claude project knowledge
├── .cursorrules              # Cursor IDE rules
├── eslint.config.js          # ESLint configuration
├── tsconfig.json             # TypeScript config
├── src/
│   ├── api/                  # Route handlers
│   ├── services/             # Business logic
│   ├── models/               # Data models
│   └── middleware/           # Express middleware
└── tests/
    └── ...
```

## Integration Steps

### 1. Add Protocol References

Copy the following files to your project root:
- `MASTER_PROTOCOL.md`
- `code_review_protocol.md`
- `debug_protocol.md`
- `error_fix_protocol.md`
- `api_design_protocol.md`
- `security_audit_protocol.md`
- `test_automation_protocol.md`

### 2. Configure Your AI Tool

Add to your AI configuration:
```markdown
Use the MASTER_PROTOCOL.md for all development tasks.

Key protocols:
- API development: use api_design_protocol.md
- Security: use security_audit_protocol.md
- Debugging: use debug_protocol.md
- Testing: use test_automation_protocol.md

Safety rules:
- Never modify authentication without explicit permission
- Always use parameterized queries (prevent SQL injection)
- Add proper error handling to all endpoints
- Follow REST conventions
```

### 3. Recommended Dependencies

```bash
npm install --save-dev \
  eslint @eslint/js \
  typescript-eslint \
  eslint-plugin-security \
  jest supertest @types/jest
```

## Usage Examples

### Security Audit

```
Use the MASTER_PROTOCOL to audit the auth module for security issues.
Trigger SECAUDIT for comprehensive security scan.
Check for OWASP Top 10 vulnerabilities.
```

### Debug an Issue

```
Use the MASTER_PROTOCOL to debug the order processing bug.
Trigger DEEPDIVE for full system analysis.
Provide error logs and reproduction steps.
```

### Design an API

```
Use the MASTER_PROTOCOL to design the user management API.
Follow REST conventions from api_design_protocol.md.
Include proper error handling and validation.
```

### Write Tests

```
Use the MASTER_PROTOCOL to write integration tests for /api/orders.
Trigger FULLSPEC for complete test coverage.
Include happy path, error cases, and edge cases.
```

## Best Practices

1. **Security First** - Always run SECAUDIT before deployment
2. **Test Coverage** - Aim for 80%+ on core API endpoints
3. **Error Handling** - Use consistent error response format
4. **Documentation** - Generate OpenAPI/Swagger specs
5. **Performance** - Monitor N+1 queries and slow endpoints
