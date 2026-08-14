# PFD Insights Log

Running log of non-obvious findings from every PFD analysis.
Reviewed periodically. Candidates get promoted to `accumulated-learnings.md`;
the rest stay as searchable history.

**Format:**
```markdown
### YYYY-MM-DD: [Brief description of what was analyzed]
**Type:** url | text | image | html | css | copy | directory
**Domain:** [e.g., SaaS landing, ecommerce PDP, email, portfolio, dashboard, presentation]
**Key finding:** [The non-obvious thing PFD surfaced, one sentence]
**Layer(s):** [Which PFD layer(s) this relates to: Foundation/L1/L2/L3/L4]
**Promote?:** yes | maybe | no
**Notes:** [Optional: context, cross-references to prior findings, patterns noticed]
```

---

<!-- New entries go here, newest first -->

### 2026-08-14: PFD Evaluation — VIBHA public front door (landing + /enquire)
**Type:** html
**Domain:** SaaS landing + conversion form (clinical psychology school, invite-only)
**Key finding:** The trust/urgency engine is time-bound — "Cohort One begins 20 August" (6 days out at eval) is the load-bearing L1/L4 element; the hero cohort line, closing CTA, and enquire confirmation are all pinned to a hardcoded BRAND.cohortStart constant with no expiry behavior, so the same honesty that fires activation now goes stale the moment the window closes.
**Layer(s):** L1, L4
**Promote?:** maybe
**Notes:** Cross-ref l006 (Infrastructure ≠ Activation) — the deadline is real infrastructure (actual cohort date, honest scarcity), but needs a post-window state (e.g., "applications closed — join the next cohort" + waitlist path) to keep L4 sincere across the time axis. Also validated: peach never reassigned (pre-attentive priority held), no iso-styled competing CTAs, dot-marker fix removed the competing-01/02/03 parsing load (was an L0/L2 finding from the design-review pass).
