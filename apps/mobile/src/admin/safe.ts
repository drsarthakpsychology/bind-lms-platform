/**
 * Admin accounts must never crash. Every admin answer goes through one of
 * these before a screen sees it: a missing list becomes [], a missing number
 * 0, a missing name a plain word. They also turn the server's shapes
 * (./contract.ts) into the shapes the screens were built on (./extra.ts),
 * so a screen never reads raw server JSON.
 */
import { queryOf } from "@/lib/query";
import { datesIn, todayLine } from "./format";
import type { DoubtList, DoubtRow, DoubtThread } from "@/api/contract";
import type * as A from "./contract";
import type * as X from "./extra";

/* ------------------------------------------------------------- plain reads */

type Raw = Record<string, unknown>;
export const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
export const arr = <T = unknown,>(v: unknown): T[] => (Array.isArray(v) ? (v.filter((x) => x !== null && x !== undefined) as T[]) : []);
/** A string, or the default when it is missing or empty. */
export const str = (v: unknown, d = ""): string => (typeof v === "string" && v.length ? v : typeof v === "number" ? String(v) : d);
export const strOr = (v: unknown): string | null => (typeof v === "string" && v.length ? v : null);
export const num = (v: unknown, d = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() && Number.isFinite(Number(v)) ? Number(v) : d);
export const numOr = (v: unknown): number | null => (v === null || v === undefined || v === "" ? null : Number.isFinite(Number(v)) ? Number(v) : null);
export const bool = (v: unknown, d = false): boolean => (typeof v === "boolean" ? v : d);
const oneOf = <T extends string>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);
const pct = (v: unknown) => Math.max(0, Math.min(100, Math.round(num(v))));

/* --------------------------------------------------------------- students */

const PRESENCE = ["now", "today", "week", "quiet", "never"] as const;
const FLAGS = ["login", "no-mobile", "quiet", "never-seen", "behind", "email-failing", "no-details"] as const;

export function safeRow(v: unknown): A.AdminStudentRow {
  const r = obj(v);
  const email = str(r.email);
  const cohorts = arr(r.cohorts).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name, "Cohort") })).filter((c) => c.id);
  const done = num(r.lecturesDone);
  const avail = num(r.lecturesAvailable);
  return {
    id: str(r.id),
    name: str(r.name) || email.split("@")[0] || "Student",
    email,
    rollNumber: strOr(r.rollNumber),
    mobileNumber: strOr(r.mobileNumber),
    scope: oneOf(r.scope, ["full", "lectures_only"] as const, "full") as A.AdminStudentRow["scope"],
    blocked: bool(r.blocked),
    expiresAt: strOr(r.expiresAt),
    account: str(r.account, bool(r.blocked) ? "locked" : "active"),
    presence: oneOf(r.presence, PRESENCE, "never"),
    lastSeen: strOr(r.lastSeen),
    cohorts,
    minutes7: num(r.minutes7),
    activeDays30: num(r.activeDays30),
    lecturesDone: done,
    lecturesAvailable: Math.max(avail, done),
    xp: num(r.xp),
    flags: arr(r.flags).filter((f): f is A.AttentionFlag => (FLAGS as readonly unknown[]).includes(f)),
    status: oneOf(r.status, ["active", "paused", "ended"] as const, bool(r.blocked) ? "paused" : "active"),
    progressPct: r.progressPct === undefined ? (avail ? Math.round((done / avail) * 100) : 0) : pct(r.progressPct),
    lecturesOnly: r.lecturesOnly === undefined ? r.scope === "lectures_only" : bool(r.lecturesOnly),
    cohort: strOr(r.cohort) ?? cohorts[0]?.name ?? null,
  };
}
const rows = (v: unknown) => arr(v).map(safeRow).filter((r) => r.id);

export function safeStudentList(v: unknown): A.AdminStudentList {
  const r = obj(v);
  const items = rows(r.items);
  return { items, nextCursor: strOr(r.nextCursor), total: num(r.total, items.length), cohorts: arr(r.cohorts).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name, "Cohort") })).filter((c) => c.id) };
}

export function safeStudent(v: unknown): A.AdminStudent {
  const r = obj(v);
  const row = safeRow(Object.keys(obj(r.row)).length ? { ...r, ...obj(r.row) } : r);
  const phone = obj(r.phone);
  const lectures = obj(r.lectures);
  return {
    ...row,
    row,
    phone: r.phone ? { name: str(phone.name, "A phone"), platform: str(phone.platform), changesUsed: num(phone.changesUsed), limit: num(phone.limit, 2), nextChangeAt: strOr(phone.nextChangeAt) } : null,
    lectures: { done: num(lectures.done, row.lecturesDone), total: num(lectures.total, row.lecturesAvailable) },
    detail: r.detail ? safeDetail(r.detail) : null,
    recent: arr(r.recent).map((x) => ({ at: str(obj(x).at), what: str(obj(x).what) })).filter((x) => x.what),
    canWrite: bool(r.canWrite, true),
  };
}

