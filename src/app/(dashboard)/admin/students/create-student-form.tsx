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
        A password is generated for you — it&apos;s shown below after you add them, and
        they appear in <span className="font-medium">Roster &amp; emails</span> so you can
        send it by email (bulk or one at a time).
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
              <span className="flex items-center gap-2">
                <KeyRound className="size-4" aria-hidden />
                Password: <span className="font-mono font-semibold">{state.password}</span>
              </span>
              <span className="block">
                They&apos;re in the roster now —{" "}
                <Link href="/admin/emails?tab=credentials" className="font-semibold text-link underline">
                  send the password email
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
