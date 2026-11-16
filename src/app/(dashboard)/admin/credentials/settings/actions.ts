"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { cleanDefaultSignatories, SIGNATORIES_KEY, type DefaultSignatory } from "@/lib/certificates/defaults";
import { saveSignatureAsset } from "../../achievements/actions";

/**
 * Certificates, Settings. Super Admin only: every action re-checks the
 * caller itself, because a Server Action can be called directly.
 */
const NO = { error: "Only the Super Admin can change certificate settings." };

/** Who signs a new certificate by default (up to three). Each certificate can still change them. */
export async function saveDefaultSignatories(list: DefaultSignatory[]): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const clean = cleanDefaultSignatories(list);
  if (!clean.length) return { error: "Add at least one signatory with a name." };
  const admin = createAdminClient();
  const { error } = await admin.from("admin_settings").upsert({ key: SIGNATORIES_KEY, value: clean, updated_at: new Date().toISOString(), updated_by: me.id }, { onConflict: "key" });
  if (error) return { error: "Couldn't save. Try again." };
  await audit(admin, { action: "certificate.signatories_saved", targetType: "setting", targetId: SIGNATORIES_KEY, details: { names: clean.map((s) => s.name) }, actor: me });
  revalidatePath("/admin/credentials/settings");
  revalidatePath("/admin/credentials/studio");
  return { error: null };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

/**
 * Save a signature image that any certificate can use. Signature images live
 * on a certificate type (that is where the PDF maker looks), so this keeps
 * one quiet holder type per signature, never shown on the student side.
 */
export async function uploadSignatureImage(labelText: string, dataUrl: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const name = labelText.trim().replace(/\s+/g, " ").slice(0, 60);
  if (!name) return { error: "Say whose signature it is." };
  const admin = createAdminClient();
  const s = `signature-${slug(name) || "image"}`;
  const { data: found } = await admin.from("achievements").select("id").eq("slug", s).maybeSingle();
  let id = (found?.id as string | undefined) ?? null;
  if (!id) {
    const ins = await admin
      .from("achievements")
      .insert({ slug: s, type: "certificate", title: `Signature: ${name}`, description: null, requirements: {}, enabled: false, tone: "ink" })
      .select("id")
      .single();
    if (ins.error || !ins.data) return { error: "Couldn't save the signature." };
    id = ins.data.id as string;
  }
  const r = await saveSignatureAsset(id, dataUrl, name);
  revalidatePath("/admin/credentials/settings");
  return r;
}