/** loadStudentDetail as the website returns it, every part optional. */
export function safeDetail(v: unknown): A.StudentDetail & Raw {
  const d = obj(v);
  const p = obj(d.profile);
  const learn = d.learn ? obj(d.learn) : null;
  const totals = obj(d.totals);
  return {
    ...d,
    profile: { id: str(p.id), name: strOr(p.name), email: strOr(p.email), status: str(p.status, "active"), created_at: str(p.created_at), mobile_number: strOr(p.mobile_number), display: str(p.display) },
    daily: arr(d.daily).map((x) => ({ day: str(obj(x).day), min: num(obj(x).min) })),
    lectures: arr(d.lectures).map((x) => {
      const l = obj(x);
      return { id: str(l.id), title: str(l.title, "Lecture"), week: numOr(l.week), watchedMin: num(l.watchedMin), done: bool(l.done), at: strOr(l.at) };
    }),
    recent: arr(d.recent).map((x) => ({ at: str(obj(x).at), what: str(obj(x).what), min: num(obj(x).min) })),
    learn: learn ? { xp: num(learn.xp), level: { title: str(obj(learn.level).title, "Starter") }, streak: num(learn.streak), best: num(learn.best), accuracy: numOr(learn.accuracy), answered: num(learn.answered), badges: num(learn.badges), mastery: num(learn.mastery), confusions: arr(learn.confusions).map((c) => str(c)).filter(Boolean), lessons: num(learn.lessons) } : null,
    sims: arr(d.sims).map((x) => ({ id: str(obj(x).id), status: str(obj(x).status), started_at: str(obj(x).started_at), ended_at: strOr(obj(x).ended_at) })),
    totals: { min30: num(totals.min30), activeDays: num(totals.activeDays) },
  };
}

/* ------------------------------------------------------------------- home */

export function safeLive(v: unknown): A.LiveRow[] {
  return arr(v)
    .map((x) => {
      const l = obj(x);
      return { userId: str(l.userId), name: str(l.name, "A student"), meta: str(l.meta), where: strOr(l.where), lessonId: strOr(l.lessonId), since: strOr(l.since), watching: bool(l.watching) };
    })
    .filter((l) => l.userId);
}

export function safeHomeCohorts(v: unknown): A.HomeCohort[] {
  return arr(v)
    .map((x) => {
      const c = obj(x);
      return { id: str(c.id), name: str(c.name, "Cohort"), members: num(c.members), week: num(c.week), behind: num(c.behind), pct: pct(c.pct) };
    })
    .filter((c) => c.id);
}

export function safeHome(v: unknown): A.AdminHomeData {
  const h = obj(v);
  const c = obj(h.counts);
  const t = obj(h.today);
  const needsLook = rows(h.needsLook);
  const todo = arr(h.todo)
    .map((x, i) => {
      const a = obj(x);
      const target = obj(a.target);
      return { id: str(a.id, String(i)), label: str(a.label), count: num(a.count), detail: str(a.detail), target: { screen: "unknown", web: str(target.web, "/admin") } as A.AdminTodo["target"], urgent: bool(a.urgent) };
    })
    .filter((a) => a.label && a.count > 0);
  return {
    v: 1,
    dateLine: str(h.dateLine) || todayLine(),
    todo,
    totalToDo: num(h.totalToDo, todo.reduce((n, a) => n + a.count, 0)),
    needsLook,
    attention: arr(h.attention).map((x) => {
      const a = obj(x);
      return { id: str(a.id), studentId: str(a.studentId), name: str(a.name, "Student"), reason: str(a.reason), since: strOr(a.since), flags: arr(a.flags).filter((f): f is A.AttentionFlag => (FLAGS as readonly unknown[]).includes(f)) };
    }),
    live: safeLive(h.live),
    cohorts: safeHomeCohorts(h.cohorts),
    counts: { students: num(c.students), activeThisWeek: num(c.activeThisWeek), onNow: num(c.onNow), neverIn: num(c.neverIn), needsLook: num(c.needsLook, needsLook.length), locked: num(c.locked), openComplaints: num(c.openComplaints), dbPct: num(c.dbPct) },
    today: { active: num(t.active), total: num(t.total), lecturesWatched: numOr(t.lecturesWatched), doubtsOpen: num(t.doubtsOpen), submissionsToGrade: num(t.submissionsToGrade) },
    canWrite: bool(h.canWrite, true),
  };
}

/**
 * Where a Home to-do leads. The server sends the website's address; the app
 * opens its own screen when it has one, and the website otherwise.
 */
export function todoHref(web: string): { app: string } | { web: string } {
  const [path = "", qs = ""] = web.split("?");
  const params = queryOf(qs);
  const q = { get: (k: string) => (params[k] ? encodeURIComponent(params[k]!) : null) };
  if (path === "/admin/inbox") return { app: "/admin/messages" };
  if (path === "/admin/emails" && q.get("folder") === "inbox") return { app: "/admin/messages" };
  if (path === "/admin/emails" && q.get("folder") === "failed") return { app: "/admin/failed-emails" };
  if (path === "/admin/wall-reports") return { app: "/admin/wall-reports" };
  if (path === "/admin/flags") return { app: "/admin/switches" };
  if (path === "/admin/learning") return { app: "/admin/teaching" };
  if (path === "/admin/people") return { app: `/admin/people${q.get("view") ? `?view=${q.get("view")}` : ""}` };
  if (path === "/admin/submissions") return { app: "/admin/review" };
  if (path === "/admin/activity") return { app: `/admin/activity${q.get("view") ? `?view=${q.get("view")}` : ""}` };
  if (path === "/admin/students/logins") return { app: "/admin/students?flag=login" };
  if (path === "/admin/students") return { app: "/admin/students" };
  if (path === "/admin/doubts") return { app: "/admin/doubts" };
  if (path.startsWith("/admin/credentials")) return { app: "/admin/certificates" };
  if (path === "/admin/forms") return { app: "/admin/forms" };
  return { web };
}

