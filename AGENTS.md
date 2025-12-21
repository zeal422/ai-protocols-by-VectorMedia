# AGENTS.md - AI Development Assistant Instructions

## Project Overview

This workspace is a **protocol documentation repository** containing comprehensive guidelines for AI-assisted software development.

- **Purpose:** Standardized protocols for AI assistants performing code development, review, debugging, and maintenance
- **Project Type:** Documentation repository (Markdown files)
- **Target Audience:** AI assistants (Claude, ChatGPT, Copilot, etc.) and developers using AI tools
- **Primary Use Case:** Reduce AI hallucinations and ensure consistent, high-quality development assistance

## Important Files

### Master Protocol (Start Here)
- `MASTER_PROTOCOL.md` - Intelligent orchestrator that routes requests to appropriate specialized protocols

### Specialized Protocol Files
- `bigpappa_protocol_reviewANDfixes.md` - Comprehensive code review and remediation
- `code_review_protocol.md` - Code review methodology (Four Pillars framework)
- `codebase_indexing_protocol.md` - Codebase intelligence and dependency mapping
- `debug_protocol.md` - Scientific debugging methodology
- `error_fix_protocol.md` - Error resolution with severity classification
- `FRONTandBACKend-PROTOCOL.md` - Full-stack development guidelines
- `moreFRONTend-PROTOCOL.md` - Frontend architecture and UI design principles
- `test_automation_protocol.md` - Test coverage and quality standards
- `OPTIMIZED_LINT_SETUP.md` - Linting setup for React + TypeScript + Tailwind

## Usage Instructions

### For AI Assistants Reading This File

When a user invokes protocols from this repository:

1. **Always start with MASTER_PROTOCOL.md** - It contains routing logic for all request types
2. **Read the actual protocol files** - Never assume or hallucinate protocol content
3. **Follow the anti-hallucination checklist** - Verify before suggesting code or patterns
4. **Respect codebase constraints** - No unauthorized UI/design/architecture changes
5. **Apply appropriate protocol(s)** based on the user's request type

### For Developers Using These Protocols

To use these protocols in your projects:

1. **Copy relevant protocols** to your project's root directory
2. **Reference in AI tool configs** - Add to `.cursorrules`, `CLAUDE.md`, or similar files
3. **Customize for your project** - Adapt protocols to match team conventions
4. **Point AI assistants** - Tell your AI to "use the MASTER_PROTOCOL to [task]"

## Best Practices and Conventions

### Core Development Principles

- **Zero Blame Culture** - Critique code, never developers
- **Evidence-Based Decisions** - No speculation without data (logs, traces, repro steps)
- **Surgical Precision** - Identify exact problematic lines/functions/modules
- **Fix + Prevent** - Propose immediate fix AND systemic prevention
- **Leave Code Better** - Improve quality while fixing issues (no aggressive refactoring)

### Protocol Selection Guidelines

Use this quick reference to select the right protocol:

- **Code reviews** → `code_review_protocol.md`
- **Bug fixing/debugging** → `debug_protocol.md` + `error_fix_protocol.md`
- **Auto-fixing errors** → `error_fix_protocol.md`
- **Writing tests** → `test_automation_protocol.md`
- **Frontend development** → `moreFRONTend-PROTOCOL.md`
- **Backend development** → `FRONTandBACKend-PROTOCOL.md`
- **Full codebase audit** → `bigpappa_protocol_reviewANDfixes.md`
- **Understanding codebase** → `codebase_indexing_protocol.md`
- **Linting setup** → `OPTIMIZED_LINT_SETUP.md`

### Universal Safety Rules

Never do these without explicit user permission:

- Change UI/design/styling
- Modify database schemas
- Alter authentication/authorization logic
- Change API contracts (breaking changes)
- Refactor core architecture
- Switch frameworks or libraries
- Remove existing features

Always do these:

- Read existing code before suggesting changes
- Follow established patterns in the target codebase
- Preserve existing naming conventions
- Maintain backward compatibility
- Add tests for new code
- Document why changes are made
- Ask for clarification when uncertain

### Special Agent Modes

**DEEPDIVE Mode** - Triggered when user says "DEEPDIVE":
- Full system scan - analyze entire context
- Multi-layer investigation: symptom → code → architecture → environment
- Historical analysis of code evolution
- Blast radius assessment for cascading failures

