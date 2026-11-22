import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";

import * as fx from "@/api/mock/fixtures";
import { session } from "@/auth";
import { PinPad } from "@/auth/PinPad";
import { ProtectedPlayer } from "@/lecture/player";
import { Watermark } from "@/lecture/watermark";
import { HomeView } from "@/screens/home/home";
import { QuizRunner } from "@/screens/study/quiz";
import { validateRequest } from "@/screens/visitor/request";
import { Blocks } from "@/study/blocks";
import { WidgetView } from "@/study/widgets";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});

describe("Home", () => {
  it("has one Continue hero, the Today line and at most three rows", async () => {
    await render(<HomeView data={{ ...fx.home("default"), quests: fx.quests }} />);
    expect(screen.getByText("Depression: how it presents in the clinic")).toBeTruthy();
    expect(screen.getByTestId("home-continue")).toBeTruthy();
    expect(screen.getByText("18 of 30 points today")).toBeTruthy();
    expect(screen.queryByTestId("up-next-3")).toBeNull();
    expect(screen.getByTestId("up-next-2")).toBeTruthy();
  });

  it("opens today's quests in a sheet", async () => {
    await render(<HomeView data={{ ...fx.home("default"), quests: fx.quests }} />);
    await fireEvent.press(screen.getByTestId("home-today"));
    expect(screen.getByText("Watch 15 minutes of a lecture")).toBeTruthy();
    expect(screen.getByText("4 of 10")).toBeTruthy();
  });

  it("greets a new student with their first lecture", async () => {
    await render(<HomeView data={{ ...fx.home("new"), quests: null }} />);
    // Today, Layers look: the first lecture is the Keep going card; the greeting sits on the field (TodayField), outside HomeView.
    expect(screen.getByText(/Start your first lecture/)).toBeTruthy();
    expect(screen.queryByText(/0 days in a row/)).toBeNull();
    expect(screen.getByText("Your first points come from the first lecture")).toBeTruthy();
  });

  it("does not crash when the server sends no step", async () => {
    const d = { ...fx.home("default"), quests: null, allDone: false, step: undefined as unknown as ReturnType<typeof fx.home>["step"] };
    await render(<HomeView data={d} />);
    expect(screen.queryByTestId("home-continue")).toBeNull();
  });

  it("marks a met goal with a tick in the ring", async () => {
    await render(<HomeView data={{ ...fx.home("done"), quests: null }} />);
    expect(screen.getByTestId("goal-ring-done")).toBeTruthy();
  });

  it("says when everything is done", async () => {
    await render(<HomeView data={{ ...fx.home("done"), quests: null }} />);
    expect(screen.getByText("Nothing left to do today")).toBeTruthy();
    expect(screen.getByLabelText(/^Practise: /)).toBeTruthy();
  });
});

describe("PIN pad", () => {
  it("calls back once four digits are in", async () => {
    const done = jest.fn();
    function Pad() {
      const [v, setV] = React.useState("");
      return <PinPad value={v} onChange={setV} onComplete={done} />;
    }
    await render(<Pad />);
    for (const k of ["2", "5", "8", "0"]) await fireEvent.press(screen.getByTestId(`pin-key-${k}`));
    expect(done).toHaveBeenCalledWith("2580");
  });
});

describe("Request an invitation", () => {
  it("checks the form before sending", async () => {
    expect(validateRequest({ name: "", email: "x", phone: "123", agreed: false })).toEqual({ name: expect.any(String), email: expect.any(String), phone: expect.any(String), agreed: expect.any(String) });
    expect(validateRequest({ name: "Asha", email: "asha@example.com", phone: "+91 98765 43210", agreed: true })).toEqual({});
  });
});

describe("Quiz", () => {
  it("one question per screen, then the server's score and a review", async () => {
    const submit = jest.fn(async (picks: Record<string, number>) => ({ right: 2, total: 3, review: fx.review(picks) }));
    await render(<QuizRunner title="Checkpoint 1" questions={fx.testQuestions} submit={submit} onDone={() => undefined} doneLabel="Back" />);
    expect(screen.getByTestId("question-0")).toBeTruthy();
    expect(screen.getByTestId("quiz-next")).toBeDisabled();
    await fireEvent.press(screen.getByTestId("option-1"));
    await fireEvent.press(screen.getByTestId("quiz-next"));
    expect(screen.getByTestId("question-1")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("option-2"));
    await fireEvent.press(screen.getByTestId("quiz-next"));
    await fireEvent.press(screen.getByTestId("option-0"));
    await fireEvent.press(screen.getByTestId("quiz-next"));
    expect(submit).toHaveBeenCalledWith({ q1: 1, q2: 2, q3: 0 });
    expect(await screen.findByTestId("quiz-result")).toBeTruthy();
    expect(screen.getByLabelText("2 of 3 right")).toBeTruthy();
    // The result lists every question with its verdict; tapping one shows the right answer.
    expect(screen.getByLabelText(/^Question 1, (right|not right)\./)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("review-0"));
    expect(screen.getByTestId("review-0-options")).toBeTruthy();
  });
});