/* --------------------------------------------------------------- activity */

export function safeActivity(v: unknown): A.AdminActivity & { data: A.ActivityData } {
  const r = obj(v);
  const d = obj(r.data);
  const t = obj(d.totals);
  const live = safeLive(r.live ?? d.live);
  const actRows = arr(d.rows ?? r.rows).map((x) => {
    const a = obj(x);
    return { id: str(a.id), name: str(a.name) || str(a.email).split("@")[0] || "Student", email: str(a.email), status: str(a.status, "active"), min7: num(a.min7), min30: num(a.min30), activeDays30: num(a.activeDays30), lastSeen: strOr(a.lastSeen), lecturesDone: num(a.lecturesDone), lecturesStarted: num(a.lecturesStarted), watchMin: num(a.watchMin), xp: num(a.xp), level: str(a.level), streak: num(a.streak), accuracy: numOr(a.accuracy), mastery: num(a.mastery), practice: num(a.practice), score: num(a.score) };
  }).filter((a) => a.id);
  const heat = arr<unknown>(d.heat).map((day) => arr(day).map((m) => num(m)));
  return {
    v: 1,
    kind: "admin.activity",
    view: oneOf(r.view, ["live", "behind", "cohorts", "all"] as const, "all"),
    live,
    behind: rows(r.behind),
    cohorts: safeHomeCohorts(r.cohorts),
    rows: arr(r.rows),
    items: arr(r.items),
    data: {
      rows: actRows,
      heat: heat.length === 7 ? heat.map((h) => (h.length === 24 ? h : Array.from({ length: 24 }, (_, i) => h[i] ?? 0))) : [],
      pages: arr(d.pages).map((x) => ({ label: str(obj(x).label), min: num(obj(x).min) })).filter((x) => x.label),
      totals: { students: num(t.students, actRows.length), active7: num(t.active7), activeNow: num(t.activeNow, live.length), hours30: num(t.hours30), lecturesDone: num(t.lecturesDone) },
      live,
    },
  };
}

export function behindFrom(a: A.AdminActivity, cohort: string): X.BehindList {
  const items = a.behind
    .filter((r) => !cohort || r.cohorts.some((c) => c.id === cohort))
    .map((r) => ({ id: r.id, name: r.name, cohortId: r.cohorts[0]?.id ?? null, cohortName: r.cohorts[0]?.name ?? null, done: r.lecturesDone, available: r.lecturesAvailable, lastSeen: r.lastSeen, account: r.account }));
  const seen = new Map<string, string>();
  for (const c of a.cohorts) seen.set(c.id, c.name);
  for (const r of a.behind) for (const c of r.cohorts) seen.set(c.id, c.name);
  return { items, cohorts: [...seen].map(([id, name]) => ({ id, name })) };
}

/* --------------------------------------------------------------- messages */

export function safeMessages(v: unknown): A.AdminMessages {
  const r = obj(v);
  return {
    v: 1,
    ready: bool(r.ready, true),
    batches: arr(r.batches).map((x) => {
      const b = obj(x);
      return { batchId: str(b.batchId), title: str(b.title, "Message"), sentAt: str(b.sentAt), total: num(b.total), opened: num(b.opened), type: str(b.type) };
    }).filter((b) => b.batchId),
    items: arr(r.items),
    cohorts: arr(r.cohorts).map((x) => ({ id: str(obj(x).id), name: str(obj(x).name, "Cohort"), status: str(obj(x).status), members: num(obj(x).members) })).filter((c) => c.id),
    courses: arr(r.courses).map((x) => ({ id: str(obj(x).id), title: str(obj(x).title, "Course"), members: num(obj(x).members) })).filter((c) => c.id),
    students: num(r.students),
  };
}

/* ------------------------------------------------------------------ inbox */

/** The server's inbox (doubts waiting on a reply, then email replies) as one list. */
export function inboxFrom(v: unknown): X.InboxList & { emails: X.InboxThread[]; canWrite: boolean; ready: boolean } {
  const r = obj(v);
  const threads: X.InboxItem[] = arr(r.threads).map((x) => {
    const t = obj(x);
    const concern = t.kind === "complaint";
    const reason = str(t.reason);
    return {
      id: str(t.id),
      kind: (concern ? "concern" : "doubt") as X.InboxKind,
      from: str(t.author, "A student"),
      email: str(t.authorEmail),
      subject: str(t.title, concern ? "Private concern" : "Doubt"),
      preview: reason === "student-replied" ? "The student replied" : reason === "concern" ? "Private concern, waiting on you" : str(t.body).slice(0, 140),
      at: str(t.createdAt),
      unread: true,
      studentId: strOr(t.authorId),
      href: `/admin/doubt/${str(t.id)}`,
    };
  }).filter((t) => t.id);
  const emails: X.InboxThread[] = arr(r.emails).map((x) => {
    const e = obj(x);
    const from = str(e.fromName) || str(e.fromEmail) || "Someone";
    return { id: str(e.id), kind: "email" as const, subject: str(e.subject, "(no subject)"), from, email: str(e.fromEmail), phone: null, studentId: null, messages: [{ id: `${str(e.id)}-0`, from, mine: false, body: str(e.body), at: str(e.receivedAt) }] };
  }).filter((e) => e.id);
  const emailRows: X.InboxItem[] = emails.map((e) => ({ id: e.id, kind: "email" as const, from: e.from, email: e.email, subject: e.subject, preview: (e.messages[0]?.body ?? "").replace(/\s+/g, " ").slice(0, 140), at: e.messages[0]?.at ?? "", unread: true, studentId: null, href: `/admin/thread/${e.id}` }));
  const items = [...threads, ...emailRows];
  return { items, unread: items.length, emails, canWrite: bool(r.canWrite, true), ready: bool(r.ready, true) };
}

