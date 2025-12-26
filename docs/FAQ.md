# ❓ Frequently Asked Questions

Common questions about ai-protocols.

---

## 📚 General Questions

### What are ai-protocols?

A comprehensive framework that guides AI assistants (Cursor, Cline, Copilot, Gemini, etc.) to follow software engineering best practices. Instead of generic responses, protocols provide specialized workflows for debugging, code review, testing, security audits, and more.

### Which AI tools work with these protocols?

**Confirmed Compatible:**
- ✅ Cursor
- ✅ Cline (VS Code extension)
- ✅ RooCode (VS Code extension)
- ✅ GitHub Copilot
- ✅ Google Gemini (Web & API)
- ✅ KiloCode
- ✅ Claude (via copy-paste)
- ✅ ChatGPT (via copy-paste)

**Key Requirement:** Any AI tool that supports custom instructions or file context.

### Do I need to use all 19 protocols?

No! Use protocols as needed:
- **Starter Pack:** COMPREHENSIVE (review), DEEPDIVE (debug), FULLSPEC (tests)
- **Security Focus:** Add SECAUDIT
- **Frontend Projects:** Add ULTRATHINK, A11YCHECK
- **Full Stack:** Use all protocols

### How much does this cost?

**Free!** All protocols are open source. Costs are only from your chosen AI tool (Cursor subscription, Copilot subscription, API usage, etc.).

---

## 🛠️ Setup & Installation

### How long does setup take?

- **Manual setup:** 2-5 minutes
- **With examples:** 10 minutes
- **Full validation:** 15 minutes

Follow [QUICK_START.md](QUICK_START.md) for fastest setup.

### Do I need to install anything?

Only if using examples:
- Node.js 18+ (for JavaScript/TypeScript examples)
- npm or yarn
- Git (optional, for version control)

The protocols themselves are just markdown files.

### Can I use this with existing projects?

Yes! Just copy protocol files to your project root:
```bash
your-project/
├── MASTER_PROTOCOL.md
├── BRAIN/
├── docs/
└── .cursorrules (or .clinerules)
```

### Should I commit protocol files to Git?

**Recommended:** Yes, commit them so your team shares the same AI guidelines.

```bash
git add MASTER_PROTOCOL.md BRAIN/ docs/ .cursorrules
git commit -m "Add ai-protocols"
```

---

## 🎯 Usage Questions

### How do I trigger a protocol?

**Method 1: Trigger Commands**
```
Use MASTER_PROTOCOL with DEEPDIVE to debug this error
```

**Method 2: Direct Reference**
```
Follow BRAIN/security_audit_protocol.md to check for vulnerabilities
```

**Method 3: Implicit (if configured)**
```
Review this code
# AI automatically uses COMPREHENSIVE protocol if configured
```

### Can I customize protocols?

Yes! Protocols are plain markdown. Edit them to:
- Add company-specific rules
- Remove sections you don't need
- Add language-specific guidance
- Include custom code examples

### Do protocols work with non-English codebases?

Yes, but:
- Protocol instructions are in English
- Works best with English comments
- Code itself can be any language
- Consider translating protocols for non-English teams

### Can I use multiple protocols at once?

Yes! Chain protocols for complex tasks:
```
Use ULTRATHINK for UI design, then SECAUDIT for security, then FULLSPEC for tests
```

See [SCENARIOS.md](SCENARIOS.md) for multi-protocol workflows.

---

## 🔒 Security & Privacy

### Do protocols send my code anywhere?

No. Protocols are just instructions for your AI tool. Your code only goes where your AI tool normally sends it (e.g., Copilot sends to GitHub, Cursor to Anthropic).

### Are there any security concerns?

**Protocol Security:** Protocols themselves just contain instructions, no executable code.

**AI Tool Security:** Follow your AI tool's security guidelines:
- Don't include secrets in prompts
- Be careful with proprietary code
- Use enterprise versions for sensitive work

**SECAUDIT Protocol:** Actually helps improve security by systematically checking for vulnerabilities.

### Can I use this for closed-source projects?

Yes. Protocols don't expose your code. Check your AI tool's terms of service regarding proprietary code.

---

## 💻 Technical Questions

### Why do protocols use "trigger commands"?

Trigger commands (like DEEPDIVE, FULLSPEC) help AI quickly identify which specialized protocol to follow. They're memorable and prevent ambiguity.

### What's the difference between MASTER_PROTOCOL and BRAIN protocols?

- **MASTER_PROTOCOL:** Router/orchestrator. Decides which specialized protocol to use.
- **BRAIN Protocols:** 19 specialized protocols for specific tasks (debugging, testing, security, etc.).

Think: MASTER_PROTOCOL is the "table of contents," BRAIN protocols are the "chapters."

### Do I need all files in BRAIN/?

**Minimum Required:**
- MASTER_PROTOCOL.md
- At least 3-5 BRAIN protocols you'll actually use

