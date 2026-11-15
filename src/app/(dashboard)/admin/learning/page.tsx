import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { loadLearningInsights } from "@/lib/insights/load";
import { PageHeader } from "@/components/design-system/page-header";
import { LearningInsightsView } from "@/components/admin/learning-insights";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage, Empty, LoadError } from "../_v2/kit";

export const metadata: Metadata = { title: "Learning insights" };
export const dynamic = "force-dynamic";

/**
 * /admin/learning, how the cohort is doing with self-study: modules,
 * hard spots, Psychology Lab class results, and who has gone quiet.
 */
export default async function LearningInsightsPage() {
  // The admin layout already gates this; check again because this page reads
  // every student's row with the service-role client.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");

  const res = await loadLearningInsights();

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage title="Learning insights" lead="Each student's self-study: modules finished, test scores, what they mix up, and who has gone quiet.">
        {!res.ok ? (
          <LoadError what="learning data" href="/admin/learning" />
        ) : res.insights.started === 0 ? (
          <Empty>No self-study yet. Numbers appear here once students start modules or Lab experiments.</Empty>
        ) : (
          <LearningInsightsView v2 data={res.insights} csvHref="/api/admin/learning/csv" />
        )}
      </AdminPage>
    );
  }

  return (
    <div className="min-w-0">
      <PageHeader title="Learning insights" description="Each student's self-study: which Notes modules they finished, test scores, what they mix up, and who has gone quiet." />
      {!res.ok ? (
        <p className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
          Learning data could not be loaded right now. Please try again in a few minutes.
        </p>
      ) : res.insights.started === 0 ? (
        <p className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
          No self-study yet. Numbers appear here once students start modules or Lab experiments.
        </p>
      ) : (
        <LearningInsightsView data={res.insights} csvHref="/api/admin/learning/csv" />
      )}
    </div>
  );
}
