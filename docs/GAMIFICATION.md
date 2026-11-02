# Learn with Chai: design logic

The goal is to make students want to come back every day, and to make sure the knowledge actually sticks. Each mechanic below exists for a reason, and each reason is backed by learning science or by what has worked in large consumer apps.

## The loop (about 3 minutes)

1. **Open the app.** Chai, the mascot, greets the student with one specific reason to start right now. For example: a streak that's waiting, reviews that are due, or the next lesson.
2. **Play a lesson.** A lesson is 4 to 8 questions in five formats: pick one, true/false, match pairs, put in order, and sort into two groups. The formats rotate so attention doesn't drift.
3. **Get instant feedback.** Every answer gets a reaction straight away: a colour, Chai's mood, haptics on Android, and an XP pop. When an answer is wrong, the right answer and the key point are shown immediately.
4. **Learn from mistakes.** A question the student gets wrong comes back once at the end of the same lesson, then again in Review on days 1, 3, 7, 14 and 30.
5. **Finish with a payout.** The student sees stars, an XP breakdown, a chest to tap open, any new badges, a level-up if earned, and the effect on the streak.

## Why each piece is there

| Mechanic | Why it works | Where in the code |
|---|---|---|
| Questions, not reading | The testing effect: recalling something strengthens memory more than re-reading it (Roediger & Karpicke, 2006). | `src/lib/learn/content/*` |
| Review on days 1/3/7/14/30 | The spacing effect: practice spread over time beats cramming (Cepeda et al., 2006). This is a Leitner box system. | `reviewCard`, `dueItems` |
| Missed question repeated at lesson end | Errorful learning followed by quick correction improves retention. The student leaves the lesson having got it right. | `player.tsx` (`retried`) |
| Immediate feedback with an explanation | Elaborated feedback helps learning more than a bare right/wrong. | Feedback sheet |
| Combo meter and bonus XP | Momentum: a short run of successes feels good, and the student is rewarded for staying focused. | `answerXp` |
| Chest with a random bonus, sometimes a jackpot | A variable reward keeps the end of every lesson exciting. It is kept small so it never replaces real progress. | `chestBonus` |
| Daily goal ring (20/40/60 XP) | A small goal the student chose for themselves (autonomy), visible progress, and the goal-gradient effect: people speed up as they get close. | `daily`, `DAILY_GOALS` |
| Streak, with a freeze earned every 7 days | Loss aversion builds the habit. Freezes stop one missed day from wiping out weeks of effort, which is the main reason people quit. | `touchStreak` |
| Levels with clinical titles (Observer → Consultant) | Competence (self-determination theory): the titles mirror real professional growth. The gaps between levels widen gradually. | `LEVELS` |
| Badges | Milestones to aim for, and each one tells a small story (for example "Clinician's discipline" for a 30-day streak). | `BADGES` |
| Chai the cat | A friendly character makes mistakes feel safe and celebrations feel shared, much like Duolingo's owl. Chai's mood mirrors the student's performance. | `components/learn/chai.tsx` |
| Student / Clinician view | One question, two depths: plain words for beginners, medical framing for advanced students. The student chooses which. | `view-toggle.tsx` |
| 60-second blitz | A quick, replayable challenge with a personal best to beat. | `Blitz` in `player.tsx` |
| Lessons unlock in order within a unit; all units are open | Guided progression within a topic, while the student still chooses what to study (autonomy). | `learn-home.tsx` |

Evidence summary: a meta-analysis of gamified learning found positive effects on learning (g ≈ 0.49), motivation (g ≈ 0.36) and behaviour (g ≈ 0.25), with the strongest effects when game elements support the learning task itself rather than sitting on top of it (Sailer & Homner, 2020).

## Guardrails

- **No punishment that stops learning.** There are no "lives" or "hearts" that lock a student out.
- **No guilt notifications.** Chai's lines are encouraging, never shaming.
- **Accuracy first.** Clinical content is checked against standard references (DSM-5-TR, ICD-11, standard psychopharmacology texts and the Indian Mental Healthcare Act 2017). Student-facing text never cites books or pages.
- **Recognise, don't prescribe.** Psychopharmacology content teaches students to recognise medicines and know when to refer. It does not teach how to choose a dose.
- **Starts hidden.** Admins switch it on in Admin → Content → What's live → "Learn with Chai".

## Adding content

Add questions to a unit file in `src/lib/learn/content/`, using the `mcq`, `tf`, `match`, `order` and `sort` helpers. Every question needs a `student` explanation and a `clinician` explanation. `npm run test` checks that IDs are unique, answers are valid and no book is cited.

