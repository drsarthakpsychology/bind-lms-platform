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
 * The full identity: mark + "VIBHA SCHOOL OF PSYCHOLOGY" in the display case.
 * `compact` collapses the wordmark to the short name for small screens.
 */
export function VibhaWordmark({
  size = 32,
  shadow = false,
  compact = false,
  className,
}: {
  size?: number;
  shadow?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <VibhaMark size={size} shadow={shadow} />
      <span className="min-w-0 text-sm font-black tracking-[0.12em] text-foreground">
        {compact ? BRAND.shortName : BRAND.nameUppercase}
      </span>
    </span>
  );
}
