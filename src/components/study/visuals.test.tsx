// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeAll } from "vitest";
import { BrainMap, Curve, Flow, Layers, phi } from "./visuals";
import { Compare, Conditioning, MemoryFlow, StressResponse, Timeline, shuffleOrder } from "./animations2";

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
  it("flow shows every step and its detail at once, with no buttons", () => {
    render(<Flow d={{ layout: "chain", nodes: [{ id: "a", label: "Trigger", detail: "Something happens" }, { id: "b", label: "Thought" }] }} />);
    expect(screen.getByText("Trigger")).toBeInTheDocument();
    expect(screen.getByText("Something happens")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
  it("cycle and tree layouts render", () => {
    render(<Flow d={{ layout: "cycle", nodes: [{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }] }} />);
    render(<Flow d={{ layout: "tree", nodes: [{ id: "r", label: "Root" }, { id: "k", label: "Kid", parent: "r" }] }} />);
    expect(screen.getByText("Kid")).toBeInTheDocument();
  });
  it("every curve kind renders a live status", () => {
    for (const kind of ["normal", "sdt", "forgetting", "inverted-u", "dose-response", "half-life"] as const) {
      const { unmount } = render(<Curve d={{ kind }} />);
      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
      unmount();
    }
  });
  it("layers show every layer and its meaning at once, with no buttons; brain map responds to taps", () => {
    const { unmount } = render(<Layers d={{ shape: "pyramid", layers: [{ label: "Self-actualisation", detail: "Becoming who you can be" }, { label: "Needs", detail: "Food" }] }} />);
    expect(screen.getByText("Becoming who you can be")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByText(/Tap a layer/)).toBeNull();
    unmount();
    render(<BrainMap d={{ focus: ["amygdala"], notes: { amygdala: "Threat detection" } }} />);
    expect(screen.getByText("Threat detection")).toBeInTheDocument();
  });
});

import { Journey, Neuron, Pathways, Receptor } from "./animations";
describe("animated explainers", () => {
  it("journey lists every stage with its words, tapping one moves the picture, and it switches route", () => {
    render(<Journey d={{ drug: "sertraline", target: "serotonin transporters", routes: ["oral", "iv"] }} />);
    expect(screen.getAllByText(/first-pass/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play)/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Liver/ }));
    expect(screen.getByRole("button", { name: /Liver/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/Liver/);
    fireEvent.click(screen.getByRole("button", { name: "Into a vein" }));
    expect(screen.getAllByText(/no first-pass/).length).toBeGreaterThan(0);
  });
  it("neuron is all or none", () => {
    render(<Neuron d={{}} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "20" } });
    fireEvent.click(screen.getByRole("button", { name: /Fire/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/Below threshold/);
  });
  it("pathways explain blocker effects", () => {
    render(<Pathways d={{ system: "dopamine" }} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Nigrostriatal" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Add a D2 blocker/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/Movement side effects/);
  });
  it("receptor shows partial agonist", () => {
    render(<Receptor d={{ receptor: "D2" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Partial agonist" }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/half/);
  });
});

describe("process animations", () => {
  it("classical conditioning shows every step at once; tapping one moves the picture", () => {
    render(<Conditioning d={{ kind: "classical" }} />);
    expect(screen.getByText(/spontaneous recovery/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play)/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Extinction/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent("Showing 5: Extinction");
  });
  it("operant conditioning explains variable ratio", () => {
    render(<Conditioning d={{ kind: "operant" }} />);
    expect(screen.getByText(/variable ratio/)).toBeInTheDocument();
  });
  it("memory flow and stress response show every step", () => {
    render(<MemoryFlow d={{}} />);
    expect(screen.getByText(/encodes it into long-term memory/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Making it stick/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/Making it stick/);
    render(<StressResponse d={{}} />);
    expect(screen.getByText(/Cortisol feeds back/)).toBeInTheDocument();
  });
  it("timeline scores the order", () => {
    render(<Timeline d={{ prompt: "Order Piaget's stages", events: [{ label: "Sensorimotor" }, { label: "Preoperational" }, { label: "Concrete operational" }] }} />);
    for (const [k, name] of ["Sensorimotor", "Preoperational", "Concrete operational"].entries()) {
      fireEvent.click(screen.getByRole("button", { name }));
      fireEvent.click(screen.getByRole("button", { name: new RegExp(`^Slot ${k + 1}`) }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Check the order" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 of 3 in the right place");
  });
  it("compare shows both sides and both summaries at once, with no slider", () => {
    render(<Compare d={{ a: { label: "Novice", points: ["Slow"], summary: "Effortful" }, b: { label: "Expert", points: ["Fast"], summary: "Automatic" } }} />);
    for (const t of ["Novice", "Slow", "Effortful", "Expert", "Fast", "Automatic"]) expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.queryByRole("slider")).toBeNull();
  });
});

describe("timeline shuffle", () => {
  it("never starts in the correct order", () => {
    for (let n = 2; n <= 12; n++) for (let seed = 0; seed < 300; seed++) {
      const o = shuffleOrder(n, seed);
      expect([...o].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
      expect(o.every((v, i) => v === i)).toBe(false);
    }
  });
});
