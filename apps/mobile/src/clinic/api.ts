import { useQuery } from "@tanstack/react-query";

import type * as W from "@/api/contract";
import { api } from "@/auth";
import { createStore } from "@/lib/store";
import type * as C from "./contract";
import { addDays, mondayOf, todayIST } from "./logic";
import * as S from "./safe";

/**
 * Clinic server data (docs/app/API_CONTRACT_CLINIC.md): schedule,
 * attendance, leave and OPD for students; the admin's sessions, codes, leave
 * queue, allowances, timetable, OPD plan and trackers. Student keys start
 * with "clinic", admin keys with "admin", so one refresh after an action
 * brings every screen up to date. Answers go through ./safe.ts.
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
export const useClinicWeek = (from: string) => useQuery({ queryKey: clinicKeys.week(from), queryFn: async () => S.week(await get("/clinic/week", { start: from })), placeholderData: (prev) => prev });
/** My leave, with my sessions for this week and the next two to ask for. */
export const useLeave = () =>
  useQuery({
    queryKey: clinicKeys.leave,
    queryFn: async () => {
      const m = mondayOf(todayIST());
      const [leave, ...weeks] = await Promise.all([get("/clinic/leave"), get("/clinic/week", { start: m }), get("/clinic/week", { start: addDays(m, 7) }), get("/clinic/week", { start: addDays(m, 14) })]);
      return S.leavePage(leave, weeks);
    },
  });
export const opdQuery = { queryKey: clinicKeys.opd, queryFn: async () => S.opdPage(await get("/clinic/opd")) };
export const useOpd = () => useQuery(opdQuery);
export const useMyAttendance = () => useQuery({ queryKey: clinicKeys.attendance, queryFn: async () => S.attendance(await get("/clinic/attendance")) });

export const clinicCalls = {
  /** `token` is the whole text the camera read; `code` the 6 characters typed. */
  scan: async (body: W.ClinicScanBody) => S.scanResult(await api.post<unknown>("/clinic/scan", body)),
  askLeave: async (body: W.ClinicLeaveBody) => S.leave(await api.post<unknown>("/clinic/leave", body)),
  askEarly: async (body: W.ClinicEarlyLeaveBody) => S.leave(await api.post<unknown>("/clinic/leave/early", body)),
  cancelLeave: (id: string) => api.del<{ cancelled: true }>(`/clinic/leave/${enc(id)}`),
  setBatch: async (batch: C.Batch) => S.opdPage(await api.put<unknown>("/clinic/opd/batch", { batch } satisfies W.ClinicBatchBody)),
  logCases: async (body: W.ClinicCaseLogBody) => S.visit(await api.post<unknown>("/clinic/opd/logs", body)),
};

/* -------------------------------------------------------------- admin */

/** The cohort the admin screens show (the overview's own cohort until the admin picks another). */
export const cohortStore = createStore<{ id: string | null }>({ id: null });
const ak = (part: string, arg = "") => ["admin", "clinic", part, cohortStore.get().id ?? "", arg] as const;
const cq = (extra?: Record<string, string | number | undefined>) => ({ cohort: cohortStore.get().id ?? undefined, ...extra });

export const overviewQuery = () => ({
  queryKey: ak("overview"),
  queryFn: async () => {
    const t = todayIST();
    const [o, s] = await Promise.all([get("/clinic/admin/overview", cq()), get("/clinic/admin/sessions", cq({ from: t, to: t })).catch(() => null)]);
    return S.adminToday(o, s);
  },
});
export function useAdminClinicToday() {
  cohortStore.use((s) => s.id);
  return useQuery(overviewQuery());
}
/** The cohort id every admin write names: the one picked, or the overview's. */
export function useCohortId(): string | null {
  const picked = cohortStore.use((s) => s.id);
  const o = useAdminClinicToday();
  return picked ?? o.data?.cohortId ?? null;
}

/** The list refreshes every 10 seconds while the screen is open, so scans show as they come in. */
export const useSessionDetail = (id: string, live = true) => useQuery({ queryKey: ak("session", id), queryFn: async () => S.sessionDetail(await get(`/clinic/admin/sessions/${enc(id)}/attendance`)), enabled: id.length > 0, refetchInterval: live ? 10_000 : false });
export function useAdminLeaves(status: "pending" | "all") {
  cohortStore.use((s) => s.id);
  return useQuery({ queryKey: ak("leaves", status), queryFn: async () => S.adminLeaves(await get("/clinic/admin/leave", cq({ status }))) });
}
export function useClinicStudents() {
  cohortStore.use((s) => s.id);
  return useQuery({ queryKey: ak("trackers"), queryFn: async () => S.trackers(await get("/clinic/admin/trackers", cq())) });
}
export function useTimetable() {
  cohortStore.use((s) => s.id);
  return useQuery({
    queryKey: ak("timetable"),
    queryFn: async () => {
      const t = todayIST();
      const [slots, sessions] = await Promise.all([get("/clinic/admin/timetable", cq()), get("/clinic/admin/sessions", cq({ from: t, to: addDays(t, 13) }))]);
      return S.timetable(slots, sessions);
    },
  });
}
export function useOpdAdmin() {
  cohortStore.use((s) => s.id);
  return useQuery({
    queryKey: ak("opd"),
    queryFn: async (): Promise<C.OpdAdmin> => {
      const [settings, plan] = await Promise.all([get("/clinic/admin/opd/settings", cq()), get("/clinic/admin/opd/plan", cq())]);
      const s = S.opdSettings(settings);
      return { cohortId: (settings as { cohortId?: string } | null)?.cohortId ?? null, settings: s, plan: S.plan(plan) };
    },
  });
}

