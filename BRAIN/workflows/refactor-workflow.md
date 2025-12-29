---
id: refactor-workflow
name: Safe Code Refactoring
type: workflow
taskType: refactor
difficulty: advanced
estimatedTime: "1-3 hours"
description: "Safely restructure code without breaking functionality"
protocols:
  - codebase_indexing_protocol
  - mdap_protocol
  - refactor_protocol
  - test_automation_protocol
  - code_review_protocol
---

# Workflow: Safe Code Refactoring

**Goal:** Restructure code safely while maintaining functionality and test coverage.

---

## Phase 1: Understanding (Skip if familiar with code)
📋 **Protocol:** FULLINDEX (codebase_indexing_protocol)
- **Purpose:** Map the codebase structure and identify affected modules
- **Time:** 30-45m
- **Trigger:** `Use FULLINDEX to map the codebase structure`

### What you'll get:
- Visual map of code structure
- Understanding of dependencies
- List of affected modules
- Change impact analysis

---

## Phase 2: Planning (Skip if it's a small, obvious refactor)
📋 **Protocol:** MDAP (mdap_protocol)
- **Purpose:** Create detailed refactoring plan with atomic steps
- **Time:** 1-2 hours
- **Trigger:** `Use MDAP to plan the refactoring`

### What you'll create:
- Detailed step-by-step plan
- Identification of breaking changes
- Dependency analysis
- Risk assessment

---

## Phase 3: Execution
✅ **Protocol:** REFACTOR (refactor_protocol)
- **Purpose:** Apply refactoring patterns safely
- **Time:** 1-3 hours (depends on scope)
- **Trigger:** `Use REFACTOR to safely restructure`

### Key principles:
- Make atomic changes (one thing at a time)
- Verify compilation after each step
- Test frequently
- Commit after each successful step

---

## Phase 4: Verification
✅ **Protocol:** FULLSPEC (test_automation_protocol)
- **Purpose:** Ensure test coverage for refactored code
- **Time:** 30m-1 hour
- **Trigger:** `Use FULLSPEC to verify test coverage`

### Verify:
- All tests pass
- No regressions introduced
- Coverage maintained or improved
- Performance not degraded

---

## Phase 5: Review
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Code review before merging
- **Time:** 30m-1 hour
- **Trigger:** `Use COMPREHENSIVE for code review`

### Review checklist:
- [ ] Code correctness
- [ ] Readability improved
- [ ] Performance maintained
- [ ] Maintainability improved

---

## Decision Tree

**Have you never seen this code before?**
- Yes → Complete Phase 1 (FULLINDEX)
- No → Skip Phase 1, start with Phase 2

**Is this a large, risky refactor?**
- Yes → Complete Phase 2 (MDAP)
- No → Skip Phase 2, go to Phase 3

**Do you already have high test coverage?**
- Yes → Can skip Phase 4 details
- No → Must complete Phase 4 thoroughly

---

## Quick Shortcuts

### "Small, obvious refactor"
Skip: Phase 1, Phase 2
Do: Phase 3, Phase 4, Phase 5
Total time: ~2 hours

### "Large refactor in unfamiliar code"
Do: Phase 1, Phase 2, Phase 3, Phase 4, Phase 5
Total time: ~4-6 hours

### "Refactor with high existing coverage"
Skip: Phase 4 (minimal test planning since coverage already high)
Do: Phase 1, Phase 2, Phase 3, Phase 4 execution, Phase 5
Total time: ~2-3 hours

---

## Warning Signs

🚨 **Stop if:**
- Tests start failing unexpectedly
- You can't track changes easily
- The scope keeps growing
- You've made 10+ files changed without committing

**Action:** Commit current work, take a break, reassess with MDAP

---

## Success Criteria

✅ **Refactor is successful if:**
- All tests pass
- Code compiles/runs without errors
- No performance regression
- Code is more maintainable
- Changes are well-documented
- Team understands the changes

