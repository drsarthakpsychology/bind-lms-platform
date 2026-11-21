import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Text } from "react-native";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { PATTERNS, phaseAt } from "@/calm/data";
import { BreathingScreen } from "@/calm/breath";
import { CalmHomeScreen, GroundingScreen, WorryScreen } from "@/calm/screens";
import { CASEBOOK } from "@/casebook/mock";
import { CasebookScreen, CaseScreen } from "@/casebook/screens";
import { caseSteps, orderRight } from "@/casebook/steps";
import { dilemmaSteps, EthicsHomeScreen } from "@/ethics/screens";
import { InterviewScreen, pickPanel, selfScore } from "@/interview/screen";
import { INTERVIEWS } from "@/interview/mock";
import { PractiseExtras, WellbeingExtras } from "@/lab/entries";
import { EXPERIMENTS } from "@/lab/mock";
import { QuestionRun } from "@/lab/run";
import { RUNNERS } from "@/lab/runners-b";
import { ExperimentScreen, LabHomeScreen } from "@/lab/screens";
import { createIndex } from "@/search/engine";
import { fixedDocs, mergeServer, SearchScreen } from "@/search/screen";
import { SelfCheckHomeScreen, SelfCheckRunScreen } from "@/selfcheck/screens";
import { INSTRUMENTS, PHQ9, scoreInstrument } from "@/selfcheck/tests";
import { render } from "./utils";

/** Shows a render error as text, so a test can say what broke. */
class Catch extends React.Component<{ children: React.ReactNode }, { e: string | null }> {
  state = { e: null as string | null };
  static getDerivedStateFromError(e: Error) {
    return { e: String(e?.stack ?? e).slice(0, 700) };
  }
  render() {
    return this.state.e ? <Text testID="render-error">{this.state.e}</Text> : this.props.children;
  }
}
const errorText = () => (screen.queryByTestId("render-error")?.props.children as string | undefined) ?? "";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("Search", () => {
  it("reads ?q=, finds a game, opens it and remembers the search", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ q: "blitz" });
    await render(<SearchScreen />);
    await fireEvent.press(await screen.findByTestId("hit-g-blitz"));
    expect(router.push).toHaveBeenLastCalledWith("/game/blitz");
    await fireEvent.press(screen.getByTestId("search-clear"));
    expect(await screen.findByTestId("recent-blitz")).toBeTruthy();
    expect(screen.getByTestId("shortcut-lectures")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("recent-remove-blitz"));
    expect(screen.queryByTestId("recent-blitz")).toBeNull();
  });

  it("groups what it finds and forgives a spelling slip", async () => {
    await render(<SearchScreen />);
    await fireEvent.changeText(screen.getByTestId("search-input"), "strop");
    expect(await screen.findByTestId("hit-x-stroop")).toBeTruthy();
    expect(screen.getByTestId("group-practise")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("search-input"), "zzqqxx");
    expect(await screen.findByTestId("search-empty")).toBeTruthy();
  });

  it("finds the new screens by what people call them, and adds the server's rows once", () => {
    const docs = fixedDocs({ practise: true, games: true, study: true, lecturesOnly: false });
    const index = createIndex(docs);
    const top = (q: string) => index.search(q)[0]?.doc.href;
    expect(top("breathing")).toBe("/calm/breathing");
    expect(top("phq")).toBe("/selfcheck/phq-9");
    expect(top("casebook")).toBe("/casebook");
    expect(top("ethics")).toBe("/ethics");
    expect(fixedDocs({ practise: false, games: false, study: false, lecturesOnly: true }).some((d) => d.href.startsWith("/lab"))).toBe(false);
    const local = docs.filter((d) => d.key === "s-calm");
    const merged = mergeServer(local, { v: 1, q: "x", types: [], results: [{ id: "a", type: "note", title: "Depression", meta: "Note", href: "/study/notes/depression", app: "/notes/depression" }, { id: "b", type: "note", title: "Calm again", meta: "", href: "/free", app: "/calm" }] });
    expect(merged.map((d) => d.href)).toEqual(["/calm", "/notes/depression"]);
  });
});

