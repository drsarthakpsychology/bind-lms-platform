import { describe, expect, it } from "vitest";
import type { Block, StudyModule } from "@/lib/study/types";
import { MODULES } from "@/lib/study";
import { SUBJECT_MODULE } from "./catalog";
import { collectStudyQAs, longSources, longTopics, pageSlice, parseLongAnswer, prepLongItem, selfMark, studyKeyPoints, studyLongItems, studyMarks } from "./long";
import { placeVisuals } from "./visual";
import { SUBJECTS } from "./types";

const qa = (q: string, level?: "starting" | "beginner" | "advanced", blocks: Block[] = [{ t: "h3", text: "Short answer" }, { t: "p", text: "It is a thing. More detail." }]): Block => ({ t: "qa", q, ...(level ? { level } : {}), blocks });

const mod = (id: string, title: string, sections: { id: string; blocks: Block[] }[]): StudyModule =>
  ({ id, num: 1, title, emoji: "", tagline: "", when: "", outcomes: [], writeTask: "", activities: [], minutes: 0, sections: sections.map((s) => ({ ...s, num: s.id, title: s.id, words: 0, isTest: false })) }) as StudyModule;

describe("study Q&As as long answers", () => {
  const modules = [
    mod("therapies", "Therapies", [{ id: "5-1", blocks: [qa("What is CBT?", "starting"), { t: "view", view: "student", blocks: [qa("What is DBT?", "advanced")] }] }]),
    mod("exam-prep", "Exam prep", [
      { id: "2-2", blocks: [qa("Explain sampling (10 marks).")] },
      { id: "5-1", blocks: [qa("Not mapped")] },
    ]),
    mod("depression", "Depression", [{ id: "8-1", blocks: [qa("What is a mood?", "beginner")] }]),
  ];
  const qas = collectStudyQAs(modules);
  const items = studyLongItems(qas);

  it("finds every :::qa block, also inside reading views", () => {
    expect(qas.map((x) => x.q)).toEqual(["What is CBT?", "What is DBT?", "Explain sampling (10 marks).", "Not mapped", "What is a mood?"]);
  });

  it("maps a module to every subject that names it, and keeps its level", () => {
    const cbt = items.filter((x) => x.question === "What is CBT?");
    expect(cbt.map((x) => x.subject).sort()).toEqual(["clinical-therapies", "counselling"]);
    expect(cbt[0]).toMatchObject({ level: "starting", marks: 5, difficulty: 1, source: "study", studyHref: "/study/therapies/5-1", topic: "m-therapies", topicTitle: "Therapies" });
    expect(new Set(cbt.map((x) => x.id)).size).toBe(1);
  });

  it("a module/section entry takes only that section", () => {
    const sampling = items.filter((x) => x.question.startsWith("Explain sampling"));
    expect(sampling.map((x) => x.subject).sort()).toEqual(["research-methods", "statistics"]);
    expect(sampling[0].marks).toBe(10);
    expect(items.some((x) => x.question === "Not mapped")).toBe(false);
  });

  it("disorder modules feed Psychopathology through the extra list", () => {
    expect(items.filter((x) => x.question === "What is a mood?").map((x) => x.subject)).toEqual(["psychopathology"]);
    expect(longSources("psychopathology")).toEqual(expect.arrayContaining([...SUBJECT_MODULE.psychopathology, "depression", "bipolar"]));
  });

  it("orders a topic by level", () => {
    const t = longTopics("clinical-therapies", items);
    expect(t).toHaveLength(1);
    expect(t[0].items.map((x) => x.level)).toEqual(["starting", "advanced"]);
  });

  it("the real course: about 1,500 Q&As, nearly all mapped, every subject listed has answers", () => {
    const all = collectStudyQAs(MODULES);
    expect(all.length).toBeGreaterThan(1400);
    const live = studyLongItems(all);
    const unique = new Set(live.map((x) => x.id));
    expect(unique.size).toBeGreaterThan(1400);
    for (const x of live) {
      expect(x.keyPoints.length).toBeGreaterThan(0);
      expect(x.question).not.toMatch(/\*\*/);
    }
    expect(SUBJECTS.filter((s) => live.some((x) => x.subject === s)).length).toBeGreaterThanOrEqual(18);
  });
});

