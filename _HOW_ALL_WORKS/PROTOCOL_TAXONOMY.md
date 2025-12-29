# Protocol Taxonomy & Interconnection Map

## 🗂️ Complete Protocol Catalog

### By Category

#### 🎯 **CORE** (Foundational - Always Start Here)

| Protocol | Trigger | Purpose | Entry Point |
|----------|---------|---------|------------|
| **MASTER_PROTOCOL** | MASTER | Central router for all tasks | Read first for task planning |
| **mdap_protocol** | MDAP, MILLIONSTEP | Million-step decomposition planning | High-stakes refactors, complex features |

#### 🐛 **DEBUGGING** (Find & Fix Issues)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **debug_protocol** | DEEPDIVE | 4-phase scientific debugging | "Why isn't this working?" |
| **error_fix_protocol** | AUTODEBUG | Error classification + auto-fixing | Lint errors, type issues, simple fixes |

#### ✅ **TESTING** (Verify Correctness)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **test_automation_protocol** | FULLSPEC | 100% mission-critical test coverage | "Write tests for this" |

#### 🏗️ **ARCHITECTURE** (Design Systems)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **codebase_indexing_protocol** | FULLINDEX | Map entire codebase structure | New project, unfamiliar codebase |
| **api_design_protocol** | APIDESIGN | RESTful/GraphQL design best practices | "Design an API for..." |

#### 🎨 **FRONTEND** (UI/UX Development)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **moreFRONTend-PROTOCOL** | ULTRATHINK | Multi-dimensional UI/UX analysis | "Build this component" (advanced) |
| **FRONTandBACKend-PROTOCOL** | ANTI-GENERIC | Full-stack consistency patterns | "Integrate frontend & backend" |

#### ♿ **ACCESSIBILITY** (WCAG Compliance)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **accessibility_protocol** | A11YCHECK | WCAG compliance checks | "Make this accessible" |
| **aria_accessibility_protocol** | FULLARIA | Advanced screen reader optimization | "Deep accessibility audit" |

#### 🔒 **SECURITY** (Protect Systems)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **security_audit_protocol** | SECAUDIT | OWASP Top 10 + injection checks | "Audit security" or "Secure this" |

#### ⚡ **PERFORMANCE** (Speed & Efficiency)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **performance_protocol** | PERFAUDIT | System-wide bottleneck analysis | "This is slow" or "Optimize this" |

#### 📊 **QUALITY** (Code Review & Best Practices)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **code_review_protocol** | COMPREHENSIVE | 4-pillar code review | "Review this PR" |
| **best_practices_protocol** | BESTPRACTICES | Universal health check + stack detection | "Check health of project" |

#### 🔄 **REFACTORING** (Restructure Code)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **refactor_protocol** | REFACTOR | Safe, high-confidence refactoring | "Refactor this without breaking it" |

#### 🌿 **VERSION CONTROL** (Git Workflow)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **git_workflow_protocol** | GITFLOW | Git branch strategies and workflows | "How do I branch this?" |

#### 🔍 **AUDITING** (Comprehensive Review)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **bigpappa_protocol_reviewANDfixes** | BIGPAPPA | Comprehensive system audit | Full codebase review (enterprise) |

#### ⚙️ **CONFIGURATION** (Setup & Tooling)

| Protocol | Trigger | Purpose | When to Use |
|----------|---------|---------|------------|
| **OPTIMIZED_LINT_SETUP** | — | Linting optimization guide | "Set up linting" |

---

## 🔗 Protocol Dependency Graph

