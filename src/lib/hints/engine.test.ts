import { describe, expect, it } from "vitest";
import { buy, getStatus, hintedItems, settleEarnings, spend, type HintDb } from "./engine";
import { BUY_COST, SPARE_CAP, type HintRow, type Pool } from "./rules";

type Tables = { hints: boolean; ledger: boolean; failRead?: boolean };

/** In-memory stand-in for Supabase with the same unique rules as the SQL. */
function fakeDb(t: Tables, xp = 100) {
  const hints: (HintRow & { slot: string; userId: string })[] = [];
  const ledger: { userId: string; source: string; amount: number; ref: string; day: string }[] = [];
  let session: string[] = [];
  let canWriteSession = true;
  const db: HintDb = {
    async readHints(u) {
      if (t.failRead) return "error";
      if (!t.hints) return "missing";
      return { rows: hints.filter((r) => r.userId === u) };
    },
    async insertHint(r) {
      if (!t.hints) return "missing";
      if (hints.some((x) => x.userId === r.userId && x.slot === r.slot)) return "dup-slot";
      if (r.item && hints.some((x) => x.userId === r.userId && x.item === r.item && x.step === r.step)) return "dup-item";
      hints.push({ userId: r.userId, slot: r.slot, pool: r.pool as Pool | "earn", delta: r.delta, day: r.day, item: r.item, step: r.step });
      return "ok";
    },
    async readLedgerHints(u) {
      if (!t.ledger) return "missing";
      return ledger.filter((r) => r.userId === u && r.source.startsWith("hint:")).map((r) => ({ source: r.source, ref: r.ref, day: r.day }));
    },
    async insertLedger(u, source, amount, ref) {
      if (!t.ledger) return "missing";
      if (ledger.some((r) => r.userId === u && r.source === source && r.ref === ref)) return "dup";
      ledger.push({ userId: u, source, amount, ref, day: "2026-11-07" });
      return "ok";
    },
    async deleteLedger(u, source, ref) {
      const i = ledger.findIndex((r) => r.userId === u && r.source === source && r.ref === ref);
      if (i >= 0) ledger.splice(i, 1);
    },
    async boughtToday(u, day) {
      return ledger.some((r) => r.userId === u && r.source === "shop:hints_3" && r.ref === day);
    },
    async xp(u) {
      if (!t.ledger) return null;
      return Math.max(0, xp + ledger.filter((r) => r.userId === u).reduce((a, r) => a + r.amount, 0));
    },
    async readSession() {
      return session;
    },
    async writeSession(_u, _d, items) {
      if (!canWriteSession) return false;
      session = items;
      return true;
    },
  };
  return { db, hints, ledger, setSessionWritable: (v: boolean) => (canWriteSession = v) };
}

const U = "u1";
const DAY = "2026-11-07";
const ask = (n: number, game = "rx") => ({ game, item: `${game}:run:${n}`, step: 1 });

describe("spending with the hint table", () => {
  it("free first, then spare, then nothing; a buy adds 3 for today", async () => {
    const f = fakeDb({ hints: true, ledger: true }, 100);
    for (let i = 0; i < 3; i++) expect(await spend(f.db, U, DAY, ask(i))).toMatchObject({ ok: true, charged: "free" });
    for (let i = 3; i < 8; i++) expect(await spend(f.db, U, DAY, ask(i))).toMatchObject({ ok: true, charged: "spare" });
    const out = await spend(f.db, U, DAY, ask(9));
    expect(out.ok).toBe(false);
    expect(out.status.left).toBe(0);
    expect(out.status.canBuy).toBe(true);
    expect((await buy(f.db, U, DAY)).ok).toBe(true);
    expect(await spend(f.db, U, DAY, ask(10))).toMatchObject({ ok: true, charged: "bought" });
  });

  it("asking again for the same hint never charges twice", async () => {
    const f = fakeDb({ hints: true, ledger: true });
    await spend(f.db, U, DAY, ask(1));
    const again = await spend(f.db, U, DAY, ask(1));
    expect(again).toMatchObject({ ok: true, charged: null });
    expect(f.hints).toHaveLength(1);
    expect((await getStatus(f.db, U, DAY)).free).toBe(2);
  });

  it("caps hints per item and keeps them in order", async () => {
    const f = fakeDb({ hints: true, ledger: true });
    expect((await spend(f.db, U, DAY, { game: "rx", item: "rx:a:1", step: 2 })).ok).toBe(false);
    expect((await spend(f.db, U, DAY, { game: "daily", item: "daily:d:1", step: 1 })).ok).toBe(true);
    expect((await spend(f.db, U, DAY, { game: "daily", item: "daily:d:1", step: 2 })).ok).toBe(true);
    expect((await spend(f.db, U, DAY, { game: "daily", item: "daily:d:1", step: 3 })).ok).toBe(false);
    expect((await hintedItems(f.db, U, DAY, "daily:")).get("daily:d:1")).toBe(2);
  });

  it("refuses hints in Differential duel and Blitz, and keys from another game", async () => {
    const f = fakeDb({ hints: true, ledger: true });
    for (const game of ["duel", "blitz"]) {
      const r = await spend(f.db, U, DAY, { game, item: `${game}:x:1` });
      expect(r.ok).toBe(false);
    }
    expect((await spend(f.db, U, DAY, { game: "rx", item: "mse:x:1" })).ok).toBe(false);
    expect(f.hints).toHaveLength(0);
  });

  it("the next day's free hints are back", async () => {
    const f = fakeDb({ hints: true, ledger: true });
    for (let i = 0; i < 3; i++) await spend(f.db, U, DAY, ask(i));
    expect((await getStatus(f.db, U, DAY)).free).toBe(0);
    expect((await getStatus(f.db, U, "2026-11-08")).free).toBe(3);
  });
});

