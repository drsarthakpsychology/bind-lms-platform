# Workflow: Assessment & scoring
> Verified against `main` @ `b2a9698`.
```mermaid
flowchart TD
  S["Student answers: quiz / game / note checkpoint"] --> L["learn engine: XP, streak, adaptive coach (client + server write)"]
  L --> LP[("learn_progress")]
  S2["Practice: SCT, MSE, OSCE, Formulation, Sim"] --> API["api/practice/*/attempt|turn"]
  API --> AIR["rubric + ai/scoring.ts via AI router"]
  AIR --> T[("*_attempts, sim_scores")]
  T --> COMP["competency map -> competencies / competency_events -> Skills passport"]
  LP & T & PR[("progress: lectures")] --> ST["standing_totals() RPC -> points, level, hours"]
  ST --> LB["Quiz board (weekly XP) + Overall board (all-time points)"]
  T --> AD["Admin review: triage / sim-review / supervision sign-off"]
```
Sources: `src/lib/learn/*`, `src/lib/practice/*`, `src/lib/ai/scoring.ts`, `src/lib/standing/*`, `/api/practice/*`, `admin/{triage,sim-review,supervision}`. Admin corrections to AI scoring: `/api/admin/sim-corrections` → `scoring_corrections`.
