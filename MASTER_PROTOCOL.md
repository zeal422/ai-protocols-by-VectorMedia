---
protocol_version: "1.1.0"
last_updated: "2025-12-22"
status: "stable"
---

# MASTER_PROTOCOL.md - Unified AI Development Protocol

## Purpose

This is the **MASTER PROTOCOL** - an intelligent orchestrator that guides AI assistants to use the right specialized protocols based on user requests. When a user says "use the MASTER_PROTOCOL to...", this document ensures the AI:

1. **Understands the context** of what's being asked
2. **Selects the appropriate protocol(s)** from the available specialized protocols
3. **Respects the existing codebase** - no unauthorized UI/design/architecture changes
4. **Delivers consistent, non-hallucinated responses** by following established patterns

---

## 🎯 Core Directive

**ALWAYS start by understanding the user's intent, then route to the appropriate protocol(s).**

### Universal Rules (Apply to ALL Tasks)

1. **Codebase Respect Protocol**
   - NEVER modify UI/design/styling unless explicitly requested
   - NEVER change architecture patterns without user permission
   - NEVER alter existing component libraries or frameworks
   - ALWAYS analyze existing patterns first, then follow them
   - ALWAYS preserve existing naming conventions, file structures, and code style

2. **Evidence-Based Actions**
   - NO speculation or assumptions about code behavior
   - ALWAYS verify by reading actual code before making changes
   - ALWAYS check for existing implementations before creating new ones
   - ALWAYS look for configuration files, package.json, tsconfig, etc.

3. **Zero Hallucination Policy**
   - If you don't know, say "I need to check [specific file/pattern]"
   - Never invent APIs, functions, or patterns that don't exist in the codebase
   - Always confirm library versions and available features
   - When suggesting code, base it on actual codebase patterns

---

## 🧭 Protocol Selection Guide

Use this decision tree to determine which protocol(s) to activate:

### 1. Code Review Requests
**Triggers:** "review this code", "check my PR", "audit this file", "code review"

**Primary Protocol:** `code_review_protocol.md`

**Secondary Protocols:**
- `codebase_indexing_protocol.md` - To understand dependencies and impact
- `test_automation_protocol.md` - To verify test coverage

**Approach:**
1. Read the code review protocol
2. Index related files to understand context
3. Apply the Four Pillars (Correctness, Readability, Performance, Maintainability)
4. Check for anti-patterns (logic, architecture, performance, security)
5. Provide structured feedback (Strengths, Critical Issues, Suggestions, Questions)

---

### 2. Bug Fixing / Debugging Requests
**Triggers:** "fix this bug", "why isn't this working", "debug", "error", "broken"

**Primary Protocol:** `debug_protocol.md`

**Secondary Protocols:**
- `error_fix_protocol.md` - For auto-fix severity classification
- `codebase_indexing_protocol.md` - To trace error propagation

**Approach:**
1. Apply The Scientific Method (Reproduce → Observe → Hypothesize → Test → Isolate → Verify → Document)
2. Gather required information (logs, environment, reproduction steps)
3. Form 3-5 ranked hypotheses
4. Propose experiments to eliminate theories
5. Classify fix severity (SAFE → HIGH-RISK)
6. Provide fix with verification steps

**Special Mode:** If user says "DEEPDIVE", activate full system scan:
- Multi-layer investigation: symptom → code → architecture → environment
- Historical analysis: code evolution and refactoring history
- Blast radius assessment: identify cascading failures

---

### 3. Error Auto-Fixing Requests
**Triggers:** "auto-fix errors", "fix linting issues", "clean up warnings"

**Primary Protocol:** `error_fix_protocol.md`

**Approach:**
1. Classify errors by severity:
   - 🟢 SAFE (Auto-fix ALWAYS): Formatting, unused imports, semicolons
   - 🟡 LOW-RISK (Auto-fix WITH CONFIRMATION): Type annotations, simple refactors
   - 🟠 MODERATE (Auto-fix SHOW DIFF FIRST): Logic changes, API modifications
   - 🔴 HIGH-RISK (Auto-fix NEVER): Database migrations, auth, payments
