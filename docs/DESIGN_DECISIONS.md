# Design Decisions

Rationale behind the UI/UX changes in this hardening pass.

## 1. Neo-Brutalist Pastel palette (replacing signal orange)
- **Why the old design was weak:** `#FF4D00` signal orange was saturated and
  harsh; dark-green checkmarks on orange badges clashed and read poorly.
- **Why the new palette is better:** Warm peach `#F4A261` / `#F6B88A` /
  `#FFE6D5` / `#FFF6EF` reads premium and calm while keeping the neo-brutalist
  edge (2px ink borders, hard shadows). Contrast measured: ink on peach 8.14:1
  (AAA), ink on surface 14:1 (AAA).
- **Cognitive load:** warm, low-saturation surfaces are easier to scan for
  long reading sessions (a learning app).
- **Accessibility:** verified ≥ 4.5:1 on every pairing.

## 2. Segmented control for Admin/Student view switcher
- **Why the old design was weak:** two adjacent buttons with a border toggle —
  visually noisy, no clear "one active mode" affordance, no sliding transition.
- **Why the new design is better:** a single pill-shaped segmented control with
  a sliding indicator communicates mutually-exclusive modes at a glance.
  `aria-pressed` + `role="group"` make it screen-reader friendly; the active
  segment uses the brand primary for unmistakable state.
- **Faster workflow:** one click, clear active state, persisted via cookie
  across reloads.

## 3. Multi-select assignment submission types
- **Why the old design was weak:** a single radio button forced instructors to
  pick one format — a real limitation (a lesson may want text + audio + files).
- **Why the new design is better:** a checkbox matrix lets instructors allow
  any combination; the student panel renders each permitted method. Stored
  comma-separated, matching the widened schema.
- **Trade-off:** the extra formats (PDF/DOCX/PPT/ZIP/URL) are surfaced but not
  yet wired to upload paths — the UI is honest about this rather than implying
  support. Documented in KNOWN_LIMITATIONS.

## 4. Fullscreen-persistent watermark
- **Why:** the watermark is the anti-leak deterrent; it must survive fullscreen.
- **Why the new design is better:** fullscreen is requested on the *wrapper*
  (video + watermark), so the overlay is always composited. An explicit
  fullscreen button replaces reliance on the native control (which would
  fullscreen just the video). `controlsList="nodownload"` + `disablePictureInPicture`
  close the easy capture paths.
- **Honesty:** the code documents that nothing in a browser is impossible to
  capture — these are deterrents, not DRM.

## 5. Security headers
- **Why:** zero headers shipped before this pass. CSP, X-Frame-Options,
  nosniff, Referrer-Policy, and Permissions-Policy now ship on every route,
  hardening against XSS framing/dataloading vectors without breaking the app.
