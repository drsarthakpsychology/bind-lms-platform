import { describe, expect, it } from "vitest";
import { daysLeftInWeek, leagueWeek, monthLabel, nextMonth, previousMonth, weekOf } from "./week";
import { assignGroups, closeGroup, groupTier, rankGroup, tierName, zoneSize, type Standing, type Tier } from "./tiers";
import { difficultyOf, effortXp, firstTryCorrect, leaguePoints, ledgerXp } from "./points";
import { ordinal, percentileLine, percentileOf } from "./percentile";
import { relativeView, zoneNote } from "./relative";
import { buildStandingUpdate, passedLine, pointsToPlace } from "./standing-update";
import { batchWar } from "./batch-war";
import { balanceOf, canRepair, lookString, parseLook, repairStreak } from "./shop";
import { emptyState } from "@/lib/learn/engine";

const ids = (n: number, p = "u") => Array.from({ length: n }, (_, i) => `${p}${String(i).padStart(3, "0")}`);

describe("league week", () => {
  it("starts on Monday (IST)", () => {
    expect(weekOf("2026-11-06")).toBe("2026-11-02"); // Friday → Monday
    expect(weekOf("2026-11-02")).toBe("2026-11-02");
    expect(weekOf("2026-11-08")).toBe("2026-11-02"); // Sunday
  });
  it("resets at 00:00 IST, not UTC", () => {
    // Sunday 18:29 UTC = Sunday 23:59 IST → still last week.
    expect(leagueWeek(new Date("2026-11-08T18:29:00Z"))).toBe("2026-11-02");
    // Sunday 18:30 UTC = Monday 00:00 IST → new week.
    expect(leagueWeek(new Date("2026-11-08T18:30:00Z"))).toBe("2026-11-09");
  });
  it("counts days left and names months", () => {
    expect(daysLeftInWeek("2026-11-02")).toBe(7);
    expect(daysLeftInWeek("2026-11-08")).toBe(1);
    expect(monthLabel("2026-11-01")).toBe("Nov 2026");
    expect(nextMonth("2026-12-01")).toBe("2027-01-01");
    expect(previousMonth("2026-01-01")).toBe("2025-12-01");
  });
});

describe("tiers and groups", () => {
  it("names the five tiers in order", () => {
    expect([1, 2, 3, 4, 5].map(tierName)).toEqual(["Neuron", "Synapse", "Circuit", "Cortex", "Mind"]);
    expect(tierName(9)).toBe("Mind");
    expect(tierName(0)).toBe("Neuron");
  });
  it("moves 5 up and 5 down in a full group, fewer in small groups", () => {
    expect(zoneSize(20)).toBe(5);
    expect(zoneSize(12)).toBe(4);
    expect(zoneSize(6)).toBe(2);
    expect(zoneSize(2)).toBe(0);
  });
  it("makes groups of about 20 inside a tier", () => {
    const players = ids(60).map((userId) => ({ userId, tier: 1 as Tier }));
    const g = assignGroups(players, "2026-11-02");
    const sizes = [...new Set(g.map((x) => x.groupNo))].map((n) => g.filter((x) => x.groupNo === n).length);
    expect(sizes).toEqual([20, 20, 20]);
  });
  it("merges a small tier into the tier below", () => {
    const players = [...ids(4, "m").map((userId) => ({ userId, tier: 5 as Tier })), ...ids(16, "n").map((userId) => ({ userId, tier: 1 as Tier }))];
    const g = assignGroups(players, "2026-11-02");
    expect(new Set(g.map((x) => x.groupNo)).size).toBe(1);
    expect(groupTier(g)).toBe(1);
  });
  it("is the same every time for a week (page and job agree)", () => {
    const players = ids(45).map((userId, i) => ({ userId, tier: ((i % 3) + 1) as Tier }));
    expect(assignGroups(players, "2026-11-02")).toEqual(assignGroups([...players].reverse(), "2026-11-02"));
  });
  it("ranks with shared places for ties", () => {
    const r = rankGroup([
      { userId: "a", tier: 1, points: 5 },
      { userId: "b", tier: 1, points: 9 },
      { userId: "c", tier: 1, points: 5 },
    ]);
    expect(r.map((x) => [x.userId, x.rank])).toEqual([["b", 1], ["a", 2], ["c", 2]]);
  });
});

