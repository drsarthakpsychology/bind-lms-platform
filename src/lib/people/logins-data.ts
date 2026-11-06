import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount, isRobotEmail } from "@/lib/people/hidden";

export type InviteRow = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "sent" | "failed";
  /** When the student finished setting their own password (null = not yet). */
  setup_completed_at: string | null;
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
  /** The account's lock state (from profiles.status) — used for the LockToggle. */
  lockStatus: "active" | "blocked";
  /** The profile id for the LockToggle (null if no profile row exists). */
  lockUserId: string | null;
};

/**
 * Students → Logins: every real student with their login email state (sent /
 * failed / not sent), whether they set a password, and their lock state.
 * Moved here from Mail → Logins so login state has one home.
 */
export async function loadLoginRows(): Promise<InviteRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("credential_invites")
    .select("id, email, name, status, setup_completed_at, error_reason, sent_at, created_at")
    .order("created_at", { ascending: false });
  const rows = ((data ?? []) as Omit<InviteRow, "lockStatus" | "lockUserId">[]).filter((r) => !isRobotEmail(r.email));
  const emails = rows.map((r) => r.email);
  const { data: profs } = emails.length > 0 ? await admin.from("profiles").select("id, email, status").in("email", emails) : { data: [] };
  const lockByEmail = new Map((profs ?? []).map((p) => [p.email as string, { status: p.status as string, id: p.id as string }]));
  const out: InviteRow[] = rows.map((r) => {
    const prof = lockByEmail.get(r.email);
    return { ...r, lockStatus: (prof?.status === "blocked" ? "blocked" : "active") as "active" | "blocked", lockUserId: prof?.id ?? null };
  });
  // Every real student appears, even one added without a login invite yet.
  const have = new Set(rows.map((r) => r.email.toLowerCase()));
  const { data: others } = await admin.from("profiles").select("id, email, name, status, is_test, created_at, active_session_token").eq("role", "student").limit(5000);
  for (const p of others ?? []) {
    const email = String(p.email ?? "");
    if (!email || have.has(email.toLowerCase()) || isHiddenAccount(p)) continue;
    out.push({
      id: `p-${p.id}`,
      email,
      name: (p.name as string | null) || email.split("@")[0],
      status: "pending",
      // Already signing in = their account works, so it counts as set up.
      setup_completed_at: p.active_session_token ? ((p.created_at as string) ?? null) : null,
      error_reason: null,
      sent_at: null,
      created_at: (p.created_at as string) ?? new Date(0).toISOString(),
      lockStatus: p.status === "blocked" ? "blocked" : "active",
      lockUserId: p.id as string,
    });
  }
  return out;
}
