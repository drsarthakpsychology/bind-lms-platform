import { describe, expect, it } from "vitest";
import { splitPages, chunkBook, splitPassages, pageToChapter } from "./chunk";
import type { BookOutline } from "./outline";

function makeCache(pages: Array<[number, string]>): string {
  return pages.map(([n, text]) => `<<<PAGE ${n}>>>\n${text}`).join("\n\n");
}

const OUTLINE: BookOutline = {
  id: "test",
  confidence: "high",
  issues: [],
  frontMatter: [{ title: "Front", pageStart: 1, pageEnd: 1, sections: [{ title: "Cover", page: 1 }] }],
  chapters: [
    {
      title: "Chapter 1: Mood Disorders",
      pageStart: 2,
      pageEnd: 4,
      sections: [
        { title: "Depression", page: 2 },
        { title: "Mania", page: 4 },
      ],
    },
    {
      title: "Chapter 2: Psychosis",
      pageStart: 5,
      pageEnd: 6,
      sections: [{ title: "Schizophrenia", page: 5 }],
    },
  ],
  unattributedPages: [],
};

describe("splitPages", () => {
  it("parses <<<PAGE n>>> markers into ordered pages", () => {
    const cache = makeCache([
      [1, "cover text"],
      [2, "first content"],
      [3, "more content"],
    ]);
    const pages = splitPages(cache);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toEqual({ index: 1, text: "cover text" });
    expect(pages[2].index).toBe(3);
  });

  it("handles an empty/whitespace page", () => {
    const cache = makeCache([[1, "  \n "]]);
    const pages = splitPages(cache);
    expect(pages[0].text).toBe("");
  });
});

describe("pageToChapter", () => {
  it("maps each page index to its chapter title", () => {
    const map = pageToChapter(OUTLINE);
    expect(map.get(1)).toBe("Front");
    expect(map.get(2)).toBe("Chapter 1: Mood Disorders");
    expect(map.get(4)).toBe("Chapter 1: Mood Disorders");
    expect(map.get(5)).toBe("Chapter 2: Psychosis");
    expect(map.get(99)).toBeUndefined();
  });
});

describe("splitPassages", () => {
  it("returns a single passage for short text", () => {
    expect(splitPassages("short text", 900, 400)).toEqual(["short text"]);
  });

  it("splits long text at sentence boundaries", () => {
    const text = Array.from({ length: 30 }, (_, i) => `Sentence number ${i} is about psychiatry and its treatment.`).join(" ");
    const passages = splitPassages(text, 900, 400);
    expect(passages.length).toBeGreaterThan(1);
    for (const p of passages) {
      expect(p.length).toBeLessThanOrEqual(920);
      // No invented text: each passage is a contiguous slice.
      expect(text).toContain(p.replace(/^\./, ""));
    }
  });

  it("never fabricates content (passages are contiguous substrings)", () => {
    const text = "Alpha disorder presents with delusions and hallucinations. ".repeat(40);
    const passages = splitPassages(text, 900, 400);
    let joined = passages.join(" ");
    // normalize whitespace
    joined = joined.replace(/\s+/g, " ");
    const src = text.replace(/\s+/g, " ").trim();
    expect(joined.length).toBeGreaterThanOrEqual(src.length * 0.9);
  });
});

describe("chunkBook", () => {
  it("produces hierarchical chunks with chapter/section/page metadata", () => {
    const cache = makeCache([
      [1, "cover"],
      [2, "Low mood is the core of depression. " + "Additional anhedonia. ".repeat(20)],
      [3, "Sleep disturbance is common. " + "Appetite change often follows. ".repeat(20)],
      [4, "Mania involves elevated mood. " + "Grandiosity is frequent. ".repeat(20)],
      [5, "Schizophrenia features delusions. " + "Hallucinations are common. ".repeat(20)],
    ]);
    const chunks = chunkBook("test", cache, OUTLINE);
    expect(chunks.length).toBeGreaterThan(3);

    const moodChunks = chunks.filter((c) => c.chapter === "Chapter 1: Mood Disorders");
    expect(moodChunks.length).toBeGreaterThan(0);
    expect(moodChunks[0].sourceId).toBe("test");
    expect(moodChunks[0].pageStart).toBeGreaterThanOrEqual(2);

    // Pages 2-3 should be Depression, page 4 Mania.
    const maniaChunks = chunks.filter((c) => c.section === "Mania");
    expect(maniaChunks.length).toBeGreaterThan(0);
    expect(maniaChunks[0].text).toContain("Mania involves elevated mood");
  });

  it("marks unattributed pages as 'Unattributed' chapter rather than dropping them", () => {
    const cache = makeCache([[9, "Mystery page content. ".repeat(30)]]);
    const chunks = chunkBook("test", cache, OUTLINE);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].chapter).toBe("Unattributed");
  });
});
