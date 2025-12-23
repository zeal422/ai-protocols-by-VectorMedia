# React + TypeScript Example

Production-ready React application demonstrating ai-protocols.

## 🎯 What This Demonstrates

This example showcases proper implementation of multiple protocols:

- **ULTRATHINK**: Deep reasoning for UX, component design, and architecture
- **A11YCHECK**: WCAG 2.1 AA compliant accessibility features
- **PERFAUDIT**: Performance optimization (debouncing, lazy loading, memoization)
- **FULLSPEC**: Comprehensive test coverage with Vitest
- **COMPREHENSIVE**: Clean, maintainable component architecture

## 📦 Features

- ✅ Accessible components with ARIA labels and keyboard navigation
- ✅ Custom hooks (useAuth, useDebounce) for reusability
- ✅ Error boundary for graceful error handling
- ✅ Performance optimizations (React.memo, lazy loading patterns)
- ✅ Comprehensive test suite (Vitest + Testing Library)
- ✅ TypeScript with strict mode
- ✅ Responsive design patterns

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
# App starts on http://localhost:5173
```

### 3. Run Tests
```bash
# All tests
npm test

# With UI
npm run test:ui

# With coverage
npm run test:coverage

# Watch mode (default)
npm test
```

### 4. Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── main.tsx                # Entry point with A11y monitoring
├── App.tsx                 # Main app with routing
├── index.css               # Global styles (performance-optimized)
├── components/
│   ├── ErrorBoundary.tsx   # Error handling (Debug protocol)
│   ├── UserProfile.tsx     # Accessible profile component
│   └── SearchBar.tsx       # Debounced search with A11y
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   └── useDebounce.ts      # Performance optimization hook
├── types/
│   └── user.ts             # TypeScript definitions
├── utils/
│   └── validation.ts       # Input validation
└── test/
    └── setup.ts            # Test configuration

tests/
├── components/
│   ├── UserProfile.test.tsx
│   └── SearchBar.test.tsx
└── hooks/
    └── useAuth.test.ts
```

## 🎨 Components

### UserProfile
Accessible user profile component with inline editing:

**Features:**
- Edit mode with validation
- Accessible form inputs with ARIA labels
- Error messages announced to screen readers
- Keyboard navigation support
- Loading states

**Protocol Compliance:**
- ✅ A11YCHECK: All inputs labeled, errors announced
- ✅ ULTRATHINK: Thoughtful UX for editing flow
- ✅ FULLSPEC: Comprehensive test coverage

```tsx
<UserProfile 
  user={user} 
  onUpdate={async (updates) => {
    // Update user profile
  }} 
/>
```

### SearchBar
Debounced search input with accessibility:

**Features:**
- Debounced input (300ms default)
- Clear button for easy reset
- Live region for screen readers
- Keyboard accessible

**Protocol Compliance:**
- ✅ PERFAUDIT: Debouncing prevents excessive API calls
- ✅ A11YCHECK: role="search", aria-live regions
- ✅ FULLSPEC: All interactions tested

```tsx
<SearchBar 
  onSearch={(query) => console.log(query)} 
  placeholder="Search users..."
  debounceMs={300}
/>
```

### ErrorBoundary
Catches React errors gracefully:

**Features:**
- User-friendly error message
- Reload button
- Development mode shows error details
- Logs to error reporting service

**Protocol Compliance:**
- ✅ DEBUG: Proper error logging
- ✅ ULTRATHINK: Graceful degradation

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 🪝 Custom Hooks

### useAuth
Authentication state management:

```tsx
const { user, isLoading, login, logout } = useAuth();

// Login
await login('user@example.com', 'password');

// Logout
logout();

// Check auth status
if (user) {
  // User is authenticated
}
```

### useDebounce
Performance optimization for expensive operations:

```tsx
const [query, setQuery] = useState('');

// Debounce callback
useDebounce(() => {
  // This runs 300ms after user stops typing
  fetchResults(query);
}, 300, [query]);
```

## 🧪 Running Tests

```bash
# Interactive watch mode
npm test

# Run once with coverage
npm run test:coverage

# Visual test UI
npm run test:ui
```

**Test Coverage Goals:**
- Components: 80%+
- Hooks: 80%+
- Utils: 70%+

**What's Tested:**
- Component rendering
- User interactions (clicks, typing, form submission)
- Accessibility features (ARIA, keyboard navigation)
- Validation logic
- Error handling

