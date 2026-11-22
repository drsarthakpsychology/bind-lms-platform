/**
 * The one Quick Notes library: typed notes, the one-page summaries, the
 * disorder cards and words of the old Quick reference, and the medicine
 * pages, in one list with one search that reads the text inside every note.
 *
 * Built once per server instance. The list sent to a browser or phone is the
 * compact `QuickItem` row; the full text stays here and answers searches.
 */
import "server-only";
import { NOTES, pick, type Note } from "@/lib/learn/notes";
import { MEDS } from "@/lib/meds";
import { DISORDERS } from "@/lib/reference/disorders";
import { referenceIndex } from "@/lib/reference/data";
import { QUICK_NOTES, REPLACED_SLUGS, TOPIC_LABEL, type Topic } from "./index";
import { quickNoteText, quickNoteView } from "./view";
import type { QuickItem, QuickLibrary, QuickSearch, QuickType } from "./view-types";

const e = encodeURIComponent;
/** An address inside the phone app (expo-router), not a website page. */
const appPath = (screen: string, id: string) => `/${screen}/${e(id)}`;

/** Topic of each one-page summary. */
const SUMMARY_TOPIC: Record<string, Topic> = {
  interview: "assessment", mse: "assessment", defences: "theory", assessment: "assessment", depression: "mood", bipolar: "mood", schizophrenia: "psychosis", anxiety: "anxiety", ocd: "anxiety", suicide: "assessment",
  antidepressants: "medicines", antipsychotics: "medicines", stabilisers: "medicines", therapies: "therapy", personality: "personality", substance: "substance", dementia: "older", child: "child", ptsd: "trauma", eating: "eating",
  casesheet: "assessment", neuroscience: "basics", "how-patients-talk": "basics", "dsm-neurodev": "child", "dsm-psychosis": "psychosis", "dsm-bipolar": "mood", "dsm-depressive": "mood", "dsm-anxiety": "anxiety", "dsm-ocd": "anxiety",
  "dsm-trauma": "trauma", "dsm-dissociative": "body", "dsm-somatic": "body", "dsm-feeding": "eating", "dsm-elimination-sleep": "body", "dsm-sex-gender": "body", "dsm-disruptive": "child", "dsm-substance": "substance", "dsm-ncd": "older", "dsm-personality": "personality", "dsm-paraphilic": "body", "dsm-medication": "medicines",
};

const CHAPTER_TOPIC: [RegExp, Topic][] = [
  [/depress|bipolar/i, "mood"], [/anxiety|obsessive/i, "anxiety"], [/schizo|psychotic/i, "psychosis"], [/trauma/i, "trauma"], [/neurodevelop|disruptive/i, "child"], [/personality/i, "personality"], [/substance/i, "substance"], [/eating/i, "eating"], [/neurocognitive/i, "older"],
];
const chapterTopic = (ch: string): Topic => CHAPTER_TOPIC.find(([re]) => re.test(ch))?.[1] ?? "body";

const TOPIC_ORDER: Topic[] = ["mood", "anxiety", "psychosis", "trauma", "child", "personality", "substance", "eating", "older", "body", "medicines", "therapy", "assessment", "theory", "basics", "law"];
const TYPE_ORDER: QuickType[] = ["criteria", "distinction", "differential", "pharm", "therapy", "theory", "assessment", "summary", "term", "exam"];

const CHIP: Record<QuickType, string> = { criteria: "Criteria", distinction: "Compare", differential: "Differentials", pharm: "Medicines", therapy: "Therapies", theory: "Theories", assessment: "Assessment", summary: "Summaries", term: "Words", exam: "Exam points" };

