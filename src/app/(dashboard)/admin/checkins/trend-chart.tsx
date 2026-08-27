import type { AggregateRow } from "./page";

/**
 * Neo-Brutalist cohort trend — a hand-rolled SVG (no chart lib) so the page
 * shows the ACTUAL trend over weeks: workload / energy / preparedness lines on
 * a 1-5 axis, oldest → newest. Matches the design system (2px ink strokes,
 * token colors) and needs zero JS.
 */
export function CohortTrendChart({ rows }: { rows: AggregateRow[] }) {
  if (rows.length < 2) return null;
  const data = [...rows].reverse(); // oldest → newest (left → right)
  const W = 560;
  const H = 200;
  const PAD = 34;
  const plotW = W - PAD * 2;
  const plotH = H - PAD * 2;

  const x = (i: number) => PAD + (i * plotW) / Math.max(1, data.length - 1);
  const y = (v: number) => H - PAD - ((Math.min(5, Math.max(1, v)) - 1) / 4) * plotH;
  const linePoints = (key: "avg_workload" | "avg_energy" | "avg_preparedness") =>
    data.map((r, i) => `${x(i)},${y(Number(r[key]))}`).join(" ");

  const SERIES: Array<{ key: "avg_workload" | "avg_energy" | "avg_preparedness"; label: string; color: string }> = [
    { key: "avg_workload", label: "Workload", color: "var(--link)" },
    { key: "avg_energy", label: "Energy", color: "var(--primary)" },
    { key: "avg_preparedness", label: "Preparedness", color: "var(--foreground)" },
  ];

  return (
    <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted-foreground">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-border" style={{ background: s.color }} aria-hidden />
            {s.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full max-w-[560px]" role="img" aria-label="Cohort check-in trends over weeks">
        {/* 1-5 grid */}
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={PAD} x2={W - PAD} y1={y(v)} y2={y(v)} className="stroke-border" strokeWidth="1" strokeDasharray="3 4" />
            <text x={PAD - 6} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground" fontSize="10" fontFamily="ui-monospace, monospace">
              {v}
            </text>
          </g>
        ))}
        {/* data lines */}
        {SERIES.map((s) => (
          <polyline key={s.key} points={linePoints(s.key)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
        ))}
        {/* week labels (first, middle, last) */}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="10" className="fill-muted-foreground" fontFamily="ui-monospace, monospace">
            {data[i].week_label.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  );
}
