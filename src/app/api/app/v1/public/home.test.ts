import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GET, dynamic, revalidate } from "./home/route";
import { HERO_LEDE, HOME_HEADINGS } from "@/lib/app-api/public-home";
import * as C from "@/components/home/content";

/** No value the contract promises may be null or undefined (only `redFlag` may be null). */
function noHoles(v: unknown, path = "data"): string[] {
  if (v === undefined) return [path];
  if (v === null) return path.endsWith(".redFlag") || path.endsWith(".time") ? [] : [path];
  if (Array.isArray(v)) return v.flatMap((x, i) => noHoles(x, `${path}[${i}]`));
  if (typeof v === "object") return Object.entries(v as Record<string, unknown>).flatMap(([k, x]) => noHoles(x, `${path}.${k}`));
  return [];
}

describe("GET /public/home", () => {
  it("answers the homepage as data, public and cached", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toMatch(/public/);
    expect(res.headers.get("cache-control")).toMatch(/s-maxage=3600/);
    expect(dynamic).toBe("force-static");
    expect(revalidate).toBe(3600);
    const body = await res.json();
    expect(body.ok).toBe(true);
    const d = body.data;
    expect(d.v).toBe(1);
    expect(d.hero.title).toEqual(["Don't just study", "Psychology.", "Practise it."]);
    expect(d.sections.programme.stats).toHaveLength(C.STATS.length);
    expect(d.sections.curriculum.modules).toHaveLength(C.MODULES.length);
    expect(d.sections.disorders.list).toHaveLength(C.DISORDERS.length);
    expect(d.sections.faq.list).toEqual(C.FAQ.map((x) => ({ q: x.q, a: x.a })));
    expect(d.contact.phone).toBe(C.CONTACT.phone);
    expect(noHoles(d)).toEqual([]);
  });

  it("every quick answer points at a section that is in the answer", async () => {
    const d = (await GET().json()).data;
    for (const q of d.hero.quickAnswers) expect(Object.keys(d.sections)).toContain(q.section);
  });

  it("never says which cohort is running, and has no design-only fields", async () => {
    const text = JSON.stringify((await GET().json()).data);
    expect(text).not.toContain(C.COHORT.label);
    expect(text).not.toContain(C.COHORT.starts);
    expect(text).not.toMatch(/"(tone|heads|fill|icon)":/);
  });

  it("the headings and hero line are still the homepage's own words", () => {
    const src = readFileSync(join(process.cwd(), "src/components/home/home-page.tsx"), "utf8")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
    for (const [key, head] of Object.entries(HOME_HEADINGS)) {
      const words = "tag" in head ? [head.tag, head.title, head.accent] : [...head.title];
      for (const w of words) expect([key, src.includes(w)]).toEqual([key, true]);
    }
    expect(src).toContain(HERO_LEDE);
  });
});
