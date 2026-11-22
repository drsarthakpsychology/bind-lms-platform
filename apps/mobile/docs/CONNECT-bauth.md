# To connect: the entrance (signed out, sign in, gates, first run)

No screen in this area uses mock data. Every screen runs on the app's real
calls (sign in, setup link check, request an invitation, the website's
homepage words, the session, PIN and fingerprint). What is left for the
backend phase:

| Screen | File | What it needs | Where it lives today |
|---|---|---|---|
| Setup link, Forgot password | `src/screens/auth/setup.tsx`, `src/screens/auth/forgot.tsx` | Code done (22 Nov): the website serves `/.well-known/assetlinks.json` and `/.well-known/apple-app-site-association` from the Vercel settings `ANDROID_SHA256_FINGERPRINTS` and `APPLE_TEAM_ID` (`src/lib/app-links.ts`), and the app opens every page in `APP_LINK_PATHS`. Left: the owner sets the fingerprint (push and links guide, Part 4) and installs a new build. | `app.config.ts`, `app/+native-intent.tsx`, `src/app/.well-known/*` |
| First-run step, notifications | `src/screens/auth/permissions.tsx` | Code done (22 Nov): the build records whether it has the Firebase file and project id; without them the first-run step is not shown and Settings says "Notifications are not working yet"; the phone tells the server why it has no push address (server log). Left: the owner adds `GOOGLE_SERVICES_JSON` and `EAS_PROJECT_ID` (push and links guide, Parts 1 to 3) and makes a new build. | `src/push/index.ts`, `.github/workflows/app-android*.yml` |
| Lectures-only page | `src/screens/auth/scope.tsx` | The list of parts closed to a lectures-only account is kept in the app (`FULL_ONLY`). If the server ever sends that list (for example in `/me` access), read it from there. | Server: the `scope` refusal in the app API |
| Access ended (on Sign in) | `src/screens/auth/sign-in.tsx` (`Ended`) | Nothing new. Shown when the session signs out with the notice `account_expired`. The browser build has no address option for it (`src/lib/dev.ts` only knows `notice=device_replaced`), so it is covered by a test, not a screenshot. | `src/auth/session.ts` |
