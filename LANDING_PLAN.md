# LANDING PLAN — VIBHA School of Psychology

## 1. Brand interpretation
VIBHA = a serious, modern, Indian psychology-training product. Visually: the
LMS's neo-brutalist pastel language (cream paper, ink borders, hard shadows,
peach accent) applied to a premium public front door. Verbally: confident,
academic, human, practical — zero marketing fluff, every claim sourced from the
product or from Kavya's stated facts.

## 2. Visual direction — three concepts considered
1. **Abstract cognitive structure** — ink nodes and connections drawn on cream,
   restrained motion. Rejected: risks reading as "neuroscience decoration" (the
   brief forbids brain imagery), and a network graph is the most template-looking
   of the three.
2. **Layered case fragments** — offset cards with hard shadows showing a
   *presenting complaint*, an *observation*, and a *formulation*: an abstraction
   of the actual product. **CHOSEN.** Strongest brand-consistency (it is the
   LMS's card + shadow language), most psychology-specific (the case is the unit
   of everything this product does), built entirely from existing tokens.
3. **Pure typographic** — very large type, one moving element. Rejected: lowest
   risk and highest performance, but too close to a generic "big type" startup
   template; does nothing to show what the school actually does.

## 3. Information architecture
Nav → Hero → Problem & philosophy → Three core ideas → Who is building this →
Closing CTA → Footer. Six sections, minimal.

## 4. Section purpose
- **Hero**: 30-second answer — what this is, why it exists, what to do next.
- **Problem & philosophy**: the founding observation (describe vs practise),
  editorial, no feature list.
- **Three core ideas**: Learn / Experience / Apply — the shape of the method,
  asymmetric editorial layout (not cards).
- **Who is building this**: mission + VIBHA Healing Centre + Dr. Sarthak Dave
  (MBBS, MD Psychiatry) as clinical lead. No invented stats/faculty/outcomes.
- **Closing CTA**: one line, both buttons, honest "we'll be in touch" expectation.

## 5. Copy direction
Tone: intelligent, confident, human, concise. Central claim (defensible):
*Indian psychology graduates finish their degrees able to describe therapy and
unable to practise it — this school exists to close that gap.* Banned phrases
avoided. Hero headline drafted from the product's raw material (cases), not from
self-help vocabulary.

## 6. CTA strategy
- Primary `Enquire` → `/enquire` (real: table + server action, rate-limited,
  honeypot, zod-validated). Honest confirmation: "We'll be in touch. Cohort One
  begins 20 August."
- Secondary `Login` → `/login` (existing, untouched).
- No fake routes.

## 7. Responsive
Mobile-first. Hero cards recompose below the headline (not squeezed beside it).
Nav collapses to a full-screen sheet. Section layouts collapse asymmetric
columns to a single column at < 768px. Tested at 320/375/390/430/768/1024/1280/
1440/desktop.

## 8. Animation
`motion`, already installed. Hero entrance (fade + 8px rise), scroll reveals for
section headers, subtle card float (2px, long period), hover lift on CTAs.
`prefers-reduced-motion: reduce` disables transform/opacity animation entirely —
page must look excellent static.

## 9. Component reuse map
- **Reused**: `Button` (buttonVariants), `Badge`, `Sheet` (mobile menu),
  `Input`, `Textarea`, `Label`, sonner (toast), all design tokens.
- **Extended**: none.
- **New (built on tokens)**: `landing-hero`, `landing-section` (reveal wrapper),
  `landing-nav`, `landing-footer`, case-fragment card, mobile menu. No external
  component library imported — the design language is custom and small.

## 10. Accessibility
One `h1`. Semantic sections/headings. Keyboard-navigable nav + mobile sheet
(focus trap, Escape closes). Visible focus rings. Contrast ≥ 4.5:1 on body text.
Reduced-motion respected. Alt text on any image (no stock images planned).

## 11. SEO
Title + description from `BRAND`. Open Graph + Twitter card metadata, canonical
URL, favicon (VIBHA mark). `robots.txt`: allow `/` + `/enquire`, disallow
`/dashboard`, `/admin`, `/practice`, `/courses`, `/reflect`, `/wall`, `/tools`,
`/api`. Verify `(dashboard)` layout carries `noindex`; add if missing. No
fabricated claims.

## 12. Performance budget
Server components by default (only nav/sheet interactivity is client). No images
to ship (typographic + CSS hero). Target LCP < 2.5s; Lighthouse run and numbers
recorded in NIGHT_LOG.

## 13. Routing changes
- `src/app/page.tsx` — anonymous → landing component; authenticated → /dashboard.
- `src/app/enquire/page.tsx` — new.
- `src/app/admin/enquiries/page.tsx` — new (admin-guarded by existing layout).
- `enquiries` table + RLS + server action.
- No changes to proxy.ts, guards.ts, session.ts, or any (dashboard) route.

## 14. Authentication preservation
Entry-point redirect keeps `getSession()`. Layout guards unchanged. Test matrix:
logged-out → landing; logged-in → /dashboard; /login + every (dashboard) route
behaviourally identical. This is structural (guards live in layouts, not page.tsx).

## 15. Deployment verification
lint + tsc + test + build green. Then `next start` / dev server, actually render
each route authenticated + unauthenticated, check no console/hydration errors,
responsive at 9 widths, reduced-motion, Lighthouse. Fix what breaks.

## 16. Faculty data model (for later)
`faculty: Array<{ name, role, credentials, shortBio, photo, specialty }>` —
defined as a type + an empty constant so a faculty section can be added and
populated without restructuring. Rendered nowhere (no placeholder humans).
