# Layout defects, November 2026 (before the redesign)

Measured 2026-11-15 on branch agent/dsys right after merging admin-redesign (the same code as the live site), with `e2e/layout-defects.mjs`.

- 114 screens, each at 360, 390, 412, 768, 1024 and 1440 px, light and dark (1368 page loads).
- **13832 defects** in total. One defect is one element at one width in one theme, so one bad shared component on a long list counts many times.
- Screens render from a fixture build (real page components, stand-in data), so empty lists are common and real data can show more.
- Screenshots (every flagged element outlined in red): `/tmp/claude-0/-home-claude/1ec55112-adfe-5420-9ed7-32620d412cb4/scratchpad/dsys-shots/audit1` (360, 390), `audit2` (412, 768), `audit3` (1024, 1440), named `<screen>-<width>-<theme>.jpg`. The scratchpad is temporary: rerun the tool to get them again.
- Not rendered in the fixture (redirects or missing stand-in data): practice-supervision, practice-tutor, practice-two-minute-clinic, prep-diagnostic, prep-goal, prep-review, study-placement, today, tools-psychopharm. Also skipped: pages that only redirect, and pages with an id in the address other than the ones listed.

Problem words: **hscroll** page scrolls sideways · **overflow** text passes its box · **clip** text cut by an overflow-hidden box · **overlap** text on top of other text · **truncate** cut with "..." and no title to read the rest · **tiny** text under 12px · **measure** reading lines over 80 characters · **tap** control under 44px on touch widths.

## Totals by area

| area | hscroll | overflow | clip | overlap | truncate | tiny | measure | tap | total |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Games, practice, exam prep |  |  | 80 | 6 | 514 | 1265 | 8 | 3432 | 5305 |
| Student learning |  | 6 | 176 | 256 | 1696 | 1823 | 2 | 64 | 4023 |
| Public pages |  |  | 298 |  |  | 1680 | 14 | 484 | 2476 |
| Admin | 4 | 4 | 6 |  | 58 | 1048 | 4 | 560 | 1684 |
| Medicines |  |  |  |  | 66 | 112 | 8 | 158 | 344 |

## Totals by screen

