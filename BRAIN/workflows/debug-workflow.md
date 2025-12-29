---
id: debug-workflow
name: Bug Investigation & Fixing
type: workflow
taskType: debug
difficulty: intermediate
estimatedTime: "30-60m"
description: "Systematically find and fix bugs using scientific method"
protocols:
  - debug_protocol
  - error_fix_protocol
  - test_automation_protocol
  - code_review_protocol
---

# Workflow: Bug Investigation & Fixing

**Goal:** Find and fix the bug using a systematic, scientific approach.

---

## Phase 1: Reproduction
✅ **Protocol:** DEEPDIVE (debug_protocol) - Phase 1
- **Purpose:** Gather error info and create minimal reproduction case
- **Time:** 10-15m
- **Trigger:** `Use DEEPDIVE for Phase 1: Reproduction`

### Gather:
- Error message (exact, complete)
- Stack trace
- Steps to reproduce
- Environment (OS, versions, dependencies)
- When was it working? (last commit, previous version)

---

## Phase 2: Isolation
✅ **Protocol:** DEEPDIVE (debug_protocol) - Phase 2
- **Purpose:** Narrow down to exact location of bug
- **Time:** 10-20m
- **Trigger:** `Use DEEPDIVE for Phase 2: Isolation`

### Use binary search:
- Change one variable at a time
- Test after each change
- Narrow down to exact function/line
- Eliminate red herrings

---

## Phase 3: Root Cause Analysis
✅ **Protocol:** DEEPDIVE (debug_protocol) - Phase 3
- **Purpose:** Understand WHY the bug happens
- **Time:** 10-15m
- **Trigger:** `Use DEEPDIVE for Phase 3: Root Cause`

### Analyze:
- Form hypothesis
- Test hypothesis
- Verify understanding
- Ensure you understand the fix

---

## Phase 4: Prevention
✅ **Protocol:** DEEPDIVE (debug_protocol) - Phase 4 + FULLSPEC
- **Purpose:** Fix the bug and prevent regression
- **Time:** 15-30m
- **Trigger:** `Use DEEPDIVE for Phase 4 then FULLSPEC for tests`

### Actions:
- Apply the fix
- Add regression test
- Verify all tests pass
- Document the issue

---

## Phase 5: Review
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Review fix before merging
- **Time:** 10-15m
- **Trigger:** `Use COMPREHENSIVE for code review`

### Review:
- Fix is correct
- No side effects
- Tests are good
- Documentation is clear

---

## Quick Shortcuts

### "Simple lint/type error"
Do: error_fix_protocol (AUTODEBUG) only
Total time: ~5-10m

### "Complex bug, unfamiliar code"
Do: Full DEEPDIVE (all 4 phases) + tests
Total time: ~60m

### "Bug in well-tested code"
Skip: Extensive isolation
Do: DEEPDIVE phases 1-4, COMPREHENSIVE review
Total time: ~30m

---

## Anti-Patterns to Avoid

❌ **Don't:**
- Change multiple things at once
- Copy Stack Overflow fixes without understanding
- Leave debug code in production
- Ignore warnings
- Skip tests

✅ **Do:**
- Change one thing at a time
- Understand why the fix works
- Remove all debug code
- Fix warnings too
- Write regression tests

