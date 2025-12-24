---
protocol_version: "2.3.1"
last_updated: "2025-12-23"
status: "Official Release (Dec 2025 - Zero-Error MDAP Suite)"
---

# MASTER_PROTOCOL.md - Unified AI Development Protocol

## Purpose

The **MASTER PROTOCOL** intelligently routes AI assistants to specialized protocols based on user requests. It ensures:
1. Context understanding
2. Appropriate protocol selection
3. Codebase respect - no unauthorized changes
4. Consistent, evidence-based responses

---

## 🎯 Core Directive

**ALWAYS understand user intent, then route to appropriate protocol(s).**

### Universal Rules (ALL Tasks)

**Codebase Respect:**
- NEVER modify UI/design/styling unless explicitly requested
- NEVER change architecture without permission
- ALWAYS analyze existing patterns first, then follow them
- ALWAYS preserve naming conventions, file structures, code style

**Evidence-Based Actions:**
- NO speculation - verify by reading actual code
- ALWAYS check for existing implementations
- ALWAYS look for config files (package.json, tsconfig, etc.)

**Zero Hallucination:**
- If uncertain, say "I need to check [specific file/pattern]"
- Never invent APIs, functions, or patterns
- Always confirm library versions and features
- Base suggestions on actual codebase patterns

---

## 🧭 Protocol Selection Guide

### 1. Code Review
**Triggers:** "review", "check PR", "audit", "code review"  
**Primary:** `BRAIN/code_review_protocol.md`  
**Secondary:** `BRAIN/codebase_indexing_protocol.md`, `BRAIN/test_automation_protocol.md`

**Process:**
1. Index related files for context
2. Apply Four Pillars (Correctness, Readability, Performance, Maintainability)
3. Check anti-patterns (logic, architecture, performance, security)
4. Provide structured feedback

---

### 2. Bug Fixing / Debugging
**Triggers:** "fix bug", "debug", "error", "broken", "why isn't this working"  
**Primary:** `BRAIN/debug_protocol.md`  
**Secondary:** `BRAIN/error_fix_protocol.md`, `BRAIN/codebase_indexing_protocol.md`

**Process:**
1. Apply Scientific Method: Reproduce → Observe → Hypothesize → Test → Isolate → Verify → Document
2. Gather info (logs, environment, reproduction steps)
3. Form 3-5 ranked hypotheses
4. Propose experiments
5. Classify fix severity (SAFE → HIGH-RISK)
6. Provide fix with verification

**Special:** "DEEPDIVE" = full system scan (multi-layer investigation, historical analysis, blast radius)

---

### 3. Error Auto-Fixing
**Triggers:** "auto-fix", "fix linting", "clean warnings"  
**Primary:** `BRAIN/error_fix_protocol.md`

**Severity Classification:**
- 🟢 SAFE (auto-fix always): Formatting, unused imports, semicolons
- 🟡 LOW-RISK (confirm): Type annotations, simple refactors
- 🟠 MODERATE (show diff): Logic changes, API modifications
- 🔴 HIGH-RISK (never auto): DB migrations, auth, payments

---

### 4. Testing
**Triggers:** "write tests", "test coverage", "unit tests", "e2e tests"  
**Primary:** `BRAIN/test_automation_protocol.md`  
**Secondary:** `BRAIN/codebase_indexing_protocol.md`

**Coverage Requirements:**
- Business-Critical: 100%
- Core Features: 80%+
- Utilities: 70%+

**Test Quality:** Clear names, obvious inputs, specific assertions, helpful errors

---

### 5. Frontend Development
**Triggers:** "create component", "build UI", "frontend", "React component"  
**Primary:** `BRAIN/moreFRONTend-PROTOCOL.md`  
**Secondary:** `BRAIN/FRONTandBACKend-PROTOCOL.md`, `BRAIN/OPTIMIZED_LINT_SETUP.md`

**CRITICAL:**
1. Detect existing UI library (Shadcn, Radix, MUI, etc.)
2. MUST USE detected library - don't build from scratch
3. Follow existing component patterns
4. Ensure accessibility (WCAG)
5. Consider rendering performance

