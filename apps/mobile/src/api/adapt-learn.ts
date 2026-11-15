import type * as C from "./contract";

/**
 * Learn, Lectures and Me answers, read safely. Each function takes whatever
 * the server sent (the contract's shape, an older server's shape, or
 * something half-filled with nulls) and returns the shape the screens read,
 * with every list an array and every field present. They never throw, so a
 * null in an answer can never break a screen while it draws.
 */

type Obj = Record<string, unknown>;
export const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
export const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback);
export const strOrNull = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
export const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
export const numOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const bool = (v: unknown): boolean => v === true;
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback);
const strs = (v: unknown): string[] => arr(v).map((x) => str(x)).filter(Boolean);

/** A link the server sent, or the screen it most likely meant. */
export function target(v: unknown, fallback: C.AppTarget = { screen: "home", web: "/dashboard" } as C.AppTarget): C.AppTarget {
  const t = obj(v);
  return typeof t.screen === "string" ? (t as unknown as C.AppTarget) : fallback;
}

/* ----------------------------------------------------------- Lectures */

function courseNext(v: unknown): C.CourseSummary["next"] {
  const n = obj(v);
  if (!n.title) return null;
  return { title: str(n.title), week: num(n.week, 1), kind: n.kind === "assignment" ? "assignment" : "lesson", number: numOrNull(n.number), midway: bool(n.midway), target: target(n.target, { screen: "courses", web: "/courses" } as C.AppTarget) };
}

export function courseSummaryView(raw: unknown): C.CourseSummary {
  const c = obj(raw);
  return { id: str(c.id), title: str(c.title) || "Course", completedCount: num(c.completedCount), totalLessons: num(c.totalLessons), started: bool(c.started), next: courseNext(c.next) };
}

export function courseListView(raw: unknown): C.CourseList {
  return { courses: arr(obj(raw).courses).map(courseSummaryView).filter((c) => c.id) };
}

const LESSON_STATES = ["next", "done", "started", "open", "live", "later"] as const;
const WEEK_STATUS = ["complete", "in-progress", "upcoming", "not-started"] as const;
const ASSIGN_STATUS = ["not_started", "submitted", "graded"] as const;

export function courseDetailView(raw: unknown): C.CourseDetail {
  const c = obj(raw);
  return {
    ...courseSummaryView(c),
    weeks: arr(c.weeks)
      .map(obj)
      .map((w, i) => ({
        num: num(w.num, i + 1),
        status: oneOf(w.status, WEEK_STATUS, "not-started"),
        isCurrent: bool(w.isCurrent),
        isFuture: bool(w.isFuture),
        done: num(w.done),
        total: num(w.total),
        lessons: arr(w.lessons)
          .map(obj)
          .filter((l) => l.id)
          .map((l, j) => ({ id: str(l.id), title: str(l.title) || "Lecture", number: num(l.number, j + 1), state: oneOf(l.state, LESSON_STATES, "open"), openable: l.openable !== false, hasVideo: l.hasVideo !== false, cohorts: arr(l.cohorts).map(obj).map((x) => ({ id: str(x.id), name: str(x.name) })) })),
        materials: arr(w.materials)
          .map(obj)
          .filter((m) => m.id)
          .map((m) => ({ id: str(m.id), title: str(m.title) || "Material", meta: str(m.meta), openable: m.openable !== false })),
        assignments: arr(w.assignments)
          .map(obj)
          .filter((a) => a.id)
          .map((a) => ({ id: str(a.id), lessonId: strOrNull(a.lessonId), title: str(a.title) || "Assignment", lessonTitle: str(a.lessonTitle), status: oneOf(a.status, ASSIGN_STATUS, "not_started"), isNext: bool(a.isNext), openable: a.openable !== false })),
      })),
    empty: bool(c.empty),
    myCohorts: arr(c.myCohorts).map(obj).map((x) => ({ id: str(x.id), name: str(x.name) })),
  };
}

