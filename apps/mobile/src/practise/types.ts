/**
 * The data each Practise move answers, copied from the website files named in
 * docs/app/API_CONTRACT.md section 2.11 (POST /play/:game/:action). The app
 * draws exactly these objects. Answers are never in a shape the phone holds
 * before the student answers: every "public" shape below has options, never
 * the right one; the right one arrives in the reply to the answer.
 *
 * The first screens (hub, tools, Exam Prep, boards) are in ./contract.ts,
 * copied from the server.
 */

/* ------------------------------------------------------------------ blitz */
/** src/lib/games/blitz/questions.ts, engine.ts, server.ts */
export type BlitzPrompt = { n: number; kind: "tf" | "pick"; prompt: string; options: string[] };
export type BlitzRun = { answered: number; correct: number; score: number; combo: number; best: number };
export type BlitzBests = { mine: number; cohort: { score: number; name: string; you: boolean; scope: "batch" | "everyone" } | null; stored: boolean };
export type BlitzStart = { ok: true; token: string; question: BlitzPrompt; msLeft: number };
export type BlitzAnswer = { ok: true; token: string; right: boolean; answer: number; why: string; learn: { label: string; href: string }; gained: number; levelUp: boolean; state: BlitzRun; next: BlitzPrompt | null; msLeft: number };
export type BlitzFinish = { ok: true; state: BlitzRun; xp: number; xpSaved: boolean; newBest: boolean; bests: BlitzBests };
export const BLITZ_MS = 60_000;
export const COMBO_STEPS = [3, 6, 10] as const;
export const multiplier = (combo: number) => (combo >= 10 ? 4 : combo >= 6 ? 3 : combo >= 3 ? 2 : 1);

/* ------------------------------------------------------------------- sort */
/** src/app/(dashboard)/games/sort/actions.ts */
export type SortTier = "basic" | "advanced";
export type SortReveal = { solved: boolean; score: number; tiles: { text: string; group: number; why: string }[]; thresholds: (string | null)[]; module: string; topic: string };
export type SortView = {
  mode: "daily" | "practice";
  tier: SortTier;
  boardId: string;
  title: string;
  difficulty: number;
  groups: string[];
  tiles: string[];
  thresholds: string[] | null;
  triesUsed: number;
  done: SortReveal | null;
  cohort: { played: number; solvedPct: number; scope: "batch" | "everyone" } | null;
  stored: boolean;
};
export type SortLoad = { ok: true; view: SortView };
export type SortCheck = { ok: true; groupsDone: boolean[]; oneAway: number[]; thresholdWrong: number[]; triesUsed: number; done: SortReveal | null; xp: number; xpSaved: boolean; cohort: SortView["cohort"] };
export const SORT_MAX_TRIES = 4;

/* --------------------------------------------------------------------- rx */
/** src/lib/games-sims/rx/rules.ts */
export type RxKind = "chain" | "mystery" | "puzzle" | "review";
export type RxMode = "mixed" | RxKind;
export type RxOpt = { id: string; label: string };
export type RxCase = { title: string } & (
  | { kind: "chain"; name: string; brands: string[]; steps: string[][] }
  | { kind: "mystery"; who: string; story: string; clues: string[]; drug: string; brand: string; options: RxOpt[] }
  | { kind: "puzzle"; a: string; b: string; aBrands: string[] | null; bBrands: string[] | null; story: string; options: RxOpt[] }
  | { kind: "review"; who: string; story: string; rx: string[]; options: RxOpt[] }
);
export type RxReveal =
  | { kind: "chain"; name: string; values: string[]; dose: string; receptor: string; line: string }
  | { kind: "mystery"; label: string; why: string; not: string | null; receptor: string; drug: string }
  | { kind: "review"; answer: string; why: string; not: string }
  | { kind: "puzzle"; label: string; why: string; not: string | null; journey: unknown; receptor: { receptor: string; caption: string } | null; qt: boolean };
