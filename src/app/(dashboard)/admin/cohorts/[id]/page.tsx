import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { ChevronLeft } from "lucide-react";
import { loadAllLessons, loadCohort, loadCohortSummaries } from "@/lib/cohorts/admin-data";
import { AddPeopleForm, CohortSettings, LessonSharing, MemberActions } from "@/components/admin/cohorts-ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Pill = ({ on, yes, no }: { on: boolean; yes: string; no: string }) => (
  <span className={cn("rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold", on ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 text-muted-foreground")}>{on ? yes : no}</span>
);

/** One cohort: settings, its people, and which lectures it can watch. */
export default async function CohortPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const { id } = await params;
  const { tab } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [data, lessons, { cohorts }] = await Promise.all([loadCohort(id), loadAllLessons(), loadCohortSummaries()]);
  if (!data) notFound();
  const { cohort, members, lessonIds } = data;
  const view = tab === "lectures" ? "lectures" : "people";
  // The course(s) this cohort belongs to: the one it was made for, plus any
  // whose lectures it can watch. Links go both ways (Content ↔ People).
  const courseIds = new Set<string>([...(cohort.course_id ? [cohort.course_id] : []), ...lessons.filter((l) => lessonIds.has(l.id)).map((l) => l.course_id)]);
  const courses = [...courseIds].map((cid) => ({ id: cid, title: lessons.find((l) => l.course_id === cid)?.course_title ?? "Course" }));

  return (
    <div className="space-y-6">
      <Link href="/admin/cohorts" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> All cohorts
      </Link>
      <header className="space-y-4">
        <div>
          <p className="text-eyebrow text-link">Cohort</p>
          <h1 className="text-h1">{cohort.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? "person" : "people"} · {lessonIds.size} lectures shared
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {courses.map((c) => (
              <Link key={c.id} href={`/admin/courses/${c.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-brand px-3.5 font-bold text-brand-foreground">
                Course: {c.title} →
              </Link>
            ))}
            <Link href={`/admin/access?cohort=${id}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground bg-card px-3.5 font-bold">
              Access for this cohort →
            </Link>
            <Link href={`/doubts?cohort=${id}`} className="inline-flex h-9 items-center rounded-full border-2 border-foreground bg-card px-3.5 font-bold">
              Their doubts →
            </Link>
          </div>
        </div>
        <details className="group rounded-2xl border-2 border-foreground bg-card">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Edit name, status and dates <span className="text-muted-foreground group-open:hidden">▾</span>
          </summary>
          <div className="border-t-2 border-foreground/10 p-4">
            <CohortSettings cohort={cohort} />
          </div>
        </details>
      </header>

      <nav className="flex gap-2" aria-label="Cohort sections">
        {(
          [
            ["people", `People (${members.length})`],
            ["lectures", `Lectures (${lessonIds.size})`],
          ] as const
        ).map(([k, l]) => (
          <Link
            key={k}
            href={k === "people" ? `/admin/cohorts/${id}` : `/admin/cohorts/${id}?tab=lectures`}
            aria-current={view === k ? "page" : undefined}
            className={cn("inline-flex h-10 items-center rounded-full border-2 border-foreground px-4 text-sm font-semibold", view === k ? "bg-foreground text-background" : "bg-card")}
          >
            {l}
          </Link>
        ))}
      </nav>

      {view === "lectures" ? (
        <LessonSharing cohortId={id} cohortName={cohort.name} lessons={lessons} sharedIds={[...lessonIds]} />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-label="People in this cohort" className="min-w-0">
            {members.length ? (
              <ul className="divide-y-2 divide-foreground/10 rounded-2xl border-2 border-foreground bg-card">
                {members.map((m) => (
                  <li key={m.userId} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                    <span className="min-w-0 flex-1 basis-60">
                      <span className="block truncate text-sm font-bold">{m.name || m.email}</span>
                      {m.name ? <span className="block truncate text-caption text-muted-foreground">{m.email}</span> : null}
                      <span className="mt-1 flex flex-wrap gap-1">
                        <Pill on={m.setUp} yes="Logged in" no="Not logged in yet" />
                        <Pill on={m.detailsDone} yes="Details in" no="Details pending" />
                        {m.scope === "full" ? <Pill on yes="Full platform" no="" /> : null}
                        {m.status === "blocked" ? <span className="rounded-full border border-destructive px-2 py-0.5 text-[0.7rem] font-semibold text-destructive">Locked</span> : null}
                      </span>
                    </span>
                    <MemberActions cohortId={id} userId={m.userId} email={m.email} setUp={m.setUp} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-foreground p-5 text-sm text-muted-foreground">Nobody here yet. Paste emails on the right.</p>
            )}
          </section>
          <aside className="rounded-2xl border-2 border-foreground bg-card p-4 hard-shadow-sm lg:sticky lg:top-20">
            <h2 className="text-base font-bold">Add people to {cohort.name}</h2>
            <div className="mt-3">
              <AddPeopleForm cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))} defaultCohortId={id} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
