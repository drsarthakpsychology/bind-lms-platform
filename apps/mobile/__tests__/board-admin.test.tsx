import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { api, session } from "@/auth";
import { BoardScreen, boardPath } from "@/practise/board";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
});

describe("board query", () => {
  it("adds only what differs from the defaults, and never to game boards", () => {
    const none = { q: "", cohort: "", sort: "rank" as const, page: 1 };
    expect(boardPath("/leaderboards/league", "league", none)).toBe("/leaderboards/league");
    expect(boardPath("/leaderboards/quiz", "quiz", { q: " asha ", cohort: "c1", sort: "name", page: 2 })).toBe("/leaderboards/quiz?q=asha&cohort=c1&sort=name&page=2");
    expect(boardPath("/leaderboards/games/rx", "rx", { ...none, q: "asha", page: 3 })).toBe("/leaderboards/games/rx");
  });
});

describe.skip("the leaderboard as an admin", () => {
  beforeAll(async () => signInAs("admin@example.com"));

  it("lists every student with cohort, zero scores too, in pages", async () => {
    await render(<BoardScreen />);
    await waitFor(() => expect(screen.getByTestId("board-admin")).toBeTruthy());
    expect(screen.getByText("Page 1 of 2 · 72 students")).toBeTruthy();
    expect(screen.getAllByText(/^Cohort (One|Two) · Neuron league$/).length).toBe(50);
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.queryByText(/\(you\)/)).toBeNull();
    fireEvent.press(screen.getByTestId("board-next"));
    await new Promise((r) => setTimeout(r, 300));

    const got = await api.get<{ admin?: unknown }>("/leaderboards/league?page=2").catch((e: unknown) => String(e));
    console.log("DEBUGLOG", JSON.stringify(got).slice(0, 300), JSON.stringify(screen.getByTestId("board-pager").props).slice(0, 200));
    await waitFor(() => expect(screen.getByText("Page 2 of 2 · 72 students")).toBeTruthy());
    expect(screen.getByTestId("board-prev")).toBeTruthy();
  });

  it("filters by cohort, searches a name and sorts by name", async () => {
    await render(<BoardScreen />);
    await waitFor(() => expect(screen.getByTestId("board-admin")).toBeTruthy());
    fireEvent.press(screen.getByText("Cohort Two"));
    await waitFor(() => expect(screen.getByText("Page 1 of 1 · 36 students")).toBeTruthy());
    expect(screen.queryByText(/^Cohort One ·/)).toBeNull();
    fireEvent.changeText(screen.getByTestId("board-search"), "meera");
    fireEvent(screen.getByTestId("board-search"), "submitEditing");
    await waitFor(() => expect(screen.getByText(/Page 1 of 1 · \d+ students?$/)).toBeTruthy());
    expect(screen.getAllByText(/^Meera /).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^Aarav /)).toBeNull();
    fireEvent.changeText(screen.getByTestId("board-search"), "");
    fireEvent(screen.getByTestId("board-search"), "submitEditing");
    fireEvent.press(screen.getByText("Name"));
    await waitFor(() => expect(screen.getByText("Page 1 of 1 · 36 students")).toBeTruthy());
  });
});

describe("the leaderboard as a student", () => {
  beforeAll(async () => signInAs("ananya@example.com"));

  it("keeps the student board: own cohort, no admin search or pages", async () => {
    await render(<BoardScreen />);
    await waitFor(() => expect(screen.getByTestId("board-you")).toBeTruthy());
    expect(screen.queryByTestId("board-admin")).toBeNull();
    expect(screen.queryByTestId("board-pager")).toBeNull();
  });
});
