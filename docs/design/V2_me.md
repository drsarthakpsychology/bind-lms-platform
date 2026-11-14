# New design (ui_v2): the personal screens

Branch `agent/v2me`. Every screen below is shown only when the `ui_v2` switch is on for the account (`src/lib/ui/v2.ts`); the old screen is untouched behind it. Same data loaders and server actions, no logic changes.

## Screens

| Address | New composition | One purpose |
|---|---|---|
| `/progress` | `progress/progress-v2.tsx` | Where you stand: course % and tests passed in one row of numbers, the next test (the only lime button), Needs work and Strongest topics as rows (moved here from Home, same loader `getStrengthsWeaknesses`), every module test as rows |
| `/journey` | `journey/journey-v2.tsx` | Your own numbers: level leads, six numbers in a plain grid |
| `/achievements` | `achievements/achievements-v2.tsx` | Certificates as a list with Download and Share; badges as a quiet grid (a badge opens a sheet); what is still to earn as rows. Reads the same credentials data; credential logic not touched |
| `/passport` | `passport/passport-v2.tsx` | Skills shown. With no skills set up the page says so (no more "0/0") |
| `/leaderboard` | `leaderboard/leaderboard-v2.tsx` | Where you stand this week: points and place, your group as one list, then batch, everyone, batch war, board name |
| `/notifications` | `notifications/notifications-v2.tsx` | One list, newest first, blue dot and bold title when unread; the detail page is plain reading text |
| `/doubts` | `doubts/doubts-v2.tsx` | Read and ask: rows, filters that wrap (they used to run off the screen), Ask pinned at the bottom on phones |
| `/doubts/[id]` | `doubts/doubts-v2.tsx` | The question as the title, answers with hairlines, the answer box last |
| `/reflect` | `reflect/journal-view.tsx` (`v2` prop) | Journal entries as plain rows |
| `/wall` | `wall/wall-view.tsx` (`v2` prop) | Posts as plain rows; reaction buttons are 44px |
| `/record` | page frame only | The supervision log and check-in forms belong to Practice and keep their look |
| `/settings` | `settings/settings-v2.tsx` | Grouped rows like a phone's settings app, with real switches |
| first-login details | `components/profile/details-gate.tsx` | Full screen on phones, one action pinned at the bottom |
| WhatsApp number | `components/profile/mobile-number-prompt.tsx` | A bottom sheet (not mounted on any page today) |
| loading, error, not found | `components/v2me/states.tsx` | Plain type, left aligned, one lime action |

## Local parts (not in `src/components/ds`)

`src/components/v2me/parts.tsx`: `primaryButton`, `quietButton`, `textButton` (the ds has only a link button), `fieldClass`, `labelClass`, `BackLink`, `StatRow` + `StatItem`, `ProgressLine`, `EmptyLine`, `StatusWord`, `chipClass` + `chipRow`.
`src/components/v2me/switch-row.tsx`: a settings row with a switch.
`src/components/v2me/ui-v2.tsx`: `UiV2Provider` / `useUiV2` / `V2Switch`, so client-only files (loading, error, not-found, the first-login form) know which design is on. Set once in `(dashboard)/layout.tsx`.
`src/components/v2me/server.ts`: `pageV2(role)` for pages.

## References studied

Screenrove (captured dates as listed there):
- `twist-product-inbox` (2026-10-22): unread dot, sender line, one-line preview, time on the right. Used for Notifications and the Doubts list.
- `flora-product-preferences` (2026-10-22): settings as titled groups of rows, a value or a switch on the right. Used for Settings.
- `huddlekit-thread-reply` (2026-10-24): a thread with replies under a hairline and the reply box last. Used for the doubt page.
- `plane-onboarding-profile` (2026-10-21): one column, a thin progress line at the top, one full-width action. Used for the first-login details form.

UI by Made Good Designs (madegooddesigns.com/inspiration/ui):
- Weekly league leaderboard, mobile, minimal (`39e344669913`): your position highlighted in one ranked list, tier names in a row, days left.
- Friends' streaks and achievements, mobile, minimal (`04c369842dd0`): badges as a small grid of tiles with a name under each.

Principles taken, not looks: rows and hairlines instead of cards, one number row instead of stat boxes, status as a word instead of a pill, one lime action per screen.

## How it was checked

Fixture harness in the scratchpad (`v2me-shots/`): every screen with populated, empty and edge fixtures, inside the real app shell, run through `e2e/layout-defects.mjs`.
