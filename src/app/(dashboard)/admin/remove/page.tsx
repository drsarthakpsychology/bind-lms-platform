import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { AdminPage } from "../_v2/kit";
import { loadRemoval } from "./actions";
import { RemoveClient } from "./remove-client";

export const metadata = { title: "Remove people" };

/**
 * Remove people from VIBHA: everyone (students and staff) with Remove access,
 * Restore and Delete account, and the app's account deletion requests to
 * approve or decline. View admins can see it; only a Super Admin can act.
 */
export default async function RemovePeoplePage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const data = await loadRemoval();
  if (!data) redirect("/admin");
  return (
    <AdminPage title="Remove people" lead="Take someone off VIBHA. Remove access can be undone. Delete account is permanent." back={{ href: "/admin/more", label: "More" }}>
      <RemoveClient data={data} canWrite={isSuperAdmin(me)} />
    </AdminPage>
  );
}
