import { describe, expect, it } from "vitest";
import { CHAPTERS, DIAGNOSES, diagnosisById, searchDiagnoses } from "../diagnoses";
import { CASES, caseById } from "./cases";
import {
  apply,
  canOpenClue,
  cleanLog,
  dailyIndex,
  dailyStreak,
  isCorrect,
  MAX_CLUES,
  pickPractice,
  replay,
  scoreOf,
  shareGrid,
  shareText,
  start,
  summariseCohort,
  targetDifficulty,
  wrongReason,
  xpFor,
} from "./engine";
import { buildView } from "./view";

const mdd = caseById("dc-001")!;

describe("case bank", () => {
  it("has at least 45 cases with unique neutral ids", () => {
    expect(CASES.length).toBeGreaterThanOrEqual(45);
    expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length);
    for (const c of CASES) expect(c.id).toMatch(/^dc-\d{3}$/);
  });

  it("every case is well formed", () => {
    for (const c of CASES) {
      const dx = diagnosisById(c.answer);
      expect(dx, c.id).toBeTruthy();
      expect(dx!.chapter, c.id).toBe(c.chapter);
      expect(c.clues).toHaveLength(6);
      expect(c.investigations.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.differentials.length, c.id).toBeGreaterThanOrEqual(2);
      for (const d of c.differentials) {
        expect(diagnosisById(d.dx), `${c.id} → ${d.dx}`).toBeTruthy();
        expect(d.dx).not.toBe(c.answer);
      }
      expect(c.refs.length, c.id).toBeGreaterThan(0);
      expect(c.overview.length).toBeGreaterThan(80);
      expect(CHAPTERS[c.chapter]).toBeTruthy();
    }
  });

  it("clues never name the answer", () => {
    for (const c of CASES) {
      const name = diagnosisById(c.answer)!.name.toLowerCase();
      for (const clue of c.clues) expect(clue.toLowerCase().includes(name), `${c.id}: ${clue}`).toBe(false);
      for (const inv of c.investigations) expect(inv.label.toLowerCase().includes(name)).toBe(false);
    }
  });

  it("spans the required chapters", () => {
    const chapters = new Set(CASES.map((c) => c.chapter));
    for (const ch of ["depressive", "bipolar", "anxiety", "ocd", "trauma", "psychotic", "personality", "substance", "neurocognitive", "eating", "sleep", "neurodevelopmental", "somatic", "dissociative"]) {
      expect(chapters.has(ch as never), ch).toBe(true);
    }
  });

  it("has about 70+ diagnoses with unique ids", () => {
    expect(DIAGNOSES.length).toBeGreaterThanOrEqual(70);
    expect(new Set(DIAGNOSES.map((d) => d.id)).size).toBe(DIAGNOSES.length);
  });
});

describe("search", () => {
  it("finds by alias and prefix", () => {
    expect(searchDiagnoses("dysthymia")[0].id).toBe("pdd");
    expect(searchDiagnoses("ptsd")[0].id).toBe("ptsd");
    expect(searchDiagnoses("bipo").map((d) => d.id)).toContain("bipolar-2");
    expect(searchDiagnoses("")).toEqual([]);
  });
});

