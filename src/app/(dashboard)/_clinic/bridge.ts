"use server";

/**
 * The website's one door to the clinic server code (src/lib/clinic, built by
 * the server side). Every clinic page and form calls these, and each answers
 * Res<T>: { ok: true, data } or { ok: false, error } with a plain sentence.
 * Kept in one file so the screens never depend on how the server code is
 * split.
 */

import type { Res } from "@/components/clinic/result";
import type {
  ClinicAdminBatchBody,
  ClinicAdminOverview,
  ClinicAllowanceBody,
  ClinicAllowanceResult,
  ClinicAllowances,
  ClinicApplyBody,
  ClinicApplyResult,
  ClinicBatchBody,
  ClinicCaseLogBody,
  ClinicDayNoteBody,
  ClinicEarlyLeaveBody,
  ClinicExtraBody,
  ClinicLeaveBody,
  ClinicLeaveDecisionBody,
  ClinicLeaveQueue,
  ClinicLeaveRequest,
  ClinicLiveAttendance,
  ClinicManualMarkBody,
  ClinicMoveBody,
  ClinicMyAttendance,
  ClinicMyLeave,
  ClinicMyOpd,
  ClinicOpdSettings,
  ClinicPlan,
  ClinicPublishBody,
  ClinicPublishResult,
  ClinicQuotaBody,
  ClinicQuotaRow,
  ClinicQuotas,
  ClinicRemindResult,
  ClinicScanBody,
  ClinicScanResult,
  ClinicSession,
  ClinicSessionBody,
  ClinicSessionPatch,
  ClinicShowCode,
  ClinicSlot,
  ClinicSlotBody,
  ClinicStudentDetail,
  ClinicToday,
  ClinicTrackers,
  ClinicVisit,
  ClinicWeek,
  ClinicBatch,
} from "@/lib/clinic/types";

const NOT_READY = "This isn't set up yet.";
async function notReady<T>(): Promise<Res<T>> {
  return { ok: false, error: NOT_READY };
}

/* student */
export async function loadToday(): Promise<Res<ClinicToday>> { return notReady(); }
export async function loadWeek(start?: string): Promise<Res<ClinicWeek>> { void start; return notReady(); }
export async function scan(body: ClinicScanBody): Promise<Res<ClinicScanResult>> { void body; return notReady(); }
export async function loadMyAttendance(): Promise<Res<ClinicMyAttendance>> { return notReady(); }
export async function loadMyLeave(): Promise<Res<ClinicMyLeave>> { return notReady(); }
export async function requestLeave(body: ClinicLeaveBody): Promise<Res<ClinicLeaveRequest>> { void body; return notReady(); }
export async function requestEarly(body: ClinicEarlyLeaveBody): Promise<Res<ClinicLeaveRequest>> { void body; return notReady(); }
export async function cancelLeave(id: string): Promise<Res<{ cancelled: true }>> { void id; return notReady(); }
export async function loadMyOpd(): Promise<Res<ClinicMyOpd>> { return notReady(); }
export async function chooseBatch(body: ClinicBatchBody): Promise<Res<ClinicMyOpd>> { void body; return notReady(); }
export async function sendCaseLog(body: ClinicCaseLogBody): Promise<Res<ClinicVisit>> { void body; return notReady(); }

/* admin */
export async function loadOverview(cohort?: string): Promise<Res<ClinicAdminOverview>> { void cohort; return notReady(); }
export async function loadTimetable(cohort: string): Promise<Res<{ slots: ClinicSlot[] }>> { void cohort; return notReady(); }
export async function saveSlot(id: string | null, body: ClinicSlotBody): Promise<Res<ClinicSlot>> { void id; void body; return notReady(); }
export async function deleteSlot(id: string): Promise<Res<{ deleted: true }>> { void id; return notReady(); }
export async function applyTimetable(body: ClinicApplyBody): Promise<Res<ClinicApplyResult>> { void body; return notReady(); }
export async function loadSessions(cohort: string, from: string, to: string): Promise<Res<{ sessions: ClinicSession[]; notes: { date: string; note: string }[] }>> { void cohort; void from; void to; return notReady(); }
export async function addSession(body: ClinicSessionBody): Promise<Res<ClinicSession>> { void body; return notReady(); }
export async function patchSession(id: string, patch: ClinicSessionPatch): Promise<Res<ClinicSession>> { void id; void patch; return notReady(); }
export async function saveDayNote(body: ClinicDayNoteBody): Promise<Res<{ date: string; note: string | null }>> { void body; return notReady(); }
export async function loadCode(sessionId: string): Promise<Res<ClinicShowCode>> { void sessionId; return notReady(); }
export async function loadLiveAttendance(sessionId: string): Promise<Res<ClinicLiveAttendance>> { void sessionId; return notReady(); }
export async function markAttendance(sessionId: string, body: ClinicManualMarkBody): Promise<Res<ClinicLiveAttendance>> { void sessionId; void body; return notReady(); }
export async function loadLeaveQueue(cohort: string | undefined, status: "pending" | "approved" | "rejected" | "all"): Promise<Res<ClinicLeaveQueue>> { void cohort; void status; return notReady(); }
export async function decideLeave(id: string, body: ClinicLeaveDecisionBody): Promise<Res<ClinicLeaveRequest>> { void id; void body; return notReady(); }
export async function loadAllowances(cohort?: string): Promise<Res<ClinicAllowances>> { void cohort; return notReady(); }
export async function saveAllowances(body: ClinicAllowanceBody): Promise<Res<ClinicAllowanceResult>> { void body; return notReady(); }
export async function loadOpdSettings(cohort: string): Promise<Res<ClinicOpdSettings>> { void cohort; return notReady(); }
export async function saveOpdSettings(body: ClinicOpdSettings): Promise<Res<ClinicOpdSettings>> { void body; return notReady(); }
export async function loadQuotas(cohort: string): Promise<Res<ClinicQuotas>> { void cohort; return notReady(); }
export async function setQuota(body: ClinicQuotaBody): Promise<Res<{ changed: number }>> { void body; return notReady(); }
export async function addExtra(body: ClinicExtraBody): Promise<Res<ClinicQuotaRow>> { void body; return notReady(); }
export async function setStudentBatch(body: ClinicAdminBatchBody): Promise<Res<{ batch: ClinicBatch }>> { void body; return notReady(); }
export async function generatePlan(cohortId: string): Promise<Res<ClinicPlan>> { void cohortId; return notReady(); }
export async function loadPlan(cohort: string): Promise<Res<ClinicPlan>> { void cohort; return notReady(); }
export async function movePlan(body: ClinicMoveBody): Promise<Res<ClinicPlan>> { void body; return notReady(); }
export async function publishPlan(body: ClinicPublishBody): Promise<Res<ClinicPublishResult>> { void body; return notReady(); }
export async function discardPlan(cohortId: string): Promise<Res<{ deleted: number }>> { void cohortId; return notReady(); }
export async function remindLogs(cohortId: string): Promise<Res<ClinicRemindResult>> { void cohortId; return notReady(); }
export async function loadTrackers(cohort?: string): Promise<Res<ClinicTrackers>> { void cohort; return notReady(); }
export async function loadStudentDetail(userId: string, cohort?: string): Promise<Res<ClinicStudentDetail>> { void userId; void cohort; return notReady(); }
