import { parseLook } from "@/lib/leagues/shop";
import { cn } from "@/lib/utils";

/** The small initial avatar, with the frame a student bought in the shop. */
export function Avatar({ name, look, me = false }: { name: string; look: string | null; me?: boolean }) {
  const { frame } = parseLook(look);
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border-2 bg-card text-sm font-bold text-foreground",
        frame === "frame-blue" ? "border-brand ring-2 ring-brand" : frame === "frame-lime" ? "border-foreground ring-2 ring-primary" : frame === "frame-ink" ? "border-foreground outline-2 outline-offset-2 outline-foreground" : "border-foreground",
        me && !frame && "bg-background",
      )}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** A name plus its earned title, styled with the title look a student bought. */
export function NameLine({ name, title, look, me = false, onFill = false }: { name: string; title: string | null; look: string | null; me?: boolean; onFill?: boolean }) {
  const { title: t } = parseLook(look);
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate font-semibold">
        {name}
        {me ? " (you)" : ""}
      </span>
      {title ? (
        t === "title-fill" ? (
          <span className="mt-0.5 inline-block max-w-full truncate rounded-full border-2 border-foreground bg-primary px-2 text-caption font-bold text-primary-foreground">{title}</span>
        ) : (
          <span className={cn("block truncate text-caption", t === "title-blue" && !onFill ? "font-bold text-link" : onFill ? "opacity-80" : "text-muted-foreground")}>{title}</span>
        )
      ) : null}
    </span>
  );
}