const cut = (s: string, n = 120) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}...` : s);
const noteText = (n: Note) => [n.title, n.tagline, pick(n.tldr, "student"), pick(n.tldr, "clinician"), ...n.sections.flatMap((s) => [s.title, ...s.points.flatMap((p) => (typeof p === "string" ? [p] : p))]), ...(n.terms ?? []).flat()];

type Doc = { item: QuickItem; title: string; aka: string[]; words: string; lines: string[]; boost: number };
let BUILT: { docs: Doc[]; lib: QuickLibrary } | null = null;

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function build() {
  if (BUILT) return BUILT;
  const docs: Doc[] = [];
  const add = (item: QuickItem, lines: string[], boost = 0) => docs.push({ item, title: norm(item.title), aka: item.aka.map(norm), words: ` ${norm(lines.join(" "))} `, lines, boost });

  for (const n of QUICK_NOTES) {
    const v = quickNoteView(n);
    add({ key: n.id, type: n.type, title: n.title, line: cut(n.oneLine), topic: n.topic, topicLabel: TOPIC_LABEL[n.topic], aka: (n.aka ?? []).slice(0, 8), href: `/study/notes/${e(n.id)}`, app: appPath("notes", n.id), ...(n.links.moduleId ? { moduleId: n.links.moduleId } : {}), ...(n.links.summaryId ? { summaryId: n.links.summaryId } : {}) }, [...quickNoteText(v), ...(n.keywords ?? [])], 2);
  }
  for (const n of NOTES) {
    const topic = SUMMARY_TOPIC[n.id] ?? "basics";
    add({ key: `note:${n.id}`, type: "summary", title: n.title.replace(/&/g, "and"), line: cut(n.tagline), topic, topicLabel: TOPIC_LABEL[topic], aka: [], href: `/study/notes/${e(n.id)}`, app: appPath("notes", n.id) }, noteText(n), 1);
  }
  const disorder = new Map(DISORDERS.map((d) => [d.slug, d]));
  for (const r of referenceIndex({ full: false })) {
    if (r.kind === "medicine") continue; // medicines come from the medicine pages below
    if (r.kind === "disorder") {
      if (REPLACED_SLUGS.has(r.slug)) continue; // a typed criteria note holds it now
      const d = disorder.get(r.slug);
      const topic = d ? chapterTopic(d.chapter) : "body";
      const lines = d ? [d.name, ...(d.aka ?? []), d.core, d.chapter, ...d.features, ...d.criteria, d.duration, ...d.lookAlikes.flatMap((l) => [l.name, l.tell]), ...d.firstLine, ...(d.keywords ?? [])] : [r.label, r.summary];
      add({ key: `ref:${r.slug}`, type: "criteria", title: r.label, line: cut(r.summary), topic, topicLabel: TOPIC_LABEL[topic], aka: r.aliases, href: `/study/reference/${e(r.slug)}`, app: appPath("reference", r.slug) }, lines, 1);
    } else {
      add({ key: `ref:${r.slug}`, type: "term", title: r.label, line: cut(r.summary), topic: "basics", topicLabel: "Words", aka: r.aliases, href: `/study/reference/${e(r.slug)}`, app: appPath("reference", r.slug) }, [r.label, ...r.aliases, r.summary]);
    }
  }
  for (const m of MEDS) {
    add({ key: `med:${m.id}`, type: "pharm", title: m.name, line: cut(m.cls), topic: "medicines", topicLabel: TOPIC_LABEL.medicines, aka: m.brands.slice(0, 4), href: `/practice/medicines/${e(m.id)}`, app: appPath("medicine", m.id) }, [m.name, m.cls, ...m.brands, ...m.uses, m.student, ...m.standout]);
  }

  const items = docs.map((d) => d.item);
  const present = new Set(items.map((i) => i.type));
  const topics = new Set(items.map((i) => i.topic));
  const lib: QuickLibrary = {
    items,
    types: TYPE_ORDER.filter((t) => present.has(t)).map((id) => ({ id, label: CHIP[id] })),
    topics: [...TOPIC_ORDER.filter((t) => topics.has(t)).map((id) => ({ id, label: id === "basics" ? "Basics and words" : TOPIC_LABEL[id] }))],
  };
  BUILT = { docs, lib };
  return BUILT;
}

export function quickLibrary(): QuickLibrary {
  return build().lib;
}

/** The line inside a note that best shows why it matched. */
function snippet(d: Doc, words: string[]): string | null {
  let best: string | null = null;
  let bestN = 0;
  for (const l of d.lines) {
    const t = ` ${norm(l)} `;
    const n = words.filter((w) => t.includes(` ${w}`)).length;
    if (n > bestN) {
      best = l;
      bestN = n;
      if (n === words.length) break;
    }
  }
  if (!best || norm(best) === d.title) return null;
  return cut(best, 110);
}

/**
 * Search every word in every note. All words must appear (the last may be a
 * prefix); title and other names rank first, then section words, then body.
 */
export function searchQuick(raw: string, limit = 40): QuickSearch {
  const q = norm(raw).slice(0, 80);
  if (!q) return { q: "", hits: [] };
  const words = q.split(" ").filter(Boolean).slice(0, 6);
  const scored: { d: Doc; s: number }[] = [];
  for (const d of build().docs) {
    let s = 0;
    let all = true;
    for (const [i, w] of words.entries()) {
      const last = i === words.length - 1;
      const inTitle = ` ${d.title}`.includes(` ${w}`);
      const inAka = d.aka.some((a) => ` ${a}`.includes(` ${w}`));
      const inBody = last ? d.words.includes(` ${w}`) : d.words.includes(` ${w} `) || d.words.includes(` ${w}s `);
      if (!(inTitle || inAka || inBody)) {
        all = false;
        break;
      }
      s += inTitle ? 10 : inAka ? 6 : 1;
    }
    if (!all) continue;
    if (d.title === q) s += 40;
    else if (d.title.startsWith(q)) s += 15;
    if (d.aka.includes(q)) s += 25;
    scored.push({ d, s: s + d.boost });
  }
  scored.sort((a, b) => b.s - a.s || a.d.item.title.localeCompare(b.d.item.title));
  return { q: raw.slice(0, 80), hits: scored.slice(0, limit).map(({ d }) => ({ key: d.item.key, snippet: snippet(d, words) })) };
}
