import * as React from "react";
import { View } from "react-native";

import { Jyo, type JyoPose } from "@/ds";
import { useTheme } from "@/theme";

/**
 * Jyo standing on the blue field. Jyo's clay is the field's own blue in light
 * mode, so it sits on a soft disc of the layer colour to stay visible.
 * (Kit wish: a `Jyo onField` variant in src/ds/jyo.tsx.)
 */
export function JyoOnField({ size, pose = "hello", label }: { size: number; pose?: JyoPose; label?: string }) {
  const c = useTheme();
  const disc = Math.round(size * 1.12);
  return (
    <View style={{ width: disc, height: disc, borderRadius: disc / 2, backgroundColor: c.dark ? c.fieldTint : c.layer, alignItems: "center", justifyContent: "center" }}>
      <Jyo pose={pose} size={size} label={label} />
    </View>
  );
}
