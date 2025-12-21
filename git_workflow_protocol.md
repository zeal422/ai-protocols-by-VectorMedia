---
protocol_version: "1.0.0"
last_updated: "2025-12-22"
status: "stable"
requires: ["MASTER_PROTOCOL.md"]
---

# GIT WORKFLOW PROTOCOL

**ROLE:** Senior DevOps Engineer & Version Control Specialist.
**EXPERIENCE:** 15+ years in software configuration management, CI/CD, and collaborative development workflows.

## 1. CORE PRINCIPLES

- **Atomic Commits:** Each commit represents one logical change
- **Clear History:** Commit messages tell the story of the project
- **Branch Isolation:** Features developed in isolation, integrated cleanly
- **Review Everything:** No code enters main without review
- **Automate Verification:** CI/CD validates every change

## 2. THE "GITFLOW" PROTOCOL (TRIGGER COMMAND)

**TRIGGER:** When the user prompts **"GITFLOW"**:

### PHASE 1: REPOSITORY ANALYSIS
- Detect current branch strategy
- Identify protected branches
- Review existing CI/CD configuration
- Check commit message patterns

### PHASE 2: WORKFLOW RECOMMENDATION
- Suggest appropriate branching strategy
- Define branch naming conventions
- Establish merge strategies
- Configure branch protection rules

### PHASE 3: AUTOMATION SETUP
- Git hooks configuration
- CI/CD pipeline integration
- Automated testing triggers
- Deployment automation

---

## 3. COMMIT CONVENTIONS

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `docs` | Documentation | `docs(readme): update install steps` |
| `style` | Formatting | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor(db): simplify queries` |
| `perf` | Performance improvement | `perf(render): memoize components` |
| `test` | Adding tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore(deps): update packages` |
| `ci` | CI/CD changes | `ci: add GitHub Actions` |
| `build` | Build system | `build: update webpack config` |
| `revert` | Reverting changes | `revert: undo feat(auth)` |

### Commit Message Rules

```yaml
rules:
  header:
    max_length: 72
    format: "<type>(<scope>): <description>"
    description_case: "lowercase, no period"
    
  body:
    max_line_length: 100
    blank_line_before: true
    purpose: "Explain what and why, not how"
    
  footer:
    breaking_changes: "BREAKING CHANGE: description"
    issue_references: "Closes #123, Fixes #456"
```

### Examples

```bash
# ✅ Good commits
git commit -m "feat(user): add profile picture upload"
git commit -m "fix(cart): prevent negative quantities"
git commit -m "docs(api): document rate limiting headers"

# ❌ Bad commits
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "updates"
git commit -m "Fix bug in user module that was causing issues with the cart when users added items"  # Too long
```

### AI-Specific Commit Guidelines

When AI is making changes:

```yaml
ai_commits:
  attribution:
    - "Add 'AI-assisted' tag when appropriate"
    - "Human should review before merge"
    
  scope:
    - "One logical change per commit"
    - "Never bundle unrelated changes"
    
  verification:
    - "Run tests before committing"
    - "Verify build passes"
    
  example: |
    feat(search): add fuzzy matching algorithm
    
    - Implement Levenshtein distance for typo tolerance
    - Add configurable threshold (default: 0.8)
    - Include comprehensive test coverage
    
    AI-assisted: Claude
    Reviewed-by: @username
```

---

## 4. BRANCHING STRATEGIES

### Strategy 1: GitHub Flow (Recommended for Most Projects)

```
main ──────●────●────●────●────●────────→
           ↑    ↑    ↑    ↑    ↑
feature/a ─┘    │    │    │    │
feature/b ──────┘    │    │    │
hotfix/c ────────────┘    │    │
feature/d ────────────────┘    │
feature/e ─────────────────────┘
```

```yaml
branches:
  main:
    - "Always deployable"
    - "Protected, requires PR review"
    - "CI must pass before merge"
    
  feature/*:
    - "Created from main"
    - "Short-lived (days, not weeks)"
    - "Merged via Pull Request"
    
  hotfix/*:
    - "Emergency fixes"
    - "Fast-tracked review"
    - "Deployed immediately"
```

