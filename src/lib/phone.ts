/** Normalize an Indian mobile: strip +91/0/spaces/dashes, keep 10 digits. */
export function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "").replace(/^91/, "").replace(/^0/, "");
  return /^[6-9][0-9]{9}$/.test(digits) ? digits : null;
}
