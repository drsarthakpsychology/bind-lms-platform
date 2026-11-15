import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";

import { adminCalls } from "@/admin/api";
import type { AdminStudentRow } from "@/admin/contract";
import type { PersonRow } from "@/admin/extra";
import { ago, attentionGroups, filterStudents, inPeopleView, NO_FILTERS, nextStep, studentsCsv } from "@/admin/format";
import { adminMock } from "@/admin/mock";
import { adminHrefFromPush } from "@/admin/push";
import { can, guarded, roleOf, VIEW_ONLY_LINE, type AdminAction } from "@/admin/role";
import { AdminComposeScreen, checkMessage } from "@/admin/screens/compose";
import { AdminDoubtScreen } from "@/admin/screens/doubts";
import { AdminHomeScreen } from "@/admin/screens/home";
import { AdminIssueScreen } from "@/admin/screens/issue";
import { AdminPersonScreen } from "@/admin/screens/people";
import { checkGrade } from "@/admin/screens/review";
import { AdminStudentScreen } from "@/admin/screens/student";
import { AdminStudentsScreen } from "@/admin/screens/students";
import { emptyDraft, stepError, toIssueInput, withKind } from "@/admin/studio";
import { viewAsStore } from "@/admin/view-as";
import { ApiFailure } from "@/api/errors";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { toast } from "@/ds/toast";
import { hrefFromPush } from "@/push";
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
  (router.back as jest.Mock).mockClear();
});

const row = (p: Partial<AdminStudentRow>): AdminStudentRow => ({ id: "x", name: "X", email: "x@example.com", rollNumber: null, mobileNumber: null, scope: "full", blocked: false, expiresAt: null, account: "active", presence: "week", lastSeen: null, cohorts: [], minutes7: 0, activeDays30: 0, lecturesDone: 0, lecturesAvailable: 8, xp: 0, flags: [], status: "active", progressPct: 0, lecturesOnly: false, cohort: null, ...p });

/* ------------------------------------------------------------ permission rules */

describe("who may do what", () => {
  const actions: AdminAction[] = ["lock", "unlock", "login-link", "allow-phone-change", "message", "reply", "answer-doubt", "hide-doubt", "grade", "sign-off", "move-stage", "issue-certificate", "revoke-certificate", "resend-certificate", "reissue-certificate", "studio-settings", "note", "invite", "mark-paid", "contact", "email-form"];

  it("maps the website roles", () => {
    expect(roleOf({ role: "admin" })).toBe("super");
    expect(roleOf({ role: "view_admin" })).toBe("view");
    expect(roleOf({ role: "student" })).toBeNull();
    expect(roleOf(null)).toBeNull();
  });

  it("lets both admins read, and only the Super Admin act", () => {
    expect(can("super", "read")).toBe(true);
    expect(can("view", "read")).toBe(true);
    expect(can(null, "read")).toBe(false);
    for (const a of actions) {
      expect(can("super", a)).toBe(true);
      expect(can("view", a)).toBe(false);
      expect(can(null, a)).toBe(false);
    }
  });

  it("refuses a view admin's action before calling the server", async () => {
    const run = jest.fn(async () => "done");
    const show = jest.spyOn(toast, "show");
    await expect(guarded("view", "lock", run)).resolves.toBeUndefined();
    expect(run).not.toHaveBeenCalled();
    expect(show).toHaveBeenCalledWith(VIEW_ONLY_LINE);
    await expect(guarded("super", "lock", run)).resolves.toBe("done");
    expect(run).toHaveBeenCalledTimes(1);
    show.mockRestore();
  });

  it("the mock server also refuses every write from a view admin, and allows reads", async () => {
    await signInAs("viewadmin@example.com");
    expect(session.store.get().me?.role).toBe("view_admin");
    await expect(adminCalls.unlock("u4")).rejects.toMatchObject({ code: "forbidden" });
    await expect(adminCalls.send({ to: "students", userIds: ["u1"], title: "Hi", body: "Hello" })).rejects.toBeInstanceOf(ApiFailure);
    await expect(adminCalls.issue({ ...toIssueInput(withKind(emptyDraft("2026-11-15"), "completion")), title: "T", recipients: [{ userId: "u1", name: "A" }] })).rejects.toMatchObject({ code: "forbidden" });
    await expect(adminCalls.moveStage("tanvi@example.com", { stage: "contacted" })).rejects.toMatchObject({ code: "forbidden" });
    expect(adminMock.state().students.find((s) => s.id === "u4")?.blocked).toBe(true);
    // Their own alert settings are theirs to change.
    await expect(adminCalls.pushPrefs({ fallingBehind: true })).resolves.toMatchObject({ fallingBehind: true });
  });

  it("a Super Admin's write goes through", async () => {
    await signInAs("admin@example.com");
    await expect(adminCalls.unlock("u4")).resolves.toEqual({ blocked: false });
    expect(adminMock.state().students.find((s) => s.id === "u4")?.account).toBe("active");
  });
});

