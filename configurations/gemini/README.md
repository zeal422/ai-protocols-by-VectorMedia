# Google Gemini Integration

Use ai-protocols with Google Gemini (via AI Studio or Gemini Advanced).

## Setup

### 1. System Instructions

Paste the content of `configurations/gemini/system-instructions.txt` into the "System Instructions" field in your AI tool (e.g., Google AI Studio).

### 2. Standard Protocol Set

Ensure the following triggers and paths are used:

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

## Usage Tips

- **Context Window**: Gemini has a large context window; don't hesitate to upload the entire `BRAIN/` directory if you're using the file upload feature in Gemini Advanced.
- **Reference Commands**: Use the triggers directly in your prompt to activate specialized logic.
