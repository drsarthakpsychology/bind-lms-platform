import { ArrowRight, BookOpen, Check, ChevronRight, Circle, Dumbbell, Flame, Play, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";

import { Hero, PageFrame, Row, RowList, Section } from "@/components/ds";
import { SheetRow } from "@/components/ds/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuestCard } from "@/lib/hints/server";
import { QUEST_XP } from "@/lib/hints/quests";
import type { ContinueStep, UpNextRow } from "./next-step";
import { HomeSaveLine } from "./home-save-line";

/**
 * Home, new design (ui_v2). One purpose: carry on. Top to bottom:
 *   1. a quiet greeting with the date
 *   2. Continue, the only hero (large title, thin progress line, one button)
 *   3. Today: one line (goal ring and streak); the quests open in a sheet
 *   4. Up next: at most three rows
 * Phones: one column that fits a 390x844 screen. From 768px: hero on the left
 * two thirds, Today and Up next in a narrow right column. No boxes.
 * Presentational; page.tsx loads the data.
 */

const UP_ICON = { lecture: Play, study: BookOpen, weak: Dumbbell, daily: Stethoscope } as const;

export type HomeV2Props = {
  adminPreview: boolean;
  welcomeBack: boolean;
  /** "Sat, 14 Nov" */
  dateLine: string;
  step: ContinueStep;
  /** 0 to 100 for the hero's thin line; null hides it. */
  progress: { pct: number; label: string } | null;
  /** Everything is finished and nothing new is open. */
  allDone: boolean;
  goal: { points: number; goal: number; streak: number } | null;
  quests: QuestCard | null;
  upNext: UpNextRow[];
  /** Sent here from a section that is switched off for this student. */
  sectionOff?: boolean;
};

/** A 28px ring: today's points against the goal. Lime arc on a hairline track. */
function GoalRing({ pct }: { pct: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 28 28" className="size-7 shrink-0 -rotate-90" aria-hidden>
      <circle cx="14" cy="14" r={r} fill="none" strokeWidth="4" className="stroke-[var(--ds-hairline)]" />
      <circle cx="14" cy="14" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="stroke-foreground dark:stroke-primary" />
    </svg>
  );
}

function Today({ goal, quests }: { goal: NonNullable<HomeV2Props["goal"]>; quests: QuestCard | null }) {
  const pct = Math.min(100, Math.round((goal.points / Math.max(1, goal.goal)) * 100));
  const hit = goal.points >= goal.goal;
  const questLine = quests ? (quests.done ? "quests done" : `${quests.quests.filter((q) => q.done).length} of 3 quests`) : null;
  const line = (
    <>
      <GoalRing pct={pct} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="type-body font-semibold type-num">{hit ? "Today's goal met" : `${Math.min(goal.points, goal.goal)} of ${goal.goal} points today`}</span>
        <span className="flex min-w-0 flex-wrap items-center gap-x-1 type-small text-muted-foreground type-num">
          <Flame className="size-4 shrink-0" aria-hidden />
          {goal.streak} day{goal.streak === 1 ? "" : "s"} in a row
          {questLine ? <span>· {questLine}</span> : null}
        </span>
      </span>
    </>
  );
  if (!quests) return <div className="flex min-h-14 min-w-0 items-center gap-3">{line}</div>;
  return (
    <SheetRow
      label={`Today: ${Math.min(goal.points, goal.goal)} of ${goal.goal} points, ${goal.streak} day streak. Open today's quests`}
      title="Today's quests"
      trigger={
        <>
          {line}
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        </>
      }
    >
      <ul className="flex flex-col divide-y divide-[var(--ds-hairline)]">
        {quests.quests.map((q) => (
          <li key={q.id} className="flex min-h-14 min-w-0 items-center gap-3">
            {q.done ? <Check className="size-5 shrink-0" aria-hidden /> : <Circle className="size-5 shrink-0 text-muted-foreground" aria-hidden />}
            {q.done ? (
              <span className="min-w-0 flex-1 type-body text-muted-foreground line-through decoration-foreground/30">{q.label}</span>
            ) : (
              <Link href={q.href} className="flex min-h-14 min-w-0 flex-1 items-center type-body font-semibold underline-offset-4 hover:underline">
                {q.label}
              </Link>
            )}
            {q.progress ? <span className="shrink-0 type-small text-muted-foreground type-num">{q.progress}</span> : null}
            <span className="sr-only">{q.done ? "Done" : "Not done yet"}</span>
          </li>
        ))}
      </ul>
      <p className="pt-4 type-small text-muted-foreground">
        {QUEST_XP} XP each. All three: {quests.xpBonus} XP more and {quests.spareBonus} spare hints.
      </p>
    </SheetRow>
  );
}

export function HomeV2({ adminPreview, welcomeBack, dateLine, step, progress, allDone, goal, quests, upNext, sectionOff = false }: HomeV2Props) {
  const hero = allDone
    ? { context: "All caught up", title: "Nothing left to do today.", meta: "Revise a weak topic or try a case while you wait for the next lecture.", href: "/practise", cta: "Practise" }
    : {
        context: !welcomeBack && step.kind === "lecture" ? "Start your first lecture" : step.eyebrow,
        title: step.title,
        meta: step.meta,
        href: step.href,
        cta: step.cta,
      };
  return (
    <PageFrame className="gap-6 md:gap-[var(--ds-section)]">
      <div className="flex flex-col gap-1">
        {adminPreview ? (
          <p className="flex items-center gap-2 type-small text-muted-foreground">
            <Sparkles className="size-4 shrink-0" aria-hidden /> You are seeing what students see.
          </p>
        ) : null}
        <h1 className="type-small text-muted-foreground">
          {welcomeBack ? "Welcome back" : "Welcome to VIBHA"} <span aria-hidden>·</span> <span className="type-num">{dateLine}</span>
        </h1>
        {sectionOff ? (
          <p role="status" className="type-small font-semibold">
            That section is not open for you. Ask the VIBHA team if you need it.
          </p>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-12">
        <Hero
          context={hero.context}
          title={hero.title}
          meta={hero.meta}
          progress={!allDone && progress && progress.pct > 0 ? progress.pct : undefined}
          progressLabel={progress?.label}
          action={{ href: hero.href, label: hero.cta, icon: <ArrowRight /> }}
          below={<HomeSaveLine />}
        />

        <div className="flex min-w-0 flex-col gap-6">
          {goal ? (
            <Section id="today" title="Today">
              <div className="border-y border-[var(--ds-hairline)]">
                <Today goal={goal} quests={quests} />
              </div>
            </Section>
          ) : null}

          {upNext.length ? (
            <Section id="up-next" title="Up next">
              <RowList>
                {upNext.map((r) => {
                  const Icon = UP_ICON[r.kind];
                  return <Row key={r.kind} href={r.href} icon={<Icon />} title={r.title} meta={r.meta} />;
                })}
              </RowList>
            </Section>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}

/** Home while it loads: the hero and three rows, in their real places. */
export function HomeV2Skeleton() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-1 sm:px-0 md:gap-[var(--ds-section)]">
      <Skeleton className="border-0 h-5 w-48" />
      <div className="grid min-w-0 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="border-0 h-5 w-32" />
          <Skeleton className="border-0 h-10 w-full max-w-md" />
          <Skeleton className="border-0 h-10 w-2/3 max-w-sm" />
          <Skeleton className="border-0 h-1.5 w-full rounded-full" />
          <Skeleton className="border-0 h-[3.25rem] w-full rounded-[var(--ds-radius)] md:w-60" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="border-0 h-6 w-20" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="border-0 h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
