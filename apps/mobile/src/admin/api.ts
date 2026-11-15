import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import type * as C from "@/api/contract";
import { ApiFailure, messageOf } from "@/api/errors";
import { keys } from "@/api/queries";
import { api } from "@/auth";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import type * as A from "./contract";
import type * as X from "./extra";
import { guarded, useAdminRole, type AdminAction } from "./role";
import { arr, badgesFrom, behindFrom, certListFrom, emailReportFrom, formFrom, formsFrom, inboxFrom, issueResultFrom, newKeyFrom, num, obj, previewFrom, safeActivity, safeDoubt, safeDoubts, safeHome, safeMessages, safeStudent, safeStudentList, studioFrom, submissionsFrom, systemFrom } from "./safe";

/** Admin server data. Every key starts with "admin" so one call refreshes it all after an action. */
const k = keys.admin;
const enc = encodeURIComponent;
const get = (path: string, query?: Record<string, string | number | undefined>) => api.get<unknown>(path, query ? { query } : undefined);
const isMissing = (e: unknown) => e instanceof ApiFailure && e.code === "not_found";
/** A route the server may not have yet: try it, and on 404 build the answer from routes it has. */
async function orElse<T>(first: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await first();
  } catch (e) {
    if (isMissing(e)) return fallback();
    throw e;
  }
}

export const useAdminHome = () => useQuery({ queryKey: k("home3"), queryFn: async () => safeHome(await get("/admin/home")) });
export const useStudents = (q: { search?: string; cohort?: string; flag?: string } = {}) =>
  useQuery({ queryKey: k("students3", JSON.stringify(q)), queryFn: async () => safeStudentList(await get("/admin/students", { search: q.search, cohort: q.cohort, flag: q.flag, limit: 200 })), placeholderData: (prev) => prev });
export const useStudentProfile = (id: string) => useQuery({ queryKey: k("profile3", id), queryFn: async () => safeStudent(await get(`/admin/students/${enc(id)}`)), enabled: id.length > 0 });
export const useStudentCredentials = (id: string) => useQuery({ queryKey: k("student-creds", id), queryFn: async () => certListFrom(await get("/admin/certificates/issued", { student: id, limit: 100 })), enabled: id.length > 0 });
export const useStudentMessages = (id: string) => useQuery({ queryKey: k("student-msgs", id), queryFn: async () => ({ items: arr<X.StudentMessage>(obj(await get(`/admin/students/${enc(id)}/messages`)).items) }), enabled: id.length > 0 });
export const useStudentDoubts = (id: string) => useQuery({ queryKey: k("student-doubts", id), queryFn: async () => safeDoubts(await get("/admin/doubts", { student: id, limit: 50 })), enabled: id.length > 0 });

export const useActivity = () => useQuery({ queryKey: k("activity3"), queryFn: async () => safeActivity(await get("/admin/activity", { view: "all" })) });
export const useBehind = (cohort: string) => useQuery({ queryKey: k("behind3", cohort), queryFn: async () => behindFrom(safeActivity(await get("/admin/activity", { view: "behind" })), cohort), placeholderData: (prev) => prev });

export const useBatches = () => useQuery({ queryKey: k("batches3"), queryFn: async () => safeMessages(await get("/admin/messages")) });
export const useInbox = () => useQuery({ queryKey: k("inbox3"), queryFn: async () => inboxFrom(await get("/admin/inbox")) });
/** An email in the inbox. The server sends them with the inbox, so this reads the same answer. */
export const useInboxThread = (id: string) =>
  useQuery({
    queryKey: k("inbox3"),
    queryFn: async () => inboxFrom(await get("/admin/inbox")),
    select: (d): X.InboxThread => {
      const t = d.emails.find((e) => e.id === id);
      if (!t) throw new ApiFailure("not_found", "That email has been answered or moved.", 404);
      return t;
    },
  });

export const useAdminDoubts = (kind: "" | "doubt" | "complaint") => useQuery({ queryKey: k("doubts3", kind), queryFn: async () => safeDoubts(await get("/admin/doubts", { kind: kind || undefined, limit: 100 })) });
export const useAdminDoubt = (id: string) => useQuery({ queryKey: k("doubt3", id), queryFn: async () => safeDoubt(await get(`/doubts/${enc(id)}`)) });

export const useSubmissions = (status: "pending" | "graded" | "") => useQuery({ queryKey: k("submissions3", status), queryFn: async () => submissionsFrom(await get("/admin/submissions", { status: status || undefined, limit: 100 })) });
export const useSignOffs = () => useQuery({ queryKey: k("signoffs"), queryFn: async () => ({ items: arr<X.SignOff>(obj(await get("/admin/review/signoffs")).items) }) });

