# To connect: the entrance (signed out, sign in, gates, first run)

No screen in this area uses mock data. Every screen runs on the app's real
calls (sign in, setup link check, request an invitation, the website's
homepage words, the session, PIN and fingerprint). What is left for the
backend phase:

| Screen | File | What it needs | Where it lives today |
|---|---|---|---|
| Setup link, Forgot password | `src/screens/auth/setup.tsx`, `src/screens/auth/forgot.tsx` | The link in the welcome email (and the new link sent after "Forgot password") must open the app, not the browser (audit problem H5). The words on Forgot password say "open the link", not "in the app", until then. | App links: `app.config.ts`, `app/+native-intent.tsx`; website `/.well-known` files |
| First-run step, notifications | `src/screens/auth/permissions.tsx` | Push needs the Firebase file and the Expo project id in the release build (audit problem C3). Until then, Allow shows a line saying notifications do not work in this version yet. | `src/push/index.ts`, `.github/workflows/app-android.yml` |
| Lectures-only page | `src/screens/auth/scope.tsx` | The list of parts closed to a lectures-only account is kept in the app (`FULL_ONLY`). If the server ever sends that list (for example in `/me` access), read it from there. | Server: the `scope` refusal in the app API |
| Access ended (on Sign in) | `src/screens/auth/sign-in.tsx` (`Ended`) | Nothing new. Shown when the session signs out with the notice `account_expired`. The browser build has no address option for it (`src/lib/dev.ts` only knows `notice=device_replaced`), so it is covered by a test, not a screenshot. | `src/auth/session.ts` |
