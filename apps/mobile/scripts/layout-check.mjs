// Layout checker for the app's react-native-web export (mock API).
// Build:  EXPO_PUBLIC_API_MODE=mock npx expo export -p web --clear --output-dir <webroot>
// Run:    node scripts/layout-check.mjs <webroot> <outdir> <width>x<height> <light|dark> [stress|font13|stress+font13] [filter] [--noshots]
//   stress = long names and titles, large numbers (?stress=1 in the mock); font13 = every text 1.3x (Android large font).
//   filter = comma list of screen-name parts (s-home,a-admin-students). Playwright comes from the website's node_modules.
// For every screen: loads it, checks the top view, scrolls the main scroller to the end,
// checks again, and saves a JPEG of both. Issues go to <outdir>/issues.json.
// Checks: text over text, text covered by another element (tab bar, footer, sheet, sticker),
// text overflowing its box (cut or squashed), text off the screen edge, font under 12px,
// a line that starts with "·", a word broken in the middle.
import { createRequire } from "node:module";
import fs from "node:fs"; import http from "node:http"; import path from "node:path";
const require = createRequire(new URL("../../../package.json", import.meta.url));
const { chromium } = require("playwright");
const args = process.argv.slice(2);
const NOSHOTS = args.includes("--noshots");
const [ROOT, OUT, VP, THEME, STRESS, ONLY] = args.filter((a) => a !== "--noshots");
const [W, H] = VP.split("x").map(Number);
const stress = (STRESS ?? "").includes("stress");
// "font13": every text 1.3x bigger, as with Android's largest common font size setting.
const font13 = (STRESS ?? "").includes("font13");
const PORT = 9100 + Math.floor(Math.random() * 800);
const types = { ".js": "text/javascript", ".html": "text/html", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".json": "application/json", ".webp": "image/webp", ".svg": "image/svg+xml", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => { const p = decodeURIComponent(req.url.split("?")[0]); let f = path.join(ROOT, p); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = fs.existsSync(f + ".html") ? f + ".html" : path.join(ROOT, "index.html"); res.setHeader("content-type", types[path.extname(f)] ?? "application/octet-stream"); fs.createReadStream(f).pipe(res); }).listen(PORT);
const n = (p) => p.replace(/^\//, "").replace(/[/?=&@.]+/g, "-");
const student = ["/home", "/learn", "/practise", "/library", "/me", "/assignments", "/certificates", "/certificate/VIBHA-C2-0123-M1", "/course/course-1", "/doubt/d1", "/doubts/ask", "/doubts", "/help", "/journey",
  "/lecture/l5", "/lecture/l6?tab=assignment", "/lectures", "/map", "/map/practice", "/material/m1", "/notes/depression", "/notes", "/notification/n1", "/notifications", "/progress", "/reference/anhedonia", "/reference",
  "/saved", "/search", "/search?q=dep", "/settings", "/study/m02/s1", "/study/m02/checkpoint/1", "/study/m02", "/study/m01/test", "/study", "/wall", "/shop", "/game/leaderboard", "/case/library",
  "/game/blitz", "/game/sort", "/game/mse", "/game/ward", "/game/rx", "/game/duel", "/game/escape", "/game/comorbid", "/case/daily", "/case/detective", "/case/wwyd", "/case/osce", "/case/formulation",
  "/case/judgment", "/case/ethics", "/case/landmark", "/case/say-it", "/case/two-minute", "/case/mse-trainer", "/case/weak-spots", "/case/out-of-depth",
  "/practise/games", "/practise/cases", "/prep", "/prep/statistics", "/prep/set?subject=statistics", "/prep/long?subject=statistics", "/prep/mock", "/medicine/escitalopram", "/medicine/compare?a=escitalopram&b=sertraline"];
const S = [
  ["v-welcome", "/welcome"], ["v-request", "/request"], ["v-sign-in", "/sign-in"], ["v-forgot", "/forgot-password"], ["v-setup", "/setup?token=abcdef"], ["v-verify", "/verify/VIBHA-C2-0123-M1"],
  ["g-setpin", "/home", "student", "pin=0"], ["g-lock", "/home", "student", "lock=1"], ["g-other", "/home", "student", "notice=device_replaced"], ["g-paused", "/home", "student", "mock=paused"], ["g-update", "/home", "student", "mock=update"],
  ...student.map((p) => ["s-" + n(p), p, "student"]),
  ...["/home?mock=new", "/home?mock=done", "/home?mock=error", "/learn?mock=error", "/practise?mock=error", "/me?mock=error", "/notifications?mock=empty", "/doubts?mock=empty", "/certificates?mock=empty", "/saved?mock=empty", "/assignments?mock=empty", "/library?mock=error", "/notes?mock=empty", "/wall?mock=empty", "/admin/home?mock=error|admin", "/admin/students?mock=empty|admin", "/lo/home?mock=error|lecture"].map((p) => { const [u, as = "student"] = p.split("|"); return ["x-" + n(u) + (as !== "student" ? "-" + as : ""), u.split("?")[0], as, u.split("?")[1]]; }),
  ...["/lo/home", "/lo/lectures", "/lo/doubts", "/lo/me", "/lectures", "/lecture/l2", "/settings", "/search"].map((p) => ["l-" + n(p), p, "lecture"]),
  ...["/admin/home", "/admin/students", "/admin/activity", "/admin/messages", "/admin/more", "/admin/alerts", "/admin/certificates", "/admin/certificates/anyone", "/admin/certificates/new", "/admin/cohort/c2", "/admin/cohorts",
    "/admin/doubt/ad1", "/admin/doubts", "/admin/form/f1", "/admin/forms", "/admin/inbox", "/admin/people", "/admin/person/tanvi@example.com", "/admin/review", "/admin/search", "/admin/system", "/admin/thread/i1", "/student/u1", "/compose"].map((p) => ["a-" + n(p), p, "admin"]),
];

// Runs inside the page. Returns a list of issues for what is on screen now.
function inspect(phase) {
  const vw = innerWidth, vh = innerHeight;
  // The main vertical scroller: content inside it may pass under fixed bars while scrolling.
  let main = null; { let h = 0; for (const el of document.querySelectorAll("div")) { const s = getComputedStyle(el); if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight - el.clientHeight > h) { h = el.scrollHeight - el.clientHeight; main = el; } } }
  // A screen too short to scroll: everything is one layer of content.
  if (!main) main = document.body;
  const inMain = (el) => main.contains(el);
  const out = [];
  const label = (el) => (el.textContent || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 50);
  const visible = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === "hidden" || s.display === "none" || parseFloat(s.opacity) < 0.05 || e.getAttribute("aria-hidden") === "true") return false; } return true; };
  // Leaf text: elements with their own text.
  const texts = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("svg, script, style, noscript")) continue;
    const own = [...el.childNodes].filter((c) => c.nodeType === 3 && c.textContent.trim());
    if (!own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
    if (!visible(el)) continue;
    // The real ink boxes of the text (one per line).
    const rects = [];
    for (const t of own) { const rg = document.createRange(); rg.selectNodeContents(t); for (const q of rg.getClientRects()) if (q.width > 1 && q.height > 1) rects.push(q); }
    texts.push({ el, r, rects, own });
  }
  // Clip boxes: what overflow:hidden ancestors and horizontal scrollers allow.
  const clipOf = (el, hard) => { let box = { l: -1e9, t: -1e9, r: 1e9, b: 1e9 }; let hscroll = false; for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { if (hard && main && e !== main && e.contains(main) && main.contains(el)) continue; const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 2) hscroll = true; const q = e.getBoundingClientRect(); const cx = hard ? s.overflowX === "hidden" || s.overflowX === "clip" : s.overflowX !== "visible"; const cy = hard ? s.overflowY === "hidden" || s.overflowY === "clip" : s.overflowY !== "visible"; if (cx) box = { ...box, l: Math.max(box.l, q.left), r: Math.min(box.r, q.right) }; if (cy) box = { ...box, t: Math.max(box.t, q.top), b: Math.min(box.b, q.bottom) }; } return { box, hscroll }; };
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  for (const t of texts) {
    const s = getComputedStyle(t.el);
    const fs = parseFloat(s.fontSize);
    const txt = label(t.el);
    const { box, hscroll } = clipOf(t.el, false);
    const hard = clipOf(t.el, true).box;
    // Moving (marquee, entering) text is transformed: skip edge checks for it.
    let moving = false; for (let e = t.el; e && e !== document.body; e = e.parentElement) { const tf = getComputedStyle(e).transform; if (tf && tf !== "none" && /matrix\(1, 0, 0, 1, (-?[1-9]|-?\d{2,})/.test(tf)) { moving = true; break; } }
    // Clipped away by a parent: only parts inside the clip are real.
    const shown = t.rects.filter((q) => q.right > box.l + 1 && q.left < box.r - 1 && q.bottom > box.t + 1 && q.top < box.b - 1);
    if (!shown.length) continue;
    if (fs < 12 && /[A-Za-z0-9ऀ-ॿ]/.test(txt)) out.push({ kind: "tiny", txt, fs });
    // Overflow of the text's own box.
    const clamp = s.webkitLineClamp && s.webkitLineClamp !== "none";
    const ellipsis = s.textOverflow === "ellipsis";
    if (t.el.scrollWidth > t.el.clientWidth + 2 && s.overflowX !== "visible" && !ellipsis && !clamp) out.push({ kind: "cut-x", txt, w: t.el.clientWidth, need: t.el.scrollWidth });
    if (t.el.scrollHeight > t.el.clientHeight + 3 && s.overflowY !== "visible" && !clamp && t.el.clientHeight > 0) out.push({ kind: "squashed", txt, h: t.el.clientHeight, need: t.el.scrollHeight });
    // Text drawn outside a clipping parent (cut off visibly).
    // Cut on purpose with "…" (numberOfLines): fine.
    let dots = false; for (let e = t.el; e && e !== document.body && !dots; e = e.parentElement) { const st = getComputedStyle(e); if (st.textOverflow === "ellipsis" || (st.webkitLineClamp && st.webkitLineClamp !== "none")) dots = true; }
    if (!dots) for (const q of t.rects) { if ((q.right > hard.r + 2 || q.bottom > hard.b + 2 || q.left < hard.l - 2 || q.top < hard.t - 2) && q.right > hard.l && q.left < hard.r && q.bottom > hard.t && q.top < hard.b && !hscroll && !moving) { out.push({ kind: "clipped", txt, by: Math.round(Math.max(q.right - hard.r, q.bottom - hard.b, hard.l - q.left, hard.t - q.top)) }); break; } }
    // Off the screen sideways.
    if (!hscroll && !moving && !dots && shown.some((q) => q.right > vw + 1 || q.left < -1)) out.push({ kind: "offscreen-x", txt, l: Math.round(Math.min(...shown.map((q) => q.left))), r: Math.round(Math.max(...shown.map((q) => q.right))) });
    // Lines that start or end with a "·", and words broken mid-word.
    for (const node of t.own) {
      const str = node.textContent;
      const rc = (i) => { const rg = document.createRange(); rg.setStart(node, i); rg.setEnd(node, i + 1); return rg.getBoundingClientRect(); };
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "·") {
          let p = i - 1; while (p >= 0 && /\s/.test(str[p])) p--;
          let x = i + 1; while (x < str.length && /\s/.test(str[x])) x++;
          const me = rc(i);
          if (p >= 0 && rc(p).top < me.top - 3) out.push({ kind: "dot-starts-line", txt: str.slice(Math.max(0, i - 20), i + 20) });
        }
      }
      if (t.rects.length > 1 && str.length < 400) {
        for (let i = 1; i < str.length; i++) {
          if (/[\p{L}\p{N}]/u.test(str[i - 1]) && /[\p{L}\p{N}]/u.test(str[i]) && rc(i).top > rc(i - 1).top + 3 && rc(i).width > 0 && rc(i - 1).width > 0) { out.push({ kind: "word-broken", txt: str.slice(Math.max(0, i - 15), i) + "|" + str.slice(i, i + 15) }); break; }
        }
      }
    }
    // Covered: the middle of each line, inside the screen, must hit this text (or its own tree).
    for (const q of shown) {
      const cx = Math.min(Math.max(q.left + q.width / 2, 1), vw - 1), cy = Math.min(Math.max(q.top + q.height / 2, 1), vh - 1);
      if (cy <= 0 || cy >= vh || q.width < 4) continue;
      const hit = document.elementFromPoint(cx, cy);
      if (!hit) continue;
      if (hit === t.el || t.el.contains(hit) || hit.contains(t.el)) continue;
      // Hit a sibling inside the same pressable or row: fine when the hit is transparent with no text.
      const hs = getComputedStyle(hit);
      const opaque = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { if (x.contains(t.el)) return false; const st = getComputedStyle(x); const bg = st.backgroundColor; if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return true; if (x.textContent.trim() && [...x.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return true; } return false; };
      if (hs.pointerEvents === "none") continue;
      // Scroll content passing under a pinned bar is normal mid-scroll; at the very top nothing may hide
      // under a top bar, and at the very end nothing may hide under a bottom bar, footer or tab bar.
      const tin = inMain(t.el), hin = inMain(hit);
      if (tin && hin) continue; // stacking inside the list (swipe actions): checked by text-over-text
      if (tin && !hin && !((phase === "top" && cy < vh / 2) || (phase === "end" && cy >= vh / 2))) continue;
      // A full-screen layer (lock, gate, modal) over the screen behind it is by design.
      let full = false; for (let x = hit; x && x !== document.body; x = x.parentElement) { if (x.contains(t.el)) break; const q = x.getBoundingClientRect(); if (q.width >= vw - 2 && q.height >= vh * 0.85 && getComputedStyle(x).backgroundColor !== "rgba(0, 0, 0, 0)") { full = true; break; } }
      if (full) continue;
      if (opaque(hit)) { out.push({ kind: "covered", txt, by: label(hit).slice(0, 30) || hit.getAttribute("role") || hit.tagName, y: Math.round(cy) }); break; }
    }
  }
  // Text over text: two text boxes whose ink overlaps, neither inside the other.
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
    const a = texts[i], b = texts[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    let area = 0; for (const p of a.rects) for (const q of b.rects) area += inter(p, q);
    if (area > 12) {
      const ca = clipOf(a.el, false).box, cb = clipOf(b.el, false).box; if (a.rects.every((q) => q.bottom < ca.t || q.top > ca.b) || b.rects.every((q) => q.bottom < cb.t || q.top > cb.b)) continue;
      // Only when both are really seen there: the overlap point hits one of them.
      let seen2 = false; for (const p of a.rects) for (const q of b.rects) { if (inter(p, q) < 4) continue; const x = (Math.max(p.left, q.left) + Math.min(p.right, q.right)) / 2, y = (Math.max(p.top, q.top) + Math.min(p.bottom, q.bottom)) / 2; const h = document.elementFromPoint(x, y); if (h && (a.el.contains(h) || b.el.contains(h))) seen2 = true; }
      if (!seen2) continue;
      // A text is seen at its middle when the hit is itself, or the other text with no opaque layer between them.
      const veiled = (t, h) => { for (let x = h; x && !x.contains(t.el); x = x.parentElement) { const bg = getComputedStyle(x).backgroundColor; if (bg && bg !== "transparent" && !/rgba\(.*,\s*0\)$/.test(bg)) return true; } return false; };
      const top = (t) => t.rects.some((q) => { const h = document.elementFromPoint(Math.min(vw - 1, Math.max(1, q.left + q.width / 2)), Math.min(vh - 1, Math.max(1, q.top + q.height / 2))); return h && (t.el.contains(h) || ((a.el.contains(h) || b.el.contains(h)) && !veiled(t, h))); });
      if (!top(a) || !top(b)) continue;
      if (inMain(a.el) !== inMain(b.el) && !(phase === "end" && Math.min(...a.rects.map((q) => q.top), ...b.rects.map((q) => q.top)) > vh / 2) && !(phase === "top" && Math.max(...a.rects.map((q) => q.bottom)) < vh / 2)) continue;
      out.push({ kind: "text-over-text", txt: label(a.el).slice(0, 30) + " ⟂ " + label(b.el).slice(0, 30), area: Math.round(area) }); }
  }
  // Tap targets under the bottom tab bar / footer at the end of scroll handled by "covered".
  // Page-level horizontal scroll.
  if (document.documentElement.scrollWidth > vw + 1) out.push({ kind: "page-hscroll", w: document.documentElement.scrollWidth });
  // Dedupe.
  const seen = new Set();
  return out.filter((o) => { const k = o.kind + o.txt; if (seen.has(k)) return false; seen.add(k); return true; });
}

