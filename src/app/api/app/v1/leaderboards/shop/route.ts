import { LOOKS, parseLook, SHOP, SHOP_READY, type LookId } from "@/lib/leagues/shop";
import { loadShop } from "@/lib/leagues/shop-data";
import { appRoute } from "@/lib/app-api/route";
import type { XpShop } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/leaderboards/shop: the XP shop (the website's loadShop, gate /leaderboard/shop). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/leaderboard/shop" } }, async ({ user }): Promise<XpShop> => {
  const s = await loadShop(user.profile.id);
  const worn = parseLook(s.look);
  const owned = new Set<LookId>(s.owned);
  return {
    v: 1,
    ready: s.ready,
    balance: s.balance,
    streak: s.streak,
    repair: s.repair,
    items: (Object.keys(SHOP) as (keyof typeof SHOP)[]).map((id) => ({ id, label: SHOP[id].label, cost: SHOP[id].cost, text: SHOP[id].text, ready: SHOP_READY[id] })),
    looks: (Object.keys(LOOKS) as LookId[]).map((id) => ({ id, label: LOOKS[id].label, kind: LOOKS[id].kind, cost: LOOKS[id].cost, owned: owned.has(id), worn: worn.frame === id || worn.title === id })),
    note: "Spending XP never lowers your level or this week's league points.",
  };
});
