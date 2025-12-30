---
id: aria-accessibility-protocol
version: 2.3.5
triggers:
  - FULLARIA
category: Accessibility
tags:
  - aria
  - screen-reader
  - accessibility
  - wcag-aaa
difficulty: advanced
timeEstimate: "2-3 hours"
prerequisites: []
worksWellWith: []
platformTags:
  - frontend
stackSpecific:
  node: true
  javascript: true
  typescript: true
---

# ARIA ACCESSIBILITY PROTOCOL (CONDENSED)

**MISSION:** Make web apps accessible to all users, including those using assistive technologies.

## CORE PRINCIPLES

### POUR Framework:
- **Perceivable:** Users can perceive all information
- **Operable:** Users can operate the interface (keyboard, assistive tech)
- **Understandable:** Content and operation are clear
- **Robust:** Works with current and future assistive technologies

### Golden Rules:
1. **Semantic HTML First** - Use native elements before ARIA
2. **ARIA is a Polyfill** - Only use when HTML is insufficient
3. **No ARIA > Bad ARIA** - Incorrect ARIA is worse than none
4. **Keyboard Navigation Mandatory** - Every interactive element must be keyboard accessible
5. **Focus Management Critical** - Users must always know location

### Anti-Patterns (NEVER):
❌ `<div role="button">` when `<button>` exists
❌ `role="button"` on `<button>` (redundant)
❌ `aria-hidden="true"` on interactive elements or error messages
❌ Keyboard traps (focus gets stuck)
❌ `outline: none` without visible replacement
❌ Missing alt text on informative images
❌ Forms without labels

## FULLARIA COMMAND

**TRIGGER:** User says "FULLARIA" or requests accessibility audit

### Phase 1: AUDIT (Identify Issues)
```yaml
Categories:
  keyboard: Can all actions be performed via keyboard? Focus order logical? Traps? Visible indicators?
  screen_reader: Alt text? Form labels? Dynamic changes announced? Clear structure?
  aria: Roles correct? States updated? Properties complete? Live regions configured?
  visual: Contrast 4.5:1 (normal), 3:1 (large, UI)? Text resizable 200%? Color alone not used?
  structure: Headings hierarchical? Landmarks used? Lists/tables semantic?
```

### Phase 2: PRIORITIZATION
```yaml
Severity:
  BLOCKER: Prevents core functionality (form submission impossible, keyboard trap) - WCAG A
  CRITICAL: Major barrier (missing labels, no alt text, poor contrast) - WCAG A
  MAJOR: Significant difficulty (illogical focus, missing states, bad link text) - WCAG AA
  MINOR: Suboptimal but not blocking (missing landmarks, redundant ARIA) - WCAG AAA
```

### Phase 3: REMEDIATION
```yaml
Strategy:
  1. Use semantic HTML (prefer <button> over <div role="button">)
  2. Add ARIA only when needed (aria-expanded, aria-selected)
  3. Ensure keyboard support (Enter/Space on custom controls)
  4. Manage focus (move to dialog, trap in modal, return on close)
  5. Announce changes (aria-live for dynamic content)
```

### Phase 4: VALIDATION
```yaml
Testing:
  automated: axe DevTools, WAVE, Lighthouse (~30-40% coverage)
  keyboard: Unplug mouse, Tab/Shift+Tab, Enter/Space, Escape
  screen_reader: NVDA (Windows), VoiceOver (Mac), JAWS, TalkBack
  manual: Contrast ratios, zoom 200%, heading hierarchy
```

### Phase 5: DOCUMENTATION
Report: WCAG level achieved, fixes applied, remaining issues, testing methodology

## ESSENTIAL ARIA

### Key Roles:
```yaml
Landmarks:
  banner: <header> - site header (one per page)
  navigation: <nav> - navigation sections
  main: <main> - main content (one per page)
  complementary: <aside> - supporting content
  contentinfo: <footer> - site footer
  search: <form role="search"> - search functionality

Widgets:
  button: <button> preferred, requires Enter/Space
  checkbox: 
    - Native: <input type="checkbox"> (Browser handles Space/checked state automatically)
    - Custom: [role="checkbox"] (Requires aria-checked and Space key handler)
  tab: In tablist, requires aria-selected, arrow key navigation
  tabpanel: Content for tab, requires aria-labelledby
  dialog: Modal/dialog, requires aria-modal, focus trap, Escape to close
  menu: Application menu (not nav), arrow keys, Enter, Escape
  listbox: <select> preferred, arrow keys, Enter
  combobox: Autocomplete, requires aria-expanded, aria-controls
```

### Critical States (Dynamic):
```yaml
aria-expanded: "true|false" - disclosure state (accordions, dropdowns)
aria-selected: "true|false" - selection state (tabs, options)
aria-checked: "true|false|mixed" - checkbox/switch state (Custom only)
aria-pressed: "true|false|mixed" - toggle button state
aria-hidden: "true|false" - removes from accessibility tree (⚠️ use carefully)
aria-invalid: "true|false" - validation error state
aria-disabled: "true|false" - disabled state (prefer HTML disabled)
```

### Critical Properties (Static):
```yaml
aria-label: Provides accessible name (overrides visible text)
aria-labelledby: References element(s) for label (space-separated IDs)
aria-describedby: References description elements (help text, errors)
aria-controls: References controlled elements
aria-live: "off|polite|assertive" - announces dynamic changes
aria-atomic: "true|false" - announce entire region or just changes
aria-modal: "true" - dialog is modal
```

## COMMON PATTERNS

### Modal Dialog:
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="title" hidden={!isOpen}>
  <h2 id="title">Dialog Title</h2>
  <p>Content</p>
  <button onClick={onClose}>Close</button>
</div>

