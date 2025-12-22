# AGENTS.md - AI Development Assistant Instructions

## Project Overview

This is a **comprehensive protocol documentation repository** for AI-assisted software development.

- **Purpose:** Standardized protocols that guide AI assistants in performing high-quality development tasks
- **Project Type:** Documentation repository (Markdown files)
- **Primary Language:** Markdown
- **Target Audience:** AI assistants (Claude, ChatGPT, Copilot, Cursor, etc.) and developers using AI tools
- **Version:** 1.1.0
- **Status:** Active Development

## Primary Directive

**Always start with MASTER_PROTOCOL.md** - It serves as the intelligent orchestrator that routes to appropriate specialized protocols based on user requests.

## Important Files and Directories

### Core Protocol Files

- `MASTER_PROTOCOL.md` - **START HERE** - Main orchestrator with routing logic for all request types
- `README.md` - Project overview, quick start guide, and badges
- `AGENTS.md` - This file - Comprehensive instructions for AI assistants
- `QUICK_REFERENCE.md` - One-page cheat sheet for rapid protocol selection
- `CHANGELOG.md` - Version history and upgrade guides
- `REVIEW.md` - Latest code review and quality assessment

### Specialized Development Protocols

- `code_review_protocol.md` - Code review methodology using Four Pillars framework
- `debug_protocol.md` - Scientific debugging methodology with DEEPDIVE mode
- `error_fix_protocol.md` - Autonomous error detection and fixing with AUTODEBUG mode
- `test_automation_protocol.md` - Test coverage and quality standards with FULLSPEC mode
- `codebase_indexing_protocol.md` - Codebase intelligence and dependency mapping with FULLINDEX mode
- `bigpappa_protocol_reviewANDfixes.md` - Comprehensive code audit with BIGPAPPA mode

### Frontend & Backend Protocols

- `moreFRONTend-PROTOCOL.md` - Frontend architecture and UI design with ULTRATHINK mode
- `FRONTandBACKend-PROTOCOL.md` - Full-stack development guidelines with ANTI-GENERIC mode

### Security & Quality Protocols

- `security_audit_protocol.md` - Security auditing with OWASP Top 10, secret detection (SECAUDIT mode)
- `accessibility_protocol.md` - WCAG 2.1 compliance guide with A11YCHECK mode
- `performance_protocol.md` - Core Web Vitals optimization with PERFAUDIT mode
- `api_design_protocol.md` - REST and GraphQL API design patterns with APIDESIGN mode
- `git_workflow_protocol.md` - Version control best practices with GITFLOW mode
- `OPTIMIZED_LINT_SETUP.md` - Linting configuration for React + TypeScript + Tailwind CSS

### Configuration Templates

- `configurations/claude/CLAUDE.md` - Template for Claude Projects configuration
- `configurations/cursor/.cursorrules` - Template for Cursor IDE rules
- `configurations/copilot/copilot-instructions.md` - Template for GitHub Copilot

### Example Implementations

- `examples/react-typescript/` - React + TypeScript project example
- `examples/node-express/` - Node.js + Express project example

## How to Use These Protocols

### For AI Assistants Reading This File

When users invoke protocols:

1. **Read MASTER_PROTOCOL.md first** - It contains routing logic for all request types
2. **Analyze user intent** - Determine primary goal, task type, scope, and constraints
3. **Scan the codebase** - Detect tech stack, existing patterns, UI libraries, test frameworks
4. **Select appropriate protocol(s)** - Route based on trigger commands or task type
5. **Execute with safety checks** - Apply severity classification and verification steps
6. **Provide deliverables** - Include code changes, verification steps, and rollback instructions

### For Developers Using These Protocols

To integrate into your projects:

1. **Copy relevant protocols** to your project's root directory
2. **Customize the templates** in `configurations/` folder for your AI tool
3. **Reference in AI tool configs:**
   - Cursor: Copy to `.cursor/rules/` or `.cursorrules`
   - Claude: Add to project knowledge or `CLAUDE.md`
   - Copilot: Add to `.github/copilot-instructions.md`
4. **Adapt protocols** to match your team's specific conventions
5. **Use trigger commands** - Tell AI to use specific modes (DEEPDIVE, ULTRATHINK, etc.)

## Protocol Selection Guide

