import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { isAdminLike } from "@/lib/auth/guards";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { loadDoubt } from "@/lib/doubts/data";
import { DoubtThreadView } from "../doubts-ui";
import { backLinkClass } from "@/components/design-system/back-link";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";
import { uiV2Role } from "@/lib/ui/v2-server";
import { DoubtThreadV2 } from "../doubts-v2";

export const metadata: Metadata = { title: "Doubt" };
export const dynamic = "force-dynamic";

export default async function DoubtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  // Same rule as the board (../page.tsx): a View Admin reads every thread the board lists.
  const isAdmin = isAdminLike(session.profile);
  const cohorts = await loadMyCohorts(session.profile.id);
  const thread = await loadDoubt(id, { userId: session.profile.id, isAdmin, cohortIds: cohorts.map((c) => c.id) });
  if (!thread) notFound();

  if (await uiV2Role(session.profile.role)) return <DoubtThreadV2 thread={thread} cohortId={cohorts[0]?.id ?? null} />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/doubts" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to Doubts
      </Link>
      <DoubtThreadView thread={thread} cohortId={cohorts[0]?.id ?? null} />
    </div>
  );
}