/** GET /assignments */
export function assignmentPageView(raw: unknown): C.Page<C.AssignmentRow> {
  const d = obj(raw);
  return {
    items: arr(d.items)
      .map(obj)
      .filter((a) => a.id)
      .map((a) => ({ id: str(a.id), lessonId: str(a.lessonId), courseId: str(a.courseId), title: str(a.title) || "Assignment", lessonTitle: str(a.lessonTitle), week: num(a.week, 1), dueAt: strOrNull(a.dueAt), status: oneOf(a.status, ASSIGN_STATUS, "not_started"), score: numOrNull(a.score) })),
    nextCursor: strOrNull(d.nextCursor),
  };
}

/* -------------------------------------------------------------- Study */

function moduleStatus(v: unknown): C.ModuleStatus {
  const s = obj(v);
  return { readDone: num(s.readDone), readTotal: num(s.readTotal), written: bool(s.written), actsDone: num(s.actsDone), actsTotal: num(s.actsTotal), tested: bool(s.tested), best: numOrNull(s.best), total: numOrNull(s.total), pct: Math.max(0, Math.min(100, num(s.pct))), complete: bool(s.complete), seconds: num(s.seconds) };
}

export function moduleSummaryView(raw: unknown): C.ModuleSummary {
  const m = obj(raw);
  return { id: str(m.id), num: num(m.num), title: str(m.title) || "Module", emoji: str(m.emoji), tagline: str(m.tagline), when: str(m.when), minutes: num(m.minutes), status: moduleStatus(m.status) };
}

export function studyNextView(raw: unknown): C.StudyNext {
  const n = obj(raw);
  const kind = str(n.kind);
  const label = str(n.label);
  const t = target(n.target, { screen: "study", web: "/study" } as C.AppTarget);
  if (!label || kind === "done") return { kind: "done", label, target: t };
  if (kind === "read" || kind === "test" || kind === "retest") return { kind, moduleId: str(n.moduleId), sectionId: str(n.sectionId), label, ...(typeof n.due === "string" ? { due: n.due } : {}), target: t };
  if (kind === "checkpoint" || kind === "write") return { kind, moduleId: str(n.moduleId), label, target: t };
  if (kind === "practise") return { kind, moduleId: str(n.moduleId), activityId: str(n.activityId), label, target: t };
  return { kind: "done", label, target: t };
}

export function studyHomeView(raw: unknown): C.StudyHome {
  const d = obj(raw);
  const g = obj(d.goal);
  return { modules: arr(d.modules).map(moduleSummaryView).filter((m) => m.id), next: studyNextView(d.next), goal: { points: num(g.points), goal: num(g.goal, 30), streak: num(g.streak) }, courseMinutes: num(d.courseMinutes) };
}

const LEVELS = ["starting", "beginner", "advanced"] as const;

function tocView(raw: unknown): C.SectionToc {
  const s = obj(raw);
  return {
    id: str(s.id),
    num: str(s.num),
    title: str(s.title) || "Section",
    part: strOrNull(s.part),
    tag: s.tag === "core" || s.tag === "extra" ? s.tag : null,
    level: s.level ? oneOf(s.level, LEVELS, "starting") : null,
    levelCheck: s.levelCheck ? oneOf(s.levelCheck, LEVELS, "starting") : null,
    isTest: bool(s.isTest),
    words: num(s.words),
    doneOn: strOrNull(s.doneOn),
  };
}

const CP_STATUS = ["early", "waiting", "ready", "done"] as const;

