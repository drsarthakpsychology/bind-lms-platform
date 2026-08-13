import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border-2 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-fast ease-snappy focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-border bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-destructive/40 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/90 [a&]:hover:text-destructive-foreground",
        outline: "border-border bg-background text-foreground [a&]:hover:bg-accent",
        ghost: "border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "border-transparent text-foreground underline-offset-4 [a&]:hover:underline",
        // Statuses — derived from the existing palette, never a new hue, always
        // paired with a text label (never colour alone).
        // published  → terracotta/peach fill, ink border, dark text
        published:
          "border-foreground bg-primary text-primary-foreground",
        // draft → cream/neutral fill, ink border, muted text
        draft:
          "border-border bg-background text-muted-foreground",
        // pending → the exact amber of the "Video unavailable" notice
        pending:
          "border-status-pending-fg/40 bg-status-pending-bg text-status-pending-fg",
        // graded → deeper terracotta (alert tone family) + check icon
        graded:
          "border-foreground bg-status-alert-bg text-status-alert-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
