# Design pass, November 2026: the front door

Area: everything a visitor or new student sees before the dashboard (homepage,
/free, /waitlist, /policies, /login, /setup, /set-password, /expired, /paused,
/verify, not found, error) plus /settings. Branch `agent/dzfront`.

The committed world in code is the four-colour system in `globals.css`
(blue #1d44d8 brand, lime #cdf24b action fill, white, ink; 2px ink borders,
hard zero-blur shadows). The `vibha-design` skill still describes the older
peach world; the code wins, so every change here uses the blue/lime tokens.
"Gummble" in the owner's brief was read as Gumroad (the best-known
neo-brutalist product); its screens were used for structure only.

Screenshots: `/tmp/claude-0/-home-claude/1ec55112-adfe-5420-9ed7-32620d412cb4/scratchpad/dzfront-shots/`
(`before/`, `after/`, `wip/`, `matrix/`). Names are `<screen>-<width>-<theme>.png`.

## Worst problems found (before)

| # | Problem | Where |
|---|---|---|
| 1 | Laptop nav button read "Request an invitation Apply": the phone label also showed, because `.btn > span[aria-hidden]` outranked `.ctaShort`. Live on every laptop. | `components/home/home.module.css` |
| 2 | The page every main button lands on said "Cohort One" and "Join the waitlist" while the homepage says Cohort Two, first week of December 2026. Its success message and nav sheet also said Cohort One. Trust killer. | `app/waitlist/*`, `components/landing/landing-nav.tsx` |
| 3 | On phones the invitation form started ~530px down, under a lede and three steps that repeated each other ("Tell us who you are" twice). Triple "Invite-only" (eyebrow, sheet label, stamp). | `app/waitlist/page.tsx` |
| 4 | Footer "About" pointed at `#about`, which exists on no page. Waitlist nav "About" too. | `components/site/site-footer.tsx`, `landing-nav.tsx` |
| 5 | Phone hero: cohort pill wrapped to two lines; two equal full-size buttons competed; eight draggable stickers blocked page scrolling when a thumb started on one (`touch-action: none`). | homepage hero |
| 6 | Phone homepage was 32,500px: eight full-width faculty cards, 18 module cards (~3,500px), a single-column footer. | homepage |
| 7 | Faculty (team) appeared as one block, no pacing, so names did not register. | homepage faculty |
| 8 | Access expired / paused: the only action was an outline "Back to sign in" boxed in a card; copy said "contact your administrator" with no way to do it; footer sat inside page padding. | `app/expired`, `app/paused` |
| 9 | Broken setup or password link: "Ask your administrator" (set-password) or a hand-made pill link (setup); no way to get a new link. Set-password used a different layout from login/setup; success shown as a yellow warning. | `app/set-password`, `app/setup` |
| 10 | Policies index: no header at all, fourteen identical cards each with a decorative rule; em dashes in summaries and text. | `app/policies/page.tsx`, `content/policies/*.md` |
| 11 | Root 404 and error page: a lone icon on a blank page, no brand. | `app/not-found.tsx`, `app/error.tsx` |
| 12 | /free: "6 validated self-checks", "5 calm exercises", "N questions" on each card (owner rule: no thin counts). | `app/free/page.tsx` |
| 13 | Settings repeated the menu (Courses, Wall) and the email (twice), hid Accessibility in a grey fold. | `app/(dashboard)/settings/page.tsx` |
| 14 | Footer links 17px tall (site) and 23px (free tools): under the 24px minimum. | footers |
| 15 | Phone held sideways (844x390): the hero headline filled the screen. | homepage hero |

## References used (structure only, never words or brand)

Screenrove (captured dates as listed by the service):

| Screen id | Product | Captured | Taken for |
|---|---|---|---|
| `gumroad-signup` | Gumroad | 2026-10-22 | one form card, one primary button, hard edges |
| `whimsical-signup` | Whimsical | 2026-10-21 | short headline then form above the fold; terms right above the button; quiet sign-in link |
| `hotjar-signup` | Hotjar | 2026-10-22 | pitch beside form on laptops, form first on phones |
| `linear-email` | Linear | (check_my_ui match) | quiet secondary link under the primary action |
| `duolingo-signup-age` | Duolingo | (check_my_ui match) | full-page single-task form with terms near the action |
| `plane-404` | Plane | 2026-10-21 | centred status block, one action |
| `tldraw-file-not-found` | tldraw | 2026-10-21 | keep the brand header on not-found |
| `raindrop-404` | Raindrop.io | 2026-10-22 | quiet second way on under the main button |
| `grammarly-product-account`, `gumroad-product-profile`, `superlist-settings-profile` | Grammarly, Gumroad, Superlist | 2026-10-21/22 | settings = identity + preferences, nothing else |
| `duolingo-marketing-home`, `duolingo-marketing-super` | Duolingo | 2026-09-24 | education landing: one CTA per screen, playful but legible |

