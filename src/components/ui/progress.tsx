"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { motion } from "@/lib/motion"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
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
        // Render AT the target value (`initial={false}`) on server + first
        // client render — previously `initial` branched on useReducedMotion()
        // (null on the server), shipping `scaleX:0` in SSR and a hydration
        // mismatch. Visible immediately, no fill-from-zero flash.
        initial={false}
        animate={{ scaleX: (value || 0) / 100 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
