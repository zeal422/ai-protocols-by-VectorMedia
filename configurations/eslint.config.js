/**
 * Enhanced ESLint Configuration for AI-Protocols MCP Server
 * Version: 2.3.5
 * Flat config compatible with ESLint 9+
 * 
 * Configured with:
 * - TypeScript strict linting
 * - Security best practices
 * - Code quality standards
 * - Type-aware rules
 */
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  // Global ignores
  {
    ignores: [
      'build/**',
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '.eslintrc.js',
      'coverage/**',
      '.next/**',
      'out/**'
    ]
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript recommended + strict
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Type-aware rules configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    }
  },

  // MCP Server specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // === TYPE SAFETY (CRITICAL for MCP Server) ===
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-implicit-any-catch': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/strict-boolean-expressions': ['error', {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false
      }],

      // === EXPLICIT RETURNS ===
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-implicit-returns': 'error',

      // === UNUSED CODE ===
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-unused-expressions': 'error',

      // === NULL/UNDEFINED SAFETY ===
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/strict-null-checks': 'off', // Handled by tsconfig
      '@typescript-eslint/no-unnecessary-condition': 'error',

      // === ASYNC/AWAIT ===
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',

      // === NAMING & CONSISTENCY ===
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      }, {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      }, {
        selector: 'typeLike',
        format: ['PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow'
      }, {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }],

      // === CODE QUALITY ===
      '@typescript-eslint/no-empty-interface': ['error', {
        allowSingleExtends: true
      }],
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/prefer-const': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // === COMMENTS & DOCUMENTATION ===
      'no-warning-comments': ['warn', { terms: ['TODO', 'FIXME', 'XXX', 'HACK'] }],

      // === SECURITY ===
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      '@typescript-eslint/no-require-imports': 'error',

      // === CODE STYLE ===
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-console': ['warn', {
        allow: ['warn', 'error', 'info']
      }],

      // === STYLISTIC (Auto-fixable) ===
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'arrow-spacing': 'error'
    }
  },

  // Exclude test files from certain rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off'
    }
  }
);
