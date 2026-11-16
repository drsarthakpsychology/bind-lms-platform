"use client";

import * as React from "react";

/**
 * useOffline: a truthful, subtle connectivity signal.
 *
 * The mobile principle (T48): when connectivity drops, show a clear-but-subtle
 * state and preserve local progress; when it returns, say so. This hook
 * tracks `navigator.onLine` plus the `online`/`offline` events and exposes a
 * single boolean plus a timestamp of when the offline state started.
 *
 * `hadOffline` stays true until connectivity is back, so a pill can show
 * "Back online" briefly before disappearing rather than flickering.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener("offline", onChange);
  window.addEventListener("online", onChange);
  return () => {
    window.removeEventListener("offline", onChange);
    window.removeEventListener("online", onChange);
  };
}
// The browser's answer. Node also has a `navigator` (with no onLine), so the
// server must not ask it: `!undefined` made every server render "offline", and
// the page hydrated with an Offline pill the browser did not have.
const isOffline = () => navigator.onLine === false;
const onServer = () => false;

export function useOffline() {
  const offline = React.useSyncExternalStore(subscribe, isOffline, onServer);
  const [wentOfflineAt, setWentOfflineAt] = React.useState<number | null>(null);
  const [justReturned, setJustReturned] = React.useState(false);

  React.useEffect(() => {
    const goOffline = () => {
      setWentOfflineAt(Date.now());
      setJustReturned(false);
    };
    const goOnline = () => {
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
