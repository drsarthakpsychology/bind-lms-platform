"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save, X } from "lucide-react";
import { renameCourse } from "../actions";

import { Button } from "@/components/ui/button";

/**
 * Inline course-title editing with an explicit save. Pencil is always visible;
 * clicking turns the title into an input with Save changes / Cancel. Warns
 * before navigating away with unsaved edits.
 */
export function RenameCourse({
  courseId,
  title,
}: {
  courseId: string;
  title: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = editing && draft.trim() !== title;

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function handleSave() {
    if (!dirty) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    const result = await renameCourse(courseId, draft);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-h1">{title}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setDraft(title);
            setEditing(true);
          }}
          aria-label="Rename course"
        >
          <Pencil className="size-4" aria-hidden />
        </Button>
      </span>
    );
  }

  return (
    <span className="flex w-full flex-col gap-2">
      <span className="flex w-full max-w-xl items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Course title"
          className="h-10 w-full rounded-md border-2 border-input bg-background px-3 text-h1 font-bold outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
        <Button type="button" size="sm" onClick={handleSave} disabled={saving || !dirty}>
          {saving ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
          Save changes
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setDraft(title);
            setEditing(false);
            setError(null);
          }}
        >
          <X className="size-3.5" aria-hidden />
          Cancel
        </Button>
      </span>
      {dirty && <span className="text-caption text-muted-foreground">Unsaved changes</span>}
      {error && <span role="alert" className="text-caption text-status-alert-fg">{error}</span>}
    </span>
  );
}