/* ----------------------------------------------------------------- helpers */

describe("admin words and sums", () => {
  it("says how long ago", () => {
    const now = Date.parse("2026-11-15T10:00:00Z");
    expect(ago(null, now)).toBe("Never");
    expect(ago("2026-11-15T09:59:30Z", now)).toBe("Just now");
    expect(ago("2026-11-15T09:15:00Z", now)).toBe("45 min ago");
    expect(ago("2026-11-15T05:00:00Z", now)).toBe("5 h ago");
    expect(ago("2026-11-11T10:00:00Z", now)).toBe("4 d ago");
  });

  it("filters and sorts the Students list like the website", () => {
    const rows = [row({ id: "a", name: "Zoe", account: "locked", flags: ["login"], cohorts: [{ id: "c2", name: "Two" }] }), row({ id: "b", name: "Amit", presence: "now", rollNumber: "VIBHA-1" }), row({ id: "c", name: "Mira" })];
    expect(filterStudents(rows, NO_FILTERS).map((r) => r.id)).toEqual(["b", "c", "a"]);
    expect(filterStudents(rows, { ...NO_FILTERS, attention: true }).map((r) => r.id)).toEqual(["a"]);
    expect(filterStudents(rows, { ...NO_FILTERS, cohort: "none" }).map((r) => r.id)).toEqual(["b", "c"]);
    expect(filterStudents(rows, { ...NO_FILTERS, search: "vibha-1" }).map((r) => r.id)).toEqual(["b"]);
    expect(filterStudents(rows, { ...NO_FILTERS, account: "locked" }).map((r) => r.id)).toEqual(["a"]);
    expect(studentsCsv(rows).split("\n")).toHaveLength(4);
  });

  it("groups Needs a look by worry, and picks one next step", () => {
    const groups = attentionGroups([row({ id: "a", flags: ["quiet", "behind"] }), row({ id: "b", flags: ["login"] })]);
    expect(groups.map((g) => [g.flag, g.students.length])).toEqual([["login", 1], ["behind", 1], ["quiet", 1]]);
    expect(nextStep(row({ blocked: true, account: "locked" })).action).toBe("unlock");
    expect(nextStep(row({ account: "link-expired" })).action).toBe("login-link");
    expect(nextStep(row({ flags: ["behind"] })).action).toBe("message");
    expect(nextStep(row({})).action).toBeNull();
  });

  it("puts people in the pipeline's quick views", () => {
    const now = Date.parse("2026-11-15T10:00:00Z");
    const p = (x: Partial<PersonRow>): PersonRow => ({ key: "k", name: "N", email: "e", phone: null, stage: "new", followUpAt: null, enquiredAt: "2026-11-14T10:00:00Z", source: null, isStudent: false, lastTouch: "2026-11-14T10:00:00Z", invitedAt: null, paid: false, ...x });
    expect(inPeopleView(p({ stage: "fee_shared" }), "not_paid", now)).toBe(true);
    expect(inPeopleView(p({ stage: "fee_shared", paid: true }), "not_paid", now)).toBe(false);
    expect(inPeopleView(p({ invitedAt: "2026-11-10T00:00:00Z" }), "invited", now)).toBe(true);
    expect(inPeopleView(p({}), "enquired", now)).toBe(true);
    expect(inPeopleView(p({ invitedAt: "2026-11-10T00:00:00Z" }), "enquired", now)).toBe(false);
    expect(inPeopleView(p({ lastTouch: "2026-10-01T00:00:00Z" }), "quiet", now)).toBe(true);
    expect(inPeopleView(p({ stage: "joined" }), "joined", now)).toBe(true);
    expect(inPeopleView(p({ stage: "not_interested", lastTouch: "2026-10-01T00:00:00Z" }), "quiet", now)).toBe(false);
  });

  it("checks a grade and a message before sending", () => {
    expect(checkGrade("8", 10)).toEqual({ grade: 8 });
    expect(checkGrade("7,5", 10)).toEqual({ grade: 7.5 });
    expect(checkGrade("11", 10)).toHaveProperty("error");
    expect(checkGrade("7.3", 10)).toHaveProperty("error");
    expect(checkGrade("", 10)).toHaveProperty("error");
    expect(checkMessage({ userIds: [], title: "a", text: "b" })).toBe("Pick who it goes to.");
    expect(checkMessage({ userIds: ["u1"], title: " ", text: "b" })).toBe("Write a title.");
    expect(checkMessage({ userIds: ["u1"], title: "a", text: "b" })).toBeNull();
  });

  it("checks each studio step like the website's checkIssue", () => {
    const today = "2026-11-15";
    let d = emptyDraft(today);
    expect(stepError(0, d, today)).toBe("Pick a certificate type.");
    d = withKind(d, "provisional");
    expect(d.heading).toBe("Provisional Certificate");
    expect(stepError(1, d, today)).toBe("Pick at least one student.");
    d = { ...d, recipients: [{ userId: "u1", name: "Ananya Mehta" }], title: "MSE" };
    expect(stepError(2, d, today)).toBe("A provisional certificate needs a date it runs out.");
    d = { ...d, expiresOn: "2026-11-01" };
    expect(stepError(2, d, today)).toBe("The end date is before the issue date.");
    d = { ...d, expiresOn: "2027-01-31" };
    expect(stepError(2, d, today)).toBe("Add at least one person who signs.");
    d = { ...d, signatories: [{ name: "Dr. Sarthak Dave", role: "Director" }] };
    expect(stepError(2, d, today)).toBeNull();
    // A changed line is kept when the type changes; an untouched one follows the type.
    const e = withKind({ ...d, lead: "My own lead" }, "completion");
    expect(e.lead).toBe("My own lead");
    expect(e.heading).toBe("Certificate of Completion");
    expect(toIssueInput(d)).toMatchObject({ kind: "provisional", title: "MSE", expiresOn: "2027-01-31", recipients: [{ userId: "u1", name: "Ananya Mehta" }] });
  });

  it("opens the right screen for each admin notice", () => {
    expect(adminHrefFromPush({ admin: "new_doubt", id: "ad1" })).toBe("/admin/doubt/ad1");
    expect(adminHrefFromPush({ admin: "new_enquiry", id: "tanvi@example.com" })).toBe("/admin/person/tanvi%40example.com");
    expect(adminHrefFromPush({ admin: "falling_behind", id: "u3" })).toBe("/student/u3?tab=activity");
    expect(adminHrefFromPush({ admin: "falling_behind" })).toBe("/admin/activity?view=behind");
    expect(adminHrefFromPush({ notificationId: "n1" })).toBeNull();
    expect(hrefFromPush({ admin: "new_doubt", id: "ad2" })).toBe("/admin/doubt/ad2");
    expect(hrefFromPush({ notificationId: "n1" })).toBe("/notification/n1");
  });
});

