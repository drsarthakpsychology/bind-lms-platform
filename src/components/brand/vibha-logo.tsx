import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

/**
 * The VIBHA mark: an abstract "observation eye".
 *
 * A bold down-V (VIBHA's V) doubles as the brow of an eye; the peach pupil
 * nested in its opening is the point of observation. Psychology is the act of
 * looking carefully, so the mark reads as "VIBHA observes" at a glance, and
 * as a plain V + focus point at 16px. Drawn with a 2px ink outline + flat
 * peach fill so it sits naturally in the neobrutalist system (hard shadow via
 * the `shadow` prop for contexts that want the sticker treatment).
 */
export function VibhaMark({
  size = 32,
  shadow = false,
  className,
}: {
  size?: number;
  shadow?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-hidden="true"
      className={className}
    >
      {shadow ? (
        <g transform="translate(3 3)">
          <path
            d="M8 8 L20 34 L32 8"
            stroke="var(--hard-shadow-color)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="17" r="5" fill="var(--hard-shadow-color)" />
        </g>
      ) : null}
      <path
        d="M8 8 L20 34 L32 8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="20"
        cy="17"
        r="5"
        fill="var(--primary)"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * The VIBHA wordmark, the same one the public website uses: "VIBHA" in the
 * heavy, wide display cut with "SCHOOL OF PSYCHOLOGY" in the pixel face under
 * it. No symbol. `tone` picks colours that keep contrast on each surface:
 * ink on white, lime on blue or ink, white on blue.
 */
export function VibhaWordmark({
  size = 32,
  compact = false,
  tone = "ink",
  className,
}: {
  /** Height of the wordmark block in px (the word scales with it). */
  size?: number;
  /** @deprecated kept for old callers; the wordmark has no sticker shadow. */
  shadow?: boolean;
  /** Hide the "School of Psychology" line. */
  compact?: boolean;
  tone?: "ink" | "lime" | "white";
  className?: string;
}) {
  const word = tone === "lime" ? "text-primary" : tone === "white" ? "text-white" : "text-foreground";
  const sub = tone === "ink" ? "text-muted-foreground" : "text-white/85";
  return (
    <span className={cn("inline-flex flex-col leading-none", className)} aria-label={BRAND.name}>
      <span className={cn("font-black tracking-tight [font-stretch:125%]", word)} style={{ fontSize: Math.round(size * 0.66) }}>
        VIBHA
      </span>
      {compact ? null : (
        <span className={cn("mt-[3px] font-pix uppercase tracking-[0.06em]", sub)} style={{ fontSize: Math.max(8, Math.round(size * 0.28)) }}>
          School of Psychology
        </span>
      )}
    </span>
  );
}
