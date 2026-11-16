"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function read(): boolean | null {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia(QUERY).matches;
}

/**
 * Does the person ask for less motion? Same answer as motion/react's
 * useReducedMotion, with one difference that matters for server-rendered
 * pages: it is `null` on the server AND while the page hydrates, then the
 * real true/false. motion's hook answers on the very first client render, so a
 * class gated on `reduce === false` was missing from the server HTML and
 * present on the client: a hydration mismatch React does not patch up.
 */
export function useReducedMotion(): boolean | null {
  return React.useSyncExternalStore(subscribe, read, () => null);
}
