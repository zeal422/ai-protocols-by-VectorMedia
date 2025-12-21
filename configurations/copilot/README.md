# GitHub Copilot Integration

Configure GitHub Copilot to use AI Development Protocols.

## Setup

### 1. Create Copilot Instructions File

Create `.github/copilot-instructions.md` in your repository:

```markdown
# Copilot Instructions

This project follows the AI Development Protocols framework.

## Guidelines

### Code Quality
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Add proper error handling
- Include JSDoc comments for public APIs

### Testing
- Add unit tests for new functions
- Use existing testing patterns
- Aim for 80%+ coverage

### Safety
- Never expose secrets or API keys
- Use parameterized queries (prevent SQL injection)
- Validate all user inputs
- Follow OWASP security guidelines

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case or PascalCase (match existing)

### Commit Messages
Use Conventional Commits:
- feat: new feature
- fix: bug fix
- docs: documentation
- test: adding tests
- refactor: code restructuring

## Do NOT
- Create files outside the project structure
- Install new dependencies without explicit request
- Modify authentication or payment logic
- Change database schema directly
- Commit secrets or sensitive data
```

### 2. VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.advanced": {
    "debug.showScores": false,
    "inlineSuggest.count": 3
  }
}
```

## Usage Tips

### Effective Comments

Write descriptive comments to guide Copilot:

```typescript
// Create a function that validates email format
// Should return true for valid emails, false otherwise
// Use RFC 5322 compliant regex

function validateEmail(email: string): boolean {
  // Copilot will complete based on your comment
}
```

### Reference Patterns

```typescript
// Following the pattern in src/api/users.ts,
// create a handler for the /api/orders endpoint
// Include proper error handling and validation
```

### Type-First Development

```typescript
interface OrderCreateInput {
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
}

// Copilot will use the interface to suggest implementations
function createOrder(input: OrderCreateInput): Promise<Order> {
  // Suggestions will match the type definitions
}
```

## Best Practices

1. **Write descriptive comments** before code blocks
2. **Define types first** - Copilot uses them for better suggestions
3. **Reference existing patterns** in comments
4. **Review all suggestions** - don't blindly accept
5. **Use keyboard shortcuts**:
   - `Tab` - Accept suggestion
   - `Esc` - Dismiss suggestion
   - `Alt+]` - Next suggestion
   - `Alt+[` - Previous suggestion
