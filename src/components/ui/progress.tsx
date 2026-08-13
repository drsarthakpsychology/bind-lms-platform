"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { motion, useReducedMotion } from "@/lib/motion"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const reduce = useReducedMotion();

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-md border border-border bg-muted",
        className
      )}
      {...props}
    >
      <motion.div
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary"
        // Fill from 0 to the value on mount. Reduced-motion renders at full.
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        animate={{ scaleX: (value || 0) / 100 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
