import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { adminMock } from "@/admin/mock";
import { certTypesFrom, cohortFrom, drawingFrom, signOffsFrom, studentMessagesFrom, studioSettingsFrom } from "@/admin/safe";
import { AdminAnyoneScreen, anyoneProblem } from "@/admin/screens/anyone";
import { AdminCertificatesScreen } from "@/admin/screens/certificates";
import { AdminCohortScreen, AdminCohortsScreen } from "@/admin/screens/cohorts";
import { AdminAlertsScreen } from "@/admin/screens/more";
import { AdminReviewScreen } from "@/admin/screens/review";
import { AdminSystemScreen } from "@/admin/screens/system";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { toast } from "@/ds/toast";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

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
  (router.push as jest.Mock).mockClear();
});

describe("round two answers read safely", () => {
  it("fills what is missing and drops what it cannot draw", () => {
    expect(cohortFrom({ people: [{ id: "u1", email: "a@x.org" }] }, "c9")).toMatchObject({ id: "c9", name: "Cohort", status: "active", people: [{ id: "u1", name: "a", presence: "never", account: "active" }], messages: [], sessions: [] });
    expect(studentMessagesFrom({ items: [{ id: "a", from: "odd", opened: true }] }).items[0]).toMatchObject({ from: "bell", state: "Opened", failed: false });
    expect(signOffsFrom({ items: [{ id: "s", studentEmail: "neha@x.org" }] }).items[0]).toMatchObject({ studentName: "neha", supervisor: null, status: "requested" });
    expect(studioSettingsFrom({ signatories: [{ name: "A" }, { name: "" }, { name: "B" }, { name: "C" }, { name: "D" }] }).signatories.map((s) => s.name)).toEqual(["A", "B", "C"]);
    expect(certTypesFrom({ items: [{ id: "t", rule: { kind: "magic" } }, { id: "u", rule: { kind: "xp", min: -5 } }] }).items.map((t) => t.rule)).toEqual([null, { kind: "xp", min: 1 }]);
    const d = drawingFrom({ ops: [{ k: "rect", x: 1 }, { k: "path" }, { k: "text", value: "x" }, { k: "path", d: "M0 0", fill: "#000" }], images: { sig0: 3 } });
    expect(d.ops.map((o) => o.k)).toEqual(["rect", "path"]);
    expect(d.images).toEqual({ sig0: null });
    expect(d.width).toBe(842);
  });

  it("checks a no-account certificate as the website does", () => {
    const ok = { name: "Guest", email: "g@x.org", title: "Talk", paragraph: "Gave a talk" };
    expect(anyoneProblem(ok)).toBeNull();
    expect(anyoneProblem({ ...ok, name: " " })).toBe("Type their name.");
    expect(anyoneProblem({ ...ok, email: "nope" })).toBe("Type a real email address.");
    expect(anyoneProblem({ ...ok, paragraph: "" })).toBe("Write a few lines about what they did.");
    expect(anyoneProblem({ ...ok, issuedOn: "16/11" })).toBe("Write the date as yyyy-mm-dd.");
  });
});

