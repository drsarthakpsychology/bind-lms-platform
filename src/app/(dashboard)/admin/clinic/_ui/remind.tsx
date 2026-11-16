"use client";

import * as React from "react";

import type { Res } from "@/components/clinic/result";
import type { ClinicRemindResult } from "@/lib/clinic/types";
import { btn } from "../../_v2/kit";

/** Send a notice to everyone with a case count due. */
export function RemindButton({ cohortId, remind, due }: { cohortId: string; remind: (cohortId: string) => Promise<Res<ClinicRemindResult>>; due: number }) {
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  if (!due) return null;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        className={btn.quiet}
        onClick={async () => {
          setBusy(true);
          const x = await remind(cohortId).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
          setBusy(false);
          setMsg(x.ok ? `Reminded ${x.data.notified} ${x.data.notified === 1 ? "student" : "students"}.` : x.error);
        }}
      >
        Remind about case counts
      </button>
      {msg ? (
        <p role="status" className="type-small font-semibold">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
