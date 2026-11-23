"use client";

import * as React from "react";
import { Monitor, Smartphone, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { byteSize, designedToText, DESIGNED_LIMITS, fillDesigned, previewDocument, type DesignedClean } from "@/lib/email/designed-html";
import { btn, Notice } from "../_v2/kit";

/**
 * The parts every composer shares for a designed (HTML) email: the two-way
 * switch at the top, the HTML box with upload and what was taken out, and
 * the preview. The pasted HTML is only ever shown inside a sandboxed frame
 * (no scripts, no same origin), never in the admin page itself.
 */

export type ComposeMode = "simple" | "designed";
export type PreviewWidth = "phone" | "desktop";

const MODES: Array<{ id: ComposeMode; label: string }> = [
  { id: "simple", label: "Simple message" },
  { id: "designed", label: "Designed email (HTML)" },
];

export const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

export const fieldClass =
  "h-11 w-full min-w-0 rounded-md border border-[var(--ds-card-line)] bg-background px-3 type-small text-foreground outline-none transition-colors duration-[var(--ds-state)] hover:border-foreground/50 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring";

/** "Simple message | Designed email (HTML)", at the top of every composer. */
export function ModeToggle({ mode, onChange }: { mode: ComposeMode; onChange: (m: ComposeMode) => void }) {
  return (
    <div role="radiogroup" aria-label="Kind of email" className="grid min-w-0 grid-cols-2 gap-1 rounded-md border border-[var(--ds-card-line)] p-1">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={mode === m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "flex min-h-11 min-w-0 items-center justify-center rounded-[5px] px-2 text-center type-small font-semibold transition-colors duration-[var(--ds-state)] lg:min-h-9",
            mode === m.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/** The HTML box (paste or upload), its size, what was taken out, and the optional plain-text version. */
export function DesignedFields({
  html,
  onHtml,
  text,
  onText,
  cleaned,
  htmlRef,
  textRef,
  onFocusHtml,
  onFocusText,
  idPrefix = "cm",
}: {
  html: string;
  onHtml: (v: string) => void;
  text: string;
  onText: (v: string) => void;
  cleaned: DesignedClean | null;
  htmlRef?: React.Ref<HTMLTextAreaElement>;
  textRef?: React.Ref<HTMLTextAreaElement>;
  onFocusHtml?: () => void;
  onFocusText?: () => void;
  idPrefix?: string;
}) {
  const [fileNote, setFileNote] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function pickFile(file: File | undefined) {
    if (!file) return;
    if (!/\.html?$/i.test(file.name) && file.type !== "text/html") {
      setFileNote("Pick a .html file.");
      return;
    }
    if (file.size > DESIGNED_LIMITS.bytes) {
      setFileNote(`That file is ${kb(file.size)}. The most is ${kb(DESIGNED_LIMITS.bytes)}.`);
      return;
    }
    onHtml(await file.text());
    setFileNote(`Loaded ${file.name}.`);
  }

  const ok = cleaned && !cleaned.error;
  return (
    <>
      <div>
        <div className="mb-1.5 flex min-w-0 flex-wrap items-center justify-between gap-2">
          <label htmlFor={`${idPrefix}-html`} className="type-small font-semibold">HTML</label>
          <button type="button" className={btn.quiet} onClick={() => fileRef.current?.click()}>
            <Upload aria-hidden /> Upload .html file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".html,.htm,text/html"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              void pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
        <textarea
          id={`${idPrefix}-html`}
          ref={htmlRef}
          rows={10}
          spellCheck={false}
          placeholder="Paste the HTML here"
          className={cn(fieldClass, "h-auto min-h-56 py-2 font-mono text-[13px] leading-snug")}
          value={html}
          onFocus={onFocusHtml}
          onChange={(e) => onHtml(e.target.value)}
        />
        <p className="mt-1.5 type-caption text-muted-foreground type-num">
          {html ? `${kb(byteSize(html))} of ${kb(DESIGNED_LIMITS.bytes)}` : `Up to ${kb(DESIGNED_LIMITS.bytes)}`}
          {fileNote ? ` · ${fileNote}` : ""}
        </p>
      </div>
      {html && cleaned?.error ? <Notice tone="alert">{cleaned.error}</Notice> : null}
      {ok && cleaned.removed.length ? (
        <Notice>
          <span>Taken out before sending: {cleaned.removed.map((r) => r.label).join(", ")}.</span>
        </Notice>
      ) : null}
      <div>
        <label htmlFor={`${idPrefix}-text`} className="mb-1.5 block type-small font-semibold">Plain-text version (optional)</label>
        <textarea
          id={`${idPrefix}-text`}
          ref={textRef}
          rows={4}
          placeholder={ok ? designedToText(cleaned.html).slice(0, 400) : ""}
          className={cn(fieldClass, "h-auto min-h-28 py-2 leading-normal")}
          value={text}
          maxLength={DESIGNED_LIMITS.text}
          onFocus={onFocusText}
          onChange={(e) => onText(e.target.value)}
        />
        <p className="mt-1.5 type-caption text-muted-foreground">Left empty, it is made from the design.</p>
      </div>
    </>
  );
}

/** Phone or desktop preview of the cleaned design, filled in for one person. */
export function DesignedPreview({
  subject,
  cleaned,
  vars,
  view,
  onView,
}: {
  subject: string;
  cleaned: DesignedClean | null;
  vars: Record<string, string> | null;
  view: PreviewWidth;
  onView: (v: PreviewWidth) => void;
}) {
  const shownSubject = vars ? fillDesigned(subject, vars, "text") : subject;
  // Shown only inside the sandboxed frame below, never in this page.
  const doc = cleaned && !cleaned.error ? previewDocument(vars ? fillDesigned(cleaned.html, vars, "html") : cleaned.html) : "";
  return (
    <>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 flex-1 type-small font-semibold [overflow-wrap:anywhere]">{shownSubject || "No subject yet"}</p>
        <div role="radiogroup" aria-label="Preview width" className="flex shrink-0 gap-1 rounded-md border border-[var(--ds-card-line)] p-1">
          {([["phone", "Phone", Smartphone], ["desktop", "Desktop", Monitor]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={view === id}
              onClick={() => onView(id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-[5px] px-2.5 type-caption font-semibold transition-colors duration-[var(--ds-state)] lg:min-h-8 [&_svg]:size-4",
                view === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
              )}
            >
              <Icon aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0 overflow-x-auto rounded-md bg-[var(--ds-tint)] p-2">
        {doc ? (
          <iframe
            title="Email preview"
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={doc}
            className={cn("mx-auto block h-[34rem] rounded-[4px] border border-[var(--ds-card-line)] bg-white", view === "phone" ? "w-full max-w-[375px]" : "w-full min-w-[640px]")}
          />
        ) : (
          <p className="flex h-40 items-center justify-center px-4 text-center type-small text-muted-foreground">The design shows here.</p>
        )}
      </div>
    </>
  );
}
