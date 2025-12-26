# Complete Linting Setup for React + TypeScript + Tailwind CSS

## Overview

Production-ready linting configuration for React applications using TypeScript and Tailwind CSS. Implements proper tool separation, modern linting practices, and seamless developer experience.

## Architecture Principles

### Tool Separation
- **ESLint:** JavaScript/TypeScript code analysis
- **Stylelint:** CSS/SCSS code analysis
- **Prettier:** Code formatting (cross-language)
- **TypeScript:** Type checking (separate pipeline)

### Modern Standards
- ESLint flat config format (ESLint 9+)
- TypeScript ESLint integration
- Tailwind CSS support
- React-specific linting rules

## Installation

```bash
npm install --save-dev \
  eslint @eslint/js globals \
  eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-react-refresh typescript-eslint \
  eslint-plugin-prettier eslint-config-prettier \
  eslint-plugin-jsx-a11y \
  stylelint stylelint-config-standard stylelint-config-recess-order \
  prettier prettier-plugin-tailwindcss
```

## Configuration Files

### 1. ESLint Configuration (`eslint.config.js`)

```javascript
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,mjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }
      ],
      "prettier/prettier": "error",
    },
    settings: { react: { version: "detect" } },
  },
  prettierConfig
);
```

### 2. Stylelint Configuration (`stylelint.config.js`)

```javascript
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind", "apply", "layer", "responsive", "screen", "variants", "keyframes", "font-face"
        ],
      },
    ],
    "alpha-value-notation": null,
    "hue-degree-notation": null,
    "custom-property-empty-line-before": null,
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
  },
  ignoreFiles: ["dist/**", "node_modules/**"],
};
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "type-check": "tsc --noEmit",
    "lint": "npm run type-check && eslint . && stylelint \"src/**/*.{css,scss}\"",
    "lint:css": "stylelint \"src/**/*.{css,scss}\"",
    "lint:js": "eslint .",
    "format": "prettier --write .",
    "preview": "vite preview"
  }
}
```

### 4. Prettier Configuration (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 5. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Why This Setup Works

### React-Specific Features
- **JSX Support:** Proper parsing and linting of JSX syntax
- **React Hooks:** Dedicated rules for hooks patterns and dependencies
- **Component Patterns:** Rules for component structure and best practices
- **Fast Refresh:** Support for React Fast Refresh development

### TypeScript Integration
- **Type Checking:** Separate from linting but integrated in CI pipeline
- **Type-Aware Linting:** ESLint understands TypeScript types
- **Unused Variables:** Smart detection with TypeScript ignore patterns

### Tailwind CSS Support
- **Zero False Positives:** All Tailwind directives recognized
- **CSS-in-JS Compatible:** Works with styled-components, Emotion
- **Modern CSS:** Supports custom properties, CSS Grid, Flexbox

## Usage

### Development Workflow
```bash
npm run dev          # Start development server
npm run lint         # Check for linting issues
npm run format       # Auto-fix formatting issues
npm run type-check   # Type check
npm run build        # Build for production
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run linting
  run: |
    npm install
    npm run type-check
    npm run lint
```

### VS Code Integration

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  }
}
```

**Recommended VS Code extensions:**
- ESLint
- Stylelint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

## Benefits

### Code Quality
- Consistent code style across team
- Early bug detection
- Type safety enforcement
- Performance pattern detection

### Developer Productivity
- Auto-formatting saves time
- IDE integration provides instant feedback
- Clear error messages and suggestions
- Reduced code review friction

### Maintainability
- Prevents technical debt
- Makes code changes safer
- Easier onboarding for new developers
- Future-proof configuration

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **VS Code not recognizing configurations**
   - Restart VS Code
   - Check workspace settings
   - Ensure extensions are installed

3. **Stylelint not recognizing Tailwind**
   - Verify `stylelint.config.js` has correct ignore patterns
   - Check file patterns in package.json scripts

## Maintenance

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

## Conclusion

This linting setup provides a solid foundation for React + TypeScript + Tailwind CSS projects. It's battle-tested, follows industry best practices, and integrates seamlessly with modern development workflows.

The configuration is designed to be:
- **Extensible:** Easy to add new rules or tools
- **Maintainable:** Clear separation of concerns
- **Performant:** Fast linting even on large codebases
- **Universal:** Works across different project types and sizes

---

*Related Protocols:*
- [FRONTandBACKend-PROTOCOL.md](FRONTandBACKend-PROTOCOL.md) - Full-stack development guidance
- [Back to Master Protocol](../MASTER_PROTOCOL.md)

---

*Last Updated: 2025-12-23*  
*Protocol Version: 2.3.2*

