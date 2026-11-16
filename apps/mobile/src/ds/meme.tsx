import * as React from "react";
import { Image, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { settingsStore } from "@/lib/settings";
import { STATE_STICKER, stickerById, type StateMood, type StickerId } from "@/lib/reactions/stickers";
import { presets } from "@/motion";
import { useTheme } from "@/theme";

/**
 * A meme picture for an empty, error or success moment (the website's
 * reaction stickers). It sits on a soft rounded tile so the sticker's ink
 * outline reads on both the light and the dark page, tilts a little like a
 * sticker on paper, and pops in (a fade only with Reduce Motion).
 *
 * Follows the "Funny reactions" switch like the website's EmptySticker: with
 * reactions off it draws nothing and the words carry the message alone.
 * `always` keeps it for places where the picture is part of the layout.
 */
export function Meme({ mood, sticker, size = 112, delay = 80, always, tilt = -4, bg, line, style, testID }: { mood?: StateMood; /** Tile colours, for a fixed-colour backdrop (Welcome). */ bg?: string; line?: string; sticker?: StickerId; size?: number; delay?: number; always?: boolean; tilt?: number; style?: StyleProp<ViewStyle>; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const on = settingsStore.use((s) => s.reactions);
  if (!on && !always) return null;
  const s = stickerById(sticker ?? STATE_STICKER[mood ?? "empty"]);
  // The tile is square; the sticker fits inside with a little room for its shadow.
  const inner = Math.round(size * 0.84);
  const scale = Math.min(inner / s.w, inner / s.h);
  const good = mood === "win" || mood === "hello";
  return (
    <Animated.View entering={reduce ? presets.fade(delay) : presets.pop(delay)} style={style} testID={testID ?? "meme"}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={s.alt}
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
          backgroundColor: bg ?? (good ? c.successBg : c.tint),
          borderWidth: line ? 2 : 1,
          borderColor: line ?? c.hairline,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image source={s.src} style={{ width: Math.round(s.w * scale), height: Math.round(s.h * scale), transform: [{ rotate: `${tilt}deg` }] }} resizeMode="contain" />
      </View>
    </Animated.View>
  );
}
