import type { SupabaseClient } from "@supabase/supabase-js";
import { latest } from "@/lib/people/presence";
import { emailTotals, pageAll, progressTotals, visitTotals } from "@/lib/db/counts";
import { isHiddenAccount, isRobotEmail } from "@/lib/people/hidden";

/** Pipeline stages, in order. Students are "joined" and beyond. */
export const STAGES = [
  { id: "new", label: "New enquiry" },
  { id: "contacted", label: "Contacted" },
  { id: "call_done", label: "Call done" },
  { id: "fee_shared", label: "Fee shared" },
  { id: "joined", label: "Joined" },
  { id: "no_reply", label: "No reply" },
  { id: "not_interested", label: "Not interested" },
] as const;
export type StageId = (typeof STAGES)[number]["id"];
export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.id, s.label])) as Record<StageId, string>;
export function isStage(v: string): v is StageId {
  return STAGES.some((s) => s.id === v);
}

export type Person = {
  key: string;
  email: string;
  name: string;
  phone: string | null;
  isStudent: boolean;
  isEnquiry: boolean;
  stage: StageId;
  followUpAt: string | null;
  enquiredAt: string | null;
  source: string | null;
  /** Student account facts */
  studentId: string | null;
  signedIn: boolean;
  locked: boolean;
  setupDone: boolean;
  inviteSentAt: string | null;
  /** Contact facts */
  emailsSent: number;
  opened: boolean;
  replied: boolean;
  lastContactAt: string | null;
  contacted: boolean;
  /** Last moment on VIBHA (students): page time, lectures. */
  lastSeen: string | null;
  /** Marked paid (Pipeline, Mark paid). Null until then, or before the database step. */
  paidAt: string | null;
  paidAmount: number | null;
  /** Cohorts a student is in. */
  cohorts: Array<{ id: string; name: string }>;
  college: string | null;
  /** The latest enquiry message. */
  message: string | null;
};

export const personKey = (email: string) => Buffer.from(email.toLowerCase()).toString("base64url");
export const emailFromKey = (key: string) => {
  try {
    const e = Buffer.from(key, "base64url").toString("utf8");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
  } catch {
    return null;
  }
};

const max = (a: string | null, b: string | null) => (!a ? b : !b ? a : a > b ? a : b);

/** Everyone the programme has touched, enquiries and students, merged by email. */
export async function loadPeople(admin: SupabaseClient): Promise<Person[]> {
  return (await loadPipeline(admin)).people;
}

/** The contact rows, with the payment columns when the database step (2026_11_15_people_payment.sql) is in. */
async function loadContacts(admin: SupabaseClient): Promise<{ rows: Array<Record<string, unknown>>; paymentReady: boolean }> {
  const full = await pageAll<Record<string, unknown>>(() => admin.from("crm_contacts").select("email, name, phone, stage, next_follow_up_at, college, paid_at, paid_amount").order("email"));
  if (full) return { rows: full, paymentReady: true };
  const base = await pageAll<Record<string, unknown>>(() => admin.from("crm_contacts").select("email, name, phone, stage, next_follow_up_at, college").order("email"));
  return { rows: base ?? [], paymentReady: false };
}