2. Apply fixes according to severity classification
3. Use the Fix Template Format for transparency

---

### 4. Testing Requests
**Triggers:** "write tests", "test coverage", "add unit tests", "e2e tests"

**Primary Protocol:** `test_automation_protocol.md`

**Secondary Protocols:**
- `codebase_indexing_protocol.md` - To find existing test patterns

**Approach:**
1. Analyze existing test patterns in the codebase
2. Apply coverage requirements:
   - Business-Critical: 100% coverage
   - Core Features: 80%+ coverage
   - Utilities: 70%+ coverage
3. Write tests you'd want to debug at 3 AM:
   - Clear, descriptive names
   - Obvious input data
   - Specific assertions
   - Helpful error messages
4. Verify Test Quality Checklist items

---

### 5. Frontend Development Requests
**Triggers:** "create component", "build UI", "frontend feature", "React component"

**Primary Protocol:** `moreFRONTend-PROTOCOL.md`

**Secondary Protocols:**
- `FRONTandBACKend-PROTOCOL.md` - For full-stack context
- `OPTIMIZED_LINT_SETUP.md` - For linting configuration

**Approach:**
1. **CRITICAL:** Detect existing UI library (Shadcn UI, Radix, MUI, etc.)
2. **MUST USE DETECTED LIBRARY** - Do NOT build from scratch if library provides it
3. Apply Design Philosophy:
   - Intentional Minimalism: Every element has purpose
   - Anti-Generic: Reject bootstrapped layouts
   - Library Discipline: Use existing primitives
4. Follow existing component patterns in the codebase
5. Ensure accessibility (WCAG standards)
6. Consider rendering performance

**Special Mode:** If user says "ULTRATHINK", apply:
- Multi-dimensional analysis (psychological, technical, accessibility, scalability)
- WCAG AAA compliance
- Exhaustive edge case analysis

---

### 6. Backend Development Requests
**Triggers:** "API endpoint", "backend service", "database", "server logic"

**Primary Protocol:** `FRONTandBACKend-PROTOCOL.md`

**Secondary Protocols:**
- `codebase_indexing_protocol.md` - For API endpoint cataloging
- `test_automation_protocol.md` - For API testing

**Approach:**
1. Index existing API patterns
2. Follow established routing conventions
3. Verify authentication/authorization patterns
4. Apply security best practices (no SQL injection, XSS, exposed secrets)
5. Ensure proper error handling
6. Add comprehensive tests

---

### 7. Full Codebase Analysis / Refactoring
**Triggers:** "analyze codebase", "refactor", "improve architecture", "audit entire project"

**Primary Protocol:** `bigpappa_protocol_reviewANDfixes.md`

**Secondary Protocols:**
- `codebase_indexing_protocol.md` - For comprehensive indexing
- `code_review_protocol.md` - For quality assessment

**Approach:**
1. Build comprehensive codebase index:
   - File-Level Index (entry points, configs, utilities)
   - Function-Level Index (core business logic)
   - Component-Level Index (frontend components with props)
   - API Endpoint Catalog
   - Database Schema Index
   - Change Impact Matrix
2. Identify patterns and anti-patterns
3. Propose surgical improvements (not aggressive refactoring)
4. Maintain backward compatibility unless explicitly told otherwise

---

### 8. Codebase Understanding / Indexing
**Triggers:** "explain this codebase", "how does this work", "map dependencies"

**Primary Protocol:** `codebase_indexing_protocol.md`

**Approach:**
1. Create appropriate index type(s):
   - File-Level Index
   - Function-Level Index
   - Component-Level Index
   - API Endpoint Catalog
   - Database Schema Index
   - Change Impact Matrix
   - Code Quality Metrics
2. Document relationships and dependencies
3. Identify critical paths and entry points
4. **Golden Rule:** A perfect index makes every code change predictable

---

### 9. Linting / Code Formatting Setup
**Triggers:** "setup linting", "configure prettier", "eslint config"

**Primary Protocol:** `OPTIMIZED_LINT_SETUP.md`

