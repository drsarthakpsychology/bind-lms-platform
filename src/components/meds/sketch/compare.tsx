"use client";

import { C, E, Figure, Label, P, Sheet, labelWidth } from "./ink";

type Side = { label: string; points: string[]; summary: string };

/** Two medicines side by side: two hand-drawn tablets, then what sets each apart. */
export function CompareSketch({ title, a, b }: { title: string; a: Side; b: Side }) {
  const size = (s: string) => (labelWidth(s, 16) > 150 ? 13 : 16);
  return (
    <Figure title={title} wide>
      <Sheet name="compare" w={400} h={96} label={`${a.label} compared with ${b.label}`}>
        <P k="tab-a" d="M40 30 L150 30 Q170 30 170 46 Q170 62 150 62 L40 62 Q20 62 20 46 Q20 30 40 30 Z" sw={2} fill={C.lime} gap={5} />
        <P k="tab-a-line" d="M95 32 L95 60" sw={1.4} single />
        <P k="tab-b" d="M250 30 L360 30 Q380 30 380 46 Q380 62 360 62 L250 62 Q230 62 230 46 Q230 30 250 30 Z" sw={2} fill={C.blue} gap={6} />
        <P k="tab-b-line" d="M305 32 L305 60" sw={1.4} single />
        <E k="vs" cx={200} cy={46} w={34} h={30} sw={1.6} fill={C.paper} fillStyle="solid" />
        <Label x={200} y={51} size={14} anchor="middle">vs</Label>
        <Label x={95} y={88} size={size(a.label)} anchor="middle">{a.label}</Label>
        <Label x={305} y={88} size={size(b.label)} anchor="middle">{b.label}</Label>
      </Sheet>
      <div className="grid gap-3 sm:grid-cols-2">
        {[a, b].map((s, i) => (
          <div key={i} className="rounded-xl border-2 border-foreground/20 p-3 text-[0.95rem] leading-relaxed">
            <p className="font-bold">{s.label}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">{s.summary}</p>
          </div>
        ))}
      </div>
    </Figure>
  );
}
