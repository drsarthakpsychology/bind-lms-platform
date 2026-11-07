import { describe, expect, it } from "vitest";
import { LONG_QA } from "./index";
import { SUBJECTS, type PrepExam } from "@/lib/prep/types";
import { MODULES } from "@/lib/study";

/**
 * Long answers: well formed, the right length for their marks, in the plain
 * answer format, and free of dashes and citations (owner rules, 2026-11-06).
 * Sources belong only in the admin-only `ref`.
 */
const EXAMS: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester", "md-psychiatry"];
const WORDS: Record<number, [number, number]> = { 5: [130, 340], 10: [320, 640], 15: [540, 1100], 20: [580, 1200] };
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

const CITATION = [
  /\bet al\.?/,
  /\((?:19|20)\d{2}[a-z]?\)/,
  /\[\d+\]/,
  /https?:\/\//,
  /\bdoi\b/i,
  /\bpp?\.\s?\d+/,
  /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Fish'?s|Ahuja|Prescriber'?s Guide|Synopsis of Psychiatry|Essential Psychopharmacology)\b/,
  /\b(Lancet|JAMA|NEJM|New England Journal|Psychological Bulletin|American Journal of Psychiatry|World Psychiatry|BMJ|Cochrane)\b/,
  /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i,
];

/** Everything a student sees, as one string. */
const shown = (q: (typeof LONG_QA)[number]) =>
  [q.question, ...q.plan, q.answer, ...q.keyPoints, ...(q.pitfalls ?? []), ...(q.visuals ?? []).map((v) => JSON.stringify(v))].join("\n");

describe("long answers", () => {
  it("have unique ids", () => {
    const ids = LONG_QA.map((q) => q.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });

  it("are complete and in range", () => {
    const modules = new Set(MODULES.map((m) => m.id));
    const bad: string[] = [];
    for (const q of LONG_QA) {
      const why = (s: string) => bad.push(`${q.id}: ${s}`);
      if (!SUBJECTS.includes(q.subject)) why("subject");
      if (!q.topic.trim()) why("topic");
      if (![5, 10, 15, 20].includes(q.marks)) why("marks");
      if (![1, 2, 3, 4].includes(q.difficulty)) why("difficulty");
      if (!q.exams.length || q.exams.some((e) => !EXAMS.includes(e))) why("exams");
      if (q.question.trim().length < 15) why("question");
      if (q.plan.length < 3 || q.plan.length > 6) why(`plan has ${q.plan.length} steps`);
      if (q.keyPoints.length < 4 || q.keyPoints.length > 8) why(`keyPoints has ${q.keyPoints.length}`);
      const [lo, hi] = WORDS[q.marks];
      const n = words(q.answer);
      if (n < lo || n > hi) why(`${n} words for ${q.marks} marks (want ${lo} to ${hi})`);
      if (q.module && !modules.has(q.module.split("/")[0])) why(`module ${q.module}`);
      for (const v of q.visuals ?? []) if (!v.kind || v.data == null) why("visual");
    }
    expect(bad).toEqual([]);
  });

  it("use only headings, bullets, table rows and paragraphs", () => {
    const bad: string[] = [];
    for (const q of LONG_QA)
      for (const line of q.answer.split("\n")) {
        if (/^#(?!# )/.test(line) || /^#{3,}/.test(line) || /^\s*[*+] /.test(line) || /^\s*\d+[.)] /.test(line) || /\*\*/.test(line) || /^\|[\s:|-]+\|$/.test(line))
          bad.push(`${q.id}: ${line.slice(0, 60)}`);
      }
    expect(bad).toEqual([]);
  });

  it("have no em or en dashes", () => {
    const bad = LONG_QA.filter((q) => /[–—]/.test(shown(q))).map((q) => q.id);
    expect(bad).toEqual([]);
  });

  it("keep citations out of student text", () => {
    const bad: string[] = [];
    for (const q of LONG_QA) {
      const t = shown(q);
      for (const re of CITATION) {
        const m = t.match(re);
        if (m) bad.push(`${q.id}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
