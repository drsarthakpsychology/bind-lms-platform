import { fireEvent, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import type { RefIndexItem } from "@/api/adapt-learn";
import type { ModuleStatus } from "@/api/contract";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { T } from "@/ds";
import { ReadingSize, TextSizeRow } from "@/lib/reading";
import { settingsStore, updateSettings } from "@/lib/settings";
import { NoteScreen } from "@/screens/notes/notes";
import { exactRef } from "@/screens/reference/reference";
import { moduleStatusLines } from "@/screens/study/module";
import { readerPlace } from "@/screens/study/reader";
import { render } from "./utils";

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

describe("reader bar", () => {
  it("shows where you are, never the long title", () => {
    expect(readerPlace("2.1", [{}, {}, {}, {}, { isTest: true }])).toBe("2.1 of 4");
    expect(readerPlace("2.1", undefined)).toBe("2.1");
  });
});

describe("text size", () => {
  it("grows reading text inside ReadingSize only", async () => {
    updateSettings({ textSize: "larger", lineSpacing: "roomy" });
    await render(
      <>
        <ReadingSize>
          <T v="reading" testID="in">
            In
          </T>
        </ReadingSize>
        <T v="reading" testID="out">
          Out
        </T>
      </>,
    );
    const flat = (id: string) => Object.assign({}, ...[screen.getByTestId(id).props.style].flat(3).filter(Boolean)) as { fontSize: number; lineHeight: number };
    expect(flat("in").fontSize).toBe(22);
    expect(flat("in").lineHeight).toBe(44);
    expect(flat("out").fontSize).toBe(17);
  });

  it("the Settings row opens the sheet and saves the choice", async () => {
    await render(<TextSizeRow />);
    expect(screen.getByText("Normal")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("settings-text-size"));
    await fireEvent.press(screen.getByText("Large"));
    expect(settingsStore.get().textSize).toBe("large");
  });
});

describe("module status in plain words", () => {
  it("says not yet instead of No", () => {
    const st = { readDone: 1, readTotal: 4, written: false, actsDone: 0, actsTotal: 3, tested: false, best: null, total: null, pct: 10, complete: false, seconds: 0 } as ModuleStatus;
    expect(moduleStatusLines(st).map((l) => `${l.label}: ${l.value}`)).toEqual(["Read: 1 of 4", "Written: not yet", "Practised: not yet", "Test: not yet"]);
  });
});

describe("notes", () => {
  it("only an exact name links to the Quick reference", () => {
    const items = [{ slug: "mdd", label: "Major depressive disorder", aliases: ["Depression"] }] as RefIndexItem[];
    expect(exactRef(items, "depression")?.slug).toBe("mdd");
    expect(exactRef(items, "Sleep")).toBeNull();
  });

  it("Ask about is plain words, not chips that look tappable", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "depression" });
    await render(<NoteScreen />);
    const words = await screen.findByTestId("note-words");
    expect(words).toBeTruthy();
    expect(screen.queryByTestId("note-word-0")).toBeNull();
  });
});
