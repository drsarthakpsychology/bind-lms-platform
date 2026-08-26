"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  createAssignment,
  saveAssignment,
  autosaveAssignment,
  deleteAssignment,
} from "./assignment-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

// Accepted types come from the media registry — only types with a working
// student path are offered. Adding a type without its path would show
// students a dead end; the registry's test enforces that.
import { SUBMISSION_TYPE_OPTIONS } from "@/lib/media/registry";
const ACCEPTED_FORMAT_OPTIONS = SUBMISSION_TYPE_OPTIONS as unknown as ReadonlyArray<{
  value: string;
  label: string;
}>;

export type EditableAssignment = {
  id: string;
  title: string;
  instructions: string | null;
  due_at: string | null;
  allow_late: boolean;
  is_published: boolean;
  max_files: number;
  max_file_mb: number;
  accepted_formats: string[];
  submissionCount: number;
};

/**
 * Inline admin assignment editor. Renders the read view by default with a
 * pencil in the top-right corner (always visible, not hover-revealed). Clicking
 * the pencil turns the card into the editor in place — same page, same scroll
 * position — with Save changes / Cancel. Autosaves the draft as you type with a
 * quiet "Saved" indicator; publishing is the Switch.
 */
export function AssignmentEditor({
  courseId,
  lessonId,
  assignment,
}: {
  courseId: string;
  lessonId: string;
  assignment: EditableAssignment | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  // Draft state (kept so autosave can push without a submit).
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [instructions, setInstructions] = useState(assignment?.instructions ?? "");
  const [dueAt, setDueAt] = useState(assignment?.due_at?.slice(0, 16) ?? "");
  const [allowLate, setAllowLate] = useState(assignment?.allow_late ?? true);
  const [isPublished, setIsPublished] = useState(assignment?.is_published ?? false);
  const [maxFiles, setMaxFiles] = useState(assignment?.max_files ?? 3);
  const [maxFileMb, setMaxFileMb] = useState(assignment?.max_file_mb ?? 25);
  const [accepted, setAccepted] = useState<string[]>(assignment?.accepted_formats ?? ["pdf", "docx", "image"]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didMount = useRef(false);

  // Debounced autosave while editing.
  useEffect(() => {
    if (!editing || !assignment || !didMount.current) {
      didMount.current = true;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const result = await autosaveAssignment(courseId, lessonId, assignment.id, {
        title,
        instructions,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        allowLate,
        isPublished,
        maxFiles,
        maxFileMb,
        acceptedFormats: accepted,
      });
      if (result.error) setError(result.error);
      else setSavedAt(new Date().toISOString());
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, instructions, dueAt, allowLate, isPublished, maxFiles, maxFileMb, accepted, editing]);

  function toggleAccepted(value: string) {
    setAccepted((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("instructions", instructions);
    fd.set("dueAt", dueAt);
    fd.set("allowLate", allowLate ? "on" : "");
    fd.set("isPublished", isPublished ? "on" : "");
    fd.set("maxFiles", String(maxFiles));
    fd.set("maxFileMb", String(maxFileMb));
    for (const f of accepted) fd.append("acceptedFormat", f);
    const result = assignment
      ? await saveAssignment(courseId, lessonId, assignment.id, { error: null }, fd)
      : null;
    setSaving(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSavedAt(new Date().toISOString());
    setEditing(false);
    router.refresh();
  }

  // If there's no assignment yet, show the create form.
  if (!assignment) {
    return (
      <div className="space-y-3">
        <form
          action={async (fd) => {
            const result = await createAssignment(courseId, lessonId, { error: null }, fd);
            if (result.error) setError(result.error);
            else router.refresh();
          }}
          className="space-y-4 rounded-md border-2 border-border bg-card p-4"
        >
          <label className="block space-y-1.5">
            <span className="text-small font-medium">Title</span>
            <Input
              name="title"
              required
              placeholder="Essay: apply the framework"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-small font-medium">Instructions</span>
            <Textarea
              name="instructions"
              rows={4}
              placeholder="Write the brief students will read…"
            />
          </label>
          <label className="flex h-6 items-center gap-2.5 text-small font-medium">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} aria-label="Published" />
            <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
            Published
          </label>
          <input type="hidden" name="dueAt" value={dueAt} />
          <input type="hidden" name="allowLate" value={allowLate ? "on" : ""} />
          <input type="hidden" name="maxFiles" value={maxFiles} />
          <input type="hidden" name="maxFileMb" value={maxFileMb} />
          <input type="hidden" name="acceptedFormat" value={accepted.join(",")} />
          {error && <p role="alert" className="text-caption text-status-alert-fg">{error}</p>}
          <Button type="submit" size="lg" disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Add assignment
          </Button>
        </form>
      </div>
    );
  }

  // Read view + edit view share the card shell.
  const submissionsLine =
    assignment.submissionCount > 0
      ? `${assignment.submissionCount} student${assignment.submissionCount === 1 ? "" : "s"} have submitted. They'll see your changes immediately.`
      : null;

  return (
    <div className="space-y-2 rounded-md border-2 border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Assignment title"
              className="font-semibold md:text-base"
            />
          ) : (
            <h3 className="text-h3 leading-snug">{assignment.title}</h3>
          )}
          {!editing && assignment.due_at && (
            <p className="mt-1 text-caption text-muted-foreground">
              Due {new Date(assignment.due_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              {assignment.due_at.includes("T") && !assignment.due_at.endsWith("T00:00:00") ? `, ${new Date(assignment.due_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}` : ""}
            </p>
          )}
        </div>

        {/* Pencil icon — always visible, top-right. */}
        <div className="flex shrink-0 items-center gap-1">
          {!editing && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditing(true);
                setError(null);
              }}
              aria-label="Edit assignment"
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
          )}
          {!editing && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete assignment"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
              <MobileBottomSheet
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete this assignment?"
                description="This deletes the assignment and all its submissions. This can't be undone."
                footer={
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={async () => {
                        setDeletePending(true);
                        const result = await deleteAssignment(courseId, lessonId, assignment.id);
                        setDeletePending(false);
                        setDeleteOpen(false);
                        if (result.error) setError(result.error);
                        else router.refresh();
                      }}
                      disabled={deletePending}
                      className="w-full"
                    >
                      {deletePending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                      Delete assignment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeleteOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Quiet line when students have submitted. */}
      {!editing && submissionsLine && (
        <p className="text-caption text-muted-foreground">{submissionsLine}</p>
      )}

      {!editing && assignment.instructions && (
        <div className="whitespace-pre-wrap rounded-md border-2 border-border bg-muted/50 p-4 text-small leading-relaxed text-foreground">
          {assignment.instructions}
        </div>
      )}

      {!editing && (
        <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            {assignment.is_published ? "Published" : "Draft"}
          </span>
          <span aria-hidden>·</span>
          <span>{assignment.accepted_formats.map((f) => f.toUpperCase()).join(", ")}</span>
        </div>
      )}

      {editing && (
        <div className="space-y-4 border-t-2 border-border pt-3">
          {/* In-place editor fields */}
          <label className="block space-y-1.5">
            <span className="text-small font-medium">Instructions</span>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
            />
          </label>

          <details className="rounded-md border-2 border-border bg-muted/40">
            <summary className="cursor-pointer select-none px-3 py-2 text-small font-semibold text-foreground">
              Submission settings
              <span className="ml-2 font-normal text-muted-foreground">
                due date, late policy, file limits, formats
              </span>
            </summary>
            <div className="space-y-4 border-t-2 border-border p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-small font-medium">Due date &amp; time</span>
                  <Input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                  />
                </label>
                <label className="flex h-9 items-center gap-2.5 text-small font-medium">
                  <Switch checked={allowLate} onCheckedChange={setAllowLate} aria-label="Allow late submissions" />
                  Allow late submissions
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="block space-y-1.5">
                  <span className="text-small font-medium">Max files</span>
                  <Input
                    type="number"
                    min={1}
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(Number(e.target.value))}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-small font-medium">Max MB / file</span>
                  <Input
                    type="number"
                    min={1}
                    value={maxFileMb}
                    onChange={(e) => setMaxFileMb(Number(e.target.value))}
                  />
                </label>
              </div>

              <fieldset>
                <legend className="text-small font-medium">Accepted file types</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ACCEPTED_FORMAT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 px-2.5 py-1 text-xs font-medium transition-colors " +
                        (accepted.includes(opt.value)
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-accent")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={accepted.includes(opt.value)}
                        onChange={() => toggleAccepted(opt.value)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </details>

          <label className="flex h-6 items-center gap-2.5 text-small font-medium">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} aria-label="Published" />
            Published
          </label>

          {error && <p role="alert" className="text-caption text-status-alert-fg">{error}</p>}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-caption text-muted-foreground">
              {savedAt ? (
                <>
                  <CheckCircle2 className="size-3.5" aria-hidden />
                  Saved
                </>
              ) : (
                <span>Autosaves as you type</span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
              >
                <X className="size-3.5" aria-hidden />
                Cancel
              </Button>
              <Button type="button" size="default" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-3.5" aria-hidden />
                )}
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
