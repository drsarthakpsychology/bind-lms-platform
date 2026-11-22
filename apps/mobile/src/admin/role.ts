/**
 * Who may do what, the same split as the website (requireAdmin and
 * requireSuperAdmin): an admin ("Super Admin") reads and acts; a view admin
 * reads only. Action buttons are hidden for view admins, and if one is ever
 * pressed anyway the app refuses before calling the server (which refuses
 * too, with 403).
 */
import type { Me } from "@/api/contract";
import { useSession } from "@/auth";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";

export type AdminRole = "super" | "view";

/** Every admin action that changes something. */
export type AdminAction =
  | "lock"
  | "unlock"
  | "login-link"
  | "allow-phone-change"
  | "message"
  | "reply"
  | "answer-doubt"
  | "hide-doubt"
  | "grade"
  | "sign-off"
  | "move-stage"
  | "issue-certificate"
  | "revoke-certificate"
  | "resend-certificate"
  | "reissue-certificate"
  | "studio-settings"
  | "note"
  | "invite"
  | "mark-paid"
  | "contact"
  | "email-form"
  | "send-waiting"
  | "award-badge"
  | "award-all"
  | "support-key"
  /** Schedule, attendance, leave and OPD (src/clinic). */
  | "clinic"
  /** Connected 22 Nov 2026 (src/admin/live.ts). */
  | "admin-rights"
  | "access"
  | "switch"
  | "mail"
  | "wall"
  | "add-student";

export function roleOf(me: Pick<Me, "role"> | null | undefined): AdminRole | null {
  if (me?.role === "admin") return "super";
  if (me?.role === "view_admin") return "view";
  return null;
}

/** Reading is open to both; every action needs the Super Admin. */
export function can(role: AdminRole | null, _action: AdminAction | "read" = "read"): boolean {
  if (_action === "read") return role !== null;
  return role === "super";
}

export const VIEW_ONLY_LINE = "You have view-only access. Ask a Super Admin to do this.";

export function useAdminRole(): { role: AdminRole | null; canWrite: boolean; viewOnly: boolean; roleLabel: string } {
  const me = useSession((s) => s.me);
  const role = roleOf(me);
  return { role, canWrite: can(role, "message"), viewOnly: role === "view", roleLabel: role === "super" ? "Super Admin" : role === "view" ? "View Admin" : "" };
}

/**
 * Runs an action only for a Super Admin. A view admin gets a short line and a
 * warning buzz instead, and the server is never called.
 */
export async function guarded<T>(role: AdminRole | null, action: AdminAction, run: () => Promise<T>): Promise<T | undefined> {
  if (!can(role, action)) {
    haptic.warn();
    toast.show(VIEW_ONLY_LINE);
    return undefined;
  }
  return run();
}
