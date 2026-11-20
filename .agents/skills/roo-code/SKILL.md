---
name: roo-code
description: Multi-model auto-switching and failover inspired by Roo Code and Cline. Automatically detects model quota exhaustion (HTTP 429, RESOURCE_EXHAUSTED, rate limits), preserves in-flight code changes and execution state, and seamlessly switches to the next fallback model without stopping work or losing context.
version: 1.0.0
author: Antigravity Multi-Model Router
tags: [multi-model, auto-switching, quota-recovery, fallback, roo-code, cline, fault-tolerance]
triggers: [quota exceeded, 429, rate limit, model switch, resource exhausted, fallback model, multi-model execution]
tools: [swarm, invoke_subagent, run_command, read_file, write_file, edit_file]
---

# Roo Code: Multi-Model Auto-Switching & Failover

Seamless, zero-downtime multi-model orchestration inspired by Roo Code and Cline. When a model exhausts its quota or encounters API rate limits, this skill seamlessly captures the active execution context, preserves all uncommitted diffs, and transitions to the optimal fallback model to keep building without interruption.

---

## 1. Core Philosophy

1. **Never Stop on Quota (Relentless Continuity):** An API rate limit or exhausted quota must never cause a failed build or abandoned task. Work continues immediately on the next available model tier.
2. **Context & Diff Preservation:** Every file change, test result, and task state is safely committed or checkpointed in memory prior to switching.
3. **Adaptive Model Tiering:** Heavy architectural reasoning runs on high-capacity models (`pro`), standard implementations switch gracefully to fast models (`inherit` / `flash`), and high-volume background tasks utilize lightweight models (`flash_lite`).
4. **Transparent Failover:** The system clearly notes the model switch and reason in the execution log without demanding unnecessary user intervention.

---

## 2. Error Signatures Triggering Auto-Switch

The agent automatically intercepts the following errors:

| Error Type | Common Signatures / Codes | Auto-Switch Trigger |
|------------|---------------------------|---------------------|
| **HTTP 429** | `429 Too Many Requests`, `Rate limit reached` | Immediate switch to fallback tier |
| **Resource Exhausted** | `RESOURCE_EXHAUSTED`, `Quota exceeded for quota metric` | Immediate switch to alternative model |
| **Model Overload** | `Model overloaded`, `503 Service Unavailable`, `Capacity exhausted` | Retry once after 2s; if repeated, switch model |
| **Context Window Overflow** | `Context window limit exceeded`, `Maximum tokens reached` | Compact context or delegate next phase to subagent |

---

## 3. The Multi-Model Fallback Matrix

```
       ┌────────────────────────┐
       │   Tier 1: PRO Model    │ (Complex architecture, deep reasoning,
       │ (Deep Logic & Design)  │  multi-file refactors)
       └───────────┬────────────┘
                   │ [Quota Exhausted / 429]
                   ▼
       ┌────────────────────────┐
       │  Tier 2: FLASH / INHERIT │ (Standard implementation, UI design,
       │  (Fast, High Reliability) │  test runs, QA verification)
       └───────────┬────────────┘
                   │ [Quota Exhausted / 429]
                   ▼
       ┌────────────────────────┐
       │ Tier 3: FLASH_LITE     │ (Scratchpad operations, linting,
       │ (High Throughput/Backup)│  syntax verification, reporting)
       └────────────────────────┘
```

### Supported Model Hierarchy in Antigravity

- **`pro`**: Maximum cognitive capacity. Ideal for complex mathematical proofs, deep security audits, and full-stack architecture design.
- **`inherit` (Default)**: Balanced performance, high reliability, matching parent orchestrator context.
- **`flash`**: Ultra-fast execution, low latency, ideal for browser automation, UI testing, and CSS/component iterations.
- **`flash_lite`**: Lightweight, instant responsiveness, ideal for log parsing, formatting, and high-frequency tool fan-outs.

---

## 4. Execution Protocol: Step-by-Step Auto-Switch

When an error signature is detected during subagent execution, swarm tasks, or model calls:

### Step 1: Intercept & Freeze State
- Do not let the command fail abruptly.
- Record the current task status:
  - Last successful file written or modified.
  - Failed step that encountered the quota block.
  - Output or error message received.

### Step 2: Context Checkpoint
- Ensure any unsaved file changes in the workspace are written to disk.
- If using Git, run a quick status check (`git status --porcelain`).
- Formulate a clear, condensed continuation brief specifying:
  - What was accomplished.
  - What exact task is remaining.
  - Clean input parameters.

### Step 3: Perform Model Switch
- **In Swarm Workflows:**
  Use the native `swarm` tool with `action: "model"`:
  ```json
  {
    "action": "model",
    "name": "worker-name",
    "model": "flash"
  }
  ```
- **In Subagent Workflows:**
  Invoke the fallback subagent with the appropriate `Model` parameter:
  ```json
  {
    "TypeName": "self",
    "Role": "Fallback Task Executor",
    "Model": "flash",
    "Prompt": "<Preserved context and remaining task brief>"
  }
  ```

### Step 4: Resume & Verify
- The fallback model resumes execution from the exact checkpoint.
- Run tests (`npm run build`, `npx tsc`) to verify zero regressions.
- Deliver completed output to user with a brief status notice:
  > *"Switched to fallback model (`flash`) due to rate limiting on primary model. All tasks completed with zero interruption."*

---

## 5. Best Practices & Guidelines

1. **Idempotent Operations:** Design all tool scripts and file modifications so that re-running them after a model switch is safe.
2. **Never Discard User Intent:** The user's original requirements, constraints, and project rules remain strictly binding across all model tiers.
3. **Transparent Reporting:** Document which model completed each phase if requested by the user.