**ULTRATHINK Mode** - Triggered when user says "ULTRATHINK":
- Override brevity rules - engage in exhaustive reasoning
- Multi-dimensional analysis: psychological, technical, accessibility, scalability
- WCAG AAA compliance for UI work
- Never use surface-level logic

### Code Quality Standards

Apply the **Four Pillars** to all code reviews:

1. **Correctness** - Does it solve the problem without edge case failures?
2. **Readability** - Can a junior engineer understand this in 6 months?
3. **Performance** - Are there O(n²) loops, memory leaks, or unnecessary re-renders?
4. **Maintainability** - Will this code become technical debt?

### Testing Philosophy

- **Write tests you'd want to debug at 3 AM** - Clear names, obvious inputs, specific assertions
- **Coverage requirements:**
  - Business-Critical: 100%
  - Core Features: 80%+
  - Utilities: 70%+
- **Test location** - Colocate with source files or use consistent test directory structure

### Design Philosophy (Frontend)

- **Intentional Minimalism** - Every element must have a clear purpose
- **Anti-Generic** - Reject standard "bootstrapped" layouts
- **Library Discipline (CRITICAL)** - If a UI library exists (Shadcn, Radix, MUI), you MUST use it
  - Never build custom components from scratch if the library provides them
  - Exception: May wrap/style library components while using underlying primitives

### Debugging Methodology

Follow **The Scientific Method**:

1. **Reproduce** - Confirm bug is reproducible with exact steps
2. **Observe** - Gather symptoms, errors, environment details
3. **Hypothesize** - Form 3-5 theories ranked by likelihood
4. **Test** - Propose experiments to eliminate theories
5. **Isolate** - Binary search the codebase
6. **Verify** - Prove fix works in dev, staging, production
7. **Document** - Explain why it broke and why the fix works

### Error Fix Severity Classification

- 🟢 **SAFE** (Auto-fix ALWAYS): Formatting, unused imports, missing semicolons
- 🟡 **LOW-RISK** (Auto-fix WITH CONFIRMATION): Type annotations, simple refactors
- 🟠 **MODERATE** (Auto-fix SHOW DIFF FIRST): Logic changes, API modifications
- 🔴 **HIGH-RISK** (Auto-fix NEVER): Database migrations, auth, payments

## Anti-Hallucination Checklist

Before responding to any request, verify:

- Have I read the actual code files?
- Have I verified library/framework versions?
- Am I suggesting patterns that exist in this codebase?
- Have I checked for existing implementations?
- Am I respecting the existing architecture?
- Have I avoided inventing APIs or functions?
- Can I point to specific files/lines that support my response?
- Have I followed the appropriate protocol(s)?

## Communication Principles

- **Socratic Method** - Ask leading questions to help developers discover issues
- **Assume Good Intent** - Bugs happen; focus on learning, not blaming
- **Teach, Don't Preach** - Explain why patterns are problematic, not just that they are
- **Prioritize** - Differentiate "will crash in production" from "could be more elegant"
- **Constructive Skepticism** - Balance praise with critique

## Pre-Merge Checklist

Before declaring work complete:

- Can I reproduce the bug consistently?
- Does the fix handle all edge cases (null, empty, max size)?
- Are there automated tests covering this path?
- Does this introduce performance regressions?
- Is error handling comprehensive (network fails, API changes)?
- Will this code be understandable in 6 months?
- Are there any "magic numbers" or hardcoded assumptions?
- Have dependencies been checked for known vulnerabilities?

## Integration with AI Tools

### Cursor IDE
Copy relevant protocols to `.cursor/rules/` directory or reference in `.cursorrules`

### Claude Projects
Add this repository as a project knowledge source or copy protocols to `CLAUDE.md`

### GitHub Copilot
Reference protocols in workspace comments or `.github/copilot-instructions.md`

### ChatGPT Custom Instructions
Paste relevant protocol sections into custom instructions or GPT configurations

## Meta-Rules

- **If bug cannot be diagnosed** - Explicitly state what additional data is needed; never guess
- **If information is insufficient** - Use the standard data request template from debug protocol
- **Golden Rule** - A perfect index makes every code change predictable
- **Primary Rule** - Leave the codebase better than you found it, but don't introduce new problems

---

*This file consolidates guidance from multiple specialized protocol files. For detailed implementations and examples, refer to the individual protocol files listed above.*

*Last Updated: 2025-12-21*
