/**
 * Admin against the server's real shapes: the normalisers never crash on
 * missing or odd fields, the to-do links open the right screen, and the new
 * screens (System keys, forms email, review, certificates) work end to end
 * on the mock server, which answers in the server's own shapes.
 */
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { adminCalls } from "@/admin/api";
import { adminMock } from "@/admin/mock";
import { behindFrom, certFrom, formFrom, inboxFrom, safeActivity, safeDetail, safeHome, safeRow, safeStudent, submissionsFrom, todoHref } from "@/admin/safe";
import { AdminCertificatesScreen, correctHref } from "@/admin/screens/certificates";
import { AdminDoubtScreen } from "@/admin/screens/doubts";
import { AdminFormScreen } from "@/admin/screens/forms";
import { AdminHomeView } from "@/admin/screens/home";
import { AdminMessagesScreen } from "@/admin/screens/messages";
import { AdminReviewScreen } from "@/admin/screens/review";
import { AdminSystemScreen, keyLabelProblem } from "@/admin/screens/system";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

beforeEach(() => {
  mock.reset();
  params.mockReturnValue({});
  (router.push as jest.Mock).mockClear();
});

describe("never crash on what the server sends", () => {
  const junk: unknown[] = [null, undefined, 0, "x", [], {}, { items: null, counts: "a", live: [null, { userId: 3 }], todo: [{}], cohorts: "no" }];

  it("every normaliser takes junk and gives a usable answer", () => {
    for (const j of junk) {
      const h = safeHome(j);
      expect(Array.isArray(h.todo) && Array.isArray(h.needsLook) && Array.isArray(h.live) && Array.isArray(h.cohorts)).toBe(true);
      expect(typeof h.counts.students).toBe("number");
      expect(safeRow(j).name.length).toBeGreaterThan(0);
      expect(safeStudent(j).recent).toEqual([]);
      expect(safeDetail(j).daily).toEqual([]);
      expect(safeActivity(j).data.rows).toEqual([]);
      expect(inboxFrom(j).items).toEqual([]);
      expect(submissionsFrom(j).items).toEqual([]);
      expect(formFrom(j, "f1").respondents).toEqual([]);
      expect(certFrom(j).status).toBe("valid");
    }
  });

  it("a row with only an id still draws", () => {
    const r = safeRow({ id: "u1", email: "riya@example.com", flags: ["login", "made-up"], cohorts: [{ id: "c2" }, null] });
    expect(r).toMatchObject({ name: "riya", flags: ["login"], cohorts: [{ id: "c2", name: "Cohort" }], presence: "never" });
  });

  it("Home draws from an almost empty answer", async () => {
    await signInAs("admin@example.com");
    await render(<AdminHomeView data={safeHome({ counts: {} })} />);
    expect(screen.getByText("All clear today")).toBeTruthy();
    expect(screen.getByText("Nobody on VIBHA right now")).toBeTruthy();
  });

  it("the server's inbox becomes one list: doubts first, then emails", () => {
    const d = inboxFrom({ threads: [{ id: "d1", title: "Q", kind: "complaint", author: "A", authorId: "u1", reason: "concern", createdAt: "2026-11-15T10:00:00Z" }], emails: [{ id: "e1", fromEmail: "x@example.com", fromName: null, subject: "", body: "Hi\nthere", receivedAt: "2026-11-15T11:00:00Z" }] });
    expect(d.items.map((i) => [i.kind, i.href])).toEqual([
      ["concern", "/admin/doubt/d1"],
      ["email", "/admin/thread/e1"],
    ]);
    expect(d.emails[0]).toMatchObject({ subject: "(no subject)", from: "x@example.com" });
  });

  it("falling behind can be narrowed to a cohort", () => {
    const a = safeActivity({ behind: [{ id: "u1", name: "A", cohorts: [{ id: "c1", name: "One" }] }, { id: "u2", name: "B", cohorts: [{ id: "c2", name: "Two" }] }] });
    expect(behindFrom(a, "c2").items.map((r) => r.id)).toEqual(["u2"]);
    expect(behindFrom(a, "").cohorts).toHaveLength(2);
  });
});

describe("Home to-do links", () => {
  it("open the app's own screen, or the website when the app has none", () => {
    expect(todoHref("/admin/inbox")).toEqual({ app: "/admin/messages" });
    expect(todoHref("/admin/submissions")).toEqual({ app: "/admin/review" });
    expect(todoHref("/admin/students/logins")).toEqual({ app: "/admin/students?flag=login" });
    expect(todoHref("/admin/activity?view=behind")).toEqual({ app: "/admin/activity?view=behind" });
    expect(todoHref("/admin/people?view=follow-up")).toEqual({ app: "/admin/people?view=follow-up" });
    expect(todoHref("/admin/triage")).toEqual({ web: "/admin/triage" });
  });
});

