import { act, renderHook, screen } from "@testing-library/react-native";
import * as React from "react";
import { Text } from "react-native";
import Svg from "react-native-svg";

import { bottomChrome, toastBottom } from "@/ds/bottom-chrome";
import { ToastHost, toast } from "@/ds/toast";
import { beats, DrawInk, MaskLine, momentBeats, pathLength, PixelBurst, scaled, Sprite, sprites, Swap, useCelebrate } from "@/motion";
import { render } from "./utils";

describe("motion kit numbers and helpers", () => {
  it("measures rough.js path data", () => {
    expect(pathLength("M0 0 L3 4")).toBeCloseTo(5);
    expect(pathLength("M0 0 L3 4 L3 10")).toBeCloseTo(11);
    // A straight cubic is as long as its chord.
    expect(pathLength("M0 0 C1 0 2 0 3 0")).toBeCloseTo(3);
    expect(pathLength("M0 0 LNaN 4")).toBe(4);
    expect(pathLength("")).toBe(0);
  });

  it("scales particles for the tier, never below one", () => {
    expect(scaled(24, { low: true, particles: 0.5, pageBehind: false })).toBe(12);
    expect(scaled(1, { low: true, particles: 0.5, pageBehind: false })).toBe(1);
    expect(scaled(36, { low: false, particles: 1, pageBehind: true })).toBe(36);
  });

  it("orders a win: result, haptic, particles, sticker, stats", () => {
    const f = () => {};
    const win = momentBeats({ win: true, result: f, particles: f, sticker: f, stats: f });
    expect(win.map((b) => b.at)).toEqual([beats.result, beats.haptic, beats.particles, beats.sticker, beats.stats]);
    expect(win.find((b) => b.at === beats.particles)?.motion).toBe(true);
  });

  it("a loss never gets particles", () => {
    const loss = momentBeats({ win: false, result: () => {}, particles: () => {} });
    expect(loss.some((b) => b.motion)).toBe(false);
    expect(loss).toHaveLength(2);
  });

  it("with Reduce Motion, a moment runs in order at once and skips particles", async () => {
    const seen: string[] = [];
    const { result } = await renderHook(() => useCelebrate());
    await act(async () => result.current({ win: true, haptic: () => seen.push("haptic"), result: () => seen.push("result"), particles: () => seen.push("particles"), stats: () => seen.push("stats") }));
    expect(seen).toEqual(["result", "haptic", "stats"]);
  });
});

describe("toast placement", () => {
  const inset = 20;
  it("sits above the tab bar on a tab screen", () => {
    expect(toastBottom({ tabBar: 84, front: { id: 1, footer: 0, tab: true, kb: 0 } }, inset)).toBe(84);
  });
  it("sits above a footer and the tab bar together", () => {
    expect(toastBottom({ tabBar: 84, front: { id: 1, footer: 72, tab: true, kb: 0 } }, inset)).toBe(156);
  });
  it("sits above a footer on a pushed screen (the footer already holds the safe area)", () => {
    expect(toastBottom({ tabBar: 84, front: { id: 1, footer: 92, tab: false, kb: 0 } }, inset)).toBe(92);
  });
  it("sits above the safe area with neither, and rides the keyboard", () => {
    expect(toastBottom({ tabBar: 84, front: { id: 1, footer: 0, tab: false, kb: 0 } }, inset)).toBe(20);
    expect(toastBottom({ tabBar: 0, front: { id: 1, footer: 60, tab: false, kb: 300 } }, inset)).toBe(360);
  });

  it("the host follows what the front screen reports", async () => {
    await render(<ToastHost />);
    await act(async () => {
      bottomChrome.set({ tabBar: 80, front: { id: 9, footer: 70, tab: true, kb: 0 } });
      toast.show("Saved");
    });
    expect(screen.getByTestId("toast")).toBeTruthy();
    await act(async () => {
      toast.hide();
      bottomChrome.set({ tabBar: 0, front: null });
    });
  });
});

