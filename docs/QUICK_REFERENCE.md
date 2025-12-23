# 🎯 AI Protocols Quick Reference

> One-page cheat sheet for rapid protocol selection and usage.

---

## 🧭 Protocol Selection Matrix

| What you need to do | Protocol | Trigger Command |
|---------------------|----------|-----------------|
| 🔍 Review code quality | [code_review_protocol.md](code_review_protocol.md) | `COMPREHENSIVE` |
| 🐛 Debug issues | [debug_protocol.md](debug_protocol.md) | `DEEPDIVE` |
| 🔧 Auto-fix errors | [error_fix_protocol.md](error_fix_protocol.md) | `AUTODEBUG` |
| 🧪 Write tests | [test_automation_protocol.md](test_automation_protocol.md) | `FULLSPEC` |
| 🎨 Build UI | [moreFRONTend-PROTOCOL.md](moreFRONTend-PROTOCOL.md) | `ULTRATHINK` |
| 🔌 Full-stack development | [FRONTandBACKend-PROTOCOL.md](FRONTandBACKend-PROTOCOL.md) | `ANTI-GENERIC` |
| 📊 Audit entire codebase | [bigpappa_protocol_reviewANDfixes.md](bigpappa_protocol_reviewANDfixes.md) | `BIGPAPPA` |
| 🗺️ Map codebase | [codebase_indexing_protocol.md](codebase_indexing_protocol.md) | `FULLINDEX` |
| 🔐 Security audit | [security_audit_protocol.md](security_audit_protocol.md) | `SECAUDIT` |
| ♿ Accessibility check | [accessibility_protocol.md](accessibility_protocol.md) | `A11YCHECK` |
| ♿ ARIA accessibility | [aria_accessibility_protocol.md](aria_accessibility_protocol.md) | `FULLARIA` |
| 📝 Git workflow | [git_workflow_protocol.md](git_workflow_protocol.md) | `GITFLOW` |
| 🔌 API design | [api_design_protocol.md](api_design_protocol.md) | `APIDESIGN` |
| ⚡ Performance optimization | [performance_protocol.md](performance_protocol.md) | `PERFAUDIT` |
| 🛠️ Linting setup | [OPTIMIZED_LINT_SETUP.md](OPTIMIZED_LINT_SETUP.md) | — |

---

## 🔑 Special Trigger Commands

| Command | Effect | Use When |
|---------|--------|----------|
| **DEEPDIVE** | Full system scan, multi-layer investigation | Complex bugs, unclear root cause |
| **ULTRATHINK** | Maximum reasoning depth, exhaustive analysis | Critical UI/UX decisions |
| **FULLSPEC** | Complete test suite generation | Need comprehensive test coverage |
| **FULLINDEX** | Complete codebase mapping | Understanding new codebase |
| **BIGPAPPA** | Autonomous review + fixes | Full quality audit |
| **AUTODEBUG** | Auto-detect and fix all errors | Cleaning up codebase |
| **COMPREHENSIVE** | Deep code review | Thorough PR review |
| **SECAUDIT** | Full scan (OWASP Top 10, secrets, API testing) | Pre-deployment security check |
| **A11YCHECK** | Accessibility compliance audit (WCAG AA) | WCAG compliance verification |
| **FULLARIA** | Comprehensive ARIA audit (WCAG AAA, semantics, focus) | Advanced accessibility/assistive tech check |
| **PERFAUDIT** | Performance analysis (Core Web Vitals, DB, bundle) | Optimizing speed |

---

## 🚦 Severity Indicators

| Emoji | Level | Auto-Fix? | Action |
|-------|-------|-----------|--------|
| 🟢 | SAFE | Always | Formatting, unused imports |
| 🟡 | LOW-RISK | With confirmation | Type annotations |
| 🟠 | MODERATE | Show diff first | Logic changes |
| 🔴 | HIGH-RISK | Never | Auth, payments, migrations |

---

## 🔐 Never Auto-Fix (Always Ask First)

- ❌ Authentication/authorization logic
- ❌ Payment processing code
- ❌ Database migrations
- ❌ API contract changes
- ❌ Build/deployment configurations
- ❌ Security-sensitive code
- ❌ Core architecture changes

---

## ✅ Always Do

- ✅ Read existing code before changes
- ✅ Follow existing patterns
- ✅ Preserve naming conventions
- ✅ Add tests for new code
- ✅ Document why changes are made
- ✅ Provide verification steps
- ✅ Ask when uncertain

---

## 📊 The Four Pillars (Code Review)

| Pillar | Ask Yourself |
|--------|--------------|
| **Correctness** | Does it solve the problem without edge case failures? |
| **Readability** | Can a junior engineer understand this in 6 months? |
| **Performance** | Any O(n²) loops, memory leaks, or N+1 queries? |
| **Maintainability** | Will this code become technical debt? |

---

## 🐛 Scientific Debugging Method

```
1. REPRODUCE → Confirm bug is reproducible
2. OBSERVE   → Gather symptoms and data
3. HYPOTHESIZE → Form 3-5 ranked theories
4. TEST      → Run experiments to eliminate theories
5. ISOLATE   → Binary search the codebase
6. VERIFY    → Prove fix works in all environments
7. DOCUMENT  → Explain why it broke and why fix works
```

---

## 📈 Test Coverage Targets

| Code Type | Coverage |
|-----------|----------|
| Business-Critical | 100% |
| Core Features | 80%+ |
| Utilities | 70%+ |
| Security-Critical | 100% |

---

## 🌐 Core Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5-4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1-0.25 | > 0.25 |

---

## 🔒 OWASP Top 10 Quick Check

1. ⬜ Broken Access Control
2. ⬜ Cryptographic Failures
3. ⬜ Injection (SQL, XSS, Command)
4. ⬜ Insecure Design
5. ⬜ Security Misconfiguration
6. ⬜ Vulnerable Components
7. ⬜ Authentication Failures
8. ⬜ Data Integrity Failures
9. ⬜ Logging Failures
10. ⬜ SSRF

---

## 📝 Commit Message Format

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, chore
```

**Examples:**
- `feat(auth): add OAuth2 login`
- `fix(api): handle null response`
- `docs(readme): update install steps`

---

## 🔗 Quick Links

- [📖 Master Protocol](../MASTER_PROTOCOL.md) — Start here
- [⚡ Commands Guide](COMMANDS.md) — All trigger commands + NEW tools
- [🚀 Quick Start](QUICK_START.md) — 5-minute setup
- [🎬 Real-World Scenarios](SCENARIOS.md) — 6 usage examples
- [🛠️ Troubleshooting](TROUBLESHOOTING.md) — Problem solving
- [❓ FAQ](FAQ.md) — 40+ questions answered
- [📊 Case Studies](CASE_STUDIES.md) — Success stories with metrics
- [📝 Changelog](CHANGELOG.md) — Version history

---

## 🆕 New Features (v2.1.1)

### Interactive CLI Setup
```bash
npx @ai-protocols/init
# 30-second setup with prompts
```

### Validation Scripts
```bash
node scripts/validate-protocols.js
# Verify your setup (100% score expected)
```

### Working Examples
- `examples/node-express/` - Complete API with tests
- `examples/react-typescript/` - Full app with components

### Comprehensive Documentation
- 6 new guides with 3,000+ lines
- Real-world scenarios and case studies
- Troubleshooting for 40+ issues

---

*Quick Reference v2.1.1 | Last Updated: 2025-12-22*