export type RxGraded = { score: number; parts: { ok: boolean; chosen: string | null; correct: string }[] };
export type RxAnswered = { graded: RxGraded; answer: string; reveal: RxReveal; learn: { id: string; name: string; href?: string }[]; pages: { id: string; name: string }[] };
export type RxDeal = { ok: true; token: string; run: string; cases: RxCase[] };
export type RxPick = { ok: true; token: string; step?: { right: boolean; correct: string }; answered?: RxAnswered };
export const RX_STEPS = [
  { key: "cls", label: "Class", ask: "What kind of medicine is it?" },
  { key: "mech", label: "How it works", ask: "How does it work?" },
  { key: "ae", label: "Watch for", ask: "Which side effect is the one to remember?" },
  { key: "mon", label: "Check", ask: "What do you monitor?" },
] as const;
export const RX_LIVES = 3;
export const rxPoints = (score: number, streak: number) => Math.round(score * 100 * (1 + Math.min(5, streak) * 0.1));

/* -------------------------------------------------------------------- mse */
/** src/lib/games-sims/mse/rules.ts */
export type MseLevel = 1 | 2 | 3;
export type MseExcerpt = { level: MseLevel; again: boolean; who: string; place: string; lines: ["D" | "P" | "R", string][]; note: string; quotes: string[]; options: string[][] };
export type MseReveal = { score: number; domainOk: boolean; termOk: boolean; close: boolean; answer: string; answerDomain: string; why: string; whyNot: string | null };
export type MseDeal = { ok: true; token: string; run: string; excerpt: MseExcerpt };
export type MseTag = { ok: true; token: string; reveal: MseReveal; excerptScore?: number; next?: MseExcerpt | null };

/* ------------------------------------------------------------------- ward */
/** src/lib/games-sims/ward/rules.ts */
export type WardVars = { risk: number; trust: number; insight: number; family: number; adherence: number };
export type WardQuality = "best" | "ok" | "poor" | "harm";
export type WardKind = "assessment" | "risk" | "referral" | "psychoeducation" | "family" | "medicines";
export type WardScene = { title: string; patient: string; note: string | null; sessions: number; chapter: number; chapterTitle: string; beats: string[]; decision: { kind: WardKind; prompt: string; options: { id: string; text: string }[] } | null; vars: WardVars; step: number; done: boolean };
export type WardReveal = { chapter: number; chapterTitle: string; beats: string[]; kind: WardKind; skill: string; letter: string; text: string; q: WardQuality; why: string; best: { text: string; why: string } | null; before: WardVars; after: WardVars; voters: number | null };
export type WardEnd = { title: string; text: string; score: number; vars: WardVars; log: { chapter: number; kind: WardKind; prompt: string; text: string; q: WardQuality; best: string | null }[] };
export type WardSolo = { ok: true; token: string; scene: WardScene; reveal?: WardReveal; end?: WardEnd | null; xp?: number; saved?: boolean };
export type WardCampaign = { id: string; title: string; patient: string; place: string; blurb: string; sessions: number; level: number };
export const WARD_KIND: Record<WardKind, string> = { assessment: "Assessment", risk: "Risk", referral: "Referral", psychoeducation: "Explaining it", family: "Family meeting", medicines: "Medicines, with the psychiatrist" };
export const WARD_VAR: Record<keyof WardVars, string> = { risk: "Risk", trust: "Trust", insight: "Insight", family: "Family support", adherence: "Sticking with care" };
/** src/app/(dashboard)/games/ward/actions.ts WardTeamView: the team's story, polled. Qualities only for calls already made. */
export type WardTeamView = { teamId: string; code: string; name: string; campaign: string; scene: WardScene; reveals: WardReveal[]; end: WardEnd | null; members: { name: string; me: boolean; voted: boolean }[]; myVote: string | null; votes: number; version: number; xp: number };
/** src/lib/games-sims/teams.ts TEAM_LIMITS */
export const TEAM_LIMITS = { escape: { min: 2, max: 5 }, ward: { min: 2, max: 3 } } as const;
export type TeamJoin = { ok: true; teamId: string } | { ok: false; reason: string };
/** A team row on the first screen (GET /practise/tools/ward and /escape). */
export type TeamListItem = { id: string; name: string; status: string; code?: string; campaign?: string; room?: string; title?: string };
export const WARD_QUALITY: Record<WardQuality, string> = { best: "Strong choice", ok: "Reasonable", poor: "Weak choice", harm: "Harmful choice" };

