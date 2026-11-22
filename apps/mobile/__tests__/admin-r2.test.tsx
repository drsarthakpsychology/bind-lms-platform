/**
 * Admin screens connected on 22 Nov 2026: the Learning list rules, the Admins
 * screen (never the last Super Admin, your own rights asked twice), the
 * student page's real Learning and Access tabs, and no sample data anywhere.
 */
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { changeLine, StudentSections } from "@/admin/screens/access";
import { AdminsScreen, changeWords, roleChoices } from "@/admin/screens/admins";
import { AdminMoreScreen } from "@/admin/screens/more";
import { AdminReviewScreen } from "@/admin/screens/review";
import { LearnerScreen, learnerLine } from "@/admin/screens/learning";
import { learnerRowFrom, sortLearners, type AdminPerson } from "@/admin/live";
import { liveMock } from "@/admin/mock-live";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

const row = (p: Partial<ReturnType<typeof learnerRowFrom>>) => ({ ...learnerRowFrom({ id: "x", name: "X" }), ...p });

describe("the Learning list rules", () => {
  const rows = [
    row({ id: "a", name: "Asha", email: "asha@x.in", behind: false, progress: 80, minutes7: 10, lastActive: "2026-11-21T10:00:00Z", cohorts: [{ id: "c1", name: "One" }] }),
    row({ id: "b", name: "Bala", email: "bala@x.in", behind: true, progress: 20, minutes7: 0, lastActive: "2026-11-01T10:00:00Z", cohorts: [{ id: "c2", name: "Two" }] }),
    row({ id: "c", name: "Chitra", email: "c@x.in", behind: true, progress: 10, minutes7: 90, lastActive: null, cohorts: [{ id: "c1", name: "One" }] }),
  ];
  it("puts the most behind first", () => expect(sortLearners(rows, { sort: "behind" }).map((r) => r.id)).toEqual(["c", "b", "a"]));
  it("sorts by most active and by name", () => {
    expect(sortLearners(rows, { sort: "active" }).map((r) => r.id)).toEqual(["c", "a", "b"]);
    expect(sortLearners(rows, { sort: "name" }).map((r) => r.id)).toEqual(["a", "b", "c"]);
  });
  it("searches name and email, and filters a cohort", () => {
    expect(sortLearners(rows, { sort: "name", q: "BALA@" }).map((r) => r.id)).toEqual(["b"]);
    expect(sortLearners(rows, { sort: "name", cohort: "c1" }).map((r) => r.id)).toEqual(["a", "c"]);
  });
  it("reads a broken answer as zeros, never a crash", () => {
    const r = learnerRowFrom({ id: "z", progress: 500, avgTestPct: "x" });
    expect(r.progress).toBe(100);
    expect(r.avgTestPct).toBeNull();
    expect(learnerLine(r)).toContain("Never active");
  });
});

describe("admin rights rules", () => {
  const owner: AdminPerson = { id: "1", email: "o@x.in", name: "Owner", role: "admin", blocked: false };
  const desk: AdminPerson = { id: "2", email: "d@x.in", name: null, role: "view_admin", blocked: false };
  it("never offers to remove the last Super Admin", () => {
    const ch = roleChoices(owner, [owner, desk]);
    expect(ch.map((c) => c.to)).toEqual(["view_admin", "student", "none"]);
    expect(ch.every((c) => c.blocked)).toBe(true);
  });
  it("allows it once there is a second Super Admin", () => {
    expect(roleChoices(owner, [owner, { ...desk, role: "admin" }]).every((c) => !c.blocked)).toBe(true);
  });
  it("says exactly what changes, and warns about your own rights", () => {
    expect(changeWords(desk, "admin", false)).toMatch(/^d@x.in: View only to Super Admin/);
    expect(changeWords(owner, "none", true)).toMatch(/You will lose the right to undo this yourself/);
  });
  it("sums up access changes in one line", () => {
    expect(changeLine(null, {}, {})).toBe("Nothing chosen yet");
    expect(changeLine("lectures_only", { wall: false, notes: true }, { wall: "Wall", notes: "Study" })).toBe("Lectures only. Open: Study. Close: Wall");
  });
});

describe("as the Super Admin", () => {
  beforeAll(async () => {
    await session.boot();
    await signInAs("admin@example.com");
  });
  beforeEach(() => {
    mock.reset();
    params.mockReturnValue({});
  });

  it("Admins: changing your own rights asks twice, the only Super Admin is protected", async () => {
    await render(<AdminsScreen />);
    await fireEvent.press(await screen.findByTestId("admin-me"));
    expect(screen.getAllByText(/only Super Admin/).length).toBeGreaterThan(0);
    // The view-only admin can be made a Super Admin.
    await fireEvent.press(screen.getByText("Close"));
    await fireEvent.press(screen.getByTestId("admin-va1"));
    await fireEvent.press(screen.getByTestId("role-admin"));
    expect(screen.getByText(/View only to Super Admin/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("confirm-go"));
    await waitFor(() => expect(liveMock.state().admins.find((a) => a.id === "va1")?.role).toBe("admin"));
    // Now the owner can step down, but only after a second confirm.
    await fireEvent.press(await screen.findByTestId("admin-me"));
    await fireEvent.press(screen.getByTestId("role-view_admin"));
    await fireEvent.press(screen.getByTestId("confirm-go"));
    expect(await screen.findByText("This is your own account. Sure?")).toBeTruthy();
  });

  it("a student's Learning record and Access switches are real", async () => {
    params.mockReturnValue({ id: "u5" });
    await render(<LearnerScreen />);
    expect(await screen.findByText("Sana Khan")).toBeTruthy();
    expect(screen.getByTestId("learner-module-m01")).toBeTruthy();
    await render(<StudentSections id="u5" name="Sana Khan" />);
    await fireEvent(await screen.findByTestId("section-wall"), "valueChange", false);
    await fireEvent.press(await screen.findByTestId("confirm-go"));
    await waitFor(() => expect(liveMock.state().blocks.u5).toEqual(["wall"]));
  });

  it("Review is one plain list with no sign-offs tab, and nothing says sample data", async () => {
    await render(<AdminReviewScreen />);
    expect(screen.getByText("Assignments to mark")).toBeTruthy();
    expect(screen.queryByText(/Sign-offs/)).toBeNull();
    await render(<AdminMoreScreen />);
    expect(screen.queryByText(/sample data/i)).toBeNull();
  });
});

describe("as a view-only admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });
  it("sees no Admins row and no admins list", async () => {
    await render(<AdminMoreScreen />);
    expect(screen.queryByTestId("more-admins")).toBeNull();
    await render(<AdminsScreen />);
    expect(screen.getByText("Only a Super Admin can see this")).toBeTruthy();
  });
});
