import type { Block, BoxKind, Card, Level, ListItem, Mcq, Section, WidgetData, WidgetKind } from "./types";

/**
 * A small Markdown dialect for course chapters, so content stays easy to write
 * and edit:
 *
 *   # Part II · The mental status examination      → part label for what follows
 *   ## 2.3 Mood and affect [core]                  → a section (one page)
 *   ### Sub-heading
 *   Paragraph lines (joined until a blank line). **bold**, *italic*.
 *   - bullet            (indent two spaces to nest)
 *   1. numbered
 *   | table | header |  then |---|---| and rows
 *   :::define Optional title   … :::   (define, word, trap, mnemonic, example,
 *                                       sounds, analogy, note, safety)
 *   :::recall   1. Question || optional answer   :::
 *   :::viva     Question :: Answer               :::
 *   :::mcq      Q: …  - option  - *correct  > why   (blank line between) :::
 */

const BOXES = new Set<BoxKind>(["define", "word", "trap", "mnemonic", "example", "sounds", "analogy", "note", "safety"]);
const WIDGETS = new Set<WidgetKind>(["guess", "decide", "sort", "build", "moodline", "worked", "synapse", "reveal", "flow", "curve", "layers", "brainmap", "journey", "neuron", "pathways", "receptor", "conditioning", "memoryflow", "stress", "timeline", "compare", "attention", "dissonance", "conservation", "experiment", "release", "thoughtrecord", "hypnogram", "strange", "illusion", "nervoussystem"]);

export function slugNum(num: string): string {
  return num.replace(/\./g, "-").toLowerCase();
}

export function countWords(blocks: Block[]): number {
  let n = 0;
  const w = (s: string) => (n += s.split(/\s+/).filter(Boolean).length);
  const li = (items: ListItem[]) => items.forEach((i) => (w(i.text), i.children && li(i.children)));
  for (const b of blocks) {
    if (b.t === "p" || b.t === "h3") w(b.text);
    else if (b.t === "ul" || b.t === "ol") li(b.items);
    else if (b.t === "table") [b.head, ...b.rows].forEach((r) => r.forEach(w));
    else if (b.t === "box") n += countWords(b.blocks) + (b.title ? b.title.split(/\s+/).length : 0);
    else if (b.t === "recall" || b.t === "viva") b.items.forEach((c) => (w(c.q), w(c.a)));
    else if (b.t === "mcq") b.items.forEach((m) => (w(m.q), m.options.forEach(w), m.why && w(m.why)));
    else if (b.t === "view") n += countWords(b.blocks);
    else if (b.t === "qa") n += countWords(b.blocks) + b.q.split(/\s+/).length;
    else if (b.t === "widget") n += JSON.stringify(b.data).split(/\s+/).length * 0.6;
  }
  return n;
}

function parseList(lines: string[], start: number, ordered: boolean): { items: ListItem[]; next: number } {
  const re = ordered ? /^(\s*)\d+[.)]\s+(.*)$/ : /^(\s*)[-*]\s+(.*)$/;
  const root: ListItem[] = [];
  const stack: { indent: number; items: ListItem[] }[] = [{ indent: 0, items: root }];
  let i = start;
  for (; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(re) ?? line.match(/^(\s+)(?:[-*]|\d+[.)])\s+(.*)$/);
    if (!m) {
      // Continuation line (indented, non-empty) joins the previous item.
      if (/^\s{2,}\S/.test(line) && stack.at(-1)!.items.length) {
        const last = stack.at(-1)!.items.at(-1)!;
        last.text += " " + line.trim();
        continue;
      }
      break;
    }
    const indent = m[1].length;
    const item: ListItem = { text: m[2].trim() };
    while (stack.length > 1 && indent < stack.at(-1)!.indent) stack.pop();
    const top = stack.at(-1)!;
    if (indent > top.indent && top.items.length) {
      const parent = top.items.at(-1)!;
      parent.children = parent.children ?? [];
      parent.children.push(item);
      stack.push({ indent, items: parent.children });
    } else {
      top.items.push(item);
    }
  }
  return { items: root, next: i };
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function parseCards(body: string[], sep: string): Card[] {
  return body
    .map((l) => l.replace(/^\s*(?:\d+[.)]|[-*])\s+/, "").trim())
    .filter(Boolean)
    .map((l) => {
      const k = l.indexOf(sep);
      return k < 0 ? { q: l, a: "" } : { q: l.slice(0, k).trim(), a: l.slice(k + sep.length).trim() };
    });
}

