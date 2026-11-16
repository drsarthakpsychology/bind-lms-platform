// Round 10 test-and-fix (student, lecture-only and visitor screens).
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { missWhy } from "@/practise/games/blitz";
import { SortGame } from "@/practise/games/sort";
import { render } from "./utils";

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
