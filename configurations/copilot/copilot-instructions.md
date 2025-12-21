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
- Aim for 80%+ coverage on core features

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
