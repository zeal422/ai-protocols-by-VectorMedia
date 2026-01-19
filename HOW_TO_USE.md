# ai-protocols (v2.3.5)
by VectorMedia

**Last Updated:** 2026-01-14

Master the "Zero-Error" workflow by utilizing the encapsulated intelligence of the `BRAIN/` directory and the power of the Model Context Protocol (MCP).

---

## 1. ⚡ Quick Trigger: The Master Protocol
The `MASTER_PROTOCOL.md` is your AI's brain. To start any task with 100% protocol compliance, use the following trigger:

> **"Use BRAIN/MASTER_PROTOCOL.md to [your task here]..."**

---

## 2. 🔌 MCP Server Integration
The MCP server exposes all 19 protocols as dynamic tools via 23 MCP tools organized in 8 modules:

### Core Tools (6)
- `get_protocol` - Direct protocol lookup by name
- `list_protocols` - Browse all protocols by category
- `get_protocol_by_trigger` - Find by trigger command (DEEPDIVE, etc.)
- `search_protocols` - Context-aware semantic search
- `fuzzy_match_protocol` - Typo-tolerant search
- `route_task` - Intelligent task routing with workflow guidance

### Dependencies & Intent (2)
- `resolve_protocol_prerequisites` - Get protocol dependency chains
- `refine_user_intent` - Clarify ambiguous requests

### Adaptation & Analytics (4)
- `track_execution_metric` - Record execution metrics
- `get_workflow_optimization_suggestions` - Suggest workflow improvements
- `get_protocol_effectiveness` - View success rates and performance
- `build_adaptive_workflow` - Create adaptive workflows

### Risk & Error Handling (4)
- `assess_modification_risk` - Evaluate code change risk
- `classify_error` - Categorize errors and recovery strategies
- `attempt_error_recovery` - Recover from protocol failures
- `get_execution_alerts` - View risk alerts

### Resilience & Checkpoints (3)
- `create_execution_checkpoint` - Save execution state
- `resume_from_checkpoint` - Resume from saved state
- `list_checkpoints` - View all checkpoints

### Multi-Agent Orchestration (3)
- `register_agent` - Register specialized agents
- `assign_protocol_to_agent` - Assign protocols to agents
- `start_parallel_protocol_execution` - Execute protocols in parallel
- `aggregate_parallel_results` - Merge parallel results

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
| `COMPREHENSIVE`| `code_review` | Four-pillar code review. |
| `SAFEREFACTOR`| `refactor` | Safe refactoring with impact analysis. |
| `BIGPAPPA` | `bigpappa` | Comprehensive code audit. |
| `PERFAUDIT` | `performance` | Performance optimization. |
| `APIDESIGN` | `api_design` | REST/GraphQL API design. |
| `GITFLOW` | `git_workflow` | Git conventions & CI/CD. |
| `A11YCHECK` | `accessibility` | WCAG compliance check. |
| `AUTODEBUG` | `error_fix` | Auto-fix errors with classification. |

---

## 📂 Directory Structure
- `/BRAIN`: Contains `MASTER_PROTOCOL.md` and all 19 specialized protocols.
- `/BRAIN/workflows`: 7 guided workflows (refactor, debug, security, code-review, feature, performance, accessibility).
- `/protocols-mcp/src`: 8 MCP modules (scanner, search, tools, adaptation, resilience, intelligence, execution, storage).
- `/docs`: Detailed scenarios, FAQs, and troubleshooting guides.
- `/scripts`: Validation tools to ensure protocol integrity.
- `/configurations`: Pre-configured rules for Cursor, Cline, Claude, and Gemini.

---

## 🎯 Key Features (v2.3.5)
The system now includes comprehensive tools for intelligent development:

- **23 MCP Tools** - Discovery, execution, risk assessment, and resilience
- **8 MCP Modules** - scanner, search, tools, adaptation, resilience, intelligence, execution, storage
- **Context Detection**: JavaScript, TypeScript, Python, Go, Rust, Java
- **Framework Detection**: React, Vue, Express, FastAPI, Django, Spring
- **Smart Search**: Results personalized to your tech stack
- **7 Guided Workflows**: Pre-built step-by-step workflows
- **Multi-Agent Coordination**: Parallel execution with conflict detection
- **Risk Assessment**: Evaluate code modifications before changes
- **Checkpoints**: Save and resume long-running tasks
- **Error Recovery**: Automatic classification and recovery strategies

---

## 🛡️ Zero-Error Rule (Red-Flagging)
If your AI starts to "circularly reason" or outputs > 700 tokens without a result, it is in a **correlated failure state**.
**Action:** Stop, clear context, and re-trigger using `MDAP`.

---

**Advanced Docs:** [docs/QUICK_START.md](docs/QUICK_START.md) | [README.md](README.md)
