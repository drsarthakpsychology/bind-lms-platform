import { describe, expect, it } from "vitest";
import { lengthBias } from "@/lib/games-sims/item-tags";
import { STUDY_MODULES } from "@/lib/games/tags";
import { SAY_IT } from "./say-it";

const DASH = /[–—]/;
const CITE = /\bet al\b|Kaplan|Sadock|Stahl|Maudsley|Ahuja|Lishman|DSM|ICD|\bp\. ?\d/;

describe("Say it clinically phrase bank", () => {
  it("has at least 600 lay phrase to clinical term cards with unique ids and phrases", () => {
    expect(SAY_IT.length).toBeGreaterThanOrEqual(355);
    expect(new Set(SAY_IT.map((x) => x.id)).size).toBe(SAY_IT.length);
    const phrases = SAY_IT.map((x) => x.phrase.toLowerCase());
    expect(phrases.filter((p, i) => phrases.indexOf(p) !== i)).toEqual([]);
  });
  it("every card is complete and tagged", () => {
    for (const x of SAY_IT) {
      expect(x.wrong.length, x.id).toBe(3);
      expect(new Set([x.term, ...x.wrong]).size, x.id).toBe(4);
      expect(x.why.length, x.id).toBeGreaterThan(20);
      expect(x.meaning.length, x.id).toBeGreaterThan(4);
      expect(x.objective.length, x.id).toBeGreaterThan(8);
      expect(x.exams.length, x.id).toBeGreaterThan(0);
      const mod = x.module.split("/")[0];
      expect(STUDY_MODULES as readonly string[], `${x.id} ${x.module}`).toContain(mod);
    }
  });
  it("student text has no dashes or citations", () => {
    for (const x of SAY_IT) {
      const t = [x.phrase, x.meaning, x.term, x.note ?? "", x.why, ...x.wrong].join(" ");
      expect(DASH.test(t), x.id).toBe(false);
      expect(CITE.test(t), x.id).toBe(false);
    }
  });
  it("covers many languages and every difficulty", () => {
    const langs = new Set(SAY_IT.map((x) => x.language));
    for (const l of ["Hindi", "Gujarati", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi"]) expect(langs.has(l), l).toBe(true);
    for (const d of [1, 2, 3, 4, 5]) expect(SAY_IT.filter((x) => x.difficulty === d).length / SAY_IT.length, `level ${d}`).toBeGreaterThan(0.1);
  });
  it("the right term is not given away by length", () => {
    const bias = lengthBias(SAY_IT.map((x) => ({ right: x.term, options: [x.term, ...x.wrong] })));
    expect(bias.longest).toBeLessThanOrEqual(0.36);
    expect(bias.shortest).toBeLessThanOrEqual(0.36);
  });
});
