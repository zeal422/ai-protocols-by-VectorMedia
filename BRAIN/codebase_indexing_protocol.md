# CODEBASE INTELLIGENCE & INDEXING PROTOCOL

**ROLE:** Codebase Cartographer & Semantic Index Builder  
**MISSION:** Create complete, searchable, AI-readable index of any codebase for perfect context understanding

## 1. CORE PRINCIPLES

- **Total Mapping:** Index every file, function, class, variable, dependency
- **Semantic Understanding:** Understand what code does, why it exists, how it connects
- **Change Impact Analysis:** Know exactly what breaks when something changes
- **Zero Ambiguity:** Every element has unique ID and clear purpose
- **Living Documentation:** Index IS the documentation—always current
- **AI-First Format:** Structured for LLM consumption with maximum context density

## 2. THE "FULLINDEX" PROTOCOL

**TRIGGER:** When user prompts **"FULLINDEX"**

### 6-Phase Workflow

**PHASE 1: Structural Reconnaissance**
- Map directory tree with file classifications
- Identify configs, package managers, build systems
- Catalog entry points (main files, startup scripts)
- Identify test directories and patterns

**PHASE 2: Technology Detection**
- Detect languages (with percentage breakdown)
- Identify frameworks/libraries (frontend, backend, testing)
- Map databases, ORMs, deployment targets
- Identify CI/CD pipelines, environment configs

**PHASE 3: Dependency Mapping**
- Build complete import/dependency graph
- Identify circular dependencies, dead code
- Map external packages (with versions)
- Catalog internal module dependencies
- Map API endpoints and handlers

**PHASE 4: Code Entity Extraction**
- Extract classes, interfaces, types
- Catalog functions/methods with signatures
- Map variables (global, module-level, constants)
- Identify DB models, schemas, API routes
- Catalog React/Vue components, state management

**PHASE 5: Semantic Analysis**
- Infer purpose of each module/file
- Identify business logic vs infrastructure
- Map data flow through application
- Identify security-critical paths
- Catalog error handling, auth/authorization

**PHASE 6: Change Impact Matrix**
- Build "what breaks if I change X" map
- Identify tightly coupled components
- Map test coverage to source files
- Identify high-risk modification zones
- Catalog API contract boundaries

## 3. INDEX OUTPUT FORMATS

### Master Index
```yaml
project:
  name: "project-name"
  root: "/path"
  size: {files: N, lines: N, size: "X MB"}
  
  languages:
    - {name: "TypeScript", percentage: 68%, files: N, lines: N}
    - {name: "JavaScript", percentage: 15%, files: N, lines: N}
  
  architecture:
    pattern: "Monolithic/Microservices/etc"
    frontend: {framework: "React 18", build: "Vite", state: "Redux", routing: "React Router", styling: "Tailwind"}
    backend: {framework: "Express", language: "Node.js/TS", orm: "Prisma", auth: "JWT"}
    database: {primary: "PostgreSQL", cache: "Redis"}
    deployment: {container: "Docker", orchestration: "K8s", ci_cd: "GitHub Actions"}
  
  entry_points:
    - {path: "src/server.ts", type: "backend_main", port: 3000}
    - {path: "src/client/main.tsx", type: "frontend_main"}
```

### File-Level Index
```yaml
files:
  - path: "src/api/users/controller.ts"
    id: "file_001"
    size: "8.2 KB"
    lines: 245
    language: "TypeScript"
    purpose: "User management API handlers"
    category: "backend_controller"
    complexity_score: 6.7/10
    test_coverage: 85%
    
    imports:
      internal: [{path: "../services/userService", items: ["createUser", "updateUser"]}]
      external: [{package: "express@4.18.2", items: ["Request", "Response"]}]
    
    exports: [{name: "UserController", type: "class", methods: ["getUser", "createUser", "updateUser", "deleteUser"]}]
    
    dependencies:
      used_by: ["src/api/routes.ts", "src/tests/api/users.test.ts"]
      depends_on: ["src/services/userService.ts", "src/models/User.ts"]
    
    security_sensitive: true  # Handles auth and PII
    
    api_endpoints:
      - {method: "GET", path: "/api/users/:id", handler: "getUser", auth: true, rate_limit: "100/hour"}
      - {method: "POST", path: "/api/users", handler: "createUser", auth: true, permissions: ["admin"]}
      - {method: "PUT", path: "/api/users/:id", handler: "updateUser", auth: true}
      - {method: "DELETE", path: "/api/users/:id", handler: "deleteUser", auth: true, permissions: ["admin"]}
    
    key_functions:
      - {name: "getUser", lines: [45,67], purpose: "Retrieve user by ID", complexity: "low", db_queries: 1}
      - {name: "createUser", lines: [69,112], purpose: "Create user with validation", complexity: "medium", db_queries: 2, side_effects: ["email", "audit_log"]}
    
    potential_issues:
      - {type: "performance", line: 156, severity: "medium", description: "N+1 query loading relationships"}
      - {type: "security", line: 89, severity: "low", description: "Email exposed in error messages"}
```

