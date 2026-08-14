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
 *
 * Drag-to-dismiss (T55): the handle strip is a real gesture on coarse pointers
 * (touch) — pulling it down translates the sheet and dismisses past ~120px or a
 * fast flick. On fine pointers (mouse) and reduced-motion, the handle stays a
 * quiet visual affordance and dismissal is via Escape / backdrop / the close
 * affordance, so no required action depends on an undiscoverable gesture.
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
  // Drag state lives here (the SheetContent ref is the whole panel).
  const contentRef = React.useRef<HTMLDivElement>(null);
  const dragStart = React.useRef<number | null>(null);
  const [dragDy, setDragDy] = React.useState(0);

  // Coarse pointer = touch. Fine pointers keep the handle decorative.
  const coarsePointer = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  function onPointerDown(e: React.PointerEvent) {
    if (!coarsePointer) return;
    dragStart.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = e.clientY - dragStart.current;
    if (dy > 0) setDragDy(dy);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = e.clientY - dragStart.current;
    dragStart.current = null;
    // Fast flick or past-threshold → dismiss; otherwise snap back.
    if (dy > 120 || (dy > 40 && e.detail < 2)) {
      setDragDy(0);
      onOpenChange(false);
    } else {
      setDragDy(0);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        ref={contentRef}
        side="bottom"
        className={cn(
          "max-h-[85dvh] gap-0 overflow-hidden rounded-t-lg p-0",
          className,
        )}
        style={{
          transform: dragDy > 0 ? `translateY(${dragDy}px)` : undefined,
          transition: dragDy > 0 ? "none" : undefined,
        }}
      >
        {/* The drag handle strip — the touch target for drag-to-dismiss. */}
        <div
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            dragStart.current = null;
            setDragDy(0);
          }}
          className="touch-none px-4 pt-3 pb-1"
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
        </div>
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
