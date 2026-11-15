import { useQuery } from "@tanstack/react-query";

import { api } from "@/auth";
import * as L from "./adapt-learn";

/**
 * Learn and Me screens added in round 2: revision notes, the Quick
 * reference, saved sections, assignments and My journey. Every answer is
 * read through src/api/adapt-learn.ts.
 */
export const learnKeys = {
  notes: ["notes"] as const,
  note: (id: string) => ["note", id] as const,
  terms: ["terms"] as const,
  term: (slug: string) => ["term", slug] as const,
  marks: ["marks"] as const,
  assignments: ["assignments"] as const,
  journey: ["journey"] as const,
};

export const useNotes = (enabled = true) => useQuery({ queryKey: learnKeys.notes, queryFn: async () => L.noteListView(await api.get<unknown>("/study/notes")), staleTime: 10 * 60_000, enabled });
export const useNote = (id: string) => useQuery({ queryKey: learnKeys.note(id), queryFn: async () => L.noteView(await api.get<unknown>(`/study/notes/${encodeURIComponent(id)}`)), staleTime: 60 * 60_000, enabled: id.length > 0 });
/** The whole index is small (a few hundred rows); it is searched on the phone. */
export const useTerms = (enabled = true) => useQuery({ queryKey: learnKeys.terms, queryFn: async () => L.refIndexView(await api.get<unknown>("/library/terms")), staleTime: 60 * 60_000, enabled });
export const useTerm = (slug: string) => useQuery({ queryKey: learnKeys.term(slug), queryFn: async () => L.refEntryView(await api.get<unknown>(`/library/terms/${encodeURIComponent(slug)}`)), staleTime: 60 * 60_000, enabled: slug.length > 0 });
export const useMarks = () => useQuery({ queryKey: learnKeys.marks, queryFn: async () => L.marksView(await api.get<unknown>("/study/marks")) });
export const useAssignments = () => useQuery({ queryKey: learnKeys.assignments, queryFn: async () => L.assignmentPageView(await api.get<unknown>("/assignments", { query: { limit: 100 } })) });
export const useJourney = () => useQuery({ queryKey: learnKeys.journey, queryFn: async () => L.journeyView(await api.get<unknown>("/journey")) });
