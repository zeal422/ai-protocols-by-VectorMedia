# Kilocode Integration

Standardize Kilocode with ai-protocols.

## Setup

1. Copy `kilocode-config.json` to your project root.
2. Ensure the `knowledgeBase` paths correctly point to where you've stored the protocols (default is project root).

## Protocol Triggers

Active these protocols in Kilocode using the following triggers:

- `COMPREHENSIVE`: BRAIN/code_review_protocol.md
- `DEEPDIVE`: BRAIN/debug_protocol.md
- `AUTODEBUG`: BRAIN/error_fix_protocol.md
- `FULLSPEC`: BRAIN/test_automation_protocol.md
- `ULTRATHINK`: BRAIN/moreFRONTend-PROTOCOL.md
- `ANTI-GENERIC`: BRAIN/FRONTandBACKend-PROTOCOL.md
- `SECAUDIT`: BRAIN/security_audit_protocol.md
- `A11YCHECK`: BRAIN/accessibility_protocol.md
- `FULLARIA`: BRAIN/aria_accessibility_protocol.md
- `PERFAUDIT`: BRAIN/performance_protocol.md
- `SAFEREFACTOR`: BRAIN/refactor_protocol.md
- `APIDESIGN`: BRAIN/api_design_protocol.md
- `GITFLOW`: BRAIN/git_workflow_protocol.md
- `BIGPAPPA`: BRAIN/bigpappa_protocol_reviewANDfixes.md
- `FULLINDEX`: BRAIN/codebase_indexing_protocol.md

## Knowledge Base
Kilocode should be configured to index the following:
- `MASTER_PROTOCOL.md`
- `BRAIN/` directory
- `docs/` directory
