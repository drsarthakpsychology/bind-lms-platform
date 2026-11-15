"use client";

import * as React from "react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { cn } from "@/lib/utils";

/**
 * A row-shaped button that opens a bottom sheet (300ms in, 200ms out, drag to
 * close on touch). The trigger is the only thing on the page; the detail lives
 * in the sheet, so the screen keeps one focus.
 */
export function SheetRow({
  trigger,
  label,
  title,
  children,
  className,
}: {
  /** What the row shows (one line). */
  trigger: React.ReactNode;
  /** The trigger's accessible name. */
  label: string;
  /** The sheet's heading. */
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen(true)}
        className={cn(
          "-mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 items-center gap-3 rounded-lg px-2 text-left outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]",
          className,
        )}
      >
        {trigger}
      </button>
      <MobileBottomSheet open={open} onOpenChange={setOpen} title={title} className="mx-auto max-w-xl">
        {children}
      </MobileBottomSheet>
    </>
  );
}
