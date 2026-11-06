# VIBHA design intelligence

> **What this is:** the permanent, evidence-based reasoning behind VIBHA's
> interface. It explains *why*. The operational rules stay in
> [UI_RULES.md](../UI_RULES.md), the visual world stays in the `vibha-design`
> skill, and every change passes the
> [Decision Framework](DECISION_FRAMEWORK.md). Sources are in
> [RESEARCH_REFERENCES.md](RESEARCH_REFERENCES.md); codes like **[N4]** point
> to rows there.
>
> **Status key:** **DECIDED** = the owner approved it · **PROPOSED** = a
> recommendation not yet approved or built · **BUILT** = shipped. Nothing
> PROPOSED here exists in the product yet.
>
> First written 2026-11-06 on branch `admin-redesign`. Update this file,
> and the changelog, whenever a design decision changes.

---

## 0. Decisions on record

| Date | Decision | By | Status |
|---|---|---|---|
| 2026-11-06 | Admins use **laptop/desktop, phone and tablet**, so all three are first-class. None is a "fallback". | Owner | DECIDED |
| 2026-11-06 | **Every button is a rounded rectangle.** Pills are kept only for status tags and filter chips. | Owner | DECIDED (not yet built) |
| 2026-11-06 | **Custom certificates for non-students are certificate-only:** an email, a public verify page and a LinkedIn link, with no login. If the email matches a student, the certificate also shows under that student's credentials. | Owner | DECIDED (not yet built) |
| 2026-11-06 | **Badges are awarded automatically** for each completed study module and for milestones. | Owner | DECIDED (not yet built; milestone thresholds still open, see §H) |
| 2026-11-01 | Peach is a fill only, never text on cream; 2px ink borders; hard zero-blur shadows (`vibha-design`). | Earlier sessions | DECIDED, BUILT |

---

## A. Research findings

Each finding: the evidence, then what it means for VIBHA. Tags as in the
references file.

### A1. Attention is a budget, and contrast and motion spend it
- **Evidence:**
  - The first look goes to the area with the highest local contrast in colour, intensity or orientation **[N1]**.
  - A single distinct feature pops out; combinations of features don't **[N2]**.
  - Only a few properties reliably guide attention: colour, motion, size and orientation **[N3]**.
  - Movement that starts captures attention whether the person wants it or not **[N4]**. *Established.*
- **For VIBHA:** each screen gets **one** high-salience element, the thing that needs the admin now.
  - Peach fill, hard shadows, bold weight and motion are all spending attention.
  - The admin home today spends them on stat tiles, cohort cards and to-dos at once, so nothing wins.

### A2. People miss changes they aren't looking at
- **Evidence:** change blindness **[N5]**; short transitions help people track what changed **[P7]**. *Established.*
- **For VIBHA:**
  - When a live count updates, a row saves or a filter removes rows, show a brief, honest change cue: a 400–600 ms highlight, or "3 new" in place.
  - A bigger animation is not the answer.

### A3. Working memory is about four things
- **Evidence:**
  - Capacity is about 4 chunks **[C1]**.
  - Load the interface adds competes with the actual task **[C2]**.
  - Recognising beats recalling **[C7]**. *Established.*