export function moduleDetailView(raw: unknown): C.ModuleDetail {
  const m = obj(raw);
  const nm = obj(m.nextModule);
  return {
    ...moduleSummaryView(m),
    outcomes: strs(m.outcomes),
    writeTask: str(m.writeTask),
    noteId: strOrNull(m.noteId),
    activities: arr(m.activities)
      .map(obj)
      .filter((a) => a.id)
      .map((a) => ({ id: str(a.id), title: str(a.title), why: str(a.why), kind: str(a.kind, "lesson") as C.StudyActivity["kind"], target: target(a.target, { screen: "unknown", web: "/study" } as C.AppTarget), doneOn: strOrNull(a.doneOn) })),
    sections: arr(m.sections).map(tocView).filter((s) => s.id),
    checkpoints: arr(m.checkpoints)
      .map(obj)
      .map((cp, i) => ({ n: num(cp.n, i + 1), key: str(cp.key), title: str(cp.title) || `Checkpoint ${i + 1}`, sectionIds: strs(cp.sectionIds), status: oneOf(cp.status, CP_STATUS, "early"), best: numOrNull(cp.best), total: numOrNull(cp.total) })),
    next: studyNextView(m.next),
    nextModule: nm.id ? { id: str(nm.id), num: num(nm.num), title: str(nm.title) } : null,
    retestDue: strOrNull(m.retestDue),
  };
}

const cards = (v: unknown): C.Card[] =>
  arr(v)
    .map(obj)
    .filter((x) => x.q)
    .map((x) => ({ q: str(x.q), a: str(x.a) }));

export function mcqView(raw: unknown): C.Mcq | null {
  const m = obj(raw);
  const options = strs(m.options);
  if (!m.q || options.length < 2) return null;
  return { q: str(m.q), options, answer: Math.max(0, Math.min(options.length - 1, num(m.answer))), ...(typeof m.why === "string" && m.why ? { why: m.why } : {}) };
}

export function sectionContentView(raw: unknown): C.SectionContent {
  const s = obj(raw);
  const test = obj(s.test);
  const link = (v: unknown) => {
    const x = obj(v);
    return x.sectionId ? { sectionId: str(x.sectionId), title: str(x.title) } : null;
  };
  return {
    contentSchemaVersion: num(s.contentSchemaVersion, 1),
    moduleId: str(s.moduleId),
    moduleNum: num(s.moduleNum),
    moduleTitle: str(s.moduleTitle),
    section: tocView(s.section),
    chunks: arr(s.chunks)
      .map(obj)
      .map((c) => ({ title: str(c.title), words: num(c.words), blocks: arr(c.blocks).filter((b) => b && typeof b === "object") as C.Block[] })),
    recall: cards(s.recall),
    viva: cards(s.viva),
    mcq: arr(s.mcq)
      .map(mcqView)
      .filter((x): x is C.Mcq => x !== null),
    test: Array.isArray(test.questions)
      ? {
          questions: test.questions
            .map(obj)
            .filter((q) => q.key)
            .map((q) => ({ key: str(q.key), q: str(q.q), options: strs(q.options) })),
        }
      : null,
    prev: link(s.prev),
    next: link(s.next),
    checkpoints: arr(s.checkpoints)
      .map(obj)
      .map((cp, i) => ({ n: num(cp.n, i + 1), key: str(cp.key), sectionIds: strs(cp.sectionIds), later: strs(cp.later) })),
  };
}

/* --------------------------------------------------------------- Notes */

export function noteSummaryView(raw: unknown): C.RevisionNoteSummary {
  const n = obj(raw);
  return { id: str(n.id), block: num(n.block), blockTitle: str(n.blockTitle), title: str(n.title) || "Note", emoji: str(n.emoji), tagline: str(n.tagline), readOn: strOrNull(n.readOn) };
}

export function noteListView(raw: unknown): C.RevisionNoteList {
  const d = obj(raw);
  return { blocks: strs(d.blocks), notes: arr(d.notes).map(noteSummaryView).filter((n) => n.id) };
}

function bullet(v: unknown): C.RevisionNoteBullet | null {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return [v[0], typeof v[1] === "string" ? v[1] : v[0]];
  return null;
}

