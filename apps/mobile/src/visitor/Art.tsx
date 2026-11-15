import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

import { CAST, characterSvg, iconSvg, sparkleSvg, starSvg, type CastName, type IconName } from "./art";

/** The website's illustrations never change while the app runs: build each SVG string once. */
const cache = new Map<string, string>();
function memo(key: string, make: () => string): string {
  let v = cache.get(key);
  if (v === undefined) {
    v = make();
    cache.set(key, v);
  }
  return v;
}

const hidden = { accessible: false, importantForAccessibility: "no-hide-descendants" as const, accessibilityElementsHidden: true };

/** One of the homepage's people (same drawings as the website). Width sets the size; height follows the 200:232 drawing. */
export function Person({ who, width, flip, style }: { who: CastName; width: number; flip?: boolean; style?: StyleProp<ViewStyle> }) {
  const xml = memo(`p:${who}:${flip ? 1 : 0}`, () => characterSvg({ ...CAST[who], flip }));
  const h = Math.round((width * 232) / 200);
  return (
    <View {...hidden} pointerEvents="none" style={[{ width, height: h }, style]}>
      <SvgXml xml={xml} width={width} height={h} />
    </View>
  );
}

/** The homepage's chunky star (a seal behind a person, or a loose sticker). */
export function Star({ size, fill, stroke = "#111111", points = 12, style }: { size: number; fill: string; stroke?: string; points?: number; style?: StyleProp<ViewStyle> }) {
  const xml = memo(`s:${points}:${fill}:${stroke}`, () => starSvg(points, 54, 96, fill, stroke));
  return (
    <View {...hidden} pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

export function Sparkle({ size, fill, style }: { size: number; fill: string; style?: StyleProp<ViewStyle> }) {
  const xml = memo(`k:${fill}`, () => sparkleSvg(fill));
  return (
    <View {...hidden} pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

export function Icon({ name, size, fill, style }: { name: IconName; size: number; fill?: string; style?: StyleProp<ViewStyle> }) {
  const xml = memo(`i:${name}:${fill ?? ""}`, () => iconSvg(name, fill));
  return (
    <View {...hidden} pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
