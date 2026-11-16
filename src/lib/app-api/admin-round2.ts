import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadCohort, loadCohortSummaries } from "@/lib/cohorts/admin-data";
import { cohortFigures } from "@/lib/cohorts/figures";
import { loadRoster, type RosterRow } from "@/lib/people/roster-data";
import { ACCOUNT_LABEL } from "@/lib/people/account-status";
import { loadStudentMessages } from "@/lib/people/student-messages";
import { loadSignOffRequests } from "@/lib/admin/signoffs";
import { loadCertificateSettings } from "@/lib/certificates/settings-load";
import { loadSupportState, MAX_LIVE_KEYS } from "@/lib/auth/support-state";
import { fmtBytes, pct as pctOf, SUPABASE_DB_LIMIT_BYTES } from "@/lib/infra/limits";
import { emailFromKey, loadPipeline, loadTimeline } from "@/lib/crm/people";
import { personFacts } from "@/lib/crm/person-facts";
import { REQUIREMENT_KINDS } from "@/lib/achievements/rules";
import { isEditableRule, isMadeForYou, RULE_LABEL, ruleText, TYPE_TONES } from "@/lib/achievements/type-words";
import type { AchievementRow } from "@/app/(dashboard)/admin/achievements/actions";
import type {
  AdminCertType,
  AdminCertTypes,
  AdminCohortDetail,
  AdminCohortMember,
  AdminCohortRow,
  AdminCohorts,
  AdminPersonDetail,
  AdminPersonEvent,
  AdminSystem,
  CertificateSettings,
  SignOffList,
  StudentMessage,
  StudentMessages,
  TypeRule,
} from "./contract-practise-admin";
import { personOut } from "./admin-extras";
import { ApiFail } from "./respond";

/**
 * The app's admin screens added in round two. Every read is the website's own
 * loader (the cohort pages, Certificates Settings and Types, Support keys,
 * the student's Messages tab, Sign-offs, the person page); this file only
 * shapes the answer.
 */

/* Cohorts ---------------------------------------------------------------- */

const STATUSES = ["upcoming", "active", "ended"] as const;
const status = (s: string | null | undefined): AdminCohortRow["status"] => ((STATUSES as readonly string[]).includes(s ?? "") ? (s as AdminCohortRow["status"]) : "upcoming");

function rowOf(
  c: { id: string; name: string; status: string | null; course_id: string | null; starts_on: string | null; ends_on: string | null; members: number; lectures: number; detailsDone: number },
  rows: (RosterRow | undefined)[],
  courseTitle: (id: string | null) => string | null,
): AdminCohortRow {
  const f = cohortFigures(rows);
  return {
    id: c.id,
    name: c.name,
    status: status(c.status),
    course: courseTitle(c.course_id),
    members: c.members,
    lectures: c.lectures,
    pct: f.pct,
    activeWeek: f.week,
    behind: f.behind,
    never: f.never,
    detailsPct: c.members ? Math.round((c.detailsDone / c.members) * 100) : 0,
    starts: c.starts_on,
    ends: c.ends_on,
  };
}

async function courseTitles(admin: SupabaseClient) {
  const { data } = await admin.from("courses").select("id, title");
  const by = new Map((data ?? []).map((c) => [String(c.id), String(c.title)]));
  return (id: string | null) => (id ? (by.get(id) ?? "A course") : null);
}

export async function cohortsList(admin: SupabaseClient, canWrite: boolean): Promise<AdminCohorts> {
  const [{ cohorts, unassigned, tablesMissing }, roster, title] = await Promise.all([loadCohortSummaries(), loadRoster(), courseTitles(admin)]);
  const inCohort = (id: string) => roster.rows.filter((r) => r.cohorts.some((c) => c.id === id));
  return { v: 1, ready: !tablesMissing, unassigned, canWrite, items: cohorts.map((c) => rowOf(c, inCohort(c.id), title)) };
}

const PRESENCE = ["now", "today", "week", "quiet", "never"] as const;