const pw = "/opt/pw-browsers"; const exe = fs.readdirSync(pw).find((d) => d.startsWith("chromium_headless_shell"));
const browser = await chromium.launch({ executablePath: path.join(pw, exe, fs.readdirSync(path.join(pw, exe)).find((d) => d.startsWith("chrome")), "chrome-headless-shell") });
fs.mkdirSync(OUT, { recursive: true });
const report = [];
const tag = `${W}-${THEME}${stress ? "-stress" : ""}${font13 ? "-font13" : ""}`;
const list = S.filter(([name]) => !ONLY || ONLY.split(",").some((o) => name.includes(o)));
async function one([name, p, as, extra]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, colorScheme: THEME, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push("PAGEERR " + e.message.slice(0, 160)));
  const q = [as ? `as=${as}` : "", `theme=${THEME}`, stress ? "stress=1" : "", extra ?? ""].filter(Boolean).join("&");
  try {
    await page.goto(`http://localhost:${PORT}${p}${p.includes("?") ? "&" : "?"}${q}`, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    if (font13) {
      await page.evaluate(() => { const els = [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())); const sizes = els.map((el) => { const s = getComputedStyle(el); return [parseFloat(s.fontSize), parseFloat(s.lineHeight)]; }); els.forEach((el, i) => { const [f, l] = sizes[i]; el.style.fontSize = f * 1.3 + "px"; if (l) el.style.lineHeight = l * 1.3 + "px"; }); });
      await page.waitForTimeout(400);
    }
    const top = await page.evaluate(inspect, "top");
    if (!NOSHOTS) await page.screenshot({ path: path.join(OUT, `${name}.jpg`), quality: 55, type: "jpeg" });
    const scrolled = await page.evaluate(() => {
      let best = null, h = 0;
      for (const el of document.querySelectorAll("div")) { const s = getComputedStyle(el); if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight - el.clientHeight > h) { h = el.scrollHeight - el.clientHeight; best = el; } }
      if (best) best.scrollTop = h + 100;
      return h;
    });
    let end = [];
    if (scrolled > 40) {
      await page.waitForTimeout(900);
      end = await page.evaluate(inspect, "end");
      if (!NOSHOTS) await page.screenshot({ path: path.join(OUT, `${name}--end.jpg`), quality: 55, type: "jpeg" });
    }
    const keys = new Set(top.map((o) => o.kind + o.txt));
    const issues = [...top.map((o) => ({ ...o, at: "top" })), ...end.filter((o) => !keys.has(o.kind + o.txt)).map((o) => ({ ...o, at: "end" }))];
    report.push({ name, p, scrolled, issues, errs });
    console.log(`${tag} ${name} ${issues.length ? issues.map((o) => o.kind).join(",") : "ok"}${errs.length ? " " + errs[0] : ""}`);
  } catch (e) { console.log(tag, name, "FAIL", e.message.slice(0, 100)); report.push({ name, p, fail: e.message.slice(0, 200) }); }
  await ctx.close();
}
const queue = [...list];
await Promise.all([0, 1, 2].map(async () => { while (queue.length) await one(queue.shift()); }));
report.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(OUT, "issues.json"), JSON.stringify(report, null, 1));
const count = {}; for (const r of report) for (const o of r.issues ?? []) count[o.kind] = (count[o.kind] ?? 0) + 1;
console.log("SUMMARY", tag, JSON.stringify(count));
await browser.close(); server.close();
