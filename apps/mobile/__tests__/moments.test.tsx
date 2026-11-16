import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import * as React from "react";

import { LectureIntro } from "@/lecture/intro";
import { PAUSE, PLAY, PlayPause, quad } from "@/lecture/playmorph";
import { isSafePath } from "@/lib/svg-safe";
import { prefs } from "@/lib/storage";
import { CertificateMoment } from "@/moments/certificate";
import { freshCertificates } from "@/moments/store";
import { StreakPanel } from "@/moments/streak";
import type { Credential } from "@/api/contract";
import { PixelLoader, useSlow } from "@/moments/parts";
import { EndPanel, GameFrame, StartScreen } from "@/practise/frame";
import { render } from "./utils";

const note = Haptics.notificationAsync as jest.Mock;

beforeEach(() => note.mockClear());

describe("end of a round (storyboard 2)", () => {
  it("a lost round gets a warning haptic, never a success one", async () => {
    await render(
      <GameFrame title="Rx">
        <EndPanel score="20" right={1} total={10} outcome="lost" />
      </GameFrame>,
    );
    await waitFor(() => expect(note).toHaveBeenCalledWith("warning"));
    expect(note).not.toHaveBeenCalledWith("success");
  });

  it("a won round gets one success haptic, then the shared reaction sticker", async () => {
    await render(
      <GameFrame title="Rx">
        <EndPanel score="80" right={8} total={10} />
      </GameFrame>,
    );
    await waitFor(() => expect(note).toHaveBeenCalledWith("success"));
    expect(note).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByTestId("reaction")).toBeTruthy(), { timeout: 6000 });
  });
});

describe("lecture (storyboard 5)", () => {
  it("the play and pause morph never hands Android bad path data", () => {
    for (const t of [0, 0.25, 0.5, 1, NaN, Infinity, -3]) for (const i of [0, 1] as const) expect(isSafePath(quad(PAUSE[i], PLAY[i], t))).toBe(true);
  });

  it("shows the right icon and the intro with the lecture number", async () => {
    await render(
      <>
        <PlayPause playing={false} />
        <LectureIntro info={{ number: 5, week: 3 }} gone={false} />
      </>,
    );
    expect(screen.getByTestId("icon-play")).toBeTruthy();
    expect(screen.getByLabelText("Lecture 5, Week 3")).toBeTruthy();
  });
});

const cert = (id: string): Credential => ({ credentialId: id, type: "certificate", status: "issued", title: "Foundations of Psychopathology", description: null, icon: null, tone: "blue", issuedAt: "2026-11-16T10:00:00.000Z", revokedAt: null, revokeReason: null, kind: null, expiresAt: null, verifyUrl: "https://vibhapsychology.com/verify/x" } as Credential);

describe("certificate earned (storyboard 3)", () => {
  it("a fresh install remembers what is there without replaying it; a new one plays once", async () => {
    await prefs.remove("vibha.moments.certs");
    expect(await freshCertificates([cert("a")])).toEqual([]);
    expect((await freshCertificates([cert("a"), cert("b")])).map((c) => c.credentialId)).toEqual(["b"]);
    expect(await freshCertificates([cert("a"), cert("b")])).toEqual([]);
  });

  it("a new student with none yet still gets the first one", async () => {
    await prefs.remove("vibha.moments.certs");
    expect(await freshCertificates([])).toEqual([]);
    expect((await freshCertificates([cert("c")])).map((c) => c.credentialId)).toEqual(["c"]);
  });

  it("shows the certificate with its buttons and a success haptic; Close closes", async () => {
    const onClose = jest.fn();
    await render(<CertificateMoment cert={cert("a")} onClose={onClose} />);
    expect(screen.getByText("Certificate earned")).toBeTruthy();
    await waitFor(() => expect(note).toHaveBeenCalledWith("success"), { timeout: 2000 });
    fireEvent.press(screen.getByTestId("moment-close"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});

describe("streak kept (storyboard 4)", () => {
  it("shows the count and closes with Keep going", async () => {
    const onClose = jest.fn();
    await render(<StreakPanel days={6} onClose={onClose} />);
    expect(screen.getByLabelText("6 day streak")).toBeTruthy();
    expect(screen.getByText(/6 days in a row/)).toBeTruthy();
    fireEvent.press(screen.getByTestId("moment-streak-close"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});

describe("waits and intros", () => {
  function Slow({ on }: { on: boolean }) {
    const slow = useSlow(on, 50);
    return slow ? <PixelLoader label="Setting up the round" /> : null;
  }

  it("the pixel loader shows only once a wait passes its time, and goes when it ends", async () => {
    const r = await render(<Slow on />);
    expect(screen.queryByLabelText("Setting up the round")).toBeNull();
    await waitFor(() => expect(screen.getByLabelText("Setting up the round")).toBeTruthy());
    r.rerender(<Slow on={false} />);
    await waitFor(() => expect(screen.queryByLabelText("Setting up the round")).toBeNull());
  });

  it("a game intro shows its title and Play works at once", async () => {
    const onPlay = jest.fn();
    await render(<StartScreen title="Rx Detective" line="Find the drug." howTo={["Read the case."]} onPlay={onPlay} />);
    expect(screen.getByText("Rx Detective")).toBeTruthy();
    fireEvent.press(screen.getByTestId("start-play"));
    expect(onPlay).toHaveBeenCalled();
  });
});
