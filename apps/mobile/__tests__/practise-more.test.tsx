import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
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
  await waitFor(() => expect(screen.getByTestId(id)).toBeTruthy());
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
    fireEvent.changeText(screen.getByTestId("team-join-code"), "ZZZZ9");
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