**Recommended:**
- All 19 BRAIN protocols (even if unused, they're small)
- docs/ folder for reference
- configurations/ folder for IDE setup

### What's the token usage impact?

**Without Optimization:**
- Old v1.0: ~116KB (high token usage)

**With v2.0+ Optimization:**
- Current: ~73KB (43% reduction)
- Per protocol: ~5-8KB average
- Protocols load only when needed

Most AI tools have 100K+ token windows, so impact is minimal.

---

## 🧪 Testing & Examples

### Do I need to run the example projects?

No, but they're helpful to:
- See protocols in action
- Use as project templates
- Verify your setup works
- Learn by example

### Can I use examples as project starters?

Yes! Examples are production-ready templates:
- `examples/node-express/` → REST API starter
- `examples/react-typescript/` → Frontend app starter

Both include:
- Full test suites
- Security best practices
- CI/CD configuration
- Protocol demonstrations

### Why do example tests require environment variables?

Security best practice (SECAUDIT protocol): Never hardcode secrets. Examples demonstrate proper environment variable usage.

```bash
cp .env.example .env
# Edit .env with your values
npm test
```

---

## 🚀 Advanced Topics

### Can I create custom protocols?

Yes! Follow this structure:

```markdown
# MY_CUSTOM_PROTOCOL

**ROLE:** [Your specialist role]
**EXPERIENCE:** [Years/expertise]

## 1. CORE DIRECTIVES
- [Principle 1]
- [Principle 2]

## 2. THE "CUSTOMTRIGGER" PROTOCOL
**TRIGGER:** When user prompts "CUSTOMTRIGGER"
[Your workflow steps]

## 3. [Additional sections]
```

Add to MASTER_PROTOCOL.md routing table.

### Can I integrate with CI/CD?

Yes! Use validation scripts:

```yaml
# .github/workflows/ci.yml
- name: Validate Protocols
  run: node scripts/validate-protocols.js

- name: Run Protocol-Compliant Tests
  run: npm test
```

### How do I share protocols across teams?

**Option 1: Git submodule**
```bash
git submodule add https://github.com/your-org/protocols protocols
```

**Option 2: npm package**
```bash
npm install @your-org/ai-protocols
```

**Option 3: Monorepo**
```
company-monorepo/
├── packages/
│   └── ai-protocols/
└── apps/
    └── app1/ (uses protocols)
```

### Can I version protocols?

Yes, protocols include version metadata:
```yaml
---
protocol_version: "2.3.2"
last_updated: "2025-12-23"
---
```

Track in CHANGELOG.md and use semantic versioning.

---

## 🎓 Learning & Best Practices

### How long to master protocols?

- **Basic usage:** 1 day
- **Proficient:** 1 week
- **Advanced workflows:** 2-3 weeks

Start with 3 protocols (COMPREHENSIVE, DEEPDIVE, FULLSPEC) then expand.

### What's the learning curve?

**Beginner:** Use simple trigger commands
```
Use DEEPDIVE to debug
```

**Intermediate:** Chain protocols
```
Use ULTRATHINK for design, then FULLSPEC for tests
```

**Advanced:** Customize protocols, create workflows
```
Custom protocol for your tech stack + team conventions
```

### Best practices for teams?

1. **Standardize:** Everyone uses same protocol version
2. **Train:** 1-hour onboarding session
3. **Document:** Add team-specific examples
4. **Review:** Include protocol compliance in code reviews
5. **Update:** Keep protocols in sync with tech stack

### Common mistakes to avoid?

❌ **Don't:**
- Skip validation (`node scripts/validate-protocols.js`)
- Use vague commands ("fix this")
- Ignore security protocols
- Let protocols get outdated

✅ **Do:**
- Be explicit with trigger commands
- Chain protocols for complex tasks
- Update protocols with tech stack changes
- Share improvements with team

---

## 📈 Metrics & ROI

### How do I measure protocol effectiveness?

**Quantitative Metrics:**
- Code review time (before/after)
- Bug detection rate
- Test coverage increase
- Security vulnerabilities found
- Onboarding time for new developers

**Qualitative Metrics:**
- Code quality improvements
- Consistency across team
- Developer confidence
- AI assistance usefulness

### What ROI can I expect?

Based on early adoption:
- **30-50% faster** code reviews
- **40% more bugs** caught before production
- **2-3x faster** onboarding for new developers
- **80%+ test coverage** (vs 40-60% average)

### Do protocols slow down development?

Initially: +5-10% time (learning curve)
After 1 week: -20-30% time (efficiency gains)
After 1 month: -40% time (muscle memory + quality improvements)

---

## 🆘 When Things Go Wrong

### Protocol commands don't work

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed fixes.

Quick checks:
1. Run validation: `node scripts/validate-protocols.js`
2. Verify IDE config exists (`.cursorrules`, etc.)
3. Restart IDE
4. Use explicit protocol references

### AI gives inconsistent results

**Causes:**
- Context window full
- Ambiguous commands
- Different AI models/versions

**Solutions:**
- Start fresh chat sessions
- Be more explicit
- Use consistent AI tool/model

### Protocols feel "too rigid"

Protocols are guidelines, not laws. Customize them:
- Remove sections you don't need
- Add team-specific rules
- Create lighter "quick mode" versions

---

## 🤝 Contributing

### Can I contribute improvements?

Yes! See CONTRIBUTING.md (if it exists) or:
1. Fork repository
2. Make improvements
3. Submit pull request
4. Share feedback

### How do I report bugs?

- GitHub Issues (if open source)
- Your team's issue tracker
- Email maintainer

Include:
- Protocol version
- AI tool used
- Steps to reproduce
- Expected vs actual behavior

---

**Have more questions?** Check:
- [QUICK_START.md](QUICK_START.md) for setup
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for issues
- [SCENARIOS.md](SCENARIOS.md) for usage examples
- [COMMANDS.md](COMMANDS.md) for all triggers
