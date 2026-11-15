import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { loadLoginRows } from "@/lib/people/logins-data";
import { RosterActions } from "../../emails/roster-actions";
import { PageHeader } from "@/components/design-system/page-header";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../../_v2/kit";

export const dynamic = "force-dynamic";

/** Students → Logins: send or re-send login links in bulk, see who has set a password. */
export default async function LoginsPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const rows = await loadLoginRows();
  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage title="Login links" back={{ href: "/admin/students", label: "Students" }} lead="Who has their login link and who has set their own password. Send links to many people at once. Nobody's password is stored or shown.">
        <RosterActions v2 rows={rows} />
      </AdminPage>
    );
  }
  return (
    <div className="space-y-6">
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Back to Students
      </Link>
      <PageHeader
        eyebrow="Students"
        title="Login links"
        description="Who has their login link and who has set their own password. Send links to many people at once. Nobody's password is stored or shown."
      />
      <RosterActions rows={rows} />
    </div>
  );
}