| screen | route | area | hscroll | overflow | clip | overlap | truncate | tiny | measure | tap | total |
|---|---|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| practice-formulation | /practice/formulation | Games, practice, exam prep |  |  |  |  |  | 16 |  | 3272 | 3288 |
| landing | / | Public pages |  |  | 298 |  |  | 1284 |  | 196 | 1778 |
| study-reference | /study/reference | Student learning |  | 6 |  |  | 1690 | 28 |  |  | 1724 |
| map | /study/map | Student learning |  |  | 176 | 176 |  | 558 |  | 8 | 918 |
| study | /study | Student learning |  |  |  |  |  | 522 |  |  | 522 |
| escape | /games/escape | Games, practice, exam prep |  |  |  |  | 284 | 16 |  |  | 300 |
| prep-smart-quizzes | /prep/smart/quizzes | Games, practice, exam prep |  |  | 76 |  |  | 160 |  | 24 | 260 |
| practice-osce | /practice/osce | Games, practice, exam prep |  |  |  |  |  | 256 |  |  | 256 |
| ward | /games/ward | Games, practice, exam prep |  |  | 4 |  | 220 | 16 |  |  | 240 |
| admin-people | /admin/people | Admin |  |  |  |  | 12 | 144 |  | 80 | 236 |
| free | /free | Public pages |  |  |  |  |  | 192 | 4 |  | 196 |
| admin-students-logins | /admin/students/logins | Admin |  |  |  |  | 6 | 96 |  | 72 | 174 |
| medicine | /practice/medicines/[id] | Medicines |  |  |  |  |  | 42 | 2 | 128 | 172 |
| admin-students | /admin/students | Admin |  |  | 4 |  | 28 | 60 |  | 80 | 172 |
| waitlist | /waitlist | Public pages |  |  |  |  |  | 48 |  | 104 | 152 |
| notes | /study/notes | Student learning |  |  |  |  |  | 148 |  |  | 148 |
| admin-access | /admin/access | Admin |  |  |  |  | 4 | 36 |  | 80 | 120 |
| expired | /expired | Public pages |  |  |  |  |  | 36 |  | 80 | 116 |
| paused | /paused | Public pages |  |  |  |  |  | 36 |  | 80 | 116 |
| medicines | /practice/medicines (was /tools/psychopharm) | Medicines |  |  |  |  | 66 | 30 |  | 14 | 110 |
| note | /study/notes/[id] | Student learning |  |  |  | 68 |  | 40 |  |  | 108 |
| reader | /study/[module]/[section] | Student learning |  |  |  |  | 6 | 82 |  | 14 | 102 |
| admin-modules | /admin/modules | Admin | 4 |  |  |  |  | 24 |  | 72 | 100 |
| practice-library | /practice/library | Games, practice, exam prep |  |  |  |  |  | 16 |  | 80 | 96 |
| admin-submissions | /admin/submissions | Admin |  |  |  |  |  | 24 |  | 48 | 72 |
| games | /games | Games, practice, exam prep |  |  |  |  |  | 66 |  |  | 66 |
| free-help | /free/help | Public pages |  |  |  |  |  | 48 | 10 | 8 | 66 |
| games-lab-cases | /games/lab/cases | Games, practice, exam prep |  |  |  |  |  | 30 |  | 32 | 62 |
| admin-emails | /admin/emails | Admin |  |  |  |  |  | 28 |  | 32 | 60 |
| home | /dashboard | Student learning |  |  |  |  |  | 54 |  |  | 54 |
| journey | /journey | Student learning |  |  |  |  |  | 42 |  | 8 | 50 |
| admin-doubts | /admin/doubts | Admin |  |  |  |  |  | 24 |  | 24 | 48 |
| record | /record | Student learning |  |  |  |  |  | 30 |  | 18 | 48 |
| admin | /admin | Admin |  |  | 2 |  |  | 36 |  | 8 | 46 |
| module | /study/[module] | Student learning |  |  |  |  |  | 42 | 2 |  | 44 |
| admin-inbox | /admin/inbox | Admin |  |  |  |  |  | 36 |  | 8 | 44 |
| admin-students-add | /admin/students/add | Admin |  |  |  |  |  | 36 |  | 8 | 44 |
| admin-tools | /admin/tools | Admin |  |  |  |  |  | 24 | 4 | 16 | 44 |
| doubts | /doubts | Student learning |  |  |  | 12 |  | 30 |  |  | 42 |
| pmse | /practice/mse | Games, practice, exam prep |  |  |  |  |  | 28 | 4 | 8 | 40 |
| lesson | /courses/[id]/lessons/[id] | Student learning |  |  |  |  |  | 32 |  | 8 | 40 |
| admin-forms-new | /admin/forms/new | Admin |  |  |  |  |  | 24 |  | 16 | 40 |
| practice-out-of-depth | /practice/out-of-depth | Games, practice, exam prep |  |  |  |  |  | 40 |  |  | 40 |
| passport | /passport | Student learning |  |  |  |  |  | 30 |  | 8 | 38 |
| study-map-practice | /study/map/practice | Student learning |  |  |  |  |  | 37 |  |  | 37 |
| leaderboard | /leaderboard | Games, practice, exam prep |  |  |  |  | 6 | 30 |  |  | 36 |
| admin-ai-cases | /admin/ai-cases | Admin |  |  |  |  |  | 36 |  |  | 36 |
| admin-cohorts | /admin/cohorts | Admin |  |  |  |  |  | 36 |  |  | 36 |
| admin-forms | /admin/forms | Admin |  |  |  |  |  | 36 |  |  | 36 |
| admin-psychopharm-review | /admin/psychopharm-review | Admin |  |  |  |  |  | 36 |  |  | 36 |
| admin-pulse | /admin/pulse | Admin |  | 4 |  |  | 8 | 24 |  |  | 36 |
| admin-courses | /admin/courses | Admin |  |  |  |  |  | 24 |  | 8 | 32 |
| admin-cards | /admin/cards | Admin |  |  |  |  |  | 24 |  | 8 | 32 |
| tools-psychopharm-compare | /tools/psychopharm/compare | Medicines |  |  |  |  |  | 18 | 6 | 8 | 32 |
| lectures | /courses | Student learning |  |  |  |  |  | 30 |  |  | 30 |
| prep | /prep | Games, practice, exam prep |  |  |  | 6 |  | 24 |  |  | 30 |
| practice | /practice | Games, practice, exam prep |  |  |  |  |  | 30 |  |  | 30 |
| gamesboard | /games/leaderboard | Games, practice, exam prep |  |  |  |  |  | 30 |  |  | 30 |
| games-lab | /games/lab | Games, practice, exam prep |  |  |  |  |  | 30 |  |  | 30 |
| leaderboard-shop | /leaderboard/shop | Games, practice, exam prep |  |  |  |  |  | 30 |  |  | 30 |
| tools-psychopharm-learn | /tools/psychopharm/learn | Medicines |  |  |  |  |  | 22 |  | 8 | 30 |
| wall | /wall | Student learning |  |  |  |  |  | 30 |  |  | 30 |
| revise | /prep/smart/revise | Games, practice, exam prep |  |  |  |  |  | 28 |  |  | 28 |
| practice-consulting-room | /practice/consulting-room | Games, practice, exam prep |  |  |  |  |  | 28 |  |  | 28 |
| practice-ethics | /practice/ethics | Games, practice, exam prep |  |  |  |  |  | 28 |  |  | 28 |
| prep-smart-coach | /prep/smart/coach | Games, practice, exam prep |  |  |  |  | 2 | 16 |  | 8 | 26 |
| admin-enquiries | /admin/enquiries | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-learning | /admin/learning | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-checkins | /admin/checkins | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-credentials | /admin/credentials | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-flags | /admin/flags | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-infra | /admin/infra | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-sim-review | /admin/sim-review | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-supervision | /admin/supervision | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-triage | /admin/triage | Admin |  |  |  |  |  | 24 |  |  | 24 |
| admin-wall-reports | /admin/wall-reports | Admin |  |  |  |  |  | 24 |  |  | 24 |
| practice-role-play | /practice/role-play | Games, practice, exam prep |  |  |  |  |  | 16 |  | 8 | 24 |
| daily | /practice/daily | Games, practice, exam prep |  |  |  |  |  | 22 |  |  | 22 |
| practice-landmark | /practice/landmark | Games, practice, exam prep |  |  |  |  |  | 16 | 4 |  | 20 |
| setup | /setup | Public pages |  |  |  |  |  | 12 |  | 8 | 20 |
| login | /login | Public pages |  |  |  |  |  | 12 |  | 8 | 20 |
| journal | /reflect | Student learning |  |  |  |  |  | 18 |  |  | 18 |
| mocks | /prep/mock | Games, practice, exam prep |  |  |  |  |  | 18 |  |  | 18 |
| notfound | not found (signed in) | Student learning |  |  |  |  |  | 18 |  |  | 18 |
| notifications | /notifications | Student learning |  |  |  |  |  | 18 |  |  | 18 |
| settings | /settings | Student learning |  |  |  |  |  | 18 |  |  | 18 |
| scenarios | /practice/scenarios | Games, practice, exam prep |  |  |  |  | 2 | 16 |  |  | 18 |
| practice-not-available | /practice/not-available | Games, practice, exam prep |  |  |  |  |  | 18 |  |  | 18 |
| smart | /prep/smart | Games, practice, exam prep |  |  |  |  |  | 17 |  |  | 17 |
| prep-run | /prep/[subject]/[topic] | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| blitz | /games/blitz | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| long | /prep/long | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| subject | /prep/[subject] | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| mock | /prep/mock/[spec] | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| msegame | /games/mse | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| rx | /games/rx | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| duel | /games/duel | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| comorbid | /games/comorbid | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| detective | /practice/detective | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| terms | /practice/terms | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| judgment | /practice/judgment | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| checkpoint | /study/[module]/checkpoint/[n] | Student learning |  |  |  |  |  | 16 |  |  | 16 |
| practice-weak-spots | /practice/weak-spots | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| prep-interview | /prep/interview | Games, practice, exam prep |  |  |  |  |  | 16 |  |  | 16 |
| rootnotfound | not found (public) | Public pages |  |  |  |  |  | 12 |  |  | 12 |
| progress | /progress | Student learning |  |  |  |  |  |  |  |  | 0 |
| sort | /games/sort | Games, practice, exam prep |  |  |  |  |  |  |  |  | 0 |
| course | /courses/[id] | Student learning |  |  |  |  |  |  |  |  | 0 |
| admin-activity | /admin/activity | Admin |  |  |  |  |  |  |  |  | 0 |
| admin-management | /admin/management | Admin |  |  |  |  |  |  |  |  | 0 |
| leaderboard-overall | /leaderboard/overall | Games, practice, exam prep |  |  |  |  |  |  |  |  | 0 |
| prep-saved | /prep/saved | Games, practice, exam prep |  |  |  |  |  |  |  |  | 0 |
| prep-wrong | /prep/wrong | Games, practice, exam prep |  |  |  |  |  |  |  |  | 0 |
| set-password | /set-password | Public pages |  |  |  |  |  |  |  |  | 0 |

