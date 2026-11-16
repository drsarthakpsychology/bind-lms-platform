/** Every link to another app goes through openLink, so a phone with no app for it says so. */
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { session } from "@/auth";
import { openLink } from "@/lib/open";
import { ForgotPasswordScreen } from "@/screens/auth/forgot";
import { CertificateScreen } from "@/screens/me/certificate";
import { HelpScreen } from "@/screens/me/help";
import { SettingsScreen } from "@/screens/me/settings";
import { render } from "./utils";

jest.mock("@/lib/open", () => ({ openLink: jest.fn(async () => true) }));
const open = openLink as jest.Mock;

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});
beforeEach(() => open.mockClear());

describe("links to other apps use openLink", () => {
  it("Help: WhatsApp and email", async () => {
    await render(<HelpScreen />);
    await fireEvent.press(screen.getByTestId("help-whatsapp"));
    expect(open).toHaveBeenLastCalledWith(expect.stringMatching(/wa\.me|whatsapp/));
    await fireEvent.press(screen.getByTestId("help-email"));
    expect(open).toHaveBeenLastCalledWith(expect.stringMatching(/^mailto:/));
  });

  it("Certificate: the public check page", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "VIBHA-C2-0123-M1" });
    await render(<CertificateScreen />);
    await waitFor(() => expect(screen.getByTestId("cert-check")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("cert-check"));
    expect(open).toHaveBeenLastCalledWith("https://vibhapsychology.com/verify/VIBHA-C2-0123-M1");
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
  });

  it("Forgot password: WhatsApp with the message filled in", async () => {
    await render(<ForgotPasswordScreen />);
    await waitFor(() => expect(screen.getByTestId("forgot-whatsapp")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("forgot-whatsapp"));
    expect(open).toHaveBeenLastCalledWith(expect.stringContaining("?text=Hi%2C%20I%20forgot%20my%20VIBHA%20password"));
  });

  it("Settings: privacy policy and terms", async () => {
    await render(<SettingsScreen />);
    await waitFor(() => expect(screen.getByTestId("settings-privacy")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("settings-privacy"));
    expect(open).toHaveBeenLastCalledWith("https://vibhapsychology.com/policies/privacy");
    await fireEvent.press(screen.getByTestId("settings-terms"));
    expect(open).toHaveBeenLastCalledWith("https://vibhapsychology.com/policies/terms");
  });
});