describe("Calm", () => {
  it("lists the exercises with breathing first, and the help line", async () => {
    await render(<CalmHomeScreen />);
    expect(screen.getByTestId("calm-breathing-card")).toBeTruthy();
    expect(screen.getByTestId("calm-grounding-card")).toBeTruthy();
    expect(screen.getByTestId("help-line")).toBeTruthy();
  });

  it("knows which part of the breath a moment falls in", () => {
    expect(phaseAt("box", 0)).toEqual({ index: 0, left: 4 });
    expect(phaseAt("box", 4.5)).toEqual({ index: 1, left: 4 });
    expect(phaseAt("box", 15.2)).toEqual({ index: 3, left: 1 });
    expect(phaseAt("478", 12)).toEqual({ index: 2, left: 7 });
    expect(PATTERNS.slow.phases.reduce((a, p) => a + p.secs, 0)).toBe(10);
  });

  it("breathing starts and stops; with Reduce Motion there is no tick switch", async () => {
    await render(<BreathingScreen />);
    expect(screen.getByText("Ready")).toBeTruthy();
    expect(screen.queryByTestId("breath-ticks")).toBeNull();
    await fireEvent.press(screen.getByTestId("breath-start"));
    expect(screen.getByText("Breathe in")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("breath-stop"));
    expect(screen.getByText("Ready")).toBeTruthy();
  });

  it("grounding walks the five senses", async () => {
    await render(<GroundingScreen />);
    expect(screen.getByText("things you can see")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("notice-0"));
    for (let i = 0; i < 5; i++) await fireEvent.press(screen.getByTestId("grounding-next"));
    expect(screen.getByText("You are here, in this room, right now.")).toBeTruthy();
  });

  it("the worry sorter lets a worry go", async () => {
    await render(<WorryScreen />);
    await fireEvent.changeText(screen.getByTestId("worry-input"), "The exam on Monday");
    await fireEvent.press(screen.getByTestId("worry-next"));
    await fireEvent.press(screen.getByTestId("worry-no"));
    expect(screen.getByText("Let this one go")).toBeTruthy();
  });
});

describe("Self-checks", () => {
  it("lists all six", async () => {
    await render(<SelfCheckHomeScreen />);
    for (const x of INSTRUMENTS) expect(screen.getByTestId(`selfcheck-${x.id}`)).toBeTruthy();
  });

  it("scores the low mood check and flags question 9", () => {
    const r = scoreInstrument(PHQ9, [1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(r.kind === "total" && r.score).toBe(9);
    expect(r.flags).toContain("self-harm");
    expect(scoreInstrument(PHQ9, [0, 0, 0, 0, 0, 0, 0, 0, 0]).flags).toEqual([]);
  });

  it("runs one from intro to a result, and shows the urgent help when question 9 is not zero", async () => {
    jest.useFakeTimers();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "phq-9" });
    await render(<SelfCheckRunScreen />);
    await fireEvent.press(screen.getByTestId("selfcheck-start"));
    for (let i = 0; i < 10; i++) {
      await fireEvent.press(screen.getByTestId("selfcheck-options-1"));
      await act(async () => {
        jest.advanceTimersByTime(300);
      });
    }
    expect(screen.getByTestId("selfcheck-result")).toBeTruthy();
    expect(screen.getByTestId("selfcheck-urgent")).toBeTruthy();
    expect(screen.getByText("Mild")).toBeTruthy();
    jest.useRealTimers();
  });
});

