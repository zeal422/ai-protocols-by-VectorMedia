# ai-protocols (GitHub Copilot)

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
- Use existing component libraries

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

## Guidelines

### Code Quality
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Add proper error handling
- Include JSDoc comments for public APIs

### Testing
- Add unit tests for new functions
- Use existing testing patterns
- Aim for 80%+ coverage on core features

### Safety
- Never expose secrets or API keys
- Use parameterized queries (prevent SQL injection)
- Validate all user inputs
- Follow OWASP security guidelines

### Commit Messages
Use Conventional Commits:
- feat: new feature
- fix: bug fix
- docs: documentation
- test: adding tests
- refactor: code restructuring