**Special:** "ULTRATHINK" = multi-dimensional analysis (psychological, technical, a11y, scalability, WCAG AAA)

---

### 6. Backend Development
**Triggers:** "API endpoint", "backend service", "database", "server logic"  
**Primary:** `BRAIN/FRONTandBACKend-PROTOCOL.md`  
**Secondary:** `BRAIN/codebase_indexing_protocol.md`, `BRAIN/test_automation_protocol.md`

**Process:**
1. Index existing API patterns
2. Follow routing conventions
3. Verify auth/authorization patterns
4. Apply security best practices (no SQL injection, XSS, exposed secrets)
5. Ensure proper error handling
6. Add comprehensive tests

---

### 7. Full Codebase Analysis / Architecture
**Triggers:** "analyze codebase", "improve architecture", "audit project"  
**Primary:** `BRAIN/bigpappa_protocol_reviewANDfixes.md`  
**Secondary:** `BRAIN/codebase_indexing_protocol.md`, `BRAIN/code_review_protocol.md`

**Build Index:**
- File-Level (entry points, configs, utilities)
- Function-Level (core business logic)
- Component-Level (frontend with props)
- API Endpoint Catalog
- Database Schema
- Change Impact Matrix

**Approach:** Surgical improvements, maintain backward compatibility unless told otherwise

---

### 8. Codebase Understanding / Indexing
**Triggers:** "explain codebase", "how does this work", "map dependencies"  
**Primary:** `BRAIN/codebase_indexing_protocol.md`

**Index Types:** File-Level, Function-Level, Component-Level, API Catalog, DB Schema, Impact Matrix, Quality Metrics

**Golden Rule:** A perfect index makes every code change predictable

---

### 9. Linting / Code Formatting
**Triggers:** "setup linting", "configure prettier", "eslint config"  
**Primary:** `BRAIN/OPTIMIZED_LINT_SETUP.md`

**Process:**
1. Detect tech stack
2. Recommend tools (ESLint, Prettier, plugins)
3. Configure import sorting, class ordering
4. Enable accessibility linting (jsx-a11y)
5. Setup pre-commit hooks if requested

---

### 10. Security Audit
**Triggers:** "security audit", "vulnerability scan", "security issues", "OWASP"  
**Primary:** `BRAIN/security_audit_protocol.md`  
**Secondary:** `BRAIN/code_review_protocol.md`, `BRAIN/api_design_protocol.md`

**Process:**
1. Apply OWASP Top 10 checklist
2. Scan for secret detection
3. Review auth/authorization logic
4. Check injection vulnerabilities
5. Verify security headers
6. Generate audit report with CVSS scores

**Special:** "SECAUDIT" = full scan (OWASP Top 10, secret detection, dependency scanning, API testing)

---

### 11. Accessibility Testing
**Triggers:** "accessibility", "a11y", "WCAG", "screen reader", "keyboard navigation"  
**Primary:** `BRAIN/accessibility_protocol.md`  
**Secondary:** `BRAIN/moreFRONTend-PROTOCOL.md`, `BRAIN/test_automation_protocol.md`

**Process:**
1. Apply WCAG 2.1 Level AA checklist
2. Test keyboard navigation
3. Verify screen reader compatibility
4. Check color contrast
5. Review ARIA implementation
6. Generate accessibility report

**Special:** "A11YCHECK" = full audit (WCAG A/AA/AAA, axe-core, screen reader testing, focus management)

---

### 12. Git Workflow
**Triggers:** "git", "commit", "branch", "PR", "merge strategy"  
**Primary:** `BRAIN/git_workflow_protocol.md`

**Process:**
1. Analyze current workflow
2. Recommend branching strategy (GitHub Flow, GitFlow, Trunk-based)
3. Configure commit conventions (Conventional Commits)
4. Setup git hooks
5. Configure CI/CD integration

**Special:** "GITFLOW" = comprehensive setup (branching, PR templates, commit linting, CI/CD)

---

### 13. API Design
**Triggers:** "API design", "REST", "GraphQL", "endpoint", "API docs"  
**Primary:** `BRAIN/api_design_protocol.md`  
**Secondary:** `BRAIN/security_audit_protocol.md`, `BRAIN/test_automation_protocol.md`

