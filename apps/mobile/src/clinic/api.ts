import { useQuery } from "@tanstack/react-query";

import { api } from "@/auth";
import type * as C from "./contract";
import * as S from "./safe";

/**
 * Clinic server data: schedule, attendance, leave and OPD for students, and
 * the admin's sessions, codes, leave queue, allowances, timetable and OPD
 * plan. Every key starts with "clinic" (students) or "admin" (admins), so one
 * refresh after an action brings every screen up to date.
 */
const enc = encodeURIComponent;
const get = (path: string, query?: Record<string, string | number | undefined>) => api.get<unknown>(path, query ? { query } : undefined);

export const clinicKeys = {
  all: ["clinic"] as const,
  today: ["clinic", "today"] as const,
  week: (from: string) => ["clinic", "week", from] as const,
  leave: ["clinic", "leave"] as const,
  opd: ["clinic", "opd"] as const,
  attendance: ["clinic", "attendance"] as const,
};

/* ------------------------------------------------------------ student */

export const useClinicToday = (enabled = true) => useQuery({ queryKey: clinicKeys.today, queryFn: async () => S.today(await get("/clinic/today")), enabled, staleTime: 60_000 });
export const useClinicWeek = (from: string) => useQuery({ queryKey: clinicKeys.week(from), queryFn: async () => S.week(await get("/clinic/schedule", { from })), placeholderData: (prev) => prev });
export const useLeave = () => useQuery({ queryKey: clinicKeys.leave, queryFn: async () => S.leavePage(await get("/clinic/leave")) });
export const useOpd = () => useQuery({ queryKey: clinicKeys.opd, queryFn: async () => S.opdPage(await get("/clinic/opd")) });
export const useMyAttendance = () => useQuery({ queryKey: clinicKeys.attendance, queryFn: async () => S.attendance(await get("/clinic/attendance")) });

export const clinicCalls = {
  scan: async (body: C.ScanBody) => S.scanResult(await api.post<unknown>("/clinic/scan", body)),
  askLeave: async (body: C.LeaveBody) => S.leave((await api.post<{ request: unknown }>("/clinic/leave", body)).request),
  askEarly: async (body: C.LeaveEarlyBody) => S.leave((await api.post<{ request: unknown }>("/clinic/leave/early", body)).request),
  cancelLeave: (id: string) => api.post<C.CancelLeaveResult>(`/clinic/leave/${enc(id)}/cancel`, {}),
  setBatch: (batch: C.Batch) => api.put<C.BatchResult>("/clinic/batch", { batch } satisfies C.BatchBody),
  logCases: (visitId: string, body: C.CaseLogBody) => api.post<C.CaseLogResult>(`/clinic/opd/visits/${enc(visitId)}/log`, body),
};

/* -------------------------------------------------------------- admin */

const ak = (part: string, arg = "") => ["admin", "clinic", part, arg] as const;

export const useAdminClinicToday = () => useQuery({ queryKey: ak("today"), queryFn: async () => S.adminToday(await get("/admin/clinic/today")) });
/** The roster refreshes every 10 seconds while the screen is open, so scans show as they come in. */
export const useSessionDetail = (id: string, live = true) => useQuery({ queryKey: ak("session", id), queryFn: async () => S.sessionDetail(await get(`/admin/clinic/sessions/${enc(id)}`)), enabled: id.length > 0, refetchInterval: live ? 10_000 : false });
export const useAdminLeaves = (status: "pending" | "all") => useQuery({ queryKey: ak("leaves", status), queryFn: async () => S.adminLeaves(await get("/admin/clinic/leaves", { status })) });
export const useClinicStudents = () => useQuery({ queryKey: ak("students"), queryFn: async () => S.clinicStudents(await get("/admin/clinic/students")) });
export const useTimetable = () => useQuery({ queryKey: ak("timetable"), queryFn: async () => S.timetable(await get("/admin/clinic/timetable")) });
export const useOpdAdmin = () => useQuery({ queryKey: ak("opd"), queryFn: async () => S.opdAdmin(await get("/admin/clinic/opd")) });

export const adminClinicCalls = {
  code: async (sessionId: string) => S.showCode(await get(`/admin/clinic/sessions/${enc(sessionId)}/code`)),
  mark: (sessionId: string, body: C.MarkBody) => api.post<unknown>(`/admin/clinic/sessions/${enc(sessionId)}/mark`, body),
  decide: (id: string, body: C.DecideBody) => api.post<unknown>(`/admin/clinic/leaves/${enc(id)}/decide`, body),
  bulkAllowance: (body: C.BulkAllowanceBody) => api.post<C.BulkAllowanceResult>("/admin/clinic/allowances", body),
  editStudent: (id: string, body: C.StudentClinicBody) => api.patch<unknown>(`/admin/clinic/students/${enc(id)}`, body),
  extraCases: (id: string, body: C.ExtraCasesBody) => api.post<unknown>(`/admin/clinic/students/${enc(id)}/extra-cases`, body),
  remind: (studentIds: string[]) => api.post<C.RemindResult>("/admin/clinic/logs/remind", { studentIds } satisfies C.RemindBody),
  addSlot: (body: C.SlotBody) => api.post<unknown>("/admin/clinic/slots", body),
  editSlot: (id: string, body: Partial<C.SlotBody>) => api.patch<unknown>(`/admin/clinic/slots/${enc(id)}`, body),
  removeSlot: (id: string) => api.del<unknown>(`/admin/clinic/slots/${enc(id)}`),
  addSession: (body: C.OneOffBody) => api.post<unknown>("/admin/clinic/sessions", body),
  moveSession: (id: string, body: C.MoveSessionBody) => api.patch<unknown>(`/admin/clinic/sessions/${enc(id)}`, body),
  cancelSession: (id: string, body: C.CancelSessionBody) => api.post<unknown>(`/admin/clinic/sessions/${enc(id)}/cancel`, body),
  dayNote: (date: string, note: string) => api.put<unknown>(`/admin/clinic/days/${enc(date)}/note`, { note } satisfies C.DayNoteBody),
  saveOpdSettings: (body: C.OpdSettingsBody) => api.put<unknown>("/admin/clinic/opd/settings", body),
  generate: async () => S.plan((await api.post<{ plan: unknown }>("/admin/clinic/opd/generate", {})).plan),
  moveSeat: async (body: C.MoveSeatBody) => S.plan((await api.post<{ plan: unknown }>("/admin/clinic/opd/move", body)).plan),
  publish: async () => {
    const r = await api.post<{ plan: unknown; notified?: number }>("/admin/clinic/opd/publish", {});
    return { plan: S.plan(r.plan), notified: Number(r.notified) || 0 };
  },
};
