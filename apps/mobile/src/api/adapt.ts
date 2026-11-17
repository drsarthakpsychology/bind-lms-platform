import type * as C from "./contract";

/**
 * /me, read safely. The admin screens read their answers through
 * src/admin/safe.ts; this file keeps only the signed-in person's own record.
 * It never throws.
 */

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback);
const strOrNull = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

const CAN_KEYS = ["lectures", "study", "doubts", "practice", "games", "medicines", "leaderboard", "journey", "achievements", "notifications"] as const;

/**
 * /me (and the copy saved on the phone) with every field the app reads
 * present, so a missing `access`, `cohorts` or `watermark` never breaks a
 * screen. Admins see everything; others only what the server said.
 */
export function meView(raw: unknown): C.Me {
  const m = obj(raw);
  const role = (typeof m.role === "string" ? m.role : "student") as C.Me["role"];
  const staff = role === "admin" || role === "view_admin";
  const a = obj(m.access);
  const can = obj(a.can);
  const lecturesOnly = a.lecturesOnly === true || m.scope === "lectures_only";
  const name = strOrNull(m.name);
  const w = obj(m.watermark);
  return {
    ...(m as unknown as C.Me),
    id: str(m.id),
    email: strOrNull(m.email),
    name,
    role,
    scope: (typeof m.scope === "string" ? m.scope : "full") as C.Me["scope"],
    status: m.status === "blocked" ? "blocked" : "active",
    rollNumber: strOrNull(m.rollNumber),
    mobileNumber: strOrNull(m.mobileNumber),
    askMobileNumber: m.askMobileNumber === true,
    testMode: (() => {
      const t = obj(m.testMode);
      return t.as === "admin" || t.as === "student" ? { as: t.as } : null;
    })(),
    expiresAt: strOrNull(m.expiresAt),
    cohorts: arr(m.cohorts).map(obj).map((c) => ({ id: str(c.id), name: str(c.name) })),
    access: {
      ...(a as unknown as C.Access),
      tabs: (Array.isArray(a.tabs) ? a.tabs : staff ? ["home", "students", "activity", "messages", "more"] : lecturesOnly ? ["home", "lectures", "doubts", "me"] : ["home", "learn", "practise", "library", "me"]) as C.Access["tabs"],
      lecturesOnly,
      singleLessonId: strOrNull(a.singleLessonId),
      blocks: arr(a.blocks).map((b) => str(b)),
      flags: obj(a.flags) as C.Access["flags"],
      can: Object.fromEntries(CAN_KEYS.map((k) => [k, typeof can[k] === "boolean" ? can[k] : staff])) as C.Access["can"],
    },
    watermark: { name: str(w.name) || name || str(m.email) || "VIBHA", rollNumber: strOrNull(w.rollNumber), text: str(w.text) || name || str(m.email) || "VIBHA" },
    unreadNotifications: num(m.unreadNotifications),
  };
}
