import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { saveLearnState } from "../../study/actions";
import { loadShop } from "@/lib/leagues/shop-data";
import { ShopClient } from "./shop-client";
import { backLinkClass } from "@/components/design-system/back-link";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";
import { PageFrame } from "@/components/ds";
import { ListHead } from "@/components/play/parts";
import { uiV2 } from "@/lib/ui/v2-server";

export const metadata: Metadata = { title: "XP shop" };
export const dynamic = "force-dynamic";

/** /leaderboard/shop: spend earned XP. Spends never lower your level or league points. */
export default async function ShopPage() {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  const data = await loadShop(session.profile.id);

  const shop = (
    <ShopClient
      ready={data.ready}
      balance={data.balance}
      streak={data.streak}
      repair={data.repair}
      owned={data.owned}
      look={data.look}
      serverState={data.learn}
      save={saveLearnState}
    />
  );
  if (await uiV2()) {
    return (
      <PageFrame>
        <ListHead back={{ href: "/leaderboard", label: "Leaderboard" }} tag="Spend what you earn" title="XP shop" lead="Spending XP never lowers your level or this week's league points." />
        {shop}
      </PageFrame>
    );
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/leaderboard" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to Leaderboard
      </Link>
      <header>
        <p className="text-eyebrow text-link">Spend what you earn</p>
        <h1 className="text-h1">XP shop</h1>
        <p className="mt-1 text-sm">Spending XP never lowers your level or this week&apos;s league points.</p>
      </header>
      {shop}
    </div>
  );
}
