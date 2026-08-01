"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <Label htmlFor="password">Temporary password</Label>
          <Input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="expiresAt">Access expires (optional)</Label>
          <Input id="expiresAt" name="expiresAt" type="date" />
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive" role="alert">
          <AlertTitle>Could not create student</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.success && (
        <Alert variant="info">
          <CheckCircle2 className="size-4" aria-hidden />
          <AlertTitle>Student created</AlertTitle>
          <AlertDescription>
            Send them the email and password directly.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Creating…" : "Add student"}
      </Button>
    </form>
  );
}
