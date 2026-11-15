import type { AppTarget, MessageBlock, MessageSpan } from "./contract";
import { toAppTarget } from "./target";

/**
 * A notification's cleaned HTML (sanitizeRich: p, br, strong, b, em, i, u,
 * h2, h3, ul, ol, li, a, blockquote, hr) turned into MessageBlock[] for the
 * app, which draws text natively and never renders HTML. Pure.
 */

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };
const decode = (s: string) =>
  s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+\d*);/gi, (m, e: string) => {
    const k = e.toLowerCase();
    if (ENTITIES[k] !== undefined) return ENTITIES[k];
    if (k.startsWith("#x")) return String.fromCodePoint(parseInt(k.slice(2), 16) || 32);
    if (k.startsWith("#")) return String.fromCodePoint(parseInt(k.slice(1), 10) || 32);
    return m;
  });

const SITE_HOSTS = /^(www\.)?vibhapsychology\.com$/i;

/** A link inside a message: our own pages become app targets, anything else stays an outside address. */
export function linkOf(href: string): { target: AppTarget | null; url: string | null } {
  const h = href.trim();
  if (h.startsWith("/") && !h.startsWith("//")) return { target: toAppTarget(h), url: null };
  try {
    const u = new URL(h);
    if (u.protocol !== "https:" && u.protocol !== "http:" && u.protocol !== "mailto:" && u.protocol !== "tel:") return { target: null, url: null };
    if ((u.protocol === "https:" || u.protocol === "http:") && SITE_HOSTS.test(u.hostname)) return { target: toAppTarget(u.pathname + u.search), url: u.toString() };
    return { target: null, url: u.toString() };
  } catch {
    return { target: null, url: null };
  }
}

export function htmlToBlocks(html: string): { content: MessageBlock[]; links: { label: string; target: AppTarget | null; url: string | null }[] } {
  const content: MessageBlock[] = [];
  const links: { label: string; target: AppTarget | null; url: string | null }[] = [];
  let cur: { t: "p" | "h"; spans: MessageSpan[] } | null = null;
  let list: { t: "ul" | "ol"; items: MessageSpan[][] } | null = null;
  let item: MessageSpan[] | null = null;
  let bold = 0;
  let italic = 0;
  let link: { target: AppTarget | null; url: string | null; label: string } | null = null;

  const closeBlock = () => {
    if (cur) {
      trim(cur.spans);
      if (cur.spans.length) content.push(cur);
    }
    cur = null;
  };
  const closeList = () => {
    if (list) {
      if (item) list.items.push(item);
      list.items = list.items.map((i) => (trim(i), i)).filter((i) => i.length);
      if (list.items.length) content.push(list);
    }
    list = null;
    item = null;
  };
  const push = (text: string) => {
    if (!text) return;
    let target: MessageSpan[];
    if (list) {
      if (!item) item = [];
      target = item;
    } else {
      if (!cur) cur = { t: "p", spans: [] };
      target = cur.spans;
    }
    const span: MessageSpan = { text };
    if (bold) span.bold = true;
    if (italic) span.italic = true;
    if (link) {
      span.link = { target: link.target, url: link.url };
      link.label += text;
    }
    const last = target[target.length - 1];
    if (last && last.bold === span.bold && last.italic === span.italic && JSON.stringify(last.link) === JSON.stringify(span.link)) last.text += text;
    else target.push(span);
  };

  const re = /<(\/?)([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[4] !== undefined) {
      const text = decode(m[4]).replace(/\s+/g, " ");
      if (text.trim() || (cur && (cur as { spans: MessageSpan[] }).spans.length) || item) push(text);
      continue;
    }
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    switch (tag) {
      case "p":
      case "blockquote":
        if (list) break;
        closeBlock();
        if (!closing) cur = { t: "p", spans: [] };
        break;
      case "h2":
      case "h3":
        closeList();
        closeBlock();
        if (!closing) cur = { t: "h", spans: [] };
        break;
      case "ul":
      case "ol":
        if (closing) closeList();
        else {
          closeBlock();
          closeList();
          list = { t: tag, items: [] };
        }
        break;
      case "li":
        if (!list) list = { t: "ul", items: [] };
        if (!closing) {
          if (item) list.items.push(item);
          item = [];
        }
        break;
      case "br":
        push("\n");
        break;
      case "hr":
        closeList();
        closeBlock();
        break;
      case "strong":
      case "b":
        bold = Math.max(0, bold + (closing ? -1 : 1));
        break;
      case "em":
      case "i":
        italic = Math.max(0, italic + (closing ? -1 : 1));
        break;
      case "a":
        if (closing) {
          if (link) links.push({ label: link.label.trim() || "Open", target: link.target, url: link.url });
          link = null;
        } else {
          const href = /href\s*=\s*"([^"]*)"|href\s*=\s*'([^']*)'/i.exec(m[3]);
          const l = linkOf(decode(href?.[1] ?? href?.[2] ?? ""));
          link = l.target || l.url ? { ...l, label: "" } : null;
        }
        break;
      default:
        break;
    }
  }
  closeList();
  closeBlock();
  return { content, links };
}

function trim(spans: MessageSpan[]) {
  while (spans.length && !spans[0].text.trim()) spans.shift();
  while (spans.length && !spans[spans.length - 1].text.trim()) spans.pop();
  if (spans.length) {
    spans[0].text = spans[0].text.replace(/^[ \t]+/, "");
    spans[spans.length - 1].text = spans[spans.length - 1].text.replace(/[ \t]+$/, "");
  }
}
