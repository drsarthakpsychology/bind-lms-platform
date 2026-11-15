# The Vibha Psychology app

The phone app for students and admins. Android first; the iPhone app comes from the same code later. Everything lives in the folder `apps/mobile`.

Status on 15 November 2026: built and tested on a computer, **not yet run on a real phone**. The first real test is you installing the test app (part 1 below).

---

## 1. Put the test app on your Android phone

You do this on GitHub, then on your phone. About 10 minutes.

**Before the first time:** this branch (`agent/appmobile`) must be on GitHub. Ask Claude: "push the app branch". Every push that changes the app makes a new test app by itself.

### Get the file

1. Open your repository on github.com.
2. Click the **Actions** tab (top of the page).
3. In the left list, click **App Android build**.
4. Click the newest line that has a **green tick**. (A yellow circle means it is still building: wait about 15 minutes. A red cross means it failed: tell Claude "the app build failed" and paste the link.)
5. Scroll to the bottom, to the box called **Artifacts**.
6. Click **vibha-psychology-android-** (followed by a number). A `.zip` file downloads.
7. Open the `.zip`. Inside is one file named like `vibha-psychology-mock-12.apk`. That is the app.

### Put it on the phone

8. Send the `.apk` file to your phone. The easiest way: WhatsApp it to yourself ("Message yourself"), or put it in Google Drive.
9. On the phone, tap the file.
10. Android says something like "For your security, your phone is not allowed to install unknown apps from this source". Tap **Settings**, switch on **Allow from this source**, then press back.
11. Tap **Install**. If Google Play Protect warns you, tap **More details**, then **Install anyway**. (It warns because the app is not on Google Play yet.)
12. Open **Vibha Psychology** from your home screen.

### Try it

The test app uses **sample data** that lives inside the app (no real students, nothing is saved to the website). In sample mode:

| To see | Sign in with this email | Password |
|---|---|---|
| A student | `ananya@example.com` | anything except `wrong` |
| A lectures-only student | any email starting with `lectures`, e.g. `lectures@example.com` | anything |
| An admin | any email starting with `admin`, e.g. `admin@example.com` | anything |
| The "changed phones too often" message | any email starting with `limit` | anything |

Then choose any 4-digit PIN that is not easy to guess (not 1234, not 1111).

Things to check on the phone, because a computer cannot:
- The lecture screen plays (sample mode shows a stand-in player; the real video plays only with the real server, see part 2).
- Screenshots are blocked: try one anywhere in the app. You should get a black picture or a "can't take screenshot" message.
- Leave the app for 5 minutes, come back: it asks for the PIN.
- Turn the phone sideways on a lecture and tap the full-screen button.
- Bigger text: phone Settings > Display > Font size, then look at the app again.
- Dark mode: phone Settings > Display > Dark theme.

### Make a fresh test app by hand

On GitHub: **Actions** > **App Android build** > the **Run workflow** button (right side) > choose `mock` > **Run workflow**. (This button appears once the workflow file is on your main branch.)

---

## 2. What you need to do next, in order

Each step says who does it. "Claude" means you ask Claude in a new message.

1. **Merge the two app branches** (Claude). The server part (`agent/appapi`) and this app (`agent/appmobile`) go into your test branch, then to the test link. Say: "merge the app branches into the test branch".
2. **Run the database step** (you, 2 minutes). Supabase > SQL Editor > paste the file `supabase/migrations_pending/2026_11_15_app_devices.sql` > Run. Until then the app works, but "one phone at a time" is not enforced and push messages are not sent.
3. **Switch the test app to the real website** (you, 1 minute), once step 1 is live:
   GitHub > your repository > **Settings** > **Secrets and variables** > **Actions** > the **Variables** tab > **New repository variable**.
   Name: `APP_API_MODE` Value: `live`. Click **Add variable**. The next build talks to vibhapsychology.com, and you sign in with your real account.
