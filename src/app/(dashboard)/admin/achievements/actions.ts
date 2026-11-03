"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { awardEligibleBadges, loadEvalCtx } from "@/lib/achievements/server";
import { evaluate } from "@/lib/achievements/engine";
import { generateCredentialPdf } from "@/lib/achievements/pdf";
import { putCredentialAsset, credentialDownloadUrl, newCredentialId } from "@/lib/achievements/storage";
import { notifyCredential } from "@/lib/achievements/notify";
import { getObjectBufferR2 } from "@/lib/media/r2";
import { displayName } from "@/lib/learn/leaderboard";
import { REQUIREMENT_KINDS, type AchievementRequirement } from "@/lib/achievements/rules";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export type AchievementRow = {
  id: string;
  slug: string;
  type: "badge" | "certificate";
  title: string;
  description: string | null;
  module_id: string | null;
  course_id: string | null;
  icon: string | null;
  tone: string;
  requirements: AchievementRequirement | Record<string, never>;
  enabled: boolean;
  signature_asset_path: string | null;
  signature_label: string | null;
  issued_count: number;
};

export type CredentialRow = {
  id: string;
  credential_id: string;
  user_id: string;
  student_name: string;
  type: "badge" | "certificate";
  status: "draft" | "approved" | "issued" | "revoked";
  title: string;
  icon: string | null;
  tone: string;
  issued_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
  reason: string | null;
};

const ROLES = ["badge", "certificate"] as const;

/* ---------------------------------------------------------------- achievements */

export async function listAchievements(): Promise<AchievementRow[]> {
  const me = await requireAdmin();
  if (!me) return [];
  const admin = createAdminClient();
  const { data } = await admin
    .from("achievements")
    .select("id, slug, type, title, description, module_id, course_id, icon, tone, requirements, enabled, signature_asset_path, signature_label")
    .order("created_at", { ascending: true });
  const ids = (data ?? []).map((a) => a.id as string);
  const counts = new Map<string, number>();
  if (ids.length) {
    const { data: issued } = await admin.from("credentials").select("achievement_id").in("achievement_id", ids).in("status", ["issued", "revoked"]);
    for (const c of issued ?? []) counts.set(c.achievement_id as string, (counts.get(c.achievement_id as string) ?? 0) + 1);
  }
  return (data ?? []).map((a) => ({ ...(a as AchievementRow), issued_count: counts.get(a.id as string) ?? 0 }));
}

export async function saveAchievement(input: {
  id?: string | null;
  type: "badge" | "certificate";
  title: string;
  description: string;
  module_id: string | null;
  course_id: string | null;
  icon: string | null;
  tone: string;
  requirements: AchievementRequirement;
}): Promise<{ error: string | null; id?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (!ROLES.includes(input.type)) return { error: "Unknown type." };
  const title = input.title.trim();
  if (!title) return { error: "Title is required." };
  const reqKind = (input.requirements as { kind: string }).kind;
  if (!(REQUIREMENT_KINDS as readonly string[]).includes(reqKind)) return { error: "Unknown requirement kind." };

  const admin = createAdminClient();
  const row = {
    type: input.type,
    title,
    description: input.description.trim() || null,
    module_id: input.module_id || null,
    course_id: input.course_id || null,
    icon: input.icon || null,
    tone: input.tone || "lime",
    requirements: input.requirements,
    updated_at: new Date().toISOString(),
  };

  let id = input.id;
  if (id) {
    const { error } = await admin.from("achievements").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const slug = slugify(title) || `achievement-${Date.now()}`;
    const { data, error } = await admin.from("achievements").insert({ ...row, slug }).select("id").single();
    if (error) return { error: error.message };
    id = data.id as string;
  }
  await audit(admin, { action: "achievement.saved", targetType: "achievement", targetId: id ?? null, details: { title, type: input.type }, actor: me });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  return { error: null, id: id ?? undefined };
}

export async function setAchievementEnabled(id: string, enabled: boolean): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { error } = await admin.from("achievements").update({ enabled, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/achievements");
  return { error: null };
}

/** Evaluate every student against every enabled badge and award newly-satisfied ones. */
export async function awardAllBadges(): Promise<{ error: string | null; awarded: number; skipped: number }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized.", awarded: 0, skipped: 0 };
  const admin = createAdminClient();
  const { data: students } = await admin.from("profiles").select("id").eq("role", "student").limit(5000);
  let awarded = 0;
  let skipped = 0;
  for (const s of students ?? []) {
    const r = await awardEligibleBadges(admin, s.id as string, me.id);
    awarded += r.awarded;
    skipped += r.skipped;
  }
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
  return { error: null, awarded, skipped };
}

