# VS Code Configuration

Optimize VS Code for the ai-protocols workflow.

## Setup

### 1. Project Settings

Copy `settings.json` to your project's `.vscode/` directory to ensure consistent formatting, linting, and file exclusion rules.

### 2. Extensions Recommended

- **ESLint**: For real-time code quality checks.
- **Prettier**: For consistent code formatting.
- **Prisma**: If using database protocols.
- **Tailwind CSS IntelliSense**: For frontend development.

## AI Integration

This configuration is designed to complement AI tools like GitHub Copilot, Cline, and Cursor by providing a clean, well-structured environment that helps AI assistants better understand your code.

- **Files Excluded**: node_modules, dist, and other build artifacts are excluded from the watcher and search to prevent AI assistants from being overwhelmed by irrelevant files.
- **Formatting**: Auto-format on save ensures that code produced by AI always matches your project's styling standards.
