/**
 * The development and test stand-in for /admin/removal (the real routes are
 * src/app/api/app/v1/admin/removal/... on the website). Never reaches a
 * release build: only the mock transport calls it.
 */
import type { RawRequest, RawResponse } from "@/api/client";
import type { RemovalPerson, RemovalRequest } from "./remove";

type State = { people: RemovalPerson[]; requests: RemovalRequest[] };
const fresh = (): State => ({
  people: [
    { id: "me", name: "Owner", email: "admin@example.com", role: "admin", rollNumber: null, state: "active", note: null, removedAt: null, confirmWord: "Owner", isYou: true },
    { id: "s1", name: "Aanya Sharma", email: "aanya@example.com", role: "student", rollNumber: "VIBHA-000001", state: "active", note: null, removedAt: null, confirmWord: "Aanya Sharma", isYou: false },
    { id: "s2", name: "Rohan Mehta", email: "rohan@example.com", role: "student", rollNumber: "VIBHA-000002", state: "removed", note: "Left the course", removedAt: "2026-11-20T06:00:00Z", confirmWord: "Rohan Mehta", isYou: false },
    { id: "v1", name: "Kiran Rao", email: "kiran@example.com", role: "view_admin", rollNumber: null, state: "active", note: null, removedAt: null, confirmWord: "Kiran Rao", isYou: false },
  ],
  requests: [{ id: "r1", userId: "s1", name: "Aanya Sharma", email: "aanya@example.com", reason: "I finished and no longer need the account.", status: "open", createdAt: "2026-11-21T06:00:00Z", handledAt: null, accountGone: false, confirmWord: "Aanya Sharma" }],
});
let s = fresh();
export const removeMock = { reset: () => void (s = fresh()), state: () => s };

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });
const norm = (x: string) => x.replace(/\s+/g, " ").trim().toLowerCase();

export function removeRoute(req: RawRequest, role: "admin" | "view_admin"): RawResponse | null {
  const path = req.path.split("?")[0]!;
  if (!path.startsWith("/admin/removal")) return null;
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (req.method === "GET" && path === "/admin/removal") return ok({ people: s.people, requests: s.requests, requestsReady: true, activeSupers: 1, canWrite: role === "admin" });
  if (role !== "admin") return fail(403, "forbidden", "Only a Super Admin can do this.");
  const dec = path.match(/^\/admin\/removal\/requests\/([^/]+)\/decline$/);
  if (dec) {
    const r = s.requests.find((x) => x.id === dec[1]);
    if (!r) return fail(404, "not_found", "That request could not be found.");
    if (r.status !== "open") return fail(409, "conflict", "That request was already handled.");
    r.status = "declined";
    r.handledAt = new Date().toISOString();
    return ok({ declined: true });
  }
  const m = path.match(/^\/admin\/removal\/([^/]+)\/(remove|restore|delete)$/);
  if (!m) return null;
  const p = s.people.find((x) => x.id === m[1]);
  if (!p) return fail(404, "not_found", "That person could not be found.");
  if (p.isYou) return fail(409, "conflict", "You cannot remove your own account. Ask another Super Admin.");
  if (m[2] === "remove") {
    if (p.state === "removed") return fail(409, "conflict", "This person is already removed.");
    p.state = "removed";
    p.note = typeof body.note === "string" ? body.note : null;
    p.removedAt = new Date().toISOString();
    return ok({ removed: true });
  }
  if (m[2] === "restore") {
    if (p.state !== "removed") return fail(409, "conflict", "This person still has access. There is nothing to restore.");
    p.state = "active";
    p.note = null;
    return ok({ restored: true });
  }
  if (norm(String(body.confirmName ?? "")) !== norm(p.confirmWord)) return fail(409, "conflict", "The name you typed does not match. Type it exactly as shown.");
  s.people = s.people.filter((x) => x !== p);
  for (const r of s.requests) if (r.userId === p.id) Object.assign(r, { status: "done", handledAt: new Date().toISOString(), accountGone: true, name: "Deleted account", email: null });
  return ok({ deleted: true });
}
