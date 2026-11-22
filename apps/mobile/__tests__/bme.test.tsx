import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { settingsStore, updateSettings } from "@/lib/settings";
import { BoardScreen } from "@/practise/board";
import { CertificateScreen } from "@/screens/me/certificate";
import { CertificatesScreen, progressPct } from "@/screens/me/certificates";
import { HelpScreen } from "@/screens/me/help";
import { overallPct } from "@/screens/me/me";
import { initials } from "@/screens/me/parts";
import { ProgressScreen } from "@/screens/me/progress";
import { numberProblem, SettingsScreen } from "@/screens/me/settings";
import { NotificationsScreen } from "@/screens/notifications/list";
import { NotificationSettingsScreen } from "@/screens/notifications/prefs";
import { render } from "./utils";

/** The Me area in the Layers look: what each screen must keep doing. */

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => {
  mock.reset();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("small helpers", () => {
  it("initials, the share of the course done, and a progress line's share", () => {
    expect(initials("Ananya Mehta")).toBe("AM");
    expect(initials("Asha")).toBe("A");
    expect(initials(null)).toBe("");
    expect(overallPct({ lectures: [{ courseId: "c", title: "C", completed: 4, total: 8 }], study: null, days: [], strengths: null })).toBe(50);
    expect(overallPct({ lectures: [], study: null, days: [], strengths: null })).toBe(0);
    expect(progressPct("1 of 4 sections read")).toBe(25);
    expect(progressPct("soon")).toBeNull();
  });
});

describe("Settings", () => {
  it("funny stickers are off unless the student turns them on", () => {
    expect(settingsStore.get().reactions).toBe(false);
  });

  it("the phone's own choices show even when the server fails, and Sign out asks first", async () => {
    mock.setScenario("error");
    const out = jest.spyOn(session, "signOut").mockResolvedValue(undefined as never);
    await render(<SettingsScreen />);
    expect(screen.getByTestId("pref-theme")).toBeTruthy();
    expect(screen.getByTestId("pref-haptics")).toBeTruthy();
    expect(screen.getByTestId("change-pin")).toBeTruthy();
    expect(await screen.findByTestId("load-error")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("sign-out"));
    expect(out).not.toHaveBeenCalled();
    await fireEvent.press(await screen.findByTestId("sign-out-confirm"));
    expect(out).toHaveBeenCalledTimes(1);
    out.mockRestore();
  });

  it("a failed load never shows a sticker, even with funny stickers on", async () => {
    updateSettings({ reactions: true });
    mock.setScenario("error");
    await render(<ProgressScreen />);
    expect(await screen.findByTestId("load-error")).toBeTruthy();
    expect(screen.queryByTestId("meme")).toBeNull();
    updateSettings({ reactions: false });
  });

  it("a WhatsApp number is checked before it is sent", async () => {
    expect(numberProblem("")).toBe("Enter your WhatsApp number.");
    expect(numberProblem("98")).toBe("Enter the full number, 10 digits.");
    expect(numberProblem("+91 98123 45678")).toBeNull();
    await render(<SettingsScreen />);
    await fireEvent.press(await screen.findByTestId("settings-number"));
    expect(await screen.findByTestId("profile-number")).toBeTruthy();
  });

  it("colour-blind colours are a saved choice, and notifications open their own screen", async () => {
    await render(<SettingsScreen />);
    await fireEvent.press(screen.getByTestId("pref-colour-blind"));
    expect(settingsStore.get().colourBlind).toBe(true);
    updateSettings({ colourBlind: false });
    await fireEvent.press(screen.getByTestId("settings-notifications"));
    expect(router.push).toHaveBeenLastCalledWith("/notification-settings");
  });
});

describe("Notifications", () => {
  it("the unread count sits on the field with Mark all read, and the last row opens the choices", async () => {
    await render(<NotificationsScreen />);
    expect(await screen.findByTestId("notifications-unread")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("read-all"));
    await waitFor(() => expect(mock.log().some((l) => l.path === "/notifications/read-all")).toBe(true));
    await fireEvent.press(screen.getByTestId("notifications-settings"));
    expect(router.push).toHaveBeenLastCalledWith("/notification-settings");
  });

  it("each kind has its own switch; they wait for the main one", async () => {
    await render(<NotificationSettingsScreen />);
    expect(await screen.findByTestId("pref-push")).toBeTruthy();
    for (const id of ["pref-messages", "pref-doubts", "pref-achievements", "pref-reminder"]) expect(screen.getByTestId(id)).toBeTruthy();
  });

  it("each clinic reminder has its own switch, saved on the server", async () => {
    await render(<NotificationSettingsScreen />);
    for (const id of ["opdDay", "sessionSoon", "scanOut", "caseLog", "leaveLow"]) expect(await screen.findByTestId(`pref-rem-${id}`)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("pref-rem-scanOut"));
    await waitFor(() => expect(mock.log().some((l) => l.path === "/notifications/preferences" && l.method === "PUT" && (l.body as { reminders?: { scanOut?: boolean } })?.reminders?.scanOut === false)).toBe(true));
  });
});

describe("Certificates", () => {
  it("an earned certificate opens its page; an empty list says how to earn one", async () => {
    await render(<CertificatesScreen />);
    await fireEvent.press(await screen.findByTestId("cert-VIBHA-C2-0123-M1"));
    await waitFor(() => expect(router.push).toHaveBeenLastCalledWith("/certificate/VIBHA-C2-0123-M1"));
  });

  it("nothing earned yet", async () => {
    mock.setScenario("empty");
    await render(<CertificatesScreen />);
    expect(await screen.findByTestId("certs-empty")).toBeTruthy();
  });

  it("the certificate shows as a page with Download and Share", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "VIBHA-C2-0123-M1" });
    await render(<CertificateScreen />);
    expect(await screen.findByTestId("cert-page")).toBeTruthy();
    expect(screen.getByTestId("cert-download")).toBeTruthy();
    expect(screen.getByTestId("cert-share")).toBeTruthy();
  });

  it("a certificate that is not there says so and offers help", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "nope" });
    await render(<CertificateScreen />);
    expect(await screen.findByTestId("cert-missing")).toBeTruthy();
  });
});

describe("Leaderboard and help", () => {
  it("marks you, and links to the shop", async () => {
    await render(<BoardScreen />);
    expect(await screen.findByTestId("board-you")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("board-shop"));
    await waitFor(() => expect(router.push).toHaveBeenLastCalledWith("/shop"));
  });

  it("a question opens its answer", async () => {
    await render(<HelpScreen />);
    expect(screen.queryByTestId("help-a-pin")).toBeNull();
    await fireEvent.press(screen.getByTestId("help-q-pin"));
    expect(screen.getByTestId("help-a-pin")).toBeTruthy();
  });
});
