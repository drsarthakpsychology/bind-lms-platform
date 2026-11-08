import Link from "next/link";
import { Blocks } from "@/components/study/blocks";
import { DIFFICULTY_WORD, LEVEL_WORD, headingsOf, type LongItem } from "@/lib/prep/long";
import { placeVisuals } from "@/lib/prep/visual";
import type { Block } from "@/lib/study/types";
import type { PrepVisual } from "@/lib/prep/types";
import { cn } from "@/lib/utils";
import { PrepVisualView } from "./visual";

const chip = "inline-flex items-center rounded-full border-2 border-foreground/70 px-2 py-0.5 text-xs font-bold";

/** Marks, difficulty, Study level and source as small tags (words, never colour alone). */
export function LongMeta({ item, className }: { item: Pick<LongItem, "marks" | "difficulty" | "level" | "source">; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className={cn(chip, "bg-card font-mono")}>{item.marks} marks</span>
      <span className={chip}>{DIFFICULTY_WORD[item.difficulty]}</span>
      {item.level ? <span className={cn(chip, "border-dashed")}>{LEVEL_WORD[item.level]}</span> : null}
      {item.source === "study" ? <span className={cn(chip, "border-dashed text-muted-foreground")}>From Study</span> : null}
    </span>
  );
}

/** "Questions" and "Long answers" on a subject page: two links styled as tabs. */
export function SubjectTabs({ subject, active, counts }: { subject: string; active: "bank" | "long"; counts: { bank: number; long: number } }) {
  const tab = (on: boolean) =>
    cn(
      "flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
      on ? "bg-foreground text-background" : "text-foreground hover:bg-secondary",
    );
  return (
    <nav aria-label="Practice type" className="flex gap-1 rounded-md border-2 border-foreground bg-card p-1">
      <Link href={`/prep/${subject}`} aria-current={active === "bank" ? "page" : undefined} className={tab(active === "bank")}>
        Questions{counts.bank >= 100 ? <span className="font-mono text-xs opacity-80">{Math.floor(counts.bank / 100) * 100}+</span> : null}
      </Link>
      <Link href={`/prep/${subject}?tab=long`} aria-current={active === "long" ? "page" : undefined} className={tab(active === "long")}>
        Long answers{counts.long >= 100 ? <span className="font-mono text-xs opacity-80">{Math.floor(counts.long / 100) * 100}+</span> : null}
      </Link>
    </nav>
  );
}

/**
 * A model answer: its blocks (headings, bullets, tables) with each diagram
 * after the heading it names, or at the end. A diagram that fails is skipped.
 */
export function LongAnswerBody({ blocks, visuals = [] }: { blocks: Block[]; visuals?: PrepVisual[] }) {
  const at = placeVisuals(headingsOf(blocks), visuals);
  const after = new Map<number, PrepVisual[]>();
  const end: PrepVisual[] = [];
  at.forEach((h, i) => (h < 0 ? end.push(visuals[i]) : after.set(h, [...(after.get(h) ?? []), visuals[i]])));
  // Split the answer at the end of each section that has a diagram.
  const parts: { blocks: Block[]; visuals: PrepVisual[] }[] = [];
  let cur: Block[] = [];
  let h = -1;
  const close = () => {
    if (cur.length || after.get(h)?.length) parts.push({ blocks: cur, visuals: after.get(h) ?? [] });
    cur = [];
  };
  for (const b of blocks) {
    if (b.t === "h3") {
      if (after.has(h)) close();
      h++;
    }
    cur.push(b);
  }
  close();
  if (end.length) parts.push({ blocks: [], visuals: end });
  return (
    <div className="min-w-0 space-y-5 [overflow-wrap:anywhere]">
      {parts.map((p, i) => (
        <div key={i} className="min-w-0 space-y-5">
          {p.blocks.length ? <Blocks blocks={p.blocks} /> : null}
          {p.visuals.map((v, j) => (
            <PrepVisualView key={j} visual={v} />
          ))}
        </div>
      ))}
    </div>
  );
}
