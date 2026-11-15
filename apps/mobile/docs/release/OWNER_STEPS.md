# Put Vibha Psychology on Google Play (and later the iPhone App Store)

Do the parts in order. Each step says exactly what to click and what to paste.
Where it says **Claude**, start a new message to Claude with the words shown.

Before you start, this branch must be on GitHub and merged into `main` (ask Claude: "merge the app store branch and push"). The buttons in GitHub "Actions" only appear for workflows that are on `main`.

---

## Part 1. Make the upload key (10 minutes, once in the app's life)

The upload key is a file that proves an app update really comes from you. **If you lose it you must ask Google to reset it**, so keep a copy safe.

1. Open **https://shell.cloud.google.com** in Chrome and sign in with the Google account you will use for Play Console. A black box (a terminal) opens at the bottom. If it asks to "Authorize", click **Authorize**.
2. Think of a strong password (at least 12 letters and numbers, no spaces). Write it down in your password manager now. You need it in step 6 and every time Google asks.
3. Click inside the black box. Paste this whole line and press **Enter**:

   ```
   keytool -genkeypair -v -keystore upload-key.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000 -storetype PKCS12 -dname "CN=Vibha Psychology, O=VIBHA School of Psychology, L=Ahmedabad, ST=Gujarat, C=IN"
   ```

4. It says `Enter keystore password:`. Type your password (nothing shows while you type, that is normal), press **Enter**. Type it again, press **Enter**.
5. Paste this line and press **Enter**:

   ```
   base64 -w0 upload-key.jks > upload-key-base64.txt && ls -l upload-key*
   ```

   You should see two files: `upload-key.jks` and `upload-key-base64.txt`.
6. Download both: click the **three dots** (top right of the black box) > **Download** > type `upload-key.jks` > **Download**. Do it again for `upload-key-base64.txt`.
7. Put `upload-key.jks` and your password somewhere safe (Google Drive folder only you can see, plus your password manager).

## Part 2. Give the key to GitHub (5 minutes)

1. Open your repository on **github.com**.
2. Click **Settings** (top bar) > **Secrets and variables** (left menu) > **Actions** > the **Secrets** tab > **New repository secret**.
3. Add these four secrets, one at a time. For each: type the **Name**, paste the **Secret**, click **Add secret**.

| Name (type exactly) | Secret (what to paste) |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | open `upload-key-base64.txt` (Notepad / TextEdit), select all, copy, paste. One long line. |
| `ANDROID_KEYSTORE_PASSWORD` | your password from Part 1 |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | the same password again |

## Part 3. Push notifications (20 minutes)

Without this the app works, but nobody gets notifications.

### 3a. Firebase (Google's push service)

1. Open **https://console.firebase.google.com** > **Create a project** (or **Add project**).
2. Name: `Vibha Psychology` > **Continue**. Turn **off** Google Analytics > **Create project** > **Continue**.
3. On the project page click the **Android** icon (a green robot) to add an Android app.
4. Android package name: `com.vibhapsychology.app` (exactly). App nickname: `Vibha Psychology`. Leave the SHA-1 box empty. Click **Register app**.
5. Click **Download google-services.json**. Then click **Next**, **Next**, **Continue to console** (skip the rest; Claude has done that part).
6. Turn the file into one line of text: open **https://shell.cloud.google.com** again, click the **three dots** > **Upload** > choose `google-services.json`. Then paste this line and press **Enter**:

   ```
   base64 -w0 google-services.json > google-services-base64.txt
   ```

   Three dots > **Download** > `google-services-base64.txt`.
7. GitHub > **Settings** > **Secrets and variables** > **Actions** > **Secrets** > **New repository secret**:
   Name `GOOGLE_SERVICES_JSON`, Secret: open `google-services-base64.txt`, select all, copy, paste > **Add secret**.

### 3b. Expo (sends the messages to phones)

1. Make a free account at **https://expo.dev/signup**.
2. Click **Create a project**. Name: `vibha-psychology` > **Create**.
3. On the project page copy the **ID** (looks like `1a2b3c4d-....`).
4. GitHub > **Settings** > **Secrets and variables** > **Actions** > the **Variables** tab > **New repository variable**:
   Name `EAS_PROJECT_ID`, Value: the ID you copied > **Add variable**.
5. Back in Firebase: the **gear** next to "Project Overview" > **Project settings** > **Service accounts** tab > **Generate new private key** > **Generate key**. A `.json` file downloads. Keep it private.
6. In expo.dev, your project > **Credentials** (left menu) > **Add an Android app** (or the `+`) > Application identifier `com.vibhapsychology.app` > **Save**. Open it > **FCM V1 service account key** > **Add a service account key** > upload the `.json` file from step 5 > **Save**.

## Part 4. Google Play Console (after your organisation account is approved)

### 4.1 A login for Google's reviewers (5 minutes)

Google checks the app before it goes live and needs a student login.

1. On vibhapsychology.com, as admin, add a new student with the email `drsarthakpsychology+playreview@gmail.com` (Gmail delivers it to your normal inbox).
2. Open the welcome email it gets and set a password. Write the email and password down for step 4.3.
3. Reviewers use several phones. If they report "changed phones too often": open the Vibha Psychology app with your admin account > **Students** > that student > **Allow one more phone change**.

### 4.2 Build the file for Play (40 minutes, mostly waiting)

1. GitHub > **Actions** (top bar) > **App Android release** (left list) > **Run workflow** (right) > keep `live` > **Run workflow**.
2. Wait for the green tick (about 30 to 40 minutes). A red cross: tell Claude "the release build failed" and paste the page link.
3. Click the run > scroll to **Artifacts** > click **vibha-psychology-release-** (and a number). A `.zip` downloads.
4. Open the `.zip`. Inside:
   - `vibha-psychology-NUMBER-live.aab`: the file for Google Play.
   - `vibha-psychology-NUMBER-live.apk`: the same app to install on your own phone first (send it to yourself on WhatsApp, tap it, allow, install). Check you can sign in and play a lecture.