/* ----------------------------------------------------------------- doubts */

export function safeDoubtRow(v: unknown): DoubtRow {
  const d = obj(v);
  return { id: str(d.id), title: str(d.title, "Doubt"), topic: strOr(d.topic), kind: d.kind === "complaint" ? "complaint" : "doubt", status: oneOf(d.status, ["open", "solved", "hidden"] as const, "open"), cohortId: strOr(d.cohortId), author: str(d.author, "A student"), mine: bool(d.mine), replies: num(d.replies), lastReplyBy: d.lastReplyBy === "faculty" || d.lastReplyBy === "student" ? d.lastReplyBy : d.lastReplyBy === null ? null : undefined, createdAt: str(d.createdAt) };
}
export function safeDoubts(v: unknown): DoubtList {
  const r = obj(v);
  return { items: arr(r.items).map(safeDoubtRow).filter((d) => d.id), nextCursor: strOr(r.nextCursor), cohorts: arr(r.cohorts).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name) })), ready: bool(r.ready, true) };
}
export function safeDoubt(v: unknown): DoubtThread {
  const d = obj(v);
  const { replies: _r, lastReplyBy: _l, ...row } = safeDoubtRow(d);
  return {
    ...row,
    body: str(d.body),
    replies: arr(d.replies).map((x) => {
      const p = obj(x);
      return { id: str(p.id), author: str(p.author, "VIBHA team"), mine: bool(p.mine), body: str(p.body), votes: num(p.votes), youVoted: bool(p.youVoted), isSolution: bool(p.isSolution), createdAt: str(p.createdAt) };
    }).filter((p) => p.id),
  };
}

/* ------------------------------------------------------------ submissions */

/** The website marks hand-ins with a score out of 100 (or none). */
export const SCORE_MAX = 100;

export function submissionsFrom(v: unknown): X.SubmissionList {
  const r = obj(v);
  const items: X.Submission[] = arr(r.items).map((x) => {
    const s = obj(x);
    const status = str(s.status);
    const graded = status === "approved" || status === "returned" || status === "graded";
    const email = str(s.studentEmail);
    const files = arr(s.files).map((f) => ({ id: str(obj(f).id), name: str(obj(f).name, "File"), format: strOr(obj(f).format) })).filter((f) => f.id);
    return {
      id: str(s.id),
      studentId: str(s.studentId),
      studentName: str(s.studentName) || email.split("@")[0] || "Student",
      assignment: str(s.assignmentTitle ?? s.assignment, "Assignment"),
      course: str(s.courseTitle ?? s.course),
      submittedAt: str(s.submittedAt),
      status: (graded ? "graded" : "pending") as X.Submission["status"],
      reviewed: (status === "approved" ? "approved" : status === "returned" ? "returned" : null) as X.Submission["reviewed"],
      grade: numOr(s.score ?? s.grade),
      maxGrade: num(s.maxGrade, SCORE_MAX),
      feedback: strOr(s.feedback),
      answer: str(s.text ?? s.answer),
      file: files[0]?.name ?? strOr(s.file),
      files,
      hasAudio: bool(s.hasAudio),
      late: bool(s.late),
      lesson: strOr(s.lessonTitle),
    };
  }).filter((s) => s.id);
  return { items, pending: num(r.pending, items.filter((s) => s.status === "pending").length), canWrite: bool(r.canWrite, true) };
}

/* ----------------------------------------------------------- certificates */

const CERT_STATUSES = ["valid", "provisional", "expired", "revoked", "not_issued", "draft"] as const;
const KINDS = ["completion", "provisional", "recognition", "custom", "badge"] as const;

/** One row of GET /admin/certificates/issued (or the older mock list) as the screens show it. */
export function certFrom(v: unknown): X.CertRow {
  const c = obj(v);
  const type = c.type === "badge" || c.kind === "badge" ? "badge" : "certificate";
  const email = str(c.emailStatus);
  return {
    credentialId: str(c.credentialId),
    title: str(c.title, type === "badge" ? "Badge" : "Certificate"),
    kind: type === "badge" ? "badge" : oneOf(c.kind, KINDS, "custom"),
    replacedBy: strOr(c.replacedBy),
    recipient: str(c.name ?? c.recipient, "Someone"),
    recipientId: str(c.userId ?? c.recipientId),
    issuedAt: str(c.issuedAt),
    expiresAt: strOr(c.expiresAt),
    status: oneOf(c.status, CERT_STATUSES, "valid"),
    emailStatus: email === "sent" || email === "queued" || email === "failed" ? email : email === "pending" ? "queued" : "not_sent",
    revokedAt: strOr(c.revokedAt),
    revokeReason: strOr(c.revokeReason),
    statusLine: strOr(c.statusLine),
    typeLabel: strOr(c.typeLabel),
    verifyUrl: strOr(c.verifyUrl),
    canCorrect: bool(c.canCorrect, type !== "badge"),
    isDraft: bool(c.isDraft, c.status === "draft"),
    hasPdf: bool(c.hasPdf),
    email: strOr(c.email),
    roll: strOr(c.roll),
  };
}

