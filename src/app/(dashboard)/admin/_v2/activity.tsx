import * as React from "react";
import Link from "next/link";
import { ArrowDown, Bell, ChevronRight, PlayCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Figures, Meter, Notice, Status, ViewTabs, btn, link, table } from "./kit";

/**
 * Activity (v2): what students are doing. Four views with their own address
 * (live, cohorts, falling behind, everyone). Tables on desktop, rows on
 * phones; numbers sit in one line above the list they describe.
 */
export function ActivityPageV2({ views, view, children }: { views: readonly { id: string; label: string }[]; view: string; children: React.ReactNode }) {
  return (
    <AdminPage title="Activity">
      <ViewTabs label="Activity views" current={view} tabs={views.map((v) => ({ id: v.id, label: v.label, href: `/admin/activity?view=${v.id}` }))} />
      {children}
    </AdminPage>
  );
}

const rowLink = "-mx-2 flex min-h-14 min-w-0 items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]";
const rows = "flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]";
const nameLink = "font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline [overflow-wrap:anywhere]";

/* ---------------------------------------------------------------- */
/* Live                                                              */
/* ---------------------------------------------------------------- */

export type LivePerson = { id: string; name: string; meta: string; where: string; watching: boolean; since: string };

export function LiveV2({
  people,
  figures,
  neverIn,
  refresh,
}: {
  people: LivePerson[];
  figures: { value: React.ReactNode; label: string; href?: string }[];
  neverIn: number;
  /** The auto-refresh note (client). */
  refresh: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
      <Figures items={figures} />
      {neverIn ? (
        <p className="type-small">
          <b>{neverIn}</b> student{neverIn === 1 ? " has" : "s have"} never signed in.{" "}
          <Link href="/admin/students/logins" className={link}>Send login links</Link>
        </p>
      ) : null}
      <Block title="On VIBHA now" count={people.length || undefined} action={refresh}>
        {people.length ? (
          <>
            <table className={cn(table.root, "hidden md:table")}>
              <thead>
                <tr>
                  <th scope="col" className={table.th}>Student</th>
                  <th scope="col" className={table.th}>Cohort</th>
                  <th scope="col" className={table.th}>Doing</th>
                  <th scope="col" className={cn(table.th, "text-right")}>Since</th>
                </tr>
              </thead>
              <tbody>
                {people.map((l) => (
                  <tr key={l.id} className={table.tr}>
                    <td className={cn(table.td, "w-[30%]")}>
                      <Link href={`/admin/students/${l.id}?tab=activity`} className={nameLink}>{l.name}</Link>
                    </td>
                    <td className={cn(table.td, "text-muted-foreground [overflow-wrap:anywhere]")}>{l.meta}</td>
                    <td className={table.td}>
                      <span className={cn("inline-flex min-w-0 items-center gap-1.5", l.watching && "font-semibold")}>
                        {l.watching ? <PlayCircle className="size-4 shrink-0 text-link" aria-hidden /> : null}
                        <span className="[overflow-wrap:anywhere]">{l.where || "On VIBHA"}</span>
                      </span>
                    </td>
                    <td className={cn(table.td, table.num, "whitespace-nowrap")}>{l.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className={cn(rows, "md:hidden")}>
              {people.map((l) => (
                <li key={l.id} className="min-w-0">
                  <Link href={`/admin/students/${l.id}?tab=activity`} className={rowLink}>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <Status tone={l.watching ? "ok" : "info"}><span className="type-body font-semibold">{l.name}</span></Status>
                      <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                        {l.where || "On VIBHA"} · since {l.since}
                      </span>
                    </span>
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty>Nobody is on right now.</Empty>
        )}
      </Block>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Cohorts                                                           */
/* ---------------------------------------------------------------- */

export type CohortLine = { id: string; name: string; n: number; pct: number; week: number; time: string; behind: number; never: number };

export function CohortsV2({ groups }: { groups: CohortLine[] }) {
  if (!groups.length) return <Empty>No students yet.</Empty>;
  const behindHref = (g: CohortLine) => `/admin/activity?view=behind${g.id !== "none" ? `&cohort=${g.id}` : ""}`;
  return (
    <>
      <table className={cn(table.root, "hidden md:table")}>
        <thead>
          <tr>
            <th scope="col" className={table.th}>Cohort</th>
            <th scope="col" className={cn(table.th, "text-right")}>Students</th>
            <th scope="col" className={cn(table.th, "w-[24%]")}>Lectures finished</th>
            <th scope="col" className={cn(table.th, "text-right")}>Active this week</th>
            <th scope="col" className={cn(table.th, "text-right")}>Study time this week</th>
            <th scope="col" className={cn(table.th, "text-right")}>Behind</th>
            <th scope="col" className={cn(table.th, "text-right")}>Never came in</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} className={table.tr}>
              <td className={table.td}>
                {g.id !== "none" ? <Link href={`/admin/cohorts/${g.id}`} className={nameLink}>{g.name}</Link> : <span className="font-semibold">{g.name}</span>}
              </td>
              <td className={cn(table.td, table.num)}>{g.n}</td>
              <td className={table.td}><Meter pct={g.pct} label={`${g.pct}%`} /></td>
              <td className={cn(table.td, table.num)}>{g.week}/{g.n}</td>
              <td className={cn(table.td, table.num)}>{g.time}</td>
              <td className={cn(table.td, table.num)}>
                {g.behind ? <Link href={behindHref(g)} className={link}>{g.behind}</Link> : <span className="text-muted-foreground">0</span>}
              </td>
              <td className={cn(table.td, table.num)}>{g.never || <span className="text-muted-foreground">0</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className={cn(rows, "md:hidden")}>
        {groups.map((g) => (
          <li key={g.id} className="flex min-w-0 flex-col gap-1.5 py-3">
            <span className="flex min-w-0 items-baseline justify-between gap-3">
              <span className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">{g.name}</span>
              <span className="shrink-0 type-small text-muted-foreground type-num">{g.n} student{g.n === 1 ? "" : "s"}</span>
            </span>
            <Meter pct={g.pct} label={`${g.pct}%`} />
            <span className="type-small text-muted-foreground type-num">
              {g.week}/{g.n} active this week · {g.time} study time · {g.behind} behind · {g.never} never came in
            </span>
            <span className="flex flex-wrap gap-2 pt-1">
              {g.id !== "none" ? <Link href={`/admin/cohorts/${g.id}`} className={btn.quiet}>Open cohort</Link> : null}
              <Link href={behindHref(g)} className={btn.quiet}>Who&apos;s behind</Link>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Falling behind                                                    */
/* ---------------------------------------------------------------- */

export type BehindLine = { id: string; name: string; sub: string; state: string; done: number; available: number; pct: number; nudgeHref: string };

export function BehindV2({ list, cohorts, cohort, nudgeAllHref }: { list: BehindLine[]; cohorts: { id: string; name: string }[]; cohort: string; nudgeAllHref: string | null }) {
  const chip = (on: boolean) =>
    cn(
      "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] focus-visible:ring-2 focus-visible:ring-ring lg:min-h-8",
      on ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
    );
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <nav aria-label="Cohort" className="flex min-w-0 flex-1 basis-full flex-wrap gap-1 sm:basis-0">
          <Link href="/admin/activity?view=behind" aria-current={!cohort ? "true" : undefined} className={chip(!cohort)}>All</Link>
          {cohorts.map((c) => (
            <Link key={c.id} href={`/admin/activity?view=behind&cohort=${c.id}`} aria-current={cohort === c.id ? "true" : undefined} className={chip(cohort === c.id)}>
              {c.name}
            </Link>
          ))}
        </nav>
        {nudgeAllHref ? (
          <Link href={nudgeAllHref} className={btn.primary}>
            <Bell aria-hidden /> Nudge all {list.length}
          </Link>
        ) : null}
      </div>
      <p className="type-small text-muted-foreground">Behind = finished under half of the lectures they can watch, or quiet for 7+ days.</p>
      {list.length ? (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={table.th}>Student</th>
                <th scope="col" className={table.th}>This week</th>
                <th scope="col" className={cn(table.th, "w-[28%]")}>Lectures</th>
                <th scope="col" className={cn(table.th, "w-24")}><span className="sr-only">Nudge</span></th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className={table.tr}>
                  <td className={cn(table.td, "w-[36%]")}>
                    <Link href={`/admin/students/${r.id}?tab=activity`} className={nameLink}>{r.name}</Link>
                    <span className="block type-caption font-medium text-muted-foreground [overflow-wrap:anywhere]">{r.sub}</span>
                  </td>
                  <td className={cn(table.td, "type-num")}>{r.state}</td>
                  <td className={table.td}><Meter tone="warn" pct={r.pct} label={`${r.done}/${r.available}`} /></td>
                  <td className={cn(table.td, "text-right")}>
                    <Link href={r.nudgeHref} className={btn.quiet} aria-label={`Nudge ${r.name}`}>Nudge</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className={cn(rows, "md:hidden")}>
            {list.map((r) => (
              <li key={r.id} className="flex min-w-0 items-center gap-2">
                <Link href={`/admin/students/${r.id}?tab=activity`} className={cn(rowLink, "flex-1")}>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                    <span className="type-small text-muted-foreground type-num">
                      {r.state} · {r.done}/{r.available} lectures
                    </span>
                  </span>
                </Link>
                <Link href={r.nudgeHref} className={btn.quiet} aria-label={`Nudge ${r.name}`}>Nudge</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Empty>Nobody is behind.</Empty>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Everyone (30 days)                                                */
/* ---------------------------------------------------------------- */

export type EveryoneLine = {
  id: string;
  rank: number;
  name: string;
  email: string;
  lastSeen: string;
  now: boolean;
  min7: string;
  min30: string;
  days: number;
  lectures: string;
  watched: string;
  learn: string;
  accuracy: string;
  practice: number;
  band: "top" | "bottom" | null;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function EveryoneV2({
  figures,
  quiet,
  heat,
  pages,
  sorts,
  sort,
  people,
}: {
  figures: { value: React.ReactNode; label: string }[];
  quiet: { count: number; names: string };
  heat: number[][];
  pages: { label: string; time: string; pct: number }[];
  sorts: { id: string; label: string }[];
  sort: string;
  people: EveryoneLine[];
}) {
  const maxHeat = Math.max(1, ...heat.flat());
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
      <Figures items={figures} />
      {quiet.count ? (
        <Notice>
          <span>
            <b>{quiet.count} quiet for a week or more:</b> {quiet.names}.{" "}
            <Link href="/admin/pulse" className="font-bold underline underline-offset-4">Message them</Link>
          </span>
        </Notice>
      ) : null}

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-[var(--ds-7)]">
        <Block title="When students study" action={<span className="text-muted-foreground">Darker = more minutes. India time.</span>}>
          <div className="overflow-x-auto" tabIndex={0} role="group" aria-label="Study time by day and hour">
            <div className="grid min-w-[520px] grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[3px]" data-layout-ok="tiny">
              <span />
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} className="text-center type-caption font-medium text-muted-foreground type-num">{h % 3 === 0 ? h : ""}</span>
              ))}
              {heat.map((row, d) => (
                <React.Fragment key={d}>
                  <span className="type-caption">{DAYS[d]}</span>
                  {row.map((v, h) => (
                    <span key={`${d}-${h}`} title={`${DAYS[d]} ${h}:00 · ${Math.round(v)} min`} className="aspect-square rounded-[2px] bg-link" style={{ opacity: v ? 0.15 + 0.85 * (v / maxHeat) : 0.06 }} />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Block>
        <Block title="Where the time goes">
          {pages.length ? (
            <ul className="flex min-w-0 flex-col gap-2.5">
              {pages.map((p) => (
                <li key={p.label} className="flex min-w-0 flex-col gap-1">
                  <span className="flex min-w-0 justify-between gap-3 type-small">
                    <span className="min-w-0 font-semibold [overflow-wrap:anywhere]">{p.label}</span>
                    <span className="shrink-0 type-num text-muted-foreground">{p.time}</span>
                  </span>
                  <Meter pct={p.pct} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No page time recorded yet.</Empty>
          )}
        </Block>
      </div>

      <Block title="Every student" count={people.length || undefined}>
        <nav aria-label="Sort by" className="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sorts.map((s) => (
            <Link
              key={s.id}
              href={`/admin/activity?view=everyone&sort=${s.id}`}
              aria-current={sort === s.id ? "true" : undefined}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-1 rounded-full px-3 type-small font-semibold whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-8",
                sort === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
              )}
            >
              {s.label}
              {sort === s.id ? <ArrowDown className="size-3.5" aria-hidden /> : null}
            </Link>
          ))}
        </nav>
        {people.length ? (
          <>
            <div className="hidden min-w-0 overflow-x-auto md:block 2xl:overflow-visible" tabIndex={0} role="group" aria-label="Every student, table">
              <table className={cn(table.root, "min-w-[60rem]")}>
                <thead>
                  <tr>
                    <th scope="col" className={cn(table.th, "text-right")}>#</th>
                    <th scope="col" className={table.th}>Student</th>
                    <th scope="col" className={table.th}>Last seen</th>
                    <th scope="col" className={cn(table.th, "text-right")}>7 days</th>
                    <th scope="col" className={cn(table.th, "text-right")}>30 days</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Days active</th>
                    <th scope="col" className={table.th}>Lectures</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Watched</th>
                    <th scope="col" className={table.th}>Learn</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Accuracy</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Practice</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((r) => (
                    <tr key={r.id} className={table.tr}>
                      <td className={cn(table.td, table.num, "text-muted-foreground")}>
                        <span className={cn("inline-block min-w-6 rounded px-1 text-center", r.band === "top" && "bg-primary font-bold text-primary-foreground", r.band === "bottom" && "bg-status-alert-bg font-bold text-status-alert-fg")}>{r.rank}</span>
                      </td>
                      <td className={table.td}>
                        <Link href={`/admin/students/${r.id}?tab=activity`} className={nameLink}>{r.name}</Link>
                        <span className="block type-caption font-medium text-muted-foreground [overflow-wrap:anywhere]">{r.email}</span>
                      </td>
                      <td className={cn(table.td, "whitespace-nowrap")}>{r.now ? <Status tone="ok">Active now</Status> : r.lastSeen}</td>
                      <td className={cn(table.td, table.num)}>{r.min7}</td>
                      <td className={cn(table.td, table.num)}>{r.min30}</td>
                      <td className={cn(table.td, table.num)}>{r.days}</td>
                      <td className={cn(table.td, "whitespace-nowrap type-num")}>{r.lectures}</td>
                      <td className={cn(table.td, table.num)}>{r.watched}</td>
                      <td className={cn(table.td, "whitespace-nowrap type-num")}>{r.learn}</td>
                      <td className={cn(table.td, table.num)}>{r.accuracy}</td>
                      <td className={cn(table.td, table.num)}>{r.practice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className={cn(rows, "md:hidden")}>
              {people.map((r) => (
                <li key={r.id} className="min-w-0">
                  <Link href={`/admin/students/${r.id}?tab=activity`} className={rowLink}>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded type-small font-bold type-num", r.band === "top" ? "bg-primary text-primary-foreground" : r.band === "bottom" ? "bg-status-alert-bg text-status-alert-fg" : "text-muted-foreground")}>{r.rank}</span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name}</span>
                      <span className="type-small text-muted-foreground type-num [overflow-wrap:anywhere]">
                        {r.now ? "Active now" : r.lastSeen} · {r.min7} this week · {r.lectures}
                      </span>
                    </span>
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty>No students yet.</Empty>
        )}
        <p className="max-w-[75ch] type-small text-muted-foreground">
          Rank is by overall engagement: study time, plus 20 per finished lecture, Learn XP ÷ 10, 10 per practice session and 5 per active day. Top 3 in lime, bottom 3 in red. Visits over 30 minutes count as 30.
        </p>
      </Block>
    </div>
  );
}