**Process:**
1. Follow REST/GraphQL best practices
2. Design consistent error handling
3. Implement pagination, filtering, sorting
4. Configure rate limiting
5. Generate OpenAPI/GraphQL docs
6. Apply versioning strategy

**Special:** "APIDESIGN" = complete design (schema, error handling, auth, rate limiting, docs)

---

### 14. Performance Optimization
**Triggers:** "performance", "slow", "optimize", "Core Web Vitals", "speed"  
**Primary:** `BRAIN/performance_protocol.md`  
**Secondary:** `BRAIN/codebase_indexing_protocol.md`, `BRAIN/moreFRONTend-PROTOCOL.md`

**Process:**
1. Measure Core Web Vitals (LCP, INP, CLS)
2. Profile bundle size
3. Analyze DB queries (N+1, missing indexes)
4. Review caching strategies
5. Set performance budgets
6. Configure monitoring

**Special:** "PERFAUDIT" = full audit (Core Web Vitals, bundle analysis, DB profiling, caching review, budgets)

---

### 15. Code Refactoring
**Triggers:** "SAFEREFACTOR", "refactor", "improve code structure", "clean up code"  
**Primary:** `BRAIN/refactor_protocol.md`  
**Secondary:** `BRAIN/test_automation_protocol.md`, `BRAIN/code_review_protocol.md`

**Golden Rules:**
- Behavior preservation (exact same functionality)
- Test-driven safety (all tests pass before/after)
- Incremental changes (small, atomic commits)
- Zero breaking changes (unless approved)
- Measurable improvement (readability, performance, maintainability)

**5-Phase Workflow:**
1. **Analysis:** Identify target, understand behavior, assess risk, define metrics
2. **Strategy:** Choose pattern (Extract Function/Class, Inline, Rename, Parameter Object, Polymorphism, Guard Clauses, etc.)
3. **Execution:** Apply ONE pattern at a time, test after EVERY change, commit separately
4. **Validation:** All tests pass, no performance regression, complexity reduced, coverage maintained
5. **Report:** Before/after metrics, git diffs, test results, rollback instructions

**Top Refactoring Patterns:**
- **Extract Function:** Long function (>50 lines) → smaller single-purpose functions
- **Replace Magic Numbers:** Hardcoded values → named constants
- **Decompose Conditional:** Complex if/else → named predicate functions
- **Introduce Parameter Object:** >5 params → grouped object
- **Extract Class:** God class (>500 lines) → cohesive classes
- **Guard Clauses:** Deep nesting → early returns, linear flow

**Safety Checklist:**
- Before: All tests pass, coverage measured, behavior documentation, git branch created
- During: ONE change type, test after EVERY change, commit each step, no feature additions
- After: All tests pass, no performance regression, complexity reduced, docs updated

**Response Format:**
```
🔧 REFACTORING ANALYSIS
Target: [file:lines]
Current Metrics: Complexity X, Lines Y, Nesting Z
Strategy: [Primary Pattern]
Risk: [LOW/MEDIUM/HIGH]
Plan: [N steps with expected improvements]
Expected: Complexity X→A, Lines Y→B, Nesting Z→C
```

---

### 16. ARIA Accessibility
**Triggers:** "FULLARIA", "aria audit", "screen reader optimization"  
**Primary:** `BRAIN/aria_accessibility_protocol.md`  
**Secondary:** `BRAIN/accessibility_protocol.md`, `BRAIN/moreFRONTend-PROTOCOL.md`

**Process:**
1. Apply POUR framework (Perceivable, Operable, Understandable, Robust)
2. Verify semantic HTML usage
3. Audit ARIA roles, states, and properties
4. Test keyboard interactions and focus management
5. Generate accessibility remediation report

**Special:** "FULLARIA" = comprehensive ARIA audit (WCAG AA/AAA, semantic integrity, live regions, focus trapping)

---

### 17. MCP Protocol Retrieval
**Guidance:** Use these tools to find and retrieve specialized protocols from the AI Development Protocols system.

