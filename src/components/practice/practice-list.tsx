import Link from "next/link";
import { ArrowRight, CircleCheck, Lock } from "lucide-react";
import { PRACTICE_ICONS, type PracticeCardData } from "./practice-groups";
import { cn } from "@/lib/utils";

const STATE_STYLE: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-secondary text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-primary text-primary-foreground" },
  done_today: { label: "Done today", className: "bg-status-success-bg text-status-success-fg" },
  due: { label: "Due", className: "bg-status-pending-bg text-status-pending-fg" },
};

/**
 * Every practice tool in one plain grid, no time groups. The student reads
 * the names (Ethics, Judgment, MSE…) and picks. Each card says what it is and
 * how long it takes; locked ones show "yet to be live".
 */
export function PracticeList({ tools }: { tools: PracticeCardData[] }) {
  if (!tools.length) {
    return <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">Nothing here yet. Your faculty will switch tools on soon.</p>;
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        const Icon = PRACTICE_ICONS[tool.icon] ?? CircleCheck;
        const chip = tool.state ? STATE_STYLE[tool.state] : null;
        const locked = tool.locked === true;
        return (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className={cn(
                "group flex h-full flex-col gap-2 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
                locked && "opacity-70",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span aria-hidden className="flex size-10 items-center justify-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                {locked ? (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/30 px-2 py-0.5 text-caption font-semibold text-muted-foreground">
                    <Lock className="size-3" aria-hidden /> Soon
                  </span>
                ) : chip ? (
                  <span className={cn("rounded-full px-2 py-0.5 text-caption font-semibold", chip.className)}>{chip.label}</span>
                ) : (
                  <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                )}
              </span>
              <span className="mt-1 block text-lg font-bold leading-tight">{tool.title}</span>
              <span className="block text-sm text-muted-foreground">{tool.description}</span>
              <span className="mt-auto block text-caption font-semibold text-link">
                {tool.time}
                {tool.progress ? ` · ${tool.progress}` : ""}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