**Approach:**
1. Detect existing tech stack (React, TypeScript, Tailwind, etc.)
2. Recommend appropriate tools:
   - ESLint for JavaScript/TypeScript
   - Prettier for formatting
   - Appropriate plugins (react, react-hooks, tailwindcss, typescript-eslint)
3. Configure automatic import sorting, class ordering
4. Enable accessibility linting (jsx-a11y)
5. Setup pre-commit hooks if requested

---

### 10. Security Audit Requests
**Triggers:** "security audit", "vulnerability scan", "check for security issues", "OWASP"

**Primary Protocol:** `security_audit_protocol.md`

**Secondary Protocols:**
- `code_review_protocol.md` - For security-focused review
- `api_design_protocol.md` - For API security patterns

**Approach:**
1. Apply OWASP Top 10 checklist
2. Scan for secret detection patterns
3. Review authentication/authorization logic
4. Check for injection vulnerabilities (SQL, XSS, Command)
5. Verify security headers and configurations
6. Generate security audit report with CVSS scores

**Special Mode:** If user says "SECAUDIT", activate full security scan:
- Complete OWASP Top 10 verification
- Secret detection in code and git history
- Dependency vulnerability scanning
- API endpoint security testing

---

### 11. Accessibility Testing Requests
**Triggers:** "accessibility", "a11y", "WCAG", "screen reader", "keyboard navigation"

**Primary Protocol:** `accessibility_protocol.md`

**Secondary Protocols:**
- `moreFRONTend-PROTOCOL.md` - For accessible component patterns
- `test_automation_protocol.md` - For accessibility testing automation

**Approach:**
1. Apply WCAG 2.1 Level AA checklist
2. Test keyboard navigation
3. Verify screen reader compatibility
4. Check color contrast ratios
5. Review ARIA implementation
6. Generate accessibility audit report

**Special Mode:** If user says "A11YCHECK", activate full accessibility audit:
- Complete WCAG 2.1 verification (Level A, AA, AAA)
- Automated testing with axe-core
- Manual screen reader testing checklist
- Focus management review

---

### 12. Git Workflow / Version Control Requests
**Triggers:** "git", "commit", "branch", "PR", "merge strategy"

**Primary Protocol:** `git_workflow_protocol.md`

**Approach:**
1. Analyze current git workflow
2. Recommend branching strategy (GitHub Flow, GitFlow, Trunk-based)
3. Configure commit message conventions (Conventional Commits)
4. Setup git hooks (pre-commit, commit-msg)
5. Configure CI/CD integration

**Special Mode:** If user says "GITFLOW", provide comprehensive git workflow setup:
- Complete branching strategy
- PR/MR templates
- Commit linting configuration
- CI/CD pipeline examples

---

### 13. API Design Requests
**Triggers:** "API design", "REST", "GraphQL", "endpoint", "API documentation"

**Primary Protocol:** `api_design_protocol.md`

**Secondary Protocols:**
- `security_audit_protocol.md` - For API security
- `test_automation_protocol.md` - For API testing

**Approach:**
1. Follow REST conventions or GraphQL best practices
2. Design consistent error handling
3. Implement pagination, filtering, sorting
4. Configure rate limiting
5. Generate OpenAPI/GraphQL documentation
6. Apply versioning strategy

**Special Mode:** If user says "APIDESIGN", provide complete API design:
- Full schema design
- Error handling patterns
- Authentication/authorization setup
- Rate limiting configuration
- Documentation generation

---

### 14. Performance Optimization Requests
**Triggers:** "performance", "slow", "optimize", "Core Web Vitals", "speed"

**Primary Protocol:** `performance_protocol.md`

**Secondary Protocols:**
- `codebase_indexing_protocol.md` - To identify hotspots
- `moreFRONTend-PROTOCOL.md` - For frontend performance

**Approach:**
1. Measure Core Web Vitals (LCP, INP, CLS)
2. Profile frontend bundle size
3. Analyze database queries (N+1, missing indexes)
4. Review caching strategies
5. Set performance budgets
6. Configure monitoring and alerting

**Special Mode:** If user says "PERFAUDIT", activate full performance audit:
- Complete Core Web Vitals analysis
- Bundle analysis with recommendations
- Database query profiling
- Caching strategy review
- Performance budget setup

