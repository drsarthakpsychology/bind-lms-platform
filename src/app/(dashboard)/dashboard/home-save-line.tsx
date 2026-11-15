"use client";

import * as React from "react";
import { getSaveStatus, getServerSaveStatus, subscribeSaveStatus } from "@/lib/save/client";

/** One quiet line under the hero while a save is still on its way. */
export function HomeSaveLine() {
  const status = React.useSyncExternalStore(subscribeSaveStatus, getSaveStatus, getServerSaveStatus);
  if (status !== "retrying") return null;
  return (
    <p role="status" className="type-small text-muted-foreground">
      Couldn&apos;t save, retrying
    </p>
  );
}
