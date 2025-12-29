---
id: accessibility-workflow
name: Accessibility Implementation & Audit
type: workflow
taskType: audit
difficulty: advanced
estimatedTime: "2-3 hours"
description: "Make your application accessible to all users (WCAG 2.1 Level AA minimum, AAA as aspiration)"
protocols:
  - accessibility_protocol
  - aria_accessibility_protocol
  - code_review_protocol
---

# Workflow: Accessibility Implementation & Audit

**Goal:** Ensure application is accessible to users with disabilities (WCAG AAA compliance).

---

## Phase 1: Basic Accessibility Audit
✅ **Protocol:** A11YCHECK (accessibility_protocol)
- **Purpose:** Check WCAG 2.1 Level AA compliance
- **Time:** 1 hour
- **Trigger:** `Use A11YCHECK for accessibility audit`

### Check:
- Color contrast ratios
- Keyboard navigation
- Form labels
- Alt text for images
- Heading hierarchy
- Focus visible
- Error messages clear

### Tools:
- WAVE (browser extension)
- Axe DevTools
- Lighthouse
- Screen reader testing

---

## Phase 2: Advanced Accessibility (Screen Readers)
✅ **Protocol:** FULLARIA (aria_accessibility_protocol)
- **Purpose:** Advanced ARIA and screen reader optimization
- **Time:** 1-2 hours
- **Trigger:** `Use FULLARIA for screen reader optimization`

### Optimize:
- ARIA labels and descriptions
- Live regions for dynamic content
- Landmark regions
- Semantic HTML
- Screen reader testing
- Focus management

### Test with:
- NVDA (free)
- JAWS (commercial)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

---

## Phase 3: Code Review
✅ **Protocol:** COMPREHENSIVE (code_review_protocol)
- **Purpose:** Review accessibility implementations
- **Time:** 30m
- **Trigger:** `Use COMPREHENSIVE for accessibility review`

---

## Accessibility Checklist

Visual:
- [ ] Color contrast ≥ 4.5:1 (AA) or 7:1 (AAA)
- [ ] No color-only information conveyance
- [ ] Text resizable to 200%
- [ ] No seizure-inducing animations (>3/sec)

Navigation:
- [ ] Keyboard navigation complete
- [ ] Focus visible and logical
- [ ] Skip links present
- [ ] No keyboard traps

Content:
- [ ] All images have alt text
- [ ] Headings properly nested (H1-H6)
- [ ] Links have descriptive text
- [ ] Lists marked up correctly
- [ ] Tables have headers

Interaction:
- [ ] Form inputs labeled
- [ ] Error messages clear
- [ ] Instructions understandable
- [ ] Time limits extendable
- [ ] CAPTCHA alternatives

---

## WCAG Compliance Levels

- **Level A** - Basic compliance (minimum)
- **Level AA** - Enhanced compliance (recommended)
- **Level AAA** - Maximum compliance (aspired)

### Target: **WCAG 2.1 Level AA minimum** (Level AAA when possible)

---

## Common Issues to Fix

❌ **Missing Alt Text** - All images need descriptions
❌ **Poor Contrast** - Must be 4.5:1 minimum
❌ **Keyboard Inaccessible** - All features must work with keyboard
❌ **Unlabeled Forms** - All inputs need associated labels
❌ **Dynamic Content** - Use ARIA live regions for updates
❌ **Focus Hidden** - Must always see focus indicator
❌ **Color Only** - Don't convey info with color alone

---

## Testing Tools

- **Automated:** Axe, Lighthouse, Wave
- **Manual:** Keyboard-only navigation
- **Screen Reader:** NVDA, JAWS, VoiceOver
- **Color Contrast:** Contrast Checker
- **Validation:** WCAG validator

