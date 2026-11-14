import Link from "next/link";
import { BOARDS, type BoardKey } from "@/lib/standing/boards";
import { segmentGroup, segmentItem } from "@/components/design-system/segment";

/**
 * "Quiz | Overall": the switch at the top of both leaderboards, so students
 * always see there are two and can hop between them.
 */
export function BoardSwitch({ active }: { active: BoardKey }) {
  return (
    <nav aria-label="Leaderboards" className={segmentGroup}>
      {(Object.keys(BOARDS) as BoardKey[]).map((k) => {
        const b = BOARDS[k];
        const on = k === active;
        return (
          <Link
            key={k}
            href={b.href}
            aria-current={on ? "page" : undefined}
            className={segmentItem(on, "px-5")}
          >
            {b.short}
          </Link>
        );
      })}
    </nav>
  );
}

/** Title block shared by both boards: period, name, what counts, who is on it. */
export function BoardHeader({ board, scope }: { board: BoardKey; scope: string }) {
  const b = BOARDS[board];
  return (
    <header>
      <p className="text-eyebrow text-link">{b.period}</p>
      <h1 className="text-h1">{b.label}</h1>
      <p className="mt-1 text-sm">{b.explainer}</p>
      <p className="text-caption text-muted-foreground">{scope}</p>
    </header>
  );
}