## Coach: adaptive teaching (`/practice/learn/coach`)

- **Concept bank:** 235 concepts across 9 topics: signs and symptoms, clinical disorders, neuroscience, psychopharmacology, therapies, counselling skills, assessment, ethics and Indian law. Each concept has a plain meaning, a clinical meaning, tags and sometimes a memory hook. They live in `src/lib/learn/concepts/`.
- **Mastery:** every concept has a mastery level from 0 to 5 for each student. New concepts are taught first with a teach card, then asked.
- **The question gets harder as mastery grows:**
  1. pick the term from its meaning;
  2. pick the meaning from the term;
  3. true/false with a look-alike;
  4. type the term from memory (small typos are accepted).
- **When a student gets one wrong:**
  - the level drops;
  - the concept is taught again, with a side-by-side of the two things they confused;
  - it comes back a few questions later, up to twice per session, then again the next day, until they get it right.
- **Remembered confusions:** each mix-up is stored, and the confused concept is then used on purpose as a wrong option, so the student practises exactly the distinction they struggle with.
- **What goes into a session:** concepts to relearn, then reviews that are due, then *new concepts similar to recent mistakes*, then fresh concepts.
- **After a session:** the summary shows each concept's level change and suggests similar concepts to study next.

## Clinic detective (`/practice/learn/detective`)
Clues appear one at a time. Guessing on clue 1 scores 40 points, clue 2 scores 30, clue 3 scores 20 and clue 4 scores 10. Each wrong guess costs 5 points. There are 32 cases (20 medicines, 12 disorders), and the score earns XP.

## My progress (`/practice/learn/progress`)
Shows mastery by topic, XP for the last 14 days, the student's most common mix-ups, and a weekly leaderboard. The leaderboard resets every week so everyone gets a fresh chance. It shows only first name and last initial, and lists the top 10 plus the student and their neighbours.

## Admin: Activity (`/admin/activity`)
For each student it shows:
- time on the platform over 7 and 30 days, and days active;
- when they were last seen;
- lectures completed and started, and minutes watched;
- Learn XP, streak and accuracy;
- practice sessions;
- an overall rank, with the top 3 and bottom 3 highlighted.

The page also has a heatmap of when the cohort studies and a breakdown of where the time goes. Each student has a deep-dive page with minutes per day, every lecture, recent activity, Learn mastery and their mix-ups.

## Notes (`/practice/notes`)
- **What's there:** 21 visual notes, grouped by curriculum week. Each note has a TL;DR line, sections of short points, sticker chips and step lists, red-flag boxes, and "Say it clinically" flip cards. Sections animate in, key lines get a highlighter sweep, and there are no paragraphs.
- **Two views:** every bullet has a Student version and a Clinician version. The Student / Clinician switch changes the same page in place.
- **Quiz and next steps:** each note ends with "Quiz me", which opens the matching lesson or Coach topic. It also links to its "What would you do?" cases and to the leaderboard.
- **Sources:** checked against DSM-5-TR for criteria, Kaplan & Sadock for disorders and terminology, and Stahl for medicines. Students never see a book name or page.

## What would you do? (`/practice/learn/scenarios`)
- There are 10 branching clinic cases, each with one or two beats.
- In each beat the patient says something tricky and the student picks a response. Each choice is rated **Best**, **Okay, but…** or **Risky**, and the student sees what happens next.
- Some of the wrong answers sound kind on purpose. For example: promising secrecy, reassuring in OCD, or arguing with a delusion.

## Say it clinically (`/practice/learn/terms`)
Rounds of 12 questions that mix two drills:
- **Case-sheet words:** turning an everyday phrase into the clinical term ("keeps checking the lock" → checking compulsion).
- **Words matter:** picking the respectful phrasing ("died by suicide", "person with schizophrenia", "reports" rather than "claims").

## DSM-5-TR chapters, brain basics, patient language, Today's plan
- `src/lib/learn/notes/dsm.ts`: one note per DSM-5-TR chapter (19), plus "Brain & behaviour basics" and "How patients talk" in week 1. Every chapter note has a "How it sounds" section with real-sounding patient words.
- Plain words only: no maths signs (at least / less than / more than). A test enforces this.
- Read tracking: `LearnState.notesRead` (note id → day). Opening a note marks it read. Notes list shows ticks, a "Continue with" card and X of N read.
- Learn home "Today's plan": 1 read a note → 2 take its quiz → 3 review what's due. Each step ticks off; the current one is lime with "Start →".
- Every note ends with "What to do now" (read ✓, quiz, practise) and a "Next:" button.
