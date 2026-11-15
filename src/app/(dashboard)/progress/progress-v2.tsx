import { ArrowRight, Check, Map as MapIcon, Route } from "lucide-react";
import { Hero, PageFrame, Row, RowList, Section, EmptyLine, ProgressLine, StatItem, StatRow, StatusWord } from "@/components/ds";
import { pct, type StrengthsWeaknesses, type TopicScore } from "@/lib/progress/strengths-core";

export type ProgressModule = {
  id: string;
  num: number;
  title: string;
  /** Reading and practice done, 0 to 100. */
  pct: number;
  /** The module test: absent when the module has none. */
  test?: { passed: boolean; pct: number | null; href: string };
};

/**
 * Progress (new design). One purpose: where you stand. Two numbers in one
 * quiet row, the next test as the only action, then the topics to work on
 * and the strongest ones (moved here from Home), then every module test.
 */
export function ProgressV2({
  coursePct,
  passed,
  total,
  passMark,
  eligible,
  next,
  strengths,
  modules,
}: {
  coursePct: number;
  passed: number;
  total: number;
  passMark: number;
  eligible: boolean;
  next: { num: number; title: string; href: string; pct: number } | null;
  strengths: StrengthsWeaknesses;
  modules: ProgressModule[];
}) {
  return (
    <PageFrame title="Progress" width="default">
      <div className="flex min-w-0 flex-col gap-4">
        <StatRow label="Your course so far">
          <StatItem value={`${coursePct}%`} label="Course done" />
          <StatItem value={passed} sub={`of ${total}`} label="Tests passed" />
        </StatRow>
        <ProgressLine pct={coursePct} label="Course done" className="max-w-xl" />
      </div>

      {eligible ? (
        <Section title="Certificate">
          <p className="flex min-w-0 items-start gap-2 type-body">
            <Check className="mt-1 size-5 shrink-0 text-status-success-fg" aria-hidden />
            <span className="min-w-0 max-w-[60ch]">Every module test is passed. Your course certificate will show in Certificates and badges once it is issued.</span>
          </p>
        </Section>
      ) : next ? (
        <Hero
          className="max-w-2xl [&_h2]:type-h1"
          context="Next test"
          title={`Module ${next.num}: ${next.title}`}
          meta={`Pass with ${passMark}% or more. You have read ${next.pct}% of this module.`}
          action={{ href: next.href, label: "Take the test", icon: <ArrowRight /> }}
        />
      ) : null}

      {strengths.hasData ? (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-section)] md:grid-cols-2 md:gap-12">
          <TopicList id="needs-work" title="Needs work" items={strengths.weakest} empty="Nothing weak yet." />
          <TopicList id="strongest" title="Strongest topics" items={strengths.strongest} empty="None yet." />
        </div>
      ) : (
        <Section id="topics" title="Your topics">
          <EmptyLine title="No topics to show yet">Answer a few questions in Study or Exam Prep. Your weakest and strongest topics show here.</EmptyLine>
        </Section>
      )}

      <Section id="tests" title="Module tests">
        <RowList>
          {modules.map((m) => (
            <Row
              key={m.id}
              href={m.test && !m.test.passed ? m.test.href : `/study/${m.id}`}
              icon={<span className="type-small font-bold type-num text-muted-foreground">{m.num}</span>}
              title={m.title}
              meta={m.pct > 0 ? `${m.pct}% read` : "Not started"}
              trailing={
                m.test ? (
                  m.test.passed ? (
                    <StatusWord tone="good" icon={<Check aria-hidden />}>
                      {m.test.pct}%
                      <span className="sr-only"> passed</span>
                    </StatusWord>
                  ) : m.test.pct != null ? (
                    <span>Best {m.test.pct}%</span>
                  ) : (
                    <span>Take test</span>
                  )
                ) : undefined
              }
            />
          ))}
        </RowList>
      </Section>

      <Section id="more" title="More">
        <RowList>
          <Row href="/study/map" icon={<MapIcon />} title="Your full map" meta="Every topic and how well you know it" />
          <Row href="/journey" icon={<Route />} title="My journey" meta="Hours, lectures and level" />
        </RowList>
      </Section>
    </PageFrame>
  );
}

function TopicList({ id, title, items, empty }: { id: string; title: string; items: TopicScore[]; empty: string }) {
  return (
    <Section id={id} title={title}>
      {items.length ? (
        <RowList>
          {items.map((t) => (
            <Row key={t.id} href={t.practiceHref} title={t.title} trailing={`${pct(t.p)}%`} />
          ))}
        </RowList>
      ) : (
        <p className="border-y border-[var(--ds-hairline)] py-4 type-small text-muted-foreground">{empty}</p>
      )}
    </Section>
  );
}
