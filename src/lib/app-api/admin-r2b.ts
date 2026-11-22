import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";
import { LEARNING_CATALOG } from "@/lib/insights/load";
import { computeLearningInsights } from "@/lib/insights/learning";
import { istToday } from "@/lib/learn/engine";
import { loadOpenFailures } from "@/lib/email/failed";
import { explainFailure } from "@/lib/email/pace";
import { FEATURES } from "@/lib/access/features";
import { readFlags } from "@/lib/flags";
import { PRACTICE_TOOLS } from "@/lib/practice/tools";
import { realRoster } from "./admin";
import { learnerRow, learnerStudy, type AdminRole, type LearnerModule, type LearnerRow, type LearnerWeak } from "./admin-r2b-rules";

/**
 * Admin phone screens added 22 Nov 2026, read from the website's own data:
 * the roster (loadRoster), every student's Learn state (learn_progress, as
 * /admin/learning reads it), failed sends (loadOpenFailures, as Mail > Failed
 * reads them), the feature switches, wall reports, and per-student section
 * switches (access_blocks). Callers gate on admin first.
 */

/* ------------------------------------------------------------ learning */

export type AdminLearning = {
  v: 1;
  today: string;
  students: LearnerRow[];
  cohorts: { id: string; name: string }[];
  /** The class as a whole: the website's Learning insights numbers. */
  class: {
    students: number;
    started: number;
    modules: { id: string; title: string; started: number; completed: number; avgTestPct: number | null; takers: number }[];
    hardest: { id: string; title: string; avgTestPct: number; takers: number }[];
    mixups: { label: string; times: number; students: number }[];
  };
};

async function learnRows(admin: SupabaseClient, ids?: string[]): Promise<Map<string, { state: unknown; updated_at: string | null }>> {
  let q = admin.from("learn_progress").select("user_id, state, updated_at");
  q = ids ? q.in("user_id", ids) : q.limit(5000);
  const { data } = await q;
  return new Map((data ?? []).map((r) => [String(r.user_id), { state: r.state, updated_at: (r.updated_at as string | null) ?? null }]));
}

export async function adminLearning(): Promise<AdminLearning> {
  const admin = createAdminClient();
  const [roster, learn] = await Promise.all([realRoster(), learnRows(admin)]);
  const students = roster;
  const rows = students.map((r) => learnerRow({ id: r.id, name: r.name, email: r.email, cohorts: r.cohorts, lecturesDone: r.lecturesDone, lecturesAvailable: r.lecturesAvailable, lastSeen: r.lastSeen, min7: r.min7, account: r.account }, learnerStudy(learn.get(r.id)?.state ?? null, LEARNING_CATALOG)));
  const today = istToday();
  const ins = computeLearningInsights(students.map((r) => ({ user_id: r.id, name: r.name, state: learn.get(r.id)?.state ?? null, updated_at: learn.get(r.id)?.updated_at ?? null })), LEARNING_CATALOG, today);
  const cohorts = new Map<string, string>();
  for (const r of students) for (const c of r.cohorts) cohorts.set(c.id, c.name);
  return {
    v: 1,
    today,
    students: rows,
    cohorts: [...cohorts].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
    class: {
      students: ins.students,
      started: ins.started,
      modules: ins.modules.map((m) => ({ id: m.id, title: m.title, started: m.started, completed: m.completed, avgTestPct: m.avgTestPct, takers: m.testTakers })),
      hardest: ins.struggles.map((m) => ({ id: m.id, title: m.title, avgTestPct: m.avgTestPct ?? 0, takers: m.testTakers })),
      mixups: ins.confusions.slice(0, 6).map((c) => ({ label: `${c.aLabel} or ${c.bLabel}`, times: c.times, students: c.students })),
    },
  };
}

export type AdminLearner = {
  v: 1;
  row: LearnerRow;
  modules: LearnerModule[];
  weak: LearnerWeak[];
  xp: number;
};

