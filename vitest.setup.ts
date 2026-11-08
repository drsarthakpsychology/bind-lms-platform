// Vitest global setup. jest-dom matchers extend `expect` (they fail gracefully
// in the node environment, and component tests opt into jsdom per-file with a
// `// @vitest-environment jsdom` docblock — see the Button test).
import "@testing-library/jest-dom/vitest";

// vitest runs without `globals: true`, so @testing-library/react's automatic
// afterEach cleanup (which depends on a global `afterEach`) never fires. Without
// it, every render in a multi-test jsdom file leaks into the next test and
// `screen.getByRole` finds stale duplicates. Import the hook explicitly.
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Node ≥22 ships an experimental `localStorage`/webstorage global that can
// shadow jsdom's `window.localStorage` and leave it `undefined` (Node 26 warns
// "localStorage is not available because --localstorage-file was not provided").
// Tests that exercise the learn store's browser copy call `window.localStorage`
// directly, so provide a minimal in-memory shim when the host didn't give us a
// working one. Guarded: it only fills in a missing storage, it never overrides
// a real jsdom/localStorage implementation.
if (typeof window !== "undefined" && !window.localStorage) {
  const backing = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return backing.size;
    },
    clear: () => backing.clear(),
    getItem: (key: string) => (backing.has(key) ? backing.get(key)! : null),
    key: (index: number) => Array.from(backing.keys())[index] ?? null,
    removeItem: (key: string) => void backing.delete(key),
    setItem: (key: string, value: string) => void backing.set(key, String(value)),
  };
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
}

// next/font/google only works inside the Next compiler; tests get a stand-in
// with the same shape (the hand-drawn medicine pictures load Kalam with it).
vi.mock("next/font/google", () => {
  const font = () => ({ className: "", variable: "", style: { fontFamily: "Kalam, cursive" } });
  return { Kalam: font, Caveat: font, Geist: font, Geist_Mono: font, Source_Serif_4: font };
});
