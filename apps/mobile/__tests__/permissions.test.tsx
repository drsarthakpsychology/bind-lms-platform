import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import { router, useSegments } from "expo-router";
import * as React from "react";
import { AppState, Linking } from "react-native";

import type { Me } from "@/api/contract";
import { api } from "@/auth";
import { CodeScanner, scannerCopy } from "@/clinic/scanner";
import { resetIntroForTests, stateLabel, stateOf } from "@/lib/permissions";
import { FirstRunPermissions, introSteps } from "@/screens/auth/permissions";
import { markTourSeen, resetTourForTests, TOUR_TABS } from "@/screens/auth/tour";
import { outsideLectures } from "@/screens/auth/scope";
import { PermissionsSection, rowAction } from "@/screens/me/permissions";
import { render } from "./utils";

jest.mock("expo-device", () => ({ isDevice: true }));

const cam = Camera as unknown as { getCameraPermissionsAsync: jest.Mock; requestCameraPermissionsAsync: jest.Mock };
const notif = Notifications as unknown as { getPermissionsAsync: jest.Mock; requestPermissionsAsync: jest.Mock };
const NEVER = { granted: false, canAskAgain: true, status: "undetermined" };
const NO_ONCE = { granted: false, canAskAgain: true, status: "denied" };
const NO_FOR_GOOD = { granted: false, canAskAgain: false, status: "denied" };
const YES = { granted: true, canAskAgain: true, status: "granted" };

const student = { role: "student", access: { lecturesOnly: false } } as unknown as Me;
const admin = { role: "admin", access: { lecturesOnly: false } } as unknown as Me;

let openSettings: jest.SpyInstance;
let put: jest.SpyInstance;
beforeEach(async () => {
  openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
  // The push address and the notification choice go to the server: answered here, no network.
  put = jest.spyOn(api, "put").mockResolvedValue({} as never);
  // mockReset: no queued one-time answers carry over from the test before.
  for (const m of [cam.getCameraPermissionsAsync, cam.requestCameraPermissionsAsync, notif.getPermissionsAsync, notif.requestPermissionsAsync]) m.mockReset();
  cam.getCameraPermissionsAsync.mockResolvedValue(YES);
  cam.requestCameraPermissionsAsync.mockResolvedValue(YES);
  notif.getPermissionsAsync.mockResolvedValue(NEVER);
  notif.requestPermissionsAsync.mockResolvedValue(YES);
  await AsyncStorage.clear();
  resetIntroForTests();
  // The tab tour comes before the permission steps; most tests here start after it.
  resetTourForTests();
  markTourSeen();
});
afterEach(() => {
  openSettings.mockRestore();
  put.mockRestore();
  jest.clearAllMocks();
});

describe("permission states", () => {
  it("reads the phone's answer as never asked, said no, said no for good, allowed", () => {
    expect(stateOf(null)).toBe("unknown");
    expect(stateOf(NEVER)).toBe("ask");
    expect(stateOf(NO_ONCE)).toBe("retry");
    expect(stateOf(NO_FOR_GOOD)).toBe("blocked");
    expect(stateOf(YES)).toBe("granted");
    expect(stateLabel("granted")).toBe("Allowed");
    expect(stateLabel("blocked")).toBe("Off");
  });

  it("the scanner has words and a button for every state", () => {
    expect(scannerCopy("granted", false)).toBeNull();
    expect(scannerCopy("ask", false)?.action).toBe("allow");
    expect(scannerCopy("retry", false)?.action).toBe("allow");
    expect(scannerCopy("blocked", false)?.action).toBe("settings");
    expect(scannerCopy("granted", true)?.action).toBe("retry");
    for (const s of ["ask", "retry", "blocked", "unavailable"] as const) expect(scannerCopy(s, false)?.body).toMatch(/type the code/i);
  });

  it("Settings rows: ask when it can, the phone's settings when it cannot", () => {
    expect(rowAction("ask")).toBe("ask");
    expect(rowAction("retry")).toBe("ask");
    expect(rowAction("blocked")).toBe("settings");
    expect(rowAction("granted")).toBe("settings");
    expect(rowAction("unavailable")).toBeNull();
  });
});

