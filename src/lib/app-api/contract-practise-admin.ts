/**
 * VIBHA app API contract, part two: Practise, Library and Admin.
 *
 * The same rules as contract.ts (plain file, types only, the app copies it
 * next to contract.ts as is). It imports only from "./contract". The route
 * table, which routes are built, and the changes from the app's mock shapes
 * are in docs/app/API_CONTRACT_PRACTISE_ADMIN.md. Where a type here has the
 * same name as one in contract.ts, this file is the one that is current.
 */
import type { AppTarget, Inline, Page, Scope } from "./contract";

// ===========================================================================
// Library
// ===========================================================================

/** GET /library/medicines?q=&group= : one row per medicine. */
export type MedicineRow = {
  id: string;
  name: string;
  /** Drug class ("SSRI"). */
  cls: string;
  /** The same as `cls` (the app's mock name). */
  className: string;
  group: string;
  brands: string[];
  uses: string[];
  /** The one line under the name in the list. */
  line: string;
  /** The usual dose (the chip the medicine page opens on). */
  dose: string;
  /** The same as `dose` (the app's mock name). */
  keyDose: string;
};
export type MedicineList = {
  v: 1;
  /** The groups to filter by, in the website's order. */
  groups: string[];
  /** The same as `groups` (the app's mock name). */
  classes: string[];
  /** Every medicine, or the matches when `q` or `group` is set (the website's searchMeds rule). */
  rows: MedicineRow[];
};

/** A medicine page section id, in page order. */
export type MedSectionId = "uses" | "doses" | "side-effects" | "monitoring" | "interactions" | "warnings" | "groups" | "stopping" | "how-it-works";

export type MedDose = {
  amount: string;
  label: string;
  use: string;
  student: string;
  clinician: string;
  watch?: string[];
};

/** One "How it works" picture, drawn natively. The same plan the website draws (src/lib/meds/diagrams.ts). */
export type MedDiagram =
  | { kind: "note"; text: string }
  | { kind: "receptor"; medName: string; receptor: string; pick: "Full agonist" | "Partial agonist" | "Antagonist" | "Inverse agonist"; note: string }
  | { kind: "journey"; medName: string; target: string; routes: ("oral" | "iv" | "nasal" | "depot")[]; notes: Record<string, string> | null }
  | { kind: "synapse"; medName: string; action: "reuptake" | "gaba" | "calcium" | "enzyme" | "nmda" | "glutamate"; transmitter: string; title: string; caption: string | null }
  | { kind: "halfLife"; title: string; hl: string; meaning: string }
  | { kind: "dose"; title: string; shape: "window" | "targets" | "ceiling"; caption: string | null }
  | { kind: "pathways"; medName: string; caption: string | null; atypical: boolean; focus: "nigrostriatal" | null }
  | { kind: "compare"; title: string; a: { label: string; points: string[]; summary: string }; b: { label: string; points: string[]; summary: string } }
  | { kind: "neuron"; medName: string; title: string; caption: string | null }
  | { kind: "nervous"; medName: string; title: string; caption: string | null }
  | { kind: "brainmap"; title: string; focus: string[]; notes: Record<string, string>; caption: string | null }
  | { kind: "hypnogram"; title: string; caption: string | null };

/**
 * One section of a medicine page. Every section has `points` (its lines as
 * plain text, enough to draw a simple list); the typed parts carry the rest.
 */
export type MedSection =
  | { id: "uses"; title: string; points: string[]; uses: string[]; standout: string[] }
  | { id: "doses"; title: string; points: string[]; doses: MedDose[]; defaultDose: number; take: string[]; forms: string; brands: string[]; note: string }
  | { id: "side-effects" | "monitoring" | "interactions" | "stopping"; title: string; points: string[] }
  /** The one coloured band on the page: serious effects and "stop if" signs. */
  | { id: "warnings"; title: string; points: string[]; tone: "alert" }
  | { id: "groups"; title: string; points: string[]; facts: { label: string; text: string }[] }
  /** Always last. `targets[].action` is shown in the clinician view only. */
  | { id: "how-it-works"; title: string; points: string[]; plain: string | null; targets: { target: string; action: string; effect: string }[]; diagrams: MedDiagram[] };

