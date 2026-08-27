"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { saveMobileNumber, skipMobileNumber } from "@/app/(dashboard)/dashboard/actions";
import { normalizeIndianMobile } from "@/lib/phone";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * First-login WhatsApp-number capture (Kavya). Shown on /dashboard when the
 * student has no mobile_number yet. Two fields (Mobile + Confirm), client +
 * server validation, "Save" persists it, "Later" dismisses (re-asks after a
 * 7-day grace period). Never blocks login or the dashboard — it is strictly
 * additive; if the number is already set this renders nothing.
 */
const SKIP_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export function MobileNumberPrompt({
  mobileNumber,
  promptSkippedAt,
}: {
  mobileNumber: string | null;
  promptSkippedAt: string | null;
}) {
  const [show] = useState(() => {
    if (mobileNumber) return false;
    if (!promptSkippedAt) return true;
    return Date.now() - new Date(promptSkippedAt).getTime() > SKIP_GRACE_MS;
  });
  const [mobile, setMobile] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!show || done) return null;

  function handleSave() {
    setError(null);
    const normalized = normalizeIndianMobile(mobile);
    if (!normalized) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (normalizeIndianMobile(confirm) !== normalized) {
      setError("The two numbers don't match.");
      return;
    }
    startTransition(async () => {
      const result = await saveMobileNumber(mobile);
      if (result.error) setError(result.error);
      else setDone(true);
    });
  }

  function handleLater() {
    setError(null);
    startTransition(async () => {
      const result = await skipMobileNumber();
      if (result.error) setError(result.error);
      else setDone(true);
    });
  }

  return (
    <div className="rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-primary text-primary-foreground">
          <MessageCircle className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="text-h3">Add your WhatsApp number</h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              Your faculty uses this to reach you. Only you can see or change it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mobile-number">Mobile number</Label>
              <Input
                id="mobile-number"
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-mobile">Confirm mobile number</Label>
              <Input
                id="confirm-mobile"
                type="tel"
                inputMode="numeric"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="98765 43210"
                autoComplete="tel"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-caption font-medium text-status-alert-fg">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={handleSave} disabled={isPending || !mobile.trim() || !confirm.trim()}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Save number
            </Button>
            <Button type="button" variant="ghost" onClick={handleLater} disabled={isPending}>
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
