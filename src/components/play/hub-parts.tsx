import { Sparkles } from "lucide-react";

/** The quiet "new cases" line under a hub title (only when the number is large). */
export function HubNote({ label }: { label: string | null }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-status-success-fg">
      <Sparkles className="size-4 shrink-0" aria-hidden /> {label}
    </span>
  );
}