**Workflow:**
1. **Trigger Check:** If the user mentions a known trigger (e.g., `DEEPDIVE`), use `get_protocol_by_trigger`.
2. **Task Search:** If the request is vague (e.g., "help me with tests"), use `search_protocols` with relevant keywords.
3. **Capability Browsing:** If unsure which protocol applies, use `list_protocols` to see all available logic modules.
4. **Exact Retrieval:** Once the protocol name is known, use `get_protocol` to fetch the full instructions.

**Goal:** Never guess protocol content. Always fetch the canonical version via MCP.

---

## 🔄 Multi-Protocol Workflows

**"Review and fix bugs in PR":**
1. `code_review_protocol.md` → Identify issues
2. `debug_protocol.md` → Analyze bugs
3. `error_fix_protocol.md` → Apply fixes
4. `test_automation_protocol.md` → Add tests

**"Build feature with tests":**
1. `codebase_indexing_protocol.md` → Understand patterns
2. `moreFRONTend-PROTOCOL.md` OR `FRONTandBACKend-PROTOCOL.md` → Implement
3. `test_automation_protocol.md` → Write tests
4. `code_review_protocol.md` → Self-review

**"Improve code quality":**
1. `bigpappa_protocol_reviewANDfixes.md` → Comprehensive audit
2. `codebase_indexing_protocol.md` → Build quality metrics
3. `error_fix_protocol.md` → Auto-fix safe issues
4. `code_review_protocol.md` → Manual review

**"Refactor and test legacy code":**
1. `test_automation_protocol.md` → Add characterization tests
2. `refactor_protocol.md` → Apply SAFEREFACTOR workflow
3. `code_review_protocol.md` → Verify improvements
4. `test_automation_protocol.md` → Ensure coverage maintained

---

## 📋 Execution Template

When user invokes "use MASTER_PROTOCOL to [request]":

**1. Intent Analysis**
- Primary goal: [What user wants]
- Task type: [Review/Bug/Feature/etc.]
- Scope: [File/Module/Codebase]
- Constraints: [Performance/Security/A11y]

**2. Codebase Reconnaissance**
- Patterns: [Key patterns detected]
- Stack: [Languages, frameworks, libraries]
- UI library: [Shadcn/MUI/Custom/None]
- Tests: [Jest/Vitest/Pytest/None]
- Style: [Conventions observed]

**3. Protocol Selection**
- Primary: [protocol.md]
- Secondary: [protocol.md, ...]
- Reason: [Why appropriate]

**4. Execution**
1. [Action based on protocol]
2. [Action based on protocol]
3. [Action based on protocol]

**5. Delivery**
- Deliverable: [Code/Review/Tests/Docs]
- Verification: [How to verify]
- Notes: [Considerations/follow-ups]

---

## 🚨 Critical Safety Rules

**NEVER Without Permission:**
❌ Change UI/design/styling  
❌ Modify database schemas  
❌ Alter auth/authorization  
❌ Change API contracts (breaking)  
❌ Refactor core architecture  
❌ Switch frameworks/libraries  
❌ Remove features  
❌ Modify build/deployment configs

**ALWAYS Do:**
✅ Read code before suggesting changes  
✅ Follow established patterns  
✅ Preserve naming conventions  
✅ Maintain backward compatibility  
✅ Add tests for new code  
✅ Document why changes made  
✅ Ask for clarification when uncertain  
✅ Provide verification steps

---

## 🧠 Anti-Hallucination Checklist

- [ ] Read actual code files?
- [ ] Verified library/framework versions?
- [ ] Suggesting patterns that exist in codebase?
- [ ] Checked for existing implementations?
- [ ] Respecting existing architecture?
- [ ] Avoided inventing APIs/functions?
- [ ] Can point to specific files/lines?
- [ ] Followed appropriate protocol(s)?

---

## 🌐 Framework Detection & Routing

### Language Detection
| Indicator | Language | Primary Protocols |
|-----------|----------|-------------------|
| `package.json` | JS/TS | `moreFRONTend`, `FRONTandBACKend` |
| `requirements.txt`, `pyproject.toml` | Python | `api_design`, `test_automation` |
| `go.mod` | Go | `api_design`, `performance` |
| `Cargo.toml` | Rust | `performance`, `security_audit` |
| `build.gradle`, `pom.xml` | Java/Kotlin | `api_design`, `test_automation` |

