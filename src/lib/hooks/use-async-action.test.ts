// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsyncAction } from "./use-async-action";

/**
 * useAsyncAction — uniform loading/error contract. Tests cover the pending
 * flag lifecycle, error capture (message surfaces, does not rethrow), and
 * clearError. jsdom environment; microtask resolution is awaited via act.
 */
describe("useAsyncAction", () => {
  it("sets pending during the action and clears it after success", async () => {
    let resolve!: () => void;
    const action = () => new Promise<void>((r) => (resolve = r));
    const { result } = renderHook(() => useAsyncAction(action));

    let runPromise!: Promise<void>;
    act(() => {
      runPromise = result.current.run();
    });
    expect(result.current.pending).toBe(true);

    await act(async () => {
      resolve();
      await runPromise;
    });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("captures an error message without rethrowing", async () => {
    const action = () => Promise.reject(new Error("Couldn't save. Try again."));
    const { result } = renderHook(() => useAsyncAction(action));

    await act(async () => {
      await result.current.run();
    });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe("Couldn't save. Try again.");
  });

  it("clearError resets the error state", async () => {
    const action = () => Promise.reject(new Error("boom"));
    const { result } = renderHook(() => useAsyncAction(action));
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.error).toBe("boom");
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  it("uses a fallback message for a non-Error throw", async () => {
    const action = () => Promise.reject("nope");
    const { result } = renderHook(() => useAsyncAction(action));
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.error).toBe("Something went wrong. Try again.");
  });
});