// Requirements: Focus moves in, trapped inside, Escape closes, focus returns
```

### Tabs:
```jsx
<div role="tablist">
  <button id="tab1" role="tab" aria-selected="true" aria-controls="panel1" tabindex="0">Tab 1</button>
  <button id="tab2" role="tab" aria-selected="false" aria-controls="panel2" tabindex="-1">Tab 2</button>
</div>
<div role="tabpanel" id="panel1" aria-labelledby="tab1">Content 1</div>
<div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>Content 2</div>

// Requirements: Arrow keys navigate, only one tab focusable (roving tabindex)
```

### Accordion:
```jsx
<h3>
  <button id="btn1" aria-expanded="false" aria-controls="section1">Section 1</button>
</h3>
<div id="section1" role="region" aria-labelledby="btn1" hidden>Content</div>

// Requirements: Enter/Space toggles, aria-expanded reflects state
```

### Live Regions:
```jsx
<div aria-live="polite" aria-atomic="true" className="sr-only"></div>

// Announce: liveRegion.textContent = "Item added to cart"
// polite: announce when idle, assertive: interrupt immediately
```

## KEYBOARD INTERACTIONS

```yaml
Standard Keys:
  Tab: Next focusable element
  Shift+Tab: Previous focusable element
  Enter: Activate links/buttons/submit
  Space: Activate buttons/checkboxes/toggles
  Escape: Close modals/menus/popups
  Arrow Keys: Navigate within widgets (tabs, menus, listboxes)
  Home/End: Jump to first/last item

Focus Management:
  - Focus must always be visible
  - Focus order must be logical (top-to-bottom, left-to-right)
  - Modals trap focus (Tab cycles within)
  - Focus returns to trigger after closing overlays
```

## SEMANTIC HTML > ARIA

```yaml
Prefer Native HTML:
  ✅ <button> not <div role="button">
  ✅ <a href> not <span role="link">
  ✅ <input> not custom ARIA widget
  ✅ <h1>-<h6> not <div role="heading">
  ✅ <ul><li> not <div role="list">
  ✅ <table> not CSS Grid with ARIA

Use ARIA When:
  - Custom widgets (tabs, accordions)
  - Dynamic content announcements
  - Enhanced semantics (aria-current)
  - State communication (aria-expanded)
```

## TESTING CHECKLIST

### Automated (~30-40% coverage):
- axe DevTools (browser extension)
- WAVE (web accessibility tool)
- Lighthouse (Chrome DevTools)

### Manual (Essential):
**Keyboard Only:**
1. Unplug mouse
2. Tab through entire interface
3. Verify all interactive elements reachable
4. Test with Enter/Space/Escape/Arrows
5. Check focus indicators visible

**Screen Reader:**
- NVDA (Windows, free): nvaccess.org
- VoiceOver (Mac, built-in): Cmd+F5
- Test: Navigate, verify announcements, check landmarks

**Visual:**
- Zoom to 200% (no layout break)
- Contrast: 4.5:1 normal text, 3:1 large/UI
- Color not sole indicator

## COMMON MISTAKES & FIXES

### 1. Redundant ARIA
❌ `<button role="button">Click</button>`
✅ `<button>Click</button>`

### 2. Hiding Interactive Content
❌ `<button aria-hidden="true">Submit</button>`
✅ Use `.sr-only` class for visually hidden but accessible

### 3. Inaccessible Custom Controls
❌ `<div onClick={toggle}>Toggle</div>`
✅ `<button role="switch" aria-checked={enabled} onClick={toggle}>Toggle</button>`

### 4. Missing Form Labels
❌ `<input placeholder="Name" />`
✅ `<label for="name">Name:</label><input id="name" />`

### 5. No Dynamic Announcements
❌ `setItems([...items, newItem])` (silent update)
✅ Add aria-live region: `liveRegion.textContent = "Item added"`

## REACT-SPECIFIC

```jsx
// Use htmlFor, className, tabIndex (camelCase)
<label htmlFor="input">Label</label>

// Focus management with refs
const dialogRef = useRef(null);
useEffect(() => {
  if (isOpen) dialogRef.current?.querySelector('button')?.focus();
}, [isOpen]);

// Generate IDs with useId (React 18+)
const id = useId();
<label htmlFor={id}>Label</label>
<input id={id} />
```

## RESPONSE FORMAT

```
♿ ACCESSIBILITY AUDIT COMPLETE

📊 Score: 68/100 → 94/100 (After Fixes)
WCAG: Level A (Partial) → Level AA (Full) ✓

🚨 BLOCKER (12 fixed):
Issue #1: Form submission impossible via keyboard
📍 ContactForm.tsx:L45
❌ <div onClick={submit}>Submit</div>
✅ <button type="submit">Submit</button>

⚠️ MAJOR (23 fixed):
Issue #13: Missing form labels
📍 LoginForm.tsx:L34
❌ <input placeholder="Email" />
✅ <label for="email">Email:</label><input id="email" />

ℹ️ MINOR (15 fixed):
[List minor issues...]

📋 VERIFICATION:
1. npm run test:a11y (0 violations expected)
2. Keyboard test (unplug mouse, Tab through)
3. Screen reader test (NVDA/VoiceOver)
4. Lighthouse audit (100 score expected)
```

## SUCCESS CRITERIA

Truly accessible app:
1. ✅ WCAG 2.1 Level AA compliance
2. ✅ Fully keyboard operable
3. ✅ Screen reader compatible
4. ✅ Color contrast compliant (4.5:1 / 3:1)
5. ✅ Tested with real assistive tech
6. ✅ Accessible in all states (loading, error, success)

**Remember:** Accessibility is not optional—it's a legal requirement and improves UX for everyone.

---

*Last Updated: 2025-12-29*  
*Protocol version: 2.3.5*