### Frontend Frameworks
| Detection | Framework | Notes |
|-----------|-----------|-------|
| `"react"` | React | Hooks, functional components |
| `"vue"` | Vue | Composition API |
| `"svelte"` | Svelte | Reactive declarations |
| `"@angular/core"` | Angular | TypeScript strict |
| `"next"` | Next.js | SSR/SSG patterns |
| `"nuxt"` | Nuxt | Vue SSR |

### Backend Frameworks
| Detection | Framework | Notes |
|-----------|-----------|-------|
| `"express"` | Express.js | Middleware patterns |
| `"fastify"` | Fastify | Schema validation |
| `"nestjs"` | NestJS | Decorators, DI |
| `"django"` | Django | ORM, MVT |
| `"fastapi"` | FastAPI | Type hints, async |
| `"flask"` | Flask | Minimal |
| `"gin-gonic/gin"` | Gin | Middleware chain |
| `"actix-web"` | Actix | Actor model |
| `"spring-boot"` | Spring Boot | Annotations, DI |

### Database/ORM
| Detection | Technology | Notes |
|-----------|------------|-------|
| `"prisma"` | Prisma | Type-safe, migrations |
| `"typeorm"` | TypeORM | Decorators, active record |
| `"drizzle-orm"` | Drizzle | SQL-like |
| `"sqlalchemy"` | SQLAlchemy | ORM/Core modes |
| `"gorm.io/gorm"` | GORM | Callbacks, hooks |
| `"diesel"` | Diesel | Type-safe, compile-time |

### Testing Frameworks
| Detection | Framework | Command |
|-----------|-----------|---------|
| `"jest"` | Jest | `npm test` |
| `"vitest"` | Vitest | `npm test` |
| `"pytest"` | pytest | `pytest` |
| `go.mod` | go test | `go test ./...` |
| `Cargo.toml` | cargo test | `cargo test` |
| `"junit"` | JUnit | `./gradlew test` |

---

## 📖 Protocol Reference

- **Code Review:** `BRAIN/code_review_protocol.md`
- **Debugging:** `BRAIN/debug_protocol.md`
- **Error Fixing:** `BRAIN/error_fix_protocol.md`
- **Testing:** `BRAIN/test_automation_protocol.md`
- **Frontend:** `BRAIN/moreFRONTend-PROTOCOL.md`
- **Full-Stack:** `BRAIN/FRONTandBACKend-PROTOCOL.md`
- **Refactoring:** `BRAIN/refactor_protocol.md`
- **Comprehensive Audit:** `BRAIN/bigpappa_protocol_reviewANDfixes.md`
- **Codebase Indexing:** `BRAIN/codebase_indexing_protocol.md`
- **Linting Setup:** `BRAIN/OPTIMIZED_LINT_SETUP.md`
- **Security:** `BRAIN/security_audit_protocol.md`
- **Accessibility:** `BRAIN/accessibility_protocol.md`
- **ARIA Accessibility:** `BRAIN/aria_accessibility_protocol.md`
- **Git Workflow:** `BRAIN/git_workflow_protocol.md`
- **API Design:** `BRAIN/api_design_protocol.md`
- **Performance:** `BRAIN/performance_protocol.md`

---

## Meta-Protocol Rule

**When in doubt, ask for clarification rather than making assumptions.**

This MASTER_PROTOCOL reduces hallucinations, respects existing codebases, and provides consistent, high-quality AI assistance across ALL models (Gemini, Cline, RooCode, KiloCode, Cursor, etc.).

---

*Last Updated: 2025-12-23*  
*Protocol Version: 2.3.1*

---

### ⚡ v2.1.0 Technical Standards (Dec 2025)
- **FE:** React Server Components (RSC) + View Transitions API as default stack.
- **PERF:** INP (Interaction to Next Paint) optimized; React 19 Server Actions integration.
- **A11Y:** WCAG 2.2 Level AA/AAA compliant (Target Size, Focus Appearance).
- **SEC:** AI-Specific Security: Prompt Injection Defense & Insecure Output handling.