/* ---------------------------------------------------------------- credentials */

export async function listCredentials(opts: { status?: string; type?: string; search?: string; page?: number }): Promise<{ rows: CredentialRow[]; total: number }> {
  const me = await requireAdmin();
  if (!me) return { rows: [], total: 0 };
  const admin = createAdminClient();
  const page = Math.max(1, opts.page ?? 1);
  const size = 50;
  let q = admin.from("credentials").select("id, credential_id, user_id, student_name, type, status, issued_at, revoked_at, revoke_reason, reason, achievement_id, achievements(title, icon, tone)", { count: "exact" });
  if (opts.status && opts.status !== "all") q = q.eq("status", opts.status);
  if (opts.type && opts.type !== "all") q = q.eq("type", opts.type);
  if (opts.search) q = q.ilike("student_name", `%${opts.search}%`);
  const { data, count, error } = await q.order("created_at", { ascending: false }).range((page - 1) * size, page * size - 1);
  if (error) return { rows: [], total: 0 };
  const rows = (data ?? []).map((c) => {
    const a = Array.isArray(c.achievements) ? c.achievements[0] : c.achievements;
    return {
      id: c.id as string,
      credential_id: c.credential_id as string,
      user_id: c.user_id as string,
      student_name: c.student_name as string,
      type: c.type as CredentialRow["type"],
      status: c.status as CredentialRow["status"],
      title: (a?.title as string) ?? "",
      icon: (a?.icon as string) ?? null,
      tone: (a?.tone as string) ?? "lime",
      issued_at: (c.issued_at as string) ?? null,
      revoked_at: (c.revoked_at as string) ?? null,
      revoke_reason: (c.revoke_reason as string) ?? null,
      reason: (c.reason as string) ?? null,
    };
  });
  return { rows, total: count ?? 0 };
}

