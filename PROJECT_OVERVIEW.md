# AI-Protocols Project Overview v2.3.5

**Status:** ✅ Production Ready | **Quality:** 9.8/10 | **Last Updated:** 2025-12-29

---

## What You Have

A complete, intelligent protocol discovery system with:
- **19 specialized protocols** for AI-assisted development
- **6 MCP tools** for protocol discovery and routing
- **7 guided workflows** for common development tasks
- **Project context detection** (React, Node, Python, Go, Rust, Java)
- **Intelligent task routing** that recommends protocols based on what you're doing

---

## Key Features

### 🎯 Intelligent Task Routing (`route_task` tool - NEW)
```
You: "Fix this React component bug"
System: Analyzes intent → Recommends workflow
  1. DEEPDIVE (debug_protocol) - Find the bug
  2. AUTODEBUG (error_fix_protocol) - Classify it
  3. FULLSPEC (test_automation_protocol) - Add test
  4. COMPREHENSIVE (code_review_protocol) - Review
Time: 30-60m | Difficulty: intermediate
```

### 📋 7 Guided Workflows (NEW)
Each workflow has phases with decision trees to skip unnecessary steps:
1. **Refactor Workflow** - Safe code restructuring
2. **Debug Workflow** - Bug investigation
3. **Security Audit** - Pre-launch security check
4. **Code Review** - 4-pillar PR review
5. **Feature Development** - Building new features
6. **Performance Optimization** - Speed improvements
7. **Accessibility** - WCAG compliance

### 🔍 Context-Aware Search (NEW)
- Auto-detects your tech stack (React? Node? Python?)
- Results personalized to your project
- Example: Searching "optimization" shows performance_protocol first if you're using React

### 📦 19 Specialized Protocols
Organized by category:
- **Core:** master_protocol, mdap_protocol
- **Debugging:** debug_protocol, error_fix_protocol
- **Testing:** test_automation_protocol
- **Architecture:** codebase_indexing_protocol, api_design_protocol
- **Frontend:** frontend_protocol, frontend_backend_protocol
- **Accessibility:** accessibility_protocol, aria_accessibility_protocol
- **Security:** security_audit_protocol
- **Performance:** performance_protocol
- **Quality:** code_review_protocol, best_practices_protocol
- **Refactoring:** refactor_protocol
- **Version Control:** git_workflow_protocol
- **Auditing:** bigpappa_protocol
- **Configuration:** optimized_lint_setup_protocol

---

## How to Use

### Quick Start: 3 Ways to Find Protocols

**1. Task Routing (Recommended for beginners)**
```
route_task(description="I need to build a React dashboard")
→ System recommends protocols + workflow + time estimate
```

**2. Trigger Commands (Fast for experienced users)**
```
DEEPDIVE     → Debug a bug
FULLINDEX    → Map the codebase
MDAP         → Plan complex refactors
SECAUDIT     → Audit security
FULLSPEC     → Write tests
REFACTOR     → Refactor safely
COMPREHENSIVE → Review code
```

**3. Semantic Search (When you know the topic)**
```
search_protocols(query="error handling")
→ Returns ranked results personalized to your project
```

---

## What's New in v2.3.5

✨ **Added:**
- `route_task` tool for intelligent routing
- 7 guided workflow templates with decision trees
- Project context detection (auto-detects tech stack)
- YAML front-matter metadata on all protocols (triggers, tags, difficulty, time)
- Context-aware search filtering

🔧 **Fixed:**
- Windows CRLF line ending support
- Maven projects no longer assume Spring
- Better Node.js project type detection
- TaskType validation and safe casting
- All workflow time estimates corrected
- Documentation inconsistencies resolved

📈 **Improved:**
- Better error handling and validation
- Clearer workflow descriptions
- More helpful context detection
- Personalized recommendations

---

## System Stats

| Metric | Value |
|--------|-------|
| Protocols | 19 (all indexed) |
| Workflows | 7 (guided, with shortcuts) |
| MCP Tools | 6 (including route_task) |
| Startup Time | ~100ms |
| Search Time | <10ms |
| Memory | 560KB |
| Build Status | ✅ 0 errors |
| Tests Passed | 36/36 (100%) |

---

## Supported Tech Stacks

**Languages:** JavaScript, TypeScript, Python, Go, Rust, Java
**Frameworks:** React, Vue, Express, FastAPI, Django, Spring
**Package Managers:** npm, yarn, pnpm, pip, cargo, maven
**CI/CD:** GitHub Actions, GitLab CI, Jenkins
**Container:** Docker support detected

---

## Getting Started

### 1. Install
```bash
cd protocols-mcp
npm install
npm run build
```

### 2. Configure Your IDE
```json
// Claude Desktop, Cursor, Cline, etc.
{
  "mcpServers": {
    "ai-protocols": {
      "command": "node",
      "args": ["/path/to/protocols-mcp/build/index.js"]
    }
  }
}
```

### 3. Start Using
```
Use route_task(description="What you want to do")
or
Use get_protocol_by_trigger(trigger="DEEPDIVE")
or
Use search_protocols(query="topic")
```

---

## Documentation Files

- **SYSTEM_GUIDE.md** - Complete reference (~500 lines) - READ THIS FIRST
- **BRAIN/** - All 19 protocols
- **BRAIN/workflows/** - 7 workflow templates
- **docs/** - Additional guides and FAQs
- **README.md** - Project overview with mermaid diagram

---

## Real-World Example

**Scenario:** "I need to refactor authentication module safely"

```
1. Call: route_task(description="Refactor authentication safely")

2. System Recommends:
   Workflow: Refactor Workflow
   Phases:
     1. FULLINDEX - Map the code (optional if you know it)
     2. MDAP - Plan changes (optional for small changes)
     3. REFACTOR - Do the refactoring (required)
     4. FULLSPEC - Test thoroughly (required)
     5. COMPREHENSIVE - Code review (required)
   
   Time: 2-4 hours
   Difficulty: intermediate

3. Follow workflow with decision trees:
   Q: Know the code? → Skip phase 1
   Q: Small change? → Skip phase 2
   Q: High coverage? → Skip phase 4 details

4. Execute phases, commit after each step
```

---

## Why This System Works

✅ **Zero Configuration** - Auto-discovers protocols and your tech stack
✅ **Smart Routing** - `route_task` analyzes intent and recommends workflow
✅ **Structured Guidance** - Workflows with decision trees prevent mistakes
✅ **Fast Search** - <10ms to find relevant protocols
✅ **Context Aware** - Personalizes to your project (React? Node? Python?)
✅ **Production Ready** - Comprehensive error handling, path traversal prevention
✅ **Well Tested** - 36/36 validation checks pass

---

## Support & Troubleshooting

**Don't know where to start?**
→ Use `route_task` - it analyzes what you're doing and recommends protocols

**Search results not relevant?**
→ System auto-detects context. Check if your tech stack is detected correctly.

**Need help with a specific task?**
→ See SYSTEM_GUIDE.md for 7 detailed usage examples

**Want to explore?**
→ Use `list_protocols` to browse by category

---

**Version:** 2.3.5 | **Status:** ✅ Production Ready  
**For detailed info:** See SYSTEM_GUIDE.md (comprehensive ~500 line reference)
