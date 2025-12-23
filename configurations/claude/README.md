# Claude Integration

Configure Claude.ai to follow ai-protocols.

## Setup

### 1. Project-Specific (Recommended)

1. Create or update `CLAUDE.md` in your project root with the standardized template provided in this directory.
2. Claude will automatically read `CLAUDE.md` to understand your project structure and the protocols to follow.

### 2. Custom Instructions (Global)

For a more global setup in Claude.ai Pro:

1. Copy the content of `claude-instructions.md`.
2. Go to your Claude.ai account settings → "Custom Instructions".
3. Paste the content and save.

## Standard Protocol Triggers

| Task | Protocol | Trigger |
| :--- | :--- | :--- |
| Code Review | BRAIN/code_review_protocol.md | `COMPREHENSIVE` |
| Debugging | BRAIN/debug_protocol.md | `DEEPDIVE` |
| Error Fixing | BRAIN/error_fix_protocol.md | `AUTODEBUG` |
| Testing | BRAIN/test_automation_protocol.md | `FULLSPEC` |
| Frontend | BRAIN/moreFRONTend-PROTOCOL.md | `ULTRATHINK` |
| Full-stack | BRAIN/FRONTandBACKend-PROTOCOL.md | `ANTI-GENERIC` |
| Security | BRAIN/security_audit_protocol.md | `SECAUDIT` |
| Accessibility | BRAIN/accessibility_protocol.md | `A11YCHECK` |
| ARIA Accessibility | BRAIN/aria_accessibility_protocol.md | `FULLARIA` |
| Performance | BRAIN/performance_protocol.md | `PERFAUDIT` |
| Refactoring | BRAIN/refactor_protocol.md | `SAFEREFACTOR` |
| API Design | BRAIN/api_design_protocol.md | `APIDESIGN` |
| Git Workflow | BRAIN/git_workflow_protocol.md | `GITFLOW` |
| Code Audit | BRAIN/bigpappa_protocol_reviewANDfixes.md | `BIGPAPPA` |
| Indexing | BRAIN/codebase_indexing_protocol.md | `FULLINDEX` |

## Usage

- **File Reference**: You can explicitly ask Claude: *"Following BRAIN/moreFRONTend-PROTOCOL.md, refactor this component UI"*.
- **Direct Trigger**: Use the commands directly: *"DEEPDIVE: This API authentication is failing intermittentely"*.