export async function cohortDetail(admin: SupabaseClient, id: string, canWrite: boolean): Promise<AdminCohortDetail> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiFail("not_found");
  const [data, roster, title] = await Promise.all([loadCohort(id), loadRoster(), courseTitles(admin)]);
  if (!data) throw new ApiFail("not_found");
  const { cohort, members, lessonIds } = data;
  const byId = new Map(roster.rows.map((r) => [r.id, r]));
  const rows = members.map((m) => byId.get(m.userId));
  const people: AdminCohortMember[] = members.map((m, i) => {
    const r = rows[i];
    return {
      id: m.userId,
      name: r?.name || m.name || m.email,
      email: m.email,
      rollNumber: r?.roll ?? null,
      account: r?.account ?? "not-invited",
      accountLabel: r ? ACCOUNT_LABEL[r.account] : ACCOUNT_LABEL["not-invited"],
      presence: r && (PRESENCE as readonly string[]).includes(r.presence) ? (r.presence as AdminCohortMember["presence"]) : "never",
      lastSeen: r?.lastSeen ?? null,
      done: r?.lecturesDone ?? 0,
      available: r?.lecturesAvailable ?? 0,
      minutes7: r?.min7 ?? 0,
      scope: m.scope === "lectures_only" ? "lectures_only" : "full",
      detailsDone: m.detailsDone,
    };
  });
  const row = rowOf({ ...cohort, members: members.length, lectures: lessonIds.size, detailsDone: members.filter((m) => m.detailsDone).length }, rows, title);
  return {
    v: 1,
    ...row,
    people,
    messages: await cohortMessages(admin, members.map((m) => m.userId)),
    hoursWeek: Math.round((people.reduce((a, p) => a + p.minutes7, 0) / 60) * 10) / 10,
    sessions: [],
    canWrite,
  };
}

/** Bell messages sent in batches that reached any of these people, newest first: how many of the cohort got it and opened it. */
async function cohortMessages(admin: SupabaseClient, ids: string[]): Promise<AdminCohortDetail["messages"]> {
  if (!ids.length) return [];
  const { data, error } = await admin
    .from("notifications")
    .select("batch_id, title, created_at, read_at, opened_at, user_id")
    .not("batch_id", "is", null)
    .in("user_id", ids)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return [];
  const by = new Map<string, AdminCohortDetail["messages"][number]>();
  for (const r of data ?? []) {
    const id = String(r.batch_id);
    const b = by.get(id) ?? { batchId: id, title: String(r.title ?? ""), sentAt: String(r.created_at), total: 0, opened: 0 };
    b.total++;
    if (r.opened_at || r.read_at) b.opened++;
    by.set(id, b);
  }
  return [...by.values()].slice(0, 30);
}

/* Student messages -------------------------------------------------------- */

