"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/** Re-reads the page every `seconds` while the tab is visible, so "live" stays live. */
export function AutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  const [at, setAt] = React.useState<string>("");
  React.useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      router.refresh();
      setAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    const id = setInterval(tick, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return (
    <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground" aria-live="polite">
      <RefreshCw className="size-3.5" aria-hidden /> Updates every {seconds}s{at ? ` · last ${at}` : ""}
    </span>
  );
}
