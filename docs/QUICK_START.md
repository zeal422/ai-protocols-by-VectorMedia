# ⚡ Quick Start Guide (5 Minutes)

Get up and running with ai-protocols in your project in less than 5 minutes.

## 1. Automated Installation (Recommended)

The fastest way to set up is using our interactive CLI:

```bash
npx @ai-protocols/init
```

**What happens:**
1. You select your **Framework** (Node, React, Python, etc.)
2. You select your **AI Tools** (Cursor, Cline, Gemini, etc.)
3. You select your **Focus Areas** (Security, Testing, etc.)
4. The CLI copies necessary protocols and generates IDE configurations automatically.

---

## 2. Manual Installation

If you prefer to copy files manually:

### Step A: Copy Protocols
Copy the `BRAIN/` folder to your project root.
```bash
cp -r BRAIN/ /path/to/your/project/
```

### Step B: Configure your AI
Choose the configuration for your tool from the `configurations/` folder:

*   **Cursor:** Copy `configurations/cursor/.cursorrules` to root.
*   **Cline/RooCode:** Copy `configurations/cline/.clinerules` to root.
*   **Gemini:** Copy `configurations/gemini/system-instructions.txt` to your custom instructions.
*   **VS Code:** Copy `configurations/vscode/settings.json` to `.vscode/settings.json`.

---

## 3. Verify Setup

Always run the validation script to ensure everything is correctly placed:

```bash
# In your project root
node scripts/validate-protocols.js
```

**Target Score:** 36/36 (100%) - Status: ✅ EXCELLENT

---

## 4. Your First Command

Open your AI assistant (Cursor, Cline, etc.) and try this:

> "Use the MASTER_PROTOCOL to review my current file using COMPREHENSIVE"

**What to expect:**
- The AI will acknowledge the `MASTER_PROTOCOL`.
- It will identify your tech stack.
- It will perform a 4-pillar audit (Correctness, Readability, Performance, Maintainability).

---

## 5. Standard Workflow

1. **Mapping:** Use `FULLINDEX` to let the AI map your project.
2. **Audit:** Use `BESTPRACTICES` to check for common issues.
3. **Develop:** Use `ULTRATHINK` for complex architecture or features.
4. **Refine:** Use `SAFEREFACTOR` or `PERFAUDIT` to polish.
5. **Quality:** Use `FULLSPEC`, `SECAUDIT`, or `A11YCHECK` before committing.

---

## 📚 Resources

- **[COMMANDS.md](COMMANDS.md)** - Full list of triggers.
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - One-page cheat sheet.
- **[SCENARIOS.md](SCENARIOS.md)** - Real-world usage examples.

