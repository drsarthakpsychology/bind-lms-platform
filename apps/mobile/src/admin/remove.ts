/**
 * Remove people from VIBHA: the server's answer shapes (copied from
 * src/lib/people/removal.ts and src/lib/people/removal-rules.ts), a tolerant
 * reader, the query and the four writes. The server checks every rule again.
 */
import { useQuery } from "@tanstack/react-query";

import { keys } from "@/api/queries";
import { api } from "@/auth";
import { arr, obj } from "./safe";

export type RemovalPerson = {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "view_admin" | "student" | "alumni";
  rollNumber: string | null;
  state: "active" | "locked" | "removed";
  note: string | null;
  removedAt: string | null;
  confirmWord: string;
  isYou: boolean;
};

export type RemovalRequest = {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  reason: string | null;
  status: "open" | "done" | "declined";
  createdAt: string;
  handledAt: string | null;
  accountGone: boolean;
  confirmWord: string;
};

export type RemovalData = { people: RemovalPerson[]; requests: RemovalRequest[]; requestsReady: boolean; activeSupers: number; canWrite: boolean };

/** The words on the sheet: the same as the website (REMOVE_WORDS in src/lib/people/removal-rules.ts). */
export const REMOVE_WORDS = {
  remove: {
    title: "Remove access",
    short: "Can be undone",
    does: ["Signs them out on every phone and browser.", "Stops them signing in.", "Hides them from other students' lists, the wall and leaderboards."],
    keeps: ["Their records, marks and attendance.", "Their certificates, which still check as real."],
    after: "You can restore them later from the same place.",
  },
  delete: {
    title: "Delete account",
    short: "Permanent",
    does: ["Removes their sign-in for good.", "Removes their name, email, phone and personal details.", "Removes their private notes and journal."],
    keeps: ["Certificates already issued, so anyone can still check them.", "Attendance and learning totals, without their name."],
    after: "This cannot be undone.",
  },
  restore: {
    title: "Restore access",
    short: "Undo a removal",
    does: ["Lets them sign in again with their old email and password.", "Shows them in students' lists again."],
    keeps: [] as string[],
    after: "They will need to sign in again.",
  },
} as const;

export const ROLE_LABEL: Record<RemovalPerson["role"], string> = { admin: "Super Admin", view_admin: "View Admin", student: "Student", alumni: "Alumni" };
export const STATE_LABEL: Record<RemovalPerson["state"], string> = { active: "Has access", locked: "Locked", removed: "Removed" };

const norm = (s: string) => s.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
/** The same check as the server: capitals and extra spaces do not matter, an empty word never matches. */
export const nameMatches = (typed: string, word: string) => norm(word).length > 0 && norm(typed) === norm(word);

const s = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const sn = (v: unknown) => (typeof v === "string" && v ? v : null);
const one = <V extends string>(v: unknown, list: readonly V[], d: V): V => (list.includes(v as V) ? (v as V) : d);

export function removalFrom(raw: unknown): RemovalData {
  const r = obj(raw);
  return {
    people: arr<unknown>(r.people).map((x) => {
      const p = obj(x);
      return {
        id: s(p.id),
        name: s(p.name) || s(p.email).split("@")[0] || "No name",
        email: sn(p.email),
        role: one(p.role, ["admin", "view_admin", "student", "alumni"] as const, "student"),
        rollNumber: sn(p.rollNumber),
        state: one(p.state, ["active", "locked", "removed"] as const, "active"),
        note: sn(p.note),
        removedAt: sn(p.removedAt),
        confirmWord: s(p.confirmWord),
        isYou: p.isYou === true,
      };
    }).filter((p) => p.id),
    requests: arr<unknown>(r.requests).map((x) => {
      const q = obj(x);
      return {
        id: s(q.id),
        userId: s(q.userId),
        name: s(q.name) || "No name",
        email: sn(q.email),
        reason: sn(q.reason),
        status: one(q.status, ["open", "done", "declined"] as const, "open"),
        createdAt: s(q.createdAt),
        handledAt: sn(q.handledAt),
        accountGone: q.accountGone === true,
        confirmWord: s(q.confirmWord),
      };
    }).filter((q) => q.id),
    requestsReady: r.requestsReady !== false,
    activeSupers: typeof r.activeSupers === "number" ? r.activeSupers : 0,
    canWrite: r.canWrite === true,
  };
}

const enc = encodeURIComponent;

export const useRemoval = () => useQuery({ queryKey: keys.admin("removal"), queryFn: async () => removalFrom(await api.get<unknown>("/admin/removal")) });

export const removalCalls = {
  remove: (id: string, note?: string) => api.post<{ removed: true }>(`/admin/removal/${enc(id)}/remove`, { note: note || undefined }),
  restore: (id: string) => api.post<{ restored: true }>(`/admin/removal/${enc(id)}/restore`, {}),
  delete: (id: string, confirmName: string, requestId?: string | null) => api.post<{ deleted: true }>(`/admin/removal/${enc(id)}/delete`, { confirmName, requestId: requestId ?? null }),
  decline: (requestId: string) => api.post<{ declined: true }>(`/admin/removal/requests/${enc(requestId)}/decline`, {}),
};
