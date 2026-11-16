import { render as bare, fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { adminMock } from "@/admin/mock";
import { AdminCertificatesScreen } from "@/admin/screens/certificates";
import { AdminDoubtsScreen, doubtState, isWaiting } from "@/admin/screens/doubts";
import { AdminPeopleScreen } from "@/admin/screens/people";
import { AdminSystemScreen } from "@/admin/screens/system";
import { safeDoubtRow } from "@/admin/safe";
import { base64Bytes, SIGNATURE_MAX_BYTES, toSignature } from "@/admin/signature-pick";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { toast } from "@/ds/toast";
import { QueryClient } from "@tanstack/react-query";
import { Linking, Text } from "react-native";

import type { CourseDetail, CourseList } from "@/api/contract";
import { keys } from "@/api/queries";
import { countWatched } from "@/lecture/watched";
import { openLink } from "@/lib/open";
import { useFocusedValue } from "@/nav/focused-value";
import { LectureScreen } from "@/screens/lecture/lecture";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;
const pick = ImagePicker.launchImageLibraryAsync as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
  pick.mockClear();
});

describe("signature image from the phone", () => {
  it("turns the picked image into the data URL the server takes, and refuses what it cannot send", () => {
    expect(toSignature({ uri: "f", base64: "QUJD", mimeType: "image/png" })).toEqual({ dataUrl: "data:image/png;base64,QUJD", uri: "f" });
    expect(toSignature({ uri: "f", base64: "QUJD", mimeType: "image/heic" })).toEqual({ dataUrl: "data:image/jpeg;base64,QUJD", uri: "f" });
    expect(toSignature({ uri: "f", base64: null })).toEqual({ error: expect.stringContaining("could not be read") });
    expect(toSignature(undefined)).toEqual({ error: expect.any(String) });
    const big = "A".repeat(Math.ceil((SIGNATURE_MAX_BYTES * 4) / 3) + 8);
    expect(toSignature({ uri: "f", base64: big })).toEqual({ error: expect.stringContaining("2 MB") });
    expect(base64Bytes("QUJD")).toBe(3);
    expect(base64Bytes("QUI=")).toBe(2);
  });

  it("a super admin picks, crops and saves one; it shows in the list", async () => {
    await signInAs("admin@example.com");
    params.mockReturnValue({ tab: "settings" });
    const show = jest.spyOn(toast, "show");
    await render(<AdminCertificatesScreen />);
    const label = await screen.findByTestId("signature-label");
    await fireEvent.changeText(label, "Kavya Bothra");
    await fireEvent.press(screen.getByTestId("signature-add"));
    await waitFor(() => expect(show).toHaveBeenCalledWith("Signature saved"));
    expect(pick).toHaveBeenCalledWith(expect.objectContaining({ mediaTypes: ["images"], allowsEditing: true, base64: true }));
    expect(adminMock.state().studio.signatures.map((g) => g.label)).toContain("Kavya Bothra");
    expect(await screen.findByTestId("signature-sig-kavya-bothra")).toBeTruthy();
    show.mockRestore();
  });

  it("backing out of the photos sends nothing; a missing name is asked for first", async () => {
    await signInAs("admin@example.com");
    params.mockReturnValue({ tab: "settings" });
    const show = jest.spyOn(toast, "show");
    await render(<AdminCertificatesScreen />);
    const label = await screen.findByTestId("signature-label");
    pick.mockResolvedValueOnce({ canceled: true, assets: null });
    await fireEvent.press(screen.getByTestId("signature-add"));
    await waitFor(() => expect(pick).toHaveBeenCalledTimes(1));
    expect(adminMock.state().studio.signatures).toHaveLength(1);
    await fireEvent.changeText(label, "  ");
    await fireEvent.press(screen.getByTestId("signature-add"));
    expect(show).toHaveBeenCalledWith("Say whose signature it is.");
    expect(pick).toHaveBeenCalledTimes(1);
    show.mockRestore();
  });

  it("a view-only admin does not get the upload", async () => {
    await signInAs("viewadmin@example.com");
    params.mockReturnValue({ tab: "settings" });
    await render(<AdminCertificatesScreen />);
    await screen.findByTestId("signature-sig-sd");
    expect(screen.queryByTestId("signature-add")).toBeNull();
  });
});

