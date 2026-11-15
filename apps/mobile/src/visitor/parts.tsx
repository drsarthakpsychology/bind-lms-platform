import * as React from "react";
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { T } from "@/ds";
import { fonts, space } from "@/theme";
import type { CastName } from "./art";
import { Person } from "./Art";
import { Reveal } from "./motion";

/** The website's small pixel label (Silkscreen, upper case). For tags and tiny labels only. */
export function Pix({ children, color, size = 11, style }: { children: string; color: string; size?: number; style?: StyleProp<TextStyle> }) {
  return (
    <Text allowFontScaling maxFontSizeMultiplier={1.3} style={[{ fontFamily: fonts.pixel, fontSize: size, lineHeight: Math.round(size * 1.6), letterSpacing: 0.6, color, textTransform: "uppercase" }, style]}>
      {children}
    </Text>
  );
}

/** The dotted texture of the website's blue panels. */
export function Dots({ color = "rgba(255,255,255,0.16)", gap = 18 }: { color?: string; gap?: number }) {
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="vdots" x={0} y={0} width={gap} height={gap} patternUnits="userSpaceOnUse">
            <Circle cx={gap / 2} cy={gap / 2} r={1.4} fill={color} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#vdots)" />
      </Svg>
    </View>
  );
}

/**
 * A chapter heading, as on the website: a pixel tag, a big title and its
 * second half in the accent colour, an optional quiet line.
 */
export function Head({ tag, title, accent, sub, ink, accentColor, muted, tagColor }: { tag: string; title: string; accent?: string; sub?: string; ink: string; accentColor: string; muted: string; tagColor?: string }) {
  return (
    <View style={{ gap: space[3] }}>
      <Reveal kind="fade">
        <Pix color={tagColor ?? accentColor}>{tag}</Pix>
      </Reveal>
      <Reveal lag={10}>
        <T v="display" style={{ color: ink, fontSize: 32, lineHeight: 36 }}>
          {title}
          {accent ? (
            <>
              {"\n"}
              <T v="display" style={{ color: accentColor, fontSize: 32, lineHeight: 36 }}>
                {accent}
              </T>
            </>
          ) : null}
        </T>
      </Reveal>
      {sub ? (
        <Reveal lag={30}>
          <T v="reading" style={{ color: muted, maxWidth: 560 }}>
            {sub}
          </T>
        </Reveal>
      ) : null}
    </View>
  );
}

/** A person's head and shoulders in a round frame (the group of five, the faculty). */
export function Face({ who, size = 44, ring, bg = "#e8edff", style }: { who: CastName; size?: number; ring: string; bg?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", backgroundColor: bg, borderWidth: 2, borderColor: ring, alignItems: "center" }, style]}>
      <Person who={who} width={size * 1.25} style={{ marginTop: size * 0.02 }} />
    </View>
  );
}

/** Initials in a round frame, for faculty without a drawing. */
export function Initials({ text, size = 44, bg, fg, ring }: { text: string; size?: number; bg: string; fg: string; ring: string }) {
  return (
    <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, borderWidth: 2, borderColor: ring, alignItems: "center", justifyContent: "center" }}>
      <Text allowFontScaling={false} style={{ fontFamily: fonts.pixel, fontSize: size * 0.32, color: fg }}>
        {text}
      </Text>
    </View>
  );
}
