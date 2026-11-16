import { screen } from "@testing-library/react-native";
import * as React from "react";

import { assignmentFor } from "@/api/mock/fixtures";
import { session } from "@/auth";
import { checkFile, handInFiles, handInRecording, mimeTypesFor } from "@/lecture/handin";
import { FileHandIn, RecordingHandIn } from "@/lecture/handin-ui";
import { render } from "./utils";

beforeAll(async () => {
  await session.boot();
  await session.signIn("ananya@example.com", "pw");
  await session.choosePin("2580");
});

const rules = { maxFileMb: 20, acceptedFormats: ["pdf", "docx"] };

describe("handing in files and recordings", () => {
  it("asks the picker for the allowed file types only", () => {
    expect(mimeTypesFor(["pdf", "docx"])).toEqual(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
    expect(mimeTypesFor([])).toEqual(["*/*"]);
    expect(mimeTypesFor(["image"])).toEqual(["image/*"]);
  });

  it("refuses files that are too big or of the wrong type, before sending anything", () => {
    expect(checkFile({ uri: "f", name: "write-up.pdf", size: 1_000_000 }, rules)).toBeNull();
    expect(checkFile({ uri: "f", name: "Write-Up.DOCX", size: null }, rules)).toBeNull();
    expect(checkFile({ uri: "f", name: "photo.jpg", size: 1000 }, rules)).toMatch(/not a file type/);
    expect(checkFile({ uri: "f", name: "big.pdf", size: 30 * 1024 * 1024 }, rules)).toMatch(/bigger than 20 MB/);
  });

  it("asks for a place per file, then hands in every path in one call", async () => {
    const progress = jest.fn();
    const r = await handInFiles("a1", [{ uri: "file:///a.pdf", name: "a.pdf", size: 10 }, { uri: "file:///b.docx", name: "b.docx", size: 10 }], "My note", progress);
    expect(r.submission.files.map((f) => f.name)).toEqual(["a.pdf", "b.docx"]);
    expect(r.submission.note).toBe("My note");
    expect(progress).toHaveBeenLastCalledWith(2, 2);
  });

  it("hands in a recording", async () => {
    const r = await handInRecording("a2", "file:///cache/recording.m4a");
    expect(r.submission.hasAudio).toBe(true);
  });

  it("shows the file and recording forms", async () => {
    await render(
      <>
        <FileHandIn a={assignmentFor("l5")!} onDone={() => undefined} />
        <RecordingHandIn a={assignmentFor("l6")!} onDone={() => undefined} />
      </>,
    );
    expect(screen.getByTestId("handin-pick")).toBeTruthy();
    expect(screen.getByText(/PDF, DOCX · up to 3 files, 20 MB each/)).toBeTruthy();
    expect(screen.getByTestId("handin-send")).toBeDisabled();
    expect(screen.getByTestId("record-toggle")).toBeTruthy();
    expect(screen.getByTestId("record-send")).toBeDisabled();
  });
});
