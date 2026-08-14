import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobilePage — the single scroll surface for a mobile-first screen.
 *
 * Owns the full-viewport background and the safe-area insets so inner pages
 * (course/lesson/material/patient-session, where the shell top bar is hidden)
 * get a consistent native-app frame. Compose `MobileHeader` + `MobileSection`
 * inside; interactive islands are added by composition, so this stays a
 * Server Component.
 */
export function MobilePage({
  children,
  className,
  inset = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Apply top/bottom safe-area padding (the shell top bar is absent here). */
  inset?: boolean;
}) {
  return (
    <div
      className={cn("flex min-h-dvh w-full flex-col bg-background", className)}
      style={
        inset
          ? {
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