/* ----------------------------------------------------------------- escape */
/** src/lib/games-sims/escape/types.ts, engine.ts */
export type EscStage = "mse" | "diagnosis" | "differential" | "risk" | "course" | "plan" | "medicine" | "criteria";
export type EscDoor =
  | { id: string; stage: EscStage; kind: "pick"; prompt: string; options: string[] }
  | { id: string; stage: EscStage; kind: "multi"; prompt: string; options: string[] }
  | { id: string; stage: EscStage; kind: "order"; prompt: string; items: string[] }
  | { id: string; stage: EscStage; kind: "number"; prompt: string; min: number; max: number; unit?: string };
export type EscOpened = { stage: EscStage; why: string; unlock: string; skill: string };
export type EscRoomCard = { id: string; title: string; place: string; patient: string; intro: string; doors: number };
export type EscView = EscRoomCard & { stages: EscStage[]; door: EscDoor | null; hint: string | null; opened: EscOpened[]; outro: string | null };
export type EscState = { room: string; stage: number; wrong: number; tries: number[]; log: { stage: number; name: string; ok: boolean; at: string }[]; done: boolean };
export type EscResult = { ok: true; token: string; view: EscView; state: EscState; now: number; right?: boolean; ms?: number; xp?: number; elapsed?: number };
/** src/lib/games-sims/escape/engine.ts RaceRow */
export type RaceRow = { id: string; name: string; stage: number; done: boolean; ms: number; me: boolean };
/** src/app/(dashboard)/games/escape/actions.ts EscapeView: the team's room, polled. */
export type EscTeamView = { teamId: string; code: string; name: string; room: string; view: EscView; status: "lobby" | "playing" | "done"; state: EscState; members: { name: string; me: boolean }[]; startedAt: string | null; finishedAt: string | null; now: number; race: RaceRow[]; xp: number };
export const ESC_STAGE: Record<EscStage, string> = { mse: "Mental state", diagnosis: "Diagnosis", differential: "Differential", risk: "Risk", course: "Course", plan: "Plan", medicine: "Medicine", criteria: "Criteria" };
export const ESC_PENALTY_S = 20;

/* -------------------------------------------------------------- detective */
/** src/lib/learn/detective-rules.ts, src/lib/cases/fresh.ts */
export type CaseMark = "started" | "week" | "new" | "done";
export type DetFamily = "drug" | "disorder" | "mixed";
export type DetRound = { options: string[]; clue: string };
export type DetDeal = { ok: true; token: string; run: string; rounds: DetRound[]; marks: CaseMark[]; recycled: boolean };
export const DET_POINTS = [40, 30, 20, 10] as const;
export const DET_WRONG = 5;
export const DET_CLUES = 4;

/* ------------------------------------------------------------------ daily */
/** src/lib/games/daily/view.ts, engine.ts */
export type DailyKind = "mse" | "collateral" | "scale" | "lab";
export type DailyAction = { t: "clue" } | { t: "inv"; i: number } | { t: "guess"; dx: string } | { t: "hint" } | { t: "giveup" };
export type DailyView = {
  mode: "daily" | "practice";
  caseId: string;
  ai: boolean;
  difficulty: 1 | 2 | 3;
  setting: string;
  clues: string[];
  cluesOpen: number;
  unopened: number;
  investigations: { i: number; kind: DailyKind; label: string; result: string | null; ordered: boolean }[];
  guesses: { dx: string; name: string; ok: boolean; sameChapter: boolean; reason: string }[];
  hints: { chapter: string | null; pointer: string | null; used: number };
  canClue: boolean;
  status: "playing" | "solved" | "lost";
  points: number;
  score: number;
  grid: string;
  reveal: null | { answer: string; chapter: string; topic: string; overview: string; lookAlikes: { name: string; whyNot: string }[]; module: string; refs: string[] | null };
};
export type DailyMeta = { day: string; number: number; streak: number; playedDays: string[]; hints: unknown; cohort: unknown; stored: boolean };
export type DailyMove = { ok: true; view: DailyView; meta: DailyMeta; log: DailyAction[]; justFinished: boolean; xp: number; xpSaved: boolean };