function parseMcqs(body: string[]): Mcq[] {
  const out: Mcq[] = [];
  let cur: Mcq | null = null;
  for (const raw of body) {
    const l = raw.trim();
    if (!l) continue;
    if (/^Q:/i.test(l)) {
      if (cur) out.push(cur);
      cur = { q: l.replace(/^Q:\s*/i, ""), options: [], answer: -1 };
    } else if (cur && /^[-*]\s+/.test(l)) {
      let o = l.replace(/^[-*]\s+/, "");
      if (o.startsWith("*") && !o.startsWith("**")) {
        o = o.slice(1).trim();
        cur.answer = cur.options.length;
      }
      cur.options.push(o);
    } else if (cur && l.startsWith(">")) {
      cur.why = (cur.why ? cur.why + " " : "") + l.replace(/^>\s*/, "");
    } else if (cur) {
      cur.q += " " + l;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** Parse a run of lines into blocks (used for sections and inside boxes). */
export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ t: "p", text: para.join(" ") });
    para = [];
  };
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      i++;
      continue;
    }
    const box = trimmed.match(/^:::(\w+)\s*(.*)$/);
    if (box) {
      flush();
      const kind = box[1];
      const title = box[2]?.trim() || undefined;
      const body: string[] = [];
      let depth = 1;
      i++;
      for (; i < lines.length; i++) {
        const tl = lines[i].trim();
        if (/^:::\w+/.test(tl)) depth++;
        else if (tl === ":::") {
          depth--;
          if (depth === 0) break;
        }
        body.push(lines[i]);
      }
      i++; // skip closing :::
      if (kind === "recall") blocks.push({ t: "recall", items: parseCards(body, "||") });
      else if (kind === "viva") blocks.push({ t: "viva", items: parseCards(body, "::") });
      else if (kind === "mcq") blocks.push({ t: "mcq", items: parseMcqs(body) });
      else if (kind === "qa") {
        const m = (title ?? "").match(/^(.*?)\s*(?:\[(starting|beginner|advanced)\])?\s*$/);
        const q = (m?.[1] ?? "").trim();
        if (!q) throw new Error("A :::qa block needs the question on the same line");
        blocks.push({ t: "qa", q, level: m?.[2] as Level | undefined, blocks: parseBlocks(body) });
      } else if (kind === "student" || kind === "clinician") blocks.push({ t: "view", view: kind, blocks: parseBlocks(body) });
      else if (kind === "widget") {
        const wk = (title ?? "") as WidgetKind;
        if (!WIDGETS.has(wk)) throw new Error(`Unknown widget :::widget ${title}`);
        let data: WidgetData;
        try {
          data = JSON.parse(body.join("\n")) as WidgetData;
        } catch (e) {
          throw new Error(`Bad JSON in :::widget ${wk}: ${(e as Error).message}\n${body.join("\n").slice(0, 200)}`);
        }
        blocks.push({ t: "widget", kind: wk, data });
      } else if (BOXES.has(kind as BoxKind)) blocks.push({ t: "box", kind: kind as BoxKind, title, blocks: parseBlocks(body) });
      else throw new Error(`Unknown block :::${kind}`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flush();
      blocks.push({ t: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith("|")) {
      flush();
      const rows: string[][] = [];
      for (; i < lines.length && lines[i].trim().startsWith("|"); i++) {
        if (/^\|?\s*:?-{2,}/.test(lines[i].trim())) continue;
        rows.push(cells(lines[i]));
      }
      const [head, ...rest] = rows;
      blocks.push({ t: "table", head, rows: rest });
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) && !/^\*\*/.test(trimmed)) {
      flush();
      const { items, next } = parseList(lines, i, false);
      blocks.push({ t: "ul", items });
      i = next;
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flush();
      const { items, next } = parseList(lines, i, true);
      blocks.push({ t: "ol", items });
      i = next;
      continue;
    }
    para.push(trimmed);
    i++;
  }
  flush();
  return blocks;
}