/** Cohorts: their own route when the server has it, otherwise the cohort cards on admin Home. */
export const useCohorts = () =>
  useQuery({
    queryKey: k("cohorts3"),
    queryFn: () =>
      orElse(
        async () => ({ items: arr<X.CohortRow>(obj(await get("/admin/cohorts")).items).filter((c) => c && c.id) }),
        async () => ({ items: safeHome(await get("/admin/home")).cohorts.map(cohortFromHome) }),
      ),
  });
export const useCohort = (id: string) =>
  useQuery({
    queryKey: k("cohort3", id),
    queryFn: () =>
      orElse(
        async () => {
          const c = obj(await get(`/admin/cohorts/${enc(id)}`));
          return { ...cohortFromHome({ id, name: "Cohort", members: 0, week: 0, behind: 0, pct: 0 }), ...c, people: arr<X.CohortMember>(c.people), messages: arr<X.CohortDetail["messages"][number]>(c.messages), sessions: arr<X.CohortDetail["sessions"][number]>(c.sessions), hoursWeek: num(c.hoursWeek) } as X.CohortDetail;
        },
        async () => {
          const [home, list] = await Promise.all([get("/admin/home").then(safeHome), get("/admin/students", { cohort: id, limit: 200 }).then(safeStudentList)]);
          const card = home.cohorts.find((c) => c.id === id);
          const name = card?.name ?? list.cohorts.find((c) => c.id === id)?.name ?? "Cohort";
          const row = cohortFromHome(card ?? { id, name, members: list.items.length, week: 0, behind: 0, pct: 0 });
          return { ...row, people: list.items.map((r) => ({ id: r.id, name: r.name, rollNumber: r.rollNumber, account: r.account, presence: r.presence, lastSeen: r.lastSeen, done: r.lecturesDone, available: r.lecturesAvailable })), messages: [], hoursWeek: 0, sessions: [] };
        },
      ),
    enabled: id.length > 0,
  });
function cohortFromHome(c: { id: string; name: string; members: number; week: number; behind: number; pct: number }): X.CohortRow {
  return { id: c.id, name: c.name, status: "active", course: null, members: c.members, lectures: 0, pct: c.pct, activeWeek: c.week, behind: c.behind, never: 0, starts: null, ends: null };
}

export const usePeople = () => useQuery({ queryKey: k("people"), queryFn: async () => ({ items: arr<X.PersonRow>(obj(await get("/admin/people")).items).filter((p) => p && p.key) }) });
export const usePerson = (key: string) => useQuery({ queryKey: k("person", key), queryFn: async () => { const p = obj(await get(`/admin/people/${enc(key)}`)); return { ...p, facts: arr(p.facts), timeline: arr(p.timeline), studentId: (p.studentId as string | null) ?? null } as X.PersonDetail; } });
export const useEnquiries = () => useQuery({ queryKey: k("enquiries"), queryFn: async () => ({ items: arr<X.Enquiry>(obj(await get("/admin/enquiries")).items).filter((e) => e && e.id) }) });

export const useCertificates = (f: { q?: string; type?: string; status?: string } = {}) => useQuery({ queryKey: k("certificates3", JSON.stringify(f)), queryFn: async () => certListFrom(await get("/admin/certificates/issued", { q: f.q || undefined, type: f.type || undefined, status: f.status || undefined, limit: 200 })), placeholderData: (prev) => prev });
export const useStudioOptions = () => useQuery({ queryKey: k("studio3"), queryFn: async () => studioFrom(await get("/admin/certificates/studio")), staleTime: 10 * 60_000 });
export const useBadges = () => useQuery({ queryKey: k("badges"), queryFn: async () => badgesFrom(await get("/admin/badges")) });
export const useStudioSettings = () => useQuery({ queryKey: k("studio-settings"), queryFn: async () => { const s = obj(await get("/admin/certificates/settings")); return { signatories: arr<X.StudioSignatory>(s.signatories), emailOnIssue: s.emailOnIssue !== false, replyTo: (s.replyTo as string | null) ?? null, emailReady: s.emailReady !== false } satisfies X.StudioSettings; } });
export const useForms = () => useQuery({ queryKey: k("forms3"), queryFn: async () => formsFrom(await get("/admin/forms")) });
export const useForm = (id: string, emailed: "" | "yes" | "no" = "") => useQuery({ queryKey: k("form3", `${id}:${emailed}`), queryFn: async () => formFrom(await get(`/admin/forms/${enc(id)}`, { emailed: emailed || undefined, limit: 200 }), id), placeholderData: (prev) => prev });
export const usePushPrefs = () => useQuery({ queryKey: k("push-prefs"), queryFn: async () => { const p = obj(await get("/admin/push-preferences")); return { newDoubt: p.newDoubt !== false, newEnquiry: p.newEnquiry !== false, fallingBehind: p.fallingBehind === true } satisfies X.AdminPushPrefs; } });
export const useSystem = () => useQuery({ queryKey: k("system"), queryFn: async () => systemFrom(await get("/admin/system")) });

