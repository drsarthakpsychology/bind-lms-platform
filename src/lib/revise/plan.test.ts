import { describe, expect, it } from "vitest";
import { addDays, emptyState, type LabRecord, type LearnState } from "@/lib/learn/engine";
import { buildRevisionPlan, lastTouched, nextRetest, pickToday, REVISE, toReviseModule, type ReviseItem, type ReviseModule } from "./plan";
import { experimentById } from "@/lib/lab/experiments";
import type { StudyModule } from "@/lib/study/types";

const today = "2026-11-03"; // a Tuesday

const mod = (id: string, n = 3, noteId?: string): ReviseModule => ({
  id,
  title: `Module ${id}`,
  ...(noteId ? { noteId } : {}),
  reading: Array.from({ length: n }, (_, i) => `${i + 1}-1`),
  test: "test",
});

const MODS = [mod("anxiety", 3, "anxiety-note"), mod("depression"), mod("psychosis"), mod("ocd")];

/** Every reading section of `m` finished on `day`. */
function finished(s: LearnState, m: ReviseModule, day: string): LearnState {
  const done = { ...s.study.done };
  for (const r of m.reading) done[`${m.id}/${r}`] = day;
  return { ...s, study: { ...s.study, done } };
}

function tested(s: LearnState, id: string, best: number, total: number, day: string, tries = 1): LearnState {
  return { ...s, study: { ...s.study, tests: { ...s.study.tests, [id]: { best, total, day, tries } } } };
}

function labRec(due: string, check: LabRecord["check"] = { right: 2, total: 3 }): LabRecord {
  return { runs: 1, first: "2026-10-01", last: "2026-10-01", result: {}, check, recheck: { step: 0, due }, reflected: false };
}

function item(id: string, topic: string, priority: number, minutes = 3): ReviseItem {
  return { id, kind: "lab", topic, title: id, why: "", href: "/", minutes, priority };
}

