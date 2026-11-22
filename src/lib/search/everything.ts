import "server-only";
import type { Profile } from "@/lib/auth/session";
import { decideApiAccess, gatesNeedFlags, type ApiGate } from "@/lib/auth/api-gate";
import { isAdminLike } from "@/lib/auth/guards";
import { loadMyBlocks } from "@/lib/access/blocks";
import { readFlags, type FlagStatus } from "@/lib/flags";
import { MODULES } from "@/lib/study";
import { NOTES } from "@/lib/learn/notes";
import { QUICK_NOTES, REPLACED_SLUGS } from "@/lib/quick-notes";
import { quickNoteView } from "@/lib/quick-notes/view";
import { MEDS } from "@/lib/meds";
import { referenceIndex } from "@/lib/reference/data";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { CLINICS } from "@/lib/practice/clinic";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import { filterLibrary, getLibraryDocs } from "@/lib/corpus/library";
import { loadMyCourses } from "@/lib/course/mine";
import { loadCourseOverview } from "@/components/course/course-overview";
import { createAdminClient } from "@/lib/supabase/server";
import { createIndex, searchDocs, type SearchDoc } from "./engine";

/**
 * "Search everything" for the website's top bar and the phone app: lectures,
 * course files, Study modules and their sections, revision notes, medicines,
 * the Quick Reference words, practice cases and, for admins, students.
 *
 * Access: each group is offered only when the website would open it for this
 * account (the same decideApiAccess the pages and routes use: lecture-only
 * scope, sections switched off for this student, feature switches). Lectures
 * and files come from the same loaders as the Lectures page, so a locked or
 * later lecture is never found.
 *
 * Postgres has pg_trgm, but almost everything searched lives in code (modules,
 * notes, medicines, the Quick Reference, cases) and the rows that live in the
 * database are few (one cohort's lessons and files), so the index is kept in
 * memory: built once per server for the content, briefly per person for their
 * own lectures. supabase/migrations_pending/2026_11_17_search.sql adds trigram
 * indexes for the day the student list or lesson list grows large.
 */

export type SearchType = "lecture" | "file" | "module" | "section" | "note" | "medicine" | "glossary" | "case" | "student";

/** The order groups show in. */
export const SEARCH_TYPES: readonly SearchType[] = ["lecture", "module", "section", "note", "medicine", "glossary", "case", "file", "student"];

export const SEARCH_LABELS: Record<SearchType, string> = {
  lecture: "Lectures",
  file: "Course files",
  module: "Study modules",
  section: "Topics",
  note: "Revision notes",
  medicine: "Medicines",
  glossary: "Quick Reference",
  case: "Cases",
  student: "Students",
};

export type SearchResult = {
  id: string;
  type: SearchType;
  title: string;
  meta: string;
  /** The website page. */
  href: string;
  /** The phone app screen (an Expo Router path). */
  app: string;
};

export type SearchAnswer = {
  v: 1;
  q: string;
  /** Best first, at most a few of each type. */
  results: SearchResult[];
  /** The groups this account can search (so an empty group is "nothing found", not "not yours"). */
  types: SearchType[];
};

type Doc = SearchDoc & SearchResult & { gate: GateKey };

const e = encodeURIComponent;

const GATE = {
  lectures: { path: "/courses" },
  study: { path: "/study", flag: "learn" },
  notes: { path: "/study/notes", flag: "learn" },
  reference: { path: "/study/reference", flag: "learn" },
  medicines: { path: "/practice/medicines" },
  wwyd: { path: "/practice/scenarios", flag: "learn" },
  clinic: { path: "/practice/detective", flag: "two_minute_clinic" },
  landmark: { path: "/practice/landmark", flag: "landmark" },
  osce: { path: "/practice/osce", flag: "osce" },
  formulation: { path: "/practice/formulation", flag: "formulation" },
  library: { path: "/practice/library", flag: "case_library" },
} as const satisfies Record<string, ApiGate>;
type GateKey = keyof typeof GATE | "admin";

