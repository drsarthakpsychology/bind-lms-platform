"use client";

import { useActionState, useEffect, useRef } from "react";
import { createStudent, type CreateStudentState } from "./actions";

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
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label htmlFor="email" className="block text-xs font-medium text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="student@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-muted-foreground">
            Temporary password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="expiresAt" className="block text-xs font-medium text-muted-foreground">
            Access expires (optional)
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-status-alert-bg px-3 py-2 text-sm text-status-alert-fg">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-status-success-bg px-3 py-2 text-sm text-status-success-fg">
          Student created. Send them the email and password directly.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Add student"}
      </button>
    </form>
  );
}
