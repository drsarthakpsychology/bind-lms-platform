import { describe, expect, it } from "vitest";
import { checkSendBody, cleanCss, cleanDesignedHtml, designedToText, DESIGNED_LIMITS, ensureDocument, fillDesigned, prepareDesigned, previewDocument, unknownDesignedFields } from "./designed-html";

const body = (html: string) => {
  const r = cleanDesignedHtml(html);
  expect(r.error).toBeNull();
  return r.html.replace(/^[\s\S]*<body>\n/, "").replace(/\n<\/body>[\s\S]*$/, "");
};
const keys = (html: string) => cleanDesignedHtml(html).removed.map((r) => `${r.key}:${r.count}`).sort();

describe("cleanDesignedHtml keeps the design", () => {
  it("keeps inline styles, style tags, tables, https images and links", () => {
    const src = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>.btn{background:#1d44d8;color:#fff} @media (max-width:600px){.w{width:100%!important}}</style></head><body style="margin:0"><table role="presentation" width="600" cellpadding="0" style="border-collapse:collapse"><tr><td class="w" align="center"><img src="https://cdn.example.com/logo.png" alt="VIBHA" width="120"><a class="btn" href="https://vibha.in/join?ref=mail" target="_blank">Join</a> <a href="mailto:hi@vibha.in">Mail</a> <a href="#top">Top</a></td></tr></table></body></html>`;
    const r = cleanDesignedHtml(src);
    expect(r.error).toBeNull();
    expect(r.removed).toEqual([]);
    expect(r.html).toContain("<style>.btn{background:#1d44d8;color:#fff} @media (max-width:600px){.w{width:100%!important}}</style>");
    expect(r.html).toContain('<body style="margin:0">');
    expect(r.html).toContain('<table role="presentation" width="600" cellpadding="0" style="border-collapse:collapse">');
    expect(r.html).toContain('<img src="https://cdn.example.com/logo.png" alt="VIBHA" width="120">');
    expect(r.html).toContain('<a class="btn" href="https://vibha.in/join?ref=mail" target="_blank">Join</a>');
    expect(r.html).toContain('<a href="mailto:hi@vibha.in">');
    expect(r.html).toContain('<a href="#top">');
  });

  it("keeps Outlook conditional comments, cleaned", () => {
    const out = body(`<!--[if mso]><table><tr><td onclick="x()">A</td></tr></table><![endif]--><p>Hi</p><!-- a note -->`);
    expect(out).toBe("<!--[if mso]><table><tr><td>A</td></tr></table><![endif]--><p>Hi</p>");
  });

  it("wraps a fragment in a full document", () => {
    expect(ensureDocument("<p>Hi</p>")).toMatch(/^<!DOCTYPE html>\n<html>[\s\S]*<body>\n<p>Hi<\/p>\n<\/body>\n<\/html>$/);
    expect(ensureDocument("<html><body>x</body></html>")).toBe("<!DOCTYPE html>\n<html><body>x</body></html>");
  });
});

describe("cleanDesignedHtml takes out what could run code", () => {
  it("removes script, iframe, object, embed and form, and says so", () => {
    const out = body(`<p>A</p><script>alert(1)</script><iframe src="https://x.com"></iframe><object data="x.swf"><p>fallback</p></object><embed src="https://x.com/a.swf"><form action="https://evil.com"><input name="pw"><button>Go</button></form><p>B</p>`);
    expect(out).toBe("<p>A</p>Go<p>B</p>");
    expect(keys(`<script>1</script><script>2</script><iframe></iframe><object></object><embed src="https://a.b/c"><form><input></form>`)).toEqual(["embed:1", "form:2", "iframe:1", "object:1", "script:2"]);
    expect(cleanDesignedHtml("<script>1</script><script>2</script><p>x</p>").removed[0].label).toBe("2 scripts");
  });

  it("removes event handlers and javascript: links in any spelling", () => {
    expect(body(`<p onclick="steal()" ONMOUSEOVER=x>Hi</p>`)).toBe("<p>Hi</p>");
    expect(body(`<a href="javascript:alert(1)">a</a>`)).toBe("<a>a</a>");
    expect(body(`<a href=" jav&#x09;ascript:alert(1)">a</a>`)).toBe("<a>a</a>");
    expect(body(`<a href="&#106;avascript&colon;alert(1)">a</a>`)).toBe("<a>a</a>");
    expect(body(`<a href="&#106avascript:alert(1)">a</a>`)).toBe("<a>a</a>");
    expect(body(`<a href="data:text/html,<script>1</script>">a</a>`)).toBe("<a>a</a>");
    expect(body(`<a href="vbscript:x">a</a><a href="//evil.com">b</a>`)).toBe("<a>a</a><a>b</a>");
    expect(keys(`<a href="javascript:1" onclick="2">a</a><a href="ftp://x">b</a>`)).toEqual(["badlink:1", "handler:1", "jslink:1"]);
  });

  it("keeps only https images", () => {
    expect(body(`<p>x<img src="http://a.com/i.png"><img src="data:image/png;base64,AAA"><img src="https://a.com/ok.png" onerror="x()"></p>`)).toBe('<p>x<img src="https://a.com/ok.png"></p>');
    expect(body(`<td background="http://a.com/bg.png">x</td>`)).toBe("<td>x</td>");
    expect(keys(`<img src="http://a/b.png"><p>x</p>`)).toEqual(["image:1"]);
  });

  it("cleans unsafe CSS", () => {
    const n: string[] = [];
    const count = (k: string) => n.push(k);
    expect(cleanCss("@import url(https://x.com/a.css); p{color:red}", count)).toBe(" p{color:red}");
    expect(cleanCss("p{background:url(javascript:alert(1))}", count)).toBe("p{background:none}");
    expect(cleanCss("p{background:url('https://a.com/b.png')}", count)).toBe("p{background:url('https://a.com/b.png')}");
    expect(cleanCss("p{width:expr\\65 ssion(alert(1))}", count)).toBe("p{width:invalid(alert(1))}");
    expect(cleanCss("p{behavior:url(x.htc)}", count)).toBe("p{x-blocked:none}");
    expect(cleanCss("</style><script>alert(1)</script>", count)).not.toMatch(/</);
    expect(n.length).toBeGreaterThanOrEqual(5);
    expect(body(`<p style="color:red;background:url(http://a/b.png)">x</p>`)).toBe('<p style="color:red;background:none">x</p>');
    expect(body(`<style>p{x:1}</style ><p>y</p>`)).toBe("<style>p{x:1}</style><p>y</p>");
  });

  it("is not fooled by broken or rebuilt tags", () => {
    expect(body(`<scr<script>x</script>ipt>alert(1)</script><p>ok</p>`)).not.toMatch(/<script/i);
    expect(body(`<p>ok</p><img src="https://a/b.png" onerror="x()"`)).toBe("<p>ok</p>");
    expect(body(`<p title='a" onclick="x()'>t</p>`)).toBe('<p title="a&quot; onclick=&quot;x()">t</p>');
    expect(body(`<p>1 < 2</p>`)).toBe("<p>1 &lt; 2</p>");
    expect(body(`<svg onload="x()"><a href="javascript:1">s</a></svg><p>k</p>`)).toBe("<p>k</p>");
    expect(body(`<meta http-equiv="refresh" content="0;url=https://evil.com"><base href="https://evil.com/"><link rel="stylesheet" href="https://x.com/a.css"><p>k</p>`)).toBe("<p>k</p>");
    expect(body(`<noscript><img src="https://a/b.png"></noscript><template><p>t</p></template><p>k</p>`)).toBe("<p>k</p>");
  });

  it("gives the same result when cleaned twice", () => {
    const once = cleanDesignedHtml(`<title>A &amp; B</title><p style="a:b" title="x&quot;y">1 &lt; 2 <a href="https://a.com/?a=1&amp;b=2">l</a></p>`).html;
    expect(cleanDesignedHtml(once).html).toBe(once);
  });

  it("refuses empty or too big HTML", () => {
    expect(cleanDesignedHtml("  ").error).toMatch(/Paste the HTML/);
    expect(cleanDesignedHtml(`<p>${"a".repeat(DESIGNED_LIMITS.bytes)}</p>`).error).toMatch(/The most is 400 KB/);
    expect(cleanDesignedHtml("<script>only</script>").error).toBe("Nothing would be left to send.");
  });
});

describe("personalisation", () => {
  const vars = { first_name: "Aanya", name: "Aanya Rao", email: "a@x.com", form: "Cohort 2" };
  it("fills {{name}} and {{first_name}} (and {first_name}) per person", () => {
    expect(fillDesigned("<p>Hi {{first_name}}, {{ Name }} / {first_name} / {{unknown}}</p>", vars, "html")).toBe("<p>Hi Aanya, Aanya Rao / Aanya / {{unknown}}</p>");
    expect(fillDesigned("Hello {{first_name}}", vars, "text")).toBe("Hello Aanya");
  });
  it("escapes values so a name cannot add tags, links or styles", () => {
    const evil = { ...vars, name: `<img src=x onerror=alert(1)>"}body{display:none`, first_name: "javascript:alert(1)" };
    const out = fillDesigned(`<p>{{name}}</p><a href="{{first_name}}">x</a><p style="color:{{name}}">y</p>`, evil, "html");
    expect(out).not.toMatch(/<img/);
    expect(out).not.toMatch(/[{}]/);
    expect(out).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(out).toContain("<a>x</a>");
  });
  it("lists merge fields that will not be filled", () => {
    expect(unknownDesignedFields("{{first_name}} {{course}} {{ Name }}", ["first_name", "name"])).toEqual(["course"]);
  });
});

describe("plain-text version and send check", () => {
  it("makes text from the design without the head or styles", () => {
    const html = cleanDesignedHtml(`<html><head><title>T</title><style>p{color:red}</style></head><body><table><tr><td><h1>Welcome</h1></td></tr><tr><td>Hi {{first_name}},</td><td>see <a href="https://vibha.in">our site</a></td></tr></table><img src="https://a/b.png" alt="Logo"></body></html>`).html;
    const text = designedToText(html);
    expect(text).not.toMatch(/color:red|\bT\b/);
    expect(text).toContain("Welcome");
    expect(text).toContain("Hi {{first_name}}, see our site (https://vibha.in)");
    expect(text).toContain("Logo");
  });
  it("prepareDesigned cleans, and uses the typed text when given", () => {
    const auto = prepareDesigned("Hi", { html: "<p>Hello <b>there</b></p><script>x</script>" });
    expect("error" in auto).toBe(false);
    if (!("error" in auto)) {
      expect(auto.html).not.toMatch(/script/);
      expect(auto.text).toBe("Hello there");
      expect(auto.removed[0].key).toBe("script");
    }
    const typed = prepareDesigned("Hi", { html: "<p>x</p>", text: "  Own text " });
    expect(!("error" in typed) && typed.text).toBe("Own text");
    expect(prepareDesigned("", { html: "<p>x</p>" })).toEqual({ error: "Add a subject line." });
  });
  it("checkSendBody keeps the plain check for plain emails", () => {
    expect(checkSendBody("Hi", "Body")).toEqual({});
    expect(checkSendBody("Hi", "")).toEqual({ error: "Write the email first." });
    expect(checkSendBody("Hi", "", { html: "<p>x</p>" })).toMatchObject({ designed: { text: "x" } });
  });
  it("the preview document blocks scripts by policy too", () => {
    const doc = previewDocument(ensureDocument("<p>x</p>"));
    expect(doc).toContain(`<head><meta http-equiv="Content-Security-Policy" content="script-src 'none';`);
    expect(previewDocument("<html><body>x</body></html>")).toMatch(/^<html><head><meta http-equiv/);
  });
});
