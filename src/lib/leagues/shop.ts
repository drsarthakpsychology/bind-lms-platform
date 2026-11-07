import { addDays, daysBetween, liveStreak, type LearnState } from "@/lib/learn/engine";
import { BUY_COST } from "@/lib/hints/rules";

/**
 * The XP shop (owner decision 32). XP you earn can be spent; spending writes
 * a negative row to xp_ledger and never lowers your league points or level.
 * Pure parts only (prices, rules, looks), so they are unit-tested.
 */

export type ShopItemId = "streak_repair" | "hints_3" | "bonus_case" | `look:${LookId}`;

export const LOOKS = {
  "frame-blue": { label: "Blue frame", kind: "frame", cost: 150 },
  "frame-lime": { label: "Lime frame", kind: "frame", cost: 150 },
  "frame-ink": { label: "Double ink frame", kind: "frame", cost: 300 },
  "title-blue": { label: "Blue title", kind: "title", cost: 200 },
  "title-fill": { label: "Title on a lime tag", kind: "title", cost: 400 },
} as const;
export type LookId = keyof typeof LOOKS;

export const SHOP = {
  streak_repair: { label: "Streak repair", cost: 60, text: "Brings back a streak you lost in the last 2 days. One a week." },
  hints_3: { label: "3 extra hints", cost: BUY_COST, text: "3 more hints for today. One buy a day." },
  bonus_case: { label: "Bonus challenge", cost: 80, text: "One extra hard case this week." },
} as const;

/**
 * Items whose game side isn't switched on yet. The shop shows them as
 * "Coming soon" instead of taking XP for something that does nothing.
 */
export const SHOP_READY: Record<keyof typeof SHOP, boolean> = { streak_repair: true, hints_3: true, bonus_case: false };

export function isLookId(x: string): x is LookId {
  return Object.prototype.hasOwnProperty.call(LOOKS, x);
}

/** Saved look: "frame-blue|title-fill" → { frame, title }. Unknown parts are dropped. */
export function parseLook(raw: string | null | undefined): { frame: LookId | null; title: LookId | null } {
  const out: { frame: LookId | null; title: LookId | null } = { frame: null, title: null };
  for (const part of String(raw ?? "").split("|")) {
    if (!isLookId(part)) continue;
    out[LOOKS[part].kind] = part;
  }
  return out;
}

export function lookString(l: { frame: LookId | null; title: LookId | null }): string | null {
  const s = [l.frame, l.title].filter(Boolean).join("|");
  return s || null;
}

/** Spendable XP: Learn XP plus the ledger (awards add, spends subtract). */
export function balanceOf(learnXp: number, ledger: readonly { amount: number }[]): number {
  return Math.max(0, learnXp + ledger.reduce((a, r) => a + r.amount, 0));
}

/** The longest gap (in missed days) a repair can cover. */
export const REPAIR_MAX_MISSED = 2;

export type RepairCheck = { ok: true; count: number } | { ok: false; reason: string };

/** Can this streak be repaired today? */
export function canRepair(streak: LearnState["streak"], today: string, usedThisWeek: boolean): RepairCheck {
  if (usedThisWeek) return { ok: false, reason: "You've used this week's repair. A new one comes on Monday." };
  if (!streak.lastDay || streak.count <= 0) return { ok: false, reason: "No streak to repair yet." };
  if (liveStreak(streak, today) > 0) return { ok: false, reason: "Your streak is still alive." };
  const missed = daysBetween(streak.lastDay, today) - 1 - streak.freezes;
  if (missed > REPAIR_MAX_MISSED) return { ok: false, reason: `A repair covers up to ${REPAIR_MAX_MISSED} missed days.` };
  return { ok: true, count: streak.count };
}

/** Repair: the streak counts as kept up to yesterday, so studying today carries it on. */
export function repairStreak(state: LearnState, today: string): LearnState {
  return { ...state, streak: { ...state.streak, lastDay: addDays(today, -1) } };
}
