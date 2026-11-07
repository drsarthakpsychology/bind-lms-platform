"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { normalise } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { leagueWeek } from "@/lib/leagues/week";
import { xpBalance } from "@/lib/leagues/xp";
import { canRepair, isLookId, lookString, LOOKS, parseLook, repairStreak, SHOP, SHOP_READY, type LookId } from "@/lib/leagues/shop";

const NOT_READY = "This isn't switched on yet. Please try again later.";
const ALIAS_RE = /^[A-Za-z0-9 ._-]{2,20}$/;

async function me() {
  const s = await getSession();
  if (s.status !== "ok" || (s.profile.role !== "student" && s.profile.role !== "alumni")) return null;
  return s.profile;
}

/** Set (or clear) the name shown on the platform board and in mixed leagues. */
export async function saveAlias(raw: string): Promise<{ error: string | null; alias: string | null }> {
  const p = await me();
  if (!p) return { error: "Sign in as a student first.", alias: null };
  const alias = raw.replace(/\s+/g, " ").trim();
  if (alias && !ALIAS_RE.test(alias)) return { error: "Use 2 to 20 letters, numbers, spaces, dots, dashes or underscores.", alias: null };
  const { error } = await createAdminClient().from("profiles").update({ alias: alias || null }).eq("id", p.id);
  if (error) {
    if ((error as { code?: string }).code === "23505") return { error: "Someone already uses that name. Try another.", alias: null };
    return { error: /column|alias/i.test(error.message) ? NOT_READY : "Couldn't save. Try again.", alias: null };
  }
  revalidatePath("/leaderboard");
  return { error: null, alias: alias || null };
}

export type BuyResult = { error: string | null; balance?: number; lastDay?: string; look?: string | null };

/** Spend XP in the shop. The spend is a negative row in xp_ledger. */
export async function buyItem(item: string): Promise<BuyResult> {
  const p = await me();
  if (!p) return { error: "Sign in as a student first." };
  const admin = createAdminClient();
  const bal = await xpBalance(p.id);
  if (!bal.ready) return { error: NOT_READY };

  if (item === "streak_repair") return buyRepair(p.id, bal.balance);

  if (item === "hints_3" || item === "bonus_case") {
    if (!SHOP_READY[item]) return { error: "Coming soon." };
    const cost = SHOP[item].cost;
    if (bal.balance < cost) return { error: `You need ${cost - bal.balance} more XP.` };
    const ref = item === "bonus_case" ? leagueWeek() : null;
    const { error } = await admin.from("xp_ledger").insert({ user_id: p.id, source: `shop:${item}`, amount: -cost, ref });
    if (error) return { error: (error as { code?: string }).code === "23505" ? "You already have this week's one." : "Couldn't buy. Try again." };
    revalidatePath("/leaderboard/shop");
    return { error: null, balance: bal.balance - cost };
  }

  if (item.startsWith("look:")) {
    const id = item.slice(5);
    if (!isLookId(id)) return { error: "Unknown item." };
    const cost = LOOKS[id].cost;
    if (bal.ledger.some((r) => r.source === "shop:look" && r.ref === id)) return { error: "You already own this." };
    if (bal.balance < cost) return { error: `You need ${cost - bal.balance} more XP.` };
    const { error } = await admin.from("xp_ledger").insert({ user_id: p.id, source: "shop:look", amount: -cost, ref: id });
    if (error) return { error: (error as { code?: string }).code === "23505" ? "You already own this." : "Couldn't buy. Try again." };
    const look = await applyLook(p.id, id);
    revalidatePath("/leaderboard");
    revalidatePath("/leaderboard/shop");
    return { error: null, balance: bal.balance - cost, look };
  }
  return { error: "Unknown item." };
}

async function buyRepair(userId: string, balance: number): Promise<BuyResult> {
  const admin = createAdminClient();
  const cost = SHOP.streak_repair.cost;
  const today = istToday();
  const week = leagueWeek();
  const [{ data: row, error: readErr }, used] = await Promise.all([
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("streak_repairs").select("week").eq("user_id", userId).eq("week", week).maybeSingle(),
  ]);
  if (readErr || used.error) return { error: NOT_READY };
  const state = normalise(row?.state ?? null);
  const check = canRepair(state.streak, today, Boolean(used.data));
  if (!check.ok) return { error: check.reason };
  if (balance < cost) return { error: `You need ${cost - balance} more XP.` };

  // The repair row is the once-a-week lock (primary key user + week).
  const lock = await admin.from("streak_repairs").insert({ user_id: userId, week });
  if (lock.error) return { error: (lock.error as { code?: string }).code === "23505" ? "You've used this week's repair." : NOT_READY };
  const spend = await admin.from("xp_ledger").insert({ user_id: userId, source: "shop:streak_repair", amount: -cost, ref: week });
  if (spend.error) {
    await admin.from("streak_repairs").delete().eq("user_id", userId).eq("week", week);
    return { error: "Couldn't buy. Try again." };
  }
  const next = repairStreak(state, today);
  const { error } = await admin.from("learn_progress").update({ state: next, updated_at: new Date().toISOString() }).eq("user_id", userId);
  if (error) return { error: "Couldn't save the repair. Please tell the VIBHA team." };
  revalidatePath("/leaderboard/shop");
  return { error: null, balance: balance - cost, lastDay: next.streak.lastDay ?? undefined };
}

async function applyLook(userId: string, id: LookId): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("look").eq("id", userId).maybeSingle();
  const cur = parseLook((data?.look as string | null) ?? null);
  const next = lookString({ ...cur, [LOOKS[id].kind]: id });
  await admin.from("profiles").update({ look: next }).eq("id", userId);
  return next;
}

/** Wear a look you own, or take one off (`id` null clears that kind). */
export async function wearLook(kind: "frame" | "title", id: LookId | null): Promise<{ error: string | null; look?: string | null }> {
  const p = await me();
  if (!p) return { error: "Sign in as a student first." };
  const admin = createAdminClient();
  if (id) {
    if (!isLookId(id) || LOOKS[id].kind !== kind) return { error: "Unknown item." };
    const { data, error } = await admin.from("xp_ledger").select("id").eq("user_id", p.id).eq("source", "shop:look").eq("ref", id).limit(1);
    if (error) return { error: NOT_READY };
    if (!data?.length) return { error: "Buy it first." };
  }
  const { data } = await admin.from("profiles").select("look").eq("id", p.id).maybeSingle();
  const next = lookString({ ...parseLook((data?.look as string | null) ?? null), [kind]: id });
  const { error } = await admin.from("profiles").update({ look: next }).eq("id", p.id);
  if (error) return { error: NOT_READY };
  revalidatePath("/leaderboard");
  revalidatePath("/leaderboard/shop");
  return { error: null, look: next };
}