/* ------------------------------------------------------------------- prep */
/** src/lib/prep/view.ts */
export type PrepQView = { id: string; subject: string; topic: string; type: "mcq" | "assertion-reason" | "match" | "statement" | "passage" | "numerical"; stem: string; passage?: string; statements?: string[]; lists?: { left: string[]; right: string[] }; options: [string, string, string, string] };
export type PrepReveal = { id: string; answer: number; explanation: string; learnHref: string; visual?: unknown };
export type PrepChecked = PrepReveal & { correct: boolean };

/** src/app/(dashboard)/prep/actions.ts startMock: a fresh paper, no answers in it. `deadline` and `serverNow` are the server's clock. */
export type MockPaper = { attemptId: string | null; specId: string; deadline: number; serverNow: number; sections: { title: string; wanted: number; questions: PrepQView[] }[] };
/** src/lib/prep/scoring.ts Standing */
export type MockStanding = { rank: number; of: number; percentile: number | null };
type Tally = { score: number; max: number; right: number; wrong: number; blank: number };
/** src/lib/prep/results.ts ReviewRow: every question after hand-in, with its answer and why. */
export type MockReviewRow = { q: PrepQView; section: string; chosen: number | null; answer: number; correct: boolean; ms: number | null; explanation: string; learnHref: string; marked: boolean };
/** src/lib/prep/results.ts MockResultView (submitMock answers it; GET /prep/mock/result/:id carries it). */
export type MockResult = Tally & {
  specId: string;
  title: string;
  marksPerRight: number;
  marksPerWrong: number;
  accuracy: number | null;
  standing: MockStanding | null;
  saved: boolean;
  late: boolean;
  totalMs: number;
  sections: (Tally & { title: string })[];
  subjects: (Tally & { subject: string; title: string; learnHref: string })[];
  rows: MockReviewRow[];
};
/** One pattern on GET /prep/mock (the website's spec without its sources). */
export type MockSpec = { id: string; title: string; short?: string; minutes: number; questions: number; marksPerRight: number; marksPerWrong: number; exam: string | null; sections: { title: string; count: number }[] };
/** src/lib/prep/server.ts MockMeta */
export type MockMeta = { id: string; specId: string; startedAt: string; submittedAt: string | null; score: number | null; max: number | null };

/* ---------------------------------------------------------- case progress */
/** src/lib/cases/progress.ts */
export type ProgressTool = "ward" | "escape" | "osce" | "formulation" | "detective" | "wwyd" | "two-minute" | "landmark" | "mse-small";
export type ProgressSnapshot = { owner: string | null; rows: { item: string; state: unknown; at: number }[] };

/* ================================================= drawn on the phone */

/** What the Comorbid screen draws, built on the phone from the server's comorbid.state game (src/practise/games/comorbid.tsx). */
export type CoCard = { uid: string; kind: "sym" | "rule" | "clear"; id: string; label: string; line: string };
export type CoView = {
  ok: true;
  token: string;
  you: { dx: { id: string; name: string; rule: string; need: number }; hand: CoCard[]; built: { id: string; label: string }[]; blocked: { id: string; label: string } | null };
  rival: { name: string; built: { id: string; label: string }[]; blocked: { id: string; label: string } | null; hand: number };
  turn: "you" | "rival";
  deck: number;
  log: { who: "you" | "rival"; text: string; ok: boolean }[];
  winner: "you" | "rival" | "draw" | null;
  /** Once the game is over: the rival's diagnosis. */
  rivalDx: { id: string; name: string } | null;
  xp?: number;
};