## Defects by screen

Same element at several widths or themes is one row here; "count" is how many times it was flagged. Up to 12 rows per screen, most frequent first.

### practice-formulation (/practice/formulation) · 3288

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 3248 | 360, 390, 412, 768 | `nav.mt-5.flex.gap-2 > a.inline-flex.shrink-0.items-center` | New this weekCase 150: Tenzin | 289x38px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.space-y-4 > button.w-full.rounded-md.border-2` | 11 cards left to sort | 328x41px |
| tap | 8 | 360, 390, 412, 768 | `form.space-y-2.rounded-lg.border-2 > input.w-full.rounded-md.border-2` |  | 292x40px |
| tap | 8 | 360, 390, 412, 768 | `form.space-y-2.rounded-lg.border-2 > button.ml-auto.flex.items-center` | Post to the wall | 132x33px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### landing (/) · 1778

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 180 | 360, 390, 412, 768, 1024, 1440 | `div > span.home_pixLabel` | Psychiatrist | 10.9px text |
| tap | 146 | 360, 390, 412, 768 | `li > a` | What you get | 101x32px |
| tiny | 132 | 360, 390, 412, 768, 1024, 1440 | `span > small` | PHQ-9 · 3 min | 9.9px text |
| tiny | 108 | 360, 390, 412, 768, 1024, 1440 | `div.home_jTop > span.home_jKey` | Interview | 10.2px text |
| clip | 102 | 360, 390, 412, 768, 1024, 1440 | `article.home_jCard > p` | In his own words. Onset, triggers, sleep | cut off by div (overflow hidden) by 217px |
| clip | 100 | 360, 390, 412, 768, 1024, 1440 | `article.home_jCard > h4.home_jStepTitle` | Take the history | cut off by div (overflow hidden) by 178px |
| tiny | 96 | 360, 390, 412, 768, 1024, 1440 | `div.home_tlCard > span.home_tlWeek` | Weeks 1 to 2 | 11.2px text |
| tiny | 96 | 360, 390, 412, 768, 1024, 1440 | `button#depth-tab-0 > span.home_dtNum` | 01 | 11.5px text |
| tiny | 96 | 360, 390, 412, 768, 1024, 1440 | `div > dt` | Starts | 10.6px text |
| tiny | 72 | 360, 390, 412, 768, 1024, 1440 | `div.home_pickerRow > dt` | In clinic | 10.2px text |
| tiny | 72 | 360, 390, 412, 768, 1024, 1440 | `div.home_scBody > span.home_pixLabel` | You learn to | 10.9px text |
| tiny | 60 | 360, 390, 412, 768, 1024, 1440 | `div.home_gameTop > span` | Clinic call | 11.2px text |