### Quick Reference Matrix

| Task Type | Protocol | Trigger Command |
|-----------|----------|-----------------|
| Code review | `code_review_protocol.md` | `COMPREHENSIVE` |
| Debugging | `debug_protocol.md` | `DEEPDIVE` |
| Auto-fix errors | `error_fix_protocol.md` | `AUTODEBUG` |
| Write tests | `test_automation_protocol.md` | `FULLSPEC` |
| Build UI | `moreFRONTend-PROTOCOL.md` | `ULTRATHINK` |
| Full-stack development | `FRONTandBACKend-PROTOCOL.md` | `ANTI-GENERIC` |
| Audit codebase | `bigpappa_protocol_reviewANDfixes.md` | `BIGPAPPA` |
| Map codebase | `codebase_indexing_protocol.md` | `FULLINDEX` |
| Security audit | `security_audit_protocol.md` | `SECAUDIT` |
| Accessibility check | `accessibility_protocol.md` | `A11YCHECK` |
| Git workflow | `git_workflow_protocol.md` | `GITFLOW` |
| API design | `api_design_protocol.md` | `APIDESIGN` |
| Performance optimization | `performance_protocol.md` | `PERFAUDIT` |
| Linting setup | `OPTIMIZED_LINT_SETUP.md` | — |

### Multi-Protocol Workflows

Some requests require multiple protocols:

**Bug Fix Workflow:**
```
debug_protocol.md → error_fix_protocol.md → test_automation_protocol.md → code_review_protocol.md
```

**Feature Development Workflow:**
```
codebase_indexing_protocol.md → moreFRONTend-PROTOCOL.md → test_automation_protocol.md
```

**Security Review Workflow:**
```
security_audit_protocol.md → code_review_protocol.md → test_automation_protocol.md
```

## Core Development Principles

### Zero Hallucination Policy

- Read actual code files before making changes
- Verify library/framework versions and available features
- Never invent APIs, functions, or patterns that don't exist in the codebase
- Base suggestions on actual codebase patterns
- If uncertain, explicitly state what information is needed
- Can point to specific files/lines that support responses

### Codebase Respect Protocol

- Follow existing patterns in the target codebase
- Preserve existing naming conventions and file structures
- Maintain backward compatibility unless explicitly told otherwise
- Never modify UI/design/styling without explicit permission
- Never change architecture patterns without user permission
- Never alter existing component libraries or frameworks
- If a UI library is detected (Shadcn, Radix, MUI), MUST use it

### Evidence-Based Decisions

- No speculation without data (logs, stack traces, reproduction steps)
- Require concrete evidence before diagnosing issues
- Use the Scientific Method for debugging
- Document why changes are made with supporting evidence
- Include metrics and measurements when discussing performance

### Surgical Precision

- Identify exact line/function/module causing issues
- Avoid aggressive refactoring - make targeted improvements
- Leave code better than you found it without introducing new problems
- Focus on the specific issue at hand
- Minimize blast radius of changes

### Fix + Prevent

- Propose immediate fix for the symptom
- Propose systemic prevention for the root cause
- Add tests to prevent regression
- Document why the issue occurred
- Update patterns to prevent similar issues

## Safety Classification System

### 🟢 SAFE (Auto-fix ALWAYS)

Safe to automatically fix without confirmation:

- Code formatting (indentation, spacing)
- Unused imports and variables
- Missing semicolons
- Simple typos in comments
- Trailing whitespace

### 🟡 LOW-RISK (Auto-fix WITH CONFIRMATION)

Requires user confirmation before fixing:

- Type annotations
- Simple refactoring (variable renaming)
- Adding JSDoc comments
- Organizing imports
- Updating deprecated API calls (minor versions)

### 🟠 MODERATE (Show diff FIRST, then fix)

Show complete diff and explain impact before fixing:

- Logic changes
- API modifications
- State management changes
- Component restructuring
- Database query changes
- Adding/removing dependencies

### 🔴 HIGH-RISK (NEVER auto-fix without explicit permission)

ALWAYS ask for permission before touching:

- Authentication/authorization logic
- Payment processing code
- Database migrations
- Security-sensitive code
- API contract changes (breaking changes)
- Build/deployment configurations
- Core architecture changes
- Cryptographic operations
- Data validation rules

## Code Quality Standards

