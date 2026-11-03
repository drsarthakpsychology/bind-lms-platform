# Cohorts, access, first-login details and levels

## Cohorts (Admin → People → Cohorts)
- A **cohort** is a batch of students (Cohort 1, Cohort 2, …). A person can be in more than one.
- Each cohort sees **only the lectures shared with it**. Everything else on the platform (Notes, Games, Practice) is shared by everyone, as their access level allows.
- **Add people**: paste one or many emails, pick the cohort and access level (Lectures only / Full platform), tick "Email them their login link now". New emails get an account (no password is ever shown or sent; they set their own from the one-time link). Existing accounts are simply added.
- **Lectures tab**: tick which lectures the cohort can watch, by week, or Share all / Share none.
- **New lectures** are shared automatically with the course's running and upcoming cohorts.
- **Access page** for one person (from the cohort list or Students → Access): their cohorts, Lectures only / Full platform, extra single lectures, their details, level and hours.
- People in **no cohort** keep the old rules (enrolled course, or every published course for lectures-only accounts), so nobody loses access before being placed.
- The rules live in `src/lib/cohorts/rules.ts` (tested) and are enforced in the lecture list, the lecture page, the playback token and the video stream.

## First-login details
- Every student sees a form over every page until they fill it once: full name, mobile, city, state (or country), highest qualification, college or workplace, and what they do now.
- Step 2 shows what they entered; they tick "these are correct" and submit. They are never asked again.
- An admin can ask a student to fill it again from their Access page.
- Stored in `student_details`; name and mobile are copied onto the account.

## Levels and hours
- Points = notes and games XP + 1 per lecture minute watched + 25 per lecture finished + 10 per hour on VIBHA. Everyone starts at Level 1.
- "Your level" card on Home and Practice; the full board (your cohort, first name and initial only) at `/practice/leaderboard`.
- Totals come from the `standing_totals()` database function (server only).

## Database
`supabase/migrations_pending/2026_11_cohorts.sql` (additive). It also creates "Cohort 1", puts every current student in it, and shares every existing lecture with it.
