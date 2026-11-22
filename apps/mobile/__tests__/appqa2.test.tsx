/**
 * Bugs found in the second app check (with Practise), one test each.
 */
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { AppState, BackHandler, Text } from "react-native";

import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { day, followUpLine } from "@/admin/format";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { ToolCaseScreen } from "@/practise/cases/tool";
import { GameFrame } from "@/practise/frame";
import { EscapeGame, mmss } from "@/practise/games/escape";
import { JoinBox } from "@/practise/games/team";
import * as R from "@/practise/mock/routes";
import { shopState } from "@/practise/mock/routes";
import { MocksScreen } from "@/practise/prep/mock";
import { ShopScreen } from "@/practise/shop";
import { SearchScreen } from "@/search/screen";
import { AskScreen } from "@/screens/doubts/ask";
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
      await a.unmount();
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
      await b.unmount();
    } finally {
      add.mockRestore();
      (useFocusEffect as jest.Mock).mockReset();
    }
  });
});

describe("dates the phone cannot read", () => {
  it("show nothing, not 'NaN d ago' or 'Invalid Date'", () => {
    expect(followUpLine("soon")).toBeNull();
    expect(followUpLine(null)).toBeNull();
    expect(followUpLine("2026-11-16T10:00:00Z", Date.parse("2026-11-16T10:00:00Z"))).toBe("Follow up today");
    expect(day("not a date", true)).toBe("");
    // Escape Room team time with an unreadable finish date.
    expect(mmss(Date.parse("later") - 1000)).toBe("0:00");
    expect(mmss(247_000)).toBe("4:07");
  });
});

describe("mock tests", () => {
  beforeAll(async () => {
    await session.boot();
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
  });
  beforeEach(() => mock.reset());
  it("do not count questions or sections (owner rule: small counts)", async () => {
    await render(<MocksScreen />);
    await waitFor(() => expect(screen.getByText("Full psychology mock")).toBeTruthy());
    expect(screen.queryAllByText(/\d+ questions/)).toHaveLength(0);
    expect(screen.queryAllByText(/\d+ sections/)).toHaveLength(0);
    expect(screen.queryAllByText(/\(\d+\)/)).toHaveLength(0);
    expect(screen.getAllByText(/minutes/).length).toBeGreaterThan(0);
  });

  it("XP shop: after a buy, the server's next answer wins (pull to refresh kept the phone's old balance for ever)", async () => {
    await render(<ShopScreen />);
    await waitFor(() => expect(screen.getByTestId("shop-balance")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("shop-buy-title-blue"));
    await waitFor(() => expect(screen.getByText("Leaves 220 XP")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("shop-spend"));
    await waitFor(() => expect(screen.getByTestId("shop-wear-title-blue")).toBeTruthy());
    // XP earned in a game meanwhile; the student pulls to refresh.
    shopState.balance = 900;
    await act(async () => {
      const host = screen.container.queryAll((n) => typeof n.props.onRefresh === "function" || !!n.props.refreshControl)[0]!;
      (host.props.onRefresh ?? host.props.refreshControl.props.onRefresh)();
    });
    await waitFor(() => expect(JSON.stringify(screen.getByTestId("shop-balance").props)).toMatch(/900/));
  });

  it("XP shop: a student with no streak yet is not told 'STREAK LOST'", async () => {
    const real = R.shop();
    const spy = jest.spyOn(R, "shop").mockReturnValue({ ...real, streak: { count: 0, alive: false } });
    try {
      await render(<ShopScreen />);
      await waitFor(() => expect(screen.getByTestId("shop-balance")).toBeTruthy());
      expect(screen.queryByText("STREAK LOST")).toBeNull();
      expect(screen.queryByText("0 days")).toBeNull();
      expect(screen.getByText("Start today")).toBeTruthy();
    } finally {
      spy.mockRestore();
    }
  });
});

describe("MSE Level 4 clock", () => {
  it("counts the time the app was in the background (phone timers stop there, so switching apps paused it)", async () => {
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
    mock.reset();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ item: "mse4-sandeep" });
    const handlers: ((s: string) => void)[] = [];
    const sub = jest.spyOn(AppState, "addEventListener").mockImplementation(((_: string, h: (s: string) => void) => {
      handlers.push(h);
      return { remove: () => undefined };
    }) as never);
    const real = Date.now();
    const now = jest.spyOn(Date, "now").mockReturnValue(real);
    try {
      await render(<ToolCaseScreen tool="mse-trainer" />);
      await waitFor(() => expect(screen.getByTestId("tool-mse-appearance")).toBeTruthy());
      expect(screen.getByText("10:00")).toBeTruthy();
      now.mockReturnValue(real + 9 * 60_000 + 30_000);
      await act(async () => handlers.forEach((h) => h("active")));
      expect(screen.getByText("0:30")).toBeTruthy();
    } finally {
      now.mockRestore();
      sub.mockRestore();
      (useLocalSearchParams as jest.Mock).mockReturnValue({});
    }
  });
});

describe("Escape Room", () => {
  it("says the rooms did not load instead of a start screen with nothing to play", async () => {
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
    mock.reset();
    mock.setScenario("error");
    try {
      await render(<EscapeGame />);
      await waitFor(() => expect(screen.getByTestId("load-error")).toBeTruthy(), { timeout: 4000 });
      expect(screen.queryByTestId("escape-start")).toBeNull();
    } finally {
      mock.reset();
    }
  });
});

describe("search", () => {
  const params = useLocalSearchParams as jest.Mock;
  afterEach(() => params.mockReturnValue({}));
  it("starts with the words a link brought (?q= was ignored)", async () => {
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
    params.mockReturnValue({ q: "psychosis" });
    await render(<SearchScreen />);
    expect(screen.getByTestId("search-input").props.value).toBe("psychosis");
    await waitFor(() => expect(screen.getByText("Psychosis")).toBeTruthy());
  });
  it("does not offer Study modules to a lecture-only account (they opened a closed screen)", async () => {
    await session.signIn("lectures@example.com", "pw");
    await session.choosePin("2580");
    mock.reset();
    params.mockReturnValue({ q: "psychosis" });
    await render(<SearchScreen />);
    await waitFor(() => expect(screen.getByTestId("search-empty")).toBeTruthy());
    expect(screen.queryByText("Psychosis")).toBeNull();
    expect(mock.log().some((l) => l.path.startsWith("/study/modules"))).toBe(false);
  });
});

describe("forms", () => {
  it("stop at the server's own length limits (a long paste was refused with a vague error)", async () => {
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
    await render(<AskScreen />);
    expect(screen.getByTestId("ask-topic").props.maxLength).toBe(120);
  });
});

describe("team join box", () => {
  it("joins once when the keyboard's Go and the Join button both fire", async () => {
    let done: (v: string | null) => void = () => undefined;
    const onJoin = jest.fn(() => new Promise<string | null>((r) => (done = r)));
    await render(<JoinBox onJoin={onJoin} label="Code" />);
    await fireEvent.changeText(screen.getByTestId("team-join-code"), "k7rq2");
    const field = screen.getByTestId("team-join-code");
    const button = screen.getByTestId("team-join");
    await Promise.all([fireEvent(field, "submitEditing"), fireEvent.press(button)]);
    expect(onJoin).toHaveBeenCalledTimes(1);
    expect(onJoin).toHaveBeenCalledWith("K7RQ2");
    await act(async () => done(null));
  });
});
