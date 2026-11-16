import { router } from "expo-router";
import * as React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Credential } from "@/api/contract";
import { useMe } from "@/api/queries";
import { Button, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Confetti, curves, dur, PixelBurst, scaled, Stamp, useMotionTier } from "@/motion";
import { fixed, fonts, layout, space } from "@/theme";
import { InkUnderline } from "./ink";
import { InkDraw } from "./parts";

/**
 * Certificate earned (storyboard 3, "stamped"), full screen, the first time
 * the app learns of a new certificate:
 *      0ms  the screen dims to ink; "Certificate earned" fades up 8px
 *    300ms  the certificate rises from below the screen, tilted 3 degrees,
 *           settling flat (675ms, the receipt curve)
 *    550ms  its hand-drawn frame draws itself (8 strokes, 500ms)
 *    900ms  the lime VIBHA stamp lands, a success haptic, confetti, two
 *           pixel bursts at the stamp
 *   1300ms  the name's underline draws in; View certificate and Share rise
 * A tap anywhere jumps to the end; after that a tap on the dim area closes.
 * Reduce Motion: the card, stamp and buttons fade in place at the same
 * times, the haptic stays, no confetti or bursts.
 */
export const CERT_AT = { card: 300, frame: 550, stamp: 900, name: 1300 } as const;
const RECEIPT = Easing.bezier(0.5, 0.3, 0.1, 1);

const PAPER = { bg: "#fdf8ec", ink: "#1a1a1a", blue: fixed.blue, soft: "#6b6b6b", lime: fixed.lime };

/** A beat: 0 to 1 after `delay`. Still: at 1 at once. Reduce Motion: a short fade (consumers use it for opacity only). */
function useBeat(delay: number, duration: number, still: boolean, easing = curves.out): SharedValue<number> {
  const reduce = useReducedMotion();
  const v = useSharedValue(still ? 1 : 0);
  React.useEffect(() => {
    if (still) v.set(1);
    else v.set(withDelay(delay, withTiming(1, { duration: reduce ? 250 : duration, easing })));
  }, [still, delay, duration, easing, reduce, v]);
  return v;
}

