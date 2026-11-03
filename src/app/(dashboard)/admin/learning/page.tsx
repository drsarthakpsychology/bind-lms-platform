import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { loadLearningInsights } from "@/lib/insights/load";
import { PageHeader } from "@/components/design-system/page-header";
import { LearningInsightsView } from "@/components/admin/learning-insights";

export const metadata: Metadata = { title: "Learning insights" };
export const dynamic = "force-dynamic";

/**
 * /admin/learning — how the cohort is doing with self-study: modules,
 * hard spots, Psychology Lab class results, and who has gone quiet.
 */
export default async function LearningInsightsPage() {
  // The admin layout already gates this; check again because this page reads
  // every student's row with the service-role client.
  if (!(await requireAdmin())) redirect("/dashboard");

  const res = await loadLearningInsights();

  return (
    <div className="min-w-0">
      <PageHeader eyebrow="People" title="Learning insights" description="How the class is doing with self-study." />
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
