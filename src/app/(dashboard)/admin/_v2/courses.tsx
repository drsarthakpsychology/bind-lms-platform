import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, More, RowItem, Rows, Status, btn, nameLink, table, type Tone } from "./kit";

export type CourseRowV2 = { id: string; title: string; published: boolean; lessons: number; actions?: React.ReactNode };

/** Courses (v2). One purpose: open a course. A table on desktop, rows on phones; "New course" closed under the list. */
export function CoursesListV2({ courses, createForm }: { courses: CourseRowV2[]; /** Left out for a View Admin. */ createForm?: React.ReactNode }) {
  const published = courses.filter((c) => c.published).length;
  const st = (c: CourseRowV2) => <Status tone={c.published ? "ok" : "quiet"}>{c.published ? "Published" : "Draft"}</Status>;
  return (
    <AdminPage title="Courses" lead={`${published} published of ${courses.length}. Drafts are hidden from students.`}>
      {courses.length ? (
        <>
          <table className={cn(table.root, "hidden md:table")}>
            <thead>
              <tr>
                <th scope="col" className={table.th}>Course</th>
                <th scope="col" className={cn(table.th, "text-right")}>Lectures</th>
                <th scope="col" className={table.th}>Status</th>
                <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className={table.tr}>
                  <td className={table.td}><Link href={`/admin/courses/${c.id}`} className={nameLink}>{c.title}</Link></td>
                  <td className={cn(table.td, table.num)}>{c.lessons}</td>
                  <td className={cn(table.td, "whitespace-nowrap")}>{st(c)}</td>
                  <td className={cn(table.td, "text-right")}><span className="inline-flex justify-end">{c.actions}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Rows className="md:hidden">
            {courses.map((c) => (
              <li key={c.id} className="flex min-w-0 flex-col gap-1 py-1.5">
                <Link href={`/admin/courses/${c.id}`} className="-mx-2 flex min-h-14 min-w-0 flex-col justify-center gap-0.5 rounded-lg px-2 py-2 outline-none hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="type-body font-semibold [overflow-wrap:anywhere]">{c.title}</span>
                  <span className="flex flex-wrap items-center gap-x-3 type-small text-muted-foreground">
                    {c.lessons} lectures {st(c)}
                  </span>
                </Link>
                <span className="flex min-w-0 flex-wrap gap-2 pb-2 [&>div]:justify-start">{c.actions}</span>
              </li>
            ))}
          </Rows>
        </>
      ) : (
        <Empty>{createForm ? "No courses yet. Create the first one below." : "No courses yet."}</Empty>
      )}
      {createForm ? (
        <More summary="New course" className="max-w-xl">
          {createForm}
        </More>
      ) : null}
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* One course                                                        */
/* ---------------------------------------------------------------- */

export type LessonV2 = {
  id: string;
  number: number;
  title: string;
  status: { label: string; tone: Tone };
  video: { label: string; tone: Tone };
  /** Who can watch it: cohort chips and the Change control. */
  cohorts?: React.ReactNode;
  /** Assignment switch or a "needs setup" note. */
  assignment?: React.ReactNode;
  /** Upload, Watch, status, edit, move, delete: the same controls as before. */
  actions: React.ReactNode;
};

/**
 * One course (v2). One purpose: its lectures. The list comes first, grouped by
 * week (a table on wide screens, rows below 1024px). Adding a lecture, the
 * students and cohorts, and the course files are closed sections under it.
 */
export function CourseDetailV2({
  title,
  published,
  actions,
  filter,
  count,
  weeks,
  emptyText,
  addOpen,
  addForm,
  people,
  materials,
  materialCount,
}: {
  title: React.ReactNode;
  published: boolean;
  actions: React.ReactNode;
  filter?: React.ReactNode;
  count: string;
  weeks: { week: number; lessons: LessonV2[] }[];
  emptyText: string | null;
  addOpen: boolean;
  addForm: React.ReactNode;
  people: React.ReactNode;
  materials: React.ReactNode;
  materialCount: number;
}) {
  return (
    <AdminPage
      title={title}
      back={{ href: "/admin/courses", label: "Courses" }}
      lead={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <Status tone={published ? "ok" : "quiet"}>{published ? "Published" : "Draft"}</Status>
          <span>· {published ? "Students can see this course. Changes show up right away." : "Students cannot see this course until you publish it."}</span>
        </span>
      }
      actions={actions}
    >
      <details open={addOpen} className="group min-w-0 border-y border-[var(--ds-hairline)]">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 type-body font-semibold outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          Add a lecture
          <span aria-hidden className="text-muted-foreground transition-transform duration-[var(--ds-state)] group-open:rotate-90 motion-reduce:transition-none">›</span>
        </summary>
        <div className="min-w-0 pt-2 pb-5">{addForm}</div>
      </details>

      <Block title="Lectures" count={count}>
        {filter}
        {emptyText ? (
          <Empty>{emptyText}</Empty>
        ) : (
          weeks.map((w) => (
            <section key={w.week} aria-label={`Week ${w.week}`} className="flex min-w-0 flex-col pt-3">
              <h3 className="type-caption text-muted-foreground">Week {w.week}</h3>
              <table className={cn(table.root, "hidden table-fixed xl:table")}>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Lecture</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {w.lessons.map((l) => (
                    <tr key={l.id} className={table.tr}>
                      <td className={cn(table.td, "w-10 align-top text-muted-foreground type-num")}>{String(l.number).padStart(2, "0")}</td>
                      <td className={cn(table.td, "align-top")}>
                        <span className="block font-semibold [overflow-wrap:anywhere]">{l.title}</span>
                        {l.cohorts ? <span className="mt-1.5 flex flex-wrap items-center gap-2">{l.cohorts}</span> : null}
                      </td>
                      <td className={cn(table.td, "w-44 align-top")}>
                        <span className="flex flex-col items-start gap-1">
                          <Status tone={l.status.tone}>{l.status.label}</Status>
                          <Status tone={l.video.tone}>{l.video.label}</Status>
                          {l.assignment}
                        </span>
                      </td>
                      <td className={cn(table.td, "w-[26rem] align-top")}>
                        <span className="flex flex-wrap items-center justify-end gap-2">{l.actions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Rows className="border-t-0 xl:hidden">
                {w.lessons.map((l) => (
                  <RowItem key={l.id}>
                    <p className="type-body font-semibold [overflow-wrap:anywhere]">
                      <span className="mr-2 font-normal text-muted-foreground type-num">{String(l.number).padStart(2, "0")}</span>
                      {l.title}
                    </p>
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <Status tone={l.status.tone}>{l.status.label}</Status>
                      <Status tone={l.video.tone}>{l.video.label}</Status>
                      {l.assignment}
                    </span>
                    {l.cohorts ? <span className="flex flex-wrap items-center gap-2">{l.cohorts}</span> : null}
                    <span className="flex flex-wrap items-center gap-2">{l.actions}</span>
                  </RowItem>
                ))}
              </Rows>
            </section>
          ))
        )}
      </Block>

      <div className="flex min-w-0 flex-col">
        <More summary="Students and cohorts">{people}</More>
        <More summary={`Course files (${materialCount})`} className="mt-2">
          {materials}
        </More>
      </div>
    </AdminPage>
  );
}

/** All, one cohort, or not shared: one link per choice, as quiet chips. */
export function CohortFilterV2({ items }: { items: { key: string; label: string; href: string; on: boolean }[] }) {
  return (
    <nav aria-label="Show lectures for" className="flex min-w-0 flex-wrap gap-2">
      {items.map((i) => (
        <Link key={i.key} href={i.href} scroll={false} aria-current={i.on ? "page" : undefined} className={cn(btn.quiet, "whitespace-normal", i.on && "border-foreground bg-foreground text-background hover:bg-foreground")}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