/** One line of a note in the chosen reading view. */
export function bulletText(b: C.RevisionNoteBullet, view: "student" | "clinician"): string {
  return typeof b === "string" ? b : view === "clinician" ? b[1] : b[0];
}

const TONES = ["lime", "blue", "ink", "white"] as const;
const STYLES = ["list", "chips", "steps", "alert"] as const;

export function noteView(raw: unknown): C.RevisionNote {
  const n = obj(raw);
  return {
    ...noteSummaryView(n),
    tldr: bullet(n.tldr) ?? "",
    sections: arr(n.sections)
      .map(obj)
      .map((s) => ({ title: str(s.title), tone: s.tone ? oneOf(s.tone, TONES, "white") : undefined, style: s.style ? oneOf(s.style, STYLES, "list") : undefined, points: arr(s.points).map(bullet).filter((b): b is C.RevisionNoteBullet => b !== null) }))
      .filter((s) => s.title || s.points.length),
    terms: arr(n.terms)
      .filter((t): t is unknown[] => Array.isArray(t))
      .map((t) => [str(t[0]), str(t[1])] as [string, string])
      .filter((t) => t[0] && t[1]),
    figures: arr(n.figures)
      .map(obj)
      .filter((f) => f.id)
      .map((f) => ({ id: str(f.id), ...(Array.isArray(f.focus) ? { focus: strs(f.focus) } : {}), ...(f.quiz === true ? { quiz: true } : {}), ...(typeof f.caption === "string" ? { caption: f.caption } : {}) })),
  };
}

/* ----------------------------------------------- Quick reference (terms) */

export type RefKind = "disorder" | "medicine" | "term";
export type RefIndexItem = { slug: string; label: string; kind: RefKind; summary: string; aliases: string[]; letter: string };
/** GET /library/terms */
export type RefIndex = { items: RefIndexItem[] };
export type RefLookAlike = { name: string; tell: string; slug: string | null };
export type RefEntry =
  | { kind: "disorder"; slug: string; label: string; summary: string; chapter: string; aka: string[]; core: string; features: string[]; criteria: string[]; duration: string; lookAlikes: RefLookAlike[]; firstLine: string[]; noteId: string | null }
  | { kind: "medicine"; slug: string; label: string; summary: string; cls: string; plain: string | null; mechanism: string | null; uses: string[]; sideEffects: string[]; monitoring: string[]; medId: string }
  | { kind: "term"; slug: string; label: string; summary: string; means: string; clinical: string | null; why: string | null; mixup: string | null; hook: string | null; area: string | null; sayings: string[]; related: string[] };

const REF_KINDS = ["disorder", "medicine", "term"] as const;

export function refIndexView(raw: unknown): RefIndex {
  return {
    items: arr(obj(raw).items)
      .map(obj)
      .filter((r) => r.slug && r.label)
      .map((r) => {
        const label = str(r.label);
        return { slug: str(r.slug), label, kind: oneOf(r.kind, REF_KINDS, "term"), summary: str(r.summary), aliases: strs(r.aliases), letter: str(r.letter) || label.charAt(0).toUpperCase() };
      }),
  };
}

