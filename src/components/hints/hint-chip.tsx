"use client";

/**
 * Hints, the same way in every game that has them:
 *
 * - one clear "Hint" button next to the question, with how many hints are
 *   left today (free ones plus spares) right on it;
 * - one tap uses one;
 * - the hint shows right under the button, where the student is looking
 *   (and, for "rule out two", the wrong options cross out in place);
 * - the cost is explained once, the first time (OnceHint), never again;
 * - when none are left, the way to get more is on screen, not in a menu.
 *
 * All counting happens on the server (src/lib/hints). This file only shows it.
 */
import * as React from "react";
import { Lightbulb, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnceHint } from "@/components/help/once-hint";
import { buyHintsAction, getHintStatus, type HintAnswer } from "@/lib/hints/actions";
import type { HintStatus } from "@/lib/hints/engine";
import type { HintGive } from "@/lib/hints/resolve";
import { BUY_COST, BUY_COUNT, outOfHints, statusLine } from "@/lib/hints/rules";
import { btnSecondary } from "@/lib/games/ui/styles";

/** Hints left, loaded once from the server (or given by the page). */
export function useHintStatus(initial?: HintStatus | null): [HintStatus | null, (s: HintStatus | null) => void] {
  const [status, setStatus] = React.useState<HintStatus | null>(initial ?? null);
  const given = initial !== undefined;
  React.useEffect(() => {
    if (given) return;
    let alive = true;
    getHintStatus()
      .then((s) => {
        if (alive) setStatus(s);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [given]);
  return [status, setStatus];
}

/** The one-time line about what a hint costs. Same id everywhere, so it shows once in total. */
export const HINT_COST_TIP = "hint-cost";
export const HINT_COST_LINE = "A hint costs part of this question's points, never your XP. You get 3 free a day, then your spares.";

/** What using a hint gave back. */
export type HintUse = { ok: boolean; error?: string | null; status?: HintStatus | null };

/** "Get 3 hints for 30 XP", once a day, shown only when no hints are left and the student can afford it. */
function BuyButton({ onStatus }: { onStatus?: (s: HintStatus) => void }) {
  const [pending, start] = React.useTransition();
  const [note, setNote] = React.useState<string | null>(null);
  function buy() {
    start(async () => {
      const r = await buyHintsAction().catch(() => null);
      if (!r) return setNote("Couldn't buy. Try again.");
      if (r.status) onStatus?.(r.status);
      setNote(r.ok ? null : r.error);
    });
  }
  return (
    <>
      <button type="button" className={cn(btnSecondary, "w-full sm:w-auto")} disabled={pending} onClick={buy}>
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Lightbulb className="size-4" aria-hidden />}
        Get {BUY_COUNT} hints for {BUY_COST} XP
      </button>
      {note ? (
        <p role="status" className="w-full text-sm text-muted-foreground">
          {note}
        </p>
      ) : null}
    </>
  );
}

/**
 * The hint button for one question.
 *
 * `onUse` spends one hint on the server and says how it went. `shown` is what
 * the hint gave (shown right under the button). `used` means this question
 * has had all the hints it allows.
 */
export function HintButton({
  status,
  onStatus,
  onUse,
  shown,
  used = false,
  disabled = false,
  className,
}: {
  status: HintStatus | null;
  onStatus?: (s: HintStatus) => void;
  onUse: () => Promise<HintUse>;
  shown?: React.ReactNode;
  used?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  // A second tap before the first answer comes back must not spend twice.
  const busy = React.useRef(false);
  const off = status?.mode === "off";
  const none = status !== null && !off && status.left === 0;

  function go() {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    start(async () => {
      try {
        const r = await onUse().catch(() => null);
        if (!r) return setError("Couldn't get a hint. Try again.");
        if (r.status) onStatus?.(r.status);
        if (!r.ok) setError(r.error ?? "Couldn't get a hint. Try again.");
      } finally {
        busy.current = false;
      }
    });
  }

  const detail = status ? (off ? "Hints are paused right now." : statusLine(status)) : "";
  const label = used ? "Hint used" : none ? "No hints left" : "Hint";
  const showButton = !(none && !used && status?.canBuy);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {showButton ? (
          <button
            type="button"
            className={cn(btnSecondary, "w-full justify-between sm:w-auto sm:justify-center")}
            disabled={disabled || used || pending || none || off || status === null}
            onClick={go}
            title={detail || undefined}
          >
            <span className="inline-flex items-center gap-2">
              {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Lightbulb className="size-4" aria-hidden />}
              {label}
            </span>
            {status && !off ? (
              <span className="rounded-full border-2 border-current px-2 text-sm tabular-nums" aria-label={`${status.left} left: ${detail}`}>
                {status.left} left
              </span>
            ) : null}
          </button>
        ) : (
          <BuyButton onStatus={onStatus} />
        )}
      </div>
      {shown ? (
        <div role="status" className="flex items-start gap-2 rounded-md border-2 border-foreground bg-status-info-bg p-3 text-sm text-status-info-fg">
          <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1 space-y-1 leading-snug">{shown}</div>
        </div>
      ) : null}
      {error ? (
        <p role="status" className="text-sm text-muted-foreground">
          {error}
        </p>
      ) : none && !used && status ? (
        <p className="text-sm text-muted-foreground">{outOfHints(status, status.mode === "full")}</p>
      ) : off ? (
        <p className="text-sm text-muted-foreground">Hints are paused right now.</p>
      ) : null}
      {!used && !none && !off && status ? <OnceHint id={HINT_COST_TIP} className="text-sm text-muted-foreground">{HINT_COST_LINE}</OnceHint> : null}
    </div>
  );
}

/**
 * The hint button for games that ask `askHint` ("rule out two", or "a card
 * that fits"). `used` is true once this question's hint is open. The hint's
 * own line shows under the button until the next question.
 */
export function HintBar({
  status,
  onStatus,
  ask,
  onGive,
  used,
  disabled,
  className,
}: {
  status: HintStatus | null;
  onStatus: (s: HintStatus) => void;
  ask: () => Promise<HintAnswer>;
  onGive: (g: HintGive) => void;
  used: boolean;
  disabled?: boolean;
  /** Kept for older callers; the button always says "Hint" now. */
  label?: string;
  className?: string;
}) {
  const [text, setText] = React.useState<string | null>(null);
  return (
    <HintButton
      status={status}
      onStatus={onStatus}
      used={used}
      disabled={disabled}
      className={className}
      shown={used && text ? text : null}
      onUse={async () => {
        const r = await ask();
        if (r.ok) {
          setText(r.give.text);
          onGive(r.give);
        }
        return { ok: r.ok, error: r.ok ? null : r.error, status: r.status };
      }}
    />
  );
}
