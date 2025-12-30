---
id: mdap-protocol
version: 2.3.5
triggers:
  - MDAP
  - MILLIONSTEP
category: Core
tags:
  - planning
  - decomposition
  - million-step
  - high-stakes
difficulty: advanced
timeEstimate: "1-2 hours planning"
prerequisites:
  - codebase_indexing_protocol
worksWellWith:
  - test_automation_protocol
  - code_review_protocol
platformTags:
  - backend
  - frontend
  - fullstack
stackSpecific:
  node: true
  python: true
  go: true
  rust: true
  java: true
---

# 🧠 MDAP Protocol: Zero-Error Long-Horizon Execution

This protocol is based on the **MAKER** framework (Cognizant AI Lab). It ensures zero errors across complex, many-step tasks by utilizing **Massively Decomposed Agentic Processes**.

> [!IMPORTANT]
> **Philosophy:** Scaling is achieved through **Extreme Decomposition**, not higher model intelligence. 100 simple steps with 99.9% reliability are superior to 1 complex step with 90% reliability.

---

## 🛠️ Phase 1: Maximal Agentic Decomposition (MAD)

For any task with high complexity or >5 logical dependencies:
1.  **Atomize**: Break the task into the smallest possible discrete steps ($s$).
2.  **Stateless Focus**: Each step must be solvable with minimal context ($m=1$).
3.  **Handoff Design**: Define the "Next State" after every single file edit or architectural change.

## 🚩 Phase 2: Red-Flagging (Reliability Guard)

LLMs exhibit correlated errors when confused. If any of these **Red Flags** appear during execution, **DISCARD AND RESET**:
- **Token Bloat**: If a response exceeds 700-800 tokens without a definitive result.
- **Circular Reasoning**: "Wait, maybe the logic is... actually, looking back..."
- **Format Drift**: Any minor deviation from requested JSON/Markdown formats.
- **Over-Analysis**: Solving for edge cases not yet reached in the atomic step.

## 🗳️ Phase 3: Simulated Voting & Verification

Since the cost of failure in a long chain is infinite (derailment), apply the **Ahead-by-1** rule:
1.  **Reasoning Diversity**: Before making a change, argue for the change then argue *against* it.
2.  **User Voting**: For critical "Mainline" changes, present two slightly different implementation paths to the USER for "Voting."
3.  **Test Convergence**: Every atomic step **must** pass a unit test before moving to the next step ($p \to 1$).

---

## 📈 MDAP Workflow Metrics

| Metric | Target | Rationale |
| :--- | :--- | :--- |
| **Step Granularity** | < 20 lines / step | Maximizes per-step success rate ($p$). |
| **Red-Flag Rate** | ~10-15% | Signals high standard for output quality. |
| **Max Context** | < 2000 tokens | Prevents the "Lost in the Middle" effect. |

## 🚀 Trigger Command: `MDAP` or `MILLIONSTEP`
Use this command for refactors, migrations, or large-scale debugging.

"Use the MASTER_PROTOCOL with **MDAP** to refactor this module. Follow MAD principles."

---
**[Back to MASTER_PROTOCOL](MASTER_PROTOCOL.md)** | **[Back to README](../README.md)**

---

*Last Updated: 2025-12-29*
*Protocol version: 2.3.5*