/** GET /library/terms/:slug answers { v, entry }; the entry is the website's RefEntry. */
export function refEntryView(raw: unknown): RefEntry | null {
  const e = obj(obj(raw).entry ?? raw);
  const d = obj(e.data);
  const slug = str(e.slug);
  const label = str(e.label);
  if (!slug || !label) return null;
  const summary = str(e.summary);
  if (e.kind === "disorder") {
    return {
      kind: "disorder",
      slug,
      label,
      summary,
      chapter: str(d.chapter),
      aka: strs(d.aka),
      core: str(d.core) || summary,
      features: strs(d.features),
      criteria: strs(d.criteria),
      duration: str(d.duration),
      lookAlikes: arr(d.lookAlikes)
        .map(obj)
        .filter((l) => l.name)
        .map((l) => ({ name: str(l.name), tell: str(l.tell), slug: strOrNull(l.slug) })),
      firstLine: strs(d.firstLine),
      noteId: strOrNull(d.noteId),
    };
  }
  if (e.kind === "medicine") {
    const href = str(d.fullHref);
    const medId = decodeURIComponent(href.split("/").filter(Boolean).pop() ?? "") || slug;
    return { kind: "medicine", slug, label, summary, cls: str(d.cls), plain: strOrNull(d.plain), mechanism: strOrNull(d.mechanism), uses: strs(d.uses), sideEffects: strs(d.sideEffects), monitoring: strs(d.monitoring), medId };
  }
  return { kind: "term", slug, label, summary, means: str(d.means) || summary, clinical: strOrNull(d.clinical), why: strOrNull(d.why), mixup: strOrNull(d.mixup), hook: strOrNull(d.hook), area: strOrNull(d.area), sayings: strs(d.sayings), related: strs(d.related) };
}

/* -------------------------------------------------------------- Marks */

export function marksView(raw: unknown): C.MarksResult {
  const d = obj(raw);
  const m = obj(d.marks);
  const bookmarks: C.Marks["bookmarks"] = {};
  for (const [k, v] of Object.entries(obj(m.bookmarks))) {
    const b = obj(v);
    bookmarks[k] = { on: b.on === true, at: num(b.at) };
  }
  const notes: C.Marks["notes"] = {};
  for (const [k, v] of Object.entries(obj(m.notes))) {
    const n = obj(v);
    notes[k] = { text: str(n.text), at: num(n.at) };
  }
  return { marks: { v: 1, bookmarks, notes }, synced: d.synced !== false };
}

/* ------------------------------------------------------------- Me */

export function progressView(raw: unknown): C.Progress {
  const d = obj(raw);
  const s = d.study && typeof d.study === "object" ? obj(d.study) : null;
  const st = d.strengths && typeof d.strengths === "object" ? obj(d.strengths) : null;
  const topic = (v: unknown): C.TopicScore => {
    const t = obj(v);
    return { id: str(t.id), title: str(t.title), kind: oneOf(t.kind, ["topic", "subject", "skill"] as const, "topic"), p: Math.max(0, Math.min(1, num(t.p))), n: num(t.n), studyTarget: t.studyTarget ? target(t.studyTarget) : null, practiceTarget: target(t.practiceTarget, { screen: "practice", web: "/practice" } as C.AppTarget) };
  };
  const topics = (v: unknown) =>
    arr(v)
      .map(topic)
      .filter((t) => t.id);
  return {
    lectures: arr(d.lectures)
      .map(obj)
      .map((l) => ({ courseId: str(l.courseId), title: str(l.title) || "Lectures", completed: num(l.completed), total: num(l.total) })),
    study: s ? { modulesDone: num(s.modulesDone), modulesTotal: num(s.modulesTotal), sectionsDone: num(s.sectionsDone), sectionsTotal: num(s.sectionsTotal), seconds: num(s.seconds), xp: num(s.xp), streak: num(s.streak), bestStreak: num(s.bestStreak) } : null,
    days: arr(d.days)
      .map(obj)
      .filter((x) => x.day)
      .map((x) => ({ day: str(x.day), xp: num(x.xp) })),
    strengths: st ? { strongest: topics(st.strongest), weakest: topics(st.weakest), all: topics(st.all), hasData: bool(st.hasData) } : null,
  };
}

