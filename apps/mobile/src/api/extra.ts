/**
 * Shapes the app needs that are NOT in the server contract yet
 * (src/api/contract.ts is a copy of the server's file and is never edited by
 * hand). Each one is written up as a request for the server side in
 * docs/app/CONTRACT_REQUESTS.md. Until the server builds them, only the mock
 * server answers these routes; against the real server the screens show a
 * quiet "arrives in the next update" state instead of an error.
 */
import type { AppTarget, Inline, Mcq } from "./contract";

/* Home quests and the deletion request are in the contract now; kept as names here so older imports still work. */
export type { Quest, QuestCard, DeletionRequestBody, DeletionRequestResult } from "./contract";


/* --------------------------------------------------------------- Practise */

export type PractiseRow = { id: string; title: string; meta: string | null; kind: "case" | "game" | "prep"; target: AppTarget; /** "New" this week, or a best score. */ trailing: string | null };
/** GET /practise */
export type PractiseHubData = { cases: PractiseRow[]; games: PractiseRow[]; prep: PractiseRow[] };

/** GET /games/:id: a whole round as data. Two kinds for now. */
export type GameRound =
  | { kind: "quickfire"; v: 1; id: string; title: string; howTo: string; seconds: number; questions: Mcq[] }
  | { kind: "match"; v: 1; id: string; title: string; howTo: string; pairs: { left: Inline; right: Inline }[] };
/** POST /games/:id/result */
export type GameResultBody = { score: number; total: number; ms: number };
export type GameResult = { best: number; xp: number };

/** GET /cases/:id: a patient case in steps; each step a choice with feedback. */
export type CaseStudy = {
  id: string;
  title: string;
  patient: string;
  presenting: Inline;
  steps: { ask: Inline; choices: { label: Inline; verdict: "best" | "ok" | "harm"; why: Inline }[] }[];
  takeaway: Inline;
};

/** GET /prep: subjects. GET /prep/:subject: one question set. */
export type PrepSubject = { id: string; title: string; questions: number; done: number; best: number | null };
export type PrepSet = { id: string; title: string; questions: Mcq[] };

/* ---------------------------------------------------------------- Library */

/** GET /medicines?q=&class= : every medicine, one row each. */
export type MedicineRow = { id: string; name: string; className: string; keyDose: string; brands: string[] };
export type MedicineList = { classes: string[]; items: MedicineRow[] };
/** GET /medicines/:id: the medicine page, in sections, content as the website has it. */
export type MedicinePage = MedicineRow & { summary: Inline; sections: { id: string; title: string; points: Inline[] }[] };

/* ------------------------------------------------------------------ Admin */

export type AdminAttention = { id: string; studentId: string; name: string; reason: string; since: string };
/** GET /admin/home */
export type AdminHomeData = {
  dateLine: string;
  needsLook: AdminAttention[];
  today: { active: number; total: number; lecturesWatched: number; doubtsOpen: number; submissionsToGrade: number };
};
export type AdminStudentRow = { id: string; name: string; rollNumber: string | null; cohort: string | null; status: "active" | "paused" | "ended"; lastSeen: string | null; progressPct: number; lecturesOnly: boolean };
/** GET /admin/students?q= */
export type AdminStudentList = { items: AdminStudentRow[] };
/** GET /admin/students/:id */
export type AdminStudent = AdminStudentRow & { email: string | null; mobile: string | null; phone: { name: string; changesUsed: number; limit: number } | null; recent: { at: string; what: string }[]; lectures: { done: number; total: number }; study: { done: number; total: number } | null };
export type AdminActivityRow = { id: string; at: string; who: string; what: string; kind: "lecture" | "study" | "doubt" | "submission" | "sign_in" };
/** GET /admin/activity */
export type AdminActivity = { items: AdminActivityRow[] };
export type AdminThread = { id: string; to: string; title: string; preview: string; at: string; unread: boolean };
/** GET /admin/messages */
export type AdminMessages = { items: AdminThread[] };
/** POST /admin/messages */
export type AdminSendBody = { to: "everyone" | "cohort" | "student"; toId?: string; title: string; body: string };
export type AdminSendResult = { sent: number };
