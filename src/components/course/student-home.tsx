import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, FileText, MessageCircle, PlayCircle } from "lucide-react";

import {
  ContinueCard,
  LectureCard,
  ProgressCard,
  Row,
  type OverviewModel,
} from "@/components/course/course-overview-view";
import { Badge } from "@/components/ui/badge";
import { LEGAL } from "@/lib/legal-constants";

/**
 * Student Home — answers "what do I do today?" in one scroll, the way a
 * video/learning app's home does: continue watching, this week's shelf,
 * work that's due, then practice and help.
 */
export function StudentHome({
  model,
  otherCourses = [],
  practice,
}: {
  model: OverviewModel;
  otherCourses?: { id: string; title: string }[];
  practice?: React.ReactNode;
}) {
  const thisWeek =
    model.weeks.find((w) => w.isCurrent) ?? model.weeks.find((w) => w.status !== "complete") ?? model.weeks[0];
  const due = model.weeks
    .flatMap((w) => w.assignments.map((a) => ({ ...a, week: w.num })))
    .filter((a) => a.status === "not_started" && a.href);
  const left = model.totalLessons - model.completedCount;
  const wa = `https://wa.me/${LEGAL.phone.replace(/[^\d]/g, "")}`;

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-eyebrow text-link">Home</p>
        <h1 className="text-display">{model.started ? "Welcome back." : "Welcome to VIBHA."}</h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          {model.totalLessons === 0
            ? "Your lectures will appear here as soon as they open."
            : left === 0
              ? "You've watched every lecture that's open. New ones appear here first."
              : model.started
                ? `${left} lecture${left === 1 ? "" : "s"} left in ${model.title}. Pick up where you stopped.`
                : `Start with lecture one of ${model.title}. Each one takes about an hour.`}
        </p>
      </header>

      <section aria-label="Continue" className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <ContinueCard model={model} />
        <ProgressCard model={model} />
      </section>

      {thisWeek && thisWeek.lessons.length > 0 ? (
        <section aria-labelledby="this-week" className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-eyebrow text-link">Week {thisWeek.num}</p>
              <h2 id="this-week" className="text-h1">
                This week
              </h2>
            </div>
            <Link
              href={`/courses/${model.courseId}`}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-bold text-link underline-offset-4 hover:underline"
            >
              All lectures <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          {/* A horizontal shelf on phones, a grid on bigger screens. */}
          <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
            {thisWeek.lessons.map((l) => (
              <li key={l.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
                <LectureCard lesson={l} tile />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="to-do" className="space-y-3">
          <h2 id="to-do" className="flex items-center gap-2 text-h2">
            <ClipboardList className="size-5" aria-hidden /> To do
          </h2>
          {due.length ? (
            <ul className="space-y-2">
              {due.map((a) => (
                <li key={a.id}>
                  <Row
                    href={a.href}
                    highlight={a.isNext}
                    icon={<FileText className="size-5" aria-hidden />}
                    title={a.title}
                    meta={`Week ${a.week} · ${a.lessonTitle}`}
                    badge={<Badge variant="outline">To do</Badge>}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-3 rounded-xl border-2 border-dashed border-foreground/30 p-4 text-sm font-semibold text-muted-foreground">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden /> Nothing due. You&apos;re all caught up.
            </p>
          )}
        </section>

        <section aria-labelledby="help" className="space-y-3">
          <h2 id="help" className="flex items-center gap-2 text-h2">
            <MessageCircle className="size-5" aria-hidden /> Need help?
          </h2>
          <div className="space-y-3 rounded-2xl border-2 border-foreground bg-brand p-5 text-brand-foreground hard-shadow-sm">
            <p className="text-body font-semibold">
              Video not playing, a login problem, or a question about your batch? Message us on WhatsApp.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 max-w-full flex-wrap items-center gap-x-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px active:shadow-none"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp {LEGAL.phone}
            </a>
          </div>
        </section>
      </div>

      {practice}

      {otherCourses.length > 0 ? (
        <section aria-labelledby="other-courses" className="space-y-3">
          <h2 id="other-courses" className="text-h2">Your other courses</h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {otherCourses.map((c) => (
              <li key={c.id}>
                <Row href={`/courses/${c.id}`} icon={<PlayCircle className="size-5" aria-hidden />} title={c.title} meta="Open lectures" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
