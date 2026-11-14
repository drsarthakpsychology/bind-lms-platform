"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { flushSaves, onSaved } from "@/lib/save/client";
import type { SaveKind } from "@/lib/save/outbox";

/**
 * For server-rendered pages that show saved work (Home's Continue card, course
 * and module percentages, a lecture's "Watched" tick). The save of a mark made
 * a moment ago is often still on its way when the next page renders, so the
 * page showed the old value until a reload. This sends anything queued at once
 * and refreshes the page when such a save lands. Renders nothing.
 *
 * `kinds`: which saves change this page. Lecture position saves count only when
 * they complete the lecture.
 */
export function RefreshOnSave({ kinds }: { kinds: readonly SaveKind[] }) {
  const router = useRouter();
  const key = kinds.join(",");
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 250);
    };
    const offs = key.split(",").filter(Boolean).map((k) =>
      onSaved(k as SaveKind, (data) => {
        if (k === "progress" && data?.completed !== true) return;
        refresh();
      }),
    );
    void flushSaves();
    return () => {
      offs.forEach((off) => off());
      if (timer) clearTimeout(timer);
    };
  }, [key, router]);
  return null;
}
