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
import { anyoneResultFrom, arr, badgesFrom, behindFrom, certListFrom, certTypesFrom, cohortFrom, cohortsFrom, drawingFrom, emailReportFrom, enquiriesFrom, formFrom, formsFrom, inboxFrom, issueResultFrom, newKeyFrom, num, obj, peopleFrom, personPageFrom, previewFrom, pushPrefsFrom, safeActivity, safeDoubt, safeDoubts, safeHome, safeMessages, safeStudent, safeStudentList, signOffsFrom, studentMessagesFrom, studioFrom, studioSettingsFrom, submissionsFrom, systemFrom } from "./safe";

/** Admin server data. Every key starts with "admin" so one call refreshes it all after an action. */
const k = keys.admin;
const enc = encodeURIComponent;
const get = (path: string, query?: Record<string, string | number | undefined>) => api.get<unknown>(path, query ? { query } : undefined);

export const useAdminHome = () => useQuery({ queryKey: k("home3"), queryFn: async () => safeHome(await get("/admin/home")) });
export const useStudents = (q: { search?: string; cohort?: string; flag?: string } = {}) =>
  useQuery({ queryKey: k("students3", JSON.stringify(q)), queryFn: async () => safeStudentList(await get("/admin/students", { search: q.search, cohort: q.cohort, flag: q.flag, limit: 200 })), placeholderData: (prev) => prev });
export const useStudentProfile = (id: string) => useQuery({ queryKey: k("profile3", id), queryFn: async () => safeStudent(await get(`/admin/students/${enc(id)}`)), enabled: id.length > 0 });
export const useStudentCredentials = (id: string) => useQuery({ queryKey: k("student-creds", id), queryFn: async () => certListFrom(await get("/admin/certificates/issued", { student: id, limit: 100 })), enabled: id.length > 0 });
export const useStudentMessages = (id: string) => useQuery({ queryKey: k("student-msgs", id), queryFn: async () => studentMessagesFrom(await get(`/admin/students/${enc(id)}/messages`)), enabled: id.length > 0 });
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
export const useSignOffs = () => useQuery({ queryKey: k("signoffs"), queryFn: async () => signOffsFrom(await get("/admin/review/signoffs")) });

export const useCohorts = () => useQuery({ queryKey: k("cohorts4"), queryFn: async () => cohortsFrom(await get("/admin/cohorts")) });
export const useCohort = (id: string) => useQuery({ queryKey: k("cohort4", id), queryFn: async () => cohortFrom(await get(`/admin/cohorts/${enc(id)}`), id), enabled: id.length > 0 });

/** The pipeline: the server picks the quick view and counts each one. */
export const usePeople = (view: X.PeopleView = "all", q = "") =>
  useQuery({ queryKey: k("people3", `${view}:${q}`), queryFn: async () => peopleFrom(await get("/admin/people", { view, q: q || undefined, limit: 500 })), placeholderData: (prev) => prev });
/** One person's record with the whole history. */
export const usePerson = (key: string) => useQuery({ queryKey: k("person4", key), queryFn: async () => personPageFrom(await get(`/admin/people/${enc(key)}`)), enabled: key.length > 0 });
export const useEnquiries = () => useQuery({ queryKey: k("enquiries3"), queryFn: async () => enquiriesFrom(peopleFrom(await get("/admin/people", { view: "all", enquiries: 1, limit: 500 }))) });