/** What the studio sends: the website's StudioIssueInput, with `replaces` for a correction. */
const issueBody = (b: X.StudioIssueInput, replaces?: string | null): A.StudioIssueBody => ({ ...b, replaces: replaces ?? b.replaces ?? null });

/** Every write the admin screens make, in one place. */
export const adminCalls = {
  lock: (id: string, reason?: string) => api.post<A.LockResult>(`/admin/students/${enc(id)}/lock`, { reason } satisfies A.LockBody),
  unlock: (id: string) => api.post<A.LockResult>(`/admin/students/${enc(id)}/unlock`, {}),
  loginLink: async (id: string): Promise<X.LoginLinkResult> => {
    const r = obj(await api.post<unknown>(`/admin/students/${enc(id)}/login-link`, {}));
    return { sent: r.sent !== false, emailed: r.emailed !== false, url: (r.url as string | null) ?? null, expiresAt: (r.expiresAt as string | null) ?? null };
  },
  allowPhoneChange: (userId: string) => api.post<C.AllowDeviceChangeResult>("/admin/devices/allow-change", { userId } satisfies C.AllowDeviceChangeBody),
  send: async (body: A.AdminSendBody): Promise<A.AdminSendResult> => {
    const r = obj(await api.post<unknown>("/admin/messages", body));
    const sent = num(r.sent ?? r.created);
    return { sent, created: num(r.created, sent), emailed: num(r.emailed), emailFailed: num(r.emailFailed), batchId: (r.batchId as string | null) ?? null };
  },
  replyInbox: (id: string, text: string) => api.post<A.AdminReplyResult>(`/admin/inbox/emails/${enc(id)}/reply`, { text } satisfies A.AdminReplyBody),
  markRead: (id: string) => api.post<{ read: true }>(`/admin/inbox/emails/${enc(id)}/read`, {}),
  answerDoubt: (id: string, text: string) => api.post<A.AdminReplyResult>(`/admin/doubts/${enc(id)}/reply`, { text } satisfies A.AdminReplyBody),
  draftDoubt: async (id: string) => String(obj(await api.post<unknown>(`/admin/doubts/${enc(id)}/draft`, {})).text ?? ""),
  hideDoubt: (id: string, hidden: boolean) => api.post<{ hidden: boolean }>(`/admin/doubts/${enc(id)}/hide`, { hidden } satisfies A.HideBody),
  approve: (id: string) => api.post<A.ReviewResult>(`/admin/submissions/${enc(id)}/approve`, {}),
  grade: (id: string, body: X.GradeBody) => api.post<A.ReviewResult>(`/admin/submissions/${enc(id)}/grade`, body satisfies A.GradeBody),
  submissionFile: (id: string, fileId: string) => api.get<A.AdminFileLink>(`/admin/submissions/${enc(id)}/files/${enc(fileId)}`),
  submissionAudio: (id: string) => api.get<A.AdminFileLink>(`/admin/submissions/${enc(id)}/audio`),
  signOff: (id: string, body: X.SignOffBody) => api.post<X.SignOff>(`/admin/review/signoffs/${enc(id)}`, body),
  moveStage: (key: string, body: X.MoveStageBody) => api.post<X.PersonDetail>(`/admin/people/${enc(key)}/stage`, body),
  issue: async (body: X.StudioIssueInput, replaces?: string | null) => issueResultFrom(await api.post<unknown>("/admin/certificates/issue", issueBody(body, replaces))),
  preview: async (body: X.StudioIssueInput, showing?: number) => api.post<A.StudioPreview>("/admin/certificates/preview", { ...issueBody(body), showing }),
  revoke: (id: string, reason: string) => api.post<{ revoked: true }>(`/admin/certificates/${enc(id)}/revoke`, { reason } satisfies A.RevokeBody),
  resend: async (id: string, email = true): Promise<X.ResendResult> => ({ sent: obj(await api.post<unknown>(`/admin/certificates/${enc(id)}/resend`, { email } satisfies A.ResendBody)).notified !== false }),
  issueDraft: (id: string) => api.post<A.IssueDraftResult>(`/admin/certificates/${enc(id)}/issue-draft`, {}),
  sendWaitingCertificates: (): Promise<A.SendWaitingResult> => api.post<A.SendWaitingResult>("/admin/certificates/send-waiting", {}),
  certificatePdf: (id: string) => api.get<A.AdminFileLink>(`/admin/certificates/${enc(id)}/pdf`),
  awardBadge: (id: string, userIds: string[]) => api.post<A.AwardBadgeResult>(`/admin/badges/${enc(id)}/award`, { userIds } satisfies A.AwardBadgeBody),
  awardAllBadges: () => api.post<A.AwardAllResult>("/admin/badges/award-all", {}),
  note: (key: string, text: string) => api.post<X.PersonDetail>(`/admin/people/${enc(key)}/note`, { text } satisfies X.NoteBody),
  invite: async (key: string): Promise<X.LoginLinkResult> => ({ sent: obj(await api.post<unknown>(`/admin/people/${enc(key)}/invite`, {})).sent !== false }),
  markPaid: (key: string, paid: boolean) => api.post<X.PersonDetail>(`/admin/people/${enc(key)}/paid`, { paid } satisfies X.PaidBody),
  contactPeople: async (body: X.BulkContactBody) => emailReportFrom(await api.post<unknown>("/admin/people/contact", body)),
  emailForm: async (id: string, body: X.FormEmailBody) => emailReportFrom(await api.post<unknown>(`/admin/forms/${enc(id)}/email`, { submissionIds: body.ids, subject: body.subject, body: body.text } satisfies A.FormEmailBody)),
  previewFormEmail: async (id: string, submissionId: string, subject: string, text: string) => previewFrom(await api.post<unknown>(`/admin/forms/${enc(id)}/email/preview`, { submissionId, subject, body: text } satisfies A.FormEmailPreviewBody)),
  sendWaitingForm: (id: string) => api.post<A.FormSendWaitingResult>(`/admin/forms/${enc(id)}/email/send-waiting`, {}),
  studioSettings: (body: Partial<X.StudioSettings>) => api.put<X.StudioSettings>("/admin/certificates/settings", body),
  pushPrefs: (body: Partial<X.AdminPushPrefs>) => api.put<X.AdminPushPrefs>("/admin/push-preferences", body),
  makeKey: async (label: string) => newKeyFrom(await api.post<unknown>("/admin/system/support-keys", { label })),
  rotateKey: async (id: string) => newKeyFrom(await api.post<unknown>(`/admin/system/support-keys/${enc(id)}/rotate`, {})),
  revokeKey: (id: string) => api.post<{ revoked: true }>(`/admin/system/support-keys/${enc(id)}/revoke`, {}),
  revokeLegacyKey: () => api.post<{ revoked: true }>("/admin/system/legacy-key/revoke", {}),
};

