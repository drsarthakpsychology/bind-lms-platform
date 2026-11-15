import type { RawResponse } from "../client";
import type * as C from "../contract";

/**
 * Mock answers for the Learn and Me routes added in round 2 (notes, the
 * Quick reference, marks, assignments, My journey), in the server's shapes.
 * Sample words only; the real content comes from the website's code.
 */

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const notFound = (): RawResponse => ({ status: 404, json: { ok: false, error: { code: "not_found", message: "We could not find that." } } });
const scope = (): RawResponse => ({ status: 403, json: { ok: false, error: { code: "scope", message: "Your account is for lectures only." } } });

const NOTES: C.RevisionNoteSummary[] = [
  { id: "depression", block: 0, blockTitle: "Weeks 1 to 2: Mood", title: "Depression", emoji: "🌧️", tagline: "Low mood, lost pleasure, and what else to look for", readOn: "2026-11-12" },
  { id: "bipolar", block: 0, blockTitle: "Weeks 1 to 2: Mood", title: "Bipolar disorder", emoji: "🎢", tagline: "Highs and lows, and why the highs matter most", readOn: null },
  { id: "panic", block: 1, blockTitle: "Weeks 3 to 4: Anxiety", title: "Panic disorder", emoji: "💓", tagline: "Sudden surges of fear, and the fear of the next one", readOn: null },
  { id: "gad", block: 1, blockTitle: "Weeks 3 to 4: Anxiety", title: "Generalised anxiety", emoji: "🌀", tagline: "Worry about many things, most days, for months", readOn: null },
];

function note(id: string): C.RevisionNote | null {
  const n = NOTES.find((x) => x.id === id);
  if (!n) return null;
  return {
    ...n,
    tldr: ["Two weeks or more of low mood or lost pleasure. Sleep, appetite and energy change. Always ask about safety.", "At least five of nine symptoms for two weeks, including low mood or anhedonia. Screen for mania before treating. Assess risk every visit."],
    sections: [
      { title: "What you notice", points: [["Sad most of the day", "Depressed mood most of the day, nearly every day"], ["Nothing feels good any more", "Anhedonia"], "Sleep and appetite change", "Slowed down, or restless"] },
      { title: "Ask about", style: "chips", points: ["Sleep", "Appetite", "Energy", "Concentration", "Guilt", "Hopelessness"] },
      { title: "First steps", style: "steps", points: ["Ask about safety first", "Rule out a medical cause", "Ask about past highs", "Agree a plan together"] },
      { title: "Red flags", style: "alert", points: ["Talk of death or a plan", "Not eating or drinking", "Hearing voices"] },
    ],
    terms: [
      ["I can't enjoy anything", "Anhedonia"],
      ["I wake at 4 and can't sleep again", "Early morning waking"],
      ["Everything is my fault", "Excessive guilt"],
      ["My body feels heavy", "Psychomotor slowing"],
    ],
    figures: [{ id: "brain-lobes", caption: "Where mood is shaped" }],
  };
}

const REFS: { slug: string; label: string; kind: "disorder" | "medicine" | "term"; summary: string; aliases: string[]; letter: string }[] = [
  { slug: "anhedonia", label: "Anhedonia", kind: "term", summary: "Losing the ability to enjoy things you used to enjoy.", aliases: ["loss of pleasure"], letter: "A" },
  { slug: "bipolar-i-disorder", label: "Bipolar I disorder", kind: "disorder", summary: "At least one manic episode, often with depression too.", aliases: ["Bipolar", "Manic depression"], letter: "B" },
  { slug: "fluoxetine", label: "Fluoxetine", kind: "medicine", summary: "An SSRI antidepressant with a long half-life.", aliases: ["Prozac"], letter: "F" },
  { slug: "major-depressive-disorder", label: "Major depressive disorder", kind: "disorder", summary: "Low mood or loss of pleasure for at least two weeks.", aliases: ["MDD", "Depression"], letter: "M" },
  { slug: "psychomotor-retardation", label: "Psychomotor retardation", kind: "term", summary: "Slowed movement and speech that others can see.", aliases: ["Psychomotor slowing"], letter: "P" },
  { slug: "sertraline", label: "Sertraline", kind: "medicine", summary: "An SSRI, often a first choice for depression and anxiety.", aliases: ["Zoloft"], letter: "S" },
];

function entry(slug: string): Record<string, unknown> | null {
  const r = REFS.find((x) => x.slug === slug);
  if (!r) return null;
  if (r.kind === "disorder")
    return {
      ...r,
      data: {
        slug,
        name: r.label,
        aka: r.aliases,
        chapter: "Depressive disorders",
        core: r.summary,
        features: ["Low mood or loss of pleasure", "Sleep and appetite change", "Guilt, poor focus", "Thoughts of death"],
        criteria: ["Five of nine symptoms in the same two weeks", "One is low mood or loss of pleasure", "Clear distress or trouble coping"],
        duration: "At least 2 weeks.",
        lookAlikes: [
          { name: "Bipolar I disorder", tell: "There has been a manic episode.", slug: "bipolar-i-disorder" },
          { name: "Grief", tell: "Waves of sadness tied to the loss, self-worth kept." },
        ],
        firstLine: ["Talking therapy (CBT, behavioural activation)", "An SSRI such as sertraline"],
        noteId: "depression",
      },
    };
  if (r.kind === "medicine") return { ...r, data: { slug, name: r.label, cls: "SSRI antidepressant", plain: r.summary, mechanism: "Blocks the reuptake of serotonin, so more stays in the gap between nerve cells.", uses: ["Depression", "Panic disorder", "OCD"], sideEffects: ["Nausea at first", "Sleep change", "Sexual side effects"], monitoring: ["Mood and safety in the first weeks"], fullHref: `/tools/psychopharm/${slug}` } };
  return { ...r, data: { slug, term: r.label, means: r.summary, clinical: "Reported by the patient or seen in how they talk about their day.", why: "It points to *depression* more than to ordinary sadness.", mixup: "Apathy: not caring, rather than not enjoying.", hook: "An- means without; hedone means pleasure.", area: "Mood", sayings: ["Nothing feels good any more", "I just don't care about my hobbies"], related: ["major-depressive-disorder", "psychomotor-retardation"] } };
}

