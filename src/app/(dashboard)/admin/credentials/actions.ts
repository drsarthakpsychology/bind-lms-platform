"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { generateCredentialPdf } from "@/lib/achievements/pdf";
import { putCredentialAsset, newCredentialId } from "@/lib/achievements/storage";
import { emailCustomCertificate, notifyCredential } from "@/lib/achievements/notify";
import { CUSTOM_SIGNATORY, cleanEmail, cleanPhone } from "@/lib/achievements/linkedin";
import { getObjectBufferR2 } from "@/lib/media/r2";

export type CustomCertInput = {
  userId: string;
  /** Printed name: defaults to the student's name, editable. */
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
type Admin = ReturnType<typeof createAdminClient>;

/** One certificate type per custom title (kept off the automatic badge list). */
async function customAchievement(admin: Admin, title: string, description?: string | null): Promise<{ id: string } | { error: string }> {
  const s = `custom-${slug(title)}`;
  const { data: found } = await admin.from("achievements").select("id").eq("slug", s).maybeSingle();
  if (found) return { id: found.id as string };
  const ins = await admin
    .from("achievements")
    .insert({ slug: s, type: "certificate", title, description: description?.trim() || null, requirements: {}, enabled: false, tone: "lime" })
    .select("id")
    .single();
  if (ins.error) return { error: ins.error.message.includes("relation") ? "Achievements aren't set up in the database yet." : ins.error.message };
  return { id: ins.data.id as string };
}

/** The signature image saved on a certificate type (optional). */
async function loadSignature(admin: Admin, achievementId?: string | null): Promise<{ signaturePng: Buffer | null; signaturePath: string | null }> {
  if (!achievementId) return { signaturePng: null, signaturePath: null };
  const { data: sig } = await admin.from("achievements").select("signature_asset_path").eq("id", achievementId).maybeSingle();
  const signaturePath = (sig?.signature_asset_path as string | null) ?? null;
  const signaturePng = signaturePath ? await getObjectBufferR2(process.env.R2_BUCKET_NAME ?? "", signaturePath).catch(() => null) : null;
  return { signaturePng, signaturePath };
}

const todayIst = () => new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
const validDate = (d?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d ?? "") ? d! : todayIst());

/**
 * Credentials → Issue a certificate: design one for a specific student, the
 * printed name, the title, a short description and the date: preview it, and
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

  const ach = await customAchievement(admin, title, input.description);
  if ("error" in ach) return { error: ach.error };
  const { signaturePng, signaturePath } = await loadSignature(admin, input.signatureFrom);

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
    signatory: CUSTOM_SIGNATORY,
  });
  const key = `certificates/${credentialId}.pdf`;
  await putCredentialAsset(key, pdf, "application/pdf");
  const now = new Date().toISOString();
  const { error } = await admin.from("credentials").insert({
    credential_id: credentialId,
    user_id: input.userId,
    achievement_id: ach.id,
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
    signatory: CUSTOM_SIGNATORY,
  });
  return { error: null, dataUrl: `data:application/pdf;base64,${pdf.toString("base64")}` };
}

export type AnyoneCertInput = {
  name: string;
  email: string;
  phone?: string;
  title: string;
  /** What the person did: printed on the certificate and the verify page. */
  paragraph: string;
  heading?: string;
  lead?: string;
  /** yyyy-mm-dd, defaults to today (IST). */
  issuedOn?: string;
  signatureFrom?: string | null;
  /** Email the certificate to them (default on). */
  email_it: boolean;
};

function checkAnyone(input: AnyoneCertInput): { error: string } | { name: string; email: string; phone: string | null; title: string; paragraph: string } {
  const name = input.name.trim().replace(/\s+/g, " ").slice(0, 80);
  const title = input.title.trim().slice(0, 120);
  const paragraph = input.paragraph.trim().replace(/\s+/g, " ").slice(0, 600);
  const email = cleanEmail(input.email);
  if (!name) return { error: "Type their name." };
  if (!email) return { error: "Type a real email address." };
  if (!title) return { error: "Give the certificate a title." };
  if (!paragraph) return { error: "Write a few lines about what they did." };
  const phone = input.phone?.trim() ? cleanPhone(input.phone) : null;
  if (input.phone?.trim() && !phone) return { error: "That phone number doesn't look right." };
  return { name, email, phone, title, paragraph };
}