---

## 🔄 Multi-Protocol Workflows

Some requests require multiple protocols working in sequence:

### "Review and fix bugs in this PR"
1. `code_review_protocol.md` - Identify issues
2. `debug_protocol.md` - Analyze bugs
3. `error_fix_protocol.md` - Apply fixes
4. `test_automation_protocol.md` - Add tests for fixes

### "Build a new feature with tests"
1. `codebase_indexing_protocol.md` - Understand existing patterns
2. `FRONTandBACKend-PROTOCOL.md` OR `moreFRONTend-PROTOCOL.md` - Implement feature
3. `test_automation_protocol.md` - Write comprehensive tests
4. `code_review_protocol.md` - Self-review before presenting

### "Improve code quality across the project"
1. `bigpappa_protocol_reviewANDfixes.md` - Comprehensive audit
2. `codebase_indexing_protocol.md` - Build quality metrics index
3. `error_fix_protocol.md` - Auto-fix safe issues
4. `code_review_protocol.md` - Manual review for complex issues

---

## 📋 Step-by-Step Execution Template

When user invokes "use the MASTER_PROTOCOL to [request]", follow this template:

### Step 1: Intent Analysis
```
🎯 UNDERSTANDING REQUEST:
- Primary goal: [What user wants]
- Type of task: [Code review / Bug fix / Feature development / etc.]
- Scope: [Single file / Module / Full codebase]
- Constraints: [Performance / Security / Accessibility / etc.]
```

### Step 2: Codebase Reconnaissance
```
🔍 CODEBASE ANALYSIS:
- Existing patterns detected: [List key patterns]
- Tech stack: [Languages, frameworks, libraries]
- UI library: [Shadcn / MUI / Custom / None]
- Test framework: [Jest / Vitest / Pytest / None]
- Code style: [Existing conventions observed]
```

### Step 3: Protocol Selection
```
📚 ACTIVATING PROTOCOLS:
- Primary: [protocol_name.md]
- Secondary: [protocol_name.md, protocol_name.md]
- Reason: [Why these protocols are appropriate]
```

### Step 4: Execution
```
⚙️ EXECUTION PLAN:
1. [Specific action based on protocol]
2. [Specific action based on protocol]
3. [Specific action based on protocol]
```

### Step 5: Delivery
```
✅ DELIVERABLE:
[Code changes / Review feedback / Tests / Documentation]

🔐 VERIFICATION:
[How to verify the solution works]

📝 NOTES:
[Any important considerations or follow-ups]
```

---

## 🚨 Critical Safety Rules

### NEVER Do These Without Explicit Permission:
1. ❌ Change UI/design/styling
2. ❌ Modify database schemas
3. ❌ Alter authentication/authorization logic
4. ❌ Change API contracts (breaking changes)
5. ❌ Refactor core architecture
6. ❌ Switch frameworks or libraries
7. ❌ Remove existing features
8. ❌ Modify build/deployment configurations

### ALWAYS Do These:
1. ✅ Read existing code before suggesting changes
2. ✅ Follow established patterns in the codebase
3. ✅ Preserve existing naming conventions
4. ✅ Maintain backward compatibility
5. ✅ Add tests for new code
6. ✅ Document why changes are made
7. ✅ Ask for clarification when uncertain
8. ✅ Provide verification steps

---

## 🧠 Anti-Hallucination Checklist

Before responding to any request:
- [ ] Have I read the actual code files?
- [ ] Have I verified the library/framework versions?
- [ ] Am I suggesting patterns that exist in this codebase?
- [ ] Have I checked for existing implementations?
- [ ] Am I respecting the existing architecture?
- [ ] Have I avoided inventing APIs or functions?
- [ ] Can I point to specific files/lines that support my response?
- [ ] Have I followed the appropriate protocol(s)?

---

## 📖 Protocol Reference Quick Links

