import { describe, expect, it } from "vitest";
import { generatePlan, opdDays, seatsOn, seatsUsed, visitsNeeded, type GenInput, type GenResult, type GenStudent } from "./opd";
import { daysBetween, weekday } from "./time";

/** Mon to Fri, 3 morning and 3 evening seats; weekends closed. */
const SEATS = { "1": { morning: 3, evening: 3 }, "2": { morning: 3, evening: 3 }, "3": { morning: 3, evening: 3 }, "4": { morning: 3, evening: 3 }, "5": { morning: 3, evening: 3 }, "6": {} };
const TODAY = "2026-11-16"; // Monday

const days = (over: Partial<Parameters<typeof opdDays>[0]> = {}) => opdDays({ seats: SEATS, startDate: "2026-11-16", endDate: "2026-12-11", holidays: [], from: TODAY, ...over });

const students = (n: number, batch: "morning" | "evening" = "morning", pendingCases = 8, prefix = "u"): GenStudent[] =>
  Array.from({ length: n }, (_, i) => ({ userId: `${prefix}${String(i).padStart(2, "0")}`, batch, pendingCases }));

const plan = (over: Partial<GenInput>): GenResult => generatePlan({ today: TODAY, casesPerVisit: 2, freezeDays: 7, days: days(), students: [], published: [], ...over });

function perDay(r: GenResult): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of r.entries) m.set(`${e.date}|${e.batch}`, (m.get(`${e.date}|${e.batch}`) ?? 0) + 1);
  return m;
}
const visitsOf = (r: GenResult, userId: string) => r.entries.filter((e) => e.userId === userId).map((e) => e.date);

describe("opdDays", () => {
  it("lists weekday x batch with seats in the range, from today on", () => {
    const d = days();
    expect(d.length).toBe(20 * 2); // 4 weeks x 5 days x 2 batches
    expect(d.every((x) => weekday(x.date) >= 1 && weekday(x.date) <= 5)).toBe(true);
    expect(d[0]).toEqual({ date: "2026-11-16", batch: "morning", seats: 3 });
    expect(days({ from: "2026-12-10" }).map((x) => x.date)).toEqual(["2026-12-10", "2026-12-10", "2026-12-11", "2026-12-11"]);
  });
  it("skips holidays and cancelled OPD sessions", () => {
    const d = days({ holidays: ["2026-11-17"], cancelled: ["2026-11-18|evening"] });
    expect(d.some((x) => x.date === "2026-11-17")).toBe(false);
    expect(d.filter((x) => x.date === "2026-11-18").map((x) => x.batch)).toEqual(["morning"]);
  });
  it("answers nothing without a date range", () => {
    expect(days({ startDate: null })).toEqual([]);
    expect(days({ startDate: "2026-12-20", endDate: "2026-12-10" })).toEqual([]);
  });
  it("reads seats per weekday and batch", () => {
    expect(seatsOn(SEATS, "2026-11-16", "morning")).toBe(3);
    expect(seatsOn(SEATS, "2026-11-21", "morning")).toBe(0);
    expect(seatsUsed([{ date: "2026-11-16", batch: "morning" }, { date: "2026-11-16", batch: "evening" }], "2026-11-16", "morning")).toBe(1);
  });
});