/** Students currently eligible for a course-complete certificate achievement. */
export async function listCertificateEligible(achievementId: string): Promise<Array<{ id: string; name: string; reason: string }>> {
  const me = await requireSuperAdmin();
  if (!me) return [];
  const admin = createAdminClient();
  const { data: ach } = await admin.from("achievements").select("requirements").eq("id", achievementId).eq("type", "certificate").maybeSingle();
  if (!ach) return [];
  const req = (ach.requirements ?? {}) as AchievementRequirement;
  const { data: students } = await admin.from("profiles").select("id, name, email").eq("role", "student").limit(5000);
  const out: Array<{ id: string; name: string; reason: string }> = [];
  for (const s of students ?? []) {
    const ctx = await loadEvalCtx(admin, s.id as string);
    const r = evaluate(req, ctx);
    if (r.ok) {
      const { data: already } = await admin.from("credentials").select("id").eq("user_id", s.id).eq("achievement_id", achievementId).neq("status", "revoked").maybeSingle();
      if (!already) out.push({ id: s.id as string, name: displayName(s.name as string | null, String(s.email ?? "")), reason: r.reason });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createCertificateDraft(userId: string, achievementId: string): Promise<{ error: string | null; credentialId?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const [{ data: ach }, { data: profile }, ctx] = await Promise.all([
    admin.from("achievements").select("requirements, title").eq("id", achievementId).eq("type", "certificate").maybeSingle(),
    admin.from("profiles").select("name, email").eq("id", userId).maybeSingle(),
    loadEvalCtx(admin, userId),
  ]);
  if (!ach) return { error: "Not a certificate achievement." };
  const r = evaluate((ach.requirements ?? {}) as never, ctx);
  if (!r.ok) return { error: "This student is not currently eligible." };
  const name = displayName(profile?.name as string | null, String(profile?.email ?? "")) || String(profile?.email ?? "Student");
  const credentialId = newCredentialId();
  const { error } = await admin.from("credentials").insert({
    credential_id: credentialId,
    user_id: userId,
    achievement_id: achievementId,
    type: "certificate",
    status: "draft",
    student_name: name,
    reason: r.reason,
  });
  if (error) return { error: error.message };
  await audit(admin, { action: "certificate.draft_created", targetType: "credential", targetId: credentialId, details: { user_id: userId, achievement_id: achievementId }, actor: me });
  revalidatePath("/admin/achievements");
  return { error: null, credentialId };
}

/** Review + issue: requires an authorised signature asset on the achievement. */
export async function issueCertificate(credentialId: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();

  const { data: cred } = await admin.from("credentials").select("id, user_id, achievement_id, student_name, status, credential_id").eq("credential_id", credentialId).maybeSingle();
  if (!cred) return { error: "Credential not found." };
  if (cred.status !== "draft" && cred.status !== "approved") return { error: `Cannot issue a ${cred.status} credential.` };

  const { data: ach } = await admin.from("achievements").select("title, signature_asset_path, signature_label").eq("id", cred.achievement_id).maybeSingle();
  if (!ach?.signature_asset_path) return { error: "Set an authorised signature asset on this certificate first." };

  // Fetch the signature asset from R2 (never expose the key to the browser).
  let signaturePng: Buffer | null = null;
  if (typeof ach.signature_asset_path === "string") {
    signaturePng = await getObjectBufferR2(process.env.R2_BUCKET_NAME ?? "", ach.signature_asset_path as string);
  }

  const { data: rollProfile } = await admin.from("profiles").select("roll_number").eq("id", cred.user_id as string).maybeSingle();

  const pdf = await generateCredentialPdf({
    studentName: cred.student_name as string,
    title: ach.title as string,
    issuedAt: new Date().toISOString().slice(0, 10),
    credentialId: credentialId,
    signaturePng,
    rollNumber: (rollProfile?.roll_number as string | null) ?? null,
  });

  const key = `certificates/${credentialId}.pdf`;
  await putCredentialAsset(key, pdf, "application/pdf");

  const now = new Date().toISOString();
  const { error } = await admin
    .from("credentials")
    .update({
      status: "issued",
      issued_at: now,
      approved_at: now,
      approved_by: me.id,
      issued_by: me.id,
      signature_asset_path: ach.signature_asset_path as string,
      pdf_storage_path: key,
      updated_at: now,
    })
    .eq("credential_id", credentialId);

  if (error) return { error: error.message };
  await audit(admin, { action: "certificate.issued", targetType: "credential", targetId: credentialId, details: { signature: ach.signature_asset_path as string }, actor: me });

  // Notify only on real issuance (never on a draft).
  const { data: profile } = await admin.from("profiles").select("email").eq("id", cred.user_id as string).maybeSingle();
  await notifyCredential({
    userId: cred.user_id as string,
    email: profile?.email ? String(profile.email) : null,
    name: cred.student_name as string,
    type: "certificate",
    title: ach.title as string,
    credentialId,
  }).catch(() => {});

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/notifications");
  return { error: null };
}

export async function revokeCredential(credentialId: string, reason: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const text = reason.trim();
  if (!text) return { error: "Give a reason." };
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("credentials")
    .update({ status: "revoked", revoked_at: now, revoke_reason: text, revoked_by: me.id, updated_at: now })
    .eq("credential_id", credentialId);
  if (error) return { error: error.message };
  await audit(admin, { action: "credential.revoked", targetType: "credential", targetId: credentialId, details: { reason: text }, actor: me });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath(`/verify/${credentialId}`);
  return { error: null };
}

/** Save an authorised signature asset (base64 data URL) to R2 + record the key. */
export async function saveSignatureAsset(achievementId: string, base64DataUrl: string, label: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const m = /^data:image\/(png|jpeg|jpg);base64,(.+)$/.exec(base64DataUrl.trim());
  if (!m) return { error: "Upload a PNG or JPEG image." };
  const bytes = Buffer.from(m[2], "base64");
  if (bytes.length > 2 * 1024 * 1024) return { error: "Signature image too large (max 2 MB)." };
  const key = `signatures/${achievementId}.png`;
  await putCredentialAsset(key, bytes, "image/png");
  const admin = createAdminClient();
  const { error } = await admin
    .from("achievements")
    .update({ signature_asset_path: key, signature_label: label.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", achievementId);
  if (error) return { error: error.message };
  await audit(admin, { action: "signature.saved", targetType: "achievement", targetId: achievementId, details: { label: label.trim() || null }, actor: me });
  revalidatePath("/admin/achievements");
  return { error: null };
}

/** Signed short-lived download URL for a credential's PDF (private asset). */
export async function getCredentialDownload(credentialId: string): Promise<{ url: string | null; error: string | null }> {
  const me = await requireAdmin();
  if (!me) return { url: null, error: "Not authorized." };
  const admin = createAdminClient();
  const { data } = await admin.from("credentials").select("pdf_storage_path, status").eq("credential_id", credentialId).maybeSingle();
  if (!data?.pdf_storage_path) return { url: null, error: "No certificate file." };
  const url = await credentialDownloadUrl(data.pdf_storage_path as string, 60 * 15);
  return { url, error: null };
}
