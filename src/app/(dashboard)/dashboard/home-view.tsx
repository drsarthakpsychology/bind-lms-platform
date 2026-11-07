import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Dumbbell, FileText, Flame, Play, RotateCcw, Sparkles, Stethoscope, TrendingDown, TrendingUp } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { cn } from "@/lib/utils";
import { pct, type StrengthsWeaknesses, type TopicScore } from "@/lib/progress/strengths-core";
import type { ContinueKind, ContinueStep } from "./next-step";

/**
 * Home, three blocks and nothing else (plan section 8): one Continue card,
 * today's goal, and the three strongest and three weakest topics.
 * Server-rendered and presentational; the page loads the data.
 */

const KIND_ICON: Record<ContinueKind, typeof Play> = {
  retest: RotateCcw,
  lecture: Play,
  assignment: FileText,
  study: BookOpen,
  weak: Dumbbell,
  daily: ClipboardList,
  lectures: Play,
};

/** The one obvious next step: the only filled (action) card on Home. */
export function ContinueCard({ step }: { step: ContinueStep }) {
  const Icon = KIND_ICON[step.kind];
  return (
    <Link
      href={step.href}
      prefetch
      className="group/continue flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none sm:flex-row sm:items-center sm:p-6"
    >
      <span className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-card text-foreground sm:size-14">
          <Icon className="size-6 sm:size-7" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-eyebrow opacity-80">{step.eyebrow}</span>
          <span className="text-h2 line-clamp-3 [overflow-wrap:anywhere]">{step.title}</span>
          {step.meta ? <span className="text-sm font-semibold opacity-80 [overflow-wrap:anywhere]">{step.meta}</span> : null}
        </span>
      </span>
      <span className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-lg border-2 border-foreground bg-card px-5 text-sm font-bold text-foreground transition-transform duration-fast ease-snappy group-hover/continue:translate-x-0.5">
        {step.cta} <ArrowRight className="size-4" aria-hidden />
      </span>
    </Link>
  );
}

/** Today's points against the daily goal, and the streak. Information only: no second button. */
export function GoalCard({ points, goal, streak }: { points: number; goal: number; streak: number }) {
  const done = Math.min(100, Math.round((points / Math.max(1, goal)) * 100));
  const hit = points >= goal;
  return (
    <section aria-labelledby="goal" className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-foreground bg-card p-5 hard-shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="goal" className="text-eyebrow text-link">
            Today&apos;s goal
          </h2>
          <p className="mt-1 text-3xl font-bold tabular-nums leading-none">
            {Math.min(points, goal)}
            <span className="text-lg text-muted-foreground">/{goal} points</span>
          </p>
        </div>
        <p className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-foreground px-2.5 py-1 text-caption font-bold tabular-nums">
          <Flame className="size-3.5" aria-hidden /> {streak} day{streak === 1 ? "" : "s"}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Today's goal"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-3 overflow-hidden rounded-full border-2 border-foreground bg-muted"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${done}%` }} />
      </div>
      {hit ? <p className="text-sm text-muted-foreground">Goal met. See you tomorrow.</p> : null}
    </section>
  );
}

function TopicRow({ t, weak }: { t: TopicScore; weak: boolean }) {
  const link = "inline-flex min-h-11 items-center gap-1 rounded-lg border-2 px-3 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-xs active:translate-y-px active:shadow-none";
  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-xl border-2 border-foreground/15 p-3 sm:flex-row sm:items-center sm:gap-3">
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={cn(
            "shrink-0 rounded-md border-2 border-foreground px-1.5 py-0.5 font-mono text-caption font-bold tabular-nums",
            weak ? "bg-card" : "bg-status-success-bg text-status-success-fg",
          )}
        >
          {pct(t.p)}%
        </span>
        <span className="min-w-0 font-bold leading-tight [overflow-wrap:anywhere]">{t.title}</span>
      </span>
      <span className="flex shrink-0 flex-wrap gap-2">
        {t.studyHref ? (
          <Link href={t.studyHref} className={cn(link, "border-foreground/30 bg-card")}>
            <BookOpen className="size-4" aria-hidden /> Study
          </Link>
        ) : null}
        <Link href={t.practiceHref} className={cn(link, weak ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>
          <Stethoscope className="size-4" aria-hidden /> Practise
        </Link>
      </span>
    </li>
  );
}

/** Three strongest and three weakest topics. Quiet note until there is evidence. */
export function TopicsCard({ data }: { data: StrengthsWeaknesses }) {
  if (!data.hasData) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-4 text-sm font-semibold text-muted-foreground">
        Your strongest and weakest topics show up here after a few quizzes.
      </p>
    );
  }
  return (
    <section aria-label="Your topics" className="grid min-w-0 gap-5 lg:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <h2 className="flex items-center gap-2 text-h3">
          <TrendingDown className="size-5 shrink-0" aria-hidden /> Needs work
        </h2>
        {data.weakest.length ? (
          <ul className="space-y-2">
            {data.weakest.map((t) => (
              <TopicRow key={t.id} t={t} weak />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing weak right now.</p>
        )}
      </div>
      <div className="min-w-0 space-y-3">
        <h2 className="flex items-center gap-2 text-h3">
          <TrendingUp className="size-5 shrink-0" aria-hidden /> Strongest
        </h2>
        {data.strongest.length ? (
          <ul className="space-y-2">
            {data.strongest.map((t) => (
              <TopicRow key={t.id} t={t} weak={false} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Keep going. Strengths show at 60% and up.</p>
        )}
      </div>
    </section>
  );
}

/** The whole Home page body (the page only loads data). */
export function HomeBody({
  adminPreview,
  welcomeBack,
  step,
  goal,
  strengths,
  whatsappHref,
}: {
  adminPreview: boolean;
  welcomeBack: boolean;
  step: ContinueStep;
  /** Null when Study is locked (no points to count yet). */
  goal: { points: number; goal: number; streak: number } | null;
  /** Null when Study is locked. */
  strengths: StrengthsWeaknesses | null;
  whatsappHref: string;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {adminPreview ? (
        <Alert variant="warning" className="border-foreground hard-shadow-sm">
          <Sparkles className="size-4" aria-hidden />
          <AlertTitle>You&apos;re seeing what students see</AlertTitle>
          <AlertDescription>Use &ldquo;Back to admin&rdquo; at the top to return.</AlertDescription>
        </Alert>
      ) : null}

      <header>
        <p className="text-eyebrow text-link">Home</p>
        <h1 className="text-h1">{welcomeBack ? "Welcome back." : "Welcome to VIBHA."}</h1>
      </header>

      {goal ? (
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <ContinueCard step={step} />
          <GoalCard points={goal.points} goal={goal.goal} streak={goal.streak} />
        </div>
      ) : (
        <ContinueCard step={step} />
      )}

      {strengths ? <TopicsCard data={strengths} /> : null}

      <p className="text-sm text-muted-foreground">
        Stuck on a login or a video?{" "}
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-bold text-link underline-offset-4 hover:underline">
          Message us on WhatsApp
        </a>
      </p>
    </div>
  );
}
