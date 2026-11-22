import type { QuickLibrary, QuickNoteView, QuickSearch } from "./quick-notes-types";
import fixture from "./quick-notes-fixture.json";

/**
 * Answers for the mock server (tests and the browser test build): a slice of
 * the real library and a few real notes, made from the website's data by
 * dumping quickLibrary() and quickNoteView(). Not sample data for students.
 */
const F = fixture as unknown as { library: QuickLibrary; views: Record<string, QuickNoteView> };

export const mockQuickLibrary = (): QuickLibrary => F.library;
export const mockQuickNote = (id: string): QuickNoteView | null => F.views[id] ?? null;

export function mockQuickSearch(q: string): QuickSearch {
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const w = n(q);
  if (!w) return { q, hits: [] };
  const hits: QuickSearch["hits"] = [];
  for (const i of F.library.items) {
    const v = F.views[i.key];
    const body = v ? [v.oneLine, ...v.facts.map((f) => f.value), ...v.sections.flatMap((s) => [...(s.bullets ?? []), ...(s.table?.rows.flat() ?? []), ...(s.pairs ?? []).map((p) => p.value)])] : [i.line];
    const inName = n([i.title, ...i.aka].join(" ")).includes(w);
    const line = body.find((b) => n(b).includes(w));
    if (inName || line) hits.push({ key: i.key, snippet: inName ? null : (line ?? null) });
  }
  return { q, hits: hits.slice(0, 40) };
}