export function certListFrom(v: unknown): X.CertificateList {
  const r = obj(v);
  const items = arr(r.items).map(certFrom).filter((c) => c.credentialId);
  const counts = obj(r.counts);
  return {
    items,
    ready: bool(r.ready, true),
    total: num(r.total, items.length),
    nextCursor: strOr(r.nextCursor),
    waiting: num(r.waiting),
    emailOn: bool(r.emailOn, true),
    canWrite: bool(r.canWrite, true),
    counts: { certificate: num(counts.certificate), badge: num(counts.badge, items.filter((x) => x.kind === "badge").length) },
    cohorts: arr(r.cohorts).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name, "Cohort") })).filter((c) => c.id),
  };
}

export function studioFrom(v: unknown): X.StudioOptions {
  const r = obj(v);
  const email = obj(r.email);
  return {
    signatories: arr(r.signatories ?? r.defaultSignatories).map((s) => ({ name: str(obj(s).name), role: str(obj(s).role), signatureFrom: strOr(obj(s).signatureFrom) })).filter((s) => s.name),
    signatures: signaturesFrom(r.signatures),
    emailReady: r.emailReady !== undefined ? bool(r.emailReady) : bool(email.configured, true),
    emailLeft: email.remaining === undefined ? null : num(email.remaining),
    ready: bool(r.ready, true),
    today: strOr(r.today),
    courses: arr(r.courses).map((c) => ({ id: str(obj(c).id), title: str(obj(c).title, "Course") })).filter((c) => c.id),
  };
}

export function issueResultFrom(v: unknown): X.IssueResult {
  const r = obj(v);
  if (typeof r.issued === "number") return { issued: num(r.issued), emailed: num(r.emailed), queued: num(r.queued), ids: arr(r.ids).map((x) => str(x)), skipped: num(r.skipped) };
  const issued = arr(r.issued).map((x) => obj(x));
  const d = obj(r.delivery);
  return { issued: issued.length, emailed: num(d.sent ?? d.emailed), queued: num(d.queued ?? d.waiting), ids: issued.map((x) => str(x.credentialId)).filter(Boolean), skipped: arr(r.skipped).length };
}

export function badgesFrom(v: unknown): X.BadgeList {
  const r = obj(v);
  return {
    items: arr(r.badges ?? r.items).map((x) => {
      const b = obj(x);
      return { id: str(b.id), title: str(b.title ?? b.name, "Badge"), about: str(b.description ?? b.about), enabled: bool(b.enabled, true), issued: num(b.issuedCount ?? b.issued), automatic: bool(b.automatic ?? b.auto) };
    }).filter((b) => b.id),
    canWrite: bool(r.canWrite, true),
    maxRecipients: num(r.maxRecipients, 200),
  };
}

/* ------------------------------------------------------------------ forms */

export function formsFrom(v: unknown): X.FormList {
  const r = obj(v);
  return {
    items: arr(r.forms ?? r.items).map((x) => {
      const f = obj(x);
      return { id: str(f.id), title: str(f.title, "Form"), responses: num(f.answers ?? f.responses), open: bool(f.open), updatedAt: str(f.lastAnswerAt ?? f.updatedAt), url: strOr(f.url) };
    }).filter((f) => f.id),
  };
}

export function formFrom(v: unknown, id: string): X.FormDetail {
  const r = obj(v);
  const form = obj(r.form ?? r);
  const allowance = obj(r.allowance);
  const list = arr(r.items ?? r.respondents).map((x) => {
    const a = obj(x);
    const mark = a.emailed && typeof a.emailed === "object" ? obj(a.emailed) : null;
    return {
      id: str(a.id),
      name: str(a.name) || str(a.email).split("@")[0] || "Someone",
      email: str(a.email),
      phone: strOr(a.phone),
      at: str(a.at),
      when: a.when ? datesIn(str(a.when)) : null,
      answers: arr(a.answers).map((q) => ({ q: str(obj(q).label ?? obj(q).q), a: str(obj(q).text ?? obj(q).a) })).filter((q) => q.q || q.a),
      emailed: mark ? num(mark.sent) > 0 || !!mark.lastSentAt : bool(a.emailed),
      emailWaiting: mark ? num(mark.waiting) : 0,
      studentId: strOr(a.studentId),
    };
  }).filter((a) => a.id);
  return {
    id: str(form.id, id),
    title: str(form.title, "Form"),
    responses: num(r.total, list.length),
    open: bool(form.open),
    updatedAt: str(form.updatedAt),
    url: strOr(form.url),
    questions: arr(r.questions).map((q) => str(q)),
    respondents: list,
    nextCursor: strOr(r.nextCursor),
    waiting: num(r.waiting),
    allowance: { configured: bool(allowance.configured, true), limit: num(allowance.limit, 100), left: num(allowance.left, 100) },
    mergeFields: arr(r.mergeFields).map((m) => ({ key: str(obj(m).key), label: str(obj(m).label) })).filter((m) => m.key),
    canWrite: bool(r.canWrite, true),
  };
}

