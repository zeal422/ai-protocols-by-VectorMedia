# React + TypeScript Example Setup

This example shows how to integrate AI Development Protocols into a React + TypeScript project.

## File Structure

```
your-react-project/
├── .cursorrules              # Cursor IDE rules
├── CLAUDE.md                 # Claude project knowledge
├── eslint.config.js          # ESLint configuration
├── tsconfig.json             # TypeScript config
└── src/
    └── ...
```

## Integration Steps

### 1. Add Protocol References

Copy the following files to your project root:
- `MASTER_PROTOCOL.md`
- `code_review_protocol.md`
- `test_automation_protocol.md`
- `moreFRONTend-PROTOCOL.md`

### 2. Configure Your AI Tool

#### For Cursor IDE

Add to `.cursorrules`:
```markdown
Use the MASTER_PROTOCOL.md for all development tasks.

Key protocols:
- Code reviews: use code_review_protocol.md
- Testing: use test_automation_protocol.md  
- UI development: use moreFRONTend-PROTOCOL.md

Safety rules:
- Never modify authentication logic without explicit permission
- Always follow existing patterns in the codebase
- Add tests for all new code
```

#### For Claude Projects

Add protocols to project knowledge and include in `CLAUDE.md`.

### 3. ESLint Configuration

Use the configuration from `OPTIMIZED_LINT_SETUP.md`:

```bash
npm install --save-dev \
  eslint @eslint/js globals \
  eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-react-refresh typescript-eslint \
  eslint-plugin-prettier eslint-config-prettier \
  eslint-plugin-jsx-a11y \
  prettier prettier-plugin-tailwindcss
```

## Usage Examples

### Request a Code Review

```
Use the MASTER_PROTOCOL to review my UserProfile component.
Apply the COMPREHENSIVE flag for full spectrum analysis.
```

### Request Tests

```
Use the MASTER_PROTOCOL to write tests for the auth module.
Apply FULLSPEC for complete test suite generation.
```

### Build a Feature

```
Use the MASTER_PROTOCOL to add a search feature.
Follow existing patterns and use Shadcn UI components.
```

## Best Practices

1. **Start with MASTER_PROTOCOL** - It routes to appropriate specialized protocols
2. **Use trigger commands** - DEEPDIVE, ULTRATHINK, FULLSPEC for deep analysis
3. **Reference existing patterns** - AI will follow your codebase conventions
4. **Request verification** - Always ask for test commands and verification steps
