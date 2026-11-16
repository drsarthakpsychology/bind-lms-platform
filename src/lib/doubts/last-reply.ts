/**
 * Who wrote the last answer on each doubt: "faculty" (the VIBHA team: an
 * admin or a view-only admin) or "student" (the asker or a classmate). Null
 * when nobody has answered. Hidden replies do not count, so a doubt whose only
 * faculty answer was hidden is still waiting. Pure, so it is tested alone.
 */
export type LastReplyBy = "student" | "faculty" | null;

export const FACULTY_ROLES = new Set(["admin", "view_admin"]);

export function lastReplyBy(replies: { doubt_id: string; user_id: string; created_at: string; hidden?: boolean | null }[], roleOf: (userId: string) => string | null | undefined): Map<string, Exclude<LastReplyBy, null>> {
  const latest = new Map<string, { at: number; user: string }>();
  for (const r of replies) {
    if (r.hidden) continue;
    const at = Date.parse(r.created_at);
    const t = Number.isFinite(at) ? at : 0;
    const cur = latest.get(r.doubt_id);
    if (!cur || t >= cur.at) latest.set(r.doubt_id, { at: t, user: r.user_id });
  }
  const out = new Map<string, Exclude<LastReplyBy, null>>();
  for (const [id, x] of latest) out.set(id, FACULTY_ROLES.has(roleOf(x.user) ?? "") ? "faculty" : "student");
  return out;
}