describe("buildRevisionPlan", () => {
  it("empty state: new student, nothing listed", () => {
    const p = buildRevisionPlan(emptyState(), today, MODS);
    expect(p.status).toBe("new");
    expect(p.today).toEqual([]);
    expect(p.later).toEqual([]);
    expect(p.minutes).toBe(0);
    expect(p.week.days).toHaveLength(7);
    expect(p.week.days.at(-1)!.day).toBe(today);
    expect(p.week.modules).toBe(0);
  });

  it("studied but nothing due: all caught up", () => {
    const s = finished(emptyState(), MODS[1], addDays(today, -2));
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.status).toBe("clear");
    expect(p.today).toEqual([]);
  });

  it("due quiz reviews come first, capped at the 12 the player takes", () => {
    const srs: LearnState["srs"] = {};
    for (let i = 0; i < 20; i++) srs[`q${i}`] = { box: 1, due: today };
    srs.later = { box: 2, due: addDays(today, 2) };
    const s = tested({ ...emptyState(), srs }, "depression", 4, 10, addDays(today, -3));
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.status).toBe("ready");
    expect(p.today[0].kind).toBe("review");
    expect(p.today[0].title).toBe("Review 12 quiz questions");
    expect(p.today[0].href).toBe("/prep/smart/play?mode=review");
    expect(p.today[0].minutes).toBe(6);
    const soon = p.later.find((l) => l.id === "review-soon")!;
    expect(soon.title).toBe("1 quiz question comes back");
    expect(soon.when).toBe("Thursday");
  });

  it("re-test due on day 3, 7 and 21, with a weak score bumping it", () => {
    let s = tested(emptyState(), "anxiety", 9, 10, addDays(today, -3), 1);
    let p = buildRevisionPlan(s, today, MODS);
    expect(p.today[0]).toMatchObject({ kind: "retest", href: "/study/anxiety/test", priority: 90 });
    expect(p.today[0].why).toContain("3-day");

    s = tested(emptyState(), "anxiety", 4, 10, addDays(today, -9), 2); // due 2 days ago
    p = buildRevisionPlan(s, today, MODS);
    expect(p.today[0]).toMatchObject({ kind: "retest", priority: 97 });
    expect(p.today[0].why).toContain("4/10");
    expect(p.today.filter((i) => i.topic === "anxiety")).toHaveLength(1); // no separate weak item

    s = tested(emptyState(), "anxiety", 9, 10, addDays(today, -30), 4); // all re-tests done
    p = buildRevisionPlan(s, today, MODS);
    expect(p.today.some((i) => i.kind === "retest")).toBe(false);
  });

  it("an upcoming re-test shows in later this week, not today", () => {
    const s = tested(emptyState(), "ocd", 9, 10, addDays(today, -1), 1); // due in 2 days
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.today).toEqual([]);
    expect(p.later[0]).toMatchObject({ kind: "retest", due: addDays(today, 2), when: "Thursday" });
  });

  it("weak test score with no re-test due: go over the notes", () => {
    const s = tested(emptyState(), "anxiety", 5, 10, addDays(today, -1), 1); // re-test in 2 days
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.today).toHaveLength(1);
    expect(p.today[0]).toMatchObject({ kind: "weak-test", href: "/study/notes/anxiety-note", priority: 64 });
    expect(p.today[0].why).toContain("5/10");
    // Without a note, it links to the module.
    const p2 = buildRevisionPlan(tested(emptyState(), "depression", 6, 10, addDays(today, -1)), today, MODS);
    expect(p2.today[0].href).toBe("/study/depression");
  });

  it("a finished module not touched for 14+ days gets a refresh", () => {
    let s = finished(emptyState(), MODS[2], addDays(today, -30));
    let p = buildRevisionPlan(s, today, MODS);
    expect(p.today[0]).toMatchObject({ kind: "refresh", topic: "psychosis", priority: 32 });
    expect(p.today[0].why).toContain("30 days");

    // Touched recently (activity) → no refresh.
    s = { ...s, study: { ...s.study, acts: { psychosis: { coach: addDays(today, -3) } } } };
    expect(lastTouched(s, MODS[2])).toBe(addDays(today, -3));
    p = buildRevisionPlan(s, today, MODS);
    expect(p.today).toEqual([]);

    // Half-read module is "Continue" territory, not revision.
    const half = { ...emptyState(), study: { ...emptyState().study, done: { "depression/1-1": addDays(today, -40) } } };
    expect(buildRevisionPlan(half, today, MODS).today).toEqual([]);
  });

  it("lab re-checks due today, upcoming ones later; hidden when the Lab is closed", () => {
    const s: LearnState = { ...emptyState(), lab: { stroop: labRec(addDays(today, -1)), "digit-span": labRec(addDays(today, 3)), "serial-position": labRec(today, null) } };
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.today).toHaveLength(1);
    expect(p.today[0]).toMatchObject({ kind: "lab", title: `Re-check: ${experimentById("stroop")!.title}`, href: "/games/lab/stroop?recheck=1", priority: 71 });
    expect(p.today[0].why).toContain("2/3");
    expect(p.later.map((l) => l.href)).toContain("/games/lab/digit-span");

    const closed = buildRevisionPlan(s, today, MODS, { lab: false });
    expect(closed.today).toEqual([]);
    expect(closed.later).toEqual([]);
  });

  it("confused coach concepts become one item per area, named by the pair", () => {
    const stat = (teach: boolean, wrong: number, lvl = 1) => ({ lvl, seen: 3, right: 1, wrong, due: today, teach, miss: [] });
    const s: LearnState = {
      ...emptyState(),
      coach: {
        concepts: { anhedonia: stat(true, 2), avolition: stat(true, 1), alogia: stat(false, 0, 2) },
        confusions: { "anhedonia|avolition": 3 },
      },
    };
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.today).toHaveLength(1);
    expect(p.today[0]).toMatchObject({ kind: "coach", title: "Anhedonia vs Avolition", href: "/prep/smart/coach?domain=psychopathology", priority: 82 });
    expect(p.today[0].why).toContain("3 times");

    // Only ordinary reviews: needs at least 3 in an area.
    const quiet: LearnState = { ...emptyState(), coach: { concepts: { anhedonia: stat(false, 0, 2), avolition: stat(false, 0, 2) }, confusions: {} } };
    expect(buildRevisionPlan(quiet, today, MODS).status).toBe("clear");
    const three: LearnState = { ...emptyState(), coach: { concepts: { anhedonia: stat(false, 0, 2), avolition: stat(false, 0, 2), alogia: stat(false, 0, 2) }, confusions: {} } };
    expect(buildRevisionPlan(three, today, MODS).today[0]).toMatchObject({ kind: "coach", title: "Coach: Signs & symptoms", priority: 48 });
  });

  it("interleaves topics and caps the day at about 20 minutes and 6 items", () => {
    const lab: LearnState["lab"] = {
      stroop: labRec(addDays(today, -5)),
      "digit-span": labRec(addDays(today, -4)),
      "serial-position": labRec(addDays(today, -3)),
      "change-detection": labRec(addDays(today, -2)),
    };
    let s: LearnState = { ...emptyState(), lab, srs: { a: { box: 1, due: today }, b: { box: 1, due: today } } };
    s = tested(s, "anxiety", 9, 10, addDays(today, -3));
    s = tested(s, "depression", 4, 10, addDays(today, -1));
    s = finished(s, MODS[2], addDays(today, -20));
    const p = buildRevisionPlan(s, today, MODS);

    expect(p.minutes).toBeLessThanOrEqual(REVISE.capMinutes);
    expect(p.today.length).toBeLessThanOrEqual(REVISE.maxItems);
    // Topics alternate while there is room; never three in a row.
    expect(p.today.slice(0, 3).map((i) => i.kind)).toEqual(["review", "retest", "lab"]);
    for (let i = 2; i < p.today.length; i++) expect(p.today[i].topic === p.today[i - 1].topic && p.today[i].topic === p.today[i - 2].topic).toBe(false);
    expect(p.today.filter((i) => i.topic === "lab").length).toBeLessThanOrEqual(2);
    expect(p.today[0].kind).toBe("review");
    // What didn't fit is offered as "If you have time".
    expect(p.later.some((l) => l.when === "If you have time")).toBe(true);
    // Nothing is listed twice.
    const ids = [...p.today, ...p.later].map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("counts this week's active days and modules", () => {
    let s: LearnState = { ...emptyState(), history: { [today]: 20, [addDays(today, -2)]: 5, [addDays(today, -9)]: 50 } };
    s = finished(s, MODS[0], addDays(today, -1));
    s = finished(s, MODS[1], addDays(today, -10));
    const p = buildRevisionPlan(s, today, MODS);
    expect(p.week.days.filter((d) => d.active).length).toBe(2);
    expect(p.week.modules).toBe(1);
  });
});

