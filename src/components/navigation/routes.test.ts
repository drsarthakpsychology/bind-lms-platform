/**
 * No link in the menus, the phone bar, search, the hubs, Back buttons or the
 * source points to a missing page. Pages are read from src/app; an old
 * address counts when next.config.ts redirects it. Old addresses that moved
 * (/games/daily, /games/detective, /learn/...) must not be linked any more.
 */
import fs from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { ADMIN_SECTIONS, LECTURE_ONLY_ITEMS, STUDENT_ITEMS } from "./nav-config";
import { ADMIN_TABS, LECTURE_ONLY_TABS, STUDENT_TABS, STUDENT_TABS_NO_STUDY } from "./bottom-tab-bar";
import { backTarget, defaultBack } from "./sections";
import { STATIC_ENTRIES } from "@/lib/search/palette";
import { BOARDS } from "@/lib/standing/boards";
import { MAIN_TOOLS, MORE_TOOLS, THINK_TOOLS } from "@/components/practice/practice-hub";
import { pickContinue } from "@/app/(dashboard)/dashboard/next-step";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const APP = path.join(ROOT, "src/app");

/** Every page and route handler, as path segments ("(group)" folders dropped). */
function routes(): string[][] {
  const out: string[][] = [];
  const walk = (dir: string, segs: string[]) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name.startsWith("_")) continue;
        walk(path.join(dir, e.name), /^\(.*\)$/.test(e.name) ? segs : [...segs, e.name]);
      } else if (/^(page\.tsx|route\.ts)$/.test(e.name)) out.push(segs);
    }
  };
  walk(APP, []);
  return out;
}

const ROUTES = routes();
let REDIRECTS: RegExp[] = [];

