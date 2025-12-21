---
protocol_version: "1.0.0"
last_updated: "2025-12-22"
status: "stable"
requires: ["MASTER_PROTOCOL.md"]
---

# ACCESSIBILITY PROTOCOL

**ROLE:** Senior Accessibility Engineer & WCAG Specialist.
**EXPERIENCE:** 15+ years in accessibility testing, assistive technology, and inclusive design.

## 1. CORE PRINCIPLES

- **Perceivable:** Information must be presentable in ways users can perceive
- **Operable:** Interface must be operable by all users
- **Understandable:** Information and UI must be understandable
- **Robust:** Content must be robust enough for diverse user agents

## 2. THE "A11YCHECK" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When the user prompts **"A11YCHECK"**:

### PHASE 1: AUTOMATED TESTING
- Run axe-core accessibility scanner
- Run Lighthouse accessibility audit
- Check WAVE tool reports
- Validate HTML semantics

### PHASE 2: KEYBOARD TESTING
- Tab through all interactive elements
- Verify focus indicators are visible
- Test all functionality without mouse
- Check for keyboard traps

### PHASE 3: SCREEN READER TESTING
- Test with NVDA (Windows)
- Test with VoiceOver (macOS/iOS)
- Verify all content is announced correctly
- Check dynamic content announcements

### PHASE 4: VISUAL TESTING
- Verify color contrast ratios
- Test with color blindness simulators
- Check zoom up to 400%
- Verify text resizing works

### PHASE 5: REMEDIATION
- Prioritized issues report
- Fix recommendations with code examples
- Verification steps for each fix

---

## 3. WCAG 2.1 COMPLIANCE CHECKLIST

### Level A (Minimum Compliance)

#### 1.1 Text Alternatives

```yaml
1.1.1_non_text_content:
  requirement: "All non-text content has text alternative"
  checks:
    - "All <img> elements have alt attribute"
    - "Decorative images have alt=''"
    - "Complex images have long description"
    - "Form inputs have accessible labels"
    - "Icons have aria-label or sr-only text"
  
  code_examples:
    good: |
      <img src="logo.png" alt="Company Name Logo">
      <img src="decoration.png" alt="" role="presentation">
      <button aria-label="Close modal">
        <svg>...</svg>
      </button>
    
    bad: |
      <img src="logo.png">
      <button>
        <svg>...</svg>
      </button>
```

#### 1.3 Adaptable

```yaml
1.3.1_info_and_relationships:
  requirement: "Information and relationships are programmatically determinable"
  checks:
    - "Use semantic HTML elements"
    - "Headings are hierarchical (h1 → h2 → h3)"
    - "Lists use <ul>, <ol>, <dl>"
    - "Tables have proper headers"
    - "Forms have associated labels"
    - "Landmarks used correctly"
  
  code_examples:
    good: |
      <header role="banner">
        <nav role="navigation" aria-label="Main">
          <ul>
            <li><a href="/">Home</a></li>
          </ul>
        </nav>
      </header>
      <main role="main">
        <h1>Page Title</h1>
        <section aria-labelledby="section-heading">
          <h2 id="section-heading">Section</h2>
        </section>
      </main>
    
    bad: |
      <div class="header">
        <div class="nav">
          <div class="nav-item">Home</div>
        </div>
      </div>
      <div class="main">
        <div class="title">Page Title</div>
      </div>

1.3.2_meaningful_sequence:
  requirement: "Content order is meaningful when linearized"
  checks:
    - "DOM order matches visual order"
    - "CSS doesn't create confusing order"
    - "Flexbox/Grid order property used carefully"

1.3.3_sensory_characteristics:
  requirement: "Instructions don't rely solely on shape, size, position, or sound"
  checks:
    - "No 'click the red button' without other identifier"
    - "No 'see the sidebar on the right' only"
```

#### 1.4 Distinguishable