/** The shared sender's report (forms and people email) as counts. */
export function emailReportFrom(v: unknown): X.BulkContactResult {
  const r = obj(v);
  if (typeof r.sent === "number") return { sent: num(r.sent), failed: num(r.failed), queued: num(r.queued), noEmail: num(r.noEmail) };
  return { sent: arr(r.sent).length, failed: arr(r.failed).length, queued: arr(r.queued).length, noEmail: arr(r.noEmail).length };
}

export function previewFrom(v: unknown): X.EmailPreview {
  const r = obj(v);
  return { to: str(r.to), subject: str(r.subject), text: str(r.text), unknownFields: arr(r.unknownFields).map((x) => str(x)).filter(Boolean) };
}

/* ----------------------------------------------------------------- people */

const STAGE_IDS = ["new", "contacted", "call_done", "fee_shared", "joined", "no_reply", "not_interested"] as const;

/** One person of GET /admin/people as the pipeline rows show it. */
export function personFrom(v: unknown): X.PersonRow {
  const p = obj(v);
  const email = str(p.email);
  const enquiry = p.isEnquiry === undefined ? !!p.enquiredAt : bool(p.isEnquiry);
  return {
    key: str(p.key, email),
    name: str(p.name) || email.split("@")[0] || "Someone",
    email,
    phone: strOr(p.phone),
    stage: oneOf(p.stage, STAGE_IDS, "new"),
    followUpAt: strOr(p.followUpAt),
    enquiredAt: strOr(p.enquiredAt) ?? (enquiry ? strOr(p.firstSeenAt) : null),
    source: strOr(p.source),
    isStudent: p.joined !== undefined ? bool(p.joined) : bool(p.isStudent),
    lastTouch: strOr(p.lastContactAt ?? p.lastTouch),
    invitedAt: strOr(p.inviteSentAt ?? p.invitedAt),
    paid: p.paidAt !== undefined ? !!p.paidAt : bool(p.paid),
    college: strOr(p.college),
    cohorts: arr(p.cohorts).map((c) => ({ id: str(obj(c).id), name: str(obj(c).name, "Cohort") })).filter((c) => c.id),
    message: strOr(p.message),
    whatsappUrl: strOr(p.whatsapp),
    paidAt: strOr(p.paidAt),
    paidAmount: numOr(p.paidAmount),
    studentId: strOr(p.studentId),
  };
}

export function peopleFrom(v: unknown): X.PeopleList {
  const r = obj(v);
  const counts = obj(r.counts);
  const allowance = obj(r.allowance);
  return {
    items: arr(r.items).map(personFrom).filter((p) => p.key),
    counts: Object.fromEntries(Object.entries(counts).filter(([, n]) => typeof n === "number")) as X.PeopleList["counts"],
    total: numOr(r.total) ?? undefined,
    paymentReady: bool(r.paymentReady, true),
    followUpsDue: num(r.followUpsDue),
    waiting: num(r.waiting),
    allowance: r.allowance ? { configured: bool(allowance.configured, true), limit: num(allowance.limit, 100), left: num(allowance.left, 100) } : undefined,
    mergeFields: arr(r.mergeFields).map((m) => ({ key: str(obj(m).key), label: str(obj(m).label) })).filter((m) => m.key),
    canWrite: bool(r.canWrite, true),
  };
}

/** A person's page when the server has no route for one: built from their row. */
export function personDetailFrom(p: X.PersonRow): X.PersonDetail {
  const timeline: X.PersonEvent[] = [];
  if (p.paidAt) timeline.push({ title: p.paidAmount ? `Paid ${p.paidAmount}` : "Paid", body: null, at: p.paidAt, tone: "ok" });
  if (p.lastTouch) timeline.push({ title: "Last contact", body: null, at: p.lastTouch, tone: "info" });
  if (p.invitedAt) timeline.push({ title: "Invitation sent", body: null, at: p.invitedAt, tone: "ok" });
  if (p.enquiredAt) timeline.push({ title: "Filled the enquiry form", body: p.message ?? null, at: p.enquiredAt, tone: "info" });
  timeline.sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0));
  return {
    ...p,
    studentId: p.studentId ?? null,
    facts: [
      ...(p.college ? [{ label: "College", value: p.college }] : []),
      { label: "Source", value: p.source ?? "Not known" },
      ...(p.cohorts?.length ? [{ label: "Cohort", value: p.cohorts.map((c) => c.name).join(", ") }] : []),
    ],
    timeline,
  };
}

export function enquiriesFrom(list: X.PeopleList): X.EnquiryList {
  return {
    items: list.items.map((p) => ({ id: `e-${p.key}`, personKey: p.key, name: p.name, email: p.email, phone: p.phone, message: p.message ?? "No message.", at: p.enquiredAt ?? p.lastTouch ?? "", answered: p.stage !== "new", source: p.source })),
  };
}

/* ----------------------------------------------------------------- system */

