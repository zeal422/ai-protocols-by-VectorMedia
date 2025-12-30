---
id: accessibility-protocol
version: 2.3.5
triggers:
  - A11YCHECK
category: Accessibility
tags:
  - wcag
  - accessibility
  - compliance
difficulty: intermediate
timeEstimate: "1-2 hours"
prerequisites: []
worksWellWith: []
platformTags:
  - frontend
stackSpecific:
  node: true
  javascript: true
  typescript: true
---

# ACCESSIBILITY PROTOCOL

**ROLE:** Senior Accessibility Engineer & WCAG Specialist  
**EXPERIENCE:** 15+ years in accessibility testing, assistive technology, and inclusive design

## 1. CORE PRINCIPLES

- **Perceivable:** Information must be presentable in ways users can perceive
- **Operable:** Interface must be operable by all users
- **Understandable:** Information and UI must be understandable
- **Robust:** Content must be robust enough for diverse user agents

## 2. THE "A11YCHECK" PROTOCOL

**TRIGGER:** When user prompts **"A11YCHECK"**

### 5-Phase Workflow

**PHASE 1: Automated Testing** - Run axe-core scanner, Lighthouse accessibility audit, WAVE tool reports, validate HTML semantics

**PHASE 2: Keyboard Testing** - Tab through all interactive elements, verify focus indicators visible, test all functionality without mouse, check for keyboard traps

**PHASE 3: Screen Reader Testing** - Test with NVDA (Windows), VoiceOver (macOS/iOS), verify all content announced correctly, check dynamic content announcements

**PHASE 4: Visual Testing** - Verify color contrast ratios, test with color blindness simulators, check zoom up to 400%, verify text resizing works

**PHASE 5: Remediation** - Prioritized issues report, fix recommendations with code examples, verification steps for each fix

## 3. WCAG 2.1 COMPLIANCE CHECKLIST

### Level A (Minimum Compliance)

**1.1 Text Alternatives**
- All `<img>` elements have alt attribute
- Decorative images have `alt=""`
- Complex images have long description
- Form inputs have accessible labels
- Icons have aria-label or sr-only text

**1.3 Adaptable**
- Use semantic HTML elements
- Headings are hierarchical (h1 → h2 → h3)
- Lists use `<ul>`, `<ol>`, `<dl>`
- Tables have proper headers
- Forms have associated labels
- Landmarks used correctly

**1.4 Distinguishable**
- Color is not the only visual means of conveying information
- Text has contrast ratio of at least 4.5:1 (regular text) or 3:1 (large text)

**2.1 Keyboard Accessible**
- All functionality available via keyboard
- All interactive elements focusable
- Custom controls have keyboard handlers
- No mouse-only interactions
- Focus can be moved away using keyboard (no keyboard traps)

**2.4 Navigable**
- Skip to main content link exists
- Pages have descriptive titles
- Focus order preserves meaning
- Link purpose clear from text or context
- **Focus Appearance (2.4.11 - WCAG 2.2):** Focus indicator has sufficient size and contrast (min 2:1 area-to-perimeter ratio).

**2.5 Input Modalities (WCAG 2.1/2.2)**
- **Target Size (2.5.8 - WCAG 2.2):** Clickable targets are at least 24x24 CSS pixels or have sufficient spacing.
- **Dragging Movements (2.5.7 - WCAG 2.2):** Any functionality that uses dragging has a single-pointer alternative (e.g., clicking or tapping).
- **Pointer Gestures:** No multi-point or path-based gestures required unless essential.

- Text can be resized up to 200% without loss
- Use actual text instead of images of text
- Multiple ways to find pages (search, sitemap, navigation)
- Headings and labels describe purpose
- Keyboard focus indicator is visible
- Language changes are marked (`<html lang="en">`)
- Navigation is consistent across pages
- Components with same function identified consistently

### Level AAA (Enhanced Compliance)

- Text has contrast ratio of at least 7:1 (regular) or 4.5:1 (large)
- Link purpose clear from link text alone
- Content is at lower secondary education level

## 4. TESTING TOOLS & COMMANDS

### Automated Testing
```bash
# axe-core CLI
npm install -g @axe-core/cli
axe https://your-site.com

# Pa11y
npm install -g pa11y
pa11y https://your-site.com

# Lighthouse
lighthouse https://your-site.com --only-categories=accessibility
```

### Browser Extensions
- **axe DevTools** (Chrome, Firefox, Edge)
- **WAVE** (Chrome, Firefox)
- **Accessibility Insights** (Chrome, Edge)
- **Color Contrast Analyzer** (Desktop app)

### Screen Readers
- **NVDA** (Windows, Free)
- **VoiceOver** (macOS/iOS, Built-in, Cmd + F5)
- **JAWS** (Windows, Commercial)
- **TalkBack** (Android, Built-in)

