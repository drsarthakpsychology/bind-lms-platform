import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { accessFrom, todoHref, wallReportsFrom } from "@/admin/safe";
import { AccessSwitches } from "@/admin/screens/student";
import { AdminWallReportsScreen } from "@/admin/screens/wall-reports";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;
async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}
const put = (path: string) => mock.log().filter((l) => l.method === "PUT" && l.path === path);

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("Home to-do links keep their filter", () => {
  it("Welcome new students opens the list with Needs attention on", () => {
    expect(todoHref("/admin/students?filter=attention")).toEqual({ app: "/admin/students?attention=1" });
    expect(todoHref("/admin/students")).toEqual({ app: "/admin/students" });
    expect(todoHref("/admin/wall-reports")).toEqual({ app: "/admin/wall-reports" });
  });
});

describe("answers read safely", () => {
  it("fills what is missing", () => {
    expect(accessFrom({ sections: [{ key: "games" }, { label: "no key" }] })).toEqual({ v: 1, scope: "full", ready: true, canWrite: false, sections: [{ key: "games", label: "games", group: "Sections", off: false }] });
    expect(wallReportsFrom({ items: [{ id: "r", content: "x" }, {}] }).items).toEqual([{ id: "r", kind: "post", content: "x", reason: "No reason given", createdAt: "" }]);
  });
});

describe("a student's section switches, in the app", () => {
  it("shows what is off and switches a section and Lectures only", async () => {
    await signInAs("admin@example.com");
    await render(<AccessSwitches id="u1" name="Ananya" canWrite />);
    await waitFor(() => expect(screen.getByTestId("section-games")).toBeTruthy());
    expect(screen.getByTestId("section-games").props.accessibilityState.checked).toBe(false);
    expect(screen.getByTestId("section-wall").props.accessibilityState.checked).toBe(true);
    fireEvent.press(screen.getByTestId("section-wall"));
    await waitFor(() => expect(screen.getByTestId("section-wall").props.accessibilityState.checked).toBe(false));
    await waitFor(() => expect(put("/admin/students/u1/access")).toHaveLength(1));
    expect(put("/admin/students/u1/access")[0]!.body).toEqual({ feature: "wall", off: true });
    fireEvent.press(screen.getByTestId("section-scope"));
    await waitFor(() => expect(put("/admin/students/u1/access")).toHaveLength(2));
    expect(put("/admin/students/u1/access")[1]!.body).toEqual({ scope: "lectures_only" });
  });

  it("a view admin sees the switches but cannot move them", async () => {
    await signInAs("viewadmin@example.com");
    await render(<AccessSwitches id="u1" name="Ananya" canWrite={false} />);
    await waitFor(() => expect(screen.getByTestId("section-wall")).toBeTruthy());
    fireEvent.press(screen.getByTestId("section-wall"));
    expect(put("/admin/students/u1/access")).toHaveLength(0);
  });
});

describe("class wall reports, in the app", () => {
  it("lists reports and resolves one", async () => {
    await signInAs("admin@example.com");
    await render(<AdminWallReportsScreen />);
    await waitFor(() => expect(screen.getByText("Does anyone have the answers to the module test?")).toBeTruthy());
    expect(screen.getByText(/Asking for test answers/)).toBeTruthy();
    fireEvent.press(screen.getByTestId("resolve-wr1"));
    await waitFor(() => expect(screen.queryByTestId("report-wr1")).toBeNull());
    expect(mock.log().some((l) => l.method === "POST" && l.path === "/admin/wall-reports/wr1/resolve")).toBe(true);
    expect(screen.getByTestId("report-wr2")).toBeTruthy();
  });
});
