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
  it("layers and brain map respond to taps", () => {
    render(<Layers d={{ shape: "pyramid", layers: [{ label: "Self-actualisation", detail: "Becoming who you can be" }, { label: "Needs", detail: "Food" }] }} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Self-actualisation" })[0]);
    expect(screen.getByText("Becoming who you can be")).toBeInTheDocument();
    render(<BrainMap d={{ focus: ["amygdala"], notes: { amygdala: "Threat detection" } }} />);
    expect(screen.getByText("Threat detection")).toBeInTheDocument();
  });
});

import { Journey, Neuron, Pathways, Receptor } from "./animations";
describe("animated explainers", () => {
  it("journey steps through stages and switches route", () => {
    render(<Journey d={{ drug: "sertraline", target: "serotonin transporters", routes: ["oral", "iv"] }} />);
    fireEvent.click(screen.getByRole("button", { name: /Liver/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/first-pass/);
    fireEvent.click(screen.getByRole("button", { name: "Into a vein" }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/no first-pass/);
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
  it("classical conditioning steps to extinction", () => {
    render(<Conditioning d={{ kind: "classical" }} />);
    fireEvent.click(screen.getByRole("button", { name: /Extinction$/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/spontaneous recovery/);
  });
  it("operant conditioning explains variable ratio", () => {
    render(<Conditioning d={{ kind: "operant" }} />);
    fireEvent.click(screen.getByRole("button", { name: /Not every time/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/variable ratio/);
  });
  it("memory flow and stress response step through", () => {
    render(<MemoryFlow d={{}} />);
    fireEvent.click(screen.getByRole("button", { name: /Making it stick/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/encodes/);
    render(<StressResponse d={{}} />);
    fireEvent.click(screen.getByRole("button", { name: /Switching off/ }));
    expect(screen.getAllByRole("status").at(-1)).toHaveTextContent(/Cortisol/);
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
  it("compare slider switches summary", () => {
    render(<Compare d={{ a: { label: "Novice", points: ["Slow"], summary: "Effortful" }, b: { label: "Expert", points: ["Fast"], summary: "Automatic" } }} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "10" } });
    expect(screen.getByRole("status")).toHaveTextContent("Effortful");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "90" } });
    expect(screen.getByRole("status")).toHaveTextContent("Automatic");
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
