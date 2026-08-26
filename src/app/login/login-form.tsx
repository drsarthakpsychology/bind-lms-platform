"use client";

import { useEffect, useActionState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Script from "next/script";
import { login, type LoginState } from "@/lib/auth/actions";
import { trackEvent } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: LoginState = { error: null };

// Cloudflare Turnstile — renders a "prove you're human" widget on login.
// The site key is public (safe to expose). Server-side verification happens in
// the login action using the secret key (NEXT_PUBLIC vs private).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const turnstileRef = useRef<HTMLInputElement>(null);
  const prevError = useRef(state.error);

  // Login volume + failure rate without touching credentials. No email or any
  // PII is sent — only that an attempt happened and whether it failed.
  useEffect(() => {
    if (prevError.current === state.error) return;
    prevError.current = state.error;
    if (state.error) trackEvent("login_failed");
  }, [state.error]);

  // The server returns a single combined string for credential failures. On
  // mobile we attribute it to the fields (aria-invalid + inline text) instead
  // of a detached banner; other failures (rate limit, human check, expired)
  // stay a top-level Alert.
  const credentialError =
    state.error === "Incorrect email or password." ||
    state.error === "Enter your email and password.";

  return (
    <form
      action={formAction}
      onSubmit={() => trackEvent("login_attempt")}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={credentialError || undefined}
          aria-describedby={credentialError ? "email-error" : undefined}
        />
        {credentialError && (
          <p id="email-error" className="text-caption font-medium text-status-alert-fg">
            Check your email address.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-invalid={credentialError || undefined}
          aria-describedby={credentialError ? "password-error" : undefined}
        />
        {credentialError && (
          <p id="password-error" className="text-caption font-medium text-status-alert-fg">
            Check your password.
          </p>
        )}
      </div>

      {state.error && !credentialError && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not sign in</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {TURNSTILE_SITE_KEY ? (
        <div className="min-h-[65px]">
          <input ref={turnstileRef} type="hidden" name="cf-turnstile-response" />
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback={(token: string) => {
              if (turnstileRef.current) turnstileRef.current.value = token;
            }}
          />
        </div>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      {/* Help copy — reduce dead-ends for invite-only accounts. */}
      <p className="text-center text-caption text-muted-foreground">
        Forgotten your password? Ask your administrator to reset it.
      </p>

      {/* Turnstile script (loaded only when a site key is configured). */}
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
      ) : null}
    </form>
  );
}
