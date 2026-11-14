# Native app readiness (iOS and Android)

The plan is: finish the web app first, then build native apps. This page says where the web app stands today, what a native app could reuse, what blocks it, and a staged plan. No native code exists and none should be written yet. Checked on 2026-11-14.

## Today

- A responsive web app, tuned for phones (bottom tab bar, bottom sheets, thumb-reach actions; the latest pass is on the test link).
- **Not a PWA yet.** There is no web app manifest and no service worker in `src/app` or `public`. It cannot be "installed" to a home screen with an icon and offline start.
- Offline-safe saving already exists: the save outbox keeps student work in `localStorage` and sends it when the network is back (`src/lib/save`).

## What a native app can reuse as is

| Piece | Why it carries over |
|---|---|
| Supabase Auth | Has native SDKs (Swift, Kotlin, Flutter, React Native). Same users, same passwords, same setup links |
| The database and row level security | A native app with the user's Supabase token gets the same row level security as the web. Most per-student tables are already safe to read and write directly |
| JSON route handlers | `/api/save`, `/api/visit`, `/api/learn/events`, `/api/media/playback`, `/api/media/stream/*`, `/api/practice/*`, `/api/knowledge/*`, `/api/psychopharm/*`, `/games/duel/live`. Plain HTTP and JSON, stable URLs |
| HLS video | iOS AVPlayer and Android ExoPlayer play HLS with `#EXT-X-KEY` AES-128 natively |
| Content | Study modules, exam prep and long answers are TypeScript data in `src/content`. They can be exported to JSON |
| Business rules in `src/lib` | Pure modules (grading, engines, rules such as `src/lib/cohorts/rules.ts`) are testable TypeScript. A React Native app could import them; a Swift or Kotlin app would call the server instead |

## What blocks a native app today

1. **Server Actions.** About 196 exported actions in 54 files (games, study, prep, doubts, achievements, all admin writes) can only be called from the Next.js web pages. Their ids change on every deploy. A native app needs these as JSON routes.
2. **Cookie sessions.** `getSession()` reads the Supabase cookie and the `plms_session` cookie (`src/lib/auth/session.ts`). The one-device rule compares that cookie with `profiles.active_session_token`. API routes have no way to accept `Authorization: Bearer <token>` today. A native app needs a bearer path that runs the same checks (status, expiry, device token).
3. **One device at a time.** Signing in on the phone app would sign the web out and the other way round. The owner must decide if the app counts as a second device.
4. **The video key flow.** The stream proxy checks the stream token and the session cookie on each request (`src/app/api/media/stream/[...lessonId]/route.ts`). Native players do not send the web cookies. The key URL in the playlist would need the bearer token, or a token-only mode for native clients. The 5 minute token refresh is done by the web player's custom loader and would need to be rebuilt in the native player.
5. **Same-origin checks.** `/api/media/playback`, materials and submissions refuse requests that are not from the site's own origin. Native requests have no `Origin` that matches.
6. **The student API cross-site check** (`Sec-Fetch-Site`) is fine for native (no header is sent), but must stay in mind.
7. **Login is a Server Action** with Turnstile support. A native app would use the Supabase SDK, then call a new route to set the device token and check expiry.
8. **3D scenes and some widgets** are web-only (three.js, Canvas, `roughjs`). A native app would show them in a web view or skip them.

## Staged plan

**Stage 0: keep the web app clean (now, no new features).** Put new student writes behind JSON routes or shared server functions, not only Server Actions. Keep logic in `src/lib`, not in page files. This costs nothing extra and keeps the door open.

**Stage 1: PWA (small).** Add a web app manifest and icons, a basic service worker for the app shell, and a "you are offline" screen. Students can install it to the home screen on Android and iOS. This covers most "app" needs for a 300 student cohort.

**Stage 2: an API layer for the app (medium).**
- A `requireBearerSession()` helper that verifies a Supabase access token from the `Authorization` header and runs the same status, expiry and device checks as `getSession()`.
- Allow it next to cookies in `requireStudentApi()` and the media routes.
- JSON routes for the student actions the app needs first: lectures list and progress, doubts, notifications, achievements, study state, prep answers.
- Document them in `/openapi.json` (it lists only the public surface today).

**Stage 3: native shell (medium to large).** React Native with Expo, or Capacitor around the existing web app. Capacitor reuses the most code (the web pages in a native shell, with native video and push). React Native gives a fully native feel and can reuse `src/lib` TypeScript. Choose after Stage 2, based on what students need offline and how much the owner wants app store presence.

**Stage 4: native-only extras.** Push notifications (replace or add to email), offline download of lectures (needs a licence and key decision, since it changes the video protection model), app store releases.

## Decisions for the owner before Stage 2

- Does the app count as a second device, or does one account get one web plus one phone?
- May lectures be downloaded for offline viewing?
- Which features must the first app version have?
