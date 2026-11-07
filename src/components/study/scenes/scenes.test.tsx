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
import { Genogram } from "./genogram";
import { HpaLoop } from "./hpa-loop";
import { BrainSlicer } from "./brain-slicer";
import { AmesRoom } from "./ames-room";

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
    wait(20000); // nothing moves on its own
    expect(status()).toHaveTextContent(/Step 1 of 5, sensory/);
    click(/^Next$/);
    expect(status()).toHaveTextContent(/Step 2 of 5.*thalamus/);
    click("Reflex shortcut");
    click("Foot: step on a pin");
    expect(status()).toHaveTextContent(/Step 1 of 4/);
    click(/^Next$/);
    expect(status()).toHaveTextContent(/interneuron/);
    click(/^Play/);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    wait(40000);
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
    wait(20000);
    expect(status()).toHaveTextContent(/Step 1 of 4/);
    click(/^Play/);
    wait(60000);
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
    wait(20000);
    expect(status()).toHaveTextContent(/Step 1 of 5, Signal arrives/);
    click(/^Next$/);
    expect(status()).toHaveTextContent(/Calcium floods in/);
    click(/^Next$/);
    click(/^Next$/);
    wait(2000);
    expect(status()).toHaveTextContent(/Step 4 of 5, Binding: The dopamine drifts across the gap/);
    click("Receptor blocker (antagonist)");
    click("Fire the nerve ending");
    click(/^Next$/);
    click(/^Next$/);
    click(/^Next$/);
    wait(2000);
    expect(status()).toHaveTextContent(/blocker molecules already fill the receptors/);
    expect(status()).toHaveTextContent(/getting no message/);
    expect(screen.getByLabelText("2 of 4 missions done")).toBeInTheDocument();
  });

  it("genogram: build three generations, mark the condition, and the pattern finder traces it", () => {
    vi.useFakeTimers();
    render(<Genogram d={{ condition: "depression", start: "blank" }} />);
    expect(status()).toHaveTextContent(/1 person across 1 generation/);
    click(/^You \(the patient\)/);
    click("Add parents");
    expect(status()).toHaveTextContent(/Parents added/);
    click(/^Father, male/);
    click("Add father's parents");
    expect(status()).toHaveTextContent(/third generation/);
    click(/^Father's mother/);
    click("Has depression");
    click(/^Father, male/);
    click("Has depression");
    click("Has died");
    expect(status()).toHaveTextContent(/cross through the shape/);
    click("Find the pattern");
    expect(status()).toHaveTextContent(/Scanning/);
    wait(2800);
    expect(status()).toHaveTextContent(/Two blood relatives have depression, across two generations/);
    expect(status()).toHaveTextContent(/only through the father's family/);
    expect(screen.getByLabelText("5 of 5 missions done")).toBeInTheDocument();
    click("Load the example");
    click("Find the pattern");
    wait(2800);
    expect(status()).toHaveTextContent(/skip a generation/);
  });

  it("hpaloop: events arrive, coping choices change the curve, and chronic stress breaks the feedback loop", () => {
    vi.useFakeTimers();
    render(<HpaLoop d={{}} />);
    wait(20000);
    expect(status()).toHaveTextContent(/7:00\. Press Start the day/);
    click("Start the day");
    wait(1500);
    expect(status()).toHaveTextContent(/9:00 · The exam: .*cortisol takes 20 to 30 minutes to peak/);
    click("Avoid it: scroll the phone");
    expect(status()).toHaveTextContent(/Avoidance brings quick relief/);
    wait(2500);
    expect(status()).toHaveTextContent(/13:00 · An argument/);
    click("Talk to someone");
    wait(2500);
    click("Rest: slow breathing");
    wait(3000);
    click("Sleep 8 hours");
    wait(1500);
    expect(screen.getByText(/End of the day: stress load/)).toBeInTheDocument();
    expect(screen.getByText(/A full night's sleep resets the system/)).toBeInTheDocument();
    click("Chronic stress");
    click("Start day 1");
    expect(status()).toHaveTextContent(/Day 1: the loop works/);
    for (let k = 2; k <= 4; k++) click(new RegExp(`Next day \\(${k} of 5\\)`));
    expect(status()).toHaveTextContent(/Day 4: the feedback loop is failing/);
    expect(status()).toHaveTextContent(/42 percent \(failing\)/);
    expect(screen.getByLabelText("4 of 5 missions done")).toBeInTheDocument();
  });

  it("brainexplorer: guided views and the tour always bring the student back to a textbook view", () => {
    vi.useFakeTimers();
    render(<BrainExplorer d={{}} />);
    click("Take the tour");
    expect(status()).toHaveTextContent(/Tour stop 1 of 4\. Side view \(lateral\)/);
    wait(20000);
    expect(status()).toHaveTextContent(/Tour stop 1 of 4\. Side view \(lateral\)/);
    click(/^Next stop$/);
    expect(status()).toHaveTextContent(/Tour stop 2 of 4\. Middle view \(medial\)/);
    expect(screen.getByRole("button", { name: "Peel the left side" })).toHaveAttribute("aria-pressed", "true");
    click(/^Back$/);
    expect(status()).toHaveTextContent(/Tour stop 1 of 4/);
    click(/^Play the tour/);
    wait(2900); // held for at least its reading time
    expect(status()).toHaveTextContent(/Tour stop 1 of 4/);
    wait(40000);
    expect(status()).toHaveTextContent(/From below \(inferior\)|Front cut/);
    click(/^Pause$/);
    click(/^Next stop$/);
    click(/^Next stop$/);
    expect(status()).toHaveTextContent(/Front cut \(coronal\).*basal ganglia/);
    click("Finish the tour");
    expect(screen.getByLabelText("1 of 6 missions done")).toBeInTheDocument();
    click("Side view");
    expect(status()).toHaveTextContent(/central sulcus separates frontal from parietal/);
  });

  it("brainslicer: slices name what they cut through, and rTMS and each ECT placement are explained", () => {
    render(<BrainSlicer d={{}} />);
    expect(status()).toHaveTextContent(/Coronal \(front to back\) slice/);
    expect(status()).toHaveTextContent(/On this slice: .*Frontal lobe/);
    expect(status()).not.toHaveTextContent(/Hippocampus/);
    const slider = screen.getByRole("slider", { name: /Slice position/ });
    fireEvent.change(slider, { target: { value: "0.0" } });
    expect(status()).toHaveTextContent(/Hippocampus/);
    expect(status()).toHaveTextContent(/Thalamus/);
    click("Axial");
    click("Sagittal");
    expect(status()).toHaveTextContent(/Front is on the left/);
    click("rTMS coil");
    expect(status()).toHaveTextContent(/left dorsolateral prefrontal cortex/);
    click("Fire a train of pulses");
    expect(status()).toHaveTextContent(/Pulses fired/);
    click("ECT electrodes");
    expect(status()).toHaveTextContent(/Bitemporal: .*temple/);
    click("Right unilateral");
    expect(status()).toHaveTextContent(/about six times the seizure threshold/);
    click("Bifrontal");
    expect(status()).toHaveTextContent(/5 cm above the outer corner of each eye/);
    expect(screen.getByLabelText("4 of 4 missions done")).toBeInTheDocument();
  });

  it("amesroom: the peephole fools size, the swap reverses it, and the side and plan views show the real shape", () => {
    vi.useFakeTimers();
    render(<AmesRoom d={{}} />);
    expect(status()).toHaveTextContent(/ordinary rectangular room/);
    expect(status()).toHaveTextContent(/Meera, in the left corner, looks only about 50 percent as tall as Kabir/);
    click("Swap places");
    wait(250);
    expect(status()).toHaveTextContent(/walking across the back of the room/);
    wait(3500);
    expect(status()).toHaveTextContent(/Kabir, in the left corner, looks only about 50 percent as tall as Meera/);
    click("Step to the side");
    expect(status()).toHaveTextContent(/left corner is much farther/);
    expect(status()).toHaveTextContent(/about 2.0 times the distance/);
    click("From above");
    expect(status()).toHaveTextContent(/trapezoid/);
    expect(status()).toHaveTextContent(/Size constancy normally corrects for distance/);
    wait(250);
    expect(screen.getByLabelText("4 of 4 missions done")).toBeInTheDocument();
  });
});