describe("generatePlan: the basics", () => {
  it("visits needed = cases / cases per visit, rounded up", () => {
    expect(visitsNeeded(7, 2)).toBe(4);
    expect(visitsNeeded(8, 2)).toBe(4);
    expect(visitsNeeded(0, 2)).toBe(0);
    expect(visitsNeeded(-3, 2)).toBe(0);
    expect(visitsNeeded(5, 0)).toBe(5);
  });

  it("gives every student enough visits in their own batch", () => {
    const list = [...students(6, "morning", 7, "m"), ...students(5, "evening", 8, "e")];
    const r = plan({ students: list });
    for (const s of list) {
      const mine = r.entries.filter((e) => e.userId === s.userId);
      expect(mine).toHaveLength(4);
      expect(mine.every((e) => e.batch === s.batch && e.source === "new")).toBe(true);
      expect(new Set(mine.map((e) => e.date)).size).toBe(4); // never two on one day
    }
    expect(r.short).toEqual([]);
    expect(r.noBatch).toEqual([]);
  });

  it("never goes over the seats of a day and batch", () => {
    const r = plan({ students: students(15, "morning", 16) }); // 15 x 8 = 120 visits, 60 morning seats
    for (const [, n] of perDay(r)) expect(n).toBeLessThanOrEqual(3);
    expect(r.entries).toHaveLength(60);
    expect(r.overfull).toEqual([]);
    // Short students are listed with how many visits did not fit.
    expect(r.short.reduce((n, s) => n + s.visits, 0)).toBe(60);
  });

  it("shares short seats fairly (everyone gets about the same)", () => {
    const r = plan({ students: students(15, "morning", 16) });
    const counts = students(15).map((s) => visitsOf(r, s.userId).length);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });

  it("spreads each student's visits over the range, not bunched at the start", () => {
    const r = plan({ students: students(3, "morning", 8) });
    for (const s of students(3)) {
      const d = visitsOf(r, s.userId).sort();
      expect(d).toHaveLength(4);
      // First visit in the first ~ quarter, last in the last ~ quarter; gaps at least 3 days.
      expect(daysBetween(TODAY, d[0]!)).toBeLessThanOrEqual(9);
      expect(daysBetween(d[3]!, "2026-12-11")).toBeLessThanOrEqual(9);
      for (let i = 1; i < d.length; i++) expect(daysBetween(d[i - 1]!, d[i]!)).toBeGreaterThanOrEqual(3);
    }
  });

  it("spreads people across days (no day empty while another is full, when demand is low)", () => {
    const r = plan({ students: students(5, "morning", 8) }); // 20 visits over 20 morning days
    const loads = [...perDay(r).values()];
    expect(Math.max(...loads)).toBeLessThanOrEqual(2);
  });

  it("is the same every time (no randomness)", () => {
    const input = { students: [...students(7, "morning", 7), ...students(4, "evening", 5, "e")] };
    expect(plan(input)).toEqual(plan(input));
  });

  it("leaves out students with no batch and lists them", () => {
    const r = plan({ students: [{ userId: "x", batch: null, pendingCases: 8 }, ...students(1)] });
    expect(r.noBatch).toEqual(["x"]);
    expect(visitsOf(r, "x")).toEqual([]);
    expect(visitsOf(r, "u00")).toHaveLength(4);
  });

  it("plans nothing for a student with no pending cases", () => {
    expect(plan({ students: students(2, "morning", 0) }).entries).toEqual([]);
  });

  it("uses cases per visit from the settings", () => {
    const r = plan({ casesPerVisit: 3, students: students(1, "morning", 7) });
    expect(visitsOf(r, "u00")).toHaveLength(3);
  });
});

describe("generatePlan: skips", () => {
  it("skips holidays and cancelled sessions", () => {
    const r = plan({ days: days({ holidays: ["2026-11-19"], cancelled: ["2026-11-20|morning"] }), students: students(12, "morning", 20) });
    expect(r.entries.some((e) => e.date === "2026-11-19")).toBe(false);
    expect(r.entries.some((e) => e.date === "2026-11-20" && e.batch === "morning")).toBe(false);
  });

  it("skips a student's approved leave days", () => {
    const blocked = ["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20"];
    const r = plan({ students: [{ userId: "u", batch: "morning", pendingCases: 8, blockedDates: blocked }] });
    expect(visitsOf(r, "u").some((d) => blocked.includes(d))).toBe(false);
    expect(visitsOf(r, "u")).toHaveLength(4);
  });

  it("never plans a late joiner before they joined", () => {
    const r = plan({ students: [{ userId: "late", batch: "evening", pendingCases: 8, joinedOn: "2026-12-01" }] });
    expect(visitsOf(r, "late").every((d) => d >= "2026-12-01")).toBe(true);
    expect(visitsOf(r, "late")).toHaveLength(4);
  });

  it("never plans in the past", () => {
    const r = plan({ today: "2026-12-01", students: students(2) });
    expect(r.entries.every((e) => e.date >= "2026-12-01")).toBe(true);
  });
});