### 4.3 Create the app and fill in the store page (1 hour)

1. **https://play.google.com/console** > **Create app**.
   App name `Vibha Psychology` · Default language **English (India)** · **App** · **Free** · tick both declarations > **Create app**.
2. Left menu **Grow users** > **Store presence** > **Main store listing**: paste the texts from `STORE_LISTING.md` (app name, short description, full description). Upload the pictures from `store-assets/` (app icon, feature graphic) and `screenshots/` (phone screenshots, in number order). **Save**.
3. Left menu **Store settings**: Category **Education**, contact email, phone and website from `STORE_LISTING.md`. **Save**.
4. Left menu **Policy and programs** > **App content**: answer every card using `APP_CONTENT.md` and `DATA_SAFETY.md`. Use the reviewer login from 4.1 under **App access**.
5. Account deletion: in the same **App content** page, the **Data deletion** card (or the question inside Data safety) > paste `https://vibhapsychology.com/delete-account`.

### 4.4 Send it out (15 minutes, then Google's review takes 1 to 7 days)

1. Left menu **Test and release** > **Testing** > **Internal testing** > **Testers** tab > **Create email list** > name `Team` > add your own Gmail > **Save changes**.
2. **Create new release**. If asked about **Play App Signing**, keep **Use Google-generated key** > **Continue** (Google keeps the final signing key; your upload key from Part 1 only proves uploads are yours).
3. Drag the `.aab` file into **App bundles**. Release notes: copy from `STORE_LISTING.md`. **Next** > **Save and publish**.
4. Open the **Copy link** under Testers on your phone, accept, install from Play, and check it works.
5. When happy: **Test and release** > **Production** > **Create new release** > **Add from library** > choose the same bundle > **Next** > **Save and publish**. Countries: pick **India** (add more any time).

Organisation accounts do not need the "12 testers for 14 days" closed test that new personal accounts need, so you can go straight from internal testing to production.

### 4.5 After Play accepts it (Claude)

Say to Claude: **"add the app links file to the website"**. Claude will ask you for one value: Play Console > **Test and release** > **App integrity** > **App signing** > copy the **SHA-256 certificate fingerprint** under "App signing key certificate". This makes links in the welcome email open the app.

### Every later update

1. Raise the version for a public release (ask Claude: "raise the app version to 1.0.1").
2. GitHub > Actions > **App Android release** > **Run workflow**. The build number goes up by itself.
3. Play Console > **Production** (or Internal testing) > **Create new release** > drag the new `.aab` > **Save and publish**.

---

## Part 5. iPhone (later)

The code is ready for iPhone (same app, bundle id `com.vibhapsychology.app`). To check it still builds at any time: GitHub > Actions > **App iPhone check** > **Run workflow** (green tick = it compiles; this cannot go on a real iPhone).

What you need before TestFlight:

1. **Apple Developer Program**, USD 99 a year, at **https://developer.apple.com/programs/enroll** with the Apple ID you want to own the app.
   - Apple accepts **organisation** accounts only for legal entities (a company, LLP, trust or society) with a D-U-N-S number in that entity's name. The policies list VIBHA School of Psychology as a sole proprietorship: Apple asks sole proprietors to enrol as an **individual**, and the App Store then shows your personal name as the seller. If you want "VIBHA School of Psychology" shown, the business must be registered as an entity first. Use the same D-U-N-S number as Google if it is for the same legal entity.
   - Approval takes 1 to 14 days.
2. When approved, tell Claude **"set up iPhone TestFlight"**. Claude will then ask you for:
   - An **App Store Connect API key**: App Store Connect > **Users and Access** > **Integrations** > **App Store Connect API** > **Generate API Key** (Access: **App Manager**). You give Claude the **Issuer ID**, the **Key ID**, and you add the downloaded `.p8` file as a GitHub secret (Claude tells you the exact name).
   - For iPhone push: an **APNs key** (Apple Developer > **Certificates, IDs & Profiles** > **Keys** > `+` > tick **Apple Push Notifications service**). You upload it in expo.dev > your project > **Credentials** > iOS.
3. The App Store needs its own screenshots (6.9-inch iPhone) and the same privacy answers; Claude makes them from this folder.

---

## What each GitHub setting is for (reference)

| Where | Name | What |
|---|---|---|
| Secret | `ANDROID_KEYSTORE_BASE64` | upload key file, as one line of text |
| Secret | `ANDROID_KEYSTORE_PASSWORD` | upload key password |
| Secret | `ANDROID_KEY_ALIAS` | `upload` |
| Secret | `ANDROID_KEY_PASSWORD` | upload key password (same) |
| Secret | `GOOGLE_SERVICES_JSON` | Firebase file, as one line of text (push) |
| Variable | `EAS_PROJECT_ID` | Expo project ID (push) |
| Variable | `APP_API_MODE` | `live` or `mock`, only for the test builds ("App Android build") |
| Variable | `APP_API_URL` | only if the server address ever changes |
| Variable | `APP_BUILD_OFFSET` | only if Play says "Version code has already been used": set it to `100` |

The three build buttons in GitHub Actions:

| Button | Makes | When |
|---|---|---|
| **App Android build** | a test `.apk` (also runs by itself on every app change) | testing on your phone |
| **App Android release** | the signed `.aab` for Google Play and a matching `.apk` | each Play release |
| **App iPhone check** | an iPhone Simulator build | to prove the iPhone app still compiles |
