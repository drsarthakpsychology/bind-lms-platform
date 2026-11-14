/**
 * "Funny reactions": a per-device switch kept in localStorage. On unless the
 * student turns it off (Settings, the account menu, or the mute button on a
 * reaction). Every read and write is wrapped: a private window or blocked
 * storage simply leaves reactions on for this page.
 */
export const REACTIONS_KEY = "vibha:reactions";
export const REACTIONS_EVENT = "vibha:reactions-change";

export function readReactionsOn(): boolean {
  try {
    return localStorage.getItem(REACTIONS_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Server and first paint: reactions are on (the default). */
export function serverReactionsOn(): boolean {
  return true;
}

export function writeReactionsOn(on: boolean): void {
  try {
    if (on) localStorage.removeItem(REACTIONS_KEY);
    else localStorage.setItem(REACTIONS_KEY, "off");
  } catch {
    /* blocked storage: the switch still flips for this page via the event */
  }
  try {
    window.dispatchEvent(new Event(REACTIONS_EVENT));
  } catch {
    /* no window (tests) */
  }
}

export function subscribeReactions(cb: () => void): () => void {
  window.addEventListener(REACTIONS_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(REACTIONS_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