describe("as a Super Admin", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });

  it("cohorts list and one cohort with its messages", async () => {
    await render(<AdminCohortsScreen />);
    expect(await screen.findByTestId("cohort-c2")).toBeTruthy();
    params.mockReturnValue({ id: "c2" });
    await render(<AdminCohortScreen />);
    expect(await screen.findByTestId("cohort-message")).toBeTruthy();
  });

  it("changes a type's rule and switches it off", async () => {
    params.mockReturnValue({ tab: "types" });
    await render(<AdminCertificatesScreen />);
    await fireEvent.press(await screen.findByTestId("type-row-t1"));
    await fireEvent.press(screen.getByTestId("type-edit"));
    await fireEvent.press(screen.getByTestId("rule-xp"));
    await fireEvent.changeText(screen.getByTestId("rule-xp-min"), "250");
    await fireEvent.press(screen.getByTestId("type-save"));
    await waitFor(() => expect(adminMock.state().types.find((t) => t.id === "t1")?.rule).toEqual({ kind: "xp", min: 250 }));
    await fireEvent.press(await screen.findByTestId("type-row-t2"));
    await fireEvent.press(screen.getByTestId("type-enabled"));
    await waitFor(() => expect(adminMock.state().types.find((t) => t.id === "t2")?.enabled).toBe(false));
    // The signature store's holder types are not listed.
    expect(screen.queryByTestId("type-row-t4")).toBeNull();
  });

  it("makes course certificate drafts for who qualifies", async () => {
    params.mockReturnValue({ tab: "types" });
    await render(<AdminCertificatesScreen />);
    await fireEvent.press(await screen.findByTestId("type-row-t3"));
    await fireEvent.press(screen.getByTestId("type-eligible"));
    const first = (await screen.findAllByTestId(/^eligible-u/))[0]!;
    await fireEvent.press(first);
    const show = jest.spyOn(toast, "show");
    await fireEvent.press(screen.getByTestId("eligible-make"));
    await waitFor(() => expect(show).toHaveBeenCalledWith("1 draft ready in Issued"));
  });

  it("saves who signs with a signature image", async () => {
    params.mockReturnValue({ tab: "settings" });
    await render(<AdminCertificatesScreen />);
    await fireEvent.changeText(await screen.findByTestId("settings-sig-name-0"), "Kavya Bothra");
    await fireEvent.press(screen.getByTestId("settings-save"));
    await waitFor(() => expect(adminMock.state().studio.signatories).toEqual([{ name: "Kavya Bothra", role: "Director, VIBHA School of Psychology", signatureFrom: "sig-sd" }]));
    expect(screen.getByTestId("signature-sig-sd")).toBeTruthy();
    expect(screen.getByText("8 of 100")).toBeTruthy();
  });

  it("issues to someone without an account after a confirm", async () => {
    await render(<AdminAnyoneScreen />);
    await fireEvent.press(screen.getByTestId("anyone-issue"));
    expect(screen.getByTestId("anyone-error")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("anyone-name"), "Dr. Rao");
    await fireEvent.changeText(screen.getByTestId("anyone-email"), "rao@example.com");
    await fireEvent.changeText(screen.getByTestId("anyone-title"), "Guest lecture");
    await fireEvent.changeText(screen.getByTestId("anyone-paragraph"), "Spoke on child assessment.");
    await fireEvent.press(screen.getByTestId("anyone-issue"));
    await fireEvent.press(await screen.findByTestId("confirm-go"));
    expect(await screen.findByTestId("anyone-done")).toBeTruthy();
    expect(screen.getByText("VIBHA-ANY-0001")).toBeTruthy();
  });

  it("signs a supervision entry", async () => {
    params.mockReturnValue({ tab: "signoffs" });
    await render(<AdminReviewScreen />);
    await fireEvent.press(await screen.findByText("Observed intake interviews at the clinic"));
    await fireEvent.press(screen.getByTestId("signoff-sign"));
    await waitFor(() => expect(adminMock.state().signoffs[0]?.status).toBe("signed"));
  });

  it("System lists recent key sign-ins; Alerts offers only notices the server sends", async () => {
    await render(<AdminSystemScreen />);
    expect(await screen.findByText("Recent sign-ins with a key")).toBeTruthy();
    await render(<AdminAlertsScreen />);
    expect(await screen.findByTestId("alert-new_doubt")).toBeTruthy();
    expect(screen.queryByTestId("alert-falling_behind")).toBeNull();
  });
});

describe("as a view-only admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });

  it("reads types and settings without write buttons, and cannot open the no-account form", async () => {
    params.mockReturnValue({ tab: "types" });
    await render(<AdminCertificatesScreen />);
    await fireEvent.press(await screen.findByTestId("type-row-t1"));
    expect(screen.queryByTestId("type-edit")).toBeNull();
    expect(screen.queryByTestId("type-new")).toBeNull();
    await render(<AdminAnyoneScreen />);
    expect(screen.getByText("View-only access")).toBeTruthy();
  });
});
