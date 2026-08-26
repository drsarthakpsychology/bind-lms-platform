import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { SupervisionReview } from "./supervision-review";

export const dynamic = "force-dynamic";

/**
 * /admin/supervision — review students' requested supervision sign-offs.
 * Admin signs or rejects entries that a student marked as "requested".
 */
export default async function AdminSupervisionPage() {
  const admin = createAdminClient();

  const [{ data: requested }, { data: profiles }] = await Promise.all([
    admin
      .from("supervision_entries")
      .select("id, user_id, activity, hours, date, supervisor_name, competency_id, signoff_status")
      .eq("signoff_status", "requested")
      .order("date", { ascending: false })
      .limit(100),
    admin.from("profiles").select("id, email").limit(500),
  ]);
  const emailBy = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Supervision sign-offs"
        description="Entries students have requested to be signed. Verify the contact hour, then sign or reject."
      />

      <div className="mt-6">
        <SupervisionReview
          entries={(requested ?? []).map((e) => ({
            id: e.id,
            studentEmail: emailBy.get(e.user_id) ?? "student",
            activity: String(e.activity),
            hours: Number(e.hours),
            date: e.date as string,
            supervisorName: (e.supervisor_name as string | null) ?? undefined,
            signoffStatus: e.signoff_status as string,
          }))}
        />
      </div>
    </div>
  );
}
