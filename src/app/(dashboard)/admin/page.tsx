import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { ArrowRight, Bell, BookOpen, Database, GraduationCap, Inbox, KeyRound, Mail, MailWarning, PhoneCall, Plus, ShieldAlert, ToggleLeft, UserPlus, Users } from "lucide-react";
import { loadRoster } from "@/lib/people/roster-data";
import { isBehind } from "@/lib/people/attention";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { loadActivity } from "@/lib/analytics/activity";
import { latest } from "@/lib/people/presence";
import { loadOpenFailures } from "@/lib/email/failed";
import { openComplaintCount } from "@/lib/doubts/data";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";

import { AddPeopleButton } from "@/components/admin/add-people-panel";
import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";
import { Reveal } from "@/components/motion/reveal";
import { needsReview } from "@/lib/review/triage";
import { Button } from "@/components/ui/button";

export default async function AdminOverviewPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
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
    // Session count per student for the triage "first session?" heuristic —
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

  // Students with no progress at all (never started a lesson) — from the view's
  // started flag (no separate unbounded progress scan).
  const notStarted = realStudents.filter((s) => !activityByUser.get(s.id)?.started && !lastOf(s.id)).length;

  // Infra warning strip — the one silent failure that takes the cohort down.
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
      icon: <ShieldAlert className="size-4" />,
      urgent: complaints > 0,
    },
    {
      label: "Reply to emails",
      count: unreadReplies ?? 0,
      detail: "Replies waiting in your inbox.",
      href: "/admin/emails?folder=inbox",
      icon: <Mail className="size-4" />,
      urgent: (unreadReplies ?? 0) > 0,
    },
    {
      label: "Follow up with people",
      count: followUpsDue ?? 0,
      detail: "People you planned to call or message by today.",
      href: "/admin/people?view=follow-up",
      icon: <PhoneCall className="size-4" />,
      urgent: (followUpsDue ?? 0) > 0,
    },
    {
      label: "Retry failed emails",
      count: failedSends ?? 0,
      detail: "Emails that didn't go out.",
      href: "/admin/emails?folder=failed",
      icon: <MailWarning className="size-4" />,
      urgent: (failedSends ?? 0) > 0,
    },
    {
      label: "Grade submissions",
      count: (pendingSubmissions ?? []).length,
      detail: "Coursework waiting for a grade.",
      href: "/admin/submissions",
      icon: <Inbox className="size-4" />,
      urgent: (pendingSubmissions ?? []).length > 0,
    },
    {
      label: "Review practice sessions",
      count: flaggedSessions,
      detail: "Simulated sessions flagged for your eyes.",
      href: "/admin/triage",
      icon: <GraduationCap className="size-4" />,
      urgent: flaggedSessions > 0,
    },
    {
      label: "Check on quiet students",
      count: quietCount,
      detail: "Quiet for a week or more.",
      href: "/admin/activity?view=behind",
      icon: <Users className="size-4" />,
      urgent: quietCount > 0,
    },
    {
      label: "Welcome new students",
      count: notStarted,
      detail: "Have an account but haven't started.",
      href: "/admin/students?filter=attention",
      icon: <BookOpen className="size-4" />,
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
    icon: <KeyRound className="size-4" />,
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
  const shortcuts = [
    { label: "Students", href: "/admin/students", icon: <Users className="size-4" /> },
    { label: "Messages", href: "/admin/emails", icon: <Mail className="size-4" /> },
    { label: "Courses", href: "/admin/courses", icon: <BookOpen className="size-4" /> },
    { label: "What's live", href: "/admin/flags", icon: <ToggleLeft className="size-4" /> },
    { label: "Pipeline", href: "/admin/people", icon: <PhoneCall className="size-4" /> },
    { label: `Usage · ${dbPct}%`, href: "/admin/infra", icon: <Database className="size-4" /> },
  ];

  return (
    <div className="space-y-8">
      <Reveal delay={0.05}>
        <PageHeader
          eyebrow="Admin"
          title="Overview"
          description={
            totalToDo > 0
              ? `${totalToDo} thing${totalToDo === 1 ? "" : "s"} need${totalToDo === 1 ? "s" : ""} you today.`
              : "All clear. Nothing needs you right now."
          }
          actions={
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/emails?folder=notify">
                  <Bell aria-hidden /> Message
                </Link>
              </Button>
              <AddPeopleButton variant="outline" label="Add people" />
              <Button asChild size="sm">
                <Link href="/admin/courses">
                  <Plus aria-hidden /> New course
                </Link>
              </Button>
            </>
          }
        />
      </Reveal>

      {dbPct >= 70 ? (
        <Reveal delay={0.1}>
          <Link
            href="/admin/infra"
            className="flex items-center gap-3 rounded-xl border-2 border-destructive bg-status-alert-bg p-3 font-semibold text-status-alert-fg"
          >
            <Database className="size-5 shrink-0" aria-hidden />
            <span className="text-small">Storage at {dbPct}% of the free limit. Check Usage &amp; limits.</span>
          </Link>
        </Reveal>
      ) : null}

      {/* Numbers first — the four people ask about. */}
      <Reveal delay={0.1}>
        <section aria-label="Programme snapshot" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Students" value={realStudents.length} href="/admin/students" icon={<Users className="size-5" />} accent />
          <StatCard label="On VIBHA now" value={onNow} href="/admin/activity" icon={<GraduationCap className="size-5" />} />
          <StatCard label="Active this week" value={activeThisWeek} href="/admin/activity?view=cohorts" icon={<BookOpen className="size-5" />} />
          <StatCard label="Never signed in" value={neverIn} href="/admin/students/logins" icon={<UserPlus className="size-5" />} />
        </section>
      </Reveal>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* The to-do queue — count first, one tap away (an inbox, not a wall). */}
        <Reveal delay={0.15}>
          <section aria-label="Needs attention" className="overflow-hidden rounded-2xl border-2 border-foreground bg-card hard-shadow-sm">
            <h2 className="flex items-center justify-between gap-3 border-b-2 border-foreground px-4 py-3 text-h2">
              Needs you
              <span className="rounded-full border-2 border-foreground bg-primary px-2.5 py-0.5 font-pix text-xs text-primary-foreground">
                {totalToDo}
              </span>
            </h2>
            {!todo.length ? <p className="px-4 py-6 text-sm font-semibold text-muted-foreground">All clear. Nothing needs you right now.</p> : null}
            <ul className="divide-y-2 divide-foreground/10">
              {todo.map((a) => (
                <li key={a.label}>
                  <Link
                    href={a.href}
                    className="group flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 font-pix text-sm ${
                        a.count > 0
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-foreground/20 bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.count > 0 ? a.count : a.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">{a.label}</span>
                      <span className="block truncate text-caption text-muted-foreground">
                        {a.count > 0 ? a.detail : "Nothing waiting."}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast group-hover:translate-x-1 group-hover:text-foreground"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Cohorts at a glance + the most-used places. */}
        <Reveal delay={0.2}>
          <section aria-label="Cohorts" className="space-y-3">
            <h2 className="flex items-center justify-between gap-2 text-h2">
              Cohorts
              <Link href="/admin/activity?view=cohorts" className="text-sm font-bold text-link underline-offset-4 hover:underline">Compare</Link>
            </h2>
            {cohortCards.length ? (
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {cohortCards.map((c) => (
                  <li key={c.id}>
                    <Link href={`/admin/cohorts/${c.id}`} className="block rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-bold">{c.name}</span>
                        <span className="shrink-0 text-caption text-muted-foreground">{c.members} students</span>
                      </span>
                      <span className="mt-2 block h-2 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full bg-link" style={{ width: `${c.pct}%` }} /></span>
                      <span className="mt-2 flex flex-wrap gap-x-3 text-caption text-muted-foreground">
                        <span><b className="text-foreground">{c.pct}%</b> lectures finished</span>
                        <span><b className="text-foreground">{c.week}</b> active this week</span>
                        {c.behind ? <span><b className="text-status-pending-fg">{c.behind}</b> behind</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-4 text-sm text-muted-foreground">No running cohorts. <Link href="/admin/cohorts" className="font-bold underline">Make one</Link>.</p>
            )}
            <ul className="grid grid-cols-2 gap-2 pt-2">
              {shortcuts.map((sc) => (
                <li key={sc.href}>
                  <Link href={sc.href} className="flex h-full items-center gap-2 rounded-xl border-2 border-foreground/20 bg-card p-2.5 text-sm font-bold hover:border-foreground">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground">{sc.icon}</span>
                    <span className="min-w-0 truncate">{sc.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
