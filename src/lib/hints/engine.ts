/**
 * The hint counter, written against a small storage interface so the same
 * code runs on Supabase (server.ts) and on an in-memory fake in tests.
 *
 * Storage, best first:
 *  - "full":    hint_ledger (supabase/migrations_pending/2026_11_hints.sql).
 *               Free, bought and spare hints all work.
 *  - "ledger":  hint_ledger missing, xp_ledger present. Only the 3 free hints,
 *               kept as zero-amount xp_ledger rows ("hint:slot" holds the
 *               daily slot, "hint:item" the item), so XP never moves.
 *  - "session": both tables missing. Only the 3 free hints, kept in a signed
 *               cookie for today.
 *  - "off":     a read failed for another reason. No hints (fail closed).
 * Spending is never open-ended: every path has a hard daily cap.
 */
import {
  BUY_COST,
  BUY_COUNT,
  earnDelta,
  earningsFor,
  FREE_PER_DAY,
  hintsAllowedIn,
  MAX_PER_ITEM,
  nextPool,
  NO_HINTS_HERE,
  outOfHints,
  slotFor,
  spareOf,
  stepsByItem,
  walletOf,
  type EarnInput,
  type HintRow,
  type Pool,
  type Wallet,
} from "./rules";

export type Mode = "full" | "ledger" | "session" | "off";
export type HintStatus = Wallet & { mode: Mode };

export type Insert = "ok" | "dup-item" | "dup-slot" | "missing" | "error";
export type LedgerInsert = "ok" | "dup" | "missing" | "error";

export type HintDb = {
  /** Every hint_ledger row for the student (with its slot). */
  readHints(userId: string): Promise<{ rows: (HintRow & { slot: string })[] } | "missing" | "error">;
  insertHint(row: { userId: string; day: string; pool: Pool | "earn"; delta: number; slot: string; game: string | null; item: string | null; step: number | null }): Promise<Insert>;
  /** Zero-amount hint rows in xp_ledger (the fallback). */
  readLedgerHints(userId: string): Promise<{ source: string; ref: string; day: string }[] | "missing" | "error">;
  insertLedger(userId: string, source: string, amount: number, ref: string): Promise<LedgerInsert>;
  deleteLedger(userId: string, source: string, ref: string): Promise<void>;
  /** Has the student bought today's 3 hints (a "shop:hints_3" row with ref = day)? */
  boughtToday(userId: string, day: string): Promise<boolean>;
  /** Spendable XP from the one wallet, or null when the ledger is missing. */
  xp(userId: string): Promise<number | null>;
  /** The signed cookie fallback: today's used items ("item#step"). */
  readSession(userId: string, day: string): Promise<string[]>;
  writeSession(userId: string, day: string, items: string[]): Promise<boolean>;
};

type Loaded = { mode: Mode; rows: HintRow[]; slots: Set<string>; boughtToday: boolean; xp: number | null };

function parseItemRef(ref: string): { item: string; step: number } | null {
  const i = ref.lastIndexOf("#");
  if (i <= 0) return null;
  const step = Number(ref.slice(i + 1));
  return Number.isInteger(step) && step > 0 ? { item: ref.slice(0, i), step } : null;
}

async function load(db: HintDb, userId: string, today: string): Promise<Loaded> {
  const hints = await db.readHints(userId);
  if (hints !== "missing" && hints !== "error") {
    const [boughtToday, xp] = await Promise.all([db.boughtToday(userId, today), db.xp(userId)]);
    return { mode: "full", rows: hints.rows, slots: new Set(hints.rows.map((r) => r.slot)), boughtToday, xp };
  }
  if (hints === "error") return { mode: "off", rows: [], slots: new Set(), boughtToday: false, xp: null };
  const led = await db.readLedgerHints(userId);
  if (led !== "missing" && led !== "error") {
    const rows: HintRow[] = [];
    for (const r of led) {
      if (r.source === "hint:slot") rows.push({ pool: "free", delta: 0, day: r.ref.slice(0, 10), item: null, step: null });
      else if (r.source === "hint:item") {
        const p = parseItemRef(r.ref);
        // Item rows only record what was hinted; they are not uses (the slot row is).
        if (p) rows.push({ pool: "earn", delta: 0, day: r.day, item: p.item, step: p.step });
      }
    }
    return { mode: "ledger", rows, slots: new Set(), boughtToday: false, xp: null };
  }
  if (led === "error") return { mode: "off", rows: [], slots: new Set(), boughtToday: false, xp: null };
  const items = await db.readSession(userId, today);
  const rows: HintRow[] = items.map((s) => {
    const p = parseItemRef(s);
    return { pool: "free", delta: 0, day: today, item: p?.item ?? null, step: p?.step ?? null };
  });
  return { mode: "session", rows, slots: new Set(), boughtToday: false, xp: null };
}

function statusOf(l: Loaded, today: string): HintStatus {
  if (l.mode === "off") return { day: today, free: 0, bought: 0, spare: 0, left: 0, boughtToday: false, canBuy: false, mode: "off" };
  return { ...walletOf(l.rows, today, { boughtToday: l.boughtToday, full: l.mode === "full", xp: l.xp }), mode: l.mode };
}

export async function getStatus(db: HintDb, userId: string, today: string): Promise<HintStatus> {
  return statusOf(await load(db, userId, today), today);
}

/** Hints already granted per item, for items starting with `prefix`. */
export async function hintedItems(db: HintDb, userId: string, today: string, prefix: string): Promise<Map<string, number>> {
  const l = await load(db, userId, today);
  const out = new Map<string, number>();
  for (const [k, v] of stepsByItem(l.rows)) if (k.startsWith(prefix)) out.set(k, v);
  return out;
}

