import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Compass, Repeat2, Shuffle, Zap } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { MODULES } from "@/lib/study";
import { loadStudentMap } from "@/lib/learn/model/server";
import { answersToCalibrate, CALIBRATION_ANSWERS } from "@/lib/learn/model/elo";
import { MASTERY_LABEL, MASTERY_STATES } from "@/lib/learn/model/mastery";
import { COMPETENCY_LABEL, topicById } from "@/lib/learn/model/topics";
import { COMPETENCIES } from "@/lib/learn/model/skills";
import type { TopicLevel } from "@/lib/learn/model/placement";
import { PREP_ONBOARDING_ENABLED } from "@/lib/prep/catalog";
import { cn } from "@/lib/utils";
import { STATE_ICON, StateTag, btnPlain, btnPrimary, stateTone } from "./ui";
import { PageHeader } from "@/components/design-system/page-header";

export const metadata: Metadata = { title: "Your map" };

const LEVEL_WORD: Record<TopicLevel, string> = { strong: "strong", okay: "getting there", weak: "work on this" };

/** /study/map: strengths and weak spots, topic by skill. Updates after every graded answer. */
export default async function MapPage() {
  await requireFeature("learn");
  const session = await getSession();
  const isLearner = session.status === "ok" && (session.profile.role === "student" || session.profile.role === "alumni");
  const titles = Object.fromEntries(MODULES.map((m) => [m.id, m.title]));
  const data = await loadStudentMap(isLearner && session.status === "ok" ? session.profile.id : "", titles);
  const placed = new Map(PREP_ONBOARDING_ENABLED ? (data.placement?.topics ?? []).map((t) => [t.topic, t.level]) : []);
  const left = answersToCalibrate(data.graded);
  const fresh = PREP_ONBOARDING_ENABLED && data.graded === 0 && !data.placement;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link href="/study" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Study
      </Link>
      <PageHeader eyebrow="Study" title="What you know, and what to fix" className="pb-0" />

      {!isLearner ? <p className="rounded-md border-2 border-foreground bg-status-pending-bg p-3 text-sm font-semibold">Preview: staff accounts have no map of their own.</p> : null}

      {fresh ? (
        <section className="flex flex-col gap-4 rounded-lg border-2 border-foreground bg-brand p-5 text-brand-foreground hard-shadow-md sm:flex-row sm:items-center sm:p-6">
          <Compass className="size-10 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className="text-h3">Start with the placement quiz</h2>
            <p className="mt-1 opacity-90">Quick questions to set your level.</p>
          </div>
          <Link href="/study/placement" className={cn(btnPrimary, "shrink-0")}>
            Start the quiz <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      ) : null}

      <section aria-labelledby="practise" className="grid gap-3 sm:grid-cols-2">
        <h2 id="practise" className="sr-only">
          Practise
        </h2>
        <Link href="/study/map/practice" className="flex items-center gap-4 rounded-lg border-2 border-foreground bg-primary p-4 text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <Shuffle className="size-7 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold">Mixed practice</span>
            <span className="block text-sm font-semibold opacity-80">Picked for you</span>
          </span>
          <ArrowRight className="size-5 shrink-0" aria-hidden />
        </Link>
        <div className="flex items-center gap-4 rounded-lg border-2 border-foreground bg-card p-4">
          <Repeat2 className="size-7 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold">
              {data.due} {data.due === 1 ? "review" : "reviews"} due
            </span>
            <span className="block text-sm text-muted-foreground">{data.due ? "They're mixed into your next practice round." : "Nothing to review right now."}</span>
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="fix" className="space-y-3">
          <h2 id="fix" className="text-h2">
            Fix it
          </h2>
          {data.weak.length ? (
            <ul className="space-y-3">
              {data.weak.map((w) => (
                <li key={w.skill} className="space-y-3 rounded-lg border-2 border-foreground bg-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{w.label}</p>
                    <StateTag state={w.state} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={w.practiceHref} className={btnPrimary}>
                      <Zap className="size-4" aria-hidden /> Quick quiz
                    </Link>
                    {topicById(w.topic) || titles[w.topic] ? (
                      <Link href={w.href} className={btnPlain}>
                        <BookOpen className="size-4" aria-hidden /> Read the module
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border-2 border-dashed border-foreground/50 bg-card p-4 text-muted-foreground">Nothing to fix yet.</p>
          )}
        </section>

        <section aria-labelledby="mixups" className="space-y-3">
          <h2 id="mixups" className="text-h2">
            Top 3 mix-ups
          </h2>
          {data.confusions.length ? (
            <ol className="space-y-3">
              {data.confusions.map((c, i) => {
                const topic = c.skill ? c.skill.split(":")[0] : null;
                return (
                  <li key={`${c.a}|${c.b}`} className="flex gap-3 rounded-lg border-2 border-foreground bg-card p-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border-2 border-foreground font-bold" aria-hidden>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p>
                        You mix up <strong>{c.a}</strong> and <strong>{c.b}</strong>
                        <span className="text-muted-foreground">
                          {" "}
                          ({c.n} {c.n === 1 ? "time" : "times"})
                        </span>
                      </p>
                      {topic && topicById(topic) ? (
                        <Link href={`/study/map/practice?topic=${encodeURIComponent(topic)}`} className={cn(btnPlain, "min-h-11")}>
                          <Zap className="size-4" aria-hidden /> Practise {topicById(topic)!.title}
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="rounded-lg border-2 border-dashed border-foreground/50 bg-card p-4 text-muted-foreground">No mix-ups yet.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="grid" className="space-y-4">
        <div className="space-y-1">
          <h2 id="grid" className="text-h2">
            Topic by skill
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.calibrated
              ? "Your chance of getting a typical question right."
              : `Scores show after ${CALIBRATION_ANSWERS} answers. ${left} to go.`}
          </p>
        </div>
        <ul aria-label="What each label means" className="flex flex-wrap gap-2">
          {MASTERY_STATES.map((s) => (
            <li key={s}>
              <StateTag state={s} />
            </li>
          ))}
        </ul>

        <div className="hidden grid-cols-[minmax(9rem,1.3fr)_repeat(7,minmax(0,1fr))] gap-2 px-3 text-xs font-bold uppercase text-muted-foreground lg:grid" aria-hidden>
          <span>Topic</span>
          {COMPETENCIES.map((c) => (
            <span key={c}>{COMPETENCY_LABEL[c]}</span>
          ))}
        </div>
        <ul className="space-y-2">
          {data.topics.map((t) => {
            const level = placed.get(t.id);
            return (
              <li key={t.id} className="grid grid-cols-2 gap-2 rounded-lg border-2 border-foreground bg-card p-3 sm:grid-cols-4 lg:grid-cols-[minmax(9rem,1.3fr)_repeat(7,minmax(0,1fr))] lg:items-center">
                <div className="col-span-2 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 sm:col-span-4 lg:col-span-1 lg:block">
                  <Link href={t.href} className="font-bold underline-offset-4 hover:underline">
                    {t.title}
                  </Link>
                  {level ? <p className="text-caption text-muted-foreground">Placement: {LEVEL_WORD[level]}</p> : null}
                </div>
                {t.cells.map((c) => {
                  const Icon = STATE_ICON[c.state];
                  if (!c.hasItems) {
                    return (
                      <div key={c.skill} className="hidden min-h-11 items-center rounded-md px-2 text-sm text-muted-foreground lg:flex">
                        <span aria-hidden>-</span>
                        <span className="sr-only">
                          {c.label}: no questions yet
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={c.skill} className={cn("flex min-h-11 flex-col justify-center rounded-md border-2 px-2 py-1", stateTone(c.state))}>
                      <span className="text-[0.7rem] font-bold uppercase opacity-80 lg:sr-only">{c.label}</span>
                      <span className="flex items-center gap-1 text-xs font-bold">
                        <Icon className="size-3.5 shrink-0" aria-hidden />
                        {MASTERY_LABEL[c.state]}
                        {c.p !== null ? <span className="ml-auto font-mono">{Math.round(c.p * 100)}%</span> : null}
                      </span>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
