"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCourse, type CreateCourseState } from "./actions";

const initialState: CreateCourseState = { error: null };

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="title" className="block text-xs font-medium text-muted-foreground">
          Course title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="Clinical Psychiatry Foundations"
        />
      </div>
      <label className="flex items-center gap-2 pb-2.5 text-sm text-foreground">
        <input type="checkbox" name="isPublished" className="h-4 w-4 rounded border-input" />
        Published
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create course"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-status-alert-fg">
          {state.error}
        </p>
      )}
    </form>
  );
}
