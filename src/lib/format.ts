/**
 * Shared date/time formatting (brief §1.12). One function everywhere, no bare
 * numeric dates like "12/08/2026" (ambiguous between DD/MM and MM/DD).
 * Relative for the recent past, "12 Aug" / "12 Aug 2026" beyond a week:
 * unambiguous in every locale.
 */
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Every student is in India: dates are India dates, on the server (UTC) and in the browser alike. */
export const IST = "Asia/Kolkata";

/**
 * "14 Nov 2026" (or "14 Nov" with `year: false`) on the India calendar day.
 * A time just after midnight India time is already the new day, though the
 * server's own clock (UTC) is still on the old one.
 */
export function formatDateIST(iso: string | Date | null | undefined, { year = true }: { year?: boolean } = {}): string {
  if (!iso) return "";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(year ? { year: "numeric" } : {}), timeZone: IST });
}

export function formatRelativeTime(iso: string | Date, now: number = Date.now()): string {
  const then = (typeof iso === "string" ? new Date(iso) : iso).getTime();
  if (Number.isNaN(then)) return "";

  const diffSec = Math.round((then - now) / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 604800) return rtf.format(Math.round(diffSec / 86400), "day");

  const yearOf = (t: number) => new Date(t).toLocaleDateString("en-GB", { year: "numeric", timeZone: IST });
  return formatDateIST(new Date(then), { year: yearOf(then) !== yearOf(now) });
}