const ASSIGNMENTS: C.AssignmentRow[] = [
  { id: "a5", lessonId: "l5", courseId: "course-1", title: "Write a short case summary", lessonTitle: "Depression: how it presents in the clinic", week: 3, dueAt: "2026-11-20T18:29:00.000Z", status: "not_started", score: null },
  { id: "a3", lessonId: "l3", courseId: "course-1", title: "MSE of a role-play patient", lessonTitle: "Mental status examination, part one", week: 2, dueAt: null, status: "submitted", score: null },
  { id: "a1", lessonId: "l1", courseId: "course-1", title: "What a psychologist does", lessonTitle: "What clinical psychology is, and is not", week: 1, dueAt: null, status: "graded", score: 9 },
];

const JOURNEY: C.Journey = {
  level: 4,
  title: "Keen Observer",
  levelPct: 0.62,
  points: 1240,
  rank: 3,
  streak: 6,
  stats: [
    { key: "online", label: "Time on VIBHA", value: "18 h", sub: "all your time here" },
    { key: "lectures", label: "In lectures", value: "7 h", sub: "5 started" },
    { key: "finished", label: "Lectures finished", value: "4" },
    { key: "streak", label: "Day streak", value: "6 🔥", sub: "days in a row" },
    { key: "points", label: "Quiz points", value: "420", sub: "78% right" },
    { key: "practice", label: "Practice done", value: "12", sub: "sessions and drills" },
  ],
};

let marks: C.Marks = { v: 1, bookmarks: { "m02/s2": { on: true, at: 1763190000000 } }, notes: { "m02/s1": { text: "Ask about sleep and appetite every time.", at: 1763180000000 } } };
let read: Record<string, string> = {};
let touched = false;

export function resetLearnMock(): void {
  marks = { v: 1, bookmarks: { "m02/s2": { on: true, at: 1763190000000 } }, notes: { "m02/s1": { text: "Ask about sleep and appetite every time.", at: 1763180000000 } } };
  read = {};
  touched = false;
}

/** Answers the round 2 Learn and Me routes; null for every other route. */
export function learnRoute(method: string, path: string, body: Record<string, unknown>, kind: string, opts: { empty: boolean }): RawResponse | null {
  const seg = path.split("/").filter(Boolean);
  const full = kind !== "lecture";
  if (method === "GET" && path === "/study/notes") return full ? ok<C.RevisionNoteList>({ blocks: ["Weeks 1 to 2: Mood", "Weeks 3 to 4: Anxiety"], notes: NOTES.map((n) => ({ ...n, readOn: read[n.id] ?? (opts.empty ? null : n.readOn) })) }) : scope();
  if (method === "GET" && seg[0] === "study" && seg[1] === "notes" && seg[2]) {
    if (!full) return scope();
    const n = note(decodeURIComponent(seg[2]));
    return n ? ok(n) : notFound();
  }
  if (method === "GET" && path === "/library/terms") return full ? ok({ v: 1, items: REFS }) : scope();
  if (method === "GET" && seg[0] === "library" && seg[1] === "terms" && seg[2]) {
    if (!full) return scope();
    const e = entry(decodeURIComponent(seg[2]));
    return e ? ok({ v: 1, entry: e }) : notFound();
  }
  if (path === "/study/marks") {
    if (!full) return scope();
    if (method === "PUT") {
      const ch = (body.changes ?? {}) as Partial<C.Marks>;
      const base = opts.empty && !touched ? { v: 1 as const, bookmarks: {}, notes: {} } : marks;
      marks = { v: 1, bookmarks: { ...base.bookmarks, ...(ch.bookmarks ?? {}) }, notes: { ...base.notes, ...(ch.notes ?? {}) } };
      touched = true;
    }
    return ok<C.MarksResult>({ marks: opts.empty && !touched ? { v: 1, bookmarks: {}, notes: {} } : marks, synced: true });
  }
  if (method === "GET" && path === "/assignments") return ok<C.Page<C.AssignmentRow>>({ items: opts.empty ? [] : ASSIGNMENTS, nextCursor: null });
  if (method === "GET" && path === "/journey") return ok<C.Journey>(opts.empty ? { level: 1, title: "Curious Mind", levelPct: 0, points: null, rank: null, streak: 0, stats: JOURNEY.stats.map((s) => ({ ...s, value: s.key === "streak" ? "None yet" : s.key === "online" || s.key === "lectures" ? "0 h" : "0" })) } : JOURNEY);
  return null;
}

/** The PUT /study/state hook: remember notes read, as the server would. */
export function noteMarkedRead(state: { notesRead?: Record<string, string> } | undefined): void {
  if (state?.notesRead) read = { ...read, ...state.notesRead };
}