/** GET /library/medicines/:medId : everything the website's medicine page shows, in the same order (facts first, How it works last). */
export type MedicinePage = MedicineRow & {
  v: 1;
  /** The two reading views (the page's Student and Clinician switch). */
  summary: { student: string; clinician: string };
  sections: MedSection[];
  /** "Compare with" (other medicine pages). */
  related: { id: string; name: string; cls: string }[];
  /** "Learn it in Study". */
  study: { moduleId: string; title: string; target: AppTarget } | null;
  /** The website's own objects, as the first version of this route sent them (types in src/lib/meds). */
  med: Record<string, unknown> & { id: string; name: string; cls: string; group: string };
  mechanism: Record<string, unknown> | null;
  visuals: Record<string, unknown>[] | null;
  halfLife: { hl: string; meaning: string } | null;
};

/** GET /library/reference : the full psychopharmacology reference (every medicine in the knowledge base), grouped by receptor too. */
export type ReferenceHome = {
  v: 1;
  drugs: { slug: string; name: string }[];
  byMechanism: { tag: string; drugs: { slug: string; name: string; qualifier: string | null }[] }[];
  notice: string;
};

/** GET /library/reference/search?q= */
export type ReferenceSearch = { items: { slug: string; name: string; cls: string | null; line: string | null; verified: boolean }[] };

/** A block of the reviewed medicine document (the website's MedBlock, sources and review fields left out). */
export type ReferenceBlock = { id: string; type: string; value: string; data: Record<string, unknown> | null };

/**
 * GET /library/reference/:slug : one medicine of the reference. `document`
 * is the reviewed document when one is published (the website shows it
 * instead of the curated view); otherwise draw `detail` and its dose bands.
 */
export type ReferenceDrug = {
  v: 1;
  slug: string;
  name: string;
  cls: string | null;
  verified: boolean;
  document: { sections: { id: string; title: string; blocks: ReferenceBlock[] }[] } | null;
  /** The curated view (the website's DrugDetail without its source fields). */
  detail: Record<string, unknown>;
  notice: string;
};

/** GET /library/reference/compare?drugs=a,b,c : 2 to 5 medicines, one field at a time. */
export type ReferenceCompare = {
  v: 1;
  fields: { key: string; label: string }[];
  drugs: { slug: string; name: string; values: Record<string, string | null> }[];
  notice: string;
};

// ===========================================================================
// Practise
// ===========================================================================

/** A row of the Practise tab. `play` says how the app opens it. */
export type PractiseRow = {
  id: string;
  title: string;
  meta: string | null;
  kind: "case" | "game" | "prep" | "board";
  target: AppTarget;
  /** "In progress", "Done today", "Due", or null. */
  trailing: string | null;
  /** Shown, but "coming soon" (flag is live, not unlocked). */
  locked: boolean;
  /**
   * "native": the app has the data (GET /practise/tools/:id, moves through /play).
   * "web": needs something the app does not have yet (voice, AI patient, live peers); open on the website.
   */
  play: "native" | "web";
};

/** GET /practise */
export type PractiseHubData = {
  v: 1;
  /** Practice tools on real cases (Daily case, MSE, Formulation, Clinic detective...). */
  cases: PractiseRow[];
  games: PractiseRow[];
  /** Exam Prep and its parts. */
  prep: PractiseRow[];
  boards: PractiseRow[];
  /** "120+ new cases", or null when it would be a small number. */
  newCases: { practice: string | null; games: string | null };
  /** The last practice tool used. */
  resume: { title: string; target: AppTarget } | null;
};

/** Done, New, This week, half-way: one case of a case library (src/lib/cases/fresh.ts). */
export type CaseMark = "started" | "week" | "new" | "done";
/**
 * The case order and marks for one library, best next first (the website's
 * arrangeCases), with the saved half-way steps. Save a step with
 * POST /play/cases/mark { args: [tool, item, state] }.
 */
export type CaseLibrary = {
  items: { id: string; mark: CaseMark }[];
  /** Every case is done: the order is the replay order. */
  recycled: boolean;
  /** How many have never been done. */
  fresh: number;
  /** The student's saved half-way state per case (the website's progress rows). */
  progress: { item: string; state: unknown; at: number }[];
  /** Shown once every case is done. */
  recycleLine: string | null;
};

/** The tool ids GET /practise/tools/:tool knows. */
export type PractiseToolId =
  | "blitz" | "sort" | "rx" | "mse-lab" | "ward" | "escape" | "duel" | "comorbid"
  | "daily" | "detective" | "two-minute" | "wwyd" | "terms" | "judgment" | "ethics" | "out-of-depth"
  | "landmark" | "osce" | "mse" | "formulation" | "weak-spots";

/**
 * GET /practise/tools/:tool : the first screen of one game or practice tool,
 * the same plain data the website page gives its game (see the table in the
 * contract page for each tool's `data`). `moves` lists the POST /play kinds
 * the tool uses; `records` the POST /practise/records kinds.
 */
