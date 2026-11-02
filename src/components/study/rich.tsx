import * as React from "react";

/** Inline formatting for course text: **bold** and *italic*. Everything else is plain text. */
export function Rich({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(?!\s)(.+?)\*/g;
  let last = 0;
  let k = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={k++} className="font-black">{m[1]}</strong>);
    else out.push(<em key={k++}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Strip a trailing [core]/[extra] tag from a heading, returning the tag separately. */
export function splitTag(text: string): { text: string; tag?: "core" | "extra" } {
  const m = text.match(/^(.*?)\s*\[(core|extra)\]\s*$/);
  return m ? { text: m[1], tag: m[2] as "core" | "extra" } : { text };
}
