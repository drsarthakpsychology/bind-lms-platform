import "server-only";
import { isHiddenAccount } from "@/lib/people/hidden";
import { createAdminClient } from "@/lib/supabase/server";
import type { CohortRow } from "./access";

export type CohortSummary = CohortRow & { members: number; lectures: number; detailsDone: number };

export type LessonLite = { id: string; title: string; week: number | null; order_index: number; status: string | null; course_id: string; course_title: string };

export type MemberRow = {
  userId: string;
  email: string;
  name: string | null;
  scope: string;
  status: string;
  signedIn: boolean;
  setUp: boolean;
  detailsDone: boolean;
  addedAt: string;
};

/** Every cohort with its member, lecture and details-filled counts. */
export async function loadCohortSummaries(): Promise<{ cohorts: CohortSummary[]; unassigned: number; tablesMissing: boolean }> {
  const admin = createAdminClient();
  const [{ data: cohorts, error }, { data: allMembers }, { data: links }, { data: details }, { data: students }] = await Promise.all([
    admin.from("cohorts").select("id, name, course_id, starts_on, ends_on, status, created_at").order("created_at", { ascending: true }),
    admin.from("cohort_members").select("cohort_id, user_id").limit(20000),
    admin.from("lesson_cohorts").select("cohort_id").limit(20000),
    admin.from("student_details").select("user_id, confirmed_at").limit(20000),
    admin.from("profiles").select("id, email, is_test").eq("role", "student").limit(20000),
  ]);
  if (error) return { cohorts: [], unassigned: 0, tablesMissing: true };
  const done = new Set((details ?? []).filter((d) => d.confirmed_at).map((d) => d.user_id as string));
  const real = new Set((students ?? []).filter((s) => !isHiddenAccount(s)).map((s) => s.id as string));
  const members = (allMembers ?? []).filter((m) => real.has(m.user_id as string));
  const assigned = new Set((members ?? []).map((m) => m.user_id as string));
  return {
    tablesMissing: false,
    unassigned: [...real].filter((id) => !assigned.has(id)).length,
    cohorts: (cohorts ?? []).map((c) => {
      const mine = (members ?? []).filter((m) => m.cohort_id === c.id);
      return {
        ...(c as CohortRow),
        members: mine.length,
        detailsDone: mine.filter((m) => done.has(m.user_id as string)).length,
        lectures: (links ?? []).filter((l) => l.cohort_id === c.id).length,
      };
    }),
  };
}

/** All lectures, newest course last, in teaching order. */
export async function loadAllLessons(): Promise<LessonLite[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("lessons")
    .select("id, title, week, order_index, status, course_id, courses(title)")
    .order("order_index", { ascending: true })
    .limit(2000);
  return (data ?? []).map((l) => {
    const c = (Array.isArray(l.courses) ? l.courses[0] : l.courses) as { title?: string } | null;
    return {
      id: l.id as string,
      title: l.title as string,
      week: (l.week as number | null) ?? null,
      order_index: (l.order_index as number) ?? 0,
      status: (l.status as string | null) ?? null,
      course_id: l.course_id as string,
      course_title: c?.title ?? "Course",
    };
  });
}

/** One cohort: its row, members and the lecture ids shared with it. */
export async function loadCohort(id: string) {
  const admin = createAdminClient();
  const { data: cohort } = await admin.from("cohorts").select("id, name, course_id, starts_on, ends_on, status, created_at").eq("id", id).maybeSingle();
  if (!cohort) return null;
  const [{ data: members }, { data: links }] = await Promise.all([
    admin.from("cohort_members").select("user_id, added_at").eq("cohort_id", id).limit(5000),
    admin.from("lesson_cohorts").select("lesson_id").eq("cohort_id", id).limit(5000),
  ]);
  const ids = (members ?? []).map((m) => m.user_id as string);
  const emptyRes = { data: [] as Record<string, unknown>[] };
  const [{ data: profiles }, { data: details }] = ids.length
    ? await Promise.all([
        admin.from("profiles").select("id, email, name, scope, status, active_session_token, is_test").in("id", ids),
        admin.from("student_details").select("user_id, confirmed_at").in("user_id", ids),
      ])
    : [emptyRes, emptyRes];
  const emails = (profiles ?? []).map((p) => String(p.email ?? ""));
  const { data: invites } = emails.length ? await admin.from("credential_invites").select("email, setup_completed_at").in("email", emails) : emptyRes;
  const setUp = new Set((invites ?? []).filter((i) => i.setup_completed_at).map((i) => String(i.email)));
  const done = new Set((details ?? []).filter((d) => d.confirmed_at).map((d) => String(d.user_id)));
  const byId = new Map((profiles ?? []).map((p) => [String(p.id), p]));
  const hiddenIds = new Set((profiles ?? []).filter((p) => isHiddenAccount(p as { email?: string; is_test?: boolean })).map((p) => String(p.id)));
  const rows: MemberRow[] = (members ?? [])
    .filter((m) => !hiddenIds.has(m.user_id as string))
    .map((m) => {
      const p = byId.get(m.user_id as string);
      const email = String(p?.email ?? "");
      return {
        userId: m.user_id as string,
        email,
        name: (p?.name as string | null) ?? null,
        scope: String(p?.scope ?? "full"),
        status: String(p?.status ?? "active"),
        signedIn: Boolean(p?.active_session_token),
        setUp: setUp.has(email) || Boolean(p?.active_session_token),
        detailsDone: done.has(m.user_id as string),
        addedAt: m.added_at as string,
      };
    })
    .sort((a, b) => a.email.localeCompare(b.email));
  return { cohort: cohort as CohortRow, members: rows, lessonIds: new Set((links ?? []).map((l) => l.lesson_id as string)) };
}

/** One person's access and details, for the admin "access" page. */
export async function loadPersonAccess(userId: string) {
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("id, email, name, role, scope, status, mobile_number, created_at").eq("id", userId).maybeSingle();
  if (!profile) return null;
  const [{ data: members }, { data: grants }, { data: details }] = await Promise.all([
    admin.from("cohort_members").select("cohort_id").eq("user_id", userId),
    admin.from("lesson_grants").select("lesson_id").eq("user_id", userId),
    admin.from("student_details").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  return {
    profile,
    cohortIds: new Set((members ?? []).map((m) => m.cohort_id as string)),
    grantIds: new Set((grants ?? []).map((g) => g.lesson_id as string)),
    details: details as Record<string, string | null> | null,
  };
}
