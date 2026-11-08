// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const seen = new Set<string>();
const listeners = new Set<() => void>();
vi.mock("@/lib/tips/store", () => ({
  useTip: (id: string) => ({ seen: seen.has(id), dismiss: () => {} }),
  dismissTip: (id: string) => {
    seen.add(id);
    listeners.forEach((l) => l());
  },
}));

import { OnceHint } from "./once-hint";

afterEach(() => {
  cleanup();
  seen.clear();
});

describe("OnceHint", () => {
  it("shows on the first page of a section, then never on the next pages", () => {
    const first = render(<OnceHint id="notes-flip">Tap a card to flip.</OnceHint>);
    expect(screen.getByText("Tap a card to flip.")).toBeInTheDocument();
    act(() => first.unmount()); // the student moves to the next note
    expect(seen.has("notes-flip")).toBe(true);
    render(<OnceHint id="notes-flip">Tap a card to flip.</OnceHint>);
    expect(screen.queryByText("Tap a card to flip.")).toBeNull();
  });

  it("counts as seen when the tab is closed", () => {
    render(<OnceHint id="meds-dose-ladder">Tap a dose.</OnceHint>);
    act(() => void window.dispatchEvent(new Event("pagehide")));
    expect(seen.has("meds-dose-ladder")).toBe(true);
  });
});
