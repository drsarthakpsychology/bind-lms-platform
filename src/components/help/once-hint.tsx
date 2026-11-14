"use client";

import * as React from "react";
import { dismissTip, useTip } from "@/lib/tips/store";

/**
 * A small how-to line that a student sees once per section, not on every page
 * of it. Give every page of the section the same `id` (for example
 * "notes-flip" on every note). It shows on the first page they open; when they
 * leave that page (or close the tab) it counts as seen and never shows again.
 * Server render and first paint show nothing, so it never flashes.
 */
export function OnceHint({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { seen } = useTip(id);
  const showing = seen === false;
  React.useEffect(() => {
    if (!showing) return;
    const done = () => dismissTip(id);
    window.addEventListener("pagehide", done);
    return () => {
      window.removeEventListener("pagehide", done);
      done();
    };
  }, [showing, id]);
  if (!showing) return null;
  return <p className={className}>{children}</p>;
}
