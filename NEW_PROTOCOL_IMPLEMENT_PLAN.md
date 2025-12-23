# Plan: Implementing ARIA Accessibility Protocol

This plan outlines the steps required to integrate the new `ARIA_ACCESSIBILITY_PROTOCOL` into the AI Development Protocols ecosystem and the MCP server.

## 1. Metadata Recognition Update
- **File:** `protocols-mcp/src/scanner/metadata-extractor.ts`
- **Action:** 
    - Add `aria_accessibility_protocol` to the `knownTriggers` mapping in `extractTriggers`.
    - Map it to the `FULLARIA` trigger.
    - Update `inferCategory` to recognize `aria` and map it to `Accessibility`.

## 2. Master Protocol Integration
- **File:** `BRAIN/MASTER_PROTOCOL.md`
- **Action:** 
    - Add a new section (Section 16) for `ARIA Accessibility`.
    - Include trigger `FULLARIA`.
    - Reference `BRAIN/aria_accessibility_protocol.md`.
    - Add it to the "Multi-Protocol Workflows" and "Protocol Reference" sections.

## 3. Documentation Updates
- **File:** `docs/QUICK_REFERENCE.md`
- **Action:** 
    - Add `ARIA Accessibility` to the "Protocol Selection Matrix".
    - Add `FULLARIA` to the "Special Trigger Commands".
- **File:** `docs/COMMANDS.md` (Check and update)
- **Action:** Add `FULLARIA` documentation.

## 4. MCP Server Rebuild
- **Action:** Run `npm run build` in `protocols-mcp/` to ensure the changes are reflected in the build artifacts.

## 5. Verification
- **Action:** Run the MCP server and verify that `FULLARIA` is recognized as a trigger for the new protocol.
- **Action:** Run `node scripts/validate-protocols.js` (may need update to expect 16 protocols instead of 15).

## 6. Cleanup
- Update versioning if necessary.
