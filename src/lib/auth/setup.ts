import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { hashSetupToken } from "@/lib/auth/roster";
import { checkNewPassword } from "@/lib/auth/password-policy";

/**
 * Account setup from a one-time link: the logic shared by the website's
 * /setup form (src/app/setup/actions.ts) and the mobile app
 * (/api/app/v1/auth/setup/*). Callers do their own rate limiting.
 */

export type SetupFailure = "invalid" | "policy" | "used" | "expired" | "save_failed";
export type SetupOutcome = { ok: true; email: string } | { ok: false; reason: SetupFailure; error: string };

const COLS = "id, user_id, email, expires_at, used_at, revoked_at";

type TokenRow = { id: string; user_id: string; email: string; expires_at: string; used_at: string | null; revoked_at: string | null };

async function findToken(token: string): Promise<TokenRow | null> {
  const { data } = await createAdminClient().from("account_setup_tokens").select(COLS).eq("token_hash", hashSetupToken(token)).maybeSingle();
  return (data as TokenRow | null) ?? null;
}

/** Is this link still good? Reads only: opening or checking a link never uses it up. */
export async function checkSetupToken(token: string): Promise<{ valid: boolean; email: string | null; reason: "used" | "expired" | "unknown" | null }> {
  if (!token || token.length > 200) return { valid: false, email: null, reason: "unknown" };
  const row = await findToken(token);
  if (!row) return { valid: false, email: null, reason: "unknown" };
  if (row.used_at || row.revoked_at) return { valid: false, email: null, reason: "used" };
  if (new Date(row.expires_at).getTime() < Date.now()) return { valid: false, email: null, reason: "expired" };
  return { valid: true, email: row.email, reason: null };
}

/**
 * Spend the link and set the password. The token hash must match an unused,
 * unexpired, unrevoked row; it is spent first so two submits at once cannot
 * both win, and given back if the password could not be saved.
 */
export async function finishSetup(token: string, password: string): Promise<SetupOutcome> {
  if (!token || token.length > 200) return { ok: false, reason: "invalid", error: "This setup link isn't valid. Ask us for a new one." };
  const policy = checkNewPassword(password);
  if (policy) return { ok: false, reason: "policy", error: policy };

  const admin = createAdminClient();
  const row = await findToken(token);
  if (!row || row.used_at || row.revoked_at) {
    return { ok: false, reason: "used", error: "This setup link has already been used or replaced. Ask us for a new one." };
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "expired", error: "This setup link has expired. Ask us for a new one." };
  }

  // Spend the token first (single use even if two tabs submit at once).
  const { data: spent } = await admin
    .from("account_setup_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id)
    .is("used_at", null)
    .select("id")
    .maybeSingle();
  if (!spent) return { ok: false, reason: "used", error: "This setup link has already been used. Ask us for a new one." };

  const { error } = await admin.auth.admin.updateUserById(row.user_id, { password });
  if (error) {
    await admin.from("account_setup_tokens").update({ used_at: null }).eq("id", row.id);
    return { ok: false, reason: "save_failed", error: "We couldn't save that password. Try a different one." };
  }

  await admin.from("credential_invites").update({ setup_completed_at: new Date().toISOString() }).eq("email", row.email);
  return { ok: true, email: row.email };
}