- **Code Review:** `code_review_protocol.md`
- **Debugging:** `debug_protocol.md`
- **Error Fixing:** `error_fix_protocol.md`
- **Testing:** `test_automation_protocol.md`
- **Frontend:** `moreFRONTend-PROTOCOL.md`
- **Full-Stack:** `FRONTandBACKend-PROTOCOL.md`
- **Comprehensive Audit:** `bigpappa_protocol_reviewANDfixes.md`
- **Codebase Indexing:** `codebase_indexing_protocol.md`
- **Linting Setup:** `OPTIMIZED_LINT_SETUP.md`

---

## 🎓 Example Usage

### User Request: "Use the MASTER_PROTOCOL to review my authentication code"

**AI Response:**
```
🎯 UNDERSTANDING REQUEST:
- Primary goal: Code review of authentication logic
- Type of task: Code review + Security audit
- Scope: Authentication module
- Constraints: Security is critical (HIGH-RISK category)

🔍 CODEBASE ANALYSIS:
- Existing patterns: JWT-based auth, bcrypt for passwords
- Tech stack: Node.js, Express, TypeScript
- Security measures: Rate limiting detected, HTTPS enforced
- Test coverage: 65% (below 80% target for core features)

📚 ACTIVATING PROTOCOLS:
- Primary: code_review_protocol.md (Four Pillars analysis)
- Secondary: debug_protocol.md (potential security vulnerabilities)
- Secondary: test_automation_protocol.md (verify test coverage)

⚙️ EXECUTION PLAN:
1. Apply Four Pillars framework to auth code
2. Check for security anti-patterns (SQL injection, XSS, exposed secrets)
3. Verify proper error handling and rate limiting
4. Assess test coverage for auth flows
5. Provide structured feedback

[Detailed review follows...]
```

### User Request: "Use the MASTER_PROTOCOL to add a search feature to my React app"

**AI Response:**
```
🎯 UNDERSTANDING REQUEST:
- Primary goal: Implement search functionality
- Type of task: Feature development (Frontend)
- Scope: New component + API integration
- Constraints: Must match existing design system

🔍 CODEBASE ANALYSIS:
- Existing patterns: React 18, TypeScript, React Query for data fetching
- UI library: Shadcn UI detected (MUST USE existing components)
- Styling: Tailwind CSS with custom theme
- Component structure: Feature-based folder structure
- Search patterns: Debounced input already used in UserSearch component

📚 ACTIVATING PROTOCOLS:
- Primary: moreFRONTend-PROTOCOL.md (UI component development)
- Secondary: FRONTandBACKend-PROTOCOL.md (API integration)
- Secondary: test_automation_protocol.md (component testing)
- Secondary: OPTIMIZED_LINT_SETUP.md (ensure linting compliance)

⚙️ EXECUTION PLAN:
1. Reuse existing Shadcn UI Input and Command components
2. Follow debounced input pattern from UserSearch
3. Use React Query for search API calls
4. Match existing Tailwind theme classes
5. Add comprehensive tests (user interaction, API mocking, edge cases)
6. Ensure accessibility (keyboard navigation, ARIA labels)

[Implementation follows...]
```

---

## 🎯 Success Metrics

After completing a request using MASTER_PROTOCOL, verify:
- [ ] Appropriate protocol(s) were selected and followed
- [ ] Existing codebase patterns were respected
- [ ] No unauthorized UI/design/architecture changes
- [ ] Evidence-based decisions (no hallucinations)
- [ ] Code follows existing conventions
- [ ] Tests added where appropriate
- [ ] Verification steps provided
- [ ] User's original intent satisfied

---

## 🌐 Framework Detection & Protocol Routing

### Language Detection

| File Indicator | Language | Primary Protocols |
|----------------|----------|-------------------|
| `package.json` | JavaScript/TypeScript | `moreFRONTend-PROTOCOL.md`, `FRONTandBACKend-PROTOCOL.md` |
| `requirements.txt`, `pyproject.toml` | Python | `api_design_protocol.md`, `test_automation_protocol.md` |
| `go.mod` | Go | `api_design_protocol.md`, `performance_protocol.md` |
| `Cargo.toml` | Rust | `performance_protocol.md`, `security_audit_protocol.md` |
| `build.gradle`, `pom.xml` | Java/Kotlin | `api_design_protocol.md`, `test_automation_protocol.md` |

### Frontend Frameworks

