import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Brutalist control: 2px border, 6px radius. Primary variants carry a hard
  // offset shadow and translate down toward it on press (interactive shadow).
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-2 border-border text-sm font-medium whitespace-nowrap transition-[transform,background-color,color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-primary text-primary-foreground hover:bg-primary/90 hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:hard-shadow-flat",
        destructive:
          "border-foreground bg-destructive text-destructive-foreground hover:bg-destructive/90 hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:hard-shadow-flat",
        danger:
          "border-foreground bg-destructive/15 text-destructive hover:bg-destructive/25 hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:hard-shadow-flat",
        outline:
          "bg-background text-foreground hover:bg-accent hover:text-accent-foreground hard-shadow-flat active:translate-x-px active:translate-y-px active:hard-shadow-none",
        secondary:
          "border-foreground bg-secondary text-secondary-foreground hover:bg-secondary/80 hard-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:hard-shadow-flat",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