describe("closing a week", () => {
  const group = (tier: Tier, pts: number[]): Standing[] => pts.map((points, i) => ({ userId: `p${String(i).padStart(2, "0")}`, tier, points }));

  it("promotes the top 5 and relegates the bottom 5", () => {
    const res = closeGroup(group(3, Array.from({ length: 20 }, (_, i) => 200 - i * 10)));
    expect(res.filter((r) => r.result === "promoted")).toHaveLength(5);
    expect(res.filter((r) => r.result === "relegated")).toHaveLength(5);
    expect(res[0].nextTier).toBe(4);
    expect(res[19].nextTier).toBe(2);
  });
  it("never relegates from Neuron and never promotes past Mind", () => {
    const low = closeGroup(group(1, Array.from({ length: 20 }, (_, i) => 200 - i * 10)));
    expect(low.some((r) => r.result === "relegated")).toBe(false);
    const top = closeGroup(group(5, Array.from({ length: 20 }, (_, i) => 200 - i * 10)));
    expect(top.some((r) => r.result === "promoted")).toBe(false);
    expect(top.filter((r) => r.result === "relegated")).toHaveLength(5);
  });
  it("lets everyone level with the promotion line go up", () => {
    const pts = [100, 90, 80, 70, 60, 60, 60, ...Array.from({ length: 13 }, (_, i) => 50 - i)];
    expect(closeGroup(group(2, pts)).filter((r) => r.result === "promoted")).toHaveLength(7);
  });
  it("needs points to go up; a 0-point week drops you", () => {
    const res = closeGroup(group(2, [30, 0, 0, 0, 0, 0]));
    expect(res.filter((r) => r.result === "promoted").map((r) => r.points)).toEqual([30]);
    expect(res.filter((r) => r.result === "relegated")).toHaveLength(5);
  });
  it("keeps tied students level with the safe place", () => {
    const pts = [...Array.from({ length: 15 }, (_, i) => 100 - i), 20, 20, 20, 20, 20];
    // Place 15 (the first safe place) has 86; everyone at 20 is below it → relegated.
    expect(closeGroup(group(2, pts)).filter((r) => r.result === "relegated")).toHaveLength(5);
    const level = [...Array.from({ length: 15 }, (_, i) => 100 - i), 86, 86, 10, 10, 10];
    expect(closeGroup(group(2, level)).filter((r) => r.result === "relegated")).toHaveLength(3);
  });
});

describe("league points", () => {
  it("counts effort XP only inside the week", () => {
    expect(effortXp({ "2026-11-01": 50, "2026-11-02": 10, "2026-11-08": 5, "2026-11-09": 99 }, "2026-11-02", "2026-11-09")).toBe(15);
  });
  it("ignores shop spends and hint use in the ledger", () => {
    expect(
      ledgerXp([
        { source: "duel:win", amount: 20 },
        { source: "shop:streak_repair", amount: -60 },
        { source: "hint:used", amount: 0 },
      ]),
    ).toBe(20);
  });
  it("weights first-try correct answers by difficulty", () => {
    expect(difficultyOf({ pCorrect: 0.3 })).toBe(3);
    expect(difficultyOf({ pCorrect: 0.6 })).toBe(2);
    expect(difficultyOf({ rating: 1350 })).toBe(3);
    expect(difficultyOf(null)).toBe(1);
    const firsts = firstTryCorrect([
      { item: "a", ok: false, at: "2026-11-02T10:00:00Z" },
      { item: "a", ok: true, at: "2026-11-02T10:01:00Z" },
      { item: "b", ok: true, at: "2026-11-02T10:02:00Z" },
      { item: "b", ok: false, at: "2026-11-03T10:02:00Z" },
    ]);
    expect(firsts).toEqual(["b"]);
    const p = leaguePoints({ history: { "2026-11-03": 40 }, ledger: [{ source: "daily_case:solved", amount: 15 }], firstTries: ["b", "c"], difficulty: (i) => (i === "b" ? 3 : 1) }, "2026-11-02", "2026-11-09");
    expect(p).toEqual({ effort: 40, server: 15, skill: 8, total: 63 });
    // The skill bonus can't outgrow real (server-clamped) effort.
    const farmed = leaguePoints({ history: { "2026-11-03": 5 }, ledger: [], firstTries: ids(50), difficulty: () => 3 }, "2026-11-02", "2026-11-09");
    expect(farmed.skill).toBe(5);
  });
});

