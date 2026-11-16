import { screen } from "@testing-library/react-native";
import * as React from "react";
import { StyleSheet, Text } from "react-native";

import { FlowGap, Reveal } from "@/motion";
import { render } from "./utils";

/** The gap of the nearest view above this text that sets one. */
function gapAbove(text: string): unknown {
  let n = screen.getByText(text).parent;
  while (n) {
    const g = StyleSheet.flatten(n.props.style)?.gap;
    if (g !== undefined) return g;
    n = n.parent;
  }
  return undefined;
}

describe("loaded content keeps the column's gap", () => {
  it("Reveal spaces its parts like the screen around it (they touched before)", async () => {
    await render(
      <FlowGap.Provider value={24}>
        <Reveal>
          <Text>One</Text>
          <Text>Two</Text>
        </Reveal>
      </FlowGap.Provider>,
    );
    expect(gapAbove("One")).toBe(24);
  });

  it("Reveal outside a column adds no gap", async () => {
    await render(
      <Reveal>
        <Text>Alone</Text>
      </Reveal>,
    );
    expect(gapAbove("Alone")).toBeUndefined();
  });
});
