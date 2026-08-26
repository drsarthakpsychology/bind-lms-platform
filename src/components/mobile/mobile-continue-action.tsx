import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * MobileContinueAction — the actual next meaningful step, in context.
 *
 * The mobile principle (T28): "Continue" must always represent the real next
 * action, not a generic placeholder. This component renders a prominent
 * forward control labelled with what comes next ("Next lesson", "Continue to
 * the debrief", "Next case"), plus a context line ("Lesson 3 of 8") so the
 * learner is never guessing what is ahead.
 *
 * `label` is the verb + target. `context` is the orientation line.
 * `href` renders a link (primary navigation); omit it and pass `onClick`
 * for an action button. `variant`/`size` default to the primary lg button.
 * `sticky` wraps it in MobileStickyAction for full-page flows where the
 * forward action must stay thumb-reachable.
 */
export function MobileContinueAction({
  label,
  context,
  href,
  onClick,
  variant = "default",
  size = "lg",
  sticky = false,
  className,
}: {
  label: string;
  context?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline";
  size?: "lg" | "default" | "sm";
  sticky?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <span>{label}</span>
      <ArrowRight className="size-4" aria-hidden />
    </>
  );

  const button = href ? (
    <Link href={href} className={cn(buttonVariants({ variant, size }), "w-full", className)}>
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), "w-full", className)}
    >
      {inner}
    </button>
  );

  if (sticky) {
    return (
      <div className="flex flex-col gap-1.5">
        {context ? (
          <div className="text-caption font-medium text-muted-foreground">{context}</div>
        ) : null}
        {button}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-stretch gap-1.5", className)}>
      {context ? (
        <div className="text-caption font-medium text-muted-foreground">{context}</div>
      ) : null}
      {button}
    </div>
  );
}
