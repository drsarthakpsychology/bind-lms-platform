"use server";

/**
 * Website server actions for the clinic (schedule, attendance, leave, OPD).
 * The same operations and answer shapes as the app routes under
 * /api/app/v1/clinic (docs/app/API_CONTRACT_CLINIC.md). Every action checks
 * the website session itself: students act only for themselves, any admin
 * reads, only the Super Admin writes.
 *
 * Each answers { ok: true, data } or { ok: false, code, error } (plain words).
 */
import type { z } from "zod";
import { requireAdmin, requireSession, requireSuperAdminSandbox, isSuperAdmin } from "@/lib/auth/guards";
import type { Profile } from "@/lib/auth/session";
import type { ApiErrorCode } from "@/lib/app-api/contract";
import { ApiFail, MESSAGE } from "@/lib/app-api/respond";
import { rateLimitWrite } from "@/lib/rate-limit";
import * as admin from "./admin";
import { clinicDb } from "./db";
import * as scanFlow from "./scan-flow";
import * as s from "./schemas";
import * as student from "./student";

export type ClinicActionResult<T> = { ok: true; data: T } | { ok: false; code: ApiErrorCode; error: string; fields?: string[]; /** Why a scan step was refused (ClinicScanReason). */ reason?: string };

type Role = "self" | "admin" | "super";

async function run<T>(role: Role, fn: (p: Profile) => Promise<T>, limit?: string): Promise<ClinicActionResult<T>> {
  try {
    const p = role === "super" ? await requireSuperAdminSandbox() : role === "admin" ? await requireAdmin() : await requireSession();
    if (!p) return { ok: false, code: role === "self" ? "unauthenticated" : "forbidden", error: role === "self" ? MESSAGE.unauthenticated : MESSAGE.forbidden };
    if (limit && !(await rateLimitWrite(`web:${limit}:${p.id}`, limit === "clinic-scan" ? 12 : limit === "clinic-scan-confirm" ? 20 : 60))) throw new ApiFail("rate_limited");
    return { ok: true, data: await fn(p) };
  } catch (e) {
    if (e instanceof ApiFail) return { ok: false, code: e.code, error: e.message, ...(Array.isArray(e.details?.fields) ? { fields: e.details.fields as string[] } : {}), ...(typeof e.details?.reason === "string" ? { reason: e.details.reason } : {}) };
    console.error("clinic action failed:", e instanceof Error ? (e.stack ?? e.message) : e);
    return { ok: false, code: "server_error", error: MESSAGE.server_error };
  }
}

function parse<S extends z.ZodType>(schema: S, input: unknown): z.infer<S> {
  const r = schema.safeParse(input);
  if (!r.success) throw new ApiFail("bad_request", undefined, { fields: [...new Set(r.error.issues.map((i) => i.path.join(".")).filter(Boolean))] });
  return r.data;
}

const id = (v: unknown): string => {
  if (typeof v !== "string" || !s.isUuid(v)) throw new ApiFail("not_found");
  return v;
};
const cohort = (v: unknown) => (typeof v === "string" ? s.idOrNull(v) : null);

/* ---------------------------------------------------------- student */

export async function clinicToday(cohortId?: string | null) {
  return run("self", (p) => student.getToday(clinicDb(), p.id, cohort(cohortId), Date.now()));
}
export async function clinicWeek(start?: string | null, cohortId?: string | null) {
  return run("self", (p) => student.getWeek(clinicDb(), p.id, cohort(cohortId), typeof start === "string" ? start : null, Date.now()));
}
export async function clinicScan(input: unknown) {
  return run("self", (p) => student.scan(clinicDb(), p.id, parse(s.scanSchema, input), Date.now()), "clinic-scan");
}
/** Step 1: which session, and where the student stands in it. Saves nothing. */
export async function clinicScanIdentify(input: unknown) {
  return run("self", (p) => scanFlow.identify(clinicDb(), p.id, parse(s.scanIdentifySchema, input), Date.now()), "clinic-scan");
}
/** Step 2: save IN or OUT, once. */
export async function clinicScanConfirm(input: unknown) {
  return run("self", (p) => scanFlow.confirm(clinicDb(), p.id, parse(s.scanConfirmSchema, input), Date.now()), "clinic-scan-confirm");
}
export async function clinicMyAttendance(cohortId?: string | null) {
  return run("self", (p) => student.getMyAttendance(clinicDb(), p.id, cohort(cohortId), Date.now()));
}
export async function clinicMyLeave(cohortId?: string | null) {
  return run("self", (p) => student.getMyLeave(clinicDb(), p.id, cohort(cohortId), Date.now()));
}
export async function clinicRequestLeave(input: unknown) {
  return run("self", (p) => student.requestLeave(clinicDb(), p.id, parse(s.leaveSchema, input), Date.now()), "clinic");
}
export async function clinicRequestEarlyLeave(input: unknown) {
  return run("self", (p) => student.requestEarlyLeave(clinicDb(), p.id, parse(s.earlyLeaveSchema, input), Date.now()), "clinic");
}
export async function clinicCancelLeave(leaveId: string) {
  return run("self", (p) => student.cancelLeave(clinicDb(), p.id, id(leaveId)), "clinic");
}
export async function clinicMyOpd(cohortId?: string | null) {
  return run("self", (p) => student.getMyOpd(clinicDb(), p.id, cohort(cohortId), Date.now()));
}
export async function clinicChooseBatch(input: unknown) {
  return run(
    "self",
    (p) => {
      const b = parse(s.batchSchema, input);
      return student.chooseBatch(clinicDb(), p.id, b.batch, b.cohortId, Date.now());
    },
    "clinic",
  );
}
export async function clinicSubmitCaseLog(input: unknown) {
  return run("self", (p) => student.submitCaseLog(clinicDb(), p.id, parse(s.caseLogSchema, input), Date.now()), "clinic");
}

