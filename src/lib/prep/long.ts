/**
 * Long answers in Exam Prep: the hand-written long questions (LongQA) and the
 * fully developed Q&As from the Study modules, in one shape, grouped by
 * subject and topic. Also the answer format (headings, bullets, tables) and
 * the self-mark count. Pure: the live lists are built in long-server.ts.
 */
import type { Block, Level, ListItem, StudyModule } from "@/lib/study/types";
import { SUBJECT_MODULE } from "./catalog";
import type { LongQA } from "./long-types";
import { MORE, TOPIC_GROUPS, groupOf, groupTitle } from "./topics";
import { SUBJECTS, type PrepVisual, type Subject } from "./types";

export type Marks = LongQA["marks"];
export type LongDifficulty = LongQA["difficulty"];

/** One long answer as Exam Prep shows it, whichever source it came from. */
export type LongItem = {
  id: string;
  source: "prep" | "study";
  subject: Subject;
  /** Topic id within the subject (a bank topic, or "m-<module>" for a Study module). */
  topic: string;
  topicTitle: string;
  marks: Marks;
  difficulty: LongDifficulty;
  /** Study level, for Study Q&As. */
  level?: Level;
  question: string;
  /** The model plan: short steps (hand-written) or the answer's own headings (Study). */
  plan: string[];
  /** The model answer as blocks (Study's own, or parsed from the hand-written text). */
  blocks: Block[];
  keyPoints: string[];
  pitfalls?: string[];
  visuals?: PrepVisual[];
  /** Back to the Study section it comes from, or where to learn it. */
  studyHref: string | null;
  /** The Study module's title, for "From Study: ..." lines. */
  studyTitle?: string;
};

/** Long answers listed per page. */
export const LONG_PAGE = 10;

export const DIFFICULTY_WORD: Record<LongDifficulty, string> = { 1: "Easy", 2: "Medium", 3: "Hard", 4: "Very hard" };
export const LEVEL_WORD: Record<Level, string> = { starting: "Starting", beginner: "Beginner", advanced: "Advanced" };

/* ------------------------------------------------------ answer format */

