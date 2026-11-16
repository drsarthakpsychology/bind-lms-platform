import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { ToolCaseScreen } from "@/practise/cases/tool";
import { EscapeGame } from "@/practise/games/escape";
import { WardGame } from "@/practise/games/ward";
import { MockExamScreen, MocksScreen } from "@/practise/prep/mock";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
});

const press = async (id: string) => {
  await waitFor(() => expect(screen.getByTestId(id)).toBeTruthy(), { timeout: 4000 });
  await fireEvent.press(screen.getByTestId(id));
};
const posted = (path: string) => mock.log().filter((l) => l.method === "POST" && l.path.startsWith(path));

describe("Exam Prep timed mocks", () => {
  it("lists the papers with their marking", async () => {
    await render(<MocksScreen />);
    await waitFor(() => expect(screen.getByText("Full psychology mock")).toBeTruthy());
    expect(screen.getByText("0.5 marks off for a wrong answer; a blank gets 0")).toBeTruthy();
    expect(screen.getByTestId("mock-open-practice-clinical")).toBeTruthy();
  });

  it("starts a paper, answers, marks, moves on, hands in, and reviews every question", async () => {
    params.mockReturnValue({ spec: "practice-clinical" });
    await render(<MockExamScreen />);
    await press("mock-start");
    await waitFor(() => expect(screen.getByTestId("mock-clock")).toBeTruthy());
    await press("mock-option-1");
    await press("mock-mark");
    expect(screen.getByText("Marked")).toBeTruthy();
    await press("mock-next");
    await press("mock-option-0");
    await press("mock-submit-open");
    await waitFor(() => expect(screen.getByText("Submit your paper?")).toBeTruthy());
    await press("mock-submit");
    await waitFor(() => expect(screen.getByTestId("mock-result")).toBeTruthy());
    const body = posted("/play/prep/mockSubmit")[0]!.body as { args: [{ answers: Record<string, number>; marked: string[] }] };
    expect(Object.keys(body.args[0].answers)).toHaveLength(2);
    expect(body.args[0].marked).toHaveLength(1);
    expect(JSON.stringify(body)).not.toMatch(/"score"/);
    expect(screen.getByTestId("mock-standing")).toBeTruthy();
    await press("mock-review-1");
    await waitFor(() => expect(screen.getByText("WHY")).toBeTruthy());
  });
});

describe("Team modes", () => {
  it("Ward Week: start a team, see the code, vote, and the team's call comes back", async () => {
    await render(<WardGame />);
    await press("team-create");
    await waitFor(() => expect(screen.getByTestId("ward-team")).toBeTruthy());
    expect(screen.getByTestId("team-code")).toBeTruthy();
    await press("ward-vote-0");
    await waitFor(() => expect(screen.getByText(/The team chose A/)).toBeTruthy());
    expect(posted("/play/ward/vote")).toHaveLength(1);
    await press("ward-next");
    await waitFor(() => expect(screen.getByTestId("ward-vote-0")).toBeTruthy());
  });

  it("Ward Week: a wrong code says so", async () => {
    await render(<WardGame />);
    await waitFor(() => expect(screen.getByTestId("team-join-code")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("team-join-code"), "ZZZZ9");
    await press("team-join");
    await waitFor(() => expect(screen.getByText("No team with that code.")).toBeTruthy());
  });

  it("Escape Room: a lobby, start the clock, then the team's doors and the race", async () => {
    await render(<EscapeGame />);
    await press("team-create");
    await waitFor(() => expect(screen.getByTestId("escape-lobby")).toBeTruthy());
    await press("escape-start-team");
    await waitFor(() => expect(screen.getByTestId("escape-team")).toBeTruthy());
    expect(screen.getByTestId("escape-race")).toBeTruthy();
    expect(posted("/play/escape/startTeam")).toHaveLength(1);
  });
});

const records = (kind: string) => posted(`/practise/records/${kind}`).map((l) => l.body as Record<string, unknown>);

describe("Self-check records and the MSE trainer", () => {
  it("OSCE: tick the checklist, give the overall call, and the website's attempt and competency go out", async () => {
    params.mockReturnValue({ item: "osce-1" });
    await render(<ToolCaseScreen tool="osce" />);
    await press("tool-tick-0");
    await press("tool-submit");
    await press("tool-next");
    await press("tool-rate-4");
    await waitFor(() => expect(screen.getByTestId("tool-rated")).toBeTruthy());
    await press("tool-next");
    await waitFor(() => expect(screen.getByText(/case done/i)).toBeTruthy());
    const [osce] = records("osce");
    expect(osce).toMatchObject({ slug: "osce-1", mode: "text", global_rating: 4 });
    expect((osce!.checklist as { done: boolean }[])[0]!.done).toBe(true);
    expect((osce!.scores as { global_rating: number }).global_rating).toBeCloseTo(0.8);
    expect(records("competency")[0]).toMatchObject({ tool: "osce", score: 4 });
  });

  it("Formulation: sort, write the story, compare the words, and the attempt goes out", async () => {
    params.mockReturnValue({ item: "form-1" });
    await render(<ToolCaseScreen tool="formulation" />);
    await waitFor(() => expect(screen.getByTestId("tool-bucket-0-0")).toBeTruthy());
    for (let i = 0; screen.queryByTestId(`tool-bucket-${i}-0`); i++) await fireEvent.press(screen.getByTestId(`tool-bucket-${i}-1`));
    await press("tool-submit");
    await press("tool-next");
    await fireEvent.changeText(screen.getByTestId("tool-write-0"), "Ravi presents with low mood after losing his job, with a family history and poor sleep keeping it going.");
    await press("tool-submit");
    await waitFor(() => expect(screen.getByTestId("tool-diff")).toBeTruthy());
    await press("tool-next");
    const [f] = records("formulation");
    expect(f).toMatchObject({ case_id: "form-1" });
    expect((f!.sorted_factors as unknown[]).length).toBe(10);
    expect(String(f!.narrative)).toMatch(/^Ravi presents/);
    expect(f!.diff).toHaveProperty("missing");
  });

  it("MSE Level 4: the full MSE under the clock, each domain matched, fair or missed", async () => {
    params.mockReturnValue({ item: "mse4-sandeep" });
    await render(<ToolCaseScreen tool="mse-trainer" />);
    await waitFor(() => expect(screen.getByTestId("tool-mse-appearance")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("tool-mse-appearance"), "trembling, rigid posture");
    await fireEvent.changeText(screen.getByTestId("tool-mse-mood"), "irritable");
    await press("tool-submit");
    await waitFor(() => expect(screen.getByTestId("tool-lights")).toBeTruthy());
    expect(screen.getAllByText("MATCHED").length).toBeGreaterThanOrEqual(2);
    await press("tool-next");
    expect(records("mse")[0]).toMatchObject({ stimulus_id: "mse4-sandeep", level: "4" });
  });

  it("the small things walk: reveal the read and the move, and the place is kept", async () => {
    params.mockReturnValue({ item: "small-things" });
    await render(<ToolCaseScreen tool="mse-trainer" />);
    await press("tool-moment-reveal");
    await waitFor(() => expect(screen.getByTestId("tool-moment-read")).toBeTruthy());
    expect(screen.getByText("The move".toUpperCase())).toBeTruthy();
    await press("tool-next");
    const marks = posted("/play/cases/mark").map((l) => (l.body as { args: unknown[] }).args);
    expect(marks).toContainEqual(["mse-small", "walk", { at: "st-2" }]);
  });
});
