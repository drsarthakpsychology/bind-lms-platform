"use client";

import { useEffect, useActionState, useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Script from "next/script";
import { login, type LoginState } from "@/lib/auth/actions";
import { trackEvent } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: LoginState = { error: null };

// Cloudflare Turnstile: renders a "prove you're human" widget on login.
// The site key is public (safe to expose). Server-side verification happens in
// the login action using the secret key (NEXT_PUBLIC vs private).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function LoginForm({ defaultEmail }: { defaultEmail?: string } = {}) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const turnstileRef = useRef<HTMLInputElement>(null);
  const prevError = useRef(state.error);

  // Login volume + failure rate without touching credentials. No email or any
  // PII is sent, only that an attempt happened and whether it failed.
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
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          defaultValue={defaultEmail}
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
        {/* Show/hide: typing a password on a phone keyboard is error-prone. */}
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Your password"
            className="pr-12"
            aria-invalid={credentialError || undefined}
            aria-describedby={credentialError ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-0 right-0 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
          </button>
        </div>
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

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>

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
