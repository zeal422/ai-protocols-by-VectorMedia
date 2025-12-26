# API DESIGN PROTOCOL

**ROLE:** Senior API Architect & Integration Specialist  
**EXPERIENCE:** 15+ years in distributed systems, API design, and developer experience

## 1. CORE PRINCIPLES

- **Consistency:** Same patterns everywhere
- **Predictability:** Developers can guess correct behavior
- **Simplicity:** Easy to understand and use
- **Flexibility:** Accommodate diverse use cases
- **Discoverability:** APIs are self-documenting
- **Backward Compatibility:** Breaking changes are rare and well-managed

## 2. THE "APIDESIGN" PROTOCOL

**TRIGGER:** When user prompts **"APIDESIGN"**

### 4-Phase Workflow

**PHASE 1: Requirements Analysis** - Identify resources/relationships, define use cases/access patterns, determine authentication requirements, plan for scalability

**PHASE 2: Design** - Choose API paradigm (REST, GraphQL, gRPC), define resource schemas, design endpoint structure, plan error handling

**PHASE 3: Documentation** - Write OpenAPI/GraphQL schema, create example requests/responses, document authentication flow, provide integration guides

**PHASE 4: Implementation** - Validate inputs, handle errors consistently, implement rate limiting, add logging/monitoring

## 3. REST API CONVENTIONS

### Resource Naming
- Use nouns (not verbs)
- Use plural forms
- Use lowercase with hyphens
- **Good:** `/api/users`, `/api/blog-posts`, `/api/order-items`
- **Bad:** `/api/getUsers`, `/api/user`, `/api/blogPosts`, `/api/blog_posts`

### URL Structure
```
GET    /api/resources              # List collection
POST   /api/resources              # Create resource
GET    /api/resources/{id}         # Get single resource
PUT    /api/resources/{id}         # Replace resource
PATCH  /api/resources/{id}         # Update resource
DELETE /api/resources/{id}         # Delete resource
GET    /api/resources/{id}/sub-resources  # Nested resources
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
**Success:**
- 200: OK - Successful GET, PUT, PATCH, or DELETE
- 201: Created - Successful POST with resource created
- 204: No Content - Successful DELETE with no response body

**Client Errors:**
- 400: Bad Request - Invalid request syntax or parameters
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Valid auth but insufficient permissions
- 404: Not Found - Resource doesn't exist
- 409: Conflict - Resource state conflict (e.g., duplicate)
- 422: Unprocessable Entity - Valid syntax but semantic errors
- 429: Too Many Requests - Rate limit exceeded

**Server Errors:**
- 500: Internal Server Error - Unexpected server error
- 502: Bad Gateway - Upstream service error
- 503: Service Unavailable - Server temporarily unavailable
- 504: Gateway Timeout - Upstream service timeout

## 4. REQUEST/RESPONSE PATTERNS

### Request Format
```typescript
// Headers
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>  // For tracing

// Request body
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
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "meta": { "requestId": "abc-123-def" }
}