describe("key points and marks", () => {
  it("takes the short answer, each list point and what a table compares", () => {
    const pts = studyKeyPoints([
      { t: "h3", text: "Short answer" },
      { t: "p", text: "A mood is a slow state. It lasts days." },
      { t: "ul", items: [{ text: "**Length.** Moods last longer than emotions." }, { text: "Width: it greys everything." }] },
      { t: "table", head: ["", "A", "B"], rows: [["How long", "x", "y"], ["Tied to events?", "x", "y"]] },
    ]);
    expect(pts).toEqual(["A mood is a slow state.", "Length: Moods last longer than emotions.", "Width: it greys everything.", "Compares How long, Tied to events?"]);
  });
  it("falls back on headings when there are few points", () => {
    expect(studyKeyPoints([{ t: "h3", text: "Short answer" }, { t: "p", text: "One." }, { t: "h3", text: "Why it matters" }, { t: "h3", text: "In practice" }])).toEqual(["One.", "Why it matters", "In practice"]);
  });
  it("marks: what the question says, else the level", () => {
    expect(studyMarks("Model short note (5 marks): X", "advanced", [])).toBe(5);
    expect(studyMarks("Explain X", "beginner", [])).toBe(10);
    expect(studyMarks("Explain X", undefined, [])).toBe(5);
  });
});

describe("answer format", () => {
  it("reads headings, bullets, numbered steps, tables and paragraphs", () => {
    const blocks = parseLongAnswer(
      ["## Introduction", "Depression is common.", "It is treatable.", "", "## Features", "- Low mood", "- **Anhedonia**", "1. First", "2. Second", "", "| Feature | ICD-11 | DSM-5-TR |", "|---|---|---|", "| Duration | 2 weeks | 2 weeks |", "## Conclusion", "Done."].join("\n"),
    );
    expect(blocks).toEqual([
      { t: "h3", text: "Introduction" },
      { t: "p", text: "Depression is common. It is treatable." },
      { t: "h3", text: "Features" },
      { t: "ul", items: [{ text: "Low mood" }, { text: "**Anhedonia**" }] },
      { t: "ol", items: [{ text: "First" }, { text: "Second" }] },
      { t: "table", head: ["Feature", "ICD-11", "DSM-5-TR"], rows: [["Duration", "2 weeks", "2 weeks"]] },
      { t: "h3", text: "Conclusion" },
      { t: "p", text: "Done." },
    ]);
  });
  it("a hand-written answer lands in its bank topic with its own plan and points", () => {
    const item = prepLongItem(
      { id: "lq-1", subject: "statistics", topic: "t-test", marks: 10, difficulty: 3, exams: ["ma-semester"], question: "Explain the t-test.", plan: ["Define", "Types"], answer: "## Define\nA test.", keyPoints: ["Defines it", "Names types"] },
      "Statistics",
      "/study/statistics/2-5",
    );
    expect(item).toMatchObject({ topic: "t-test", topicTitle: "t-tests", marks: 10, source: "prep", plan: ["Define", "Types"], keyPoints: ["Defines it", "Names types"] });
    expect(item.blocks[0]).toEqual({ t: "h3", text: "Define" });
  });
  it("places each diagram after the heading it names, else at the end", () => {
    const v = (caption: string) => ({ kind: "flow" as const, data: {}, caption });
    expect(placeVisuals(["Introduction", "The HPA axis", "Conclusion"], [v("The HPA axis"), v("Something else"), v("")])).toEqual([1, -1, -1]);
  });
});

describe("self-marking", () => {
  it("counts the points ticked", () => {
    expect(selfMark(7, [0, 2, 3, 4, 6])).toEqual({ covered: 5, total: 7, text: "You covered 5 of 7" });
  });
  it("ignores repeats and ticks out of range", () => {
    expect(selfMark(3, [0, 0, 5, -1, 1.5]).covered).toBe(1);
    expect(selfMark(0, []).text).toBe("You covered 0 of 0");
  });
});

describe("pages of 10", () => {
  it("clamps the page", () => {
    const list = Array.from({ length: 23 }, (_, i) => i);
    expect(pageSlice(list, 3)).toEqual({ items: [20, 21, 22], page: 3, pages: 3 });
    expect(pageSlice(list, 9).page).toBe(3);
    expect(pageSlice(list, Number.NaN).items).toHaveLength(10);
  });
});
