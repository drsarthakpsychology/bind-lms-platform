import * as React from "react";

import { T, type TProps } from "@/ds/text";
import { fonts } from "@/theme";

/** Inline marks of course text: **bold**, *italic*, `term`. Nothing else. */
export type Piece = { text: string; bold?: boolean; italic?: boolean; term?: boolean };

export function parseInline(raw: string): Piece[] {
  // Section text comes from hand-written content: a missing or numeric text must still draw.
  const text = typeof raw === "string" ? raw : typeof raw === "number" ? String(raw) : "";
  const out: Piece[] = [];
  const re = /\*\*(.+?)\*\*|\*(?!\s)(.+?)\*|`(.+?)`/g;
  let at = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > at) out.push({ text: text.slice(at, m.index) });
    if (m[1] !== undefined) out.push({ text: m[1], bold: true });
    else if (m[2] !== undefined) out.push({ text: m[2], italic: true });
    else if (m[3] !== undefined) out.push({ text: m[3], term: true });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out;
}

/**
 * What tapping a glossary word does. The reader and the notes provide it
 * (open the word in the Quick reference); elsewhere a term is only drawn.
 */
export const TermPress = React.createContext<((word: string) => void) | null>(null);

/** Text with the inline marks drawn. A `term` is a glossary word: underlined with dots. */
export function Rich({ text, ...props }: { text: string } & Omit<TProps, "children">) {
  const pieces = parseInline(text);
  const onTerm = React.useContext(TermPress);
  return (
    <T {...props}>
      {pieces.map((p, i) =>
        p.bold || p.italic || p.term ? (
          <T
            key={i}
            v={props.v}
            tone={props.tone}
            {...(p.term && onTerm ? { onPress: () => onTerm(p.text), accessibilityRole: "link" as const, accessibilityHint: "Opens it in the Quick reference" } : null)}
            style={[p.bold ? { fontFamily: fonts.bold } : null, p.italic ? { fontStyle: "italic" } : null, p.term ? { textDecorationLine: "underline", textDecorationStyle: "dotted" } : null]}>
            {p.text}
          </T>
        ) : (
          p.text
        ),
      )}
    </T>
  );
}
