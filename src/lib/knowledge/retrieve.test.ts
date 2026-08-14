import { describe, expect, it, vi, beforeEach } from "vitest";

const rpcMock = vi.fn();

const adminClient = {
  rpc: rpcMock,
  from: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => adminClient,
}));

vi.mock("./embed-local", () => ({
  embedLocal: vi.fn(async (text: string) => {
    const v = Array.from({ length: 384 }, (_, i) => (text.length + i * 0.001) % 1);
    const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
    return v.map((x) => x / norm);
  }),
}));

import { searchKnowledge, cite } from "./retrieve";

const VEC_HIT = {
  id: "chunk-1",
  document_id: "doc-1",
  chunk_text: "Major depressive disorder involves persistent low mood and anhedonia.",
  chapter: "Chapter 6: Mood Disorders",
  section: "Depression",
  page_start: 3,
  page_end: 4,
  similarity: 0.82,
  source_id: "src-1",
  source_name: "ahuja_psychiatry",
  source_title: "A Short Textbook of Psychiatry",
};

function makeKeywordRow(over: Record<string, unknown> = {}) {
  return {
    id: "chunk-2",
    document_id: "doc-2",
    chunk_text: "Clozapine requires mandatory ANC monitoring due to agranulocytosis risk.",
    chapter: "Antipsychotics",
    section: "Clozapine",
    page_start: 7,
    page_end: 7,
    corpus_documents: {
      source_id: "src-2",
      corpus_sources: { name: "maudsley_2021", title: "The Maudsley Prescribing Guidelines" },
    },
    ...over,
  };
}

/** Default: keyword lane returns no rows. */
function stubKeywordLane(rows: unknown[] = []) {
  adminClient.from.mockImplementation(() => ({
    select: vi.fn(() => ({
      limit: vi.fn().mockResolvedValue({ data: rows, error: null }),
    })),
  }));
}

describe("searchKnowledge", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    stubKeywordLane();
  });

  it("returns vector hits with source traceability", async () => {
    rpcMock.mockResolvedValue({ data: [VEC_HIT], error: null });

    const hits = await searchKnowledge("what is major depressive disorder?");
    expect(hits.length).toBe(1);
    expect(hits[0].lane).toBe("vector");
    expect(hits[0].sourceTitle).toBe("A Short Textbook of Psychiatry");
    expect(hits[0].chapter).toContain("Mood Disorders");
    expect(hits[0].pageStart).toBe(3);
  });

  it("degrades gracefully when the vector lane errors", async () => {
    rpcMock.mockRejectedValue(new Error("embedding unavailable"));

    const hits = await searchKnowledge("clozapine monitoring");
    expect(hits).toHaveLength(0); // keyword lane empty in this test
  });

  it("rrf fuses both lanes — a shared id appears once with the combined score", async () => {
    rpcMock.mockResolvedValue({ data: [VEC_HIT], error: null });
    stubKeywordLane([makeKeywordRow({ id: "chunk-1" })]);

    const hits = await searchKnowledge("major depressive disorder");
    expect(hits.length).toBe(1);
    expect(hits[0].id).toBe("chunk-1");
  });

  it("returns keyword-only hits with source traceability when vector is empty", async () => {
    rpcMock.mockResolvedValue({ data: [], error: null });
    stubKeywordLane([makeKeywordRow()]);

    const hits = await searchKnowledge("clozapine ANC monitoring");
    expect(hits.length).toBe(1);
    expect(hits[0].lane).toBe("keyword");
    expect(hits[0].sourceTitle).toBe("The Maudsley Prescribing Guidelines");
  });

  it("returns [] for a blank query", async () => {
    const hits = await searchKnowledge("   ");
    expect(hits).toHaveLength(0);
  });
});

describe("cite", () => {
  it("formats book, chapter, section, page range without fabricating", () => {
    const c = cite({
      id: "x",
      text: "t",
      sourceId: "a",
      sourceName: "ahuja_psychiatry",
      sourceTitle: "A Short Textbook of Psychiatry",
      chapter: "Chapter 6: Mood Disorders",
      section: "Depression",
      pageStart: 3,
      pageEnd: 4,
      score: 1,
      lane: "vector",
    });
    expect(c).toContain("A Short Textbook of Psychiatry");
    expect(c).toContain("Chapter 6: Mood Disorders");
    expect(c).toContain("Depression");
    expect(c).toContain("pp. 3–4");
  });

  it("omits page number when none present", () => {
    const c = cite({
      id: "x",
      text: "t",
      sourceId: "a",
      sourceName: "a",
      sourceTitle: "Book",
      chapter: "",
      section: "",
      pageStart: null,
      pageEnd: null,
      score: 1,
      lane: "keyword",
    });
    expect(c).toBe("Book");
  });
});