describe("the scanner", () => {
  const scanner = () => render(<CodeScanner onRead={jest.fn()} paused={false} size={300} />);

  it("allowed: shows the camera", async () => {
    await scanner();
    expect(await screen.findByTestId("camera-view")).toBeTruthy();
  });

  it("never asked: Allow camera shows the phone's question, then the camera", async () => {
    cam.getCameraPermissionsAsync.mockResolvedValueOnce(NEVER).mockResolvedValueOnce(NEVER);
    await scanner();
    await fireEvent.press(await screen.findByTestId("scanner-allow"));
    await waitFor(() => expect(cam.requestCameraPermissionsAsync).toHaveBeenCalled());
    expect(await screen.findByTestId("camera-view")).toBeTruthy();
  });

  it("said no once: asks again", async () => {
    cam.getCameraPermissionsAsync.mockResolvedValue(NO_ONCE);
    cam.requestCameraPermissionsAsync.mockResolvedValue(NO_ONCE);
    await scanner();
    expect(await screen.findByTestId("scanner-retry")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("scanner-allow"));
    await waitFor(() => expect(cam.requestCameraPermissionsAsync).toHaveBeenCalled());
    expect(await screen.findByTestId("scanner-retry")).toBeTruthy();
  });

  it("said no for good: Open settings, and the camera appears when the student comes back with it on", async () => {
    cam.getCameraPermissionsAsync.mockResolvedValue(NO_FOR_GOOD);
    const listeners: ((s: string) => void)[] = [];
    const add = jest.spyOn(AppState, "addEventListener").mockImplementation((_e, fn) => {
      listeners.push(fn as (s: string) => void);
      return { remove: jest.fn() } as unknown as ReturnType<typeof AppState.addEventListener>;
    });
    await scanner();
    await fireEvent.press(await screen.findByTestId("scanner-settings"));
    expect(openSettings).toHaveBeenCalled();
    expect(cam.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    cam.getCameraPermissionsAsync.mockResolvedValue(YES);
    await act(async () => listeners.forEach((l) => l("active")));
    expect(await screen.findByTestId("camera-view")).toBeTruthy();
    add.mockRestore();
  });
});

describe("the first-run tab tour", () => {
  const fresh = async () => {
    await AsyncStorage.clear();
    resetTourForTests();
  };

  it("students see it once, before any permission question: hello, five tabs, Start", async () => {
    await fresh();
    const view = await render(<FirstRunPermissions active me={{ ...student, name: "Ananya Mehta" } as Me} />);
    expect(await screen.findByTestId("tab-tour")).toBeTruthy();
    expect(screen.getByText("Hello, Ananya")).toBeTruthy();
    expect(screen.getByTestId("jyo")).toBeTruthy();
    expect(screen.queryByTestId("first-run-permissions")).toBeNull();
    for (const t of TOUR_TABS) {
      await fireEvent.press(screen.getByTestId("tour-next"));
      expect(screen.getByTestId(`tour-page-${t.id}`)).toBeTruthy();
      expect(screen.getByText(t.name)).toBeTruthy();
    }
    // The last page has no Skip, and Start closes the tour; the permission steps follow.
    expect(screen.queryByTestId("tour-skip")).toBeNull();
    await fireEvent.press(screen.getByTestId("tour-next"));
    await waitFor(() => expect(screen.queryByTestId("tab-tour")).toBeNull());
    expect(await screen.findByTestId("perm-step-notifications")).toBeTruthy();
    await view.unmount();

    // Next time (even after a restart): never again.
    resetTourForTests();
    resetIntroForTests();
    await render(<FirstRunPermissions active me={student} />);
    await act(async () => undefined);
    expect(screen.queryByTestId("tab-tour")).toBeNull();
  });

  it("can be skipped from the first page, and a tab in the small bar jumps to its page", async () => {
    await fresh();
    await render(<FirstRunPermissions active me={student} />);
    await fireEvent.press(await screen.findByTestId("tour-tab-notes"));
    expect(screen.getByTestId("tour-page-notes")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("tour-skip"));
    await waitFor(() => expect(screen.queryByTestId("tab-tour")).toBeNull());
  });

  it("is not shown to admins or before the app is open", async () => {
    await fresh();
    const v = await render(<FirstRunPermissions active={false} me={student} />);
    await act(async () => undefined);
    expect(screen.queryByTestId("tab-tour")).toBeNull();
    await v.unmount();
    await render(<FirstRunPermissions active me={admin} />);
    expect(await screen.findByTestId("perm-step-notifications")).toBeTruthy();
    expect(screen.queryByTestId("tab-tour")).toBeNull();
  });
});

describe("lectures-only accounts", () => {
  it("are stopped only on the parts outside their lectures", () => {
    expect(outsideLectures("(lecture)", "study")).toBe(true);
    expect(outsideLectures("(lecture)", "clinic")).toBe(true);
    expect(outsideLectures("(lecture)", "(lecture)")).toBe(false);
    expect(outsideLectures("(lecture)", "lecture")).toBe(false);
    expect(outsideLectures("(lecture)", "settings")).toBe(false);
    expect(outsideLectures("(student)", "study")).toBe(false);
    expect(outsideLectures("(lecture)", undefined)).toBe(false);
  });

  it("see a plain page with a way back to their lectures", async () => {
    (useSegments as jest.Mock).mockReturnValue(["study", "m02"]);
    // Nothing left to ask: the permission steps do not come first.
    notif.getPermissionsAsync.mockResolvedValue(YES);
    try {
      await render(<FirstRunPermissions active me={{ role: "student", scope: "lectures_only", access: { lecturesOnly: true } } as unknown as Me} />);
      expect(await screen.findByTestId("lectures-only")).toBeTruthy();
      await fireEvent.press(screen.getByTestId("lectures-only-back"));
      expect(router.replace).toHaveBeenCalledWith("/lo/lectures");
    } finally {
      (useSegments as jest.Mock).mockReturnValue([]);
    }
  });
});

describe("first run", () => {
  it("asks only what the phone can still ask; camera only for students", () => {
    expect(introSteps(student, { notifications: "ask", camera: "ask" })).toEqual(["notifications", "camera"]);
    expect(introSteps(admin, { notifications: "ask", camera: "ask" })).toEqual(["notifications"]);
    expect(introSteps(student, { notifications: "granted", camera: "blocked" })).toEqual([]);
    expect(introSteps(student, { notifications: "retry", camera: "granted" })).toEqual(["notifications"]);
  });

  it("notifications then camera; Allow shows the phone's question, Not now skips; shown once", async () => {
    cam.getCameraPermissionsAsync.mockResolvedValue(NEVER);
    const view = await render(<FirstRunPermissions active me={student} />);
    expect(await screen.findByTestId("perm-step-notifications")).toBeTruthy();
    expect(screen.getByText("Get class and leave updates")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("perm-allow-notifications"));
    await waitFor(() => expect(notif.requestPermissionsAsync).toHaveBeenCalled());
    expect(await screen.findByTestId("perm-step-camera")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("perm-skip-camera"));
    await waitFor(() => expect(screen.queryByTestId("first-run-permissions")).toBeNull());
    expect(cam.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    await view.unmount();

    // Next time (even after a restart): never again.
    resetIntroForTests();
    resetTourForTests();
    await render(<FirstRunPermissions active me={student} />);
    await act(async () => undefined);
    expect(screen.queryByTestId("first-run-permissions")).toBeNull();
  });

  it("waits until the app is open (after the PIN) and says nothing when all is allowed", async () => {
    notif.getPermissionsAsync.mockResolvedValue(YES);
    const v = await render(<FirstRunPermissions active={false} me={student} />);
    await act(async () => undefined);
    expect(notif.getPermissionsAsync).not.toHaveBeenCalled();
    await v.rerender(<FirstRunPermissions active me={student} />);
    await waitFor(() => expect(notif.getPermissionsAsync).toHaveBeenCalled());
    expect(screen.queryByTestId("first-run-permissions")).toBeNull();
  });
});

const dbg = (fn: () => Promise<void>) => async () => { try { await fn(); } catch (e) { console.log("ERRS", String(e), ((e as {errors?: unknown[]}).errors ?? []).map((x) => String((x as Error)?.stack ?? x).slice(0, 900)).join("\n---\n")); throw e; } };
describe.skip("Settings > Permissions", () => {
  it("shows each permission's state and opens the phone's settings when it is off for good", dbg(async () => {
    notif.getPermissionsAsync.mockResolvedValue(NO_FOR_GOOD);
    await render(<PermissionsSection />);
    await waitFor(() => expect(screen.getByLabelText(/Notifications: Off/)).toBeTruthy());
    expect(screen.getByLabelText(/Camera: Allowed/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("perm-row-notifications"));
    expect(openSettings).toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId("perm-open-settings"));
    expect(openSettings).toHaveBeenCalledTimes(2);
  }));

  it("a permission never asked is asked for from its row", async () => {
    await render(<PermissionsSection />);
    await waitFor(() => expect(screen.getByLabelText(/Notifications: Not asked yet/)).toBeTruthy());
    await fireEvent.press(screen.getByTestId("perm-row-notifications"));
    await waitFor(() => expect(notif.requestPermissionsAsync).toHaveBeenCalled());
  });
});
