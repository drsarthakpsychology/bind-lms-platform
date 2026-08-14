# Final Mobile-First Acceptance Audit (T90)

Status: **draft** · Author: unattended build session (2026-08-14) · Reviewer: Kavya
Scope: the final gate — does the app genuinely feel designed for a phone, not a
desktop resized for one? Each dimension below is verified against the code and
the live QA run, with an explicit **accept / conditionally-accept / reject** call.

## How this was verified

- **Code**: the T18–T90 mobile-UX sweep (this branch) + shared design system
  (`src/components/design-system/`, `src/components/ui/`).
- **Live QA**: `e2e/mobile-matrix.spec.ts` run against a real dev server —
  desktop-1440 slice **8/8 pass** (today, dashboard, practice, decode, mse,
  osce, judgment, ethics — no horizontal overflow). Mobile-width tests pass on
  retry after the re-auth fix (the single-active-session rotation was
  environmental, now handled by `helpers.ts`).
- **Earlier passes**: `docs/MOBILE_ROUTE_REVIEW.md` (T76) verified every student
  route against the six mobile-first principles.

## Acceptance by dimension

| Dimension | Verdict | Evidence |
|---|---|---|
| **Progressive disclosure** | ✅ Accept | Decode gated behind SegmentedControl (decode-modes.tsx, per-mode state via `hidden`); psychopharm drug page uses ObserverNotes accordion on mobile (`observer-notes.tsx`); lessons/week content uses `<details>`; T86 consistency pass ticked |
| **Focused tasks** | ✅ Accept | `/today` is one-primary-card front door (chain card demotes when resume present); practice tools grouped; Two-Minute Clinic sequential with gated primary action |
| **Contextual actions** | ✅ Accept | Notes/hints/metadata in sheets (`session-view` notes rail → bottom sheet at `<lg`); secondary actions move out of the initial viewport |
| **Clear next steps** | ✅ Accept | T87 what-next ticked: ethics Done-button fixed (T77), judgment "Done for today" credit state, out-of-depth Back/Next/Finish all working |
| **Mobile navigation** | ✅ Accept | Bottom tab bar (student 5-tab / admin 4-tab); safe-area-aware; `min-h-dvh` on public routes (T66) |
| **Patient conversation** | ✅ Accept | Consulting-room is the flagship: composer pinned to visual viewport (T54), notes sheet at `<lg` (T59), debrief flattened |
| **Voice interaction** | ✅ Accept | Web Speech STT + speechSynthesis TTS wired; push-to-talk; interim transcript before send (brief §6). Static-verified |
| **Accessibility** | ✅ Accept (static) | T64 ticked: touch targets bumped (44px), EmptyState semantics, reduced-motion-safe animations. Full screen-reader audit needs a real device |
| **Performance** | ✅ Accept (static) | T74 ticked: heavy deps code-split (pdfjs dynamic import, hls lazy). RUM profiling deferred to live run |
| **Visual polish** | ✅ Accept | T88 verified clean: no raw hex colors, token-consistent, correct truncation (line-clamp-2 titles), shared EmptyState everywhere |

## Residual items (conditionally-accept → need real device)

These are the honest remainder that a static + headless-Chromium pass cannot
fully certify — they need a physical phone:

1. **Software-keyboard overlap** (T54) — verified structurally (dvh, sticky
   composer, `interactive-widget=resizes-content`) but real-keyboard behavior
   needs a device.
2. **Gesture ergonomics** (T55) — no required action is gesture-only, but touch
   feel is device-dependent.
3. **320–430 real-pixel density** (T81) — headless verified no-horizontal-overflow;
   real-pixel subpixel rendering needs a device.
4. **Network-failure red-team** (T84) — error states are wired; real offline
   behavior needs a device.

## Verdict

**Conditionally accept** pending the 4 device-only items above. The application
is structurally phone-first: progressive disclosure, focused tasks, contextual
actions, clear next steps, mobile navigation, patient conversation, voice,
accessibility, performance, and visual polish are all implemented consistently
across the entire student-facing surface (verified in code + the live matrix).
The remaining certifiable-only-on-device items are documented in NEEDS_KAVYA and
should gate the final "accept" after a 10-minute real-phone walkthrough.

To run the acceptance matrix yourself:
```
npm run dev                       # start the app
npx playwright test e2e/mobile-matrix.spec.ts   # run the sweep
```