```
MASTER_PROTOCOL (Router)
    │
    ├─→ For "I have a bug"
    │   └─→ debug_protocol (DEEPDIVE)
    │       └─→ References: error_fix_protocol, test_automation_protocol
    │
    ├─→ For "I need to refactor"
    │   └─→ mdap_protocol (MDAP) [Start here for big changes]
    │       ├─→ References: codebase_indexing_protocol (FULLINDEX)
    │       ├─→ References: code_review_protocol (COMPREHENSIVE)
    │       └─→ References: test_automation_protocol (FULLSPEC)
    │
    ├─→ For "Review this code"
    │   └─→ code_review_protocol (COMPREHENSIVE)
    │       ├─→ References: codebase_indexing_protocol (FULLINDEX)
    │       ├─→ References: test_automation_protocol (FULLSPEC)
    │       ├─→ References: best_practices_protocol (BESTPRACTICES)
    │       └─→ References: security_audit_protocol (SECAUDIT)
    │
    ├─→ For "Map the codebase"
    │   └─→ codebase_indexing_protocol (FULLINDEX)
    │       └─→ Used by: MASTER_PROTOCOL, mdap_protocol, code_review_protocol
    │
    ├─→ For "Write tests"
    │   └─→ test_automation_protocol (FULLSPEC)
    │       └─→ Used by: code_review_protocol, debug_protocol, refactor_protocol
    │
    ├─→ For "Build a component"
    │   ├─→ moreFRONTend-PROTOCOL (ULTRATHINK) [Advanced]
    │   │   └─→ References: aria_accessibility_protocol (FULLARIA)
    │   └─→ Or FRONTandBACKend-PROTOCOL (ANTI-GENERIC) [Full-stack]
    │       └─→ References: codebase_indexing_protocol (FULLINDEX)
    │
    ├─→ For "Design an API"
    │   └─→ api_design_protocol (APIDESIGN)
    │       ├─→ References: security_audit_protocol (SECAUDIT)
    │       └─→ References: test_automation_protocol (FULLSPEC)
    │
    ├─→ For "Audit security"
    │   └─→ security_audit_protocol (SECAUDIT)
    │       └─→ References: codebase_indexing_protocol (FULLINDEX)
    │
    ├─→ For "Make it accessible"
    │   └─→ accessibility_protocol (A11YCHECK)
    │       └─→ Or aria_accessibility_protocol (FULLARIA) [Deep dive]
    │           └─→ References: code_review_protocol (COMPREHENSIVE)
    │
    ├─→ For "Optimize performance"
    │   └─→ performance_protocol (PERFAUDIT)
    │       ├─→ References: codebase_indexing_protocol (FULLINDEX)
    │       └─→ References: code_review_protocol (COMPREHENSIVE)
    │
    ├─→ For "Set up linting"
    │   └─→ OPTIMIZED_LINT_SETUP
    │       └─→ References: best_practices_protocol (BESTPRACTICES)
    │
    ├─→ For "Branch strategy"
    │   └─→ git_workflow_protocol (GITFLOW)
    │       └─→ References: code_review_protocol (COMPREHENSIVE)
    │
    ├─→ For "Full audit"
    │   └─→ bigpappa_protocol_reviewANDfixes (BIGPAPPA)
    │       ├─→ References: code_review_protocol (COMPREHENSIVE)
    │       ├─→ References: security_audit_protocol (SECAUDIT)
    │       ├─→ References: performance_protocol (PERFAUDIT)
    │       ├─→ References: codebase_indexing_protocol (FULLINDEX)
    │       └─→ References: test_automation_protocol (FULLSPEC)
    │
    └─→ For "Health check"
        └─→ best_practices_protocol (BESTPRACTICES)
            └─→ References: All other protocols as needed
```

---

## 🎯 Protocol Selection Decision Tree

