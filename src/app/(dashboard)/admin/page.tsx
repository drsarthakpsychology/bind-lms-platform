import { ArrowRight, BookOpen, Database, GraduationCap, Inbox, Users } from "lucide-react";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";
import { Reveal } from "@/components/motion/reveal";
import { needsReview } from "@/lib/review/triage";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const [
    { data: students },
    { data: courses },
    { data: pendingSubmissions },
    { data: simScores },
    { data: allSessions },
    { data: allCheckins },
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
    supabase.from("sim_sessions").select("user_id, created_at"),
    supabase.from("checkins").select("user_id, created_at"),
  ]);

  const studentIds = new Set((students ?? []).map((s) => s.id));

  // How many sim sessions are flagged for a human eye (mirrors /admin/triage).
  const sessionsByStudent = new Map<string, number>();
  for (const s of allSessions ?? []) sessionsByStudent.set(s.user_id, (sessionsByStudent.get(s.user_id) ?? 0) + 1);
  let flaggedSessions = 0;
  for (const s of simScores ?? []) {
    const isFirst = (sessionsByStudent.get(s.user_id) ?? 1) <= 1;
    const rubric = (s.rubric as Record<string, unknown>) ?? {};
    const premature = Number(rubric.premature_reassurance ?? 0);
    if (needsReview({ submissionId: s.session_id, isFirstSession: isFirst, concerning: premature > 2, repeatedFailure: false, aiConfidence: 0.6 })) {
      flaggedSessions++;
    }
  }

  // Last activity per student from sessions + check-ins → active this week / quiet.
  const lastActivity = new Map<string, number>();
  for (const s of allSessions ?? []) {
    const t = new Date(s.created_at).getTime();
    if (Number.isFinite(t) && (!lastActivity.has(s.user_id) || t > lastActivity.get(s.user_id)!)) lastActivity.set(s.user_id, t);
  }
  for (const c of allCheckins ?? []) {
    const t = new Date(c.created_at).getTime();
    if (Number.isFinite(t) && (!lastActivity.has(c.user_id) || t > lastActivity.get(c.user_id)!)) lastActivity.set(c.user_id, t);
  }
  const now = new Date().getTime();
  const DAY = 86400000;
  const activeThisWeek = [...studentIds].filter((id) => {
    const last = lastActivity.get(id);
    return last !== undefined && (now - last) / DAY < 7;
  }).length;
  const quietCount = [...studentIds].filter((id) => {
    const last = lastActivity.get(id);
    return last !== undefined && (now - last) / DAY >= 7;
  }).length;

  // Students with no progress at all (never started a lesson).
  const [{ data: startedIds }] = await Promise.all([
    supabase.from("progress").select("user_id").not("watched_seconds", "is", null),
  ]);
  const startedSet = new Set((startedIds ?? []).map((p) => p.user_id));
  const notStarted = (students ?? []).filter((s) => !startedSet.has(s.id)).length;

  // Infra warning strip — the one silent failure that takes the cohort down.
  const { data: infraData } = await adminClient.rpc("infra_metrics");
  const dbSize = (infraData as { db_size_bytes?: number } | null)?.db_size_bytes ?? 0;
  const DB_LIMIT = 500 * 1024 * 1024;
  const dbPct = dbSize ? Math.round((dbSize / DB_LIMIT) * 100) : 0;

  const actions = [
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

  return (
    <div className="space-y-8">
      <Reveal delay={0.05}>
        <PageHeader
          title="Overview"
          description="What needs you today, then how the programme is going."
        />
      </Reveal>

      {dbPct >= 70 ? (
        <Reveal delay={0.1}>
          <Link href="/admin/infra" className="flex items-center gap-3 rounded-md border-2 border-status-alert-fg/40 bg-status-alert-bg p-3">
            <Database className="size-4 shrink-0 text-status-alert-fg" aria-hidden />
            <span className="text-small font-medium text-status-alert-fg">
              Storage at {dbPct}% of the free limit — check Usage &amp; limits.
            </span>
          </Link>
        </Reveal>
      ) : null}

      {/* What needs you — the daily work, count first, one tap away. */}
      <Reveal delay={0.15}>
      <section aria-label="Needs attention" className="space-y-3">
        <h2 className="text-h2">Needs attention</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="group flex items-center gap-3 rounded-md border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-md border-2 ${a.count > 0 ? "border-foreground bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground"}`}>
                {a.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-small font-semibold">
                  {a.label}{a.count > 0 ? ` · ${a.count}` : ""}
                </span>
                <span className="block truncate text-caption text-muted-foreground">{a.detail}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </div>
        {actions.every((a) => a.count === 0) ? (
          <p className="text-caption text-muted-foreground">
            Nothing needs you right now. Come back after the next submission window.
          </p>
        ) : null}
      </section>
      </Reveal>

      {/* Programme snapshot — a few honest numbers, not a dashboard wall. */}
      <Reveal delay={0.25}>
      <section aria-label="Programme snapshot" className="space-y-3">
        <h2 className="text-h2">Programme</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Students" value={students?.length ?? 0} href="/admin/students" icon={<Users className="size-4" />} accent />
          <StatCard label="Active this week" value={activeThisWeek} icon={<GraduationCap className="size-4" />} />
          <StatCard label="Courses" value={courses?.length ?? 0} href="/admin/courses" icon={<BookOpen className="size-4" />} />
        </div>
      </section>
      </Reveal>
    </div>
  );
}
