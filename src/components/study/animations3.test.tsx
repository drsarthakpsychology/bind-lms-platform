// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeAll } from "vitest";
import { Attention, Conservation, Dissonance, Experiment, Illusion } from "./animations3";
import { Hypnogram, Release, Strange, ThoughtRecord } from "./animations4";
import { parseBlocks } from "@/lib/study/parse";

beforeAll(() => {
  // jsdom has no matchMedia
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
});

const last = () => screen.getAllByRole("status").at(-1)!;
const first = () => screen.getAllByRole("status")[0];

describe("third wave widgets", () => {
  it("attention: your name is blocked by the early filter but breaks through attenuation", () => {
    render(<Attention d={{}} />);
    expect(first()).toHaveTextContent(/Broadbent/);
    fireEvent.click(screen.getByRole("button", { name: /Say your name/ }));
    expect(first()).toHaveTextContent(/about a third of people/);
    fireEvent.click(screen.getByRole("button", { name: /Treisman/ }));
    expect(first()).toHaveTextContent(/turned down, not switched off/);
    fireEvent.click(screen.getByRole("button", { name: /Say your name/ }));
    expect(first()).toHaveTextContent(/breaks through/);
    fireEvent.click(screen.getByRole("button", { name: /Deutsch/ }));
    expect(first()).toHaveTextContent(/fully understood/);
  });

  it("dissonance: the clash raises tension and changing behaviour lowers it most", () => {
    render(<Dissonance d={{}} />);
    expect(first()).toHaveTextContent(/No clash yet/);
    fireEvent.click(screen.getByRole("button", { name: "Now add the behaviour" }));
    expect(first()).toHaveTextContent(/85 of 100/);
    fireEvent.click(screen.getByRole("button", { name: "Change the behaviour" }));
    expect(first()).toHaveTextContent(/falls to 10 of 100/);
    fireEvent.click(screen.getByRole("button", { name: "Paid $1" }));
    expect(last()).toHaveTextContent(/not enough reason to lie/);
  });

  it("conservation: the younger child centres on height, the older child conserves", () => {
    render(<Conservation d={{ kind: "liquid" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Pour B into the tall glass" }));
    expect(last()).toHaveTextContent(/tall one has more/);
    fireEvent.click(screen.getByRole("button", { name: "Centration" }));
    expect(last()).toHaveTextContent(/one feature only/);
    fireEvent.click(screen.getByRole("button", { name: /Older child/ }));
    fireEvent.click(screen.getByRole("button", { name: "Compensation" }));
    expect(last()).toHaveTextContent(/taller, but it is also thinner/);
  });

  it("conservation: number version spreads the coins", () => {
    render(<Conservation d={{ kind: "number" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Spread out the bottom row" }));
    expect(last()).toHaveTextContent(/bottom row has more/);
  });

  it("experiment: reveal compares guesses with the bystander result", () => {
    render(
      <Experiment
        d={{
          title: "The bystander effect",
          question: "A student seems to have a seizure over an intercom. What share of people go for help?",
          unit: "%",
          conditions: [
            { label: "Alone", value: 85 },
            { label: "With one other", value: 62 },
            { label: "With four others", value: 31 },
          ],
          why: "Responsibility is spread across everyone present.",
        }}
      />,
    );
    const sliders = screen.getAllByRole("slider");
    fireEvent.change(sliders[0], { target: { value: "90" } });
    fireEvent.change(sliders[1], { target: { value: "60" } });
    fireEvent.change(sliders[2], { target: { value: "30" } });
    fireEvent.click(screen.getByRole("button", { name: "Show the result" }));
    expect(last()).toHaveTextContent(/You got the pattern right/);
    expect(last()).toHaveTextContent(/3% away/);
    expect(screen.getByText(/Real: 85%/)).toBeInTheDocument();
  });

  it("release: every step is listed; SSRI marks reuptake as changed", () => {
    render(<Release d={{}} />);
    expect(screen.getByText(/Transporter pumps/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^(Back|Next|Play)/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Reuptake/ }));
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Showing 5: Reuptake");
    fireEvent.click(screen.getByRole("button", { name: /SSRI/ }));
    expect(last()).toHaveTextContent(/cannot be pulled back/);
    expect(screen.getByRole("button", { name: /Reuptake/ })).toHaveTextContent(/Changed by SSRI/);
    fireEvent.click(screen.getByRole("button", { name: /Botulinum/ }));
    expect(last()).toHaveTextContent(/nothing is released/);
  });

  it("thought record: trap feedback and the re-rating change", () => {
    render(
      <ThoughtRecord
        d={{
          situation: "My friend did not reply to my message all day.",
          thought: "She is angry with me.",
          emotion: "anxious",
          traps: [
            { label: "Mind reading", right: true, why: "You are guessing what she thinks without evidence." },
            { label: "Labelling", why: "You are not putting a label on anyone here." },
          ],
          forEvidence: ["She usually replies quickly."],
          againstEvidence: ["She told me she has exams this week.", "We laughed together yesterday."],
          balanced: "She is probably busy with exams. If something were wrong, I can ask her.",
        }}
      />,
    );
    // the whole record shows at once: no Back or Next
    for (const t of ["She usually replies quickly.", "We laughed together yesterday.", "She is probably busy with exams. If something were wrong, I can ask her."]) expect(screen.getByText(new RegExp(t.slice(0, 20)))).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^(Back|Next)/ })).toBeNull();
    const trap = () => screen.getAllByRole("status")[0];
    fireEvent.click(screen.getByRole("button", { name: "Labelling" }));
    expect(trap()).toHaveTextContent(/Not the best fit/);
    fireEvent.click(screen.getByRole("button", { name: "Mind reading" }));
    expect(trap()).toHaveTextContent(/without evidence/);
    fireEvent.change(screen.getAllByRole("slider")[1], { target: { value: "40" } });
    expect(last()).toHaveTextContent(/From 80 to 40, down 40 points/);
  });

  it("hypnogram: the slider names the stage and depression shortens REM latency", () => {
    render(<Hypnogram d={{}} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "45" } });
    expect(last()).toHaveTextContent(/N3, deep sleep/);
    fireEvent.click(screen.getByRole("button", { name: "In depression" }));
    expect(last()).toHaveTextContent(/REM comes early \(here 48 minutes/);
  });

  it("strange situation: every episode shows at once; an avoidant infant ignores the caregiver at reunion", () => {
    render(<Strange d={{}} />);
    expect(screen.getByRole("button", { name: /Reunion/ })).toHaveTextContent(/hug/);
    fireEvent.click(screen.getByRole("button", { name: "Avoidant" }));
    expect(screen.getByRole("button", { name: /Reunion/ })).toHaveTextContent(/Ignores the caregiver/);
    expect(screen.getByRole("button", { name: /Caregiver leaves/ })).toHaveTextContent(/heart rate/);
    fireEvent.click(screen.getByRole("button", { name: /Reunion/ }));
    expect(screen.getByRole("button", { name: /Reunion/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("illusion: judge, then measure shows the lines are equal", () => {
    render(<Illusion d={{ kind: "muller-lyer" }} />);
    fireEvent.click(screen.getByRole("button", { name: "The top line" }));
    expect(last()).toHaveTextContent(/Most people see it the same way/);
    fireEvent.click(screen.getByRole("button", { name: /Measure the lines/ }));
    expect(last()).toHaveTextContent(/exactly the same length/);
  });

  it("illusion: every kind renders and figure-ground flips", () => {
    for (const kind of ["ponzo", "ebbinghaus"] as const) {
      const { unmount } = render(<Illusion d={{ kind }} />);
      expect(screen.getByText(/Which .* (longer|bigger)\?/)).toBeInTheDocument();
      unmount();
    }
    render(<Illusion d={{ kind: "figure-ground" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Both at the same time" }));
    expect(last()).toHaveTextContent(/cannot hold both/);
    fireEvent.click(screen.getByRole("button", { name: /Flip figure and ground/ }));
    expect(last()).toHaveTextContent(/figure and ground/);
  });

  it("the parser accepts the new widget kinds", () => {
    const kinds = ["attention", "dissonance", "conservation", "experiment", "release", "thoughtrecord", "hypnogram", "strange", "illusion"];
    for (const k of kinds) {
      const b = parseBlocks([`:::widget ${k}`, "{}", ":::"]);
      expect(b[0]).toMatchObject({ t: "widget", kind: k });
    }
  });

  it("no em or en dashes in the new widget files", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    for (const f of ["animations3.tsx", "animations4.tsx"]) {
      const src = fs.readFileSync(path.join(process.cwd(), "src/components/study", f), "utf8");
      expect(src.match(/[\u2013\u2014]/g)).toBeNull();
    }
  });
});
