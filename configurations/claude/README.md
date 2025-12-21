# Claude Projects Integration

Configure Claude Projects to use AI Development Protocols.

## Setup

### 1. Upload Protocol Files

In your Claude Project, add these files to Project Knowledge:

**Core Protocols (Required):**
- `MASTER_PROTOCOL.md`
- `AGENTS.md`
- `QUICK_REFERENCE.md`

**Specialized Protocols (Based on project type):**
- `code_review_protocol.md`
- `debug_protocol.md`
- `error_fix_protocol.md`
- `test_automation_protocol.md`

**For Frontend Projects:**
- `moreFRONTend-PROTOCOL.md`
- `accessibility_protocol.md`

**For Backend Projects:**
- `api_design_protocol.md`
- `security_audit_protocol.md`
- `performance_protocol.md`

**For Full-Stack:**
- `FRONTandBACKend-PROTOCOL.md`

### 2. Add Custom Instructions

In Project Instructions, add:

```
You are an expert software engineer following the AI Development Protocols framework.

## Protocol Usage
1. Start with MASTER_PROTOCOL.md to determine appropriate specialized protocol
2. Use QUICK_REFERENCE.md for rapid lookup
3. Apply relevant specialized protocols based on task type

## Core Principles
- Zero Hallucination: Never invent APIs or patterns
- Codebase Respect: Follow existing conventions
- Evidence-Based: Cite specific files and lines
- Surgical Precision: Minimal changes for maximum effect

## Safety Rules
🟢 SAFE: Auto-fix (formatting, imports)
🟡 LOW-RISK: Confirm first (type annotations)
🟠 MODERATE: Show diff (logic changes)
🔴 HIGH-RISK: Never auto-fix (auth, payments)

## Special Commands
When user says these keywords, apply deep analysis:
- DEEPDIVE → Full system investigation
- ULTRATHINK → Maximum reasoning depth
- FULLSPEC → Complete test generation
- SECAUDIT → Security vulnerability scan
- PERFAUDIT → Performance analysis
```

### 3. Create CLAUDE.md in Project

Add a `CLAUDE.md` file to your codebase with project-specific context:

```markdown
# Project: [Your Project Name]

## Overview
[Brief description of the project]

## Tech Stack
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL

## Key Conventions
- Use Shadcn UI components
- Follow the patterns in src/components/
- Use Zod for validation
- Prisma for database access

## Directory Structure
- src/components/ - React components
- src/pages/ - Route pages
- src/api/ - API handlers
- src/lib/ - Utilities

## Important Patterns
- Authentication: see src/auth/
- API calls: use src/lib/api.ts
- Forms: use react-hook-form + zod

## Known Issues
- [List any known issues]

## Recent Changes
- [List recent significant changes]
```

## Usage Tips

### Effective Prompts

```
Using MASTER_PROTOCOL, review the UserProfile component.
Apply COMPREHENSIVE flag for full spectrum analysis.
```

```
Apply debug_protocol.md to investigate the cart calculation bug.
Use DEEPDIVE mode for full system analysis.
Error: Total shows $0 when items are added.
```

```
Using security_audit_protocol.md, run SECAUDIT on src/api/.
Check for OWASP Top 10 vulnerabilities.
Focus on authentication and authorization.
```

### Best Practices

1. **Reference protocols explicitly** for complex tasks
2. **Use trigger commands** (DEEPDIVE, FULLSPEC, etc.) for deep analysis
3. **Provide context** about your codebase conventions
4. **Ask for verification steps** with every change
5. **Request diffs** before applying changes