function issuedLine(iso: string | null): string {
  return iso ? `Issued ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "";
}

export function CertificateMoment({ cert, onClose, onShare }: { cert: Credential; onClose: () => void; onShare?: (c: Credential) => void }) {
  const reduce = useReducedMotion();
  const tier = useMotionTier();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const name = useMe().data?.name ?? "";
  const [still, setStill] = React.useState(false);
  const [landed, setLanded] = React.useState(false);
  const cardW = Math.min(340, width - layout.gutter * 2);
  const cardH = Math.round(cardW * 0.7);

  const scrim = useBeat(0, dur.enter, still);
  const title = useBeat(0, dur.enter, still);
  const card = useBeat(CERT_AT.card, 675, still, RECEIPT);
  const frame = useBeat(CERT_AT.frame, 500, still || !!reduce, curves.inOut);
  const after = useBeat(CERT_AT.name, dur.enter, still);

  // The stamp lands at 900ms: the haptic, confetti and bursts go with it. A skip lands it at once.
  React.useEffect(() => {
    if (landed) return;
    const id = setTimeout(() => setLanded(true), still ? 0 : CERT_AT.stamp);
    return () => clearTimeout(id);
  }, [still, landed]);
  React.useEffect(() => {
    if (landed) haptic.success();
  }, [landed]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: title.value, transform: [{ translateY: reduce ? 0 : (1 - title.value) * 8 }] }));
  const cardStyle = useAnimatedStyle(() => {
    const t = card.value;
    if (reduce) return { opacity: t };
    return { opacity: t > 0 ? 1 : 0, transform: [{ translateY: (1 - t) * (height * 0.6) }, { rotate: `${3 * (1 - t)}deg` }] };
  });
  const afterStyle = useAnimatedStyle(() => ({ opacity: after.value, transform: [{ translateY: reduce ? 0 : (1 - after.value) * 10 }] }));

  const inset = 10;
  const shapes = React.useMemo(() => {
    const [x0, y0, x1, y1] = [inset, inset, cardW - inset, cardH - inset];
    const [a0, b0, a1, b1] = [inset + 6, inset + 6, cardW - inset - 6, cardH - inset - 6];
    return [
      { k: "cf-t", shape: { t: "line" as const, x1: x0, y1: y0, x2: x1, y2: y0 } },
      { k: "cf-r", shape: { t: "line" as const, x1: x1, y1: y0, x2: x1, y2: y1 } },
      { k: "cf-b", shape: { t: "line" as const, x1: x1, y1: y1, x2: x0, y2: y1 } },
      { k: "cf-l", shape: { t: "line" as const, x1: x0, y1: y1, x2: x0, y2: y0 } },
      { k: "cf-it", shape: { t: "line" as const, x1: a0, y1: b0, x2: a1, y2: b0 } },
      { k: "cf-ir", shape: { t: "line" as const, x1: a1, y1: b0, x2: a1, y2: b1 } },
      { k: "cf-ib", shape: { t: "line" as const, x1: a1, y1: b1, x2: a0, y2: b1 } },
      { k: "cf-il", shape: { t: "line" as const, x1: a0, y1: b1, x2: a0, y2: b0 } },
    ];
  }, [cardW, cardH]);
  const frameOpts = React.useMemo(() => ({ stroke: PAPER.blue, sw: 1.8, rough: 0.8 }), []);

  // Leaving: everything fades out (exit 180ms) before the moment closes.
  const out = useSharedValue(1);
  const outStyle = useAnimatedStyle(() => ({ opacity: out.value }));
  const leave = (then?: () => void) => {
    out.set(withTiming(0, { duration: dur.exit, easing: curves.out }));
    setTimeout(() => {
      onClose();
      then?.();
    }, dur.exit);
  };
  const tap = () => {
    if (!still) setStill(true);
  };
  return (
    <Animated.View style={[{ flex: 1 }, outStyle]} testID="moment-cert">
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(12,12,14,0.88)" }, scrimStyle]}>
        <Pressable accessibilityLabel={still ? "Close" : "Skip"} onPress={still ? () => leave() : tap} style={{ flex: 1 }} testID="moment-scrim" />
      </Animated.View>
      <View pointerEvents="box-none" style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: insets.top, paddingBottom: insets.bottom, gap: space[5] }}>
        <Animated.View pointerEvents="none" style={titleStyle}>
          <T v="h2" center style={{ color: fixed.white }} accessibilityRole="header">
            Certificate earned
          </T>
        </Animated.View>
        <Animated.View style={cardStyle}>
          <Pressable onPress={tap} accessible accessibilityLabel={`${cert.title}. ${name ? `Awarded to ${name}. ` : ""}${issuedLine(cert.issuedAt)}`} style={{ width: cardW, height: cardH, backgroundColor: PAPER.bg, borderRadius: 6, borderWidth: 3, borderColor: PAPER.blue, alignItems: "center", justifyContent: "center", padding: space[5], gap: space[1] }}>
            <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0 }}>
              <InkDraw shapes={shapes} p={frame} width={cardW} height={cardH} o={frameOpts} />
            </View>
            <T v="caption" center style={{ color: PAPER.blue, fontFamily: fonts.pixel, letterSpacing: 1 }}>
              VIBHA SCHOOL OF PSYCHOLOGY
            </T>
            <T v="small" center style={{ color: PAPER.soft, paddingTop: space[2] }}>
              {name ? "Awarded to" : "Awarded for"}
            </T>
            {name ? (
              <View style={{ alignItems: "center" }}>
                <T v="h2" center numberOfLines={1} style={{ color: PAPER.ink }}>
                  {name}
                </T>
                {still || landed ? <InkUnderline width={Math.min(cardW - 80, 200)} color={PAPER.blue} delay={still ? 0 : CERT_AT.name - CERT_AT.stamp} k={`cert-name-${cert.credentialId}`} /> : <View style={{ height: 10 }} />}
              </View>
            ) : null}
            <T v="bodyStrong" center numberOfLines={2} style={{ color: PAPER.ink }}>
              {cert.title}
            </T>
            <T v="caption" center style={{ color: PAPER.soft }}>
              {issuedLine(cert.issuedAt)}
            </T>
            <View pointerEvents="none" style={{ position: "absolute", right: -14, bottom: -18 }}>
              {landed ? (
                <View>
                  <Stamp fire={still && !reduce ? 0 : 1} rotate={-6}>
                    <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: PAPER.lime, borderWidth: 3, borderColor: PAPER.ink, alignItems: "center", justifyContent: "center" }}>
                      <T style={{ fontFamily: fonts.pixel, fontSize: 14, lineHeight: 18, color: PAPER.ink }}>VIBHA</T>
                    </View>
                  </Stamp>
                  <PixelBurst fire={still ? 0 : 1} bursts={2} reach={58} />
                </View>
              ) : null}
            </View>
          </Pressable>
        </Animated.View>
        <Animated.View style={[{ width: cardW, gap: space[2], paddingTop: space[3] }, afterStyle]} pointerEvents={still || landed ? "auto" : "none"}>
          <Button
            label="View certificate"
            onPress={() => leave(() => router.push(`/certificate/${encodeURIComponent(cert.credentialId)}`))}
            testID="moment-cert-view"
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {cert.verifyUrl && onShare ? <Button kind="text" label="Share" onPress={() => onShare(cert)} testID="moment-cert-share" /> : <View />}
            <Button kind="text" label="Close" onPress={() => leave()} testID="moment-close" />
          </View>
        </Animated.View>
      </View>
      <Confetti fire={landed && !still ? 1 : 0} count={scaled(36, tier)} />
    </Animated.View>
  );
}