describe("pickToday", () => {
  it("never puts the same topic three in a row, even with nothing else left", () => {
    const [picked, left] = pickToday([item("a1", "a", 90), item("a2", "a", 89), item("a3", "a", 88), item("b1", "b", 10)]);
    expect(picked.map((p) => p.id)).toEqual(["a1", "b1", "a2"]);
    expect(left.map((p) => p.id)).toEqual(["a3"]);
  });

  it("always takes the first item, even if it is long", () => {
    const [picked] = pickToday([item("big", "a", 90, 30), item("small", "b", 10, 2)]);
    expect(picked.map((p) => p.id)).toEqual(["big"]);
  });

  it("skips an item that would break the cap but keeps smaller ones", () => {
    const [picked, left] = pickToday([item("x", "a", 90, 15), item("y", "b", 80, 10), item("z", "c", 70, 4)]);
    expect(picked.map((p) => p.id)).toEqual(["x", "z"]);
    expect(left.map((p) => p.id)).toEqual(["y"]);
  });
});

describe("module helpers", () => {
  it("toReviseModule keeps ids only", () => {
    const m = {
      id: "ocd",
      title: "OCD",
      noteId: "ocd-note",
      sections: [
        { id: "1-1", isTest: false },
        { id: "9-9", isTest: true },
      ],
    } as unknown as StudyModule;
    expect(toReviseModule(m)).toEqual({ id: "ocd", title: "OCD", noteId: "ocd-note", reading: ["1-1"], test: "9-9" });
  });

  it("nextRetest follows the 3, 7, 21 day gaps", () => {
    const m = MODS[0];
    expect(nextRetest(emptyState(), m)).toBeNull();
    expect(nextRetest(tested(emptyState(), m.id, 1, 2, today, 1), m)).toBe(addDays(today, 3));
    expect(nextRetest(tested(emptyState(), m.id, 1, 2, today, 2), m)).toBe(addDays(today, 7));
    expect(nextRetest(tested(emptyState(), m.id, 1, 2, today, 3), m)).toBe(addDays(today, 21));
    expect(nextRetest(tested(emptyState(), m.id, 1, 2, today, 4), m)).toBeNull();
  });
});
