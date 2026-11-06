"use client";

import * as React from "react";
import { Bold, Heading2, Italic, Link2, List, ListOrdered, Minus, Quote, RemoveFormatting, Underline } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A small formatted-text editor: type like a normal document and use the
 * toolbar for headings, bold, lists, quotes and links — no HTML needed.
 * The HTML it produces is cleaned again on the server (lib/email/rich-html).
 * Pasted content comes in as plain text so stray styles never sneak in.
 */
type Cmd = { label: string; icon: React.ComponentType<{ className?: string }>; command: string; value?: string; key?: string };

const CMDS: Cmd[] = [
  { label: "Heading", icon: Heading2, command: "formatBlock", value: "h2" },
  { label: "Bold", icon: Bold, command: "bold", key: "b" },
  { label: "Italic", icon: Italic, command: "italic", key: "i" },
  { label: "Underline", icon: Underline, command: "underline", key: "u" },
  { label: "Bulleted list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
  { label: "Quote", icon: Quote, command: "formatBlock", value: "blockquote" },
  { label: "Link", icon: Link2, command: "createLink", key: "k" },
  { label: "Divider line", icon: Minus, command: "insertHorizontalRule" },
  { label: "Plain paragraph / clear formatting", icon: RemoveFormatting, command: "clear" },
];

export function RichEditor({
  id,
  initialHtml = "",
  onChange,
  placeholder = "Write your message…",
  minHeight = "14rem",
  ariaLabel = "Message",
}: {
  id?: string;
  initialHtml?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  ariaLabel?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = React.useState(!initialHtml);

  // Set the starting content once; after that the browser owns the text so the
  // cursor never jumps while typing.
  React.useEffect(() => {
    if (ref.current && initialHtml) ref.current.innerHTML = initialHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = React.useCallback(() => {
    const html = ref.current?.innerHTML ?? "";
    setEmpty(!(ref.current?.textContent ?? "").trim());
    onChange(html);
  }, [onChange]);

  function apply(c: Cmd) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (c.command === "createLink") {
      const url = window.prompt("Link address (https://…)");
      if (!url || !/^(https?:\/\/|mailto:)/i.test(url.trim())) return;
      document.execCommand("createLink", false, url.trim());
    } else if (c.command === "clear") {
      document.execCommand("removeFormat");
      document.execCommand("formatBlock", false, "p");
    } else document.execCommand(c.command, false, c.value);
    emit();
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-foreground bg-background focus-within:ring-[3px] focus-within:ring-ring/60">
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-1 border-b-2 border-foreground/10 bg-card p-1.5">
        {CMDS.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              type="button"
              title={c.key ? `${c.label} (Ctrl/⌘ ${c.key.toUpperCase()})` : c.label}
              aria-label={c.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(c)}
              className="grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Icon className="size-4" aria-hidden />
            </button>
          );
        })}
      </div>
      <div className="relative">
        {empty ? <p aria-hidden className="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground">{placeholder}</p> : null}
        <div
          id={id}
          ref={ref}
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          onKeyDown={(e) => {
            if (!(e.metaKey || e.ctrlKey)) return;
            const c = CMDS.find((x) => x.key === e.key.toLowerCase());
            if (c) {
              e.preventDefault();
              apply(c);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
            emit();
          }}
          style={{ minHeight }}
          className={cn(
            "max-w-none px-4 py-3 text-sm leading-relaxed outline-none",
            "[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:font-bold [&_p]:mb-2 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6",
            "[&_blockquote]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-foreground [&_blockquote]:pl-3 [&_a]:font-bold [&_a]:text-link [&_a]:underline [&_hr]:my-3 [&_hr]:border-t-2 [&_hr]:border-foreground",
          )}
        />
      </div>
    </div>
  );
}
