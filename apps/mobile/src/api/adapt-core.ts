import type * as C from "./contract";
import { arr, courseSummaryView, num, numOrNull, obj, progressView, str, strOrNull, target } from "./adapt-learn";

/**
 * Home, a lecture and one notification, read safely (the other answers are
 * read in adapt-learn.ts and src/admin/safe.ts). Each takes whatever the
 * server sent and returns the shape the screen reads, with every list an
 * array and every object present, so a null in an answer (a lesson without a
 * title in the database, an older server, a message saved without blocks)
 * never breaks a screen while it draws. They never throw.
 */

const HOME_TARGET = { screen: "home", web: "/dashboard" } as C.AppTarget;
const CONTINUE_KINDS = ["retest", "lecture", "assignment", "study", "weak", "daily", "lectures"] as const;
const UP_NEXT_KINDS = ["lecture", "study", "weak", "daily"] as const;
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback);

export function homeView(raw: unknown): C.Home {
  const d = obj(raw);
  const s = obj(d.step);
  const p = d.progress && typeof d.progress === "object" ? obj(d.progress) : null;
  const g = d.goal && typeof d.goal === "object" ? obj(d.goal) : null;
  const q = d.quests && typeof d.quests === "object" ? obj(d.quests) : null;
  return {
    dateLine: str(d.dateLine),
    welcomeBack: d.welcomeBack !== false,
    step: {
      kind: oneOf(s.kind, CONTINUE_KINDS, "lectures"),
      eyebrow: str(s.eyebrow),
      title: str(s.title) || "Your lectures",
      meta: strOrNull(s.meta),
      cta: str(s.cta) || "Open",
      target: target(s.target, { screen: "courses", web: "/courses" } as C.AppTarget),
    },
    progress: p ? { pct: Math.max(0, Math.min(100, num(p.pct))), label: str(p.label) } : null,
    allDone: d.allDone === true,
    goal: g ? { points: num(g.points), goal: Math.max(0, num(g.goal)), streak: num(g.streak) } : null,
    upNext: arr(d.upNext)
      .map(obj)
      .filter((r) => typeof r.title === "string" && r.title)
      .map((r) => ({ kind: oneOf(r.kind, UP_NEXT_KINDS, "lecture"), title: str(r.title), meta: strOrNull(r.meta), target: target(r.target, HOME_TARGET) })),
    strengths: progressView({ strengths: d.strengths }).strengths,
    courses: arr(d.courses).map(courseSummaryView),
    unreadNotifications: num(d.unreadNotifications),
    supportWhatsapp: str(d.supportWhatsapp),
    quests: q
      ? {
          done: q.done === true,
          xpEach: num(q.xpEach),
          xpBonus: num(q.xpBonus),
          spareBonus: num(q.spareBonus),
          quests: arr(q.quests)
            .map(obj)
            .filter((x) => x.id)
            .map((x) => ({ id: str(x.id), label: str(x.label), done: x.done === true, progress: strOrNull(x.progress), target: target(x.target, HOME_TARGET) })),
        }
      : null,
  };
}

function materialView(raw: unknown): C.Material {
  const m = obj(raw);
  return { id: str(m.id), title: str(m.title) || "Material", kind: str(m.kind, "doc"), format: strOrNull(m.format), sizeBytes: numOrNull(m.sizeBytes), lessonId: strOrNull(m.lessonId), courseId: strOrNull(m.courseId), week: numOrNull(m.week), url: strOrNull(m.url), filePath: strOrNull(m.filePath) };
}

function submissionView(raw: unknown): C.Submission | null {
  if (!raw || typeof raw !== "object") return null;
  const s = obj(raw);
  return {
    id: str(s.id),
    status: oneOf(s.status, ["pending_review", "returned", "approved"] as const, "pending_review"),
    submittedAt: strOrNull(s.submittedAt),
    isLate: s.isLate === true,
    text: strOrNull(s.text),
    note: strOrNull(s.note),
    hasAudio: s.hasAudio === true,
    files: arr(s.files)
      .map(obj)
      .filter((f) => f.id)
      .map((f) => ({ id: str(f.id), name: str(f.name) || "File", format: strOrNull(f.format), sizeBytes: numOrNull(f.sizeBytes), status: str(f.status, "ready"), filePath: str(f.filePath) })),
    score: numOrNull(s.score),
    feedback: strOrNull(s.feedback),
    editable: s.editable !== false,
  };
}