`check_my_ui` on the rebuilt invitation page returned Linear, Vercel, Duolingo
and SurveyMonkey sign-up screens; all keep one primary action and put legal
consent next to it, which the rebuild now does.

Motion: `get_motion_guidelines` (Screenrove) and `suggest_polish` for the
faculty grid, tap cards, submit button, success state and swipe rows.
Guidelines say UI list staggers 30 to 50ms with a 400ms cap. The faculty
section is reading, not UI feedback, and the owner asked for time to take in
each person, so it deliberately uses 560ms per item, 110ms apart, one trigger
for the whole list (about 1.4s for eight people). Everything else stays in
the 150 to 400ms band; reduced motion renders in place.

## What changed, per screen

- **Homepage**: nav label bug fixed. Phone hero: one-line cohort pill, the
  invitation is the only full-width button (fees becomes a 48px underlined
  link), topic chips and quick answers become snap swipe rows; sticker drag
  only with a mouse. Faculty: lead card first, then each person in turn;
  two per row on phones. 18 modules fold to four plus "Show all 18 modules"
  on phones. Footer two columns on phones. Sideways phones: headline sized
  to the screen height. Phone page: 32,542px to 28,801px.
- **/waitlist** (rebuilt): title "Request an invitation" (matches the button
  that leads here), cohort/dates/steps/phone from the homepage content file,
  form first on phones, one column, keyboard hints, "You are" as four tap
  cards, terms beside the button, sending/error/done states with focus moved.
  Quiet header (Sign in, theme) instead of the old landing menu.
- **/login, /setup, /set-password**: one layout for all three; link errors
  show "Get a new link" (WhatsApp) and "Go to sign in"; success looks like
  success; 48px primary button; WhatsApp link for a forgotten password; card
  near the top on phones so the keyboard does not shove it.
- **/expired, /paused**: shared `AccountNotice`: header, icon, one line,
  WhatsApp button, sign in as second, phone number.
- **/policies**: grouped list with header; dashes removed from policy text
  (punctuation only, anchors unchanged).
- **404, error, /verify**: site header kept; verify copy clearer, status
  tokens instead of raw red, readable credential id.
- **/free**: thin counts removed.
- **/settings**: identity, Learning, Accessibility, Notifications, Log out.
- **Footers**: links big enough to tap; dead "About" link fixed.

New shared pieces: `components/site/site-header.tsx`,
`components/site/account-notice.tsx`, `components/auth/link-problem.tsx`,
`Stagger` in `components/home/motion-kit.tsx`, `FoldList` in
`components/home/games.tsx`.

## Checked

9 sizes (320x568, 360x740, 390x844, 430x932, 844x390, 932x430, 768x1024,
1024x768, 1440x900) on /, /waitlist, /login, /setup, /policies, /expired,
/free and a 404: no sideways scroll, exactly one h1, no skipped heading
levels. Light and dark at 390 and 1280. Waitlist submit tested: sending
state, then the error alert takes focus. tsc and eslint clean.

## Left

- /settings could not be screenshotted (needs a signed-in session against
  the live database); changed by code review only.
- Waitlist success state checked in code, not on screen (the server action
  cannot succeed without the database).
- `components/landing/landing-page.tsx` and `landing-nav.tsx` are no longer
  used by any route; safe to delete in a cleanup pass.
- `login-form.tsx`: Turnstile's `data-callback` is given a function, which
  React cannot put in an attribute, and the script loads with
  `render=explicit`, so the widget may never render. Auth logic, so left
  alone; worth a look by whoever owns sign-in.
- `src/lib/brand.ts` still says Cohort One (used by `proxy.ts`,
  `auth.md/route.ts` and the old landing files). Not shown on any public
  screen after this pass; owner should decide whether it moves to Cohort Two.
- The `vibha-design` skill text describes the old peach palette; it should be
  updated to the blue/lime four-colour system the code uses.
