"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { cn } from "@/lib/utils";

export type SetChip = { n: number; href: string; done: boolean };

const chip =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border-2 border-foreground px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";

function Chips({ sets, current, big = false, onPick }: { sets: SetChip[]; current: number; big?: boolean; onPick?: () => void }) {
  return (
    <ul className={cn(big ? "grid grid-cols-5 gap-2" : "flex flex-wrap gap-2")}>
      {sets.map((s, i) => (
        <li key={s.n}>
          <Link
            href={s.href}
            onClick={onPick}
            aria-current={i === current ? "page" : undefined}
            className={cn(chip, big && "min-h-12 w-full", i === current ? "bg-foreground text-background" : "bg-card hover:hard-shadow-sm")}
          >
            <span className="sr-only">Set </span>
            {s.n}
            {s.done ? (
              <>
                <Check className="size-3.5" aria-hidden />
                <span className="sr-only">, done</span>
              </>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The sets of a topic. Wide screens: every set as a chip. Phones: one
 * "Set 2 of 9" button that opens the chips in a bottom sheet, so a row of
 * numbers never sits above the question looking like question numbers.
 */
export function SetPicker({ sets, current }: { sets: SetChip[]; current: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <nav aria-label="Sets">
      <div className="hidden sm:block">
        <Chips sets={sets} current={current} />
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-bold sm:hidden"
      >
        Set {sets[current]?.n ?? current + 1} of {sets.length}
        <ChevronDown className="size-4" aria-hidden />
      </button>
      <MobileBottomSheet open={open} onOpenChange={setOpen} title="Pick a set">
        <Chips sets={sets} current={current} big onPick={() => setOpen(false)} />
      </MobileBottomSheet>
    </nav>
  );
}
