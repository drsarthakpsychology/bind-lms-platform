import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { keyFromReveal, stepFromPick } from "@/practise/player/adapt";
import { SAMPLE_CASES } from "@/practise/player/mock";
import { RichCaseScreen } from "@/practise/player/rich";
import { bestOf, HINT_CAP, scoreStep } from "@/practise/player/types";
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

describe("the rich case shape", () => {
  it("the sample carries everything a rewritten case will: blocks, 5 graded options with reasons, 3 hints, concept, errors", () => {
    for (const cs of SAMPLE_CASES) {
      expect(cs.context.length).toBeGreaterThanOrEqual(5);
      for (const st of cs.steps) {
        const k = cs.keys[st.id]!;
        expect(st.options.length).toBeGreaterThanOrEqual(4);
        expect(st.hints).toHaveLength(3);
        expect(bestOf(k)).toHaveLength(1);
        for (const o of st.options) expect(k.options[o.id]?.feedback).toBeTruthy();
        expect(k.explanation.concept).toBeTruthy();
        expect(k.explanation.commonErrors?.length).toBeGreaterThan(0);
        // Plain words for students: no dashes.
        expect(JSON.stringify(st)).not.toMatch(/[–—]/);
      }
    }
  });
  it("hints cap a step's score and a second try halves it", () => {
    const k = SAMPLE_CASES[0]!.keys.s1!;
    const ids = SAMPLE_CASES[0]!.steps[0]!.options.map((o) => o.id);
    expect(scoreStep(k, ["b"], ids, 0, 1)).toBe(1);
    // The first hint is free.
    expect(scoreStep(k, ["b"], ids, 1, 1)).toBe(1);
    expect(scoreStep(k, ["b"], ids, 2, 1)).toBe(HINT_CAP[2]);
    expect(scoreStep(k, ["b"], ids, 0, 2)).toBe(0.5);
    expect(scoreStep(k, ["a"], ids, 0, 1)).toBeLessThan(0.5);
  });
  it("old pick-one steps fit the shape: the right one is best, a graded pick keeps its consequence", () => {
    const st = stepFromPick("x", "What do you say?", ["One", "Two", "Three"]);
    expect(st.options.map((o) => o.id)).toEqual(["0", "1", "2"]);
    const k = keyFromReveal(["One", "Two", "Three"], { score: 0, verdict: "harm", right: [0], why: "He is hurt.", notes: null, more: "Section 5" }, 2, "The law");
    expect(k.options["0"]!.grade).toBe("best");
    expect(k.options["2"]!.grade).toBe("harmful");
    expect(k.options["2"]!.consequence).toBe("He is hurt.");
    expect(k.explanation.more).toEqual({ label: "The law", text: "Section 5" });
  });
});

describe("the case player", () => {
  it("choose, Check, a wrong pick gets one more try, then the full feedback", async () => {
    await render(<RichCaseScreen />);
    await waitFor(() => expect(screen.getByTestId("case")).toBeTruthy());
    expect(screen.getByTestId("player-check").props.accessibilityState?.disabled ?? true).toBeTruthy();
    // A hint, one at a time.
    await press("hint-button");
    await waitFor(() => expect(screen.getByTestId("hint-1")).toBeTruthy());
    await press("hint-more");
    await waitFor(() => expect(screen.getByTestId("hint-2")).toBeTruthy());
    // Wrong first.
    await press("player-option-0");
    await press("player-check");
    await waitFor(() => expect(screen.getByText("Not quite")).toBeTruthy());
    await press("player-retry");
    // Then right.
    await press("player-option-1");
    await press("player-check");
    await waitFor(() => expect(screen.getByTestId("verdict")).toBeTruthy());
    await press("player-why");
    await waitFor(() => expect(screen.getByTestId("player-feedback")).toBeTruthy());
    for (const t of ["Why this is right", "The concept", "The clinical point", "Common errors"]) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.getAllByText("Correct answer").length).toBe(1);
    // Next step: new information arrives first.
    await press("player-next");
    await waitFor(() => expect(screen.getByTestId("case-new")).toBeTruthy());
    await press("player-option-0");
    await press("player-check");
    await press("player-next");
    await waitFor(() => expect(screen.getByTestId("game-over")).toBeTruthy());
    await act(async () => undefined);
    expect(screen.getByText("Your calls")).toBeTruthy();
  });
});
