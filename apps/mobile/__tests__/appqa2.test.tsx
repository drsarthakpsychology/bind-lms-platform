/**
 * Bugs found in the second app check (with Practise), one test each.
 */
import { useFocusEffect } from "expo-router";
import * as React from "react";
import { BackHandler, Text } from "react-native";

import { GameFrame } from "@/practise/frame";
import { render } from "./utils";

describe("Android back", () => {
  it("is not taken by a game under the page on top (back on Rx Detective's medicine page did nothing)", async () => {
    const add = jest.spyOn(BackHandler, "addEventListener");
    let focused = false;
    (useFocusEffect as jest.Mock).mockImplementation((cb: () => void | (() => void)) => {
      React.useEffect(() => (focused ? cb() : undefined), [cb]);
    });
    try {
      // The game screen while another page sits on top of it.
      const a = await render(
        <GameFrame title="Rx Detective" confirmLeave>
          <Text>case</Text>
        </GameFrame>,
      );
      expect(add.mock.calls.filter(([e]) => e === "hardwareBackPress")).toHaveLength(0);
      a.unmount();
      // The game screen on top: back asks first and is used up.
      focused = true;
      const b = await render(
        <GameFrame title="Rx Detective" confirmLeave>
          <Text>case</Text>
        </GameFrame>,
      );
      const calls = add.mock.calls.filter(([e]) => e === "hardwareBackPress");
      expect(calls).toHaveLength(1);
      expect((calls[0]![1] as () => boolean)()).toBe(true);
      b.unmount();
    } finally {
      add.mockRestore();
      (useFocusEffect as jest.Mock).mockReset();
    }
  });
});
