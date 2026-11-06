import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { ArrowRight, UserPlus, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { loadCohortSummaries } from "@/lib/cohorts/admin-data";
import { PageHeader } from "@/components/design-system/page-header";
import { NewCohortForm } from "@/components/admin/cohorts-ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cohorts" };

const STATUS: Record<string, { label: string; cls: string }> = {
  upcoming: { label: "Upcoming", cls: "bg-card" },
  active: { label: "Running", cls: "bg-primary text-primary-foreground" },
  ended: { label: "Finished", cls: "bg-muted text-muted-foreground" },
};

/**
 * Cohorts: who is in which batch, and which lectures each batch can watch.
 * Add people here by pasting emails; they get an account and a login link.
 */
export default async function CohortsPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const admin = createAdminClient();
  const [{ cohorts, unassigned, tablesMissing }, { data: courses }] = await Promise.all([
    loadCohortSummaries(),
    admin.from("courses").select("id, title").order("title"),
  ]);

  if (tablesMissing) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="People" title="Cohorts" description="Group students into batches and choose which lectures each batch can watch." />
        <p className="rounded-2xl border-2 border-foreground bg-card p-5 text-sm">
          The cohort tables aren&apos;t in the database yet. Run <code className="font-mono">2026_11_cohorts.sql</code> on Supabase, then reload this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Cohorts"
        description="Group students into batches and choose which lectures each batch can watch. Everyone keeps the rest of the platform."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <section aria-labelledby="all-cohorts" className="min-w-0 space-y-3">
          <h2 id="all-cohorts" className="flex items-center gap-2 text-h2">
            <Users className="size-5" aria-hidden /> All cohorts
          </h2>
          {unassigned ? (
            <p className="rounded-xl border-2 border-dashed border-foreground px-4 py-3 text-sm">
              <span className="font-bold">{unassigned}</span> {unassigned === 1 ? "student isn't" : "students aren't"} in any cohort yet. They keep the old access until you add them to one.
            </p>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-2">
            {cohorts.map((c) => {
              const s = STATUS[c.status] ?? STATUS.upcoming;
              return (
                <li key={c.id}>
                  <Link href={`/admin/cohorts/${c.id}`} className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-lg font-bold leading-tight">{c.name}</span>
                      <span className={cn("rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-semibold", s.cls)}>{s.label}</span>
                    </span>
                    {c.course_id ? (
                      <span className="text-xs font-semibold text-link">Course: {(courses ?? []).find((x) => x.id === c.course_id)?.title ?? "a course"}</span>
                    ) : null}
                    <span className="grid grid-cols-3 gap-2 text-center">
                      {[
                        [c.members, "people"],
                        [c.lectures, "lectures"],
                        [c.members ? `${Math.round((c.detailsDone / c.members) * 100)}%` : "0%", "details in"],
                      ].map(([n, l]) => (
                        <span key={String(l)} className="rounded-xl bg-background py-2">
                          <span className="block text-xl font-bold tabular-nums">{n}</span>
                          <span className="text-caption text-muted-foreground">{l}</span>
                        </span>
                      ))}
                    </span>
                    <span className="mt-auto flex items-center justify-between text-caption text-muted-foreground">
                      {c.starts_on ? `Starts ${new Date(c.starts_on).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "No start date"}
                      <ArrowRight className="size-4 text-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
            {!cohorts.length ? <li className="text-sm text-muted-foreground">No cohorts yet. Create the first one.</li> : null}
          </ul>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <Link href="/admin/students/add" className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-primary p-4 font-bold text-primary-foreground hard-shadow-sm">
            <UserPlus className="size-5" aria-hidden /> Add people to a cohort
          </Link>
          <section className="rounded-2xl border-2 border-foreground bg-card p-4">
            <h2 className="text-base font-bold">New cohort</h2>
            <div className="mt-3">
              <NewCohortForm courses={(courses ?? []).map((c) => ({ id: c.id as string, title: c.title as string }))} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
