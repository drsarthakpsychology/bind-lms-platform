import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadSignOffRequests } from "@/lib/admin/signoffs";
import { PageHeader } from "@/components/design-system/page-header";
import { SupervisionReview } from "./supervision-review";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";

export const dynamic = "force-dynamic";

/**
 * /admin/supervision: review students' requested supervision sign-offs.
 * Admin signs or rejects entries that a student marked as "requested".
 */
export default async function AdminSupervisionPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const admin = createAdminClient();

  const requested = await loadSignOffRequests(admin);
  const entries = requested.map((e) => ({
    id: e.id,
    studentEmail: e.studentEmail,
    activity: e.activity,
    hours: e.hours,
    date: e.date,
    supervisorName: e.supervisorName ?? undefined,
    signoffStatus: e.signoffStatus,
  }));

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage title="Sign-offs" lead="Supervision entries students asked you to sign. Check the contact hours, then sign or reject.">
        <SupervisionReview
          v2
          entries={entries}
        />
      </AdminPage>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Supervision sign-offs"
        description="Entries students have requested to be signed. Verify the contact hour, then sign or reject."
      />

      <div className="mt-6">
        <SupervisionReview
          entries={entries}
        />
      </div>
    </div>
  );
}
