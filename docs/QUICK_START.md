# 🚀 Quick Start Guide

Get up and running with AI Development Protocols in under 5 minutes.

---

## 📦 Installation

### Option 1: Manual Setup (2 minutes)

1. **Copy protocols to your project:**
   ```bash
   # Clone or copy these folders to your project root:
   - BRAIN/MASTER_PROTOCOL.md
   - BRAIN/
   - docs/
   - configurations/
   ```

2. **Choose your IDE configuration:**
   ```bash
   # For Cursor
   cp configurations/cursor/.cursorrules .cursorrules

   # For Cline/RooCode
   cp configurations/cline/.clinerules .clinerules

   # For GitHub Copilot
   mkdir -p .github
   cp configurations/copilot/copilot-instructions.md .github/

   # For VSCode
   mkdir -p .vscode
   cp configurations/vscode/settings.json .vscode/
   ```

3. **Validate setup:**
   ```bash
   node scripts/validate-protocols.js
   # or
   bash scripts/validate-protocols.sh
   # or (Windows)
   powershell scripts/validate-protocols.ps1
   ```

### Option 2: Use Examples (5 minutes)

**For Node.js/Express projects:**
```bash
cd examples/node-express
npm install
cp .env.example .env
npm run dev
npm test
```

**For React/TypeScript projects:**
```bash
cd examples/react-typescript
npm install
npm run dev
npm test
```

---

## 🎯 First Commands

### 1. Code Review
```
Use the MASTER_PROTOCOL to review my code.
Trigger: COMPREHENSIVE
```

### 2. Debug an Issue
```
Use the MASTER_PROTOCOL to debug this error.
Trigger: DEEPDIVE
```

### 3. Write Tests
```
Use the MASTER_PROTOCOL to write tests for this component.
Trigger: FULLSPEC
```

### 4. Security Audit
```
Use the MASTER_PROTOCOL to audit security.
Trigger: SECAUDIT
```

---

## 🔧 Platform-Specific Setup

### Cursor

1. **Automatic detection:** Cursor reads `.cursorrules` automatically
2. **Verify:** Open settings → Check "Custom Instructions" is enabled
3. **Test:** Type any protocol trigger command in chat

### Cline (VS Code)

1. **Create rule file:**
   ```bash
   cp configurations/cline/.clinerules .clinerules
   ```
2. **Restart VS Code**
3. **Test:** Open Cline sidebar and use trigger commands

### GitHub Copilot

1. **Setup instructions file:**
   ```bash
   mkdir -p .github
   cp configurations/copilot/copilot-instructions.md .github/
   ```
2. **Reference in chat:**
   ```
   #file:.github/copilot-instructions.md
   Use MASTER_PROTOCOL to review this code
   ```

### Gemini (Web/API)

1. **Web:** Upload `MASTER_PROTOCOL.md` to chat
2. **API:** Copy `configurations/gemini/system-instructions.txt` to system prompt
3. **Use:** Start requests with "Use the MASTER_PROTOCOL to..."

---

## 📋 Workflow Example

**Scenario:** Building a new user authentication feature

1. **Design API** (5 min)
   ```
   Use MASTER_PROTOCOL with APIDESIGN to design /auth endpoints
   ```

2. **Implement** (30 min)
   ```
   Use MASTER_PROTOCOL with ANTI-GENERIC to implement auth routes
   ```

3. **Security Check** (10 min)
   ```
   Use MASTER_PROTOCOL with SECAUDIT to review authentication
   ```

4. **Write Tests** (15 min)
   ```
   Use MASTER_PROTOCOL with FULLSPEC to test auth module
   ```

5. **Code Review** (5 min)
   ```
   Use MASTER_PROTOCOL with COMPREHENSIVE to review all changes
   ```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Validation script passes (`node scripts/validate-protocols.js`)
- [ ] IDE recognizes protocol commands
- [ ] AI responds with protocol-specific behavior
- [ ] Examples run without errors
- [ ] Tests pass in example projects

---

## 🆘 Troubleshooting

### "AI doesn't recognize protocol commands"

**Solution:**
1. Verify protocol files are in project root
2. Check IDE configuration file exists
3. Restart your IDE/AI tool
4. Try explicit reference: "Use BRAIN/debug_protocol.md"

### "Validation script fails"

**Solution:**
```bash
# Check what's missing
node scripts/validate-protocols.js

# Ensure you're in the project root
pwd  # Should show your project directory

# Re-copy missing files from configurations/
```

### "Examples don't run"

**Solution:**
```bash
# Ensure dependencies are installed
npm install

# Check Node.js version (should be 18+)
node --version

# Copy environment file
cp .env.example .env
```

---

## 📚 Next Steps

1. **Read the Master Protocol:** [MASTER_PROTOCOL.md](../MASTER_PROTOCOL.md)
2. **Explore Commands:** [COMMANDS.md](COMMANDS.md)
3. **Quick Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
4. **Try Examples:** `examples/node-express/` or `examples/react-typescript/`

---

## 💡 Pro Tips

1. **Multi-Protocol Chains:** Combine protocols for complex tasks
   ```
   Use ULTRATHINK for design, then FULLSPEC for tests, then COMPREHENSIVE for review
   ```

2. **Bookmark Triggers:** Keep `docs/QUICK_REFERENCE.md` open for quick reference

3. **Customize:** Edit `.cursorrules` or `.clinerules` to add project-specific rules

4. **Version Control:** Commit protocol files to share with your team

---

**Setup time:** 2-5 minutes  
**First result:** Immediate  
**Mastery:** 1-2 days of practice

*Need help? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or review [FAQ.md](FAQ.md)*
