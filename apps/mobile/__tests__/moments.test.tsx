import { screen, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import * as React from "react";

import { LectureIntro } from "@/lecture/intro";
import { PAUSE, PLAY, PlayPause, quad } from "@/lecture/playmorph";
import { isSafePath } from "@/lib/svg-safe";
import { EndPanel, GameFrame } from "@/practise/frame";
import { render } from "./utils";

const note = Haptics.notificationAsync as jest.Mock;

beforeEach(() => note.mockClear());

describe("end of a round (storyboard 2)", () => {
  it("a lost round gets a warning haptic, never a success one", async () => {
    await render(
      <GameFrame title="Rx">
        <EndPanel score="20" right={1} total={10} outcome="lost" />
      </GameFrame>,
    );
    await waitFor(() => expect(note).toHaveBeenCalledWith("warning"));
    expect(note).not.toHaveBeenCalledWith("success");
  });

  it("a won round gets one success haptic and its sticker on the score card", async () => {
    await render(
      <GameFrame title="Rx">
        <EndPanel score="80" right={8} total={10} />
      </GameFrame>,
    );
    await waitFor(() => expect(note).toHaveBeenCalledWith("success"));
    expect(note).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("sticker")).toBeTruthy();
  });
});

describe("lecture (storyboard 5)", () => {
  it("the play and pause morph never hands Android bad path data", () => {
    for (const t of [0, 0.25, 0.5, 1, NaN, Infinity, -3]) for (const i of [0, 1] as const) expect(isSafePath(quad(PAUSE[i], PLAY[i], t))).toBe(true);
  });

  it("shows the right icon and the intro with the lecture number", async () => {
    await render(
      <>
        <PlayPause playing={false} />
        <LectureIntro info={{ number: 5, week: 3 }} gone={false} />
      </>,
    );
    expect(screen.getByTestId("icon-play")).toBeTruthy();
    expect(screen.getByLabelText("Lecture 5, Week 3")).toBeTruthy();
  });
});
