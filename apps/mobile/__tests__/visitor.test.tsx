/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import * as fs from "fs";
import * as path from "path";
import * as React from "react";

import { ApiFailure } from "@/api/errors";
import { session } from "@/auth";
import { PinPad } from "@/auth/PinPad";
import { signInProblem, SignInScreen } from "@/screens/auth/sign-in";
import { WelcomeScreen } from "@/screens/visitor/welcome";
import { adaptHome, BUNDLED } from "@/visitor/home-data";
import { CHAPTERS, CLOSING, DIFFERENT, FACULTY, GET, HERO, JOIN, JOURNEY, PATIENTS, QUICK_ANSWERS, WEEK } from "@/visitor/content";
import { render } from "./utils";

// The shared stand-in for Reanimated, plus the few extra pieces the visitor screens use.
jest.mock("react-native-reanimated", () => {
  const RN = require("react-native");
  const anim = (): unknown => {
    const a: unknown = new Proxy(function () {}, { get: (_t, k) => (k === "then" ? undefined : () => a), apply: () => a });
    return a;
  };
  const Easing = { bezier: () => (t: number) => t, inOut: () => (t: number) => t, out: () => (t: number) => t, quad: (t: number) => t, linear: (t: number) => t };
  const Animated = { View: RN.View, Text: RN.Text, ScrollView: RN.ScrollView, createAnimatedComponent: (c: unknown) => c };
  const sv = (v: unknown) => {
    const s = { value: v, get: () => s.value, set: (n: unknown) => void (s.value = n) };
    return s;
  };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing,
    Extrapolation: { CLAMP: "clamp" },
    useSharedValue: sv,
    useDerivedValue: (fn: () => unknown) => sv(fn()),
    useAnimatedStyle: (fn: () => object) => fn(),
    useAnimatedProps: (fn: () => object) => fn(),
    useAnimatedReaction: () => undefined,
    useAnimatedScrollHandler: () => () => undefined,
    interpolate: (v: number, i: number[], o: number[]) => {
      const t = Math.min(1, Math.max(0, (v - i[0]!) / (i[i.length - 1]! - i[0]!)));
      return o[0]! + t * (o[o.length - 1]! - o[0]!);
    },
    interpolateColor: (_v: number, _i: number[], o: string[]) => o[0],
    withTiming: (v: unknown) => v,
    withSpring: (v: unknown) => v,
    withDelay: (_d: number, v: unknown) => v,
    withRepeat: (v: unknown) => v,
    withSequence: (...v: unknown[]) => v[v.length - 1],
    cancelAnimation: () => undefined,
    useReducedMotion: () => true,
    FadeIn: anim(),
    FadeOut: anim(),
    FadeInDown: anim(),
    FadeOutDown: anim(),
    FadeInUp: anim(),
    FadeOutUp: anim(),
    ZoomIn: anim(),
    ZoomOut: anim(),
    LinearTransition: anim(),
  };
});

jest.mock("expo-status-bar", () => ({ setStatusBarStyle: jest.fn(), StatusBar: () => null }));

describe("Welcome", () => {
  it("puts Sign in first and Request an invitation second, and tells the story", async () => {
    await render(<WelcomeScreen />);
    expect(screen.getByTestId("welcome-sign-in")).toBeTruthy();
    expect(screen.getByLabelText(HERO.lines.join(" "))).toBeTruthy();
    expect(screen.getByText(PATIENTS.accent)).toBeTruthy();
    expect(screen.getByText(DIFFERENT.rows[0]!.vibha)).toBeTruthy();
    expect(screen.getByText(JOURNEY.steps[0]!.title)).toBeTruthy();
    expect(screen.getByText(FACULTY.lead.name)).toBeTruthy();
    expect(screen.getByText(JOIN.steps[0]!.title)).toBeTruthy();
    expect(screen.getByText(CLOSING.b)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("welcome-sign-in"));
    expect(router.push).toHaveBeenCalledWith("/sign-in");
    await fireEvent.press(screen.getByTestId("welcome-request"));
    expect(router.push).toHaveBeenCalledWith("/request");
  });

  it("switches the week between weekday and weekend", async () => {
    await render(<WelcomeScreen />);
    expect(screen.getByText(WEEK.weekday.steps[0])).toBeTruthy();
    await fireEvent.press(screen.getByTestId("week-weekend"));
    expect(screen.getByText(WEEK.weekend.steps[0])).toBeTruthy();
  });

  it("never says which cohort is running", () => {
    const words = JSON.stringify({ HERO, QUICK_ANSWERS, PATIENTS, DIFFERENT, JOURNEY, GET, WEEK, FACULTY, JOIN, CLOSING, CHAPTERS });
    expect(words).not.toMatch(/cohort|december|2026/i);
    expect(words).not.toMatch(/[–—]/);
  });
});