export function systemFrom(v: unknown): X.SystemData {
  const r = obj(v);
  return {
    ready: bool(r.ready, true),
    canWrite: bool(r.canWrite, true),
    legacyKeyOn: bool(r.legacyKeyOn),
    maxLive: num(r.maxLive, 10),
    keys: arr(r.keys).map((x) => {
      const k = obj(x);
      return { id: str(k.id), label: str(k.label, "Key"), last4: str(k.last4, "????"), createdAt: str(k.createdAt), createdByEmail: strOr(k.createdByEmail), revokedAt: strOr(k.revokedAt), revokedByEmail: strOr(k.revokedByEmail), lastUsedAt: strOr(k.lastUsedAt) };
    }).filter((k) => k.id),
    uses: arr(r.uses).map((x) => ({ email: str(obj(x).email), at: str(obj(x).at) })).filter((u) => u.at),
    usage: arr(r.usage).map((x) => ({ label: str(obj(x).label), value: str(obj(x).value), pct: numOr(obj(x).pct) })).filter((u) => u.label),
  };
}

export function newKeyFrom(v: unknown): X.NewSupportKey {
  const r = obj(v);
  return { plain: str(r.plain), last4: str(r.last4 ?? obj(r.key).last4) };
}

/* -------------------------------------------------------- round two reads */

const COHORT_STATES = ["upcoming", "active", "ended"] as const;

export function cohortRowFrom(v: unknown): X.CohortRow {
  const c = obj(v);
  return {
    id: str(c.id),
    name: str(c.name, "Cohort"),
    status: oneOf(c.status, COHORT_STATES, "active"),
    course: strOr(c.course),
    members: num(c.members),
    lectures: num(c.lectures),
    pct: pct(c.pct),
    activeWeek: num(c.activeWeek),
    behind: num(c.behind),
    never: num(c.never),
    starts: strOr(c.starts),
    ends: strOr(c.ends),
  };
}

export function cohortsFrom(v: unknown): X.CohortList {
  return { items: arr(obj(v).items).map(cohortRowFrom).filter((c) => c.id) };
}

export function cohortFrom(v: unknown, id: string): X.CohortDetail {
  const r = obj(v);
  const row = cohortRowFrom({ id, ...r });
  return {
    ...row,
    people: arr(r.people).map((x) => {
      const m = obj(x);
      return { id: str(m.id), name: str(m.name) || str(m.email).split("@")[0] || "Student", rollNumber: strOr(m.rollNumber), account: str(m.account, "active"), presence: oneOf(m.presence, PRESENCE, "never"), lastSeen: strOr(m.lastSeen), done: num(m.done), available: Math.max(num(m.available), num(m.done)) };
    }).filter((m) => m.id),
    messages: arr(r.messages).map((x) => {
      const b = obj(x);
      return { batchId: str(b.batchId), title: str(b.title, "Message"), sentAt: str(b.sentAt), total: num(b.total), opened: num(b.opened) };
    }).filter((b) => b.batchId),
    hoursWeek: num(r.hoursWeek),
    sessions: arr(r.sessions).map((x) => ({ title: str(obj(x).title), at: str(obj(x).at) })).filter((x) => x.title && x.at),
  };
}

const MSG_FROM = ["email", "reply", "bell"] as const;
export function studentMessagesFrom(v: unknown): { items: X.StudentMessage[] } {
  return {
    items: arr(obj(v).items).map((x) => {
      const m = obj(x);
      const opened = bool(m.opened);
      return { id: str(m.id), title: str(m.title, "Message"), at: str(m.at), opened, from: oneOf(m.from, MSG_FROM, "bell"), state: str(m.state, opened ? "Opened" : "Not opened"), failed: bool(m.failed) };
    }).filter((m) => m.id),
  };
}

export function signOffsFrom(v: unknown): X.SignOffList {
  const r = obj(v);
  return {
    canWrite: bool(r.canWrite, true),
    items: arr(r.items).map((x) => {
      const e = obj(x);
      const email = str(e.studentEmail);
      return { id: str(e.id), studentId: str(e.studentId), studentName: str(e.studentName) || email.split("@")[0] || "Student", studentEmail: email, activity: str(e.activity, "Supervision"), hours: num(e.hours), date: str(e.date), supervisor: strOr(e.supervisor), competency: strOr(e.competency), status: oneOf(e.status, ["requested", "signed", "rejected"] as const, "requested") };
    }).filter((e) => e.id),
  };
}

export function signaturesFrom(v: unknown): X.SignatureImage[] {
  return arr(v).map((x) => ({ id: str(obj(x).id), label: str(obj(x).label, "Signature"), url: strOr(obj(x).url) })).filter((x) => x.id);
}

export function studioSettingsFrom(v: unknown): X.StudioSettings {
  const r = obj(v);
  const e = obj(r.email);
  return {
    signatories: arr(r.signatories).map((x) => ({ name: str(obj(x).name), role: str(obj(x).role), signatureFrom: strOr(obj(x).signatureFrom) })).filter((x) => x.name).slice(0, 3),
    signatures: signaturesFrom(r.signatures),
    email: { configured: bool(e.configured), limit: num(e.limit, 100), sentToday: num(e.sentToday), waiting: num(e.waiting) },
    canWrite: bool(r.canWrite, true),
  };
}

const RULE_KINDS = ["module_complete", "sections_read", "xp", "watch_seconds", "course_complete", "module_tests_passed"] as const;

