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
