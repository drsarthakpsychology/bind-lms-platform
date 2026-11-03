import { describe, expect, it } from "vitest";
import { computeLearningInsights, csvCell, lastActiveDay, studentsCsv, type InsightCatalog, type InsightRow } from "./learning";
import { emptyState, normalise } from "@/lib/learn/engine";

const TODAY = "2026-11-03";

const CATALOG: InsightCatalog = {
  modules: [
    { id: "anxiety", num: 1, title: "Anxiety", sections: ["1-1", "1-2"] },
    { id: "mood", num: 2, title: "Mood", sections: ["2-1", "2-2", "2-3"] },
    { id: "psychosis", num: 3, title: "Psychosis", sections: ["3-1"] },
  ],
  experiments: [
    { id: "stroop", num: 3, title: "Stroop" },
    { id: "digit-span", num: 1, title: "Digit span" },
    { id: "serial-position", num: 2, title: "Serial position" },
  ],
  conceptLabel: (id) => ({ anhedonia: "Anhedonia", avolition: "Avolition" })[id],
};

const lab = (result: Record<string, number>, extra: Record<string, unknown> = {}) => ({
  runs: 1,
  first: "2026-10-30",
  last: "2026-10-30",
  result,
  check: null,
  recheck: { step: 0, due: "2026-11-02" },
  reflected: false,
  ...extra,
});

function state(over: Record<string, unknown>) {
  return { ...emptyState(), xp: 50, daily: { day: "2026-11-02", xp: 10, goalHit: false }, ...over };
}

const ROWS: InsightRow[] = [
  {
    user_id: "u1",
    name: "Asha",
    state: state({
      study: {
        done: { "anxiety/1-1": "2026-11-01", "anxiety/1-2": "2026-11-02", "mood/2-1": "2026-11-02", "ghost/9-9": "2026-11-02" },
        secs: {},
        tests: { anxiety: { best: 9, total: 10, day: "2026-11-02", tries: 1 }, mood: { best: 2, total: 10, day: "2026-11-02", tries: 2 } },
        written: {},
        acts: {},
        last: null,
      },
      coach: { concepts: {}, confusions: { "anhedonia|avolition": 3 } },
      lab: {
        stroop: lab({ effect: 100, congruent: 600, incongruent: 700 }, { runs: 2, check: { right: 3, total: 4 }, reflected: true }),
        "digit-span": lab({ forward: 7, backward: 5 }),
      },
    }),
  },
  {
    user_id: "u2",
    name: "Bilal",
    state: state({
      daily: { day: "2026-10-20", xp: 10, goalHit: false },
      history: { "2026-10-20": 20 },
      study: {
        done: { "anxiety/1-1": "2026-10-20" },
        secs: {},
        tests: { anxiety: { best: 7, total: 10, day: "2026-10-20", tries: 1 }, mood: { best: 4, total: 10, day: "2026-10-20", tries: 1 } },
        written: {},
        acts: {},
        last: null,
      },
      coach: { concepts: {}, confusions: { "anhedonia|avolition": 1, "a|b": 5 } },
      lab: { stroop: lab({ effect: 50 }, { check: { right: 1, total: 4 }, first: "2026-10-20", last: "2026-10-20" }) },
      srs: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`q${i}`, { box: 1, due: "2026-10-21" }])),
    }),
  },
  // Never opened Learn.
  { user_id: "u3", name: "Chitra", state: null },
];

