# GitHub Copilot Integration

Enable AI Development Protocols in GitHub Copilot for VS Code.

## Setup

### 1. Custom Instructions

Add the content of `copilot-instructions.md` to your GitHub Copilot "Custom Instructions" setting in VS Code:

1. Open VS Code Settings (`Ctrl+,`).
2. Search for `github.copilot.chat.customInstructions`.
3. Paste the content of `configurations/copilot/copilot-instructions.md`.

### 2. Standard Protocol Set

Ensure the following triggers are understood:

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
| Performance | BRAIN/performance_protocol.md | `PERFAUDIT` |
| Refactoring | BRAIN/refactor_protocol.md | `SAFEREFACTOR` |
| API Design | BRAIN/api_design_protocol.md | `APIDESIGN` |
| Git Workflow | BRAIN/git_workflow_protocol.md | `GITFLOW` |
| Code Audit | BRAIN/bigpappa_protocol_reviewANDfixes.md | `BIGPAPPA` |
| Indexing | BRAIN/codebase_indexing_protocol.md | `FULLINDEX` |

## Usage Tips

- **Reference Files**: Use `#` to reference specific protocols: *"#BRAIN/debug_protocol.md help me with this error"*.
- **Direct Commands**: Use the triggers directly in your prompts: *"FULLSPEC: Add tests for this component"*.