### Function-Level Index
```yaml
functions:
  - id: "func_0234"
    name: "validateUserEmail"
    file: "src/utils/validators.ts"
    lines: [23, 45]
    signature: "(email: string): boolean"
    purpose: "Validate email format and check domain whitelist"
    
    parameters: [{name: "email", type: "string", required: true}]
    returns: {type: "boolean", description: "true if valid and allowed domain"}
    
    algorithm: ["Check format with regex", "Extract domain", "Check whitelist", "Return result"]
    
    dependencies:
      calls: [{function: "isValidEmailFormat", file: "src/utils/regex.ts"}]
      called_by: [{function: "createUser", file: "src/api/users/controller.ts", line: 78}]
    
    test_coverage: {total: 12, coverage: 100%, file: "src/utils/__tests__/validators.test.ts", edge_cases: ["null", "empty", "invalid format", "blocked domain"]}
    
    complexity: {cyclomatic: 4, cognitive: 6, rating: "simple"}
    
    change_impact: {risk: "high", reason: "Used in 15 places across auth/user management", breaking_if: "Change signature", affected: 15}
```

### Component-Level Index (Frontend)
```yaml
components:
  - id: "comp_0089"
    name: "UserProfile"
    file: "src/components/UserProfile.tsx"
    lines: [12, 156]
    type: "React Functional Component"
    purpose: "Display and edit user profile"
    
    props:
      - {name: "userId", type: "string", required: true}
      - {name: "editable", type: "boolean", required: false, default: false}
      - {name: "onSave", type: "(user: User) => void", required: false}
    
    state:
      - {name: "user", type: "User | null", source: "useState"}
      - {name: "isEditing", type: "boolean", source: "useState"}
      - {name: "errors", type: "Record<string, string>", source: "useState"}
    
    hooks: ["useEffect (fetch user)", "useCallback (memoize save)", "useMemo (compute display name)"]
    
    external_dependencies:
      api: ["GET /api/users/:id", "PUT /api/users/:id"]
      redux: {selectors: ["selectCurrentUser"], actions: ["updateUser"]}
    
    child_components: ["Avatar", "EditButton", "LoadingSpinner"]
    used_by: ["ProfilePage.tsx:45", "AdminUserManagement.tsx:123"]
    
    styling: {method: "Tailwind CSS", responsive: true}
    accessibility: {aria: true, keyboard: true, screen_reader: true}
    performance: {memo: false, suggestion: "Consider React.memo if in lists"}
    test_coverage: {unit: 8, integration: 3, e2e: 1, coverage: 92%}
```

### Dependency Graph
```yaml
dependency_graph:
  nodes:
    - {id: "src/api/users/controller.ts", type: "controller", importance: "critical"}
    - {id: "src/services/userService.ts", type: "service", importance: "critical"}
    - {id: "src/models/User.ts", type: "model", importance: "critical"}
  
  edges:
    - {from: "src/api/users/controller.ts", to: "src/services/userService.ts", type: "imports", items: ["createUser", "updateUser"]}
    - {from: "src/services/userService.ts", to: "src/models/User.ts", type: "imports", items: ["User", "UserRole"]}
  
  circular_dependencies: []
  depth: {max: 7, avg: 3.2}
  
  coupling:
    high: [{file: "src/models/User.ts", dependents: 45, reason: "Core domain model"}]
    low: [{file: "src/utils/logger.ts", dependents: 8, reason: "Optional utility"}]
```

### API Endpoint Catalog
```yaml
api_endpoints:
  - path: "/api/users/:id"
    method: "GET"
    handler: {file: "src/api/users/controller.ts", class: "UserController", method: "getUser", lines: [45,67]}
    
    auth: {required: true, type: "JWT Bearer", permissions: ["authenticated"]}
    rate_limit: {limit: 100, window: "1 hour", key: "user_id"}
    
    parameters:
      path: [{name: "id", type: "UUID", required: true}]
      query: []
      body: null
    
    responses:
      200: {description: "User found", schema: "User", example: "{\"id\": \"...\", \"email\": \"...\"}"}
      404: {description: "Not found", schema: "Error"}
      401: {description: "Unauthorized", schema: "Error"}
    
    database: [{type: "SELECT", table: "users", rows: 1, indexes: ["users_pkey"]}]
    performance: {avg: "45ms", p95: "120ms", cache: false}
    tests: {unit: 3, integration: 2, e2e: 1}
    
    changelog:
      - {date: "2024-01-15", change: "Added email field", breaking: false}
      - {date: "2023-12-01", change: "UUID migration", breaking: true}
```

