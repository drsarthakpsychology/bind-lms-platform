"use client";

import * as React from "react";

/**
 * useOffline — a truthful, subtle connectivity signal.
 *
 * The mobile principle (T48): when connectivity drops, show a clear-but-subtle
 * state and preserve local progress; when it returns, say so. This hook
 * tracks `navigator.onLine` plus the `online`/`offline` events and exposes a
 * single boolean plus a timestamp of when the offline state started.
 *
 * `hadOffline` stays true until connectivity is back, so a pill can show
 * "Back online" briefly before disappearing rather than flickering.
 */
export function useOffline() {
  const [offline, setOffline] = React.useState<boolean>(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [wentOfflineAt, setWentOfflineAt] = React.useState<number | null>(null);
  const [justReturned, setJustReturned] = React.useState(false);

  React.useEffect(() => {
    const goOffline = () => {
      setOffline(true);
      setWentOfflineAt(Date.now());
      setJustReturned(false);
    };
    const goOnline = () => {
      setOffline(false);
      setJustReturned(true);
      const t = window.setTimeout(() => setJustReturned(false), 3000);
      return () => window.clearTimeout(t);
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return { offline, wentOfflineAt, justReturned };
}
