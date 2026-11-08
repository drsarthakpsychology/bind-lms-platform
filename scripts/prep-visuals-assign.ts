/**
 * Writes src/content/prep/visuals/assigned.ts: which shared diagram each Exam
 * Prep question shows under its explanation.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/prep-visuals-assign.ts [--report]
 *
 * A concept matches a question when the subject fits, the topic fits (if the
 * concept names topics) and its pattern appears in the stem, statements,
 * lists, passage or correct option. Harder questions are chosen first, and
 * each concept is capped so pictures spread across topics. Questions that
 * already carry their own `visual` are left alone.
 *
 * Real labelled drawings (kind "figure") are matched separately. Where a
 * question's best diagram is a box-and-arrow kind (flow, compare, layers,
 * timeline, worked) and a figure fits at least as well, the figure takes the
 * slot; it also takes the slot from a schematic brain map it fits better, and
 * from any other widget it fits clearly better.
 * Then a second pass gives a figure to further questions it fits, hardest
 * first, up to FIG_SHARE of each subject.
 */
import { writeFileSync } from "node:fs";
import { ALL_QUESTIONS } from "../src/content/prep/index";
import { CONCEPTS, visualFor } from "../src/content/prep/visuals/index";
import type { Concept } from "../src/content/prep/visuals/kit";
import type { PrepQuestion, Subject } from "../src/lib/prep/types";

/** Share of each subject's questions to illustrate (hardest first). */
const SHARE: Partial<Record<Subject, number>> = {
  biological: 0.3,
  psychopharmacology: 0.26,
  "clinical-psychiatry": 0.14,
  psychopathology: 0.14,
  statistics: 0.14,
  "research-methods": 0.08,
  "psychometrics-assessment": 0.12,
  cognitive: 0.24,
  "perception-attention": 0.28,
  "learning-motivation-emotion": 0.24,
  developmental: 0.2,
  social: 0.14,
  "personality-theories": 0.1,
  "history-systems": 0.14,
  "clinical-therapies": 0.1,
  counselling: 0.08,
  health: 0.25,
  positive: 0.15,
  organisational: 0.12,
  "indian-psychology": 0.1,
  "ethics-law": 0.06,
  "ugc-paper1": 0.06,
};
/** At most this many questions share one concept: fewer for box-and-arrow kinds, so real pictures lead. */
const BOXES = new Set(["flow", "compare", "layers", "timeline", "worked"]);
const capOf = (c: Concept) => (BOXES.has(c.v.kind) ? 14 : c.v.kind === "figure" ? 40 : 24);
const isFig = (c: Concept) => c.v.kind === "figure";

/** Extra share of each subject's questions that may get a figure in the second pass (on top of SHARE). */
const FIG_SHARE: Partial<Record<Subject, number>> = {
  biological: 0.42,
  psychopharmacology: 0.2,
  "clinical-psychiatry": 0.12,
  psychopathology: 0.06,
  statistics: 0.06,
  "research-methods": 0.05,
  "psychometrics-assessment": 0.12,
  cognitive: 0.12,
  "perception-attention": 0.25,
  "learning-motivation-emotion": 0.18,
  developmental: 0.1,
  social: 0.06,
  "personality-theories": 0.06,
  "history-systems": 0.08,
  "clinical-therapies": 0.04,
  counselling: 0.03,
  health: 0.1,
  positive: 0.03,
  organisational: 0.03,
  "indian-psychology": 0.02,
  "ethics-law": 0.08,
  "ugc-paper1": 0.02,
};

/** A visual written on the question itself (not one this script attached earlier through assigned.ts). */
const ownVisual = (q: PrepQuestion) => !!q.visual && q.visual !== visualFor(q.id);

const primary = (q: PrepQuestion) => [q.stem, q.passage ?? "", ...(q.statements ?? []), ...(q.lists?.left ?? []), ...(q.lists?.right ?? []), q.options[q.answer]].join(" \n ");

function score(c: Concept, q: PrepQuestion, text: string): number {
  if (!c.r.s.includes(q.subject)) return 0;
  if (c.r.t && !c.r.t.test(q.topic)) return 0;
  if (c.r.not && c.r.not.test(text)) return 0;
  const g = new RegExp(c.r.re.source, c.r.re.flags.includes("g") ? c.r.re.flags : c.r.re.flags + "g");
  const found = [...text.matchAll(g)].map((m) => m[0].toLowerCase());
  const hits = new Set(found).size;
  const longest = Math.max(0, ...found.map((m) => m.length));
  if (!hits) return 0;
  const inStem = c.r.re.test(q.stem) ? 1 : 0;
  const inKey = c.r.re.test(q.options[q.answer]) ? 1 : 0;
  const inWhy = c.r.re.test(q.explanation) ? 1 : 0;
  return (c.r.t ? 4 : 0) + Math.min(hits, 3) + inStem + inKey + inWhy + Math.min(longest, 30) / 10;
}

