import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { InfraMetrics } from "./infra-metrics";

export const dynamic = "force-dynamic";

/**
 * /admin/infra — live storage and AI usage (v3 Part 3.6).
 * Big honest numbers, hard-shadow cards, red banner when anything crosses 70%.
 * Cheap insurance against the failure mode that takes the whole cohort down:
 * silently passing a usage limit mid-week.
 *
 * Admin-only via the admin layout role guard + the RPC is service_role only.
 */
export default async function InfraPage() {
  const admin = createAdminClient();
  const { data } = await admin.rpc("infra_metrics");

  const metrics = (data ?? {}) as {
    db_size_bytes?: number;
    top_tables?: Array<{ name: string; size: number }>;
    ai_usage_7d?: Array<{ provider: string; calls: number; tokens: number }>;
    provider_health?: Array<{ provider: string; consecutive_failures: number }>;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Usage & limits"
        description="Live storage and AI usage. Anything past 70% is flagged before it becomes a problem."
      />
      <div className="mt-6">
        <InfraMetrics metrics={metrics} />
      </div>
    </div>
  );
}
