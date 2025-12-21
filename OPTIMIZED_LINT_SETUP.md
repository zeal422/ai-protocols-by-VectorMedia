# Complete Linting Setup for React + TypeScript + Tailwind CSS Projects

## Overview

This comprehensive linting setup provides a production-ready configuration for React applications using TypeScript and Tailwind CSS. It implements proper tool separation, modern linting practices, and seamless developer experience.

## Architecture Principles

### 1. **Tool Separation**

- **ESLint**: JavaScript/TypeScript code analysis
- **Stylelint**: CSS/SCSS code analysis
- **Prettier**: Code formatting (cross-language)
- **TypeScript**: Type checking (separate pipeline)

### 2. **Modern Standards**

- ESLint flat config format (ESLint 9+)
- TypeScript ESLint integration
- Tailwind CSS support
- React-specific linting rules

### 3. **Zero Friction Integration**

- No conflicts between tools
- Consistent formatting across all files
- IDE integration support
- CI/CD ready

## Installation

### 1. Install Dependencies



### 2. Install Tailwind CSS (if not already installed)

```bash
npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest
npm install --save-dev @tailwindcss/typography@latest
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
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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
      "react/no-unknown-property": ["error", { ignore: ["cmdk-input-wrapper"] }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prettier/prettier": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  prettierConfig,
);
```

### 2. Stylelint Configuration (`stylelint.config.js`)

```javascript
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  rules: {
    // Allow Tailwind CSS at-rules
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "responsive",
          "screen",
          "variants",
          "keyframes",
          "font-face",
        ],
      },
    ],
    // Relaxed rules for CSS variables formatting
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

Add these scripts to your `package.json`:

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
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Why This Setup Works for React Projects

### 1. **React-Specific Features**

- **JSX Support**: Proper parsing and linting of JSX syntax
- **React Hooks**: Dedicated rules for hooks patterns and dependencies
- **Component Patterns**: Rules for component structure and best practices
- **Fast Refresh**: Support for React Fast Refresh development

### 2. **TypeScript Integration**

- **Type Checking**: Separate from linting but integrated in CI pipeline
- **Type-Aware Linting**: ESLint understands TypeScript types
- **Unused Variables**: Smart detection with TypeScript ignore patterns

### 3. **Tailwind CSS Support**

- **Zero False Positives**: All Tailwind directives recognized
- **CSS-in-JS Compatible**: Works with styled-components, Emotion
- **Modern CSS**: Supports custom properties, CSS Grid, Flexbox

### 4. **Developer Experience**

- **Auto-formatting**: Prettier handles all formatting consistently
- **IDE Integration**: VS Code extensions work seamlessly
- **Fast Feedback**: Linting runs quickly in development

## Usage

### Development Workflow

```bash
# Start development server
npm run dev

# Check for linting issues
npm run lint

# Auto-fix formatting issues
npm run format

# Type check
npm run type-check

# Build for production
npm run build
```

### CI/CD Integration

Add to your CI pipeline:

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
  },
  "css.validate": true,
  "less.validate": true,
  "scss.validate": true
}
```

Recommended VS Code extensions:

- ESLint
- Stylelint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

## File Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Component.tsx
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── index.css
│   └── App.css
├── .eslintrc.js (or eslint.config.js)
├── .stylelintrc.js (or stylelint.config.js)
├── .prettierrc
├── package.json
└── tsconfig.json
```

## Benefits

### 1. **Code Quality**

- Consistent code style across team
- Early bug detection
- Type safety enforcement
- Performance pattern detection

### 2. **Developer Productivity**

- Auto-formatting saves time
- IDE integration provides instant feedback
- Clear error messages and suggestions
- Reduced code review friction

### 3. **Maintainability**

- Prevents technical debt
- Makes code changes safer
- Easier onboarding for new developers
- Future-proof configuration

### 4. **Production Readiness**

- CI/CD integration
- Zero false positives
- Fast linting performance
- Scalable to large codebases

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

4. **ESLint TypeScript conflicts**
   - Ensure TypeScript is properly configured
   - Check parser options in ESLint config

## Maintenance

### Regular Updates

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

### Custom Rules

Add project-specific rules to configuration files as needed.

## Conclusion

This linting setup provides a solid foundation for React + TypeScript + Tailwind CSS projects. It's battle-tested, follows industry best practices, and integrates seamlessly with modern development workflows.

The configuration is designed to be:

- **Extensible**: Easy to add new rules or tools
- **Maintainable**: Clear separation of concerns
- **Performant**: Fast linting even on large codebases
- **Universal**: Works across different project types and sizes

Use this setup as a starting point and customize according to your project's specific needs.
