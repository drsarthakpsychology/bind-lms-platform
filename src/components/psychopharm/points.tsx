import { toPoints } from "@/lib/psychopharm/points";
import { cn } from "@/lib/utils";

/** A paragraph shown as short, scannable bullet points. */
export function Points({ text, className, max }: { text?: string | null; className?: string; max?: number }) {
  const pts = toPoints(text, max);
  if (!pts.length) return null;
  if (pts.length === 1) return <p className={cn("text-small", className)}>{pts[0]}</p>;
  return (
    <ul className={cn("space-y-1.5 text-small", className)}>
      {pts.map((p, i) => (
        <li key={i} className="relative pl-4 before:absolute before:top-[0.55em] before:left-0 before:size-1.5 before:rotate-45 before:bg-brand">
          {p}
        </li>
      ))}
    </ul>
  );
}