/**
 * One admin action: refused for view admins, a busy flag while it runs,
 * a success buzz and line, the admin data refreshed after, and the server's
 * own words on failure.
 */
export function useAdminAction() {
  const qc = useQueryClient();
  const { role } = useAdminRole();
  const [busy, setBusy] = React.useState<string | null>(null);
  const run = React.useCallback(
    async <T,>(action: AdminAction, call: () => Promise<T>, opts: { done?: string | ((r: T) => string); tag?: string } = {}): Promise<T | undefined> =>
      guarded(role, action, async () => {
        setBusy(opts.tag ?? action);
        try {
          const r = await call();
          haptic.success();
          const line = typeof opts.done === "function" ? opts.done(r) : opts.done;
          if (line) toast.show(line);
          void qc.invalidateQueries({ queryKey: ["admin"] });
          return r;
        } catch (e) {
          haptic.warn();
          toast.show(messageOf(e));
          return undefined;
        } finally {
          setBusy(null);
        }
      }),
    [qc, role],
  );
  return { run, busy };
}

/** Pull to refresh on an admin screen: everything admin is fetched again. */
export function useRefreshAdmin() {
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const refresh = React.useCallback(() => {
    setRefreshing(true);
    void qc.invalidateQueries({ queryKey: ["admin"] }).finally(() => setRefreshing(false));
  }, [qc]);
  return { refresh, refreshing };
}
