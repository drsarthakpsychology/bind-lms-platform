import { describe, expect, it } from "vitest";
import { csvCell, csvFileName, safeCell, submissionsCsv, toCsv } from "./csv";

describe("csv cells", () => {
  it("quotes commas, quotes and new lines inside one cell", () => {
    expect(csvCell("a,b")).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("line 1\nline 2\r\nline 3")).toBe('"line 1\nline 2\r\nline 3"');
    expect(csvCell(["A", "B"])).toBe('"A, B"');
    expect(csvCell(null)).toBe('""');
  });
  it("defuses formulas but leaves phone numbers alone", () => {
    expect(safeCell("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(safeCell("@cmd")).toBe("'@cmd");
    expect(safeCell("+cmd|x")).toBe("'+cmd|x");
    expect(safeCell("+91 98765 43210")).toBe("+91 98765 43210");
    expect(safeCell("-5")).toBe("-5");
  });
  it("joins rows with CRLF", () => {
    expect(toCsv([["a", "b"], ["c,d", "e"]])).toBe('"a","b"\r\n"c,d","e"\r\n');
  });
});

describe("submissionsCsv", () => {
  it("writes every row oldest first, with removed questions as their own column", () => {
    const csv = submissionsCsv(
      [{ key: "full_name", type: "text", label: "Full Name", required: true }],
      [
        { id: "2", created_at: "2026-10-16T08:35:00Z", name: "B", email: "b@x.co", phone: null, contact_id: null, responses: { full_name: "B, Jr.", notes: "two\nlines" } },
        { id: "1", created_at: "2026-10-08T05:00:00Z", name: "A", email: "a@x.co", phone: "+91 98765 43210", contact_id: "c1", responses: { full_name: "A" } },
      ],
    );
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe('"Submitted (India time)","Name","Email","Phone","Full Name","Notes (removed)"');
    expect(lines[1]).toBe('"08 Oct 2026, 10:30","A","a@x.co","+91 98765 43210","A",""');
    expect(lines[2]).toBe('"16 Oct 2026, 14:05","B","b@x.co","","B, Jr.","two\nlines"');
    expect(lines[3]).toBe("");
  });
  it("makes a safe file name", () => {
    expect(csvFileName("St. Xavier's College, Ahmedabad - Defence", "2026-11-07")).toBe("st-xavier-s-college-ahmedabad-defence-2026-11-07.csv");
  });
});
