import { screen, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import * as React from "react";

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
