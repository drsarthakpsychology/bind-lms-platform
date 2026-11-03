import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { loadAllLessons, loadCohortSummaries, loadPersonAccess } from "@/lib/cohorts/admin-data";
import { loadStanding } from "@/lib/standing/board";
import { PersonAccess } from "@/components/admin/cohorts-ui";
import { PersonLinks } from "@/components/admin/person-links";

export const dynamic = "force-dynamic";

const DETAIL_LABELS: [string, string][] = [
  ["full_name", "Full name"],
  ["phone", "Mobile"],
  ["city", "City"],
  ["state", "State"],
  ["country", "Country"],
  ["qualification", "Highest qualification"],
  ["institution", "College or workplace"],
  ["occupation", "Currently"],
];

/** One person's access: cohorts, platform access, extra lectures, details. */
export default async function PersonAccessPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(userId)) notFound();
  const [data, lessons, { cohorts }, board] = await Promise.all([loadPersonAccess(userId), loadAllLessons(), loadCohortSummaries(), loadStanding()]);
  if (!data) notFound();
  const { profile, cohortIds, grantIds, details } = data;
  const admin = createAdminClient();
  const { data: links } = cohortIds.size ? await admin.from("lesson_cohorts").select("lesson_id").in("cohort_id", [...cohortIds]) : { data: [] };
  const me = board.rows.find((r) => r.userId === userId);

  return (
    <div className="space-y-6">
      <Link href="/admin/cohorts" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Cohorts
      </Link>
      <header>
        <p className="text-eyebrow text-link">Access</p>
        <h1 className="text-h1 break-words">{(details?.full_name as string) || (profile.name as string) || (profile.email as string)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile.email as string}</p>
        <div className="mt-3">
          <PersonLinks userId={userId} email={String(profile.email ?? "")} here="access" />
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <PersonAccess
          userId={userId}
          cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))}
          cohortIds={[...cohortIds]}
          scope={String(profile.scope ?? "full")}
          lessons={lessons}
          grantIds={[...grantIds]}
          cohortLessonIds={(links ?? []).map((l) => l.lesson_id as string)}
          detailsConfirmed={Boolean(details?.confirmed_at)}
        />
        <aside className="space-y-4 lg:sticky lg:top-20">
          <section className="rounded-2xl border-2 border-foreground bg-card p-4">
            <h2 className="text-base font-bold">Their details</h2>
            {details ? (
              <dl className="mt-3 space-y-2 text-sm">
                {DETAIL_LABELS.map(([k, l]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-foreground/10 pb-2">
                    <dt className="text-muted-foreground">{l}</dt>
                    <dd className="min-w-0 break-words text-right font-semibold">{details[k] || "—"}</dd>
                  </div>
                ))}
                <p className="text-caption text-muted-foreground">
                  {details.confirmed_at ? `Checked and submitted ${new Date(details.confirmed_at).toLocaleDateString("en-IN")}` : "Started but not submitted yet"}
                </p>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Not filled yet. They&apos;ll be asked the next time they open VIBHA.</p>
            )}
          </section>
          {me ? (
            <section className="rounded-2xl border-2 border-foreground bg-card p-4">
              <h2 className="text-base font-bold">Level {me.level} · {me.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {me.points} points · {me.hours} h on VIBHA · {me.lectureHours} h of lectures · {me.lessonsDone} lectures finished
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
