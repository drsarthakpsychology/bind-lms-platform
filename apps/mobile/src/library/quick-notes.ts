import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/auth";
import { recentList } from "@/lib/recent";
import type { QuickItem, QuickLibrary, QuickNoteView, QuickSearch } from "./quick-notes-types";

/**
 * Quick Notes on the phone: the one library the website has (criteria,
 * comparisons, medicines, therapies, theories, assessment, summaries and
 * words), read from /study/quick-notes. The list is small enough to keep;
 * search asks the server, which reads the text inside every note.
 */
export const QUICK_ID = /^(criteria|diff|compare|theory|therapy|pharm|assess|exam)-[a-z0-9-]+$/;
export const isQuickId = (id: string) => QUICK_ID.test(id);

export const quickKeys = {
  library: ["quick-notes"] as const,
  note: (id: string) => ["quick-note", id] as const,
  search: (q: string) => ["quick-notes-search", q] as const,
};

const arr = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);
const str = (x: unknown): string => (typeof x === "string" ? x : "");

/** Read defensively: a row without a key, title or address is dropped. */
export function libraryView(raw: unknown): QuickLibrary {
  const r = (raw ?? {}) as Partial<QuickLibrary>;
  const items = arr<QuickItem>(r.items).filter((i) => i && str(i.key) && str(i.title) && str(i.app));
  return { items, types: arr<QuickLibrary["types"][number]>(r.types).filter((t) => t && str(t.id)), topics: arr<QuickLibrary["topics"][number]>(r.topics).filter((t) => t && str(t.id)) };
}

export function noteViewOf(raw: unknown): QuickNoteView {
  const v = (raw ?? {}) as Partial<QuickNoteView>;
  return {
    id: str(v.id),
    type: (v.type ?? "summary") as QuickNoteView["type"],
    typeLabel: str(v.typeLabel),
    title: str(v.title),
    aka: arr<string>(v.aka),
    oneLine: str(v.oneLine),
    topic: str(v.topic),
    topicLabel: str(v.topicLabel),
    facts: arr<QuickNoteView["facts"][number]>(v.facts).filter((f) => f && str(f.label) && str(f.value)),
    sections: arr<QuickNoteView["sections"][number]>(v.sections).filter((s) => s && str(s.title)),
    alert: v.alert && Array.isArray(v.alert.points) ? v.alert : null,
    deeper: arr<QuickNoteView["deeper"][number]>(v.deeper).filter((l) => l && str(l.label) && l.target),
    practise: arr<QuickNoteView["practise"][number]>(v.practise).filter((l) => l && str(l.label) && l.target),
    sourceLine: v.sourceLine ? str(v.sourceLine) : null,
    careLine: v.careLine ? str(v.careLine) : null,
  };
}

export const quickQo = {
  library: () => queryOptions({ queryKey: quickKeys.library, queryFn: async () => libraryView(await api.get<unknown>("/study/quick-notes")), staleTime: 60 * 60_000 }),
  note: (id: string) => queryOptions({ queryKey: quickKeys.note(id), queryFn: async () => noteViewOf(await api.get<unknown>(`/study/quick-notes/${encodeURIComponent(id)}`)), staleTime: 60 * 60_000, enabled: id.length > 0 }),
  search: (q: string) =>
    queryOptions({
      queryKey: quickKeys.search(q),
      queryFn: async () => {
        const r = (await api.get<unknown>("/study/quick-notes/search", { query: { q } })) as Partial<QuickSearch>;
        return { q: str(r?.q), hits: arr<QuickSearch["hits"][number]>(r?.hits).filter((h) => h && str(h.key)) } satisfies QuickSearch;
      },
      staleTime: 10 * 60_000,
      enabled: q.trim().length > 0,
    }),
};

export const useQuickLibrary = (enabled = true) => useQuery({ ...quickQo.library(), enabled });
export const useQuickNote = (id: string) => useQuery(quickQo.note(id));
export const useQuickSearch = (q: string) => useQuery({ ...quickQo.search(q), placeholderData: keepPreviousData });

/** Pinned and recently opened, kept on this phone (keys from the library). */
export const pinnedQuick = recentList("pin.quick", 30);
export const recentQuick = recentList("quick", 6);

/** Name match on the phone, shown at once while the full search is on its way. */
export function nameScore(i: QuickItem, q: string): number {
  const n = (s: string) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const t = n(i.title);
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 60;
  if (` ${t}`.includes(` ${q}`)) return 40;
  if (i.aka.some((a) => n(a) === q)) return 80;
  if (i.aka.some((a) => ` ${n(a)}`.includes(` ${q}`))) return 30;
  return 0;
}

export const normQuery = (s: string) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);

/** Library rows for one study module (its typed notes), for the module screen. */
export function quickForModule(lib: QuickLibrary | undefined, moduleId: string): QuickItem[] {
  return (lib?.items ?? []).filter((i) => i.moduleId === moduleId);
}