| Detection | Framework | Protocol | Special Notes |
|-----------|-----------|----------|---------------|
| `package.json: "react"` | React | `moreFRONTend-PROTOCOL.md` | Use hooks, functional components |
| `package.json: "vue"` | Vue | `moreFRONTend-PROTOCOL.md` | Composition API preferred |
| `package.json: "svelte"` | Svelte | `moreFRONTend-PROTOCOL.md` | Reactive declarations |
| `package.json: "@angular/core"` | Angular | `moreFRONTend-PROTOCOL.md` | TypeScript strict mode |
| `package.json: "next"` | Next.js | `FRONTandBACKend-PROTOCOL.md` | SSR/SSG patterns |
| `package.json: "nuxt"` | Nuxt | `FRONTandBACKend-PROTOCOL.md` | Vue SSR patterns |

### Backend Frameworks

| Detection | Framework | Protocol | Special Notes |
|-----------|-----------|----------|---------------|
| `package.json: "express"` | Express.js | `api_design_protocol.md` | Middleware patterns |
| `package.json: "fastify"` | Fastify | `api_design_protocol.md` | Schema validation |
| `package.json: "nestjs"` | NestJS | `FRONTandBACKend-PROTOCOL.md` | Decorators, DI |
| `requirements.txt: "django"` | Django | `api_design_protocol.md` | ORM, MVT pattern |
| `requirements.txt: "fastapi"` | FastAPI | `api_design_protocol.md` | Type hints, async |
| `requirements.txt: "flask"` | Flask | `api_design_protocol.md` | Minimal framework |
| `go.mod: "gin-gonic/gin"` | Gin | `api_design_protocol.md` | Middleware chain |
| `go.mod: "gofiber/fiber"` | Fiber | `api_design_protocol.md` | Express-like API |
| `Cargo.toml: "actix-web"` | Actix | `api_design_protocol.md` | Actor model |
| `Cargo.toml: "axum"` | Axum | `api_design_protocol.md` | Tower middleware |
| `build.gradle: "spring-boot"` | Spring Boot | `api_design_protocol.md` | Annotations, DI |
| `build.gradle: "ktor"` | Ktor | `api_design_protocol.md` | Kotlin coroutines |

### Database/ORM Detection

| Detection | Technology | Special Considerations |
|-----------|------------|------------------------|
| `package.json: "prisma"` | Prisma | Type-safe queries, migrations |
| `package.json: "typeorm"` | TypeORM | Decorators, active record |
| `package.json: "drizzle-orm"` | Drizzle | SQL-like, migrations |
| `requirements.txt: "sqlalchemy"` | SQLAlchemy | ORM/Core modes |
| `requirements.txt: "django"` | Django ORM | Built-in migrations |
| `go.mod: "gorm.io/gorm"` | GORM | Callbacks, hooks |
| `Cargo.toml: "diesel"` | Diesel | Type-safe, compile-time |
| `Cargo.toml: "sqlx"` | SQLx | Async, compile-time checks |

### Testing Framework Detection

| Detection | Framework | Test Command |
|-----------|-----------|--------------|
| `package.json: "jest"` | Jest | `npm test` |
| `package.json: "vitest"` | Vitest | `npm test` |
| `package.json: "mocha"` | Mocha | `npm test` |
| `requirements.txt: "pytest"` | pytest | `pytest` |
| `go.mod` (any) | go test | `go test ./...` |
| `Cargo.toml` (any) | cargo test | `cargo test` |
| `build.gradle: "junit"` | JUnit | `./gradlew test` |
| `build.gradle: "kotest"` | Kotest | `./gradlew test` |

---

## Meta-Protocol Rule

**When in doubt, ask the user for clarification rather than making assumptions.**

This MASTER_PROTOCOL is designed to reduce hallucinations, respect existing codebases, and provide consistent, high-quality AI assistance across all development tasks.

---

*Last Updated: 2025-12-22*
*Protocol Version: 1.1.0*

---

*Related Protocols:*
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - One-page cheat sheet
- [AGENTS.md](AGENTS.md) - AI assistant instructions
- [CHANGELOG.md](CHANGELOG.md) - Version history
