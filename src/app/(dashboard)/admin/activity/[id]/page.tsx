import type { Metadata } from "next";
import { PersonLinks } from "@/components/admin/person-links";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ChevronLeft, Circle } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { loadStudentDetail } from "@/lib/analytics/activity";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Student activity" };
export const dynamic = "force-dynamic";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);

/** One student's full picture: daily time, every lecture, recent activity, Learn. */
export default async function StudentActivityPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const { id } = await params;
  const d = await loadStudentDetail(id);
  if (!d) notFound();
  const maxDay = Math.max(10, ...d.daily.map((x) => x.min));
  const done = d.lectures.filter((l) => l.done).length;

  return (
    <div className="min-w-0 space-y-6">
      <Link href="/admin/activity" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Activity
      </Link>
      <header>
        <h1 className="text-h1">{d.profile.display}</h1>
        <p className="text-sm text-muted-foreground">
          {String(d.profile.email)} {d.profile.mobile_number ? `· ${d.profile.mobile_number}` : ""} · status {String(d.profile.status ?? "active")}
        </p>
        <div className="mt-3">
          <PersonLinks userId={String(d.profile.id)} email={String(d.profile.email ?? "")} here="activity" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          [hm(d.totals.min30), "on the platform (30 days)"],
          [d.totals.activeDays, "active days (30)"],
          [`${done}/${d.lectures.length}`, "lectures completed"],
          [d.learn ? `${d.learn.xp} XP` : "—", d.learn ? `Learn · ${d.learn.level.title}` : "Learn not started"],
        ].map(([v, l]) => (
          <div key={String(l)} className="rounded-2xl border-2 border-foreground bg-card p-3">
            <p className="text-2xl font-black">{v}</p>
            <p className="text-caption text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="font-black">Minutes per day, last 30 days</h2>
        <div className="mt-3 flex h-36 items-end gap-1" role="img" aria-label="Minutes per day">
          {d.daily.map((x) => (
            <div key={x.day} className="flex h-full flex-1 flex-col justify-end" title={`${x.day}: ${x.min} min`}>
              <div className="w-full rounded-t-sm bg-brand" style={{ height: `${Math.max(x.min ? 4 : 1, (x.min / maxDay) * 100)}%`, opacity: x.min ? 1 : 0.2 }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.65rem] text-muted-foreground">
          <span>{d.daily[0].day.slice(5)}</span>
          <span>Today</span>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-black">Lectures</h2>
          <ul className="mt-3 max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
            {d.lectures.map((l) => (
              <li key={l.id} className="flex items-center gap-2 rounded-xl border border-foreground/15 px-3 py-2 text-sm">
                {l.done ? <CheckCircle2 className="size-4 shrink-0 text-link" aria-label="Completed" /> : <Circle className="size-4 shrink-0 text-muted-foreground" aria-label="Not completed" />}
                <span className="min-w-0 flex-1 truncate">
                  {l.week ? `W${l.week} · ` : ""}
                  {l.title}
                </span>
                <span className={cn("shrink-0 font-pix text-[0.65rem]", !l.watchedMin && "text-muted-foreground")}>{l.watchedMin ? hm(l.watchedMin) : "not opened"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-black">Recent activity</h2>
          <ul className="mt-3 max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
            {d.recent.length ? (
              d.recent.map((r, k) => (
                <li key={k} className="flex items-center justify-between gap-3 border-b border-foreground/10 pb-1.5 text-sm last:border-0">
                  <span className="min-w-0 truncate font-semibold">{r.what}</span>
                  <span className="shrink-0 text-caption text-muted-foreground">
                    {when(r.at)} · {r.min}m
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No visits in the last 30 days.</li>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="font-black">Learn</h2>
        {d.learn ? (
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <ul className="space-y-1 text-sm">
              <li>
                Level {d.learn.level.level} · {d.learn.level.title} · {d.learn.xp} XP
              </li>
              <li>
                Streak {d.learn.streak} (best {d.learn.best})
              </li>
              <li>
                Accuracy {d.learn.accuracy === null ? "—" : `${d.learn.accuracy}%`} over {d.learn.answered} answers
              </li>
              <li>
                Mastery {d.learn.mastery}% · {d.learn.lessons} lessons · {d.learn.badges} badges
              </li>
            </ul>
            <div>
              <p className="text-eyebrow text-link">Mixes up</p>
              {d.learn.confusions.length ? (
                <ul className="mt-1 space-y-0.5 text-sm">
                  {d.learn.confusions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nothing yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Hasn&apos;t used Learn yet.</p>
        )}
      </section>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="font-black">Practice sessions</h2>
        {d.sims.length ? (
          <ul className="mt-2 space-y-1 text-sm">
            {d.sims.map((x) => (
              <li key={x.id as string}>
                {when(x.started_at as string)} · {String(x.status)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">None in the last 30 days.</p>
        )}
      </section>
    </div>
  );
}