/* ------------------------------------------------------------ admin */

export async function clinicAdminOverview(cohortId?: string | null) {
  return run("admin", (p) => admin.overview(clinicDb(), cohort(cohortId), isSuperAdmin(p), Date.now()));
}
export async function clinicListSlots(cohortId?: string | null) {
  return run("admin", () => admin.listSlots(clinicDb(), cohort(cohortId)));
}
export async function clinicCreateSlot(input: unknown) {
  return run("super", (p) => admin.createSlot(clinicDb(), parse(s.slotSchema, input), p.id), "clinic-admin");
}
export async function clinicUpdateSlot(slotId: string, input: unknown) {
  return run("super", () => admin.updateSlot(clinicDb(), id(slotId), parse(s.slotSchema, input), Date.now()), "clinic-admin");
}
export async function clinicDeleteSlot(slotId: string) {
  return run("super", () => admin.deleteSlot(clinicDb(), id(slotId)), "clinic-admin");
}
export async function clinicApplyTimetable(input: unknown) {
  return run("super", (p) => admin.applyTimetable(clinicDb(), parse(s.applySchema, input), p.id), "clinic-admin");
}
export async function clinicListSessions(cohortId?: string | null, from?: string | null, to?: string | null) {
  return run("admin", () => admin.listSessions(clinicDb(), cohort(cohortId), from ?? null, to ?? null, Date.now()));
}
export async function clinicCreateSession(input: unknown) {
  return run("super", (p) => admin.createSession(clinicDb(), parse(s.sessionSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicPatchSession(sessionId: string, input: unknown) {
  return run("super", (p) => admin.patchSession(clinicDb(), id(sessionId), parse(s.sessionPatchSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicSetDayNote(input: unknown) {
  return run("super", (p) => admin.setDayNote(clinicDb(), parse(s.dayNoteSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicShowCode(sessionId: string) {
  return run("admin", (p) => admin.showSessionCode(clinicDb(), id(sessionId), p.id, isSuperAdmin(p), Date.now()));
}
export async function clinicLiveAttendance(sessionId: string) {
  return run("admin", () => admin.liveAttendance(clinicDb(), id(sessionId), Date.now()));
}
export async function clinicManualMark(sessionId: string, input: unknown) {
  return run("super", (p) => admin.manualMark(clinicDb(), id(sessionId), parse(s.manualMarkSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicLeaveQueue(cohortId?: string | null, status?: string | null) {
  return run("admin", () => admin.leaveQueue(clinicDb(), cohort(cohortId), status ?? null, Date.now()));
}
export async function clinicDecideLeave(leaveId: string, input: unknown) {
  return run("super", (p) => admin.decideLeave(clinicDb(), id(leaveId), parse(s.decisionSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicListAllowances(cohortId?: string | null) {
  return run("admin", () => admin.listAllowances(clinicDb(), cohort(cohortId), Date.now()));
}
export async function clinicSetAllowances(input: unknown) {
  return run("super", (p) => admin.setAllowances(clinicDb(), parse(s.allowanceSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicGetSettings(cohortId?: string | null) {
  return run("admin", () => admin.getSettings(clinicDb(), cohort(cohortId)));
}
export async function clinicSaveSettings(input: unknown) {
  return run("super", (p) => admin.saveSettings(clinicDb(), parse(s.settingsSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicListQuotas(cohortId?: string | null) {
  return run("admin", () => admin.listQuotas(clinicDb(), cohort(cohortId), Date.now()));
}
export async function clinicSetQuotas(input: unknown) {
  return run("super", (p) => admin.setQuotas(clinicDb(), parse(s.quotaSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicAddExtra(input: unknown) {
  return run("super", (p) => admin.addExtra(clinicDb(), parse(s.extraSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicSetBatch(input: unknown) {
  return run("super", (p) => admin.setBatch(clinicDb(), parse(s.adminBatchSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicGenerate(input: unknown) {
  return run("super", (p) => admin.generate(clinicDb(), parse(s.cohortBodySchema, input).cohortId, p.id, Date.now()), "clinic-admin");
}
export async function clinicGetPlan(cohortId?: string | null, state?: "draft" | "published" | null) {
  return run("admin", () => admin.getPlan(clinicDb(), cohort(cohortId), state === "draft" || state === "published" ? state : null, Date.now()));
}
export async function clinicMove(input: unknown) {
  return run("super", (p) => admin.moveAssignment(clinicDb(), parse(s.moveSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicPublish(input: unknown) {
  return run("super", (p) => admin.publishPlan(clinicDb(), parse(s.publishSchema, input), p.id, Date.now()), "clinic-admin");
}
export async function clinicDiscardDraft(cohortId: string) {
  return run("super", () => admin.discardDraft(clinicDb(), cohort(cohortId)), "clinic-admin");
}
export async function clinicRemind(input: unknown) {
  return run("super", (p) => admin.remindLogs(clinicDb(), parse(s.cohortBodySchema, input).cohortId, p.id, Date.now()), "clinic-admin");
}
export async function clinicTrackers(cohortId?: string | null) {
  return run("admin", () => admin.trackers(clinicDb(), cohort(cohortId), Date.now()));
}
export async function clinicStudentDetail(userId: string, cohortId?: string | null) {
  return run("admin", () => admin.studentDetail(clinicDb(), id(userId), cohort(cohortId), Date.now()));
}