describe("one XP wallet", () => {
  it("buying writes one negative xp_ledger row, once a day, only if the balance allows", async () => {
    const f = fakeDb({ hints: true, ledger: true }, BUY_COST);
    expect((await buy(f.db, U, DAY)).ok).toBe(true);
    expect(f.ledger.filter((r) => r.source === "shop:hints_3")).toEqual([expect.objectContaining({ amount: -BUY_COST, ref: DAY })]);
    expect(await f.db.xp(U)).toBe(0);
    expect((await buy(f.db, U, DAY)).ok).toBe(false);
    // Next day: allowed again, but the same XP can't be spent twice.
    const r = await buy(f.db, U, "2026-11-08");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/more XP/);
  });

  it("using hints never moves XP", async () => {
    const f = fakeDb({ hints: true, ledger: true }, 50);
    for (let i = 0; i < 6; i++) await spend(f.db, U, DAY, ask(i));
    expect(await f.db.xp(U)).toBe(50);
  });
});

describe("fail closed", () => {
  it("without the hint table: 3 free a day in the ledger at 0 XP, then nothing", async () => {
    const f = fakeDb({ hints: false, ledger: true }, 500);
    for (let i = 0; i < 3; i++) expect((await spend(f.db, U, DAY, ask(i))).ok).toBe(true);
    const r = await spend(f.db, U, DAY, ask(4));
    expect(r.ok).toBe(false);
    expect(r.status).toMatchObject({ mode: "ledger", left: 0, spare: 0, canBuy: false });
    expect(f.ledger.every((x) => x.amount === 0)).toBe(true);
    expect((await buy(f.db, U, DAY)).ok).toBe(false);
    expect((await hintedItems(f.db, U, DAY, "rx:run:")).size).toBe(3);
  });

  it("without any table: 3 free a day in the signed session, then nothing", async () => {
    const f = fakeDb({ hints: false, ledger: false });
    for (let i = 0; i < 3; i++) expect((await spend(f.db, U, DAY, ask(i))).ok).toBe(true);
    expect((await spend(f.db, U, DAY, ask(4))).ok).toBe(false);
    expect((await getStatus(f.db, U, DAY)).mode).toBe("session");
  });

  it("gives nothing when the hint can't be recorded", async () => {
    const f = fakeDb({ hints: false, ledger: false });
    f.setSessionWritable(false);
    expect((await spend(f.db, U, DAY, ask(1))).ok).toBe(false);
  });

  it("a failing read means no hints at all", async () => {
    const f = fakeDb({ hints: true, ledger: true, failRead: true });
    const r = await spend(f.db, U, DAY, ask(1));
    expect(r.ok).toBe(false);
    expect(r.status).toMatchObject({ mode: "off", left: 0 });
  });
});

describe("earning spare hints", () => {
  it("pays streak, goal and quests once a day and never above the cap", async () => {
    const f = fakeDb({ hints: true, ledger: true });
    const e = { today: DAY, streak: 3, streakKeptToday: true, goalHit: true, questsDone: true };
    expect(await settleEarnings(f.db, U, e)).toBe(4);
    expect(await settleEarnings(f.db, U, e)).toBe(0);
    expect((await getStatus(f.db, U, DAY)).spare).toBe(9);
    expect(await settleEarnings(f.db, U, { ...e, today: "2026-11-08" })).toBe(1);
    expect((await getStatus(f.db, U, "2026-11-08")).spare).toBe(SPARE_CAP);
  });

  it("earns nothing without the hint table", async () => {
    const f = fakeDb({ hints: false, ledger: true });
    expect(await settleEarnings(f.db, U, { today: DAY, streak: 3, streakKeptToday: true, goalHit: true, questsDone: true })).toBe(0);
  });
});