type Pick = { c: Concept; s: number };
const best = new Map<string, Pick>();
const bestFig = new Map<string, Pick>();
for (const q of ALL_QUESTIONS) {
  const text = primary(q);
  let top: Pick | null = null;
  let fig: Pick | null = null;
  for (const c of CONCEPTS) {
    const s = score(c, q, text);
    if (isFig(c)) {
      if (s > (fig?.s ?? 0)) fig = { c, s };
    } else if (s > (top?.s ?? 0)) top = { c, s };
  }
  if (fig) bestFig.set(q.id, fig);
  if (top) best.set(q.id, top);
}
/** A figure replaces a box-and-arrow diagram it fits as well, and any other widget it fits clearly better. */
const figBeats = (top: Pick, fig: Pick) => fig.s >= top.s + (BOXES.has(top.c.v.kind) ? 0 : top.c.v.kind === "brainmap" ? 1 : 2);

const assigned: Record<string, string> = {};
const perConcept = new Map<string, number>();
const bySubject = new Map<Subject, PrepQuestion[]>();
for (const q of ALL_QUESTIONS) bySubject.set(q.subject, [...(bySubject.get(q.subject) ?? []), q]);
for (const [subject, qs] of bySubject) {
  const quota = Math.round((SHARE[subject] ?? 0.05) * qs.length);
  const cands = qs.filter((q) => best.has(q.id) && !ownVisual(q)).sort((a, b) => b.difficulty - a.difficulty || best.get(b.id)!.s - best.get(a.id)!.s || a.id.localeCompare(b.id));
  let n = 0;
  for (const q of cands) {
    if (n >= quota) break;
    const { c } = best.get(q.id)!;
    const k = perConcept.get(c.id) ?? 0;
    if (k >= capOf(c)) continue;
    perConcept.set(c.id, k + 1);
    assigned[q.id] = c.id;
    n++;
  }
}

// Swap: where a figure shows the real thing better than the diagram chosen above, it takes that slot (hardest first).
const order = (m: Map<string, Pick>) => (a: PrepQuestion, b: PrepQuestion) => b.difficulty - a.difficulty || m.get(b.id)!.s - m.get(a.id)!.s || a.id.localeCompare(b.id);
for (const q of ALL_QUESTIONS.filter((x) => assigned[x.id] && bestFig.has(x.id)).sort(order(bestFig))) {
  const top = best.get(q.id)!;
  const f = bestFig.get(q.id)!;
  if (!figBeats(top, f) || (perConcept.get(f.c.id) ?? 0) >= capOf(f.c)) continue;
  perConcept.set(top.c.id, perConcept.get(top.c.id)! - 1);
  perConcept.set(f.c.id, (perConcept.get(f.c.id) ?? 0) + 1);
  assigned[q.id] = f.c.id;
}

// Second pass: a figure for further questions it fits, hardest first.
for (const [subject, qs] of bySubject) {
  const quota = Math.round((FIG_SHARE[subject] ?? 0) * qs.length);
  const cands = qs.filter((q) => bestFig.has(q.id) && !ownVisual(q) && !assigned[q.id]).sort(order(bestFig));
  let n = 0;
  for (const q of cands) {
    if (n >= quota) break;
    const { c } = bestFig.get(q.id)!;
    const k = perConcept.get(c.id) ?? 0;
    if (k >= capOf(c)) continue;
    perConcept.set(c.id, k + 1);
    assigned[q.id] = c.id;
    n++;
  }
}

const ids = Object.keys(assigned).sort();
const body = ids.map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(assigned[id])},`).join("\n");
writeFileSync(
  new URL("../src/content/prep/visuals/assigned.ts", import.meta.url),
  `/** Generated by scripts/prep-visuals-assign.ts: question id to concept id. Edit by hand only to remove a bad match. */\nexport const ASSIGNED: Record<string, string> = {\n${body}\n};\n`,
);

if (process.argv.includes("--report")) {
  const subj = new Map<string, number>();
  const kinds = new Map<string, number>();
  const byId = new Map(CONCEPTS.map((c) => [c.id, c]));
  for (const id of ids) {
    const q = ALL_QUESTIONS.find((x) => x.id === id)!;
    subj.set(q.subject, (subj.get(q.subject) ?? 0) + 1);
    const k = byId.get(assigned[id])!.v.kind;
    kinds.set(k, (kinds.get(k) ?? 0) + 1);
  }
  console.log("total", ids.length);
  console.log("by subject", Object.fromEntries([...subj].sort((a, b) => b[1] - a[1])));
  console.log("by kind", Object.fromEntries([...kinds].sort((a, b) => b[1] - a[1])));
  console.log("unused concepts", CONCEPTS.filter((c) => !perConcept.has(c.id)).map((c) => c.id).join(", "));
  console.log("per concept", Object.fromEntries([...perConcept].sort((a, b) => b[1] - a[1])));
  if (process.argv.includes("--samples")) {
    const want = process.argv[process.argv.indexOf("--samples") + 1];
    for (const id of ids) {
      if (want && !assigned[id].startsWith(want)) continue;
      const q = ALL_QUESTIONS.find((x) => x.id === id)!;
      console.log(`${assigned[id].padEnd(22)} ${q.subject.slice(0, 10).padEnd(10)} ${q.stem.slice(0, 90).replace(/\s+/g, " ")} => ${q.options[q.answer].slice(0, 40)}`);
    }
  }
}