describe("Welcome words from the website", () => {
  it("uses the server's words and keeps the app's drawings", () => {
    const w = adaptHome({ v: 1, hero: { title: ["A", "B", "C"], lede: "L", highlights: ["x", "y", "z"], quickAnswers: [] }, sections: { patients: { head: { tag: "t", title: "T", accent: "A" }, steps: [{ title: "One", text: "1" }] } } as never, contact: { phone: "1", phoneHref: "tel:1", whatsappHref: "w", address: ["Here,"] } });
    expect(w.HERO.lines).toEqual(["A", "B", "C"]);
    expect(w.QUICK_ANSWERS).toBe(BUNDLED.QUICK_ANSWERS);
    expect(w.PATIENTS.steps[0]).toEqual({ title: "One", text: "1", heads: BUNDLED.PATIENTS.steps[0]!.heads });
    expect(w.PATIENTS.sub).toBe(BUNDLED.PATIENTS.sub);
    expect(w.CLOSING.address).toBe("Here");
  });

  it("falls back to the bundled words when the answer is missing, wrong or mentions a cohort", () => {
    expect(adaptHome(undefined)).toBe(BUNDLED);
    expect(adaptHome({ v: 2 } as never)).toBe(BUNDLED);
    expect(adaptHome({ v: 1, hero: { title: ["Cohort Two", "b", "c"], lede: "", highlights: [], quickAnswers: [] }, sections: {} as never })).toBe(BUNDLED);
    expect(JSON.stringify(adaptHome({ v: 1, hero: { title: ["a \u2014 b", "b", "c"], lede: "", highlights: [], quickAnswers: [] }, sections: {} as never }))).not.toMatch(/\u2014/);
  });
});

describe("Visitor area", () => {
  it("has exactly three tabs: Welcome, Request, Sign in (no free tools)", () => {
    const dir = path.join(__dirname, "..", "app", "(visitor)");
    expect(fs.readdirSync(dir).sort()).toEqual(["_layout.tsx", "request.tsx", "sign-in.tsx", "welcome.tsx"]);
  });
});

describe("Sign in", () => {
  beforeAll(async () => {
    await session.boot();
  });

  it("says in plain words what to fix before trying", async () => {
    await render(<SignInScreen />);
    await fireEvent.press(screen.getByTestId("sign-in-submit"));
    expect(screen.getByText("Enter your email address.")).toBeTruthy();
    expect(screen.getByText("Enter your password.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("sign-in-email"), "asha");
    await fireEvent.press(screen.getByTestId("sign-in-submit"));
    expect(screen.getByText("That does not look like an email address.")).toBeTruthy();
  });

  it("shows a wrong password in plain words", async () => {
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByTestId("sign-in-email"), "ananya@example.com");
    await fireEvent.changeText(screen.getByTestId("sign-in-password"), "wrong");
    await fireEvent.press(screen.getByTestId("sign-in-submit"));
    await waitFor(() => expect(screen.getByTestId("sign-in-failure")).toBeTruthy());
  });

  it("turns server errors into plain words", () => {
    expect(signInProblem(new ApiFailure("invalid_credentials", "x", 401))).toMatch(/do not match/);
    expect(signInProblem(new ApiFailure("network", "x"))).toMatch(/No internet/);
    expect(signInProblem(new ApiFailure("rate_limited", "x", 429))).toMatch(/Too many tries/);
  });
});

describe("PIN pad", () => {
  it("still completes with the success and error colours", async () => {
    const done = jest.fn();
    function Pad({ tone }: { tone: "normal" | "error" | "success" }) {
      const [v, setV] = React.useState("");
      return <PinPad value={v} onChange={setV} onComplete={done} tone={tone} />;
    }
    await render(<Pad tone="success" />);
    for (const k of ["1", "9", "7", "3"]) await fireEvent.press(screen.getByTestId(`pin-key-${k}`));
    expect(done).toHaveBeenCalledWith("1973");
  });
});