/** Split a module's text into sections at "## " headings, tracking "# Part" labels. */
export function parseModule(src: string): Section[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const sections: Section[] = [];
  let part: string | undefined;
  let cur: { num: string; title: string; tag?: "core" | "extra"; level?: Level; part?: string; lines: string[] } | null = null;
  const close = () => {
    if (!cur) return;
    const blocks = parseBlocks(cur.lines);
    sections.push({
      id: slugNum(cur.num),
      num: cur.num,
      title: cur.title,
      tag: cur.tag,
      level: cur.level,
      levelCheck: levelCheckOf(cur.title, blocks),
      part: cur.part,
      blocks,
      words: countWords(blocks),
      // The module test is the section titled "Module test". Other sections
      // may hold case questions too; those feed the checkpoints instead.
      isTest: /^module test$/i.test(cur.title.trim()) && blocks.some((b) => b.t === "mcq"),
    });
  };
  for (const line of lines) {
    if (/^# /.test(line)) {
      close();
      cur = null;
      part = line.slice(2).trim();
      continue;
    }
    const h = line.match(/^## (\S+)\s+(.*?)\s*((?:\[(?:core|extra|starting|beginner|advanced)\]\s*)*)$/);
    if (h) {
      close();
      const tags = [...h[3].matchAll(/\[(\w+)\]/g)].map((t) => t[1]);
      const tag = tags.find((t) => t === "core" || t === "extra") as "core" | "extra" | undefined;
      const level = tags.find((t) => t === "starting" || t === "beginner" || t === "advanced") as Level | undefined;
      cur = { num: h[1], title: h[2], tag, level, part, lines: [] };
      continue;
    }
    if (cur) cur.lines.push(line);
  }
  close();
  return sections;
}

/** "Level check · Starting" (with MCQs) is the gate that opens the next level. */
function levelCheckOf(title: string, blocks: Block[]): Level | undefined {
  const m = title.match(/^level check\s*[·:-]\s*(starting|beginner|advanced)/i);
  return m && blocks.some((b) => b.t === "mcq") ? (m[1].toLowerCase() as Level) : undefined;
}

/** Study minutes for a section: careful reading (about 110 words a minute) plus recall time. */
export function sectionMinutes(s: Section): number {
  const widgetMin = (b: Block): number =>
    b.t === "widget" ? (b.kind === "decide" ? 3 : b.kind === "worked" ? 4 : b.kind === "build" || b.kind === "sort" || b.kind === "curve" || b.kind === "journey" || b.kind === "pathways" || b.kind === "timeline" || b.kind === "conditioning" || b.kind === "attention" || b.kind === "dissonance" || b.kind === "experiment" || b.kind === "release" || b.kind === "thoughtrecord" || b.kind === "hypnogram" || b.kind === "strange" || b.kind === "nervoussystem" ? 3 : 2) : b.t === "qa" ? 3 : b.t === "view" || b.t === "box" ? b.blocks.reduce((a, x) => a + widgetMin(x), 0) : 0;
  const recall = s.blocks.reduce((a, b) => a + (b.t === "recall" ? b.items.length * 1.5 : b.t === "mcq" ? b.items.length * 1 : b.t === "viva" ? b.items.length * 0.5 : 0) + widgetMin(b), 0);
  return Math.max(3, Math.round(s.words / 110 + recall));
}
