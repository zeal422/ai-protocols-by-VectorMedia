# Cursor IDE Integration

Configure Cursor IDE to use AI Development Protocols.

## Setup

### Option 1: .cursorrules File (Recommended)

Create a `.cursorrules` file in your project root:

```markdown
# AI Development Protocols

You are an AI assistant that follows the AI Development Protocols framework.

## Primary Directive
Use MASTER_PROTOCOL.md as your orchestrator for all development tasks.

## Protocol Selection
- Code Review: code_review_protocol.md → Trigger: COMPREHENSIVE
- Debugging: debug_protocol.md → Trigger: DEEPDIVE
- Error Fixing: error_fix_protocol.md → Trigger: AUTODEBUG
- Testing: test_automation_protocol.md → Trigger: FULLSPEC
- Frontend: moreFRONTend-PROTOCOL.md → Trigger: ULTRATHINK
- Security: security_audit_protocol.md → Trigger: SECAUDIT
- Accessibility: accessibility_protocol.md → Trigger: A11YCHECK
- Performance: performance_protocol.md → Trigger: PERFAUDIT

## Core Rules

### Zero Hallucination Policy
- Read actual code before making changes
- Verify library versions and available features
- Never invent APIs, functions, or patterns that don't exist
- If uncertain, ask for clarification

### Codebase Respect
- Follow existing patterns in the codebase
- Preserve naming conventions
- Never modify UI/design/architecture without permission
- Use existing component libraries (Shadcn, MUI, etc.)

### Safety Classification
- 🟢 SAFE: Auto-fix formatting, unused imports
- 🟡 LOW-RISK: Confirm before type annotations
- 🟠 MODERATE: Show diff for logic changes
- 🔴 HIGH-RISK: Never auto-fix auth, payments, migrations

### Required Actions
- Add tests for new code
- Document why changes are made
- Provide verification steps
- Include rollback instructions for risky changes

## Response Format
1. Understand the request and determine appropriate protocol
2. Analyze existing codebase patterns
3. Provide solution following the selected protocol
4. Include verification steps
```

### Option 2: Cursor Rules Directory

For multiple rule files, create `.cursor/rules/`:

```
.cursor/
└── rules/
    ├── main.md           # Copy of .cursorrules above
    ├── security.md       # Security-specific rules
    └── testing.md        # Testing-specific rules
```

## Usage Tips

### Triggering Protocols

In your prompts, use trigger commands:

```
DEEPDIVE: Debug the login issue - users are getting 401 errors
```

```
FULLSPEC: Write complete test suite for the UserService class
```

```
SECAUDIT: Check the API endpoints for security vulnerabilities
```

### Referencing Protocols

For specific guidance:

```
Following error_fix_protocol.md, fix all TypeScript errors in src/components/
```

```
Using api_design_protocol.md patterns, design the /api/v1/orders endpoint
```

### Combining with Context

```
Review src/components/Dashboard.tsx using code_review_protocol.md
Apply the Four Pillars framework and check for:
- Correctness: edge cases handled?
- Readability: clear to junior devs?
- Performance: any unnecessary re-renders?
- Maintainability: will this become tech debt?
```

## Recommended Cursor Settings

In Cursor settings (JSON):

```json
{
  "cursor.aiPreferences": {
    "preferCodeBlocks": true,
    "showDiffs": true,
    "autoApply": false
  }
}
```

**autoApply: false** - Important! Prevents automatic application of AI changes without review.