describe("as a Super Admin", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });

  it("Messages: the inbox lists waiting doubts and email replies", async () => {
    await render(<AdminMessagesScreen />);
    expect(await screen.findByTestId("inbox-ad3")).toBeTruthy();
    expect(screen.getByTestId("inbox-i1")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("inbox-ad3"));
    expect(router.push).toHaveBeenCalledWith("/admin/doubt/ad3");
  });

  it("a doubt gets an AI draft in the box, then is posted", async () => {
    params.mockReturnValue({ id: "ad1" });
    await render(<AdminDoubtScreen />);
    await screen.findByTestId("doubt-draft");
    await fireEvent.press(screen.getByTestId("doubt-draft"));
    await waitFor(() => expect(screen.getByTestId("doubt-text").props.value).toMatch(/^Good question/));
    await fireEvent.press(screen.getByTestId("doubt-answer"));
    await waitFor(() => expect(adminMock.state().doubts.find((d) => d.id === "ad1")?.replies.length).toBe(1));
  });

  it("Review: approve as it is, or send feedback with an optional score", async () => {
    await render(<AdminReviewScreen />);
    await fireEvent.press(await screen.findByTestId("sub-s1"));
    await fireEvent.press(screen.getByTestId("grade-approve"));
    await waitFor(() => expect(adminMock.state().submissions.find((x) => x.id === "s1")?.reviewed).toBe("approved"));
    await fireEvent.press(await screen.findByTestId("sub-s2"));
    await fireEvent.press(screen.getByTestId("grade-save"));
    expect(screen.getByText("Write feedback, or approve it as it is.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("grade-feedback"), "Good notes. Add the mood rating.");
    await fireEvent.press(screen.getByTestId("grade-save"));
    await waitFor(() => expect(adminMock.state().submissions.find((x) => x.id === "s2")).toMatchObject({ reviewed: "returned", grade: null }));
  });

  it("a form: only those not emailed yet, a preview for one person, then send", async () => {
    params.mockReturnValue({ id: "f1" });
    await render(<AdminFormScreen />);
    await screen.findByTestId("resp-fr1");
    await fireEvent.press(screen.getByTestId("form-show-no"));
    await waitFor(() => expect(screen.queryByTestId("resp-fr2")).toBeNull());
    await fireEvent.press(screen.getByTestId("form-email-all"));
    await fireEvent.changeText(screen.getByTestId("contact-subject"), "Your place in Cohort Two");
    await fireEvent.press(screen.getByTestId("merge-first_name"));
    await fireEvent.press(screen.getByTestId("contact-preview-btn"));
    expect(await screen.findByTestId("contact-preview")).toBeTruthy();
    expect(screen.getByText("Ananya")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("contact-send"));
    await waitFor(() => expect(adminMock.state().forms[0]!.respondents.filter((r) => r.emailed).length).toBe(3));
  });

  it("Certificates: filter to badges, and a correction opens the studio filled in", async () => {
    await render(<AdminCertificatesScreen />);
    await screen.findByTestId("cert-VIBHA-C2-0142-SR");
    await fireEvent.press(screen.getByTestId("certs-show-badge"));
    await waitFor(() => expect(screen.queryByTestId("cert-VIBHA-C2-0142-SR")).toBeNull());
    expect(screen.getByTestId("cert-VIBHA-C2-0123-BD")).toBeTruthy();
    expect(correctHref(certFrom({ credentialId: "A-1", userId: "u1", kind: "completion", title: "Foundations" }))).toBe("/admin/certificates/new?replaces=A-1&to=u1&title=Foundations&kind=completion");
  });

  it("System: make a support key, see it once, revoke it", async () => {
    expect(keyLabelProblem(" ")).toMatch(/Give the key a name/);
    await render(<AdminSystemScreen />);
    await screen.findByTestId("key-k1");
    await fireEvent.press(screen.getByTestId("key-make"));
    await fireEvent.press(screen.getByTestId("key-create"));
    expect(screen.getByText("Give the key a name, for example who uses it.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("key-label"), "Front desk tablet");
    await fireEvent.press(screen.getByTestId("key-create"));
    expect((await screen.findByTestId("key-plain")).props.children).toMatch(/^vibha_sk_/);
    await fireEvent.press(screen.getByTestId("key-done"));
    await fireEvent.press(screen.getByTestId("key-revoke-k1"));
    await fireEvent.press(screen.getByTestId("confirm-go"));
    await waitFor(() => expect(adminMock.state().keys.find((k) => k.id === "k1")?.revokedAt).toBeTruthy());
  });

  it("messages a whole cohort without listing everyone", async () => {
    const r = await adminCalls.send({ to: "cohort", toId: "c1", title: "Results", body: "They are out." });
    expect(r.sent).toBe(2);
  });
});

describe("as a view-only admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });

  it("System shows the keys but no buttons that change them", async () => {
    await render(<AdminSystemScreen />);
    await screen.findByTestId("key-k1");
    expect(screen.queryByTestId("key-make")).toBeNull();
    expect(screen.queryByTestId("key-revoke-k1")).toBeNull();
  });

  it("the server refuses a view admin's key", async () => {
    await expect(adminCalls.makeKey("x")).rejects.toMatchObject({ code: "forbidden" });
  });
});
