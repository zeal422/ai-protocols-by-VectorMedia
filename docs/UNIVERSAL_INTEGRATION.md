# 🌐 Universal LLM Integration Guide

The AI Development Protocols are designed to be **LLM-Agnostic**. They work with any advanced Large Language Model (Gemini, KiloCode, Cline, RooCode, Cursor, Claude, GPT-4, etc.) because they rely on structured markdown and standard prompt engineering principles.

---

## 🚀 How it Works

1.  **Context Loading**: When you point an AI to these files, it "reads and understands" the rules, roles, and triggers.
2.  **Trigger Activation**: Commands like `MASTER_PROTOCOL` or `DEEPDIVE` are simple keywords that tell the AI to consult a specific protocol in its context.
3.  **Role Play**: The protocols define specialist roles (e.g., "Principal SRE") that the AI adopts to improve response quality.

---

## 🛠️ Tool-Specific Setup

### 1. **Gemini (Web & IDE)**
- **Web**: Upload the `MASTER_PROTOCOL.md` and any specific protocol you need to the chat.
- **IDE**: Mention the files using `@` if your IDE supports it, or copy the content of `MASTER_PROTOCOL.md` into your System Instructions.
- **Trigger**: Start your request with: *"Use the MASTER_PROTOCOL to..."*

### 2. **Cline & RooCode (VS Code Extensions)**
- **Project Rules**: These extensions look for project-specific rules.
- **Setup**: Create a `.clinerules` or `.roocodes` file in your root and add:
  ```markdown
  Always consult MASTER_PROTOCOL.md for overall guidance.
  Use specialized *.md protocols based on the task type.
  ```
- **Custom Instructions**: In the extension settings, point the "Custom Instructions" to the `MASTER_PROTOCOL.md` file path.

### 3. **KiloCode**
- **Knowledge Base**: Add the protocols directory to KiloCode's "Knowledge" or "Project Context".
- **Usage**: Reference the protocols by name in your prompts.

### 4. **Cursor**
- **.cursorrules**: Copy the contents of `MASTER_PROTOCOL.md` (or a summary) into `.cursorrules`.
- **Rules Folder**: Place the optimized protocols in `.cursor/rules/` for automatic detection.

### 5. **GitHub Copilot**
- **Instructions**: Add to `.github/copilot-instructions.md`.
- **References**: Use `#file:MASTER_PROTOCOL.md` in your chat prompts.

---

## 🧠 Why "Lean" Matters for All LLMs

Regardless of which model you use (Flash, Sonnet, GPT), "Lean" protocols provide several benefits:
- **Lower Latency**: Fewer tokens to process means faster responses.
- **Better Focus**: Less "fluff" means the AI is less likely to get distracted by irrelevant details.
- **Cost Efficiency**: Uses fewer context window tokens, perfect for long-running projects.
- **Intelligence Boost**: By removing boilerplate, the AI's "attention" is focused entirely on the logic and structure.

---

## 🎯 Which Model Should I Use?

| Model | Strongest Protocol Match |
|:---|:---|
| **Gemini 2.0 Flash** | `QUICK`, `AUTODEBUG`, `GITFLOW` |
| **Claude 3.5 Sonnet** | `ULTRATHINK`, `SAFEREFACTOR`, `COMPREHENSIVE` |
| **GPT-4o** | `APIDESIGN`, `PERFAUDIT`, `DEEPDIVE` |
| **KiloCode / O1** | `BIGPAPPA`, `FULLINDEX`, `SECAUDIT` |

---

**[Back to MASTER_PROTOCOL](../MASTER_PROTOCOL.md)** | **[Back to README](../README.md)**
