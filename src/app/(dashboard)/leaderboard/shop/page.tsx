import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { liveStreak } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { xpBalance } from "@/lib/leagues/xp";
import { leagueWeek } from "@/lib/leagues/week";
import { canRepair, isLookId, type LookId } from "@/lib/leagues/shop";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { ShopClient } from "./shop-client";

export const metadata: Metadata = { title: "XP shop" };
export const dynamic = "force-dynamic";

/** /leaderboard/shop: spend earned XP. Spends never lower your level or league points. */
export default async function ShopPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const userId = session.profile.id;
  const admin = createAdminClient();
  const today = istToday();
  const week = leagueWeek();
  const [bal, learn, used, profile] = await Promise.all([
    xpBalance(userId),
    loadLearnState(),
    admin.from("streak_repairs").select("week").eq("user_id", userId).eq("week", week).maybeSingle(),
    admin.from("profiles").select("look").eq("id", userId).maybeSingle(),
  ]);
  const streak = learn?.streak ?? { count: 0, best: 0, lastDay: null, freezes: 0 };
  const repair = canRepair(streak, today, Boolean(used.data));
  const owned = bal.ledger.filter((r) => r.source === "shop:look" && r.ref && isLookId(r.ref)).map((r) => r.ref as LookId);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <Link href="/leaderboard" className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-card px-3 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Back to Leaderboard
      </Link>
      <header>
        <p className="text-eyebrow text-link">Spend what you earn</p>
        <h1 className="text-h1">XP shop</h1>
        <p className="mt-1 text-sm">Spending XP never lowers your level or this week&apos;s league points.</p>
      </header>
      <ShopClient
        ready={bal.ready && !used.error}
        balance={bal.balance}
        streak={{ count: streak.count, alive: liveStreak(streak, today) > 0 }}
        repair={repair.ok ? { ok: true, text: `Brings back your ${repair.count}-day streak.` } : { ok: false, text: repair.reason }}
        owned={owned}
        look={(profile.data?.look as string | null) ?? null}
        serverState={learn}
        save={saveLearnState}
      />
    </div>
  );
}