/**
 * The practice tools whose whole case comes to the browser on the website
 * (What would you do, Say it clinically, Judgment calls, Ethics, Landmark,
 * OSCE, Two-minute clinic, Formulation, Out of depth, Weak spots, MSE
 * trainer). src/practise/tools/engine.ts turns each tool's server data
 * (GET /practise/tools/:tool) into a case in steps of these kinds.
 */
export type ToolId = "wwyd" | "say-it" | "judgment" | "ethics" | "landmark" | "osce" | "two-minute" | "formulation" | "out-of-depth" | "weak-spots" | "mse-trainer";
export type ToolStep =
  | { n: number; kind: "pick"; ask: string; options: string[] }
  | { n: number; kind: "multi"; ask: string; options: string[] }
  /** Judgment calls (script concordance): how a new fact changes the odds, -2 to +2. */
  | { n: number; kind: "scale"; ask: string; hypothesis: string; fact: string; labels: [string, string, string, string, string] }
  /** Formulation: put each factor in a bucket (the 5Ps). */
  | { n: number; kind: "buckets"; ask: string; buckets: string[]; items: string[] }
  /** OSCE: tick what you would say or do, against the clock. */
  | { n: number; kind: "checklist"; ask: string; items: string[]; seconds: number }
  /** Landmark: read, then a question. */
  | { n: number; kind: "read"; title: string; body: string }
  /** Free text (Two-minute clinic, MSE observe): written, then compared with the model answer. */
  | { n: number; kind: "write"; ask: string; fields: string[]; seconds?: number; /** Fewest characters before it can be compared (formulation: 40). */ min?: number; placeholder?: string }
  /** OSCE: your overall call on the station, 1 to max. */
  | { n: number; kind: "rate"; ask: string; label: string; max: number }
  /** MSE Level 4: the full MSE of one case under a ten-minute clock, one line per domain. */
  | { n: number; kind: "fullmse"; ask: string; context: string; domains: string[]; seconds: number }
  /** The small things: one moment from an interview; the read and the move show after a tap. */
  | { n: number; kind: "moment"; skill: string; moment: string };
export type ToolReveal = {
  /** 0 to 1. */
  score: number;
  verdict: "best" | "ok" | "harm" | null;
  /** The right answer, in the step's own terms: option positions, the scale value, or each item's bucket. */
  right: number[];
  why: string;
  /** Per-option notes (why not), when the step has them. */
  notes: (string | null)[] | null;
  /** For read steps and law notes: an extra paragraph after the answer. */
  more: string | null;
  /** Free text: not marked, the student compares with the model answer. */
  selfCheck?: boolean;
  /** Formulation: the model's words you used and missed. */
  diff?: { missing: string[]; present: string[] };
  /** MSE Level 1: the labels that slipped in, and the observation words counted. */
  observe?: { labels: string[]; observations: number; words: number };
  /** MSE Level 4: each domain's light with your words and the expert's. */
  domains?: { domain: string; light: "green" | "amber" | "red"; you: string[]; expert: string[] }[];
};
/* ---------------------------------------------- contract (server copy) */
/*
 * From the server's src/lib/app-api/contract.ts (branch agent/appapi2,
 * "Practise and Library"). The app's src/api/contract.ts is re-copied by the
 * app shell; until it carries these, they live here unchanged.
 */
export type PlayBody = { args: unknown[] };
export type PlayResult<T = unknown> = { kind: string; v: 1; data: T };
export type MedicineRow = { id: string; name: string; cls: string; group: string; brands: string[]; uses: string[]; line: string; dose: string };
export type MedicineList = { v: 1; groups: string[]; rows: MedicineRow[] };
export type MedicinePage = {
  v: 1;
  med: Record<string, unknown> & { id: string; name: string; cls: string; group: string };
  related: { id: string; name: string; cls: string }[];
  mechanism: Record<string, unknown> | null;
  visuals: Record<string, unknown>[] | null;
  halfLife: Record<string, unknown> | null;
  study: { moduleId: string; title: string; target: import("@/api/contract").AppTarget } | null;
};
