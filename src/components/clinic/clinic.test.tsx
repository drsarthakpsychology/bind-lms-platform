// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import jsQR from "@/vendor/jsqr/jsqr";
import type { ClinicMySession, ClinicScanConfirm, ClinicScanIdentify } from "@/lib/clinic/types";
import { addDays, cleanCode, clock, dayShort, duration, instantClock, scanFailure, scanText, timeRange } from "./format";
import { leaveable, overLimitLine } from "./leave-panel";
import { needsLog } from "./opd-panel";
import { qrPath } from "./qr";
import { ScanPanel } from "./scan-panel";
import { myLine, TodayBlock } from "./sessions";
import { pickReader } from "./scanner";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => undefined }) }));

const base: ClinicMySession = {
  id: "s1",
  cohortIds: ["c1"],
  date: "2026-11-18",
  start: "08:00",
  end: "10:00",
  kind: "opd_morning",
  title: "OPD morning",
  place: "Clinic, room 2",
  onlineLink: null,
  compulsory: false,
  status: "scheduled",
  origin: "timetable",
  note: null,
  movedFrom: null,
  batch: "morning",
  required: true,
  assigned: true,
  open: true,
  my: { status: "upcoming", inAt: null, outAt: null, late: false, minutes: null, leaveId: null, earlyLeaveAt: null },
};

describe("clinic words", () => {
  it("times read like people say them", () => {
    expect(clock("08:00")).toBe("8 am");
    expect(clock("17:30")).toBe("5:30 pm");
    expect(clock("12:00")).toBe("12 pm");
    expect(timeRange("08:00", "10:00")).toBe("8 to 10 am");
    expect(timeRange("11:00", "13:00")).toBe("11 am to 1 pm");
    expect(timeRange("17:00", "20:00")).toBe("5 to 8 pm");
    expect(duration(125)).toBe("2 h 5 min");
    expect(duration(45)).toBe("45 min");
  });

  it("dates use the calendar day, whatever the browser zone", () => {
    expect(dayShort("2026-11-18")).toBe("Wed 18 Nov");
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-11-16", -7)).toBe("2026-11-09");
  });

  it("instants show in India time", () => {
    expect(instantClock("2026-11-18T02:37:00Z")).toBe("8:07 am");
  });

  it("no dashes used as punctuation in the words", () => {
    expect(timeRange("08:00", "10:00")).not.toMatch(/[–—]/);
  });

  it("cleans a typed code and refuses anything else", () => {
    expect(cleanCode(" abc-def ")).toBe("ABCDEF");
    expect(cleanCode("ab2 xy9")).toBe("AB2XY9");
    expect(cleanCode("AB0XY9")).toBeNull(); // 0 is never used
    expect(cleanCode("ABCDE")).toBeNull();
  });

  it("only VIBHA attendance QR text is sent", () => {
    expect(scanText("vibha-att:1:abc:123:tok")).toBe("vibha-att:1:abc:123:tok");
    expect(scanText("https://example.com")).toBeNull();
  });
});

describe("QR drawing", () => {
  it("draws a code the fallback reader can read back", () => {
    const value = "vibha-att:1:0b7e8a3c-1111-4222-8333-944445555666:59012345:Zq3vB9xK";
    const { d, size } = qrPath(value);
    expect(size).toBeGreaterThan(20);
    // Paint the path's runs into pixels (4 px a module, quiet zone 4) and decode.
    const px = 4;
    const q = 4;
    const W = (size + q * 2) * px;
    const img = new Uint8ClampedArray(W * W * 4).fill(255);
    for (const m of d.matchAll(/M(\d+) (\d+)h(\d+)/g)) {
      const [x, y, w] = [Number(m[1]), Number(m[2]), Number(m[3])];
      for (let yy = (y + q) * px; yy < (y + q + 1) * px; yy++)
        for (let xx = (x + q) * px; xx < (x + q + w) * px; xx++) {
          const i = (yy * W + xx) * 4;
          img[i] = img[i + 1] = img[i + 2] = 0;
        }
    }
    expect(jsQR(img, W, W)?.data).toBe(value);
  });
});

