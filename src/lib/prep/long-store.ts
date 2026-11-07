/**
 * Long answers on this device: the student's answer plan drafts, ticked key
 * points, and the Saved and Practise again lists. Kept in localStorage (every
 * read and write in try/catch; when storage is blocked an in-memory copy
 * carries the visit, so typing still works). Read through useSyncExternalStore, so the server
 * render and the first client render agree (both start empty).
 */
import * as React from "react";

const PREFIX = "vibha.prepLong.v1";
export const draftKey = (id: string) => `${PREFIX}.draft.${id}`;
export const ticksKey = (id: string) => `${PREFIX}.ticks.${id}`;
export const LIST_KEY = { saved: `${PREFIX}.saved`, again: `${PREFIX}.again` } as const;
export type ListKind = keyof typeof LIST_KEY;

const mem = new Map<string, string | null>();
const listeners = new Set<() => void>();

function read(key: string): string | null {
  if (mem.has(key)) return mem.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    mem.delete(key);
  } catch {
    // Storage blocked or full: the in-memory copy carries this visit.
    mem.set(key, value);
  }
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith(PREFIX)) {
      mem.delete(e.key);
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** The stored text for a key (null on the server and before anything is stored). */
export function useStored(key: string): string | null {
  return React.useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
}

/** A stored JSON list of ids or numbers; anything malformed reads as empty. */
export function parseList<T extends string | number>(raw: string | null, kind: "string" | "number"): T[] {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? (v.filter((x) => typeof x === kind) as T[]) : [];
  } catch {
    return [];
  }
}

/** Add or remove one id from a list, newest first. */
export function toggleIn(list: readonly string[], id: string, on: boolean): string[] {
  const rest = list.filter((x) => x !== id);
  return on ? [id, ...rest].slice(0, 500) : rest;
}

export function useIdList(kind: ListKind): string[] {
  const raw = useStored(LIST_KEY[kind]);
  return React.useMemo(() => parseList<string>(raw, "string"), [raw]);
}

export function setInList(kind: ListKind, id: string, on: boolean): void {
  writeStored(LIST_KEY[kind], JSON.stringify(toggleIn(parseList<string>(read(LIST_KEY[kind]), "string"), id, on)));
}
