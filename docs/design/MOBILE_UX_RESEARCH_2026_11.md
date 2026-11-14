# Mobile UX research, November 2026

Why: the owner says the student side is at times confusing and not made for
phones. Most students use Android phones about 390 px wide. This note keeps
only the patterns worth copying, each adapted to VIBHA's own Neo-Brutalist
Pastel world (2 px ink borders, hard offset shadows, lime fill for the one
action, rounded rectangles for doing). We copy behaviour, never a brand's look.

Sources are listed under each section. Dribbble shots are image-only pages, so
the shots are used as visual references for layout (where the action sits,
how big the answer tiles are), not quoted.

## 1. The answer and the next step sit at the bottom

What the big apps do:

- **Duolingo**: one challenge per screen; the answer tiles fill the lower half;
  one full-width Check button is pinned at the very bottom. After checking, a
  feedback banner slides up from the bottom (about 200 ms) with the right
  answer and the same button turned into Continue. The progress bar keeps
  moving even after a wrong answer, only less.
- **Anki (AnkiMobile)**: the bottom area is empty until the answer is shown,
  then 2 to 4 grade buttons appear in a row at the bottom, each showing when
  the card comes back. The top bar holds only the rare tools.
- **Brilliant**: interactive steps with a single Continue/Check at the bottom
  and small celebrations on a right answer.
- **Imprint**: tap-forward lessons, one idea per step, knowledge checks
  inside the flow.
- Steven Hoober's field study (cited by Smashing): 49% of people hold the
  phone in one hand on the go. Put the main action in the lower half;
  keep Next, Back and Cancel reachable by the thumb in multi-step flows.

What VIBHA now does: a shared `ThumbBar` (src/components/mobile/thumb-bar.tsx).
On phones it pins Check, Next, Back or Mark at the bottom, above the tab bar
or the gesture bar; from 768 px the same buttons sit in the page. Used by the
Exam Prep question sets, the mock paper, weak-topic practice, the Study
tests and the Next button of MSE Lab, Rx Detective, Ward Week and Team Escape
Room. A disabled Check says "Pick an answer", so the empty state explains
itself.

