# Contributing to AI Development Protocols

Thank you for your interest in improving AI Development Protocols! This document provides guidelines for contributing.

---

## 🎯 Ways to Contribute

### 1. Report Issues
- Bug reports
- Protocol inconsistencies
- Documentation errors
- Missing features

### 2. Improve Documentation
- Fix typos and grammar
- Add examples
- Clarify confusing sections
- Translate to other languages

### 3. Enhance Protocols
- Add new protocols
- Improve existing workflows
- Add language-specific guidance
- Update for new AI tools

### 4. Share Success Stories
- Case studies
- Metrics and ROI
- Team adoption stories
- Best practices

### 5. Code Contributions
- Example projects
- Validation scripts
- CLI improvements
- Testing frameworks

---

## 📋 Before You Start

1. **Check existing issues** to avoid duplicates
2. **Read relevant protocols** to understand context
3. **Test your changes** with validation scripts
4. **Follow the style guide** (see below)

---

## 🔧 Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/ai-protocols.git
cd ai-protocols

# Install dependencies (for examples)
cd examples/node-express
npm install

# Run validation
cd ../..
node scripts/validate-protocols.js

# Test examples
cd examples/node-express && npm test
cd ../react-typescript && npm test
```

---

## 📝 Style Guide

### Protocol Files

**Structure:**
```markdown
# PROTOCOL_NAME

**ROLE:** [Specialist role]
**EXPERIENCE:** [Years/expertise]

## 1. CORE DIRECTIVES
[Principles]

## 2. THE "TRIGGER" PROTOCOL
**TRIGGER:** When user prompts "TRIGGER"
[Workflow steps]

## 3. [Additional sections]

---

*Related Protocols:*
- [protocol_name.md](protocol_name.md) - Description

---

*Last Updated: YYYY-MM-DD*  
*Protocol Version: X.Y.Z*
```

**Best Practices:**
- ✅ Use clear, actionable language
- ✅ Include code examples (❌ Bad / ✅ Good)
- ✅ Add cross-references to related protocols
- ✅ Keep consistent structure across protocols
- ✅ Include practical, real-world examples
- ❌ Don't use jargon without explanation
- ❌ Don't make assumptions about knowledge level

### Documentation

**Markdown Standards:**
- Use heading hierarchy (H1 → H2 → H3)
- Code blocks with language syntax highlighting
- Tables for comparisons
- Emoji for visual scanning (sparingly)
- Links to related docs

**Tone:**
- Professional but friendly
- Clear and concise
- Actionable (tell readers what to do)
- Avoid passive voice

### Code Examples

**Requirements:**
- ✅ Must be runnable (tested)
- ✅ Include error handling
- ✅ Follow protocol guidelines
- ✅ Add comments explaining why, not what
- ✅ TypeScript types where applicable

**Example Structure:**
```typescript
// ❌ Bad: No error handling, unclear purpose
function getUser(id) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
}

// ✅ Good: Parameterized, error handling, clear intent
async function getUserById(userId: string): Promise<User> {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    if (!result.rows[0]) {
      throw new NotFoundError('User not found');
    }
    
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error });
    throw error;
  }
}
```

---

## 🔀 Git Workflow

### Branch Naming

```
feature/add-python-protocol
fix/security-audit-typo
docs/improve-quick-start
example/fastapi-template
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(protocols): add Python debugging protocol
fix(validation): handle missing BRAIN folder gracefully
docs(quick-start): add troubleshooting section
test(node-example): add security test suite
refactor(cli): improve error messages
```

**Types:**
- `feat`: New feature or protocol
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Add or update tests
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `chore`: Maintenance tasks

### Pull Request Process

1. **Create descriptive PR title**
   ```
   feat(protocols): Add Rust development protocol
   ```

2. **Fill out PR template**
   - Description of changes
   - Related issue number
   - Testing performed
   - Screenshots (if UI changes)

3. **Ensure checks pass**
   - [ ] Validation script passes
   - [ ] All tests pass
   - [ ] Documentation updated
   - [ ] No merge conflicts

4. **Request review**
   - Tag relevant maintainers
   - Address feedback promptly
   - Keep discussion focused

---

## ✅ Checklist for Protocol Contributions

### New Protocol

- [ ] Follows standard structure
- [ ] Includes trigger command
- [ ] Has code examples
- [ ] Cross-references related protocols
- [ ] Added to MASTER_PROTOCOL.md routing table
- [ ] Added to docs/COMMANDS.md
- [ ] Added to docs/QUICK_REFERENCE.md
- [ ] Version and date in footer
- [ ] Tested with validation script

### Protocol Update

- [ ] Changes explained in commit message
- [ ] Version number incremented
- [ ] Last updated date changed
- [ ] Related docs updated
- [ ] Backward compatibility maintained (if possible)
- [ ] CHANGELOG.md updated

### Example Project

- [ ] README with setup instructions
- [ ] package.json with all scripts
- [ ] Tests pass (`npm test`)
- [ ] Follows protocol guidelines
- [ ] .env.example provided
- [ ] CI/CD configuration included
- [ ] .gitignore present

### Documentation

- [ ] Clear and concise
- [ ] Examples provided
- [ ] Links work
- [ ] Spelling and grammar checked
- [ ] Consistent with existing docs
- [ ] Added to README if major doc

---

## 🧪 Testing Guidelines

### Validation Script

Always run before submitting:
```bash
node scripts/validate-protocols.js
```

Should return 80%+ score.

### Example Projects

Test both examples:
```bash
# Node.js example
cd examples/node-express
npm install
npm test
npm run lint