### Database Schema Index
```yaml
database_schemas:
  - table: "users"
    purpose: "User account information"
    row_count: 15420
    size: "2.3 MB"
    
    columns:
      - {name: "id", type: "UUID", nullable: false, primary_key: true, default: "gen_random_uuid()"}
      - {name: "email", type: "VARCHAR(255)", nullable: false, unique: true, indexed: true}
      - {name: "password_hash", type: "VARCHAR(255)", nullable: false, security: "bcrypt"}
      - {name: "name", type: "VARCHAR(100)", nullable: true}
      - {name: "role", type: "ENUM('user','admin','moderator')", nullable: false, default: "user", indexed: true}
      - {name: "created_at", type: "TIMESTAMP", nullable: false, default: "CURRENT_TIMESTAMP"}
      - {name: "updated_at", type: "TIMESTAMP", nullable: false, default: "CURRENT_TIMESTAMP", on_update: "CURRENT_TIMESTAMP"}
      - {name: "deleted_at", type: "TIMESTAMP", nullable: true}  # Soft delete
    
    indexes:
      - {name: "users_pkey", type: "PRIMARY KEY", columns: ["id"]}
      - {name: "users_email_unique", type: "UNIQUE", columns: ["email"]}
      - {name: "users_role_idx", type: "BTREE", columns: ["role"]}
      - {name: "users_deleted_at_idx", type: "BTREE", columns: ["deleted_at"]}
    
    relationships:
      has_many: [{table: "orders", fk: "user_id", on_delete: "CASCADE"}]
    
    accessed_by:
      - {file: "src/models/User.ts", ops: ["CRUD"]}
      - {file: "src/api/users/controller.ts", ops: ["READ", "UPDATE"]}
    
    query_patterns:
      - {query: "SELECT * FROM users WHERE email = $1", freq: "very_high", perf: "excellent (indexed)"}
      - {query: "SELECT * FROM users WHERE deleted_at IS NULL", freq: "high", perf: "good (indexed)"}
    
    migrations:
      - {version: "20240115_add_role", date: "2024-01-15", desc: "Added role enum"}
      - {version: "20231201_uuid", date: "2023-12-01", desc: "Migrated to UUID PK"}
```

### Change Impact Matrix
```yaml
change_impact:
  - entity: "src/models/User.ts"
    type: "model"
    criticality: "CRITICAL"
    direct_dependents: 45
    indirect_dependents: 128
    total_impact: 173
    
    if_modified:
      breaking:
        - {scenario: "Change User interface", affected: "All imports", level: "critical", count: 45, fix: "Update type definitions"}
        - {scenario: "Change DB schema", affected: "All API/services", level: "critical", count: 73, fix: "Migration + code updates"}
      
      non_breaking:
        - {scenario: "Add optional field", affected: "None immediate", level: "low", fix: "Update interfaces, add migration"}
        - {scenario: "Add helper method", affected: "None", level: "minimal"}
    
    test_coverage_required: {unit: 25, integration: 18, e2e: 4}
    deployment: ["DB migration required", "24h compatibility window", "Feature flag: use_new_user_schema"]
```

### Security-Critical Paths
```yaml
security_critical_paths:
  - path: "Authentication Flow"
    entry: "src/api/auth/controller.ts"
    components:
      - {file: "src/api/auth/controller.ts", function: "login", lines: [23,67], concerns: ["password verification", "JWT generation"]}
      - {file: "src/services/authService.ts", function: "verifyPassword", lines: [45,58], concerns: ["timing attack prevention", "bcrypt"]}
      - {file: "src/middleware/auth.ts", function: "requireAuth", lines: [12,34], concerns: ["JWT verification", "token expiration"]}
    
    threats:
      - {type: "Brute Force", mitigation: "Rate limiting", location: "src/middleware/rateLimit.ts:23"}
      - {type: "Session Hijacking", mitigation: "HTTP-only cookies + CSRF", location: "src/config/session.ts:15"}
    
    audit: ["All auth attempts logged", "Failed logins trigger alerts after 5 attempts", "24h token expiration"]
  
  - path: "Payment Processing"
    entry: "src/api/payments/controller.ts"
    components:
      - {file: "src/api/payments/controller.ts", function: "processPayment", lines: [89,145], concerns: ["PCI compliance", "amount validation"]}
      - {file: "src/services/stripe.ts", function: "createCharge", lines: [34,67], concerns: ["API key security", "idempotency"]}
    
    compliance: ["PCI-DSS Level 2", "No CC numbers stored", "Payment logs encrypted at rest"]
```