```
USER TASK
    │
    ├─ Is it a bug / error?
    │  │
    │  ├─ Yes, can't reproduce
    │  │  └─→ Use: debug_protocol (DEEPDIVE)
    │  │      [Follow 4-phase scientific method]
    │  │
    │  └─ Yes, simple lint/type error
    │     └─→ Use: error_fix_protocol (AUTODEBUG)
    │         [Quick fix, classify severity first]
    │
    ├─ Am I building something new?
    │  │
    │  ├─ Yes, component / feature
    │  │  │
    │  │  ├─ Frontend only?
    │  │  │  └─→ Use: moreFRONTend-PROTOCOL (ULTRATHINK)
    │  │  │      [Multi-dimensional analysis]
    │  │  │
    │  │  ├─ Backend API?
    │  │  │  └─→ Use: api_design_protocol (APIDESIGN)
    │  │  │      [REST/GraphQL patterns]
    │  │  │
    │  │  └─ Full-stack?
    │  │     └─→ Use: FRONTandBACKend-PROTOCOL (ANTI-GENERIC)
    │  │         [Integration patterns]
    │  │
    │  └─ Yes, complex / risky?
    │     └─→ Use: mdap_protocol (MDAP)
    │         [Million-step decomposition first!]
    │
    ├─ Am I reviewing / auditing?
    │  │
    │  ├─ Code review (PR)?
    │  │  └─→ Use: code_review_protocol (COMPREHENSIVE)
    │  │      [4-pillar: correctness, readability, perf, maintainability]
    │  │
    │  ├─ Security audit?
    │  │  └─→ Use: security_audit_protocol (SECAUDIT)
    │  │      [OWASP Top 10]
    │  │
    │  ├─ Performance audit?
    │  │  └─→ Use: performance_protocol (PERFAUDIT)
    │  │      [Bottleneck analysis]
    │  │
    │  ├─ Accessibility audit?
    │  │  └─→ Use: aria_accessibility_protocol (FULLARIA)
    │  │      [WCAG AAA level]
    │  │
    │  ├─ Full system audit?
    │  │  └─→ Use: bigpappa_protocol_reviewANDfixes (BIGPAPPA)
    │  │      [Comprehensive review of everything]
    │  │
    │  └─ Health check?
    │     └─→ Use: best_practices_protocol (BESTPRACTICES)
    │         [Quick stack detection + best practices]
    │
    ├─ Am I refactoring / restructuring?
    │  │
    │  ├─ Simple cleanup?
    │  │  └─→ Use: refactor_protocol (REFACTOR)
    │  │      [Safe refactoring steps]
    │  │
    │  └─ Large, risky refactor?
    │     └─→ Use: mdap_protocol (MDAP)
    │         [Plan before executing!]
    │
    ├─ Do I understand the codebase?
    │  │
    │  ├─ No, new project / unfamiliar code
    │  │  └─→ Use: codebase_indexing_protocol (FULLINDEX)
    │  │      [Map everything first]
    │  │
    │  └─ Yes, but want comprehensive map
    │     └─→ Use: codebase_indexing_protocol (FULLINDEX)
    │         [6-phase detailed mapping]
    │
    ├─ Do I need tests?
    │  │
    │  └─→ Use: test_automation_protocol (FULLSPEC)
    │      [Coverage requirements by criticality]
    │
    ├─ Git/branching question?
    │  │
    │  └─→ Use: git_workflow_protocol (GITFLOW)
    │      [Branch strategy patterns]
    │
    ├─ Accessibility question?
    │  │
    │  ├─ Basic WCAG checks?
    │  │  └─→ Use: accessibility_protocol (A11YCHECK)
    │  │
    │  └─ Advanced ARIA / screen readers?
    │     └─→ Use: aria_accessibility_protocol (FULLARIA)
    │
    └─ Setup / configuration?
       │
       └─→ Use: OPTIMIZED_LINT_SETUP
           [Linting + formatting setup]
```

---

## 🔄 Common Workflow Sequences

### Workflow 1: "Fix a Production Bug"

```
1. User: "There's a bug in production"
   
2. Start with: debug_protocol (DEEPDIVE)
   Phase 1: Reproduction
   ├─ Gather error message + stack trace
   ├─ Identify reproduction steps
   ├─ Document environment (OS, versions)
   └─ Create minimal repro case
   
3. Phase 2: Isolation
   ├─ Use binary search
   ├─ Narrow down to exact line/function
   └─ Eliminate red herrings
   
4. Phase 3: Root Cause
   ├─ Form hypothesis
   ├─ Test hypothesis with experiments
   └─ Verify fix works
   
5. Phase 4: Prevention
   ├─ Add tests (via test_automation_protocol)
   └─ Document the issue
   
6. Code review before merge:
   └─ Use code_review_protocol (COMPREHENSIVE)
       ├─ Check correctness of fix
       ├─ Check readability
       ├─ Check performance impact
       └─ Check maintainability
```

### Workflow 2: "I Want to Refactor This Mess"

```
1. User: "This code is unmaintainable"

2. First: Map the codebase
   └─ Use: codebase_indexing_protocol (FULLINDEX)
       ├─ Structural reconnaissance
       ├─ Technology detection
       ├─ Dependency mapping
       ├─ Code entity extraction
       ├─ Semantic analysis
       └─ Change impact matrix

3. For large/risky refactor:
   └─ Use: mdap_protocol (MDAP)
       ├─ Identify dependent code
       ├─ Create detailed plan
       ├─ Break into atomic steps
       ├─ Verify each step
       └─ Commit frequently

4. Or for smaller refactors:
   └─ Use: refactor_protocol (REFACTOR)
       ├─ Safe refactoring patterns
       ├─ How to verify no breakage
       └─ Testing strategy

5. Throughout:
   ├─ Use: test_automation_protocol (FULLSPEC)
   │   └─ Ensure tests cover refactored code
   │
   └─ Use: code_review_protocol (COMPREHENSIVE)
       └─ Review each refactor step
```