export type PractiseTool = {
  v: 1;
  tool: PractiseToolId;
  title: string;
  /** The how-to lines, shown once and closed when play starts. */
  howTo: string[];
  data: Record<string, unknown>;
  cases: CaseLibrary | null;
  moves: string[];
  records: PractiseRecordKind[];
};

/**
 * POST /practise/records/:kind : saves a finished practice attempt through the
 * website's own route for it. The body is the same JSON the website sends;
 * the answer is the website route's JSON. Scores in these records are the
 * student's own self-check (OSCE checklist, MSE and formulation compare), as
 * on the website; they never pay XP. Judgment calls are scored on the server.
 */
export type PractiseRecordKind = "judgment" | "osce" | "mse" | "formulation" | "clinic" | "quiz" | "competency";
export type PractiseRecordResult = Record<string, unknown>;

/** GET /leaderboards/:board (league, quiz, overall) and GET /leaderboards/games/:game */
export type LeaderboardRow = { rank: number; name: string; points: number; me: boolean; title: string | null; extra: Record<string, unknown> | null };
export type Leaderboard = {
  v: 1;
  board: string;
  label: string;
  /** "This week", "All time". */
  period: string;
  explainer: string;
  /** "Cohort Two only. First name and initial." */
  scope: string | null;
  rows: LeaderboardRow[];
  me: { rank: number | null; total: number };
  /** The website's own answer for this board (league tiers, zones, the shop and so on). */
  raw: Record<string, unknown>;
};

// ---------------------------------------------------------------- Exam Prep

export type PrepStats = { total: number; answered: number; right: number };

/** GET /prep */
export type PrepHome = {
  v: 1;
  /** Staff preview: answers are not saved. */
  preview: boolean;
  resume: { subject: string; topic: string; subjectTitle: string; topicTitle: string; set: number; sets: number; index: number; target: AppTarget } | null;
  subjects: PrepSubject[];
  saved: number;
  wrong: number;
  canSave: boolean;
  more: PractiseRow[];
};
export type PrepSubject = {
  id: string;
  title: string;
  optional: boolean;
  /** The app's mock fields. */
  questions: number;
  done: number;
  /** Per cent right of those answered, or null. */
  best: number | null;
  stats: PrepStats;
};

/** GET /prep/subjects/:subject */
export type PrepSubjectDetail = { v: 1; id: string; title: string; stats: PrepStats; topics: { id: string; title: string; stats: PrepStats }[]; long: number };

/** A question as the app shows it before answering: no answer, no explanation. */
export type PrepQuestion = { id: string; [k: string]: unknown };

/**
 * GET /prep/subjects/:subject/topics/:topic?set=N (N from 1), GET /prep/smart,
 * GET /prep/lists/:list (saved, wrong). Answer each question with
 * POST /play/prep/check { args: [{ id, choice, ms }] }: the server grades it
 * and answers the right option and the explanation.
 */
export type PrepSet = {
  v: 1;
  id: string;
  title: string;
  /** For a topic: every set of the topic, the current one, and where to start inside it. */
  sets: { n: number; stats: PrepStats }[];
  set: number;
  start: number;
  questions: PrepQuestion[];
  /** Earlier answers in this set: question id to right (true) or wrong. */
  prior: Record<string, boolean>;
  saved: string[];
  canSave: boolean;
  preview: boolean;
  next: { label: string; target: AppTarget } | null;
  /** For a list: the page and how many pages. */
  page?: { page: number; pages: number; total: number };
};

/** GET /prep/mock : timed papers. Start with POST /play/prep/mockStart, hand in with POST /play/prep/mockSubmit. */
export type PrepMocks = { v: 1; specs: { id: string; title: string; minutes: number; questions: number; [k: string]: unknown }[]; history: Record<string, unknown>[] };

/** GET /prep/long, /prep/long/:subject, /prep/long/:subject/:topic, /prep/long/:subject/:topic/:id : long answers (written answers, read and compared). */
export type PrepLong = { v: 1; level: "home" | "subject" | "topic" | "question"; data: Record<string, unknown> };

// ===========================================================================
// Admin
// ===========================================================================

export type AttentionFlag = "login" | "no-mobile" | "quiet" | "never-seen" | "behind" | "email-failing" | "no-details";

/** One row of the Students table (the website's roster row). */
export type AdminStudentRow = {
  id: string;
  name: string;
  email: string;
  rollNumber: string | null;
  mobileNumber: string | null;
  scope: Scope;
  blocked: boolean;
  expiresAt: string | null;
  account: string;
  presence: "now" | "today" | "week" | "quiet" | "never";
  lastSeen: string | null;
  cohorts: { id: string; name: string }[];
  minutes7: number;
  activeDays30: number;
  lecturesDone: number;
  lecturesAvailable: number;
  xp: number;
  flags: AttentionFlag[];
  /** The app's mock fields. */
  status: "active" | "paused" | "ended";
  progressPct: number;
  lecturesOnly: boolean;
  cohort: string | null;
};

