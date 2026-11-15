"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, Search } from "lucide-react";
import { SlowState } from "@/components/design-system/slow-state";
import { cn } from "@/lib/utils";
import { primaryButton, quietButton } from "./parts";

/**
 * The shared student states in the new design: loading, something went
 * wrong, and page not found. Plain type on the page, left aligned where the
 * page's own title would be, one action in lime and one quiet way out.
 */

const bar = "animate-pulse rounded-full bg-[var(--ds-hairline)] motion-reduce:animate-none";

/** A page while it loads: a title line, then rows with hairlines (the shape of most v2 screens). */
export function LoadingV2({ rows = 5, numbers = false }: { rows?: number; numbers?: boolean }) {
  return (
    <div aria-busy="true" className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-[var(--ds-section)] px-1 sm:px-0">
      <SlowState className="rounded-none border-0 bg-transparent px-0 py-0" />
      <div className={cn(bar, "h-8 w-48 max-w-full rounded-lg")} />
      {numbers ? (
        <div className="flex gap-10">
          <div className={cn(bar, "h-12 w-20 rounded-lg")} />
          <div className={cn(bar, "h-12 w-20 rounded-lg")} />
        </div>
      ) : null}
      <div className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex min-h-14 items-center gap-4 py-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className={cn(bar, "h-4")} style={{ width: `${[62, 48, 70, 40, 56, 66][i % 6]}%` }} />
              <div className={cn(bar, "h-3 opacity-70")} style={{ width: `${[34, 28, 40, 22, 30, 36][i % 6]}%` }} />
            </div>
            <div className={cn(bar, "h-4 w-10 shrink-0")} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StateFrame({ title, children, actions, note, heading = "h1" }: { title: string; children: React.ReactNode; actions: React.ReactNode; note?: React.ReactNode; heading?: "h1" | "h2" }) {
  const H = heading;
  return (
    <div className="ds-page mx-auto flex min-h-[50vh] w-full min-w-0 max-w-5xl flex-col justify-center gap-6 px-1 sm:px-0">
      <div className="flex min-w-0 max-w-xl flex-col gap-2">
        <H className="type-h1 [overflow-wrap:anywhere]">{title}</H>
        <p className="type-body text-muted-foreground">{children}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
      {note ? <p className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{note}</p> : null}
    </div>
  );
}

/** An uncaught error inside the app. Try again leads; Home is the way out. */
export function ErrorV2({ onRetry, digest, homeHref }: { onRetry: () => void; digest?: string; homeHref?: string }) {
  return (
    <StateFrame
      heading="h2"
      title="Something went wrong"
      note={
        digest ? (
          <>
            Reference <span className="type-num">{digest}</span>
          </>
        ) : undefined
      }
      actions={
        <>
          <button type="button" onClick={onRetry} className={cn(primaryButton, "w-full sm:w-fit sm:min-w-48")}>
            <RotateCcw aria-hidden /> Try again
          </button>
          {homeHref ? (
            <Link href={homeHref} className={cn(quietButton, "min-h-[3.25rem] w-full sm:w-fit")}>
              Back to Home
            </Link>
          ) : null}
        </>
      }
    >
      Nothing you have done is lost.
    </StateFrame>
  );
}

/** A page that does not exist, inside the app: Home leads, Search is the quiet way on. */
export function NotFoundV2() {
  return (
    <StateFrame
      title="Page not found"
      actions={
        <>
          <Link href="/go/home" className={cn(primaryButton, "w-full sm:w-fit sm:min-w-48")}>
            Back to Home
          </Link>
          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("plms:open-search"))} className={cn(quietButton, "min-h-[3.25rem] w-full sm:w-fit")}>
            <Search aria-hidden /> Search
          </button>
        </>
      }
    >
      This page has moved, or the link is wrong.
    </StateFrame>
  );
}