describe("private percentile", () => {
  it("is exact", () => {
    const all = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(percentileOf(100, all)).toMatchObject({ topPct: 10, rank: 1, percentile: 99 });
    expect(percentileOf(40, all)).toMatchObject({ percentile: 33, rank: 7 });
    expect(percentileOf(10, all).percentile).toBe(0);
  });
  it("says top X% near the top, a percentile elsewhere", () => {
    const all = Array.from({ length: 100 }, (_, i) => i);
    expect(percentileLine(percentileOf(93, all))).toBe("You're in the top 7%");
    expect(percentileLine(percentileOf(38, all), 6)).toBe("You're at the 38th percentile, up 6 this month");
    expect(percentileLine(percentileOf(38, all), -2)).toContain("down 2 this month");
    expect(percentileLine(percentileOf(5, [5]))).toContain("only one");
  });
  it("writes ordinals", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 38].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "38th"]);
  });
});

describe("relative view", () => {
  it("shows the top 3, then me ±2, with gaps", () => {
    const v = relativeView(20, 10);
    expect(v.filter((x) => x.kind === "row").map((x) => (x as { index: number }).index)).toEqual([0, 1, 2, 8, 9, 10, 11, 12]);
    expect(v.filter((x) => x.kind === "gap").map((x) => (x as { hidden: number }).hidden)).toEqual([5, 7]);
  });
  it("never lists the bottom unless it's me", () => {
    const v = relativeView(20, 1);
    expect(v.some((x) => x.kind === "row" && x.index > 3)).toBe(false);
  });
  it("tells me how far promotion is", () => {
    const pts = Array.from({ length: 20 }, (_, i) => 200 - i * 10); // 5th place has 160
    expect(zoneNote(pts, 9, 2).text).toBe("50 points to promotion");
    expect(zoneNote(pts, 2, 2).kind).toBe("promote");
    expect(zoneNote(pts, 2, 5).kind).toBe("top");
    expect(zoneNote(pts, 18, 2).kind).toBe("drop");
    expect(zoneNote(pts, 18, 1).kind).toBe("chase"); // no drop zone in Neuron
  });
});

