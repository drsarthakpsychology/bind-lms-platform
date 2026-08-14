import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ProgressLabel — the single orientation line for sequential surfaces: a
 * compact "{unit} {current} of {total}" readout (T40: progress stays visible
 * enough to maintain orientation without dominating the screen). It inherits
 * the surrounding type scale; pass `className` to override.
 */
export function ProgressLabel({
  current,
  total,
  unit,
  className,
}: {
  current: number;
  total: number;
  unit: string;
  className?: string;
}) {
  return (
    <span className={cn(className)}>
      {unit} {current} of {total}
    </span>
  );
}
