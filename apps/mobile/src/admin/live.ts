/**
 * The admin screens connected on 22 Nov 2026: every student's learning, the
 * admins list, failed emails, feature switches, wall reports, and student
 * access (one student or many). Each read goes to an admin-gated app route
 * on the website (src/app/api/app/v1/admin/*) that reuses the website's own
 * server code; every write is refused there for view-only admins too.
 * Answers are read defensively, so a missing field never breaks a screen.
 */
import { useQuery } from "@tanstack/react-query";

import { keys } from "@/api/queries";
import { api } from "@/auth";
import { arr, num, numOr, obj, str, strOr } from "./safe";

const k = keys.admin;
const enc = encodeURIComponent;
const get = (path: string) => api.get<unknown>(path);
const bool = (v: unknown) => v === true;

/* ------------------------------------------------------------ learning */

export type LearnerRow = {
  id: string;
  name: string;
  email: string;
  cohorts: { id: string; name: string }[];
  lecturesDone: number;
  lecturesAvailable: number;
  modulesDone: number;
  modulesTotal: number;
  sectionsDone: number;
  testsTaken: number;
  avgTestPct: number | null;
  answered: number;
  rightPct: number | null;
  weak: string[];
  lastActive: string | null;
  minutes7: number;
  behind: boolean;
  progress: number;
  account: string;
};
export type LearningClass = {
  students: number;
  started: number;
  modules: { id: string; title: string; started: number; completed: number; avgTestPct: number | null; takers: number }[];
  hardest: { id: string; title: string; avgTestPct: number; takers: number }[];
  mixups: { label: string; times: number; students: number }[];
};
export type Learning = { today: string; students: LearnerRow[]; cohorts: { id: string; name: string }[]; class: LearningClass };
export type LearnerModule = { id: string; title: string; sectionsDone: number; sections: number; testPct: number | null };
export type Learner = { row: LearnerRow; modules: LearnerModule[]; weak: { label: string; why: string }[]; xp: number };

const cohortsOf = (v: unknown) => arr(v).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name, "Cohort") })).filter((c) => c.id);

export function learnerRowFrom(v: unknown): LearnerRow {
  const r = obj(v);
  return {
    id: str(r.id),
    name: str(r.name, str(r.email, "Student")),
    email: str(r.email),
    cohorts: cohortsOf(r.cohorts),
    lecturesDone: num(r.lecturesDone),
    lecturesAvailable: num(r.lecturesAvailable),
    modulesDone: num(r.modulesDone),
    modulesTotal: num(r.modulesTotal),
    sectionsDone: num(r.sectionsDone),
    testsTaken: num(r.testsTaken),
    avgTestPct: numOr(r.avgTestPct),
    answered: num(r.answered),
    rightPct: numOr(r.rightPct),
    weak: arr(r.weak).map((w) => str(w)).filter(Boolean),
    lastActive: strOr(r.lastActive),
    minutes7: num(r.minutes7),
    behind: bool(r.behind),
    progress: Math.max(0, Math.min(100, num(r.progress))),
    account: str(r.account, "active"),
  };
}

export function learningFrom(v: unknown): Learning {
  const d = obj(v);
  const c = obj(d.class);
  return {
    today: str(d.today),
    students: arr(d.students).map(learnerRowFrom).filter((r) => r.id),
    cohorts: cohortsOf(d.cohorts),
    class: {
      students: num(c.students),
      started: num(c.started),
      modules: arr(c.modules).map((m) => {
        const x = obj(m);
        return { id: str(x.id), title: str(x.title, "Module"), started: num(x.started), completed: num(x.completed), avgTestPct: numOr(x.avgTestPct), takers: num(x.takers) };
      }),
      hardest: arr(c.hardest).map((m) => {
        const x = obj(m);
        return { id: str(x.id), title: str(x.title, "Module"), avgTestPct: num(x.avgTestPct), takers: num(x.takers) };
      }),
      mixups: arr(c.mixups).map((m) => {
        const x = obj(m);
        return { label: str(x.label), times: num(x.times), students: num(x.students) };
      }),
    },
  };
}

export function learnerFrom(v: unknown): Learner {
  const d = obj(v);
  return {
    row: learnerRowFrom(d.row),
    modules: arr(d.modules).map((m) => {
      const x = obj(m);
      return { id: str(x.id), title: str(x.title, "Module"), sectionsDone: num(x.sectionsDone), sections: num(x.sections), testPct: numOr(x.testPct) };
    }),
    weak: arr(d.weak).map((w) => ({ label: str(obj(w).label), why: str(obj(w).why) })).filter((w) => w.label),
    xp: num(d.xp),
  };
}

