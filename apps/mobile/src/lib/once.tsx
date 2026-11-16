import * as React from "react";

import { T, type TProps } from "@/ds/text";
import { prefs } from "./storage";

/**
 * A how-to line that shows the first time only (the website's OnceHint):
 * after it has been seen once on this phone it stays hidden.
 */
const seen = new Set<string>();
const KEY = (id: string) => `vibha.once.${id}`;

/** True the first time `id` is shown on this phone, false after that. */
export function useOnce(id: string): boolean {
  const [show, setShow] = React.useState(!seen.has(id));
  React.useEffect(() => {
    let live = true;
    void prefs
      .get(KEY(id))
      .then((v) => {
        if (v && live) setShow(false);
        seen.add(id);
        return prefs.set(KEY(id), "1");
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [id]);
  return show;
}

export function OnceHint({ id, children, ...props }: { id: string; children: string } & Omit<TProps, "children">) {
  const show = useOnce(id);
  if (!show) return null;
  return (
    <T v="small" tone="muted" {...props}>
      {children}
    </T>
  );
}
