// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import jsQR from "@/vendor/jsqr/jsqr";
import type { ClinicMySession, ClinicScanResult } from "@/lib/clinic/types";
import { addDays, cleanCode, clock, dayShort, duration, instantClock, scanText, timeRange } from "./format";
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

describe("scan screen", () => {
  it("sends a typed code and shows IN with the time", async () => {
    const r: ClinicScanResult = { sessionId: "s1", title: "Saturday class", direction: "in", at: "2026-11-21T04:32:00Z", late: true, minutes: null };
    const scan = vi.fn().mockResolvedValue({ ok: true, data: r });
    render(<ScanPanel scan={scan} />);
    fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "ab2xy9" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByText(/You are in at 10:02 am/)).toBeInTheDocument());
    expect(scan).toHaveBeenCalledWith({ code: "AB2XY9" });
    expect(screen.getByText("Marked late.")).toBeInTheDocument();
  });

  it("refuses a code with the wrong letters before asking the server", () => {
    const scan = vi.fn();
    render(<ScanPanel scan={scan} />);
    fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "AB0" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByRole("alert")).toHaveTextContent("The code has 6 letters and numbers.");
    expect(scan).not.toHaveBeenCalled();
  });

  it("shows the server's reason when a scan is not counted, and sends the chosen direction", async () => {
    const scan = vi.fn().mockResolvedValue({ ok: false, error: "That code is too old. Scan the one on the screen now." });
    render(<ScanPanel scan={scan} />);
    fireEvent.click(screen.getByRole("button", { name: "Out" }));
    fireEvent.change(screen.getByLabelText("Code under the QR"), { target: { value: "AB2XY9" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByText("Not counted")).toBeInTheDocument());
    expect(scan).toHaveBeenCalledWith({ code: "AB2XY9", direction: "out" });
  });
});