/** The pipeline: everyone, plus whether "Mark paid" can be saved yet. */
export async function loadPipeline(admin: SupabaseClient): Promise<{ people: Person[]; paymentReady: boolean; cohorts: Array<{ id: string; name: string }> }> {
  const since = new Date(Date.now() - 14 * 86400000).toISOString();
  // Every row counts: pages of 1000, and totals added up in the database
  // (lib/db/counts). The old single reads stopped silently at 1000 rows.
  type Row = Record<string, unknown>;
  const all = (build: () => unknown) => pageAll<Row>(build as Parameters<typeof pageAll<Row>>[0]).then((r) => r ?? []);
  const [enquiries, students, contactsRes, invites, sendTotals, inbound, acts, visitByUser, progByUser, { data: cohortRows }, members] = await Promise.all([
    all(() => admin.from("enquiries").select("name, email, phone, source, message, created_at").order("created_at", { ascending: false }).order("id")),
    all(() => admin.from("profiles").select("id, email, mobile_number, active_session_token, status, is_test").eq("role", "student").order("id")),
    loadContacts(admin),
    all(() => admin.from("credential_invites").select("email, name, sent_at, setup_completed_at").order("email")),
    emailTotals(admin),
    all(() => admin.from("email_inbound").select("from_email, received_at").order("received_at")),
    all(() => admin.from("crm_activities").select("email, kind, created_at").order("created_at").order("id")),
    visitTotals(admin, since, since),
    progressTotals(admin),
    admin.from("cohorts").select("id, name").order("created_at", { ascending: true }),
    all(() => admin.from("cohort_members").select("cohort_id, user_id").order("cohort_id").order("user_id")),
  ]);
  const contacts = contactsRes.rows;
  const cohortName = new Map((cohortRows ?? []).map((c) => [String(c.id), String(c.name)]));
  const cohortsOf = new Map<string, Array<{ id: string; name: string }>>();
  for (const m of members) {
    const name = cohortName.get(String(m.cohort_id));
    if (!name) continue;
    const list = cohortsOf.get(String(m.user_id)) ?? [];
    list.push({ id: String(m.cohort_id), name });
    cohortsOf.set(String(m.user_id), list);
  }
  const seen = new Map<string, string>();
  const bump = (id: string, at: string | null) => {
    const best = latest(seen.get(id), at);
    if (best) seen.set(id, best);
  };
  for (const [id, v] of visitByUser) bump(id, v.lastVisit);
  // Last lecture save, only when it falls in the same window as the visits.
  for (const [id, x] of progByUser) if (x.lastUpdate && x.lastUpdate >= since) bump(id, x.lastUpdate);

  const map = new Map<string, Person>();
  const get = (raw: string | null | undefined): Person | null => {
    const email = (raw ?? "").trim().toLowerCase();
    if (!email) return null;
    let p = map.get(email);
    if (!p) {
      p = {
        key: personKey(email), email, name: email.split("@")[0], phone: null, isStudent: false, isEnquiry: false,
        stage: "new", followUpAt: null, enquiredAt: null, source: null, studentId: null, signedIn: false, locked: false,
        setupDone: false, inviteSentAt: null, emailsSent: 0, opened: false, replied: false, lastContactAt: null, contacted: false, lastSeen: null,
        paidAt: null, paidAmount: null, cohorts: [], college: null, message: null,
      };
      map.set(email, p);
    }
    return p;
  };

  for (const e of enquiries) {
    const p = get(e.email as string);
    if (!p) continue;
    p.isEnquiry = true;
    p.name = (e.name as string) || p.name;
    p.phone = (e.phone as string) || p.phone;
    p.source = (e.source as string) ?? p.source;
    p.enquiredAt = p.enquiredAt ?? (e.created_at as string);
    // Newest first, so the first message seen is the latest.
    p.message = p.message ?? ((e.message as string) || null);
  }
  for (const s of students) {
    if (isHiddenAccount(s)) continue;
    const p = get(s.email as string);
    if (!p) continue;
    p.isStudent = true;
    p.studentId = s.id as string;
    p.phone = p.phone ?? ((s.mobile_number as string) || null);
    p.signedIn = Boolean(s.active_session_token);
    p.locked = s.status === "blocked";
    p.stage = "joined";
    p.lastSeen = seen.get(s.id as string) ?? null;
    p.cohorts = cohortsOf.get(s.id as string) ?? [];
  }
  for (const i of invites) {
    const p = map.get(String(i.email).toLowerCase());
    if (!p) continue;
    if (i.name) p.name = i.name as string;
    p.inviteSentAt = (i.sent_at as string) ?? null;
    p.setupDone = Boolean(i.setup_completed_at);
  }
  for (const c of contacts ?? []) {
    const p = get(c.email as string);
    if (!p) continue;
    if (isStage(String(c.stage))) p.stage = c.stage as StageId;
    p.followUpAt = (c.next_follow_up_at as string) ?? null;
    if (c.name) p.name = c.name as string;
    if (c.phone) p.phone = c.phone as string;
    if (c.college) p.college = c.college as string;
    p.paidAt = (c.paid_at as string | null) ?? null;
    p.paidAmount = c.paid_amount == null ? null : Number(c.paid_amount);
  }
  for (const [recipient, t] of sendTotals) {
    const p = map.get(recipient);
    if (!p) continue;
    p.emailsSent += t.sent;
    p.opened = p.opened || t.opened;
    p.lastContactAt = max(p.lastContactAt, t.lastSent);
  }
  for (const r of inbound) {
    const p = map.get(String(r.from_email).toLowerCase());
    if (p) p.replied = true;
  }
  for (const a of acts) {
    const p = map.get(String(a.email).toLowerCase());
    if (!p || a.kind === "stage" || a.kind === "note" || a.kind === "payment") continue;
    p.lastContactAt = max(p.lastContactAt, a.created_at as string);
  }
  for (const p of map.values()) p.contacted = p.emailsSent > 0 || p.lastContactAt !== null;
  // Test and robot accounts never appear, even if they were once sent mail.
  const hiddenEmails = new Set(students.filter(isHiddenAccount).map((s) => String(s.email).toLowerCase()));
  for (const [email] of map) if (hiddenEmails.has(email) || isRobotEmail(email)) map.delete(email);

  const people = [...map.values()].sort((a, b) => (b.lastContactAt ?? b.enquiredAt ?? "").localeCompare(a.lastContactAt ?? a.enquiredAt ?? ""));
  return { people, paymentReady: contactsRes.paymentReady, cohorts: (cohortRows ?? []).map((c) => ({ id: String(c.id), name: String(c.name) })) };
}

