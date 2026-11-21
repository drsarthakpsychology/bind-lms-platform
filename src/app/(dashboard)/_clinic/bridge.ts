"use server";

/**
 * The website's one door to the clinic server actions (src/lib/clinic/actions.ts).
 * Every clinic page and form calls these. They pass straight through (the
 * actions check the session: students act for themselves, admins read, the
 * Super Admin writes) and only turn "unavailable" (the clinic tables are not
 * in the database yet) into one calm sentence.
 */

import type { Res } from "@/components/clinic/result";
import * as A from "@/lib/clinic/actions";
import type {
  ClinicAdminBatchBody,
  ClinicAllowanceBody,
  ClinicApplyBody,
  ClinicBatchBody,
  ClinicCaseLogBody,
  ClinicDayNoteBody,
  ClinicEarlyLeaveBody,
  ClinicExtraBody,
  ClinicLeaveBody,
  ClinicLeaveDecisionBody,
  ClinicManualMarkBody,
  ClinicMoveBody,
  ClinicOpdSettings,
  ClinicPublishBody,
  ClinicQuotaBody,
  ClinicScanBody,
  ClinicScanConfirmBody,
  ClinicScanIdentifyBody,
  ClinicSessionBody,
  ClinicSessionPatch,
  ClinicSlotBody,
} from "@/lib/clinic/types";

const NOT_ON = "Not switched on yet.";

async function pass<T>(p: Promise<A.ClinicActionResult<T>>): Promise<Res<T>> {
  const r = await p;
  if (r.ok) return { ok: true, data: r.data };
  return { ok: false, code: r.code, error: r.code === "unavailable" ? NOT_ON : r.error, ...(r.reason ? { reason: r.reason } : {}) };
}

/* student */
export async function loadToday() { return pass(A.clinicToday()); }
export async function loadWeek(start?: string) { return pass(A.clinicWeek(start ?? null)); }
export async function scan(body: ClinicScanBody) { return pass(A.clinicScan(body)); }
export async function scanIdentify(body: ClinicScanIdentifyBody) { return pass(A.clinicScanIdentify(body)); }
export async function scanConfirm(body: ClinicScanConfirmBody) { return pass(A.clinicScanConfirm(body)); }
export async function loadMyAttendance() { return pass(A.clinicMyAttendance()); }
export async function loadMyLeave() { return pass(A.clinicMyLeave()); }
export async function requestLeave(body: ClinicLeaveBody) { return pass(A.clinicRequestLeave(body)); }
export async function requestEarly(body: ClinicEarlyLeaveBody) { return pass(A.clinicRequestEarlyLeave(body)); }
export async function cancelLeave(id: string) { return pass(A.clinicCancelLeave(id)); }
export async function loadMyOpd() { return pass(A.clinicMyOpd()); }
export async function chooseBatch(body: ClinicBatchBody) { return pass(A.clinicChooseBatch(body)); }
export async function sendCaseLog(body: ClinicCaseLogBody) { return pass(A.clinicSubmitCaseLog(body)); }

/* admin */
export async function loadOverview(cohort?: string) { return pass(A.clinicAdminOverview(cohort ?? null)); }
export async function loadTimetable(cohort: string) { return pass(A.clinicListSlots(cohort)); }
export async function saveSlot(id: string | null, body: ClinicSlotBody) { return pass(id ? A.clinicUpdateSlot(id, body) : A.clinicCreateSlot(body)); }
export async function deleteSlot(id: string) { return pass(A.clinicDeleteSlot(id)); }
export async function applyTimetable(body: ClinicApplyBody) { return pass(A.clinicApplyTimetable(body)); }
export async function loadSessions(cohort: string, from: string, to: string) { return pass(A.clinicListSessions(cohort, from, to)); }
export async function addSession(body: ClinicSessionBody) { return pass(A.clinicCreateSession(body)); }
export async function patchSession(id: string, patch: ClinicSessionPatch) { return pass(A.clinicPatchSession(id, patch)); }
export async function saveDayNote(body: ClinicDayNoteBody) { return pass(A.clinicSetDayNote(body)); }
export async function loadCode(sessionId: string) { return pass(A.clinicShowCode(sessionId)); }
export async function loadLiveAttendance(sessionId: string) { return pass(A.clinicLiveAttendance(sessionId)); }
export async function markAttendance(sessionId: string, body: ClinicManualMarkBody) { return pass(A.clinicManualMark(sessionId, body)); }
export async function loadLeaveQueue(cohort: string | undefined, status: "pending" | "approved" | "rejected" | "all") { return pass(A.clinicLeaveQueue(cohort ?? null, status)); }
export async function decideLeave(id: string, body: ClinicLeaveDecisionBody) { return pass(A.clinicDecideLeave(id, body)); }
export async function loadAllowances(cohort?: string) { return pass(A.clinicListAllowances(cohort ?? null)); }
export async function saveAllowances(body: ClinicAllowanceBody) { return pass(A.clinicSetAllowances(body)); }
export async function loadOpdSettings(cohort: string) { return pass(A.clinicGetSettings(cohort)); }
export async function saveOpdSettings(body: ClinicOpdSettings) { return pass(A.clinicSaveSettings(body)); }
export async function loadQuotas(cohort: string) { return pass(A.clinicListQuotas(cohort)); }
export async function setQuota(body: ClinicQuotaBody) { return pass(A.clinicSetQuotas(body)); }
export async function addExtra(body: ClinicExtraBody) { return pass(A.clinicAddExtra(body)); }
export async function setStudentBatch(body: ClinicAdminBatchBody) { return pass(A.clinicSetBatch(body)); }
export async function generatePlan(cohortId: string) { return pass(A.clinicGenerate({ cohortId })); }
export async function loadPlan(cohort: string) { return pass(A.clinicGetPlan(cohort)); }
export async function movePlan(body: ClinicMoveBody) { return pass(A.clinicMove(body)); }
export async function publishPlan(body: ClinicPublishBody) { return pass(A.clinicPublish(body)); }
export async function discardPlan(cohortId: string) { return pass(A.clinicDiscardDraft(cohortId)); }
export async function remindLogs(cohortId: string) { return pass(A.clinicRemind({ cohortId })); }
export async function loadTrackers(cohort?: string) { return pass(A.clinicTrackers(cohort ?? null)); }
export async function loadStudentDetail(userId: string, cohort?: string) { return pass(A.clinicStudentDetail(userId, cohort ?? null)); }