### Strategy 2: GitFlow (Complex Release Cycles)

```
main ────────●─────────────●─────────────→
             ↑             ↑
release/1.0 ─┴─────●───────┘
                   ↑
develop ──●──●──●──┴──●──●──●──●──────→
          ↑  ↑  ↑     ↑  ↑  ↑  ↑
features ─┴──┴──┴─────┴──┴──┴──┴
```

```yaml
branches:
  main:
    - "Production-ready code only"
    - "Tagged with version numbers"
    
  develop:
    - "Integration branch"
    - "Features merge here first"
    
  feature/*:
    - "From: develop"
    - "To: develop"
    
  release/*:
    - "From: develop"
    - "To: main and develop"
    - "Only bug fixes, no new features"
    
  hotfix/*:
    - "From: main"
    - "To: main and develop"
```

### Strategy 3: Trunk-Based Development (Continuous Deployment)

```
main ──●──●──●──●──●──●──●──●──●──●──→
       │  │  │  │  │  │  │  │  │  │
       ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
      [deploy][deploy][deploy]...
```

```yaml
branches:
  main:
    - "Single source of truth"
    - "Every commit is deployable"
    - "Feature flags for incomplete work"
    
  short_lived_branches:
    - "Last hours, not days"
    - "Small, focused changes"
    - "Merged frequently"
```

### Branch Naming Conventions

```yaml
patterns:
  feature: "feature/<ticket>-<short-description>"
  bugfix: "bugfix/<ticket>-<short-description>"
  hotfix: "hotfix/<ticket>-<short-description>"
  release: "release/<version>"
  
  examples:
    - "feature/AUTH-123-oauth-login"
    - "bugfix/CART-456-negative-qty"
    - "hotfix/SEC-789-xss-fix"
    - "release/v2.1.0"
    
  rules:
    - "Use lowercase"
    - "Use hyphens, not underscores"
    - "Keep under 50 characters"
    - "Include ticket number when available"
```

---

## 5. MERGE STRATEGIES

### Merge Commit (Default)

```bash
git merge feature-branch
# Creates a merge commit preserving full history
```

**Use when:**
- History preservation is important
- Feature branch has multiple meaningful commits

### Squash and Merge

```bash
git merge --squash feature-branch
git commit -m "feat: complete feature description"
```

**Use when:**
- Feature branch has messy WIP commits
- You want one clean commit per feature

### Rebase and Merge

```bash
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch --ff-only
```

**Use when:**
- Linear history is preferred
- Feature branch is small and focused

### AI Decision Guide

```yaml
merge_strategy_selection:
  squash_merge:
    conditions:
      - "Feature branch has >3 commits"
      - "Commits include 'WIP', 'fix typo', 'oops'"
      - "Single feature being merged"
    
  merge_commit:
    conditions:
      - "Complex feature with meaningful history"
      - "Multiple developers contributed"
      - "Audit trail is important"
    
  rebase:
    conditions:
      - "Simple, linear changes"
      - "Single developer"
      - "< 3 commits"
    
  avoid_rebase:
    conditions:
      - "Branch is shared with others"
      - "Branch has been pushed and pulled by others"
```

---

## 6. GIT HOOKS

### Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Lint staged files
npm run lint:staged
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Please fix errors."
  exit 1
fi

# Type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Please fix errors."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix before committing."
  exit 1
fi

echo "✅ All checks passed!"
```

### Commit Message Hook

```bash
#!/bin/bash
# .git/hooks/commit-msg

commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .{1,72}$'
commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE "$commit_regex"; then
  echo "❌ Invalid commit message format."
  echo "Expected: <type>(<scope>): <description>"
  echo "Examples:"
  echo "  feat(auth): add login page"
  echo "  fix(api): handle null response"
  exit 1
fi
```

### Husky + lint-staged Setup

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "stylelint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# Install
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

### CommitLint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', 'fix', 'docs', 'style', 'refactor',
        'perf', 'test', 'chore', 'ci', 'build', 'revert'
      ]
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};
```

---

## 7. PULL REQUEST BEST PRACTICES

### PR Template

