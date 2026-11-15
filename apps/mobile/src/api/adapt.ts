import type * as C from "./contract";
import type * as X from "./extra";

/**
 * The admin screens were drawn against shapes that the live server never
 * sent (src/api/extra.ts). The real routes answer in the contract's shapes
 * (AdminHome, AdminStudentList, AdminStudentProfile, MessageBatches and a
 * PlayResult for activity). Reading `d.today.active` from the live
 * /admin/home answer threw a TypeError while rendering, and a render error
 * in a release build closes the app: that was the "app closes after an
 * admin signs in" bug.
 *
 * Each function here takes whatever came back (live shape, the mock's
 * shape, or something half-filled) and returns the shape the screen reads,
 * with every field present. They never throw.
 */

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback);
const strOrNull = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

/** "Sun, 15 Nov", India time. */
export function todayLine(now = Date.now()): string {
  try {
    return new Date(now).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  } catch {
    return "";
  }
}

const FLAG_WORDS: Record<string, string> = {
  login: "Cannot sign in",
  "no-mobile": "No WhatsApp number",
  quiet: "Quiet this week",
  "never-seen": "Never opened VIBHA",
  behind: "Behind on lectures",
  "email-failing": "Emails bounce",
  "no-details": "Details missing",
};

export function flagWords(flags: unknown): string {
  return arr(flags)
    .map((f) => FLAG_WORDS[str(f)] ?? str(f))
    .filter(Boolean)
    .join(" · ");
}

function statusOf(r: Obj): X.AdminStudentRow["status"] {
  if (r.status === "active" || r.status === "paused" || r.status === "ended") return r.status;
  if (r.blocked === true || r.account === "locked") return "paused";
  if (r.account === "expired") return "ended";
  return "active";
}

/** One student row, from the live AdminStudentRow or the mock's row. */
export function studentRowView(raw: unknown): X.AdminStudentRow {
  const r = obj(raw);
  const cohorts = arr(r.cohorts).map(obj);
  const done = num(r.lecturesDone);
  const avail = num(r.lecturesAvailable);
  return {
    id: str(r.id),
    name: str(r.name) || str(r.email) || "Student",
    rollNumber: strOrNull(r.rollNumber),
    cohort: typeof r.cohort === "string" ? r.cohort : cohorts.length ? str(cohorts[0]?.name) || null : null,
    status: statusOf(r),
    lastSeen: strOrNull(r.lastSeen),
    progressPct: typeof r.progressPct === "number" ? r.progressPct : avail > 0 ? Math.round((done / avail) * 100) : 0,
    lecturesOnly: r.lecturesOnly === true || r.scope === "lectures_only",
  };
}

/** GET /admin/home */
export function adminHomeView(raw: unknown): X.AdminHomeData {
  const d = obj(raw);
  const today = obj(d.today);
  const counts = obj(d.counts);
  const needsLook = arr(d.needsLook).map((x) => {
    const r = obj(x);
    const id = str(r.id);
    return {
      id,
      studentId: str(r.studentId) || id,
      name: str(r.name) || str(r.email) || "Student",
      reason: typeof r.reason === "string" ? r.reason : flagWords(r.flags),
      since: str(r.since) || str(r.lastSeen),
    };
  });
  return {
    dateLine: str(d.dateLine) || todayLine(),
    needsLook,
    today: {
      active: num(today.active, num(counts.activeThisWeek)),
      total: num(today.total, num(counts.students)),
      lecturesWatched: num(today.lecturesWatched),
      doubtsOpen: num(today.doubtsOpen, num(counts.openComplaints)),
      submissionsToGrade: num(today.submissionsToGrade),
    },
  };
}

/** GET /admin/students */
export function adminStudentsView(raw: unknown): X.AdminStudentList {
  return { items: arr(obj(raw).items).map(studentRowView) };
}

/** GET /admin/students/:id: live { row, detail } or the mock's flat student. */
export function adminStudentView(raw: unknown): X.AdminStudent {
  const d = obj(raw);
  const live = "row" in d || "detail" in d;
  const row = live ? obj(d.row) : d;
  const detail = obj(d.detail);
  const profile = obj(detail.profile);
  const base = studentRowView({ ...row, id: str(row.id) || str(profile.id), name: str(row.name) || str(profile.display) || str(profile.name) || str(profile.email) });
  const lecturesRaw = arr(detail.lectures).map(obj);
  const lectures = live
    ? { done: lecturesRaw.length ? lecturesRaw.filter((l) => l.done === true).length : num(row.lecturesDone), total: lecturesRaw.length || num(row.lecturesAvailable) }
    : { done: num(obj(d.lectures).done), total: num(obj(d.lectures).total) };
  const phone = obj(d.phone);
  const study = obj(d.study);
  return {
    ...base,
    email: strOrNull(row.email) ?? strOrNull(profile.email),
    mobile: strOrNull(row.mobile) ?? strOrNull(row.mobileNumber) ?? strOrNull(profile.mobile_number),
    phone: typeof phone.name === "string" ? { name: phone.name, changesUsed: num(phone.changesUsed), limit: num(phone.limit, 2) } : null,
    recent: arr(live ? detail.recent : d.recent)
      .map(obj)
      .map((r) => ({ at: str(r.at), what: str(r.what) }))
      .filter((r) => r.what),
    lectures,
    study: typeof study.total === "number" ? { done: num(study.done), total: study.total } : null,
  };
}

/** GET /admin/activity: live PlayResult { data: { rows } } (one row per student) or the mock's event list. */
export function adminActivityView(raw: unknown): X.AdminActivity {
  const d = obj(raw);
  if (Array.isArray(d.items)) {
    return {
      items: d.items.map(obj).map((x, i) => ({ id: str(x.id) || String(i), at: str(x.at), who: str(x.who), what: str(x.what), kind: (["lecture", "study", "doubt", "submission", "sign_in"].includes(str(x.kind)) ? x.kind : "study") as X.AdminActivityRow["kind"] })),
    };
  }
  const rows = arr(obj(d.data).rows).map(obj);
  return {
    items: rows
      .filter((r) => strOrNull(r.lastSeen))
      .sort((a, b) => str(b.lastSeen).localeCompare(str(a.lastSeen)))
      .map((r, i) => {
        const min7 = num(r.min7);
        const lectures = num(r.lecturesDone);
        const what = [min7 ? `${min7} min this week` : "Opened VIBHA", lectures ? `${lectures} lecture${lectures === 1 ? "" : "s"} done` : null].filter(Boolean).join(" · ");
        return { id: str(r.id) || String(i), at: str(r.lastSeen), who: str(r.name) || str(r.email) || "Student", what, kind: (lectures ? "lecture" : "study") as X.AdminActivityRow["kind"] };
      }),
  };
}

/** GET /admin/messages: live MessageBatches or the mock's thread list. */
export function adminMessagesView(raw: unknown): X.AdminMessages {
  const d = obj(raw);
  if (Array.isArray(d.items)) {
    return { items: d.items.map(obj).map((m, i) => ({ id: str(m.id) || String(i), to: str(m.to), title: str(m.title), preview: str(m.preview), at: str(m.at), unread: m.unread === true })) };
  }
  const batches = arr((d as Partial<C.MessageBatches>).batches).map(obj);
  return {
    items: batches.map((b, i) => ({
      id: str(b.batchId) || String(i),
      to: `${num(b.total)} student${num(b.total) === 1 ? "" : "s"}`,
      title: str(b.title),
      preview: `${num(b.opened)} opened`,
      at: str(b.sentAt),
      unread: false,
    })),
  };
}

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
