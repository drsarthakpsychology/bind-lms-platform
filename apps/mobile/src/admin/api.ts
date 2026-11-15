import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import type * as C from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys } from "@/api/queries";
import { api } from "@/auth";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import type * as A from "./contract";
import type * as X from "./extra";
import { guarded, useAdminRole, type AdminAction } from "./role";

/** Admin server data. Every key starts with "admin" so one call refreshes it all after an action. */
const k = keys.admin;

export const useAdminHome = () => useQuery({ queryKey: k("home2"), queryFn: () => api.get<A.AdminHome>("/admin/home") });
export const useStudents = (q: { search?: string; cohort?: string; flag?: string } = {}) =>
  useQuery({ queryKey: k("students2", JSON.stringify(q)), queryFn: () => api.get<A.AdminStudentList>("/admin/students", { query: { search: q.search, cohort: q.cohort, flag: q.flag, limit: 200 } }), placeholderData: (prev) => prev });
export const useStudentProfile = (id: string) => useQuery({ queryKey: k("profile", id), queryFn: () => api.get<A.AdminStudentProfile>(`/admin/students/${encodeURIComponent(id)}`), enabled: id.length > 0 });
export const useStudentCredentials = (id: string) => useQuery({ queryKey: k("student-creds", id), queryFn: () => api.get<{ items: X.CertRow[] }>(`/admin/students/${encodeURIComponent(id)}/credentials`), enabled: id.length > 0 });
export const useStudentMessages = (id: string) => useQuery({ queryKey: k("student-msgs", id), queryFn: () => api.get<{ items: X.StudentMessage[] }>(`/admin/students/${encodeURIComponent(id)}/messages`), enabled: id.length > 0 });
export const useStudentDoubts = (id: string) => useQuery({ queryKey: k("student-doubts", id), queryFn: () => api.get<C.DoubtList>("/admin/doubts", { query: { student: id, limit: 50 } }), enabled: id.length > 0 });

export const useActivity = () => useQuery({ queryKey: k("activity2"), queryFn: () => api.get<A.PlayResult<A.ActivityData>>("/admin/activity") });
export const useBehind = (cohort: string) => useQuery({ queryKey: k("behind", cohort), queryFn: () => api.get<X.BehindList>("/admin/activity/behind", { query: { cohort } }), placeholderData: (prev) => prev });

export const useBatches = () => useQuery({ queryKey: k("batches"), queryFn: () => api.get<A.MessageBatches>("/admin/messages") });
export const useInbox = () => useQuery({ queryKey: k("inbox"), queryFn: () => api.get<X.InboxList>("/admin/inbox") });
export const useInboxThread = (id: string) => useQuery({ queryKey: k("inbox-thread", id), queryFn: () => api.get<X.InboxThread>(`/admin/inbox/${encodeURIComponent(id)}`) });

export const useAdminDoubts = (kind: "" | "doubt" | "complaint") => useQuery({ queryKey: k("doubts", kind), queryFn: () => api.get<C.DoubtList>("/admin/doubts", { query: { kind: kind || undefined, limit: 100 } }) });
export const useAdminDoubt = (id: string) => useQuery({ queryKey: k("doubt", id), queryFn: () => api.get<C.DoubtThread>(`/doubts/${encodeURIComponent(id)}`) });

export const useSubmissions = (status: "pending" | "graded" | "") => useQuery({ queryKey: k("submissions", status), queryFn: () => api.get<X.SubmissionList>("/admin/review/submissions", { query: { status: status || undefined } }) });
export const useSignOffs = () => useQuery({ queryKey: k("signoffs"), queryFn: () => api.get<X.SignOffList>("/admin/review/signoffs") });

export const useCohorts = () => useQuery({ queryKey: k("cohorts"), queryFn: () => api.get<X.CohortList>("/admin/cohorts") });
export const useCohort = (id: string) => useQuery({ queryKey: k("cohort", id), queryFn: () => api.get<X.CohortDetail>(`/admin/cohorts/${encodeURIComponent(id)}`) });

export const usePeople = () => useQuery({ queryKey: k("people"), queryFn: () => api.get<X.PeopleList>("/admin/people") });
export const usePerson = (key: string) => useQuery({ queryKey: k("person", key), queryFn: () => api.get<X.PersonDetail>(`/admin/people/${encodeURIComponent(key)}`) });
export const useEnquiries = () => useQuery({ queryKey: k("enquiries"), queryFn: () => api.get<X.EnquiryList>("/admin/enquiries") });

