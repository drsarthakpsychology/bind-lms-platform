"use client";

import * as React from "react";
import { flushOnExit, flushSaves, getSaveStatus, getServerSaveStatus, installStaleWatch, reloadForNewVersion, setSaveOwner, subscribeSaveStatus } from "@/lib/save/client";

const TEXT = {
  retrying: "Couldn't save, retrying",
  "signed-out": "Couldn't save. Sign in again to keep your work.",
  stale: "New version ready. Reload to keep saving.",
} as const;

/**
 * Runs the save outbox for the signed-in student (src/lib/save/client.ts) and
 * shows a small note while a save keeps failing. Mounted once by the dashboard
 * layout. Renders nothing while everything is saved.
 */
export function SaveStatus({ owner }: { owner: string }) {
  const status = React.useSyncExternalStore(subscribeSaveStatus, getSaveStatus, getServerSaveStatus);

  React.useEffect(() => {
    installStaleWatch();
    setSaveOwner(owner);
    const wake = () => void flushSaves();
    const onVis = () => {
      if (document.visibilityState === "hidden") void flushSaves({ keepalive: true });
      else wake();
    };
    window.addEventListener("online", wake);
    window.addEventListener("pagehide", flushOnExit);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("online", wake);
      window.removeEventListener("pagehide", flushOnExit);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [owner]);

  if (status === "idle") return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[10px] border-2 border-foreground bg-card px-3 py-2 text-sm font-medium text-foreground hard-shadow-sm"
    >
      <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />
      <span>{TEXT[status]}</span>
      {status === "stale" ? (
        <button
          type="button"
          onClick={() => void reloadForNewVersion()}
          className="rounded-[10px] border-2 border-foreground bg-primary px-2.5 py-0.5 text-sm font-semibold text-primary-foreground"
        >
          Reload
        </button>
      ) : null}
    </div>
  );
}
