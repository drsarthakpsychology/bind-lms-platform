// @vitest-environment jsdom
/**
 * One interaction test per explorable scene. jsdom has no WebGL, so these
 * render the flat fallback, which shares every control and every written
 * state with the 3D view. No scene carries a goal line, a missions list, a
 * drag hint or Back, Next and Play buttons.
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
    expect(status()).not.toHaveTextContent(/Pick a route/);
    wait(20000); // nothing moves on its own
    expect(screen.queryByRole("list", { name: "Signal path" })).toBeNull();
    click("Hand: touch a hot cup");
    // one tap runs the whole trip, each leg held for its reading time, and every leg stays written
    expect(screen.getByRole("list", { name: "Signal path" }).children).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play|Pause)/ })).toBeNull();
    wait(40000);
    expect(status()).toHaveTextContent(/thalamus/);
    expect(screen.getByRole("list", { name: "Signal path" }).children).toHaveLength(5);
    click("Reflex shortcut");
    click("Foot: step on a pin");
    wait(40000);
    expect(status()).toHaveTextContent(/interneuron/);
    expect(status()).toHaveTextContent(/before you knew it hurt/);
    expect(screen.queryByText(/missions done/)).toBeNull();
    click("Organs on autopilot");
    click(/^Fight or flight$/);
    expect(status()).toHaveTextContent(/128 beats a minute/);
    expect(status()).toHaveTextContent(/urine is held/);
    click("Rest and digest");
    expect(status()).toHaveTextContent(/vagus/);
    click("Zoom the map");
    click(/Autonomic/);
    expect(status()).toHaveTextContent(/hypothalamus is its main controller/);
  });

  it("brainexplorer: a region plays its job, damage shows a real case, and the challenge checks the answer", () => {
    vi.useFakeTimers();
    render(<BrainExplorer d={{}} />);
    expect(status()).toHaveTextContent(/outer layer, the cerebral cortex/);
    expect(status()).not.toHaveTextContent(/Tap any part/);
    click(/^Broca/);
    expect(screen.getByRole("list", { name: "Signal path" }).children).toHaveLength(1);
    wait(60000);
    expect(screen.getByRole("list", { name: "Signal path" }).children).toHaveLength(4);
    expect(status()).toHaveTextContent(/What comes out: .I walked the dog in the park/);
    click("Damage off");
    expect(status()).toHaveTextContent(/Broca's aphasia/);
    expect(status()).toHaveTextContent(/nicknamed Tan/);
    click(/^Hippocampus/);
    expect(screen.getByRole("button", { name: "Peel the left side" })).toHaveAttribute("aria-pressed", "true");
    expect(status()).toHaveTextContent(/H\.M\. \(Henry Molaison\)/);
    click("Where is the damage?");
    expect(screen.getByText(/Case 1 · score 0/)).toBeInTheDocument();
    click(/^Hippocampus/);
    expect(status()).toHaveTextContent(/Not quite/);
    click(/^Broca/);
    expect(status()).toHaveTextContent(/Yes: Broca's area/);
    expect(screen.getByText(/Case 2 · score 0/)).toBeInTheDocument();
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
    click("Myelin on");
    expect(screen.getByRole("button", { name: "Myelin off" })).toHaveAttribute("aria-pressed", "false");
    click(/Challenge: 3 in 10 s/);
    expect(screen.getByRole("button", { name: /s left: 0 of 3/ })).toBeDisabled();
  });

  it("synapse3d: one message crosses and binds, and a receptor blocker stops it", () => {
    vi.useFakeTimers();
    render(<SynapseScene d={{ transmitter: "dopamine" }} />);
    // every step and its words are listed before anything is fired
    const steps = screen.getByRole("list", { name: "Steps" });
    expect(steps).toHaveTextContent(/Calcium floods in/);
    expect(steps).toHaveTextContent(/The dopamine drifts across the gap/);
    wait(20000);
    expect(screen.getAllByRole("listitem").some((li) => li.getAttribute("aria-current") === "step")).toBe(false);
    click("Fire the nerve ending");
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play|Pause)/ })).toBeNull();
    expect(status()).toHaveTextContent(/Signal arrives/);
    for (let t = 0; t < 30000 && !/Binding/.test(status().textContent ?? ""); t += 250) wait(250);
    wait(2000);
    expect(status()).toHaveTextContent(/Binding.*strong message/);
    wait(40000);
    expect(status()).toHaveTextContent(/Clearing up/);
    click("Receptor blocker (antagonist)");
    expect(screen.getByRole("list", { name: "Steps" })).toHaveTextContent(/blocker molecules already fill the receptors/);
    click("Fire the nerve ending");
    wait(40000);
    expect(status()).toHaveTextContent(/getting no message/);
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
    click("Load the example");
    click("Find the pattern");
    wait(2800);
    expect(status()).toHaveTextContent(/skip a generation/);
  });

  it("hpaloop: events arrive, coping choices change the curve, and chronic stress breaks the feedback loop", () => {
    vi.useFakeTimers();
    render(<HpaLoop d={{}} />);
    wait(20000);
    expect(status()).toHaveTextContent(/7:00\. A normal day/);
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
    for (let k = 2; k <= 4; k++) click(new RegExp(`Next day \\(day ${k}\\)`));
    expect(status()).toHaveTextContent(/Day 4: the feedback loop is failing/);
    expect(status()).toHaveTextContent(/42 percent \(failing\)/);
  });

  it("brainexplorer: the four textbook views, with no tour to step through", () => {
    vi.useFakeTimers();
    render(<BrainExplorer d={{}} />);
    expect(screen.queryByRole("button", { name: /tour/i })).toBeNull();
    click(/^Middle view/);
    expect(status()).toHaveTextContent(/Middle view \(medial\)|medial/i);
    expect(screen.getByRole("button", { name: "Peel the left side" })).toHaveAttribute("aria-pressed", "true");
    click(/^Front cut/);
    expect(status()).toHaveTextContent(/basal ganglia/);
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
  });

  it("sound is off until switched on, and each quick challenge scores the first try", () => {
    render(<NervousSystem d={{}} />);
    const sound = screen.getByRole("button", { name: "Sound off" });
    expect(sound).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(sound);
    expect(screen.getByRole("button", { name: "Sound on" })).toHaveAttribute("aria-pressed", "true");
    click(/^Quick challenge: Reflexes and the two divisions/);
    click("You pull your hand away");
    expect(screen.getByText(/Right first time\./)).toBeInTheDocument();
    expect(screen.getByText("Score 1")).toBeInTheDocument();
    click("Next question");
    click("Parasympathetic");
    expect(screen.getByText(/Not quite, try another/)).toBeInTheDocument();
    click("Sympathetic");
    expect(screen.getByText(/readies the body for fight or flight/)).toBeInTheDocument();
    expect(screen.getByText("Score 1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sound on" }));
    expect(screen.getByRole("button", { name: "Sound off" })).toBeInTheDocument();
  });
});
