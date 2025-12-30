---
id: performance-workflow
name: Performance Optimization
type: workflow
taskType: optimize
difficulty: advanced
estimatedTime: "3-5 hours"
description: "Identify and fix performance bottlenecks"
protocols:
  - codebase_indexing_protocol
  - performance_protocol
  - test_automation_protocol
  - code_review_protocol
---

# Workflow: Performance Optimization

**Goal:** Identify bottlenecks and optimize system performance.

---

## Phase 1: Baseline Assessment
📋 **Protocol:** FULLINDEX (codebase_indexing_protocol)
- **Purpose:** Understand system architecture
- **Time:** 30-45m
- **Trigger:** `Use FULLINDEX to map system`

### Understand:
- System architecture
- Data flow
- Critical paths
- Current bottlenecks

---

## Phase 2: Performance Analysis
✅ **Protocol:** PERFAUDIT (performance_protocol)
- **Purpose:** Identify bottlenecks systematically
- **Time:** 1-2 hours
- **Trigger:** `Use PERFAUDIT to find bottlenecks`

### Analyze:
- Database queries (N+1 issues)
- API response times
- Memory usage
- CPU usage
- Network latency
- Cache effectiveness

### Tools:
- Profilers
- Load testing
- Monitoring tools
- APM tools

---

## Phase 3: Optimization
✅ **Protocol:** performance_protocol (reference PERFAUDIT findings)
- **Purpose:** Fix identified bottlenecks
- **Time:** 1-2 hours
- **Trigger:** Implement PERFAUDIT recommendations
- **Reference:** Apply optimization techniques from performance_protocol guidance

### Techniques:
- Database indexing
- Query optimization
- Caching strategies
- Code optimization
- Batching requests
- Compression

---

## Phase 4: Verification
✅ **Protocol:** FULLSPEC (test_automation_protocol)
- **Purpose:** Verify improvements and no regressions
- **Time:** 30m-1 hour
- **Trigger:** `Use FULLSPEC to verify`

### Verify:
- Performance improved (metrics)
- All tests pass
- No regressions
- Memory usage OK
- CPU usage OK

---

## Phase 5: Code Review
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Review optimizations
- **Time:** 30m
- **Trigger:** `Use COMPREHENSIVE for review`

---

## Performance Metrics Checklist

Before/After comparison:
- [ ] Response time: __ → __ (X% improvement)
- [ ] Memory usage: __ → __ (X% improvement)
- [ ] Database queries: __ → __
- [ ] Cache hit rate: __% → __%
- [ ] Error rate: __ → __
- [ ] User satisfaction: improved/same/declined

---

## Warning Signs

🚨 **Stop if:**
- Performance gets worse
- New bugs appear
- Memory usage increases
- Complexity increases significantly

**Action:** Revert changes, reassess with PERFAUDIT

