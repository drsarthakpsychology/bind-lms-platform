import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Clock, MessagesSquare, RotateCcw, Settings2, Target, Zap, type LucideIcon } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { goalLabel } from "@/lib/prep/catalog";
import { loadPath } from "@/lib/prep/path";
import type { NextAction } from "@/lib/prep/plan";
import { cn } from "@/lib/utils";
import { GoalPicker } from "./goal-picker";
import { btnInk, btnPlain, card, PrepFrame, StatusTag } from "./ui";
import { cookieGoal, prepViewer } from "./viewer";

export const metadata: Metadata = { title: "Prep" };

const ICON: Record<NextAction["kind"], LucideIcon> = { goal: Target, diagnostic: ClipboardList, topic: Zap, review: RotateCcw, mock: Clock, interview: MessagesSquare };

/**
 * /prep: one pathway (goal → starting check → plan → learn → practise → mocks
 * → interview → review). The screen only ever shows the next 1–3 steps; the
 * full plan sits behind "See full plan".
 */
export default async function PrepPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const path = await loadPath(me.id, await cookieGoal(me.id));
  const goal = path.profile.goal;

  if (!goal) {
    return (
      <PrepFrame>
        <header className="space-y-2">
          <p className="text-eyebrow text-link">Prep</p>
          <h1 className="text-h1">Which exam are you preparing for?</h1>
          <p className="text-muted-foreground">We&apos;ll build one clear plan for it. You can change this later.</p>
        </header>
        <GoalPicker current={null} />
      </PrepFrame>
    );
  }

  const [first, ...rest] = path.actions;

  return (
    <PrepFrame>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-eyebrow text-link">Prep · {goalLabel(goal)}</p>
          <h1 className="text-h1">{path.diagnosed ? "Your next steps" : "Start here"}</h1>
        </div>
        <Link href="/prep/goal" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline">
          <Settings2 className="size-4" aria-hidden /> Change exam
        </Link>
      </header>

      {!me.learner ? <p className="rounded-md border-2 border-dashed border-foreground/50 p-3 text-sm text-muted-foreground">Staff preview: answers are not saved to a student record.</p> : null}

      {path.bankSize === 0 ? (
        <div className={card}>
          <p className="font-semibold">Questions are being added.</p>
          <p className="mt-1 text-muted-foreground">Your plan, practice and mocks open here as soon as the first questions land.</p>
        </div>
      ) : null}

      {first ? (
        <section aria-labelledby="next" className="space-y-3">
          <h2 id="next" className="sr-only">
            Next steps
          </h2>
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
            <p className="text-sm text-muted-foreground">Weakest and biggest topics first. Share = how much of the exam it covers.</p>
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
