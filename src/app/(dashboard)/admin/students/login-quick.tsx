"use client";

import * as React from "react";
import { Check, Copy, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetCredentialAction } from "./bulk-import";
import { sendLoginLink } from "../cohorts/actions";
import { loginDetailsText } from "./login-text";

/**
 * One tap each: copy a student's login details (to paste into WhatsApp), or
 * email them a login link. Super Admins only: the server actions check that
 * again, and on a preview site email only goes to the approved test address.
 * A new link replaces older ones; it never changes a password already set.
 */
export function LoginQuick({
  email,
  name,
  compact = false,
  only,
  className,
}: {
  email: string;
  name: string;
  compact?: boolean;
  only?: "copy" | "send";
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<"copy" | "send" | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    if (busy) return;
    setBusy("copy");
    const res = await resetCredentialAction(email).catch(() => null);
    setBusy(null);
    if (!res?.setupUrl) {
      toast.error(res?.error ?? "Couldn't make a login link.");
      return;
    }
    const text = loginDetailsText(name, email, res.setupUrl, window.location.origin);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success(`Login details for ${name} copied. Paste them into WhatsApp.`);
    } catch {
      toast.message(`Login link for ${name}`, { description: res.setupUrl, duration: 20000 });
    }
  }

  async function send() {
    if (busy) return;
    setBusy("send");
    const res = await sendLoginLink(email).catch(() => ({ error: "The email didn't send." }));
    setBusy(null);
    if (res.error) toast.error(res.error);
    else {
      toast.success(`Login link emailed to ${email}.`);
      router.refresh();
    }
  }

  return (
    <div
      role="group"
      aria-label={`Login details for ${name}`}
      className={cn("flex items-center gap-1.5", className)}
    >
      {only === "send" ? null : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={copy}
          disabled={Boolean(busy)}
          aria-label={compact ? `Copy login details for ${name}` : undefined}
          title="Copy login details to paste into WhatsApp"
        >
          {busy === "copy" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
          {compact ? null : copied ? "Copied" : "Copy login"}
        </Button>
      )}
      {only === "copy" ? null : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={send}
          disabled={Boolean(busy)}
          aria-label={compact ? `Email a login link to ${name}` : undefined}
          title="Email a login link"
        >
          {busy === "send" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <KeyRound className="size-4" aria-hidden />
          )}
          {compact ? null : "Email login"}
        </Button>
      )}
    </div>
  );
}
