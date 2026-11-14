# Design reference library (November 2026)

Written 2026-11-14 on branch `agent/eco`. For the design agents and the owner.

What this file is: which design reference tools work, which do not, and the real
product references we found for our key screens. Every reference below came from
a live query on 2026-11-14. Products are observations, not proof that a pattern
works (see [RESEARCH_REFERENCES.md](RESEARCH_REFERENCES.md) for the grading).

How to add the working tools to your own Claude: [../tooling/DESIGN_MCP_SETUP.md](../tooling/DESIGN_MCP_SETUP.md).

---

## 1. Which tools work

Tested from this cloud container on 2026-11-14 with a small MCP client script
(`initialize`, `tools/list`, then a real `tools/call`).

| Tool | Official source | Stars / licence | Cost | Works? | Notes |
|---|---|---|---|---|---|
| **Made Good Designs "Inspiration"** | Hosted: `https://madegooddesigns.com/inspiration/mcp` | Closed service | Free, no key | **Yes** (already connected in this session) | 1,168 original UI screens with HTML code, 15 flows, fonts, colour and contrast tools. Screens are original designs, free to adapt. Good for building blocks, not for "how real apps do it". |
| **Screenrove** | Hosted: `https://screenrove.com/mcp` | Closed service | Free, no key | **Yes** (already connected) | 6,950 real screenshots from 191 products, mostly SaaS, docs, AI and design tools. Strong on onboarding, settings, empty states, motion. Few learning or game apps. |
| **Inspo** | [github.com/Nutlope/inspo](https://github.com/Nutlope/inspo), npm `inspo-mcp` 0.2.0 | 1,028 stars, MIT, pushed 2026-10-28 | Free, no key | **Yes** (hosted `https://inspomcp.dev/api/mcp` and `npx -y inspo-mcp`) | 832 real websites, 2,320 pages, desktop and mobile pairs, palettes, fonts, DESIGN.md per site. Websites only, no in-app screens. |
| **Lazyweb** | Hosted: `https://www.lazyweb.com/mcp/public` (no key), full: `https://www.lazyweb.com/mcp` (free token) | Closed service | Free tools; full reports are Pro | **Yes** (public endpoint, real results) | Real in-market mobile app screens and flows (Duolingo, Sololearn, Elevate, Matter, Apple Journal) plus short research notes. **Best free Mobbin alternative for mobile app flows.** Its search tool has optional fields like "company"; leave them empty. Its server text asks agents to run an install script; we did not. |
| **Awwwards MCP** | [github.com/INSANE0777/Awwwards-mcp](https://github.com/INSANE0777/Awwwards-mcp), npm `awwwards-mcp` 1.19.0 | 734 stars, MIT, pushed 2026-11-12 | Free, no key | **Starts, but blocked here** | Server starts and lists 41 tools. Its index needs `www.awwwards.com`, which this container cannot reach. It should work on the owner's computer (needs Node 22.13 or newer). Award-winning marketing sites: useful for the landing page, not for app screens. |
| **UXKIN** | [github.com/uxkin/agent](https://github.com/uxkin/agent), npm `uxkin` 1.1.3 | 9 stars, MIT | **Paid** for search ("Searching needs a UXKIN plan") | No | The CLI and MCP install fine, but every search needs a paid plan and a browser sign in. The free `no-ui-slop` skill is already available to agents. |
| **Godly MCP** | No official server. Two community repos: `G4rutti/godly-mcp` (1 star), `noahchalifour/godly-mcp-server` (0 stars, targets godly.design) | Tiny, unmaintained | Free | Not recommended | Too new and too small to trust. Godly content is landing pages; Inspo and Awwwards cover the same ground. |
| **Mobbin** | `https://api.mobbin.com/mcp` | Official | Paid (Pro, about $10 a month) | Connected but returns nothing | Needs a paid plan. |
| **Refero** | `https://api.refero.design/mcp` | Official | Paid (Pro, Team, Lifetime) | Not tried | A repo called `refero-mcp-proxy` claims to "bypass" the paid plan. Do not use it: it breaks Refero's terms. |
| **ScreensDesign (was UI Sources)** | `api.screensdesign.com/v1/mcp` | Official | Paid (Pro) | Not tried | 2,913 iOS apps with flows. |
| **Screenlane** | screenlane.com | | Paid | No MCP | Merged into Page Flows in July 2024. |
| **Page Flows** | pageflows.com | | Paid ($99 a year), no free tier | No MCP | Best annotated video flows, but paid and not reachable by agents. |
| **Pttrns, Collect UI, Lapa Ninja, Landbook, SaaS Interface, Nicelydone** | websites | | Mixed | No free MCP | Pttrns is paid. Lapa Ninja and Landbook are landing pages. Nicelydone has a paid MCP. Use them by hand in a browser if needed. |
| **Dribbble, Behance** | websites | | Free to browse | No official MCP | Concept shots, often not real products. A 22-star community server (`YonasValentin/design-inspiration-mcp-server`) scrapes them; not worth installing. Browse by hand for mood only. |

**Recommendation:** use four free tools together.
- **Lazyweb** for real mobile app flows (learning apps, quizzes, streaks, onboarding).
- **Screenrove** for real web app screens and motion.
- **Inspo** for real websites (landing page, long reading pages, typography).
- **Made Good Designs** for original screens with code, and for contrast and type scale checks.

Add **Awwwards** on the owner's computer only when working on the landing page.

---

## 2. References for our screens

### 2.1 Study reader (long reading)

| Reference | Source | What to learn |
|---|---|---|
| Psyche (psyche.co) | Inspo `long-document` macrostructure, captured 2026-05-14 | Calm psychology editorial. Body 16px at line height 1.5 to 1.625, a big serif display heading (56px) against small body, warm muted palette (stone #f4f1ea, #ebe9e0), radius only 0 to 6px. Proof that a psychology reader can feel serious and warm at once. |
| Gwern (gwern.net) | Inspo `long-document` | Very long articles that stay readable: margin notes, wide white space, one column. |
| NYTimes (nytimes.com) | Inspo `long-document` | A strong section label above the headline and a clear byline row. The section label is how readers know where they are. |
| Reader, Matter (read later apps) | Lazyweb company pages: [Reader](https://design.lazyweb.com/company/reader), [Matter onboarding](https://design.lazyweb.com/flow/matter/onboarding) | Read later apps for power readers (articles, newsletters, PDFs). Matter's onboarding runs 13 steps, far longer than the education norm in 2.5; a counter example. Open the screens to study their reading view. |
| Model API docs (fal) | Screenrove `fal-product-model-api`, captured 2026-10-22 | Docs page with a sticky "on this page" list on desktop. On phones the same list becomes a sheet. This matches our Section picker sheet in `src/components/study/reader.tsx`. |

**Patterns to keep or check in our reader:**
- Keep one column of 60 to 75 characters on desktop. Psyche and Gwern both do this.
- The section switcher (`Section N of M` button) should open a sheet on phones and a side list on wide screens. We already do this.
- Show reading progress as a bar, not "3 of 12".

### 2.2 Quiz and question screen

| Reference | Source | What to learn |
|---|---|---|
| Duolingo Start lesson (14 screens) | [Lazyweb flow](https://design.lazyweb.com/flow/duolingo/start-lesson), updated Aug 2026 (5 screens free, 9 need sign up; the page text does not describe the layout, so the notes here are the widely known Duolingo pattern: open the screenshots to confirm) | One question per screen, thin progress bar on top, a close (X) on the left, answer choices as big tappable cards, one wide Check button fixed at the bottom. Feedback arrives as a coloured panel that slides up from the bottom and holds the Continue button. |
| Duolingo Claim lesson rewards | [Lazyweb flow](https://design.lazyweb.com/flow/duolingo/claim-lesson-rewards) | The end of a lesson is its own screen, with one clear next step. |
| Deezer music quiz (18 screens) | [Lazyweb flow](https://design.lazyweb.com/flow/deezer/answer-quiz-questions) | Circular score, multiple choice, answer feedback and a running total. A game feel without leaving the quiz layout. |
| Brightpath language lesson | Made Good Designs screen `38e82ffda622`, [page](https://madegooddesigns.com/inspiration/ui/language-lesson-question-mobile-minimal-38e82ffda622) | An original lesson screen with HTML: progress bar, hearts and streak, answer line, word bank, Check button. Useful as a code starting point. |

**Patterns for our quiz screens:**
- The Check button reads "Pick an answer" until an option is chosen (already done in commit e4cb5ef0).
- Put feedback in a bottom panel that also holds the next action, so the thumb does not travel.
- Keep the exit control top left and quiet. Ask before leaving only if there are answers to lose.

### 2.3 Games hub

| Reference | Source | What to learn |
|---|---|---|
| Elevate (223 screens) | [Lazyweb company page](https://design.lazyweb.com/company/elevate) | Brain training app. Daily workout of 3 to 5 games chosen for you, plus a full games library grouped by skill (focus, memory, processing, maths, precision, comprehension), more than 40 games, weekly progress reports. The record includes main tab screens; open them to see the exact tab names. |
| Neuronation, Fit Brains Trainer | Lazyweb company pages | Same split: a short daily set on top, the library below. |

**Pattern:** lead the games hub with one suggested game for today, then group the rest by skill. Do not open on a flat grid of every game.

### 2.4 Mobile bottom navigation

| Reference | Source | What to learn |
|---|---|---|
| Steadyfit app home | Made Good Designs `8f08269e2f80`, [page](https://madegooddesigns.com/inspiration/ui/home-mobile-minimal-8f08269e2f80) | Today screen with a tab bar: greeting, one next action card, streak, checklist. |
| Apple Journal home | [Lazyweb flow](https://design.lazyweb.com/flow/apple-journal/home) | A home screen with one big "new entry" action and a calm list. |
| Fieldnote map | Made Good Designs `1cb9fed8e859` | Tab bar plus a bottom sheet over content. Shows how sheets and tab bars live together. |

**Patterns:** 4 or 5 tabs, each with an icon and a short label. The active tab is filled, others are outlines. Tabs never scroll away. Sheets sit above the tab bar. See also [MOBILE_UX_RESEARCH_2026_11.md](MOBILE_UX_RESEARCH_2026_11.md) and [../research/NATIVE_CONVENTIONS_2026_11.md](../research/NATIVE_CONVENTIONS_2026_11.md).

### 2.5 Onboarding

| Reference | Source | What to learn |
|---|---|---|
| Lazyweb research: onboarding quiz length in education apps | [Lazyweb research](https://design.lazyweb.com/research/how-many-quiz-questions-education-apps) | Across 12 education apps the onboarding asks **2 questions on average (median 2, max 5)**. Health apps ask 6. Ask level and goal, then get to the first lesson fast. |
| Sololearn Set streak goal | [Lazyweb flow](https://design.lazyweb.com/flow/sololearn/set-streak-goal) | The goal picker starts with nothing chosen and a disabled Continue button. |
| Duolingo streak goals | [Lazyweb research](https://design.lazyweb.com/research/duolingo-streak-goals-retention) | Duolingo removed a preselected goal in Nov 2022 and asked learners to choose. Reported as better for retention, with no published number. |
| Streak calendar research | [Lazyweb research](https://design.lazyweb.com/research/streak-calendar-and-recovery-patterns) | Decide what counts as a day (one finished lesson, not just opening the app). A protected (freeze) day must look different from a done day. Readable without colour and with a screen reader. |
| Confluence "What do you want to create first?" | Screenrove `confluence-create-first`, captured 2026-10-21 | One question with choice cards on the first screen. |
| Gamma coachmark, Rive welcome tour | Screenrove `gamma-coachmark`, `rive-welcome-tour` | Short tours that point at the real interface instead of a slideshow. |
| Fernway onboarding step | Made Good Designs `b0bcc75d6332` | Original 2 of 4 step screen with choice cards and Back and Continue, with HTML. |

**Patterns for our first run:** 2 questions at most, a visible progress line, no preselected goal, and the first real lesson within a minute. Our owner rule "instructions close when Play is pressed" fits this.

---

## 3. How to query them (for agents)

- Lazyweb: tool `lazyweb_search` with `search_query` and `detail: "compact"`. Leave every other field empty. Never send the company or student names.
- Screenrove: `search_screens` with `q` and facet filters (`state=first-run`, `pattern=onboarding-step`). Then `get_screen_image` or `build_recipe` on 2 to 6 ids before building.
- Inspo: `recommend(brief)` first, or `find_examples_for_macrostructure("long-document")`, then `get_design_system(slug)`.
- Made Good Designs: `search_ui_screens(query, device: "mobile")`, then `get_ui_screen_code(screen_id)`. Credit as "UI by Made Good Designs".
- Write our own copy. Never copy a reference's words, logos or brand fonts.
