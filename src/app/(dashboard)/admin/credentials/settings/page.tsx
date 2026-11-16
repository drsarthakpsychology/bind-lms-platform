import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadCertificateSettings } from "@/lib/certificates/settings-load";
import { AdminPage } from "../../_v2/kit";
import { SettingsV2 } from "./settings-ui";

export const metadata: Metadata = { title: "Certificate settings" };
export const dynamic = "force-dynamic";

/** Certificates, Settings: who signs, the signature images, and email (today's allowance, the waiting queue). */
export default async function CertificateSettingsPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const s = await loadCertificateSettings(createAdminClient());
  return (
    <AdminPage title="Settings" width="default">
      <SettingsV2 canWrite={isSuperAdmin(me)} signatories={s.signatories} signatures={s.signatures} email={s.email} />
    </AdminPage>
  );
}
