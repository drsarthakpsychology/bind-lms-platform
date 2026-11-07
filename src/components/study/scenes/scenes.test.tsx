// @vitest-environment jsdom
/**
 * One interaction test per explorable scene. jsdom has no WebGL, so these
 * render the flat fallback, which shares every control and every written
 * state with the 3D view.
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NervousSystem } from "./nervous-system";
import { BrainExplorer } from "./brain-explorer";
import { ActionPotential } from "./action-potential";
import { SynapseScene } from "./synapse-scene";

vi.mock("@/lib/learn/track", () => ({ trackLearn: () => {} }));

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) as unknown as MediaQueryList);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const status = () => screen.getAllByRole("status")[0];
/** Let time pass in small steps so each timer can schedule the next. */
const wait = (ms: number) => {
  for (let t = 0; t < ms; t += 250) act(() => void vi.advanceTimersByTime(250));
};
const click = (name: string | RegExp) => fireEvent.click(screen.getAllByRole("button", { name })[0]);

describe("explorable scenes", () => {
  it("nervoussystem: signals travel through the brain or the reflex shortcut, and the autonomic divisions switch", () => {
    vi.useFakeTimers();
    render(<NervousSystem d={{}} />);
    expect(status()).toHaveTextContent(/Pick a route/);
    click("Hand: touch a hot cup");
    expect(status()).toHaveTextContent(/Step 1 of 5, sensory/);
    wait(1500);
    expect(status()).toHaveTextContent(/Step 2 of 5.*thalamus/);
    click("Reflex shortcut");
    click("Foot: step on a pin");
    expect(status()).toHaveTextContent(/Step 1 of 4/);
    wait(1250);
    expect(status()).toHaveTextContent(/interneuron/);
    wait(6000);
    expect(status()).toHaveTextContent(/Done\..*before you knew it hurt/);
    expect(screen.getByLabelText("1 of 6 missions done")).toBeInTheDocument();
    click("Organs on autopilot");
    click(/^Fight or flight$/);
    expect(status()).toHaveTextContent(/128 beats a minute/);
    expect(status()).toHaveTextContent(/urine is held/);
    click("Rest and digest");
    expect(status()).toHaveTextContent(/vagus/);
    click("Zoom the map");
    click(/Autonomic/);
    expect(status()).toHaveTextContent(/hypothalamus is its main controller/);
    expect(screen.getByLabelText("4 of 6 missions done")).toBeInTheDocument();
  });

  it("brainexplorer: a region plays its job, damage shows a real case, and the challenge checks the answer", () => {
    vi.useFakeTimers();
    render(<BrainExplorer d={{}} />);
    expect(status()).toHaveTextContent(/outer layer, the cerebral cortex/);
    click(/^Broca/);
    expect(status()).toHaveTextContent(/Step 1 of 4/);
    wait(4500);
    expect(status()).toHaveTextContent(/What comes out: .I walked the dog in the park/);
    click("Damage off");
    expect(status()).toHaveTextContent(/Broca's aphasia/);
    expect(status()).toHaveTextContent(/nicknamed Tan/);
    click(/^Hippocampus/);
    expect(screen.getByRole("button", { name: "Peel the left side" })).toHaveAttribute("aria-pressed", "true");
    expect(status()).toHaveTextContent(/H\.M\. \(Henry Molaison\)/);
    click("Where is the damage?");
    expect(screen.getByText(/Case 1 of 8/)).toBeInTheDocument();
    click(/^Hippocampus/);
    expect(status()).toHaveTextContent(/Not quite/);
    click(/^Broca/);
    expect(status()).toHaveTextContent(/Yes: Broca's area/);
    expect(screen.getByText(/Case 2 of 8/)).toBeInTheDocument();
  });

  it("actionpotential: small pushes add up to threshold, the spike fires, and a too-early push is blocked", () => {
    render(<ActionPotential d={{}} />);
    expect(status()).toHaveTextContent(/Resting at about minus 70/);
    click("Stimulate");
    expect(status()).toHaveTextContent(/Below threshold: the voltage rose to -58/);
    click("Stimulate");
    expect(status()).toHaveTextContent(/Rising phase.*sodium channels snap open/);
    expect(status()).toHaveTextContent(/Summation/);
    click("Stimulate");
    expect(status()).toHaveTextContent(/Blocked: .*absolute refractory period/);
    expect(screen.getByLabelText("3 of 5 missions done")).toBeInTheDocument();
    click("Myelin on");
    expect(screen.getByRole("button", { name: "Myelin off" })).toHaveAttribute("aria-pressed", "false");
    click(/Challenge: 3 in 10 s/);
    expect(screen.getByRole("button", { name: /s left: 0 of 3/ })).toBeDisabled();
  });

  it("synapse3d: one message crosses and binds, and a receptor blocker stops it", () => {
    vi.useFakeTimers();
    render(<SynapseScene d={{ transmitter: "dopamine" }} />);
    expect(status()).toHaveTextContent(/Press Fire the nerve ending/);
    click("Fire the nerve ending");
    expect(status()).toHaveTextContent(/Step 1 of 5, Signal arrives/);
    wait(900);
    expect(status()).toHaveTextContent(/Calcium floods in/);
    wait(2000);
    expect(status()).toHaveTextContent(/Step 4 of 5, Binding: The dopamine drifts across the gap/);
    click("Receptor blocker (antagonist)");
    click("Fire the nerve ending");
    wait(2900);
    expect(status()).toHaveTextContent(/blocker molecules already fill the receptors/);
    expect(status()).toHaveTextContent(/getting no message/);
    expect(screen.getByLabelText("2 of 4 missions done")).toBeInTheDocument();
  });
});
