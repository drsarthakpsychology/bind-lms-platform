# Frontend

Next.js 16 App Router, React 19.2, TypeScript, Tailwind CSS v4. Checked against commit `e4cb5ef0` on 2026-11-14.

## Folders

| Folder | Holds |
|---|---|
| `src/app` | Routes. 165 `page.tsx` files and 85 `route.ts` files |
| `src/components` | Shared UI, grouped by area (`admin`, `study`, `games` live under `src/app` next to their pages) |
| `src/lib` | Logic with no UI: auth, data access, engines, stores, AI, media |
| `src/content` | Authored learning content in TypeScript (study modules, exam prep banks, long answers, casebook) |
| `content/policies` | Markdown policy pages read at build time |
| `public` | Static files |

## Route layout

```
src/app/layout.tsx            root: fonts, theme, toaster, Vercel Analytics, Speed Insights
src/app/page.tsx              public home page
src/app/login, setup, set-password, expired, paused, waitlist, policies, verify/[certificateId], free, f/[slug]
src/app/(dashboard)/layout.tsx   signed-in shell (session gate, AppShell)
  dashboard, today, journey, courses/[courseId]/lessons/[lessonId], study, prep, games,
  practice, tools/psychopharm, doubts, wall, notifications, achievements, leaderboard,
  progress, passport, record, reflect, settings
src/app/(dashboard)/admin/layout.tsx   admin area (requires an admin role)
  access, achievements, activity, cohorts, courses, credentials, doubts, emails, forms,
  inbox, management, people, students, submissions, flags, infra, and more
src/app/api/*                 route handlers (see docs/API.md)
```

`(dashboard)` is a route group. It adds a layout, not a URL segment. Old URLs are redirected in `next.config.ts` (`redirects()`), for example `/study/activities` to `/games`.

## The signed-in shell

- `src/components/app-shell.tsx` renders the frame. It takes `role`, `mode` (admin or student view), `scope`, `flags`, `blocked` and the unread count from the layout.
- Navigation: `src/components/navigation/` (`app-sidebar.tsx` on desktop, `bottom-tab-bar.tsx` and `mobile-nav.tsx` on phones, `top-bar.tsx`, `nav-config.ts`, `sections.ts`). `shell-content.tsx` sets page padding so content clears the phone tab bar.
- Admins can switch to the student view with `view-mode-toggle.tsx`. The choice is a cookie (`view-mode-constants.ts`).
- `src/components/profile/details-gate.tsx` asks a student for their details once (`student_details.confirmed_at`).
- `src/components/analytics/visit-tracker.tsx` posts time on page to `/api/visit` every 2 minutes.
- `src/components/save/save-status.tsx` shows the state of the save outbox.

## Design system

- Style: "Neo-Brutalist Pastel". Rules: `.claude/skills/vibha-design/SKILL.md`, `docs/UI_RULES.md`, `docs/design/*`.
- Tokens: CSS variables on `:root` and `.dark` in `src/app/globals.css` (about 200). Main groups: surfaces (`--surface-1`, `--surface-2`, `--background`, `--card`), text (`--foreground`, `--muted-foreground`), brand (`--primary`, `--brand`, `--accent`), status (`--status-success-bg` and friends), shape (`--radius`, `--radius-pill`, `--hard-shadow-color`), layout (`--nav-h`, `--top-h`).
- Dark mode: `next-themes` sets the `.dark` class. A colour-blind mode sets `html[data-cvd="on"]` (`src/lib/a11y/colour-blind.ts`).
- Fonts: Archivo (variable) and two pixel fonts, self-hosted in `src/app/fonts` (`app-fonts.ts`), plus Geist and Source Serif 4 from `next/font/google`.
- Base components: `src/components/ui` (button, card, dialog, sheet, tabs, select, table, tooltip and more, built on `radix-ui` and `class-variance-authority`).
- Page states: `src/components/design-system` (empty, error, locked, not found, slow, page header, stat card).
- Phone patterns: `src/components/mobile` (bottom sheet, sticky action, thumb bar, choice list).
- Hand-drawn diagrams: `src/components/sketch` (uses `roughjs`).
- 3D scenes: `src/components/study/scenes` (`three`, `@react-three/fiber`, `@react-three/drei`). Loaded only on the study pages that use them.

## Shared systems to reuse (do not copy them)

| System | Where |
|---|---|
| Answer history | `src/lib/history` |
| Reactions after an answer | `src/components/reactions`, `useReaction`, `EndReaction` |
| Hints | `src/lib/hints` |
| Tips | `src/lib/tips/store.ts` |
| How-to lines | `src/components/help/once-hint.tsx`, `src/components/help/how-to.tsx` |

## Client state

There is no global state library. Small stores use `useSyncExternalStore` over `localStorage`, with a server copy where it matters:

| Store | Keeps | Server copy |
|---|---|---|
| `src/lib/save/outbox.ts` + `client.ts` | Every unsent save (lecture progress, Learn state, answer history, learning events) | `POST /api/save` |
| `src/lib/learn/store.ts` | Study module progress and XP | `learn_progress` via `/api/save` kind `learn` |
| `src/lib/study/marks-store.ts` | Highlights and notes in study pages | `study_marks` via `pullMarks` / `pushMarks` |
| `src/lib/tips/store.ts` | Dismissed tips | `tip_dismissals` |
| `src/lib/prep/long-store.ts` | Long answer practice state | browser only |
| `src/components/navigation/sidebar-state.ts` | Sidebar open or closed | browser only |

The outbox is why saving survives a deploy: a Server Action id changes on every deploy, a route URL does not. `next.config.ts` also sets `deploymentId` so an old tab reloads on its next navigation.

## Rules that apply to every UI change

- React 19 strict lint: no `setState` in effect bodies, no reading refs during render, no `Math.random` or `Date.now` in render.
- No em or en dashes in any student text. `src/lib/no-dashes-ui.test.ts` checks this.
- No exam names in student text (`src/content/no-exam-names.test.ts`).
- Load `.claude/skills/vibha-design/SKILL.md` before UI work.
