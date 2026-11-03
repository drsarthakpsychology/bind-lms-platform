/**
 * Normalize an Indian mobile to its 10 digits (starting 6-9).
 *
 * Accepts the many shapes people actually type: "98765 43210", "+91 98765 43210",
 * "0091-98765-43210", "098765 43210". A country code (91) or leading zeros are
 * removed ONLY when doing so leaves exactly 10 digits — so a genuine number that
 * happens to start with 9 then 1 (e.g. 9123456789) is kept, not mangled. Returns
 * null only when the result isn't a real 10-digit Indian mobile.
 */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = String(raw ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  return /^[6-9][0-9]{9}$/.test(digits) ? digits : null;
}
