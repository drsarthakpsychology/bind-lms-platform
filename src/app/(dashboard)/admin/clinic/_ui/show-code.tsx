"use client";

import * as React from "react";
import Link from "next/link";
import { Maximize2, Minimize2, X } from "lucide-react";

import { QrSvg } from "@/components/clinic/qr";
import type { Res } from "@/components/clinic/result";
import type { ClinicShowCode } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import "./clinic.css";

/**
 * Show code: the session's QR, full screen, a new one every 30 seconds, with
 * the 6-character code under it for online classes. Made to be projected or
 * screen-shared: white page, black code, very large type, in light and dark.
 * Asks the server again when the window runs out (refreshInMs).
 */

/** The code split in two for reading aloud: "ABC DEF". */
export function spaced(code: string): string {
  return code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
}

/** When to ask for the next code: the server's time, never sooner than 1s nor later than 30s. */
export function nextDelay(refreshInMs: number): number {
  return Math.max(1000, Math.min(30_000, Math.round(refreshInMs) + 150));
}

export function ShowCode({
  sessionId,
  title,
  when,
  back,
  load,
  first,
}: {
  sessionId: string;
  title: string;
  when: string;
  back: string;
  load: (sessionId: string) => Promise<Res<ClinicShowCode>>;
  first: Res<ClinicShowCode>;
}) {
  const [res, setRes] = React.useState<Res<ClinicShowCode>>(first);
  const [full, setFull] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const delay = res.ok ? nextDelay(res.data.refreshInMs) : 5000;

  React.useEffect(() => {
    let alive = true;
    const t = window.setTimeout(async () => {
      const next = await load(sessionId).catch(() => ({ ok: false as const, error: "Could not reach the server. Trying again." }));
      if (alive) setRes(next);
    }, delay);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
    // A new timer after each answer (a new window, or a failed try).
  }, [sessionId, load, delay, res]);

  React.useEffect(() => {
    const on = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch {
      /* Some browsers say no; the page is already large. */
    }
  }

  return (
    <div ref={rootRef} data-layout-ok-bar className="fixed inset-0 z-[60] flex flex-col bg-white text-[#111111]">
      <div className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="min-w-0">
          <p className="type-body font-semibold [overflow-wrap:anywhere]">{title}</p>
          <p className="type-small text-[#4a4a4a] type-num">{when}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={toggleFull} aria-label={full ? "Leave full screen" : "Full screen"} className="inline-flex size-11 items-center justify-center rounded-md outline-hidden hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#1d44d8] [&_svg]:size-5">
            {full ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
          </button>
          <Link href={back} aria-label="Close" className="inline-flex size-11 items-center justify-center rounded-md outline-hidden hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#1d44d8] [&_svg]:size-5">
            <X aria-hidden />
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-6 sm:gap-6">
        {res.ok ? (
          <>
            <QrSvg key={res.data.window} value={res.data.qr} label="Attendance QR code" className="aspect-square w-[min(82vw,62vh)] max-w-[40rem]" />
            <p aria-label={`Code ${res.data.code.split("").join(" ")}`} className="font-mono text-[clamp(2.5rem,9vw,6rem)] leading-none font-bold tracking-[0.12em] type-num">
              {spaced(res.data.code)}
            </p>
            {/* The time left in this code: a line that empties over its window. */}
            <span aria-hidden className="block h-1 w-[min(82vw,40rem)] overflow-hidden rounded-full bg-black/10">
              <span key={res.data.window} className="clinic-countdown block h-full origin-left bg-[#1d44d8]" style={{ animationDuration: `${Math.max(1, res.data.refreshInMs)}ms` }} />
            </span>
            <p className="type-small text-[#4a4a4a]">Scan in when you arrive and out when you leave.</p>
          </>
        ) : (
          <p role="alert" className={cn("max-w-md text-center type-h3")}>
            {res.error}
          </p>
        )}
      </div>
    </div>
  );
}