describe("moves", () => {
  it("a wrong guess explains why and reveals the next clue", () => {
    const p = apply(mdd, start(), { t: "guess", dx: "pdd" });
    expect(p.clues).toBe(2);
    expect(p.guesses[0].ok).toBe(false);
    expect(p.guesses[0].reason).toMatch(/2 years/);
    expect(p.guesses[0].sameChapter).toBe(true);
    expect(p.chapterHit).toBe(true);
  });

  it("falls back to the criterion the guess needs", () => {
    const r = wrongReason(mdd, "narcolepsy");
    expect(r.sameChapter).toBe(false);
    expect(r.reason).toMatch(/Narcolepsy needs/);
  });

  it("solving on clue 1 scores 100; each clue point costs 15", () => {
    expect(scoreOf(apply(mdd, start(), { t: "guess", dx: "mdd" }))).toBe(100);
    let p = apply(mdd, start(), { t: "inv", i: 0 });
    p = apply(mdd, p, { t: "clue" });
    p = apply(mdd, p, { t: "guess", dx: "mdd" });
    expect(p.status).toBe("solved");
    expect(scoreOf(p)).toBe(70);
  });

  it("hints don't cost points but cap at two, and the chapter hint removes chapter credit", () => {
    let p = apply(mdd, start(), { t: "hint" });
    p = apply(mdd, p, { t: "hint" });
    expect(apply(mdd, p, { t: "hint" })).toBe(p);
    p = apply(mdd, p, { t: "guess", dx: "pdd" });
    expect(p.chapterHit).toBe(false);
  });

  it("a wrong guess on the last clue ends the case; chapter credit gives 15", () => {
    // From clue 4 on only a guess opens the next clue, so get there with wrong guesses from other chapters.
    let p = apply(mdd, start(), { t: "clue" });
    p = apply(mdd, p, { t: "clue" });
    for (const d of DIAGNOSES.filter((x) => x.chapter !== mdd.chapter).slice(0, MAX_CLUES - 3)) p = apply(mdd, p, { t: "guess", dx: d.id });
    expect(p.clues).toBe(MAX_CLUES);
    expect(p.chapterHit).toBe(false);
    p = apply(mdd, p, { t: "guess", dx: "pmdd" });
    expect(p.status).toBe("lost");
    expect(scoreOf(p)).toBe(15);
    expect(apply(mdd, p, { t: "guess", dx: "mdd" })).toBe(p);
  });

  it("ignores repeats, bad investigations and unknown diagnoses", () => {
    const p = apply(mdd, start(), { t: "inv", i: 1 });
    expect(apply(mdd, p, { t: "inv", i: 1 })).toBe(p);
    expect(apply(mdd, p, { t: "inv", i: 99 })).toBe(p);
    expect(apply(mdd, p, { t: "guess", dx: "nope" })).toBe(p);
  });

  it("accepts synonyms", () => {
    const c = { ...mdd, synonyms: ["Persistent depressive disorder"] };
    expect(isCorrect(c, "pdd")).toBe(true);
    expect(isCorrect(mdd, "pdd")).toBe(false);
  });

  it("replay drops no-ops and cleanLog drops junk", () => {
    const log = cleanLog([{ t: "clue" }, { t: "clue" }, { t: "nope" }, null, { t: "guess", dx: "mdd" }, { t: "clue" }]);
    expect(log).toHaveLength(4);
    const r = replay(mdd, log);
    expect(r.progress.status).toBe("solved");
    expect(r.log).toHaveLength(3);
  });
});

describe("hint and clue rules", () => {
  it("from clue 4 the next clue needs a guess first", () => {
    let p = apply(mdd, start(), { t: "clue" });
    p = apply(mdd, p, { t: "clue" });
    expect(p.clues).toBe(3);
    expect(canOpenClue(p)).toBe(false);
    expect(apply(mdd, p, { t: "clue" })).toBe(p);
    const other = DIAGNOSES.find((x) => x.chapter !== mdd.chapter)!;
    p = apply(mdd, p, { t: "guess", dx: other.id });
    expect(p.clues).toBe(4);
  });

  it("a hint lowers the case score, never below zero", () => {
    const solved = apply(mdd, start(), { t: "guess", dx: "mdd" });
    expect(scoreOf(solved)).toBe(100);
    let p = apply(mdd, start(), { t: "hint" });
    expect(scoreOf(apply(mdd, p, { t: "guess", dx: "mdd" }))).toBe(90);
    p = apply(mdd, p, { t: "hint" });
    expect(scoreOf(apply(mdd, p, { t: "guess", dx: "mdd" }))).toBe(80);
    expect(xpFor("practice", 80)).toBeLessThan(xpFor("practice", 100));
    // At the floor of 10, hints still take it lower.
    let q = apply(mdd, start(), { t: "hint" });
    q = apply(mdd, q, { t: "hint" });
    q = apply(mdd, q, { t: "clue" });
    q = apply(mdd, q, { t: "clue" });
    for (let i = 0; i < 6; i++) q = apply(mdd, q, { t: "inv", i });
    expect(Math.max(10, 100 - 15 * (q.clues - 1 + q.invs.length))).toBe(10);
    q = apply(mdd, q, { t: "guess", dx: "mdd" });
    expect(scoreOf(q)).toBe(0);
  });
});

describe("share card", () => {
  it("is spoiler-free", () => {
    let p = apply(mdd, start(), { t: "inv", i: 0 });
    p = apply(mdd, p, { t: "guess", dx: "gad" });
    p = apply(mdd, p, { t: "guess", dx: "mdd" });
    expect(shareGrid(p)).toBe("🔎🟥🟩");
    const text = shareText({ grid: shareGrid(p), solved: true, clue: p.clues, score: scoreOf(p), dayLabel: "6 Nov", streak: 3, url: "https://x.test/games/daily", channel: "whatsapp" });
    expect(text).toContain("Solved on clue 2/6 · 70 pts");
    expect(text).toContain("🔥 3-day streak");
    expect(text).toContain("https://x.test");
    expect(text.toLowerCase()).not.toContain("depress");
    expect(shareText({ grid: "🟩", solved: false, clue: 6, score: 0, dayLabel: "6 Nov", streak: 0, channel: "instagram" })).toContain("#VIBHADailyCase");
  });
});

