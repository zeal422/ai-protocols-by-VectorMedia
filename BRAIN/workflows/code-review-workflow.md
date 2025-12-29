---
id: code-review-workflow
name: Comprehensive Code Review
type: workflow
taskType: audit
difficulty: advanced
estimatedTime: "1-2 hours per review"
description: "4-pillar code review for pull requests and major changes"
protocols:
  - codebase_indexing_protocol
  - code_review_protocol
  - test_automation_protocol
  - security_audit_protocol
---

# Workflow: Comprehensive Code Review

**Goal:** Thoroughly review code changes across 4 pillars before merging.

---

## Phase 1: Understand Scope
📋 **Protocol:** FULLINDEX (codebase_indexing_protocol)
- **Purpose:** Understand what changed and why
- **Time:** 10-15m
- **Trigger:** `Use FULLINDEX to map changes`

### Review:
- What files changed?
- What functionality is affected?
- Are there related changes elsewhere?

---

## Phase 2: Code Review (4-Pillar)
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Review across correctness, readability, performance, maintainability
- **Time:** 30m-1 hour
- **Trigger:** `Use COMPREHENSIVE for code review`

### The 4 Pillars:

1. **Correctness**
   - Does it do what it's supposed to do?
   - Are there edge cases?
   - Error handling?

2. **Readability**
   - Clear variable/function names?
   - Reasonable complexity?
   - Comments where needed?

3. **Performance**
   - Any N+1 queries?
   - Unnecessary loops?
   - Memory leaks?

4. **Maintainability**
   - Can others understand it?
   - Is it consistent with codebase?
   - DRY principle followed?

---

## Phase 3: Test Coverage
✅ **Protocol:** FULLSPEC (test_automation_protocol)
- **Purpose:** Verify adequate test coverage
- **Time:** 15-20m
- **Trigger:** `Use FULLSPEC for test coverage`

### Check:
- Are there tests for changes?
- Coverage % maintained or improved?
- Tests are meaningful (not just coverage %)?
- Edge cases tested?

---

## Phase 4: Security (if applicable)
✅ **Protocol:** SECAUDIT (security_audit_protocol)
- **Purpose:** Check for security issues
- **Time:** 15-30m (if applicable)
- **Trigger:** `Use SECAUDIT for security review`

### For changes touching:
- Authentication/authorization
- Data handling
- APIs
- External integrations

---

## Review Checklist

General:
- [ ] PR description is clear
- [ ] Commits are logical/atomic
- [ ] No debugging code left in
- [ ] No secrets committed

Code Quality:
- [ ] Follows project conventions
- [ ] Complexity is reasonable
- [ ] No duplicated code
- [ ] Error handling present

Testing:
- [ ] Tests pass locally
- [ ] Tests pass in CI
- [ ] Coverage maintained
- [ ] Edge cases covered

Maintenance:
- [ ] Comments explain "why" not "what"
- [ ] Naming is clear
- [ ] No deprecated APIs used
- [ ] Related code updated

---

## Approval Decision

✅ **Approve if:**
- All checklist items pass
- No major concerns
- 4 pillars look good

🔄 **Request Changes if:**
- Correctness issues
- Major complexity
- Missing tests
- Security concerns

❓ **Need Discussion if:**
- Design disagreement
- Approach questions
- Large refactor