function isPage(p: string): boolean {
  const parts = p.split("/").filter(Boolean);
  return ROUTES.some((r) => {
    const last = r[r.length - 1] ?? "";
    if (/^\[\[?\.\.\./.test(last)) return parts.length >= r.length - 1 && r.slice(0, -1).every((s, i) => s.startsWith("[") || s === parts[i]);
    return r.length === parts.length && r.every((s, i) => s.startsWith("[") || s === parts[i]);
  });
}

/** A link resolves when a page answers it, or next.config redirects it. */
function resolves(href: string): boolean {
  const p = href.split(/[?#]/)[0].replace(/(.)\/$/, "$1") || "/";
  return isPage(p) || REDIRECTS.some((re) => re.test(p));
}

beforeAll(async () => {
  const rules = (await nextConfig.redirects?.()) ?? [];
  REDIRECTS = rules.map((r) => new RegExp(`^${r.source.replace(/:(\w+)\(([^)]+)\)/g, "($2)").replace(/:\w+\*/g, ".*").replace(/:\w+/g, "[^/]+")}$`));
});

const missing = (hrefs: string[]) => hrefs.filter((h) => h.startsWith("/") && !resolves(h));

describe("every menu link opens a page", () => {
  it("student menu, lecture-only menu and phone bars", () => {
    expect(missing(STUDENT_ITEMS.map((i) => i.href))).toEqual([]);
    expect(missing(LECTURE_ONLY_ITEMS.map((i) => i.href))).toEqual([]);
    expect(missing([...STUDENT_TABS, ...STUDENT_TABS_NO_STUDY, ...LECTURE_ONLY_TABS, ...ADMIN_TABS].map((t) => t.href))).toEqual([]);
  });

  it("admin places and their visible tabs", () => {
    expect(missing(ADMIN_SECTIONS.flatMap((s) => [s.href, ...s.tabs.filter((t) => !t.hidden).map((t) => t.href)]))).toEqual([]);
  });

  it("search entries, leaderboards and the Practice hub", () => {
    expect(missing(STATIC_ENTRIES.map((e) => e.href))).toEqual([]);
    expect(missing(Object.values(BOARDS).map((b) => b.href))).toEqual([]);
    expect(missing([...MAIN_TOOLS, ...THINK_TOOLS, ...MORE_TOOLS].map((t) => t.href))).toEqual([]);
  });

  it("every Home Continue card", () => {
    const study = { kind: "read", label: "Read 1.1", href: "/study/depression/1-1", module: "Depression", resumed: true };
    const cards = [
      pickContinue({ lecture: null, study: null, weakest: null, dailyCase: true }),
      pickContinue({ lecture: null, study: null, weakest: null, dailyCase: false }),
      pickContinue({ lecture: null, study, weakest: null, dailyCase: false }),
    ];
    expect(missing(cards.map((c) => c.href))).toEqual([]);
  });
});

describe("every Back button opens a page", () => {
  it("the default Back of every student page", () => {
    const student = ROUTES.map((r) => `/${r.join("/")}`).filter((p) => /^\/(study|prep|practice|games|progress|doubts|achievements|leaderboard|journey|wall|reflect|courses|tools|passport|record|notifications|settings)\b/.test(p));
    expect(student.length).toBeGreaterThan(40);
    const bad = student.map((p) => [p, defaultBack(p.replace(/\[[^\]]+\]/g, "x"))]).filter(([, b]) => !resolves(b));
    expect(bad).toEqual([]);
  });

  it("a ?from= Back goes to a real page", () => {
    for (const from of ["/dashboard", "/study/depression", "/prep/smart/quizzes", "/practice/weak-spots", "/progress"]) {
      expect(resolves(backTarget("/practice/daily", from).href), from).toBe(true);
    }
  });
});

/* ------------------------------------------------------------ the source */

const SRC = path.join(ROOT, "src");
function sourceFiles(dir = SRC, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) sourceFiles(f, out);
    else if (/\.(ts|tsx)$/.test(e.name) && !/\.test\./.test(e.name)) out.push(f);
  }
  return out;
}
const FILES = sourceFiles().map((f) => ({ f: path.relative(ROOT, f), text: fs.readFileSync(f, "utf8") }));
const PLACES = "dashboard|study|courses|practice|prep|games|progress|doubts|achievements|leaderboard|reflect|wall|journey|today|record|passport|tools|notifications|settings|learn|admin";

describe("no link in the source points to a missing page", () => {
  it("plain links", () => {
    const re = new RegExp(`["'\`](/(?:${PLACES})(?:/[a-z0-9-]+)*)/?(?:[?#][^"'\`]*)?["'\`]`, "g");
    const bad: string[] = [];
    for (const { f, text } of FILES) for (const m of text.matchAll(re)) if (!resolves(m[1])) bad.push(`${f}: ${m[1]}`);
    // Admin tabs that only mark a place (hidden) are prefixes, not links.
    const hidden = new Set(ADMIN_SECTIONS.flatMap((s) => s.tabs.filter((t) => t.hidden).map((t) => t.href)));
    expect(bad.filter((b) => !hidden.has(b.split(": ")[1]))).toEqual([]);
  });

  it("links built from a value (`/study/${id}`)", () => {
    const re = /`(\/[a-z][a-z0-9/-]*\/)\$\{[^}]+\}((?:\/[a-z0-9-]+|\/\$\{[^}]+\})*)(?:[?#][^`]*)?`/g;
    const bad: string[] = [];
    for (const { f, text } of FILES) {
      for (const m of text.matchAll(re)) {
        if (m[1].startsWith("/api/")) continue;
        const p = `${m[1]}x${m[2].replace(/\$\{[^}]+\}/g, "x")}`;
        if (!resolves(p)) bad.push(`${f}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("no link to an address that moved", () => {
    const moved = /["'`]\/(?:games\/(?:daily|detective|scenarios|terms|coach|play|quizzes|revise)|learn(?:\/|["'`])|practice\/learn|study\/(?:activities|progress|coach|play|detective|scenarios|terms)["'`/?]|practice\/notes)/;
    expect(FILES.filter(({ text }) => moved.test(text)).map(({ f }) => f)).toEqual([]);
  });
});
