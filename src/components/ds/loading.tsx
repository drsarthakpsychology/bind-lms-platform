import * as React from "react";
import { SlowState } from "@/components/design-system/slow-state";
import { cn } from "@/lib/utils";
import s from "./loading.module.css";

/**
 * Loading screens in the new design (route loading.tsx files). Each one is the
 * shape of the screen being opened, so nothing jumps when it lands: the same
 * width, title, rows and reading column. Shapes are soft fills with no
 * borders. The one brand moment is the lime stroke under the title, drawn
 * once. Nothing loops; after a few seconds a quiet line says it is slow, and
 * later offers Try again (SlowState).
 */

/** One grey shape. Width and height are Tailwind classes or inline sizes. */
export function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden className={cn(s.bone, className)} style={style} />;
}

/** The page title: real words when the screen's title is known, a bar when not. Always with the lime stroke. */
function Title({ text, lines = 1, className }: { text?: string; lines?: 1 | 2; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      {text ? (
        <p aria-hidden className="type-h1">
          {text}
        </p>
      ) : (
        <div className="flex flex-col gap-2 py-1">
          <Bone className="h-7 w-[min(18rem,80%)] md:h-8" />
          {lines === 2 ? <Bone className="h-7 w-[min(11rem,55%)] md:h-8" /> : null}
        </div>
      )}
      <span aria-hidden className={s.stroke} />
    </div>
  );
}

const WIDTHS = [72, 54, 80, 46, 64, 58, 76, 50];

