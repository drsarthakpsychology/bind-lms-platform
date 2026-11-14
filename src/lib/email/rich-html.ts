/**
 * Formatted messages without writing code. The admin's formatted editor
 * produces simple HTML; this module
 *   - cleans it to a strict allow-list (no scripts, no styles, no images, no
 *     event handlers, links only to http(s)/mailto),
 *   - turns it into an email-safe HTML email (inline styles, brand shell),
 *   - makes the plain-text version every email needs, and
 *   - turns plain text into safe HTML.
 * Pure, so it is tested. The same cleaner guards in-app notifications.
 */

const ALLOWED = new Set(["p", "br", "strong", "b", "em", "i", "u", "h2", "h3", "ul", "ol", "li", "a", "blockquote", "hr"]);
const VOID = new Set(["br", "hr"]);
const RENAME: Record<string, string> = { b: "strong", i: "em", h1: "h2", h4: "h3", h5: "h3", h6: "h3", div: "p" };

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

/** Only http(s) and mailto links survive (blocks javascript:, data:, etc.). */
export function safeHref(raw: string): string | null {
  const v = decodeEntities(raw).trim().replace(/[\u0000-\u001f\s]+/g, "");
  if (/^(https?:\/\/|mailto:)/i.test(v)) return v;
  // Site-relative link. A backslash is refused: browsers read "/\host" as
  // "//host", another site.
  if (/^\/(?!\/)/.test(v) && !v.includes("\\")) return v;
  return null;
}

/**
 * Clean formatted HTML to the allow-list. Text is always re-escaped, so
 * anything not a recognised tag ends up as harmless text.
 */
export function sanitizeRich(input: string): string {
  const src = String(input ?? "")
    // Drop whole dangerous elements including their content.
    .replace(/<(script|style|iframe|object|embed|svg|math|template|noscript|textarea|select|button|form)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const out: string[] = [];
  const stack: string[] = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    out.push(escapeHtml(decodeEntities(src.slice(last, m.index))));
    last = re.lastIndex;
    const closing = m[0][1] === "/";
    let tag = m[1].toLowerCase();
    tag = RENAME[tag] ?? tag;
    if (!ALLOWED.has(tag)) continue;
    if (closing) {
      const at = stack.lastIndexOf(tag);
      if (at === -1) continue;
      while (stack.length > at) out.push(`</${stack.pop()}>`);
      continue;
    }
    if (VOID.has(tag)) {
      out.push(`<${tag}>`);
      continue;
    }
    if (tag === "a") {
      const href = /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[2]);
      const safe = href ? safeHref(href[2] ?? href[3] ?? href[4] ?? "") : null;
      if (!safe) continue;
      out.push(`<a href="${escapeHtml(safe)}">`);
    } else out.push(`<${tag}>`);
    stack.push(tag);
  }
  out.push(escapeHtml(decodeEntities(src.slice(last))));
  while (stack.length) out.push(`</${stack.pop()}>`);
  return out
    .join("")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}

/** Plain-text version of (clean) HTML, for the email text part and previews. */
export function htmlToPlain(html: string): string {
  return decodeEntities(
    String(html ?? "")
      .replace(/<a [^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => (text.trim() === href ? href : `${text} (${href})`))
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/<(br|hr)[^>]*>/gi, "\n")
      .replace(/<\/(p|h2|h3|ul|ol|blockquote)>/gi, "\n\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Plain text → safe HTML paragraphs with clickable links. */
export function textToHtml(text: string): string {
  return String(text ?? "")
    .trim()
    .split(/\n{2,}/)
    .map((para) =>
      `<p>${escapeHtml(para)
        .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1">$1</a>')
        .replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

const STYLE: Record<string, string> = {
  p: "margin:0 0 14px;font-size:15px;line-height:1.6;color:#1a1a1a;",
  h2: "margin:0 0 10px;font-size:20px;line-height:1.3;color:#1a1a1a;",
  h3: "margin:16px 0 8px;font-size:16px;line-height:1.3;color:#1a1a1a;",
  ul: "margin:0 0 14px;padding-left:22px;font-size:15px;line-height:1.6;color:#1a1a1a;",
  ol: "margin:0 0 14px;padding-left:22px;font-size:15px;line-height:1.6;color:#1a1a1a;",
  li: "margin:0 0 4px;",
  a: "color:#2f5bd3;font-weight:bold;",
  blockquote: "margin:0 0 14px;padding:8px 14px;border-left:4px solid #1a1a1a;background:#FFF9F0;",
  hr: "border:0;border-top:2px solid #1a1a1a;margin:18px 0;",
};

/** Clean formatted HTML → a full, email-safe HTML email in the VIBHA shell. */
export function richToEmailHtml(inner: string, opts: { preheader?: string } = {}): string {
  const body = sanitizeRich(inner).replace(/<(p|h2|h3|ul|ol|li|a|blockquote|hr)(\s|>)/g, (_, t: string, after: string) => `<${t} style="${STYLE[t]}"${after}`);
  const pre = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.preheader)}</div>` : "";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF9F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
${pre}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F0;"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="padding:0 0 12px;font-size:13px;font-weight:bold;letter-spacing:.08em;color:#1a1a1a;">VIBHA SCHOOL OF PSYCHOLOGY</td></tr>
    <tr><td style="background:#ffffff;border:2px solid #1a1a1a;border-radius:10px;padding:28px;">${body}</td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}