/**
 * Credentials → For anyone: a certificate for someone who may not be a
 * student (a volunteer, a guest speaker). They get a certificate only, no
 * login, no account. If the email belongs to a student, it is linked to them
 * too and shows on their Achievements page.
 */
export async function issueCertificateToAnyone(input: AnyoneCertInput): Promise<{ error: string | null; credentialId?: string; linkedStudent?: string | null; emailNote?: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Only the Super Admin can issue certificates." };
  const v = checkAnyone(input);
  if ("error" in v) return { error: v.error };
  const admin = createAdminClient();

  const { data: student } = await admin.from("profiles").select("id, name, roll_number").ilike("email", v.email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1).maybeSingle();
  const ach = await customAchievement(admin, v.title, null);
  if ("error" in ach) return { error: ach.error };
  const { signaturePng, signaturePath } = await loadSignature(admin, input.signatureFrom);

  const credentialId = newCredentialId();
  const issuedOn = validDate(input.issuedOn);
  const pdf = await generateCredentialPdf({
    studentName: v.name,
    title: v.title,
    issuedAt: issuedOn,
    credentialId,
    signaturePng,
    rollNumber: null,
    heading: input.heading?.trim() || "Certificate of Appreciation",
    lead: input.lead?.trim() || "is recognised for",
    description: v.paragraph,
    signatory: CUSTOM_SIGNATORY,
  });
  const key = `certificates/${credentialId}.pdf`;
  try {
    await putCredentialAsset(key, pdf, "application/pdf");
  } catch {
    return { error: "Couldn't save the PDF. Try again." };
  }
  const now = new Date().toISOString();
  const studentId = (student?.id as string | undefined) ?? null;
  const { error } = await admin.from("credentials").insert({
    credential_id: credentialId,
    user_id: studentId,
    achievement_id: ach.id,
    type: "certificate",
    status: "issued",
    student_name: v.name,
    recipient_name: v.name,
    recipient_email: v.email,
    recipient_phone: v.phone,
    reason: v.paragraph,
    issued_at: new Date(`${issuedOn}T12:00:00+05:30`).toISOString(),
    approved_at: now,
    approved_by: me.id,
    issued_by: me.id,
    signature_asset_path: signaturePath,
    pdf_storage_path: key,
  });
  if (error) {
    const missing = /recipient_|column|null value in column "user_id"|violates not-null/i.test(error.message);
    return { error: missing ? "The database needs an update before you can do this (2026_11_custom_credentials.sql)." : error.message };
  }
  await audit(admin, { action: "certificate.custom_issued", targetType: "credential", targetId: credentialId, details: { recipient: v.email, user_id: studentId, title: v.title }, actor: me });

  let emailNote: string | null = null;
  const mail = await emailCustomCertificate({
    userId: studentId,
    email: input.email_it ? v.email : null,
    name: v.name,
    title: v.title,
    credentialId,
    issuedOn,
    paragraph: v.paragraph,
    pdf,
    sentBy: me.id,
  }).catch((e: unknown) => ({ sent: false, error: e instanceof Error ? e.message : "Email failed." }));
  if (input.email_it && !mail.sent) emailNote = mail.error ?? "Email not sent.";

  revalidatePath("/admin/credentials");
  if (studentId) revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/achievements");
  return { error: null, credentialId, linkedStudent: (student?.name as string | null) ?? (studentId ? v.email : null), emailNote };
}

/** Preview the "for anyone" certificate PDF (nothing is saved or sent). */
export async function previewCertificateToAnyone(input: Omit<AnyoneCertInput, "email_it">): Promise<{ error: string | null; dataUrl?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const pdf = await generateCredentialPdf({
    studentName: input.name.trim() || "Their name",
    title: input.title.trim() || "Certificate title",
    issuedAt: validDate(input.issuedOn),
    credentialId: "PREVIEW",
    signaturePng: null,
    rollNumber: null,
    heading: input.heading?.trim() || "Certificate of Appreciation",
    lead: input.lead?.trim() || "is recognised for",
    description: input.paragraph.trim().slice(0, 600) || null,
    signatory: CUSTOM_SIGNATORY,
  });
  return { error: null, dataUrl: `data:application/pdf;base64,${pdf.toString("base64")}` };
}
