---
protocol_version: "1.0.0"
last_updated: "2025-12-22"
status: "stable"
requires: ["MASTER_PROTOCOL.md"]
---

# API DESIGN PROTOCOL

**ROLE:** Senior API Architect & Integration Specialist.
**EXPERIENCE:** 15+ years in distributed systems, API design, and developer experience.

## 1. CORE PRINCIPLES

- **Consistency:** Same patterns everywhere
- **Predictability:** Developers can guess correct behavior
- **Simplicity:** Easy to understand and use
- **Flexibility:** Accommodate diverse use cases
- **Discoverability:** APIs are self-documenting
- **Backward Compatibility:** Breaking changes are rare and well-managed

## 2. THE "APIDESIGN" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When the user prompts **"APIDESIGN"**:

### PHASE 1: REQUIREMENTS ANALYSIS
- Identify resources and relationships
- Define use cases and access patterns
- Determine authentication requirements
- Plan for scalability

### PHASE 2: DESIGN
- Choose API paradigm (REST, GraphQL, gRPC)
- Define resource schemas
- Design endpoint structure
- Plan error handling

### PHASE 3: DOCUMENTATION
- Write OpenAPI/GraphQL schema
- Create example requests/responses
- Document authentication flow
- Provide integration guides

### PHASE 4: IMPLEMENTATION
- Validate inputs
- Handle errors consistently
- Implement rate limiting
- Add logging and monitoring

---

## 3. REST API CONVENTIONS

### Resource Naming

```yaml
naming_rules:
  use_nouns: true
  use_plural: true
  use_lowercase: true
  use_hyphens: true
  
  examples:
    good:
      - "/api/users"
      - "/api/blog-posts"
      - "/api/order-items"
    
    bad:
      - "/api/getUsers"      # verb in URL
      - "/api/user"          # singular
      - "/api/blogPosts"     # camelCase
      - "/api/blog_posts"    # underscores
```

### URL Structure

```yaml
patterns:
  collection: "GET /api/resources"
  single: "GET /api/resources/{id}"
  nested: "GET /api/resources/{id}/sub-resources"
  
  examples:
    - "GET    /api/users"
    - "POST   /api/users"
    - "GET    /api/users/123"
    - "PUT    /api/users/123"
    - "PATCH  /api/users/123"
    - "DELETE /api/users/123"
    - "GET    /api/users/123/orders"
    - "POST   /api/users/123/orders"
```

### HTTP Methods

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|------------|------|--------------|---------------|
| GET | Read | Yes | Yes | No | Yes |
| POST | Create | No | No | Yes | Yes |
| PUT | Replace | Yes | No | Yes | Yes |
| PATCH | Update | Yes | No | Yes | Yes |
| DELETE | Remove | Yes | No | No | Optional |

### HTTP Status Codes

```yaml
success:
  200: "OK - Successful GET, PUT, PATCH, or DELETE"
  201: "Created - Successful POST with resource created"
  204: "No Content - Successful DELETE with no response body"

client_errors:
  400: "Bad Request - Invalid request syntax or parameters"
  401: "Unauthorized - Missing or invalid authentication"
  403: "Forbidden - Valid auth but insufficient permissions"
  404: "Not Found - Resource doesn't exist"
  409: "Conflict - Resource state conflict (e.g., duplicate)"
  422: "Unprocessable Entity - Valid syntax but semantic errors"
  429: "Too Many Requests - Rate limit exceeded"

server_errors:
  500: "Internal Server Error - Unexpected server error"
  502: "Bad Gateway - Upstream service error"
  503: "Service Unavailable - Server temporarily unavailable"
  504: "Gateway Timeout - Upstream service timeout"
```

---

## 4. REQUEST/RESPONSE PATTERNS

### Request Format

```typescript
// Headers
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>  // For tracing

// Request body example
{
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "newsletter": true,
    "notifications": ["email", "push"]
  }
}
```

### Response Format

```typescript
// Success response
{
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "requestId": "abc-123-def"
  }
}

// Collection response
{
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  },
  "links": {
    "self": "/api/items?page=1",
    "first": "/api/items?page=1",
    "prev": null,
    "next": "/api/items?page=2",
    "last": "/api/items?page=10"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      },
      {
        "field": "name",
        "code": "REQUIRED",
        "message": "Name is required"
      }
    ]
  },
  "meta": {
    "requestId": "abc-123-def",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 5. PAGINATION

### Offset-Based Pagination

```yaml
request:
  parameters:
    - name: "page"
      type: "integer"
      default: 1
    - name: "pageSize"
      type: "integer"
      default: 20
      max: 100

