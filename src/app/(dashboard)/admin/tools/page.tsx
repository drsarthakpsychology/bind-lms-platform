import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { PageHeader } from "@/components/design-system/page-header";
import { createAdminClient } from "@/lib/supabase/server";
import { loadMaster } from "@/lib/auth/master";
import { MasterPasswordCard } from "./master-password";

export const dynamic = "force-dynamic";


export default async function AdminToolsPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const admin = createAdminClient();
  const { setting, ready } = await loadMaster(admin);
  const { data: events } = ready
    ? await admin.from("master_login_events").select("email, created_at").order("created_at", { ascending: false }).limit(10)
    : { data: [] };
  const uses = (events ?? []).map((e) => ({ email: String(e.email), at: String(e.created_at) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support key"
        description="A key you set that lets you sign in as a student to help them. Only works for student accounts, and every use is recorded."
      />
      <div className="rounded-2xl border-2 border-foreground bg-card p-4 sm:p-6">
        <MasterPasswordCard
          state={{ ready, set: Boolean(setting), enabled: Boolean(setting?.enabled), updatedAt: setting?.updatedAt ?? null }}
          uses={uses}
        />
      </div>
      <p className="text-caption text-muted-foreground">
        Moved: bulk student import is now in <Link href="/admin/students/add?way=file" className="font-bold underline">Students → Add students → Upload a file</Link>; the session calendar is in each cohort&apos;s <Link href="/admin/cohorts" className="font-bold underline">Settings</Link> tab.
      </p>
    </div>
  );
}
