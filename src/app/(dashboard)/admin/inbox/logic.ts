/**
 * Admin Inbox rules (pure, unit-tested). A doubt thread "needs a reply" when:
 *  - nobody has answered it yet, or
 *  - the student who asked wrote last (a follow-up after an answer), or
 *  - it is a private concern and no admin has answered it yet.
 * Solved and hidden threads never need a reply. A doubt that other students
 * answered (and the asker hasn't come back) is not counted.
 */

export type ThreadRow = { id: string; user_id: string; kind: string | null; status: string | null; created_at: string };
export type ReplyRow = { doubt_id: string; user_id: string; hidden?: boolean | null; created_at: string };

export type NeedsReply = { reason: "unanswered" | "student-replied" | "concern"; lastAt: string };

export function threadNeedsReply(thread: ThreadRow, replies: ReplyRow[], adminIds: Set<string>): NeedsReply | null {
  if ((thread.status ?? "open") !== "open") return null;
  const shown = replies.filter((r) => !r.hidden).sort((a, b) => a.created_at.localeCompare(b.created_at));
  if (!shown.length) return { reason: "unanswered", lastAt: thread.created_at };
  const last = shown[shown.length - 1];
  if (last.user_id === thread.user_id) return { reason: "student-replied", lastAt: last.created_at };
  if (thread.kind === "complaint" && !shown.some((r) => adminIds.has(r.user_id))) return { reason: "concern", lastAt: last.created_at };
  return null;
}

/** Group replies by doubt id once, so each thread check is cheap. */
export function groupReplies(replies: ReplyRow[]): Map<string, ReplyRow[]> {
  const by = new Map<string, ReplyRow[]>();
  for (const r of replies) {
    const list = by.get(r.doubt_id);
    if (list) list.push(r);
    else by.set(r.doubt_id, [r]);
  }
  return by;
}

/** Badge text: nothing at 0, the number up to 99, then "99+". */
export function badgeText(n: number): string | null {
  if (!Number.isFinite(n) || n <= 0) return null;
  return n > 99 ? "99+" : String(Math.floor(n));
}
