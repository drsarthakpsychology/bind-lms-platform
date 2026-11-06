import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generateCredentialPdf } from "./pdf";
import { newCredentialId, putCredentialAsset } from "./storage";
import { notifyCredential } from "./notify";

/**
 * The monthly merit certificate (owner decision 38), issued by the monthly
 * job with the same building blocks as Credentials → Issue a certificate
 * (src/app/(dashboard)/admin/credentials/actions.ts): one certificate type
 * per month, a PDF on R2, a credential with a public verify page, and the
 * usual in-app notification. Idempotent: one per student per month.
 */

export type MeritInput = { userId: string; name: string; email: string | null; rollNumber: string | null; monthLabel: string; month: string; detail: string };

/** The certificate type for a month, created on first use (kept off the automatic badge list). */
export async function meritAchievement(admin: SupabaseClient, month: string, label: string): Promise<{ id: string | null; error: string | null }> {
  const slug = `merit-${month.slice(0, 7)}`;
  const { data, error } = await admin.from("achievements").select("id").eq("slug", slug).maybeSingle();
  if (error) return { id: null, error: error.message };
  if (data) return { id: data.id as string, error: null };
  const ins = await admin
    .from("achievements")
    .insert({ slug, type: "certificate", title: `Monthly merit · ${label}`, description: `Among the top performers of ${label} on VIBHA.`, requirements: {}, enabled: false, tone: "gold" })
    .select("id")
    .single();
  if (ins.error) {
    // Raced with another run: read it back.
    const again = await admin.from("achievements").select("id").eq("slug", slug).maybeSingle();
    return again.data ? { id: again.data.id as string, error: null } : { id: null, error: ins.error.message };
  }
  return { id: ins.data.id as string, error: null };
}

export async function issueMeritCertificate(admin: SupabaseClient, achievementId: string, input: MeritInput): Promise<{ issued: boolean; error: string | null }> {
  const { data: existing, error: readErr } = await admin.from("credentials").select("id").eq("user_id", input.userId).eq("achievement_id", achievementId).limit(1);
  if (readErr) return { issued: false, error: readErr.message };
  if (existing?.length) return { issued: false, error: null };

  const credentialId = newCredentialId();
  const title = `Monthly merit · ${input.monthLabel}`;
  // Dated the last day of the month it rewards.
  const [y, m] = input.month.split("-").map(Number);
  const issuedOn = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  let key: string | null = null;
  try {
    const pdf = await generateCredentialPdf({
      studentName: input.name,
      title,
      issuedAt: issuedOn,
      credentialId,
      signaturePng: null,
      rollNumber: input.rollNumber,
      heading: "Certificate of Merit",
      lead: "is recognised as a top performer for",
      description: input.detail,
    });
    key = await putCredentialAsset(`certificates/${credentialId}.pdf`, pdf, "application/pdf");
  } catch (e) {
    // No storage configured: the credential still counts and can be verified;
    // the PDF can be re-made from Credentials later.
    console.warn("merit certificate PDF skipped:", e instanceof Error ? e.message : e);
  }
  const now = new Date().toISOString();
  const { error } = await admin.from("credentials").insert({
    credential_id: credentialId,
    user_id: input.userId,
    achievement_id: achievementId,
    type: "certificate",
    status: "issued",
    student_name: input.name,
    reason: input.detail,
    issued_at: new Date(`${issuedOn}T12:00:00+05:30`).toISOString(),
    approved_at: now,
    issued_by: null,
    pdf_storage_path: key,
  });
  if (error) return { issued: false, error: error.message };
  await notifyCredential({ userId: input.userId, email: input.email, name: input.name, type: "certificate", title, credentialId }).catch(() => {});
  return { issued: true, error: null };
}
