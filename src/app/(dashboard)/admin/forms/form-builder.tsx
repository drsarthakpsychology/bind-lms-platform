"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CHOICE_TYPES, FIELD_TYPES, LIMITS, blankField, makeKey, type FieldType, type FormField } from "@/lib/forms/fields";
import { FormFields } from "@/components/forms/form-fields";
import { cn } from "@/lib/utils";
import { createForm, updateForm } from "./actions";

type Row = { uid: string; isNew: boolean; field: FormField };

const input =
  "h-11 w-full min-w-0 rounded-md border-2 border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60 md:text-sm";
const iconBtn = "flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-card hover:bg-accent disabled:opacity-30";

export type BuilderProps = {
  formId?: string;
  initial: { title: string; description: string; fields: FormField[]; isActive: boolean };
  /** Every key already used by this form's answers: new questions never reuse one. */
  reservedKeys: string[];
  responses: number;
};

/**
 * Make or edit a form. Each question keeps the internal key it was saved
 * with, so renaming, moving or changing a question never detaches the
 * answers people already sent. A brand new question takes its key from its
 * wording until it is first saved.
 */
export function FormBuilder({ formId, initial, reservedKeys, responses }: BuilderProps) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initial.title);
  const [description, setDescription] = React.useState(initial.description);
  const [isActive, setIsActive] = React.useState(initial.isActive);
  const [rows, setRows] = React.useState<Row[]>(() => initial.fields.map((f) => ({ uid: f.key, isNew: false, field: f })));
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const takenExcept = (uid: string | null, list: Row[]) => [...reservedKeys, ...list.filter((r) => r.uid !== uid).map((r) => r.field.key)];

  function patch(uid: string, change: Partial<FormField>) {
    setRows((list) =>
      list.map((r) => {
        if (r.uid !== uid) return r;
        const next: FormField = { ...r.field, ...change };
        if (change.label !== undefined && r.isNew) next.key = makeKey(change.label || next.type, takenExcept(uid, list));
        if (change.type) {
          if (CHOICE_TYPES.includes(change.type)) next.options = r.field.options?.length ? r.field.options : ["Option 1", "Option 2"];
          else delete next.options;
        }
        return { ...r, field: next };
      }),
    );
  }

  function add() {
    setRows((list) => [...list, { uid: crypto.randomUUID(), isNew: true, field: blankField("text", takenExcept(null, list)) }]);
  }

  function move(i: number, by: -1 | 1) {
    setRows((list) => {
      const j = i + by;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(uid: string) {
    setRows((list) => list.filter((r) => r.uid !== uid));
  }

  async function save() {
    setSaving(true);
    setError(null);
    const draft = { title, description, isActive, fields: rows.map((r) => r.field) };
    const res = formId ? await updateForm(formId, draft) : await createForm(draft);
    setSaving(false);
    if (res.error || !res.id) {
      setError(res.error ?? "Could not save.");
      return;
    }
    toast.success("Form saved");
    router.push(`/admin/forms/${res.id}`);
    router.refresh();
  }

  const previewFields = rows
    .map((r) => r.field)
    .filter((f) => f.label.trim())
    .map((f) => (f.options ? { ...f, options: [...new Set(f.options.map((o) => o.trim()).filter(Boolean))] } : f));

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Builder view" className="inline-flex rounded-md border-2 border-foreground bg-card p-1">
        {(["edit", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-[6px] px-4 text-sm font-bold", mode === m ? "bg-foreground text-background" : "hover:bg-accent")}
          >
            {m === "edit" ? <Pencil className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            {m === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      {mode === "preview" ? (
        <div className="mx-auto max-w-2xl rounded-[10px] border-2 border-foreground bg-card p-5 hard-shadow-md sm:p-8">
          <p className="mb-4 font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Preview</p>
          <h2 className="text-h2 break-words">{title || "Untitled form"}</h2>
          {description ? <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{description}</p> : null}
          <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
            <FormFields fields={previewFields} idPrefix="preview" />
            <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md border-2 border-foreground bg-primary text-base font-bold text-primary-foreground opacity-60">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-4 rounded-[10px] border-2 border-foreground bg-card p-4 sm:p-5">
            <div className="space-y-1.5">
              <label htmlFor="form-title" className="block text-sm font-bold">Title</label>
              <input id="form-title" className={input} value={title} maxLength={LIMITS.title} onChange={(e) => setTitle(e.target.value)} placeholder="For example: Workshop sign up" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="form-desc" className="block text-sm font-bold">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea id="form-desc" className={cn(input, "h-auto min-h-24 py-2")} value={description} maxLength={LIMITS.description} onChange={(e) => setDescription(e.target.value)} placeholder="Shown above the questions" />
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="size-5 accent-primary" />
              <span className="text-sm font-bold">Open: taking answers</span>
            </label>
          </section>

          <section className="space-y-3" aria-label="Questions">
            <h2 className="text-h3">Questions</h2>
            {responses > 0 ? (
              <p className="text-small text-muted-foreground">
                {responses} people already answered. Removing or changing a question keeps their old answers.
              </p>
            ) : null}
            {rows.length === 0 ? <p className="text-small text-muted-foreground">No questions yet.</p> : null}
            <ol className="space-y-3">
              {rows.map((r, i) => {
                const f = r.field;
                const isChoice = CHOICE_TYPES.includes(f.type);
                return (
                  <li key={r.uid} className="rounded-[10px] border-2 border-foreground bg-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-link">Q{i + 1}</span>
                      <div className="flex gap-1.5">
                        <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move question ${i + 1} up`}>
                          <ArrowUp className="size-4" aria-hidden />
                        </button>
                        <button type="button" className={iconBtn} disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label={`Move question ${i + 1} down`}>
                          <ArrowDown className="size-4" aria-hidden />
                        </button>
                        <button type="button" className={cn(iconBtn, "border-destructive text-destructive")} onClick={() => remove(r.uid)} aria-label={`Remove question ${i + 1}`}>
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
                      <div className="space-y-1.5">
                        <label htmlFor={`label-${r.uid}`} className="block text-sm font-bold">Question</label>
                        <input id={`label-${r.uid}`} className={input} value={f.label} maxLength={LIMITS.label} onChange={(e) => patch(r.uid, { label: e.target.value })} placeholder="What do you want to ask?" />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor={`type-${r.uid}`} className="block text-sm font-bold">Answer type</label>
                        <select id={`type-${r.uid}`} className={input} value={f.type} onChange={(e) => patch(r.uid, { type: e.target.value as FieldType })}>
                          {FIELD_TYPES.map((t) => (
                            <option key={t.type} value={t.type}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {isChoice ? (
                      <div className="mt-3 space-y-1.5">
                        <label htmlFor={`opts-${r.uid}`} className="block text-sm font-bold">
                          Choices <span className="font-normal text-muted-foreground">(one per line)</span>
                        </label>
                        <textarea
                          id={`opts-${r.uid}`}
                          className={cn(input, "h-auto min-h-28 py-2")}
                          value={(f.options ?? []).join("\n")}
                          onChange={(e) => patch(r.uid, { options: e.target.value.split("\n").slice(0, LIMITS.options) })}
                        />
                      </div>
                    ) : null}
                    <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3">
                      <input type="checkbox" checked={f.required} onChange={(e) => patch(r.uid, { required: e.target.checked })} className="size-5 accent-primary" />
                      <span className="text-sm font-semibold">Must answer</span>
                    </label>
                  </li>
                );
              })}
            </ol>
            <button type="button" onClick={add} disabled={rows.length >= LIMITS.fields} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-foreground bg-background px-4 text-sm font-bold hover:bg-accent disabled:opacity-50">
              <Plus className="size-4" aria-hidden /> Add question
            </button>
          </section>
        </div>
      )}

      {error ? (
        <p role="alert" className="rounded-md border-2 border-destructive bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={save} disabled={saving} className="inline-flex min-h-12 items-center rounded-md border-2 border-foreground bg-primary px-6 text-base font-bold text-primary-foreground hard-shadow-xs hover:-translate-y-0.5 hover:hard-shadow-sm disabled:opacity-60">
          {saving ? "Saving…" : formId ? "Save changes" : "Create form"}
        </button>
        <button type="button" onClick={() => router.back()} className="inline-flex min-h-12 items-center rounded-md border-2 border-foreground bg-card px-6 text-base font-bold hover:bg-accent">
          Cancel
        </button>
      </div>
    </div>
  );
}
