import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { listAdmins } from "./actions";
import { ManagementClient } from "./management-client";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";

export const metadata = { title: "Admin Management" };

/**
 * Admin Management: exclusive to the Super Admin. Lists every administrator,
 * adds new ones (Super Admin or View Admin), changes roles, resends setup
 * links and removes accounts. The View Admin and everyone else is redirected
 * away before anything renders.
 */
export default async function AdminManagementPage() {
  const me = await requireSuperAdmin();
  if (!me) redirect("/admin");

  const admins = await listAdmins();

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage width="default" title="Admins" lead={`Super Admin only. Only ${me.email} can add, change or remove administrators.`}>
        <ManagementClient admins={admins} me={{ id: me.id, email: me.email }} />
      </AdminPage>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header>
        <p className="text-eyebrow text-link">Super Admin only</p>
        <h1 className="text-h1">Admin Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Only <span className="font-semibold text-foreground">{me.email}</span> can add, change or remove administrators.
        </p>
      </header>
      <ManagementClient admins={admins} me={{ id: me.id, email: me.email }} />
    </div>
  );
}
