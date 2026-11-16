#!/usr/bin/env node
/**
 * Layout defect detector.
 *
 * Loads each screen at several widths, light and dark, and reports:
 *   hscroll      the page scrolls sideways
 *   overflow     text runs past the edge of its own box
 *   clip         text cut off by an `overflow: hidden` box (no ellipsis)
 *   truncate     text cut with an ellipsis but no title / aria-label to read it all
 *   overlap      text of one element sits on top of the text of another
 *   tiny         text under 12px
 *   measure      reading text wider than 80 characters per line
 *   tap          a control under 44x44 px on a touch width (< 1024 px)
 *   bar          page content painted over a fixed bar (tab bar, top bar, thumb
 *                bar, pinned action): sampled with elementFromPoint across the
 *                bar at the top, middle and end of the page
 *   reach        at the end of the page the last content is still under a
 *                bottom bar (the page cannot be scrolled far enough)
 *   separator    a line that starts with a "·" (the separator wrapped alone)
 *
 * Two ways to point it at screens:
 *   Harness (a static bundle that renders one page per ?page=NAME, with
 *   ?theme=dark for dark mode and window.__ready once painted):
 *     node e2e/layout-defects.mjs --harness file:///path/index.html --pages home,reader
 *   A running server (next dev --webpack):
 *     node e2e/layout-defects.mjs --base http://localhost:3000 --pages /,/login
 *
 * Options:
 *   --widths 360,390,768,1024,1440   --themes light,dark
 *   --out <dir>        screenshots (defects outlined in red) and report.json
 *   --md <file>        also write a Markdown defect list
 *   --chrome <path>    Chromium binary (defaults to the local Playwright one)
 *   --shots all|defects|none  (default defects)
 *   --resize           load each screen once per kind of device and resize
 *                      through its widths (faster; JS layouts get a resize)
 *   --cookies "a=1; b=2"  cookies for --base (a signed-in session against a
 *                      local mock), or --cookies @file to read them from a file
 *
 * Opt-outs, for things that are meant to look that way:
 *   data-layout-ok            on an element skips every check inside it
 *   data-layout-ok="overlap"  (or "clip", "tap", ...) skips just those checks
 * Intended sideways scrollers (overflow-x: auto/scroll) are never "overflow".
 * SVG text (diagrams) is not checked for size; it scales with the drawing.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : "1"]);
    return acc;
  }, []),
);
const harness = args.harness;
const base = args.base;
const merge = args.reports; // --reports a/report.json,b/report.json: only write the Markdown list
if (!harness && !base && !merge) {
  console.error("Give --harness <file:///index.html> or --base <http://host>");
  process.exit(2);
}
const pages = (args.pages ?? "").split(",").filter(Boolean);
const widths = (args.widths ?? "360,390,768,1024,1440").split(",").map(Number);
const themes = (args.themes ?? "light,dark").split(",");
const out = path.resolve(args.out ?? "layout-defects-out");
const shots = args.shots ?? "defects";
const cookieText = args.cookies ? (args.cookies.startsWith("@") ? fs.readFileSync(args.cookies.slice(1), "utf8") : args.cookies).trim() : "";
async function addCookies(ctx) {
  if (!cookieText || !base) return;
  const list = cookieText.split(/;\s*/).filter(Boolean).map((c) => {
    const i = c.indexOf("=");
    return { name: c.slice(0, i), value: c.slice(i + 1), url: base };
  });
  await ctx.addCookies(list);
}
const chrome = args.chrome ?? (fs.existsSync("/opt/pw-browsers/chromium-1243/chrome-linux64/chrome") ? "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" : undefined);
fs.mkdirSync(out, { recursive: true });

