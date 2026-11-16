import Link from "next/link";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import type { StudentMap } from "@/lib/learn/model/server";
import type { Mastery } from "@/lib/learn/model/mastery";
import { MASTERY_LABEL, MASTERY_STATES } from "@/lib/learn/model/mastery";
import { topicById } from "@/lib/learn/model/topics";
import { CALIBRATION_ANSWERS } from "@/lib/learn/model/elo";
import { HeroButton, PageFrame, Row, RowList, Section } from "@/components/ds";
import { BackLink, EmptyLine, textButton } from "@/components/ds/parts";
import { cn } from "@/lib/utils";
import { STATE_ICON } from "./ui";

/** Text colour per state: the word and its icon carry it, never a box. */
const STATE_TEXT: Record<Mastery, string> = {
  new: "text-muted-foreground",
  learning: "text-status-info-fg",
  shaky: "text-status-alert-fg",
  mastered: "text-status-success-fg",
  decaying: "text-status-pending-fg",
};

function State({ state, p, className }: { state: Mastery; p?: number | null; className?: string }) {
  const Icon = STATE_ICON[state];
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1 type-small font-semibold", STATE_TEXT[state], className)}>
      <Icon className="size-4 shrink-0" aria-hidden />
      {MASTERY_LABEL[state]}
      {p !== null && p !== undefined ? <span className="type-num text-muted-foreground">{Math.round(p * 100)}%</span> : null}
    </span>
  );
}

/**
 * /study/map in the new design: one main action (mixed practice), then what
 * to fix and the words you mix up as hairline lists, then every topic by skill
 * as plain rows. A topic you have not started reads as one quiet line.
 */
export function MapV2({
  data,
  titles,
  isLearner,
  fresh,
  left,
  placed,
}: {
  data: StudentMap;
  titles: Record<string, string>;
  isLearner: boolean;
  fresh: boolean;
  left: number;
  placed: Map<string, string>;
}) {
  const hasWork = data.weak.length > 0 || data.confusions.length > 0;
  return (
    <PageFrame width="default">
      <header className="flex min-w-0 flex-col gap-1">
        <BackLink href="/progress">Progress</BackLink>
        <h1 className="type-h1 ds-stroke [overflow-wrap:anywhere]">What you know, and what to fix</h1>
        {!isLearner ? <p className="type-small text-muted-foreground">Preview: staff accounts have no map of their own.</p> : null}
      </header>

      <section aria-label="Practise" className="flex min-w-0 flex-col gap-2">
        {fresh ? (
          <HeroButton href="/study/placement" icon={<ArrowRight />}>
            Start the placement quiz
          </HeroButton>
        ) : (
          <HeroButton href="/study/map/practice" icon={<ArrowRight />}>
            Mixed practice, picked for you
          </HeroButton>
        )}
        {data.due > 0 ? (
          <p className="type-small text-muted-foreground">
            {data.due === 1 ? "1 review is due." : `${data.due} reviews are due.`} They are mixed into your next round.
          </p>
        ) : null}
      </section>

      {hasWork ? (
        <div className="grid min-w-0 gap-[var(--ds-section)] lg:grid-cols-2 lg:gap-12">
          {data.weak.length ? (
            <Section title="Fix it" id="fix">
              <ul aria-label="Fix it" className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                {data.weak.map((w) => (
                  <li key={w.skill} className="flex min-w-0 flex-col gap-1 py-3">
                    <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">{w.label}</p>
                      <State state={w.state} />
                    </div>
                    <div className="flex min-w-0 flex-wrap gap-x-5">
                      <Link href={w.practiceHref} className={textButton}>
                        <Zap aria-hidden /> Quick quiz
                      </Link>
                      {topicById(w.topic) || titles[w.topic] ? (
                        <Link href={w.href} className={textButton}>
                          <BookOpen aria-hidden /> Read the module
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {data.confusions.length ? (
            <Section title="Words you mix up" id="mixups">
              <RowList label="Words you mix up">
                {data.confusions.map((c) => {
                  const topic = c.skill ? c.skill.split(":")[0] : null;
                  const t = topic ? topicById(topic) : undefined;
                  const words = (
                    <>
                      {c.a} <span className="font-normal text-muted-foreground">and</span> {c.b}
                    </>
                  );
                  return t ? (
                    <Row key={`${c.a}|${c.b}`} href={`/study/map/practice?topic=${encodeURIComponent(topic!)}`} title={words} meta={`Practise ${t.title}`} />
                  ) : (
                    <Row key={`${c.a}|${c.b}`} title={words} />
                  );
                })}
              </RowList>
            </Section>
          ) : null}
        </div>
      ) : isLearner && data.graded > 0 ? (
        <EmptyLine title="Nothing to fix right now." />
      ) : null}

      <Section title="Topic by skill" id="grid">
        <div className="flex min-w-0 flex-col gap-3">
          {!data.calibrated ? (
            <p className="type-small text-muted-foreground">
              Scores show after {CALIBRATION_ANSWERS} answers.{left < CALIBRATION_ANSWERS ? ` ${left} to go.` : null}
            </p>
          ) : null}
          <ul aria-label="What each label means" className="flex min-w-0 flex-wrap gap-x-5 gap-y-1">
            {MASTERY_STATES.map((s) => (
              <li key={s}>
                <State state={s} />
              </li>
            ))}
          </ul>
        </div>

        <ul aria-label="Topics" className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {data.topics.map((t) => {
            const cells = t.cells.filter((c) => c.hasItems);
            const untouched = cells.every((c) => c.state === "new");
            const level = placed.get(t.id);
            return (
              <li key={t.id} className={cn("flex min-w-0 gap-2 py-3 lg:flex-row lg:items-baseline lg:gap-6", untouched ? "flex-row items-center justify-between lg:justify-start" : "flex-col")}>
                <div className="flex min-w-0 flex-col lg:w-56 lg:shrink-0">
                  <Link href={t.href} className="inline-flex min-h-11 w-fit items-center type-body font-semibold underline-offset-4 hover:underline lg:min-h-0">
                    {t.title}
                  </Link>
                  {level ? <span className="type-caption text-muted-foreground">Placement: {level}</span> : null}
                </div>
                {untouched ? (
                  <State state="new" className="shrink-0" />
                ) : (
                  <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                    {cells.map((c) => (
                      <div key={c.skill} className="flex min-w-0 flex-col">
                        <dt className="type-caption text-muted-foreground">{c.label}</dt>
                        <dd>
                          <State state={c.state} p={c.p} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
    </PageFrame>
  );
}
