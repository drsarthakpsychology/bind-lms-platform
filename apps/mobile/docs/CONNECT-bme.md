# To connect: the Me area (builder "bme")

Every screen in this area runs on the app's existing API hooks. No `mock.ts`
file was needed. These are the places where the design is ahead of the data.

| Screen | File | What is designed | What it needs | Where the website has it |
|---|---|---|---|---|
| One certificate (`/certificate/[id]`) | `src/screens/me/certificate.tsx` (`CertificatePage`) | The certificate shown as a page, drawn on the phone from its title, the student's name, the date and the number. It is a preview; the real page is the PDF behind Download. | A student route that returns the certificate's own drawing (the admin one is `POST /admin/certificates/preview`, drawn by `src/admin/cert-drawing.tsx`). Then swap `CertificatePage` for `CertDrawing`. | The certificate layout the website prints (the same one the admin preview uses) |
| Settings, Look, "Colour-blind friendly colours" | `src/screens/me/settings.tsx`, `src/lib/settings.ts` (`colourBlind`) | The switch, saved on the phone. Its line says the colours follow in the next update. | The theme (`src/theme`, owned by the foundation) must read `settingsStore.colourBlind` and turn right and wrong colours to blue and orange (`OptionList`, `ResultSheet`, alert colours). Then shorten the switch's line. | `src/lib/a11y/colour-blind.ts`, `src/components/settings/colour-blind-toggle.tsx` |
| Settings, profile sheet | `src/screens/me/settings.tsx` (`EditProfile`) | The WhatsApp number is changed for real (`PATCH /me`). Name and email are read only, with a line that says to message the school. | Nothing, unless the owner wants name changes in the app: then `PATCH /me` must accept `name`. | `src/app/api/app/v1/me/route.ts` |
| Notification settings (`/notification-settings`) | `src/screens/notifications/prefs.tsx`, `app/notification-settings.tsx` | A switch for each kind the server knows: messages, doubt answers, badges and certificates, the daily reminder. | Nothing new. The route is not listed in `app/_layout.tsx` (owned by the foundation); it works with the default push motion. Add `<Stack.Screen name="notification-settings" options={{ title: "" }} />` there to make it explicit. | `PUT /notifications/preferences` |
| Me, "Class wall" tile | `src/screens/me/me.tsx` | Shown unless the account is lectures only or the admin blocked `wall`. | Nothing. | `access.blocks` |
