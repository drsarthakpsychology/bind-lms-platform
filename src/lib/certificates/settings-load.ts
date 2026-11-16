import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dailyEmailLimit } from "./email-plan";
import { SIGNATORIES_KEY, startingSignatories, type DefaultSignatory } from "./defaults";
import { emailConfigured, emailsSentToday, signatureOptions } from "./server";

/**
 * Certificates, Settings: who signs by default, the saved signature images,
 * and email (today's allowance and the waiting queue). The settings page,
 * the studio's starting signatories and the app's
 * GET /admin/certificates/settings all read this.
 */
export type CertificateSettings = {
  signatories: DefaultSignatory[];
  signatures: { id: string; label: string; url: string | null }[];
  email: { configured: boolean; limit: number; sentToday: number; waiting: number };
};

export async function loadDefaultSignatories(admin: SupabaseClient): Promise<DefaultSignatory[]> {
  const saved = await admin.from("admin_settings").select("value").eq("key", SIGNATORIES_KEY).maybeSingle();
  return startingSignatories(saved.error ? null : saved.data?.value);
}

export async function loadCertificateSettings(admin: SupabaseClient): Promise<CertificateSettings> {
  const configured = emailConfigured();
  const [signatories, signatures, sentToday, queue] = await Promise.all([
    loadDefaultSignatories(admin),
    signatureOptions(admin).catch(() => []),
    configured ? emailsSentToday(admin).catch(() => 0) : Promise.resolve(0),
    admin.from("certificate_email_queue").select("id", { count: "exact", head: true }).eq("status", "queued"),
  ]);
  return { signatories, signatures, email: { configured, limit: dailyEmailLimit(), sentToday, waiting: queue.error ? 0 : (queue.count ?? 0) } };
}
