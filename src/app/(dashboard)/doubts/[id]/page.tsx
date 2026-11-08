import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { loadDoubt } from "@/lib/doubts/data";
import { DoubtThreadView } from "../doubts-ui";

export const metadata: Metadata = { title: "Doubt" };
export const dynamic = "force-dynamic";

export default async function DoubtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const session = await getSession();
  if (session.status !== "ok") return null;
  const isAdmin = session.profile.role === "admin";
  const cohorts = await loadMyCohorts(session.profile.id);
  const thread = await loadDoubt(id, { userId: session.profile.id, isAdmin, cohortIds: cohorts.map((c) => c.id) });
  if (!thread) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/doubts" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> All doubts
      </Link>
      <DoubtThreadView thread={thread} cohortId={cohorts[0]?.id ?? null} />
    </div>
  );
}