export type SpendResult = { ok: true; step: number; charged: Pool | null; status: HintStatus } | { ok: false; error: string; status: HintStatus };

/**
 * Use one hint on `item`. Idempotent per (item, step): asking again for a
 * hint already granted returns it without charging. `step` defaults to the
 * next one for that item.
 */
export async function spend(db: HintDb, userId: string, today: string, req: { game: string; item: string; step?: number }): Promise<SpendResult> {
  let l = await load(db, userId, today);
  const fail = (error: string): SpendResult => ({ ok: false, error, status: statusOf(l, today) });
  if (!hintsAllowedIn(req.game)) return fail(NO_HINTS_HERE);
  if (typeof req.item !== "string" || !req.item.startsWith(`${req.game}:`) || req.item.length > 200) return fail("That hint isn't available.");
  if (l.mode === "off") return fail("Hints aren't available right now. Try again soon.");

  for (let attempt = 0; attempt < 4; attempt++) {
    const have = stepsByItem(l.rows).get(req.item) ?? 0;
    const step = req.step ?? have + 1;
    if (!Number.isInteger(step) || step < 1) return fail("That hint isn't available.");
    if (step <= have) return { ok: true, step, charged: null, status: statusOf(l, today) };
    if (step > MAX_PER_ITEM[req.game]) return fail("That's all the hints for this one.");
    if (step > have + 1) return fail("Use the first hint before the next.");

    const w = statusOf(l, today);
    const pool = nextPool(w);
    if (!pool) return fail(outOfHints(w, l.mode === "full"));

    const res = await take(db, l, userId, today, pool, req.game, req.item, step);
    if (res === "ok" || res === "dup-item") {
      l = await load(db, userId, today);
      return { ok: true, step, charged: res === "ok" ? pool : null, status: statusOf(l, today) };
    }
    if (res !== "dup-slot") return fail("Couldn't use a hint. Try again.");
    // Someone else (a double tap) took that slot first: reload and try the next.
    l = await load(db, userId, today);
  }
  return fail("Couldn't use a hint. Try again.");
}

async function take(db: HintDb, l: Loaded, userId: string, today: string, pool: Pool, game: string, item: string, step: number): Promise<Insert> {
  if (l.mode === "full") {
    return db.insertHint({ userId, day: today, pool, delta: pool === "spare" ? -1 : 0, slot: slotFor(pool, l.rows, today), game, item, step });
  }
  if (l.mode === "ledger") {
    const used = l.rows.filter((r) => r.pool === "free" && r.day === today).length;
    if (used >= FREE_PER_DAY) return "error";
    const slotRef = `${today}:${used + 1}`;
    const slot = await db.insertLedger(userId, "hint:slot", 0, slotRef);
    if (slot === "dup") return "dup-slot";
    if (slot !== "ok") return "error";
    const it = await db.insertLedger(userId, "hint:item", 0, `${item}#${step}`.slice(0, 120));
    if (it === "ok") return "ok";
    // Already granted (or failed): give the slot back.
    await db.deleteLedger(userId, "hint:slot", slotRef);
    return it === "dup" ? "dup-item" : "error";
  }
  if (l.mode === "session") {
    const items = await db.readSession(userId, today);
    if (items.length >= FREE_PER_DAY) return "error";
    if (items.includes(`${item}#${step}`)) return "dup-item";
    return (await db.writeSession(userId, today, [...items, `${item}#${step}`])) ? "ok" : "error";
  }
  return "error";
}

export type BuyResult = { ok: true; status: HintStatus } | { ok: false; error: string; status: HintStatus };

/** Buy 3 hints for 30 XP, once a day, from the one XP wallet. Only when the hint table exists. */
export async function buy(db: HintDb, userId: string, today: string): Promise<BuyResult> {
  const l = await load(db, userId, today);
  const status = statusOf(l, today);
  if (l.mode !== "full") return { ok: false, error: "Buying hints isn't switched on yet.", status };
  if (l.boughtToday) return { ok: false, error: `You've bought today's ${BUY_COUNT} hints. More tomorrow.`, status };
  if (l.xp === null) return { ok: false, error: "The XP wallet isn't switched on yet.", status };
  if (l.xp < BUY_COST) return { ok: false, error: `You need ${BUY_COST - l.xp} more XP.`, status };
  const r = await db.insertLedger(userId, "shop:hints_3", -BUY_COST, today);
  if (r === "dup") return { ok: false, error: `You've bought today's ${BUY_COUNT} hints. More tomorrow.`, status };
  if (r !== "ok") return { ok: false, error: "Couldn't buy. Try again.", status };
  return { ok: true, status: await getStatus(db, userId, today) };
}

/** Pay today's spare-hint earnings (streak, goal, quests), each once. Only with the hint table. */
export async function settleEarnings(db: HintDb, userId: string, e: EarnInput): Promise<number> {
  const hints = await db.readHints(userId);
  if (hints === "missing" || hints === "error") return 0;
  const slots = new Set(hints.rows.map((r) => r.slot));
  let spare = spareOf(hints.rows);
  let paid = 0;
  for (const x of earningsFor(e)) {
    if (slots.has(x.slot)) continue;
    const delta = earnDelta(spare, x.want);
    const r = await db.insertHint({ userId, day: e.today, pool: "earn", delta, slot: x.slot, game: null, item: null, step: null });
    if (r === "ok") {
      spare += delta;
      paid += delta;
    }
  }
  return paid;
}
