/**
 * Dose-string formatting, shared by the ladder, search chips, band detail,
 * and compare view. Previously the same broken template literal was duplicated
 * in at least three places, producing "7.5–7.5 mg" and "–50 mg".
 */
import type { BandView } from "./store";

/**
 * Render a band's dose range as a clean human string.
 *
 *   both bounds different → "20–50 mg"
 *   low === high         → "7.5 mg"
 *   low only             → "20 mg and above"
 *   high only            → "up to 50 mg"
 *   neither              → "not specified"
 */
export function formatBand(band: { low?: number | null; high?: number | null; unit?: string }): string {
  const { low, high, unit } = band;
  const unitStr = unit ?? "mg";

  if (low != null && high != null) {
    if (low === high) return `${low} ${unitStr}`;
    return `${low}–${high} ${unitStr}`;
  }
  if (low != null) return `${low} ${unitStr} and above`;
  if (high != null) return `up to ${high} ${unitStr}`;
  return "not specified";
}

/** Dose + optional frequency, e.g. "7.5 mg · at bedtime". */
export function formatDoseAndFrequency(band: Pick<BandView, "low" | "high" | "unit" | "frequency">): string {
  const dose = formatBand(band);
  if (band.frequency) return `${dose} · ${band.frequency}`;
  return dose;
}