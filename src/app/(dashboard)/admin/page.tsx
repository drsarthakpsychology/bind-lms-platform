import { Activity, ArrowRight, BookOpen, Database, Gauge, GraduationCap, Inbox, Mail, MailWarning, PhoneCall, Plus, ToggleLeft, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";
import { Reveal } from "@/components/motion/reveal";
import { needsReview } from "@/lib/review/triage";
import { Button } from "@/components/ui/button";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [
    { data: students },
    { data: courses },
    { data: pendingSubmissions },
    { data: simScores },
    { data: activity },
    { data: allSessionUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("id, email").eq("role", "student"),
    supabase.from("courses").select("id").eq("is_published", true),
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

  const studentIds = new Set((students ?? []).map((s) => s.id));
  const activityByUser = new Map((activity ?? []).map((a) => [a.user_id, a]));

  // How many sim sessions are flagged for a human eye (mirrors /admin/triage).
  const sessionsByStudent = new Map<string, number>();
  for (const s of allSessionUsers ?? []) sessionsByStudent.set(s.user_id, (sessionsByStudent.get(s.user_id) ?? 0) + 1);
  let flaggedSessions = 0;
  for (const s of simScores ?? []) {
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
    const last = activityByUser.get(id)?.last_active_at;
    if (!last) return false;
    const t = new Date(String(last)).getTime();
    return Number.isFinite(t) && (now - t) / DAY < 7;
  }).length;
  const quietCount = [...studentIds].filter((id) => {
    const last = activityByUser.get(id)?.last_active_at;
    if (!last) return false;
    const t = new Date(String(last)).getTime();
    return Number.isFinite(t) && (now - t) / DAY >= 7;
  }).length;

  // Students with no progress at all (never started a lesson) — from the view's
  // started flag (no separate unbounded progress scan).
  const notStarted = (students ?? []).filter((s) => !activityByUser.get(s.id)?.started).length;

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
    adminClient.from("email_sends").select("id", { count: "exact", head: true }).eq("status", "failed"),
  ]);

  const actions = [
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
      href: "/admin/pulse",
      icon: <Users className="size-4" />,
      urgent: quietCount > 0,
    },
    {
      label: "Welcome new students",
      count: notStarted,
      detail: "Signed up but haven't started a course.",
      href: "/admin/students",
      icon: <BookOpen className="size-4" />,
      urgent: notStarted > 0,
    },
  ];

  const totalToDo = actions.reduce((n, a) => n + a.count, 0);
  const shortcuts = [
    { label: "Cohorts", detail: "Add people by email, choose who sees which lectures", href: "/admin/cohorts", icon: <Users className="size-5" /> },
    { label: "People pipeline", detail: "Who you've contacted, who you haven't", href: "/admin/people", icon: <Users className="size-5" /> },
    { label: "What's live", detail: "Switch tools and lessons on or off", href: "/admin/flags", icon: <ToggleLeft className="size-5" /> },
    { label: "Cohort progress", detail: "Who is moving, who is stuck", href: "/admin/pulse", icon: <Activity className="size-5" /> },
    { label: "Mail", detail: "Inbox, sent, and login links", href: "/admin/emails", icon: <Mail className="size-5" /> },
    { label: "Usage & limits", detail: `Storage at ${dbPct}%`, href: "/admin/infra", icon: <Gauge className="size-5" /> },
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
                <Link href="/admin/cohorts">
                  <UserPlus aria-hidden /> Add students
                </Link>
              </Button>
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
          <StatCard label="Students" value={students?.length ?? 0} href="/admin/students" icon={<Users className="size-5" />} accent />
          <StatCard label="Active this week" value={activeThisWeek} href="/admin/pulse" icon={<GraduationCap className="size-5" />} />
          <StatCard label="Not started" value={notStarted} href="/admin/students" icon={<UserPlus className="size-5" />} />
          <StatCard label="Live courses" value={courses?.length ?? 0} href="/admin/courses" icon={<BookOpen className="size-5" />} />
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
            <ul className="divide-y-2 divide-foreground/10">
              {actions.map((a) => (
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

        {/* Shortcuts — the launch controls, always one tap away. */}
        <Reveal delay={0.2}>
          <section aria-label="Shortcuts" className="space-y-3">
            <h2 className="text-h2">Shortcuts</h2>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {shortcuts.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex h-full items-center gap-3 rounded-xl border-2 border-foreground bg-card p-3 transition-[transform,box-shadow,background-color] duration-fast ease-snappy hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-brand text-brand-foreground">
                      {s.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{s.label}</span>
                      <span className="block truncate text-caption opacity-75">{s.detail}</span>
                    </span>
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
