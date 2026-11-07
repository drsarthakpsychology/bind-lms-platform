"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** The public link with a Copy button. The link wraps instead of pushing the page sideways. */
export function CopyLink({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy. Press and hold the link to copy it.");
    }
  }

  return (
    <div className={cn("flex min-w-0 items-stretch gap-2", className)}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 min-w-0 flex-1 items-center rounded-md border-2 border-foreground/20 bg-background px-3 font-mono text-xs break-all text-link underline-offset-4 hover:underline"
      >
        {url.replace(/^https?:\/\//, "")}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-bold hover:bg-accent"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