/** Runs inside the page. Returns a list of defects and tags each element with data-defect. */
function scan({ touch }) {
  const vw = document.documentElement.clientWidth;
  const found = [];
  const okFor = (el, kind) => {
    const h = el.closest("[data-layout-ok]");
    if (!h) return false;
    const v = h.getAttribute("data-layout-ok");
    return !v || v === "1" || v.split(/[ ,]+/).includes(kind);
  };
  // Screen-reader-only text under any class name: a 1px box that clips.
  const srOnly = (el) => {
    for (let e = el, i = 0; e && e !== document.body && i < 2; e = e.parentElement, i++) {
      const r = e.getBoundingClientRect();
      if (r.width <= 2 && r.height <= 2 && /hidden|clip/.test(getComputedStyle(e).overflow)) return true;
    }
    return false;
  };
  const hidden = (el) =>
    !!el.closest("[aria-hidden=true], [inert], .sr-only, [hidden], template, noscript") ||
    srOnly(el) ||
    (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true }));
  const name = (el) => {
    const parts = [];
    let e = el;
    for (let i = 0; e && e !== document.body && i < 3; i++, e = e.parentElement) {
      let s = e.tagName.toLowerCase();
      if (e.id) { s += "#" + e.id; parts.unshift(s); break; }
      const cls = String(e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !c.includes(":") && !c.includes("[")).slice(0, 3);
      if (cls.length) s += "." + cls.join(".");
      parts.unshift(s);
    }
    return parts.join(" > ");
  };
  const text = (el) => (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
  let n = 0;
  const add = (el, kind, detail) => {
    if (okFor(el, kind)) return;
    if (!el.hasAttribute("data-defect")) el.setAttribute("data-defect", String(++n));
    found.push({ kind, el: name(el), text: text(el), detail, id: el.getAttribute("data-defect") });
  };
  const inScroller = (el) => {
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const o = getComputedStyle(a).overflowX;
      if (o === "auto" || o === "scroll") return a;
    }
    return null;
  };

  // 1. sideways page scroll
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) {
    // name the widest culprits
    const wide = [];
    for (const el of document.body.querySelectorAll("*")) {
      if (hidden(el) || inScroller(el)) continue;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") continue;
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1) wide.push([r.right, el]);
    }
    wide.sort((a, b) => b[0] - a[0]);
    const culprit = wide.find(([, el]) => ![...el.children].some((c) => c.getBoundingClientRect().right >= el.getBoundingClientRect().right - 1));
    add(culprit ? culprit[1] : document.body, "hscroll", `page is ${sw}px wide in a ${vw}px window`);
  }

  // Text leaves: elements with their own non-empty text nodes.
  const leaves = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el) || el.closest("svg, script, style")) continue;
    seen.add(el);
    if (hidden(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
    if (!rects.length) continue;
    leaves.push({ el, rects });
  }
  // merge rects of the other text nodes of the same element
  const byEl = new Map(leaves.map((l) => [l.el, l]));
  for (const el of byEl.keys()) {
    const all = [];
    for (const c of el.childNodes) {
      if (c.nodeType !== 3 || !c.textContent.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(c);
      all.push(...[...r.getClientRects()].filter((x) => x.width > 0.5 && x.height > 0.5));
    }
    byEl.get(el).rects = all;
  }

  const block = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const d = getComputedStyle(e).display;
      if (d !== "inline" && d !== "contents") return e;
    }
    return document.body;
  };

  for (const { el, rects } of byEl.values()) {
    const cs = getComputedStyle(el);
    // 5. tiny text
    const fs = parseFloat(cs.fontSize);
    if (fs < 11.95) add(el, "tiny", `${fs.toFixed(1)}px text`);

    // 2/3/4. overflow and clipping against own box and clipping ancestors
    const box = block(el);
    const br = box.getBoundingClientRect();
    const right = Math.max(...rects.map((r) => r.right));
    const left = Math.min(...rects.map((r) => r.left));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    const bcs = getComputedStyle(box);
    const clipsX = /hidden|clip/.test(bcs.overflowX);
    const ellipsis = bcs.textOverflow === "ellipsis";
    const clamp = bcs.webkitLineClamp && bcs.webkitLineClamp !== "none";
    const titled = !!(box.closest("[title]") || el.closest("[title]") || box.closest("[aria-label]"));
    if ((ellipsis && box.scrollWidth > box.clientWidth + 1) || (clamp && box.scrollHeight > box.clientHeight + 1)) {
      if (!titled) add(box, "truncate", clamp ? `cut to ${bcs.webkitLineClamp} lines, no title` : "ends in ... with no title");
    } else if (!inScroller(box)) {
      const over = Math.round(right - br.right);
      const underL = Math.round(br.left - left);
      if (over > 1 || underL > 1) add(el, clipsX ? "clip" : "overflow", `text passes the box edge by ${Math.max(over, underL)}px`);
    }
    // ancestors that clip (fixed-height cards, overflow hidden wrappers)
    for (let a = box.parentElement, i = 0; a && a !== document.body && i < 6; a = a.parentElement, i++) {
      const acs = getComputedStyle(a);
      const cx = /hidden|clip/.test(acs.overflowX);
      const cy = /hidden|clip/.test(acs.overflowY);
      if (!cx && !cy) continue;
      if (acs.overflowX === "auto" || acs.overflowX === "scroll") break;
      const ar = a.getBoundingClientRect();
      if (ar.width < 2 || ar.height < 2) break; // sr-only style boxes
      if (acs.textOverflow === "ellipsis" || (acs.webkitLineClamp && acs.webkitLineClamp !== "none")) break;
      const dx = cx ? Math.max(right - ar.right, ar.left - left) : 0;
      const dy = cy ? bottom - ar.bottom : 0;
      if (dx > 2 || dy > 2) { add(el, "clip", `cut off by ${a.tagName.toLowerCase()} (overflow hidden) by ${Math.round(Math.max(dx, dy))}px`); }
      break;
    }

    // 6. measure
    if (/^(P|LI|BLOCKQUOTE|DD|FIGCAPTION)$/.test(box.tagName) && (box.textContent ?? "").length > 160) {
      const probe = document.createElement("span");
      probe.textContent = "0".repeat(20);
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit";
      box.appendChild(probe);
      const ch = probe.getBoundingClientRect().width / 20;
      probe.remove();
      const inner = box.clientWidth - parseFloat(bcs.paddingLeft) - parseFloat(bcs.paddingRight);
      const cpl = inner / ch;
      if (ch && cpl > 80.5 && !box.hasAttribute("data-measured")) {
        box.setAttribute("data-measured", "1");
        add(box, "measure", `${Math.round(cpl)} characters per line`);
      }
    }
  }

  // 4. overlap between text of different elements (not ancestor/descendant)
  const items = [];
  for (const { el, rects } of byEl.values()) {
    let pinned = false;
    for (let e = el; e; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === "fixed" || p === "sticky") { pinned = true; break; } }
    if (pinned) continue;
    // Text an ellipsis or overflow-hidden box cuts is not on screen past the box edge.
    const bx = block(el);
    const bs = getComputedStyle(bx);
    const cut = /hidden|clip/.test(bs.overflowX) || /hidden|clip/.test(bs.overflowY) ? bx.getBoundingClientRect() : null;
    for (const r0 of rects) {
      // Lines a line-clamp hides sit below the box: they are not on screen either.
      const r = cut ? { left: Math.max(r0.left, cut.left), right: Math.min(r0.right, cut.right), top: Math.max(r0.top, cut.top), bottom: Math.min(r0.bottom, cut.bottom) } : { left: r0.left, right: r0.right, top: r0.top, bottom: r0.bottom };
      r.height = r.bottom - r.top;
      if (r.right - r.left > 0.5 && r.height > 0.5) items.push({ el, r });
    }
  }
  const CELL = 120;
  const grid = new Map();
  items.forEach((it, i) => {
    const sy = scrollY;
    for (let gx = Math.floor(it.r.left / CELL); gx <= Math.floor(it.r.right / CELL); gx++)
      for (let gy = Math.floor((it.r.top + sy) / CELL); gy <= Math.floor((it.r.bottom + sy) / CELL); gy++) {
        const k = gx + "," + gy;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(i);
      }
  });
  const pairs = new Set();
  for (const ids of grid.values()) {
    for (let x = 0; x < ids.length; x++)
      for (let y = x + 1; y < ids.length; y++) {
        const a = items[ids[x]], b = items[ids[y]];
        if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (w <= 2 || h <= 0) continue;
        if (h < 0.35 * Math.min(a.r.height, b.r.height)) continue;
        const key = ids[x] < ids[y] ? ids[x] + ":" + ids[y] : ids[y] + ":" + ids[x];
        if (pairs.has(key)) continue;
        pairs.add(key);
        if (okFor(a.el, "overlap") || okFor(b.el, "overlap")) continue;
        add(a.el, "overlap", `text sits on "${text(b.el).slice(0, 30)}" (${Math.round(w)}x${Math.round(h)}px)`);
      }
  }

  // 8. a "·" separator that wrapped to the start of a line
  const dots = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = dots.nextNode(); t; t = dots.nextNode()) {
    const s = t.textContent;
    if (!s.includes("·") || !t.parentElement || hidden(t.parentElement) || t.parentElement.closest("svg")) continue;
    for (let i = s.indexOf("·"); i !== -1; i = s.indexOf("·", i + 1)) {
      const r = document.createRange();
      r.setStart(t, i); r.setEnd(t, i + 1);
      const dot = r.getBoundingClientRect();
      if (!dot.width) continue;
      // the visible thing before the dot: the previous character here, or the end of the previous text
      let prev = null;
      for (let j = i - 1; j >= 0; j--) {
        if (/\s/.test(s[j])) continue;
        r.setStart(t, j); r.setEnd(t, j + 1); prev = r.getBoundingClientRect(); break;
      }
      if (!prev) {
        const b = block(t.parentElement);
        const w2 = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
        let last = null;
        for (let u = w2.nextNode(); u && u !== t; u = w2.nextNode()) if (u.textContent.trim()) last = u;
        if (last) { const k = last.textContent.trimEnd().length; r.setStart(last, k - 1); r.setEnd(last, k); prev = r.getBoundingClientRect(); }
      }
      if (prev && prev.width && dot.top > prev.bottom - 2) add(t.parentElement, "separator", "a line starts with the · separator");
    }
  }

  // 7. tap targets on touch widths
  if (touch) {
    const sel = "a[href], button, [role=button], [role=tab], [role=radio], [role=checkbox], [role=switch], [role=menuitem], [role=option], input:not([type=hidden]), select, textarea, summary";
    for (const el of document.querySelectorAll(sel)) {
      if (hidden(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(el);
      // links inside running text are fine (WCAG 2.5.8 inline exception)
      if (el.tagName === "A" && cs.display === "inline" && el.closest("p, li, td, dd, blockquote, figcaption")) continue;
      // inputs a label covers (custom radios/checkboxes): measure the label
      let target = r;
      if (el.tagName === "INPUT" && /radio|checkbox/.test(el.type)) {
        const lab = el.closest("label") ?? (el.id && document.querySelector(`label[for="${el.id}"]`));
        if (lab) target = lab.getBoundingClientRect();
      }
      // a ::before / ::after that stretches the hit area (the "inset -x" trick)
      const pseudo = ["::before", "::after"].some((p) => {
        const ps = getComputedStyle(el, p);
        return ps.content !== "none" && ps.position === "absolute" && parseFloat(ps.width || "0") >= 44 && parseFloat(ps.height || "0") >= 44;
      });
      if (pseudo) continue;
      if (target.height < 43.5 || target.width < 43.5) add(el, "tap", `${Math.round(target.width)}x${Math.round(target.height)}px`);
    }
  }
  return { found, sw, vw };
}

/**
 * Runs inside the page at one scroll position. Finds the fixed bars along the
 * top and bottom edges and samples them with elementFromPoint: whatever is hit
 * must belong to the bar (or to another fixed layer, such as a sheet or a
 * toast). At the end of the page it also checks that the last content clears
 * the bottom bars.
 */
function barScan({ atEnd }) {
  const vw = document.documentElement.clientWidth;
  const vh = innerHeight;
  const out = [];
  const fixedOf = (el) => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { if (getComputedStyle(e).position === "fixed") return e; } return null; };
  const bars = [];
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
    if (el.closest("[data-layout-ok]")) continue;
    if (el.parentElement && fixedOf(el.parentElement)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < vw * 0.6 || r.height < 24 || r.height > vh * 0.45) continue;
    const edge = r.bottom >= vh - 2 ? "bottom" : r.top <= 2 ? "top" : null;
    if (!edge) continue;
    bars.push({ el, r, edge });
  }
  const label = (el) => {
    const parts = [];
    for (let e = el, i = 0; e && e !== document.body && i < 3; e = e.parentElement, i++) {
      const cls = String(e.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !c.includes(":") && !c.includes("[")).slice(0, 3);
      parts.unshift(e.tagName.toLowerCase() + (cls.length ? "." + cls.join(".") : ""));
    }
    return parts.join(" > ");
  };
  for (const { el, r } of bars) {
    const bad = new Map();
    for (let x = r.left + 3; x < r.right - 2; x += 10)
      for (let y = r.top + 2; y < r.bottom - 1; y += 6) {
        if (y < 0 || y >= vh) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit || el.contains(hit) || hit === document.documentElement || hit === document.body) continue;
        const f = fixedOf(hit);
        if (f && f !== el) continue; // a sheet, dialog, toast or other fixed layer above it
        bad.set(hit, (bad.get(hit) ?? 0) + 1);
      }
    for (const [hit, n] of bad) out.push({ kind: "bar", el: label(hit), text: (hit.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60), detail: `painted over ${label(el)} (${n} samples, scrollY ${Math.round(scrollY)})` });
  }
  if (atEnd) {
    const bottomBars = bars.filter((b) => b.edge === "bottom");
    const top = Math.min(...bottomBars.map((b) => b.r.top));
    if (bottomBars.length && Number.isFinite(top)) {
      const main = document.querySelector("main") ?? document.body;
      let low = null;
      const tw = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      for (let t = tw.nextNode(); t; t = tw.nextNode()) {
        if (!t.textContent.trim() || !t.parentElement || fixedOf(t.parentElement)) continue;
        const p = t.parentElement;
        if (p.closest("[aria-hidden=true], .sr-only, [hidden]") || (p.checkVisibility && !p.checkVisibility({ opacityProperty: true, visibilityProperty: true }))) continue;
        const rg = document.createRange(); rg.selectNodeContents(t);
        const rr = rg.getBoundingClientRect();
        if (rr.height < 1 || rr.width < 1) continue;
        if (!low || rr.bottom > low.r.bottom) low = { el: p, r: rr };
      }
      if (low && low.r.bottom > top + 1 && !low.el.closest("[data-layout-ok]")) out.push({ kind: "reach", el: label(low.el), text: (low.el.textContent || "").trim().slice(0, 60), detail: `last text ends ${Math.round(low.r.bottom - top)}px under the bottom bar at the end of the page` });
    }
  }
  return out;
}

