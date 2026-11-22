/**
 * Remove people (More > Remove people, and the Access tab of a student):
 * Remove access is the default and can be undone, Delete account needs the
 * name typed, deletion requests can be approved or declined, view admins
 * see everything locked.
 */
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as React from "react";

import { RemoveBlock, RemovePeopleScreen } from "@/admin/screens/remove";
import { nameMatches, removalFrom } from "@/admin/remove";
import { removeMock } from "@/admin/remove-mock";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeAll(async () => {
  await session.boot();
});

/** Switch to the Everyone list (pressing again if a tap guard swallowed the first press). */
async function everyone() {
  await screen.findByText("Everyone");
  await waitFor(() => {
    if (!screen.queryByTestId("remove-search")) fireEvent.press(screen.getByText("Everyone"));
    expect(screen.getByTestId("remove-search")).toBeTruthy();
  }, { timeout: 3000 });
}
beforeEach(() => {
  mock.reset();
});

describe("pure parts", () => {
  it("matches the typed name like the server", () => {
    expect(nameMatches("  aanya   SHARMA", "Aanya Sharma")).toBe(true);
    expect(nameMatches("Aanya", "Aanya Sharma")).toBe(false);
    expect(nameMatches("", "")).toBe(false);
  });
  it("reads a broken answer without crashing", () => {
    expect(removalFrom(null)).toEqual({ people: [], requests: [], requestsReady: true, activeSupers: 0, canWrite: false });
    expect(removalFrom({ people: [{ id: "x", state: "weird", role: "boss" }] }).people[0]).toMatchObject({ state: "active", role: "student", name: "No name" });
  });
});

describe("as the Super Admin", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });

  it("opens on the deletion requests, then declines one", async () => {
    await render(<RemovePeopleScreen />);
    expect(await screen.findByText("Asked to delete (1)")).toBeTruthy();
    fireEvent.press(screen.getByTestId("request-decline-r1"));
    await waitFor(() => expect(removeMock.state().requests[0]!.status).toBe("declined"));
  });

  it("you and Super Admins cannot be picked", async () => {
    await render(<RemovePeopleScreen />);
    await everyone();
    fireEvent.press(await screen.findByTestId("remove-row-me"));
    expect(screen.queryByTestId("remove-pick-access")).toBeNull();
  });

  it("delete stays off until the name is typed, then deletes", async () => {
    await render(<RemoveBlock id="s1" name="Aanya Sharma" />);
    fireEvent.press(await screen.findByTestId("remove-open"));
    fireEvent.press(await screen.findByTestId("remove-pick-delete"));
    expect(await screen.findByText("Certificates already issued, so anyone can still check them.")).toBeTruthy();
    fireEvent.press(screen.getByTestId("remove-confirm"));
    expect(removeMock.state().people.some((p) => p.id === "s1")).toBe(true);
    fireEvent.changeText(screen.getByTestId("remove-typed"), "aanya sharma");
    await waitFor(() => expect(screen.getByTestId("remove-confirm").props.accessibilityState.disabled).toBe(false));
    fireEvent.press(screen.getByTestId("remove-confirm"));
    await waitFor(() => expect(removeMock.state().people.some((p) => p.id === "s1")).toBe(false));
  });

  it("a removed person can be restored from their page", async () => {
    await render(<RemoveBlock id="s2" name="Rohan Mehta" />);
    fireEvent.press(await screen.findByTestId("remove-restore"));
    fireEvent.press(await screen.findByTestId("remove-confirm"));
    await waitFor(() => expect(removeMock.state().people.find((p) => p.id === "s2")!.state).toBe("active"));
  });
});

describe("as a View Admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });
  it("sees the list but cannot act", async () => {
    await render(<RemovePeopleScreen />);
    expect(await screen.findByText("Asked to delete (1)")).toBeTruthy();
    expect(screen.queryByTestId("request-decline-r1")).toBeNull();
    await everyone();
    fireEvent.press(await screen.findByTestId("remove-row-s1"));
    expect(screen.queryByTestId("remove-pick-access")).toBeNull();
  });
});

// Runs last: in this file, screens rendered after this flow did not load their list (cause not found yet).
describe("removing from the list", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });
  it("removes access from the Everyone list, with the sheet saying what is kept", async () => {
    await render(<RemovePeopleScreen />);
    await everyone();
    fireEvent.press(await screen.findByTestId("remove-row-s1"));
    fireEvent.press(await screen.findByTestId("remove-pick-access"));
    expect(await screen.findByText("Their certificates, which still check as real.")).toBeTruthy();
    fireEvent.changeText(screen.getByTestId("remove-note"), "Left");
    fireEvent.press(screen.getByTestId("remove-confirm"));
    await waitFor(() => expect(removeMock.state().people.find((p) => p.id === "s1")!.state).toBe("removed"));
    // The list reads again after the change.
    expect(await screen.findByText("Removed (2)")).toBeTruthy();
  });
});