export const useCertificates = (f: { q?: string; type?: string; status?: string } = {}) => useQuery({ queryKey: k("certificates3", JSON.stringify(f)), queryFn: async () => certListFrom(await get("/admin/certificates/issued", { q: f.q || undefined, type: f.type || undefined, status: f.status || undefined, limit: 200 })), placeholderData: (prev) => prev });
export const useStudioOptions = () => useQuery({ queryKey: k("studio3"), queryFn: async () => studioFrom(await get("/admin/certificates/studio")), staleTime: 10 * 60_000 });
export const useBadges = () => useQuery({ queryKey: k("badges"), queryFn: async () => badgesFrom(await get("/admin/badges")) });
export const useStudioSettings = () => useQuery({ queryKey: k("studio-settings2"), queryFn: async () => studioSettingsFrom(await get("/admin/certificates/settings")) });
export const useCertTypes = () => useQuery({ queryKey: k("cert-types"), queryFn: async () => certTypesFrom(await get("/admin/certificates/types")) });
/** Students who meet a course certificate's rule (checks everyone, so only on request). */
export const useEligible = (typeId: string | null) => useQuery({ queryKey: k("eligible", typeId ?? ""), queryFn: async () => arr<{ id: string; name: string; reason: string }>(obj(await get(`/admin/certificates/types/${enc(typeId ?? "")}/eligible`)).items), enabled: !!typeId, staleTime: 60_000 });
/** The certificate as the student will get it: the server's own drawing, fetched once the wording settles. */
export const useCertDrawing = (body: X.StudioIssueInput | null, showing: number) =>
  useQuery({ queryKey: k("cert-drawing", JSON.stringify([body, showing])), queryFn: async () => drawingFrom(await api.post<unknown>("/admin/certificates/preview", { ...body, showing })), enabled: !!body, placeholderData: (prev) => prev, staleTime: 5 * 60_000 });
