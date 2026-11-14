"use client";

import * as React from "react";
import { emptyState, normalise, type LearnState } from "./engine";
import { keepBestTests } from "@/lib/study/progress";

function maxMap(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
}

/** Keep the winner, but never lose reading ticks, test and checkpoint scores, or study time recorded on the other copy. */
export function mergeCopies(win: LearnState, other: LearnState): LearnState {
  const acts = { ...other.study.acts };
  for (const [m, v] of Object.entries(win.study.acts)) acts[m] = { ...(acts[m] ?? {}), ...v };
  return {
    ...win,
    notesRead: { ...other.notesRead, ...win.notesRead },
    lab: { ...other.lab, ...win.lab },
    study: {
      ...win.study,
      done: { ...other.study.done, ...win.study.done },
      // A test taken on another device, or saved after this copy, still counts.
      tests: keepBestTests(other.study.tests, win.study.tests),
      written: { ...other.study.written, ...win.study.written },
      secs: maxMap(win.study.secs, other.study.secs),
      acts,
      last: win.study.last ?? other.study.last,
    },
  };
}

/**
 * One Learn state per browser tab, shared by every Learn screen.
 * - Hydration-safe: React renders the server copy first, then this store.
 * - Mirrors to localStorage (works offline / before the DB table exists).
 * - Saves to the server (debounced) through the `save` callback.
 * On start-up the copy with more XP wins (XP only ever goes up); the server
 * clamps implausible saves, and when it does the local copy is dropped so the
 * server copy wins on the next load.
 *
 * The localStorage copy is keyed per student: `vibha-learn-v1:<user id>`. The
 * owner comes from the `owner` argument, or from the `owner` field that
 * loadLearnState() attaches to the server copy. The old shared key
 * (`vibha-learn-v1`) cannot be attributed to anyone, so it is never merged into
 * a known student's state; it is deleted once an owner is known. Only when the
 * owner is unknown (no session, test harnesses) does the store fall back to the
 * old shared key, as before.
 */
const LEGACY_KEY = "vibha-learn-v1";
const keyFor = (owner: string | null) => (owner ? `${LEGACY_KEY}:${owner}` : LEGACY_KEY);
let state: LearnState | null = null;
let stateOwner: string | null = null;
let key = LEGACY_KEY;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let saver: ((s: LearnState) => Promise<unknown>) | null = null;

function readLocal(k: string): LearnState | null {
  try {
    const raw = window.localStorage.getItem(k);
    return raw ? normalise(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function ownerOf(server: LearnState | null, owner?: string): string | null {
  if (owner) return owner;
  const o = (server as { owner?: unknown } | null)?.owner;
  return typeof o === "string" && o ? o : null;
}

export function initLearnStore(server: LearnState | null, save: (s: LearnState) => Promise<unknown>, owner?: string) {
  saver = save;
  if (typeof window === "undefined") return;
  const who = ownerOf(server, owner);
  // A different student signed in on this tab (client-side navigation keeps
  // module state): start again from their own copies.
  if (state && who && who !== stateOwner) {
    state = null;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (state) return;
  stateOwner = who;
  key = keyFor(who);
  if (who) {
    try {
      window.localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* private mode */
    }
  }
  const local = readLocal(key);
  const a = server ? normalise(server) : null;
  const win = !a ? (local ?? emptyState()) : !local ? a : local.xp > a.xp ? local : a;
  const other = win === a ? local : a;
  // Things that don't earn XP (notes read, study time) are merged from both copies.
  state = other ? mergeCopies(win, other) : win;
}

export function setLearnState(next: LearnState) {
  state = next;
  const k = key;
  try {
    window.localStorage.setItem(k, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l());
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saver?.(next)
      .then((res) => {
        // The server refused part of this copy: stop trusting the local one.
        if (res && typeof res === "object" && (res as { clamped?: unknown }).clamped === true) {
          try {
            window.localStorage.removeItem(k);
          } catch {
            /* private mode */
          }
        }
      })
      .catch(() => {
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
