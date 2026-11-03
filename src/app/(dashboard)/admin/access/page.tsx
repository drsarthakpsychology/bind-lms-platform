import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { isHiddenAccount } from "@/lib/people/hidden";
import { loadAllBlocks } from "@/lib/access/blocks";
import { FEATURES, RESETS } from "@/lib/access/features";
import { AccessManager, type AccessRow } from "./access-manager";

export const metadata: Metadata = { title: "Access" };
export const dynamic = "force-dynamic";

/** People → Access: Full or Lectures only, sections on or off, and resets, for one student or many. */
export default async function AccessPage({ searchParams }: { searchParams: Promise<{ q?: string; cohort?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const admin = createAdminClient();
  const [{ data: profiles }, cohortsRes, membersRes, blocks] = await Promise.all([
    admin.from("profiles").select("id, email, name, scope, status, is_test").eq("role", "student").order("email").limit(5000),
    admin.from("cohorts").select("id, name, course_id, status").order("created_at"),
    admin.from("cohort_members").select("cohort_id, user_id").limit(50000),
    loadAllBlocks(),
  ]);
  const cohorts = cohortsRes.error ? [] : (cohortsRes.data ?? []).map((c) => ({ id: c.id as string, name: c.name as string, courseId: (c.course_id as string | null) ?? null }));
  const inCohort = new Map<string, string[]>();
  for (const m of membersRes.error ? [] : (membersRes.data ?? [])) inCohort.set(m.user_id as string, [...(inCohort.get(m.user_id as string) ?? []), m.cohort_id as string]);
  const rows: AccessRow[] = (profiles ?? [])
    .filter((p) => !isHiddenAccount(p))
    .map((p) => ({
      id: p.id as string,
      email: String(p.email ?? ""),
      name: (p.name as string | null) ?? null,
      scope: p.scope === "lectures_only" ? "lectures_only" : "full",
      locked: p.status === "blocked",
      cohortIds: inCohort.get(p.id as string) ?? [],
      off: blocks.byUser.get(p.id as string) ?? [],
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Access"
        description="Who can use what. Tick one student or many, then change their access, switch a section off or on, or start a section again."
      />
      {!blocks.ready ? (
        <p className="rounded-2xl border-2 border-foreground bg-primary p-3 text-sm font-semibold text-primary-foreground">
          Switching sections off needs the new database step (2026_11_access_doubts.sql). Full / Lectures only works now.
        </p>
      ) : null}
      <AccessManager
        rows={rows}
        cohorts={cohorts}
        features={FEATURES.map((f) => ({ key: f.key, label: f.label, group: f.group }))}
        resets={RESETS.map((r) => ({ key: r.key, label: r.label }))}
        initialQuery={sp.q ?? ""}
        initialCohort={sp.cohort ?? ""}
      />
    </div>
  );
}
