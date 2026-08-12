import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { ModulesAdmin } from "./modules-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/modules (v5 Part 7.4) — publish, schedule, grant modules in bulk.
 * Multi-select + bulk actions: Publish · Schedule · Grant to cohort ·
 * Unpublish. One-click "unlock everything for this student".
 */
export default async function AdminModulesPage() {
  const admin = createAdminClient();

  const [{ data: modules }, { data: students }, { data: grants }] = await Promise.all([
    admin.from("modules").select("id, title, order_index, state, release_at, created_at").order("order_index"),
    admin.from("profiles").select("id, email").eq("role", "student"),
    admin.from("module_access").select("module_id, student_id, scope"),
  ]);

  const grantSet = new Set((grants ?? []).map((g) => `${g.module_id}:${g.student_id}`));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Modules"
        description="Publish two, three, five modules at once and grant access. Bulk actions + preview-as-student."
      />
      <div className="mt-6">
        <ModulesAdmin
          modules={(modules ?? []).map((m) => ({
            id: m.id,
            title: m.title,
            order: m.order_index,
            state: m.state as string,
            releaseAt: m.release_at as string | null,
            grantedStudents: (students ?? [])
              .filter((s) => grantSet.has(`${m.id}:${s.id}`))
              .map((s) => s.email),
          }))}
          students={(students ?? []).map((s) => ({ id: s.id, email: s.email }))}
        />
      </div>
    </div>
  );
}
