"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * MobileBottomSheet — the standard mobile bottom sheet, built on the shared
 * Radix `Sheet` (side="bottom") so focus management, Escape, and scroll-lock
 * are already handled.
 *
 * Adds the native-app trimmings the raw sheet lacks: a drag handle, an optional
 * title/description header, a scrollable body, an optional footer pinned above
 * the safe area, and rounded top corners. Controlled — the parent owns `open`.
 * A visually-hidden title is always present so the dialog stays accessible.
 */
export function MobileBottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "max-h-[85dvh] gap-0 overflow-hidden rounded-t-lg p-0",
          className,
        )}
      >
        <div
          aria-hidden
          className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-border"
        />
        {title || description ? (
          <SheetHeader className="px-4 py-3">
            <SheetTitle>{title ?? "Sheet"}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
        ) : (
          <SheetTitle className="sr-only">Sheet</SheetTitle>
        )}
        <div className="flex-1 overflow-y-auto px-4 pt-1 pb-4">{children}</div>
        {footer ? (
          <div
            className="shrink-0 border-t-2 border-border px-4 py-3"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
