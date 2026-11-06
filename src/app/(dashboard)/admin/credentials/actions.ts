"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { generateCredentialPdf } from "@/lib/achievements/pdf";
import { putCredentialAsset, newCredentialId } from "@/lib/achievements/storage";
import { notifyCredential } from "@/lib/achievements/notify";
import { getObjectBufferR2 } from "@/lib/media/r2";

export type CustomCertInput = {
  userId: string;
  /** Printed name — defaults to the student's name, editable. */
  studentName: string;
  title: string;
  heading?: string;
  lead?: string;
  description?: string;
  /** Issue date (yyyy-mm-dd), defaults to today. */
  issuedOn?: string;
  /** Use the signature saved on this certificate type (optional). */
  signatureFrom?: string | null;
  /** Send the student a notification + email (the in-app one always goes). */
  email: boolean;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/**
 * Credentials → Issue a certificate: design one for a specific student — the
 * printed name, the title, a short description and the date — preview it, and
 * issue it. It gets a credential ID, a public verify page, a PDF, and appears
 * on the student's Achievements page; the notification (and email, if ticked)
 * goes out like any other certificate.
 */
export async function issueCustomCertificate(input: CustomCertInput): Promise<{ error: string | null; credentialId?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Only the Super Admin can issue certificates." };
  const title = input.title.trim().slice(0, 120);
  const name = input.studentName.trim().slice(0, 80);
  if (!title) return { error: "Give the certificate a title." };
  if (!name) return { error: "Type the name to print." };
  const admin = createAdminClient();
  const { data: student } = await admin.from("profiles").select("id, email, roll_number").eq("id", input.userId).maybeSingle();
  if (!student) return { error: "Student not found." };

  // One certificate type per custom title (kept off the automatic badge list).
  const s = `custom-${slug(title)}`;
  let { data: ach } = await admin.from("achievements").select("id").eq("slug", s).maybeSingle();
  if (!ach) {
    const ins = await admin
      .from("achievements")
      .insert({ slug: s, type: "certificate", title, description: input.description?.trim() || null, requirements: {}, enabled: false, tone: "lime" })
      .select("id")
      .single();
    if (ins.error) return { error: ins.error.message.includes("relation") ? "Achievements aren't set up in the database yet." : ins.error.message };
    ach = ins.data;
  }

  let signaturePng: Buffer | null = null;
  let signaturePath: string | null = null;
  if (input.signatureFrom) {
    const { data: sig } = await admin.from("achievements").select("signature_asset_path").eq("id", input.signatureFrom).maybeSingle();
    signaturePath = (sig?.signature_asset_path as string | null) ?? null;
    if (signaturePath) signaturePng = await getObjectBufferR2(process.env.R2_BUCKET_NAME ?? "", signaturePath).catch(() => null);
  }

  const credentialId = newCredentialId();
  const issuedOn = /^\d{4}-\d{2}-\d{2}$/.test(input.issuedOn ?? "") ? input.issuedOn! : new Date().toISOString().slice(0, 10);
  const pdf = await generateCredentialPdf({
    studentName: name,
    title,
    issuedAt: issuedOn,
    credentialId,
    signaturePng,
    rollNumber: (student.roll_number as string | null) ?? null,
    heading: input.heading?.trim() || null,
    lead: input.lead?.trim() || null,
    description: input.description?.trim() || null,
  });
  const key = `certificates/${credentialId}.pdf`;
  await putCredentialAsset(key, pdf, "application/pdf");
  const now = new Date().toISOString();
  const { error } = await admin.from("credentials").insert({
    credential_id: credentialId,
    user_id: input.userId,
    achievement_id: ach!.id,
    type: "certificate",
    status: "issued",
    student_name: name,
    reason: input.description?.trim() || null,
    issued_at: new Date(`${issuedOn}T12:00:00+05:30`).toISOString(),
    approved_at: now,
    approved_by: me.id,
    issued_by: me.id,
    signature_asset_path: signaturePath,
    pdf_storage_path: key,
  });
  if (error) return { error: error.message };
  await audit(admin, { action: "certificate.custom_issued", targetType: "credential", targetId: credentialId, details: { user_id: input.userId, title }, actor: me });
  await notifyCredential({
    userId: input.userId,
    email: input.email && student.email ? String(student.email) : null,
    name,
    type: "certificate",
    title,
    credentialId,
  }).catch(() => {});
  revalidatePath("/admin/credentials");
  revalidatePath("/admin/achievements");
  revalidatePath(`/admin/students/${input.userId}`);
  return { error: null, credentialId };
}

/** Preview the certificate PDF before issuing (nothing is saved). */
export async function previewCustomCertificate(input: Omit<CustomCertInput, "email">): Promise<{ error: string | null; dataUrl?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { data: student } = await admin.from("profiles").select("roll_number").eq("id", input.userId).maybeSingle();
  const pdf = await generateCredentialPdf({
    studentName: input.studentName.trim() || "Student name",
    title: input.title.trim() || "Certificate title",
    issuedAt: input.issuedOn || new Date().toISOString().slice(0, 10),
    credentialId: "PREVIEW",
    signaturePng: null,
    rollNumber: (student?.roll_number as string | null) ?? null,
    heading: input.heading?.trim() || null,
    lead: input.lead?.trim() || null,
    description: input.description?.trim() || null,
  });
  return { error: null, dataUrl: `data:application/pdf;base64,${pdf.toString("base64")}` };
}
