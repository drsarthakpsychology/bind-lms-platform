"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateCertificatePdf } from "@/lib/certificate";

export type CertificateResult = { error: string | null; success: boolean };

/**
 * Issue a certificate for a student + course. Manual admin click (the
 * instructor sign-off is the human step); everything after — PDF generation
 * with QR, storage to R2/Supabase, and (future) email — is automatic.
 */
export async function issueCertificate(
  _prevState: CertificateResult,
  formData: FormData,
): Promise<CertificateResult> {
  if (!(await requireAdmin())) return { error: "Not authorized.", success: false };

  const userId = String(formData.get("userId") ?? "").trim();
  const courseId = String(formData.get("courseId") ?? "").trim();
  if (!userId || !courseId) return { error: "Missing student or course.", success: false };

  const supabase = await createClient();
  const [{ data: student }, { data: course }, { data: profile }] = await Promise.all([
    supabase.from("profiles").select("id, email").eq("id", userId).maybeSingle(),
    supabase.from("courses").select("id, title").eq("id", courseId).maybeSingle(),
    supabase.from("profiles").select("id").eq("id", (await requireAdmin())?.id).maybeSingle(),
  ]);
  if (!student || !course) return { error: "Student or course not found.", success: false };

  const certId = crypto.randomUUID();
  const pdf = await generateCertificatePdf({
    studentName: student.email ?? "Student",
    courseTitle: course.title,
    issuedAt: new Date().toISOString().slice(0, 10),
    certificateId: certId,
  });

  // Store the PDF in the videos bucket (reusing it for documents is fine) or
  // better: a dedicated path. We'll use the videos bucket root for now.
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Service role key not configured.", success: false };
  }
  const path = `certificates/${certId}.pdf`;
  const { error: upErr } = await admin.storage.from("videos").upload(path, pdf, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (upErr) return { error: `Could not store PDF: ${upErr.message}`, success: false };

  const { error: insertErr } = await supabase.from("certificates").insert({
    id: certId,
    user_id: userId,
    course_id: courseId,
    student_name: student.email ?? "Student",
    course_title: course.title,
    issued_by: profile?.id ?? null,
    pdf_storage_path: path,
  });
  if (insertErr) return { error: `Could not record certificate: ${insertErr.message}`, success: false };

  revalidatePath("/admin/students");
  return { error: null, success: true };
}
