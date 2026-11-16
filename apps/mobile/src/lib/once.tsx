import * as React from "react";

import { T, type TProps } from "@/ds/text";
import { prefs } from "./storage";

/**
 * A how-to line that shows the first time only (the website's OnceHint):
 * after it has been seen once on this phone it stays hidden.
 */
const seen = new Set<string>();
const KEY = (id: string) => `vibha.once.${id}`;

export function OnceHint({ id, children, ...props }: { id: string; children: string } & Omit<TProps, "children">) {
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
  if (!show) return null;
  return (
    <T v="small" tone="muted" {...props}>
      {children}
    </T>
  );
}
