/**
 * Browser build and tests only (EXPO_PUBLIC_API_MODE=mock): answers for the
 * admin routes connected on 22 Nov 2026 (src/admin/live.ts), in the server's
 * shapes. Release builds talk to the real server and never load this.
 */
import type { RawResponse } from "@/api/client";
import type * as A from "./contract";

type Ok = <T>(data: T, status?: number) => RawResponse;
type Fail = (status: number, code: "not_found" | "conflict" | "bad_request", message: string, details?: Record<string, unknown>) => RawResponse;

const MIN = 60_000;
const ago = (min: number) => new Date(Date.now() - min * MIN).toISOString();
const MODULES = [
  { id: "m01", title: "Foundations", sections: 6 },
  { id: "m02", title: "The mental state examination", sections: 8 },
  { id: "m03", title: "Common presentations", sections: 7 },
  { id: "m04", title: "Risk and safety", sections: 5 },
];

type LiveState = {
  admins: { id: string; email: string; name: string | null; role: "admin" | "view_admin"; blocked: boolean }[];
  failed: { id: string; to: string; name: string | null; studentId: string | null; subject: string; kind: string; why: string; retryNow: boolean; canResend: boolean; tries: number; at: string }[];
  flags: Record<string, "off" | "live" | "unlocked">;
  reports: { id: string; text: string; kind: "post" | "reply"; author: string | null; authorId: string | null; reason: string; at: string }[];
  blocks: Record<string, string[]>;
  scope: Record<string, "full" | "lectures_only">;
};

function fresh(): LiveState {
  return {
    admins: [
      { id: "me", email: "admin@example.com", name: "Owner", role: "admin", blocked: false },
      { id: "va1", email: "viewadmin@example.com", name: "Front desk", role: "view_admin", blocked: false },
    ],
    failed: [
      { id: "11111111-1111-4111-8111-111111111111", to: "isha@example.com", name: "Isha Kapoor", studentId: "u9", subject: "Your VIBHA login", kind: "Login email", why: "The address does not exist. Check the spelling with them.", retryNow: false, canResend: true, tries: 2, at: ago(60 * 5) },
      { id: "22222222-2222-4222-8222-222222222222", to: "arjun@example.com", name: "Arjun Nair", studentId: "u6", subject: "Lecture 6 opens on Monday", kind: "Notice", why: "Their inbox is full. Try again tomorrow.", retryNow: true, canResend: true, tries: 1, at: ago(60 * 26) },
    ],
    flags: { learn: "unlocked", lab: "unlocked", ethics: "unlocked", journal: "off", supervision: "off", osce: "off" },
    reports: [{ id: "33333333-3333-4333-8333-333333333333", text: "Does anyone have the answers for the checkpoint?", kind: "post", author: "Dev Malhotra", authorId: "u8", reason: "Asking for answers", at: ago(90) }],
    blocks: {},
    scope: {},
  };
}

let s = fresh();
export const liveMock = { reset: () => void (s = fresh()), state: () => s };

const SECTIONS = [
  { key: "notes", name: "Study", group: "Sections" },
  { key: "games", name: "Games", group: "Sections" },
  { key: "practice", name: "Practice (every tool)", group: "Sections" },
  { key: "medicines", name: "Medicines", group: "Sections" },
  { key: "doubts", name: "Doubts", group: "Sections" },
  { key: "wall", name: "Wall", group: "Sections" },
  { key: "tool:ethics", name: "Ethics, law and referral", group: "Practice tools" },
];

