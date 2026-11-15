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
