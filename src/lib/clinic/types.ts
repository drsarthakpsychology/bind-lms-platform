/**
 * Clinic types: the database rows (supabase/migrations_pending/2026_11_16_clinic.sql)
 * and the answer shapes shared with the app and the website (the Clinic* types
 * in src/lib/app-api/contract.ts, re-exported here so website code imports one place).
 */
export type {
  ClinicKind,
  ClinicBatch,
  ClinicDirection,
  ClinicMyStatus,
  ClinicSession,
  ClinicMySession,
  ClinicDay,
  ClinicToday,
  ClinicWeek,
  ClinicScanBody,
  ClinicScanResult,
  ClinicAttendanceSummary,
  ClinicMyAttendance,
  ClinicLeaveStatus,
  ClinicLeaveRequest,
  ClinicLeaveBalance,
  ClinicMyLeave,
  ClinicLeaveBody,
  ClinicEarlyLeaveBody,
  ClinicQuota,
  ClinicVisit,
  ClinicMyOpd,
  ClinicBatchBody,
  ClinicCaseLogBody,
  ClinicCohortRef,
  ClinicAdminOverview,
  ClinicSlot,
  ClinicSlotBody,
  ClinicApplyBody,
  ClinicApplyResult,
  ClinicSessionBody,
  ClinicSessionPatch,
  ClinicDayNoteBody,
  ClinicShowCode,
  ClinicAttendanceRow,
  ClinicLiveAttendance,
  ClinicManualMarkBody,
  ClinicLeaveQueue,
  ClinicLeaveDecisionBody,
  ClinicAllowanceRow,
  ClinicAllowances,
  ClinicAllowanceBody,
  ClinicAllowanceResult,
  ClinicSeats,
  ClinicOpdSettings,
  ClinicQuotaRow,
  ClinicQuotas,
  ClinicQuotaBody,
  ClinicExtraBody,
  ClinicAdminBatchBody,
  ClinicPlanEntry,
  ClinicPlanDay,
  ClinicPlan,
  ClinicGenerateBody,
  ClinicMoveBody,
  ClinicPublishBody,
  ClinicPublishResult,
  ClinicTrackerRow,
  ClinicTrackers,
  ClinicStudentDetail,
  ClinicRemindResult,
} from "@/lib/app-api/contract";

import type { ClinicBatch, ClinicKind, ClinicSeats } from "@/lib/app-api/contract";

export const CLINIC_KINDS: readonly ClinicKind[] = ["opd_morning", "opd_evening", "class", "online_class", "early_class", "other"];
export const CLINIC_BATCHES: readonly ClinicBatch[] = ["morning", "evening"];

/* ------------------------------------------------------------- rows */

export type SlotRow = {
  id: string;
  cohort_ids: string[];
  weekday: number;
  start_time: string;
  end_time: string;
  kind: ClinicKind;
  title: string;
  place: string | null;
  online_link: string | null;
  compulsory: boolean;
  valid_from: string | null;
  valid_to: string | null;
  active: boolean;
};

export type SessionRow = {
  id: string;
  cohort_ids: string[];
  slot_id: string | null;
  date: string;
  start_time: string;
  end_time: string;
  kind: ClinicKind;
  title: string;
  place: string | null;
  online_link: string | null;
  compulsory: boolean;
  status: "scheduled" | "cancelled";
  origin: "timetable" | "one_off";
  note: string | null;
  moved_from: string | null;
};

export type DayNoteRow = { id: string; cohort_id: string; date: string; note: string };

export type SecretRow = { session_id: string; secret: string; opened_by: string | null; opened_at: string };

export type AttendanceRow = {
  id: string;
  session_id: string;
  user_id: string;
  in_at: string | null;
  out_at: string | null;
  in_method: "qr" | "code" | "manual" | null;
  out_method: "qr" | "code" | "manual" | null;
  note: string | null;
  marked_by: string | null;
};

export type AllowanceRow = { user_id: string; cohort_id: string; allowance: number };
export type AllowanceLogRow = { id: string; user_id: string; cohort_id: string; old_allowance: number | null; new_allowance: number; note: string | null; changed_by: string | null; created_at: string };

export type LeaveRow = {
  id: string;
  user_id: string;
  cohort_id: string;
  kind: "leave" | "early" | "missed";
  session_ids: string[];
  leave_at: string | null;
  reason: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  over_limit: boolean;
  assignment_id: string | null;
  decided_by: string | null;
  decided_at: string | null;
  decision_note: string | null;
  created_at: string;
};

export type OpdSettingsRow = {
  cohort_id: string;
  seats: ClinicSeats;
  cases_per_visit: number;
  start_date: string | null;
  end_date: string | null;
  late_minutes: number;
  holidays: string[];
  freeze_days: number;
};

export type OpdPrefRow = { user_id: string; cohort_id: string; batch: ClinicBatch; set_by: string | null };
export type QuotaRow = { user_id: string; cohort_id: string; base: number };
export type ExtraRow = { id: string; user_id: string; cohort_id: string; count: number; note: string | null; created_at: string };

export type AssignmentRow = {
  id: string;
  cohort_id: string;
  user_id: string;
  date: string;
  batch: ClinicBatch;
  state: "draft" | "published";
  source: "kept" | "new" | "moved";
  published_at: string | null;
};

export type CaseLogRow = { id: string; assignment_id: string; user_id: string; cohort_id: string; date: string; cases: number; absent: boolean; note: string | null };

export const DEFAULT_OPD_SETTINGS = (cohortId: string): OpdSettingsRow => ({
  cohort_id: cohortId,
  seats: {},
  cases_per_visit: 2,
  start_date: null,
  end_date: null,
  late_minutes: 10,
  holidays: [],
  freeze_days: 7,
});
