/**
 * Removing a person from VIBHA: the rules, in one pure module so every rule
 * is tested (removal-rules.test.ts). The server code that acts on them is
 * ./removal.ts; the website and app screens only ask it.
 *
 * Two ways out:
 *  - "Remove access" (reversible): the account is blocked on every request,
 *    their sign-in is refused, they are hidden from students' lists, and all
 *    their records and certificates stay. Restore brings them back.
 *  - "Delete account" (permanent, Super Admin only, typed name to confirm):
 *    the sign-in and personal details go. Issued certificates stay checkable
 *    and learning and attendance records stay without a name.
 *
 * The mark lives in profiles.block_reason (a column every database has), so
 * this works before supabase/migrations_pending/2026_11_22_remove.sql runs.
 * After it runs, profiles.removed_at and deleted_at are written as well.
 */

export const REMOVED_MARK = "[removed]";
export const DELETED_MARK = "[deleted]";

/** The name a deleted account shows wherever an old record still points at it. */
export const DELETED_NAME = "Deleted account";

export type Removal = "removed" | "deleted" | null;

type Marked = { status?: string | null; block_reason?: string | null; removed_at?: string | null; deleted_at?: string | null };

/** Whether this profile was removed from VIBHA, deleted, or neither. A plain lock is neither. */
export function removalOf(p: Marked | null | undefined): Removal {
  if (!p) return null;
  const reason = (p.block_reason ?? "").trim();
  if (p.deleted_at || reason.startsWith(DELETED_MARK)) return "deleted";
  if (p.status !== "blocked") return null;
  if (p.removed_at || reason.startsWith(REMOVED_MARK)) return "removed";
  return null;
}

/** Hidden from every student-facing list (leaderboards, wall, doubts). */
export const isRemovedAccount = (p: Marked | null | undefined): boolean => removalOf(p) !== null;

/** The block_reason written for a removal: the mark, then the admin's own note. */
export function removedReason(note?: string | null): string {
  const n = (note ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
  return n ? `${REMOVED_MARK} ${n}` : REMOVED_MARK;
}

/** The admin's note without the mark, for showing back to admins. */
export function removalNote(reason: string | null | undefined): string | null {
  const r = (reason ?? "").trim();
  const bare = r.startsWith(REMOVED_MARK) ? r.slice(REMOVED_MARK.length) : r.startsWith(DELETED_MARK) ? r.slice(DELETED_MARK.length) : r;
  return bare.trim() || null;
}

export type Kind = "remove" | "restore" | "delete";

export type Actor = { id: string; role: string };
export type Target = { id: string; role: string; status?: string | null; block_reason?: string | null; removed_at?: string | null; deleted_at?: string | null; name?: string | null; email?: string | null };

/** Words the admin sees when a rule says no. */
export const REFUSE = {
  notAllowed: "Only a Super Admin can do this.",
  notFound: "That person could not be found.",
  self: "You cannot remove your own account. Ask another Super Admin.",
  lastSuper: "This is the only Super Admin. Make someone else a Super Admin first.",
  superAdmin: "A Super Admin cannot be removed. Change them to a View Admin first, in Admins.",
  alreadyRemoved: "This person is already removed.",
  alreadyDeleted: "This account is already deleted.",
  notRemoved: "This person still has access. There is nothing to restore.",
  deletedForGood: "This account was deleted. It cannot be restored. Add them again as a new person.",
  nameMismatch: "The name you typed does not match. Type it exactly as shown.",
} as const;

/** The name the admin must type to delete: their name, or their email when no name is set. */
export function confirmWord(t: Pick<Target, "name" | "email">): string {
  return (t.name ?? "").trim() || (t.email ?? "").trim();
}

const norm = (s: string) => s.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();

/** Typed name matches, ignoring capitals and extra spaces. Never matches an empty word. */
export function nameMatches(typed: string | null | undefined, t: Pick<Target, "name" | "email">): boolean {
  const want = norm(confirmWord(t));
  return want.length > 0 && norm(typed ?? "") === want;
}

/**
 * Whether the actor may do this to the target. Answers null when allowed,
 * else the plain words to show. `activeSupers` = Super Admins who still have
 * access (status not blocked), counting the target if they are one.
 */
export function checkRemoval(kind: Kind, actor: Actor | null, target: Target | null, activeSupers: number, typedName?: string | null): string | null {
  if (!actor || actor.role !== "admin") return REFUSE.notAllowed;
  if (!target) return REFUSE.notFound;
  const state = removalOf(target);
  if (kind === "restore") {
    if (state === "deleted") return REFUSE.deletedForGood;
    if (state !== "removed") return REFUSE.notRemoved;
    return null;
  }
  if (target.id === actor.id) return REFUSE.self;
  if (state === "deleted") return REFUSE.alreadyDeleted;
  if (kind === "remove" && state === "removed") return REFUSE.alreadyRemoved;
  // A removed Super Admin no longer counts as active, so only an active one can be "the last".
  if (target.role === "admin" && state === null && activeSupers <= 1) return REFUSE.lastSuper;
  // The database itself refuses to block or delete a Super Admin (protect_super_admin): say so first.
  if (target.role === "admin") return REFUSE.superAdmin;
  if (kind === "delete" && !nameMatches(typedName, target)) return REFUSE.nameMismatch;
  return null;
}

/** The sign-in address a deleted account is moved to, so the real address is free and gone. */
export function tombstoneEmail(id: string): string {
  return `deleted-${id.replace(/[^a-z0-9-]/gi, "").toLowerCase()}@removed.vibhapsychology.com`;
}

/** Long enough to mean "for good" (100 years), in the form Supabase Auth takes. */
export const BAN_FOREVER = "876000h";

/** What each choice does, in the owner's words. Shown on the confirm sheet on the website and in the app. */
export const REMOVE_WORDS = {
  remove: {
    title: "Remove access",
    short: "Can be undone",
    does: [
      "Signs them out on every phone and browser.",
      "Stops them signing in.",
      "Hides them from other students' lists, the wall and leaderboards.",
    ],
    keeps: ["Their records, marks and attendance.", "Their certificates, which still check as real."],
    after: "You can restore them later from the same place.",
  },
  delete: {
    title: "Delete account",
    short: "Permanent",
    does: [
      "Removes their sign-in for good.",
      "Removes their name, email, phone and personal details.",
      "Removes their private notes and journal.",
    ],
    keeps: [
      "Certificates already issued, so anyone can still check them.",
      "Attendance and learning totals, without their name.",
    ],
    after: "This cannot be undone.",
  },
  restore: {
    title: "Restore access",
    short: "Undo a removal",
    does: ["Lets them sign in again with their old email and password.", "Shows them in students' lists again."],
    keeps: [],
    after: "They will need to sign in again.",
  },
} as const;

/** One row of a deletion request from the app, as an admin sees it. */
export type DeletionRequestState = "open" | "done" | "declined";
