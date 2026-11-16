import * as Brightness from "expo-brightness";
import { useKeepAwake } from "expo-keep-awake";
import { router, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { ApiFailure, messageOf } from "@/api/errors";
import { Button, IconButton, T } from "@/ds";
import { Swap } from "@/motion";
import { fixed, fonts, layout, space, useTheme } from "@/theme";
import { adminClinicCalls, useSessionDetail } from "../api";
import type { ShowCode } from "../contract";
import { secondsLeft, sessionMeta, sessionTitle, skewOf } from "../logic";
import { QrCode } from "../qr";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * The ring around the seconds: full when a code appears, empty when it
 * changes. Runs on the UI thread, straight (a clock, not an ease). With
 * Reduce Motion it steps once a second with the number.
 */
export function CountdownRing({ seconds, period, size = 64 }: { seconds: number; period: number; size?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const stroke = 5;
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const v = useSharedValue(seconds / Math.max(1, period));
  React.useEffect(() => {
    const start = seconds / Math.max(1, period);
    if (reduce) {
      v.set(start);
      return;
    }
    v.set(start);
    v.set(withTiming(Math.max(0, (seconds - 1) / period), { duration: 1000, easing: Easing.linear }));
  }, [seconds, period, reduce, v]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - v.value) }));
  return (
    <View accessible accessibilityRole="timer" accessibilityLabel={`New code in ${seconds} seconds`} style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={c.hairline} />
        <AnimatedCircle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={c.dark ? c.primary : c.brand} strokeDasharray={`${len}`} animatedProps={props} />
      </Svg>
      <T v="score" num testID="code-seconds">
        {seconds}
      </T>
    </View>
  );
}

/** Keep the screen on and at full brightness while the code shows; put both back after. */
function useBright() {
  useKeepAwake("show-code");
  React.useEffect(() => {
    if (Platform.OS === "web") return;
    let before: number | null = null;
    let alive = true;
    void (async () => {
      try {
        before = await Brightness.getBrightnessAsync();
        if (alive) await Brightness.setBrightnessAsync(1);
      } catch {
        /* a phone without brightness control: the code still shows */
      }
    })();
    return () => {
      alive = false;
      if (before !== null) void Brightness.setBrightnessAsync(before).catch(() => undefined);
      else void Brightness.restoreSystemBrightnessAsync?.().catch(() => undefined);
    };
  }, []);
}

/**
 * Show code: a full screen QR that changes every 30 seconds, the 6 letters
 * under it for students who type, the seconds left on a ring, and how many
 * are in. Asks the server for each new code a moment after the window ends.
 */
export function ShowCodeScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const sid = String(id);
  useBright();
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const detail = useSessionDetail(sid);
  const [code, setCode] = React.useState<ShowCode | null>(null);
  const [skew, setSkew] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [now, setNow] = React.useState(() => Date.now());
  const [tries, setTries] = React.useState(0);

  React.useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const load = async () => {
      try {
        const r = await adminClinicCalls.code(sid);
        if (!alive) return;
        setCode(r);
        setSkew(skewOf(r.validUntil, r.refreshInMs, Date.now()));
        setError(null);
        // The next code: just after this window ends (the server says when).
        timer = setTimeout(() => void load(), Math.max(1000, Math.min(r.refreshInMs, 31_000)) + 250);
      } catch (e) {
        if (!alive) return;
        // Not open yet (409): say so, and look again every 30 seconds. Anything else: try again in 5.
        // A View Admin can show a code only once a Super Admin has opened it (403): say so, look again in 30 seconds.
        const closed = e instanceof ApiFailure && e.code === "conflict";
        const refused = e instanceof ApiFailure && e.code === "forbidden";
        if (closed || refused) setCode(null);
        setError(closed ? `${messageOf(e)} Scanning is open from 30 minutes before the start to an hour after the end.` : refused ? `${messageOf(e)} A Super Admin opens the code first; after that it shows here too.` : messageOf(e));
        timer = setTimeout(() => void load(), closed || refused ? 30_000 : 5000);
      }
    };
    void load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [sid, tries]);

  // The seconds on the ring: a clock, once a second.
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = code ? secondsLeft(code.validUntil, now, skew) : 0;
  const s = detail.data?.session;
  const qrSize = Math.max(200, Math.min(width - 48, height - 380, 420));
  const n = s?.counts;
  return (
    <View testID="show-code" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top, paddingBottom: insets.bottom + space[4] }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: space[2], minHeight: 56 }}>
        <IconButton label="Close" onPress={() => (router.canGoBack() ? router.back() : router.replace("/admin/clinic"))} testID="code-close">
          <X size={24} color={c.ink} />
        </IconButton>
        <View style={{ flex: 1, minWidth: 0, paddingHorizontal: space[2] }}>
          <T v="bodyStrong" numberOfLines={1}>
            {s ? sessionTitle(s) : "Attendance code"}
          </T>
          {s ? (
            <T v="small" tone="muted" num numberOfLines={1}>
              {sessionMeta(s)}
            </T>
          ) : null}
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: space[5], paddingHorizontal: layout.gutter }}>
        {code ? (
          <>
            <Swap k={code.code} testID="code-swap">
              <View style={{ alignItems: "center", gap: space[4] }}>
                <View style={{ padding: space[3], backgroundColor: fixed.white, borderRadius: 20 }}>
                  <QrCode text={code.qr} size={qrSize} testID="code-qr" />
                </View>
                <T accessibilityLabel={`Code ${code.code.split("").join(" ")}`} testID="code-text" style={{ fontFamily: fonts.display, fontSize: 44, lineHeight: 52, letterSpacing: 8, color: c.ink }} maxFontSizeMultiplier={1.2}>
                  {code.code}
                </T>
              </View>
            </Swap>
            {error ? (
              <T tone="alert" center>
                {error}
              </T>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
              <CountdownRing seconds={left} period={30} />
              <View>
                <T v="small" tone="muted">
                  New code in {left} s
                </T>
                {n ? (
                  <T v="bodyStrong" num testID="code-count">
                    {n.in + n.out} of {n.expected} in
                  </T>
                ) : null}
              </View>
            </View>
          </>
        ) : error ? (
          <View style={{ gap: space[3], alignItems: "center" }}>
            <T center tone="alert" testID="code-error">
              {error}
            </T>
            <Button kind="quiet" label="Try again" onPress={() => setTries((x) => x + 1)} />
          </View>
        ) : (
          <View style={{ width: qrSize, height: qrSize, borderRadius: 20, backgroundColor: c.skeleton }} accessibilityLabel="Loading the code" />
        )}
      </View>
      <T v="small" tone="muted" center style={{ paddingHorizontal: layout.gutter }}>
        Students scan this with the VIBHA app, or type the 6 letters.
      </T>
    </View>
  );
}