describe("Ethics", () => {
  it("shows today's dilemmas from the server and opens one", async () => {
    await render(<EthicsHomeScreen />);
    const cards = await screen.findAllByTestId(/^dilemma-/);
    expect(cards.length).toBeGreaterThan(0);
    await fireEvent.press(cards[0]!);
    // A card that grows first measures where it is, then opens.
    await waitFor(() => expect((router.push as jest.Mock).mock.calls[0]?.[0]).toMatch(/^\/ethics\//));
    expect(screen.getByTestId("ethics-depth")).toBeTruthy();
  });

  it("turns a dilemma into one question with the law to read after", () => {
    const s = dilemmaSteps({ id: "d", tag: "Consent", setting: "OPD", vignette: "V", options: [{ label: "A", consequence: "ca", correct: false }, { label: "B", consequence: "cb", correct: true }], law: "The law" });
    expect(s[0]).toMatchObject({ answer: 1, notes: ["ca", "cb"], more: { label: "What the law says", text: "The law" } });
  });
});

describe("The question run", () => {
  it("choose, check, read the result, and end on a summary", async () => {
    const done = jest.fn();
    await render(<QuestionRun title="T" onDone={done} steps={[{ id: "a", prompt: "One?", options: ["x", "y"], answer: 1, why: "because" }, { id: "b", prompt: "Two?", options: ["x", "y"], answer: 0 }]} />);
    await fireEvent.press(screen.getByTestId("run-options-1"));
    await fireEvent.press(screen.getByTestId("run-check"));
    expect(screen.getByText("Yes, that fits")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("result-next"));
    await fireEvent.press(screen.getByTestId("run-options-1"));
    await fireEvent.press(screen.getByTestId("run-check"));
    expect(screen.getByText("Not quite")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("result-next"));
    expect(done).toHaveBeenCalledWith([{ id: "a", picked: 1, right: true }, { id: "b", picked: 1, right: false }]);
    expect(screen.getByTestId("run-summary")).toBeTruthy();
    expect(screen.getByText("Look at these again")).toBeTruthy();
  });
});

describe("Mock interview", () => {
  it("draws one question per category and scores like the website", () => {
    const panel = pickPanel(INTERVIEWS);
    expect(panel).toHaveLength(5);
    expect(new Set(panel.map((q) => q.category)).size).toBe(5);
    expect(pickPanel(INTERVIEWS, 1)[0]!.id).not.toBe(panel[0]!.id);
    expect(selfScore(4, 3, 0)).toEqual({ pct: 75, band: "strong" });
    expect(selfScore(4, 3, 2)).toEqual({ pct: 45, band: "okay" });
    expect(selfScore(0, 0, 0)).toEqual({ pct: 0, band: "weak" });
  });

  it("answer, follow-up, mark yourself, read a strong answer", async () => {
    await render(<InterviewScreen />);
    await fireEvent.press(screen.getByTestId("interview-start"));
    await fireEvent.changeText(screen.getByTestId("interview-answer"), "My answer in points");
    await fireEvent.press(screen.getByTestId("interview-next"));
    const mark = screen.queryByTestId("interview-mark");
    if (mark) await fireEvent.press(mark);
    await fireEvent.press(screen.getByTestId("cover-0"));
    expect(screen.getByText("A strong answer")).toBeTruthy();
    expect(screen.getByTestId("interview-continue")).toBeTruthy();
  });
});

describe("Casebook", () => {
  it("browses every case and shows an empty saved list", async () => {
    await render(<CasebookScreen />);
    expect(screen.getByTestId(`case-${CASEBOOK[0]!.id}`)).toBeTruthy();
    await render(<CasebookScreen start="saved" />);
    expect(screen.getAllByTestId("casebook-empty").length).toBe(1);
  });

  it("every read-then-choose case makes a round with a right answer in range", () => {
    for (const c of CASEBOOK) {
      const steps = caseSteps(c, 3);
      if (c.format === "branching" || c.format === "timeline") expect(steps).toEqual([]);
      else {
        expect(steps.length).toBeGreaterThan(0);
        for (const s of steps) {
          expect(s.options.length).toBeGreaterThanOrEqual(2);
          expect(s.options.length).toBeLessThanOrEqual(5);
          expect(s.answer).toBeGreaterThanOrEqual(0);
          expect(s.answer).toBeLessThan(s.options.length);
        }
      }
    }
    expect(orderRight(["a", "b", "c"], ["a", "c", "b"])).toBe(1);
  });

  it("the case page saves the case and starts the player", async () => {
    const c = CASEBOOK.find((x) => x.format === "differential")!;
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: c.id });
    await render(<CaseScreen />);
    expect(screen.getByText(c.objective)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("case-save"));
    expect(screen.getByLabelText("Remove from saved cases")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("case-start"));
    expect(screen.getByTestId("case-run")).toBeTruthy();
  });

  it("a timeline is put in order by tapping", async () => {
    const c = CASEBOOK.find((x) => x.format === "timeline")!;
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: c.id });
    await render(<CaseScreen />);
    await fireEvent.press(screen.getByTestId("case-start"));
    if (c.format !== "timeline") return;
    for (const e of c.events) await fireEvent.press(screen.getByTestId(`event-${e.id}`));
    await fireEvent.press(screen.getByTestId("run-check"));
    expect(screen.getByText("Yes, that is the order")).toBeTruthy();
  });
});

