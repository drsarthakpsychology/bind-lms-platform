"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { createCourse, type CreateCourseState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: CreateCourseState = { error: null };

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setIsPublished(false);
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-4">
      <div className="min-w-[220px] flex-1 space-y-1.5">
        <Label htmlFor="title">Course title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Clinical Psychiatry Foundations"
        />
      </div>

      <label className="flex h-9 items-center gap-2 pb-0.5 text-sm text-foreground">
        {/* Hidden input synced to the Switch — Radix Switch submits no value,
            and the server action reads `isPublished === "on"`. */}
        <Switch
          checked={isPublished}
          onCheckedChange={setIsPublished}
          aria-label="Published"
        />
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        Published
      </label>

      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Creating…" : "Create course"}
      </Button>

      {state.error && (
        <Alert variant="destructive" role="alert" className="w-full">
          <AlertTitle>Could not create course</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