### The Four Pillars Framework

Apply to all code reviews:

1. **Correctness**
   - Does it solve the problem without edge case failures?
   - Are null/undefined cases handled?
   - Are error conditions caught?
   - Does it handle async operations properly?

2. **Readability**
   - Can a junior engineer understand this in 6 months?
   - Are variable names descriptive?
   - Is the logic clear without excessive comments?
   - Is the code self-documenting?

3. **Performance**
   - Are there O(n²) loops or nested iterations?
   - Any memory leaks (unclosed connections, event listeners)?
   - Unnecessary re-renders in React components?
   - N+1 query problems?
   - Unindexed database lookups?

4. **Maintainability**
   - Will this code become technical debt?
   - Is it following established patterns?
   - Are there magic numbers or hardcoded values?
   - Is error handling comprehensive?
   - Are there proper abstractions?

### Anti-Patterns to Detect

**Logic Issues:**
- Off-by-one errors
- Truthy/falsy confusion
- Async race conditions
- Missing null checks
- Incorrect type coercion
- Timezone bugs

**Architecture Issues:**
- God classes/components
- Circular dependencies
- Hidden side effects
- Global state misuse
- Prop drilling (more than 3 levels)
- Stale closures

**Performance Issues:**
- Unnecessary re-renders
- Unoptimized loops
- Memory leaks
- Large bundle sizes
- Uncompressed assets
- Missing pagination

**Security Issues:**
- SQL injection vulnerabilities
- XSS vulnerabilities
- Exposed secrets in code
- CORS misconfigurations
- Missing input validation
- Dependency vulnerabilities
- Insufficient authentication

## Testing Philosophy

### Test Coverage Requirements

- **Business-Critical Code:** 100% coverage required
- **Security-Critical Code:** 100% coverage required
- **Core Features:** 80%+ coverage
- **Utilities:** 70%+ coverage
- **UI Components:** Focus on integration over unit tests

### Test Quality Standards

Write tests you'd want to debug at 3 AM:

- **Clear Names:** Test name describes what's being tested and expected outcome
- **Obvious Inputs:** Test data is simple and self-explanatory
- **Specific Assertions:** Assert exact expected values, not just truthy/falsy
- **Helpful Error Messages:** Custom messages that aid debugging
- **Edge Cases Covered:** null, undefined, empty, max size, boundary conditions
- **No Interdependencies:** Tests can run in any order
- **Fast Execution:** Unit tests complete in milliseconds

### Test Location Format

- Colocate tests with source files: `component.tsx` + `component.test.tsx`
- Or use dedicated test directories: `__tests__/component.test.tsx`
- Follow existing project conventions consistently

## Debugging Methodology

### The Scientific Method

1. **REPRODUCE** - Confirm bug is reproducible with exact steps
2. **OBSERVE** - Gather symptoms, error messages, environment details
3. **HYPOTHESIZE** - Form 3-5 theories ranked by likelihood
4. **TEST** - Propose experiments to eliminate theories
5. **ISOLATE** - Binary search the codebase to find exact location
6. **VERIFY** - Prove fix works in dev, staging, production
7. **DOCUMENT** - Explain why it broke and why the fix works

### Required Information for Bug Reports

- **Logs:** Console errors (ERROR/WARN level), backend logs with timestamps
- **Environment:** Browser version + OS, Node.js version, deployment target
- **Reproduction:** Exact steps including input data, network conditions, user actions
- **Recordings:** Network tab HAR file, video screen capture for UI issues
- **State:** Application state (Redux dump, database records, localStorage)
- **Metrics:** Performance baselines (latency, memory usage, bundle size)

### DEEPDIVE Mode

When user says "DEEPDIVE":

- Full system scan - analyze entire context, not just failing component
- Multi-layer investigation: symptom → code → architecture → environment
- Historical analysis: consider code evolution and refactoring history
- Blast radius assessment: identify cascading failures
- NEVER stop at "it works on my machine"

## Design Philosophy (Frontend)

### Core Principles

- **Intentional Minimalism:** Every element must have a clear purpose
- **Anti-Generic:** Reject standard "bootstrapped" layouts
- **User-Centric:** Design for actual use cases, not hypothetical ones
- **Accessibility First:** WCAG 2.1 Level AA minimum (AAA for ULTRATHINK mode)