### study-reference (/study/reference) · 1724

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| truncate | 1690 | 360, 390, 412, 768 | `span.min-w-0.flex-1 > span.line-clamp-2.text-small.text-muted-foreground` | A medicine that helps people stay abstin | cut to 2 lines, no title |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.space-y-1 > p.text-eyebrow.text-link` | Quick Reference | 10.6px text |
| overflow | 6 | 360, 390 | `span.min-w-0.flex-1 > span.block.font-bold.leading-snug` | Naltrexone/Bupropion | text passes the box edge by 11px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### map (/study/map) · 918

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 528 | 360, 390, 412, 768, 1024, 1440 | `div.flex.min-h-11.flex-col > span.font-bold.uppercase.opacity-80` | Spot it | 11.2px text |
| clip | 176 | 1024, 1440 | `div.flex.min-h-11.flex-col > span.font-bold.uppercase.opacity-80` | Spot it | text passes the box edge by 43px |
| overlap | 176 | 1024, 1440 | `div.flex.min-h-11.flex-col > span.font-bold.uppercase.opacity-80` | Spot it | text sits on "Not started" (25x14px) |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Progress | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.col-span-2.flex.min-w-0 > a.inline-flex.min-h-11.items-center` | OCD | 36x44px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### study (/study) · 522

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 480 | 360, 390, 412, 768, 1024, 1440 | `span.min-w-0.flex-1 > span.block.text-eyebrow.opacity-80` | Module 1 · You are here | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Study | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.flex.min-w-0.flex-1 > span.text-eyebrow.opacity-80` | Module 1 · Read | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### escape (/games/escape) · 300

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| truncate | 284 | 360, 390, 412, 768, 1024, 1440 | `p.flex.min-w-0.items-center > span.truncate` | University health centre, London | ends in ... with no title |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### prep-smart-quizzes (/prep/smart/quizzes) · 260

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 144 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0 > p.text-eyebrow.opacity-80` | Unit 1 | 10.6px text |
| clip | 36 | 360, 390, 412 | `span.mt-auto.text-lg.tracking-wider > span.opacity-20` | ★ | cut off by li (overflow hidden) by 100px |
| clip | 28 | 360, 390, 412 | `a.flex.h-full.flex-col > span.font-bold.leading-tight` | Perception & belief | cut off by li (overflow hidden) by 39px |
| tap | 24 | 360, 390, 412, 768 | `div.mt-2.flex.flex-wrap > button.rounded-full.border-2.border-foreground` | Casual · 20 XP | 134x36px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| clip | 12 | 360, 390, 412 | `a.flex.h-full.flex-col > span.text-xs.font-semibold.text-link` | Lesson 3 | cut off by li (overflow hidden) by 132px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-osce (/practice/osce) · 256

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 240 | 360, 390, 412, 768, 1024, 1440 | `span.flex.items-start.justify-between > span.text-eyebrow.text-muted-foreground` | Station 247 | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### ward (/games/ward) · 240

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| truncate | 220 | 360, 390, 412, 768, 1024, 1440 | `p.flex.min-w-0.items-center > span.truncate` | Emergency room and OPD, Hyderabad | ends in ... with no title |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| clip | 4 | 1024, 1440 | `p.flex.min-w-0.items-center > span.truncate` | Memory clinic, Kolkata | text passes the box edge by 2px |

