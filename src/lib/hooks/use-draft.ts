"use client";

import * as React from "react";

/**
 * useDraft — localStorage-backed autosave for composer/editor surfaces.
 *
 * The mobile principle (T46/T48): partially-entered state must survive
 * navigation, a sheet opening, orientation change, or an accidental refresh.
 * This hook autosaves the draft to localStorage under `key` and restores it
 * after hydration (deferred so the initial render is stable and there is no
 * setState-in-effect lint).
 *
 *   const { value, setValue, saved, clear } = useDraft("wall-composer", "");
 *
 * `saved` is true once the current value matches what's persisted (or the
 * value is empty) — render "Draft saved." / a quiet dot off that.
 * `clear()` wipes the persisted draft after a successful submit.
 *
 * SSR note: the initial value is the in-memory default; the restore happens
 * in an effect after hydration, so no hydration mismatch. The draft is
 * keyed per user context by the caller (include the user id in `key`).
 */
export function useDraft(key: string, initialValue = "") {
  const [value, setValue] = React.useState(initialValue);
  const [restored, setRestored] = React.useState(false);

  // Restore once after hydration. Deferred (setTimeout 0) so it neither races
  // hydration nor sets state synchronously inside the effect body — matches
  // the journal autosave pattern (react-hooks/set-state-in-effect).
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(`draft:${key}`);
        if (raw != null) setValue(raw);
      } catch {
        // private mode / storage disabled — autosave degrades to memory-only
      }
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [key]);

  // Autosave on every change once restored (skip the very first restore write).
  // Empty drafts are removed, not persisted — same contract as the journal.
  React.useEffect(() => {
    if (!restored) return;
    try {
      if (value.trim()) {
        localStorage.setItem(`draft:${key}`, value);
      } else {
        localStorage.removeItem(`draft:${key}`);
      }
    } catch {
      // storage unavailable — nothing to do
    }
  }, [key, value, restored]);

  const clear = React.useCallback(() => {
    setValue(initialValue);
    try {
      localStorage.removeItem(`draft:${key}`);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  const saved = React.useMemo(
    () => !restored || value === initialValue,
    [value, initialValue, restored],
  );

  return { value, setValue, saved, restored, clear };
}
