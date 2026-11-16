import type { QueryClient } from "@tanstack/react-query";

import type { LearnState, LearnStateResult, SaveLearnStateResult } from "@/api/contract";
import { ApiFailure } from "@/api/errors";
import { outbox } from "@/api/outbox";
import { keys } from "@/api/queries";
import { api } from "@/auth";

/**
 * The student's learn record. The app changes its own copy and sends the
 * whole copy (PUT /study/state); the server merges, clamps points, and
 * answers the merged copy, which replaces ours. Unknown fields are carried
 * through untouched because we only ever spread the copy we were given.
 */

export function withSectionDone(s: LearnState, moduleId: string, sectionId: string, today: string, seconds: number): LearnState {
  const key = `${moduleId}/${sectionId}`;
  return {
    ...s,
    study: {
      ...s.study,
      done: { ...s.study.done, [key]: s.study.done[key] ?? today },
      secs: { ...s.study.secs, [key]: (s.study.secs[key] ?? 0) + Math.max(0, Math.round(seconds)) },
      last: { module: moduleId, section: sectionId },
    },
  };
}

export function withLastRead(s: LearnState, moduleId: string, sectionId: string): LearnState {
  return { ...s, study: { ...s.study, last: { module: moduleId, section: sectionId } } };
}

export async function saveLearn(qc: QueryClient, change: (s: LearnState, today: string) => LearnState): Promise<LearnState | null> {
  let found = qc.getQueryData<LearnStateResult>(keys.learn);
  if (!found) {
    try {
      found = await qc.fetchQuery({ queryKey: keys.learn, queryFn: () => api.get<LearnStateResult>("/study/state") });
    } catch {
      return null;
    }
  }
  if (!found) return null;
  const current: LearnStateResult = found;
  const next = change(current.state, current.today);
  qc.setQueryData<LearnStateResult>(keys.learn, { ...current, state: next });
  try {
    const r = await api.put<SaveLearnStateResult>("/study/state", { state: next });
    qc.setQueryData<LearnStateResult>(keys.learn, { ...current, state: r.state });
    return r.state;
  } catch (e) {
    // Offline: keep it in the outbox; it goes with the next batch.
    if (e instanceof ApiFailure && (e.code === "network" || e.code === "server_error" || e.code === "rate_limited")) await outbox.add({ kind: "learn", payload: { state: next } });
    return next;
  }
}

/** Opening a note counts as reading it (the website's markNoteRead). */
export function withNoteRead(s: LearnState, noteId: string, today: string): LearnState {
  const read = s.notesRead ?? {};
  if (read[noteId]) return s;
  return { ...s, notesRead: { ...read, [noteId]: today } };
}

/** "I've done this on paper": the module's write task (the website's markWritten). Points are the server's to give. */
export function withWritten(s: LearnState, moduleId: string, today: string): LearnState {
  if (s.study.written?.[moduleId]) return s;
  return { ...s, study: { ...s.study, written: { ...(s.study.written ?? {}), [moduleId]: today } } };
}

/** Opening a module's activity counts as doing it (the website's markActivity). */
export function withActivity(s: LearnState, moduleId: string, activityId: string, today: string): LearnState {
  if (s.study.acts?.[moduleId]?.[activityId]) return s;
  return { ...s, study: { ...s.study, acts: { ...(s.study.acts ?? {}), [moduleId]: { ...(s.study.acts?.[moduleId] ?? {}), [activityId]: today } } } };
}
