# Multi-Model Fallback Reference Matrix

| Workload Tier | Primary Model | Fallback 1 | Fallback 2 | Use Cases |
|---|---|---|---|---|
| **Tier 1 (Heavy Reasoning)** | `pro` | `inherit` | `flash` | Full architectural overhaul, complex math proofs, database migration plans |
| **Tier 2 (General Development)** | `inherit` | `flash` | `flash_lite` | React component development, Supabase RLS policies, unit tests, CSS styling |
| **Tier 3 (Rapid Execution & QA)** | `flash` | `flash_lite` | `inherit` | Browser QA verification, DOM tree analysis, test execution, log validation |
| **Tier 4 (Lightweight / Utility)** | `flash_lite` | `flash` | `inherit` | Lint checks, file formatting, status summaries, directory tree mapping |

## Auto-Switching Rules
1. **HTTP 429 / Rate Limit:** Switch immediately to the next available fallback model in the row.
2. **Resource Exhaustion:** If Google/Anthropic/OpenAI quota is reached, transition immediately without human intervention.
3. **Preserve Diffs:** Ensure `git status` or file buffers are intact before executing the fallback call.
