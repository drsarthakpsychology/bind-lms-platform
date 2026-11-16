import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as React from "react";

import { session } from "@/auth";
import { biometricEnabled } from "@/auth/biometric";
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
