/**
 * The calendar file (iCalendar, RFC 5545) a student's phone subscribes to.
 * Pure: no database, no clock (the caller passes `now`), so the output is
 * tested byte for byte.
 *
 * Times are India time with a real VTIMEZONE block (Asia/Kolkata, +05:30, no
 * daylight saving), so Google Calendar and Apple Calendar show the right hour
 * wherever the phone is. Every event's UID is the session's id, so a moved
 * session moves in the calendar and a cancelled one (left out of the feed)
 * disappears on the next refresh.
 */

export const ICS_TZID = "Asia/Kolkata";
const UID_HOST = "vibhapsychology.com";

export type IcsEvent = {
  /** Stable across refreshes: the session id (or "opd-<assignment id>"). */
  uid: string;
  /** "YYYY-MM-DD", India time. */
  date: string;
  /** "HH:MM", India time. Both null for an all-day event. */
  start: string | null;
  end: string | null;
  summary: string;
  description?: string | null;
  location?: string | null;
  url?: string | null;
  /** Raised when the session moved, so calendars take the new time. */
  sequence?: number;
  /** ISO time the row last changed. */
  updatedAt?: string | null;
  /** A reminder this many minutes before (timed events only). */
  alarmMinutes?: number | null;
  /** Shows as free time (on leave). */
  free?: boolean;
};

export type IcsCalendar = {
  name: string;
  description?: string;
  /** How often calendars should fetch again, in minutes. */
  refreshMinutes?: number;
  events: readonly IcsEvent[];
  /** Instant used for DTSTAMP. */
  now: number;
};

/** Text values: backslash, semicolon, comma and new lines escaped (RFC 5545 3.3.11). */
export function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * One content line folded at 75 octets (RFC 5545 3.1): each extra line starts
 * with a space. Never splits a multi-byte character.
 */
export function fold(line: string): string {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  let limit = 75;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
      limit = 74; // the leading space takes one octet
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** "20261118T080000Z" for an instant. */
export function utcStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const localStamp = (date: string, time: string) => `${date.replace(/-/g, "")}T${time.replace(":", "").slice(0, 4)}00`;
const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10).replace(/-/g, "");

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${ICS_TZID}`,
  `X-LIC-LOCATION:${ICS_TZID}`,
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0530",
  "TZOFFSETTO:+0530",
  "TZNAME:IST",
  "DTSTART:19700101T000000",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function eventLines(e: IcsEvent, stamp: string): string[] {
  const timed = Boolean(e.start && e.end);
  const lines = ["BEGIN:VEVENT", `UID:${e.uid}@${UID_HOST}`, `DTSTAMP:${stamp}`];
  if (timed) {
    lines.push(`DTSTART;TZID=${ICS_TZID}:${localStamp(e.date, e.start!)}`);
    // An end at or before the start (a typo) would be refused by some calendars: keep it after.
    const end = e.end! > e.start! ? e.end! : e.start!;
    lines.push(e.end! > e.start! ? `DTEND;TZID=${ICS_TZID}:${localStamp(e.date, end)}` : "DURATION:PT1H");
  } else {
    lines.push(`DTSTART;VALUE=DATE:${e.date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${nextDay(e.date)}`);
  }
  lines.push(`SUMMARY:${escapeText(e.summary)}`);
  if (e.description) lines.push(`DESCRIPTION:${escapeText(e.description)}`);
  if (e.location) lines.push(`LOCATION:${escapeText(e.location)}`);
  if (e.url && /^https?:\/\//i.test(e.url)) lines.push(`URL:${e.url.replace(/[\r\n]/g, "")}`);
  lines.push(`SEQUENCE:${Math.max(0, Math.floor(e.sequence ?? 0))}`);
  if (e.updatedAt && !Number.isNaN(Date.parse(e.updatedAt))) lines.push(`LAST-MODIFIED:${utcStamp(Date.parse(e.updatedAt))}`);
  lines.push("STATUS:CONFIRMED", `TRANSP:${e.free || !timed ? "TRANSPARENT" : "OPAQUE"}`);
  if (timed && e.alarmMinutes && e.alarmMinutes > 0) {
    lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(e.summary)}`, `TRIGGER:-PT${Math.floor(e.alarmMinutes)}M`, "END:VALARM");
  }
  lines.push("END:VEVENT");
  return lines;
}

/** The whole calendar file, CRLF line ends, folded. */
export function buildIcs(cal: IcsCalendar): string {
  const stamp = utcStamp(cal.now);
  const refresh = Math.max(15, Math.floor(cal.refreshMinutes ?? 60));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VIBHA School of Psychology//Clinic schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `NAME:${escapeText(cal.name)}`,
    `X-WR-CALNAME:${escapeText(cal.name)}`,
    ...(cal.description ? [`X-WR-CALDESC:${escapeText(cal.description)}`] : []),
    `X-WR-TIMEZONE:${ICS_TZID}`,
    `REFRESH-INTERVAL;VALUE=DURATION:PT${refresh}M`,
    `X-PUBLISHED-TTL:PT${refresh}M`,
    ...VTIMEZONE,
    ...cal.events.flatMap((e) => eventLines(e, stamp)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
