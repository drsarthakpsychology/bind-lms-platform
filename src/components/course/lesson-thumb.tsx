import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonState = "next" | "done" | "started" | "open" | "live" | "later";

/**
 * A lecture "thumbnail": the video-tile people scan on YouTube, drawn in the
 * brand: a numbered tile, a play button that pops on hover, a ✓ when watched,
 * a lock when it isn't open yet. Pure markup; parent supplies `group/thumb`.
 */
export function LessonThumb({
  number,
  state,
  size = "md",
  className,
}: {
  number: number | null;
  state: LessonState;
  size?: "md" | "lg";
  className?: string;
}) {
  const locked = state === "live" || state === "later";
  const num = number ? String(number).padStart(2, "0") : "";
  // The big "continue" tile shows the play button instead of the number.
  const hero = state === "next" && size === "lg";
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 transition-[transform,box-shadow] duration-fast ease-snappy",
        locked
          ? "border-dashed border-foreground/50 bg-muted text-muted-foreground"
          : state === "next"
            ? "border-foreground bg-brand text-primary"
            : "border-foreground bg-[#111111] text-primary",
        !locked && "group-hover/thumb:-translate-x-0.5 group-hover/thumb:-translate-y-0.5 group-hover/thumb:hard-shadow-md",
        className,
      )}
    >
      {/* dot texture */}
      {!locked ? (
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.13)_1.2px,transparent_1.3px)] [background-size:12px_12px]" />
      ) : null}
      <span className="absolute top-2 left-2.5 font-pix text-[0.55rem] uppercase tracking-wide opacity-90">
        Lecture{hero && num ? ` ${num}` : ""}
      </span>
      {hero ? null : (
      <span
        className={cn(
          "relative font-pix leading-none transition-[opacity,transform] duration-base ease-snappy",
          size === "lg" ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl",
          !locked && "group-hover/thumb:scale-75 group-hover/thumb:opacity-0 group-focus-visible/thumb:scale-75 group-focus-visible/thumb:opacity-0",
        )}
      >
        {num}
      </span>
      )}
      {locked ? (
        <Lock className={cn("absolute", size === "lg" ? "size-7" : "size-5", "right-2.5 bottom-2.5")} />
      ) : (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full border-2 border-foreground bg-primary text-primary-foreground transition-[opacity,transform] duration-base ease-out-expo",
            size === "lg" ? "size-16" : "size-11",
            state === "next" && size === "lg"
              ? "translate-y-0 opacity-100 group-hover/thumb:scale-110"
              : "scale-50 opacity-0 group-hover/thumb:scale-100 group-hover/thumb:opacity-100 group-focus-visible/thumb:scale-100 group-focus-visible/thumb:opacity-100",
          )}
        >
          <Play className={cn("fill-current", size === "lg" ? "size-7 translate-x-0.5" : "size-5 translate-x-px")} />
        </span>
      )}
      {state === "done" ? (
        <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full border-2 border-foreground bg-primary text-primary-foreground">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
      {state === "done" ? (
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-primary" />
      ) : null}
    </span>
  );
}
