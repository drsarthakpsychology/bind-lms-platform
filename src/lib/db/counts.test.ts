import { describe, expect, it } from "vitest";
import { emailTotals, MAX_VISIT_S, pageAll, progressTotals, sumVisits, visitShape, visitTotals } from "./counts";

/** A fake client: `rpc` answers from `fns` (or fails like a missing function), `from` pages `tables`. */
function fakeDb(tables: Record<string, unknown[]>, fns: Record<string, unknown[]> = {}) {
  const ranged = (rows: unknown[] | null) => {
    const q = {
      select: () => q,
      gte: () => q,
      eq: () => q,
      order: () => q,
      range: async (a: number, b: number) => (rows ? { data: rows.slice(a, b + 1), error: null } : { data: null, error: { code: "PGRST202", message: "function not found" } }),
    };
    return q;
  };
  return {
    from: (t: string) => ranged(tables[t] ?? []),
    rpc: (fn: string) => ranged(fns[fn] ?? null),
  };
}

const visit = (user: string, at: string, s: number, path = "/study") => ({ user_id: user, path, entered_at: at, left_at: null, duration_seconds: s });

describe("pageAll", () => {
  it("reads past 1000 rows", async () => {
    const rows = Array.from({ length: 2345 }, (_, i) => ({ i }));
    const db = fakeDb({ t: rows });
    expect((await pageAll(() => db.from("t").select()))?.length).toBe(2345);
  });
  it("says null when a page fails", async () => {
    const db = fakeDb({});
    expect(await pageAll(() => db.rpc("missing"))).toBeNull();
  });
});

describe("visit totals", () => {
  const now = Date.parse("2026-11-22T06:00:00Z");
  const week = new Date(now - 7 * 86400000).toISOString();

  it("caps one slice at 30 minutes and counts India days", () => {
    const t = sumVisits(
      [visit("a", "2026-11-21T19:00:00Z", 99999), visit("a", "2026-11-21T17:00:00Z", 60), visit("a", "2026-11-01T10:00:00Z", 120)],
      week,
    ).get("a")!;
    expect(t.seconds).toBe(MAX_VISIT_S + 60 + 120);
    expect(t.secondsWeek).toBe(MAX_VISIT_S + 60);
    // 19:00 UTC is the next day in India; 17:00 UTC is the same day.
    expect(t.activeDays).toBe(3);
  });

  it("falls back to paging when the database function is missing, and counts every row", async () => {
    const rows = Array.from({ length: 3000 }, (_, i) => visit(i % 2 ? "a" : "b", "2026-11-21T10:00:00Z", 10));
    const totals = await visitTotals(fakeDb({ page_visits: rows }), week, week);
    expect(totals.get("a")!.seconds + totals.get("b")!.seconds).toBe(30000);
  });

  it("uses the database function when it is there", async () => {
    const db = fakeDb({}, { activity_user_totals: [{ user_id: "a", seconds_all: 7200, seconds_week: 60, active_days: 4, last_visit: "2026-11-21T10:00:00Z" }] });
    expect((await visitTotals(db, week, week)).get("a")).toEqual({ seconds: 7200, secondsWeek: 60, activeDays: 4, lastVisit: "2026-11-21T10:00:00Z" });
  });

  it("builds the heatmap and page seconds either way", async () => {
    const raw = await visitShape(fakeDb({ page_visits: [visit("a", "2026-11-23T04:30:00Z", 60, "/wall?x=1")] }), week);
    // 04:30 UTC Monday is 10:00 Monday in India.
    expect(raw.heat[0][10]).toBe(60);
    expect(raw.pathSeconds.get("/wall")).toBe(60);
    const fn = await visitShape(fakeDb({}, { activity_heat: [{ dow: 0, hour: 10, seconds: 60 }], activity_paths: [{ path: "/wall", seconds: 60 }] }), week);
    expect(fn.heat[0][10]).toBe(60);
    expect(fn.pathSeconds.get("/wall")).toBe(60);
  });
});

describe("lecture and email totals", () => {
  it("counts lectures done past 1000 rows", async () => {
    const rows = Array.from({ length: 1500 }, (_, i) => ({ user_id: "a", watched_seconds: 10, is_completed: i < 1200, updated_at: "2026-11-20T00:00:00Z" }));
    const t = (await progressTotals(fakeDb({ progress: rows }))).get("a")!;
    expect(t.lessonsDone).toBe(1200);
    expect(t.lessonsStarted).toBe(1500);
    expect(t.watchedSeconds).toBe(15000);
  });

  it("counts sent emails per person, any case", async () => {
    const rows = [
      { recipient: "A@x.in", sent_at: "2026-11-01T00:00:00Z", opened_at: null },
      { recipient: "a@x.in", sent_at: "2026-11-05T00:00:00Z", opened_at: "2026-11-05T01:00:00Z" },
    ];
    expect((await emailTotals(fakeDb({ email_sends: rows }))).get("a@x.in")).toEqual({ sent: 2, lastSent: "2026-11-05T00:00:00Z", opened: true });
  });
});