example:
  request: "GET /api/users?page=2&pageSize=10"
  response:
    meta:
      total: 95
      page: 2
      pageSize: 10
      totalPages: 10
```

### Cursor-Based Pagination (Recommended)

```yaml
request:
  parameters:
    - name: "cursor"
      type: "string"
      description: "Opaque cursor for next page"
    - name: "limit"
      type: "integer"
      default: 20
      max: 100

example:
  request: "GET /api/users?cursor=eyJpZCI6MTAwfQ&limit=10"
  response:
    data: [...]
    meta:
      hasMore: true
      nextCursor: "eyJpZCI6MTEwfQ"
    links:
      next: "/api/users?cursor=eyJpZCI6MTEwfQ&limit=10"

benefits:
  - "Stable with concurrent inserts/deletes"
  - "Better performance on large datasets"
  - "No skipped or duplicate items"
```

---

## 6. FILTERING, SORTING, SEARCH

### Filtering

```yaml
patterns:
  equality: "?status=active"
  comparison: "?price[gte]=100&price[lte]=500"
  multiple_values: "?status=active,pending"
  nested: "?user.role=admin"

examples:
  - "GET /api/orders?status=pending"
  - "GET /api/products?category=electronics&price[lte]=1000"
  - "GET /api/users?role=admin,moderator"
```

### Sorting

```yaml
patterns:
  single: "?sort=createdAt"
  descending: "?sort=-createdAt"
  multiple: "?sort=-createdAt,name"

examples:
  - "GET /api/posts?sort=-publishedAt"
  - "GET /api/users?sort=lastName,firstName"
```

### Search

```yaml
patterns:
  simple: "?q=search+term"
  field_specific: "?search[name]=john&search[email]=@example.com"

examples:
  - "GET /api/products?q=laptop"
  - "GET /api/users?q=john&searchFields=name,email"
```

### Field Selection

```yaml
patterns:
  include: "?fields=id,name,email"
  nested: "?fields=id,name,orders.id,orders.total"

examples:
  - "GET /api/users?fields=id,name,email"
  - "GET /api/users?fields=id,name&include=orders"
```

---

## 7. ERROR HANDLING

### Error Response Schema

```typescript
interface ApiError {
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: ErrorDetail[]; // Field-level errors
    stack?: string;         // Stack trace (dev only)
  };
  meta: {
    requestId: string;
    timestamp: string;
    path: string;
    method: string;
  };
}

interface ErrorDetail {
  field: string;
  code: string;
  message: string;
  value?: any;  // Invalid value (careful with sensitive data)
}
```

### Error Codes

```yaml
error_codes:
  authentication:
    - "AUTH_REQUIRED"
    - "AUTH_INVALID_TOKEN"
    - "AUTH_EXPIRED_TOKEN"
    
  authorization:
    - "FORBIDDEN"
    - "INSUFFICIENT_PERMISSIONS"
    
  validation:
    - "VALIDATION_ERROR"
    - "INVALID_FORMAT"
    - "REQUIRED_FIELD"
    - "MAX_LENGTH_EXCEEDED"
    - "MIN_VALUE"
    - "MAX_VALUE"
    
  resource:
    - "NOT_FOUND"
    - "ALREADY_EXISTS"
    - "CONFLICT"
    - "GONE"
    
  rate_limiting:
    - "RATE_LIMIT_EXCEEDED"
    
  server:
    - "INTERNAL_ERROR"
    - "SERVICE_UNAVAILABLE"
    - "DEPENDENCY_FAILED"
```

### Error Handling Implementation

```typescript
// Express error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Log error
  logger.error({
    requestId,
    error: err,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  
  // Determine status code and response
  if (err instanceof ValidationError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.details
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message
      },
      meta: { requestId, timestamp: new Date().toISOString() }
    });
  }
  
  // Default to 500
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    },
    meta: { requestId, timestamp: new Date().toISOString() }
  });
});
```

---

## 8. VERSIONING

### URL Versioning (Recommended)

```yaml
pattern: "/api/v1/resources"

examples:
  - "GET /api/v1/users"
  - "GET /api/v2/users"

implementation:
  - "Prefix all routes with /api/v{major}"
  - "Increment major version for breaking changes"
  - "Support N-1 version minimum"
```

### Header Versioning

```yaml
pattern: "Accept: application/vnd.api+json;version=1"

examples:
  - "Accept: application/vnd.example.v1+json"
  - "API-Version: 2024-01-15"
