/**
 * A student's activity timeline, built from what VIBHA actually records:
 * page visits (sessions), lecture visits and progress, submissions,
 * credentials, Notes & Games XP per day, and "Still watching?" checks.
 * Pure (inputs in, events out), so it is tested. Times are real record
 * times; "Came in" is worked out from page visits (a gap of 30+ minutes
 * starts a new visit), and says so.
 */
export type TimelineEvent = {
  at: string;
  kind: "session" | "lecture-start" | "lecture-progress" | "lecture-done" | "submission" | "credential" | "learn" | "check-ok" | "check-missed";
  text: string;
  detail?: string;
};

export type TimelineInput = {
  visits: { path: string; entered_at: string; duration_seconds: number | null }[];
  progress: { lesson_id: string; watched_seconds: number | null; is_completed: boolean | null; updated_at: string | null }[];
  lessonTitle: (id: string) => string;
  submissions?: { submitted_at: string | null; status: string | null; title: string }[];
  credentials?: { issued_at: string | null; title: string; status: string }[];
  learnHistory?: Record<string, number>;
  checks?: { asked_at: string; answered_at: string | null; missed: boolean; lesson_id: string | null }[];
};

const SESSION_GAP_MS = 30 * 60 * 1000;
const LESSON_RE = /\/courses\/[^/]+\/lessons\/([0-9a-f-]{36})/i;

export function buildTimeline(i: TimelineInput, limit = 80): TimelineEvent[] {
  const out: TimelineEvent[] = [];
  const visits = [...i.visits].sort((a, b) => (a.entered_at < b.entered_at ? -1 : 1));

  // Sessions: a new one starts after 30+ minutes away.
  let lastEnd = 0;
  let current: { start: string; seconds: number; pages: number } | null = null;
  const flush = () => {
    if (current) out.push({ at: current.start, kind: "session", text: "Came in", detail: `${Math.max(1, Math.round(current.seconds / 60))} min, ${current.pages} page${current.pages === 1 ? "" : "s"}` });
  };
  const firstLessonVisit = new Map<string, string>();
  for (const v of visits) {
    const t = new Date(v.entered_at).getTime();
    if (!current || t - lastEnd > SESSION_GAP_MS) {
      flush();
      current = { start: v.entered_at, seconds: 0, pages: 0 };
    }
    const secs = Math.min(1800, Math.max(0, v.duration_seconds ?? 0));
    current.seconds += secs;
    current.pages++;
    lastEnd = Math.max(lastEnd, t + secs * 1000);
    const m = LESSON_RE.exec(v.path);
    if (m && !firstLessonVisit.has(m[1])) firstLessonVisit.set(m[1], v.entered_at);
  }
  flush();

  for (const [lid, at] of firstLessonVisit) out.push({ at, kind: "lecture-start", text: `Opened lecture: ${i.lessonTitle(lid)}` });
  for (const p of i.progress) {
    if (!p.updated_at) continue;
    const min = Math.round((p.watched_seconds ?? 0) / 60);
    if (p.is_completed) out.push({ at: p.updated_at, kind: "lecture-done", text: `Finished lecture: ${i.lessonTitle(p.lesson_id)}`, detail: `${min} min watched` });
    else if (min > 0) out.push({ at: p.updated_at, kind: "lecture-progress", text: `Watched part of: ${i.lessonTitle(p.lesson_id)}`, detail: `${min} min so far` });
  }
  for (const s of i.submissions ?? []) if (s.submitted_at) out.push({ at: s.submitted_at, kind: "submission", text: `Submitted: ${s.title}`, detail: s.status ?? undefined });
  for (const c of i.credentials ?? []) if (c.issued_at) out.push({ at: c.issued_at, kind: "credential", text: `Earned: ${c.title}`, detail: c.status === "revoked" ? "revoked" : undefined });
  for (const [day, xp] of Object.entries(i.learnHistory ?? {})) if (xp > 0) out.push({ at: `${day}T18:29:00.000Z`, kind: "learn", text: `Notes & Games: ${xp} XP`, detail: "that day" });
  for (const c of i.checks ?? []) {
    const lecture = c.lesson_id ? i.lessonTitle(c.lesson_id) : "a lecture";
    if (c.answered_at) out.push({ at: c.asked_at, kind: "check-ok", text: `Answered "Still watching?" in ${lecture}` });
    else if (c.missed) out.push({ at: c.asked_at, kind: "check-missed", text: `Missed "Still watching?" in ${lecture}`, detail: "video paused" });
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit);
}

/** ISO time n days ago (kept out of components so renders stay pure). */
export function daysAgoIso(n: number, now = Date.now()): string {
  return new Date(now - n * 86400000).toISOString();
}
