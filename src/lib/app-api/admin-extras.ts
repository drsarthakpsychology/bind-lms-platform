import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  filterIssued,
  countByType,
  issuedDay,
  issuedStatus,
  issuedStatusLine,
  ISSUED_STATUSES,
  ISSUED_STATUS_LABEL,
  matchesType,
  TYPE_FILTERS,
  TYPE_FILTER_LABEL,
  typeLabel,
  type IssuedRow,
} from "@/lib/certificates/issued";
import { loadIssued } from "@/lib/certificates/issued-load";
import { emailConfigured, siteBase } from "@/lib/certificates/server";
import { loadForm, loadForms, loadSubmissions } from "@/lib/forms/load";
import { answerColumns, answerText, identityKeys } from "@/lib/forms/fields";
import { istStamp } from "@/lib/forms/csv";
import { loadFormEmailed } from "@/lib/forms/emailed";
import { emailAllowance, type PersonalReport } from "@/lib/email/personal";
import { MERGE_FIELDS, PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { formUrl } from "@/app/(dashboard)/admin/forms/format";
import { emailFromKey, isStage, loadPipeline, STAGE_LABEL, STAGES, type Person } from "@/lib/crm/people";
import {
  filterPipeline,
  firstSeen,
  hasJoined,
  isQuickView,
  LAST_CONTACT_LABEL,
  lastContactBucket,
  QUICK_VIEWS,
  QUIET_DAYS,
  sourceOf,
  sourcesOf,
  viewCounts,
  waLink,
  type LastContact,
  type PipelineFilters,
  type QuickView,
} from "@/lib/crm/views";
import type { AdminPeople, AdminPerson, AdminFormAnswers, AdminForms, IssuedCertificate, IssuedCertificates, PersonalEmailReport } from "./contract-practise-admin";
import type { ApiErrorCode } from "./contract";
import { ApiFail } from "./respond";

/**
 * The app's admin Certificates (Issued) and Forms screens. Every read is the
 * website's own loader (loadIssued, loadForms, loadSubmissions,
 * loadFormEmailed, emailAllowance); this file only shapes the answer.
 */

/** A website action's error string as the app's error code. */
export function failFrom(error: string): never {
  const code: ApiErrorCode = /super admin|not authori[sz]ed|only the/i.test(error)
    ? "forbidden"
    : /not found|no longer exists|no such|no certificate file/i.test(error)
      ? "not_found"
      : /isn't set up|not set up|aren't set up/i.test(error)
        ? "unavailable"
        : "bad_request";
  throw new ApiFail(code, error);
}

export function issuedOut(r: IssuedRow, now: Date, base: string): IssuedCertificate {
  return {
    credentialId: r.credentialId,
    userId: r.userId,
    type: r.type,
    kind: r.kind,
    typeLabel: typeLabel(r),
    name: r.name ?? "",
    title: r.title ?? "",
    status: issuedStatus(r, now),
    statusLine: issuedStatusLine(r, now),
    recordStatus: r.status ?? "",
    issuedAt: r.issuedAt,
    issuedDay: issuedDay(r),
    expiresAt: r.expiresAt,
    revokedAt: r.revokedAt,
    revokeReason: r.revokeReason,
    email: r.email,
    roll: r.roll,
    emailStatus: r.emailStatus,
    cohortIds: r.cohortIds,
    canCorrect: r.studio,
    isDraft: r.type === "certificate" && (r.status === "draft" || r.status === "approved") && !r.revokedAt,
    hasPdf: r.hasPdf,
    verifyUrl: `${base}/verify/${r.credentialId}`,
  };
}

export async function issuedList(
  admin: SupabaseClient,
  q: { q: string | null; type: string | null; status: string | null; cohort: string | null; student: string | null },
  page: { limit: number; start: number },
  canWrite: boolean,
  now: Date = new Date(),
): Promise<IssuedCertificates> {
  const data = await loadIssued(admin);
  if (data.error) throw new ApiFail("unavailable", "Couldn't read what was issued.");
  const person = q.student ? (data.people.get(q.student) ?? null) : null;
  const base = { q: q.q, status: q.status, cohortId: q.cohort, userId: q.student ? (person?.id ?? q.student) : null };
  // Counts before the type filter (the chips), the list after it.
  const beforeType = filterIssued(data.rows, base, now);
  const all = beforeType.filter((r) => matchesType(r, q.type));
  const site = siteBase();
  return {
    v: 1,
    items: all.slice(page.start, page.start + page.limit).map((r) => issuedOut(r, now, site)),
    nextCursor: page.start + page.limit < all.length ? String(page.start + page.limit) : null,
    total: all.length,
    counts: countByType(beforeType),
    types: TYPE_FILTERS.map((id) => ({ id, label: TYPE_FILTER_LABEL[id] })),
    statuses: ISSUED_STATUSES.map((id) => ({ id, label: ISSUED_STATUS_LABEL[id] })),
    cohorts: data.cohorts,
    waiting: data.waiting,
    emailOn: emailConfigured(),
    canWrite,
    person,
  };
}

export async function formsList(admin: SupabaseClient, canWrite: boolean): Promise<AdminForms> {
  const forms = await loadForms(admin);
  return {
    v: 1,
    forms: forms.map((f) => ({ id: f.id, title: f.title, open: f.isActive, answers: f.responses, lastAnswerAt: f.lastResponseAt, url: formUrl(f.slug) })),
    total: forms.reduce((n, f) => n + f.responses, 0),
    open: forms.filter((f) => f.isActive).length,
    canWrite,
  };
}

export async function formAnswers(
  admin: SupabaseClient,
  formId: string,
  q: { q: string | null; emailed: string | null },
  page: { limit: number; start: number },
  canWrite: boolean,
): Promise<AdminFormAnswers> {
  const form = await loadForm(admin, formId);
  if (!form) throw new ApiFail("not_found");
  const [subs, emailed, allowance] = await Promise.all([loadSubmissions(admin, form.id), loadFormEmailed(admin, form.id), emailAllowance(admin)]);
  const hidden = new Set(identityKeys(form.fields));
  const columns = answerColumns(form.fields, subs.map((s) => s.responses)).filter((c) => !hidden.has(c.key));
  const search = (q.q ?? "").trim().toLowerCase();
  const rows = subs
    .map((s) => {
      const email = s.email ?? "";
      return {
        id: s.id,
        at: s.created_at,
        when: istStamp(s.created_at),
        name: s.name ?? "",
        email,
        phone: s.phone ?? "",
        answers: columns.map((c) => ({ key: c.key, label: c.label, text: answerText(s.responses?.[c.key]) })),
        emailed: emailed.marks[email.trim().toLowerCase()] ?? null,
      };
    })
    .filter((r) => {
      if (q.emailed === "yes" && !r.emailed?.sent) return false;
      if (q.emailed === "no" && r.emailed?.sent) return false;
      if (search && !`${r.name} ${r.email} ${r.phone} ${r.answers.map((a) => a.text).join(" ")}`.toLowerCase().includes(search)) return false;
      return true;
    });
  return {
    v: 1,
    form: { id: form.id, title: form.title, open: form.isActive, url: formUrl(form.slug) },
    items: rows.slice(page.start, page.start + page.limit),
    nextCursor: page.start + page.limit < rows.length ? String(page.start + page.limit) : null,
    total: rows.length,
    waiting: emailed.waiting,
    allowance,
    mergeFields: [...MERGE_FIELDS.map((m) => ({ key: m.key, label: m.label })), { key: "form", label: "Form name" }],
    limits: { ...PERSONAL_LIMITS },
    canWrite,
  };
}

export function reportOut(r: PersonalReport): PersonalEmailReport {
  return { sent: r.sent, queued: r.queued, failed: r.failed, noEmail: r.noEmail, duplicates: r.duplicates, remainingToday: r.remainingToday, queueFailed: r.queueFailed };
}

/** `?cursor=` as a start index. */
export const startOf = (cursor: string | null) => (cursor && /^\d{1,6}$/.test(cursor) ? Number(cursor) : 0);

/* People ---------------------------------------------------------------- */

const day = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);

