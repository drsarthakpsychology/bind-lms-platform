"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A settings row with a switch on the right, like a phone's settings app.
 * The whole row is the control (56px tall), so it is easy to hit.
 */
export function SwitchRow({
  title,
  meta,
  icon,
  checked,
  onChange,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <li className="min-w-0">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="group/sw -mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center gap-4 rounded-lg px-2 py-2 text-left outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
      >
        {icon ? (
          <span aria-hidden className="grid size-6 shrink-0 place-items-center [&_svg]:size-5">
            {icon}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="type-body font-semibold [overflow-wrap:anywhere]">{title}</span>
          {meta ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{meta}</span> : null}
        </span>
        <span
          aria-hidden
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full border-[1.5px] transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] motion-reduce:transition-none",
            checked ? "border-foreground bg-brand dark:bg-primary" : "border-[var(--ds-card-line)] bg-[var(--ds-tint)]",
          )}
        >
          <span
            className={cn(
              "absolute top-[3px] left-[3px] size-[1.125rem] rounded-full transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] motion-reduce:transition-none",
              checked ? "translate-x-5 bg-white dark:bg-primary-foreground" : "bg-foreground/60",
            )}
          />
        </span>
      </button>
    </li>
  );
}