export function achievementsView(raw: unknown): C.Achievements {
  const d = obj(raw);
  return {
    earned: arr(d.earned)
      .map(obj)
      .filter((c) => c.credentialId)
      .map((c) => ({
        credentialId: str(c.credentialId),
        type: c.type === "certificate" ? "certificate" : "badge",
        status: oneOf(c.status, ["draft", "approved", "issued", "revoked"] as const, "issued"),
        title: str(c.title) || (c.type === "certificate" ? "Certificate" : "Badge"),
        description: strOrNull(c.description),
        icon: strOrNull(c.icon),
        tone: str(c.tone, "lime"),
        issuedAt: strOrNull(c.issuedAt),
        revokedAt: strOrNull(c.revokedAt),
        revokeReason: strOrNull(c.revokeReason),
        kind: strOrNull(c.kind),
        expiresAt: strOrNull(c.expiresAt),
        verifyUrl: strOrNull(c.verifyUrl),
      })),
    progress: arr(d.progress)
      .map(obj)
      .filter((p) => p.id)
      .map((p) => ({ id: str(p.id), type: p.type === "certificate" ? "certificate" : "badge", title: str(p.title), description: strOrNull(p.description), icon: strOrNull(p.icon), tone: str(p.tone, "lime"), earned: bool(p.earned), status: str(p.status), progress: str(p.progress) })),
  };
}

export function journeyView(raw: unknown): C.Journey {
  const d = obj(raw);
  const KEYS = ["online", "lectures", "finished", "streak", "points", "practice"] as const;
  return {
    level: Math.max(1, num(d.level, 1)),
    title: str(d.title),
    levelPct: Math.max(0, Math.min(1, num(d.levelPct))),
    points: numOrNull(d.points),
    rank: numOrNull(d.rank),
    streak: num(d.streak),
    stats: arr(d.stats)
      .map(obj)
      .filter((s) => s.label)
      .map((s) => ({ key: oneOf(s.key, KEYS, "online"), label: str(s.label), value: str(s.value, "0"), ...(typeof s.sub === "string" && s.sub ? { sub: s.sub } : {}) })),
  };
}

/* ------------------------------------------------- Notifications, doubts */

export function notificationListView(raw: unknown): C.NotificationList {
  const d = obj(raw);
  return {
    items: arr(d.items)
      .map(obj)
      .filter((n) => n.id)
      .map((n) => ({ id: str(n.id), type: str(n.type, "message"), title: str(n.title), body: str(n.body), createdAt: str(n.createdAt), readAt: strOrNull(n.readAt), target: target(n.target, { screen: "notification", notificationId: str(n.id), web: "/notifications" } as C.AppTarget) })),
    nextCursor: strOrNull(d.nextCursor),
    unread: num(d.unread),
  };
}

function doubtRow(raw: unknown): C.DoubtRow {
  const r = obj(raw);
  return { id: str(r.id), title: str(r.title) || "Doubt", topic: strOrNull(r.topic), kind: r.kind === "complaint" ? "complaint" : "doubt", status: oneOf(r.status, ["open", "solved", "hidden"] as const, "open"), cohortId: strOrNull(r.cohortId), author: str(r.author) || "A batchmate", mine: bool(r.mine), replies: num(r.replies), createdAt: str(r.createdAt) };
}

export function doubtListView(raw: unknown): C.DoubtList {
  const d = obj(raw);
  return {
    items: arr(d.items)
      .map(doubtRow)
      .filter((r) => r.id),
    nextCursor: strOrNull(d.nextCursor),
    cohorts: arr(d.cohorts)
      .map(obj)
      .map((c) => ({ id: str(c.id), name: str(c.name) })),
    ready: d.ready !== false,
  };
}

export function doubtThreadView(raw: unknown): C.DoubtThread {
  const d = obj(raw);
  const { replies: _count, ...row } = doubtRow(d);
  void _count;
  return {
    ...row,
    body: str(d.body),
    replies: arr(d.replies)
      .map(obj)
      .filter((r) => r.id)
      .map((r) => ({ id: str(r.id), author: str(r.author) || "A batchmate", mine: bool(r.mine), body: str(r.body), votes: num(r.votes), youVoted: bool(r.youVoted), isSolution: bool(r.isSolution), createdAt: str(r.createdAt) })),
  };
}
