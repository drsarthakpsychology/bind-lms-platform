"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { LinkProblem } from "@/components/auth/link-problem";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type State = "loading" | "ready" | "error" | "success";

/**
 * The set-your-password screen the invite/recovery link lands on. Supabase
 * redirects to this route with `#access_token=…&refresh_token=…&type=recovery`
 * after verifying the emailed token; this component establishes that session,
 * then lets the student pick a real password (replacing the throwaway one the
 * importer created). The token is unique per account and expires (Supabase
 * recovery TTL), so the "it expires" copy is true.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : "");
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type");

      if (type !== "recovery" || !access_token || !refresh_token) {
        if (!cancelled) setState("error");
        return;
      }

      const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (cancelled) return;
      if (error || !data.user) {
        setState("error");
        return;
      }
      setEmail(data.user.email ?? "");
      setState("ready");
      // Clear the tokens from the URL so a refresh doesn't re-trigger.
      window.history.replaceState(null, "", window.location.pathname);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setState("success");
    router.replace("/dashboard");
  }

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-small text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Checking your link…
      </div>
    );
  }

  if (state === "error") {
    return <LinkProblem reason="This link has expired or doesn't work." />;
  }

  if (state === "success") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-success-bg px-3 py-3 text-small font-semibold text-status-success-fg">
        <Check className="size-4 shrink-0" aria-hidden />
        Password set. Opening your Home…
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-small text-muted-foreground">
        Set the password for <span className="font-medium text-foreground">{email}</span>.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoFocus
          placeholder="At least 8 characters"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Type it again</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          placeholder="Same password again"
        />
      </div>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={busy} className="w-full">
        {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {busy ? "Saving…" : "Set password"}
      </Button>
    </form>
  );
}