const TYPE_GATES: Record<SearchType, GateKey[]> = {
  lecture: ["lectures"],
  file: ["lectures"],
  module: ["study"],
  section: ["study"],
  note: ["notes"],
  medicine: ["medicines"],
  glossary: ["reference"],
  case: ["wwyd", "clinic", "landmark", "osce", "formulation", "library"],
  student: ["admin"],
};

const doc = (d: Omit<Doc, "meta"> & { meta?: string }): Doc => ({ meta: "", ...d });

/** Everything that lives in code, built once per server. */
function buildContent(): Doc[] {
  const out: Doc[] = [];
  for (const m of MODULES) {
    out.push(doc({ id: `module:${m.id}`, type: "module", gate: "study", title: m.title, meta: `Module ${m.num} · ${m.tagline}`, keywords: [m.tagline], href: `/study/${e(m.id)}`, app: `/study/${e(m.id)}`, boost: 2 }));
    for (const s of m.sections) {
      if (/^(level check|check yourself|module test|q&a bank)/i.test(s.title)) continue;
      out.push(doc({ id: `section:${m.id}:${s.id}`, type: "section", gate: "study", title: s.title, meta: `${m.title} · ${s.num}`, keywords: [m.title], href: `/study/${e(m.id)}/${e(s.id)}`, app: `/study/${e(m.id)}/${e(s.id)}` }));
    }
  }
  for (const n of NOTES) {
    out.push(doc({ id: `note:${n.id}`, type: "note", gate: "notes", title: n.title, meta: n.tagline, keywords: [n.tagline, ...n.sections.map((s) => s.title)], href: `/study/notes/${e(n.id)}`, app: `/notes/${e(n.id)}`, boost: 1 }));
  }
  // Quick Notes: names, headings and the facts strip, so "lithium level" or "Hoover" finds the note.
  for (const n of QUICK_NOTES) {
    const v = quickNoteView(n);
    out.push(doc({ id: `note:${n.id}`, type: "note", gate: "notes", title: n.title, meta: `Quick Note · ${v.typeLabel}`, keywords: [...(n.aka ?? []), ...(n.keywords ?? []), ...v.sections.map((s) => s.title), ...v.facts.map((f) => f.value)], href: `/study/notes/${e(n.id)}`, app: `/notes/${e(n.id)}`, boost: 2 }));
  }
  for (const m of MEDS) {
    out.push(doc({ id: `medicine:${m.id}`, type: "medicine", gate: "medicines", title: m.name, meta: m.cls, keywords: [...m.brands, m.cls, ...m.uses], href: `/practice/medicines/${e(m.id)}`, app: `/medicine/${e(m.id)}`, boost: 1 }));
  }
  const medNames = new Set(MEDS.map((m) => m.name.toLowerCase()));
  try {
    for (const r of referenceIndex({ full: false })) {
      // A medicine already has its own page under Medicines.
      if (r.kind === "medicine" && medNames.has(r.label.toLowerCase())) continue;
      // A card that became a typed Quick Note is found as that note.
      if (r.kind === "disorder" && REPLACED_SLUGS.has(r.slug)) continue;
      const kind = r.kind === "disorder" ? "Disorder" : r.kind === "medicine" ? "Medicine" : "Word";
      out.push(doc({ id: `glossary:${r.slug}`, type: "glossary", gate: "reference", title: r.label, meta: `${kind} · ${r.summary}`, keywords: r.aliases, href: `/study/reference/${e(r.slug)}`, app: `/reference/${e(r.slug)}` }));
    }
  } catch {
    // Search still works without the Quick Reference.
  }
  // Cases: the title and topic only, never the answer.
  const kase = (tool: string, gate: GateKey, web: string, id: string, title: string, meta: string, keywords: string[] = []) =>
    out.push(doc({ id: `case:${tool}:${id}`, type: "case", gate, title, meta, keywords, href: `${web}${web.includes("?") ? "&" : "?"}item=${e(id)}`, app: `/case/${tool}?item=${e(id)}` }));
  for (const c of LANDMARK_CASES) kase("landmark", "landmark", "/practice/landmark", c.id, c.title, "Landmark case", [c.domain]);
  for (const s of SCENARIOS) kase("wwyd", "wwyd", "/practice/scenarios", s.id, s.who, `What would you do · ${s.topic}`, [s.topic]);
  for (const c of CLINICS) kase("two-minute", "clinic", "/practice/detective?mode=clinic", c.id, c.topic, "Two-minute clinic", [c.topic]);
  for (const s of SEED_OSCE_STATIONS) kase("osce", "osce", "/practice/osce", s.id, s.title, "OSCE station");
  for (const f of FORMULATION_CASES) kase("formulation", "formulation", "/practice/formulation", f.id, f.title, `Formulation · ${f.hint}`);
  return out;
}

