import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { AccessibilityInfo, Text } from "react-native";

import { EmptyState } from "@/ds";
import { reactions, ReactionLayer, useReactions } from "@/ds/reactions";
import { LINES } from "@/lib/reactions/lines";
import { pickFrom } from "@/lib/reactions/pick";
import { STATE_STICKER, STICKERS, stickersFor } from "@/lib/reactions/stickers";
import { decide, newRun } from "@/lib/reactions/trigger";
import { settingsStore, updateSettings } from "@/lib/settings";
import { render } from "./utils";

const web = (p: string) => fs.readFileSync(path.join(__dirname, "../../../src/lib/reactions", p), "utf8");
/** The app copies start with a short header comment; the rest must be the website's file as is. */
const body = (p: string) => fs.readFileSync(path.join(__dirname, "../src/lib/reactions", p), "utf8").replace(/^\/\*[\s\S]*?\*\/\n/, "");

describe("the app's reactions match the website's", () => {
  it("lines and trigger are the website's files", () => {
    expect(body("lines.ts")).toBe(web("lines.ts"));
    expect(body("trigger.ts")).toBe(web("trigger.ts"));
  });

  it("every website sticker is bundled, with the same mood, words and size", () => {
    const src = web("stickers.ts");
    const rows = [...src.matchAll(/\{ id: "([^"]+)", mood: "([^"]+)", alt: "([^"]+)", w: (\d+), h: (\d+) \}/g)];
    expect(rows.length).toBe(STICKERS.length);
    for (const [, id, mood, alt, w, h] of rows) {
      const s = STICKERS.find((x) => x.id === id);
      expect(s && { mood: s.mood, alt: s.alt, w: String(s.w), h: String(s.h) }).toEqual({ mood, alt, w, h });
      expect(fs.existsSync(path.join(__dirname, "../assets/reactions", `${id}.webp`))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, "../../../public/reactions", `${id}.webp`))).toBe(true);
    }
  });

  it("empty and error moods use only shipped stickers", () => {
    for (const id of Object.values(STATE_STICKER)) expect(STICKERS.some((s) => s.id === id)).toBe(true);
    expect(STATE_STICKER.empty).toBe("wet-cat-stare");
    expect(STATE_STICKER.error).toBe("cat-hand-on-head");
  });

  it("pickFrom steers away from the last stickers and lines", () => {
    const a = pickFrom("wrong", { s: [], l: [] }, () => 0);
    const b = pickFrom("wrong", a.recent, () => 0);
    expect(b.reaction.sticker.id).not.toBe(a.reaction.sticker.id);
    expect(b.reaction.line).not.toBe(a.reaction.line);
    expect(stickersFor("wrong").map((s) => s.id)).toContain(a.reaction.sticker.id);
    expect(LINES.wrong).toContain(a.reaction.line);
  });

  it("the first right answer shows one; a clock running holds it back", () => {
    const env = { now: 100_000, lastShownAt: 0, rand: () => 0.9, enabled: true };
    expect(decide(newRun(), true, {}, env).mood).toBe("right");
    expect(decide(newRun(), true, { timed: true }, env).mood).toBeNull();
  });
});

function Answerer() {
  const r = useReactions();
  return (
    <>
      <Text onPress={() => r.answer(true)}>answer</Text>
      <Text onPress={() => r.finish("lost")}>finish</Text>
    </>
  );
}

describe("the reaction layer", () => {
  beforeEach(() => {
    jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    reactions.reset();
    updateSettings({ reactions: true });
  });
  afterEach(() => {
    updateSettings({ reactions: true });
  });

  it("shows a sticker and a line after the first right answer, and turns off from its button", async () => {
    await render(
      <>
        <Answerer />
        <ReactionLayer />
      </>,
    );
    fireEvent.press(screen.getByText("answer"));
    await waitFor(() => expect(screen.getByTestId("reaction")).toBeTruthy());
    const shown = reactions.current();
    expect(shown?.mood).toBe("right");
    expect(screen.getByTestId("reaction")).toBeTruthy();
    expect(screen.getByLabelText(`Close: ${shown!.line}`)).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Turn off funny reactions"));
    expect(settingsStore.get().reactions).toBe(false);
    await waitFor(() => expect(screen.queryByTestId("reaction")).toBeNull());
  });

  it("a round's end always shows one; nothing with reactions off", async () => {
    await render(
      <>
        <Answerer />
        <ReactionLayer />
      </>,
    );
    fireEvent.press(screen.getByText("finish"));
    await waitFor(() => expect(screen.getByTestId("reaction")).toBeTruthy());
    expect(reactions.current()?.mood).toBe("wrong");
    await act(async () => reactions.dismiss());
    await act(async () => updateSettings({ reactions: false }));
    fireEvent.press(screen.getByText("finish"));
    await new Promise((r) => setTimeout(r, 400));
    expect(reactions.current()).toBeNull();
  });

  it("empty states draw the meme with plain words, and only the words with reactions off", async () => {
    await render(<EmptyState mood="empty" title="Nothing here" sticker />);
    expect(screen.getByLabelText("Wet cat staring blankly")).toBeTruthy();
    await act(async () => updateSettings({ reactions: false }));
    expect(screen.queryByLabelText("Wet cat staring blankly")).toBeNull();
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });

  it("has no sticker unless asked, and an error never shows one", async () => {
    await act(async () => updateSettings({ reactions: true }));
    await render(
      <>
        <EmptyState mood="empty" title="Plain" />
        <EmptyState mood="error" title="Broken" sticker />
      </>,
    );
    expect(screen.queryByTestId("meme")).toBeNull();
    await act(async () => updateSettings({ reactions: false }));
  });
});