### Code Quality Metrics
```yaml
quality_metrics:
  overall_score: 7.8/10
  
  maintainability:
    excellent: {count: 145, percent: 11.6%}
    good: {count: 823, percent: 66.0%}
    moderate: {count: 234, percent: 18.8%}
    poor: {count: 45, percent: 3.6%}
  
  complexity:
    simple: {count: 1089, percent: 68.2%}
    moderate: {count: 412, percent: 25.8%}
    complex: {count: 78, percent: 4.9%}
    very_complex: {count: 18, percent: 1.1%}
  
  most_complex:
    - {name: "processCheckout", file: "src/api/orders/controller.ts", complexity: 45, lines: 234, fix: "Refactor into smaller functions"}
    - {name: "validateOrderData", file: "src/services/orderService.ts", complexity: 38, lines: 189, fix: "Extract validation rules"}
  
  test_coverage:
    overall: 78.5%
    by_type: {controllers: 85%, services: 92%, models: 88%, utils: 95%, components: 72%}
    untested_files: 15
    critical_untested: 2
  
  duplication:
    lines: 2341
    percent: 1.49%
    largest: {lines: 45, occurrences: 3, files: ["src/api/users/controller.ts:145", "src/api/products/controller.ts:234"], fix: "Extract to shared utility"}
  
  technical_debt: {hours: 127, high: 23, medium: 67, low: 145}
```

## 4. SMART QUERY CAPABILITIES

After indexing, answer questions like:

**"What breaks if I change the User model?"**
- Direct impact: 45 files
- Indirect impact: 128 files
- Critical paths: Authentication, User Profile, Order Processing
- Tests to run: 47
- Estimated fix time: 4-6 hours

**"Where is user email validation handled?"**
- Primary: `src/utils/validators.ts:23-45`
- Also used: `src/api/users/controller.ts:78`, `src/api/auth/controller.ts:45`
- Test coverage: 100%

**"Which endpoints need authentication?"**
- List all endpoints with `auth_required: true`
- Show middleware chain for each
- Identify permission requirements

**"What's the data flow for user registration?"**
- Entry: `POST /api/auth/register`
- Flow: Controller → Service → Validation → DB → Email Service → Response
- Side effects: Welcome email, audit log, analytics event

## 5. LANGUAGE-SPECIFIC INDEXING

### Python Projects
```yaml
python_specific:
  - Virtual environment detection (venv, conda)
  - Package manager (pip, poetry, pipenv)
  - Framework detection (Django, Flask, FastAPI)
  - Type hints analysis (mypy compatibility)
  - Async/await patterns
  - Decorator usage mapping
```

### Go Projects
```yaml
go_specific:
  - Module structure (go.mod analysis)
  - Interface implementations
  - Goroutine usage patterns
  - Channel communication maps
  - Error handling patterns
  - Dependency injection patterns
```

### Rust Projects
```yaml
rust_specific:
  - Cargo workspace structure
  - Trait implementations
  - Lifetime annotations
  - Ownership patterns
  - Macro usage
  - Unsafe code blocks
```

### Java/Kotlin Projects
```yaml
java_kotlin_specific:
  - Build tool (Maven, Gradle)
  - Spring/Spring Boot detection
  - Annotation mapping
  - Dependency injection
  - Interface/abstract class hierarchy
  - Kotlin-specific (coroutines, data classes, sealed classes)
```

## 6. RESPONSE FORMAT

When user triggers "FULLINDEX":

```
🗺️ CODEBASE INDEX COMPLETE

📊 Project Overview:
- Name: [project-name]
- Size: [N files, N lines, X MB]
- Languages: [Primary: X%, Secondary: Y%]
- Architecture: [Pattern description]

🏗️ Structure:
- Entry Points: [N found]
- API Endpoints: [N cataloged]
- Components: [N indexed]
- Database Tables: [N mapped]

🔗 Dependencies:
- External Packages: [N]
- Internal Modules: [N]
- Circular Dependencies: [N found]
- Dead Code: [N files/functions]

🎯 Critical Paths:
- Security-Sensitive: [N paths]
- Business-Critical: [N functions]
- High-Risk Changes: [N entities]

📈 Quality Metrics:
- Overall Score: [X/10]
- Test Coverage: [X%]
- Complexity: [X% simple, Y% complex]
- Technical Debt: [X hours]

✅ Index saved to: [path/to/index.yaml]
```

---

## Meta-Rule

**The index should be comprehensive enough that an AI can answer ANY question about the codebase without reading the actual source files.**

---

*Related Protocols:*
- [code_review_protocol.md](code_review_protocol.md) - Use index for context-aware reviews
- [debug_protocol.md](debug_protocol.md) - Use index to trace bugs
- [Back to Master Protocol](../MASTER_PROTOCOL.md)
---

*Last Updated: 2025-12-22*  
*Protocol Version: 2.0.0*