let content: { docs: Doc[]; index: ReturnType<typeof createIndex<Doc>> } | null = null;
function contentIndex() {
  if (!content) {
    const docs = buildContent();
    content = { docs, index: createIndex(docs) };
  }
  return content.index;
}

// ------------------------------------------------------- per-person rows

const TTL = 60_000;
const lectureCache = new Map<string, { at: number; docs: Doc[] }>();

/** This person's lectures and course files, exactly as their Lectures page lists them (openable ones only). */
async function lectureDocs(profile: Profile, now: number): Promise<Doc[]> {
  const hit = lectureCache.get(profile.id);
  if (hit && now - hit.at < TTL) return hit.docs;
  const out: Doc[] = [];
  const mine = await loadMyCourses(profile, profile.scope);
  const models = await Promise.all(mine.map((c) => loadCourseOverview(c.id, profile).catch(() => null)));
  for (const m of models) {
    if (!m) continue;
    for (const w of m.weeks) {
      for (const l of w.lessons) {
        if (!l.href) continue;
        out.push(doc({ id: `lecture:${l.id}`, type: "lecture", gate: "lectures", title: l.title, meta: `Lecture ${l.number} · Week ${w.num}${models.length > 1 ? ` · ${m.title}` : ""}`, keywords: [m.title], href: l.href, app: `/lecture/${e(l.id)}`, boost: 3 }));
      }
      for (const x of w.materials) {
        if (!x.href) continue;
        out.push(doc({ id: `file:${x.id}`, type: "file", gate: "lectures", title: x.title, meta: `${x.meta ? `${x.meta} · ` : ""}Week ${w.num}`, keywords: [m.title], href: x.href, app: `/material/${e(x.id)}` }));
      }
    }
  }
  lectureCache.set(profile.id, { at: now, docs: out });
  if (lectureCache.size > 500) lectureCache.delete(lectureCache.keys().next().value!);
  return out;
}

let studentCache: { at: number; docs: Doc[] } | null = null;

/** Every student for admins: name, email, roll number, mobile. One light query, shared for a minute. */
async function studentDocs(now: number): Promise<Doc[]> {
  if (studentCache && now - studentCache.at < TTL) return studentCache.docs;
  const { data } = await createAdminClient().from("profiles").select("id, email, name, roll_number, mobile_number").eq("role", "student").limit(5000);
  const docs = (data ?? []).map((p) => {
    const email = String(p.email ?? "");
    const roll = (p.roll_number as string | null) ?? "";
    const id = String(p.id);
    return doc({
      id: `student:${id}`,
      type: "student",
      gate: "admin",
      title: String(p.name ?? "").trim() || email.split("@")[0]!,
      meta: [roll, email].filter(Boolean).join(" · "),
      keywords: [email, email.split("@")[0]!, roll, String(p.mobile_number ?? "")].filter(Boolean),
      href: `/admin/students/${e(id)}`,
      app: `/student/${e(id)}`,
    });
  });
  studentCache = { at: now, docs };
  return docs;
}

// ------------------------------------------------------------- access

/** Which groups this account may search, decided as the website decides each page. */
export async function openGates(profile: Profile): Promise<Set<GateKey>> {
  const gates = Object.entries(GATE) as [keyof typeof GATE, ApiGate][];
  const [blocks, flags] = await Promise.all([
    profile.role === "student" ? loadMyBlocks(profile.id).catch(() => [] as string[]) : Promise.resolve([] as string[]),
    gatesNeedFlags(gates.map(([, g]) => g)) ? readFlags().catch(() => ({}) as Record<string, FlagStatus>) : Promise.resolve({} as Record<string, FlagStatus>),
  ]);
  return gatesFor(profile, blocks, flags);
}

