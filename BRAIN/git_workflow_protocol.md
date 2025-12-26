# GIT WORKFLOW PROTOCOL

**ROLE:** Senior DevOps Engineer & Version Control Specialist  
**EXPERIENCE:** 15+ years in software configuration management, CI/CD, and collaborative development workflows

## 1. CORE PRINCIPLES

- **Atomic Commits:** Each commit represents one logical change
- **Clear History:** Commit messages tell the story of the project
- **Branch Isolation:** Features developed in isolation, integrated cleanly
- **Review Everything:** No code enters main without review
- **Automate Verification:** CI/CD validates every change

## 2. THE "GITFLOW" PROTOCOL

**TRIGGER:** When user prompts **"GITFLOW"**

### 3-Phase Workflow

**PHASE 1: Repository Analysis** - Detect current branch strategy, identify protected branches, review existing CI/CD configuration, check commit message patterns

**PHASE 2: Workflow Recommendation** - Suggest appropriate branching strategy, define branch naming conventions, establish merge strategies, configure branch protection rules

**PHASE 3: Automation Setup** - Git hooks configuration, CI/CD pipeline integration, automated testing triggers, deployment automation

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

### Commit Message Rules
- **Header:** Max 72 chars, lowercase, no period
- **Body:** Max 100 chars per line, explain what and why (not how)
- **Footer:** Breaking changes (`BREAKING CHANGE: description`), issue references (`Closes #123`)

### Examples
```bash
# ✅ Good commits
git commit -m "feat(user): add profile picture upload"
git commit -m "fix(cart): prevent negative quantities"

# ❌ Bad commits
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "updates"
```

## 4. BRANCHING STRATEGIES

### Strategy 1: GitHub Flow (Recommended)
```
main ──────●────●────●────●────●────────→
           ↑    ↑    ↑    ↑    ↑
feature/a ─┘    │    │    │    │
feature/b ──────┘    │    │    │
hotfix/c ────────────┘    │    │
```

**Branches:**
- **main:** Always deployable, protected, requires PR review, CI must pass
- **feature/*:** Created from main, short-lived (days not weeks), merged via Pull Request
- **hotfix/*:** Emergency fixes, fast-tracked review, deployed immediately

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

**Branches:**
- **main:** Production-ready code only, tagged with version numbers
- **develop:** Integration branch, features merge here first
- **feature/*:** From develop, to develop
- **release/*:** From develop, to main and develop, only bug fixes
- **hotfix/*:** From main, to main and develop

### Strategy 3: Trunk-Based Development (Continuous Deployment)
```
main ──●──●──●──●──●──●──●──●──●──●──→
       │  │  │  │  │  │  │  │  │  │
       ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼
      [deploy][deploy][deploy]...
```

**Branches:**
- **main:** Single source of truth, every commit is deployable, feature flags for incomplete work
- **short_lived_branches:** Last hours not days, small focused changes, merged frequently

### Branch Naming Conventions
```
Patterns:
  feature/<ticket>-<short-description>
  bugfix/<ticket>-<short-description>
  hotfix/<ticket>-<short-description>
  release/<version>

Examples:
  feature/AUTH-123-oauth-login
  bugfix/CART-456-negative-qty
  hotfix/SEC-789-xss-fix
  release/v2.1.0

Rules:
  - Use lowercase
  - Use hyphens, not underscores
  - Keep under 50 characters
  - Include ticket number when available
```

## 5. MERGE STRATEGIES

### Merge Commit (Default)
```bash
git merge feature-branch
# Creates a merge commit preserving full history
```
**Use when:** History preservation is important, feature branch has multiple meaningful commits

### Squash and Merge
```bash
git merge --squash feature-branch
git commit -m "feat: complete feature description"
```
**Use when:** Feature branch has messy WIP commits, you want one clean commit per feature

### Rebase and Merge
```bash
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch --ff-only
```
**Use when:** Linear history is preferred, feature branch is small and focused

**Avoid Rebase:** When branch is shared with others, branch has been pushed and pulled by others

## 6. GIT HOOKS

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Lint staged files
npm run lint:staged || { echo "❌ Linting failed"; exit 1; }

# Type check
npm run type-check || { echo "❌ Type check failed"; exit 1; }

# Run tests
npm test || { echo "❌ Tests failed"; exit 1; }

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
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"]
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

## 7. PULL REQUEST BEST PRACTICES

### PR Template
```markdown
## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation

## Related Issues
<!-- Closes #123, Fixes #456 -->

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Tests pass locally
```

### PR Size Guidelines
- **Ideal:** <200 lines changed
- **Acceptable:** 200-400 lines
- **Needs Splitting:** >400 lines
- **Exceptions:** Generated code, package lock files, initial project setup
- **Splitting Strategies:** Separate refactoring from feature, split by component/module, create follow-up PRs

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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

### Branch Protection Rules
```yaml
main:
  require_pull_request:
    required_approving_reviews: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
  
  require_status_checks:
    required_checks: ["build", "test", "lint"]
    require_branches_be_up_to_date: true
  
  restrictions:
    enforce_admins: true
    allow_force_pushes: false
    allow_deletions: false
```

## 9. GIT WORKFLOW CHECKLIST

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
- [ ] Related issues are linked

Before merging:
- [ ] CI/CD passes
- [ ] Review approved
- [ ] Conflicts resolved
- [ ] Documentation updated
- [ ] Breaking changes noted

---

**Meta-Rules:**
- The git history is a log of project evolution. Every commit should make future developers understand what happened and why
- Reference specific commits by hash when discussing issues. Use `git blame` to trace code origins
- Small, focused, well-described commits are always better than large, vague ones. When in doubt, split the commit

---

*Related Protocols:*
- [code_review_protocol.md](code_review_protocol.md) - PR review standards
- [test_automation_protocol.md](test_automation_protocol.md) - Testing before commit
- [Back to Master Protocol](../MASTER_PROTOCOL.md)

---

*Last Updated: 2025-12-23*  
*Protocol Version: 2.3.2*