export async function studentMessages(admin: SupabaseClient, id: string): Promise<StudentMessages> {
  const { data: p } = await admin.from("profiles").select("id, email").eq("id", id).maybeSingle();
  if (!p) throw new ApiFail("not_found");
  const m = await loadStudentMessages(admin, id, String(p.email ?? ""));
  const items: StudentMessage[] = [
    ...m.mails.map((x) => ({ id: `email:${x.id}`, from: "email" as const, title: x.subject, at: x.createdAt, opened: Boolean(x.openedAt), state: x.status === "failed" ? "Failed" : x.openedAt ? "Opened" : "Sent", failed: x.status === "failed" })),
    ...m.replies.map((x) => ({ id: `reply:${x.id}`, from: "reply" as const, title: x.subject, at: x.receivedAt, opened: true, state: "Reply", failed: false })),
    ...m.notes.map((x) => ({ id: `bell:${x.id}`, from: "bell" as const, title: x.title, at: x.createdAt, opened: Boolean(x.readAt), state: x.readAt ? "Opened" : "Not opened", failed: false })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  return { v: 1, items };
}

/* Sign-offs --------------------------------------------------------------- */

export async function signOffList(admin: SupabaseClient, canWrite: boolean): Promise<SignOffList> {
  const rows = await loadSignOffRequests(admin);
  return {
    v: 1,
    canWrite,
    items: rows.map((e) => ({
      id: e.id,
      studentId: e.userId,
      studentName: e.studentName?.trim() || e.studentEmail.split("@")[0] || "Student",
      studentEmail: e.studentEmail,
      activity: e.activity,
      hours: e.hours,
      date: e.date,
      supervisor: e.supervisorName,
      competency: e.competencyId,
      status: "requested",
    })),
  };
}

/* Certificate settings ---------------------------------------------------- */

export async function certificateSettings(admin: SupabaseClient, canWrite: boolean): Promise<CertificateSettings> {
  const s = await loadCertificateSettings(admin);
  return { v: 1, signatories: s.signatories, signatures: s.signatures, email: s.email, canWrite };
}

/* Types ------------------------------------------------------------------- */

export function typeOut(a: AchievementRow, modules: { id: string; title: string }[], courses: { id: string; title: string }[]): AdminCertType {
  return {
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    tone: a.tone,
    icon: a.icon,
    enabled: a.enabled,
    issued: a.issued_count,
    ruleText: ruleText(a, modules, courses),
    rule: isEditableRule(a) ? (a.requirements as TypeRule) : null,
    moduleId: a.module_id,
    courseId: a.course_id,
    madeForYou: isMadeForYou(a),
    signatureLabel: a.signature_label,
    hasSignature: Boolean(a.signature_asset_path),
  };
}

export function typesOut(rows: AchievementRow[], modules: { id: string; title: string }[], courses: { id: string; title: string }[], canWrite: boolean): AdminCertTypes {
  return {
    v: 1,
    items: rows.map((a) => typeOut(a, modules, courses)),
    rules: REQUIREMENT_KINDS.map((id) => ({ id, label: RULE_LABEL[id] })),
    tones: [...TYPE_TONES],
    modules,
    courses,
    canWrite,
  };
}

/* System ------------------------------------------------------------------ */

export async function systemData(admin: SupabaseClient, canWrite: boolean): Promise<AdminSystem> {
  const [state, metrics] = await Promise.all([loadSupportState(admin), Promise.resolve()
      .then(() => admin.rpc("infra_metrics"))
      .then((r) => (r.error ? null : r.data), () => null)]);
  const m = (metrics ?? {}) as { db_size_bytes?: number; ai_usage_7d?: { calls?: number }[] };
  const usage: AdminSystem["usage"] = [];
  if (typeof m.db_size_bytes === "number") usage.push({ label: "Database", value: `${fmtBytes(m.db_size_bytes)} of ${fmtBytes(SUPABASE_DB_LIMIT_BYTES)}`, pct: pctOf(m.db_size_bytes, SUPABASE_DB_LIMIT_BYTES) });
  if (Array.isArray(m.ai_usage_7d)) usage.push({ label: "AI calls, last 7 days", value: String(m.ai_usage_7d.reduce((a, u) => a + Number(u?.calls ?? 0), 0)), pct: null });
  return { v: 1, ready: state.ready, canWrite, legacyKeyOn: Boolean(state.legacy), maxLive: MAX_LIVE_KEYS, keys: state.keys.map((k) => ({ id: k.id, label: k.label, last4: k.last4, createdAt: k.createdAt, createdByEmail: k.createdByEmail ?? null, revokedAt: k.revokedAt ?? null, revokedByEmail: k.revokedByEmail ?? null, lastUsedAt: k.lastUsedAt ?? null })), uses: state.uses, usage };
}

/* A person's record -------------------------------------------------------- */

const TONE: Record<string, AdminPersonEvent["tone"]> = { blue: "info", red: "warn", ink: "quiet", lime: "ok" };

export async function personDetail(admin: SupabaseClient, key: string, canWrite: boolean, now: number = Date.now()): Promise<AdminPersonDetail> {
  const email = key.length <= 400 ? emailFromKey(key) : null;
  if (!email) throw new ApiFail("not_found");
  const [pipe, timeline] = await Promise.all([loadPipeline(admin), loadTimeline(admin, email)]);
  const p = pipe.people.find((x) => x.email === email.toLowerCase());
  if (!p) throw new ApiFail("not_found");
  return {
    v: 1,
    ...personOut(p, now),
    facts: personFacts(p, pipe.paymentReady),
    timeline: timeline.map((t) => ({ at: t.at, kind: t.kind, title: t.title, body: t.body ?? null, tone: TONE[t.tone ?? "lime"] ?? "ok" })),
    paymentReady: pipe.paymentReady,
    canWrite,
  };
}