describe("Psychology Lab", () => {
  it("has a runner for every experiment", () => {
    expect(EXPERIMENTS).toHaveLength(12);
    for (const e of EXPERIMENTS) expect(RUNNERS[e.id]).toBeTruthy();
  });

  it("lists the experiments and points at the Casebook", async () => {
    await render(<LabHomeScreen />);
    expect(screen.getByTestId("lab-digit-span")).toBeTruthy();
    expect(screen.getByTestId("lab-next")).toBeTruthy();
    expect(screen.getByTestId("lab-casebook")).toBeTruthy();
  });

  it("an experiment shows the question first; the result and the reading come after a run", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "design-study" });
    await render(<ExperimentScreen />);
    expect(screen.getByText("The question")).toBeTruthy();
    expect(screen.queryByText("The classic finding")).toBeNull();
    await fireEvent.press(screen.getByTestId("lab-start"));
    for (const key of ["sample", "size", "control", "assign", "blind", "measure"]) await fireEvent.press(screen.getByTestId(`design-${key}-2`.replace("blind-2", "blind-1")));
    await fireEvent.press(screen.getByTestId("lab-submit"));
    expect(screen.getByTestId("lab-result")).toBeTruthy();
    expect(screen.getByText("Your design closes 8 of 8 ways a study can fool you.")).toBeTruthy();
    expect(screen.getByText("The classic finding")).toBeTruthy();
    expect(screen.getByTestId("lab-check-start")).toBeTruthy();
  });

  it("every runner draws its first screen", async () => {
    for (const e of EXPERIMENTS) {
      const R = RUNNERS[e.id]!;
      const view = await render(
        <Catch>
          <R onDone={() => undefined} onClose={() => undefined} />
        </Catch>,
      );
      expect(`${e.id} ${errorText()}`).toBe(`${e.id} `);
      expect(screen.queryAllByTestId("lab-run").length).toBeGreaterThan(0);
      view.unmount();
    }
  });
});

describe("Entry cards", () => {
  it("each opens its screen", async () => {
    await render(
      <Catch>
        <PractiseExtras />
        <WellbeingExtras />
      </Catch>,
    );
    expect(errorText()).toBe("");
    const want: Record<string, string> = { "entry-casebook": "/casebook", "entry-lab": "/lab", "entry-ethics": "/ethics", "entry-interview": "/interview", "entry-calm": "/calm", "entry-selfcheck": "/selfcheck" };
    for (const [id, href] of Object.entries(want)) {
      await fireEvent.press(screen.getByTestId(id));
      await waitFor(() => expect(router.push).toHaveBeenLastCalledWith(href));
    }
  });
});