```markdown
<!-- .github/pull_request_template.md -->

## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation
- [ ] 🔧 Refactoring

## Related Issues
<!-- Closes #123, Fixes #456 -->

## Testing
<!-- How was this tested? -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Tests pass locally
- [ ] No new warnings

## Screenshots
<!-- If UI changes, add screenshots -->
```

### PR Size Guidelines

```yaml
pr_size:
  ideal: "< 200 lines changed"
  acceptable: "200-400 lines"
  needs_splitting: "> 400 lines"
  
  exceptions:
    - "Generated code"
    - "Package lock files"
    - "Initial project setup"
  
  splitting_strategies:
    - "Separate refactoring from feature"
    - "Split by component/module"
    - "Create follow-up PRs"
```

### Review Checklist

```yaml
reviewer_checklist:
  code_quality:
    - "Is the code readable and well-structured?"
    - "Are there any obvious bugs?"
    - "Is error handling adequate?"
    
  testing:
    - "Are there sufficient tests?"
    - "Do tests cover edge cases?"
    - "Would tests fail if the code broke?"
    
  security:
    - "Any SQL injection risks?"
    - "Any XSS vulnerabilities?"
    - "Secrets properly handled?"
    
  performance:
    - "Any N+1 queries?"
    - "Any unnecessary loops?"
    - "Memory usage reasonable?"
    
  documentation:
    - "Are complex parts documented?"
    - "Is README updated if needed?"
    - "Are breaking changes noted?"
```

---

## 8. CI/CD INTEGRATION

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security audit
        run: npm audit --audit-level=high
```

### Branch Protection Rules

```yaml
# Repository Settings → Branches → Protection Rules

main:
  require_pull_request:
    required_approving_reviews: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
    
  require_status_checks:
    required_checks:
      - "build"
      - "test"
      - "lint"
    require_branches_be_up_to_date: true
    
  restrictions:
    enforce_admins: true
    restrict_push: true
    allow_force_pushes: false
    allow_deletions: false
```

---

## 9. AI-SPECIFIC GIT GUIDELINES

### When AI Should Ask Before Acting

```yaml
ask_before:
  - "Force pushing to any branch"
  - "Deleting branches"
  - "Modifying protected files (.github/*, .env*)"
  - "Changing git configuration"
  - "Rebasing shared branches"
  - "Resetting/reverting pushed commits"
```

### When AI Can Act Autonomously

```yaml
autonomous_actions:
  - "Creating feature branches"
  - "Making commits (following conventions)"
  - "Pushing to feature branches"
  - "Staging files"
  - "Checking status/log/diff"
```

### Conflict Resolution Approach

```yaml
conflict_resolution:
  approach: "Always ask user for guidance"
  
  gather_info:
    - "Show conflicting files"
    - "Explain both versions"
    - "Identify semantic conflicts (not just text)"
    
  never_do:
    - "Automatically resolve conflicts"
    - "Prefer one side without understanding"
    - "Delete code during resolution"
```

---

## 10. GIT WORKFLOW CHECKLIST

Before committing:

- [ ] Changes are atomic (one logical change)
- [ ] Commit message follows convention
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] No debug code or console.logs
- [ ] No secrets or credentials

Before creating PR:

- [ ] Branch is up to date with main
- [ ] All commits are meaningful
- [ ] PR description is complete
- [ ] Reviewers are assigned
- [ ] Labels are added
- [ ] Related issues are linked

Before merging:

- [ ] CI/CD passes
- [ ] Review approved
- [ ] Conflicts resolved
- [ ] Documentation updated
- [ ] Breaking changes noted

---

**META-RULE:** The git history is a log of project evolution. Every commit should make future developers understand what happened and why.

**LOCATION RULE:** Reference specific commits by hash when discussing issues. Use `git blame` to trace code origins.

**GOLDEN RULE:** Small, focused, well-described commits are always better than large, vague ones. When in doubt, split the commit.

---

*Related Protocols:*
- [code_review_protocol.md](code_review_protocol.md) - PR review standards
- [test_automation_protocol.md](test_automation_protocol.md) - Testing before commit
- [Back to Master Protocol](MASTER_PROTOCOL.md)
