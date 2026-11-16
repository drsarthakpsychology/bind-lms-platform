import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { Text } from "react-native";

import { meView } from "@/api/adapt";
import { certTypesFrom, cohortFrom, cohortsFrom, drawingFrom, personPageFrom, safeActivity, safeHome, safeMessages, safeStudent, safeStudentList, signOffsFrom, studentMessagesFrom, studioSettingsFrom, systemFrom } from "@/admin/safe";
import { api, session } from "@/auth";
import { CrashBoundary, crashStore, installCrashHandlers, resetCrashNet } from "@/lib/crash";
import { homeHref, groupFor } from "@/nav/targets";
import { enablePush, pushStatus } from "@/push";
// The admin screens live in src/admin (agent appadmin); they read every answer through src/admin/safe.ts.
import { AdminActivityScreen as AdminActivity } from "@/admin/screens/activity";
import { AdminHomeScreen as AdminHome } from "@/admin/screens/home";
import { AdminMessagesScreen as AdminMessages } from "@/admin/screens/messages";
import { AdminStudentScreen as AdminStudent } from "@/admin/screens/student";
import { AdminStudentsScreen as AdminStudents } from "@/admin/screens/students";
import { ApiFailure } from "@/api/errors";
import { when } from "@/screens/notifications/list";
import { render } from "./utils";

/**
 * The live server's answers, shaped exactly as src/lib/app-api/admin.ts and
 * the admin routes in src/app/api/app/v1/admin build them (AdminHome,
 * AdminStudentList, AdminStudentProfile, MessageBatches, PlayResult).
 */
const row = {
  id: "3f1c2d4e-0000-4000-8000-000000000001",
  name: "Ananya Rao",
  email: "ananya@example.com",
  rollNumber: null,
  mobileNumber: null,
  scope: "full",
  blocked: false,
  expiresAt: null,
  account: "active",
  presence: "quiet",
  lastSeen: null,
  cohorts: [],
  minutes7: 0,
  activeDays30: 0,
  lecturesDone: 3,
  lecturesAvailable: 12,
  xp: 0,
  flags: ["no-mobile", "quiet"],
};
const LIVE: Record<string, unknown> = {
  "/admin/home": { v: 1, counts: { students: 41, activeThisWeek: 17, onNow: 2, needsLook: 1, locked: 0, openComplaints: 3 }, needsLook: [row], live: [] },
  "/admin/students": { items: [row, { ...row, id: "3f1c2d4e-0000-4000-8000-000000000002", name: "Kabir", blocked: true, account: "locked", cohorts: [{ id: "c2", name: "Cohort Two" }], lastSeen: "2026-11-14T10:00:00.000Z" }], nextCursor: null, total: 2, cohorts: [{ id: "c2", name: "Cohort Two" }] },
  "/admin/students/x": { row, detail: { profile: { id: row.id, name: "Ananya Rao", email: row.email, status: "active", created_at: "2026-10-01T00:00:00Z", mobile_number: null, display: "Ananya Rao" }, daily: [], lectures: [{ id: "l1", title: "One", week: 1, watchedMin: 10, done: true, at: null }, { id: "l2", title: "Two", week: 1, watchedMin: 0, done: false, at: null }], recent: [{ at: "2026-11-14T10:00:00.000Z", what: "Opened Home", min: 2 }], learn: null } },
  "/admin/activity": { kind: "admin.activity", v: 1, data: { rows: [{ id: row.id, name: "Ananya Rao", email: row.email, status: "active", min7: 25, min30: 90, activeDays30: 4, lastSeen: "2026-11-14T10:00:00.000Z", lecturesDone: 3, lecturesStarted: 4, watchMin: 80, xp: 0, level: "", streak: 0, accuracy: null, mastery: 0, practice: 0, score: 1 }], heat: [], pages: [], totals: {}, live: [] } },
  "/admin/messages": { batches: [{ batchId: "b1", title: "Class moved", sentAt: "2026-11-14T10:00:00.000Z", total: 40, opened: 12, type: "message" }], ready: true },
};

