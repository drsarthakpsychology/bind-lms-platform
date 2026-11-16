import { Trophy } from "lucide-react";
import { PageFrame, Row, RowList, Section, ProgressLine } from "@/components/ds";

export type JourneyStat = { label: string; value: string; sub?: string };

/**
 * My journey (new design). One purpose: your own numbers. The level leads
 * (the one thing that moves), the six numbers sit in a plain grid with no
 * boxes, and the leaderboard is one row at the end.
 */
export function JourneyV2({
  level,
  title,
  levelPct,
  points,
  rank,
  stats,
  board,
}: {
  level: number;
  title: string;
  /** 0 to 1: how far through this level. */
  levelPct: number;
  points: number | null;
  rank: number | null;
  stats: JourneyStat[];
  board: { href: string; label: string };
}) {
  const pct = Math.round(levelPct * 100);
  return (
    <PageFrame title="My journey" area="me" lead="Private to you and your faculty.">
      <section aria-label="Your level" className="flex min-w-0 max-w-xl flex-col gap-3">
        <p className="type-small text-muted-foreground">{title}</p>
        <p className="type-display type-num">Level {level}</p>
        <ProgressLine pct={pct} label={`Level ${level} progress`} />
        <p className="type-small text-muted-foreground type-num">
          {pct}% to level {level + 1}
          {points != null ? ` · ${points} points` : ""}
          {rank ? ` · place ${rank} overall` : ""}
        </p>
      </section>

      <Section id="numbers" title="Your numbers">
        <dl className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-6 border-y border-[var(--ds-hairline)] py-6 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse">
              <dt className="flex min-w-0 flex-col">
                <span className="type-small font-semibold [overflow-wrap:anywhere]">{s.label}</span>
                {s.sub ? <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{s.sub}</span> : null}
              </dt>
              <dd className="type-h2 type-num [overflow-wrap:anywhere]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="standing" title="Standing">
        <RowList>
          <Row href={board.href} icon={<Trophy />} title={board.label} trailing={rank ? `Place ${rank}` : undefined} />
        </RowList>
      </Section>
    </PageFrame>
  );
}
