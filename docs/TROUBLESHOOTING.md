# 🛠️ Troubleshooting Guide

Common issues and solutions when using ai-protocols.

---

## 🔴 Critical Issues

### Problem: AI Doesn't Recognize Protocol Commands

**Symptoms:**
- AI responds generically when you use trigger commands like `DEEPDIVE`
- No protocol-specific behavior observed
- AI asks "What is DEEPDIVE?"

**Causes:**
1. Protocol files not in AI's context window
2. IDE configuration missing or incorrect
3. AI tool doesn't support custom instructions
4. Typo in trigger command

**Solutions:**

✅ **For Cursor:**
```bash
# Verify .cursorrules exists
ls -la .cursorrules

# If missing, copy template
cp configurations/cursor/.cursorrules .cursorrules

# Restart Cursor
```

✅ **For Cline/RooCode:**
```bash
# Create .clinerules
cp configurations/cline/.clinerules .clinerules

# Reload VS Code window
# Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows) → "Reload Window"
```

✅ **For GitHub Copilot:**
```bash
# Reference file explicitly in chat
#file:MASTER_PROTOCOL.md
Use MASTER_PROTOCOL to review this code
```

✅ **For Gemini:**
```bash
# Upload MASTER_PROTOCOL.md at start of session
# Or paste system instructions from configurations/gemini/
```

✅ **Explicit Protocol Reference:**
```
Instead of: "Use DEEPDIVE to debug this"
Try: "Follow the instructions in BRAIN/debug_protocol.md to debug this issue"
```

---

### Problem: Validation Script Fails

**Symptoms:**
```bash
❌ MASTER_PROTOCOL.md
❌ BRAIN/code_review_protocol.md
Validation Score: 5/20 (25%)
```

**Solutions:**

✅ **Check Current Directory:**
```bash
# You must be in project root
pwd  # Should show your project directory

# List files
ls -la
# Should see MASTER_PROTOCOL.md, BRAIN/, docs/
```

✅ **Re-install Protocols:**
```bash
# If files are missing, copy from source
# Ensure you have:
# - MASTER_PROTOCOL.md (root)
# - BRAIN/ folder with 15 protocols
# - docs/ folder
# - configurations/ folder
```

✅ **Check File Permissions:**
```bash
# Make validation script executable
chmod +x scripts/validate-protocols.sh

# Run validation
./scripts/validate-protocols.sh
```

---

### Problem: Examples Don't Run

**Symptoms:**
```bash
npm start
# Error: Cannot find module 'express'
# or
# Error: Port 3000 already in use
```

**Solutions:**

✅ **Install Dependencies:**
```bash
cd examples/node-express
# or
cd examples/react-typescript

# Install
npm install

# Verify node version (need 18+)
node --version
```

✅ **Configure Environment:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add required values
# Especially JWT_SECRET
```

✅ **Port Conflicts:**
```bash
# If port 3000 in use, change in .env
PORT=3001

# Or kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🟡 Common Issues

### Problem: Tests Fail in Examples

**Symptoms:**
```bash
npm test
# FAIL tests/integration/users.test.ts
# Error: JWT_SECRET not configured
```

**Solutions:**

✅ **Set Environment Variables:**
```bash
# Create .env file
cp .env.example .env

# Add JWT_SECRET
echo "JWT_SECRET=test-secret-key-change-in-production" >> .env
```

✅ **Run Tests with Env:**
```bash
# Node.js example
JWT_SECRET=test-secret npm test

# Or install dotenv-cli
npm install -g dotenv-cli
dotenv -e .env npm test
```

---

### Problem: TypeScript Errors in IDE

**Symptoms:**
- Red squiggly lines everywhere
- "Cannot find module '@/components'"
- Type errors even though code works

**Solutions:**

✅ **Install TypeScript:**
```bash
npm install -D typescript

# Verify installation
npx tsc --version
```

✅ **Restart TypeScript Server (VS Code):**
```
Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
→ "TypeScript: Restart TS Server"
```

✅ **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Problem: Linting Errors

**Symptoms:**
```bash
npm run lint
# Error: ESLint configuration is invalid
```

**Solutions:**

✅ **Use Flat Config (ESLint 9+):**
```bash
# Copy from configurations
cp configurations/eslint.config.js .

# Install dependencies
npm install -D eslint @eslint/js typescript-eslint
```

✅ **Legacy Config (ESLint 8):**
```bash
# If using old version, use .eslintrc.json instead
# Check ESLint version
npx eslint --version
```

---

### Problem: Protocol Commands Work Inconsistently

