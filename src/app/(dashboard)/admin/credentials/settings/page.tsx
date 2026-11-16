import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { dailyEmailLimit } from "@/lib/certificates/email-plan";
import { SIGNATORIES_KEY, startingSignatories } from "@/lib/certificates/defaults";
import { emailConfigured, emailsSentToday, signatureOptions } from "@/lib/certificates/server";
import { AdminPage } from "../../_v2/kit";
import { SettingsV2 } from "./settings-ui";

export const metadata: Metadata = { title: "Certificate settings" };
export const dynamic = "force-dynamic";

/** Certificates, Settings: who signs, the signature images, and email (today's allowance, the waiting queue). */
export default async function CertificateSettingsPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const admin = createAdminClient();
  const configured = emailConfigured();
  const [saved, signatures, sentToday, queue] = await Promise.all([
    admin.from("admin_settings").select("value").eq("key", SIGNATORIES_KEY).maybeSingle(),
    signatureOptions(admin).catch(() => []),
    configured ? emailsSentToday(admin).catch(() => 0) : Promise.resolve(0),
    admin.from("certificate_email_queue").select("id", { count: "exact", head: true }).eq("status", "queued"),
  ]);
  const limit = dailyEmailLimit();
  return (
    <AdminPage title="Settings" width="default">
      <SettingsV2
        canWrite={isSuperAdmin(me)}
        signatories={startingSignatories(saved.error ? null : saved.data?.value)}
        signatures={signatures}
        email={{ configured, limit, sentToday, waiting: queue.error ? 0 : (queue.count ?? 0) }}
      />
    </AdminPage>
  );
}
