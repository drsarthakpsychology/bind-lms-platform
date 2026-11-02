"use client";

import * as React from "react";
import { emptyState, normalise, type LearnState } from "./engine";

/**
 * One Learn state per browser tab, shared by every Learn screen.
 * - Hydration-safe: React renders the server copy first, then this store.
 * - Mirrors to localStorage (works offline / before the DB table exists).
 * - Saves to the server (debounced) through the `save` callback.
 * On start-up the copy with more XP wins (XP only ever goes up).
 */
const KEY = "vibha-learn-v1";
let state: LearnState | null = null;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let saver: ((s: LearnState) => Promise<unknown>) | null = null;

function readLocal(): LearnState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function initLearnStore(server: LearnState | null, save: (s: LearnState) => Promise<unknown>) {
  saver = save;
  if (state || typeof window === "undefined") return;
  const local = readLocal();
  const a = server ? normalise(server) : null;
  const win = !a ? (local ?? emptyState()) : !local ? a : local.xp > a.xp ? local : a;
  const other = win === a ? local : a;
  // Notes read don't earn XP, so merge them from both copies.
  state = other ? { ...win, notesRead: { ...other.notesRead, ...win.notesRead } } : win;
}

export function setLearnState(next: LearnState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saver?.(next).catch(() => {
      /* offline: localStorage still has it */
    });
  }, 600);
}

export function useLearnState(serverCopy: LearnState): LearnState {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state ?? serverCopy,
    () => serverCopy,
  );
}

/** Current store value outside render (effects and handlers). */
export function getLearnState(): LearnState | null {
  return state;
}