/** One student's full learning record, or null when they are not a student on the roster. */
export async function adminLearner(id: string): Promise<AdminLearner | null> {
  const admin = createAdminClient();
  const [roster, learn] = await Promise.all([realRoster(), learnRows(admin, [id])]);
  const r = roster.find((x) => x.id === id);
  if (!r) return null;
  const study = learnerStudy(learn.get(id)?.state ?? null, LEARNING_CATALOG);
  return { v: 1, row: learnerRow({ id: r.id, name: r.name, email: r.email, cohorts: r.cohorts, lecturesDone: r.lecturesDone, lecturesAvailable: r.lecturesAvailable, lastSeen: r.lastSeen, min7: r.min7, account: r.account }, study), modules: study.modules, weak: study.weak, xp: study.xp };
}

/* -------------------------------------------------------------- admins */

export type AdminPerson = { id: string; email: string; name: string | null; role: AdminRole; blocked: boolean };

export async function listAdminPeople(admin: SupabaseClient): Promise<AdminPerson[]> {
  const { data } = await admin.from("profiles").select("id, email, name, role, status").in("role", ["admin", "view_admin"]).order("email", { ascending: true });
  return (data ?? []).map((p) => ({ id: String(p.id), email: String(p.email ?? ""), name: (p.name as string | null) ?? null, role: p.role as AdminRole, blocked: p.status === "blocked" }));
}

/* ------------------------------------------------------- failed emails */

export type AdminFailedEmail = { id: string; to: string; name: string | null; studentId: string | null; subject: string; kind: string; why: string; retryNow: boolean; canResend: boolean; tries: number; at: string };

export async function failedEmails(admin: SupabaseClient): Promise<AdminFailedEmail[]> {
  type Row = { id: string; recipient: string; name: string | null; subject: string; template_id: string | null; error_reason: string | null; created_at: string; body_text: string | null };
  const open = await loadOpenFailures<Row & { status: string }>(admin, 300);
  if (!open.length) return [];
  const recips = [...new Set(open.map((f) => f.recipient))].slice(0, 500);
  const [{ data: hist }, { data: copies, error: noHtml }, { data: people }] = await Promise.all([
    admin.from("email_sends").select("recipient, subject").eq("status", "failed").in("recipient", recips).limit(10000),
    admin.from("email_sends").select("id, html").in("id", open.slice(0, 500).map((f) => f.id)),
    admin.from("profiles").select("id, email").in("email", recips),
  ]);
  const key = (r: string, s: string) => `${r.toLowerCase()}|${s}`;
  const tries = new Map<string, number>();
  for (const h of hist ?? []) tries.set(key(String(h.recipient), String(h.subject)), (tries.get(key(String(h.recipient), String(h.subject))) ?? 0) + 1);
  const hasHtml = new Set((noHtml ? [] : (copies ?? [])).filter((c) => c.html).map((c) => String(c.id)));
  const idOf = new Map((people ?? []).map((p) => [String(p.email ?? "").toLowerCase(), String(p.id)]));
  return open.map((f) => {
    const ex = explainFailure(f.error_reason);
    return {
      id: f.id,
      to: f.recipient,
      name: f.name ?? null,
      studentId: idOf.get(f.recipient.toLowerCase()) ?? null,
      subject: f.subject,
      kind: f.template_id === "credential" ? "Login email" : f.template_id === "nudge" ? "Reminder" : f.template_id === "notification" ? "Notice" : "Email",
      why: ex.words,
      retryNow: ex.retryNow,
      canResend: f.template_id === "credential" || Boolean(f.body_text) || hasHtml.has(f.id),
      tries: Math.max(1, tries.get(key(f.recipient, f.subject)) ?? 1),
      at: f.created_at,
    };
  });
}

/**
 * Clear failed emails from the list: they get `dismissed_at` and stay in the
 * send history. `ids` null clears every open one. Before the column exists
 * (2026_11_mail_clear.sql) it answers with the step to run, and changes nothing.
 */