const slotBody = (d: C.SlotDraft): W.ClinicSlotBody => ({ cohortIds: d.cohortIds, weekday: (["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(d.weekday) + 1) % 7, start: d.start, end: d.end, kind: d.kind, title: d.title, place: d.place, onlineLink: d.link, compulsory: d.compulsory, validFrom: null, validTo: null });

export const adminClinicCalls = {
  code: async (sessionId: string) => S.showCode(await get(`/clinic/admin/sessions/${enc(sessionId)}/code`)),
  mark: async (sessionId: string, studentId: string, state: C.MarkState, note: string) => S.sessionDetail(await api.post<unknown>(`/clinic/admin/sessions/${enc(sessionId)}/attendance`, { userId: studentId, direction: state === "missing" ? "clear" : state, note } satisfies W.ClinicManualMarkBody)),
  decide: (id: string, body: W.ClinicLeaveDecisionBody) => api.post<unknown>(`/clinic/admin/leave/${enc(id)}`, body),
  setLeaves: (cohortId: string, set: number, note: string, userIds?: string[]) => api.put<W.ClinicAllowanceResult>("/clinic/admin/allowances", { cohortId, userIds, set, note } satisfies W.ClinicAllowanceBody),
  setCases: (cohortId: string, base: number, userIds?: string[]) => api.put<{ changed: number }>("/clinic/admin/opd/quotas", { cohortId, userIds, base } satisfies W.ClinicQuotaBody),
  extraCases: (cohortId: string, userId: string, count: number, note: string) => api.post<unknown>("/clinic/admin/opd/extras", { cohortId, userId, count, note } satisfies W.ClinicExtraBody),
  setBatch: (cohortId: string, userId: string, batch: C.Batch) => api.put<unknown>("/clinic/admin/opd/batch", { cohortId, userId, batch } satisfies W.ClinicAdminBatchBody),
  remind: (cohortId: string) => api.post<W.ClinicRemindResult>("/clinic/admin/opd/remind", { cohortId }),
  addSlot: (d: C.SlotDraft) => api.post<unknown>("/clinic/admin/timetable", slotBody(d)),
  editSlot: (id: string, d: C.SlotDraft) => api.put<unknown>(`/clinic/admin/timetable/${enc(id)}`, slotBody(d)),
  removeSlot: (id: string) => api.del<unknown>(`/clinic/admin/timetable/${enc(id)}`),
  /** Makes the sessions from the timetable for the next 8 weeks (adds only what is missing). */
  apply: (cohortId: string) => api.post<W.ClinicApplyResult>("/clinic/admin/timetable/apply", { cohortId, from: todayIST(), to: addDays(todayIST(), 55) } satisfies W.ClinicApplyBody),
  addSession: (d: C.OneOffDraft) => api.post<unknown>("/clinic/admin/sessions", { cohortIds: d.cohortIds, date: d.date, start: d.start, end: d.end, kind: d.kind, title: d.title, place: d.place, onlineLink: d.link, compulsory: d.compulsory, note: d.note, notify: true } satisfies W.ClinicSessionBody),
  moveSession: (id: string, b: { date: string; start: string; end: string; note: string | null }) => api.patch<unknown>(`/clinic/admin/sessions/${enc(id)}`, { date: b.date, start: b.start, end: b.end, note: b.note, notify: true } satisfies W.ClinicSessionPatch),
  cancelSession: (id: string, note: string | null) => api.patch<unknown>(`/clinic/admin/sessions/${enc(id)}`, { status: "cancelled", note, notify: true } satisfies W.ClinicSessionPatch),
  dayNote: (cohortId: string, date: string, note: string) => api.put<unknown>("/clinic/admin/notes", { cohortId, date, note } satisfies W.ClinicDayNoteBody),
  saveOpdSettings: (cohortId: string, s: C.OpdSettings) => api.put<unknown>("/clinic/admin/opd/settings", S.settingsBody(cohortId, s)),
  generate: async (cohortId: string) => S.plan(await api.post<unknown>("/clinic/admin/opd/generate", { cohortId } satisfies W.ClinicGenerateBody)),
  moveSeat: async (body: W.ClinicMoveBody) => S.plan(await api.post<unknown>("/clinic/admin/opd/move", body)),
  publish: (cohortId: string) => api.post<W.ClinicPublishResult>("/clinic/admin/opd/publish", { cohortId, notify: true } satisfies W.ClinicPublishBody),
  discard: (cohortId: string) => api.del<{ deleted: number }>("/clinic/admin/opd/plan", { query: { cohort: cohortId } }),
};
