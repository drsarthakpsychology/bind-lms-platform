import "server-only";
import type { Profile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { stripMarkup } from "@/lib/sanitize";
import { queuePush } from "./push";
import { tableMissing } from "./devices";

/**
 * "Ask to delete my account" from the app. Nothing is deleted here: the
 * request is stored (app_deletion_requests, once the database step is run)
 * and the super admin gets a bell notice (and push) so a person handles it.
 * Answers ok when at least one of the two was written.
 */
export async function requestDeletion(profile: Profile, name: string | null, reason: string | null, now = new Date()): Promise<{ ok: boolean; stored: boolean }> {
  const db = createAdminClient();
  const clean = reason ? stripMarkup(reason).trim().slice(0, 1000) || null : null;
  const at = now.toISOString();

  const ins = await db.from("app_deletion_requests").insert({ user_id: profile.id, email: profile.email, reason: clean, created_at: at });
  if (ins.error && !tableMissing(ins.error)) console.error("app_deletion_requests insert failed:", ins.error.code, ins.error.message);
  const stored = !ins.error;

  let told = false;
  try {
    const { data: admins } = await db.from("profiles").select("id").eq("role", "admin").neq("status", "blocked");
    const who = name || profile.email || "A student";
    const text = `${who}${profile.email && name ? ` (${profile.email})` : ""} asked for their account to be deleted, from the app.${clean ? ` Reason: ${clean}` : ""}`;
    const rows = (admins ?? []).map((a) => {
      const id = crypto.randomUUID();
      return { id, user_id: String(a.id), type: "message", credential_id: null, title: "Account deletion request", body: text.slice(0, 500), href: `/notifications/${id}`, sent_by: profile.id };
    });
    if (rows.length) {
      const r = await db.from("notifications").insert(rows);
      told = !r?.error;
      if (told) queuePush(rows, "messages");
    }
  } catch (e) {
    console.error("deletion request notice failed:", e instanceof Error ? e.message : e);
  }
  return { ok: stored || told, stored };
}