describe("camera reader choice", () => {
  it("uses the browser's own reader when it knows QR codes, else the bundled one", async () => {
    class BD {
      static getSupportedFormats = async () => ["qr_code", "ean_13"];
    }
    expect(await pickReader({ BarcodeDetector: BD })).toBe("native");
    expect(await pickReader({})).toBe("fallback");
    class NoQr {
      static getSupportedFormats = async () => ["ean_13"];
    }
    expect(await pickReader({ BarcodeDetector: NoQr })).toBe("fallback");
  });
});

describe("sessions", () => {
  it("says the student's state in words", () => {
    expect(myLine(base).text).toBe("Not yet");
    expect(myLine({ ...base, required: false, assigned: false }).text).toBe("Not your day");
    expect(myLine({ ...base, my: { ...base.my, status: "in", inAt: "2026-11-18T02:45:00Z", late: true } }).text).toBe("In at 8:15 am, late");
    expect(myLine({ ...base, my: { ...base.my, status: "present", minutes: 115 } }).text).toBe("Present, 1 h 55 min");
    expect(myLine({ ...base, status: "cancelled" }).text).toBe("Cancelled");
  });

  it("Home's Today block shows the OPD day, the note and a scan link while open", () => {
    render(<TodayBlock today={{ v: 1, date: "2026-11-18", cohortId: "c1", note: "Bring your case sheets", sessions: [base], opd: { batch: "morning", start: "08:00", end: "10:00", sessionId: "s1", assignmentId: "a1" }, leavesLeft: 3, logsDue: 1 }} />);
    expect(screen.getByText("Today is your OPD day, morning 8 to 10 am.")).toBeInTheDocument();
    expect(screen.getByText("Bring your case sheets")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Scan in/ })).toHaveAttribute("href", "/attendance/scan");
    expect(screen.getByRole("link", { name: "One OPD day needs your case count" })).toBeInTheDocument();
  });

  it("Home's Today block is left out on an empty day", () => {
    const { container } = render(<TodayBlock today={{ v: 1, date: "2026-11-18", cohortId: "c1", note: null, sessions: [], opd: null, leavesLeft: 3, logsDue: 0 }} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("leave", () => {
  it("offers only upcoming required sessions not already on leave", () => {
    const list = [base, { ...base, id: "s2", required: false }, { ...base, id: "s3", my: { ...base.my, leaveId: "l1" } }, { ...base, id: "s4", status: "cancelled" as const }];
    expect(leaveable(list).map((s) => s.id)).toEqual(["s1"]);
  });

  it("says when a request goes over the limit", () => {
    expect(overLimitLine(0, 3)).toBeNull();
    expect(overLimitLine(2, 3)).toBe("Uses 2 leaves. 1 leave left after this.");
    expect(overLimitLine(3, 1)).toMatch(/over the limit/);
    expect(overLimitLine(1, 0)).toMatch(/No leaves left/);
  });
});

describe("OPD", () => {
  it("asks for a case count today and on past days with none", () => {
    const v = { assignmentId: "a", date: "2026-11-18", batch: "morning" as const, start: null, end: null, sessionId: null, log: null };
    expect(needsLog({ ...v, state: "today" })).toBe(true);
    expect(needsLog({ ...v, state: "due" })).toBe(true);
    expect(needsLog({ ...v, state: "done" })).toBe(false);
    expect(needsLog({ ...v, state: "upcoming" })).toBe(false);
  });
});

describe("scan screen: scan, choose, confirm, result", () => {
  const found = (over: Partial<ClinicScanIdentify> = {}): ClinicScanIdentify => ({
    ticket: "t1.ticket",
    ticketExpiresAt: "2026-11-21T04:34:00Z",
    now: "2026-11-21T04:32:00Z",
    session: { id: "s1", title: "Saturday class", kind: "class", date: "2026-11-21", start: "10:00", end: "13:00", place: "Room 2" },
    state: "none",
    inAt: null,
    outAt: null,
    in: { allowed: true, reason: null },
    out: { allowed: false, reason: "Mark IN first." },
    ...over,
  });
  const marked = (over: Partial<ClinicScanConfirm> = {}): ClinicScanConfirm => ({ sessionId: "s1", title: "Saturday class", direction: "in", at: "2026-11-21T04:32:00Z", already: false, message: "Marked IN at 10:02 am.", late: false, minutes: null, ...over });
  const afterIn = { state: "in" as const, inAt: "2026-11-21T04:32:00Z", in: { allowed: false, reason: "You are already IN since 10:02 am." }, out: { allowed: true, reason: null } };

  /** Type the code and wait for the two choices. */
  type PanelProps = React.ComponentProps<typeof ScanPanel>;
  async function toChoices(identify: unknown, confirm: unknown, timeoutMs?: number) {
    render(<ScanPanel identify={identify as PanelProps["identify"]} confirm={confirm as PanelProps["confirm"]} timeoutMs={timeoutMs} />);
    fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "ab2xy9" } });
    fireEvent.click(screen.getByRole("button", { name: "Check the code" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Mark IN" })).toBeInTheDocument());
  }

  it("a code only looks the session up: name, time, my state, and two choices with nothing chosen or sent", async () => {
    const identify = vi.fn().mockResolvedValue({ ok: true, data: found() });
    const confirm = vi.fn();
    await toChoices(identify, confirm);
    expect(identify).toHaveBeenCalledWith({ code: "AB2XY9" });
    expect(screen.getByRole("heading", { name: "Saturday class" })).toBeInTheDocument();
    expect(screen.getByText("Sat 21 Nov, 10 am to 1 pm, Room 2")).toBeInTheDocument();
    expect(screen.getByText("You have not marked IN yet.")).toBeInTheDocument();
    const inBtn = screen.getByRole("button", { name: "Mark IN" });
    const outBtn = screen.getByRole("button", { name: "Mark OUT" });
    expect(inBtn).toBeEnabled();
    expect(outBtn).toBeDisabled();
    expect(outBtn).toHaveAccessibleDescription("Mark IN first.");
    // IN comes before OUT, and neither is pressed or selected.
    expect(inBtn.compareDocumentPosition(outBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelector("[aria-pressed='true'], [aria-checked='true'], input[type=radio]:checked")).toBeNull();
    fireEvent.click(outBtn);
    expect(screen.queryByText(/You are marking/)).not.toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
  });

  it("choosing shows what will be marked; Cancel goes back; nothing is sent before Confirm", async () => {
    const confirm = vi.fn();
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    expect(screen.getByRole("heading", { name: "You are marking IN for Saturday class" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mark OUT" })).not.toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Mark IN" })).toBeEnabled();
    expect(confirm).not.toHaveBeenCalled();
  });

  it("Confirm locks, shows progress, sends once, then says what was recorded and when", async () => {
    let answer: (v: unknown) => void = () => undefined;
    const confirm = vi.fn(() => new Promise((r) => (answer = r)));
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    const go = screen.getByRole("button", { name: "Confirm IN" });
    fireEvent.click(go);
    fireEvent.click(go);
    const busy = await screen.findByRole("button", { name: "Sending" });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    fireEvent.click(busy);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledWith({ ticket: "t1.ticket", direction: "in", attemptId: expect.stringMatching(/^[A-Za-z0-9_-]{8,64}$/) });
    answer({ ok: true, data: marked({ late: true }) });
    await waitFor(() => expect(screen.getByRole("heading", { name: "Marked IN at 10:02 am" })).toBeInTheDocument());
    expect(screen.getByText("Saturday class")).toBeInTheDocument();
    expect(screen.getByText("Marked late.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Done" })).toHaveAttribute("href", "/attendance");
  });

  it("already in: Mark IN is off with the reason, and OUT is sent as out", async () => {
    const confirm = vi.fn().mockResolvedValue({ ok: true, data: marked({ direction: "out", at: "2026-11-21T07:30:00Z", minutes: 178 }) });
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found(afterIn) }), confirm);
    expect(screen.getByText("You are IN since 10:02 am.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark IN" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mark IN" })).toHaveAccessibleDescription("You are already IN since 10:02 am.");
    fireEvent.click(screen.getByRole("button", { name: "Mark OUT" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm OUT" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Marked OUT at 1 pm" })).toBeInTheDocument());
    expect(confirm).toHaveBeenCalledWith(expect.objectContaining({ direction: "out" }));
    expect(screen.getByText("Present for 2 h 58 min.")).toBeInTheDocument();
  });

  it("a mark that was already there is shown as it is", async () => {
    const confirm = vi.fn().mockResolvedValue({ ok: true, data: marked({ already: true }) });
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm IN" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Already marked IN at 10:02 am" })).toBeInTheDocument());
    expect(screen.getByText("Nothing was changed.")).toBeInTheDocument();
  });

  it("no internet: says it did not go through, and Try again sends the same press again", async () => {
    const confirm = vi.fn().mockRejectedValueOnce(new Error("Failed to fetch")).mockResolvedValueOnce({ ok: true, data: marked() });
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm IN" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Not marked yet" })).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent("Your IN for Saturday class did not go through.");
    expect(screen.getByRole("alert")).toHaveTextContent("It will not be sent later on its own.");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Marked IN at 10:02 am" })).toBeInTheDocument());
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(confirm.mock.calls[1]![0]).toEqual(confirm.mock.calls[0]![0]);
  });

  it("a slow network is not left spinning", async () => {
    const confirm = vi.fn(() => new Promise(() => undefined));
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm, 30);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm IN" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Not marked yet" })).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Scan again" })).toBeInTheDocument();
  });

  it("after the ticket's 2 minutes nothing is sent: scan again", async () => {
    const confirm = vi.fn();
    await toChoices(vi.fn().mockResolvedValue({ ok: true, data: found() }), confirm);
    fireEvent.click(screen.getByRole("button", { name: "Mark IN" }));
    const real = Date.now();
    const spy = vi.spyOn(Date, "now").mockReturnValue(real + 121_000);
    fireEvent.click(screen.getByRole("button", { name: "Confirm IN" }));
    spy.mockRestore();
    expect(screen.getByRole("heading", { name: "That took too long" })).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Scan again" }));
    expect(screen.getByLabelText("Code under the QR")).toBeInTheDocument();
  });

  it("every refusal has its own words", async () => {
    const cases: [string, string, string][] = [
      ["code_expired", "That code has changed. Scan the one on the screen now.", "That code has changed"],
      ["wrong_cohort", "This code is for another group's session.", "Not your session"],
      ["not_open_yet", "Saturday class is not open yet. Marking opens at 9:30 am. Scan again then.", "Not open yet"],
      ["closed", "Marking for Saturday class closed at 2 pm. Ask the admin to mark you.", "Marking is closed"],
      ["cancelled", "Saturday class was cancelled. There is nothing to mark.", "Session cancelled"],
    ];
    for (const [reason, error, title] of cases) {
      const identify = vi.fn().mockResolvedValue({ ok: false, code: "conflict", error, reason });
      const view = render(<ScanPanel identify={identify} confirm={vi.fn()} />);
      fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "AB2XY9" } });
      fireEvent.click(screen.getByRole("button", { name: "Check the code" }));
      await waitFor(() => expect(screen.getByRole("heading", { name: title })).toBeInTheDocument());
      expect(screen.getByRole("alert")).toHaveTextContent(error);
      expect(screen.getByRole("button", { name: "Scan again" })).toBeInTheDocument();
      view.unmount();
    }
    expect(scanFailure({ error: "x", code: "bad_request", reason: "ticket_expired" }).title).toBe("That took too long");
    expect(scanFailure({ error: "x", code: "bad_request", reason: "out_before_in" }).title).toBe("Mark IN first");
    expect(scanFailure({ error: "x", code: "rate_limited" }).title).toBe("Too many tries");
  });

  it("refuses a code with the wrong letters before asking the server", () => {
    const identify = vi.fn();
    render(<ScanPanel identify={identify} confirm={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "AB0" } });
    fireEvent.click(screen.getByRole("button", { name: "Check the code" }));
    expect(screen.getByRole("alert")).toHaveTextContent("The code has 6 letters and numbers.");
    expect(identify).not.toHaveBeenCalled();
  });
});