let browser = merge ? null : await chromium.launch(chrome ? { executablePath: chrome } : {});
const report = merge ? merge.split(",").flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8"))) : [];
// --resize: one load per screen for each kind of device (phone < 768, tablet,
// desktop), then the window is resized through that kind's widths. Much
// faster against a slow dev server; without it every width is a fresh load.
const resize = !!args.resize;
const kindOf = (w) => (w < 768 ? "phone" : w < 1024 ? "tablet" : "desktop");
const groups = [];
for (const w of widths) {
  const g = resize && groups.find((x) => kindOf(x[0]) === kindOf(w));
  if (g) g.push(w);
  else groups.push([w]);
}
for (const theme of merge ? [] : themes) {
  for (const ws of groups) {
    const w0 = ws[0];
    const touch = w0 < 1024;
    const ctxOpts = {
      viewport: { width: w0, height: w0 < 768 ? 800 : 900 },
      deviceScaleFactor: 1,
      hasTouch: touch,
      isMobile: w0 < 768,
      reducedMotion: "reduce",
      colorScheme: theme === "dark" ? "dark" : "light",
    };
    let ctx = await browser.newContext(ctxOpts);
    await addCookies(ctx);
    if (theme === "dark") await ctx.addInitScript(() => { try { localStorage.setItem("theme", "dark"); } catch {} });
    for (const p of pages) {
      // A fresh tab per screen: one heavy screen cannot take the rest down with it.
      let page;
      try {
        page = await ctx.newPage();
      } catch {
        // The browser went away (out of memory): start a new one and carry on.
        browser = await chromium.launch(chrome ? { executablePath: chrome } : {});
        ctx = await browser.newContext(ctxOpts);
        await addCookies(ctx);
        if (theme === "dark") await ctx.addInitScript(() => { try { localStorage.setItem("theme", "dark"); } catch {} });
        page = await ctx.newPage();
      }
      const url = harness
        ? `${harness}?page=${encodeURIComponent(p.split("?")[0])}${p.includes("?") ? "&" + p.split("?")[1] : ""}${theme === "dark" ? "&theme=dark" : ""}`
        : new URL(p, base).toString();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      try {
        await page.goto(url, { waitUntil: "load", timeout: 120000 });
        if (harness) await page.waitForFunction(() => window.__ready, null, { timeout: 20000 }).catch(() => errors.push("never finished rendering"));
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(400);
        if (theme === "dark" && !harness) await page.evaluate(() => document.documentElement.classList.add("dark"));
      } catch (e) {
        for (const w of ws) report.push({ page: p, width: w, theme, error: String(e.message).slice(0, 200), defects: [] });
        console.log(p, ws.join("/"), theme, "LOAD ERROR", String(e.message).slice(0, 80));
        await page.close().catch(() => {});
        continue;
      }
      const crash = errors.includes("never finished rendering") ? `never finished rendering: ${errors[0]}` : await page.evaluate(() => (document.body.innerText.startsWith("ERR ") ? document.body.innerText.slice(0, 200) : null)).catch(() => null);
      if (crash) {
        for (const w of ws) report.push({ page: p, width: w, theme, error: crash, defects: [] });
        console.log(p, ws.join("/"), theme, "RENDER ERROR", crash.slice(0, 80));
        await page.close().catch(() => {});
        continue;
      }
      for (const w of ws) {
        if (w !== w0) {
          await page.setViewportSize({ width: w, height: w < 768 ? 800 : 900 });
          await page.waitForTimeout(350);
        }
        // Clear the marks of the previous width.
        await page.evaluate(() => {
          for (const e of document.querySelectorAll("[data-defect]")) e.removeAttribute("data-defect");
          for (const e of document.querySelectorAll("[data-measured]")) e.removeAttribute("data-measured");
          document.getElementById("__ld-outline")?.remove();
          window.scrollTo(0, 0);
        }).catch(() => {});
        let found;
        try {
          found = (await page.evaluate(scan, { touch: w < 1024 })).found;
        } catch (e) {
          // The screen moved on by itself (a client redirect) while it was being read.
          report.push({ page: p, width: w, theme, error: String(e.message).slice(0, 200), defects: [] });
          console.log(p, w, theme, "SCAN ERROR", String(e.message).slice(0, 80));
          break;
        }
        // Fixed bars: sample them at the top, the middle and the end of the page.
        const maxY = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight).catch(() => 0);
        const seenBar = new Set();
        for (const y of [0, Math.round(maxY / 2), maxY]) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y).catch(() => {});
          await page.waitForTimeout(150);
          for (const d of await page.evaluate(barScan, { atEnd: y === maxY }).catch(() => [])) {
            const k = d.kind + d.el + d.text;
            if (seenBar.has(k)) continue;
            seenBar.add(k);
            found.push(d);
          }
        }
        await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
        const slug = `${p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root"}-${w}-${theme}`;
        let shot = null;
        if (shots === "all" || (shots === "defects" && found.length)) {
          await page.evaluate(() => {
            const st = document.createElement("style");
            st.id = "__ld-outline";
            st.textContent = "[data-defect]{outline:2px solid #ff0040 !important;outline-offset:1px}";
            document.head.appendChild(st);
          }).catch(() => {});
          shot = path.join(out, slug + ".jpg");
          await page.screenshot({ path: shot, fullPage: true, type: "jpeg", quality: 55 }).catch(() => (shot = null));
        }
        report.push({ page: p, width: w, theme, shot, errors: errors.slice(0, 3), defects: found });
        console.log(`${p} ${w} ${theme}: ${found.length}`);
      }
      await page.close().catch(() => {});
    }
    await ctx.close().catch(() => {});
  }
}
await browser?.close();
if (!merge) fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 1));