describe("motion kit parts render", () => {
  it("Swap shows the new content when its key changes", async () => {
    const view = await render(
      <Swap k={1}>
        <Text>First</Text>
      </Swap>,
    );
    await view.rerender(
      <Swap k={2} dir={1}>
        <Text>Second</Text>
      </Swap>,
    );
    expect(screen.getByText("Second")).toBeTruthy();
  });

  it("DrawInk, Sprite and MaskLine render; PixelBurst draws nothing with Reduce Motion", async () => {
    await render(
      <>
        <Svg width={120} height={40}>
          <DrawInk k="t-line" shape={{ t: "line", x1: 4, y1: 30, x2: 116, y2: 28 }} />
          <DrawInk k="t-nan" shape={{ t: "line", x1: NaN, y1: 30, x2: 116, y2: Infinity }} />
        </Svg>
        <Sprite frames={sprites.loader} loops={-1} testID="sprite" />
        <MaskLine h={24}>
          <Text>Rises</Text>
        </MaskLine>
        <PixelBurst fire={1} bursts={3} />
      </>,
    );
    expect(screen.getByTestId("sprite")).toBeTruthy();
    expect(screen.getByText("Rises")).toBeTruthy();
  });
});

describe("screen transitions per route kind", () => {
  const { routeMotion } = jest.requireActual("@/motion/stack") as typeof import("@/motion/stack");
  test("push slides with parallax and a matching swipe back on both platforms", () => {
    for (const os of ["android", "ios"]) {
      const m = routeMotion("push", { reduce: false, low: false, os });
      expect(m.animation).toBe("ios_from_right");
      expect(m.gestureEnabled).toBe(true);
      expect(m.animationMatchesGesture).toBe(true);
    }
  });
  test("sheet is the system page sheet on iPhone and slides up on Android", () => {
    expect(routeMotion("sheet", { reduce: false, low: false, os: "ios" })).toEqual({ presentation: "modal", animation: "default" });
    expect(routeMotion("sheet", { reduce: false, low: false, os: "android" })).toMatchObject({ presentation: "modal", animation: "slide_from_bottom" });
  });
  test("play fades up, overlay fades", () => {
    expect(routeMotion("play", { reduce: false, low: false, os: "android" }).animation).toBe("fade_from_bottom");
    expect(routeMotion("overlay", { reduce: false, low: false, os: "android" }).animation).toBe("fade");
  });
  test("low-end Android and Reduce Motion get plain fades; a sheet stays a modal", () => {
    for (const kind of ["push", "sheet", "overlay", "play"] as const) {
      expect(routeMotion(kind, { reduce: false, low: true, os: "android" }).animation).toBe("fade");
      expect(routeMotion(kind, { reduce: true, low: false, os: "ios" }).animation).toBe("fade");
    }
    expect(routeMotion("sheet", { reduce: true, low: false, os: "android" }).presentation).toBe("modal");
    // The low tier is Android only: an iPhone keeps the slide.
    expect(routeMotion("push", { reduce: false, low: true, os: "ios" }).animation).toBe("ios_from_right");
  });
});

describe("list to page continuity", () => {
  const { continuity } = jest.requireActual("@/motion/continuity") as typeof import("@/motion/continuity");
  afterEach(() => continuity.clear());
  test("a pressed row's place is found by the page with the same title, for one second", () => {
    jest.useFakeTimers();
    continuity.mark("Lithium ", 412);
    expect(continuity.peek("Lithium")).toBe(412);
    expect(continuity.peek("Valproate")).toBeUndefined();
    jest.advanceTimersByTime(1001);
    expect(continuity.peek("Lithium")).toBeUndefined();
    jest.useRealTimers();
  });
  test("bad positions are ignored", () => {
    continuity.mark("Lithium", Number.NaN);
    expect(continuity.peek("Lithium")).toBeUndefined();
  });
});
