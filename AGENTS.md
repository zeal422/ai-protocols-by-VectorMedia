# AGENTS.md - AI Development Assistant Protocols

## Project Overview

This workspace contains a comprehensive set of protocols and best practices for AI-assisted software development. These protocols guide AI agents in performing various development tasks including code review, debugging, error fixing, testing, and frontend/backend development.

**Purpose:** Standardized protocols for autonomous and semi-autonomous code development, review, and maintenance.

**Key Files:**
- `bigpappa_protocol_reviewANDfixes.md` - Autonomous code review and remediation protocol
- `code_review_protocol.md` - Code review guidelines and philosophies
- `codebase_indexing_protocol.md` - Codebase intelligence and indexing strategies
- `debug_protocol.md` - Debugging methodology and diagnostic protocols
- `error_fix_protocol.md` - Autonomous error resolution protocols
- `FRONTandBACKend-PROTOCOL.md` - Unified dual-protocol for full-stack development
- `moreFRONTend-PROTOCOL.md` - Frontend architecture and UI design protocols
- `test_automation_protocol.md` - Test automation and coverage protocols
- `OPTIMIZED_LINT_SETUP.md` - Linting setup for React + TypeScript + Tailwind CSS

## Core Development Principles

### Code Quality Standards
- **Zero Blame Culture:** Critique targets code, never developers
- **Evidence-Based Decisions:** No speculation without data (logs, stack traces, repro steps)
- **Surgical Precision:** Identify exact line/function/module causing issues
- **Fix + Prevent:** Propose both immediate fix AND systemic prevention
- **Leave Code Better:** Improve code quality while fixing issues (surgical precision over aggressive refactoring)

### Testing Philosophy
- **Write tests you'd want to debug at 3 AM:** Clear names, obvious inputs, specific assertions, helpful error messages
- **Business-Critical Tests:** Require 100% coverage
- **Test Location Format:** Tests must be colocated with source files or in dedicated test directories following consistent patterns

### Design Philosophy
- **Intentional Minimalism:** Every element must have a clear purpose
- **Anti-Generic:** Reject standard "bootstrapped" layouts
- **Library Discipline (CRITICAL):** If a UI library is detected (Shadcn UI, Radix, MUI), YOU MUST USE IT
  - Do not build custom components from scratch if the library provides them
  - Do not pollute the codebase with redundant CSS
  - Exception: May wrap/style library components while using the underlying primitive

## Special Agent Modes

### DEEPDIVE Protocol
**Trigger:** When user prompts "DEEPDIVE"
- Full system scan - analyze entire context, not just failing component
- Multi-layer investigation: symptom → code → architecture → environment
- Historical analysis: consider code evolution and refactoring history
- Blast radius assessment: identify cascading failures
- NEVER stop at "it works on my machine"

### ULTRATHINK Protocol
**Trigger:** When user prompts "ULTRATHINK"
- Override brevity rules - engage in exhaustive reasoning
- Multi-dimensional analysis: psychological, technical, accessibility, scalability
- Never use surface-level logic - dig deeper until logic is irrefutable
- Analyze through every lens before providing solutions

## Debugging Methodology: The Scientific Method

1. **Reproduce:** Confirm bug is reproducible with exact steps
2. **Observe:** Gather symptoms, error messages, environment details
3. **Hypothesize:** Form 3-5 theories ranked by likelihood
4. **Test:** Propose experiments to eliminate theories
5. **Isolate:** Binary search the codebase
6. **Verify:** Prove fix works in dev, staging, and production
7. **Document:** Explain why it broke and why the fix works

### Required Information for Bug Reports
- **Logs:** Console errors at ERROR/WARN level, backend logs with timestamps
- **Environment:** Browser version + OS, Node.js version, deployment target
- **Reproduction:** Exact steps including input data, network conditions, user actions
- **Recordings:** Network tab HAR file, video screen capture if UI-related
- **State:** Relevant application state (Redux dump, database records, localStorage)
- **Metrics:** Performance baselines (latency, memory usage, bundle size)

## Code Review Process

### Four Pillars of Code Review
1. **Correctness:** Does it solve the problem without edge case failures?
2. **Readability:** Can a junior engineer understand this in 6 months?
3. **Performance:** Are there O(n²) loops, memory leaks, or unnecessary re-renders?
4. **Maintainability:** Will this code become technical debt?

### Review Response Format
1. **Strengths:** What's done well (be specific)
2. **Critical Issues:** Must fix before merge (security, correctness, performance)
3. **Suggestions:** Nice-to-haves (readability, patterns, optimizations)
4. **Questions:** Unclear logic that needs author explanation

### Anti-Patterns to Detect

**Logic:**
- Off-by-one errors, truthy/falsy confusion, async race conditions
- Missing null checks, incorrect type coercion, timezone bugs

