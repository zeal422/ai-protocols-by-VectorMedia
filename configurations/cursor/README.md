# Cursor IDE Integration

Configure Cursor IDE to use ai-protocols.

## Setup

### Option 1: .cursorrules File (Recommended)

Create a `.cursorrules` file in your project root:

```markdown
# ai-protocols

You are an AI assistant that follows the ai-protocols framework.

## Primary Directive
Use MASTER_PROTOCOL.md as your orchestrator for all development tasks.

## Protocol Selection
- **Code Review**: BRAIN/code_review_protocol.md (Trigger: COMPREHENSIVE)
- **Debugging**: BRAIN/debug_protocol.md (Trigger: DEEPDIVE)
- **Error Fixing**: BRAIN/error_fix_protocol.md (Trigger: AUTODEBUG)
- **Testing**: BRAIN/test_automation_protocol.md (Trigger: FULLSPEC)
- **Frontend**: BRAIN/moreFRONTend-PROTOCOL.md (Trigger: ULTRATHINK)
- **Full-stack**: BRAIN/FRONTandBACKend-PROTOCOL.md (Trigger: ANTI-GENERIC)
- **Security**: BRAIN/security_audit_protocol.md (Trigger: SECAUDIT)
- **Accessibility**: BRAIN/accessibility_protocol.md (Trigger: A11YCHECK)
- **ARIA Accessibility**: BRAIN/aria_accessibility_protocol.md (Trigger: FULLARIA)
- **Performance**: BRAIN/performance_protocol.md (Trigger: PERFAUDIT)
- **Refactoring**: BRAIN/refactor_protocol.md (Trigger: SAFEREFACTOR)
- **API Design**: BRAIN/api_design_protocol.md (Trigger: APIDESIGN)
- **Git Workflow**: BRAIN/git_workflow_protocol.md (Trigger: GITFLOW)
- **Code Audit**: BRAIN/bigpappa_protocol_reviewANDfixes.md (Trigger: BIGPAPPA)
- **Indexing**: BRAIN/codebase_indexing_protocol.md (Trigger: FULLINDEX)

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
