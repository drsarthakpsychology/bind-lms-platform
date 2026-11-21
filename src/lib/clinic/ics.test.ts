import { describe, expect, it } from "vitest";
import { buildIcs, escapeText, fold, utcStamp } from "./ics";

const NOW = Date.parse("2026-11-16T02:35:00Z");

const unfold = (s: string) => s.replace(/\r\n /g, "");
const lines = (s: string) => unfold(s).split("\r\n");

describe("ics: text", () => {
  it("escapes backslash, semicolon, comma and new lines", () => {
    expect(escapeText("a\\b;c,d\ne\r\nf")).toBe("a\\\\b\\;c\\,d\\ne\\nf");
  });

  it("folds at 75 octets with a leading space, never inside a character", () => {
    const long = `DESCRIPTION:${"x".repeat(200)}`;
    const f = fold(long);
    for (const l of f.split("\r\n")) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    expect(f.split("\r\n").slice(1).every((l) => l.startsWith(" "))).toBe(true);
    expect(unfold(f)).toBe(long);
    const hindi = `SUMMARY:${"मनोविज्ञान ".repeat(12)}`;
    const fh = fold(hindi);
    for (const l of fh.split("\r\n")) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    expect(unfold(fh)).toBe(hindi);
    expect(fold("SHORT:1")).toBe("SHORT:1");
  });

  it("stamps instants in UTC", () => {
    expect(utcStamp(NOW)).toBe("20261116T023500Z");
  });
});

describe("ics: calendar", () => {
  const out = buildIcs({
    name: "VIBHA schedule",
    description: "Your classes",
    now: NOW,
    events: [
      { uid: "s1", date: "2026-11-18", start: "08:00", end: "10:00", summary: "Your OPD day: OPD, morning", location: "Clinic, Room 2", alarmMinutes: 30, sequence: 3, updatedAt: "2026-11-15T10:00:00Z" },
      { uid: "opd-a1", date: "2026-11-20", start: null, end: null, summary: "Your OPD day, evening" },
      { uid: "s2", date: "2026-11-19", start: "10:00", end: "09:00", summary: "Typo end", url: "javascript:alert(1)" },
    ],
  });
  const L = lines(out);

  it("is CRLF, starts and ends the calendar, and names it", () => {
    expect(out.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(out.replace(/\r\n/g, "").includes("\n")).toBe(false);
    expect(L[0]).toBe("BEGIN:VCALENDAR");
    expect(L).toContain("VERSION:2.0");
    expect(L).toContain("METHOD:PUBLISH");
    expect(L).toContain("X-WR-CALNAME:VIBHA schedule");
    expect(L).toContain("X-WR-TIMEZONE:Asia/Kolkata");
    expect(L).toContain("REFRESH-INTERVAL;VALUE=DURATION:PT60M");
  });

  it("has a real India VTIMEZONE (+05:30, no daylight saving)", () => {
    const tz = L.slice(L.indexOf("BEGIN:VTIMEZONE"), L.indexOf("END:VTIMEZONE") + 1);
    expect(tz).toEqual([
      "BEGIN:VTIMEZONE",
      "TZID:Asia/Kolkata",
      "X-LIC-LOCATION:Asia/Kolkata",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0530",
      "TZOFFSETTO:+0530",
      "TZNAME:IST",
      "DTSTART:19700101T000000",
      "END:STANDARD",
      "END:VTIMEZONE",
    ]);
    expect(tz.some((l) => l.includes("DAYLIGHT"))).toBe(false);
  });

  it("writes a timed event in India time with a stable UID, reminder and escaped place", () => {
    const e = L.slice(L.indexOf("UID:s1@vibhapsychology.com") - 1, L.indexOf("END:VEVENT") + 1);
    expect(e).toEqual([
      "BEGIN:VEVENT",
      "UID:s1@vibhapsychology.com",
      "DTSTAMP:20261116T023500Z",
      "DTSTART;TZID=Asia/Kolkata:20261118T080000",
      "DTEND;TZID=Asia/Kolkata:20261118T100000",
      "SUMMARY:Your OPD day: OPD\\, morning",
      "LOCATION:Clinic\\, Room 2",
      "SEQUENCE:3",
      "LAST-MODIFIED:20261115T100000Z",
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Your OPD day: OPD\\, morning",
      "TRIGGER:-PT30M",
      "END:VALARM",
      "END:VEVENT",
    ]);
  });

  it("writes an all-day event with an exclusive end date and no reminder", () => {
    const i = L.indexOf("UID:opd-a1@vibhapsychology.com");
    expect(L[i + 2]).toBe("DTSTART;VALUE=DATE:20261120");
    expect(L[i + 3]).toBe("DTEND;VALUE=DATE:20261121");
    const block = L.slice(i, L.indexOf("END:VEVENT", i));
    expect(block).toContain("TRANSP:TRANSPARENT");
    expect(block.some((l) => l.startsWith("BEGIN:VALARM"))).toBe(false);
  });

  it("an end before the start becomes one hour; only http links go in URL", () => {
    const i = L.indexOf("UID:s2@vibhapsychology.com");
    const block = L.slice(i, L.indexOf("END:VEVENT", i));
    expect(block).toContain("DURATION:PT1H");
    expect(block.some((l) => l.startsWith("DTEND"))).toBe(false);
    expect(block.some((l) => l.startsWith("URL:"))).toBe(false);
  });

  it("an empty calendar is still a valid file", () => {
    const e = lines(buildIcs({ name: "VIBHA schedule", events: [], now: NOW }));
    expect(e).toContain("END:VTIMEZONE");
    expect(e.includes("BEGIN:VEVENT")).toBe(false);
  });
});
