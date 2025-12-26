# ai-protocols (v2.3.2)
by me, VectorMedia

Master the "Zero-Error" workflow by utilizing the encapsulated intelligence of the `BRAIN/` directory and the power of the Model Context Protocol (MCP).

---

## 1. ⚡ Quick Trigger: The Master Protocol
The `MASTER_PROTOCOL.md` is your AI's brain. To start any task with 100% protocol compliance, use the following trigger:

> **"Use BRAIN/MASTER_PROTOCOL.md to [your task here]..."**

---

## 2. 🔌 MCP Server Integration
The MCP server exposes all 19 protocols as dynamic tools (`get_protocol`, `search_protocols`, etc.) that AI assistants can call directly.

### 🚀 Setup in 30 Seconds
1. **Build**: 
   ```bash
   cd protocols-mcp
   npm install && npm run build
   ```
2. **Connect**: Add this to your AI client (Claude Desktop, Cursor, Cline, or KiloCode):
   ```json
   {
     "mcpServers": {
       "ai-protocols": {
         "command": "node",
         "args": ["/path/to/your/project/protocols-mcp/build/index.js"]
       }
     }
   }
   ```

---

## 3. 🧠 Core Workflow (The 4-Phase Loop)
Every task follows a mathematically reliable path to zero errors:
1. **Reconnaissance**: AI maps your tech stack and dependencies using `FULLINDEX`.
2. **Strategic Planning**: AI drafts an `implementation_plan.md` using `MDAP` decomposition.
3. **Atomic Execution**: AI performs tiny, verifiable edits ($p \to 1$).
4. **Verification**: AI runs `scripts/validate-protocols.js` or unit tests to prove success.

---

## 🛠️ Key Trigger Commands
Type these into your prompt to activate specialized modules:

| Command | Protocol Module | Best For... |
| :--- | :--- | :--- |
| `FULLINDEX` | `codebase_indexing` | Mapping architecture / New projects. |
| `MDAP` | `mdap_protocol` | **High-Stakes Refactors.** Zero-error scaling. |
| `DEEPDIVE` | `debug_protocol` | Scientific Method debugging. |
| `SECAUDIT` | `security_audit` | OWASP Top 10 + Prompt Injection checks. |
| `ULTRATHINK`| `moreFRONTend` | "Avant-Garde" UI/UX design & architecture. |
| `FULLSPEC` | `test_automation` | 100% mission-critical test coverage. |
| `FULLARIA` | `aria_accessibility`| Advanced screen reader & ARIA optimization. |
| `BESTPRACTICES`| `best_practices` | Universal health check & stack detection. |

---

## 📂 Directory Structure
- `/BRAIN`: Contains `MASTER_PROTOCOL.md` and all specialized sub-protocols.
- `/docs`: Detailed scenarios, FAQs, and troubleshooting guides.
- `/scripts`: Validation tools to ensure protocol integrity.
- `/configurations`: Pre-configured rules for Cursor, Cline, Claude, and Gemini.

---

## 🛡️ Zero-Error Rule (Red-Flagging)
If your AI starts to "circularly reason" or outputs > 700 tokens without a result, it is in a **correlated failure state**. 
**Action:** Stop, clear context, and re-trigger using `MDAP`.

---
**Advanced Docs:** [docs/QUICK_START.md](docs/QUICK_START.md) | [README.md](README.md)