export type TimelineItem = { at: string; kind: string; title: string; body?: string | null; tone?: "lime" | "blue" | "ink" | "red" };

/** One person's full history, newest first. */
export async function loadTimeline(admin: SupabaseClient, email: string): Promise<TimelineItem[]> {
  const e = email.toLowerCase();
  const [{ data: enquiries }, { data: sends }, { data: inbound }, { data: acts }, { data: invite }] = await Promise.all([
    admin.from("enquiries").select("message, source, created_at").ilike("email", e),
    admin.from("email_sends").select("subject, status, sent_at, created_at, delivered_at, opened_at, bounced_at, error_reason").ilike("recipient", e).limit(200),
    admin.from("email_inbound").select("subject, body_text, received_at").ilike("from_email", e).limit(200),
    admin.from("crm_activities").select("kind, body, created_at").ilike("email", e).order("created_at", { ascending: false }).limit(500),
    admin.from("credential_invites").select("setup_completed_at").ilike("email", e).maybeSingle(),
  ]);
  const items: TimelineItem[] = [];
  for (const q of enquiries) items.push({ at: q.created_at as string, kind: "enquiry", title: `Enquired${q.source ? ` via ${q.source}` : ""}`, body: (q.message as string) ?? null, tone: "lime" });
  for (const s of sends ?? []) {
    const at = (s.sent_at as string) ?? (s.created_at as string);
    items.push({ at, kind: "email", title: s.status === "failed" ? `Email failed: ${s.subject}` : `Email sent: ${s.subject}`, body: (s.error_reason as string) ?? null, tone: s.status === "failed" ? "red" : "blue" });
    if (s.opened_at) items.push({ at: s.opened_at as string, kind: "opened", title: `Opened: ${s.subject}`, tone: "blue" });
    if (s.bounced_at) items.push({ at: s.bounced_at as string, kind: "bounced", title: `Bounced: ${s.subject}`, tone: "red" });
  }
  for (const r of inbound) items.push({ at: r.received_at as string, kind: "reply", title: `Replied: ${r.subject ?? "(no subject)"}`, body: (r.body_text as string)?.slice(0, 600) ?? null, tone: "lime" });
  const LABEL: Record<string, string> = { payment: "Payment", note: "Note", call: "Call", whatsapp: "WhatsApp", email: "Email (outside VIBHA)", meeting: "Meeting", stage: "Stage changed" };
  for (const a of acts) items.push({ at: a.created_at as string, kind: a.kind as string, title: LABEL[a.kind as string] ?? String(a.kind), body: (a.body as string) ?? null, tone: a.kind === "stage" ? "ink" : "lime" });
  if (invite?.setup_completed_at) items.push({ at: invite.setup_completed_at as string, kind: "setup", title: "Set up their account", tone: "ink" });
  return items.sort((a, b) => b.at.localeCompare(a.at));
}

/** Current time in ms (a plain function so render code stays lint-pure). */
export function nowMs(): number {
  return Date.now();
}