describe("standing update", () => {
  const names = new Map([["a", "Ananya S."], ["r", "Rohan K."], ["x", "Meera P."]]);
  it("batches a loss with the way back and who passed", () => {
    const u = buildStandingUpdate({
      before: { rank: 4, points: 100, ahead: ["x", "q", "z"] },
      now: { rank: 7, points: 120, ahead: ["x", "q", "z", "a", "r", "t"] },
      groupPoints: [300, 250, 200, 160, 150, 140, 120],
      names,
      zone: "40 points to promotion",
    });
    expect(u.title).toBe("You dropped 3 places");
    expect(u.body).toContain("You dropped 3 places. 40 points gets them back.");
    expect(u.body).toContain("Ananya S. and Rohan K. passed you.");
  });
  it("reports promotion on Mondays", () => {
    const u = buildStandingUpdate({ before: null, now: { rank: 1, points: 0, ahead: [] }, groupPoints: [0], names, closed: { rank: 2, tier: 2, result: "promoted", nextTier: 3 } });
    expect(u.title).toBe("Promoted to Circuit");
    expect(u.body).toContain("You finished 2nd in Synapse.");
  });
  it("is short", () => {
    const u = buildStandingUpdate({ before: { rank: 2, points: 0, ahead: [] }, now: { rank: 2, points: 0, ahead: [] }, groupPoints: [5, 0], names, zone: "z", percentile: "p" });
    expect(u.body.split(". ").length).toBeLessThanOrEqual(4);
  });
  it("names helpers", () => {
    expect(passedLine(["a", "r", "x"], names)).toBe("Ananya S. and 2 others passed you.");
    expect(passedLine(["nobody"], names)).toBeNull();
    expect(pointsToPlace([100, 80, 60], 2, 50)).toBe(30);
  });
});

describe("batch war", () => {
  it("averages over active students only", () => {
    const war = batchWar(
      [{ id: "c1", name: "Cohort 1" }, { id: "c2", name: "Cohort 2" }],
      new Map([["c1", ["a", "b", "c", "d"]], ["c2", ["e", "f"]]]),
      new Map([["a", 100], ["b", 100], ["e", 150]]),
    );
    expect(war.map((w) => [w.name, w.average, w.active])).toEqual([["Cohort 2", 150, 1], ["Cohort 1", 100, 2]]);
  });
});

describe("shop", () => {
  it("parses and writes looks", () => {
    expect(parseLook("frame-blue|title-fill|junk")).toEqual({ frame: "frame-blue", title: "title-fill" });
    expect(lookString({ frame: null, title: "title-blue" })).toBe("title-blue");
    expect(lookString({ frame: null, title: null })).toBeNull();
  });
  it("spends from Learn XP plus the ledger", () => {
    expect(balanceOf(500, [{ amount: 50 }, { amount: -60 }])).toBe(490);
    expect(balanceOf(10, [{ amount: -60 }])).toBe(0);
  });
  it("repairs a streak lost in the last 2 days, once a week", () => {
    const streak = { count: 12, best: 12, lastDay: "2026-11-03", freezes: 0 };
    expect(canRepair(streak, "2026-11-04", false)).toMatchObject({ ok: false }); // still alive
    expect(canRepair(streak, "2026-11-06", false)).toEqual({ ok: true, count: 12 }); // missed 4th and 5th
    expect(canRepair(streak, "2026-11-07", false)).toMatchObject({ ok: false }); // missed 3 days
    expect(canRepair(streak, "2026-11-06", true)).toMatchObject({ ok: false });
    const s = repairStreak({ ...emptyState(), streak }, "2026-11-06");
    expect(s.streak.lastDay).toBe("2026-11-05");
    expect(s.streak.count).toBe(12);
  });
});

describe("monthly rewards", () => {
  it("gives merit to the top 3 of each cohort, ties share, never for 0", async () => {
    const { meritWinners } = await import("./monthly");
    const w = meritWinners(
      new Map([["c1", ["a", "b", "c", "d", "e"]], ["c2", ["f", "g"]]]),
      new Map([["a", 90], ["b", 80], ["c", 70], ["d", 70], ["e", 10], ["f", 5]]),
    );
    expect([...w.keys()].sort()).toEqual(["a", "b", "c", "d", "f"]);
    expect(w.get("d")?.place).toBe(3);
  });
  it("names one champion per tier", async () => {
    const { champions, championTitle } = await import("./monthly");
    const c = champions(new Map([["a", 4], ["b", 4], ["c", 1], ["z", 2]]), new Map([["a", 50], ["b", 70], ["c", 10]]));
    expect([...c]).toEqual([["b", 4], ["c", 1]]);
    expect(championTitle(4, "Nov 2026")).toBe("Cortex Champion · Nov 2026");
  });
});
