import { act, renderHook, screen } from "@testing-library/react-native";
import { Keyboard } from "react-native";
import * as React from "react";

import { glue, T } from "@/ds";
import { useKeyboardPad } from "@/ds/keyboard-pad";
import { render } from "./utils";

describe("meta lines never start a line with a dot", () => {
  it("glues the dot to the word before it", () => {
    expect(glue("Ananya · You · 2 answers")).toBe("Ananya · You · 2 answers");
    expect(glue(["Ananya", " · ", "2"])).toEqual(["Ananya", " · ", "2"]);
    expect(glue("No dot here")).toBe("No dot here");
  });
  it("still finds the text by its plain words", async () => {
    await render(
      <T>
        {"Rohan"} · {"3 h ago"}
      </T>,
    );
    expect(screen.getByText("Rohan · 3 h ago")).toBeTruthy();
  });
});

describe("the keyboard never covers a screen's bottom", () => {
  it("pads by how much of the view the keyboard covers, and drops it when the keyboard closes", async () => {
    const handlers: Record<string, (e: unknown) => void> = {};
    const spy = jest.spyOn(Keyboard, "addListener").mockImplementation(((name: string, fn: (e: unknown) => void) => {
      handlers[name] = fn;
      return { remove: () => undefined } as never;
    }) as never);
    const { result } = await renderHook(() => useKeyboardPad());
    // The view reaches y=844 on the screen; the keyboard top is at 544.
    (result.current.ref as { current: unknown }).current = { measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => cb(0, 100, 390, 744) };
    const show = handlers.keyboardWillShow ?? handlers.keyboardDidShow;
    await act(async () => show?.({ endCoordinates: { screenY: 544, height: 300 } }));
    expect(result.current.pad).toBe(300);
    const hide = handlers.keyboardWillHide ?? handlers.keyboardDidHide;
    await act(async () => hide?.({}));
    expect(result.current.pad).toBe(0);
    spy.mockRestore();
  });
});
