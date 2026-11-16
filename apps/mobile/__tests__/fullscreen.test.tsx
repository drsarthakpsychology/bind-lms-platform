import { act, fireEvent, screen } from "@testing-library/react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { BackHandler, Dimensions } from "react-native";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { updateSettings } from "@/lib/settings";
import { FULL_START, fullReducer, type FullEvent, type FullState } from "@/lecture/fullscreen";
import { ProtectedPlayer } from "@/lecture/player";
import { LectureScreen } from "@/screens/lecture/lecture";
import { render } from "./utils";

jest.setTimeout(20000);

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});

beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
  updateSettings({ textSize: "normal", lineSpacing: "normal" });
});

const run = (...events: FullEvent[]): FullState => events.reduce(fullReducer, FULL_START);
const btn: FullEvent = { type: "button" };
const back: FullEvent = { type: "back" };
const win = (landscape: boolean): FullEvent => ({ type: "window", landscape });
const tilt = (landscape: boolean): FullEvent => ({ type: "tilt", landscape });

describe("full screen state", () => {
  it("the button turns the screen on its side, and the upright frame right after does not undo it", () => {
    const s = run(tilt(false), btn, win(false));
    expect(s).toMatchObject({ full: true, lock: "landscape" });
    expect(run(tilt(false), btn, win(false), win(true))).toMatchObject({ full: true, lock: "landscape", wide: true });
  });

  it("button in, then the button out with the phone still on its side: stays upright, no bounce back in", () => {
    let s = run(tilt(false), btn, win(true), tilt(true), btn);
    expect(s).toMatchObject({ full: false, lock: "portrait" });
    // The screen turns upright, then (still held sideways) nothing turns it back.
    s = fullReducer(s, win(false));
    s = fullReducer(s, win(true));
    expect(s.full).toBe(false);
    // Once the phone is held upright, turning is allowed again.
    s = fullReducer(s, tilt(false));
    expect(s).toMatchObject({ full: false, lock: "free" });
  });

  it("button out while the phone is upright: turning is allowed again at once", () => {
    expect(run(tilt(false), btn, win(true), btn)).toMatchObject({ full: false, lock: "free" });
  });

  it("button in, phone turned on its side and back upright: leaves full screen (works with auto-rotate off)", () => {
    const s = run(tilt(false), btn, win(true), tilt(true), tilt(false));
    expect(s).toMatchObject({ full: false, lock: "free" });
  });

  it("button in while held upright and never turned: stays in full screen", () => {
    expect(run(tilt(false), btn, win(true), tilt(false))).toMatchObject({ full: true, lock: "landscape" });
  });

  it("turning the phone on its side enters full screen; upright again leaves it", () => {
    let s = run(tilt(true), win(true));
    expect(s).toMatchObject({ full: true, lock: "free" });
    s = fullReducer(s, tilt(false));
    expect(s.full).toBe(true);
    s = fullReducer(s, win(false));
    expect(s).toMatchObject({ full: false, lock: "free" });
  });

  it("Back leaves full screen first, and does nothing to the state outside it", () => {
    expect(run(win(true), back)).toMatchObject({ full: false, lock: "portrait" });
    expect(run(back)).toEqual(FULL_START);
  });

  it("without the tilt sensor, leaving with the button holds upright (no loop) until the button is pressed again", () => {
    let s = run(btn, win(true), btn);
    expect(s).toMatchObject({ full: false, lock: "portrait" });
    s = fullReducer(s, win(false));
    expect(s.full).toBe(false);
    s = fullReducer(s, btn);
    expect(s).toMatchObject({ full: true, lock: "landscape" });
  });
});

