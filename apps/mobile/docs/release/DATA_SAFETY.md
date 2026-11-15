# Google Play "Data safety" answers

Play Console > your app > **Policy and programs** (left menu) > **App content** > **Data safety** > **Start**.
Click through the pages and pick exactly what is written here.

Worked out from the app's code on 16 November 2026 (what it sends to vibhapsychology.com: `apps/mobile/src`). If the app starts collecting something new, this page must change too. The same list is in the iPhone privacy manifest (`apps/mobile/app.config.ts`, `privacyManifests`) and in the website's Privacy Policy, section 6.10.

## Page 1: Data collection and security

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Which of the following methods of account creation does your app support? | **Username and password** and **Other**: write `Accounts are created by the school and invited by email; students cannot sign up in the app.` |
| Do you provide a way for users to request that their data is deleted? | **Yes** (the account deletion URL is `https://vibhapsychology.com/delete-account`) |

## Page 2: Data types

Tick only these. Leave everything else empty (Location, Financial info, Health and fitness, Contacts, Calendar, Web browsing, App info and performance, Messages).

| Group | Tick |
|---|---|
| Personal info | **Name**, **Email address**, **User IDs**, **Phone number** |
| Photos and videos | **Photos**, **Videos** |
| Audio | **Voice or sound recordings**, **Other audio files** |
| Files and docs | **Files and docs** |
| App activity | **App interactions**, **Other user-generated content** |
| Device or other IDs | **Device or other IDs** |

Why each one (do not paste; this is for you):
- Name, email, user ID: your account. Phone number: optional, only in "Request an invitation".
- Photos, videos, audio files, files and docs: only when a student picks a file to hand in an assignment (the system file picker; the app never reads the gallery).
- Voice recordings: an assignment answer recorded in the app.
- App interactions: lectures watched, progress, answers, test results.
- Other user-generated content: doubts and replies, written assignment answers, highlights and notes.
- Device or other IDs: the phone id the app makes for "one phone at a time", and the push messages token.

## Page 3: For each ticked type

Play asks the same questions for every ticked type. Answer them the same way for all, except "required or optional":

| Question | Answer for every type |
|---|---|
| Is this data collected, shared, or both? | **Collected** only (not shared) |
| Is this data processed ephemerally? | **No** |
| Is this data required for your app, or can users choose whether it's collected? | see the table below |
| Why is this user data collected? | **App functionality** and **Account management** only |

Do not tick Analytics, Developer communications, Advertising or marketing, Fraud prevention, or Personalization.

| Type | Required or optional |
|---|---|
| Name, Email address, User IDs, Device or other IDs, App interactions | **Required** |
| Phone number, Photos, Videos, Voice or sound recordings, Other audio files, Files and docs, Other user-generated content | **Users can choose** (optional) |

"Not shared": the school's own service providers (website hosting, database, video and push delivery) only process data for us, which Google does not count as sharing.

## Page 4: Preview

Check it says: no data shared, data encrypted in transit, you can request deletion. Click **Submit**.