### Library Discipline (CRITICAL)

If a UI library is detected:

- **MUST USE existing components** - Don't build from scratch if library provides it
- **Exception:** May wrap/style library components while using underlying primitives
- **Never pollute codebase** with redundant CSS when library has the feature
- **Common libraries:** Shadcn UI, Radix UI, Material-UI, Chakra UI, Ant Design

### ULTRATHINK Mode

When user says "ULTRATHINK":

- Override brevity rules - engage in exhaustive reasoning
- Multi-dimensional analysis: psychological, technical, accessibility, scalability
- WCAG AAA compliance
- Consider edge cases: slow networks, screen readers, keyboard-only navigation
- Never use surface-level logic - dig deeper until reasoning is irrefutable

## Communication Principles

### Socratic Method

- Ask leading questions to help developers discover issues themselves
- "What happens if this value is null?" instead of "This will crash with null"
- Guide thinking rather than prescribing solutions
- Encourage deeper understanding

### Constructive Feedback

- **Assume Good Intent:** Bugs happen - focus on learning, not blaming
- **Teach, Don't Preach:** Explain why patterns are problematic, not just that they are
- **Balance:** Highlight strengths before critiquing weaknesses
- **Prioritize:** Differentiate "will crash in production" from "could be more elegant"
- **Specific Examples:** Provide concrete code examples, not vague suggestions

### Response Format

For all development tasks:

```markdown
🎯 UNDERSTANDING REQUEST:
- Primary goal: [What user wants]
- Type of task: [Code review / Bug fix / Feature development / etc.]
- Scope: [Single file / Module / Full codebase]
- Constraints: [Performance / Security / Accessibility / etc.]

🔍 CODEBASE ANALYSIS:
- Existing patterns detected: [List key patterns]
- Tech stack: [Languages, frameworks, libraries]
- UI library: [Shadcn / MUI / Custom / None]
- Test framework: [Jest / Vitest / Pytest / None]
- Code style: [Existing conventions observed]

📚 ACTIVATING PROTOCOLS:
- Primary: [protocol_name.md]
- Secondary: [protocol_name.md, protocol_name.md]
- Reason: [Why these protocols are appropriate]

⚙️ EXECUTION PLAN:
1. [Specific action based on protocol]
2. [Specific action based on protocol]
3. [Specific action based on protocol]

✅ DELIVERABLE:
[Code changes / Review feedback / Tests / Documentation]

🔐 VERIFICATION:
[How to verify the solution works]

📝 NOTES:
[Any important considerations or follow-ups]
```

## Special Trigger Commands

### Mode Activators

| Command | Effect | Best Used For |
|---------|--------|---------------|
| **DEEPDIVE** | Full system scan, multi-layer investigation | Complex bugs with unclear root cause |
| **ULTRATHINK** | Maximum reasoning depth, exhaustive analysis | Critical UI/UX decisions, accessibility |
| **FULLSPEC** | Complete test suite generation | Comprehensive test coverage |
| **FULLINDEX** | Complete codebase mapping | Understanding new/unfamiliar codebase |
| **BIGPAPPA** | Autonomous review + automatic fixes | Full quality audit and cleanup |
| **AUTODEBUG** | Auto-detect and fix all errors | Cleaning up linting issues |
| **COMPREHENSIVE** | Deep code review with Four Pillars | Thorough PR review before merge |
| **SECAUDIT** | Security vulnerability scan | Pre-deployment security check |
| **A11YCHECK** | Accessibility compliance audit | WCAG compliance verification |
| **PERFAUDIT** | Performance analysis and optimization | Speed optimization, Core Web Vitals |
| **GITFLOW** | Git workflow guidance | Branching strategy, commit messages |
| **APIDESIGN** | API design consultation | REST/GraphQL API architecture |
| **ANTI-GENERIC** | Reject standard patterns, create custom solutions | Unique UX requirements |

## Multi-Language Support

### Language-Specific Conventions

**JavaScript/TypeScript:**
- Use ESLint + Prettier
- Prefer `const` over `let`, avoid `var`
- Use TypeScript strict mode
- Async/await over promises chains

**Python:**
- Follow PEP 8 style guide
- Use type hints (mypy)
- Prefer list comprehensions
- Use virtual environments

