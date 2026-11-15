"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { setViewMode } from "../../view-mode-actions";

const row =
  "-mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 items-center gap-4 rounded-lg px-2 text-left type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:opacity-60";

function LogOutRow() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={row + " text-destructive"}>
      <span aria-hidden className="grid size-6 shrink-0 place-items-center"><LogOut className="size-5" /></span>
      <span className="min-w-0 flex-1">{pending ? "Logging out…" : "Log out"}</span>
    </button>
  );
}

/** Admin More: see the student side, and log out. */
export function MoreAccountRows() {
  const [busy, start] = React.useTransition();
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      <li>
        <button type="button" className={row} disabled={busy} onClick={() => start(() => setViewMode("student"))}>
          <span aria-hidden className="grid size-6 shrink-0 place-items-center"><GraduationCap className="size-5" /></span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span>View as student</span>
            <span className="type-small font-normal text-muted-foreground">See VIBHA the way students see it</span>
          </span>
        </button>
      </li>
      <li>
        <form action={logout}>
          <LogOutRow />
        </form>
      </li>
    </ul>
  );
}
