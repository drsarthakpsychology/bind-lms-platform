/* Copied from the server's src/lib/app-api/contract-practise-admin.ts (branch agent/appapi2), the Library and Practise parts, unchanged. If the two disagree, the server file wins: copy it again. */
import type { AppTarget } from "@/api/contract";

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
  | { kind: "target"; medName: string; target: string; action: string; effect: string }
  | { kind: "receptor"; medName: string; receptor: string; pick: "Full agonist" | "Partial agonist" | "Antagonist" | "Inverse agonist"; note: string }
  | { kind: "messenger"; messenger: string; receptor: string; note: string }
  | { kind: "journey"; medName: string; target: string; routes: ("oral" | "iv" | "nasal" | "depot")[]; notes: Record<string, string> | null }
  | { kind: "synapse"; medName: string; action: "reuptake" | "gaba" | "calcium" | "enzyme" | "nmda" | "glutamate"; transmitter: string; title: string; caption: string | null }
  | { kind: "halfLife"; title: string; hl: string; meaning: string }
  | { kind: "dose"; title: string; shape: "window" | "targets" | "ceiling"; caption: string | null }
  | { kind: "pathways"; medName: string; caption: string | null; atypical: boolean; partial?: boolean; focus: "nigrostriatal" | null }
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
  /** Only for admins: the board is every student, one page of it. `title` on each row is the cohort names. */
  admin?: LeaderboardAdmin;
};

/** The admin board's page and its query (send back as ?q=&cohort=&sort=&dir=&page=). */
export type LeaderboardAdmin = {
  page: number;
  pages: number;
  size: number;
  /** Students in the chosen cohort (or all). */
  total: number;
  /** Students left after the search. */
  matched: number;
  q: string;
  cohort: string | null;
  sort: "rank" | "name" | "cohort";
  dir: "asc" | "desc";
  cohorts: { id: string; name: string }[];
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

/** GET /prep/mock/result/:id : one of the student's own saved mocks. `result` is the website's MockResultView (score, sections, subjects, every question with its answer and why), null when it was never handed in. */
export type PrepMockResult = { v: 1; id: string; specId: string; title: string; result: Record<string, unknown> | null };

/** GET /prep/long, /prep/long/:subject, /prep/long/:subject/:topic, /prep/long/:subject/:topic/:id : long answers (written answers, read and compared). */
export type PrepLong = { v: 1; level: "home" | "subject" | "topic" | "question"; data: Record<string, unknown> };

/** GET /leaderboards/shop : the XP shop. Buying and wearing go through POST /play/league/buy and /play/league/wear. */
export type XpShop = {
  v: 1;
  /** False until the shop's database step is in: show the items, buying off. */
  ready: boolean;
  balance: number;
  streak: { count: number; alive: boolean };
  /** Whether a streak repair works this week, in words. */
  repair: { ok: boolean; text: string };
  /** Things to buy: streak_repair, hints_3, bonus_case. `ready: false` shows "Coming soon". */
  items: { id: string; label: string; cost: number; text: string; ready: boolean }[];
  /** Name frames and titles. */
  looks: { id: string; label: string; kind: "frame" | "title"; cost: number; owned: boolean; worn: boolean }[];
  note: string;
};
/** The website's buyItem answer (src/app/(dashboard)/leaderboard/actions.ts). */
export type BuyResult = { error: string | null; balance?: number; lastDay?: string; look?: string | null };