### admin-people (/admin/people) · 236

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 96 | 360, 390, 412, 768, 1024, 1440 | `button.inline-flex.h-9.shrink-0 > span.font-pix.opacity-80` | 1 | 10.4px text |
| tap | 64 | 360, 390, 412, 768 | `div.flex.gap-2.overflow-x-auto > button.inline-flex.h-9.shrink-0` | Everyone1 | 107x36px |
| tap | 16 | 360, 390, 412, 768 | `div.inline-flex.shrink-0.rounded-full > button.inline-flex.h-8.cursor-pointer` | Table | 83x32px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | People | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.justify-self-end > span.inline-flex.h-6.items-center` | Joined | 11.2px text |
| truncate | 8 | 360, 390, 412, 768 | `span.min-w-0 > span.block.truncate.text-caption` | priya.ramaswamy.longname@example.com | ends in ... with no title |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| truncate | 4 | 360, 768 | `span.min-w-0 > span.block.truncate.text-sm` | priya.ramaswamy.longname | ends in ... with no title |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### free (/free) · 196

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 96 | 360, 390, 412, 768, 1024, 1440 | `a.free_card > span.free_cardMeta` | GAD-7 · 2 min | 9.9px text |
| tiny | 36 | 360, 390, 412, 768, 1024, 1440 | `a.free_card.free_cardInk > span.free_cardMeta` | 1 to 5 min | 9.9px text |
| tiny | 24 | 360, 390, 412, 768, 1024, 1440 | `div.free_sectionHead > span.free_tag` | Self-checks | 11.5px text |
| tiny | 24 | 360, 390, 412, 768, 1024, 1440 | `a.free_card.free_cardLime > span.free_cardMeta` | PHQ-9 · 3 min | 9.9px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.free_wrap > span.free_tag.free_tagLime` | Free for everyone | 11.5px text |
| measure | 4 | 1024, 1440 | `div > p` | Call Tele-MANAS 14416 (or 1-800-891-4416 | 92 characters per line |

### admin-students-logins (/admin/students/logins) · 174

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 60 | 360, 390, 412, 768, 1024, 1440 | `button.inline-flex.h-9.shrink-0 > span.font-pix.opacity-80` | 1 | 10.4px text |
| tap | 40 | 360, 390, 412, 768 | `div.flex.gap-2.overflow-x-auto > button.inline-flex.h-9.shrink-0` | All1 | 61x36px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Students | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.space-y-6 > a.inline-flex.items-center.gap-1.5` | Back to Students | 138x20px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.items-center.gap-3 > input.size-4` | Select all shown | 16x16px |
| tap | 8 | 360, 390, 412, 768 | `li.flex.flex-wrap.items-center > input.size-4` | Select priya.ramaswamy.longname@example. | 16x16px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.items-center.gap-1.5 > button.inline-flex.h-8.items-center` | Lock this student's access | 121x32px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| truncate | 6 | 390, 412, 1024 | `div.min-w-0.flex-1.basis-48 > p.truncate.text-caption.text-muted-foreground` | priya.ramaswamy.longname@example.com | ends in ... with no title |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### medicine (/practice/medicines/[id]) · 172

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 56 | 360, 390, 412, 768 | `li > button.inline-flex.min-h-10.items-center` | 1 Swallowed | 112x40px |
| tap | 16 | 360, 390, 412, 768 | `div.grid.grid-cols-2.gap-1 > button.h-10.rounded-full.px-5` | Student | 156x40px |
| tap | 16 | 360, 390, 412, 768 | `div.flex.justify-between.gap-2 > button.h-10.rounded-full.border-2` | ← Lower dose | 131x40px |
| tap | 16 | 360, 390, 412, 768 | `div.flex.flex-wrap.gap-2 > a.rounded-full.border-2.border-foreground` | Quetiapine · Second-generation (atypical | 311x36px |
| tap | 16 | 360, 390, 412, 768 | `div.flex.flex-wrap.gap-1.5 > button.min-h-10.rounded-md.border-2` | One dose | 92x40px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.rounded-3xl.border-2.border-foreground > p.text-eyebrow.opacity-90` | Mood stabilisers · Mood stabiliser | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.rounded-2xl.border-2.border-foreground > p.text-eyebrow` | Watch for at this dose | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `details.rounded-xl.border-2.border-foreground/20 > summary.cursor-pointer.font-semibold` | Clinician detail for this dose | 264x20px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |
| measure | 2 | 1440 | `section#uses > p.leading-relaxed` | The oldest and best-proven mood stabilis | 84 characters per line |

### admin-students (/admin/students) · 172

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 32 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > select.h-10.rounded-md.border-2` | Cohort | 162x40px |
| truncate | 20 | 360, 390, 412, 1024, 1440 | `div.min-w-0 > span.block.truncate.text-caption` | No roll no. · priya.ramaswamy.longname@e | ends in ... with no title |
| tiny | 20 | 1024, 1440 | `div.hidden.items-center.gap-3 > span` | Student | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.flex.flex-wrap.gap-1 > span.rounded-full.bg-status-pending-bg.px-2` | Login needs a hand | 11.2px text |
| truncate | 8 | 360, 390, 412, 1024 | `div.min-w-0 > a.block.truncate.text-sm` | Priya Ramaswamy Longname | ends in ... with no title |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > button.h-10.rounded-md.border-2` | Needs attention | 135x40px |
| tap | 8 | 360, 390, 412, 768 | `label.flex.h-9.items-center > input.size-4.accent-primary` | Tick everyone shown | 136x36px |
| tap | 8 | 360, 390, 412, 768 | `div.grid.items-center.gap-x-3 > input.size-4.accent-primary` | Tick Priya Ramaswamy Longname | 16x16px |
| tap | 8 | 360, 390, 412, 768 | `div.min-w-0 > a.block.truncate.text-sm` | Priya Ramaswamy Longname | 104x20px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.items-center.justify-end > button.grid.size-10.place-items-center` | Show details for Priya Ramaswamy Longnam | 40x40px |
| tap | 8 | 360, 390, 412, 768 | `details.rounded-2xl.border-2.border-foreground/15 > summary.cursor-pointer.text-sm.font-bo` | Lock or unlock everyone at once | 292x20px |

### waitlist (/waitlist) · 152

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 48 | 360, 390, 412, 768 | `li > a.inline-flex.min-h-8.items-center` | Terms | 35x32px |
| tap | 24 | 360, 390, 412, 768 | `span > a.font-medium.text-link.underline` | Terms | 42x17px |
| tap | 24 | 360, 390, 412, 768 | `nav.flex.flex-wrap.items-center > a.inline-flex.min-h-8.items-center` | Homepage | 62x32px |
| tiny | 24 | 360, 390, 412, 768, 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 8.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div > p.flex.items-center.gap-2` | Cohort Two · by invitation | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.border-t.border-foreground/15.pt-5 > p.text-eyebrow.text-link` | Legal | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-col.gap-4 > a` | VIBHA home | 312x33px |

### notes (/study/notes) · 148

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 108 | 360, 390, 412, 768, 1024, 1440 | `section > h2.text-eyebrow.text-link` | Weeks 1 to 2 · Brain basics, how patient | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Study | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.min-w-0 > span.text-eyebrow` | Start here | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-access (/admin/access) · 120

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 24 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > button.inline-flex.h-9.items-center` | Switch off | 121x36px |
| tap | 16 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > button.h-9.rounded-md.border-2` | Full access | 108x36px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | People | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `label.flex.items-center.gap-2 > input.size-4` | Tick everyone shown | 82x20px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > select.h-9.max-w-56.rounded-md` | Section | 220x36px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > select.h-9.max-w-60.rounded-md` | What to start again | 240x36px |
| tap | 8 | 360, 390, 412, 768 | `li.flex.flex-wrap.items-center > input.size-4` | Tick priya.ramaswamy.longname@example.co | 16x16px |
| tap | 8 | 360, 390, 412, 768 | `li.flex.flex-wrap.items-center > a.min-w-0.flex-1.basis-48` | priya.ramaswamy.longnamepriya.ramaswamy. | 203x37px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| truncate | 4 | 360, 390 | `a.min-w-0.flex-1.basis-48 > span.block.truncate.text-caption` | priya.ramaswamy.longname@example.com | ends in ... with no title |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### expired (/expired) · 116

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 48 | 360, 390, 412, 768 | `li > a.inline-flex.min-h-8.items-center` | Terms | 35x32px |
| tap | 24 | 360, 390, 412, 768 | `nav.flex.flex-wrap.items-center > a.inline-flex.min-h-8.items-center` | Homepage | 62x32px |
| tiny | 24 | 360, 390, 412, 768, 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 8.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.border-t.border-foreground/15.pt-5 > p.text-eyebrow.text-link` | Legal | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-col.gap-4 > a` | VIBHA home | 312x33px |

### paused (/paused) · 116

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 48 | 360, 390, 412, 768 | `li > a.inline-flex.min-h-8.items-center` | Terms | 35x32px |
| tap | 24 | 360, 390, 412, 768 | `nav.flex.flex-wrap.items-center > a.inline-flex.min-h-8.items-center` | Homepage | 62x32px |
| tiny | 24 | 360, 390, 412, 768, 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 8.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.border-t.border-foreground/15.pt-5 > p.text-eyebrow.text-link` | Legal | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-col.gap-4 > a` | VIBHA home | 312x33px |

### medicines (/practice/medicines (was /tools/psychopharm)) · 110

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| truncate | 66 | 360, 390, 412, 768, 1024, 1440 | `span.min-w-0.flex-1 > span.mt-1.block.truncate` | Espazine · Neocalm · Trinicalm (with tri | ends in ... with no title |
| tap | 14 | 768 | `div.-mx-4.chip-scroller.gap-2 > button.h-11.shrink-0.rounded-full` | All | 50x36px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Medicines | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### note (/study/notes/[id]) · 108

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| overlap | 68 | 360, 390, 412, 768, 1024, 1440 | `span.notes_face.flex.min-h-24 > span.font-bold.leading-tight` | “Ghabrahat” | text sits on "Anxiety / panic symptoms" (42x20px) |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.relative.overflow-hidden.rounded-3xl > p.text-eyebrow.opacity-90` | Weeks 1 to 2 · Brain basics, how patient | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.rounded-3xl.border-2.border-foreground > p.text-eyebrow.text-link` | TL;DR | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### reader (/study/[module]/[section]) · 102

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 36 | 768, 1024, 1440 | `li > p.mt-3.mb-1.px-2` | Part 0 · Starting: the interview and the | 10.6px text |
| tap | 14 | 768 | `li > a.flex.items-start.gap-2` | 1.7 Special situations | 196x39px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.relative.mb-6 > p.line-clamp-1.text-eyebrow.text-link` | The psychiatric interview & MSE · Part 0 | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `p.mt-2.flex.flex-wrap > span.rounded-full.bg-primary.px-2` | Core · must know | 11.2px text |
| truncate | 6 | 360, 390, 412 | `header.relative.mb-6 > p.line-clamp-1.text-eyebrow.text-link` | The psychiatric interview & MSE · Part 0 | cut to 1 lines, no title |
| tiny | 6 | 768, 1024, 1440 | `span > span.block.text-eyebrow.text-muted-foreground` | Continue · part 2 of 5 | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-modules (/admin/modules) · 100

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 40 | 360, 390, 412, 768 | `div.mt-2.flex.flex-wrap > button.rounded-md.border-2.border-border` | Publish | 66x33px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `select#grant-student` | Select a student…priya.ramaswamy.longnam | 377x38px |
| tap | 8 | 360, 390, 412, 768 | `div.mt-3.flex.flex-wrap > button.rounded-md.border-2.border-border` | Grant | 60x33px |
| tap | 8 | 360, 390, 412, 768 | `div.rounded-lg.border-2.border-dashed > select.mt-2.w-full.rounded-md` | Select a student…priya.ramaswamy.longnam | 292x42px |
| tap | 8 | 360, 390, 412, 768 | `div.rounded-lg.border-2.border-dashed > button.mt-2.rounded-md.border-2` | Grant every module to this student | 228x33px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| hscroll | 4 | 360, 390 | `select#grant-student` | Select a student…priya.ramaswamy.longnam | page is 411px wide in a 360px window |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-library (/practice/library) · 96

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 80 | 360, 390, 412, 768 | `div.mb-4.-mx-1.flex > a.shrink-0.rounded-full.border-2` | Depression | 93x33px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-submissions (/admin/submissions) · 72

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 16 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > a.rounded-md.border-2.border-border` | Pending | 75x32px |
| tap | 16 | 360, 390, 412, 768 | `form.flex.flex-wrap.items-center > select.h-9.rounded-md.border-2` | All coursesClinical psychology foundatio | 289x36px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > a.rounded-md.border-2.border-foreground` | All | 43x32px |
| tap | 8 | 360, 390, 412, 768 | `form.flex.flex-wrap.items-center > button.rounded-md.border-2.border-border` | Filter | 57x32px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### games (/games) · 66

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 48 | 360, 390, 412 | `span.flex.min-w-0.flex-1 > span.mt-0.5.font-mono.font-bold` | 500+ questions | 11.2px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### free-help (/free/help) · 66

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.free_wrap > a.free_tag` | ← Free tools | 11.5px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `li.free_card.free_cardInk > span.free_cardMeta` | Medical doctor (MBBS + MD/DNB Psychiatry | 9.9px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `li.free_card.free_cardLime > span.free_cardMeta` | RCI-registered (M.Phil in Clinical Psych | 9.9px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `li.free_card > span.free_cardMeta` | MA/MSc in Psychology or Counselling | 9.9px text |
| tap | 8 | 360, 390, 412, 768 | `div.free_wrap > a.free_tag` | ← Free tools | 104x25px |
| measure | 6 | 768, 1024, 1440 | `div.free_wrap > p.free_note` | Check a clinical psychologist's registra | 89 characters per line |
| measure | 4 | 1024, 1440 | `div > p` | Call Tele-MANAS 14416 (or 1-800-891-4416 | 92 characters per line |

### games-lab-cases (/games/lab/cases) · 62

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 32 | 360, 390, 412, 768 | `div.-mx-4.flex.gap-2 > button.min-h-10.shrink-0.rounded-full` | All | 46x40px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-link` | Casebook | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### admin-emails (/admin/emails) · 60

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 32 | 360, 390, 412, 768 | `li.shrink-0 > a.flex.h-10.items-center` | Inbox | 86x40px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 4 | 1024, 1440 | `a.mb-3.hidden.h-12 > kbd.rounded.border.border-current` | C | 10.4px text |

### home (/dashboard) · 54

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Home | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.flex.min-w-0.flex-1 > span.text-eyebrow.opacity-80` | Start studying | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `h2#goal` | Today's goal | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### journey (/journey) · 50

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | My journey | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.text-center.leading-none > span.block.font-semibold.uppercase` | Level | 9.6px text |
| tap | 8 | 360, 390, 412, 768 | `section.rounded-3xl.border-2.border-foreground > a.mt-4.inline-flex.items-center` | Overall leaderboard | 193x36px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### admin-doubts (/admin/doubts) · 48

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 24 | 360, 390, 412, 768 | `nav.flex.flex-wrap.gap-1 > a.flex.h-10.items-center` | Private concerns | 148x40px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### record (/record) · 48

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-muted-foreground` | Your record | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `select#sup-comp` | None | 136x42px |
| tap | 8 | 360, 390, 412, 768 | `form.space-y-3.rounded-lg.border-2 > button.rounded-md.border-2.border-border` | Log hours | 104x41px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tap | 2 | 768 | `label.mt-2.flex.items-start > input.mt-0.5` |  | 554x34px |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### admin (/admin) · 46

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Admin | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `h2.flex.items-center.justify-between > a.text-sm.font-bold.text-link` | Compare | 61x20px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| clip | 2 | 360 | `span.min-w-0.flex-1 > span.block.truncate.text-caption` | Link expired, login email failed, or nev | cut off by section (overflow hidden) by 15px |

### module (/study/[module]) · 44

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.relative.overflow-hidden.rounded-3xl > p.text-eyebrow.opacity-90` | Module 1 | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.flex.min-w-0.flex-1 > span.text-eyebrow.opacity-80` | Module 1 · Read | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |
| measure | 2 | 1440 | `div#write > p.mt-3.leading-relaxed` | On blank paper, from memory: the 15 part | 84 characters per line |

### admin-inbox (/admin/inbox) · 44

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Communicate | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.items-center > a.text-sm.font-bold.text-link` | All logins | 63x20px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-students-add (/admin/students/add) · 44

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Students | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.mx-auto.max-w-3xl.space-y-6 > a.inline-flex.items-center.gap-1.5` | Back to Students | 138x20px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-tools (/admin/tools) · 44

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.relative.mt-1 > button.absolute.top-1/2.right-2` | Show | 32x32px |
| tap | 8 | 360, 390, 412, 768 | `div.flex.flex-wrap.gap-2 > button.inline-flex.h-10.items-center` | Set key | 108x40px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| measure | 4 | 1024, 1440 | `div.space-y-4 > p.text-sm.text-muted-foreground` | Type a student's email with this key on  | 90 characters per line |

### doubts (/doubts) · 42

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.space-y-3 > div.-mb-1.5.text-eyebrow.text-link` | Doubts | 10.6px text |
| overlap | 12 | 360, 390, 412, 768, 1024, 1440 | `div.space-y-3 > div.-mb-1.5.text-eyebrow.text-link` | Doubts | text sits on "Ask your batch" (46x8px) |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### pmse (/practice/mse) · 40

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.flex.items-center.justify-between > p.text-eyebrow.text-muted-foreground` | Level 1 · Observe · stimulus 1 | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.space-y-4.rounded-lg.border-2 > button.rounded-md.border-2.border-border` | Score my description | 180x41px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| measure | 4 | 1024, 1440 | `div > p.text-small.text-muted-foreground` | Now describe what you observed. Diagnost | 82 characters per line |

### lesson (/courses/[id]/lessons/[id]) · 40

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.space-y-1.5 > p.text-eyebrow.text-link` | Lesson 1 of 2 | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `section.rounded-2xl.border-2.border-foreground/15 > h2.text-eyebrow.text-muted-foreground` | About this lecture | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.max-w-md.rounded-md.border-2 > button.mt-4.inline-flex.h-9` | Retry | 94x36px |
| tiny | 4 | 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-forms-new (/admin/forms/new) · 40

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tap | 16 | 360, 390, 412, 768 | `div.inline-flex.rounded-md.border-2 > button.inline-flex.min-h-10.items-center` | Edit | 80x40px |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-out-of-depth (/practice/out-of-depth) · 40

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.mx-auto.max-w-3xl > p.text-eyebrow.text-muted-foreground` | Out of depth | 10.6px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.rounded-lg.border-2.border-border > p.text-eyebrow.text-muted-foreground` | Your client | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### passport (/passport) · 38

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div > p.text-eyebrow.text-muted-foreground` | Skills passport | 10.6px text |
| tap | 8 | 360, 390, 412, 768 | `div.mt-4 > a.inline-flex.items-center.gap-2` | Download passport PDF | 223x41px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### study-map-practice (/study/map/practice) · 37

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header.space-y-1 > p.text-eyebrow.text-link` | Practice | 10.6px text |
| tiny | 9 | 360, 412, 768, 1024, 1440 | `div.space-y-4 > p.text-eyebrow.text-link` | True or false? | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### leaderboard (/leaderboard) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-link` | This week · 2 days left | 10.6px text |
| truncate | 6 | 360, 390, 412 | `span.min-w-0.flex-1 > span.block.truncate.font-semibold` | Priya Ramaswamy Longname (you) | ends in ... with no title |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### admin-ai-cases (/admin/ai-cases) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Content | 10.6px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-cohorts (/admin/cohorts) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | People | 10.6px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-forms (/admin/forms) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Communicate | 10.6px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-psychopharm-review (/admin/psychopharm-review) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Medication library | 10.6px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-pulse (/admin/pulse) · 36

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| truncate | 6 | 360, 390, 412 | `span.flex.flex-wrap.items-baseline > span.min-w-0.truncate.text-caption` | priya.ramaswamy.longname@example.com | ends in ... with no title |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| overflow | 4 | 1024, 1440 | `div.mt-1.rounded-md.border-2 > p.mt-2.whitespace-pre-wrap.break-words` | Hi Priya, We haven't seen you on VIBHA f | text passes the box edge by 3px |
| truncate | 2 | 360 | `div.mt-1.rounded-md.border-2 > p.truncate.text-caption.text-muted-foreground` | To: priya.ramaswamy.longname@example.com | ends in ... with no title |

### admin-courses (/admin/courses) · 32

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `label.flex.h-9.items-center > button.peer.group/switch.inline-flex` | Published | 32x18px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-cards (/admin/cards) · 32

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.space-y-3 > button.rounded-md.border-2.border-border` | Add a card | 90x33px |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### tools-psychopharm-compare (/tools/psychopharm/compare) · 32

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `header.z-30.flex.min-h-14 > button.ml-2.flex.size-10` | Go back | 40x40px |
| measure | 6 | 768, 1024, 1440 | `div.mx-auto.max-w-3xl.space-y-6 > p.text-caption.text-muted-foreground` | Educational summary, reviewed by a psych | 82 characters per line |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### lectures (/courses) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Lectures | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### prep (/prep) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 6 | 768, 1024, 1440 | `div.-mb-1.5.text-eyebrow.text-link > span.hidden` | Exam Prep | 10.6px text |
| overlap | 6 | 768, 1024, 1440 | `div.-mb-1.5.text-eyebrow.text-link > span.hidden` | Exam Prep | text sits on "Psychology Entrance & Competit" (64x8px) |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### practice (/practice) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Practice | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### gamesboard (/games/leaderboard) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-link` | This week | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### games-lab (/games/lab) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.min-w-0 > p.text-eyebrow.text-link` | Psychology Lab | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### leaderboard-shop (/leaderboard/shop) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-link` | Spend what you earn | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### tools-psychopharm-learn (/tools/psychopharm/learn) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `header.z-30.flex.min-h-14 > button.ml-2.flex.size-10` | Go back | 40x40px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 4 | 1024, 1440 | `div.min-w-0.space-y-1.5 > div.text-eyebrow.text-link` | Learning | 10.6px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### wall (/wall) · 30

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div > p.text-eyebrow.text-muted-foreground` | Cohort wall | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### revise (/prep/smart/revise) · 28

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `header > p.text-eyebrow.text-link` | Revise | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-consulting-room (/practice/consulting-room) · 28

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `fieldset > legend.text-eyebrow.text-muted-foreground` | How do you want to practise? | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-ethics (/practice/ethics) · 28

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `div.rounded-lg.border-2.border-border > p.text-eyebrow.text-muted-foreground` | Group therapy | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### prep-smart-coach (/prep/smart/coach) · 26

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.mx-auto.max-w-xl.space-y-6 > a.block.text-center.text-sm` | Back | 328x20px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| truncate | 2 | 360 | `a.inline-flex.min-h-11.shrink-0 > span.min-w-0.truncate` | Back to Smart practice | ends in ... with no title |

### admin-enquiries (/admin/enquiries) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-learning (/admin/learning) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-checkins (/admin/checkins) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-credentials (/admin/credentials) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-flags (/admin/flags) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-infra (/admin/infra) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-sim-review (/admin/sim-review) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-supervision (/admin/supervision) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-triage (/admin/triage) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### admin-wall-reports (/admin/wall-reports) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | Admin | 9.0px text |
| tiny | 8 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | People | 10.6px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-role-play (/practice/role-play) · 24

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tap | 8 | 412, 768 | `div.flex.gap-2 > button.flex-1.rounded-md.border-2` | I'll play the clinician | 164x41px |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### daily (/practice/daily) · 22

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 6 | 768, 1024, 1440 | `button.flex.min-h-11.min-w-0 > span.hidden.shrink-0.rounded-full` | Soon | 10.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-landmark (/practice/landmark) · 20

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| measure | 4 | 1024, 1440 | `div.rounded-lg.border-2.border-border > p.mt-3.text-small` | In the 1990s Elizabeth Loftus and Jacque | 82 characters per line |

### setup (/setup) · 20

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 8 | 360, 390, 412, 768 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 10.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.items-center.justify-between > a.flex.items-center` | VIBHA home | 142x35px |
| tiny | 4 | 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-white/85` | School of Psychology | 11.0px text |

### login (/login) · 20

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 8 | 360, 390, 412, 768 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 10.0px text |
| tap | 8 | 360, 390, 412, 768 | `div.flex.items-center.justify-between > a.flex.items-center` | VIBHA home | 142x35px |
| tiny | 4 | 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-white/85` | School of Psychology | 11.0px text |

### journal (/reflect) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### mocks (/prep/mock) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### notfound (not found (signed in)) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### notifications (/notifications) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### settings (/settings) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### scenarios (/practice/scenarios) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| truncate | 2 | 360 | `div.activity-head.flex.min-w-0 > p.min-w-0.truncate.font-bold` | What would you do? | ends in ... with no title |

### practice-not-available (/practice/not-available) · 18

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 2 | 1440 | `nav.flex.flex-col.gap-1 > p.nav-section.mt-4.mb-1` | More | 10.6px text |

### smart (/prep/smart) · 17

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |
| tiny | 1 | 360 | `div.overflow-y-auto.rounded-md.border-2 > p.mb-1.text-eyebrow.text-muted-foreground` | Read this | 10.6px text |

### prep-run (/prep/[subject]/[topic]) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### blitz (/games/blitz) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### long (/prep/long) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### subject (/prep/[subject]) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### mock (/prep/mock/[spec]) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### msegame (/games/mse) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### rx (/games/rx) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### duel (/games/duel) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### comorbid (/games/comorbid) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### detective (/practice/detective) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### terms (/practice/terms) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### judgment (/practice/judgment) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### checkpoint (/study/[module]/checkpoint/[n]) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### practice-weak-spots (/practice/weak-spots) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### prep-interview (/prep/interview) · 16

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.leading-none > span.block.font-pix.uppercase` | School of Psychology | 9.0px text |
| tiny | 4 | 1024, 1440 | `button.group/search.mx-auto.hidden > kbd.hidden.rounded-md.border-2` | / | 11.2px text |

### rootnotfound (not found (public)) · 12

| problem | count | widths | element | example text | detail |
|---|--:|---|---|---|---|
| tiny | 12 | 360, 390, 412, 768, 1024, 1440 | `span.inline-flex.flex-col.leading-none > span.font-pix.uppercase.text-muted-foreground` | School of Psychology | 8.0px text |

