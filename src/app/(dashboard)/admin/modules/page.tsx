import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { ModulesAdmin } from "./modules-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/modules — publish, schedule, grant and revoke module access.
 * Multi-select + bulk actions: Publish · Schedule · Unpublish · Grant/Revoke
 * to cohort or a single student. Selecting one module expands an explicit
 * access list (who has access, with per-row revoke).
 */
export default async function AdminModulesPage() {
  const admin = createAdminClient();

  const [{ data: modules }, { data: students }, { data: grants }] = await Promise.all([
    admin.from("modules").select("id, title, order_index, state, release_at, created_at").order("order_index"),
    admin.from("profiles").select("id, email").eq("role", "student").order("email"),
    admin.from("module_access").select("module_id, student_id, scope"),
  ]);

  const emailById = new Map((students ?? []).map((s) => [s.id, s.email]));
  const cohortGranted = new Set<string>();
  const grantedByModule = new Map<string, Array<{ id: string; email: string }>>();

  for (const g of grants ?? []) {
    if (g.scope === "cohort") {
      cohortGranted.add(g.module_id);
    } else if (g.student_id && emailById.has(g.student_id)) {
      const list = grantedByModule.get(g.module_id) ?? [];
      list.push({ id: g.student_id, email: emailById.get(g.student_id)! });
      grantedByModule.set(g.module_id, list);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Modules"
        description="Publish, schedule and unpublish modules — and control exactly who has access, with the power to revoke it."
      />
      <div className="mt-6">
        <ModulesAdmin
          modules={(modules ?? []).map((m) => ({
            id: m.id,
            title: m.title,
            order: m.order_index,
            state: m.state as string,
            releaseAt: m.release_at as string | null,
            cohortGranted: cohortGranted.has(m.id),
            grantedStudents: grantedByModule.get(m.id) ?? [],
          }))}
          students={(students ?? []).map((s) => ({ id: s.id, email: s.email }))}
        />
      </div>
    </div>
  );
}
