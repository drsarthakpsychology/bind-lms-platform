import * as React from "react";

/**
 * How many rows of a long list to draw now. The first `first` draw at once;
 * the rest follow in steps between frames, so a list of a thousand rows (the
 * Quick reference A to Z) opens at once and stays scrollable instead of
 * freezing the phone while every row is made. Give the list a `key` that
 * changes with its filter so a new filter starts small again.
 */
export function useProgressive(total: number, first = 60, step = 120): number {
  const [shown, setShown] = React.useState(() => Math.min(total, first));
  React.useEffect(() => {
    if (shown >= total) return;
    const id = setTimeout(() => setShown((s) => Math.min(total, s + step)), 16);
    return () => clearTimeout(id);
  }, [shown, total, step]);
  return Math.min(shown, total);
}
