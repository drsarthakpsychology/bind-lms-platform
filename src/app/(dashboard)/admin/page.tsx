import { ArrowRight, BookOpen, Database, GraduationCap, Inbox, Users } from "lucide-react";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";

import { PageHeader } from "@/components/design-system/page-header";
import { StatCard } from "@/components/design-system/stat-card";
import { Reveal } from "@/components/motion/reveal";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [studentsResult, coursesResult, lessonsResult, pendingResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student"),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review"),
    ]);

  // Action items: who's inactive, who's behind, ungraded submissions.
  // "Inactive" is proxied by "has no progress rows at all" (never started),
  // since progress has no updated_at column. Good enough as a first-pass
  // to-do signal; refine when analytics land.
  const [{ data: startedIds }, { data: ungraded }] = await Promise.all([
    supabase
      .from("progress")
      .select("user_id")
      .not("watched_seconds", "is", null),
    supabase
      .from("submissions")
      .select("id, status, profiles(email)")
      .eq("status", "pending_review"),
  ]);
  const startedSet = new Set((startedIds ?? []).map((p) => p.user_id));
  const { data: allStudents } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("role", "student");
  const inactiveStudents = (allStudents ?? []).filter((s) => !startedSet.has(s.id));

  const stats = [
    { label: "Students", value: studentsResult.count ?? 0, href: "/admin/students", icon: <Users className="size-4" />, accent: true },
    { label: "Courses", value: coursesResult.count ?? 0, href: "/admin/courses", icon: <BookOpen className="size-4" /> },
    { label: "Lessons", value: lessonsResult.count ?? 0, href: "/admin/courses", icon: <GraduationCap className="size-4" /> },
    { label: "Pending reviews", value: pendingResult.count ?? 0, href: "/admin/submissions", icon: <Inbox className="size-4" /> },
  ];

  // Infra warning strip — the free-tier headroom is the one silent failure
  // mode that takes the whole cohort down. Surfaced here so it can't be missed.
  const adminClient = createAdminClient();
  const { data: infraData } = await adminClient.rpc("infra_metrics");
  const dbSize = (infraData as { db_size_bytes?: number } | null)?.db_size_bytes ?? 0;
  const DB_LIMIT = 500 * 1024 * 1024;
  const dbPct = dbSize ? Math.round((dbSize / DB_LIMIT) * 100) : 0;

  return (
    <div className="space-y-8">
      <Reveal delay={0.05}>
        <PageHeader
          title="Overview"
          description="A snapshot of your platform at a glance."
        />
      </Reveal>

      {dbPct >= 70 ? (
        <Reveal delay={0.1}>
          <Link href="/admin/infra" className="flex items-center gap-3 rounded-md border-2 border-status-alert-fg/40 bg-status-alert-bg p-3">
            <Database className="size-4 shrink-0 text-status-alert-fg" aria-hidden />
            <span className="text-small font-medium text-status-alert-fg">
              Free-tier database at {dbPct}% of 500 MB — check infrastructure headroom.
            </span>
          </Link>
        </Reveal>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={0.15 + i * 0.05} className="h-full">
            <StatCard
              label={stat.label}
              value={stat.value}
              href={stat.href}
              icon={stat.icon}
              accent={stat.accent}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>

      {/* Action items — a short to-do list, not analytics. Two clear next steps. */}
      <Reveal delay={0.35}>
      <section aria-label="Needs attention" className="space-y-3">
        <h2 className="text-h2">Needs attention</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
            <h3 className="flex items-center gap-2 text-small font-semibold">
              <Users className="size-4 text-link" aria-hidden />
              Not started yet
            </h3>
            <p className="mt-1 text-caption text-muted-foreground">Students with no progress so far.</p>
            <ul className="mt-2 space-y-1 text-small text-muted-foreground">
              {(inactiveStudents ?? []).slice(0, 8).map((s) => (
                <li key={s.id} className="truncate">{s.email ?? "no email"}</li>
              ))}
              {(inactiveStudents ?? []).length === 0 && <li>Everyone has started.</li>}
            </ul>
            <Link href="/admin/students" className="mt-2 inline-flex items-center gap-1 text-caption font-medium text-link">
              View students <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
            <h3 className="flex items-center gap-2 text-small font-semibold">
              <Inbox className="size-4 text-link" aria-hidden />
              Ungraded submissions
            </h3>
            <ul className="mt-2 space-y-1 text-small text-muted-foreground">
              {(ungraded ?? []).slice(0, 8).map((s) => {
                const p = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                return (
                  <li key={s.id} className="truncate">
                    {(p as { email?: string } | null)?.email ?? "student"}
                  </li>
                );
              })}
              {(ungraded ?? []).length === 0 && <li>Nothing pending.</li>}
            </ul>
            <Link href="/admin/submissions" className="mt-2 inline-flex items-center gap-1 text-caption font-medium text-link">
              Review all <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      </Reveal>
    </div>
  );
}
