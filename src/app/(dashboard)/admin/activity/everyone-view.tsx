import { Fragment } from "react";
import { presenceOf } from "@/lib/people/presence";
import Link from "next/link";
import { ArrowDown, Crown, TriangleAlert } from "lucide-react";
import { loadActivity, type StudentActivity } from "@/lib/analytics/activity";
import { cn } from "@/lib/utils";
import { nowMs } from "@/lib/crm/people";


const SORTS: { id: keyof StudentActivity; label: string }[] = [
  { id: "score", label: "Overall" },
  { id: "min7", label: "Time (7 days)" },
  { id: "min30", label: "Time (30 days)" },
  { id: "lecturesDone", label: "Lectures done" },
  { id: "xp", label: "Learn XP" },
  { id: "lastSeen", label: "Last seen" },
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ago(iso: string | null) {
  if (!iso) return "Never";
  const ms = nowMs() - new Date(iso).getTime();
  if (presenceOf(iso, nowMs()) === "now") return "Active now";
  if (ms < 3600000) return `${Math.max(1, Math.round(ms / 60000))} min ago`;
  const d = Math.floor(ms / 86400000);
  return d <= 0 ? `${Math.round(ms / 3600000)} h ago` : d === 1 ? "Yesterday" : `${d} days ago`;
}
const hm = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`);

/**
 * /admin/activity: what every student is doing: time on the platform,
 * lectures watched, Learn progress, practice, when they were last seen,
 * a ranking, and a cohort heatmap of when people study.
 */
export async function EveryoneView({ sort }: { sort?: string }) {
  const key = (SORTS.find((s) => s.id === sort)?.id ?? "score") as keyof StudentActivity;
  const { rows, heat, pages, totals } = await loadActivity();
  const sorted = [...rows].sort((a, b) => String(b[key] ?? "").localeCompare(String(a[key] ?? ""), undefined, { numeric: true }));
  const maxHeat = Math.max(1, ...heat.flat());
  const ranked = [...rows].sort((a, b) => b.score - a.score);
  const top = new Set(ranked.slice(0, 3).map((r) => r.id));
  const bottom = new Set(ranked.filter((r) => r.score > 0 || r.lastSeen).slice(-3).map((r) => r.id));
  const now = nowMs();
  const quiet = rows.filter((r) => !r.lastSeen || now - new Date(r.lastSeen).getTime() > 7 * 86400000);
  const maxPage = Math.max(1, ...pages.map((p) => p.min));

  return (
    <div className="min-w-0 space-y-6">

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          [totals.activeNow, "active now"],
          [totals.active7, `of ${totals.students} active this week`],
          [`${totals.hours30}h`, "total study time (30 days)"],
          [totals.lecturesDone, "lectures completed"],
        ].map(([v, l]) => (
          <div key={String(l)} className="rounded-2xl border-2 border-foreground bg-card p-3">
            <p className="text-2xl font-black">{v}</p>
            <p className="text-caption text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      {quiet.length ? (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm">
            <b className="text-primary">{quiet.length} quiet for a week or more:</b> {quiet.slice(0, 8).map((q) => q.name).join(", ")}
            {quiet.length > 8 ? ` and ${quiet.length - 8} more` : ""}.{" "}
            <Link href="/admin/pulse" className="font-bold underline underline-offset-4">
              Message them
            </Link>
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-black">When students study</h2>
          <p className="text-caption text-muted-foreground">Darker = more minutes. India time.</p>
          <div className="mt-3 overflow-x-auto">
            <div className="grid min-w-[520px] grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[3px] text-[0.6rem]">
              <span />
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} className="text-center text-muted-foreground">
                  {h % 3 === 0 ? h : ""}
                </span>
              ))}
              {heat.map((row, d) => (
                <Fragment key={d}>
                  <span className="font-bold">
                    {DAYS[d]}
                  </span>
                  {row.map((v, h) => (
                    <span
                      key={`${d}-${h}`}
                      title={`${DAYS[d]} ${h}:00 · ${Math.round(v)} min`}
                      className="aspect-square rounded-[3px] border border-foreground/15 bg-brand"
                      style={{ opacity: v ? 0.15 + 0.85 * (v / maxHeat) : 0.06 }}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section className="rounded-2xl border-2 border-foreground bg-card p-4">
          <h2 className="font-black">Where the time goes</h2>
          <ul className="mt-3 space-y-2">
            {pages.map((p) => (
              <li key={p.label}>
                <div className="flex justify-between text-sm">
                  <span className="truncate font-semibold">{p.label}</span>
                  <span className="shrink-0 font-pix text-xs">{hm(p.min)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(p.min / maxPage) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-2 text-h2">Every student</h2>
          {SORTS.map((s) => (
            <Link
              key={s.id}
              href={`/admin/activity?view=everyone&sort=${s.id}`}
              aria-current={key === s.id ? "true" : undefined}
              className={cn("rounded-full border-2 border-foreground px-3 py-1 text-xs font-bold", key === s.id ? "bg-foreground text-background" : "bg-card")}
            >
              {s.label}
              {key === s.id ? <ArrowDown className="ml-1 inline size-3" aria-hidden /> : null}
            </Link>
          ))}
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-foreground bg-card">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b-2 border-foreground bg-muted text-left text-caption">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Last seen</th>
                <th className="px-3 py-2">Time 7d</th>
                <th className="px-3 py-2">Time 30d</th>
                <th className="px-3 py-2">Days active</th>
                <th className="px-3 py-2">Lectures</th>
                <th className="px-3 py-2">Watched</th>
                <th className="px-3 py-2">Learn</th>
                <th className="px-3 py-2">Accuracy</th>
                <th className="px-3 py-2">Practice</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const rank = ranked.findIndex((x) => x.id === r.id) + 1;
                return (
                  <tr key={r.id} className={cn("border-b border-foreground/10 last:border-0", top.has(r.id) && "bg-primary/25", bottom.has(r.id) && "bg-status-alert-bg")}>
                    <td className="px-3 py-2 font-pix text-xs">{top.has(r.id) && rank === 1 ? <Crown className="size-4" aria-label="Top" /> : rank}</td>
                    <td className="px-3 py-2">
                      <Link href={`/admin/students/${r.id}?tab=activity`} className="font-bold text-link underline-offset-4 hover:underline">
                        {r.name}
                      </Link>
                      <span className="block text-caption text-muted-foreground">{r.email}</span>
                    </td>
                    <td className="px-3 py-2">
                      {presenceOf(r.lastSeen, now) === "now" ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-foreground bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                          <span className="size-2 animate-pulse rounded-full bg-foreground" aria-hidden /> Active now
                        </span>
                      ) : (
                        ago(r.lastSeen)
                      )}
                    </td>
                    <td className="px-3 py-2">{hm(r.min7)}</td>
                    <td className="px-3 py-2">{hm(r.min30)}</td>
                    <td className="px-3 py-2">{r.activeDays30}</td>
                    <td className="px-3 py-2">
                      {r.lecturesDone} done · {r.lecturesStarted} started
                    </td>
                    <td className="px-3 py-2">{hm(r.watchMin)}</td>
                    <td className="px-3 py-2">
                      {r.xp} XP · {r.streak}🔥
                    </td>
                    <td className="px-3 py-2">{r.accuracy === null ? "-" : `${r.accuracy}%`}</td>
                    <td className="px-3 py-2">{r.practice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          Highlighted: top 3 (lime) and bottom 3 (red) by overall engagement = study time + 20 per finished lecture + Learn XP ÷ 10 + 10 per practice session + 5 per active day. Visits over 30 minutes are counted as 30 (tabs left open).
        </p>
      </section>
    </div>
  );
}
