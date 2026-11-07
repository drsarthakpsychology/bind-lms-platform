import { answerColumns, answerText, type FormField } from "./fields";

/**
 * Spreadsheet export for form answers. Excel friendly: every cell quoted
 * (commas, quotes and line breaks stay inside their cell), CRLF between
 * rows, and the route adds a UTF-8 byte order mark so Excel reads Hindi,
 * Gujarati and accented names correctly.
 */

/** Cells that a spreadsheet would run as a formula get a leading apostrophe. Phone numbers like +91 98765 43210 are left alone. */
export function safeCell(v: string): string {
  if (/^[=@\t\r]/.test(v)) return `'${v}`;
  if (/^[+-]/.test(v) && !/^[+-][\d\s().-]*$/.test(v)) return `'${v}`;
  return v;
}

export function csvCell(v: unknown): string {
  return `"${safeCell(answerText(v)).replace(/"/g, '""')}"`;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export type SubmissionRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  contact_id: string | null;
  responses: Record<string, unknown> | null;
};

/** "16 Oct 2026, 14:05" in India time. */
export function istStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Every answer, oldest first, with removed questions kept as their own columns. */
export function submissionsCsv(fields: FormField[], rows: SubmissionRow[]): string {
  const cols = answerColumns(fields, rows.map((r) => r.responses));
  const head = ["Submitted (India time)", "Name", "Email", "Phone", ...cols.map((c) => (c.removed ? `${c.label} (removed)` : c.label))];
  const body = [...rows]
    .sort((a, b) => (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0))
    .map((r) => [istStamp(r.created_at), r.name ?? "", r.email ?? "", r.phone ?? "", ...cols.map((c) => r.responses?.[c.key] ?? "")]);
  return toCsv([head, ...body]);
}

/** A safe file name from the form title. */
export function csvFileName(title: string, today: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "form";
  return `${base}-${today}.csv`;
}
