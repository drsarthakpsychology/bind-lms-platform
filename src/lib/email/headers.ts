/**
 * Header hygiene for outgoing mail. Subjects can carry text from an inbound
 * email or a student's name; recipients come from the database. A line break
 * in either could add headers (or recipients) on providers that build raw
 * MIME, so subjects are folded to one line and a recipient must be exactly one
 * plain address.
 */
export function oneLineSubject(s: string): string {
  return String(s ?? "").replace(/[\r\n\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 300);
}

export function isSingleAddress(to: string): boolean {
  const v = String(to ?? "").trim();
  return v.length > 3 && v.length <= 320 && /^[^\s@,;<>"()\\]+@[^\s@,;<>"()\\]+\.[^\s@,;<>"()\\]+$/.test(v);
}