function ruleFrom(v: unknown): X.TypeRule | null {
  const r = obj(v);
  switch (r.kind) {
    case "module_complete":
      return { kind: "module_complete", module: str(r.module) };
    case "sections_read":
      return { kind: "sections_read", module: str(r.module), count: Math.max(1, num(r.count, 1)) };
    case "xp":
      return { kind: "xp", min: Math.max(1, num(r.min, 100)) };
    case "watch_seconds":
      return { kind: "watch_seconds", min: Math.max(60, num(r.min, 3600)) };
    case "course_complete":
      return { kind: "course_complete", course_id: str(r.course_id) };
    case "module_tests_passed":
      return { kind: "module_tests_passed" };
    default:
      return null;
  }
}

export function certTypesFrom(v: unknown): X.CertTypeList {
  const r = obj(v);
  const facets = (x: unknown) => arr(x).map((f) => ({ id: str(obj(f).id), title: str(obj(f).title) })).filter((f) => f.id);
  return {
    items: arr(r.items).map((x) => {
      const t = obj(x);
      return { id: str(t.id), type: t.type === "certificate" ? "certificate" : "badge", title: str(t.title, "Untitled"), description: strOr(t.description), tone: str(t.tone, "lime"), enabled: bool(t.enabled), issued: num(t.issued), ruleText: str(t.ruleText, "Given by hand"), rule: ruleFrom(t.rule), madeForYou: bool(t.madeForYou), hasSignature: bool(t.hasSignature), signatureLabel: strOr(t.signatureLabel) } satisfies X.CertType;
    }).filter((t) => t.id),
    rules: arr(r.rules).map((x) => ({ id: oneOf(obj(x).id, RULE_KINDS, "xp"), label: str(obj(x).label) })).filter((x) => x.label),
    tones: arr(r.tones).map((x) => str(x)).filter(Boolean),
    modules: facets(r.modules),
    courses: facets(r.courses),
    canWrite: bool(r.canWrite, true),
  };
}

export function pushPrefsFrom(v: unknown): X.AdminPushPrefs {
  const p = obj(v);
  return { newDoubt: p.newDoubt !== false, newEnquiry: p.newEnquiry !== false, fallingBehind: p.fallingBehind === true };
}

/** A person's own record (GET /admin/people/:key), the row plus facts and the whole history. */
export function personPageFrom(v: unknown): X.PersonDetail {
  const p = obj(v);
  const row = personFrom(p);
  const tones = ["ok", "info", "warn", "quiet"] as const;
  return {
    ...row,
    studentId: row.studentId ?? null,
    facts: arr(p.facts).map((f) => ({ label: str(obj(f).label), value: datesIn(str(obj(f).value)) })).filter((f) => f.label),
    timeline: arr(p.timeline).map((x) => {
      const t = obj(x);
      return { title: str(t.title), body: strOr(t.body), at: str(t.at), tone: oneOf(t.tone, tones, "info") };
    }).filter((t) => t.title && t.at),
  };
}

export function anyoneResultFrom(v: unknown): X.AnyoneResult {
  const r = obj(v);
  return { credentialId: str(r.credentialId), verifyUrl: str(r.verifyUrl), linkedStudent: strOr(r.linkedStudent), emailNote: strOr(r.emailNote) };
}

/** The certificate drawing (POST /admin/certificates/preview): only the operations the app knows how to draw. */
export type DrawOp =
  | { k: "rect"; x: number; y: number; w: number; h: number; fill: string | null; stroke: string | null; sw: number }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; sw: number }
  | { k: "path"; d: string; fill: string }
  | { k: "stroke"; d: string; stroke: string; sw: number }
  | { k: "image"; x: number; y: number; w: number; h: number; key: string };
export type Drawing = { width: number; height: number; ops: DrawOp[]; images: Record<string, string | null>; problems: string[] };

export function drawingFrom(v: unknown): Drawing {
  const r = obj(v);
  const ops: DrawOp[] = [];
  for (const x of arr(r.ops)) {
    const o = obj(x);
    if (o.k === "rect") ops.push({ k: "rect", x: num(o.x), y: num(o.y), w: num(o.w), h: num(o.h), fill: strOr(o.fill), stroke: strOr(o.stroke), sw: num(o.sw) });
    else if (o.k === "line") ops.push({ k: "line", x1: num(o.x1), y1: num(o.y1), x2: num(o.x2), y2: num(o.y2), stroke: str(o.stroke, "#000"), sw: num(o.sw, 1) });
    else if (o.k === "path" && typeof o.d === "string") ops.push({ k: "path", d: o.d, fill: str(o.fill, "#000") });
    else if (o.k === "stroke" && typeof o.d === "string") ops.push({ k: "stroke", d: o.d, stroke: str(o.stroke, "#000"), sw: num(o.sw, 1) });
    else if (o.k === "image") ops.push({ k: "image", x: num(o.x), y: num(o.y), w: num(o.w), h: num(o.h), key: str(o.key) });
  }
  const images = obj(r.images);
  return {
    width: num(r.width, 842),
    height: num(r.height, 595),
    ops,
    images: Object.fromEntries(Object.entries(images).map(([k, u]) => [k, strOr(u)])),
    problems: arr(r.problems).map((p) => str(p)).filter(Boolean),
  };
}