export async function clearFailedEmails(admin: SupabaseClient, ids: string[] | null): Promise<{ cleared: number; error: string | null }> {
  const probe = await admin.from("email_sends").select("dismissed_at").limit(1);
  if (probe.error) return { cleared: 0, error: "Run the database step 2026_11_mail_clear.sql first, then try again." };
  let q = admin.from("email_sends").update({ dismissed_at: new Date().toISOString() }).eq("status", "failed").is("dismissed_at", null);
  if (ids) q = q.in("id", ids);
  const { data, error } = await q.select("id");
  return { cleared: data?.length ?? 0, error: error ? "Could not clear them. Try again." : null };
}

/* ---------------------------------------------------- feature switches */

/** Retired tools: merged elsewhere, not shown (as on the website's What's live page). */
const RETIRED = new Set(["modules", "rounds", "learning_profile", "personalised_patients", "decoder", "knowledge_tutor"]);
const LABELS: Record<string, string> = {
  case_library: "Case library", checkin: "Weekly check-in", consulting_room: "Consulting room", ethics: "Ethics, law and referral", formulation: "Formulation", journal: "Journal",
  learn: "Notes and Games", lab: "Psychology Lab", judgment: "Judgment", landmark: "Landmark cases", mse: "MSE practice", osce: "OSCE stations", peer_roleplay: "Role-play",
  skills_passport: "Skills passport", supervision: "Supervision hours", two_minute_clinic: "Two-minute clinic", weak_spots: "Weak spots", ui_v2: "New website look",
};
const ABOUT: Record<string, string> = {
  learn: "Lessons, Coach, games, notes and the quiz board.",
  lab: "Experiments in Games.",
  ethics: "Dilemmas on law, consent and when to refer.",
  journal: "A private reflective journal.",
  checkin: "A weekly anonymous wellbeing check-in. You see only class trends.",
  supervision: "Students log supervised hours and you sign them off.",
  skills_passport: "Skills with evidence, as a PDF.",
  weak_spots: "Where each student keeps slipping, from their answers.",
  ui_v2: "The new website look. Hidden: nobody. Shown: admins only. Open: everyone.",
};
const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Learning", keys: ["learn", "lab"] },
  { title: "Practice tools", keys: PRACTICE_TOOLS.map((t) => t.flag as string) },
  { title: "Reflection and records", keys: ["journal", "checkin", "supervision", "skills_passport", "weak_spots"] },
  { title: "Website", keys: ["ui_v2"] },
];

export type FlagState = "off" | "live" | "unlocked";
export type AdminSwitches = { v: 1; groups: { title: string; items: { key: string; name: string; about: string; state: FlagState }[] }[] };

export async function adminSwitches(admin: SupabaseClient): Promise<AdminSwitches> {
  const { data } = await admin.from("feature_flags").select("key, status, enabled").order("key");
  const rows = (data ?? []).filter((f) => !RETIRED.has(String(f.key)));
  const state = (f: { status?: unknown; enabled?: unknown }): FlagState => (f.status === "off" || f.status === "live" || f.status === "unlocked" ? f.status : f.enabled ? "unlocked" : "off");
  const desc = new Map(PRACTICE_TOOLS.map((t) => [t.flag as string, t.description]));
  const placed = new Set(GROUPS.flatMap((g) => g.keys));
  const groups = [...GROUPS, { title: "Other", keys: rows.map((f) => String(f.key)).filter((k) => !placed.has(k)) }];
  return {
    v: 1,
    groups: groups
      .map((g) => ({
        title: g.title,
        items: g.keys
          .map((k) => rows.find((f) => String(f.key) === k))
          .filter((f): f is NonNullable<typeof f> => Boolean(f))
          .map((f) => ({ key: String(f.key), name: LABELS[String(f.key)] ?? String(f.key), about: ABOUT[String(f.key)] ?? desc.get(String(f.key)) ?? "", state: state(f) })),
      }))
      .filter((g) => g.items.length),
  };
}

export const isFlagKey = async (admin: SupabaseClient, key: string) => {
  if (RETIRED.has(key)) return false;
  const { data } = await admin.from("feature_flags").select("key").eq("key", key).maybeSingle();
  return Boolean(data);
};

