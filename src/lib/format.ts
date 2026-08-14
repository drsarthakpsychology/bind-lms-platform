/**
 * Shared date/time formatting (brief §1.12). One function everywhere, no bare
 * numeric dates like "12/08/2026" (ambiguous between DD/MM and MM/DD).
 * Relative for the recent past, "12 Aug" / "12 Aug 2026" beyond a week —
 * unambiguous in every locale.
 */
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelativeTime(iso: string | Date, now: number = Date.now()): string {
  const then = (typeof iso === "string" ? new Date(iso) : iso).getTime();
  if (Number.isNaN(then)) return "";

  const diffSec = Math.round((then - now) / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 604800) return rtf.format(Math.round(diffSec / 86400), "day");

  const d = new Date(then);
  const sameYear = d.getFullYear() === new Date(now).getFullYear();
  const month = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return sameYear ? month : `${month} ${d.getFullYear()}`;
}
