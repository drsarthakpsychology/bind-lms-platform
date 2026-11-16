// Run: export the web build (EXPO_PUBLIC_API_MODE=mock npx expo export -p web --output-dir <dir>), serve it on a port,
// then: node apps/mobile/scripts/store-screenshots.mjs apps/mobile/docs/release/phone-screenshots http://localhost:<port>
// Play phone screenshots: 360x640 CSS px at 3x = 1080x1920 PNG.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Playwright from the website's node_modules (not a dependency of the app).
const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../package.json"));
const { chromium } = require("playwright");
const OUT = process.argv[2];
const BASE = process.argv[3] ?? "http://localhost:8941";
const S = "as=student";
// Play allows 8: the two signed-out screens first (no ?as=, so nobody is signed in), then the student app.
const SCREENS = [
  ["01-welcome", "/welcome"],
  ["02-sign-in", "/sign-in"],
  ["03-home", `/home?${S}`],
  ["04-lecture", `/lecture/l5?${S}`],
  ["05-reader", `/study/m02/s2?${S}`],
  ["06-practise", `/practise?${S}`],
  ["07-doubts", `/doubts?${S}`],
  ["08-progress", `/progress?${S}`],
];
// This container's Chromium; elsewhere Playwright finds its own browser.
const pw = "/opt/pw-browsers";
const exe = fs.existsSync(pw) && fs.readdirSync(pw).filter((d) => d.startsWith("chromium_headless_shell"))[0];
const executablePath = exe ? path.join(pw, exe, fs.readdirSync(path.join(pw, exe)).find((d) => d.startsWith("chrome")), "chrome-headless-shell") : undefined;
const browser = await chromium.launch({ executablePath });
fs.mkdirSync(OUT, { recursive: true });
// Old names would upload twice: start from an empty folder.
for (const f of fs.readdirSync(OUT)) if (f.endsWith(".png")) fs.rmSync(path.join(OUT, f));
for (const [name, url] of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme: "light" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push("PAGEERR " + e.message.slice(0, 160)));
  await page.goto(`${BASE}${url}`, { waitUntil: "load" });
  await page.waitForTimeout(3500);
  if (name === "02-sign-in") {
    // A filled-in form with the Sign in button in view: the shot shows the one thing to do.
    const inputs = page.locator("input");
    await inputs.nth(0).fill("ananya@example.com");
    await inputs.nth(1).fill("my-password");
    await page.locator("input").nth(1).blur();
    await page.mouse.move(180, 400);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, location.pathname]);
  console.log(name, sw[2], sw[0] > sw[1] ? "SIDEWAYS" : "ok", errs.join(" | "));
  await ctx.close();
}
await browser.close();