describe("Mark as watched", () => {
  it("the button's face turns into a tick and Watched", async () => {
    await signInAs("ananya@example.com");
    params.mockReturnValue({ lessonId: "l5" });
    await render(<LectureScreen />);
    await fireEvent.press(await screen.findByTestId("lecture-complete"));
    expect(await screen.findByTestId("lecture-watched")).toBeTruthy();
    expect(screen.getByLabelText("Watched")).toBeTruthy();
    expect(screen.queryByTestId("lecture-complete")).toBeNull();
  });

  it("counts the lecture in the course page and the Lectures list at once, only once", () => {
    const qc = new QueryClient();
    const course = { id: "k1", title: "K", completedCount: 1, totalLessons: 4, started: true, next: null, weeks: [{ num: 1, lessons: [{ id: "a", state: "done" }, { id: "b", state: "next" }], materials: [], assignments: [] }] } as unknown as CourseDetail;
    qc.setQueryData(keys.course("k1"), course);
    qc.setQueryData<CourseList>(keys.courses, { courses: [{ id: "k1", title: "K", completedCount: 1, totalLessons: 4, started: true, next: null }, { id: "k2", title: "J", completedCount: 0, totalLessons: 2, started: false, next: null }] });
    countWatched(qc, "k1", "b");
    const d = qc.getQueryData<CourseDetail>(keys.course("k1"))!;
    expect(d.completedCount).toBe(2);
    expect(d.weeks[0]!.lessons[1]!.state).toBe("done");
    expect(qc.getQueryData<CourseList>(keys.courses)!.courses.map((c) => c.completedCount)).toEqual([2, 0]);
    countWatched(qc, "k1", "a");
    expect(qc.getQueryData<CourseDetail>(keys.course("k1"))!.completedCount).toBe(2);
    expect(qc.getQueryData<CourseList>(keys.courses)!.courses[0]!.completedCount).toBe(2);
    countWatched(qc, "", "b");
  });

  it("a screen behind the lecture keeps the old value until it is in front again", async () => {
    const focused = useIsFocused as jest.Mock;
    function Probe({ v }: { v: number }) {
      return <Text testID="probe">{String(useFocusedValue(v))}</Text>;
    }
    focused.mockReturnValue(false);
    // Rendered bare, so rerender keeps the same tree (and its state).
    const view = await bare(<Probe v={25} />);
    await view.rerender(<Probe v={50} />);
    expect(screen.getByTestId("probe").props.children).toBe("25");
    focused.mockReturnValue(true);
    await view.rerender(<Probe v={50} />);
    expect(screen.getByTestId("probe").props.children).toBe("50");
    focused.mockReturnValue(true);
  });
});

describe("doubts: who answered last", () => {
  it("Waiting leaves out doubts the team already answered; older servers keep every open one", () => {
    expect(isWaiting({ status: "open", lastReplyBy: "faculty" })).toBe(false);
    expect(isWaiting({ status: "open", lastReplyBy: "student" })).toBe(true);
    expect(isWaiting({ status: "open", lastReplyBy: null })).toBe(true);
    expect(isWaiting({ status: "open" })).toBe(true);
    expect(isWaiting({ status: "solved", lastReplyBy: "student" })).toBe(false);
    expect(doubtState({ status: "open", replies: 2, lastReplyBy: "faculty" }).label).toBe("Answered");
    expect(doubtState({ status: "open", replies: 2, lastReplyBy: "student" }).label).toBe("Student replied");
    expect(doubtState({ status: "open", replies: 0, lastReplyBy: null }).label).toBe("No answer yet");
    expect(safeDoubtRow({ id: "d", lastReplyBy: "someone" }).lastReplyBy).toBeUndefined();
    expect(safeDoubtRow({ id: "d", lastReplyBy: "faculty" }).lastReplyBy).toBe("faculty");
  });

  it("an open doubt the team answered shows in All as Answered, not in Waiting", async () => {
    await signInAs("admin@example.com");
    const d = adminMock.state().doubts.find((x) => x.id === "ad1")!;
    d.replies.push({ id: "rt", author: "VIBHA team", mine: true, body: "Two points on one scale.", votes: 0, youVoted: false, isSolution: false, createdAt: new Date().toISOString() });
    await render(<AdminDoubtsScreen />);
    expect(await screen.findByTestId("doubt-ad2")).toBeTruthy();
    expect(screen.queryByTestId("doubt-ad1")).toBeNull();
    await fireEvent.press(screen.getByText("All"));
    expect(await screen.findByTestId("doubt-ad1")).toBeTruthy();
    expect(screen.getByText("Answered")).toBeTruthy();
  });
});

describe("links all go through openLink", () => {
  it("no screen calls Linking.openURL itself (a phone with no app for the link would do nothing)", () => {
    const fs = jest.requireActual<typeof import("node:fs")>("node:fs");
    const path = jest.requireActual<typeof import("node:path")>("node:path");
    const root = path.join(__dirname, "..");
    const bad: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(e.name) && !p.endsWith(path.join("lib", "open.ts")) && fs.readFileSync(p, "utf8").includes("Linking.openURL")) bad.push(path.relative(root, p));
      }
    };
    walk(path.join(root, "src"));
    walk(path.join(root, "app"));
    expect(bad).toEqual([]);
  });

  it("a notice's link that no app opens says so instead of doing nothing", async () => {
    const spy = jest.spyOn(Linking, "openURL").mockRejectedValueOnce(new Error("no app"));
    const show = jest.spyOn(toast, "show");
    expect(await openLink("tel:+911234")).toBe(false);
    expect(show).toHaveBeenCalledWith("This phone cannot make calls.");
    spy.mockRestore();
    show.mockRestore();
  });
});

describe("admin leftovers", () => {
  it("People's action bar tells a screen reader it is people, not students", async () => {
    await signInAs("admin@example.com");
    await render(<AdminPeopleScreen />);
    await screen.findByText("Tanvi Gupta");
    await fireEvent.press(screen.getByTestId("people-all"));
    const bar = await screen.findByTestId("people-bar");
    expect(bar.props.accessibilityLabel).toMatch(/^Actions for the \d+ selected people$/);
  });

  it("System: a usage label and its value wrap rather than overlap, and read as one line", async () => {
    await signInAs("admin@example.com");
    await render(<AdminSystemScreen />);
    const line = await screen.findByLabelText("Database: 155.2 MB of 500.0 MB");
    const style = Object.assign({}, ...[line.props.style].flat(3).filter(Boolean)) as { flexWrap?: string };
    expect(style.flexWrap).toBe("wrap");
  });
});
