// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDraft } from "./use-draft";

/**
 * useDraft — localStorage-backed autosave. Tests cover the restore-after-
 * hydration contract, the "saved" signal, and clearing after a submit.
 *
 * jsdom does not ship localStorage in this vitest setup (Node runs without
 * --localstorage-file), so a minimal in-memory shim is installed per suite.
 */
function installStorage() {
  const store = new Map<string, string>();
  const storage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => void store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
}

describe("useDraft", () => {
  beforeEach(() => {
    installStorage();
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("restores a persisted draft after hydration and reports saved=false", () => {
    window.localStorage.setItem("draft:test-key", "unsaved words");
    // Install fake timers BEFORE mount so the deferred restore's setTimeout(0)
    // is a fake timer we control.
    vi.useFakeTimers();
    const { result } = renderHook(() => useDraft("test-key"));
    // Before the deferred restore fires, the default is empty + not-restored.
    expect(result.current.value).toBe("");
    // Fire the deferred restore.
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.restored).toBe(true);
    expect(result.current.value).toBe("unsaved words");
    expect(result.current.saved).toBe(false);
    vi.useRealTimers();
  });

  it("autosaves changes to localStorage once restored", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDraft("test-key"));
    // Fire the deferred restore so the autosave effect is armed.
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      result.current.setValue("typed text");
    });
    expect(window.localStorage.getItem("draft:test-key")).toBe("typed text");
    vi.useRealTimers();
  });

  it("clear() empties the field and wipes the persisted draft", () => {
    window.localStorage.setItem("draft:test-key", "stale");
    vi.useFakeTimers();
    const { result } = renderHook(() => useDraft("test-key"));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      result.current.clear();
    });
    expect(result.current.value).toBe("");
    expect(window.localStorage.getItem("draft:test-key")).toBeNull();
    vi.useRealTimers();
  });

  it("saved is true when nothing has been typed", () => {
    const { result } = renderHook(() => useDraft("test-key"));
    expect(result.current.saved).toBe(true);
  });
});