```yaml
1.4.1_use_of_color:
  requirement: "Color is not the only visual means of conveying information"
  checks:
    - "Error states have icons, not just red color"
    - "Links distinguishable by more than color"
    - "Charts have patterns, not just colors"
  
  code_examples:
    good: |
      <span class="error">
        <svg aria-hidden="true">⚠️</svg>
        Error: Invalid email
      </span>
    
    bad: |
      <span style="color: red;">Invalid email</span>

1.4.3_contrast_minimum:
  requirement: "Text has contrast ratio of at least 4.5:1"
  checks:
    - "Regular text: 4.5:1 minimum"
    - "Large text (18px+ or 14px+ bold): 3:1 minimum"
    - "Use contrast checker tools"
  tools:
    - "WebAIM Contrast Checker"
    - "Chrome DevTools Color Picker"
    - "axe DevTools"
```

#### 2.1 Keyboard Accessible

```yaml
2.1.1_keyboard:
  requirement: "All functionality available via keyboard"
  checks:
    - "All interactive elements focusable"
    - "Custom controls have keyboard handlers"
    - "No mouse-only interactions"
  
  code_examples:
    good: |
      <button
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        Action
      </button>
    
    bad: |
      <div onClick={handleClick}>Action</div>

2.1.2_no_keyboard_trap:
  requirement: "Focus can be moved away using keyboard"
  checks:
    - "Modal focus is trapped correctly"
    - "User can exit any component with keyboard"
    - "Escape key closes modals/dropdowns"
```

#### 2.4 Navigable

```yaml
2.4.1_bypass_blocks:
  requirement: "Mechanism to bypass repeated content"
  checks:
    - "Skip to main content link exists"
    - "Proper landmark regions"
  
  code_examples:
    good: |
      <a href="#main" class="skip-link">
        Skip to main content
      </a>
      
      <style>
      .skip-link {
        position: absolute;
        left: -999px;
      }
      .skip-link:focus {
        left: 0;
        top: 0;
        z-index: 999;
      }
      </style>

2.4.2_page_titled:
  requirement: "Pages have descriptive titles"
  checks:
    - "<title> element is unique and descriptive"
    - "Title describes page purpose"

2.4.3_focus_order:
  requirement: "Focus order preserves meaning and operability"
  checks:
    - "Tab order is logical"
    - "No unexpected focus jumps"
    - "Modals manage focus correctly"

2.4.4_link_purpose:
  requirement: "Link purpose clear from text or context"
  checks:
    - "No 'click here' or 'read more' alone"
    - "Link text describes destination"
```

### Level AA (Recommended Compliance)

```yaml
1.4.4_resize_text:
  requirement: "Text can be resized up to 200% without loss"
  checks:
    - "Use relative units (rem, em)"
    - "No horizontal scroll at 200% zoom"
    - "Content remains readable"

1.4.5_images_of_text:
  requirement: "Use actual text instead of images of text"
  checks:
    - "Logos are the only exception"
    - "Text is not embedded in images"

2.4.5_multiple_ways:
  requirement: "Multiple ways to find pages"
  checks:
    - "Site has search and/or sitemap"
    - "Navigation menu available"

2.4.6_headings_and_labels:
  requirement: "Headings and labels describe purpose"
  checks:
    - "Headings are descriptive"
    - "Form labels clearly indicate input"

2.4.7_focus_visible:
  requirement: "Keyboard focus indicator is visible"
  checks:
    - "Focus outline is visible"
    - "Focus indicator is not removed with CSS"
  
  code_examples:
    good: |
      :focus {
        outline: 2px solid #005fcc;
        outline-offset: 2px;
      }
      
      :focus-visible {
        outline: 2px solid #005fcc;
      }
    
    bad: |
      :focus {
        outline: none;
      }

3.1.2_language_of_parts:
  requirement: "Language changes are marked"
  checks:
    - "<html lang='en'> set correctly"
    - "Foreign text has lang attribute"
  
  code_examples:
    good: |
      <html lang="en">
        <p>Welcome to our site.</p>
        <p lang="es">Bienvenidos a nuestro sitio.</p>
      </html>

3.2.3_consistent_navigation:
  requirement: "Navigation is consistent across pages"
  checks:
    - "Nav items in same order on all pages"
    - "Same components behave consistently"

3.2.4_consistent_identification:
  requirement: "Components with same function identified consistently"
  checks:
    - "Search button always labeled 'Search'"
    - "Icons have consistent meaning"
```

### Level AAA (Enhanced Compliance)