# React example
cd ../react-typescript
npm install
npm test
npm run lint
```

All tests must pass.

### Manual Testing

For protocol changes:
1. Copy to fresh project
2. Try with actual AI tool (Cursor, Cline, etc.)
3. Verify trigger commands work
4. Check protocol behavior matches description

---

## 📊 Performance Considerations

### Token Usage

- Keep protocols concise (5-10KB ideal)
- Use bullet points over paragraphs
- Remove redundancy
- Link to details rather than including everything

### File Size

- Protocols: < 15KB each
- Examples: Reasonable (not huge dependencies)
- Documentation: Any size (loaded separately)

---

## 🎨 Adding New Features

### New Protocol

1. Create file in `BRAIN/new_protocol.md`
2. Follow structure template
3. Add to routing table in MASTER_PROTOCOL.md
4. Add to COMMANDS.md with trigger
5. Add to QUICK_REFERENCE.md
6. Update CHANGELOG.md
7. Test with validation script

### New Example

1. Create folder in `examples/`
2. Include full setup (package.json, tests, CI/CD)
3. Write comprehensive README
4. Demonstrate at least 3 protocols
5. Ensure runs without errors
6. Add to main README.md

### New AI Tool Support

1. Create config in `configurations/tool-name/`
2. Add setup instructions
3. Update docs/UNIVERSAL_INTEGRATION.md
4. Test with actual tool
5. Add to README.md compatibility list

---

## 🐛 Bug Reports

**Good Bug Report:**
```markdown
## Description
Validation script fails on Windows with path error

## Steps to Reproduce
1. Run `node scripts/validate-protocols.js` on Windows 11
2. Error: "Cannot find BRAIN\code_review_protocol.md"

## Expected Behavior
Should find protocol files with Windows path separators

## Actual Behavior
Uses Unix path separator, fails on Windows

## Environment
- OS: Windows 11
- Node: 18.17.0
- Protocol Version: 2.1.0

## Possible Fix
Use `path.join()` instead of string concatenation
```

**Include:**
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots (if relevant)
- Possible solution (if you have one)

---

## 💬 Communication

### Be Respectful
- Professional tone
- Constructive feedback
- Assume good intent
- Help others learn

### Be Clear
- Specific feedback
- Reference line numbers
- Explain reasoning
- Provide examples

### Be Patient
- Maintainers are volunteers
- Reviews take time
- Multiple rounds of feedback are normal
- Not all suggestions will be accepted

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

## 🙏 Recognition

Contributors are recognized in:
- CHANGELOG.md (for significant changes)
- GitHub contributors page
- Release notes

---

## ❓ Questions?

- **Documentation:** Check [docs/FAQ.md](docs/FAQ.md)
- **Issues:** Search existing issues first
- **Discussions:** Use GitHub Discussions for questions
- **Email:** [Maintainer contact if applicable]

---

**Thank you for making AI Development Protocols better! 🚀**
