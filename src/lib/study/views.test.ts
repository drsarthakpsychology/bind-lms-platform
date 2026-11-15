import { describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";
import { parseBlocks } from "./parse";
import { sectionHasViews, singleVoiceSection, viewText } from "./views";

const blocks = (src: string) => parseBlocks(src.split("\n"));

describe("the two reading views", () => {
  it("text written once shows in both views, so the switch would change nothing", () => {
    const b = blocks("Mood is the climate.\n\n:::analogy Weather\nEmotions are the weather.\n:::");
    expect(sectionHasViews({ blocks: b })).toBe(false);
    expect(viewText(b, "student")).toBe(viewText(b, "clinician"));
  });

  it("a clinician block makes the views differ", () => {
    const b = blocks("Mood is the climate.\n\n:::clinician\nDocument mood in the patient's words.\n:::");
    expect(sectionHasViews({ blocks: b })).toBe(true);
    expect(viewText(b, "clinician")).toContain("patient's words");
    expect(viewText(b, "student")).not.toContain("patient's words");
  });

  it("a view block inside a box counts too", () => {
    expect(sectionHasViews({ blocks: blocks(":::example A case\nShe stopped eating.\n\n:::student\nShe has lost interest.\n:::\n:::") })).toBe(true);
  });

  it("a guess with a clinician reveal counts", () => {
    const g = ':::widget guess\n{"prompt": "How long?", "min": 0, "max": 8, "unit": "weeks", "answer": [2, 2], "reveal": "Two weeks.", "clinician": "Criterion A: two weeks."}\n:::';
    expect(sectionHasViews({ blocks: blocks(g) })).toBe(true);
  });

  it("tests, checks, viva and Q&A banks speak in one voice", () => {
    for (const m of MODULES) {
      for (const s of m.sections) {
        if (s.isTest || s.levelCheck || /^Viva|^Q&A bank/.test(s.title)) expect(singleVoiceSection(s), `${m.id} ${s.id}`).toBe(true);
      }
    }
  });
});

describe("screens that always show the switch", () => {
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  it("every quiz explanation, concept, medicine and dose reads differently in the two views", async () => {
    const { ALL_ITEMS } = await import("@/lib/learn/content");
    const { ALL_CONCEPTS } = await import("@/lib/learn/concepts");
    const { MEDS } = await import("@/lib/meds");
    for (const i of ALL_ITEMS) expect(norm(i.student), i.id).not.toBe(norm(i.clinician));
    for (const c of ALL_CONCEPTS) expect(norm(c.student), c.id).not.toBe(norm(c.clinician));
    for (const m of MEDS) {
      expect(norm(m.student), m.id).not.toBe(norm(m.clinician));
      for (const d of m.doses) expect(norm(d.student), `${m.id} ${d.amount}`).not.toBe(norm(d.clinician));
    }
  });

  it("every summary reads differently in the two views", async () => {
    const { NOTES, pick } = await import("@/lib/learn/notes");
    for (const n of NOTES) {
      const text = (v: "student" | "clinician") => norm([pick(n.tldr, v), ...n.sections.flatMap((s) => s.points.map((p) => pick(p, v)))].join("\n"));
      expect(text("student"), n.id).not.toBe(text("clinician"));
    }
  });
});
