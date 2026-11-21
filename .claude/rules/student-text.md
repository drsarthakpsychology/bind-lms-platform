---
paths:
  - "src/**/*.{ts,tsx,md,mdx,json}"
  - "content/**/*"
  - "apps/mobile/src/**/*.{ts,tsx,json}"
---

# Text students see (owner rules)

- Direct, plain words. No meta or "how this works" text.
- No em dashes or en dashes anywhere. Use a comma, a full stop or "to".
- No exam names (CUET, UGC NET and the like) and no citations in student text.
- No small counts that make content look thin ("10 questions").
- How-to lines show once per section: `src/components/help/once-hint.tsx`.
  Instructions close when Play is pressed: `src/components/help/how-to.tsx`.
- Clinical facts (drugs, doses, diagnoses) must be right. When unsure, ask the
  `clinical-checker` agent to review instead of guessing.