```

### Deprecation Policy

```yaml
deprecation:
  timeline:
    - "Announce deprecation: 6 months before"
    - "Add Deprecation header: immediately"
    - "Migration guide: before announcement"
    - "Remove version: after migration period"
  
  headers:
    - "Deprecation: true"
    - "Sunset: Sat, 01 Jul 2025 00:00:00 GMT"
    - "Link: <https://api.example.com/docs/migration>; rel='sunset'"
  
  response:
    warning: "This API version is deprecated. Please migrate to v2."
```

---

## 9. RATE LIMITING

### Rate Limit Headers

```yaml
headers:
  X-RateLimit-Limit: "100"        # Max requests per window
  X-RateLimit-Remaining: "95"     # Remaining requests
  X-RateLimit-Reset: "1640000000" # Unix timestamp of reset
  Retry-After: "60"               # Seconds to wait (on 429)
```

### Rate Limit Tiers

```yaml
tiers:
  anonymous:
    limit: 60
    window: "1 hour"
    
  authenticated:
    limit: 1000
    window: "1 hour"
    
  premium:
    limit: 10000
    window: "1 hour"
    
  per_endpoint:
    "/api/auth/login":
      limit: 5
      window: "1 minute"
    "/api/search":
      limit: 30
      window: "1 minute"
```

### Implementation

```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    if (!req.user) return 60;
    if (req.user.tier === 'premium') return 10000;
    return 1000;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});

app.use('/api/', apiLimiter);
```

---

## 10. AUTHENTICATION & AUTHORIZATION

### JWT Authentication

```typescript
// Token structure
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-123",
    "email": "user@example.com",
    "roles": ["user"],
    "iat": 1640000000,
    "exp": 1640003600
  }
}

// Usage
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Keys

```yaml
usage:
  - "Server-to-server communication"
  - "Third-party integrations"
  - "Rate limiting by client"

headers:
  - "X-API-Key: your-api-key"
  - "Authorization: ApiKey your-api-key"

security:
  - "Hash and salt in database"
  - "Prefix for identification (e.g., pk_live_, sk_test_)"
  - "Revocation mechanism"
  - "Scope limitations"
```

### RBAC Pattern

```typescript
// Permission checking middleware
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'AUTH_REQUIRED', message: 'Authentication required' }
      });
    }
    
    if (!hasPermission(req.user.roles, permission)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    
    next();
  };
};

// Usage
app.delete('/api/users/:id', 
  requireAuth,
  requirePermission('users:delete'),
  deleteUserHandler
);
```

---

## 11. GRAPHQL PATTERNS

### Schema Design

```graphql
type Query {
  user(id: ID!): User
  users(
    first: Int
    after: String
    filter: UserFilter
  ): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!
}

type User {
  id: ID!
  email: String!
  name: String
  orders(first: Int, after: String): OrderConnection!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateUserInput {
  email: String!
  name: String
  password: String!
}

type CreateUserPayload {
  user: User
  errors: [UserError!]
}

type UserError {
  field: String
  code: String!
  message: String!
}

# Relay-style pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### N+1 Query Prevention

```typescript
import DataLoader from 'dataloader';

// Create loaders
const userLoader = new DataLoader(async (ids: string[]) => {
  const users = await db.users.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
});

// Use in resolvers
const resolvers = {
  Order: {
    user: (order) => userLoader.load(order.userId)
  }
};
```

---

## 12. API DOCUMENTATION

### OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0
  description: API documentation

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://api-staging.example.com/v1
    description: Staging

paths:
  /users:
    get:
      summary: List users
      description: Retrieve a paginated list of users
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        name:
          type: string
      required:
        - id
        - email
  
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## 13. API DESIGN CHECKLIST

Before shipping an API:

- [ ] Resources are nouns, plural, lowercase
- [ ] HTTP methods are used correctly
- [ ] Status codes are appropriate
- [ ] Error responses are consistent
- [ ] Pagination is implemented
- [ ] Filtering and sorting work
- [ ] Authentication is secure
- [ ] Rate limiting is configured
- [ ] Versioning strategy is defined
- [ ] Documentation is complete
- [ ] Validation is thorough
- [ ] Logging captures useful data
- [ ] Tests cover all endpoints

---

**META-RULE:** Design APIs as if your users are developers who will curse your name at 3 AM when something breaks.

**LOCATION RULE:** Every API issue must include endpoint path, HTTP method, and example request/response.

**GOLDEN RULE:** Consistency beats perfection. A consistent API with quirks is better than an inconsistent API with perfect individual endpoints.

---

*Related Protocols:*
- [security_audit_protocol.md](security_audit_protocol.md) - API security testing
- [test_automation_protocol.md](test_automation_protocol.md) - API testing patterns
- [Back to Master Protocol](MASTER_PROTOCOL.md)