**Architecture:**
- God classes, circular dependencies, hidden side effects
- State management anti-patterns (prop drilling, stale closures)

**Performance:**
- Unnecessary re-renders, N+1 queries, unindexed database lookups
- Memory leaks (event listeners not cleaned up, closures holding refs)

**Security:**
- SQL injection, XSS vulnerabilities, exposed secrets
- CORS misconfigurations, missing input validation
- Dependency vulnerabilities (outdated packages, known CVEs)

## Codebase Indexing Strategy

### Index Types to Maintain
- **File-Level Index:** Entry points, configuration files, utilities
- **Function-Level Index:** Core business logic functions
- **Component-Level Index:** Frontend components with props and dependencies
- **API Endpoint Catalog:** Routes, methods, authentication requirements
- **Database Schema Index:** Tables, relationships, constraints
- **Change Impact Matrix:** File dependency mappings
- **Code Quality Metrics:** Complexity scores, test coverage, performance

### Golden Rule
A perfect index makes every code change predictable. If you can't predict the impact, the index is incomplete.

## Error Resolution Protocol

### Auto-Fix Severity Classification
- **🟢 SAFE (Auto-fix: ALWAYS):** Formatting, unused imports, missing semicolons
- **🟡 LOW-RISK (Auto-fix: WITH CONFIRMATION):** Type annotations, simple refactors
- **🟠 MODERATE (Auto-fix: SHOW DIFF FIRST):** Logic changes, API modifications
- **🔴 HIGH-RISK (Auto-fix: NEVER):** Database migrations, authentication, payment logic

### Fix Template Format
```
🔍 ERROR ANALYSIS:
[Error type and root cause]

🔧 FIX STRATEGY:
[Approach and reasoning]

📝 CHANGES:
[Specific code changes with file paths]

✅ VERIFICATION:
[How to confirm the fix works]
```

## Frontend Development Standards

### Technology Stack
- **Modern Frameworks:** React/Vue/Svelte
- **Styling:** Tailwind CSS/Custom CSS
- **Markup:** Semantic HTML5
- **Focus:** Micro-interactions, perfect spacing, "invisible" UX

### Component Development
- Maximize reuse of existing primitives
- Follow established design system patterns
- Ensure accessibility (WCAG AAA for ULTRATHINK mode)
- Consider rendering performance and state complexity

## Test Automation Standards

### Test Coverage Requirements
- **Business-Critical:** 100% coverage required
- **Core Features:** 80%+ coverage
- **Utilities:** 70%+ coverage
- **UI Components:** Focus on integration over unit tests

### Test Quality Checklist
- [ ] Clear, descriptive test names
- [ ] Obvious input data
- [ ] Specific assertions
- [ ] Helpful error messages
- [ ] Edge cases covered (null, empty, max size)
- [ ] Async operations properly handled
- [ ] No test interdependencies

## Communication Principles

- **Socratic Method:** Ask leading questions to help developers discover issues
- **Assume Good Intent:** Bugs happen - focus on learning, not blaming
- **Teach, Don't Preach:** Explain why patterns are problematic, not just that they are
- **Prioritize:** Differentiate "will crash in production" from "could be more elegant"
- **Constructive Skepticism:** Balance praise with critique

## Pre-Merge Checklist

Before declaring "bug fixed" or "code approved":
- [ ] Can I reproduce the bug consistently?
- [ ] Does the fix handle all edge cases (null, empty, max size)?
- [ ] Are there automated tests covering this path?
- [ ] Does this introduce performance regressions?
- [ ] Is error handling comprehensive (network fails, API changes)?
- [ ] Will this code be understandable in 6 months?
- [ ] Are there any "magic numbers" or hardcoded assumptions?
- [ ] Have dependencies been checked for known vulnerabilities?

## Linting Setup (React + TypeScript + Tailwind)

### Recommended Tools
- **ESLint:** JavaScript/TypeScript linting
- **Prettier:** Code formatting
- **eslint-plugin-react:** React-specific rules
- **eslint-plugin-react-hooks:** React Hooks linting
- **eslint-plugin-tailwindcss:** Tailwind CSS class ordering and validation
- **@typescript-eslint:** TypeScript-specific linting

### Key Features
- Automatic import sorting
- Tailwind class ordering
- React Hook dependency checking
- TypeScript strict mode enforcement
- Accessibility linting (eslint-plugin-jsx-a11y)

## Meta-Rules

- **If bug cannot be diagnosed:** Explicitly state what additional data is needed - never guess
- **If information is insufficient:** Use the standard data request template
- **Golden Rule:** A perfect index makes every code change predictable
- **Primary Rule:** Leave the codebase better than you found it, but don't introduce new problems while fixing old ones

---

*This document consolidates protocols from multiple specialized protocol files. Refer to individual protocol files for detailed implementations and examples.*