describe("generatePlan: Generate again", () => {
  const first = plan({ students: students(9, "morning", 8) });
  const published = first.entries.map((e, i) => ({ id: `p${i}`, userId: e.userId, date: e.date, batch: e.batch }));

  it("keeps every published visit when nothing changed (no reshuffle)", () => {
    const again = plan({ students: students(9, "morning", 8), published });
    expect(again.entries.filter((e) => e.source === "new")).toEqual([]);
    expect(again.entries.map((e) => `${e.userId}|${e.date}`).sort()).toEqual(published.map((p) => `${p.userId}|${p.date}`).sort());
    expect(again.entries.every((e) => e.source === "kept" && e.id)).toBe(true);
  });

  it("fills only the gaps for extra paid cases", () => {
    const list = students(9, "morning", 8);
    list[0] = { ...list[0]!, pendingCases: 12 }; // +4 cases = 2 more visits
    const again = plan({ students: list, published });
    const fresh = again.entries.filter((e) => e.source === "new");
    expect(fresh.map((e) => e.userId)).toEqual(["u00", "u00"]);
    expect(visitsOf(again, "u00")).toHaveLength(6);
    // Everybody else is untouched.
    for (const s of list.slice(1)) expect(visitsOf(again, s.userId).sort()).toEqual(visitsOf(first, s.userId).sort());
    for (const [, n] of perDay(again)) expect(n).toBeLessThanOrEqual(3);
  });

  it("adds a student who joined later without moving anyone", () => {
    const again = plan({ students: [...students(9, "morning", 8), { userId: "zz-new", batch: "morning", pendingCases: 8, joinedOn: "2026-11-23" }], published, today: "2026-11-23" });
    expect(visitsOf(again, "zz-new")).toHaveLength(4);
    expect(visitsOf(again, "zz-new").every((d) => d >= "2026-11-23")).toBe(true);
    const kept = again.entries.filter((e) => e.source === "kept");
    expect(kept.length).toBe(published.filter((p) => p.date >= "2026-11-23").length);
  });

  it("refills missed visits (cases returned to pending) from today on", () => {
    // A week later: u00 missed both visits of the first week, so 2 more visits are needed on top of the kept future ones.
    const today = "2026-11-23";
    const future = published.filter((p) => p.date >= today);
    const futureOf = (u: string) => future.filter((p) => p.userId === u).length;
    const list = students(9, "morning", 8).map((s) => ({ ...s, pendingCases: s.userId === "u00" ? 8 : futureOf(s.userId) * 2 }));
    const again = plan({ today, students: list, published });
    expect(visitsOf(again, "u00")).toHaveLength(4);
    expect(again.entries.every((e) => e.date >= today)).toBe(true);
    for (const s of list.slice(1)) expect(again.entries.filter((e) => e.userId === s.userId && e.source === "new")).toEqual([]);
  });

  it("drops a kept visit that is now a holiday, cancelled or on leave, and plans a new one", () => {
    const u = published.filter((p) => p.userId === "u00").sort((a, b) => a.date.localeCompare(b.date));
    const [h, c, l] = [u[1]!, u[2]!, u[3]!];
    const list = students(9, "morning", 8).map((s) => (s.userId === "u00" ? { ...s, blockedDates: [l.date] } : s));
    const again = plan({ students: list, published, days: days({ holidays: [h.date], cancelled: [`${c.date}|morning`] }), closed: [h.date, `${c.date}|morning`] });
    const reasons = again.dropped.filter((d) => d.userId === "u00").map((d) => d.reason).sort();
    expect(reasons).toEqual(["closed", "closed", "leave"]);
    const mine = visitsOf(again, "u00");
    expect(mine).toHaveLength(4);
    expect(mine).not.toContain(h.date);
    expect(mine).not.toContain(c.date);
    expect(mine).not.toContain(l.date);
  });

  it("drops surplus visits from the end, never inside the frozen days", () => {
    const list = students(9, "morning", 8).map((s) => (s.userId === "u01" ? { ...s, pendingCases: 2 } : s));
    const again = plan({ students: list, published, freezeDays: 60 });
    expect(visitsOf(again, "u01")).toHaveLength(4); // all frozen: kept
    const loose = plan({ students: list, published, freezeDays: 0 });
    const mine = visitsOf(loose, "u01").sort();
    expect(mine).toEqual([visitsOf(first, "u01").sort()[0]]);
    expect(loose.dropped.filter((d) => d.userId === "u01").every((d) => d.reason === "surplus")).toBe(true);
  });

  it("moves a changed batch only outside the frozen days", () => {
    const list = students(9, "morning", 8).map((s) => (s.userId === "u02" ? { ...s, batch: "evening" as const } : s));
    const again = plan({ students: list, published, freezeDays: 7 });
    const mine = again.entries.filter((e) => e.userId === "u02");
    expect(mine).toHaveLength(4);
    for (const e of mine) {
      if (e.source === "kept") expect(e.batch === "morning" && e.date < "2026-11-23").toBe(true);
      else expect(e.batch).toBe("evening");
    }
    expect(again.dropped.filter((d) => d.userId === "u02").every((d) => d.reason === "batch" && d.date >= "2026-11-23")).toBe(true);
  });

  it("keeps kept visits even after seats were lowered, and reports the full days", () => {
    const tight = { ...SEATS, "1": { morning: 1, evening: 3 } };
    const again = plan({ students: students(9, "morning", 8), published, days: days({ seats: tight }), freezeDays: 60 });
    expect(again.entries.filter((e) => e.source === "kept")).toHaveLength(published.length);
    const mondays = [...perDay(again)].filter(([k, n]) => weekday(k.slice(0, 10)) === 1 && k.endsWith("morning") && n > 1);
    if (mondays.length) expect(again.overfull.length).toBeGreaterThan(0);
  });

  it("ignores published visits in the past", () => {
    const old = [{ id: "old", userId: "u00", date: "2026-11-01", batch: "morning" as const }];
    const r = plan({ students: students(1), published: old });
    expect(r.entries.some((e) => e.id === "old")).toBe(false);
    expect(visitsOf(r, "u00")).toHaveLength(4);
  });

  it("keeps published visits of someone no longer in the list", () => {
    const r = plan({ students: [], published: [{ id: "x", userId: "gone", date: "2026-11-20", batch: "morning" }] });
    expect(r.entries).toEqual([{ id: "x", userId: "gone", date: "2026-11-20", batch: "morning", source: "kept" }]);
  });

  it("drops a duplicate published day", () => {
    const r = plan({ students: students(1, "morning", 4), published: [{ id: "a", userId: "u00", date: "2026-11-20", batch: "morning" }, { id: "b", userId: "u00", date: "2026-11-20", batch: "morning" }] });
    expect(r.dropped.map((d) => d.reason)).toEqual(["duplicate"]);
    expect(visitsOf(r, "u00")).toHaveLength(2);
  });
});

describe("generatePlan: a realistic cohort", () => {
  it("30 students, mixed batches and quotas, fit with seats to spare and stay fair", () => {
    const list: GenStudent[] = Array.from({ length: 30 }, (_, i) => ({ userId: `s${String(i).padStart(2, "0")}`, batch: i % 3 === 0 ? "evening" : "morning", pendingCases: 7 + (i % 2) + (i === 4 ? 4 : 0) }));
    const r = plan({ students: list, days: opdDays({ seats: SEATS, startDate: "2026-11-16", endDate: "2027-01-29", holidays: ["2026-12-25", "2027-01-01"], from: TODAY }) });
    expect(r.short).toEqual([]);
    for (const s of list) expect(visitsOf(r, s.userId)).toHaveLength(visitsNeeded(s.pendingCases, 2));
    for (const [, n] of perDay(r)) expect(n).toBeLessThanOrEqual(3);
    expect(r.entries.some((e) => e.date === "2026-12-25" || e.date === "2027-01-01")).toBe(false);
  });
});