### Workflow 3: "Security Audit Before Launch"

```
1. User: "We're launching soon, audit security"

2. Full audit:
   └─ Use: bigpappa_protocol_reviewANDfixes (BIGPAPPA)
       ├─ Comprehensive system review
       ├─ Includes security, performance, testing
       └─ Generates detailed audit report

3. Or targeted approaches:
   ├─ Security focus:
   │  └─ Use: security_audit_protocol (SECAUDIT)
   │      ├─ OWASP Top 10 checks
   │      ├─ Injection attack prevention
   │      ├─ Authentication/authorization
   │      └─ Data protection
   │
   ├─ Performance focus:
   │  └─ Use: performance_protocol (PERFAUDIT)
   │      ├─ Bottleneck identification
   │      ├─ Load testing strategies
   │      └─ Optimization patterns
   │
   ├─ Accessibility focus:
   │  └─ Use: aria_accessibility_protocol (FULLARIA)
   │      ├─ WCAG AAA compliance
   │      ├─ Screen reader optimization
   │      └─ Keyboard navigation
   │
   └─ Code quality focus:
      └─ Use: code_review_protocol (COMPREHENSIVE)
          ├─ 4-pillar review
          ├─ Best practices
          └─ Architecture patterns

4. Before final approval:
   └─ Use: test_automation_protocol (FULLSPEC)
       └─ 100% coverage for mission-critical paths
```

### Workflow 4: "Build a New React Component"

```
1. User: "Build a user profile component"

2. Start with:
   └─ Use: moreFRONTend-PROTOCOL (ULTRATHINK)
       ├─ Psychological design (UX principles)
       ├─ Technical analysis (performance, state)
       ├─ Accessibility analysis (WCAG compliance)
       ├─ Scalability analysis (reusability)
       └─ Integration analysis (API/state management)

3. During implementation:
   ├─ Check UI library patterns
   │  └─ Use: FRONTandBACKend-PROTOCOL if integrating with backend
   │
   ├─ Ensure accessibility
   │  └─ Use: accessibility_protocol (A11YCHECK)
   │      ├─ WCAG 2.1 Level AA
   │      ├─ ARIA labels
   │      └─ Keyboard navigation
   │
   └─ Write tests
      └─ Use: test_automation_protocol (FULLSPEC)
          ├─ Component render tests
          ├─ User interaction tests
          ├─ Edge case tests
          └─ Accessibility tests

4. Code review:
   └─ Use: code_review_protocol (COMPREHENSIVE)
       ├─ Correctness (does it work?)
       ├─ Readability (is it clear?)
       ├─ Performance (fast enough?)
       └─ Maintainability (easy to modify?)
```

---

## 📋 Quick Reference: Trigger Commands

```
MASTER     → Router protocol (start here)
DEEPDIVE   → Debug scientific method
FULLINDEX  → Map codebase structure
MDAP       → Million-step decomposition
FULLSPEC   → Test coverage planning
ULTRATHINK → Frontend UX analysis
ANTI-GENERIC → Full-stack integration patterns (FRONTandBACKend-PROTOCOL)
AUTODEBUG  → Error classification + fix
FULLARIA   → Screen reader accessibility
A11YCHECK  → WCAG compliance
SECAUDIT   → Security audit
PERFAUDIT  → Performance optimization
APIDESIGN  → API design patterns
REFACTOR   → Safe refactoring
GITFLOW    → Git branch strategies
BESTPRACTICES → Universal health check
COMPREHENSIVE → Code review (4-pillar)
BIGPAPPA   → Comprehensive system audit
OPTIMIZED_LINT_SETUP → Linting setup
```

---

## 🎯 Protocol Selection by Language/Framework

### React/TypeScript Frontend