/** A thing to do on admin Home, as the website's Home lists them. */
export type AdminTodo = { id: string; label: string; count: number; detail: string; target: AppTarget; urgent: boolean };
/** A student who needs a look (the app's mock AdminAttention, plus the flags). */
export type AdminAttention = { id: string; studentId: string; name: string; reason: string; since: string | null; flags: AttentionFlag[] };

/** GET /admin/home */
export type AdminHomeData = {
  v: 1;
  /** "Mon, 16 Nov" in India time. */
  dateLine: string;
  /** Things to do, only those with a count, in the website's order. */
  todo: AdminTodo[];
  totalToDo: number;
  /** Students that need a look, most flags first (at most 20), as table rows. */
  needsLook: AdminStudentRow[];
  /** The same students as the app's mock attention rows (reason in words). */
  attention: AdminAttention[];
  live: { userId: string; name: string; meta: string; where: string | null; lessonId: string | null; since: string | null; watching: boolean }[];
  cohorts: { id: string; name: string; members: number; week: number; behind: number; pct: number }[];
  counts: { students: number; activeThisWeek: number; onNow: number; neverIn: number; needsLook: number; locked: number; openComplaints: number; dbPct: number };
  /** The app's mock line. */
  today: { active: number; total: number; lecturesWatched: number | null; doubtsOpen: number; submissionsToGrade: number };
  canWrite: boolean;
};

/** GET /admin/students?search=&q=&cohort=&flag= (paged, default 50, max 200) */
export type AdminStudentList = Page<AdminStudentRow> & { total: number; cohorts: { id: string; name: string }[] };

/** GET /admin/students/:id */
export type AdminStudent = AdminStudentRow & {
  /** The first version's shape: the same row, and `detail` below. */
  row: AdminStudentRow;
  /** The phone signed in to the app, and the changes used this month. */
  phone: { name: string; platform: string; changesUsed: number; limit: number; nextChangeAt: string | null } | null;
  lectures: { done: number; total: number };
  /** The website's loadStudentDetail answer (visits, lectures and study for 30 days). */
  detail: Record<string, unknown> | null;
  recent: { at: string; what: string }[];
  canWrite: boolean;
};

/** POST /admin/students/:id/lock, /unlock */
export type LockBody = { reason?: string };
export type LockResult = { blocked: boolean };
/** POST /admin/students/:id/login-link : emails a fresh login link (the website's sendLoginLink). */
export type LoginLinkResult = { sent: true };

/**
 * POST /admin/messages. The first version's body (`{ userIds, title, text, alsoEmail? }`)
 * is still accepted and is the same as `{ to: "students", userIds, title, body: text }`.
 */
export type AdminSendBody = {
  to: "everyone" | "cohort" | "course" | "student" | "students";
  /** The cohort, course or student id. */
  toId?: string;
  /** For "students": the picked student ids. */
  userIds?: string[];
  title: string;
  /** Plain text; paragraphs split by blank lines. */
  body: string;
  alsoEmail?: boolean;
};
export type AdminSendResult = { sent: number; created: number; emailed: number; emailFailed: number; batchId: string | null };
/** GET /admin/messages : recent sends with how many opened them, and who can be messaged. */
export type AdminMessages = {
  v: 1;
  batches: { batchId: string; title: string; sentAt: string; total: number; opened: number; type: string }[];
  ready: boolean;
  /** The app's mock list (one row per recent send). */
  items: { id: string; to: string; title: string; preview: string; at: string; unread: boolean }[];
  cohorts: { id: string; name: string; status: string; members: number }[];
  courses: { id: string; title: string; members: number }[];
  students: number;
};

/** GET /admin/inbox : everything waiting on a reply, oldest first (the website's loadInbox). */
export type AdminInbox = {
  v: 1;
  ready: boolean;
  threads: { id: string; reason: "concern" | "unanswered" | "student-replied"; [k: string]: unknown }[];
  emails: { id: string; fromEmail: string; fromName: string | null; subject: string; body: string; receivedAt: string }[];
  canWrite: boolean;
};
/** POST /admin/doubts/:id/reply and POST /admin/inbox/emails/:id/reply */
export type AdminReplyBody = { text: string };
export type AdminReplyResult = { sent: true };
/** POST /admin/doubts/:id/draft : an AI draft for the reply box (never posted). */
export type AdminDraftResult = { text: string };

