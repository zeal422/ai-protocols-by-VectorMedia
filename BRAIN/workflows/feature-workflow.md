---
id: feature-workflow
name: Building New Features
type: workflow
taskType: build
difficulty: intermediate
estimatedTime: "3-5 hours"
description: "End-to-end workflow for implementing new features"
protocols:
  - best_practices_protocol
  - api_design_protocol
  - test_automation_protocol
  - code_review_protocol
---

# Workflow: Building New Features

**Goal:** Implement new features following best practices and standards.

---

## Phase 1: Understand Requirements
📋 **Protocol:** BESTPRACTICES (best_practices_protocol)
- **Purpose:** Understand codebase patterns and tech stack
- **Time:** 30m
- **Trigger:** `Use BESTPRACTICES to understand patterns`

### Understand:
- Project tech stack
- Code conventions
- Testing approach
- Architecture patterns

---

## Phase 2: Design API/Interface (if applicable)
📋 **Protocol:** APIDESIGN (api_design_protocol)
- **Purpose:** Design clean, consistent API
- **Time:** 30m-1 hour
- **Trigger:** `Use APIDESIGN for API design`

### Design:
- REST endpoints or functions
- Input validation
- Error responses
- Versioning strategy

---

## Phase 3: Implementation
✅ **Protocol:** Follow project patterns
- **Purpose:** Build the feature
- **Time:** 1-2 hours
- **Trigger:** `Implement following discovered patterns`

### Best practices:
- Small commits
- Test as you go
- Follow naming conventions
- Add comments

---

## Phase 4: Testing
✅ **Protocol:** FULLSPEC (test_automation_protocol)
- **Purpose:** Comprehensive test coverage
- **Time:** 30m-1 hour
- **Trigger:** `Use FULLSPEC for test coverage`

### Test:
- Unit tests
- Integration tests
- Edge cases
- Error scenarios

---

## Phase 5: Code Review
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Peer review before merge
- **Time:** 30m-1 hour
- **Trigger:** `Use COMPREHENSIVE for code review`

### Review:
- Correctness
- Readability
- Performance
- Maintainability

---

## Feature Checklist

Before marking complete:
- [ ] Requirements met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] No breaking changes
- [ ] Performance acceptable
- [ ] Error handling complete