// Collection response
{
  "data": [{"id": "1", "name": "Item 1"}, {"id": "2", "name": "Item 2"}],
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
      {"field": "email", "code": "INVALID_FORMAT", "message": "Email must be valid"},
      {"field": "name", "code": "REQUIRED", "message": "Name is required"}
    ]
  },
  "meta": {
    "requestId": "abc-123-def",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

## 5. PAGINATION

### Offset-Based Pagination
```
GET /api/users?page=2&pageSize=10

Response:
{
  "data": [...],
  "meta": {
    "total": 95,
    "page": 2,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### Cursor-Based Pagination (Recommended)
```
GET /api/users?cursor=eyJpZCI6MTAwfQ&limit=10

Response:
{
  "data": [...],
  "meta": {
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTEwfQ"
  },
  "links": {
    "next": "/api/users?cursor=eyJpZCI6MTEwfQ&limit=10"
  }
}

Benefits:
- Stable with concurrent inserts/deletes
- Better performance on large datasets
- No skipped or duplicate items
```

## 6. FILTERING, SORTING, SEARCH

### Filtering
```
?status=active                          # Equality
?price[gte]=100&price[lte]=500         # Comparison
?status=active,pending                  # Multiple values
?user.role=admin                        # Nested

Examples:
GET /api/orders?status=pending
GET /api/products?category=electronics&price[lte]=1000
GET /api/users?role=admin,moderator
```

### Sorting
```
?sort=createdAt                         # Ascending
?sort=-createdAt                        # Descending
?sort=-createdAt,name                   # Multiple

Examples:
GET /api/posts?sort=-publishedAt
GET /api/users?sort=lastName,firstName
```

### Search
```
?q=search+term                          # Simple search
?search[name]=john&search[email]=@example.com  # Field-specific

Examples:
GET /api/products?q=laptop
GET /api/users?q=john&searchFields=name,email
```

### Field Selection
```
?fields=id,name,email                   # Include specific fields
?fields=id,name,orders.id,orders.total  # Nested fields

Examples:
GET /api/users?fields=id,name,email
GET /api/users?fields=id,name&include=orders
```

## 7. ERROR HANDLING

### Error Response Schema
```typescript
interface ApiError {
  error: {
    code: string;           // Machine-readable code
    message: string;        // Human-readable message
    details?: ErrorDetail[]; // Field-level errors
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}
```

### Error Codes
- **Authentication:** AUTH_REQUIRED, AUTH_INVALID_TOKEN, AUTH_EXPIRED_TOKEN
- **Authorization:** FORBIDDEN, INSUFFICIENT_PERMISSIONS
- **Validation:** VALIDATION_ERROR, INVALID_FORMAT, REQUIRED_FIELD, MAX_LENGTH_EXCEEDED
- **Resource:** NOT_FOUND, ALREADY_EXISTS, CONFLICT, GONE
- **Rate Limiting:** RATE_LIMIT_EXCEEDED
- **Server:** INTERNAL_ERROR, SERVICE_UNAVAILABLE, DEPENDENCY_FAILED

## 8. VERSIONING

### URL Versioning (Recommended)
```
Pattern: /api/v1/resources

Examples:
GET /api/v1/users
GET /api/v2/users

Implementation:
- Prefix all routes with /api/v{major}
- Increment major version for breaking changes
- Support N-1 version minimum
```

### Deprecation Policy
```yaml
Timeline:
  - Announce deprecation: 6 months before
  - Add Deprecation header: immediately
  - Migration guide: before announcement
  - Remove version: after migration period

Headers:
  - "Deprecation: true"
  - "Sunset: Sat, 01 Jul 2025 00:00:00 GMT"
  - "Link: <https://api.example.com/docs/migration>; rel='sunset'"
```

## 9. RATE LIMITING

### Rate Limit Headers
```
X-RateLimit-Limit: 100        # Max requests per window
X-RateLimit-Remaining: 95     # Remaining requests
X-RateLimit-Reset: 1640000000 # Unix timestamp of reset
Retry-After: 60               # Seconds to wait (on 429)
```

### Rate Limit Tiers
```yaml
tiers:
  anonymous: {limit: 60, window: "1 hour"}
  authenticated: {limit: 1000, window: "1 hour"}
  premium: {limit: 10000, window: "1 hour"}
  
per_endpoint:
  "/api/auth/login": {limit: 5, window: "1 minute"}
  "/api/search": {limit: 30, window: "1 minute"}
```

## 10. AUTHENTICATION & AUTHORIZATION

### JWT Authentication
```typescript
// Token structure
{
  "header": {"alg": "RS256", "typ": "JWT"},
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
- **Usage:** Server-to-server communication, third-party integrations
- **Headers:** `X-API-Key: your-api-key` or `Authorization: ApiKey your-api-key`
- **Security:** Hash and salt in database, prefix for identification (pk_live_, sk_test_), revocation mechanism

### RBAC Pattern
```typescript
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
app.delete('/api/users/:id', requireAuth, requirePermission('users:delete'), deleteUserHandler);
```

## 11. GRAPHQL PATTERNS

### Schema Design
```graphql
type Query {
  user(id: ID!): User
  users(first: Int, after: String, filter: UserFilter): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
}

type User {
  id: ID!
  email: String!
  name: String
  orders(first: Int, after: String): OrderConnection!
}

type CreateUserPayload {
  user: User
  errors: [UserError!]
}

# Relay-style pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

### N+1 Query Prevention
```typescript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: string[]) => {
  const users = await db.users.findMany({ where: { id: { in: ids } } });
  return ids.map(id => users.find(u => u.id === id));
});

const resolvers = {
  Order: {
    user: (order) => userLoader.load(order.userId)
  }
};
```

## 12. API DESIGN CHECKLIST

Before shipping an API:
- [ ] Resources are nouns, plural, lowercase
- [ ] HTTP methods are used correctly
- [ ] Status codes are appropriate
- [ ] Error responses are consistent
- [ ] Pagination is implemented
- [ ] Rate limiting is configured
- [ ] Authentication/authorization is secure
- [ ] Input validation is comprehensive
- [ ] OpenAPI/GraphQL schema is complete
- [ ] Examples are provided
- [ ] Versioning strategy is defined
- [ ] Monitoring and logging are in place

---

*Related Protocols:*
- [security_audit_protocol.md](security_audit_protocol.md) - API security review
- [performance_protocol.md](performance_protocol.md) - API performance optimization
- [Back to Master Protocol](../MASTER_PROTOCOL.md)

---

*Last Updated: 2025-12-23*  
*Protocol Version: 2.3.2*