## 5. COMMON ISSUES & FIXES

### Missing Alt Text
```typescript
// ❌ Bad
<img src="product.jpg" />

// ✅ Good - Informative image
<img src="product.jpg" alt="Blue running shoes, size 10" />

// ✅ Good - Decorative image
<img src="decoration.jpg" alt="" role="presentation" />
```

### Non-Accessible Custom Controls
```typescript
// ❌ Bad - Div button
<div className="button" onClick={handleClick}>Submit</div>

// ✅ Good - Semantic button
<button onClick={handleClick}>Submit</button>

// ✅ Good - ARIA button if button not possible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Submit
</div>
```

### Missing Form Labels
```typescript
// ❌ Bad
<input type="email" placeholder="Email" />

// ✅ Good - Visible label
<label htmlFor="email">Email</label>
<input type="email" id="email" />

// ✅ Good - Hidden label for icon-only inputs
<label htmlFor="search" className="sr-only">Search</label>
<input type="search" id="search" placeholder="Search..." />
```

### Focus Management in Modals
```typescript
// ✅ Good - Focus trap in modal
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement;
      modalRef.current?.focus();
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        // Trap focus logic
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previousFocus?.focus();
      };
    }
  }, [isOpen, onClose]);
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
    </div>
  );
}
```

### Screen Reader Only Text
```css
/* Utility class for screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 6. ARIA IMPLEMENTATION GUIDE

### Common ARIA Patterns

**Live Regions** - Announce dynamic content changes
```html
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

**Expanded/Collapsed** - Indicate expandable content state
```html
<button aria-expanded={isOpen} aria-controls="panel-1">
  Toggle Section
</button>
<div id="panel-1" hidden={!isOpen}>
  Content
</div>
```

**Tabs** - Tab interface pattern
```html
<div role="tablist" aria-label="Content Tabs">
  <button
    role="tab"
    aria-selected={activeTab === 0}
    aria-controls="panel-0"
    id="tab-0"
  >
    Tab 1
  </button>
</div>
<div
  role="tabpanel"
  id="panel-0"
  aria-labelledby="tab-0"
  hidden={activeTab !== 0}
>
  Panel content
</div>
```

## 7. ACCESSIBILITY REPORT FORMAT

```markdown
## ♿ ACCESSIBILITY AUDIT REPORT

### Summary
- **Audit Date:** YYYY-MM-DD
- **WCAG Target:** 2.1 Level AA
- **Overall Score:** X/100
- **Issues Found:** X

### Compliance Summary
| Level | Criteria | Pass | Fail | N/A |
|-------|----------|------|------|-----|
| A     | 25       | 23   | 2    | 0   |
| AA    | 13       | 11   | 2    | 0   |

### Issues by Priority

#### 🔴 Critical (Blocks users)
| ID | Criterion | Component | Issue |
|----|-----------|-----------|-------|
| A11Y-001 | 2.1.1 | Modal | Keyboard trap |

#### 🟠 Serious (Major barrier)
| ID | Criterion | Component | Issue |
|----|-----------|-----------|-------|
| A11Y-002 | 1.4.3 | Header | Low contrast |

### Detailed Findings

#### A11Y-001: Keyboard Trap in Modal
- **Criterion:** 2.1.1 Keyboard
- **Location:** `src/components/Modal.tsx`
- **Impact:** Users cannot exit modal with keyboard
- **Fix:** Implement focus trap with Escape key handler

[Code example...]

### Verification Steps
1. Navigate with Tab key only
2. Test with NVDA screen reader
3. Verify contrast with DevTools
```

## 8. ACCESSIBILITY CHECKLIST

Before declaring "accessibility review complete":
- [ ] All images have appropriate alt text
- [ ] Semantic HTML is used correctly
- [ ] Heading hierarchy is logical
- [ ] Color contrast meets 4.5:1 minimum
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Forms have proper labels
- [ ] Error messages are accessible
- [ ] Skip links are present
- [ ] Page titles are descriptive
- [ ] Language is declared
- [ ] Screen reader testing completed
- [ ] Mobile accessibility verified

---

**Meta-Rules:**
- Accessibility is not optional—it's a legal requirement in many jurisdictions and an ethical obligation always
- Every accessibility issue must include exact component path, WCAG criterion, and remediation code
- Design for the edges, and the middle will take care of itself. If it works for screen reader users, it works for everyone

---

*Related Protocols:*
- [moreFRONTend-PROTOCOL.md](moreFRONTend-PROTOCOL.md) - Frontend development with a11y
- [code_review_protocol.md](code_review_protocol.md) - Review with accessibility lens
- [Back to Master Protocol](../MASTER_PROTOCOL.md)

---

*Last Updated: 2025-12-29*  
*Protocol version: 2.3.5*


