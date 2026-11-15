import "server-only";
import { loadRoster } from "@/lib/people/roster-data";
import { isBehind } from "@/lib/people/attention";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { loadActivity } from "@/lib/analytics/activity";
import { latest } from "@/lib/people/presence";
import { loadOpenFailures } from "@/lib/email/failed";
import { openComplaintCount } from "@/lib/doubts/data";
import { needsReview } from "@/lib/review/triage";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Admin Home's numbers (moved out of src/app/(dashboard)/admin/page.tsx so
 * the mobile app's admin Home reads the same ones): things to do with their
 * counts, who is on now, cohort cards and the headline numbers. Call it only
 * after the admin check.
 */
export type AdminTodoIcon = "shieldAlert" | "mail" | "phoneCall" | "mailWarning" | "inbox" | "graduationCap" | "users" | "bookOpen" | "keyRound";
export type AdminTodoItem = { label: string; count: number; detail: string; href: string; urgent: boolean; icon: AdminTodoIcon };

export async function loadAdminOverview() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [
    { data: students },
    { data: pendingSubmissions },
    { data: simScores },
    { data: activity },
    { data: allSessionUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("id, email").eq("role", "student"),
    supabase
      .from("submissions")
      .select("id")
      .eq("status", "pending_review"),
    adminClient
      .from("sim_scores")
      .select("session_id, user_id, rubric")
      .order("created_at", { ascending: false })
      .limit(50),
    // Last activity + started flag from the view (one bounded row per student).
    // The old reads of sim_sessions/checkins were unbounded AND sim_sessions
    // has no created_at column, so the query errored and "active/quiet" were
    // wrong. student_last_activity aggregates in the DB (sim ended/started +
    // checkins + journal, plus a started flag from progress).
    adminClient.from("student_last_activity").select("user_id, last_active_at, started"),
    // Session count per student for the triage "first session?" heuristic:
    // user_id only (created_at doesn't exist on sim_sessions).
    supabase.from("sim_sessions").select("user_id"),
  ]);

  // Real students only: test and robot accounts (AI calibration) never count.
  const hidden = await loadHiddenIds();
  const realStudents = (students ?? []).filter((s) => !hidden.has(s.id as string));
  const studentIds = new Set(realStudents.map((s) => s.id));
  // Last moment on VIBHA: page time and lectures (Activity) plus the view.
  const { rows: seenRows } = await loadActivity();
  const seenBy = new Map(seenRows.map((r) => [r.id, r.lastSeen]));
  const activityByUser = new Map((activity ?? []).map((a) => [a.user_id, a]));
  const lastOf = (id: string) => latest(seenBy.get(id), (activityByUser.get(id)?.last_active_at as string | null) ?? null);

  // How many sim sessions are flagged for a human eye (mirrors /admin/triage).
  const sessionsByStudent = new Map<string, number>();
  for (const s of (allSessionUsers ?? []).filter((x) => !hidden.has(x.user_id as string))) sessionsByStudent.set(s.user_id, (sessionsByStudent.get(s.user_id) ?? 0) + 1);
  let flaggedSessions = 0;
  for (const s of (simScores ?? []).filter((x) => !hidden.has(x.user_id as string))) {
    const isFirst = (sessionsByStudent.get(s.user_id) ?? 1) <= 1;
    const rubric = (s.rubric as Record<string, unknown>) ?? {};
    const premature = Number(rubric.premature_reassurance ?? 0);
    if (needsReview({ submissionId: s.session_id, isFirstSession: isFirst, concerning: premature > 2, repeatedFailure: false, aiConfidence: 0.6 })) {
      flaggedSessions++;
    }
  }

  // Last activity per student from the aggregate view → active this week / quiet.
  const now = new Date().getTime();
  const DAY = 86400000;
  const activeThisWeek = [...studentIds].filter((id) => {
    const last = lastOf(id);
    if (!last) return false;
    const t = new Date(String(last)).getTime();
    return Number.isFinite(t) && (now - t) / DAY < 7;
  }).length;
  const quietCount = [...studentIds].filter((id) => {
    const last = lastOf(id);
    if (!last) return false;
    const t = new Date(String(last)).getTime();
    return Number.isFinite(t) && (now - t) / DAY >= 7;
  }).length;

  // Students with no progress at all (never started a lesson), from the view's
  // started flag (no separate unbounded progress scan).
  const notStarted = realStudents.filter((s) => !activityByUser.get(s.id)?.started && !lastOf(s.id)).length;

  // Infra warning strip: the one silent failure that takes the cohort down.
  const { data: infraData } = await adminClient.rpc("infra_metrics");
  const dbSize = (infraData as { db_size_bytes?: number } | null)?.db_size_bytes ?? 0;
  const DB_LIMIT = 500 * 1024 * 1024;
  const dbPct = dbSize ? Math.round((dbSize / DB_LIMIT) * 100) : 0;

  // CRM + mail: follow-ups due today or earlier, unread replies, failed sends.
  const nowIso = new Date().toISOString();
  const [{ count: followUpsDue }, { count: unreadReplies }, { count: failedSends }] = await Promise.all([
    adminClient.from("crm_contacts").select("email", { count: "exact", head: true }).lte("next_follow_up_at", nowIso),
    adminClient.from("email_inbound").select("id", { count: "exact", head: true }).is("read_at", null).is("archived_at", null),
    loadOpenFailures(adminClient).then((rows) => ({ count: rows.length })),
  ]);
  const complaints = await openComplaintCount();

  const actions = [
    {
      label: "Student concerns",
      count: complaints,
      detail: "Private concerns students raised. Reply in the Inbox.",
      href: "/admin/inbox",
      icon: "shieldAlert" as AdminTodoIcon,
      urgent: complaints > 0,
    },
    {
      label: "Reply to emails",
      count: unreadReplies ?? 0,
      detail: "Replies waiting in your inbox.",
      href: "/admin/emails?folder=inbox",
      icon: "mail" as AdminTodoIcon,
      urgent: (unreadReplies ?? 0) > 0,
    },
    {
      label: "Follow up with people",
      count: followUpsDue ?? 0,
      detail: "People you planned to call or message by today.",
      href: "/admin/people?view=follow-up",
      icon: "phoneCall" as AdminTodoIcon,
      urgent: (followUpsDue ?? 0) > 0,
    },
    {
      label: "Retry failed emails",
      count: failedSends ?? 0,
      detail: "Emails that didn't go out.",
      href: "/admin/emails?folder=failed",
      icon: "mailWarning" as AdminTodoIcon,
      urgent: (failedSends ?? 0) > 0,
    },
    {
      label: "Grade submissions",
      count: (pendingSubmissions ?? []).length,
      detail: "Coursework waiting for a grade.",
      href: "/admin/submissions",
      icon: "inbox" as AdminTodoIcon,
      urgent: (pendingSubmissions ?? []).length > 0,
    },
    {
      label: "Review practice sessions",
      count: flaggedSessions,
      detail: "Simulated sessions flagged for your eyes.",
      href: "/admin/triage",
      icon: "graduationCap" as AdminTodoIcon,
      urgent: flaggedSessions > 0,
    },
    {
      label: "Check on quiet students",
      count: quietCount,
      detail: "Quiet for a week or more.",
      href: "/admin/activity?view=behind",
      icon: "users" as AdminTodoIcon,
      urgent: quietCount > 0,
    },
    {
      label: "Welcome new students",
      count: notStarted,
      detail: "Have an account but haven't started.",
      href: "/admin/students?filter=attention",
      icon: "bookOpen" as AdminTodoIcon,
      urgent: notStarted > 0,
    },
  ];

  // Login problems (link expired, email failed, never invited, never came in).
  const roster = await loadRoster();
  const loginTrouble = roster.rows.filter((r) => r.flags.includes("login")).length;
  actions.splice(1, 0, {
    label: "Fix logins",
    count: loginTrouble,
    detail: "Link expired, login email failed, or never invited.",
    href: "/admin/students/logins",
    icon: "keyRound" as AdminTodoIcon,
    urgent: loginTrouble > 0,
  });
  const totalToDo = actions.reduce((n, a) => n + a.count, 0);
  const todo = actions.filter((a) => a.count > 0);
  const onNow = roster.rows.filter((r) => r.presence === "now").length;
  const neverIn = roster.rows.filter((r) => r.account !== "active" && r.account !== "locked").length;
  const cohortCards = roster.cohorts
    .filter((c) => c.status !== "ended")
    .map((c) => {
      const m = roster.rows.filter((r) => r.cohorts.some((x) => x.id === c.id));
      const done = m.reduce((a, r) => a + r.lecturesDone, 0);
      const avail = m.reduce((a, r) => a + r.lecturesAvailable, 0);
      return {
        id: c.id,
        name: c.name,
        members: m.length,
        week: m.filter((r) => r.presence === "now" || r.presence === "today" || r.presence === "week").length,
        behind: m.filter((r) => r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable)).length,
        pct: avail ? Math.round((done / avail) * 100) : 0,
      };
    });
  const live = roster.rows
    .filter((r) => r.presence === "now")
    .map((r) => ({ id: r.id, name: r.name, meta: r.cohorts.length ? r.cohorts.map((c) => c.name).join(", ") : (r.roll ?? "") }));
  return {
    students: realStudents.length,
    activeThisWeek,
    quietCount,
    notStarted,
    neverIn,
    onNow,
    dbPct,
    complaints,
    pendingSubmissions: (pendingSubmissions ?? []).length,
    actions: actions as AdminTodoItem[],
    todo: todo as AdminTodoItem[],
    totalToDo,
    cohortCards,
    live,
    roster,
  };
}