describe("view", () => {
  it("hides the answer and unrevealed clues until the end", () => {
    const v = buildView(mdd, start(), "daily", false);
    expect(v.clues).toHaveLength(1);
    expect(v.reveal).toBeNull();
    expect(v.investigations.every((x) => x.result === null)).toBe(true);
    expect(JSON.stringify(v)).not.toContain("Major depressive");
    const done = buildView(mdd, apply(mdd, start(), { t: "giveup" }), "daily", false);
    expect(done.reveal?.answer).toBe("Major depressive disorder");
    expect(done.reveal?.refs).toBeNull();
    expect(buildView(mdd, apply(mdd, start(), { t: "giveup" }), "daily", true).reveal?.refs?.length).toBeGreaterThan(0);
  });
});

describe("daily rotation, streak, cohort, practice", () => {
  it("same case all day, different on neighbouring days, covers the bank", () => {
    const n = CASES.length;
    expect(dailyIndex("2026-11-06", n)).toBe(dailyIndex("2026-11-06", n));
    expect(dailyIndex("2026-11-06", n)).not.toBe(dailyIndex("2026-11-07", n));
    const seen = new Set<number>();
    for (let i = 0; i < n; i++) seen.add(dailyIndex(new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10), n));
    expect(seen.size).toBe(n);
  });

  it("streak counts back from today or yesterday", () => {
    expect(dailyStreak(["2026-11-06", "2026-11-05", "2026-11-04", "2026-11-01"], "2026-11-06")).toBe(3);
    expect(dailyStreak(["2026-11-05", "2026-11-04"], "2026-11-06")).toBe(2);
    expect(dailyStreak(["2026-11-03"], "2026-11-06")).toBe(0);
    expect(dailyStreak([], "2026-11-06")).toBe(0);
  });

  it("cohort stats", () => {
    const s = summariseCohort([
      { status: "solved", clues: 2, score: 85 },
      { status: "solved", clues: 5, score: 40 },
      { status: "lost", clues: 6, score: 0 },
      { status: "playing", clues: 1, score: 0 },
    ]);
    expect(s).toEqual({ played: 3, solved: 2, within3: 1, pctWithin3: 33, avgScore: 42 });
    expect(summariseCohort([]).pctWithin3).toBe(0);
  });

  it("practice adapts difficulty and skips the daily case", () => {
    expect(targetDifficulty([])).toBe(1);
    expect(targetDifficulty([{ id: "a", score: 90, difficulty: 1 }])).toBe(2);
    expect(targetDifficulty([{ id: "a", score: 10, difficulty: 2 }])).toBe(1);
    expect(targetDifficulty([{ id: "a", score: 100, difficulty: 3 }])).toBe(3);
    const cases = [
      { id: "x1", difficulty: 1 as const },
      { id: "x2", difficulty: 2 as const },
      { id: "x3", difficulty: 2 as const },
    ];
    expect(pickPractice(cases, [{ id: "x1", score: 95, difficulty: 1 }], "x2", 0)).toBe("x3");
    expect(pickPractice(cases, [], "x1", 0)).toBe("x2");
    expect(pickPractice(cases, [], "x1", 0.99)).toBe("x3");
    expect(pickPractice([{ id: "x1", difficulty: 1 }], [], "x1", 0)).toBeNull();
  });
  it("answer history: once every case is played, missed ones come back, then solved ones oldest first", () => {
    const cases = [
      { id: "x1", difficulty: 1 as const },
      { id: "x2", difficulty: 1 as const },
      { id: "x3", difficulty: 1 as const },
    ];
    const played = [
      { id: "x1", score: 90, difficulty: 1, solved: true },
      { id: "x2", score: 0, difficulty: 1, solved: false },
      { id: "x3", score: 80, difficulty: 1, solved: true },
    ];
    for (const roll of [0, 0.5, 0.99]) expect(pickPractice(cases, played, "none", roll)).toBe("x2");
    const allSolved = played.map((p) => ({ ...p, solved: true, score: 90 }));
    expect(pickPractice(cases, allSolved, "none", 0.7)).toBe("x1");
    expect(pickPractice(cases, [...allSolved, { id: "x1", score: 90, difficulty: 1, solved: true }], "none", 0.7)).toBe("x2");
  });
});
