import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AdminPage, Block, Empty, Meter, Notice, Status, btn, link, table } from "./kit";

export type HomeTodo = { label: string; count: number; detail: string; href: string };
export type HomeLive = { id: string; name: string; meta: string };
export type HomeCohort = { id: string; name: string; members: number; week: number; behind: number; pct: number };

/**
 * Admin Home (v2). One purpose: what needs a look right now. The list comes
 * first and is the only thing with weight; who is on VIBHA sits beside it
 * (under it on phones); cohorts are a small table. Numbers are one quiet line
 * of links, not a wall of stat cards.
 */
export function AdminHomeV2({
  todo,
  live,
  cohorts,
  students,
  activeThisWeek,
  neverIn,
  dbPct,
  actions,
}: {
  todo: HomeTodo[];
  live: HomeLive[];
  cohorts: HomeCohort[];
  students: number;
  activeThisWeek: number;
  neverIn: number;
  dbPct: number;
  /** The page's own action buttons (Message, Add people, New course). */
  actions: React.ReactNode;
}) {
  const total = todo.reduce((n, a) => n + a.count, 0);
  const shownLive = live.slice(0, 8);
  return (
    <AdminPage
      title="Today"
      lead={
        <>
          <Link className={link} href="/admin/students">{students} students</Link>
          {" · "}
          <Link className={link} href="/admin/activity?view=cohorts">{activeThisWeek} active this week</Link>
          {" · "}
          <Link className={link} href="/admin/students/logins">{neverIn} never signed in</Link>
        </>
      }
      actions={actions}
    >
      {dbPct >= 70 ? (
        <Notice tone="alert">
          <span>
            Storage is at {dbPct}% of the free limit. <Link href="/admin/infra" className="font-bold underline">Check usage</Link>
          </span>
        </Notice>
      ) : null}

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-[var(--ds-7)]">
        <Block title="Needs a look" count={total || undefined}>
          {todo.length ? (
            <ul className="flex min-w-0 flex-col border-y border-[var(--ds-hairline)] divide-y divide-[var(--ds-hairline)]">
              {todo.map((a) => (
                <li key={a.label} className="min-w-0">
                  <Link
                    href={a.href}
                    className="group/row -mx-2 flex min-h-14 min-w-0 items-center gap-4 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="w-9 shrink-0 text-right type-h3 type-num">{a.count}</span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{a.label}</span>
                      <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{a.detail}</span>
                    </span>
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] group-hover/row:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>All clear. Nothing needs you right now.</Empty>
          )}
        </Block>

        <Block title="On VIBHA now" count={live.length || undefined} action={<Link className={link} href="/admin/activity">Activity</Link>}>
          {shownLive.length ? (
            <ul className="flex min-w-0 flex-col border-y border-[var(--ds-hairline)] divide-y divide-[var(--ds-hairline)]">
              {shownLive.map((p) => (
                <li key={p.id} className="min-w-0">
                  <Link
                    href={`/admin/students/${p.id}?tab=activity`}
                    className="-mx-2 flex min-h-12 min-w-0 items-center gap-3 rounded-lg px-2 py-1.5 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Status tone="ok" className="min-w-0 flex-1">
                      <span className="font-semibold">{p.name}</span>
                    </Status>
                    <span className="max-w-[50%] shrink-0 text-right type-caption text-muted-foreground [overflow-wrap:anywhere]">{p.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Nobody is on right now.</Empty>
          )}
          {live.length > shownLive.length ? (
            <Link className={`${link} type-small`} href="/admin/activity">
              See all {live.length}
            </Link>
          ) : null}
        </Block>
      </div>

      <Block title="Cohorts" action={<Link className={link} href="/admin/activity?view=cohorts">Compare</Link>}>
        {cohorts.length ? (
          <>
            {/* Desktop: a table. */}
            <table className={`${table.root} hidden md:table`}>
              <thead>
                <tr>
                  <th scope="col" className={table.th}>Cohort</th>
                  <th scope="col" className={`${table.th} text-right`}>Students</th>
                  <th scope="col" className={`${table.th} w-[32%]`}>Lectures finished</th>
                  <th scope="col" className={`${table.th} text-right`}>Active this week</th>
                  <th scope="col" className={`${table.th} text-right`}>Behind</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.id} className={table.tr}>
                    <td className={table.td}>
                      <Link href={`/admin/cohorts/${c.id}`} className="font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline [overflow-wrap:anywhere]">{c.name}</Link>
                    </td>
                    <td className={`${table.td} ${table.num}`}>{c.members}</td>
                    <td className={table.td}><Meter pct={c.pct} label={`${c.pct}%`} /></td>
                    <td className={`${table.td} ${table.num}`}>{c.week}</td>
                    <td className={`${table.td} ${table.num}`}>{c.behind || <span className="text-muted-foreground">0</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Phone: rows. */}
            <ul className="flex min-w-0 flex-col border-y border-[var(--ds-hairline)] divide-y divide-[var(--ds-hairline)] md:hidden">
              {cohorts.map((c) => (
                <li key={c.id} className="min-w-0">
                  <Link href={`/admin/cohorts/${c.id}`} className="-mx-2 flex min-h-14 min-w-0 flex-col justify-center gap-1 rounded-lg px-2 py-2 outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex min-w-0 items-baseline justify-between gap-3">
                      <span className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">{c.name}</span>
                      <span className="shrink-0 type-small text-muted-foreground type-num">{c.members} students</span>
                    </span>
                    <Meter pct={c.pct} label={`${c.pct}%`} />
                    <span className="type-small text-muted-foreground">
                      {c.week} active this week{c.behind ? ` · ${c.behind} behind` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty>
            No running cohorts. <Link href="/admin/cohorts" className={link}>Make one</Link>
          </Empty>
        )}
      </Block>

      <nav aria-label="Go to" className="flex min-w-0 flex-wrap gap-2">
        {[
          ["Students", "/admin/students"],
          ["Messages", "/admin/emails"],
          ["Courses", "/admin/courses"],
          ["What's live", "/admin/flags"],
          ["Pipeline", "/admin/people"],
          [`Usage ${dbPct}%`, "/admin/infra"],
        ].map(([l, h]) => (
          <Link key={h} href={h} className={btn.ghost + " text-muted-foreground hover:text-foreground"}>
            {l}
          </Link>
        ))}
      </nav>
    </AdminPage>
  );
}
