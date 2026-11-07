import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { doubtsReady, loadDoubts } from "@/lib/doubts/data";
import { DoubtsBoard } from "./doubts-ui";
import Link from "next/link";

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
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-h1">Doubts</h1>
        <p className="mt-2 rounded-2xl border-2 border-foreground bg-primary p-4 text-sm font-semibold text-primary-foreground">
          The doubts board isn&apos;t switched on yet. Run the new database step (2026_11_access_doubts.sql) and it appears here.
        </p>
      </div>
    );
  }

  const cohorts = await loadMyCohorts(session.profile.id);
  const items = await loadDoubts({ userId: session.profile.id, isAdmin, cohortIds: cohorts.map((c) => c.id), cohortFilter: isAdmin ? sp.cohort ?? null : null });
  const group = cohorts.length ? cohorts.map((c) => c.name).join(" & ") : "your batch";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <p className="text-eyebrow text-link">Doubts</p>
        <h1 className="text-h1">{isAdmin ? "Doubts board" : "Ask your batch"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin ? "Every student's doubts and private concerns." : `A doubt you post here is seen by ${group}. Anyone can answer. If it's really a concern about the course or your account, it goes privately to the VIBHA team instead.`}
        </p>
      </header>
      {isAdmin ? (
        <p className="rounded-2xl border-2 border-foreground bg-card p-3 text-sm">
          You&apos;re seeing the board as students see it. To reply to doubts and private concerns, use <Link href="/admin/doubts" className="font-bold text-link underline">Review → Doubts &amp; concerns</Link>.
        </p>
      ) : null}
      <DoubtsBoard items={items} canAskCohort={cohorts[0]?.id ?? null} canAsk={!isAdmin} />
    </div>
  );
}
