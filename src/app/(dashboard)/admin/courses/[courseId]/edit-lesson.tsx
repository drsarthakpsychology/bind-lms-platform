"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import { updateLesson } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export type EditLessonInitial = {
  title: string;
  description: string;
  week: number;
  requiresAssignment: boolean;
  assignmentPrompt: string;
};

/**
 * Inline lesson editor — title, notes, week, and the assignment toggle —
 * expanded in place under the lesson row. The video is managed separately
 * (replace on the row); this never touches it.
 */
export function EditLesson({
  lessonId,
  courseId,
  initial,
}: {
  lessonId: string;
  courseId: string;
  initial: EditLessonInitial;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [week, setWeek] = useState(initial.week);
  const [requiresAssignment, setRequiresAssignment] = useState(initial.requiresAssignment);
  const [assignmentPrompt, setAssignmentPrompt] = useState(initial.assignmentPrompt);

  function toggle() {
    setOpen((o) => !o);
    setError(null);
    setSaved(false);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const result = await updateLesson(lessonId, courseId, {
          title,
          description,
          week,
          requiresAssignment,
          assignmentPrompt,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } catch {
        setError("Could not save. Try again.");
      }
    });
  }

  return (
    <div className="w-full sm:w-auto">
      <Button type="button" variant="outline" size="sm" onClick={toggle} aria-expanded={open}>
        <Pencil className="size-3.5" aria-hidden />
        {open ? "Close" : "Edit"}
      </Button>

      {open ? (
        <form onSubmit={save} className="mt-3 space-y-4 rounded-md border-2 border-border bg-muted/40 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_5rem]">
            <div className="space-y-1.5">
              <Label htmlFor={`title-${lessonId}`}>Lesson title</Label>
              <Input
                id={`title-${lessonId}`}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`week-${lessonId}`}>Week</Label>
              <Input
                id={`week-${lessonId}`}
                type="number"
                min={1}
                value={week}
                onChange={(e) => setWeek(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`desc-${lessonId}`}>Lesson notes (optional)</Label>
            <Textarea
              id={`desc-${lessonId}`}
              rows={2}
              placeholder="Shown to students under the video."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label className="flex h-6 items-center gap-2.5 text-small font-medium text-foreground">
            <Switch
              checked={requiresAssignment}
              onCheckedChange={setRequiresAssignment}
              aria-label="Requires assignment"
            />
            Requires assignment
          </label>

          {requiresAssignment ? (
            <div className="space-y-1.5">
              <Label htmlFor={`prompt-${lessonId}`}>Assignment instructions</Label>
              <Textarea
                id={`prompt-${lessonId}`}
                rows={2}
                placeholder="Summarize the key differences between CBT and DBT in 200 words."
                value={assignmentPrompt}
                onChange={(e) => setAssignmentPrompt(e.target.value)}
              />
              <p className="text-caption text-muted-foreground">
                Turning this on publishes the assignment to students right away.
                Turning it off hides it (nothing is deleted).
              </p>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-small text-status-alert-fg">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="sm" disabled={isPending || saved}>
              {isPending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
              {saved ? "Saved" : "Save changes"}
            </Button>
            {saved ? (
              <span className="flex items-center gap-1.5 text-caption text-status-success-fg">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Saved.
              </span>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
