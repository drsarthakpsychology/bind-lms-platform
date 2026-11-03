"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { deriveName, generateCredential, issueSetupLink, sendCredentialEmails, sendResendEmail } from "@/lib/auth/roster";
import { appUrl as liveAppUrl } from "@/lib/app-url";
import { audit } from "@/lib/auth/audit";

export type AdminRow = { id: string; email: string; role: "admin" | "view_admin"; status: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["admin", "view_admin"] as const;

/** List every administrator (Super Admin + View Admins). Super Admin only. */
export async function listAdmins(): Promise<AdminRow[]> {
  const me = await requireSuperAdmin();
  if (!me) return [];
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, email, role, status")
    .in("role", [...ROLES])
    .order("role", { ascending: true })
    .order("email", { ascending: true });
  return (data ?? []).map((p) => ({ id: p.id as string, email: String(p.email ?? ""), role: p.role as AdminRow["role"], status: p.status as string }));
}

/**
 * Add an administrator (or re-assign an existing account's role). Only the
 * Super Admin may do this. A fresh password is auto-generated; the one-time
 * setup link is returned so it can be shared.
 */
export async function addAdmin(
  email: string,
  role: "admin" | "view_admin",
): Promise<{ error: string | null; setupUrl?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const e = email.trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return { error: "Enter a valid email address." };
  if (!ROLES.includes(role)) return { error: "Unknown administrator type." };

  const admin = createAdminClient();

  const { data: existing } = await admin.from("profiles").select("id").eq("email", e).maybeSingle();
  if (existing?.id) {
    const { error } = await admin.from("profiles").update({ role }).eq("id", existing.id);
    if (error) return { error: error.message };
    await audit(admin, { action: "admin.role_set", targetType: "profile", targetId: existing.id as string, details: { email: e, role }, actor: me });
    revalidatePath("/admin/management");
    return { error: null };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: e,
    password: generateCredential(),
    email_confirm: true,
    user_metadata: { name: deriveName(e) },
  });
  if (createError || !created.user) return { error: createError?.message ?? "Couldn't create the account." };

  const { error: roleErr } = await admin.from("profiles").update({ role }).eq("id", created.user.id);
  if (roleErr) return { error: "Account created, but setting the role failed: " + roleErr.message };

  await admin.from("credential_invites").upsert({ email: e, name: deriveName(e), status: "pending" }, { onConflict: "email" });
  const setupUrl = (await issueSetupLink(admin, e, liveAppUrl(), me.id)) ?? undefined;
  await audit(admin, { action: "admin.added", targetType: "profile", targetId: created.user.id, details: { email: e, role }, actor: me });

  revalidatePath("/admin/management");
  return { error: null, setupUrl };
}

/** Change an administrator's type. The Super Admin can never be demoted. */
export async function setAdminRole(userId: string, role: "admin" | "view_admin"): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (!ROLES.includes(role)) return { error: "Unknown administrator type." };
  if (userId === me.id && role !== "admin") return { error: "You cannot demote the Super Admin." };

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  await audit(admin, { action: "admin.role_set", targetType: "profile", targetId: userId, details: { role }, actor: me });
  revalidatePath("/admin/management");
  return { error: null };
}

/** Permanently remove an administrator (never the Super Admin). */
export async function removeAdmin(userId: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (userId === me.id) return { error: "You cannot remove the Super Admin." };

  const admin = createAdminClient();
  const { data: target } = await admin.from("profiles").select("role, email").eq("id", userId).maybeSingle();
  if (!target) return { error: "No such administrator." };
  if (target.role === "admin") return { error: "You cannot remove the Super Admin." };

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: "Couldn't remove the account." };
  await audit(admin, { action: "admin.removed", targetType: "profile", targetId: userId, details: { email: target.email }, actor: me });
  revalidatePath("/admin/management");
  return { error: null };
}

/** Send a fresh password-setup link to an administrator. */
export async function resendAdminInvite(email: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const e = email.trim().toLowerCase();
  const admin = createAdminClient();
  const r = await sendCredentialEmails([e], { admin, appUrl: liveAppUrl(), sendEmail: sendResendEmail, sentBy: me.id });
  return { error: r.sent ? null : (r.results[0]?.reason ?? "The email didn't send.") };
}