export const useForms = () => useQuery({ queryKey: k("forms3"), queryFn: async () => formsFrom(await get("/admin/forms")) });
export const useForm = (id: string, emailed: "" | "yes" | "no" = "") => useQuery({ queryKey: k("form3", `${id}:${emailed}`), queryFn: async () => formFrom(await get(`/admin/forms/${enc(id)}`, { emailed: emailed || undefined, limit: 200 }), id), placeholderData: (prev) => prev });
export const usePushPrefs = () => useQuery({ queryKey: k("push-prefs"), queryFn: async () => pushPrefsFrom(await get("/admin/push-preferences")) });
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
  signOff: (id: string, body: X.SignOffBody) => api.post<A.SignOffResult>(`/admin/review/signoffs/${enc(id)}`, body satisfies A.SignOffBody),
  /** Stage, then the follow-up date and the note when given: the website's three actions. */
  moveStage: async (key: string, body: X.MoveStageBody) => {
    await api.post<A.PersonSaved>(`/admin/people/${enc(key)}/stage`, { stage: body.stage } satisfies A.StageBody);
    if (body.followUpAt !== undefined) await api.post<A.PersonSaved>(`/admin/people/${enc(key)}/follow-up`, { date: body.followUpAt ? body.followUpAt.slice(0, 10) : "" } satisfies A.FollowUpBody);
    if (body.note?.trim()) await api.post<A.PersonSaved>(`/admin/people/${enc(key)}/activity`, { kind: "note", text: body.note.trim() } satisfies A.ActivityBody);
    return { saved: true as const };
  },
  issue: async (body: X.StudioIssueInput, replaces?: string | null) => issueResultFrom(await api.post<unknown>("/admin/certificates/issue", issueBody(body, replaces))),
  preview: async (body: X.StudioIssueInput, showing?: number) => api.post<A.StudioPreview>("/admin/certificates/preview", { ...issueBody(body), showing }),
  revoke: (id: string, reason: string) => api.post<{ revoked: true }>(`/admin/certificates/${enc(id)}/revoke`, { reason } satisfies A.RevokeBody),
  resend: async (id: string, email = true): Promise<X.ResendResult> => ({ sent: obj(await api.post<unknown>(`/admin/certificates/${enc(id)}/resend`, { email } satisfies A.ResendBody)).notified !== false }),
  issueDraft: (id: string) => api.post<A.IssueDraftResult>(`/admin/certificates/${enc(id)}/issue-draft`, {}),
  sendWaitingCertificates: (): Promise<A.SendWaitingResult> => api.post<A.SendWaitingResult>("/admin/certificates/send-waiting", {}),
  certificatePdf: (id: string) => api.get<A.AdminFileLink>(`/admin/certificates/${enc(id)}/pdf`),
  awardBadge: (id: string, userIds: string[]) => api.post<A.AwardBadgeResult>(`/admin/badges/${enc(id)}/award`, { userIds } satisfies A.AwardBadgeBody),
  awardAllBadges: () => api.post<A.AwardAllResult>("/admin/badges/award-all", {}),
  note: (key: string, text: string, kind: A.ActivityBody["kind"] = "note") => api.post<A.PersonSaved>(`/admin/people/${enc(key)}/activity`, { kind, text } satisfies A.ActivityBody),
  invite: async (key: string, name?: string): Promise<X.LoginLinkResult> => {
    const r = obj(await api.post<unknown>(`/admin/people/${enc(key)}/invite`, { name } satisfies A.InviteBody));
    if (r.sent === false) throw new ApiFailure("bad_request", typeof r.reason === "string" && r.reason ? r.reason : "The invitation could not be sent.", 400);
    return { sent: true, emailed: true };
  },
  markPaid: (key: string, paid: boolean, amount?: number | null) => api.post<A.MarkPaidResult>(`/admin/people/${enc(key)}/paid`, { paid, amount: amount ?? null } satisfies A.MarkPaidBody),
  contactPeople: async (body: X.BulkContactBody) => emailReportFrom(await api.post<unknown>("/admin/people/email", { keys: body.keys, subject: body.subject, body: body.text } satisfies A.PeopleEmailBody)),
  whatsappPeople: async (keys: string[], text: string) => arr<A.PeopleWhatsAppResult["links"][number]>(obj(await api.post<unknown>("/admin/people/whatsapp", { keys, text } satisfies A.PeopleWhatsAppBody)).links),
  sendWaitingPeople: () => api.post<A.PeopleSendWaitingResult>("/admin/people/email/send-waiting", {}),
  emailForm: async (id: string, body: X.FormEmailBody) => emailReportFrom(await api.post<unknown>(`/admin/forms/${enc(id)}/email`, { submissionIds: body.ids, subject: body.subject, body: body.text } satisfies A.FormEmailBody)),
  previewFormEmail: async (id: string, submissionId: string, subject: string, text: string) => previewFrom(await api.post<unknown>(`/admin/forms/${enc(id)}/email/preview`, { submissionId, subject, body: text } satisfies A.FormEmailPreviewBody)),
  sendWaitingForm: (id: string) => api.post<A.FormSendWaitingResult>(`/admin/forms/${enc(id)}/email/send-waiting`, {}),
  saveSignatories: async (signatories: X.StudioSignatory[]) => studioSettingsFrom(await api.put<unknown>("/admin/certificates/settings", { signatories: signatories.map((x) => ({ name: x.name, role: x.role, signatureFrom: x.signatureFrom ?? null })) } satisfies A.CertificateSettingsBody)),
  anyonePreview: async (body: X.AnyoneInput) => String(obj(await api.post<unknown>("/admin/certificates/anyone/preview", body)).pdfBase64 ?? ""),
  anyoneIssue: async (body: X.AnyoneInput) => anyoneResultFrom(await api.post<unknown>("/admin/certificates/anyone", body)),
  saveType: (id: string | null, body: X.CertTypeBody) => (id ? api.put<{ id: string }>(`/admin/certificates/types/${enc(id)}`, body) : api.post<{ id: string }>("/admin/certificates/types", body)),
  enableType: (id: string, enabled: boolean) => api.post<{ enabled: boolean }>(`/admin/certificates/types/${enc(id)}/enabled`, { enabled } satisfies A.CertTypeEnabledBody),
  makeDrafts: (id: string, userIds: string[]) => api.post<A.CertDraftsResult>(`/admin/certificates/types/${enc(id)}/drafts`, { userIds } satisfies A.CertDraftsBody),
  pushPrefs: async (body: Partial<X.AdminPushPrefs>) => pushPrefsFrom(await api.put<unknown>("/admin/push-preferences", body)),
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
