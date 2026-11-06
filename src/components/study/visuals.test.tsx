// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeAll } from "vitest";
import { BrainMap, Curve, Flow, Layers, phi } from "./visuals";

beforeAll(() => {
  // jsdom has no matchMedia
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
});

describe("visual widgets", () => {
  it("phi matches the normal table", () => {
    expect(phi(0)).toBeCloseTo(0.5, 4);
    expect(phi(1.96)).toBeCloseTo(0.975, 3);
    expect(phi(-1)).toBeCloseTo(0.1587, 3);
  });
  it("flow shows a node's detail when tapped", () => {
    render(<Flow d={{ layout: "chain", nodes: [{ id: "a", label: "Trigger", detail: "Something happens" }, { id: "b", label: "Thought" }] }} />);
    fireEvent.click(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("status")).toHaveTextContent("Something happens");
  });
  it("cycle and tree layouts render", () => {
    render(<Flow d={{ layout: "cycle", nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }] }} />);
    render(<Flow d={{ layout: "tree", nodes: [{ id: "r", label: "Root" }, { id: "k", label: "Kid", parent: "r" }] }} />);
    expect(screen.getByRole("button", { name: "Kid" })).toBeInTheDocument();
  });
  it("every curve kind renders a live status", () => {
    for (const kind of ["normal", "sdt", "forgetting", "inverted-u", "dose-response", "half-life"] as const) {
      const { unmount } = render(<Curve d={{ kind }} />);
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
      unmount();
    }
  });
  it("layers and brain map respond to taps", () => {
    render(<Layers d={{ shape: "pyramid", layers: [{ label: "Self-actualisation", detail: "Becoming who you can be" }, { label: "Needs", detail: "Food" }] }} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Self-actualisation" })[0]);
    expect(screen.getByText("Becoming who you can be")).toBeInTheDocument();
    render(<BrainMap d={{ focus: ["amygdala"], notes: { amygdala: "Threat detection" } }} />);
    expect(screen.getByText("Threat detection")).toBeInTheDocument();
  });
});