describe("computeLearningInsights", () => {
  const ins = computeLearningInsights(ROWS, CATALOG, TODAY);

  it("counts students and who has started", () => {
    expect(ins.students).toBe(3);
    expect(ins.started).toBe(2);
  });

  it("counts module starts and completions, ignoring unknown sections", () => {
    const anxiety = ins.modules.find((m) => m.id === "anxiety")!;
    expect(anxiety).toMatchObject({ started: 2, completed: 1, testTakers: 2, avgTestPct: 80 });
    const mood = ins.modules.find((m) => m.id === "mood")!;
    expect(mood).toMatchObject({ started: 1, completed: 0, avgTestPct: 30 });
    expect(ins.modules.find((m) => m.id === "psychosis")).toMatchObject({ started: 0, avgTestPct: null });
  });

  it("lists struggling modules lowest first, needing enough takers", () => {
    expect(ins.struggles.map((m) => m.id)).toEqual(["mood", "anxiety"]);
    const strict = computeLearningInsights(ROWS, CATALOG, TODAY, { minTakers: 3 });
    expect(strict.struggles).toEqual([]);
  });

  it("sums confusions across students with labels", () => {
    expect(ins.confusions[0]).toMatchObject({ a: "a", b: "b", times: 5, students: 1, aLabel: "a" });
    expect(ins.confusions[1]).toMatchObject({ aLabel: "Anhedonia", bLabel: "Avolition", times: 4, students: 2 });
  });

  it("summarises the Lab with cohort averages of the headline numbers", () => {
    const stroop = ins.lab.find((l) => l.id === "stroop")!;
    expect(stroop).toMatchObject({ runs: 3, students: 2, checked: 2, avgCheckPct: 50, reflected: 1, reflectPct: 50 });
    expect(stroop.headline[0]).toMatchObject({ key: "effect", mean: 75, median: 75, n: 2, unit: "ms" });
    expect(stroop.headline.find((h) => h.key === "congruent")?.n).toBe(1);
    const span = ins.lab.find((l) => l.id === "digit-span")!;
    expect(span.headline.map((h) => [h.key, h.mean])).toEqual([["forward", 7], ["backward", 5]]);
    const sp = ins.lab.find((l) => l.id === "serial-position")!;
    expect(sp).toMatchObject({ students: 0, avgCheckPct: null, reflectPct: null, headline: [] });
  });

  it("finds quiet students and students with many reviews due", () => {
    expect(ins.inactive.map((s) => s.name)).toEqual(["Bilal"]);
    expect(ins.inactive[0].daysInactive).toBe(14);
    expect(ins.manyDue.map((s) => s.name)).toEqual(["Bilal"]);
    expect(ins.manyDue[0].dueReviews).toBe(21); // 20 cards + 1 Lab re-check
    // Never-started students are not "quiet": they are reported separately.
    expect(ins.inactive.some((s) => s.userId === "u3")).toBe(false);
  });

  it("builds a per-student summary", () => {
    const a = ins.perStudent.find((s) => s.userId === "u1")!;
    expect(a).toMatchObject({ sectionsDone: 3, modulesCompleted: 1, testsTaken: 2, avgTestPct: 55, labsDone: 2, reflections: 1, lastActive: "2026-11-02" });
    expect(ins.perStudent.find((s) => s.userId === "u3")).toMatchObject({ started: false, lastActive: null, daysInactive: null, xp: 0 });
    expect(ins.perStudent.map((s) => s.name)).toEqual(["Asha", "Bilal", "Chitra"]);
  });

  it("survives malformed JSON and odd rows", () => {
    const bad: InsightRow[] = [
      { user_id: "x1", name: "", state: "not json" },
      { user_id: "x2", name: "Odd", state: { xp: "lots", study: { tests: { anxiety: { best: 5, total: 0 } }, done: { "anxiety/1-1": 5 } }, coach: { confusions: { "p|q": "x", nopipe: 3 } }, srs: { a: null }, lab: { stroop: { runs: 3 } }, history: [1, 2] } },
      { user_id: "x2", name: "Duplicate", state: {} },
      null as unknown as InsightRow,
      { user_id: "x3", name: "Nums", state: { study: { done: {}, tests: { mood: { best: 20, total: 10 } } } } },
    ];
    const out = computeLearningInsights(bad, CATALOG, TODAY);
    expect(out.students).toBe(3);
    expect(out.perStudent.find((s) => s.userId === "x1")?.name).toBe("Unnamed student");
    expect(out.confusions).toEqual([]);
    expect(out.lab.every((l) => l.students === 0)).toBe(true);
    // A best above the total is capped at 100%.
    expect(out.modules.find((m) => m.id === "mood")?.avgTestPct).toBe(100);
    expect(out.modules.find((m) => m.id === "anxiety")?.testTakers).toBe(0);
  });

  it("handles no data", () => {
    const out = computeLearningInsights([], CATALOG, TODAY);
    expect(out).toMatchObject({ students: 0, started: 0, struggles: [], confusions: [], inactive: [], manyDue: [] });
  });
});

describe("lastActiveDay", () => {
  it("takes the latest dated activity", () => {
    const s = normalise({ daily: { day: "2026-10-01" }, history: { "2026-10-05": 10, "2026-10-09": 0 }, lab: { stroop: lab({}, { last: "2026-10-07", first: "2026-10-07" }) } });
    expect(lastActiveDay(s)).toBe("2026-10-07");
  });
  it("falls back to updated_at, then null", () => {
    expect(lastActiveDay(emptyState(), "2026-10-03T10:00:00Z")).toBe("2026-10-03");
    expect(lastActiveDay(emptyState(), "garbage")).toBeNull();
  });
});

describe("csv", () => {
  it("quotes and escapes", () => {
    expect(csvCell('a "b", c')).toBe('"a ""b"", c"');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
    expect(csvCell(null)).toBe("");
    expect(csvCell(42)).toBe("42");
  });
  it("neutralises formula injection", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe('"\'=HYPERLINK(""x"")"');
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("-2")).toBe("'-2");
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(csvCell("plain")).toBe("plain");
  });
  it("writes a header and one line per student", () => {
    const ins = computeLearningInsights([{ user_id: "u9", name: "=evil", state: null }], CATALOG, TODAY);
    const csv = studentsCsv(ins.perStudent);
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(2);
    expect(lines[0].startsWith("Name,User id,")).toBe(true);
    expect(lines[1].startsWith("'=evil,u9,no,")).toBe(true);
  });
});
