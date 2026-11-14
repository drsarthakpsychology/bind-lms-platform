import { describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import { ALL_INTERVIEWS, ALL_QUESTIONS } from "@/content/prep/index";
import { LONG_QA } from "@/content/prep-long/index";
import { PRACTICE_SPECS, SUBJECT_GROUPS } from "@/content/prep/specs";
import { SUBJECT_TITLE } from "@/lib/prep/catalog";

/**
 * Owner rule (8 Nov 2026): "Don't mention any names of such exams. It's for
 * us, not for students to see." Student text never names an entrance or
 * competitive exam (the national master's entrance, the national teaching
 * eligibility exam and its two papers, named clinical institute entrances,
 * MD Psychiatry, the super-speciality and medical entrances and the like).
 * Exam-pattern facts may stay, in generic words.
 *
 * Allowed, because they are not exam names: internal fields (exam tags, ids,
 * slugs, admin refs); the University Grants Commission and the National
 * Testing Agency as bodies (the general paper teaches them); institutes such
 * as NIMHANS or PGIMER as places, tests or research centres; "NET" for the
 * noradrenaline transporter or narrative exposure therapy; generic words like
 * "entrance exam" or "clinical psychology entrances".
 */
const BANNED: RegExp[] = [
  /\bCUET\b/i,
  /\bUGC[- ]?NET\b/i,
  /\bNEET\b/i,
  /\bJEE\b/,
  /\bJRF\b/,
  /\bNET[- ](?:Paper|paper|exam|JRF|syllabus|pattern|aspirant|candidate|question|answer|style|level|unit|Unit)/,
  /\bNET (?:and|or) (?:CUET|SET|JRF|PhD entrance)/,
  /\b(?:the|for|crack|clear|cleared|clearing|qualify|qualified) NET\b(?! (?:block|inhibit|transporter|reuptake|affinity))/,
  /\bNET(?:\/| or )SET\b/,
  /\bMD Psychiatry\b/,
  /\bClinical Psychology Entrances?\b/,
  /\b(?:PGIMER|NIMHANS|CIP|IHBAS|AIIMS|RCI) (?:entrance|exam|paper|written)/i,
  /\b(?:PGIMER|NIMHANS|CIP Ranchi|IHBAS)(?: and CIP)? (?:clinical psychology )?entrance/i,
  /\bM\.?Phil\.? (?:Clinical Psychology )?entrance/i,
  /\bPapers? [12I]\b/,
];

/** Fields that are internal data, never shown as text. */
const INTERNAL = new Set(["exams", "ref", "id", "module", "topic", "subject", "slug", "href", "noteId", "emoji", "kind", "type", "level", "view", "t", "source", "exam"]);

function texts(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) texts(x, out);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!INTERNAL.has(k)) texts(x, out);
  return out;
}

function hits(v: unknown): string[] {
  return texts(v).flatMap((s) =>
    BANNED.flatMap((re) => {
      const g = new RegExp(re.source, re.flags + "g");
      return [...s.matchAll(g)].map((x) => s.slice(Math.max(0, x.index! - 50), x.index! + 50).replace(/\s+/g, " "));
    }),
  );
}

describe("student text names no exam", () => {
  for (const m of MODULES) {
    it(`study ${m.id}`, () => {
      const h = hits({ ...m, sections: m.sections.map((s) => ({ title: s.title, blocks: s.blocks })) });
      expect(h, h.join("\n")).toEqual([]);
    });
  }
  it("question bank stems, options and explanations", () => {
    const h = ALL_QUESTIONS.flatMap((q) => hits(q).map((x) => `${q.id}: ${x}`));
    expect(h, h.join("\n")).toEqual([]);
  });
  it("long answers: question, plan, answer, key points, pitfalls and visuals", () => {
    const h = LONG_QA.flatMap((q) => hits(q).map((x) => `${q.id}: ${x}`));
    expect(h, h.join("\n")).toEqual([]);
  });
  it("interviews", () => {
    const h = ALL_INTERVIEWS.flatMap((q) => hits(q).map((x) => `${q.id}: ${x}`));
    expect(h, h.join("\n")).toEqual([]);
  });
  it("subject names and shared mock titles", () => {
    const h = hits([Object.values(SUBJECT_TITLE), SUBJECT_GROUPS.map((g) => g.title), PRACTICE_SPECS.map((s) => [s.title, s.short, s.notes, s.sections])]);
    expect(h, h.join("\n")).toEqual([]);
  });
});

describe("the exam-name check itself", () => {
  it("catches exam names", () => {
    for (const s of ["UGC NET Paper 2 asks this", "the CUET PG pattern", "NET Paper 1", "the NIMHANS entrance", "I'll never crack NEET", "for NET questions", "MD Psychiatry theory"]) expect(hits(s), s).not.toEqual([]);
  });
  it("allows pharmacology, bodies, institutes and generic words", () => {
    for (const s of ["SNRIs block SERT and NET; the NET blocker", "SERT; SERT and NET; NET and DAT.", "Narrative exposure therapy (NET)", "The UGC 2018 plagiarism regulations", "NTA (National Testing Agency)", "the NIMHANS battery", "Competitive exams often ask this", "the master's entrance pattern", "clinical psychology entrances"]) expect(hits(s), s).toEqual([]);
  });
  it("skips internal fields", () => {
    expect(hits({ exams: ["ugc-net", "cuet-pg"], ref: "UGC NET syllabus Unit 1", id: "net-paper1", stem: "Plain stem" })).toEqual([]);
  });
});
