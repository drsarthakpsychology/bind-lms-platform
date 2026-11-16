// Round 10 test-and-fix (student, lecture-only and visitor screens).
import { fireEvent, render as rawRender, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { LoadSwap } from "@/motion";
import { missWhy } from "@/practise/games/blitz";
import { SortGame } from "@/practise/games/sort";
import { WardGame } from "@/practise/games/ward";
import { render } from "./utils";
import { searchCovers, searchHint } from "@/screens/search/search";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => mock.reset());

const press = async (id: string) => {
  await waitFor(() => expect(screen.getByTestId(id)).toBeTruthy());
  await fireEvent.press(screen.getByTestId(id));
};

describe("Blitz: what you missed", () => {
  it("drops an explanation that only repeats the prompt", () => {
    const prompt = "Which word fits: No delusions, obsessions or risk thoughts found. A normal finding.";
    expect(missWhy({ prompt, answer: "No abnormal beliefs", why: "No abnormal beliefs: No delusions, obsessions or risk thoughts found. A normal finding." })).toBe("");
  });
  it("keeps an explanation that adds something", () => {
    const m = { prompt: "Hypnagogic hallucination: An unwanted, intrusive thought.", answer: "False", why: "Hypnagogic hallucination: A brief voice or image while falling asleep." };
    expect(missWhy(m)).toBe(m.why);
  });
});

describe("Criteria sort", () => {
  it("a tap on an empty diagnosis places the card showing, without picking it up first", async () => {
    await render(
      <GestureHandlerRootView>
        <SortGame />
      </GestureHandlerRootView>,
    );
    await press("start-play");
    await waitFor(() => expect(screen.getByText("0 of 16 placed")).toBeTruthy());
    await press("sort-bin-1");
    await waitFor(() => expect(screen.getByText("1 of 16 placed")).toBeTruthy());
    expect(screen.queryByText("No cards here yet.")).toBeNull();
  });
});

describe("Content that rises in after a load keeps the column's gap", () => {
  it("passes the gap to the wrapper, so sections are not glued together on first load", async () => {
    const view = (ready: boolean) => (
      <LoadSwap ready={ready} gap={32} skeleton={<Text>loading</Text>}>
        <View testID="a" />
        <View testID="b" />
      </LoadSwap>
    );
    const r = await rawRender(view(false));
    await r.rerender(view(true));
    const styles: object[] = [];
    for (let n = screen.getByTestId("a").parent; n; n = n.parent) styles.push(StyleSheet.flatten(n.props.style) ?? {});
    expect(styles.some((x) => (x as { gap?: number }).gap === 32)).toBe(true);
  });
});

describe("Search says only what this account can find", () => {
  it("a lecture-only account is not promised modules, medicines, cases or games", () => {
    expect(searchCovers({ study: false, medicines: false, practise: false, games: false })).toBe("Lectures and doubts.");
    expect(searchHint(false, false)).toBe("Lectures, doubts");
  });
  it("a student sees the full list", () => {
    expect(searchCovers({ study: true, medicines: true, practise: true, games: true })).toBe("Lectures, modules, notes, medicines, cases, games and Exam Prep.");
    expect(searchHint(true, true)).toBe("Lectures, modules, medicines");
  });
});

describe("Ward Week team: the team's call", () => {
  it("does not show the next call's empty vote count beside the result", async () => {
    await render(<WardGame />);
    await press("team-create");
    await press("ward-vote-1");
    await waitFor(() => expect(screen.getByText(/The team chose/)).toBeTruthy());
    expect(screen.queryByText(/\d+\/\d+ voted/)).toBeNull();
    expect(screen.queryByText("Not yet")).toBeNull();
    await press("ward-next");
    await waitFor(() => expect(screen.getByText(/\d+\/\d+ voted/)).toBeTruthy());
  });
});
