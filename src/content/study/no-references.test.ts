import { describe, expect, it } from "vitest";
import { MODULES } from "@/lib/study";

/**
 * Owner rule (2026-11-06): no formal references in student-facing content —
 * no book titles, authors-as-citations, editions, page numbers, journal
 * names, "et al.", DOIs, links or bibliographies. Teaching about researchers
 * and landmark studies is fine. Admin-only `ref` fields are not checked.
 */
const BANNED = [
  /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Fish'?s|Ahuja|Hilgard|Bear,? Connors|Prescriber'?s Guide|Synopsis of Psychiatry|Essential Psychopharmacology)\b/,
  /\bet al\.?/,
  /https?:\/\//,
  /\bdoi\b/i,
  /\bpp?\.\s?\d+/,
  /\b(Lancet|JAMA|NEJM|New England Journal|Psychological Bulletin|American Journal of Psychiatry|Am J Psychiatry|World Psychiatry|Nature Mental Health|BMJ|Cochrane)\b/,
  /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i,
];

describe("student content has no formal references", () => {
  for (const m of MODULES) {
    it(m.id, () => {
      const text = JSON.stringify({ meta: { title: m.title, tagline: m.tagline, outcomes: m.outcomes, writeTask: m.writeTask }, sections: m.sections.map((s) => s.blocks) });
      const hits = BANNED.flatMap((re) => {
        const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
        return [...text.matchAll(g)].map((x) => text.slice(Math.max(0, x.index! - 40), x.index! + 40));
      });
      expect(hits, hits.join("\n")).toEqual([]);
    });
  }
});

/** Owner rule (2026-11-06): no em or en dashes in student text; they read as AI-written. */
describe("student content has no em or en dashes", () => {
  for (const m of MODULES) {
    it(m.id, () => {
      const text = JSON.stringify({ meta: { title: m.title, tagline: m.tagline, outcomes: m.outcomes, writeTask: m.writeTask }, sections: m.sections.map((s) => [s.title, s.blocks]) });
      const hits = [...text.matchAll(/[—–]/g)].slice(0, 8).map((x) => text.slice(Math.max(0, x.index! - 30), x.index! + 30));
      expect(hits, hits.join("\n")).toEqual([]);
    });
  }
});