function serveLive() {
  return jest.spyOn(api, "get").mockImplementation(async (path: string) => {
    const key = path.startsWith("/admin/students/") ? "/admin/students/x" : path;
    if (key in LIVE) return LIVE[key] as never;
    throw new ApiFailure("not_found", `no live sample for ${path}`, 404);
  });
}

jest.mock("expo-device", () => ({ isDevice: false, modelName: "Test phone", osVersion: "14", isRootedExperimentalAsync: jest.fn(async () => false) }));
jest.mock("expo-splash-screen", () => ({ hideAsync: jest.fn(async () => undefined), preventAutoHideAsync: jest.fn(async () => undefined) }));

beforeAll(async () => {
  await session.boot();
  await session.signIn("admin@example.com", "pw");
  await session.choosePin("2580");
});
afterEach(() => jest.restoreAllMocks());

describe("Cause 1: admin screens read shapes the live server never sends", () => {
  it("the raw live /admin/home answer has no `today`, so the old screen's d.today.active threw", () => {
    const raw = LIVE["/admin/home"] as { today?: { active: number } };
    expect(() => raw.today!.active).toThrow(TypeError);
  });

  it("Admin Home renders the live answer", async () => {
    serveLive();
    await render(<AdminHome />);
    await waitFor(() => expect(screen.getByText("41 students")).toBeTruthy());
    expect(screen.getByText("17 active this week")).toBeTruthy();
    expect(screen.getAllByText(/Ananya Rao/).length).toBeGreaterThan(0);
  });

  it("Students renders the live answer", async () => {
    serveLive();
    const r = await render(<AdminStudents />);
    await waitFor(() => expect(r.getByText("Kabir")).toBeTruthy());
    expect(r.getByText("Ananya Rao")).toBeTruthy();
  });

  it("one student renders the live { row, detail } answer", async () => {
    serveLive();
    (jest.requireMock("expo-router") as { useLocalSearchParams: jest.Mock }).useLocalSearchParams.mockReturnValue({ id: row.id });
    const r = await render(<AdminStudent />);
    await waitFor(() => expect(r.getAllByText("Ananya Rao").length).toBeGreaterThan(0));
  });

  it("Activity renders the live PlayResult answer", async () => {
    serveLive();
    const r = await render(<AdminActivity />);
    await waitFor(() => expect(r.getByText("Nobody is on right now.")).toBeTruthy());
  });

  it("Messages renders the live batches answer", async () => {
    serveLive();
    (jest.requireMock("expo-router") as { useLocalSearchParams: jest.Mock }).useLocalSearchParams.mockReturnValue({ tab: "sent" });
    const r = await render(<AdminMessages />);
    await waitFor(() => expect(r.getByText("Class moved")).toBeTruthy());
  });

  it("adapters never throw on empty, null or odd answers", () => {
    for (const bad of [null, undefined, 1, "x", [], {}, { needsLook: null, counts: null }, { items: null }, { row: null, detail: null }, { data: null }, { batches: null }]) {
      for (const read of [safeHome, safeStudentList, safeStudent, safeActivity, safeMessages, meView, cohortsFrom, (v: unknown) => cohortFrom(v, "c1"), studentMessagesFrom, signOffsFrom, studioSettingsFrom, certTypesFrom, systemFrom, personPageFrom, drawingFrom]) expect(() => read(bad)).not.toThrow();
    }
    expect(safeHome({}).cohorts).toEqual([]);
  });
});

describe("Cause 2: an account copy without `access` broke routing", () => {
  it("homeHref and groupFor survive a Me with missing fields", () => {
    const partial = { id: "u", role: "student", scope: "lectures_only" } as never;
    expect(() => homeHref(partial)).not.toThrow();
    expect(homeHref(meView(partial))).toBe("/lo/home");
    expect(groupFor(meView({ id: "a", role: "admin" }))).toBe("(admin)");
    const me = meView({ id: "a", role: "admin" });
    expect(me.access.can.lectures).toBe(true);
    expect(me.cohorts).toEqual([]);
    expect(me.watermark.text).toBeTruthy();
  });

  it("when() gives empty text for a missing time instead of 'Invalid Date'", () => {
    expect(when(null)).toBe("");
    expect(when("not a date")).toBe("");
  });
});

