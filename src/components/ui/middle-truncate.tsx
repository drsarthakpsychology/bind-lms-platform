import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Where to cut a long string so the end stays readable. Emails keep the whole
 * "@domain" (the part people recognise); other text keeps its last 8
 * characters. Short strings are not split.
 */
export function splitForMiddle(text: string): [head: string, tail: string] {
  const at = text.lastIndexOf("@");
  if (at > 0 && at < text.length - 1) return [text.slice(0, at), text.slice(at)];
  if (text.length <= 16) return [text, ""];
  return [text.slice(0, -8), text.slice(-8)];
}

/**
 * One line of text that, when it doesn't fit, loses its middle rather than
 * its end: "priya.sharma.cl…@gmail.com". The full text is in the tooltip and
 * is read in full by screen readers.
 */
export function MiddleTruncate({ text, className }: { text: string; className?: string }) {
  const [head, tail] = splitForMiddle(text);
  return (
    <span className={cn("flex min-w-0 max-w-full whitespace-nowrap", className)} title={text}>
      <span className="min-w-0 truncate">{head}</span>
      {tail ? <span className="max-w-[70%] shrink-0 truncate">{tail}</span> : null}
    </span>
  );
}