export type LearnSort = "behind" | "active" | "name";

/** The list as the Learning tab shows it: search by name or email, one cohort, then the chosen order. Pure, so it is tested. */
export function sortLearners(rows: LearnerRow[], o: { q?: string; cohort?: string; sort: LearnSort }): LearnerRow[] {
  const q = (o.q ?? "").trim().toLowerCase();
  const t = (x: string | null) => (x ? Date.parse(x) || 0 : 0);
  const out = rows.filter((r) => (!q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)) && (!o.cohort || r.cohorts.some((c) => c.id === o.cohort)));
  const byName = (a: LearnerRow, b: LearnerRow) => a.name.localeCompare(b.name);
  if (o.sort === "name") return out.sort(byName);
  if (o.sort === "active") return out.sort((a, b) => b.minutes7 - a.minutes7 || t(b.lastActive) - t(a.lastActive) || byName(a, b));
  return out.sort((a, b) => Number(b.behind) - Number(a.behind) || a.progress - b.progress || t(a.lastActive) - t(b.lastActive) || byName(a, b));
}

export const useLearning = () => useQuery({ queryKey: k("learning"), queryFn: async () => learningFrom(await get("/admin/learning")), staleTime: 60_000 });
export const useLearner = (id: string) => useQuery({ queryKey: k("learner", id), queryFn: async () => learnerFrom(await get(`/admin/learning/${enc(id)}`)), enabled: id.length > 0 });

/* -------------------------------------------------------------- admins */

export type AdminPerson = { id: string; email: string; name: string | null; role: "admin" | "view_admin"; blocked: boolean };
export type RoleTarget = "admin" | "view_admin" | "student" | "none";

export function adminsFrom(v: unknown): { me: string; items: AdminPerson[] } {
  const d = obj(v);
  return {
    me: str(d.me),
    items: arr(d.items)
      .map((p) => {
        const x = obj(p);
        return { id: str(x.id), email: str(x.email), name: strOr(x.name), role: x.role === "admin" ? ("admin" as const) : ("view_admin" as const), blocked: bool(x.blocked) };
      })
      .filter((p) => p.id),
  };
}

/** What each change does, in the words the confirm sheet uses. */
export const ROLE_CHANGE: Record<RoleTarget, { label: string; what: string }> = {
  admin: { label: "Make Super Admin", what: "They can see everything and change everything, including other admins." },
  view_admin: { label: "Make view-only", what: "They can see everything but cannot change anything." },
  student: { label: "Remove admin: back to student", what: "They lose the admin side and use VIBHA as a student. Their account and records stay." },
  none: { label: "Remove admin: no access", what: "They lose the admin side and cannot sign in at all. Their account and history stay, so this can be undone." },
};

export const useAdmins = (enabled = true) => useQuery({ queryKey: k("admins"), queryFn: async () => adminsFrom(await get("/admin/admins")), enabled });

/* ------------------------------------------------------- failed emails */

export type FailedEmail = { id: string; to: string; name: string | null; studentId: string | null; subject: string; kind: string; why: string; retryNow: boolean; canResend: boolean; tries: number; at: string };

export function failedFrom(v: unknown): { items: FailedEmail[]; canWrite: boolean } {
  const d = obj(v);
  return {
    canWrite: bool(d.canWrite),
    items: arr(d.items)
      .map((e) => {
        const x = obj(e);
        return { id: str(x.id), to: str(x.to), name: strOr(x.name), studentId: strOr(x.studentId), subject: str(x.subject, "(no subject)"), kind: str(x.kind, "Email"), why: str(x.why, "It could not be delivered."), retryNow: x.retryNow !== false, canResend: x.canResend !== false, tries: Math.max(1, num(x.tries, 1)), at: str(x.at) };
      })
      .filter((e) => e.id),
  };
}

export const useFailedEmails = () => useQuery({ queryKey: k("failed-emails"), queryFn: async () => failedFrom(await get("/admin/emails/failed")) });

/* ---------------------------------------------------- feature switches */

export type SwitchState = "off" | "live" | "unlocked";
export type Switch = { key: string; name: string; about: string; state: SwitchState };
export type SwitchGroup = { title: string; items: Switch[] };

export function switchesFrom(v: unknown): SwitchGroup[] {
  return arr(obj(v).groups)
    .map((g) => ({
      title: str(obj(g).title, "Features"),
      items: arr(obj(g).items)
        .map((i) => {
          const x = obj(i);
          const s = x.state === "live" || x.state === "unlocked" ? x.state : "off";
          return { key: str(x.key), name: str(x.name, str(x.key)), about: str(x.about), state: s as SwitchState };
        })
        .filter((i) => i.key),
    }))
    .filter((g) => g.items.length);
}

