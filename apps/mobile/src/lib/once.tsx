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

const seen0 = new Set<string>();

/**
 * For a how-to that stays until the student has used the thing once (a
 * game's rules until the first Play): `seen` is false the first time on this
 * phone; call `mark()` when it has been used.
 */
export function useSeen(id: string): { seen: boolean; mark: () => void } {
  const [seen, setSeen] = React.useState(seen0.has(id));
  React.useEffect(() => {
    let live = true;
    void prefs
      .get(KEY(`seen.${id}`))
      .then((v) => {
        if (v && live) {
          seen0.add(id);
          setSeen(true);
        }
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [id]);
  const mark = React.useCallback(() => {
    seen0.add(id);
    void prefs.set(KEY(`seen.${id}`), "1").catch(() => undefined);
  }, [id]);
  return { seen, mark };
}
