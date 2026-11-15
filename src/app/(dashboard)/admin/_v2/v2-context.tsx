"use client";

import * as React from "react";

import { AdminPage, ListSkeleton, Notice, btn } from "./kit";

/**
 * Tells the admin area's loading and error screens whether the new design is
 * on (the admin layout reads the `ui_v2` switch once and passes it down).
 */
const Ctx = React.createContext(false);

export function AdminV2Provider({ value, children }: { value: boolean; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminV2(): boolean {
  return React.useContext(Ctx);
}

/** Loading screen: the old one, or v2 skeleton rows shaped like a list. */
export function AdminLoading({ old, rows = 8 }: { old: React.ReactNode; rows?: number }) {
  const v2 = useAdminV2();
  if (!v2) return <>{old}</>;
  return (
    <div data-admin-v2 role="status" aria-live="polite" className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6">
      <span className="sr-only">Loading</span>
      <div aria-hidden className="flex flex-col gap-2">
        <span className="h-7 w-48 animate-pulse rounded bg-[var(--ds-tint)] motion-reduce:animate-none" />
        <span className="h-3 w-64 max-w-full animate-pulse rounded bg-[var(--ds-tint)] motion-reduce:animate-none" />
      </div>
      <ListSkeleton rows={rows} />
    </div>
  );
}

/** Error screen for any admin page (v2). */
export function AdminErrorV2({ onRetry, digest }: { onRetry: () => void; digest?: string }) {
  return (
    <AdminPage title="This page did not load" lead="Nothing was changed. Try again, or go back to Today." width="default">
      <Notice tone="alert">
        <span>Something went wrong while loading this page.{digest ? ` Reference: ${digest}` : ""}</span>
      </Notice>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn.primary} onClick={onRetry}>
          Try again
        </button>
        <a href="/admin" className={btn.quiet}>
          Go to Today
        </a>
      </div>
    </AdminPage>
  );
}