export const useSwitches = () => useQuery({ queryKey: k("switches"), queryFn: async () => switchesFrom(await get("/admin/switches")) });

/* -------------------------------------------------------- wall reports */

export type WallReport = { id: string; text: string; kind: "post" | "reply"; author: string | null; authorId: string | null; reason: string; at: string };

export function wallFrom(v: unknown): WallReport[] {
  return arr(obj(v).items)
    .map((r) => {
      const x = obj(r);
      return { id: str(x.id), text: str(x.text), kind: x.kind === "reply" ? ("reply" as const) : ("post" as const), author: strOr(x.author), authorId: strOr(x.authorId), reason: str(x.reason, "No reason given"), at: str(x.at) };
    })
    .filter((r) => r.id);
}

export const useWallReports = () => useQuery({ queryKey: k("wall-reports"), queryFn: async () => wallFrom(await get("/admin/wall-reports")) });

/* -------------------------------------------------------------- access */

export type Section = { key: string; name: string; group: string };
export type StudentAccess = { scope: "full" | "lectures_only"; sections: (Section & { open: boolean })[]; ready: boolean };

const sectionOf = (v: unknown): Section => ({ key: str(obj(v).key), name: str(obj(v).name, str(obj(v).key)), group: str(obj(v).group, "Sections") });

export function studentAccessFrom(v: unknown): StudentAccess {
  const d = obj(v);
  return { scope: d.scope === "lectures_only" ? "lectures_only" : "full", ready: d.ready !== false, sections: arr(d.sections).map((s) => ({ ...sectionOf(s), open: obj(s).open !== false })).filter((s) => s.key) };
}

export const useSections = () => useQuery({ queryKey: k("sections"), queryFn: async () => arr(obj(await get("/admin/access")).sections).map(sectionOf).filter((s) => s.key), staleTime: 5 * 60_000 });
export const useStudentAccess = (id: string) => useQuery({ queryKey: k("student-access", id), queryFn: async () => studentAccessFrom(await get(`/admin/students/${enc(id)}/access`)), enabled: id.length > 0 });

export type BulkAccessBody = { ids?: string[]; cohortId?: string; scope?: "full" | "lectures_only"; sections?: Record<string, boolean>; account?: "pause" | "resume" };
export type AddRow = { email: string; outcome: "created" | "added" | "already" | "failed"; mailed: boolean; reason?: string };

/* --------------------------------------------------------------- writes */

export const liveCalls = {
  setRole: (id: string, role: RoleTarget, confirmSelf = false) => api.post<{ id: string; role: RoleTarget }>(`/admin/admins/${enc(id)}/role`, { role, confirmSelf }),
  clearFailed: async (ids: string[] | null) => num(obj(await api.post<unknown>("/admin/emails/failed/clear", { ids })).cleared),
  retryFailed: async (ids: string[] | null) => obj(await api.post<unknown>("/admin/emails/failed/retry", { ids })),
  setSwitch: (key: string, state: SwitchState) => api.post<{ key: string; state: SwitchState }>(`/admin/switches/${enc(key)}`, { state }),
  closeWallReport: (id: string) => api.post<{ closed: true }>(`/admin/wall-reports/${enc(id)}/close`, {}),
  setSection: async (id: string, section: string, open: boolean) => studentAccessFrom(await api.post<unknown>(`/admin/students/${enc(id)}/access`, { section, open })),
  setScope: async (id: string, scope: "full" | "lectures_only") => studentAccessFrom(await api.post<unknown>(`/admin/students/${enc(id)}/access`, { scope })),
  bulkAccess: async (b: BulkAccessBody) => num(obj(await api.post<unknown>("/admin/access", b)).students),
  addStudents: async (b: { emails: string[]; cohortId: string; scope: "full" | "lectures_only"; sendEmail: boolean }) => {
    const r = obj(await api.post<unknown>("/admin/students/add", b));
    const outcome = (v: unknown): AddRow["outcome"] => (v === "created" || v === "added" || v === "already" ? v : "failed");
    return { rows: arr(r.rows).map((x): AddRow => ({ email: str(obj(x).email), outcome: outcome(obj(x).outcome), mailed: bool(obj(x).mailed), reason: strOr(obj(x).reason) ?? undefined })), invalid: arr(r.invalid).map((x) => str(x)) };
  },
};