if (args.md) {
  const kinds = ["hscroll", "overflow", "clip", "overlap", "truncate", "tiny", "measure", "tap", "bar", "reach", "separator"];
  const total = report.reduce((s, r) => s + r.defects.length, 0);
  const per = {};
  for (const r of report) {
    per[r.page] ??= Object.fromEntries(kinds.map((k) => [k, 0]));
    for (const d of r.defects) per[r.page][d.kind]++;
  }
  const uniq = (k) => [...new Set(report.map((r) => r[k]))];
  const rendered = uniq("page").filter((p) => report.some((r) => r.page === p && !r.error));
  let md = `# Layout defects\n\nRun: ${new Date().toISOString().slice(0, 16)} · widths ${uniq("width").sort((a, b) => a - b).join(", ")} · themes ${uniq("theme").join(", ")} · ${rendered.length} screens · **${total} defects**\n\n`;
  md += `Detector: \`e2e/layout-defects.mjs\`. Each row is one element at one width and theme. Screenshots outline every flagged element in red.\n\n`;
  md += `## Counts per screen\n\n| screen | ${kinds.join(" | ")} | total |\n|---|${kinds.map(() => "--:").join("|")}|--:|\n`;
  for (const [p, c] of Object.entries(per)) md += `| ${p} | ${kinds.map((k) => c[k] || "").join(" | ")} | ${Object.values(c).reduce((a, b) => a + b, 0)} |\n`;
  md += `\n## Every defect\n\n`;
  for (const r of report) {
    if (!r.defects.length && !r.error) continue;
    md += `### ${r.page} · ${r.width}px · ${r.theme}\n\n`;
    if (r.error) md += `Load error: ${r.error}\n\n`;
    if (r.shot) md += `Screenshot: \`${r.shot}\`\n\n`;
    md += `| problem | element | text | detail |\n|---|---|---|---|\n`;
    for (const d of r.defects) md += `| ${d.kind} | \`${d.el.replace(/\|/g, "\\|")}\` | ${d.text.replace(/\|/g, "\\|")} | ${d.detail.replace(/\|/g, "\\|")} |\n`;
    md += "\n";
  }
  fs.mkdirSync(path.dirname(path.resolve(args.md)), { recursive: true });
  fs.writeFileSync(args.md, md);
  console.log("wrote", args.md, total, "defects");
}