/** Rows with hairlines between them (the shape of RowList). */
function Rows({ n = 5, lead = false, sub = false, columns = false, className }: { n?: number; lead?: boolean; sub?: boolean; columns?: boolean; className?: string }) {
  return (
    <ul aria-hidden className={cn("min-w-0 border-t border-[var(--ds-hairline)]", columns && "md:grid md:grid-cols-2 md:gap-x-12 md:border-t-0", className)}>
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className={cn("flex min-h-14 items-center gap-4 border-b border-[var(--ds-hairline)] py-3", columns && i < 2 && "md:border-t")}>
          {lead ? <Bone className="h-4 w-6 shrink-0" /> : null}
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <Bone className="h-4" style={{ width: `${WIDTHS[i % WIDTHS.length]}%` }} />
            {sub ? <Bone className={cn("h-3", s.soft)} style={{ width: `${WIDTHS[(i + 3) % WIDTHS.length] - 20}%` }} /> : null}
          </span>
          <Bone className="h-4 w-4 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

/** Lines of reading text (17/28 on phones, 18/30 from 768px). */
function Lines({ n = 6, className }: { n?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-[0.8rem] md:gap-[0.85rem]", className)}>
      {Array.from({ length: n }).map((_, i) => (
        <Bone key={i} className="h-[0.95rem]" style={{ width: i === n - 1 ? "58%" : `${[100, 97, 99, 94, 98, 92][i % 6]}%` }} />
      ))}
    </div>
  );
}

/** A small heading over a group (Section). */
function Heading({ w = "8rem" }: { w?: string }) {
  return <Bone className="h-5" style={{ width: w }} />;
}

/** The Continue block (NextStep): a quiet label, the title, the thin line, the one lime-button shape. */
function Next({ wide = false }: { wide?: boolean }) {
  return (
    <div aria-hidden className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-6 w-[min(22rem,85%)]" />
      </div>
      <Bone className="h-1.5 w-full rounded-full" />
      <Bone className={cn("h-[3.25rem] w-full rounded-[var(--ds-radius)]", !wide && "md:w-72")} />
    </div>
  );
}

/** The frame every loading screen shares: aria-busy, the slow line, page width. */
function Frame({ width = "default", className, children }: { width?: "reading" | "default" | "wide"; className?: string; children: React.ReactNode }) {
  return (
    <div aria-busy="true" className={cn("mx-auto flex w-full min-w-0 flex-col gap-[var(--ds-section)] px-1 sm:px-0", width === "reading" ? "max-w-[44rem]" : width === "wide" ? "max-w-7xl" : "max-w-5xl", className)}>
      <SlowState className="rounded-none border-0 bg-transparent px-0 py-0" />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- screens */

/** A hub or list (Learn, Practise, Prep): the title, then groups of rows. */
export function HubLoading({ title, groups = 2 }: { title?: string; groups?: number }) {
  return (
    <Frame>
      <Title text={title} />
      {Array.from({ length: groups }).map((_, g) => (
        <div key={g} className="flex min-w-0 flex-col gap-3">
          <Heading w={g ? "6rem" : "9rem"} />
          <Rows n={g ? 3 : 4} />
        </div>
      ))}
    </Frame>
  );
}

/** /study: the Continue block, then the modules as numbered rows on shelves (two columns from 768px). */
export function StudyHomeLoading() {
  return (
    <Frame>
      <Title text="Study" />
      <Next />
      {[0, 1].map((k) => (
        <div key={k} className="flex min-w-0 flex-col gap-3">
          <Heading w={k ? "7rem" : "10rem"} />
          <Rows n={k ? 4 : 6} lead columns />
        </div>
      ))}
    </Frame>
  );
}

/** /study/[module]: the way back, the title, Next, the four steps, then the sections as rows. */
export function ModuleLoading() {
  return (
    <Frame width="reading" className="!gap-8 md:!gap-10">
      <div className="flex min-w-0 flex-col gap-2">
        <Bone className="h-4 w-16" />
        <Bone className="h-3.5 w-20" />
        <Title lines={2} />
        <Bone className={cn("h-4 w-[90%]", s.soft)} />
      </div>
      <Next />
      <div aria-hidden className="flex h-12 items-center gap-5 border-b border-[var(--ds-hairline)]">
        {[10, 11, 12, 8].map((w, i) => (
          <Bone key={i} className="h-4" style={{ width: `${w * 0.3}rem` }} />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <Heading w="9rem" />
        <Rows n={7} lead />
      </div>
    </Frame>
  );
}

/** /study/[module]/[section]: the section list rail on desktop, the title, the toolbar, reading text. */
export function ReaderLoading() {
  return (
    <div aria-busy="true" className="mx-auto w-full min-w-0 max-w-6xl px-1 sm:px-0 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
      <aside aria-hidden className="hidden flex-col gap-3 md:flex">
        <Bone className="h-4 w-24" />
        <Bone className={cn("h-3.5 w-20", s.soft)} />
        <div className="mt-2 flex flex-col gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Bone key={i} className="h-3.5" style={{ width: `${WIDTHS[i % WIDTHS.length] + 10}%` }} />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <SlowState className="mb-4 rounded-none border-0 bg-transparent px-0 py-0" />
        <div aria-hidden className="mb-2 flex items-center justify-between md:hidden">
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-24" />
        </div>
        <div className="mb-8 flex max-w-[68ch] min-w-0 flex-col gap-3">
          <Bone className={cn("h-3.5 w-40", s.soft)} />
          <Title lines={2} />
          <div aria-hidden className="flex items-center gap-1">
            {[0, 1, 2, 3].map((k) => (
              <Bone key={k} className="h-1 flex-1 rounded-full" />
            ))}
          </div>
          <div aria-hidden className="flex items-center gap-2">
            <Bone className="h-11 flex-1 rounded-lg sm:w-56 sm:flex-none" />
            <Bone className="h-11 w-11 rounded-lg sm:w-28" />
            <Bone className="h-11 w-11 rounded-lg sm:w-28" />
          </div>
        </div>
        <div className="flex max-w-[68ch] flex-col gap-8">
          <Lines n={5} />
          <Bone className="h-5 w-48" />
          <Lines n={6} />
        </div>
      </div>
    </div>
  );
}

/** One question at a time (checkpoints, module tests, smart practice): progress, the question, options as rows. */
export function QuestionLoading({ title }: { title?: string }) {
  return (
    <Frame width="reading">
      <div className="flex min-w-0 flex-col gap-4">
        <div aria-hidden className="flex items-center justify-between">
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-12" />
        </div>
        {title ? <Title text={title} /> : null}
        <Bone className="h-1.5 w-full rounded-full" />
      </div>
      <div aria-hidden className="flex flex-col gap-2.5">
        <Bone className="h-5 w-full" />
        <Bone className="h-5 w-[86%]" />
        <Bone className="h-5 w-[48%]" />
      </div>
      <Rows n={4} />
      <Bone className="h-[3.25rem] w-full rounded-[var(--ds-radius)] md:w-72" />
    </Frame>
  );
}

/** /study/notes: the way back, the title, the summaries grouped as rows. */
export function NotesLoading() {
  return (
    <Frame width="reading">
      <div className="flex min-w-0 flex-col gap-1">
        <Bone className="h-4 w-14" />
        <Title text="One-page summaries" />
      </div>
      {[0, 1].map((k) => (
        <div key={k} className="flex min-w-0 flex-col gap-3">
          <Heading w={k ? "12rem" : "14rem"} />
          <Rows n={k ? 3 : 4} sub />
        </div>
      ))}
    </Frame>
  );
}

/** /study/notes/[id]: an editorial summary page. */
export function NoteLoading() {
  return (
    <Frame width="reading">
      <div className="flex min-w-0 flex-col gap-2">
        <Bone className="h-4 w-20" />
        <Title />
        <Bone className={cn("h-4 w-[75%]", s.soft)} />
        <Bone className="mt-2 h-11 w-[min(16rem,100%)] rounded-lg" />
      </div>
      <div aria-hidden className="flex flex-col gap-3 rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4 sm:p-5">
        <Bone className="h-3 w-20" />
        <Lines n={3} />
      </div>
      {[0, 1].map((k) => (
        <div key={k} className="flex min-w-0 flex-col gap-4">
          <Heading w={k ? "8rem" : "11rem"} />
          <Lines n={k ? 3 : 4} />
        </div>
      ))}
    </Frame>
  );
}

/** A lecture: the video edge to edge on phones, the title, the tabs, the about text; the lecture list on wide screens. */
export function LectureLoading() {
  return (
    <div aria-busy="true" className="mx-auto grid w-full min-w-0 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div aria-hidden className={s.screen} />
        <SlowState className="rounded-none border-0 bg-transparent px-0 py-0" />
        <Bone className="h-4 w-40" />
        <div className="flex min-w-0 flex-col gap-2">
          <Bone className={cn("h-3.5 w-24", s.soft)} />
          <Title lines={2} />
        </div>
        <div aria-hidden className="flex h-12 items-center gap-6 border-b border-[var(--ds-hairline)]">
          <Bone className="h-4 w-14" />
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-24" />
        </div>
        <Lines n={4} className="mt-2" />
      </div>
      <aside aria-hidden className="hidden flex-col gap-3 lg:flex">
        <Heading w="7rem" />
        <Rows n={6} lead />
      </aside>
    </div>
  );
}

/** A course: the title, Continue, then the lectures by week as rows. */
export function CourseLoading() {
  return (
    <Frame>
      <div className="flex min-w-0 flex-col gap-2">
        <Bone className="h-4 w-20" />
        <Title lines={2} />
      </div>
      <div className="grid min-w-0 gap-[var(--ds-section)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="order-2 flex min-w-0 flex-col gap-8 lg:order-1">
          {[0, 1].map((k) => (
            <div key={k} className="flex min-w-0 flex-col gap-3">
              <Heading w="5rem" />
              <Rows n={3} lead sub />
            </div>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <Next wide />
        </div>
      </div>
    </Frame>
  );
}