export const useCertificates = () => useQuery({ queryKey: k("certificates"), queryFn: () => api.get<X.CertificateList>("/admin/certificates") });
export const useStudioOptions = () => useQuery({ queryKey: k("studio-options"), queryFn: () => api.get<X.StudioOptions>("/admin/certificates/options"), staleTime: 10 * 60_000 });
export const useCertTypes = () => useQuery({ queryKey: k("cert-types"), queryFn: () => api.get<X.CertTypeList>("/admin/certificates/types") });
export const useStudioSettings = () => useQuery({ queryKey: k("studio-settings"), queryFn: () => api.get<X.StudioSettings>("/admin/certificates/settings") });
export const useForms = () => useQuery({ queryKey: k("forms"), queryFn: () => api.get<X.FormList>("/admin/forms") });
export const useForm = (id: string) => useQuery({ queryKey: k("form", id), queryFn: () => api.get<X.FormDetail>(`/admin/forms/${encodeURIComponent(id)}`) });
export const usePushPrefs = () => useQuery({ queryKey: k("push-prefs"), queryFn: () => api.get<X.AdminPushPrefs>("/admin/push-preferences") });

/** Every write the admin screens make, in one place. */
export const adminCalls = {
  lock: (id: string, reason?: string) => api.post<A.LockResult>(`/admin/students/${encodeURIComponent(id)}/lock`, { reason } satisfies A.LockBody),
  unlock: (id: string) => api.post<A.LockResult>(`/admin/students/${encodeURIComponent(id)}/unlock`, {}),
  loginLink: (id: string) => api.post<X.LoginLinkResult>(`/admin/students/${encodeURIComponent(id)}/login-link`, {}),
  allowPhoneChange: (userId: string) => api.post<C.AllowDeviceChangeResult>("/admin/devices/allow-change", { userId } satisfies C.AllowDeviceChangeBody),
  send: (body: A.SendMessageBody) => api.post<A.SendMessageResult>("/admin/messages", body),
  replyInbox: (id: string, text: string) => api.post<X.InboxThread>(`/admin/inbox/${encodeURIComponent(id)}/reply`, { text } satisfies X.InboxReplyBody),
  answerDoubt: (id: string, body: string) => api.post<C.DoubtActionResult>(`/doubts/${encodeURIComponent(id)}/replies`, { body } satisfies C.ReplyBody),
  hideDoubt: (id: string, hidden: boolean) => api.post<{ hidden: boolean }>(`/admin/doubts/${encodeURIComponent(id)}/hide`, { hidden } satisfies A.HideBody),
  grade: (id: string, body: X.GradeBody) => api.post<X.Submission>(`/admin/review/submissions/${encodeURIComponent(id)}/grade`, body),
  signOff: (id: string, body: X.SignOffBody) => api.post<X.SignOff>(`/admin/review/signoffs/${encodeURIComponent(id)}`, body),
  moveStage: (key: string, body: X.MoveStageBody) => api.post<X.PersonDetail>(`/admin/people/${encodeURIComponent(key)}/stage`, body),
  issue: (body: X.StudioIssueInput) => api.post<X.IssueResult>("/admin/certificates", body),
  revoke: (id: string, reason: string) => api.post<X.CertRow>(`/admin/certificates/${encodeURIComponent(id)}/revoke`, { reason } satisfies X.RevokeBody),
  resend: (id: string) => api.post<X.ResendResult>(`/admin/certificates/${encodeURIComponent(id)}/resend`, {}),
  note: (key: string, text: string) => api.post<X.PersonDetail>(`/admin/people/${encodeURIComponent(key)}/note`, { text } satisfies X.NoteBody),
  invite: (key: string) => api.post<X.LoginLinkResult>(`/admin/people/${encodeURIComponent(key)}/invite`, {}),
  markPaid: (key: string, paid: boolean) => api.post<X.PersonDetail>(`/admin/people/${encodeURIComponent(key)}/paid`, { paid } satisfies X.PaidBody),
  contactPeople: (body: X.BulkContactBody) => api.post<X.BulkContactResult>("/admin/people/contact", body),
  emailForm: (id: string, body: X.FormEmailBody) => api.post<X.BulkContactResult>(`/admin/forms/${encodeURIComponent(id)}/email`, body),
  reissue: (id: string) => api.post<X.CertRow>(`/admin/certificates/${encodeURIComponent(id)}/reissue`, {}),
  studioSettings: (body: Partial<X.StudioSettings>) => api.put<X.StudioSettings>("/admin/certificates/settings", body),
  pushPrefs: (body: Partial<X.AdminPushPrefs>) => api.put<X.AdminPushPrefs>("/admin/push-preferences", body),
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