const nav = (v: unknown): { id: string; title: string } | null => {
  const n = obj(v);
  return typeof n.id === "string" && n.id ? { id: n.id, title: str(n.title) } : null;
};

export function lectureView(raw: unknown): C.LectureDetail {
  const d = obj(raw);
  const pr = obj(d.progress);
  const a = d.assignment && typeof d.assignment === "object" ? obj(d.assignment) : null;
  return {
    id: str(d.id),
    courseId: str(d.courseId),
    courseTitle: str(d.courseTitle),
    title: str(d.title) || "Lecture",
    description: strOrNull(d.description),
    week: num(d.week),
    number: numOrNull(d.number),
    hasVideo: d.hasVideo === true,
    durationSeconds: numOrNull(d.durationSeconds),
    progress: { watchedSeconds: Math.max(0, num(pr.watchedSeconds)), completed: pr.completed === true },
    requiresAssignment: d.requiresAssignment === true,
    assignment: a
      ? {
          id: str(a.id),
          lessonId: str(a.lessonId) || str(d.id),
          courseId: str(a.courseId) || str(d.courseId),
          title: str(a.title) || "Assignment",
          instructions: strOrNull(a.instructions),
          submissionType: str(a.submissionType, "file"),
          dueAt: strOrNull(a.dueAt),
          allowLate: a.allowLate !== false,
          maxFiles: Math.max(1, num(a.maxFiles, 1)),
          maxFileMb: Math.max(1, num(a.maxFileMb, 20)),
          acceptedFormats: arr(a.acceptedFormats).filter((x): x is string => typeof x === "string"),
          submission: submissionView(a.submission),
        }
      : null,
    materials: arr(d.materials)
      .filter((m) => obj(m).id)
      .map(materialView),
    prev: nav(d.prev),
    next: nav(d.next),
  };
}

function spans(v: unknown): C.MessageSpan[] {
  return arr(v)
    .map(obj)
    .map((s) => {
      const link = s.link && typeof s.link === "object" ? obj(s.link) : null;
      return {
        text: str(s.text),
        ...(s.bold === true ? { bold: true } : {}),
        ...(s.italic === true ? { italic: true } : {}),
        ...(link ? { link: { target: link.target && typeof obj(link.target).screen === "string" ? (link.target as C.AppTarget) : null, url: strOrNull(link.url) } } : {}),
      };
    });
}

export function notificationDetailView(raw: unknown): C.NotificationDetail {
  const d = obj(raw);
  const id = str(d.id);
  const content: C.MessageBlock[] = [];
  for (const b of arr(d.content).map(obj)) {
    if (b.t === "p" || b.t === "h") content.push({ t: b.t, spans: spans(b.spans) });
    else if (b.t === "ul" || b.t === "ol") content.push({ t: b.t, items: arr(b.items).map(spans) });
  }
  return {
    id,
    type: str(d.type, "message"),
    title: str(d.title) || "Message",
    body: str(d.body),
    createdAt: str(d.createdAt),
    readAt: strOrNull(d.readAt),
    target: target(d.target, { screen: "notification", notificationId: id, web: "/notifications" } as C.AppTarget),
    from: str(d.from),
    content,
    links: arr(d.links)
      .map(obj)
      .map((l) => ({ label: str(l.label) || "Open", target: l.target && typeof obj(l.target).screen === "string" ? (l.target as C.AppTarget) : null, url: strOrNull(l.url) }))
      .filter((l) => l.target || l.url),
  };
}

/** POST /lectures/:id/stream, read safely. Null when there is no address to play (the screen then offers Try again). */
export function streamView(raw: unknown, fallbackWatermark = "VIBHA"): C.StreamAccess | null {
  const d = obj(raw);
  const url = str(d.url);
  if (!url) return null;
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj(d.headers))) if (typeof v === "string") headers[k] = v;
  const w = obj(d.watermark);
  const text = str(w.text) || str(w.name) || fallbackWatermark;
  return {
    url,
    mediaType: d.mediaType === "mp4" ? "mp4" : "hls",
    headers,
    expiresIn: num(d.expiresIn),
    expiresAt: str(d.expiresAt),
    resumeSeconds: Math.max(0, num(d.resumeSeconds)),
    durationSeconds: numOrNull(d.durationSeconds),
    watermark: { name: str(w.name) || text, rollNumber: strOrNull(w.rollNumber), text },
    progressEverySeconds: Math.max(5, num(d.progressEverySeconds, 15)),
  };
}