function learner(r: A.AdminStudentRow) {
  const n = Number(r.id.replace(/\D/g, "")) || 1;
  const modules = MODULES.map((m, i) => {
    const done = Math.max(0, Math.min(m.sections, Math.round((r.lecturesDone / Math.max(1, r.lecturesAvailable)) * m.sections) - i));
    return { id: m.id, title: m.title, sectionsDone: done, sections: m.sections, testPct: done >= m.sections / 2 ? 45 + ((n * 13 + i * 7) % 50) : null };
  });
  const tests = modules.filter((m) => m.testPct !== null).map((m) => m.testPct!);
  const weak = modules.filter((m) => m.testPct !== null && m.testPct < 60).map((m) => ({ label: m.title, why: `Test best ${m.testPct}%` }));
  const answered = r.xp ? Math.round(r.xp / 8) : 0;
  const sectionsDone = modules.reduce((a, m) => a + m.sectionsDone, 0);
  const lec = r.lecturesAvailable ? r.lecturesDone / r.lecturesAvailable : 0;
  return {
    row: {
      id: r.id, name: r.name, email: r.email, cohorts: r.cohorts, lecturesDone: r.lecturesDone, lecturesAvailable: r.lecturesAvailable,
      modulesDone: modules.filter((m) => m.sectionsDone >= m.sections).length, modulesTotal: modules.length, sectionsDone,
      testsTaken: tests.length, avgTestPct: tests.length ? Math.round(tests.reduce((a, b) => a + b, 0) / tests.length) : null,
      answered, rightPct: answered ? 55 + (n * 7) % 40 : null, weak: weak.map((w) => w.label), lastActive: r.lastSeen, minutes7: r.minutes7,
      behind: r.account === "active" && r.lecturesAvailable > 0 && r.lecturesDone * 2 < r.lecturesAvailable,
      progress: Math.round(((lec + sectionsDone / 26) / 2) * 100), account: r.account === "locked" ? "paused" : r.account,
    },
    modules,
    weak,
    xp: r.xp,
  };
}

