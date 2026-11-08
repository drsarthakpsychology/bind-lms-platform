/**
 * Parse check for figure placements: every raw `:::widget` line in a module's
 * source files becomes a parsed widget, every placed figure exists, and every
 * `focus` names a real label of that figure.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import type { Block, FigureData } from "@/lib/study/types";
import { NOTES } from "@/lib/learn/notes";
import { FIGURES } from "./registry";

const DIR = join(process.cwd(), "src/content/study");
const files = readdirSync(DIR).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));

function widgets(blocks: Block[], out: Extract<Block, { t: "widget" }>[] = []) {
  for (const b of blocks) {
    if (b.t === "widget") out.push(b);
    else if ("blocks" in b && Array.isArray(b.blocks)) widgets(b.blocks, out);
  }
  return out;
}

describe("figure placements", () => {
  let figures = 0;
  for (const m of MODULES) {
    it(m.id, () => {
      const own = files.filter((f) => f === `${m.id}.ts` || new RegExp(`^${m.id}-(\\d+|qa)\\.ts$`).test(f));
      const raw = own.map((f) => readFileSync(join(DIR, f), "utf8")).join("\n");
      const rawAll = (raw.match(/^:::widget /gm) ?? []).length;
      const rawFig = (raw.match(/^:::widget figure\s*$/gm) ?? []).length;
      const parsed = m.sections.flatMap((s) => widgets(s.blocks));
      const figs = parsed.filter((w) => w.kind === "figure");
      expect(parsed.length, "every raw widget line parses").toBe(rawAll);
      expect(figs.length, "every raw figure line parses").toBe(rawFig);
      for (const w of figs) {
        const d = w.data as FigureData;
        const f = FIGURES[d.id];
        expect(f, d.id).toBeDefined();
        const ids = new Set(f.labels.map((l) => l.id));
        for (const k of d.focus ?? []) expect(ids.has(k), `${d.id} focus ${k}`).toBe(true);
      }
      figures += figs.length;
    });
  }
  it("one-page notes only show real figures and real labels", () => {
    const withFigures = NOTES.filter((n) => n.figures?.length);
    expect(withFigures.length).toBeGreaterThanOrEqual(10);
    for (const n of withFigures)
      for (const d of n.figures ?? []) {
        const f = FIGURES[d.id];
        expect(f, `${n.id}: ${d.id}`).toBeDefined();
        const ids = new Set(f.labels.map((l) => l.id));
        for (const k of d.focus ?? []) expect(ids.has(k), `${n.id}: ${d.id} focus ${k}`).toBe(true);
      }
  });
  it("places at least 120 figures across the course", () => {
    expect(figures).toBeGreaterThanOrEqual(120);
  });
});
