import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as React from "react";

import { session } from "@/auth";
import { biometricEnabled, setBiometricEnabled } from "@/auth/biometric";
import { LockScreen } from "@/screens/auth/gates";
import { ChangePin, PhoneSecurity } from "@/screens/me/security";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});

async function type(pin: string) {
  for (const k of pin) await fireEvent.press(screen.getByTestId(`pin-key-${k}`));
}

describe("Change PIN", () => {
  it("asks for the current PIN, then the new one twice, and saves it", async () => {
    jest.useFakeTimers();
    try {
      const done = jest.fn();
      await render(<ChangePin onDone={done} />);
      expect(screen.getByText("Enter your current PIN")).toBeTruthy();
      await type("1111");
      await waitFor(() => expect(screen.getByText("Wrong PIN. 4 tries left.")).toBeTruthy());
      await React.act(async () => void jest.advanceTimersByTime(500));
      await type("2580");
      await waitFor(() => expect(screen.getByText("Choose a new PIN")).toBeTruthy());
      await React.act(async () => void jest.advanceTimersByTime(200));
      await type("1234");
      expect(screen.getByText("That one is easy to guess. Choose another.")).toBeTruthy();
      await React.act(async () => void jest.advanceTimersByTime(500));
      await type("1397");
      expect(screen.getByText("Enter the new one once more")).toBeTruthy();
      await React.act(async () => void jest.advanceTimersByTime(200));
      await type("1397");
      await React.act(async () => void jest.advanceTimersByTime(500));
      expect(done).toHaveBeenCalled();
      expect(await session.checkPin("1397")).toEqual({ ok: true, triesLeft: 5 });
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("Fingerprint unlock", () => {
  it("shows the switch when the phone has a fingerprint, and asks the phone before turning it on", async () => {
    await render(<PhoneSecurity />);
    const sw = await screen.findByTestId("pref-biometric");
    expect(screen.getByText("Unlock with fingerprint")).toBeTruthy();
    await fireEvent.press(sw);
    await waitFor(() => expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled());
    await waitFor(async () => expect(await biometricEnabled()).toBe(true));
  });

  it("hides the switch on a phone with no fingerprint or face set up", async () => {
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValueOnce(false);
    await render(<PhoneSecurity />);
    expect(screen.getByTestId("change-pin")).toBeTruthy();
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByTestId("pref-biometric")).toBeNull();
  });
});

describe("Fingerprint on the lock screen", () => {
  const LA = LocalAuthentication as unknown as { authenticateAsync: jest.Mock };

  beforeEach(async () => {
    await setBiometricEnabled(true);
    LA.authenticateAsync.mockClear();
  });

  it("asks the phone as the lock appears and opens the app on a match", async () => {
    session.lock();
    await new Promise((r) => setTimeout(r, 0));
    expect(session.store.get().phase).toBe("locked");
    await render(<LockScreen />);
    await waitFor(() => expect(LA.authenticateAsync).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(session.store.get().phase).toBe("ready"));
    expect(LA.authenticateAsync.mock.calls[0][0]).toMatchObject({ cancelLabel: "Use PIN", disableDeviceFallback: true });
  });

  it("'Use PIN' leaves the PIN pad, which still opens the app", async () => {
    LA.authenticateAsync.mockResolvedValueOnce({ success: false, error: "user_cancel" });
    session.lock();
    await new Promise((r) => setTimeout(r, 0));
    await render(<LockScreen />);
    await waitFor(() => expect(LA.authenticateAsync).toHaveBeenCalledTimes(1));
    expect(session.store.get().phase).toBe("locked");
    expect(screen.getByTestId("lock-biometric")).toBeTruthy();
    await type(String(await currentPin()));
    await waitFor(() => expect(session.store.get().phase).toBe("ready"));
  });

  it("a second tap while the phone is asking does not stack another prompt", async () => {
    let release: (v: { success: boolean }) => void = () => undefined;
    LA.authenticateAsync.mockImplementationOnce(() => new Promise((r) => (release = r)));
    session.lock();
    await new Promise((r) => setTimeout(r, 0));
    await render(<LockScreen />);
    await waitFor(() => expect(LA.authenticateAsync).toHaveBeenCalledTimes(1));
    await fireEvent.press(await screen.findByTestId("lock-biometric"));
    expect(LA.authenticateAsync).toHaveBeenCalledTimes(1);
    await React.act(async () => release({ success: false }));
    expect(session.store.get().phase).toBe("locked");
    await type(String(await currentPin()));
    await waitFor(() => expect(session.store.get().phase).toBe("ready"));
  });

  it("is switched off by signing out, so the next person chooses again", async () => {
    expect(await biometricEnabled()).toBe(true);
    await session.signOut();
    expect(await biometricEnabled()).toBe(false);
    await session.signIn("ananya@example.com", "pw");
    await session.choosePin("2580");
    pinNow = "2580";
  });
});

// The Change PIN test above sets 1397; sign-out resets it to 2580.
let pinNow = "1397";
async function currentPin() {
  return pinNow;
}