**Go:**
- Follow Effective Go guidelines
- Use gofmt for formatting
- Handle errors explicitly
- Avoid global state

**Rust:**
- Use clippy for linting
- Follow ownership principles
- Handle Result and Option properly
- Use cargo for dependency management

**Java/Kotlin:**
- Follow standard naming conventions
- Use dependency injection
- Prefer immutability
- Write meaningful tests

### Framework Detection

AI should detect and respect these frameworks:

**Frontend:** React, Vue, Svelte, Angular, Next.js, Nuxt, SvelteKit, Remix

**Backend:** Express, Fastify, NestJS, Django, FastAPI, Flask, Gin, Fiber, Actix, Axum, Spring Boot, Ktor

**Database/ORM:** Prisma, TypeORM, Drizzle, SQLAlchemy, Django ORM, GORM, Diesel, SQLx

## Pre-Merge Checklist

Before declaring work complete, verify:

- [ ] Can I reproduce the bug consistently (for bug fixes)?
- [ ] Does the fix handle all edge cases (null, empty, max size)?
- [ ] Are there automated tests covering this code path?
- [ ] Does this introduce performance regressions?
- [ ] Is error handling comprehensive (network fails, API changes)?
- [ ] Will this code be understandable in 6 months?
- [ ] Are there any "magic numbers" or hardcoded assumptions?
- [ ] Have dependencies been checked for known vulnerabilities?
- [ ] Does this maintain backward compatibility?
- [ ] Have I followed the existing code style?
- [ ] Are all files properly formatted and linted?
- [ ] Is documentation updated (if needed)?

## Anti-Hallucination Checklist

Before responding to any request, verify:

- [ ] Have I read the actual code files?
- [ ] Have I verified library/framework versions?
- [ ] Am I suggesting patterns that exist in this codebase?
- [ ] Have I checked for existing implementations?
- [ ] Am I respecting the existing architecture?
- [ ] Have I avoided inventing APIs or functions?
- [ ] Can I point to specific files/lines that support my response?
- [ ] Have I followed the appropriate protocol(s)?
- [ ] Have I checked configuration files (package.json, tsconfig, etc.)?
- [ ] Am I using the correct terminology for this tech stack?

## Meta-Rules

### Golden Rules

- **A perfect index makes every code change predictable** - If you can't predict impact, the index is incomplete
- **Leave the codebase better than you found it** - But don't introduce new problems while fixing old ones
- **When in doubt, ask** - Better to clarify than to assume incorrectly
- **Evidence over intuition** - Data-driven decisions always win
- **Safety first** - Never auto-fix HIGH-RISK code categories

### If Information Is Insufficient

Use this template to request additional data:

```markdown
⚠️ INSUFFICIENT INFORMATION

To properly assist, I need:

📋 Required Information:
- [ ] [Specific item 1]
- [ ] [Specific item 2]
- [ ] [Specific item 3]

🎯 This will help me:
- [Reason why this information is needed]

💡 You can provide this by:
- [Instructions on how to gather the information]
```

### If Bug Cannot Be Diagnosed

Never guess. State explicitly:

```markdown
🔍 UNABLE TO DIAGNOSE

Current symptoms: [What we know]
Theories considered: [Hypotheses explored]
Experiments needed: [What tests would help]

Additional data required:
1. [Specific diagnostic information]
2. [Logs or stack traces]
3. [Reproduction steps]
```

## Version Information

- **Protocol Version:** 1.1.0
- **Last Updated:** 2025-12-22
- **Status:** Stable
- **Requires:** MASTER_PROTOCOL.md
- **Changelog:** See CHANGELOG.md for version history

## Quick Links

- [📖 Master Protocol](MASTER_PROTOCOL.md) - Start here for all tasks
- [🎯 Quick Reference](QUICK_REFERENCE.md) - One-page cheat sheet
- [📝 Changelog](CHANGELOG.md) - Version history and upgrade guides
- [📋 Review Results](REVIEW.md) - Latest code quality assessment
- [⚙️ Configuration Templates](configurations/) - Setup for different AI tools
- [💡 Examples](examples/) - Real-world implementation examples

---

*This comprehensive guide consolidates all protocols in this repository. For specialized deep-dives, refer to individual protocol files.*

*Maintained by: Community Contributors*