/** Pure: the open groups for a profile, its switched-off sections and the flags. */
export function gatesFor(profile: Pick<Profile, "role" | "scope" | "status">, blocks: readonly string[], flags: Readonly<Record<string, FlagStatus | undefined>>): Set<GateKey> {
  const open = new Set<GateKey>();
  for (const [key, gate] of Object.entries(GATE) as [keyof typeof GATE, ApiGate][]) {
    if (decideApiAccess({ session: "ok", profile, gates: [gate], blocks, flags }).ok) open.add(key);
  }
  if (isAdminLike(profile as Profile)) open.add("admin");
  return open;
}

export function typesFor(open: ReadonlySet<GateKey>): SearchType[] {
  return SEARCH_TYPES.filter((t) => TYPE_GATES[t].some((g) => open.has(g)));
}

// ------------------------------------------------------------- search

const strip = (d: Doc): SearchResult => ({ id: d.id, type: d.type, title: d.title, meta: d.meta, href: d.href, app: d.app });

export function parseTypes(raw: string | null | undefined): SearchType[] | undefined {
  const list = String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is SearchType => (SEARCH_TYPES as readonly string[]).includes(s));
  return list.length ? list : undefined;
}

/** Search everything this person can open. */
export async function searchEverything(profile: Profile, query: string, opts: { types?: SearchType[]; perType?: number; now?: number } = {}): Promise<SearchAnswer> {
  const q = query.trim().slice(0, 80);
  const open = await openGates(profile);
  const allowed = typesFor(open);
  const wanted = opts.types ? allowed.filter((t) => opts.types!.includes(t)) : allowed;
  if (q.length < 2 || !wanted.length) return { v: 1, q, results: [], types: allowed };
  const perType = Math.min(Math.max(opts.perType ?? 6, 1), 20);
  const now = opts.now ?? Date.now();
  const want = new Set(wanted);
  const ok = (d: Doc) => want.has(d.type) && open.has(d.gate);

  const scored: { d: Doc; score: number }[] = [];
  for (const h of contentIndex().search(q, { perType: perType * 4, limit: 400, types: wanted })) if (ok(h.doc)) scored.push({ d: h.doc, score: h.score });

  const [lectures, students, library] = await Promise.all([
    want.has("lecture") || want.has("file") ? lectureDocs(profile, now).catch(() => [] as Doc[]) : Promise.resolve([] as Doc[]),
    want.has("student") && open.has("admin") ? studentDocs(now).catch(() => [] as Doc[]) : Promise.resolve([] as Doc[]),
    want.has("case") && open.has("library") ? caseLibraryDocs(q) : Promise.resolve([] as Doc[]),
  ]);
  for (const h of searchDocs([...lectures, ...students], q, { perType, limit: 200, types: wanted })) if (ok(h.doc)) scored.push({ d: h.doc, score: h.score });
  // The journal-article library matches inside the text too: put it after named cases.
  for (const d of library) scored.push({ d, score: 1 });

  scored.sort((a, b) => b.score - a.score || a.d.title.localeCompare(b.d.title));
  const count = new Map<string, number>();
  const results: SearchResult[] = [];
  for (const { d } of scored) {
    const n = count.get(d.type) ?? 0;
    if (n >= perType) continue;
    count.set(d.type, n + 1);
    results.push(strip(d));
  }
  return { v: 1, q, results, types: allowed };
}

/** The case library (switched off today): its own substring search, a few rows. */
async function caseLibraryDocs(q: string): Promise<Doc[]> {
  try {
    return filterLibrary(await getLibraryDocs(), q)
      .slice(0, 4)
      .map((d) => doc({ id: `case:library:${d.hash}`, type: "case", gate: "library", title: d.title, meta: `Case library · ${d.source}`, href: `/practice/library?q=${e(d.title.slice(0, 60))}`, app: `/case/library` }));
  } catch {
    return [];
  }
}

/** Test hook: forget the per-person caches. */
export function _resetSearchCaches(): void {
  lectureCache.clear();
  studentCache = null;
}