| Task | Protocol | Trigger |
|------|----------|---------|
| Build new component | moreFRONTend-PROTOCOL | ULTRATHINK |
| Fix component bug | debug_protocol | DEEPDIVE |
| Refactor component | refactor_protocol | REFACTOR |
| Component test coverage | test_automation_protocol | FULLSPEC |
| Accessibility audit | aria_accessibility_protocol | FULLARIA |
| Integrate with backend | FRONTandBACKend-PROTOCOL | ANTI-GENERIC |
| Performance optimization | performance_protocol | PERFAUDIT |
| Code review | code_review_protocol | COMPREHENSIVE |

### Node.js/Express Backend

| Task | Protocol | Trigger |
|------|----------|---------|
| Design API endpoint | api_design_protocol | APIDESIGN |
| Fix API bug | debug_protocol | DEEPDIVE |
| Security audit | security_audit_protocol | SECAUDIT |
| Database schema review | code_review_protocol | COMPREHENSIVE |
| Error handling patterns | error_fix_protocol | AUTODEBUG |
| Test coverage | test_automation_protocol | FULLSPEC |
| Performance optimization | performance_protocol | PERFAUDIT |
| Full system audit | bigpappa_protocol_reviewANDfixes | BIGPAPPA |

### DevOps/Infrastructure

| Task | Protocol | Trigger |
|------|----------|---------|
| Setup CI/CD | best_practices_protocol | BESTPRACTICES |
| Security hardening | security_audit_protocol | SECAUDIT |
| Performance tuning | performance_protocol | PERFAUDIT |
| System architecture | codebase_indexing_protocol | FULLINDEX |
| Git workflow setup | git_workflow_protocol | GITFLOW |

### Data Science/ML

| Task | Protocol | Trigger |
|------|----------|---------|
| Code structure review | code_review_protocol | COMPREHENSIVE |
| Bug debugging | debug_protocol | DEEPDIVE |
| Experiment design | test_automation_protocol | FULLSPEC |
| Performance optimization | performance_protocol | PERFAUDIT |
| Full project audit | bigpappa_protocol_reviewANDfixes | BIGPAPPA |

---

## 🔗 Cross-Protocol References

### Protocols Referenced Most Often

```
codebase_indexing_protocol (FULLINDEX)
├─ Used by: 7 protocols
├─ MASTER_PROTOCOL (context understanding)
├─ mdap_protocol (planning)
├─ code_review_protocol (understanding scope)
├─ security_audit_protocol (mapping attack surface)
├─ performance_protocol (identifying hot spots)
├─ bigpappa_protocol_reviewANDfixes (comprehensive audit)
└─ best_practices_protocol (architecture analysis)

test_automation_protocol (FULLSPEC)
├─ Used by: 6 protocols
├─ code_review_protocol (verify test coverage)
├─ debug_protocol (add regression tests)
├─ mdap_protocol (plan testing strategy)
├─ refactor_protocol (ensure tests cover changes)
├─ security_audit_protocol (test security scenarios)
└─ performance_protocol (performance test suite)

debug_protocol (DEEPDIVE)
├─ Referenced by: 5 protocols
├─ Used as fallback for any issue
└─ Core tool for problem-solving
```

---

## 🎓 Learning Path

### For New Developers

```
1. Start: best_practices_protocol (BESTPRACTICES)
   └─ Understand project health and stack

2. Then: codebase_indexing_protocol (FULLINDEX)
   └─ Map and understand the codebase

3. Then: code_review_protocol (COMPREHENSIVE)
   └─ Learn quality standards

4. Then: test_automation_protocol (FULLSPEC)
   └─ Understand testing strategy

5. Then: Pick protocol for your first task
   ├─ Building UI? → moreFRONTend-PROTOCOL
   ├─ Building API? → api_design_protocol
   └─ Fixing bug? → debug_protocol
```

### For Code Reviewers

```
1. Start: code_review_protocol (COMPREHENSIVE)
   └─ 4-pillar review methodology

2. Specialize: (pick based on needs)
   ├─ Security? → security_audit_protocol
   ├─ Performance? → performance_protocol
   ├─ Frontend? → moreFRONTend-PROTOCOL + aria_accessibility_protocol
   └─ Architecture? → codebase_indexing_protocol

3. Always reference: best_practices_protocol
   └─ For general health checks
```

### For Team Leads

