# 🎬 Real-World Scenarios

Advanced workflow examples demonstrating multi-protocol usage for common development challenges.

---

## 📋 Table of Contents

1. [Legacy Codebase Rescue](#1-legacy-codebase-rescue)
2. [New Feature Development](#2-new-feature-development)
3. [Security Incident Response](#3-security-incident-response)
4. [Performance Optimization Sprint](#4-performance-optimization-sprint)
5. [Team Onboarding](#5-team-onboarding)
6. [Pre-Production Checklist](#6-pre-production-checklist)
7. [Full System Migration (Million-Step Task)](#7-full-system-migration-million-step-task)
8. [Accessibility Overhaul (WCAG AAA)](#8-accessibility-overhaul-wcag-aaa)

---

## 1. Legacy Codebase Rescue

**Situation:** Inherited a 3-year-old codebase with no tests, outdated dependencies, and unclear architecture.

**Timeline:** 6 weeks  
**Goal:** Transform into maintainable, tested, secure codebase

### Week 1: Intelligence Gathering
```
Day 1-2: Use MASTER_PROTOCOL with FULLINDEX
- Map entire codebase structure
- Identify all dependencies and their relationships
- Document public APIs and entry points

Day 3-5: Use MASTER_PROTOCOL with BIGPAPPA
- Comprehensive audit of code quality
- Identify technical debt hotspots
- Prioritize issues by severity (🔴 Critical → 🟢 Minor)
```

**Expected Output:**
- Complete codebase map
- Prioritized list of 50-100 issues
- Dependency graph
- Risk assessment report

### Week 2: Security Hardening
```
Day 1-3: Use MASTER_PROTOCOL with SECAUDIT
- Scan for OWASP Top 10 vulnerabilities
- Check for hardcoded secrets
- Review authentication/authorization logic
- Audit dependency vulnerabilities (npm audit, Snyk)

Day 4-5: Fix Critical Security Issues
- Update vulnerable dependencies
- Remove hardcoded secrets → environment variables
- Add rate limiting to public endpoints
- Implement proper error handling (no stack traces in production)
```

**Expected Output:**
- Zero critical vulnerabilities
- Security audit report
- Updated .env.example template

### Week 3-4: Test Coverage
```
Week 3: Use MASTER_PROTOCOL with FULLSPEC
- Write unit tests for business logic (target: 70%)
- Add integration tests for API endpoints
- Create E2E tests for critical user flows

Week 4: Continue Testing + Refactoring
- Use SAFEREFACTOR for high-risk code
- Add test coverage for edge cases
- Mock external dependencies properly
```

**Expected Output:**
- 70%+ code coverage
- CI/CD pipeline with automated tests
- Documentation for test strategy

### Week 5: Code Quality
```
Day 1-3: Use MASTER_PROTOCOL with COMPREHENSIVE
- Review all modified code
- Check for code smells and anti-patterns
- Ensure consistent naming and style

Day 4-5: Use MASTER_PROTOCOL with PERFAUDIT
- Profile slow endpoints
- Optimize database queries (N+1 problems)
- Add caching where appropriate
```

**Expected Output:**
- Clean code review report
- Performance benchmarks
- Optimization recommendations

### Week 6: Documentation & Handoff
```
- Create architecture documentation
- Write setup guide for new developers
- Document deployment process
- Create runbook for common issues
```

**Success Metrics:**
- ✅ 0 critical security vulnerabilities
- ✅ 70%+ test coverage
- ✅ All CI/CD pipelines passing
- ✅ 50% reduction in technical debt
- ✅ 30% faster onboarding time

---

## 2. New Feature Development

**Situation:** Building a real-time chat feature for an existing application.

**Timeline:** 2 weeks  
**Protocols Used:** 6

### Phase 1: Design (Day 1-2)
```
Step 1: Use MASTER_PROTOCOL with APIDESIGN
- Design WebSocket message protocol
- Define REST API for message history
- Plan authentication flow
- Document rate limits and error codes

Step 2: Use MASTER_PROTOCOL with ULTRATHINK
- Design chat UI/UX
- Plan accessibility features (keyboard nav, screen readers)
- Consider mobile responsiveness
- Design loading and error states
```

**Deliverables:**
- API specification (OpenAPI/Swagger)
- UI mockups and component hierarchy
- Data flow diagrams

### Phase 2: Implementation (Day 3-7)
```
Step 3: Use MASTER_PROTOCOL with ANTI-GENERIC
- Build WebSocket server (Node.js/Socket.io)
- Implement message broadcasting
- Add typing indicators
- Build chat UI components

Step 4: Use MASTER_PROTOCOL with SECAUDIT
- Validate all WebSocket messages
- Implement rate limiting (max 10 messages/minute)
- Sanitize user input (prevent XSS)
- Add authentication to WebSocket connections
```

**Deliverables:**
- Working chat feature
- Security audit report
- Rate limiting configuration

### Phase 3: Testing (Day 8-10)
```
Step 5: Use MASTER_PROTOCOL with FULLSPEC
- Unit tests for message validation
- Integration tests for WebSocket events
- E2E tests for complete chat flow
- Load testing (100 concurrent users)

Step 6: Use MASTER_PROTOCOL with A11YCHECK
- Keyboard navigation testing
- Screen reader compatibility
- Focus management
- ARIA labels verification
```

**Deliverables:**
- 80%+ test coverage
- Accessibility compliance report
- Load test results

### Phase 4: Review & Deploy (Day 11-12)
```
Step 7: Use MASTER_PROTOCOL with COMPREHENSIVE
- Code review all changes
- Check for performance issues
- Verify error handling
- Ensure documentation is complete

Step 8: Deploy with GITFLOW
- Create feature branch
- Submit pull request
- Pass CI/CD checks
- Deploy to staging → production
```

**Success Metrics:**
- ✅ Feature works for 100+ concurrent users
- ✅ <100ms message latency
- ✅ WCAG 2.1 AA compliant
- ✅ 0 security vulnerabilities

---

## 3. Security Incident Response

**Situation:** API endpoint discovered leaking user emails to unauthorized users.

**Timeline:** 4 hours (emergency)  
**Protocols Used:** 3

### Hour 1: Assess & Contain
```
Use MASTER_PROTOCOL with DEEPDIVE
- Reproduce the vulnerability
- Determine scope (which endpoints affected?)
- Check logs for exploitation attempts
- Identify when vulnerability was introduced (git blame)

Immediate Actions:
1. Disable affected endpoint if critical
2. Add rate limiting to slow potential abuse
3. Alert security team and stakeholders
```

### Hour 2: Root Cause Analysis
```
Continue with DEEPDIVE
- Trace code path from endpoint → data exposure
- Identify missing authorization check
- Review similar endpoints for same issue
- Create proof-of-concept exploit

Root Cause: Missing userId check in query
Before: SELECT * FROM users WHERE id = ${req.params.id}
After:  SELECT * FROM users WHERE id = ${req.params.id} AND userId = ${req.user.id}
```

### Hour 3: Fix & Test
```
Use MASTER_PROTOCOL with FULLSPEC
- Write failing test that reproduces bug
- Implement fix (add authorization check)
- Verify test now passes
- Test edge cases (null userId, admin users, etc.)
- Run full security test suite

Use MASTER_PROTOCOL with SECAUDIT
- Review all similar endpoints
- Add authorization checks where missing
- Verify no other leaks exist
```

### Hour 4: Deploy & Verify
```
- Emergency deploy to production
- Verify fix works in production
- Monitor logs for any errors
- Review access logs for potential data breach
- Document incident in postmortem

Postmortem Actions:
1. Add authorization middleware to all endpoints
2. Create checklist for security reviews
3. Add automated security tests to CI/CD
4. Schedule team training on OWASP Top 10
```

**Success Metrics:**
- ✅ Vulnerability patched in <4 hours
- ✅ No unauthorized data access after fix
- ✅ Similar vulnerabilities prevented
- ✅ Incident documented for learning

---

## 4. Performance Optimization Sprint

**Situation:** Landing page loads in 8 seconds. Target: <2 seconds.

**Timeline:** 1 week  
**Goal:** Achieve Lighthouse score 90+

### Day 1: Baseline & Analysis
```
Use MASTER_PROTOCOL with PERFAUDIT
- Run Lighthouse audit
- Measure Core Web Vitals (LCP, INP, CLS)
- Profile bundle size (webpack-bundle-analyzer)
- Analyze network waterfall
- Check database query performance

Current Metrics:
- LCP: 6.2s (❌ Poor)
- INP: 450ms (❌ Poor)
- CLS: 0.3 (❌ Poor)
- Bundle: 2.4MB (❌ Too large)
```

### Day 2-3: Quick Wins
```
Continue with PERFAUDIT

Images:
- Compress images (reduce 3MB → 300KB)
- Use WebP format
- Add lazy loading
- Implement responsive images (srcset)

JavaScript:
- Code split by route
- Defer non-critical JS
- Remove unused dependencies (500KB saved)
- Minify and compress

CSS:
- Remove unused CSS (PurgeCSS)
- Inline critical CSS
- Defer non-critical styles
```

### Day 4: Advanced Optimizations
```
Backend:
- Add Redis caching for API responses
- Optimize database queries (add indexes)
- Enable gzip compression
- Implement CDN for static assets

Frontend:
- Use React.lazy() for code splitting
- Implement virtual scrolling for long lists
- Optimize re-renders (React.memo)
- Preload critical resources
```

### Day 5: Testing & Verification
```
Use MASTER_PROTOCOL with FULLSPEC
- Test on slow 3G connection
- Test on low-end devices
- Verify accessibility not affected
- Run Lighthouse on 5 different pages

New Metrics:
- LCP: 1.8s (✅ Good)
- INP: 180ms (✅ Good)
- CLS: 0.05 (✅ Good)
- Bundle: 450KB (✅ Improved)
```

**Success Metrics:**
- ✅ 75% reduction in load time (8s → 2s)
- ✅ Lighthouse score 90+
- ✅ Core Web Vitals all "Good"
- ✅ Mobile performance improved 60%

---

## 5. Team Onboarding

**Situation:** 3 new developers joining the team.

**Timeline:** 2 weeks  
**Goal:** Productive contributors by week 3

### Week 1: Setup & Learning
```
Day 1: Environment Setup
- Follow QUICK_START.md
- Run validation script
- Clone repositories
- Install dependencies

Day 2-3: Codebase Familiarization
Use MASTER_PROTOCOL with FULLINDEX
- Generate codebase map
- Review architecture documentation
- Understand folder structure
- Identify key modules and APIs

Day 4-5: First Contributions
Use MASTER_PROTOCOL with COMPREHENSIVE
- Review existing code
- Fix simple bugs (good first issues)
- Write tests for existing code
- Submit first pull request
```

### Week 2: Advanced Tasks
```
Day 1-2: Feature Development
Use MASTER_PROTOCOL with ANTI-GENERIC
- Implement small feature end-to-end
- Follow team's coding standards
- Add tests (FULLSPEC)
- Submit for review

Day 3-4: Code Review Practice
Use MASTER_PROTOCOL with COMPREHENSIVE
- Review other team members' PRs
- Provide constructive feedback
- Learn from senior developers' reviews

Day 5: Security & Performance
- Complete SECAUDIT training
- Run PERFAUDIT on own code
- Learn about common vulnerabilities
```

**Success Metrics:**
- ✅ All new developers productive by week 3
- ✅ First feature merged within 10 days
- ✅ Understanding of codebase architecture
- ✅ Following team's development protocols

---

## 6. Pre-Production Checklist

**Situation:** About to deploy major release to production.

**Timeline:** 2 days  
**Goal:** Zero production incidents

### Day 1: Comprehensive Audit
```
Morning: Use MASTER_PROTOCOL with SECAUDIT
- [ ] No secrets in code or git history
- [ ] All dependencies up to date (no vulnerabilities)
- [ ] Rate limiting on all public endpoints
- [ ] Authentication/authorization working correctly
- [ ] Error messages don't leak information
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured (Helmet.js)
- [ ] CORS properly configured

Afternoon: Use MASTER_PROTOCOL with PERFAUDIT
- [ ] Lighthouse score 90+ on all pages
- [ ] Core Web Vitals in "Good" range
- [ ] Bundle size optimized (<500KB initial)
- [ ] Database queries optimized (no N+1)
- [ ] Caching implemented where appropriate
- [ ] CDN configured for static assets
```

### Day 2: Final Checks
```
Morning: Use MASTER_PROTOCOL with COMPREHENSIVE
- [ ] All code reviewed by at least 2 people
- [ ] No TODO/FIXME comments in critical paths
- [ ] Error handling comprehensive
- [ ] Logging properly configured
- [ ] Documentation up to date

Use MASTER_PROTOCOL with FULLSPEC
- [ ] 80%+ code coverage
- [ ] All tests passing in CI/CD
- [ ] E2E tests for critical flows
- [ ] Load testing complete (handle expected traffic)
- [ ] Rollback plan tested

Afternoon: Use MASTER_PROTOCOL with A11YCHECK
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast adequate
- [ ] Focus indicators visible

Final Steps:
- [ ] Staging environment matches production
- [ ] Database migrations tested
- [ ] Feature flags configured
- [ ] Monitoring and alerts set up
- [ ] Rollback procedure documented
- [ ] Team notified of deployment window
```

**Success Metrics:**
- ✅ All checklist items completed
- ✅ Zero critical issues found
- ✅ Deployment successful
- ✅ No production incidents

---

## 7. Full System Migration (Million-Step Task)

**Situation:** Migrating a massive monolith (500k LOC) to a modern microservices architecture.  
**Philosophy:** Scale through **Massive Decomposition (MDAP)**, not intelligence.

### Phase 1: The MAD Shredding
```markdown
Step 1: Use MASTER_PROTOCOL with MDAP (MAD)
- Instead of "Migrate the app," decompose into 1,000 atomic 50-line PRs.
- Each micro-task must have a local probability of success (p) > 0.999.
- Context: Keep < 2,000 tokens per sub-agent round.
```

### Phase 2: Reliability Guardrails (Red-Flagging)
```markdown
Execution Rule:
- If any reasoning round exceeds 700 tokens without a code change → DISCARD.
- If circular "Wait, maybe..." logic appears → RESET.
- This prevents error correlation across the million steps.
```

### Phase 3: The Ahead-by-1 Verification
```markdown
Verification:
- Every atomic step MUST pass a unit test.
- No step can proceed if the previous one has even a minor lint warning.
```

**Outcome:** By shredding a "Million-Step" task into tiny, zero-error micro-steps, the system achieves the reliability described in the Cognizant AI Lab paper.

---

## 8. Accessibility Overhaul (WCAG AAA)

**Situation:** A public sector application requiring strict WCAG 2.1 Level AAA compliance.

**Timeline:** 1 week  
**Protocols Used:** 4

### Day 1: Advanced Audit
```
Use MASTER_PROTOCOL with FULLARIA
- Run ARIA mastery audit on all complex widgets
- Identify semantic gaps in custom components
- Map focus management flows
- Audit live regions for dynamic updates
```

**Deliverables:**
- ARIA/Accessibility gap analysis report
- Priority list of assistive technology barriers

### Day 2-3: Semantic & ARIA Remediation
```
Step 1: Fix Semantic Structure
- Replace non-semantic <div> buttons with <button>
- Correct heading hierarchy
- Implement proper landmark regions

Step 2: Use MASTER_PROTOCOL with FULLARIA
- Implement complex ARIA patterns (Tabs, Modals, Accordions)
- Add aria-live regions for status updates
- Ensure all interactive elements have accessible names (aria-label/labelledby)
```

### Day 4: Interaction & Visual
```
Step 3: Keyboard & Focus Mastery
- Implement focus trapping for all modals
- Ensure logical roving tabindex for menu systems
- Add "Skip to Content" links
- Verify visible focus indicators meet contrast requirements

Step 4: Use MASTER_PROTOCOL with PERFAUDIT
- Check if accessibility features impact performance
- Verify that large ARIA trees don't slow down screen reader processing
```

### Day 5: Validation & Verification
```
Step 5: Use MASTER_PROTOCOL with A11YCHECK
- Run final WCAG AA/AAA compliance scan
- Manual testing with VoiceOver and NVDA
- Verify 200% and 400% zoom stability

Step 6: Use MASTER_PROTOCOL with FULLSPEC
- Add accessibility regression tests
- Verify that focus returns to triggers after modal close
```

**Success Metrics:**
- ✅ 100% WCAG 2.1 Level AAA compliance
- ✅ 0 keyboard traps
- ✅ Perfect screen reader announcement flow
- ✅ Lighthouse Accessibility score: 100

---

## 💡 Protocol Chaining Tips

**Most Effective Combinations:**

1. **New Feature:** APIDESIGN → ULTRATHINK → ANTI-GENERIC → FULLSPEC → COMPREHENSIVE
2. **Bug Fix:** DEEPDIVE → Fix → FULLSPEC → COMPREHENSIVE
3. **Refactoring:** BIGPAPPA → SAFEREFACTOR → FULLSPEC → COMPREHENSIVE
4. **Security Fix:** SECAUDIT → Fix → FULLSPEC → SECAUDIT (verify)
5. **Performance:** PERFAUDIT → Optimize → PERFAUDIT (verify) → FULLSPEC

---

*These scenarios represent real-world usage patterns. Adapt timelines and protocols based on your specific needs.*
