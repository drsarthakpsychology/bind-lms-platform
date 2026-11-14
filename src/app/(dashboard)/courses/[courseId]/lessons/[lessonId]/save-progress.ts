"use client";

import { flushSaves, queueSave } from "@/lib/save/client";
import { pingProgress } from "./actions";

/**
 * Save the lecture position. Goes through the save outbox (kept in the browser
 * until the server confirms, retried, and sent to a route that survives new
 * deployments). Before the outbox is running it falls back to the Server
 * Action, reporting a failure in the console instead of swallowing it.
 */
export function saveProgress(lessonId: string, watched: number, duration: number, opts: { now?: boolean } = {}) {
  const w = Number.isFinite(watched) && watched > 0 ? watched : 0;
  const d = Number.isFinite(duration) && duration > 0 ? duration : 0;
  if (!d) return;
  if (queueSave("progress", lessonId, { lessonId, watched: w, duration: d })) {
    if (opts.now) void flushSaves({ keepalive: true });
    return;
  }
  pingProgress(lessonId, w, d).then(
    (r) => {
      if (!r.ok) console.warn("Lecture progress was not saved.");
    },
    (e) => console.warn("Lecture progress was not saved:", e instanceof Error ? e.message : e),
  );
}