```
1. Start: MASTER_PROTOCOL
   └─ Understand routing

2. Setup: 
   ├─ best_practices_protocol (BESTPRACTICES)
   ├─ OPTIMIZED_LINT_SETUP
   └─ git_workflow_protocol (GITFLOW)

3. For PRs/reviews:
   ├─ code_review_protocol (COMPREHENSIVE)
   └─ bigpappa_protocol_reviewANDfixes (BIGPAPPA) for major milestones

4. For security/performance:
   ├─ security_audit_protocol (SECAUDIT) monthly
   └─ performance_protocol (PERFAUDIT) monthly
```

---

## 🏆 When to Use Each Protocol

| Situation | Use This Protocol | Trigger |
|-----------|-------------------|---------|
| "Where do I start?" | MASTER_PROTOCOL | MASTER |
| "Bug, can't reproduce" | debug_protocol | DEEPDIVE |
| "Lint/type error" | error_fix_protocol | AUTODEBUG |
| "Write tests" | test_automation_protocol | FULLSPEC |
| "New code to build" | moreFRONTend-PROTOCOL (FE) / api_design_protocol (API) | ULTRATHINK / APIDESIGN |
| "Understand codebase" | codebase_indexing_protocol | FULLINDEX |
| "Review code" | code_review_protocol | COMPREHENSIVE |
| "Refactor safely" | refactor_protocol or mdap_protocol | REFACTOR / MDAP |
| "Security audit" | security_audit_protocol | SECAUDIT |
| "Performance issue" | performance_protocol | PERFAUDIT |
| "Accessibility check" | accessibility_protocol / aria_accessibility_protocol | A11YCHECK / FULLARIA |
| "Risky/complex task" | mdap_protocol | MDAP |
| "Full system audit" | bigpappa_protocol_reviewANDfixes | BIGPAPPA |
| "Git workflow" | git_workflow_protocol | GITFLOW |
| "Setup project" | best_practices_protocol | BESTPRACTICES |

---

## 🎯 Protocol Interoperability

**All protocols follow:**
- Same markdown format (for parsing)
- Same metadata structure (title, triggers, purpose)
- Same reference format (links to related protocols)
- Same execution flow (4-8 phase workflows)

**They complement each other:**
- Use FULLINDEX before MDAP for planning
- Use DEEPDIVE → then add tests from FULLSPEC
- Use SECAUDIT in parallel with COMPREHENSIVE review
- Use BESTPRACTICES to cross-check all protocols

---

## 📊 Protocol Coverage Matrix

```
                    Bug  Feat Build Review Test Audit Secure Perf Refactor
MASTER_PROTOCOL      ✓    ✓    ✓     ✓     ✓    ✓     ✓      ✓    ✓
debug_protocol       ✓    —    —     —     ✓    —     —      —    —
error_fix_protocol   ✓    —    —     —     —    —     —      —    —
test_automation      —    ✓    ✓     ✓     ✓    ✓     ✓      ✓    ✓
codebase_indexing    —    ✓    ✓     ✓     —    ✓     —      —    —
api_design_protocol  —    ✓    ✓     ✓     —    —     ✓      —    —
moreFRONTend         —    ✓    ✓     —     ✓    —     —      ✓    —
FRONTandBACKend      —    ✓    ✓     ✓     —    —     —      —    —
code_review          —    —    —     ✓     ✓    ✓     ✓      ✓    ✓
security_audit       ✓    —    —     —     —    ✓     ✓      —    —
performance_protocol —    —    —     —     —    ✓     —      ✓    —
accessibility        —    ✓    ✓     ✓     ✓    —     —      —    —
refactor_protocol    —    —    ✓     ✓     ✓    —     —      —    ✓
mdap_protocol        ✓    ✓    ✓     ✓     ✓    —     —      —    ✓
best_practices       —    —    —     ✓     —    ✓     —      —    —
git_workflow         —    —    —     —     —    —     —      —    —
bigpappa_audit       —    —    —     ✓     ✓    ✓     ✓      ✓    —
OPTIMIZED_LINT       —    —    —     —     —    —     —      —    —
```

---

## 🎓 Key Insights

1. **MASTER_PROTOCOL is the router** - Always start here if unsure
2. **Protocols form a graph** - They reference and support each other
3. **FULLINDEX is foundational** - Many protocols build on codebase understanding
4. **MDAP is for complexity** - Use before tackling risky/complex changes
5. **Testing is everywhere** - FULLSPEC is referenced by most protocols
6. **Security + Performance are cross-cutting** - Audit protocols used by many
7. **Each protocol is self-contained** - Can use independently, but better together