describe("Study content", () => {
  const ctx = { moduleId: "m02", sectionId: "s1", view: "student" as const };
  it("draws blocks natively: headings with tags, lists, call-outs, folded answers", async () => {
    await render(<Blocks blocks={fx.sectionContent("m02", "s1")!.chunks[0]!.blocks} ctx={ctx} />);
    expect(screen.getByText("CORE")).toBeTruthy();
    expect(screen.getByTestId("box-define")).toBeTruthy();
    expect(screen.getByText(/DEFINITION/)).toBeTruthy();
    expect(screen.getByTestId("w-guess")).toBeTruthy();
  });

  it("shows only the chosen reading view", async () => {
    await render(<Blocks blocks={[{ t: "view", view: "clinician", blocks: [{ t: "p", text: "For clinicians" }] }, { t: "view", view: "student", blocks: [{ t: "p", text: "For students" }] }]} ctx={ctx} />);
    expect(screen.queryByText("For clinicians")).toBeNull();
    expect(screen.getByText("For students")).toBeTruthy();
  });

  it("an unknown or newer widget becomes the website row, never a crash", async () => {
    await render(<WidgetView block={{ t: "widget", kind: "amesroom", v: 2, data: {} } as never} ctx={ctx} />);
    expect(screen.getByTestId("widget-web")).toBeTruthy();
  });

  it("a guess shows the real range and why", async () => {
    await render(<WidgetView block={{ t: "widget", kind: "guess", v: 1, data: { prompt: "How long?", min: 1, max: 12, unit: "weeks", answer: [2, 2], reveal: "**Two weeks.**" } }} ctx={ctx} />);
    await fireEvent.press(screen.getByTestId("guess-check"));
    expect(screen.getByText("It is 2 weeks")).toBeTruthy();
  });

  it("a decision shows the best choice and the outcome", async () => {
    const block = fx.sectionContent("m02", "s1")!.chunks[2]!.blocks.find((b) => b.t === "widget" && b.kind === "decide")!;
    await render(<WidgetView block={block as never} ctx={ctx} />);
    await fireEvent.press(screen.getByTestId("decide-0"));
    expect(screen.getByText("This could harm")).toBeTruthy();
  });

  it("flow, layers and curve diagrams draw with the sketch kit", async () => {
    await render(
      <>
        <WidgetView block={{ t: "widget", kind: "flow", v: 1, data: { layout: "cycle", nodes: [{ id: "a", label: "Thought" }, { id: "b", label: "Feeling" }, { id: "c", label: "Action" }] } }} ctx={ctx} />
        <WidgetView block={{ t: "widget", kind: "layers", v: 1, data: { shape: "pyramid", layers: [{ label: "Top", detail: "t" }, { label: "Base", detail: "b" }] } }} ctx={ctx} />
        <WidgetView block={{ t: "widget", kind: "curve", v: 1, data: { kind: "half-life" } }} ctx={ctx} />
      </>,
    );
    expect(screen.getByTestId("sketch-flow")).toBeTruthy();
    expect(screen.getByTestId("sketch-layers")).toBeTruthy();
    expect(screen.getByTestId("sketch-curve-half-life")).toBeTruthy();
  });
});

describe("Lecture player", () => {
  it("draws the moving watermark, hidden from screen readers", async () => {
    await render(<Watermark text="Ananya Mehta · VIBHA-000123" />);
    // Screen readers never reach it: the normal query cannot see it at all.
    expect(screen.queryByTestId("watermark")).toBeNull();
    const wm = screen.getByTestId("watermark", { includeHiddenElements: true });
    expect(wm.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(wm.props.pointerEvents).toBe("none");
    expect(screen.getByText("Ananya Mehta · VIBHA-000123", { includeHiddenElements: true })).toBeTruthy();
  });

  it("gets a stream for the lecture and shows the watermark over it", async () => {
    await render(<ProtectedPlayer lessonId="l5" compromised={false} />);
    await waitFor(() => expect(screen.getByText("Ananya Mehta · VIBHA-000123", { includeHiddenElements: true })).toBeTruthy());
    expect(screen.getByTestId("player-surface")).toBeTruthy();
  });

  it("refuses to play on a rooted phone", async () => {
    await render(<ProtectedPlayer lessonId="l5" compromised />);
    expect(await screen.findByTestId("player-refused")).toBeTruthy();
    expect(screen.getByText("Lectures cannot be played on a rooted phone.")).toBeTruthy();
  });
});