- **For VIBHA:** during "add to cohort, then email them" the admin is holding the people, the cohort, the message and whether a login link is included.
  - These must **stay visible** across the flow, not be remembered from an earlier screen.
  - This is also WCAG 3.3.7 (don't make people re-enter what they gave before) **[S1]**.

### A4. Choice count matters less than choice clarity
- **Evidence:**
  - Hick–Hyman holds for unfamiliar, equally likely options **[C3]**.
  - Practised users find items by memory and position.
  - The "too many choices" effect averages about zero across 50 experiments **[C4]** and appears only under specific conditions: complex options, a hard task, unclear preferences **[C5]**.
  - *Context-dependent.*
- **For VIBHA:** cutting menu items isn't automatically good.
  - Admins visit the same 6–8 places daily, so a **stable** sidebar (things never move) matters more than a short one.
  - Rare tools (Corpus, Calibration) can live behind "More" because they're unfamiliar and rare. That's where Hick–Hyman applies.

### A5. Labels must predict what's behind them ("information scent")
- **Evidence:** people follow labels that predict the content behind them **[C8]**. *Established.*
- **For VIBHA:** answering a student's doubt currently means going to **Teach → Review → Doubts & concerns**.
  - "Review" and "Teach" don't predict "a student is waiting for me", so the scent is weak.
  - This is why doubts feel buried, even though the page exists.

### A6. Big, near targets are faster
- **Evidence:**
  - Time to hit a target grows with distance and shrinks with size **[C6]**.
  - Thumb taps level off at about 9.2–9.6 mm, roughly 44–48 px **[D1]**.
  - WCAG requires at least 24×24 px **[S1]**; Apple uses 44 pt **[S3]**, Material 48 dp **[S4]**. *Established.*
- **For VIBHA:**
  - Frequent actions such as Reply, Message and Add to cohort sit next to the thing they act on, not in a distant toolbar.
  - On touch screens controls grow to 44–48 px.
  - Mouse and trackpad layouts may be denser (32–40 px).

### A7. Interruptions cost more than they seem to
- **Evidence:**
  - Interrupted people speed up but feel more stress **[I1]**.
  - A notification costs attention even if it's ignored **[N9]**.
  - Resuming a task depends on reminders of the goal **[I2]**.
  - Switching tasks costs time **[I3]**.
  - Interruptions hurt least at breakpoints **[I4]**. *Established.*
- **For VIBHA:**
  - Alerts only for things that need action; everything else becomes a quiet count.
  - Never show a toast over someone who is typing.
  - Keep drafts so a reply survives an interruption.
  - Let admins act where they are (reply inline) instead of jumping pages.

### A8. Speed you can feel has thresholds, and honest feedback stretches them
- **Evidence:**
  - About 0.1 s feels instant, 1 s keeps the flow, 10 s is the limit of attention **[P1]**.
  - Without feedback, tolerance is about 2 s **[P2]**.
  - How progress moves changes how long a wait feels **[P3]**.
  - Honest visual treatment makes a wait feel shorter without lying about the value **[P4]**.
  - Skeleton screens are practitioner advice with thin peer-reviewed support **[P5]**.
- **For VIBHA:**
  - **Never fake progress.** No bar creeping forward on a timer, no "almost done" that isn't true.
  - A skeleton is honest only for a short wait. If a load passes about 3 s, the skeleton must turn into words: "Still loading — this is slower than usual."
  - The Medicines page sat on a skeleton for about 22 s because of a server bug (fixed 2026-11-06). The skeleton hid the bug from the owner and the team.

### A9. Animation helps only when it explains a change
- **Evidence:**
  - With equal content, animation usually adds nothing over a good static view **[P6]**.
  - It helps people follow state changes **[P7]**.
  - Movement grabs attention involuntarily **[N4]**.
  - The OS "reduce motion" setting must be respected **[S2]**, and WCAG 2.3.3 recommends it **[S1]**.
- **For VIBHA:**
  - Use the existing motion tokens: 120 ms controls, 200 ms default, 400–600 ms entrances.
  - Motion is for cause → effect: a pressed button, a row appearing where it was added, a panel opening from its trigger.
  - No looping or attention-seeking motion in the admin.
  - Animate only `transform` and `opacity`, which stay smooth on low-power devices.

### A10. Type: size is science, weight is convention
- **Evidence:**
  - Reading speed is flat above a critical print size and drops below it **[T1]**.
  - Line-length evidence is mixed **[T2]**.
  - No reliable study prescribes which weight to use where, so weight rules here are **Convention**, taken from Apple and Material **[S3][S4]**.
- **For VIBHA:** body text 16 px, metadata captions 12–13 px only.
  - **Regular** for reading, **medium** for labels and controls, **semibold** for headings and the one thing to notice, **bold** for big numbers and display text only.
  - When most things are bold, nothing stands out. Today the code has 591 `font-bold` against 720 `font-semibold`.

### A11. Colour carries meaning only with a second cue
- **Evidence:** red–green colour blindness affects a meaningful minority, mostly men **[D2]**; WCAG 1.4.1 and 1.4.11 **[S1]**. *Established.*
- **For VIBHA:**
  - Status is always **dot or icon + word**; the existing `StatusPill` does this.
  - Colour roles stay few: peach = act, terracotta = link and accent text, ink = structure, plus success, warning and danger, each paired with an icon.

### A12. Big step-by-step flows help rare tasks and slow down frequent ones
- **Evidence:**
  - Wizards suit infrequent, linear tasks done by novices (practitioner consensus, **Convention**).
  - WCAG 3.3.7 requires keeping what was entered **[S1]**.
  - The working-memory limit applies **[C1]**.
- **For VIBHA:** sending an email is **frequent** for admins.
  - So it isn't a locked wizard. It's **one page with four visible sections** (Who → Write → Check → Send) and a live preview, with jumping back allowed.
  - On a phone the same sections become steps, with a sticky "who and what" summary.
  - Issuing a custom certificate is **rare**, so a short guided flow fits there.

### A13. One room, many doors
- **Evidence:**
  - Command palettes (Linear, GitHub, Slack) and object pages reached from many places are **observations**, not experiments.
  - They rest on recognition over recall **[C7]** and on fewer task switches **[I3]**.
- **For VIBHA:** more entry points are fine, and the owner asked for them, **as long as every door opens the same room.**
  - Exactly one message composer, one student profile and one add-people form, reached from the palette, the profile, the cohort, the students list and Home.
  - Duplicate forms drift apart, and that drift is what makes things feel "flimsy".

### A14. Rewards should inform, not control
- **Evidence:**
  - Expected, controlling rewards tend to undermine motivation that was already there; rewards that acknowledge competence harm it less (Deci, Koestner & Ryan 1999 meta-analysis, [doi:10.1037/0033-2909.125.6.627](https://doi.org/10.1037/0033-2909.125.6.627)). *Established, with long-running debate about how large the effect is.*
  - Dopamine signals *unexpected* reward **[N8]**; using that in UI is a hypothesis.
- **For VIBHA:** automatic module badges are framed as **recognition of what was done** ("You completed Psychopathology I"), not as a countdown or streak pressure.
  - No near-miss teasing ("1 more to unlock!") on student screens.

---

## B. Design principles

Each principle comes from the findings above. When two principles conflict,
the earlier one wins.

1. **Show the person, then the next step.** Every screen answers "what's the state?" and "what do I do?" before anything else (A1, A5).
2. **One loud thing per screen.** One peach primary action, one salient alert. Everything else is quiet: regular weight, muted, no shadow (A1).
3. **Same shape, same job.** Rounded rectangles act, pills describe, cards contain. A shape never changes meaning between pages (A4, C9).
4. **One room, many doors.** Each job has exactly one component, reachable from everywhere it's needed (A13).
5. **Keep what they told you in view.** Multi-part work keeps earlier choices visible and editable; nothing is re-typed (A3, A12).
6. **Honest time.** Feedback within 0.1 s, a visible state within 1 s, words after about 3 s. Progress is never faked (A8).
7. **Motion explains, never decorates.** Cause → effect only, tokens only, off under reduce-motion (A9).
8. **Interrupt only for action.** Counts are quiet; alerts are rare and wait for a breakpoint (A7).
9. **Meaning never rides on colour alone.** Always a word or icon too (A11).
10. **Dense for admins, gentle for students.** Same tokens, different density: admins scan and act in bulk; students read and learn (A3, C2).
11. **Every input method is first-class.** Thumb, cursor, keyboard and screen reader all work, with no hover-only controls (A6).
12. **Evidence over taste.** Every non-trivial decision names its evidence and tag in the PR or doc ([Decision Framework](DECISION_FRAMEWORK.md) Q25).

---

## C. Current platform assessment (2026-11-06, branch `admin-redesign`)

Measured from the code and from Vercel metrics, not from impressions.
Confidence: **H**igh, **M**edium, **L**ow.

| # | Problem today | Underlying issue | Principle | Direction | Trade-off | Conf. |
|---|---|---|---|---|---|---|
| C-1 | **Buttons:** pills and rounded squares mixed. The `Button` primitive is `rounded-full`; 112 hand-made `<button>`s in admin are split 22 pill / 21 square. | Shape doesn't predict behaviour; no shape rule in code | 3 | Make the `Button` primitive a 10 px rounded rectangle; move hand-made buttons onto `Button` variants; pills only for `StatusPill` and filter chips | Softer look on student screens; one visual migration | H |
| C-2 | **Radius drift:** 7 radius sizes in use (638 `md`, 422 `full`, 290 `2xl`, 153 `xl`, 62 `lg`, 53 `3xl`, 43 bare). Token comments are wrong: `--radius-md` says "6px" but is 10 px; `--radius-lg` says "10px" but is 14 px. The design skill says 10/6/999. | Three sources disagree | 3, 12 | Three radii only: **control 10 px**, **card 14 px**, **pill 999 px**. Fix comments and skill to match; lint the rest | Touches many files; done mechanically | H |
| C-3 | **Two type scales in parallel:** `text-sm` (670) vs `text-small` (574), plus `text-xs`, `text-base`, `text-lg`… | Drift between Tailwind defaults and VIBHA tokens | 2, 12 | Keep only the VIBHA scale (`display/h1–h3/body/small/caption/numeric`); map and lint Tailwind sizes | Mechanical migration | H |
| C-4 | **Weight inflation:** 591 `bold`, 720 `semibold`, 30 `black`. | Emphasis everywhere = emphasis nowhere (A1, A10) | 2 | Regular/medium/semibold/bold rules in §F | Some screens will look calmer and less "punchy" | M |
| C-5 | **Colour bypasses tokens:** 29 raw palette classes and 93 hex literals in components. | Off-system colour can break contrast and dark mode | 9 | Tokens only, enforced by lint | Small | H |
| C-6 | **Doubts are three levels deep** (Teach → Review → Doubts & concerns) and messages live inside each cohort. | Weak information scent (A5); task switching (A7) | 4, 8 | An admin **Inbox** in the top bar, next to the bell, holding unanswered doubts and student replies, with a count. Reply in place. The same reply box appears on the profile and the cohort page | One more top-bar icon; the count must be accurate or it erodes trust | H |
| C-7 | **Add to cohort + email is several pages** (Students → Add → pick cohort → then Messages). | Working-memory load (A3), repeated entry (WCAG 3.3.7) | 4, 5 | One "Add people" panel from anywhere (palette, Students, cohort, Home): paste names → pick cohort → ☑ send login email → done | Panel gets slightly busier; mitigate with sensible defaults | H |
| C-8 | **Student profile (360) feels flimsy:** five tabs with thin content, no summary of "how is this person doing", actions scattered. | No overview; actions far from the object (A6) | 1, 4 | Header = status, cohorts, last seen, progress, flags, **one suggested next step**. Action rail = Message, Add to cohort, Send login link, Issue certificate. Timeline below. Tabs only for deep detail | Header must stay compact on phones | H |
| C-9 | **Filters missing** on Doubts (only cohort), Credentials, Medicines (search only) and Messages. | Recognition over recall (C7) | 1, 11 | One shared `FilterBar` primitive: search + up to 3 dropdown filters + "Clear", kept in the URL | Building one primitive first slows the first page, speeds the rest | H |
| C-10 | **Skeleton hid a 22 s stall** on Medicines; 19 `loading.tsx` skeletons have no "taking longer" state. | Dishonest waiting (A8) | 6 | Skeletons switch to text after about 3 s; server bug fixed | Small | H |
| C-11 | **Server speed:** most admin pages p75 under 1 s on Vercel. `/admin` about 0.9 s; `/admin/cohorts/[id]` about 0.7 s; `/dashboard` (students) about 1.6 s. | Within the 1 s flow threshold for admin; student home is over it | 6 | Measure in the browser next (INP/LCP via Speed Insights) before more server work | — | M |
| C-12 | **Badges:** module badges are checked when the student opens Achievements, not awarded at completion; an unknown rule kind crashed the page (fixed 2026-11-06). | Feedback arrives late (A8) and unreliably | 6 | Award at the completion event, server-side and idempotent; milestones on the same engine | Needs a backfill for students who already completed | H |
| C-13 | **Status chips already done well:** `StatusPill` = dot + label (A11). Motion tokens exist and reduced motion is respected (31 files + global flatten). 48 `tabular-nums` uses. | — | 7, 9 | Keep; extend `tabular-nums` to every numeric column | — | H |
| C-14 | **Borders inside borders:** cards inside bordered panels inside bordered sections on admin pages. | Common-region cue overused (N7), so everything looks like its own group | 2 | Outer containers lose borders or use spacing; borders mark the *unit* (a card, a row group), not every wrapper | Changes the look slightly toward lighter | M |

---

## D. Responsive assessment

Code finding: the layout switches at **one** point, `lg` (1024 px).
- `md:` is used only 32 times, against 359 `sm:` and 200 `lg:`.
- So everything under 1024 px gets the **phone** shell (bottom tab bar), including every iPad in portrait.
- Screenshots taken during the admin redesign at 1366 and 390 px showed no sideways scroll on admin pages. The other sizes below are assessed from the code and still need a screenshot round (Roadmap R-1).

| Device (CSS px) | What happens today | Main problem | Direction (PROPOSED) |
|---|---|---|---|
| **Desktop** 1920×1080, 1440×900 | Sidebar + content | Content stretches; tables get long, sparse rows | Max content width ~1280 for reading pages; tables may use full width with a sticky first column |
| **MacBook Air 13″** 1470×956 · **MacBook Pro 14″** 1512×982 | Desktop shell | Trackpad users get the same hit sizes as mice: fine. Keyboard shortcuts missing | Add shortcuts for frequent jobs (Roadmap R-5) |
| **Windows laptop** 1366×768, or 1920×1080 at **125 %/150 %** zoom (≈1536 or 1280 wide, often only **≈600–650 px tall** after browser chrome) | Desktop shell | **Height**, not width: sticky top bar + page header + sticky bulk bar + filter row can eat about half the screen | Sticky extras only when height ≥ 720 px; compact page headers on short screens |
| **iPad Mini** 744×1133 · **iPad / Air** 820×1180 · **iPad Pro 11″** 834×1210 (portrait) | **Phone shell** with bottom tabs, single column, phone-sized everything | Wastes the width; tables collapse to phone cards; feels like a stretched phone | New **tablet band (768–1023)**: icon rail sidebar, two-column where useful (list + detail), touch-sized targets |
| **iPad Pro 13″** 1032×1376 · any iPad landscape (≥1024) | Desktop shell **with touch** | Hover-only controls (3 found), 32–36 px controls too small for fingers | Size by **pointer type**, not width: `pointer: coarse` raises targets to 44 px |
| **Android tablet** ~800×1280 | Phone shell | Same as iPad portrait; Android Chrome's bottom gesture bar overlaps fixed bars | Same tablet band; respect `safe-area-inset-bottom` |
| **iPhone SE** 375×667 · **iPhone 15/16** 393×852 · **Pro Max** 430×932 | Phone shell; bottom tabs (Home, Students, Activity, Messages, More) | Small height on SE; bulk actions and filters compete for space | Filters collapse into one "Filter (2)" button opening a sheet; bulk bar replaces the tab bar while selecting |
| **Android phones** 360–412 wide | Phone shell | 360 px is the narrowest common width; long names and email addresses overflow chips | Test at 360 and at the WCAG reflow width of 320; truncate the middle of emails, not the end |
| **Zoom 200 % / large text** (any device) | Mostly reflows | Fixed-height chips and tab bars clip text | No fixed heights on text containers; `min-height` instead |

> **Update 2026-11-06 (branch `agent/mobile`), BUILT on the student shell:** tablets (768-1023) get the icon rail and a sticky top bar instead of bottom tabs; `pointer: coarse` raises shared controls to 44 px; `tall:`/`short:` variants (720 px) gate extra sticky bars and compact headers; the study reader is two-column from 768. Screenshots still owed: [RESPONSIVE_CHECKLIST.md](RESPONSIVE_CHECKLIST.md).

**Most important responsive problems, in order:**
1. Tablets get the phone shell.
2. Short laptop screens lose space to sticky layers.
3. Touch on large screens (sized by width instead of pointer).
4. Filters and bulk actions on phones.

---

## E. VIBHA design philosophy (PROPOSED)

> **"Calm until someone needs you."**

VIBHA is a school about minds, run by a small team. The interface should
behave like a good clinical supervisor: quiet, clear about what matters,
honest about uncertainty, and fast to act when someone is waiting.

- **The world stays.** Neo-Brutalist Pastel (cream, ink, peach, hard shadows) is the brand and isn't up for replacement. What changes is *discipline inside it*.
  - Peach, hard shadows and bold weights become scarce, so they mean something again.
- **Shape grammar.** In a brutalist world shape is loud, so it must be consistent:
  - **rectangle = do** (buttons, inputs)
  - **pill = is** (status, tag, filter)
  - **card = holds** (one unit of content)
- **People before pages.** Admins think in people ("Is Priya okay? Did she get her login?"), not in modules. Every person-shaped thing (a row, a doubt, a submission, an email) links to the same profile, and every profile can act.
- **Honesty is a visual property.** No fake progress, no inflated counts, no "unlock" teasing. If something is slow or broken, the screen says so in plain words.
- **Admins get density, students get breathing room.** Same tokens; the admin uses compact rows, more columns and keyboard shortcuts; the student side keeps generous spacing and one idea per screen.

---

## F. Design-system direction (PROPOSED unless marked)

### Standardise (one way only)

| Area | Rule | Why |
|---|---|---|
| **Shape** | `control` 10 px (buttons, inputs, selects); `card` 14 px (cards, dialogs, sheets); `pill` 999 px (StatusPill, tags, filter chips, avatars). Nothing else. | C-1, C-2; owner decision 2026-11-06 |
| **Buttons** | Variants: `primary` (peach, one per screen), `secondary` (outline), `ghost`, `destructive`. Sizes: `sm` 32 px (mouse only), `md` 40 px (default), `lg` 48 px (touch primary). `pointer: coarse` raises everything to at least 44 px. | A6, UI_RULES §4 |
| **Type scale** | Only `display, h1, h2, h3, body (16), small (14), caption (12–13), numeric`. No raw `text-sm/xs/lg`. | C-3 |
| **Weights** | Regular 400 = reading text · Medium 500 = labels, nav, table headers, controls · Semibold 600 = headings, the one emphasised value · Bold 700 = big numbers, display · Black 900 = landing page only. | A10 (Convention) |
| **Numbers** | `tabular-nums`, right-aligned in tables; units in captions. | C-13 |
| **Colour roles** | peach = act · terracotta = link/accent text · ink = structure · success/warning/danger/info, each **with an icon**. Tokens only. | A11, C-5 |
| **Status** | Always `StatusPill` (dot + word). | A11 (BUILT) |
| **Motion** | Existing tokens: 120 / 200 / 400 / 600 ms; transform/opacity only; reduced-motion = instant. Allowed: press, open/close, insert/remove, change highlight. Not allowed: loops or attention-seeking motion in admin. | A9 (BUILT tokens) |
| **Waiting** | Under 1 s: nothing. 1–3 s: skeleton or inline spinner. Over 3 s: words + what's happening. Real progress only if the real fraction is known. | A8 |
| **Shared primitives to build** | `FilterBar`, `DataTable` (sticky header, row actions visible on touch, stacked rows < 640 px), `Composer` (one message editor), `PersonHeader`, `AddPeoplePanel`, `EmptyState`, `SlowState` | A13 |
| **Governance** | Lint rules for raw colours, hex values, Tailwind type sizes and off-scale radii. The Decision Framework goes in the PR template. Token changes go through this file + the changelog. | Principle 12 |

### Keep flexible

- Landing and marketing pages: the stamp, the serif accent, editorial layouts and display type (already governed by `vibha-design`).
- Page layouts: list + detail, single column, dashboard grid. Pick per task, not per section.
- Illustrations and empty-state art.
- Density per surface (admin compact, student comfortable).

---

## G. Opportunities and trade-offs

| Problem | Option 1 | Option 2 | Option 3 | Recommendation |
|---|---|---|---|---|
| Fast access to doubts and replies | **Top-bar Inbox** (count + drawer, reply in place) | A sidebar section "Inbox" | Doubts card on Home only | **1, plus 2 on phone tabs**: reachable everywhere, one tap; Home shows the count too |
| Add people + email | **One panel from anywhere** | A dedicated step-by-step page | Keep current pages, add links | **1**: frequent task, keeps everything in view (A3, A12) |
| Sending an email | **One page, four visible sections + live preview** | Locked 4-step wizard | Single form, no preview | **1** on desktop/tablet; steps with a sticky summary on phone |
| Student 360 | **Header summary + action rail + timeline**, tabs for depth | Single long scroll | Keep five tabs, fill them | **1**: overview first, depth on demand |
| Module badges | **Award at the completion event** (server action when the last requirement is met) | Nightly batch | When the student opens Achievements (today) | **1** + a one-time backfill; 2 is simpler but feedback is late |
| Custom certificate data | **`credentials.user_id` nullable + recipient name/email/phone/reason** | A separate `external_credentials` table | Create hidden "guest" accounts | **1**: one verify page, one list, one PDF path. Needs a DB migration (owner approval) |
| Tablets | **Tablet band with icon rail** | Treat tablets as desktop | Keep phone shell | **1**: uses the width, keeps touch sizing |
| Button shape | Rounded rectangle (**DECIDED**) | Pills | — | Done by owner; pills keep the "soft" feel on status tags |

---

## H. Open questions for the owner

Each one changes what gets built. Answer whenever convenient; work that doesn't depend on them can start.

1. **Milestone badges: which milestones?** For example XP 500 / 1,000 / 2,500 and watch time 10 / 25 / 50 hours, or something tied to the course. *Why it matters:* too many milestones turn recognition into pressure (A14); too few feel arbitrary.
2. **Replying to a doubt: should the student also get an email, or only an in-app notice?** *Why:* every email is an interruption (A7). Suggestion: in-app always, email only if they haven't opened VIBHA in 24 h.
3. **Custom certificates: whose signature and title go on them, and should the "what they did" paragraph be visible on the public verify page?** *Why:* the verify page is public, and the paragraph may describe a person's volunteer work in detail.
4. **Order of work: admin screens first, then the student side, or both together?** *Why:* the shape and type changes touch both; doing admin first is safer, doing both avoids two looks living side by side for a while.

---

## I. Implementation roadmap (PROPOSED, nothing below is built unless marked)

### Immediate UX improvements
- **BUILT 2026-11-06:**
  - Medicines list ~22 s → ~0.1 s (knowledge base parsed once)
  - `/achievements` crash fixed
  - admin search no longer loads the full roster on every page
- **R-0** Button primitive → rounded rectangle; hand-made admin buttons moved onto `Button` variants.
- **R-0** Top-bar **Inbox** for admins (unanswered doubts + student replies), reply in place; "Reply to doubts" and "Message…" in the ⌘K palette.
- **R-0** **Add people** panel from anywhere: cohort picker + "send login email".
- **R-0** `FilterBar` on Doubts, Messages, Credentials, Medicines.
- **R-0** "Taking longer than usual" state for every skeleton after 3 s.

### Responsive improvements
- **R-1** Screenshot round at all §D sizes (1920, 1470, 1366 @125 %, 1280 × 600, 1032, 834, 820, 744, 800, 430, 393, 375, 360, 320, plus 200 % text).
- **R-1** Tablet band 768–1023 with icon rail; `pointer: coarse` target sizing; remove hover-only controls.
- **R-1** Short-height rule (sticky extras only ≥ 720 px tall); phone filter sheet; bulk bar replaces tab bar while selecting.

### Structural improvements
- **R-2** Student 360: `PersonHeader` (state + next step) + action rail + timeline; doubts and messages for that person on the profile.
- **R-2** One `Composer` used by profile, cohort, students bulk and Inbox; email = one page with four sections + preview.
- **R-2** Automatic module badges at completion + milestone badges + backfill.
- **R-2** Custom certificates for anyone: name, email, phone, paragraph → PDF, email, public verify page, LinkedIn "Add to profile" link, shown under the student's credentials when the email matches. *Needs a DB migration.*

### Design-system improvements
- **R-3** Three radii, one type scale, weight rules, tokens-only colour; fix token comments and the `vibha-design` skill to match.
- **R-3** Lint rules (raw colours, hex values, Tailwind sizes, off-scale radii) + Decision Framework in the PR template.
- **R-3** `DataTable`, `EmptyState`, `SlowState` primitives; borders only on units (C-14).

### Advanced interaction improvements
- **R-4** Keyboard shortcuts for frequent jobs (go to Students, reply, message), shown in the palette.
- **R-4** Saved filters ("my cohort's open doubts"); undo toasts for reversible actions instead of confirm dialogs.
- **R-4** Optimistic replies and sends (instant on screen, confirmed or rolled back honestly).
- **R-4** A brief change highlight for live updates (A2).

### Long-term opportunities
- **R-5** In-browser speed measurement (Speed Insights: INP ≤ 200 ms, LCP ≤ 2.5 s) as a release check.
- **R-5** Small usability rounds with 3–5 admins and students per change cycle **[U1]**.
- **R-5** Devanagari/Hindi type review if Hindi content grows.
- **R-5** Export tokens in the W3C DTCG format **[S9]** only if another tool needs them.

---

## Maintaining this document

- Add findings with a reference row and a tag; never present a Convention or Hypothesis as Established.
- When a PROPOSED item ships, mark it BUILT with the date and link the PR.
- When the owner decides something, add it to §0.
- Open research questions: how VIBHA admins actually split time across devices (measure with analytics); whether module badges change completion rates (compare cohorts, don't assume).