Sources:
[blakecrosley.com, Duolingo design guide](https://blakecrosley.com/guides/design/duolingo) ·
[UX Case Study: Duolingo (Usability Geek)](https://medium.com/usabilitygeek/ux-case-study-duolingo-ade986ec7450) ·
[AnkiMobile study screen](https://docs.ankiweb.net/ankimobile/study-screen) ·
[ustwo x Brilliant](https://ustwo.com/work/brilliant) ·
[Brilliant and Rive animations](https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations) ·
[Imprint showcase (ScreensDesign)](https://screensdesign.com/showcase/imprint-learn-visually) ·
[Design mobile apps for one-hand usage (Smashing)](https://smashingmagazine.com/2020/02/design-mobile-apps-one-hand-usage/) ·
[How do users really hold mobile devices (UXmatters, Hoober)](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php)

## 2. Menus come up from the bottom on phones

- Smashing: flyouts that rise from the bottom are easier to reach than full
  page or top-corner menus; Spotify moving its menu from a top-left
  hamburger to a bottom bar raised menu use by 30%.
- NN/g on bottom sheets: always give a visible Close button (the grab handle
  alone is missed), support Back, never stack sheets, keep them short and
  for quick tasks, not for whole pages.
- Material: touch targets at least 48 dp with 8 dp between them.

What VIBHA now does: the More tab, the avatar menu, the reader's section
list, the topic's set list and the mock's question palette all open as
bottom sheets on phones (one at a time, with a Close button, a grab handle
and the gesture-bar inset). Tablets keep the side drawer and the corner menu.

Sources:
[NN/g, Bottom sheets](https://www.nngroup.com/articles/bottom-sheet/) ·
[Android touch target size](https://support.google.com/accessibility/android/answer/7101858) ·
[Smashing, one-hand usage](https://smashingmagazine.com/2020/02/design-mobile-apps-one-hand-usage/)

## 3. One header line, one job per screen

- Quizlet's redesign: one shared layout across study modes, so switching mode
  never means relearning the page; oversized type and empty space were cut
  because they made students scroll more and study less; making the study
  buttons bigger and clearer brought 21% more people into studying.
- Headway: reviewers flagged five bottom tabs as too many; the reading screen
  is plain and legible, with listening one tap away.
- Notion moved to a few top-level tabs for its mobile app.
- Khan Academy reviews: the course drop-down that fills the whole page
  overwhelms new users; mastery percentage per course is the progress cue
  people remember.

What VIBHA now does: Exam Prep's three-line title is "Exam Prep" on phones;
games and tools put Back, the name and the How to play button on one row;
the reader's module line stays on one line; a row of 13 set numbers above a
question (read as question numbers) became one "Set 1 of 13" button.

Sources:
[Quizlet, Launching a redesign for 20 million students](https://medium.com/tech-quizlet/launching-a-successful-redesign-for-20-million-students-2f4c4b518b6e) ·
[Headway showcase (ScreensDesign)](https://screensdesign.com/showcase/headway-daily-micro-learning) ·
[Notion's tabbed mobile navigation](https://matthiasfrank.de/en/notion-updates/new-tabbed-mobile-navigation/) ·
[Khan Academy UX review (Esther Liu)](https://esthermliu.github.io/blog/2022/11/09/khan-academy-ux-design)

## 4. Progressive disclosure

- Unacademy's live-class poll redesign: a collapsible poll panel so the class
  stays usable; results only after the poll ends; a simple leaderboard was
  "the right amount of information".
- Coursera's app: modules show the type (video or quiz) and the minutes of
  each item so learners can plan; quizzes sit inside the flow.
- NN/g: keep sheets and secondary panels for quick, secondary content.

What VIBHA already had and keeps: lecture "Check what stuck" folded under a
summary; Clinician detail folded on medicine doses; how-tos fold into a
button after Got it. New: filters and part tabs scroll sideways in one row
instead of wrapping into four rows.

Sources:
[Unacademy polls case study (UX Planet)](https://uxplanet.org/enhancing-polls-experience-in-live-classes-at-unacademy-a-product-design-case-study-3acdcbaf1d5b) ·
[Coursera showcase (ScreensDesign)](https://screensdesign.com/showcase/coursera-grow-your-career)

## 5. Streaks and progress without fear

- Mobbin's study of 859 streak designs: streaks lean on loss aversion; a
  missed day shown as fixable (Finch's repair icon) feels kinder than a
  blank; Duolingo found one missed day barely changes the habit, and two
  freezes instead of one brought about 200,000 more daily returners.
- Duolingo: the progress bar advances even after a wrong answer.

VIBHA keeps "0 days" with a flame on Home and no countdown nagging. Not
changed in this pass.

Sources:
[Streaks are about losing (Mobbin)](https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs) ·
[Duolingo design guide](https://blakecrosley.com/guides/design/duolingo)

## 6. Indian learning apps (PhysicsWallah, Unacademy)

- PhysicsWallah app-store feedback: praise for teaching and price; complaints
  about crashes in live classes, trouble reaching lessons, missing streaks
  and leaderboards on some devices. Lesson: stability and "where is my
  lecture" beat features.
- Unacademy: the learner side is mobile, the educator side is web; test on
  both.

VIBHA: the lecture page's "Lectures 1 of 2" picker no longer squeezes into a
vertical stack at 390 px; the lecture list opens as a bottom sheet.

Sources:
[PhysicsWallah app feedback report (Kimola)](https://kimola.com/reports/unlock-insights-physics-wallah-app-user-feedback-report-app-store-in-156485) ·
[Unacademy polls case study](https://uxplanet.org/enhancing-polls-experience-in-live-classes-at-unacademy-a-product-design-case-study-3acdcbaf1d5b)

## 7. Mobile web rules we follow

- Tap targets: 24 x 24 CSS px minimum (WCAG 2.5.8), 44 x 44 on touch screens
  (WCAG 2.5.5); Android asks 48 dp. Our buttons are 44 px on touch, the
  ThumbBar's are 48 px.
- Safe areas: `viewport-fit=cover`, then pad fixed bars by
  `env(safe-area-inset-*)`. Our tab bar, ThumbBar, sheets and search do.
- Text fields at 16 px or more so the phone does not zoom in on focus.
- `prefers-reduced-motion`: one global rule flattens every animation and
  transition; the reader jumps instead of gliding.
- No fixed bar inside an animated card: a card that pops in with a transform
  pins a fixed child inside itself (checked in Chromium), so ThumbBar is
  rendered into `<body>` on phones.

Sources:
[Adapt to the form factor (Chrome modern web guidance)](https://developer.chrome.com/docs/modern-web-guidance/guides/user-experience/form-factor-adaptation) ·
[WCAG 2.2, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## 8. Dribbble references (visual only)

Looked at for where the action sits and how answer tiles, streak counters,
reading screens and bottom bars are sized:
[Language Learning Mobile iOS App](https://www.dribbble.com/shots/23214544-Language-Learning-Mobile-iOS-App) ·
[Educational Mobile iOS App](https://WWW.dribbble.com/shots/22936105-Educational-Mobile-iOS-App) ·
[eLearning App for High School Students](https://dribbble.com/shots/15509620-eLearning-App-for-High-School-Students-UI-UX-Design) ·
[Queezy quiz leaderboard](https://www.dribbble.com/shots/22025861-Queezy-Quiz-App-Leaderboard-Screen) ·
[Audiocards language study app](https://dribbble.com/shots/13846484-Audiocards-Language-study-app) ·
[Duolingo Streak Society](https://WWW.dribbble.com/shots/19161257-Duolingo-Streak-Society) ·
[Reading-skills app](https://dribbble.com/shots/22393928-An-app-for-teaching-reading-skills-in-different-languages) ·
[Quiz collection](https://dribbble.com/Radziu/collections/4504490-Quiz) ·
[Pattern quiz questions collection](https://dribbble.com/elandrehocepied/collections/4491888-Pattern-Quiz-Questions)

Common thread across the shots: one question per screen, answer tiles as
full-width rows of 56 px or more, the primary button full width at the
bottom, the streak as a small counter in the top corner, the reading screen
with generous line height and a progress line at the top.

## 9. Audit at 360, 390 and 412 px (what was found, what changed)

Method: every student screen rendered in a fixture harness (the real page
components, Supabase stubbed) and screenshot in Chromium with phone
emulation at 360, 390 and 412 px; login and the public pages also against
`next dev --webpack`. Each screenshot was also scanned for sideways scroll,
clipped text, controls under 40 px and fixed bars. Screenshots: scratchpad
`mobux-shots/shots/before` and `.../after`.

| Screen | Found | Change |
|---|---|---|
| Exam Prep question set | A row of 13 set numbers above "Question 1" read as question numbers; Check and Next mid-page | "Set 1 of 13" opens a bottom sheet; Check / Next in the ThumbBar |
| Mock paper | Palette pushed into the page; parts wrapped into several rows; top bar wrapped at 360 | Palette as a bottom sheet; parts scroll in one row; one-line top bar; Back, Mark, Next at the bottom |
| Study tests, checkpoints, weak-topic practice | Back/Next below the options | ThumbBar |
| Reader | Section list pushed a long list into the page; module line two lines | Bottom sheet, opens on the current section; one-line module line |
| More, avatar menu | Left drawer opened from a bottom-right tab; 40 px corner menu; close X on top of the email | Bottom sheets on phones with 48 px rows |
| Search | 14 px input (zoom on focus), 16 px close, keyboard hints on phones | 16 px input, 44 px close, hints only on wide screens |
| Medicines | Four rows of filter chips before the list | One sideways row of 44 px chips |
| Games and tools | Back row doubled the side margin; How to play on its own row; Next under long explanations | One header row; Next in the ThumbBar (MSE Lab, Rx Detective, Ward Week, Escape Room) |
| Practice drills | Small Next under the feedback | ThumbBar, 48 px (Weak spots, Out of depth, Decode, Judgment, Ethics) |
| Lecture | "Lectures 1 of 2" squeezed into a vertical stack at 390 | Fixed |
| Exam Prep home | Three-line title | "Exam Prep" on phones |
| Home | Quest links 20 px tall | 44 px rows |
| Summaries | 41 tall cards | Compact rows on phones (about a quarter shorter) |
| Note | Back a 20 px text link, Next a pill | 48 px rectangles |
| Settings, Notifications | A second app bar under the top bar; 32 px side margins | Standard page header; shell margins |
| Any text field | Tab bar sat on the keyboard | Tab bar and ThumbBar hide while typing |
| Dialogs | No height cap | Capped at the screen, scroll inside |
| Login | Eight dots as placeholder looked like a saved password | "Your password" and a Show password button |
| Bottom tab bar | 11 px labels | 12 px |

Left as is, on purpose: the hint UI in games (another agent owns it); the
in-play layout of Blitz, Criteria sort, Comorbid and Duel (timed or
card-driven, no Next button; another agent is editing those files).
