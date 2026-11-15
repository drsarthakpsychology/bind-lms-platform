import * as React from "react";

import { haptic } from "@/lib/haptics";
import { prefs } from "@/lib/storage";

/**
 * Celebrate each win once. Give it a name and the ids of what the person
 * has won (certificates, badges); it remembers on this phone which ones
 * were already celebrated and returns a counter that goes up when a new one
 * shows up, with a success haptic. Feed the counter to <Confetti fire> or
 * <Burst fire>. Nothing fires until `ids` is known (pass null while loading).
 */
export function useNewWins(name: string, ids: string[] | null): number {
  const [fire, setFire] = React.useState(0);
  const key = `vibha.wins.${name}`;
  const sig = ids ? [...ids].sort().join("|") : null;
  React.useEffect(() => {
    if (sig === null) return;
    let live = true;
    void (async () => {
      const raw = await prefs.get(key).catch(() => null);
      const seen = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
      const now = sig ? sig.split("|") : [];
      const fresh = now.filter((id) => !seen.has(id));
      if (!fresh.length || !live) return;
      await prefs.set(key, JSON.stringify([...seen, ...fresh])).catch(() => undefined);
      setTimeout(() => {
        if (!live) return;
        haptic.success();
        setFire((n) => n + 1);
      }, 450);
    })();
    return () => {
      live = false;
    };
  }, [key, sig]);
  return fire;
}
