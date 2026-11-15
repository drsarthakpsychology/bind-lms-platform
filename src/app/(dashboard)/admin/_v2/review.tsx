import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Notice, RowLink, Rows, Status, Tag, ViewTabs, control, btn, nameLink, table, type Tone } from "./kit";

/* ---------------------------------------------------------------- */
/* Needs a look (triage)                                             */
/* ---------------------------------------------------------------- */

export type TriageNeed = { id: string; sessionId: string; overall: number; priority: number; premature: number };
export type WeakItem = { itemId: string; prompt?: string; correctPct: number; attempts: number };

/** Review, needs a look (v2). The queue first; weak quiz questions under it as a table. */
export function TriageV2({ needs, autoReleased, weakQuizItems }: { needs: TriageNeed[]; autoReleased: number; weakQuizItems: WeakItem[] }) {
  return (
    <AdminPage width="default" title="Needs a look" lead={`${needs.length} practice session${needs.length === 1 ? "" : "s"} to check · ${autoReleased} released without review this week`}>
      <Block title="Practice sessions" count={needs.length || undefined}>
        {needs.length ? (
          <Rows>
            {needs.map((n) => (
              <RowLink
                key={n.id}
                href="/admin/sim-review"
                title={`Session ${n.sessionId.slice(0, 8)}`}
                meta={`Priority ${n.priority}${n.premature > 2 ? " · reassured too early" : ""}`}
                end={<span className="type-num text-foreground">AI score {n.overall.toFixed(1)}/5</span>}
              />
            ))}
          </Rows>
        ) : (
          <Empty>The queue is clear. New flagged sessions land here.</Empty>
        )}
      </Block>
      {weakQuizItems.length ? (
        <Block title="Quiz questions most students get wrong" count={weakQuizItems.length}>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={table.th}>Question</th>
                <th scope="col" className={cn(table.th, "text-right")}>Correct</th>
                <th scope="col" className={cn(table.th, "text-right")}>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {weakQuizItems.map((q) => (
                <tr key={q.itemId} className={table.tr}>
                  <td className={cn(table.td, "[overflow-wrap:anywhere]")}>{q.prompt ?? q.itemId}</td>
                  <td className={cn(table.td, table.num)}>{q.correctPct}%</td>
                  <td className={cn(table.td, table.num)}>{q.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="md:hidden">
            {weakQuizItems.map((q) => (
              <li key={q.itemId} className="flex min-w-0 flex-col gap-1 py-3">
                <span className="type-small font-semibold [overflow-wrap:anywhere]">{q.prompt ?? q.itemId}</span>
                <span className="type-small text-muted-foreground type-num">{q.correctPct}% correct · {q.attempts} attempts</span>
              </li>
            ))}
          </Rows>
        </Block>
      ) : null}
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* Submissions                                                       */
/* ---------------------------------------------------------------- */

/** Submissions (v2). One filter bar (status tabs, course, assignment); each row opens in place to grade. */
export function SubmissionsV2({
  pending,
  status,
  course,
  assignment,
  courses,
  assignments,
  count,
  children,
}: {
  pending: number;
  status: string;
  course: string;
  assignment: string;
  courses: { id: string; title: string }[];
  assignments: { id: string; title: string }[];
  count: number;
  children: React.ReactNode;
}) {
  return (
    <AdminPage title="Submissions" lead={pending ? `${pending} waiting for a grade` : "Nothing is waiting for a grade."}>
      <div className="flex min-w-0 flex-col gap-3">
        <ViewTabs
          label="Status"
          current={status === "pending" || status === "graded" ? status : "all"}
          tabs={[
            { id: "all", label: "All", href: "/admin/submissions" },
            { id: "pending", label: "Pending", href: "/admin/submissions?status=pending", count: pending },
            { id: "graded", label: "Graded", href: "/admin/submissions?status=graded" },
          ]}
        />
        <form action="/admin/submissions" method="get" className="flex min-w-0 flex-wrap items-center gap-2">
          {status === "pending" || status === "graded" ? <input type="hidden" name="status" value={status} /> : null}
          <label className="min-w-0 flex-1 basis-48 sm:flex-none">
            <span className="sr-only">Course</span>
            <select name="course" defaultValue={course} className={cn(control, "w-full sm:max-w-64")}>
              <option value="">All courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          <label className="min-w-0 flex-1 basis-48 sm:flex-none">
            <span className="sr-only">Assignment</span>
            <select name="assignment" defaultValue={assignment} className={cn(control, "w-full sm:max-w-64")}>
              <option value="">All assignments</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </label>
          <button type="submit" className={btn.quiet}>Filter</button>
        </form>
      </div>
      {count ? (
        <div className="flex min-w-0 flex-col">
          <div aria-hidden className="sticky top-[var(--top-h)] z-[2] hidden grid-cols-[minmax(0,1fr)_9rem_8rem_1rem] gap-x-4 border-b border-[var(--ds-card-line)] bg-background py-2 type-caption font-semibold text-muted-foreground md:grid">
            <span>Assignment and student</span>
            <span>Submitted</span>
            <span>Status</span>
            <span />
          </div>
          <div className="flex min-w-0 flex-col border-t border-[var(--ds-hairline)] md:border-t-0">{children}</div>
        </div>
      ) : <Empty>{pending === 0 ? "No submissions match. You are all caught up." : "No submissions match. Try a different filter."}</Empty>}
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* Doubts and concerns                                               */
/* ---------------------------------------------------------------- */

export type DoubtRowV2 = { id: string; title: string; concern: boolean; author: string; cohort: string; when: string; replies: number; solved: boolean };

export function DoubtsV2({
  ready,
  view,
  views,
  filter,
  list,
  emptyText,
}: {
  ready: boolean;
  view: string;
  views: { id: string; label: string; href: string; count?: number | null }[];
  filter?: React.ReactNode;
  list: DoubtRowV2[];
  emptyText: string;
}) {
  const st = (d: DoubtRowV2): { tone: Tone; label: string } => (d.solved ? { tone: "ok", label: "Solved" } : d.replies ? { tone: "quiet", label: "Open" } : { tone: "warn", label: "No answer yet" });
  return (
    <AdminPage title="Doubts and concerns" lead="Reply to students. Private concerns are seen only by the student and the VIBHA team.">
      {!ready ? (
        <Notice>The doubts board is not switched on yet (database step 2026_11_access_doubts.sql).</Notice>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-3">
            <ViewTabs label="Views" current={view} tabs={views} />
            {filter}
          </div>
          {list.length ? (
            <>
              <table className={cn(table.root, "hidden md:table")}>
                <thead>
                  <tr>
                    <th scope="col" className={cn(table.th, "w-[46%]")}>Doubt</th>
                    <th scope="col" className={table.th}>Student</th>
                    <th scope="col" className={table.th}>Asked</th>
                    <th scope="col" className={cn(table.th, "text-right")}>Replies</th>
                    <th scope="col" className={table.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((d) => (
                    <tr key={d.id} className={table.tr}>
                      <td className={table.td}>
                        <Link href={`/doubts/${d.id}`} className={nameLink}>{d.title}</Link>
                        {d.concern ? <span className="mt-1 block"><Tag tone="alert">Private concern</Tag></span> : null}
                      </td>
                      <td className={table.td}>
                        <span className="block [overflow-wrap:anywhere]">{d.author}</span>
                        <span className="block text-muted-foreground [overflow-wrap:anywhere]">{d.cohort}</span>
                      </td>
                      <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{d.when}</td>
                      <td className={cn(table.td, table.num)}>{d.replies}</td>
                      <td className={cn(table.td, "whitespace-nowrap")}><Status tone={st(d).tone}>{st(d).label}</Status></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Rows className="md:hidden">
                {list.map((d) => (
                  <RowLink
                    key={d.id}
                    href={`/doubts/${d.id}`}
                    title={d.title}
                    meta={
                      <>
                        <span className="block">{d.author} · {d.cohort} · {d.when}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <Status tone={st(d).tone}>{st(d).label}</Status>
                          {d.concern ? <Tag tone="alert">Private concern</Tag> : null}
                        </span>
                      </>
                    }
                  />
                ))}
              </Rows>
            </>
          ) : (
            <Empty>{emptyText}</Empty>
          )}
        </>
      )}
    </AdminPage>
  );
}
