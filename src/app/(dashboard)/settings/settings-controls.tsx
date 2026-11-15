"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useFormStatus } from "react-dom";
import { Eye, LogOut, Moon, Smile } from "lucide-react";
import { readCvd, writeCvd } from "@/lib/a11y/colour-blind";
import { useReactionsOn } from "@/components/reactions/use-reaction";
import { SwitchRow } from "@/components/v2me/switch-row";

const CVD_EVENT = "vibha:cvd-change";
function subscribeCvd(cb: () => void) {
  window.addEventListener(CVD_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CVD_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
const noop = () => () => {};

const list = "flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]";

/** Dark mode and colour-blind friendly colours. Both are kept on this device. */
export function DisplaySwitches() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser; the server draws the switch off.
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const cvd = React.useSyncExternalStore(subscribeCvd, readCvd, () => false);
  return (
    <ul className={list}>
      <SwitchRow icon={<Moon />} title="Dark mode" checked={dark} onChange={(on) => setTheme(on ? "dark" : "light")} />
      <SwitchRow
        icon={<Eye />}
        title="Colour-blind friendly colours"
        meta="Right shows blue, wrong shows orange"
        checked={cvd}
        onChange={(on) => {
          writeCvd(on);
          window.dispatchEvent(new Event(CVD_EVENT));
        }}
      />
    </ul>
  );
}

/** Funny reactions after answers. */
export function LearningSwitches() {
  const [funny, setFunny] = useReactionsOn();
  return (
    <ul className={list}>
      <SwitchRow icon={<Smile />} title="Funny reactions" meta="A meme and a cheeky line after some answers" checked={funny} onChange={setFunny} />
    </ul>
  );
}

/** Log out as a row; says so while the server signs you out. */
export function LogOutRow() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="-mx-2 flex min-h-14 w-[calc(100%+1rem)] min-w-0 cursor-pointer items-center gap-4 rounded-lg px-2 text-left type-body font-semibold text-destructive outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:opacity-60"
    >
      <LogOut className="size-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">{pending ? "Logging out…" : "Log out"}</span>
    </button>
  );
}