4. **Push notifications** (you and Claude, about 20 minutes). Needs two free accounts:
   - a Firebase project (console.firebase.google.com): add an Android app with the package name `com.vibhapsychology.app`, download the file `google-services.json`;
   - an Expo account (expo.dev): create a project called `vibha-psychology`, copy its **Project ID**.
   Then tell Claude: "set up push for the app" and give it the file and the ID. Claude will tell you exactly which two values to paste into GitHub (a secret called `GOOGLE_SERVICES_JSON` and a variable called `EAS_PROJECT_ID`).
5. **Links that open the app** (Claude). For the setup email link to open the app instead of the website, the website needs one small file (`/.well-known/assetlinks.json`) with the app's signing fingerprint. Say: "add the app links file to the website" after step 6.
6. **Google Play** (you, then Claude):
   - Create a Google Play developer account (one-time USD 25) at play.google.com/console.
   - Ask Claude: "make the app's upload key". It makes the key file and tells you which four values to add as GitHub secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Keep a copy of the key file somewhere safe (Google Drive): without it you can never update the app.
   - The store listing name is **Vibha Psychology**. Claude can write the store text, the privacy answers ("Data safety") and make the screenshots.
7. **iPhone** (later). Needs an Apple developer account (USD 99 a year) and a Mac or a paid cloud build. The code is ready for it; the iPhone recording check is written but has never been built.

---

## 3. What is in the app today

Built and checked on a computer (screenshots of every screen, automatic tests):

| Part | What works |
|---|---|
| Visitors | Welcome, Request an invitation, a free breathing tool, Sign in, Forgot password, the setup link from the welcome email, checking a certificate |
| Signing in | Email and password once, then a 4-digit PIN; locks after 5 minutes away; 5 wrong PINs sign out; "opened on another device"; paused account; forced update |
| Students | Home (Continue, Today with quests, Up next), Learn, Lectures, course page, the protected lecture player (moving name and roll number, screenshots blocked, full screen, resume, saves progress, mark as watched, previous and next), Study modules, the reader with the hand-drawn diagrams and interactive pieces, checkpoints, module tests, Progress, Certificates, Notifications, Doubts (ask, answer, vote), Settings (notifications, theme, vibration, sign out, ask to delete the account), Help, Search |
| Practise and Library | Practise hub, two games (Quickfire, Match the term), patient cases, Exam Prep, medicine library and medicine pages (sample data until the server adds these) |
| Lectures-only accounts | Home, Lectures, Doubts, Me |
| Admins | Home (who needs a look), Students, a student's page (allow one more phone change), Activity, Messages, New message, More |

Not done yet:
- The website's 3D study scenes are step-by-step drawings in the app (same content and order, no 3D camera). All 39 kinds of interactive study pieces are in the app.
- Handing in assignments as a file or a recording (text answers work).
- Opening lecture materials (PDFs) inside the app.
- Only two games so far; the website's other games come next.
- Practise, Library and Admin need their server routes (listed in `docs/app/CONTRACT_REQUESTS.md`); until then they show "Coming in the next update" against the real server.
- Offline downloads (agreed for later). Fingerprint unlock (the hook is ready; agreed for later).

---

## 4. For developers

Inside `apps/mobile` (its own packages; the website's `package.json` is not touched):

| Command | What it does |
|---|---|
| `npm ci` | install |
| `npm test` | the tests (jest + Testing Library) |
| `npm run typecheck`, `npm run lint` | TypeScript and ESLint |
| `npm run web` | the app in a browser with sample data |
| `npm run export:web` | the browser build with sample data (used for screenshots) |
| `npx expo prebuild -p android` then `cd android && ./gradlew assembleRelease` | an APK (needs Java 17 and the Android SDK) |

- Server address and mode: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_MODE=mock|live` (`apps/mobile/app.config.ts`, `src/lib/config.ts`).
- The contract is `src/api/contract.ts`, an exact copy of the server's `src/lib/app-api/contract.ts`. Never edit it by hand: copy it again when the server changes it. Shapes the app needs that are not in it yet: `src/api/extra.ts`.
- In the browser build, the address can choose a state: `?as=student|lecture|admin`, `&mock=new|done|empty|error|slow|paused|update`, `&theme=dark`, `&lock=1`.
- Build on GitHub: `.github/workflows/app-android.yml`.
- No web views are used anywhere in the app: every screen, game and diagram is drawn natively.
