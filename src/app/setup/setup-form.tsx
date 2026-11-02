"use client";

import * as React from "react";
import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { completeSetup, type SetupState } from "./actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password-policy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initial: SetupState = { error: null };

export function SetupForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(completeSetup, initial);
  const [show, setShow] = React.useState(false);
  const [pw, setPw] = React.useState("");
  const long = pw.length >= MIN_PASSWORD_LENGTH;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {/* Lets password managers save the login against the right email. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-accent"
          >
            {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        <p className={long ? "text-caption font-semibold text-foreground" : "text-caption text-muted-foreground"}>
          {long ? "✓ Long enough" : `At least ${MIN_PASSWORD_LENGTH} characters. Three random words work well.`}
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Type it again</Label>
        <Input id="confirm" name="confirm" type={show ? "text" : "password"} autoComplete="new-password" required />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
        {pending ? "Saving…" : "Save password"}
      </Button>
    </form>
  );
}