/** GET /admin/activity?view=live|behind|cohorts|all */
export type AdminActivity = {
  v: 1;
  /** The first version's shape: kind "admin.activity", data = loadActivity()'s answer plus `live` (filled for view "all"). */
  kind: "admin.activity";
  data: Record<string, unknown> | null;
  view: "live" | "behind" | "cohorts" | "all";
  live: AdminHomeData["live"];
  /** Falling behind: active accounts under the expected lectures, quietest first. */
  behind: AdminStudentRow[];
  cohorts: AdminHomeData["cohorts"];
  /** The website's loadActivity rows (per student minutes, places and lectures over 30 days), test accounts left out. */
  rows: Record<string, unknown>[];
  /** The app's mock feed. */
  items: { id: string; at: string; who: string; what: string; kind: "lecture" | "study" | "doubt" | "submission" | "sign_in" }[];
};

/** GET /admin/submissions?status=pending|graded&course=&assignment= */
export type AdminSubmission = {
  id: string;
  studentId: string;
  studentEmail: string | null;
  assignmentId: string;
  assignmentTitle: string;
  lessonTitle: string;
  courseId: string | null;
  courseTitle: string;
  status: string;
  submittedAt: string;
  late: boolean;
  text: string | null;
  hasAudio: boolean;
  files: { id: string; name: string; format: string | null }[];
  score: number | null;
  feedback: string | null;
  note: string | null;
};
export type AdminSubmissions = Page<AdminSubmission> & { v: 1; pending: number; courses: { id: string; title: string }[]; assignments: { id: string; title: string; courseId: string | null }[]; canWrite: boolean };
/** POST /admin/submissions/:id/grade */
export type GradeBody = { feedback: string; score: number | null };
/** POST /admin/submissions/:id/approve, /grade */
export type ReviewResult = { status: "approved" | "returned" };
/** GET /admin/submissions/:id/files/:fileId and /audio : a 15 minute address. */
export type AdminFileLink = { url: string; expiresInSeconds: number };

/** GET /admin/certificates/studio : what the studio needs to start. */
export type StudioSetup = {
  v: 1;
  canWrite: boolean;
  ready: boolean;
  today: string;
  kinds: { id: string; label: string; [k: string]: unknown }[];
  students: { id: string; name: string; email: string; roll: string | null; cohortIds: string[] }[];
  cohorts: { id: string; name: string; count: number }[];
  courses: { id: string; title: string }[];
  signatures: { id: string; label: string; url: string | null; [k: string]: unknown }[];
  email: { configured: boolean; remaining: number; limit: number };
};
/** The studio form, the same as the website's StudioIssueInput. */
export type StudioIssueBody = {
  kind: string;
  title: string;
  heading?: string;
  lead?: string;
  connector?: string;
  citation?: string;
  courseId?: string | null;
  courseLabel?: string;
  moduleLabel?: string;
  issuedOn: string;
  expiresOn?: string | null;
  signatories: { name: string; role: string; signatureFrom?: string | null }[];
  recipients: { userId: string; name: string }[];
  cohortId?: string | null;
  email: boolean;
  /** Re-issue: the certificate this one corrects. */
  replaces?: string | null;
};
/**
 * POST /admin/certificates/preview { ...StudioIssueBody, showing? } : the
 * certificate as the student will see it, as drawing operations in a
 * `width` by `height` box (rect, line, path, stroke, image, text), the same
 * layout the website draws and prints. Images are keys into `images` (signed
 * addresses, or null).
 */
export type StudioPreview = { v: 1; width: number; height: number; ops: Record<string, unknown>[]; images: Record<string, string | null>; problems: string[] };
export type StudioIssueResult = { issued: { credentialId: string; userId: string; name: string }[]; skipped: Record<string, unknown>[]; batchId: string | null; delivery: Record<string, unknown> | null };
/** GET /admin/certificates/issued?search=&limit&cursor */
export type IssuedCertificate = { credentialId: string; userId: string | null; name: string; title: string; kind: string; status: string; issuedAt: string | null; revokedAt: string | null; [k: string]: unknown };
export type IssuedCertificates = Page<IssuedCertificate> & { v: 1; total: number };
/** POST /admin/certificates/:id/revoke */
export type RevokeBody = { reason: string };
/** POST /admin/certificates/:id/resend */
export type ResendBody = { email: boolean };
export type ResendResult = { notified: boolean; delivery: Record<string, unknown> | null };

/** Inline is the study text format (bold, italic, term). Re-exported for the Practise data that uses it. */
export type { Inline };
