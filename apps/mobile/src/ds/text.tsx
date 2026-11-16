import * as React from "react";
import { Text, type TextProps } from "react-native";

import { type as scale, useTheme, type Palette, type TypeName } from "@/theme";

type Tone = "ink" | "muted" | "link" | "danger" | "onPrimary" | "onBand" | "onBrand" | "alert";

function toneColor(c: Palette, tone: Tone): string {
  switch (tone) {
    case "muted":
      return c.muted;
    case "link":
      return c.link;
    case "danger":
      return c.danger;
    case "onPrimary":
      return c.onPrimary;
    case "onBand":
      return c.onBand;
    case "onBrand":
      return c.onBrand;
    case "alert":
      return c.alertFg;
    default:
      return c.ink;
  }
}

/**
 * Reading comfort for long text (the reader, notes, quick reference): `scale`
 * multiplies the size, `line` the space between lines. Set by `ReadingSize`
 * (src/lib/reading.tsx); outside it text keeps the normal scale.
 */
export const TextScale = React.createContext<{ scale: number; line: number } | null>(null);

export type TProps = TextProps & {
  /** One of the eight sizes. Default: body. */
  v?: TypeName;
  tone?: Tone;
  /** Tabular numbers, for counts and times. */
  num?: boolean;
  center?: boolean;
};

/**
 * All text in the app. Follows the phone's text size setting, up to 1.6x
 * (headings stop at 1.3x so a title cannot push the action off the screen).
 * Text wraps; it is never cut.
 */
export function T({ v = "body", tone = "ink", num, center, style, maxFontSizeMultiplier, ...rest }: TProps) {
  const c = useTheme();
  const big = v === "display" || v === "h1" || v === "h2";
  const reading = React.useContext(TextScale);
  const base = scale[v];
  // Headings grow half as much, so a title never pushes the action off the screen.
  const k = reading ? (big ? 1 + (reading.scale - 1) / 2 : reading.scale) : 1;
  const sized = reading && (k !== 1 || reading.line !== 1) ? { fontSize: Math.round(base.fontSize * k), lineHeight: Math.round(base.lineHeight * k * (big ? 1 : reading.line)) } : null;
  return (
    <Text
      accessibilityRole={v === "display" || v === "h1" || v === "h2" || v === "h3" ? "header" : undefined}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? (big ? 1.3 : 1.6)}
      {...rest}
      style={[base, sized, { color: toneColor(c, tone) }, num ? { fontVariant: ["tabular-nums"] } : null, center ? { textAlign: "center" } : null, style]}
    />
  );
}
