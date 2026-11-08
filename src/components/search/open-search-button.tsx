"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens Search (the same panel as the top bar's search box). */
export function OpenSearchButton() {
  return (
    <Button type="button" variant="outline" onClick={() => window.dispatchEvent(new CustomEvent("plms:open-search"))}>
      <Search className="size-4" aria-hidden />
      Search
    </Button>
  );
}
