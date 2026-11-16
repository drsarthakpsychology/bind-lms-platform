// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PaletteEntry } from "@/lib/search/palette";
import { CommandPalette } from "./command-palette";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const entries: PaletteEntry[] = Array.from({ length: 9 }, (_, i) => ({
  id: `n${i}`,
  label: `Place number ${i} with a long name`,
  hint: `What place ${i} is for`,
  href: `/p${i}`,
  group: "Nav",
}));

afterEach(() => vi.restoreAllMocks());

describe("CommandPalette", () => {
  it("keeps the row picked with the arrow keys in view, and names cut-off rows in full", async () => {
    const seen: string[] = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      seen.push(this.getAttribute("data-row") ?? "");
    };
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    render(<CommandPalette entries={entries} />);
    act(() => {
      window.dispatchEvent(new Event("plms:open-search"));
    });
    const input = screen.getByRole("textbox", { name: "Search" });
    for (let i = 0; i < 6; i++) fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(seen.at(-1)).toBe("6");
    const active = document.querySelector('[aria-current="true"]');
    expect(active?.getAttribute("data-row")).toBe("6");
    expect(active?.getAttribute("title")).toBe("Place number 6 with a long name: What place 6 is for");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(push).toHaveBeenCalledWith("/p6");
  });

  it("adds the server's lectures after typing stops, and remembers the search", async () => {
    vi.useFakeTimers();
    try {
      window.localStorage.clear();
      const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ results: [{ id: "lecture:l1", type: "lecture", title: "Mental state examination", meta: "Lecture 3 · Week 1", href: "/courses/c/lessons/l1" }] }) }));
      vi.stubGlobal("fetch", fetchMock);
      render(<CommandPalette entries={entries} />);
      act(() => {
        window.dispatchEvent(new Event("plms:open-search"));
      });
      const input = screen.getByRole("textbox", { name: "Search" });
      fireEvent.change(input, { target: { value: "m" } });
      fireEvent.change(input, { target: { value: "ment" } });
      fireEvent.change(input, { target: { value: "mental" } });
      expect(fetchMock).not.toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(String((fetchMock.mock.calls[0] as unknown[])[0])).toBe("/api/search?q=mental");
      expect(screen.getByText("Lectures")).toBeTruthy();
      fireEvent.click(screen.getByText("Mental state examination"));
      expect(push).toHaveBeenCalledWith("/courses/c/lessons/l1");
      expect(JSON.parse(window.localStorage.getItem("vibha.search.recent") ?? "[]")).toEqual(["mental"]);
      act(() => {
        window.dispatchEvent(new Event("plms:open-search"));
      });
      expect(screen.getByText("Recent searches")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Remove mental from recent searches" })).toBeTruthy();
    } finally {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });
});
