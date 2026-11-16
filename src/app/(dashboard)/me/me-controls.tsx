"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useFormStatus } from "react-dom";
import { LogOut, Moon, ShieldCheck, Smile, Sun } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { useReactionsOn } from "@/components/reactions/use-reaction";
import { setViewMode } from "../view-mode-actions";

const row =
  "-mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 items-center gap-4 rounded-lg px-2 text-left type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:opacity-60";

/** Look and feel: dark mode and funny reactions, saved on this device. */
const noopSubscribe = () => () => {};

export function MeDisplayRows({ student }: { student: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [funny, setFunny] = useReactionsOn();
  // The theme is only known in the browser (next-themes reads it from storage);
  // the server and the first client render draw the switch off, so they match.
  const mounted = React.useSyncExternalStore(noopSubscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      <li>
        <button type="button" role="switch" aria-checked={isDark} className={row} onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <span aria-hidden className="grid size-6 shrink-0 place-items-center"><Sun className="size-5" /></span> : <span aria-hidden className="grid size-6 shrink-0 place-items-center"><Moon className="size-5" /></span>}
          <span className="min-w-0 flex-1">Dark mode</span>
          <span className="type-small text-muted-foreground">{isDark ? "On" : "Off"}</span>
        </button>
      </li>
      {student ? (
        <li>
          <button type="button" role="switch" aria-checked={funny} className={row} onClick={() => setFunny(!funny)}>
            <span aria-hidden className="grid size-6 shrink-0 place-items-center"><Smile className="size-5" /></span>
            <span className="min-w-0 flex-1">Funny reactions</span>
            <span className="type-small text-muted-foreground">{funny ? "On" : "Off"}</span>
          </button>
        </li>
      ) : null}
    </ul>
  );
}

function LogOutRow() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={row + " text-destructive"}>
      <span aria-hidden className="grid size-6 shrink-0 place-items-center"><LogOut className="size-5" /></span>
      <span className="min-w-0 flex-1">{pending ? "Logging out…" : "Log out"}</span>
    </button>
  );
}

/** Back to admin (admins previewing) and Log out. */
export function MeAccountRows({ preview }: { preview: boolean }) {
  const [busy, start] = React.useTransition();
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {preview ? (
        <li>
          <button type="button" className={row} disabled={busy} onClick={() => start(() => setViewMode("admin"))}>
            <span aria-hidden className="grid size-6 shrink-0 place-items-center"><ShieldCheck className="size-5" /></span>
            <span className="min-w-0 flex-1">Back to admin</span>
          </button>
        </li>
      ) : null}
      <li>
        <form action={logout}>
          <LogOutRow />
        </form>
      </li>
    </ul>
  );
}