/* ------------------------------------------------------------------ screens */

describe("admin screens as a Super Admin", () => {
  beforeAll(async () => {
    await signInAs("admin@example.com");
  });

  it("Home leads with Needs a look, shows who is on, and offers Send a message", async () => {
    await render(<AdminHomeScreen />);
    // The server's own to-do list, in the website's words.
    expect(await screen.findByText("Fix logins")).toBeTruthy();
    expect(screen.getByText("Grade submissions")).toBeTruthy();
    expect(screen.getByText("Sana Khan")).toBeTruthy();
    expect(screen.getByTestId("admin-compose")).toBeTruthy();
    expect(screen.queryByTestId("view-only-note")).toBeNull();
  });

  it("Students: tick two, see one action bar, lock them after a confirm", async () => {
    await render(<AdminStudentsScreen />);
    await screen.findByTestId("student-u1");
    expect(screen.queryByTestId("action-bar")).toBeNull();
    await fireEvent.press(screen.getByTestId("student-u1-check"));
    await fireEvent.press(screen.getByTestId("student-u2-check"));
    expect(screen.getByText("2 selected")).toBeTruthy();
    expect(screen.getByTestId("bulk-links")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("bulk-lock"));
    await fireEvent.press(screen.getByTestId("confirm-go"));
    await waitFor(() => expect(adminMock.state().students.find((s) => s.id === "u1")?.blocked).toBe(true));
    expect(adminMock.state().students.find((s) => s.id === "u2")?.blocked).toBe(true);
    await waitFor(() => expect(screen.queryByTestId("action-bar")).toBeNull());
  });

  it("Students: the Filters sheet narrows the list", async () => {
    await render(<AdminStudentsScreen />);
    await screen.findByTestId("student-u1");
    await fireEvent.press(screen.getByTestId("students-filters"));
    await fireEvent.press(screen.getByTestId("filter-attention"));
    await fireEvent.press(screen.getByTestId("filters-done"));
    expect(screen.queryByTestId("student-u1")).toBeNull();
    expect(screen.getByTestId("student-u3")).toBeTruthy();
  });

  it("a student's page: next step, then unlock from Access", async () => {
    params.mockReturnValue({ id: "u4", tab: "access" });
    await render(<AdminStudentScreen />);
    expect(await screen.findByText("Karan Desai")).toBeTruthy();
    expect(screen.getByText("Next: Unlock.")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("access-unlock"));
    await waitFor(() => expect(adminMock.state().students.find((s) => s.id === "u4")?.blocked).toBe(false));
  });

  it("a student's page: send a login link and allow one more phone change", async () => {
    params.mockReturnValue({ id: "u6", tab: "access" });
    await render(<AdminStudentScreen />);
    await screen.findByText("Arjun Nair");
    await fireEvent.press(screen.getByTestId("access-link"));
    expect(await screen.findByTestId("link-sheet")).toBeTruthy();
    expect(screen.getByText(/has it by email/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("access-phone"));
    await waitFor(() => expect(adminMock.state().allowed.has("u6")).toBe(true));
  });

  it("answers a doubt as the VIBHA team", async () => {
    params.mockReturnValue({ id: "ad1" });
    await render(<AdminDoubtScreen />);
    await screen.findByText("Is flat affect the same as blunted affect?");
    await fireEvent.press(screen.getByTestId("doubt-answer"));
    expect(screen.getByText("Write an answer first.")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("doubt-text"), "Blunted is reduced range; flat is almost none.");
    await fireEvent.press(screen.getByTestId("doubt-answer"));
    await waitFor(() => expect(adminMock.state().doubts.find((d) => d.id === "ad1")?.replies).toHaveLength(1));
  });

  it("moves a person in the pipeline", async () => {
    params.mockReturnValue({ key: "tanvi@example.com" });
    await render(<AdminPersonScreen />);
    await screen.findByText("Tanvi Gupta");
    await fireEvent.press(screen.getByTestId("person-stage"));
    await fireEvent.press(screen.getByTestId("stage-contacted"));
    await fireEvent.press(screen.getByTestId("stage-save"));
    await waitFor(() => expect(adminMock.state().people.find((p) => p.key === "tanvi@example.com")?.stage).toBe("contacted"));
  });

  it("sends a message to a whole cohort", async () => {
    params.mockReturnValue({ cohort: "c1", title: "Reunion" });
    await render(<AdminComposeScreen />);
    await fireEvent.changeText(screen.getByTestId("compose-body"), "See you on Friday.");
    await waitFor(() => expect(screen.getByText("Send to 2 students")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("compose-send"));
    await waitFor(() => expect(router.back).toHaveBeenCalled());
    expect(adminMock.state().batches[0]).toMatchObject({ title: "Reunion", total: 2 });
  });

  it("issues a certificate in five steps", async () => {
    params.mockReturnValue({ to: "u5" });
    await render(<AdminIssueScreen />);
    expect(screen.getByText("Step 1 of 5 · Type")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("issue-next"));
    expect(screen.getByTestId("issue-error")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("kind-recognition"));
    await fireEvent.press(screen.getByTestId("issue-next"));
    await waitFor(() => expect(screen.getByText("1 certificate to issue")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("issue-next"));
    await fireEvent.changeText(screen.getByTestId("issue-title"), "Best case presentation");
    await waitFor(() => expect(screen.getByTestId("issue-sig-0").props.value).toBe("Dr. Sarthak Dave"));
    await fireEvent.press(screen.getByTestId("issue-next"));
    expect(screen.getByTestId("cert-preview")).toBeTruthy();
    expect(screen.getAllByText("Sana Khan").length).toBeGreaterThan(0);
    await fireEvent.press(screen.getByTestId("issue-next"));
    await fireEvent.press(screen.getByTestId("issue-next"));
    expect(await screen.findByText("1 certificate issued")).toBeTruthy();
    expect(adminMock.state().certs[0]).toMatchObject({ recipient: "Sana Khan", title: "Best case presentation", kind: "recognition" });
  });
});

describe("admin screens as a view-only admin", () => {
  beforeAll(async () => {
    await signInAs("viewadmin@example.com");
  });

  it("Home has no Send a message, and says it is view-only", async () => {
    await render(<AdminHomeScreen />);
    expect(await screen.findByTestId("view-only-note")).toBeTruthy();
    expect(screen.queryByTestId("admin-compose")).toBeNull();
  });

  it("Students: ticking shows only Share list", async () => {
    await render(<AdminStudentsScreen />);
    await screen.findByTestId("student-u1");
    await fireEvent.press(screen.getByTestId("student-u1-check"));
    expect(screen.getByTestId("bulk-share")).toBeTruthy();
    expect(screen.queryByTestId("bulk-lock")).toBeNull();
    expect(screen.queryByTestId("bulk-links")).toBeNull();
    expect(screen.queryByTestId("bulk-message")).toBeNull();
  });

  it("a student's page shows no actions", async () => {
    params.mockReturnValue({ id: "u4", tab: "access" });
    await render(<AdminStudentScreen />);
    await screen.findByText("Karan Desai");
    expect(screen.queryByTestId("access-unlock")).toBeNull();
    expect(screen.queryByTestId("access-link")).toBeNull();
    expect(screen.queryByTestId("next-step-do")).toBeNull();
    expect(screen.queryByTestId("student-message")).toBeNull();
  });

  it("a doubt can be read, not answered or hidden", async () => {
    params.mockReturnValue({ id: "ad2" });
    await render(<AdminDoubtScreen />);
    await screen.findByText("When do we refer a patient for a psychiatric opinion?");
    expect(screen.getByTestId("view-only-note")).toBeTruthy();
    expect(screen.queryByTestId("doubt-answer")).toBeNull();
    expect(screen.queryByTestId("doubt-hide")).toBeNull();
  });

  it("New message and Issue certificates refuse", async () => {
    await render(<AdminComposeScreen />);
    expect(screen.getByText("View-only access")).toBeTruthy();
    expect(screen.queryByTestId("compose-send")).toBeNull();
    await render(<AdminIssueScreen />);
    expect(screen.getAllByText("View-only access").length).toBeGreaterThan(0);
    expect(screen.queryByTestId("issue-next")).toBeNull();
  });
});

describe("view as student", () => {
  it("is switched off by signing out", async () => {
    await signInAs("admin@example.com");
    act(() => viewAsStore.set({ on: true }));
    await session.signOut();
    expect(viewAsStore.get().on).toBe(false);
  });
});