describe("full screen on the lecture screen", () => {
  const portrait = { width: 400, height: 860, scale: 2, fontScale: 1 };
  const landscape = { width: 860, height: 400, scale: 2, fontScale: 1 };
  const turn = async (w: typeof portrait) => {
    await act(async () => Dimensions.set({ window: w, screen: w }));
  };
  type Back = Parameters<typeof BackHandler.addEventListener>[1];
  let backs: Back[] = [];

  beforeEach(() => {
    mock.reset();
    backs = [];
    jest.spyOn(BackHandler, "addEventListener").mockImplementation((_e, fn) => {
      backs.push(fn);
      return { remove: () => (backs = backs.filter((x) => x !== fn)) };
    });
    (ScreenOrientation.lockAsync as jest.Mock).mockClear();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ lessonId: "l5" });
  });
  afterEach(async () => {
    await turn(portrait);
    jest.restoreAllMocks();
  });

  it("the button fills the screen: the header and the notes go, the same player stays, Back leaves first", async () => {
    await turn(portrait);
    await render(<LectureScreen />);
    const full = await screen.findByTestId("player-full");
    const player = screen.getByTestId("player");
    await fireEvent.press(full);
    expect(ScreenOrientation.lockAsync).toHaveBeenLastCalledWith(ScreenOrientation.OrientationLock.LANDSCAPE);
    expect(screen.getByTestId("player")).toBe(player);
    expect(screen.getByLabelText("Leave full screen")).toBeTruthy();
    expect(screen.getByTestId("watermark", { includeHiddenElements: true })).toBeTruthy();
    const flat = (id: string) => Object.assign({}, ...[screen.getByTestId(id).props.style].flat(3).filter(Boolean)) as { flex?: number; aspectRatio?: number };
    expect(flat("player")).toMatchObject({ flex: 1 });
    expect(flat("player").aspectRatio).toBeUndefined();
    // Back leaves full screen, not the lecture.
    expect(backs.length).toBeGreaterThan(0);
    let used: boolean | null | undefined;
    await act(async () => {
      used = (backs[backs.length - 1] as () => boolean | null | undefined)();
    });
    expect(used).toBe(true);
    expect(screen.getByLabelText("Full screen")).toBeTruthy();
    expect(screen.getByTestId("player")).toBe(player);
  });

  it("turning the phone on its side enters full screen and upright leaves it", async () => {
    await turn(portrait);
    await render(<LectureScreen />);
    await screen.findByTestId("player-full");
    await turn(landscape);
    expect(screen.getByLabelText("Leave full screen")).toBeTruthy();
    await turn(portrait);
    expect(screen.getByLabelText("Full screen")).toBeTruthy();
  });
});

describe("player in full screen", () => {

  function Host() {
    const [full, setFull] = React.useState(false);
    return <ProtectedPlayer lessonId="l5" compromised={false} full={full} onFull={() => setFull((f) => !f)} />;
  }
  beforeEach(() => mock.reset());
  const shownTime = () => screen.getAllByText(/^\d+:\d\d$/)[0]!.props.children as string;
  const secs = (t: string) => t.split(":").reduce((acc, x) => acc * 60 + Number(x), 0);

  // Real time (the stand-in player ticks once a second): fake timers and async presses wait on each other.
  const wait = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

  it("keeps playing from the same place when full screen changes (no remount)", async () => {
    await render(<Host />);
    await fireEvent.press(await screen.findByLabelText("Play"));
    await wait(2200);
    const before = secs(shownTime());
    const at = screen.getByTestId("player");
    // The controls fade after 3 s of playing: show them again if they went.
    if (!screen.queryByTestId("player-full")) await fireEvent.press(screen.getByTestId("player-surface"));
    await fireEvent.press(screen.getByTestId("player-full"));
    expect(screen.getByTestId("player")).toBe(at);
    expect(screen.getByLabelText("Leave full screen")).toBeTruthy();
    await wait(2200);
    if (!screen.queryByLabelText("Pause")) await fireEvent.press(screen.getByTestId("player-surface"));
    // Playing on from where it was, with the controls and the watermark on top.
    expect(screen.getByLabelText("Pause")).toBeTruthy();
    expect(secs(shownTime())).toBeGreaterThanOrEqual(before + 2);
    expect(screen.getByLabelText("Back 10 seconds")).toBeTruthy();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeTruthy();
    expect(screen.getByTestId("player-speed")).toBeTruthy();
    expect(screen.getByTestId("watermark", { includeHiddenElements: true })).toBeTruthy();
  });
});
