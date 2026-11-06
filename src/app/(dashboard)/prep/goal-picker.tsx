"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { GOALS } from "@/lib/prep/catalog";
import type { PrepExam } from "@/lib/prep/types";
import { cn } from "@/lib/utils";
import { setGoal } from "./actions";
import { btnPrimary } from "./ui";

/** Pick (or change) the exam. One choice, one button. */
export function GoalPicker({ current, after = "/prep" }: { current: PrepExam | null; after?: string }) {
  const router = useRouter();
  const [picked, setPicked] = React.useState<PrepExam | null>(current);
  const [pending, start] = React.useTransition();
  const [failed, setFailed] = React.useState(false);

  function save() {
    if (!picked) return;
    setFailed(false);
    start(async () => {
      const r = await setGoal(picked).catch(() => ({ ok: false }));
      if (!r.ok) {
        setFailed(true);
        return;
      }
      router.push(after);
      router.refresh();
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <fieldset className="space-y-2.5">
        <legend className="sr-only">Your exam</legend>
        {GOALS.map((g) => {
          const on = picked === g.id;
          return (
            <label
              key={g.id}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-md border-2 border-foreground px-4 py-3 transition-transform duration-150 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60 motion-reduce:transition-none",
                on ? "bg-brand text-brand-foreground hard-shadow-xs" : "bg-card hover:-translate-y-0.5",
              )}
            >
              <input type="radio" name="goal" value={g.id} checked={on} onChange={() => setPicked(g.id)} className="sr-only" />
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 border-current")} aria-hidden>
                {on ? <Check className="size-4" /> : null}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{g.label}</span>
                <span className={cn("block text-sm", on ? "opacity-85" : "text-muted-foreground")}>{g.detail}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
      {failed ? (
        <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          <TriangleAlert className="size-4 shrink-0" aria-hidden /> Couldn&apos;t save. Check your connection and try again.
        </p>
      ) : null}
      <button type="submit" className={cn(btnPrimary, "w-full text-base")} disabled={!picked || pending}>
        {pending ? "Saving…" : current ? "Save" : "Continue"} <ArrowRight className="size-4" aria-hidden />
      </button>
    </form>
  );
}
