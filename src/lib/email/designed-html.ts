/**
 * Designed emails: an admin pastes (or uploads) a full HTML email made in an
 * email design tool. Unlike the formatted editor (rich-html.ts), the design is
 * kept: inline styles, <style> blocks, tables, https images and links. What
 * could run code or send data is taken out:
 *   - script, iframe, object, embed, applet, svg, math, noscript, template,
 *     select, textarea and the like (with what is inside them),
 *   - form, input, button, base, link and refresh tags (the tag only),
 *   - every on... event attribute, srcdoc, formaction,
 *   - links that are not web, email or phone links (javascript:, data:, ...),
 *   - images that are not on https, and unsafe CSS (expression(), @import,
 *     url() that is not https, behaviour bindings).
 * Pure and DOM-free, so the browser preview and the server send use the same
 * code. The server always cleans again: the page is never trusted.
 */
import { escapeHtml, htmlToPlain } from "./rich-html";
import { checkCompose } from "./personal-plan";

export const DESIGNED_LIMITS = { bytes: 400 * 1024, text: 100_000 } as const;

export type Removed = { key: string; label: string; count: number };
export type DesignedClean = { html: string; removed: Removed[]; bytes: number; error: string | null };

const LABELS: Record<string, [string, string]> = {
  script: ["script", "scripts"],
  iframe: ["embedded page (iframe)", "embedded pages (iframe)"],
  object: ["embedded object", "embedded objects"],
  embed: ["embedded object", "embedded objects"],
  form: ["form or form field", "forms and form fields"],
  handler: ["event handler (onclick and the like)", "event handlers (onclick and the like)"],
  jslink: ["link that runs code (javascript: or data:)", "links that run code (javascript: or data:)"],
  badlink: ["link that is not a web, email or phone link", "links that are not web, email or phone links"],
  image: ["image not on https", "images not on https"],
  css: ["unsafe style rule", "unsafe style rules"],
  other: ["other unsafe tag", "other unsafe tags"],
};
const GROUP: Record<string, string> = {
  script: "script",
  iframe: "iframe",
  frame: "iframe",
  frameset: "iframe",
  portal: "iframe",
  object: "object",
  applet: "object",
  embed: "embed",
  form: "form",
  input: "form",
  button: "form",
  select: "form",
  textarea: "form",
  option: "form",
  keygen: "form",
  isindex: "form",
};

/** Dropped with everything inside them. */
const DROP_ALL = new Set(["script", "iframe", "frameset", "object", "applet", "embed", "svg", "math", "noscript", "template", "select", "textarea", "xmp", "plaintext", "noembed", "noframes", "portal"]);
/** Their content is raw text up to the closing tag: unterminated means the rest is dropped. */
const RAW_TEXT = new Set(["script", "iframe", "textarea", "xmp", "plaintext", "noembed", "noframes", "noscript"]);
/** The tag goes, what is inside it stays (a form's text, a button's label). */
const DROP_TAG = new Set(["form", "input", "button", "base", "link", "option", "keygen", "isindex", "frame", "param"]);
const URL_ATTRS = new Set(["href", "src", "background", "poster", "xlink:href", "srcset", "action", "formaction", "data", "codebase", "cite", "longdesc", "lowsrc", "dynsrc", "ping", "manifest", "srcdoc"]);
/** Attributes with no use in an email that could load or run something. */
const DROP_ATTRS = new Set(["action", "formaction", "data", "codebase", "longdesc", "lowsrc", "dynsrc", "ping", "manifest", "srcdoc", "cite"]);

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", colon: ":", tab: "\t", newline: "\n", lpar: "(", rpar: ")", sol: "/", bsol: "\\", period: ".", semi: ";" };

/** Decode entities the way a browser would for a URL check (numeric with or without ';'). */
function decodeAttr(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h: string) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, n: string) => safeChar(Number(n)))
    .replace(/&([a-z]+);/gi, (w, n: string) => NAMED[n.toLowerCase()] ?? w)
    .replace(/&(amp|lt|gt|quot)(?![a-z0-9=])/gi, (_, n: string) => NAMED[n.toLowerCase()]);
}
function safeChar(code: number): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return "\ufffd";
  return String.fromCodePoint(code);
}

