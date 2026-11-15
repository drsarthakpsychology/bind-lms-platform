import * as React from "react";
import { View } from "react-native";

import { T } from "@/ds/text";
import { layout, space, useTheme } from "@/theme";
import { Rich } from "../rich";

/** The frame every study widget sits in: a quiet label, an optional title, the piece, a caption. */
export function WidgetFrame({ label = "Try it", title, caption, children, testID }: { label?: string; title?: string; caption?: string; children: React.ReactNode; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, padding: space[4], gap: space[4] }}>
      <View style={{ gap: space[1] }}>
        <T v="caption" tone="link">
          {label.toUpperCase()}
        </T>
        {title ? <Rich text={title} v="h3" /> : null}
      </View>
      {children}
      {caption ? <Rich text={caption} v="small" tone="muted" /> : null}
    </View>
  );
}

/** Seeded shuffle, so a widget does not reorder itself on every render. */
export function shuffle<T>(items: T[], seed: number): T[] {
  const a = items.slice();
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
