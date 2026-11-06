import { describe, expect, it } from "vitest";
import { htmlToPlain, richToEmailHtml, safeHref, sanitizeRich, textToHtml } from "./rich-html";

describe("sanitizeRich", () => {
  it("keeps simple formatting", () => {
    expect(sanitizeRich("<h2>Hi</h2><p>A <b>bold</b> and <i>it</i></p><ul><li>one</li></ul>")).toBe(
      "<h2>Hi</h2><p>A <strong>bold</strong> and <em>it</em></p><ul><li>one</li></ul>",
    );
  });
  it("removes scripts, styles, handlers and unknown tags", () => {
    const out = sanitizeRich('<p onclick="x()">Hi<script>alert(1)</script><img src=x onerror=alert(1)><style>p{}</style></p>');
    expect(out).toBe("<p>Hi</p>");
  });
  it("blocks javascript: and data: links but keeps https and mailto", () => {
    expect(sanitizeRich('<a href="javascript:alert(1)">x</a>')).toBe("x");
    expect(sanitizeRich('<a href=" jav&#97;script:alert(1)">x</a>')).toBe("x");
    expect(sanitizeRich('<a href="data:text/html,hi">x</a>')).toBe("x");
    expect(sanitizeRich('<a href="https://vibhapsychology.com" target="_blank">x</a>')).toBe('<a href="https://vibhapsychology.com">x</a>');
    expect(safeHref("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(safeHref("//evil.com")).toBe(null);
  });
  it("escapes stray brackets and closes open tags", () => {
    expect(sanitizeRich("<p>1 < 2 and <strong>open")).toBe("<p>1 &lt; 2 and <strong>open</strong></p>");
  });
  it("attribute tricks can't smuggle markup", () => {
    expect(sanitizeRich('<p title="a><script>alert(1)</script>">t</p>')).not.toContain("<script");
  });
});

describe("conversions", () => {
  it("plain text keeps links and lists", () => {
    expect(htmlToPlain('<p>Hello</p><ul><li>a</li></ul><p><a href="https://x.com">site</a></p>')).toBe("Hello\n\n• a\n\nsite (https://x.com)");
  });
  it("text → html escapes and links", () => {
    expect(textToHtml("Hi <you>\nline two\n\nhttps://x.com.")).toBe('<p>Hi &lt;you&gt;<br>line two</p><p><a href="https://x.com">https://x.com</a>.</p>');
  });
  it("email html has inline styles and no unsafe parts", () => {
    const html = richToEmailHtml("<h2>T</h2><p>x</p><script>1</script>");
    expect(html).toContain('<h2 style="');
    expect(html).not.toContain("<script");
  });
});