/* -------------------------------------------------------- wall reports */

export type AdminWallReport = { id: string; text: string; kind: "post" | "reply"; author: string | null; authorId: string | null; reason: string; at: string };

export async function wallReports(admin: SupabaseClient): Promise<AdminWallReport[]> {
  const { data: reports } = await admin.from("wall_reports").select("id, post_id, reply_id, reason, status, created_at").eq("status", "open").order("created_at", { ascending: true }).limit(100);
  const list = reports ?? [];
  const postIds = [...new Set(list.map((r) => r.post_id).filter(Boolean))] as string[];
  const replyIds = [...new Set(list.map((r) => r.reply_id).filter(Boolean))] as string[];
  const [{ data: posts }, { data: replies }] = await Promise.all([
    postIds.length ? admin.from("wall_posts").select("id, content, author_id, is_anonymous").in("id", postIds) : Promise.resolve({ data: [] as { id: string; content: string; author_id: string; is_anonymous: boolean }[] }),
    replyIds.length ? admin.from("wall_replies").select("id, content, author_id, is_anonymous").in("id", replyIds) : Promise.resolve({ data: [] as { id: string; content: string; author_id: string; is_anonymous: boolean }[] }),
  ]);
  const byPost = new Map((posts ?? []).map((p) => [String(p.id), p]));
  const byReply = new Map((replies ?? []).map((p) => [String(p.id), p]));
  const authorIds = [...new Set([...(posts ?? []), ...(replies ?? [])].map((p) => String(p.author_id ?? "")).filter(Boolean))];
  const { data: people } = authorIds.length ? await admin.from("profiles").select("id, name, email").in("id", authorIds) : { data: [] as { id: string; name: string | null; email: string | null }[] };
  const nameOf = new Map((people ?? []).map((p) => [String(p.id), (p.name as string | null) || (p.email as string | null) || null]));
  return list.map((r) => {
    const c = r.reply_id ? byReply.get(String(r.reply_id)) : byPost.get(String(r.post_id));
    const uid = c?.author_id && !c.is_anonymous ? String(c.author_id) : null;
    return {
      id: String(r.id),
      kind: r.reply_id ? "reply" : "post",
      text: c ? String(c.content ?? "") : r.reply_id ? "(the reply was deleted)" : "(the post was deleted)",
      author: uid ? (nameOf.get(uid) ?? null) : null,
      authorId: uid,
      reason: (r.reason as string | null) || "No reason given",
      at: String(r.created_at),
    };
  });
}

/* ------------------------------------------------- per-student sections */

export type AccessSection = { key: string; name: string; group: "Sections" | "Practice tools" };

/** The sections an admin can close for a student: every section, and the practice tools students can see now. */
export async function accessSections(): Promise<AccessSection[]> {
  const flags = await readFlags();
  return FEATURES.filter((f) => {
    if (f.key === "journal") return (flags.journal ?? "off") !== "off";
    if (f.key.startsWith("tool:")) return (flags[f.key.slice(5)] ?? "off") !== "off";
    return true;
  }).map((f) => ({ key: f.key, name: f.label, group: f.group }));
}

export type StudentAccess = { v: 1; scope: "full" | "lectures_only"; sections: (AccessSection & { open: boolean })[]; ready: boolean };

export async function studentAccess(admin: SupabaseClient, id: string): Promise<StudentAccess | null> {
  const [{ data: p }, blocks, sections] = await Promise.all([
    admin.from("profiles").select("id, role, scope").eq("id", id).maybeSingle(),
    admin.from("access_blocks").select("feature").eq("user_id", id),
    accessSections(),
  ]);
  if (!p || p.role !== "student") return null;
  const off = new Set((blocks.data ?? []).map((b) => String(b.feature)));
  return { v: 1, scope: p.scope === "lectures_only" ? "lectures_only" : "full", sections: sections.map((s) => ({ ...s, open: !off.has(s.key) })), ready: !blocks.error };
}
