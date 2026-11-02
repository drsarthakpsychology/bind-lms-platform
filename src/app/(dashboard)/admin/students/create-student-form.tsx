"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { createStudent, type CreateStudentState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: CreateStudentState = { error: null, success: false };

export function CreateStudentForm() {
  const [state, formAction, pending] = useActionState(createStudent, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="student@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expiresAt">Access expires (optional)</Label>
          <Input id="expiresAt" name="expiresAt" type="date" />
        </div>
      </div>
      <p className="text-caption text-muted-foreground">
        They get a one-time link to set their own password. Copy it to WhatsApp, or send it
        from <span className="font-medium">Login emails</span>.
      </p>

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not create student</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert variant="warning">
          <CheckCircle2 className="size-4 shrink-0 text-status-success-fg" aria-hidden />
          <div>
            <AlertTitle>Student added</AlertTitle>
            <AlertDescription className="space-y-2">
              {state.setupUrl ? (
                <span className="flex flex-wrap items-center gap-2">
                  <KeyRound className="size-4" aria-hidden />
                  Setup link (works once, 3 days):
                  <button
                    type="button"
                    className="font-semibold text-link underline"
                    onClick={() => navigator.clipboard?.writeText(state.setupUrl ?? "")}
                  >
                    Copy link
                  </button>
                </span>
              ) : null}
              <span className="block">
                Or{" "}
                <Link href="/admin/emails?tab=credentials" className="font-semibold text-link underline">
                  email them the setup link
                </Link>
                .
              </span>
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Adding…" : "Add student"}
      </Button>
    </form>
  );
}