/** What a URL attribute really starts with, ignoring hidden spaces and control characters. */
function urlScheme(decoded: string): string {
  const v = decoded.replace(/[\u0000-\u0020\u007f-\u009f\u00ad\u200b-\u200f\u2028\u2029\ufeff]+/g, "").toLowerCase();
  const m = /^([a-z][a-z0-9+.-]*):/.exec(v);
  return m ? m[1] : "";
}

type Link = "ok" | "js" | "bad";
function checkLink(decoded: string): Link {
  const v = decoded.trim();
  if (!v || v.startsWith("#")) return "ok";
  if (/^\{\{\s*[a-z_]+\s*\}\}/i.test(v)) return "bad";
  const scheme = urlScheme(v);
  if (scheme === "http" || scheme === "https" || scheme === "mailto" || scheme === "tel") return "ok";
  if (scheme === "javascript" || scheme === "vbscript" || scheme === "data" || scheme === "livescript") return "js";
  return "bad";
}
const isHttps = (decoded: string) => urlScheme(decoded) === "https" && !/^\s*https:\/*\s*$/i.test(decoded);

/**
 * Make CSS safe to keep: no expression(), behaviours, @import, scripts in
 * url(), or a way out of a <style> block. Counts what was changed.
 */
export function cleanCss(raw: string, count: (k: string) => void): string {
  let css = String(raw ?? "").replace(/\/\*[\s\S]*?\*\//g, "");
  // Undo escapes that spell letters ("expr\65 ssion", "j\avascript"), so hidden words are seen.
  css = css.replace(/\\([0-9a-f]{1,6})\s?/gi, (w, h: string) => {
    const c = safeChar(parseInt(h, 16));
    return /[a-z0-9:()/@\-_.]/i.test(c) ? c : w;
  });
  css = css.replace(/\\([a-z:()@])/gi, "$1");
  css = css.replace(/@import\b[^;]*;?/gi, () => (count("css"), ""));
  css = css.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|((?:[^()'"\s]|\([^()]*\))*))\s*\)/gi, (whole, a?: string, b?: string, c?: string) => (isHttps(decodeAttr(a ?? b ?? c ?? "")) ? whole : (count("css"), "none")));
  css = css.replace(/expression\s*\(/gi, () => (count("css"), "invalid("));
  css = css.replace(/(?:-moz-binding|behaviou?r)\s*:/gi, () => (count("css"), "x-blocked:"));
  css = css.replace(/(?:java|vb|live)script\s*:/gi, () => (count("css"), "blocked:"));
  // Never let a <style> block be closed (or a tag opened) from inside it.
  return css.replace(/</g, "\\3C ");
}

type Attr = { name: string; value: string | null };

/** Read a tag's attributes from `at` (just after the name). Null when the tag never closes. */
function readAttrs(s: string, at: number): { attrs: Attr[]; end: number; selfClose: boolean } | null {
  const attrs: Attr[] = [];
  let i = at;
  let selfClose = false;
  while (i < s.length) {
    const c = s[i];
    if (c === ">") return { attrs, end: i + 1, selfClose };
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (c === "/") {
      selfClose = s[i + 1] === ">";
      i++;
      continue;
    }
    selfClose = false;
    let j = i;
    // A name may start with "=" (browsers treat it as part of the name).
    if (s[j] === "=") j++;
    while (j < s.length && !/[\s/>=]/.test(s[j])) j++;
    const name = s.slice(i, j);
    i = j;
    while (i < s.length && /\s/.test(s[i])) i++;
    if (s[i] !== "=") {
      attrs.push({ name, value: null });
      continue;
    }
    i++;
    while (i < s.length && /\s/.test(s[i])) i++;
    const q = s[i];
    if (q === '"' || q === "'") {
      const close = s.indexOf(q, i + 1);
      if (close === -1) return null;
      attrs.push({ name, value: s.slice(i + 1, close) });
      i = close + 1;
    } else {
      let k = i;
      while (k < s.length && !/[\s>]/.test(s[k])) k++;
      attrs.push({ name, value: s.slice(i, k) });
      i = k;
    }
  }
  return null;
}

/** Keep raw attribute text as typed, only making sure it cannot leave its quotes. */
const quoteAttr = (v: string) => v.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function cleanTag(tag: string, attrs: Attr[], count: (k: string) => void): string | null {
  const out: string[] = [];
  if (tag === "meta") {
    const eq = attrs.find((a) => a.name.toLowerCase() === "http-equiv");
    if (eq && !/^\s*content-type\s*$/i.test(eq.value ?? "")) {
      count("other");
      return null;
    }
  }
  for (const a of attrs) {
    const name = a.name.toLowerCase();
    if (!/^[a-z_][a-z0-9_:.-]*$/.test(name)) continue;
    if (name.startsWith("on")) {
      count("handler");
      continue;
    }
    if (URL_ATTRS.has(name)) {
      if (DROP_ATTRS.has(name)) {
        count(name === "srcdoc" || name === "formaction" || name === "action" ? "jslink" : "badlink");
        continue;
      }
      const decoded = decodeAttr(a.value ?? "");
      if (name === "src" || name === "background" || name === "poster") {
        if (!isHttps(decoded)) {
          count("image");
          // An image with nowhere safe to load from is not kept at all.
          if (tag === "img" && name === "src") return null;
          continue;
        }
      } else if (name === "srcset") {
        const ok = decoded.split(",").every((part) => isHttps(part.trim().split(/\s+/)[0] ?? ""));
        if (!ok) {
          count("image");
          continue;
        }
      } else {
        const verdict = checkLink(decoded);
        if (verdict !== "ok") {
          count(verdict === "js" ? "jslink" : "badlink");
          continue;
        }
      }
      out.push(` ${name}="${escapeHtml(decoded.trim())}"`);
      continue;
    }
    if (name === "style") {
      const css = cleanCss(decodeAttr(a.value ?? ""), count).trim();
      if (css) out.push(` style="${escapeHtml(css)}"`);
      continue;
    }
    out.push(a.value === null ? ` ${name}` : ` ${name}="${quoteAttr(a.value)}"`);
  }
  return out.join("");
}

function indexOfClose(s: string, tag: string, from: number): { start: number; end: number } | null {
  const re = new RegExp(`</${tag}[\\s/>]`, "ig");
  re.lastIndex = from;
  const m = re.exec(s);
  if (!m) return null;
  const gt = s.indexOf(">", m.index);
  return { start: m.index, end: gt === -1 ? s.length : gt + 1 };
}

function walk(s: string, count: (k: string) => void): string {
  const out: string[] = [];
  let i = 0;
  while (i < s.length) {
    const lt = s.indexOf("<", i);
    if (lt === -1) {
      out.push(s.slice(i));
      break;
    }
    out.push(s.slice(i, lt));
    if (s.startsWith("<!--", lt)) {
      const close = s.indexOf("-->", lt + 4);
      const inner = s.slice(lt + 4, close === -1 ? s.length : close);
      i = close === -1 ? s.length : close + 3;
      // Outlook's conditional comments carry real layout: keep them, cleaned.
      const cond = /^\[if ([^\]]{1,80})\]>([\s\S]*)<!\[endif\]$/i.exec(inner);
      if (cond) out.push(`<!--[if ${cond[1].replace(/[<>-]/g, "")}]>${walk(cond[2], count)}<![endif]-->`);
      else if (/^\[if ([^\]]{1,80})\]><!$/i.test(inner)) out.push(`<!--${inner.replace(/^\[if ([^\]]+)\]><!$/i, (_, c: string) => `[if ${c.replace(/[<>-]/g, "")}]><!`)}-->`);
      else if (/^<!\[endif\]$/i.test(inner)) out.push("<!--<![endif]-->");
      continue;
    }
    if (s[lt + 1] === "!" || s[lt + 1] === "?") {
      const gt = s.indexOf(">", lt);
      const decl = s.slice(lt, gt === -1 ? s.length : gt + 1);
      if (/^<!doctype\s/i.test(decl)) out.push("<!DOCTYPE html>");
      i = gt === -1 ? s.length : gt + 1;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s.slice(lt, lt + 80));
    if (!m) {
      out.push("&lt;");
      i = lt + 1;
      continue;
    }
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    const parsed = readAttrs(s, lt + m[0].length);
    if (!parsed) {
      // A tag that never ends: everything after it would be swallowed by it.
      if (!closing) count(GROUP[tag] ?? "other");
      break;
    }
    i = parsed.end;
    if (closing) {
      if (!DROP_ALL.has(tag) && !DROP_TAG.has(tag)) out.push(`</${tag}>`);
      continue;
    }
    if (DROP_ALL.has(tag)) {
      count(GROUP[tag] ?? "other");
      if (parsed.selfClose && !RAW_TEXT.has(tag)) continue;
      const close = indexOfClose(s, tag, i);
      if (close) i = close.end;
      else if (RAW_TEXT.has(tag)) i = s.length;
      continue;
    }
    if (DROP_TAG.has(tag)) {
      count(GROUP[tag] ?? "other");
      continue;
    }
    if (tag === "style" || tag === "title") {
      const close = indexOfClose(s, tag, i);
      const body = s.slice(i, close ? close.start : s.length);
      i = close ? close.end : s.length;
      if (tag === "title") out.push(`<title>${body.replace(/<[^>]*>/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>`);
      else {
        const media = parsed.attrs.find((a) => a.name.toLowerCase() === "media");
        out.push(`<style${media?.value ? ` media="${quoteAttr(media.value)}"` : ""}>${cleanCss(body, count)}</style>`);
      }
      continue;
    }
    const attrs = cleanTag(tag, parsed.attrs, count);
    if (attrs === null) continue;
    out.push(`<${tag}${attrs}${parsed.selfClose ? " /" : ""}>`);
  }
  return out.join("");
}

export const byteSize = (s: string) => new TextEncoder().encode(String(s ?? "")).length;

/** A full document, so every mail app gets <html>, <head> and <body>. */
export function ensureDocument(html: string): string {
  const h = html.trim();
  if (/<html[\s>]/i.test(h)) return /^<!DOCTYPE/i.test(h) ? h : `<!DOCTYPE html>\n${h}`;
  return `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n${h}\n</body>\n</html>`;
}

function walkCounted(input: string): { html: string; removed: Removed[] } {
  const counts = new Map<string, number>();
  const count = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  // Repeat until nothing changes, so a tag rebuilt from pieces (<scr<script></script>ipt>) is caught too.
  let html = String(input ?? "");
  for (let n = 0; n < 4; n++) {
    const next = walk(html, count);
    if (next === html) break;
    html = next;
  }
  const order = Object.keys(LABELS);
  const removed = [...counts].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([key, c]) => ({ key, count: c, label: `${c} ${LABELS[key][c === 1 ? 0 : 1]}` }));
  return { html, removed };
}

/** Clean a pasted design. `error` says why it cannot be sent (empty, too big). */
export function cleanDesignedHtml(input: string): DesignedClean {
  const raw = String(input ?? "");
  const bytes = byteSize(raw);
  if (!raw.trim()) return { html: "", removed: [], bytes, error: "Paste the HTML or upload a .html file." };
  if (bytes > DESIGNED_LIMITS.bytes) return { html: "", removed: [], bytes, error: `The HTML is ${Math.ceil(bytes / 1024)} KB. The most is ${DESIGNED_LIMITS.bytes / 1024} KB.` };
  const { html, removed } = walkCounted(raw);
  if (!designedToText(html).trim() && !/<img\s/i.test(html)) return { html: "", removed, bytes, error: "Nothing would be left to send." };
  return { html: ensureDocument(html), removed, bytes, error: null };
}

/** The plain-text version of a designed email (the existing text maker, after dropping head and styles). */
export function designedToText(html: string): string {
  const s = String(html ?? "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<(style|title|script)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<img\b[^>]*\balt="([^"]+)"[^>]*>/gi, " $1 ")
    .replace(/<h[1-6]\b[^>]*>/gi, "<p>")
    .replace(/<\/(div|tr|table|h1|h2|h3|h4|h5|h6|section|header|footer|article|center|li)>/gi, (w, t: string) => (t.toLowerCase() === "li" ? w : "</p>"))
    .replace(/<\/t[dh]>/gi, " ");
  return htmlToPlain(s)
    .split("\n")
    .map((l) => l.replace(/[ \t\u00a0]{2,}/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const TOKEN = /\{\{\s*([a-zA-Z_]+)\s*\}\}|\{\s*([a-zA-Z_]+)\s*\}/g;

/** A person's value made safe to drop anywhere in a design: no braces or control characters. */
const tidyValue = (v: string) => String(v ?? "").replace(/[{}\u0000-\u001f\u007f]/g, "").trim();

/**
 * Fill {{name}}, {{first_name}} (and {first_name} style) for one person.
 * In HTML every value is escaped and the result is cleaned again, so a name
 * typed into a form can never add a tag or a link. Unknown fields stay as typed.
 */
export function fillDesigned(template: string, vars: Record<string, string>, as: "html" | "text"): string {
  const filled = String(template ?? "").replace(TOKEN, (whole, a: string | undefined, b: string | undefined) => {
    const key = (a ?? b ?? "").toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(vars, key)) return whole;
    const v = tidyValue(vars[key]);
    return as === "html" ? escapeHtml(v) : v;
  });
  return as === "html" ? walkCounted(filled).html : filled;
}

/** Merge fields used in a design that will not be filled. */
export function unknownDesignedFields(text: string, known: string[]): string[] {
  const ok = new Set(known.map((k) => k.toLowerCase()));
  const out = new Set<string>();
  for (const m of String(text ?? "").matchAll(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g)) if (!ok.has(m[1].toLowerCase())) out.add(m[1]);
  return [...out];
}

export type DesignedInput = { html: string; text?: string | null };
export type DesignedReady = { html: string; text: string; removed: Removed[] };

/** Server check before a designed send: cleaned HTML and a plain-text version. */
export function prepareDesigned(subject: string, d: DesignedInput | null | undefined): { error: string } | DesignedReady {
  const s = String(subject ?? "").trim();
  if (!s) return { error: "Add a subject line." };
  if (s.length > 160) return { error: "The subject is too long." };
  const c = cleanDesignedHtml(d?.html ?? "");
  if (c.error) return { error: c.error };
  const typed = String(d?.text ?? "").trim();
  if (typed.length > DESIGNED_LIMITS.text) return { error: "The plain-text version is too long." };
  const text = (typed || designedToText(c.html)).slice(0, DESIGNED_LIMITS.text);
  return { html: c.html, text, removed: c.removed };
}

/**
 * The document the admin preview shows in its sandboxed frame: no scripts
 * by policy as well as by sandbox, and links open nowhere.
 */
export function previewDocument(html: string): string {
  const guard = `<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'"><base target="_blank">`;
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (h) => `${h}${guard}`);
  if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, (h) => `${h}<head>${guard}</head>`);
  return `${guard}${html}`;
}

/**
 * Plain or designed: what the shared sender gets. A designed email is cleaned
 * again on the server (the page is never trusted) and gets a plain-text version.
 */
export function checkSendBody(subject: string, body: string, designed?: DesignedInput | null): { error: string } | { designed?: { html: string; text: string } } {
  if (designed) {
    const d = prepareDesigned(subject, designed);
    return "error" in d ? d : { designed: { html: d.html, text: d.text } };
  }
  const bad = checkCompose(subject, body);
  return bad ? { error: bad } : {};
}
