"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export type CreateStudentState = { error: string | null; success: boolean };

export async function createStudent(
  _prevState: CreateStudentState,
  formData: FormData,
): Promise<CreateStudentState> {
  if (!(await requireAdmin())) {
    return { error: "Not authorized.", success: false };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required.", success: false };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  let expiresAt: string | null = null;
  if (expiresAtRaw) {
    const parsed = new Date(`${expiresAtRaw}T23:59:59.999Z`);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "That expiry date doesn't look right.", success: false };
    }
    expiresAt = parsed.toISOString();
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet — add it in Vercel's project settings, then redeploy.",
      success: false,
    };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return {
      error: createError?.message ?? "Could not create the account.",
      success: false,
    };
  }

  if (expiresAt) {
    const { error: updateError } = await admin
      .from("profiles")
      .update({ expires_at: expiresAt })
      .eq("id", created.user.id);

    if (updateError) {
      return {
        error:
          "Account created, but setting the expiry date failed — set it manually for now.",
        success: false,
      };
    }
  }

  revalidatePath("/admin/students");
  return { error: null, success: true };
}

/**
 * Delete a student account (auth user + profile + their rows). One-click
 * cleanup for test accounts. Admin only.
 */
export async function deleteStudent(userId: string): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return { error: "Could not delete the account." };

    // Deleting the auth user cascades to profiles and their data (FK cascade).
    revalidatePath("/admin/students");
    return { error: null };
  } catch {
    return { error: "Could not delete the account." };
  }
}

/**
 * Reset a test account's password to the default. Admin only.
 */
export async function resetStudentPassword(userId: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, { password: "K#test" });
  if (error) return { error: "Could not reset the password." };

  return { error: null };
}

/**
 * Block or unblock an account. `blocked` is the unconditional every-request
 * override (checked in the session guard, not just at login) — it takes effect
 * on the account's very next request. `reason` is the internal-only note
 * ("fee not paid", "requested pause", …), never shown to the student.
 */
export async function setAccountStatus(
  userId: string,
  status: "active" | "blocked",
  reason?: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      status,
      block_reason: status === "blocked" ? (reason?.trim() || null) : null,
    })
    .eq("id", userId);

  if (error) return { error: "Could not update the account status." };

  revalidatePath("/admin/students");
  revalidatePath("/admin/roster");
  return { error: null };
}

/**
 * Lock or unlock EVERY student account at once (a "lock everything" switch for
 * a pause in the programme). Same unconditional every-request override as the
 * per-student toggle; only `role = student` profiles are touched.
 */
export async function setAllStudentsStatus(
  status: "active" | "blocked",
): Promise<{ error: string | null; updated: number }> {
  if (!(await requireAdmin())) return { error: "Not authorized.", updated: 0 };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({
      status,
      block_reason: status === "blocked" ? "Admin lock — whole programme" : null,
    })
    .eq("role", "student")
    .select("id");

  if (error) return { error: "Could not update accounts.", updated: 0 };

  revalidatePath("/admin/students");
  revalidatePath("/admin/roster");
  return { error: null, updated: data?.length ?? 0 };
}
