import Link from "next/link";
import { BookOpen } from "lucide-react";
import { referenceHref } from "@/lib/reference/href";
import { cn } from "@/lib/utils";

/**
 * "Learn this": opens the Quick Reference entry for a diagnosis or term after
 * an answer is revealed. `show` puts the topic in the visible label; otherwise
 * it is read out to screen readers only. `newTab` is for links shown mid-game,
 * so reading never costs the game in progress. `href` sends it somewhere
 * else (a Study module or a Medicines page) instead of the Quick Reference.
 */
export function LearnLink({ topic, href, show = false, newTab = false, className }: { topic: string; href?: string; show?: boolean; newTab?: boolean; className?: string }) {
  return (
    <Link
      href={href ?? referenceHref(topic)}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-bold text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <BookOpen className="size-4 shrink-0" aria-hidden />
      <span>
        Learn this
        {show ? <>: {topic}</> : <span className="sr-only">: {topic}</span>}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
    </Link>
  );
}
