/**
 * Shapes the app needs that are NOT in the server contract yet
 * (src/api/contract.ts is a copy of the server's file and is never edited by
 * hand). Each one is written up as a request for the server side in
 * docs/app/CONTRACT_REQUESTS.md. Until the server builds them, only the mock
 * server answers these routes; against the real server the screens show a
 * quiet "arrives in the next update" state instead of an error.
 */

/* Home quests and the deletion request are in the contract now; kept as names here so older imports still work. */
export type { Quest, QuestCard, DeletionRequestBody, DeletionRequestResult } from "./contract";


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