```yaml
1.4.6_contrast_enhanced:
  requirement: "Text has contrast ratio of at least 7:1"
  checks:
    - "Regular text: 7:1 minimum"
    - "Large text: 4.5:1 minimum"

2.4.9_link_purpose_link_only:
  requirement: "Link purpose clear from link text alone"
  checks:
    - "All links are self-descriptive"
    - "No reliance on surrounding context"

3.1.5_reading_level:
  requirement: "Content is at lower secondary education level"
  checks:
    - "Use plain language"
    - "Provide definitions for complex terms"
```

---

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

```yaml
recommended_tools:
  - name: "axe DevTools"
    platform: "Chrome, Firefox, Edge"
    url: "https://www.deque.com/axe/"
    
  - name: "WAVE"
    platform: "Chrome, Firefox"
    url: "https://wave.webaim.org/"
    
  - name: "Accessibility Insights"
    platform: "Chrome, Edge"
    url: "https://accessibilityinsights.io/"
    
  - name: "Color Contrast Analyzer"
    platform: "Desktop app"
    url: "https://developer.paciellogroup.com/color-contrast-checker/"
```

### Screen Reader Testing

```yaml
screen_readers:
  - name: "NVDA"
    platform: "Windows"
    cost: "Free"
    url: "https://www.nvaccess.org/"
    
  - name: "VoiceOver"
    platform: "macOS, iOS"
    cost: "Built-in"
    activation: "Cmd + F5 (macOS)"
    
  - name: "JAWS"
    platform: "Windows"
    cost: "Commercial"
    
  - name: "TalkBack"
    platform: "Android"
    cost: "Built-in"
```

---

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
<div className="button" onClick={handleClick}>
  Submit
</div>

// ✅ Good - Semantic button
<button onClick={handleClick}>
  Submit
</button>

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
      // Save previous focus
      const previousFocus = document.activeElement;
      
      // Focus modal
      modalRef.current?.focus();
      
      // Trap focus
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
        if (e.key === 'Tab') {
          // Trap focus logic
        }
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

---

## 6. ARIA IMPLEMENTATION GUIDE

### Common ARIA Patterns

```yaml
live_regions:
  purpose: "Announce dynamic content changes"
  attributes:
    - aria-live: "polite | assertive"
    - aria-atomic: "true | false"
  
  example: |
    <div aria-live="polite" aria-atomic="true">
      {statusMessage}
    </div>

expanded_collapsed:
  purpose: "Indicate expandable content state"
  example: |
    <button
      aria-expanded={isOpen}
      aria-controls="panel-1"
    >
      Toggle Section
    </button>
    <div id="panel-1" hidden={!isOpen}>
      Content
    </div>

tabs:
  purpose: "Tab interface pattern"
  example: |
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

---

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
| AAA   | 23       | 15   | 3    | 5   |

### Issues by Priority

#### 🔴 Critical (Blocks users)
| ID | Criterion | Component | Issue |
|----|-----------|-----------|-------|
| A11Y-001 | 2.1.1 | Modal | Keyboard trap |

#### 🟠 Serious (Major barrier)
| ID | Criterion | Component | Issue |
|----|-----------|-----------|-------|
| A11Y-002 | 1.4.3 | Header | Low contrast |

#### 🟡 Moderate (Some difficulty)
| ID | Criterion | Component | Issue |
|----|-----------|-----------|-------|
| A11Y-003 | 1.1.1 | Images | Missing alt |

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

---

## 8. ACCESSIBILITY CHECKLIST

Before declaring "accessibility review complete," verify:

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

**META-RULE:** Accessibility is not optional—it's a legal requirement in many jurisdictions and an ethical obligation always.

**LOCATION RULE:** Every accessibility issue must include exact component path, WCAG criterion, and remediation code.

**GOLDEN RULE:** Design for the edges, and the middle will take care of itself. If it works for screen reader users, it works for everyone.

---

*Related Protocols:*
- [frontend_protocol.md](moreFRONTend-PROTOCOL.md) - Frontend development with a11y
- [code_review_protocol.md](code_review_protocol.md) - Review with accessibility lens
- [Back to Master Protocol](MASTER_PROTOCOL.md)