export function liveRoute(is: (method: string, pattern: string) => string[] | null, body: Record<string, unknown>, students: A.AdminStudentRow[], ok: Ok, fail: Fail, empty: boolean): RawResponse | null {
  let m: string[] | null;
  const rows = empty ? [] : students;
  if (is("GET", "/admin/learning")) {
    const list = rows.map(learner);
    const cohorts = new Map(rows.flatMap((r) => r.cohorts).map((c) => [c.id, c]));
    return ok({
      v: 1,
      today: new Date().toISOString().slice(0, 10),
      students: list.map((l) => l.row),
      cohorts: [...cohorts.values()],
      class: {
        students: list.length,
        started: list.filter((l) => l.row.sectionsDone > 0).length,
        modules: MODULES.map((mod) => {
          const of = list.map((l) => l.modules.find((x) => x.id === mod.id)!);
          const t = of.filter((x) => x.testPct !== null);
          return { id: mod.id, title: mod.title, started: of.filter((x) => x.sectionsDone > 0).length, completed: of.filter((x) => x.sectionsDone >= x.sections).length, avgTestPct: t.length ? Math.round(t.reduce((a, x) => a + x.testPct!, 0) / t.length) : null, takers: t.length };
        }),
        hardest: list.length ? [{ id: "m02", title: "The mental state examination", avgTestPct: 54, takers: 6 }] : [],
        mixups: list.length ? [{ label: "Delusion or overvalued idea", times: 14, students: 5 }, { label: "Panic or generalised anxiety", times: 9, students: 4 }] : [],
      },
    });
  }
  if ((m = is("GET", "/admin/learning/:id"))) {
    const r = rows.find((x) => x.id === m![0]);
    return r ? ok({ v: 1, ...learner(r) }) : fail(404, "not_found", "That could not be found.");
  }
  if (is("GET", "/admin/admins")) return ok({ v: 1, me: "me", items: s.admins });
  if ((m = is("POST", "/admin/admins/:id/role"))) {
    const t = s.admins.find((a) => a.id === m![0]);
    const to = String(body.role);
    if (!t) return fail(404, "not_found", "That person is not an admin any more.");
    if (t.role === "admin" && to !== "admin" && s.admins.filter((a) => a.role === "admin").length <= 1) return fail(409, "conflict", "This is the only Super Admin. Make someone else a Super Admin first.");
    if (t.id === "me" && body.confirmSelf !== true) return fail(409, "conflict", "This changes your own rights. Confirm a second time to go ahead.", { needsConfirm: true });
    if (to === "admin" || to === "view_admin") t.role = to;
    else s.admins = s.admins.filter((a) => a.id !== t.id);
    return ok({ id: t.id, role: to });
  }
  if (is("GET", "/admin/emails/failed")) return ok({ v: 1, items: empty ? [] : s.failed, canWrite: true });
  if (is("POST", "/admin/emails/failed/clear") || is("POST", "/admin/emails/failed/retry")) {
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : null;
    const hit = s.failed.filter((f) => !ids || ids.includes(f.id));
    s.failed = s.failed.filter((f) => !hit.includes(f));
    return ok(is("POST", "/admin/emails/failed/clear") ? { cleared: hit.length } : { error: null, sent: hit.length, failed: 0, alreadyDelivered: 0 });
  }
  if (is("GET", "/admin/switches")) {
    const item = (key: string, name: string, about: string) => ({ key, name, about, state: s.flags[key] ?? "off" });
    return ok({ v: 1, groups: [
      { title: "Learning", items: [item("learn", "Notes and Games", "Lessons, Coach, games, notes and the quiz board."), item("lab", "Psychology Lab", "Experiments in Games.")] },
      { title: "Practice tools", items: [item("ethics", "Ethics, law and referral", "Dilemmas on law, consent and when to refer."), item("osce", "OSCE stations", "Timed practice stations.")] },
      { title: "Reflection and records", items: [item("journal", "Journal", "A private reflective journal."), item("supervision", "Supervision hours", "Students log supervised hours and you sign them off.")] },
    ] });
  }
  if ((m = is("POST", "/admin/switches/:key"))) {
    if (!(m[0]! in s.flags)) return fail(404, "not_found", "That could not be found.");
    s.flags[m[0]!] = body.state as "off" | "live" | "unlocked";
    return ok({ key: m[0], state: body.state });
  }
  if (is("GET", "/admin/wall-reports")) return ok({ v: 1, items: empty ? [] : s.reports });
  if ((m = is("POST", "/admin/wall-reports/:id/close"))) {
    s.reports = s.reports.filter((r) => r.id !== m![0]);
    return ok({ closed: true });
  }
  if (is("GET", "/admin/access")) return ok({ v: 1, sections: SECTIONS });
  if (is("POST", "/admin/access")) {
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : rows.filter((r) => r.cohorts.some((c) => c.id === body.cohortId)).map((r) => r.id);
    return ids.length ? ok({ students: ids.length }) : fail(400, "bad_request", "No students to change.");
  }
  const access = (id: string) => ({ v: 1, scope: s.scope[id] ?? rows.find((r) => r.id === id)?.scope ?? "full", ready: true, sections: SECTIONS.map((x) => ({ ...x, open: !(s.blocks[id] ?? []).includes(x.key) })) });
  if ((m = is("GET", "/admin/students/:id/access"))) return rows.some((r) => r.id === m![0]) ? ok(access(m[0]!)) : fail(404, "not_found", "That could not be found.");
  if ((m = is("POST", "/admin/students/:id/access"))) {
    const id = m[0]!;
    if (typeof body.scope === "string") s.scope[id] = body.scope as "full" | "lectures_only";
    if (typeof body.section === "string") {
      const off = new Set(s.blocks[id] ?? []);
      if (body.open) off.delete(body.section);
      else off.add(body.section);
      s.blocks[id] = [...off];
    }
    return ok(access(id));
  }
  if (is("POST", "/admin/students/add")) {
    const emails = Array.isArray(body.emails) ? (body.emails as string[]) : [];
    return ok({ rows: emails.map((email) => ({ email, outcome: students.some((r) => r.email === email) ? "added" : "created", mailed: body.sendEmail === true })), invalid: [] });
  }
  return null;
}