const plain = (s: string) => s.replace(/\*\*|`/g, "").replace(/\*(?!\s)(.+?)\*/g, "$1").trim();

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

const isRule = (line: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line.trim());

/**
 * The hand-written answer format as Study blocks: "## " (or "### ") lines are
 * headings, "- " lines bullets, "1. " lines a numbered list, "|" lines a
 * table (the first row is the header; "|---|" rows are skipped), anything
 * else paragraphs (a blank line ends one).
 */
export function parseLongAnswer(text: string): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: ListItem[] } | null = null;
  let table: string[][] | null = null;
  const flush = () => {
    if (para.length) out.push({ t: "p", text: para.join(" ") });
    para = [];
    if (list) out.push({ t: list.ordered ? "ol" : "ul", items: list.items });
    list = null;
    if (table?.length) out.push({ t: "table", head: table[0], rows: table.slice(1) });
    table = null;
  };
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const h = line.match(/^#{2,3}\s+(.*)$/);
    if (h) {
      flush();
      out.push({ t: "h3", text: h[1].trim() });
      continue;
    }
    if (line.startsWith("|")) {
      if (!table) flush();
      if (!isRule(line)) (table ??= []).push(splitRow(line));
      continue;
    }
    const b = line.match(/^[-*]\s+(.*)$/);
    const n = line.match(/^\d+[.)]\s+(.*)$/);
    if (b || n) {
      const ordered = !b;
      if (!list || list.ordered !== ordered || para.length || table) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push({ text: (b ?? n)![1].trim() });
      continue;
    }
    if (list || table) flush();
    para.push(line);
  }
  flush();
  return out;
}

/** The headings of an answer, in order (for placing diagrams and for the Study plan). */
export function headingsOf(blocks: readonly Block[]): string[] {
  return blocks.flatMap((b) => (b.t === "h3" ? [plain(b.text)] : []));
}

/* ------------------------------------------------------- self-marking */

/** "You covered 5 of 7", from the key points ticked (unknown or repeated ticks are ignored). */
export function selfMark(total: number, ticked: Iterable<number>): { covered: number; total: number; text: string } {
  const set = new Set<number>();
  for (const i of ticked) if (Number.isInteger(i) && i >= 0 && i < total) set.add(i);
  return { covered: set.size, total, text: `You covered ${set.size} of ${total}` };
}

/* ------------------------------------------------- Study Q&As → items */

const SENTENCE = /^(.+?[.!?])(\s|$)/;

function firstSentence(s: string, max = 150): string {
  const t = plain(s);
  const one = t.match(SENTENCE)?.[1] ?? t;
  if (one.length <= max) return one;
  const cut = one.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}

/** A list item as a key point: "Label: first part" when it opens with a bold label, else its first sentence. */
function itemPoint(text: string): string {
  const m = text.match(/^\*\*(.+?)\*\*[:.]?\s*(.*)$/);
  if (m) {
    const label = plain(m[1]).replace(/[.:]+$/, "");
    const rest = m[2] ? firstSentence(m[2], 100) : "";
    return rest ? `${label}: ${rest}` : label;
  }
  return firstSentence(text);
}

const SHORT_ANSWER = /^(short answer|in one line|the answer in one line)$/i;

/**
 * What an examiner would look for in a Study answer, 3 to 8 points: the short
 * answer's first sentence, each list point, what a table compares, then the
 * remaining headings if there are still too few.
 */
export function studyKeyPoints(blocks: readonly Block[], max = 8): string[] {
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.trim();
    if (t && !out.includes(t)) out.push(t);
  };
  let afterShort = false;
  for (const b of blocks) {
    if (out.length >= max) break;
    if (b.t === "h3") {
      afterShort = SHORT_ANSWER.test(plain(b.text));
      continue;
    }
    if (b.t === "p" && afterShort) {
      add(firstSentence(b.text));
      afterShort = false;
    } else if (b.t === "ul" || b.t === "ol") {
      for (const it of b.items) if (out.length < max) add(itemPoint(it.text));
    } else if (b.t === "table") {
      const labels = b.rows.map((r) => plain(r[0] ?? "")).filter(Boolean);
      if (labels.length) add(`Compares ${labels.slice(0, 4).join(", ")}`);
    }
  }
  if (out.length < 3) for (const h of headingsOf(blocks)) if (out.length < max && !SHORT_ANSWER.test(h)) add(h);
  return out.slice(0, max);
}

function words(blocks: readonly Block[]): number {
  let n = 0;
  const count = (s: string) => (n += s.split(/\s+/).filter(Boolean).length);
  const items = (xs: ListItem[]) => xs.forEach((x) => (count(x.text), x.children && items(x.children)));
  for (const b of blocks) {
    if (b.t === "p" || b.t === "h3") count(b.text);
    else if (b.t === "ul" || b.t === "ol") items(b.items);
    else if (b.t === "table") b.rows.forEach((r) => r.forEach(count));
    else if (b.t === "box" || b.t === "view") n += words(b.blocks);
  }
  return n;
}

const LEVEL_MARKS: Record<Level, Marks> = { starting: 5, beginner: 10, advanced: 15 };
const LEVEL_DIFFICULTY: Record<Level, LongDifficulty> = { starting: 1, beginner: 2, advanced: 3 };

/** Marks for a Study Q&A: what the question says ("(5 marks)"), else its level, else its length. */
export function studyMarks(question: string, level: Level | undefined, blocks: readonly Block[]): Marks {
  const said = Number(question.match(/\((\d+)\s*marks?\)/i)?.[1] ?? question.match(/(\d+)\s*marks?/i)?.[1]);
  if (said === 5 || said === 10 || said === 15 || said === 20) return said;
  if (level) return LEVEL_MARKS[level];
  const n = words(blocks);
  return n < 180 ? 5 : n < 420 ? 10 : 15;
}

export const studyDifficulty = (level: Level | undefined): LongDifficulty => (level ? LEVEL_DIFFICULTY[level] : 2);

/** A short stable id from text (FNV-1a, base 36). */
export function shortHash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export type StudyQA = { module: string; moduleTitle: string; section: string; q: string; level?: Level; blocks: Block[] };

/** Every :::qa block in the modules (also inside reading-view blocks), in course order. */
export function collectStudyQAs(modules: readonly StudyModule[]): StudyQA[] {
  const out: StudyQA[] = [];
  const walk = (m: StudyModule, sec: string, bs: readonly Block[]) => {
    for (const b of bs) {
      if (b.t === "qa") out.push({ module: m.id, moduleTitle: m.title, section: sec, q: b.q, level: b.level, blocks: b.blocks });
      else if (b.t === "view" || b.t === "box") walk(m, sec, b.blocks);
    }
  };
  for (const m of modules) for (const s of m.sections) walk(m, s.id, s.blocks);
  return out;
}

/**
 * Study modules that feed long answers but are not in SUBJECT_MODULE (that map
 * is also where "Learn this" goes, so it stays as it is). Every disorder module
 * feeds Psychopathology; the case sheet and new research feed Clinical
 * psychiatry; psychodynamics and defences feed Personality theories.
 */
export const LONG_EXTRA_MODULES: Partial<Record<Subject, readonly string[]>> = {
  psychopathology: ["depression", "bipolar", "anxiety", "ocd", "psychosis", "trauma", "suicide", "substance", "personality", "neurocognitive", "more-disorders"],
  "clinical-psychiatry": ["case-sheet", "frontiers"],
  "personality-theories": ["psychodynamics", "defences"],
};

/** Where a subject's long answers come from: its SUBJECT_MODULE entries ("module" or "module/section"), then the extras. */
export function longSources(subject: Subject): string[] {
  return [...new Set([...SUBJECT_MODULE[subject], ...(LONG_EXTRA_MODULES[subject] ?? [])])];
}

const matches = (target: string, qa: StudyQA) => {
  const [mod, sec] = target.split("/");
  return mod === qa.module && (!sec || sec === qa.section);
};

/** The bank topic a Study section or module teaches, if one names it; else the module as its own topic. */
function studyTopic(subject: Subject, qa: StudyQA): { id: string; title: string } {
  const groups = TOPIC_GROUPS[subject];
  const exact = groups.find((g) => g.learn.includes(`${qa.module}/${qa.section}`));
  if (exact) return { id: exact.id, title: exact.title };
  return { id: `m-${qa.module}`, title: qa.moduleTitle };
}

/**
 * Study Q&As as long answers, per subject: a Q&A shows under every subject
 * whose sources name its module (or its module and section). A Q&A is listed
 * once per subject.
 */
export function studyLongItems(qas: readonly StudyQA[], sources: (s: Subject) => readonly string[] = longSources): LongItem[] {
  const out: LongItem[] = [];
  for (const subject of SUBJECTS) {
    const targets = sources(subject);
    for (const qa of qas) {
      if (!targets.some((t) => matches(t, qa))) continue;
      const topic = studyTopic(subject, qa);
      out.push({
        id: `st-${qa.module}-${qa.section}-${shortHash(qa.q)}`,
        source: "study",
        subject,
        topic: topic.id,
        topicTitle: topic.title,
        marks: studyMarks(qa.q, qa.level, qa.blocks),
        difficulty: studyDifficulty(qa.level),
        ...(qa.level ? { level: qa.level } : {}),
        question: plain(qa.q),
        plan: headingsOf(qa.blocks),
        blocks: qa.blocks,
        keyPoints: studyKeyPoints(qa.blocks),
        studyHref: `/study/${qa.module}/${qa.section}`,
        studyTitle: qa.moduleTitle,
      });
    }
  }
  return out;
}

/** A hand-written long answer as an item, in its bank topic. */
export function prepLongItem(q: LongQA, subjectTitle: string, learnHref: string | null): LongItem {
  const topic = groupOf(q.subject, q.topic, q.module);
  return {
    id: q.id,
    source: "prep",
    subject: q.subject,
    topic,
    topicTitle: groupTitle(q.subject, topic, subjectTitle),
    marks: q.marks,
    difficulty: q.difficulty,
    question: q.question,
    plan: q.plan,
    blocks: parseLongAnswer(q.answer),
    keyPoints: q.keyPoints,
    ...(q.pitfalls?.length ? { pitfalls: q.pitfalls } : {}),
    ...(q.visuals?.length ? { visuals: q.visuals } : {}),
    studyHref: learnHref,
  };
}

export type LongTopic = { id: string; title: string; items: LongItem[] };

/**
 * One subject's long answers by topic: bank topics in their written order
 * (hand-written answers first, then Study's), then Study module topics in
 * source order, "More" last. Inside a topic: hand-written first, then by
 * level (starting, beginner, advanced), keeping course order.
 */
export function longTopics(subject: Subject, items: readonly LongItem[]): LongTopic[] {
  const mine = items.filter((x) => x.subject === subject);
  const order = [...TOPIC_GROUPS[subject].map((g) => g.id), ...longSources(subject).map((t) => `m-${t.split("/")[0]}`), MORE];
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i < 0 ? order.length : i;
  };
  const lv = (x: LongItem) => (x.source === "prep" ? -1 : x.level ? ["starting", "beginner", "advanced"].indexOf(x.level) : 3);
  const by = new Map<string, LongTopic>();
  for (const x of mine) {
    const t = by.get(x.topic) ?? { id: x.topic, title: x.topicTitle, items: [] };
    t.items.push(x);
    by.set(x.topic, t);
  }
  return [...by.values()]
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map((t) => ({ ...t, items: t.items.map((x, i) => ({ x, i })).sort((a, b) => lv(a.x) - lv(b.x) || a.i - b.i).map((p) => p.x) }));
}

/** One page of a list (pages count from 1; out of range clamps). */
export function pageSlice<T>(list: readonly T[], page: number, size = LONG_PAGE): { items: T[]; page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(list.length / size));
  const p = Math.min(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1), pages);
  return { items: list.slice((p - 1) * size, p * size), page: p, pages };
}
