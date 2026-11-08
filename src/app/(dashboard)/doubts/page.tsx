import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { doubtsReady, loadDoubts } from "@/lib/doubts/data";
import { DoubtsBoard } from "./doubts-ui";
import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";
import { ToolHeader } from "@/components/help/tool-header";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";

export const metadata: Metadata = { title: "Doubts" };
export const dynamic = "force-dynamic";

/** The cohort doubts board: students ask and answer each other; complaints go privately to the admin. */
export default async function DoubtsPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const isAdmin = session.profile.role === "admin" || session.profile.role === "view_admin";
  const sp = await searchParams;

  if (!(await doubtsReady())) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-h1">Doubts</h1>
        <p className="mt-2 rounded-2xl border-2 border-foreground bg-primary p-4 text-sm font-semibold text-primary-foreground">
          {isAdmin ? "The doubts board needs the database step 2026_11_access_doubts.sql." : "Doubts open soon."}
        </p>
      </div>
    );
  }

  const cohorts = await loadMyCohorts(session.profile.id);
  const items = await loadDoubts({ userId: session.profile.id, isAdmin, cohortIds: cohorts.map((c) => c.id), cohortFilter: isAdmin ? sp.cohort ?? null : null });
  // The Wall link shows only where the Wall opens: full accounts, not switched off for this student.
  const showWall = !isAdmin && session.profile.scope !== "lectures_only" && !blockedBy("/wall", session.profile.role === "student" ? await loadMyBlocks(session.profile.id) : []);
  const group = cohorts.length ? cohorts.map((c) => c.name).join(" & ") : "your batch";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ToolHeader
        eyebrow="Doubts"
        title={isAdmin ? "Doubts board" : "Ask your batch"}
        tip={{
          id: "doubts",
          steps: [`${group[0].toUpperCase()}${group.slice(1)} sees what you post here. Anyone can answer.`, "A concern about the course or your account goes privately to the VIBHA team instead."],
        }}
      />
      {isAdmin ? (
        <p className="rounded-2xl border-2 border-foreground bg-card p-3 text-sm">
          You&apos;re seeing the board as students see it. To reply to doubts and private concerns, use <Link href="/admin/doubts" className="font-bold text-link underline">Review → Doubts &amp; concerns</Link>.
        </p>
      ) : null}
      <DoubtsBoard items={items} canAskCohort={cohorts[0]?.id ?? null} canAsk={!isAdmin} />
      {/* The batch Wall is not a menu place of its own: it opens from here. */}
      {showWall ? (
        <Link href="/wall" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link underline-offset-4 hover:underline">
          <MessagesSquare className="size-4" aria-hidden /> Wall: posts from your batch <ArrowRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
