import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Clock, MessagesSquare, RotateCcw, Settings2, Target, Zap, type LucideIcon } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { EXAM_TRACKS_ENABLED, PREP_TITLE, goalLabel } from "@/lib/prep/catalog";
import { loadPath } from "@/lib/prep/path";
import type { NextAction } from "@/lib/prep/plan";
import { cn } from "@/lib/utils";
import { GoalPicker } from "./goal-picker";
import { btnInk, btnPlain, card, PrepFrame, PrepHero, StatusTag } from "./ui";
import { cookieGoal, prepViewer } from "./viewer";

export const metadata: Metadata = { title: PREP_TITLE, description: "One course for CUET-PG, UGC-NET and clinical psychology entrances (M.Clin.Psy): every subject, from foundations to advanced." };

const ICON: Record<NextAction["kind"], LucideIcon> = { goal: Target, diagnostic: ClipboardList, topic: Zap, review: RotateCcw, mock: Clock, interview: MessagesSquare };

/**
 * /prep: Psychology Entrance & Competitive Exam Preparation. One shared
 * course for CUET-PG, UGC-NET and the clinical entrances: starting check →
 * plan → learn → practise → mocks → interview → review. Subject mastery
 * first; exam tracks (the goal picker) only with EXAM_TRACKS_ENABLED. The
 * screen only ever shows the next 1 to 3 steps; the full plan sits behind
 * "See full plan".
 */
export default async function PrepPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const path = await loadPath(me.id, await cookieGoal(me.id));
  const goal = path.profile.goal;

  // Exam tracks only: pick an exam first. Off, nobody is asked.
  if (EXAM_TRACKS_ENABLED && !goal) {
    return (
      <PrepFrame>
        <PrepHero eyebrow="Exam Prep" />
        <section aria-labelledby="pick" className="space-y-3">
          <h2 id="pick" className="text-h2">
            Which exam are you preparing for?
          </h2>
          <p className="text-muted-foreground">We&apos;ll build one clear plan for it. You can change this later.</p>
          <GoalPicker current={null} />
        </section>
      </PrepFrame>
    );
  }

  const [first, ...rest] = path.actions;

  return (
    <PrepFrame>
      <PrepHero eyebrow={goal ? `Exam Prep · ${goalLabel(goal)}` : "Exam Prep · One course"}>
        <p className="text-muted-foreground">{goal ? "Your plan follows this exam." : "The same course for all three. Learn every subject first, then practise for the exam."}</p>
      </PrepHero>

      <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-foreground pt-5">
        <h2 className="text-h2">{path.diagnosed ? "Your next steps" : "Start here"}</h2>
        {goal ? (
          <Link href="/prep/goal" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline">
            <Settings2 className="size-4" aria-hidden /> Change exam
          </Link>
        ) : null}
      </div>

      {!me.learner ? <p className="rounded-md border-2 border-dashed border-foreground/50 p-3 text-sm text-muted-foreground">Staff preview: answers are not saved to a student record.</p> : null}

      {path.bankSize === 0 ? (
        <div className={card}>
          <p className="font-semibold">Questions are being added.</p>
          <p className="mt-1 text-muted-foreground">Your plan, practice and mocks open here as soon as the first questions land.</p>
        </div>
      ) : null}

      {first ? (
        <section aria-labelledby="next" className="space-y-3">
          <h3 id="next" className="sr-only">
            Next steps
          </h3>
          <ActionCard action={first} primary />
          {rest.length ? (
            <ul className="space-y-3">
              {rest.map((a) => (
                <li key={a.kind === "topic" ? a.subject : a.kind}>
                  <ActionCard action={a} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {path.diagnosed && path.plan.length ? (
        <details className="group rounded-md border-2 border-foreground bg-card">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
            See full plan
            <ArrowRight className="size-4 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none" aria-hidden />
          </summary>
          <div className="space-y-5 border-t-2 border-foreground px-4 pt-4 pb-5">
            <p className="text-sm text-muted-foreground">{goal ? "Weakest and biggest topics first. Share: how much of your exam it covers." : "Every subject the exams ask. Weakest and most tested first. Share: how much of the exams it covers."}</p>
            <ol className="space-y-2.5">
              {path.plan.map((t, i) => (
                <li key={t.subject} className="rounded-md border-2 border-foreground/80 p-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-sm text-link">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1 font-semibold">{t.title}</span>
                    <StatusTag status={t.status} />
                  </div>
                  <p className="mt-1 text-caption text-muted-foreground">
                    Share {Math.max(1, Math.round(t.weight * 100))}%{t.n ? ` · ${t.n} answered` : ""}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link href={t.learnHref} className={btnPlain}>
                      <BookOpen className="size-4" aria-hidden /> Learn
                    </Link>
                    <Link href={`/prep/practice/${t.subject}`} className={btnPlain}>
                      <Zap className="size-4" aria-hidden /> Practise
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
            <div className="space-y-2 border-t-2 border-dashed border-foreground/40 pt-4">
              <p className="text-eyebrow text-muted-foreground">Also here</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <Link href="/prep/mock" className={btnPlain}>
                  <Clock className="size-4" aria-hidden /> Timed mocks
                </Link>
                <Link href="/prep/interview" className={btnPlain}>
                  <MessagesSquare className="size-4" aria-hidden /> Mock interview
                </Link>
                <Link href="/prep/review" className={btnPlain}>
                  <RotateCcw className="size-4" aria-hidden /> Review{path.due ? ` (${path.due})` : ""}
                </Link>
              </div>
            </div>
          </div>
        </details>
      ) : null}
    </PrepFrame>
  );
}

function ActionCard({ action, primary = false }: { action: NextAction; primary?: boolean }) {
  const Icon = ICON[action.kind];
  const shell = cn("rounded-md border-2 border-foreground p-4 sm:p-5", primary ? "bg-primary text-primary-foreground hard-shadow-md" : "bg-card");
  const head = (
    <div className="flex items-start gap-3">
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-md border-2 border-foreground", primary ? "bg-card text-foreground" : "bg-secondary")} aria-hidden>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block font-semibold leading-tight", primary ? "text-xl sm:text-2xl" : "text-lg")}>{action.title}</span>
        <span className={cn("mt-0.5 block text-sm", primary ? "opacity-85" : "text-muted-foreground")}>{action.why}</span>
      </span>
    </div>
  );
  if (action.kind === "topic") {
    const learn = (
      <Link href={action.learnHref} className={primary && action.learnFirst ? btnInk : btnPlain}>
        <BookOpen className="size-4" aria-hidden /> Learn
      </Link>
    );
    const practise = (
      <Link href={action.practiceHref} className={primary && !action.learnFirst ? btnInk : btnPlain}>
        <Zap className="size-4" aria-hidden /> Practise
      </Link>
    );
    return (
      <div className={shell}>
        {head}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {action.learnFirst ? learn : practise}
          {action.learnFirst ? practise : learn}
        </div>
      </div>
    );
  }
  return (
    <div className={shell}>
      {head}
      <Link href={action.href} className={cn(primary ? btnInk : btnPlain, "mt-4 w-full")}>
        {action.kind === "diagnostic" ? "Start" : action.kind === "review" ? "Review now" : action.kind === "mock" ? "Choose a mock" : action.kind === "interview" ? "Start the interview" : "Go"} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
