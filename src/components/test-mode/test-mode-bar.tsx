"use client";

import { useState, useTransition } from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { backToAdmin, openAsTestStudent, resetTestDataAction, setTestModeAction } from "@/app/(dashboard)/test-mode-actions";

/**
 * The "Test mode" bar, always on top while test mode is on.
 *   admin    the admin side: open the student side as the test student, reset, turn off;
 *   student  the test student: back to admin (test mode stays on), or turn off.
 */
export function TestModeBar({ as }: { as: "admin" | "student" }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);
  const run = (fn: () => Promise<{ error: string | null } | void>, done?: string) =>
    start(async () => {
      setNote(null);
      const r = await fn();
      if (r && r.error) setNote(r.error);
      else if (done) setNote(done);
    });

  return (
    <div role="region" aria-label="Test mode" className="sticky top-0 z-40 border-b-2 border-foreground bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
        <FlaskConical className="size-4 shrink-0" aria-hidden />
        <p className="text-sm font-semibold">{as === "student" ? "Test mode: you are the test student" : "Test mode"}</p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {as === "admin" ? (
            <>
              <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => run(openAsTestStudent)}>
                Open as test student
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  if (window.confirm("Wipe the test student's progress and everything made in test mode?")) run(resetTestDataAction, "Test data reset.");
                }}
              >
                Reset test data
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => run(() => setTestModeAction(false))}>
                Turn off
              </Button>
            </>
          ) : (
            <>
              <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => run(() => backToAdmin(false))}>
                Back to admin
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => run(() => backToAdmin(true))}>
                Turn off test mode
              </Button>
            </>
          )}
        </div>
        {note ? (
          <p role="status" className="w-full text-sm">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** The switch in the admin sidebar footer, while test mode is off. */
export function TestModeSwitch() {
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        title="Use the student side as a hidden test student"
        aria-label="Turn on test mode"
        onClick={() =>
          start(async () => {
            const r = await setTestModeAction(true);
            setNote(r.error);
          })
        }
      >
        <FlaskConical className="size-4" aria-hidden />
        <span>Test mode</span>
      </Button>
      {note ? (
        <p role="status" className="text-xs text-destructive">
          {note}
        </p>
      ) : null}
    </>
  );
}