## ♿ Accessibility Features (A11YCHECK Protocol)

### Keyboard Navigation
- ✅ Tab order is logical
- ✅ Focus indicators visible
- ✅ Escape to cancel editing
- ✅ Enter to submit forms

### Screen Reader Support
- ✅ ARIA labels on all interactive elements
- ✅ Form errors announced (aria-describedby)
- ✅ Live regions for dynamic content (aria-live)
- ✅ Role attributes (search, alert, status)

### Color & Contrast
- ✅ WCAG AA contrast ratios met
- ✅ Focus indicators meet contrast requirements
- ✅ No information conveyed by color alone

### Motion & Animation
- ✅ Respects prefers-reduced-motion
- ✅ Animations optional, not required for functionality

### Testing
Development mode includes @axe-core/react for automatic A11y monitoring:
```typescript
// In main.tsx
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

## ⚡ Performance Optimizations (PERFAUDIT Protocol)

### Code Splitting
- Routes can be split with React.lazy()
- Components load on-demand

### Debouncing
- Search inputs debounced to reduce API calls
- Custom useDebounce hook for reusability

### Memoization
- Components wrapped in React.memo where appropriate
- useMemo for expensive calculations
- useCallback for stable function references

### CSS Optimization
- System fonts (no external font loading)
- Minimal CSS, no unused styles
- CSS variables for theming

### Bundle Size
- Vite for optimized builds
- Tree-shaking enabled
- Minimal dependencies

## 📊 Protocol Compliance

### ✅ ULTRATHINK (Deep Reasoning)
- User-centric component design
- Thoughtful error states
- Progressive enhancement
- Accessible by default

### ✅ A11YCHECK (Accessibility)
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus management

### ✅ PERFAUDIT (Performance)
- Debounced inputs
- Optimized re-renders
- Fast initial load
- Responsive design

### ✅ FULLSPEC (Testing)
- 80%+ code coverage
- Component tests
- Integration tests
- Accessibility tests

### ✅ COMPREHENSIVE (Code Quality)
- TypeScript strict mode
- No `any` types
- Consistent patterns
- Well-documented code

## 🚀 Deployment

### Build
```bash
npm run build
# Output: dist/ folder
```

### Preview
```bash
npm run preview
# Preview production build locally
```

### Environment Variables
Create `.env` for environment-specific config:
```bash
VITE_API_URL=https://api.example.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Hosting Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Use `vite-plugin-pages`
- **Static hosting**: Upload `dist/` folder

## 🔧 Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |

## 📚 Learning Resources

- [BRAIN/MASTER_PROTOCOL.md](../../BRAIN/MASTER_PROTOCOL.md) - Main protocol orchestrator
- [ULTRATHINK Protocol](../../BRAIN/moreFRONTend-PROTOCOL.md) - Frontend deep thinking
- [A11YCHECK Protocol](../../BRAIN/accessibility_protocol.md) - Accessibility guidelines
- [PERFAUDIT Protocol](../../BRAIN/performance_protocol.md) - Performance optimization
- [FULLSPEC Protocol](../../BRAIN/test_automation_protocol.md) - Testing strategy

## 💡 Tips for Adapting to Your Project

1. **Add API Integration**: Replace mock data in hooks with actual API calls
2. **Add State Management**: Consider Zustand, Redux, or Context API for complex state
3. **Add Routing**: Extend with React Router for multi-page apps
4. **Add Styling**: Use Tailwind CSS, styled-components, or CSS modules
5. **Add Forms**: Use react-hook-form or Formik for complex forms

## 🐛 Troubleshooting

**Tests failing:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm test
```

**TypeScript errors:**
```bash
# Check TypeScript version
npx tsc --version

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Vite server not starting:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**Accessibility warnings:**
```bash
# Check console in development mode
# @axe-core/react reports issues automatically
```

## 🎯 Next Steps

1. **Explore Components**: Check `src/components/` for examples
2. **Run Tests**: See test patterns in `tests/`
3. **Read Protocols**: Understand ULTRATHINK, A11YCHECK, PERFAUDIT
4. **Customize**: Adapt components to your design system
5. **Deploy**: Build and deploy to your hosting platform

## 📄 License

MIT - Use this as a template for your projects!

---

**This example demonstrates production-ready React code following ai-protocols.**  
Built with: React 18, TypeScript, Vite, Vitest, Testing Library, Accessibility Best Practices
