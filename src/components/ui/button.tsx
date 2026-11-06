import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Rounded-rectangle control (10px, --radius-input) with a 2px ink border.
  // Owner rule 2026-11-06: every button is a rounded rectangle; pills are for
  // status tags and filter chips only. Hover: a colour panel sweeps up
  // (btn-sweep), the button lifts off a hard shadow. Press: it sinks into the
  // shadow. Same language as the public homepage.
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-border text-sm font-bold whitespace-nowrap outline-none transition-[transform,background-color,color,box-shadow] duration-fast ease-snappy focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Lime action. Sweep: ink panel, lime label (dark theme: white panel, ink label).
        default:
          "btn-sweep border-foreground bg-primary text-primary-foreground hard-shadow-xs [--sweep:#111111] [--sweep-text:#cdf24b] dark:[--sweep:#ffffff] dark:[--sweep-text:#111111] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        // Blue brand fill (selected / confirm). Sweep: ink panel, white label.
        brand:
          "btn-sweep border-foreground bg-brand text-brand-foreground hard-shadow-xs [--sweep:#111111] [--sweep-text:#ffffff] dark:[--sweep:#cdf24b] dark:[--sweep-text:#111111] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        destructive:
          "border-foreground bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        danger:
          "border-destructive bg-card text-destructive hover:-translate-y-0.5 hover:bg-status-alert-bg hover:hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        // White button. Sweep: ink panel, white label (dark: lime panel, ink label).
        outline:
          "btn-sweep bg-card text-foreground [--sweep:#111111] [--sweep-text:#ffffff] dark:[--sweep:#cdf24b] dark:[--sweep-text:#111111] hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-x-px active:translate-y-px active:shadow-none",
        secondary:
          "btn-sweep border-foreground bg-secondary text-secondary-foreground [--sweep:#111111] [--sweep-text:#ffffff] dark:[--sweep:#cdf24b] dark:[--sweep-text:#111111] hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground active:translate-y-px",
        link: "border-transparent text-link underline-offset-4 hover:underline active:translate-y-px",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        xs: "h-7 gap-1 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-7 text-base has-[>svg]:px-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
