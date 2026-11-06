# Feature Inventory
> Verified against `main` @ `b2a9698`. **Class:** A fully implemented · B partial · C implemented, not reachable from UI · D implemented, apparently unused · E deprecated/replaced · F broken/possibly broken · G planned, not built · H needs verification.
> "Present in code" ≠ "live for students": production flag values (`feature_flags`) are UNVERIFIED. Evidence = file paths; INFERRED items are marked.

| # | Feature | Users | Class | Frontend | Backend / lib | DB | Notes / limits |
|---|---|---|---|---|---|---|---|
| 1 | Login, single session, block/expiry | all | A | `/login` | `lib/auth/*` | `profiles` | Turnstile optional |
| 2 | Support key (master password) | admin→student/alumni | A | `/admin/tools` | `lib/auth/master*.ts` | `admin_settings`, `master_login_events` | policy-sensitive |
| 3 | Set password / setup link | student | A | `/set-password`, `/setup` | `roster.ts` | `account_setup_tokens`, `credential_invites` | |
| 4 | First-login details form | student | A | modal | `details-actions.ts`, `lib/profile-details` | `student_details` | |
| 5 | Mobile capture/normalise | student | A | login/details | `lib/phone.ts` | `profiles.mobile_number` | |
| 6 | Courses & lessons builder | admin | A | `/admin/courses` | `admin/courses/actions.ts` | `courses`, `lessons` | |
| 7 | Cohorts (create, members, share lectures, move) | admin | A | `/admin/cohorts`, course people panel | `lib/cohorts/*` | `cohorts`, `cohort_members`, `lesson_cohorts`, `lesson_grants` | prod migration UNVERIFIED |
| 8 | Cohort-scoped lecture visibility | student | A | `/dashboard`,`/courses` | `rules.ts`, `access.ts` | as above | |
| 9 | Per-student access (full/lectures-only, blocks, bulk, reset) | admin | A | `/admin/access` | `lib/access/*` | `access_blocks`, `profiles.scope` | |
| 10 | Lecture player (HLS, resume, progress) | student | A | `video-player.tsx` | `/api/media/*` | `media_assets`, `progress` | 1,407-line component |
| 11 | Video publishing CLI | operator | A | – | `scripts/publish-lecture.ts` | `media_assets` | manual, not in-app |
| 12 | Materials (pdf/audio/image/link) | student/admin | A | `/courses/.../materials` | `/api/media/materials` | `materials` | |
| 13 | Assignments & submissions | student/admin | A | lesson page, `/admin/submissions` | `/api/media/submissions` | `assignments`, `submissions`, `submission_files` | |
| 14 | Notes (study) | student | A | `/study` | `lib/learn`, `lib/study` | `learn_progress` | marks stored on-device (`lib/study/marks.ts` TODO) |
| 15 | Games (coach, play, detective, scenarios, terms, quizzes, revise) | student | A | `/games/*` | `lib/learn/*`, `lib/quiz/*` | `learn_progress`, `quiz_attempts` | |
| 16 | Lab experiments / Casebook | student | B | `/games/lab` | `lib/lab`, `src/content/casebook` | – | `lab` flag; educator review pending (NEEDS_KAVYA.md) |
| 17 | Quiz leaderboard | student | A | `/games/leaderboard` | `lib/learn/leaderboard.ts` | `learn_progress`, `profiles` | no penalties |
| 18 | Overall leaderboard / Rankings | student | A | `/leaderboard`, `/practice/leaderboard` | `lib/standing/*` | `standing_totals()` | |
| 19 | My journey / passport / record | student | A | `/journey`,`/passport`,`/record` | `lib/passport-pdf.ts` | `competencies` | three overlapping routes |
| 20 | Doubts board (per cohort, private complaints) | student/admin | A | `/doubts` | `lib/doubts/*` | `doubts*` | |
| 21 | Wall (anonymous peer) + reports | student/admin | A | `/wall`, `/admin/wall-reports` | `/api/practice/wall/*` | `wall_*` | |
| 22 | Journal | student | A | `/reflect` | `/api/practice/journal*` | `journal_entries`, `journal_shares` | |
| 23 | Consulting Room (AI patient) | student | A/H | `/practice/consulting-room` | `lib/sim/*`, `/api/practice/sim/*` | `sim_*` | needs AI keys; flag state UNVERIFIED |
| 24 | MSE trainer | student | A | `/practice/mse` | `lib/mse`, `/api/practice/mse/*` | `mse_*` | |
| 25 | OSCE | student | A | `/practice/osce` | `lib/practice/osce*` | `osce_*` | |
| 26 | Judgment / SCT | student | A | `/practice/judgment` | `lib/practice/sct*` | `sct_*` | |
| 27 | Formulation + wall | student | A | `/practice/formulation` | `lib/practice/formulation*` | `formulation_*` | 6 cases |
| 28 | Rounds (spaced repetition) | student | A | `/practice/rounds` | `lib/practice/rounds.ts`, `ts-fsrs` | `cards`, `card_reviews` | |
| 29 | Decoder, Ethics, Landmark, Out-of-depth, Two-minute clinic, Weak spots, Check-in | student | A | `/practice/*` | `lib/decode`, `landmark`, `out-of-depth`, `practice/*` | various | |
| 30 | Peer role-play | student | H | `/practice/role-play` | `/api/practice/roleplay/*` | `pair_*` | usage evidence none |
| 31 | Supervision & sign-off | student/admin | A | `/practice/supervision`,`/admin/supervision` | `/api/practice/supervision*` | `supervision_entries` | |
| 32 | Knowledge tutor (RAG) | student | B | `/practice/tutor` | `lib/knowledge`, `/api/knowledge/*` | `corpus_*`, `knowledge_concepts` | `ai/embed.ts` primary path is a TODO fixture; local embedder `knowledge/embed-local.ts` used by retrieval |
| 33 | Medicines (psychopharm) | student/admin | A | `/practice/medicines`, `/admin/psychopharm*` | `lib/meds`, `lib/psychopharm`, `/api/psychopharm/*` | `psych_*`, `medication_documents*` | `/tools/psychopharm/*` still reachable (E partial: root redirects) |
| 34 | Voice (STT/TTS/LiveKit) | student | B | consulting-room | `lib/voice`, `livekit-agent` | – | separate worker deploy UNVERIFIED |
| 35 | Feature flags ("What's live") | admin | A | `/admin/flags` | `lib/flags.ts` | `feature_flags` | |
| 36 | Mail (compose, cohort chips, retry/clear failed, logins search) | admin | A | `/admin/emails` | `lib/email/*` | `email_sends`, `email_inbound` | |
| 37 | Daily reminders email | student | **G/F** | – | cron `send-reminders` | – | stub: sends nothing |
| 38 | Alumni transition | system | **H** | – | cron `alumni-transition` | `profiles.cohort_ended_at` | column set by no app code; DDL not in repo |
| 39 | Scheduled module release | admin | A/H | `/admin/modules` | cron `release-scheduled` | `modules`, `module_access` | |
| 40 | Certificates | admin/public | B | `/admin/students`, `/verify/[id]` | `lib/certificate.ts` | `certificates` | name=email; manual only |
| 41 | CRM / People pipeline, presence "Active now" | admin | A | `/admin/people` | `lib/crm`, `lib/people` | `crm_*`, `page_visits` | `page_visits` DDL missing in repo |
| 42 | Activity / Pulse / Triage / Sim-review / Check-ins | admin | A | `/admin/*` | – | – | |
| 43 | Infra dashboard | admin | A | `/admin/infra` | `infra_metrics()`, cron snapshot | `infra_snapshots` | |
| 44 | Waitlist & enquiries | public/admin | A | `/waitlist`, `/admin/enquiries` | `waitlist/actions.ts` | `enquiries` | `/enquire` redirects |
| 45 | Free tools (calm, tests, help) | public | A | `/free/*` | `lib/free` | – | |
| 46 | Policies & legal pages | public | B | `/policies/*` | `lib/policies.ts`, `content/policies` | – | business address is a TODO token (`legal-constants.ts`) |
| 47 | Agent discovery (well-known, openapi, markdown landing) | bots | A | – | `proxy.ts`, route files | – | openapi static |
| 48 | Backups / restore / uptime | ops | A/H | – | workflows, `scripts/restore.ts` | – | secrets UNVERIFIED |
| 49 | Payments / checkout | – | **G** | – | – | – | not in code |
| 50 | Auto certificate / completion tracking | – | **G** | – | – | – | not in code |
| 51 | Leaderboard penalties / negative scores | – | **G** | – | – | – | proposed only |

Counts: **51 features** — A: 37 · A/H (implemented, state unverified): 3 · B: 5 · H: 2 · G/F (stub): 1 · G: 3. Class E (replaced) items are noted inline (e.g. `/tools/psychopharm` root → medicines; old `/study/*` game URLs and `/practice/learn` redirect to `/games`). Classification is INFERRED from code reading, not production usage data.