**Symptoms:**
- Sometimes AI follows protocols, sometimes doesn't
- Behavior varies between sessions
- Protocols work better for some tasks than others

**Causes:**
1. Context window filled with other content
2. AI prioritizing recent messages over protocol files
3. Ambiguous or incomplete trigger commands

**Solutions:**

✅ **Be Explicit:**
```
❌ Bad: "Debug this"
✅ Good: "Use MASTER_PROTOCOL with DEEPDIVE to debug this authentication error"

❌ Bad: "Review my code"
✅ Good: "Use MASTER_PROTOCOL with COMPREHENSIVE to review UserProfile.tsx following the Four Pillars"
```

✅ **Start Fresh Sessions:**
```
# Long conversations dilute protocol context
# Start new chat for major tasks
# Re-upload MASTER_PROTOCOL.md if needed
```

✅ **Reference Specific Protocols:**
```
"Follow the instructions in BRAIN/security_audit_protocol.md to check for OWASP Top 10 vulnerabilities"
```

---

## 🟢 Minor Issues

### Problem: Prettier and ESLint Conflict

**Symptoms:**
```bash
# ESLint wants semicolons, Prettier removes them
# Or vice versa
```

**Solutions:**

✅ **Install Prettier ESLint Config:**
```bash
npm install -D eslint-config-prettier

# Update eslint.config.js
const prettier = require('eslint-config-prettier');

module.exports = [
  // ... other configs
  prettier, // Must be last
];
```

---

### Problem: Git Hooks Not Running

**Symptoms:**
```bash
git commit -m "test"
# No linting or validation runs
```

**Solutions:**

✅ **Install Husky:**
```bash
npm install -D husky
npx husky init

# Add pre-commit hook
echo "npm run lint" > .husky/pre-commit
echo "npm test" >> .husky/pre-commit
```

---

### Problem: Slow Test Execution

**Symptoms:**
```bash
npm test
# Takes 30+ seconds for small test suite
```

**Solutions:**

✅ **Run Tests in Parallel:**
```json
// jest.config.js
{
  "maxWorkers": "50%"
}
```

✅ **Use Watch Mode:**
```bash
npm run test:watch
# Only runs tests for changed files
```

---

## 📱 Platform-Specific Issues

### macOS: Permission Denied on Scripts

**Solution:**
```bash
chmod +x scripts/validate-protocols.sh
chmod +x scripts/*.sh
```

### Windows: PowerShell Script Not Running

**Solution:**
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run script
.\scripts\validate-protocols.ps1
```

### Linux: npm EACCES Errors

**Solution:**
```bash
# Don't use sudo with npm
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 🔍 Debugging Checklist

When protocols aren't working, check:

- [ ] **Files Present:** Run `node scripts/validate-protocols.js`
- [ ] **IDE Config:** `.cursorrules` or `.clinerules` exists
- [ ] **Current Directory:** You're in project root
- [ ] **Dependencies:** `npm install` completed successfully
- [ ] **Environment:** `.env` file created from `.env.example`
- [ ] **Node Version:** `node --version` shows 18+ 
- [ ] **Explicit Commands:** Using full protocol references
- [ ] **Fresh Session:** Started new AI chat session

---

## 💬 Getting Help

### Self-Service Resources

1. **Quick Start:** [QUICK_START.md](QUICK_START.md)
2. **Commands Reference:** [COMMANDS.md](COMMANDS.md)
3. **FAQ:** [FAQ.md](FAQ.md)
4. **Examples:** Check `examples/` folders

### Validation Tools

```bash
# Run full validation
node scripts/validate-protocols.js

# Check specific example
cd examples/node-express
npm test

# Verify IDE integration
# Cursor: Check .cursorrules exists
# Cline: Check .clinerules exists
```

### Community Support

- **GitHub Issues:** Report bugs or request features
- **Discussions:** Ask questions, share tips
- **Documentation:** Contribute improvements

---

## 🎯 Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| AI doesn't recognize commands | Restart IDE, verify config file exists |
| Validation fails | Check you're in project root with `pwd` |
| Tests fail | Copy `.env.example` to `.env` |
| TypeScript errors | Restart TS server, run `npm install` |
| Port conflicts | Change PORT in `.env` or kill process |
| Permission denied | `chmod +x scripts/*.sh` |
| Slow tests | Use `npm run test:watch` |
| Linting errors | Copy `configurations/eslint.config.js` |

---

**Still stuck?** Double-check you followed [QUICK_START.md](QUICK_START.md) completely, especially the validation step.
