"use client";

import * as React from "react";

/** Copy text; falls back to a hidden textarea on older browsers. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      const ok = document.execCommand("copy");
      t.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Read/write a small JSON value in localStorage (never throws). */
export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function rawLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Write and tell useLocalJson readers. */
export function writeLocalShared(key: string, value: unknown) {
  writeLocal(key, value);
  listeners.forEach((l) => l());
}

/**
 * Read a localStorage JSON value during render without a hydration mismatch:
 * the server (and first client paint) see `fallback`, then the stored value.
 * `fallback` must be a stable (module-level) value.
 */
export function useLocalJson<T>(key: string, fallback: T): T {
  return React.useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      const raw = rawLocal(key);
      const hit = cache.get(key);
      if (hit && hit.raw === raw) return hit.value as T;
      let value: unknown = fallback;
      try {
        value = raw ? JSON.parse(raw) : fallback;
      } catch {
        value = fallback;
      }
      cache.set(key, { raw, value });
      return value as T;
    },
    () => fallback,
  );
}
