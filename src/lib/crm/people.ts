import type { SupabaseClient } from "@supabase/supabase-js";

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

/** Everyone the programme has touched — enquiries and students — merged by email. */
export async function loadPeople(admin: SupabaseClient): Promise<Person[]> {
  const [{ data: enquiries }, { data: students }, { data: contacts }, { data: invites }, { data: sends }, { data: inbound }, { data: acts }] =
    await Promise.all([
      admin.from("enquiries").select("name, email, phone, source, created_at").order("created_at", { ascending: false }).limit(2000),
      admin.from("profiles").select("id, email, mobile_number, active_session_token, status, is_test").eq("role", "student").limit(2000),
      admin.from("crm_contacts").select("email, name, phone, stage, next_follow_up_at").limit(5000),
      admin.from("credential_invites").select("email, name, sent_at, setup_completed_at").limit(5000),
      admin.from("email_sends").select("recipient, sent_at, opened_at, status").eq("status", "sent").limit(20000),
      admin.from("email_inbound").select("from_email, received_at").limit(10000),
      admin.from("crm_activities").select("email, kind, created_at").limit(20000),
    ]);

  const map = new Map<string, Person>();
  const get = (raw: string | null | undefined): Person | null => {
    const email = (raw ?? "").trim().toLowerCase();
    if (!email) return null;
    let p = map.get(email);
    if (!p) {
      p = {
        key: personKey(email), email, name: email.split("@")[0], phone: null, isStudent: false, isEnquiry: false,
        stage: "new", followUpAt: null, enquiredAt: null, source: null, studentId: null, signedIn: false, locked: false,
        setupDone: false, inviteSentAt: null, emailsSent: 0, opened: false, replied: false, lastContactAt: null, contacted: false,
      };
      map.set(email, p);
    }
    return p;
  };

  for (const e of enquiries ?? []) {
    const p = get(e.email as string);
    if (!p) continue;
    p.isEnquiry = true;
    p.name = (e.name as string) || p.name;
    p.phone = (e.phone as string) || p.phone;
    p.source = (e.source as string) ?? p.source;
    p.enquiredAt = p.enquiredAt ?? (e.created_at as string);
  }
  for (const s of students ?? []) {
    if (s.is_test) continue;
    const p = get(s.email as string);
    if (!p) continue;
    p.isStudent = true;
    p.studentId = s.id as string;
    p.phone = p.phone ?? ((s.mobile_number as string) || null);
    p.signedIn = Boolean(s.active_session_token);
    p.locked = s.status === "blocked";
    p.stage = "joined";
  }
  for (const i of invites ?? []) {
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
  }
  for (const s of sends ?? []) {
    const p = map.get(String(s.recipient).toLowerCase());
    if (!p) continue;
    p.emailsSent++;
    p.opened = p.opened || Boolean(s.opened_at);
    p.lastContactAt = max(p.lastContactAt, (s.sent_at as string) ?? null);
  }
  for (const r of inbound ?? []) {
    const p = map.get(String(r.from_email).toLowerCase());
    if (p) p.replied = true;
  }
  for (const a of acts ?? []) {
    const p = map.get(String(a.email).toLowerCase());
    if (!p || a.kind === "stage" || a.kind === "note") continue;
    p.lastContactAt = max(p.lastContactAt, a.created_at as string);
  }
  for (const p of map.values()) p.contacted = p.emailsSent > 0 || p.lastContactAt !== null;

  return [...map.values()].sort((a, b) => (b.lastContactAt ?? b.enquiredAt ?? "").localeCompare(a.lastContactAt ?? a.enquiredAt ?? ""));
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
  for (const q of enquiries ?? []) items.push({ at: q.created_at as string, kind: "enquiry", title: `Enquired${q.source ? ` via ${q.source}` : ""}`, body: (q.message as string) ?? null, tone: "lime" });
  for (const s of sends ?? []) {
    const at = (s.sent_at as string) ?? (s.created_at as string);
    items.push({ at, kind: "email", title: s.status === "failed" ? `Email failed: ${s.subject}` : `Email sent: ${s.subject}`, body: (s.error_reason as string) ?? null, tone: s.status === "failed" ? "red" : "blue" });
    if (s.opened_at) items.push({ at: s.opened_at as string, kind: "opened", title: `Opened: ${s.subject}`, tone: "blue" });
    if (s.bounced_at) items.push({ at: s.bounced_at as string, kind: "bounced", title: `Bounced: ${s.subject}`, tone: "red" });
  }
  for (const r of inbound ?? []) items.push({ at: r.received_at as string, kind: "reply", title: `Replied: ${r.subject ?? "(no subject)"}`, body: (r.body_text as string)?.slice(0, 600) ?? null, tone: "lime" });
  const LABEL: Record<string, string> = { note: "Note", call: "Call", whatsapp: "WhatsApp", email: "Email (outside VIBHA)", meeting: "Meeting", stage: "Stage changed" };
  for (const a of acts ?? []) items.push({ at: a.created_at as string, kind: a.kind as string, title: LABEL[a.kind as string] ?? String(a.kind), body: (a.body as string) ?? null, tone: a.kind === "stage" ? "ink" : "lime" });
  if (invite?.setup_completed_at) items.push({ at: invite.setup_completed_at as string, kind: "setup", title: "Set up their account", tone: "ink" });
  return items.sort((a, b) => b.at.localeCompare(a.at));
}

/** Current time in ms (a plain function so render code stays lint-pure). */
export function nowMs(): number {
  return Date.now();
}