export type PeopleQuery = { view: string | null; quiet: string | null; q: string | null; stage: string | null; cohort: string | null; source: string | null; from: string | null; to: string | null; last: string | null; enquiries: boolean };

export function personOut(p: Person, now: number): AdminPerson {
  return {
    key: p.key,
    name: p.name ?? "",
    email: p.email,
    phone: p.phone,
    college: p.college,
    stage: p.stage,
    stageLabel: STAGE_LABEL[p.stage] ?? p.stage,
    source: sourceOf(p),
    isStudent: p.isStudent,
    isEnquiry: p.isEnquiry,
    joined: hasJoined(p),
    studentId: p.studentId,
    cohorts: p.cohorts ?? [],
    firstSeenAt: firstSeen(p),
    lastContactAt: p.lastContactAt,
    lastContact: lastContactBucket(p, now),
    lastSeenAt: p.lastSeen,
    followUpAt: p.followUpAt,
    inviteSentAt: p.inviteSentAt,
    paidAt: p.paidAt,
    paidAmount: p.paidAmount,
    message: p.message,
    whatsapp: waLink(p.phone),
  };
}

export async function peopleList(admin: SupabaseClient, q: PeopleQuery, page: { limit: number; start: number }, canWrite: boolean, now: number = Date.now()): Promise<AdminPeople> {
  const [pipe, allowance, waitingRes] = await Promise.all([
    loadPipeline(admin),
    emailAllowance(admin),
    admin.from("email_sends").select("id", { count: "exact", head: true }).eq("status", "pending").eq("template_id", "pipeline"),
  ]);
  const everyone = q.enquiries ? pipe.people.filter((p) => p.isEnquiry) : pipe.people;
  const view: QuickView = isQuickView(q.view) ? q.view : "all";
  const quietN = Number(q.quiet);
  const quietDays = (QUIET_DAYS as readonly number[]).includes(quietN) ? quietN : 14;
  const filters: PipelineFilters = {
    view,
    quietDays,
    q: q.q ?? undefined,
    stage: q.stage && isStage(q.stage) ? q.stage : "",
    cohortId: q.cohort ?? undefined,
    source: q.source ?? undefined,
    from: day(q.from),
    to: day(q.to),
    lastContact: q.last && q.last in LAST_CONTACT_LABEL ? (q.last as LastContact) : "",
  };
  const rows = filterPipeline(everyone, filters, now);
  return {
    v: 1,
    items: rows.slice(page.start, page.start + page.limit).map((p) => personOut(p, now)),
    nextCursor: page.start + page.limit < rows.length ? String(page.start + page.limit) : null,
    total: rows.length,
    view,
    counts: viewCounts(everyone, filters, now),
    views: QUICK_VIEWS.map((v) => ({ id: v.id, label: v.label })),
    quietDays,
    quietChoices: [...QUIET_DAYS],
    stages: STAGES.map((s) => ({ id: s.id, label: s.label })),
    lastContactChoices: (Object.keys(LAST_CONTACT_LABEL) as Exclude<LastContact, "">[]).map((id) => ({ id, label: LAST_CONTACT_LABEL[id] })),
    cohorts: pipe.cohorts,
    sources: sourcesOf(everyone),
    paymentReady: pipe.paymentReady,
    followUpsDue: pipe.people.filter((p) => p.followUpAt && new Date(p.followUpAt).getTime() <= now + 86400000).length,
    waiting: waitingRes.error ? 0 : (waitingRes.count ?? 0),
    allowance,
    mergeFields: MERGE_FIELDS.map((m) => ({ key: m.key, label: m.label })),
    canWrite,
  };
}


/** The email behind a person `key`, or 404. */
export function emailOfKey(key: string): string {
  const email = key.length <= 400 ? emailFromKey(key) : null;
  if (!email) throw new ApiFail("not_found");
  return email;
}
