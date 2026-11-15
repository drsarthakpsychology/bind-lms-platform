"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quietButton } from "@/components/ds";

/** Copy the public verify link (the thing to paste when sharing). */
export function CopyLink({ url, v2 = false }: { url: string; v2?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this link", url);
    }
  };
  if (v2) {
    return (
      <button type="button" className={quietButton} onClick={copy}>
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />} {copied ? "Copied" : "Copy link"}
      </button>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="pointer-coarse:h-11"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          window.prompt("Copy this link", url);
        }
      }}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />} {copied ? "Copied" : "Copy link"}
    </Button>
  );
}
