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
 * MobileBottomSheet: the standard mobile bottom sheet, built on the shared
 * Radix `Sheet` (side="bottom") so focus management, Escape, and scroll-lock
 * are already handled.
 *
 * Adds the native-app trimmings the raw sheet lacks: a drag handle, an optional
 * title/description header, a scrollable body, an optional footer pinned above
 * the safe area, and rounded top corners. Controlled: the parent owns `open`.
 * A visually-hidden title is always present so the dialog stays accessible.
 *
 * Drag-to-dismiss (T55): the handle strip is a real gesture on coarse pointers
 * (touch): pulling it down translates the sheet and dismisses past ~120px or a
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
  const dragTime = React.useRef(0);
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
    dragTime.current = e.timeStamp;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = e.clientY - dragStart.current;
    // Down follows the finger 1:1; up meets soft resistance (a few px), never a hard stop.
    setDragDy(dy > 0 ? dy : -Math.min(12, Math.sqrt(-dy) * 1.5));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = e.clientY - dragStart.current;
    dragStart.current = null;
    // A flick (faster than 0.4px/ms) or a long pull dismisses; otherwise it eases back.
    const speed = dy / Math.max(1, e.timeStamp - dragTime.current);
    if (dy > 120 || (dy > 24 && speed > 0.4)) {
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
          // Rises in 300 ms, leaves in 200 ms (the 500 ms default felt slow on a phone).
          // The iOS sheet curve on the way up, a short ease-in on the way down; the same curve eases a released drag back.
          "max-h-[85dvh] gap-0 overflow-hidden rounded-t-lg border-t-2 border-foreground p-0 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:duration-200 data-[state=closed]:ease-[cubic-bezier(0.4,0,1,1)] data-[state=open]:duration-300",
          className,
        )}
        style={{
          transform: dragDy !== 0 ? `translateY(${dragDy}px)` : undefined,
          transition: dragDy !== 0 ? "none" : undefined,
        }}
      >
        {/* The drag handle strip: the touch target for drag-to-dismiss. */}
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
        <div className={cn("flex-1 overflow-y-auto overscroll-contain px-4 pt-1", footer ? "pb-4" : "pb-[max(1rem,env(safe-area-inset-bottom))]")}>{children}</div>
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
