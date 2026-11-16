import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { newCredentialId } from "./storage";
import { notifyCredential } from "./notify";
import { displayName } from "@/lib/learn/leaderboard";

/**
 * Give a badge by hand to one student or many (Certificates, Issue, Badge).
 * The automatic rules still award badges on their own; this is for the times
 * the Super Admin wants to give one directly. Each student gets one copy at
 * most: someone who already holds the badge is skipped, not given a second.
 * The permission check stays in the server action; this takes the
 * service-role client so it can be tested with a fake one.
 */

export type ManualAwardReport = {
  error: string | null;
  awarded: Array<{ userId: string; name: string; credentialId: string }>;
  skipped: Array<{ name: string; reason: string }>;
};

export const MAX_BADGE_RECIPIENTS = 300;

export async function awardBadgeManually(
  admin: SupabaseClient,
  actor: { id: string; email: string | null },
  achievementId: string,
  userIds: string[],
): Promise<ManualAwardReport> {
  const ids = [...new Set((userIds ?? []).filter((x) => typeof x === "string" && x))];
  if (!ids.length) return { error: "Pick at least one student.", awarded: [], skipped: [] };
  if (ids.length > MAX_BADGE_RECIPIENTS) return { error: `${MAX_BADGE_RECIPIENTS} students at a time at most.`, awarded: [], skipped: [] };

  const { data: badge, error: badgeErr } = await admin.from("achievements").select("id, title, type").eq("id", achievementId).maybeSingle();
  if (badgeErr) return { error: "Badges aren't set up in the database yet.", awarded: [], skipped: [] };
  if (!badge || badge.type !== "badge") return { error: "Pick a badge.", awarded: [], skipped: [] };

  const [{ data: people }, { data: held }] = await Promise.all([
    admin.from("profiles").select("id, name, email").in("id", ids),
    admin.from("credentials").select("user_id, status").eq("achievement_id", achievementId).in("user_id", ids),
  ]);
  const byId = new Map((people ?? []).map((p) => [p.id as string, p]));
  const has = new Set((held ?? []).filter((h) => h.status !== "revoked").map((h) => h.user_id as string));

  const report: ManualAwardReport = { error: null, awarded: [], skipped: [] };
  const now = new Date().toISOString();
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) {
      report.skipped.push({ name: "Unknown student", reason: "Not found" });
      continue;
    }
    const name = displayName((p.name as string | null) ?? null, String(p.email ?? "")) || String(p.email ?? "Student");
    if (has.has(id)) {
      report.skipped.push({ name, reason: "Already has it" });
      continue;
    }
    const credentialId = newCredentialId();
    const { error } = await admin.from("credentials").insert({
      credential_id: credentialId,
      user_id: id,
      achievement_id: achievementId,
      type: "badge",
      status: "issued",
      student_name: name,
      issued_at: now,
      issued_by: actor.id,
      reason: "Given by VIBHA School of Psychology.",
    });
    if (error) {
      report.skipped.push({ name, reason: /duplicate|unique/i.test(error.message) ? "Already has it" : "Could not save" });
      continue;
    }
    report.awarded.push({ userId: id, name, credentialId });
    await notifyCredential({ userId: id, email: p.email ? String(p.email) : null, name, type: "badge", title: String(badge.title), credentialId }).catch(() => {});
  }
  if (report.awarded.length) {
    await admin.from("admin_audit_log").insert(
      report.awarded.map((a) => ({
        actor_id: actor.id,
        actor_email: actor.email,
        action: "badge.manual_awarded",
        target_type: "credential",
        target_id: a.credentialId,
        details: { user_id: a.userId, achievement_id: achievementId },
      })),
    );
  } else if (!report.skipped.length) {
    report.error = "Nothing was given.";
  }
  return report;
}
