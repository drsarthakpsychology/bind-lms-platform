import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { BoardSwitch } from "@/components/standing/board-switch";
import { BOARDS } from "@/lib/standing/boards";
import { adminQueryString, type AdminBoardKey, type AdminPage, type AdminSort } from "@/lib/standing/admin-board";
import { cn } from "@/lib/utils";

const control = "h-11 rounded-md border-2 border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm";

/** The board's own small line under each name. */
function detail(board: AdminBoardKey, extra: AdminPage["rows"][number]["extra"]): string {
  if (board === "league") return `${extra.tier ?? "Neuron"} league`;
  if (board === "quiz") return `${extra.xp ?? 0} XP all time · ${extra.streak ?? 0} day streak`;
  return `Level ${extra.level ?? 1} · ${extra.hours ?? 0} h on VIBHA`;
}

const UNIT: Record<AdminBoardKey, string> = { league: "pts", quiz: "XP", overall: "pts" };

/**
 * What an admin sees on a student leaderboard: every student in the chosen
 * cohort (or all), zero scores included, full names, with search, sort and
 * pages. A plain GET form, so it works without JavaScript.
 */
export function AdminBoard({ board, data }: { board: AdminBoardKey; data: AdminPage }) {
  const b = BOARDS[board];
  const q = data.query;
  const href = (patch: Parameters<typeof adminQueryString>[1]) => `${b.href}${adminQueryString(q, patch)}`;
  const sortLink = (sort: AdminSort) => href({ sort, dir: q.sort === sort && q.dir === "asc" ? "desc" : "asc", page: 1 });
  const arrow = (sort: AdminSort) => (q.sort === sort ? (q.dir === "asc" ? " ↑" : " ↓") : "");
  const cohortName = q.cohort ? data.cohorts.find((c) => c.id === q.cohort)?.name : null;
  const first = (data.page - 1) * data.size + 1;
  const last = Math.min(data.matched, data.page * data.size);

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0 space-y-6 px-1 sm:px-0">
      <BoardSwitch active={board} />
      <header className="min-w-0">
        <p className="text-eyebrow text-link">{b.period}</p>
        <h1 className="text-h1 [overflow-wrap:anywhere]">{b.label}</h1>
        <p className="mt-1 text-sm">{b.explainer}</p>
        <p className="text-caption text-muted-foreground">
          {cohortName ?? "All cohorts"}. Every student, full names. {data.total} {data.total === 1 ? "student" : "students"}.
        </p>
      </header>

      <form method="get" action={b.href} role="search" className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-0 flex-1 basis-56 flex-col gap-1 text-sm font-semibold">
          Name
          <Input type="search" name="q" defaultValue={q.q} placeholder="Search a name" autoComplete="off" />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-sm font-semibold">
          Cohort
          <select name="cohort" defaultValue={q.cohort ?? ""} className={control}>
            <option value="">All cohorts</option>
            {data.cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-sm font-semibold">
          Sort
          <select name="sort" defaultValue={q.sort} className={control}>
            <option value="rank">Rank</option>
            <option value="name">Name</option>
            <option value="cohort">Cohort</option>
          </select>
        </label>
        {q.dir !== "asc" ? <input type="hidden" name="dir" value={q.dir} /> : null}
        <Button type="submit" variant="outline">Show</Button>
      </form>

      <section aria-label={b.label} className="min-w-0">
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">
              {b.label}, {cohortName ?? "all cohorts"}
            </caption>
            <thead className="border-b-2 border-foreground/10 text-left text-caption text-muted-foreground">
              <tr>
                <th scope="col" className="w-16 px-3 py-2" aria-sort={q.sort === "rank" ? (q.dir === "asc" ? "ascending" : "descending") : undefined}>
                  <Link href={sortLink("rank")} className="underline-offset-4 hover:underline">Rank{arrow("rank")}</Link>
                </th>
                <th scope="col" className="px-3 py-2" aria-sort={q.sort === "name" ? (q.dir === "asc" ? "ascending" : "descending") : undefined}>
                  <Link href={sortLink("name")} className="underline-offset-4 hover:underline">Name{arrow("name")}</Link>
                </th>
                <th scope="col" className="hidden w-40 px-3 py-2 sm:table-cell" aria-sort={q.sort === "cohort" ? (q.dir === "asc" ? "ascending" : "descending") : undefined}>
                  <Link href={sortLink("cohort")} className="underline-offset-4 hover:underline">Cohort{arrow("cohort")}</Link>
                </th>
                <th scope="col" className="w-24 px-3 py-2 text-right">{UNIT[board] === "XP" ? "XP" : "Points"}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground/10">
              {data.rows.map((r) => (
                <tr key={r.key} className={cn(r.points === 0 && "text-muted-foreground")}>
                  <td className="px-3 py-2.5 font-bold tabular-nums">#{r.rank}</td>
                  <td className="min-w-0 px-3 py-2.5">
                    <span className="block truncate font-semibold text-foreground" title={r.name}>{r.name}</span>
                    <span className="block truncate text-caption text-muted-foreground">
                      <span className="sm:hidden">{r.cohorts.join(", ") || "No cohort"} · </span>
                      {detail(board, r.extra)}
                    </span>
                  </td>
                  <td className="hidden truncate px-3 py-2.5 sm:table-cell" title={r.cohorts.join(", ")}>{r.cohorts.join(", ") || "No cohort"}</td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums">{r.points.toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {!data.rows.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">{q.q ? `No student matches "${q.q}".` : "No students in this cohort yet."}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {data.matched ? (
        <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="tabular-nums text-muted-foreground">
            {first} to {last} of {data.matched}
          </p>
          <div className="flex items-center gap-2">
            {data.page > 1 ? (
              <Link href={href({ page: data.page - 1 })} className={buttonVariants({ variant: "outline", size: "sm" })} rel="prev">
                <ChevronLeft className="size-4" aria-hidden /> Back
              </Link>
            ) : null}
            <span className="tabular-nums" aria-current="page">
              Page {data.page} of {data.pages}
            </span>
            {data.page < data.pages ? (
              <Link href={href({ page: data.page + 1 })} className={buttonVariants({ variant: "outline", size: "sm" })} rel="next">
                Next <ChevronRight className="size-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