describe("Cause 3: a JS error anywhere closed the app (no net)", () => {
  function Boom({ on }: { on: boolean }) {
    if (on) throw new TypeError("Cannot read property 'active' of undefined");
    return <Text>fine</Text>;
  }

  it("a render error shows the calm page with Try again and the error text", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    let on = true;
    const reset = jest.fn(() => {
      on = false;
    });
    function Host() {
      return <Boom on={on} />;
    }
    const r = await render(
      <CrashBoundary onReset={reset}>
        <Host />
      </CrashBoundary>,
    );
    expect(r.getByText("Something went wrong")).toBeTruthy();
    await fireEvent.press(r.getByTestId("crash-details-toggle"));
    expect(r.getByTestId("crash-details").props.children).toContain("Cannot read property 'active' of undefined");
    await fireEvent.press(r.getByTestId("crash-retry"));
    expect(reset).toHaveBeenCalled();
    expect(r.getByText("fine")).toBeTruthy();
  });

  it("the global handler shows the page instead of passing a fatal error on", async () => {
    resetCrashNet();
    const previous = jest.fn();
    let handler: ((e: unknown, fatal?: boolean) => void) | null = null;
    const tracker: { onUnhandled?: (id: number, e: unknown) => void } = {};
    installCrashHandlers({
      ErrorUtils: { getGlobalHandler: () => previous, setGlobalHandler: (fn) => void (handler = fn) },
      HermesInternal: { enablePromiseRejectionTracker: (o) => void (tracker.onUnhandled = o.onUnhandled) },
    });
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const r = await render(
      <CrashBoundary>
        <Text>app</Text>
      </CrashBoundary>,
    );
    // A failed request left unhandled is not a crash.
    tracker.onUnhandled!(1, Object.assign(new Error("No internet"), { code: "network" }));
    expect(crashStore.get().crash).toBeNull();
    handler!(new TypeError("undefined is not an object"), true);
    // Never hands a fatal error to React Native's default handler (that closes the app).
    expect(previous).not.toHaveBeenCalledWith(expect.anything(), true);
    await waitFor(() => expect(r.getByText("Something went wrong")).toBeTruthy());
    await fireEvent.press(r.getByTestId("crash-retry"));
    expect(r.getByText("app")).toBeTruthy();
    // A bug in a promise shows the page too.
    tracker.onUnhandled!(2, new TypeError("x is not a function"));
    await waitFor(() => expect(r.getByText("Something went wrong")).toBeTruthy());
    resetCrashNet();
  });
});

describe("Cause 4: optional native features must only switch themselves off", () => {
  it("push without Firebase on Android (getExpoPushTokenAsync throws) returns unavailable", async () => {
    const Device = jest.requireMock("expo-device") as { isDevice: boolean };
    const was = Device.isDevice;
    Device.isDevice = true;
    jest.spyOn(Notifications, "getPermissionsAsync").mockResolvedValue({ granted: true, canAskAgain: true } as never);
    jest.spyOn(Notifications, "getExpoPushTokenAsync").mockRejectedValue(new Error("Default FirebaseApp is not initialized in this process com.vibhapsychology.app"));
    await expect(enablePush()).resolves.toBe("unavailable");
    jest.spyOn(Notifications, "getPermissionsAsync").mockRejectedValue(new Error("native module missing"));
    await expect(enablePush()).resolves.toBe("unavailable");
    await expect(pushStatus()).resolves.toBe("unavailable");
    Device.isDevice = was;
  });
});

describe("Cause 5: the PIN screen", () => {
  it("a keystore failure while saving the PIN rejects (the screen shows a message, not a hang)", async () => {
    const SecureStore = jest.requireMock("expo-secure-store") as { setItemAsync: jest.Mock };
    SecureStore.setItemAsync.mockRejectedValueOnce(new Error("KeyStore exception"));
    await expect(session.choosePin("1357")).rejects.toThrow();
  });
});
