import { describe, expect, it } from "vitest";
import { LONG_QA } from "./index";
import { SUBJECTS, type PrepExam } from "@/lib/prep/types";
import { groupOf, MORE } from "@/lib/prep/topics";
import type { LongQA } from "@/lib/prep/long-types";

const EXAMS: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester", "md-psychiatry"];

/** Answer length in words, by marks: a 5 mark answer is short notes, 15 and 20 are essays. */
const WORDS: Record<LongQA["marks"], [number, number]> = { 5: [130, 340], 10: [320, 640], 15: [540, 1100], 20: [580, 1200] };

/** Same owner rule as the Study modules: no formal references in what students see. */
const BANNED = [
  /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Fish'?s|Ahuja|Atkinson (?:and|&) Hilgard|Bear,? Connors|Prescriber'?s Guide|Synopsis of Psychiatry|Essential Psychopharmacology)\b/,
  /\bet al\b/,
  /https?:\/\//,
  /\bdoi\b/i,
  /\bpp?\.\s?\d+/,
  /\b(Lancet|JAMA|NEJM|New England Journal|Psychological Bulletin|Psychological Review|American Journal of Psychiatry|World Psychiatry|BMJ|Cochrane)\b/,
  /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i,
  /\((?:[A-Z][A-Za-z'&. ]+,? )?(1[6-9]\d\d|20\d\d)[a-z]?\)/, // bracketed years, as in a citation
  /\b[A-Z][a-z]+,\s(1[6-9]\d\d|20\d\d)\b/, // "Name, 1990"
];

const words = (s: string) => s.replace(/^## /gm, "").replace(/\|/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const studentText = (q: LongQA) => [q.question, q.topic, ...q.plan, q.answer, ...q.keyPoints, ...(q.pitfalls ?? []), JSON.stringify(q.visuals ?? [])].join("\n");

/* Shape checks for each widget kind a long answer may use, mirroring src/lib/study/types.ts. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = any;
const str = (x: unknown) => typeof x === "string" && x.trim().length > 0;
const opt = (x: unknown) => x === undefined || str(x);
const strs = (x: unknown, min = 1) => Array.isArray(x) && x.length >= min && x.every(str);
const REGIONS = ["frontal", "prefrontal", "motor", "sensory", "parietal", "occipital", "temporal", "broca", "wernicke", "cerebellum", "brainstem", "corpus-callosum", "thalamus", "hypothalamus", "basal-ganglia", "amygdala", "hippocampus"];
const titled = (d: D) => opt(d.title) && opt(d.caption);
const CHECK: Record<string, (d: D) => boolean> = {
  flow: (d) => {
    if (!["chain", "cycle", "tree"].includes(d.layout) || !Array.isArray(d.nodes) || d.nodes.length < 2 || !titled(d)) return false;
    const ids = d.nodes.map((n: D) => n.id);
    if (new Set(ids).size !== ids.length || !d.nodes.every((n: D) => str(n.id) && str(n.label) && opt(n.detail))) return false;
    if (d.layout === "tree" && !d.nodes.slice(1).every((n: D) => ids.includes(n.parent))) return false;
    return d.edgeLabels === undefined || Object.entries(d.edgeLabels).every(([k, v]) => k.split(">").length === 2 && k.split(">").every((x) => ids.includes(x)) && str(v));
  },
  curve: (d) => ["normal", "sdt", "forgetting", "inverted-u", "dose-response", "half-life"].includes(d.kind) && titled(d),
  layers: (d) => ["pyramid", "rings", "stack", "iceberg"].includes(d.shape) && Array.isArray(d.layers) && d.layers.length >= 2 && d.layers.every((l: D) => str(l.label) && str(l.detail)) && titled(d),
  timeline: (d) => str(d.prompt) && Array.isArray(d.events) && d.events.length >= 3 && d.events.every((e: D) => str(e.label) && opt(e.when)) && opt(d.why),
  compare: (d) => titled(d) && [d.a, d.b].every((s: D) => s && str(s.label) && strs(s.points, 2) && str(s.summary)),
  experiment: (d) => str(d.title) && str(d.question) && typeof d.unit === "string" && Array.isArray(d.conditions) && d.conditions.length >= 2 && d.conditions.every((c: D) => str(c.label) && typeof c.value === "number" && c.value >= 0 && c.value <= (d.max ?? (d.unit === "%" ? 100 : Infinity)) && opt(c.note)) && opt(d.why),
  worked: (d) => str(d.title) && Array.isArray(d.steps) && d.steps.length >= 2 && d.steps.every((s: D) => str(s.q) && str(s.a)) && (d.yourTurn === undefined || d.yourTurn.every((s: D) => str(s.q) && str(s.a))),
  sort: (d) => str(d.prompt) && strs(d.buckets, 2) && Array.isArray(d.items) && d.items.length >= 3 && d.items.every((i: D) => str(i.text) && Number.isInteger(i.bucket) && i.bucket >= 0 && i.bucket < d.buckets.length && opt(i.why)),
  decide: (d) => str(d.scene) && str(d.ask) && Array.isArray(d.choices) && d.choices.length >= 2 && d.choices.some((c: D) => c.verdict === "best") && d.choices.every((c: D) => str(c.label) && ["best", "ok", "harm"].includes(c.verdict) && str(c.outcome) && str(c.why)),
  reveal: (d) => str(d.prompt) && str(d.answer),
  guess: (d) => str(d.prompt) && typeof d.min === "number" && typeof d.max === "number" && d.min < d.max && typeof d.unit === "string" && Array.isArray(d.answer) && d.answer.length === 2 && d.answer[0] <= d.answer[1] && d.answer[0] >= d.min && d.answer[1] <= d.max && str(d.reveal),
  build: (d) => str(d.vignette) && str(d.rule) && Array.isArray(d.symptoms) && d.symptoms.length >= 3 && d.symptoms.every((s: D) => str(s.label) && typeof s.present === "boolean") && Number.isInteger(d.need) && typeof d.needCore === "boolean" && str(d.verdict),
  brainmap: (d) => titled(d) && (d.focus === undefined || (Array.isArray(d.focus) && d.focus.every((r: string) => REGIONS.includes(r)))) && (d.notes === undefined || Object.keys(d.notes).every((r) => REGIONS.includes(r))),
  conservation: (d) => (d.kind === undefined || ["liquid", "number"].includes(d.kind)) && titled(d),
  illusion: (d) => ["muller-lyer", "ponzo", "ebbinghaus", "figure-ground"].includes(d.kind) && titled(d),
  conditioning: (d) => ["classical", "operant"].includes(d.kind) && titled(d),
  dissonance: (d) => opt(d.belief) && opt(d.behaviour) && titled(d),
  attention: titled,
  memoryflow: titled,
  stress: titled,
  strange: titled,
  hypnogram: titled,
  amesroom: titled,
  hpaloop: (d) => titled(d) && (d.start === undefined || ["day", "chronic"].includes(d.start)),
  brainexplorer: (d) => titled(d) && (d.focus === undefined || strs(d.focus)),
  nervoussystem: (d) => titled(d) && (d.start === undefined || ["signal", "auto", "map"].includes(d.start)),
  actionpotential: (d) => titled(d) && (d.myelinated === undefined || typeof d.myelinated === "boolean"),
  synapse3d: (d) => titled(d) && opt(d.transmitter),
  release: (d) => titled(d) && opt(d.transmitter),
  neuron: (d) => titled(d),
  brainslicer: (d) => titled(d) && (d.start === undefined || ["slice", "tms", "ect"].includes(d.start)),
};

describe("long answers", () => {
  it("has questions", () => expect(LONG_QA.length).toBeGreaterThan(0));

  it("ids are unique and well formed", () => {
    const seen = new Set<string>();
    const dupes = LONG_QA.filter((q) => (seen.has(q.id) ? true : (seen.add(q.id), false))).map((q) => q.id);
    expect(dupes).toEqual([]);
    expect(LONG_QA.filter((q) => !/^[a-z]+-l\d{2}-\d{3}$/.test(q.id)).map((q) => q.id)).toEqual([]);
  });

  it("required fields are present and in range", () => {
    const bad = LONG_QA.flatMap((q) => {
      const p: string[] = [];
      if (!(SUBJECTS as readonly string[]).includes(q.subject)) p.push("subject");
      if (![5, 10, 15, 20].includes(q.marks)) p.push("marks");
      if (![1, 2, 3, 4].includes(q.difficulty)) p.push("difficulty");
      if (!q.exams.length || q.exams.some((e) => !EXAMS.includes(e))) p.push("exams");
      if (q.question.trim().length < 20) p.push("question");
      if (q.plan.length < 3 || q.plan.length > 6) p.push(`plan ${q.plan.length}`);
      if (q.keyPoints.length < 4 || q.keyPoints.length > 8) p.push(`keyPoints ${q.keyPoints.length}`);
      if ([...q.plan, ...q.keyPoints, ...(q.pitfalls ?? [])].some((s) => !s.trim())) p.push("empty item");
      if (!q.ref?.trim()) p.push("ref");
      if (groupOf(q.subject, q.topic, q.module) === MORE) p.push(`topic ${q.topic} has no group`);
      return p.length ? [`${q.id}: ${p.join(", ")}`] : [];
    });
    expect(bad, bad.join("\n")).toEqual([]);
  });

  it("answers are the right length for their marks", () => {
    const bad = LONG_QA.filter((q) => {
      const n = words(q.answer);
      // Word counts differ a little between counters (headings, table pipes), so allow 10 percent under.
      return n < Math.floor(WORDS[q.marks][0] * 0.9) || n > WORDS[q.marks][1];
    }).map((q) => `${q.id} (${q.marks} marks): ${words(q.answer)} words`);
    expect(bad, bad.join("\n")).toEqual([]);
  });

  it("answers use only headings, bullets, table rows and plain lines", () => {
    const bad = LONG_QA.filter((q) => {
      const a = q.answer;
      const heads = (a.match(/^## \S/gm) ?? []).length;
      return heads < 2 || /\*\*|`|^#(?!# )|^###/m.test(a) || /^\|/m.test(a.replace(/^\|.*\|$/gm, ""));
    }).map((q) => q.id);
    expect(bad).toEqual([]);
  });

  it("visuals have a known kind and the data shape that widget needs", () => {
    const bad = LONG_QA.flatMap((q) => (q.visuals ?? []).flatMap((v, i) => ((CHECK[v.kind] ? CHECK[v.kind](v.data) : true) && opt(v.caption) ? [] : [`${q.id} visual ${i} (${v.kind})`])));
    expect(bad, bad.join("\n")).toEqual([]);
    expect(LONG_QA.filter((q) => (q.visuals?.length ?? 0) > 3).map((q) => q.id)).toEqual([]);
  });

  it("no em or en dashes", () => {
    const bad = LONG_QA.filter((q) => /[–—]/.test(studentText(q) + (q.ref ?? ""))).map((q) => q.id);
    expect(bad).toEqual([]);
  });

  it("no citations outside ref", () => {
    const hits = LONG_QA.flatMap((q) => {
      const t = studentText(q);
      return BANNED.flatMap((re) => {
        const m = t.match(re);
        return m ? [`${q.id}: ${t.slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + 40)}`] : [];
      });
    });
    expect(hits, hits.join("\n")).toEqual([]);
  });
});
