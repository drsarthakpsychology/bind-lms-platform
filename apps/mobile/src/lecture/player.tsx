import { useEventListener } from "expo";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw } from "lucide-react-native";
import * as React from "react";
import { AppState, BackHandler, Platform, Pressable, View, type LayoutChangeEvent } from "react-native";
import Animated, { FadeIn, FadeOut, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isCaptured, onCaptureChange } from "../../modules/capture-guard/src";
import type { StreamAccess } from "@/api/contract";
import { ApiFailure, messageOf } from "@/api/errors";
import { api } from "@/auth";
import { Button, Skeleton, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { allowRotation, goLandscape, holdPortrait } from "@/lib/orientation";
import { fonts, layout, motion, space } from "@/theme";
import { Watermark } from "./watermark";

/**
 * The protected lecture player.
 *  - Asks POST /lectures/:id/stream for a short-lived address (the same HLS,
 *    AES-128 stream and quality ladder as the website) and plays it with the
 *    headers the server names on every request.
 *  - Draws the moving watermark (name and roll number) over the picture.
 *  - Android: the whole app has FLAG_SECURE (app/_layout.tsx), so recordings
 *    and screenshots come out black. iPhone: while the screen is recorded or
 *    mirrored the picture is hidden and the lecture paused.
 *  - Full screen is the app's own (turns the phone on its side and fills the
 *    screen), so the watermark stays on top. Back leaves full screen first.
 *  - Pauses when the app goes to the background.
 * In mock mode (no server) a stand-in surface plays a silent timeline so the
 * screen can be built and tested.
 */

export type Playback = { playing: boolean; time: number; duration: number; ready: boolean; failed: string | null; play: () => void; pause: () => void; seek: (t: number) => void };

export function clock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

/* ------------------------------------------------------------- surfaces */

function RealSurface({ access, children }: { access: StreamAccess; children: (p: Playback) => React.ReactNode }) {
  const player = useVideoPlayer({ uri: access.url, headers: access.headers, contentType: access.mediaType === "hls" ? "hls" : "progressive" }, (p) => {
    p.timeUpdateEventInterval = 1;
    p.staysActiveInBackground = false;
    if (access.resumeSeconds > 5) p.currentTime = access.resumeSeconds;
  });
  const [state, setState] = React.useState({ playing: false, time: access.resumeSeconds, duration: access.durationSeconds ?? 0, ready: false, failed: null as string | null });
  useEventListener(player, "timeUpdate", (e) => setState((s) => ({ ...s, time: e.currentTime, duration: player.duration || s.duration })));
  useEventListener(player, "playingChange", (e) => setState((s) => ({ ...s, playing: e.isPlaying })));
  useEventListener(player, "statusChange", (e) => setState((s) => ({ ...s, ready: e.status === "readyToPlay" || s.ready, failed: e.status === "error" ? (e.error?.message ?? "The lecture could not play.") : null })));
  const pb: Playback = {
    ...state,
    play: () => player.play(),
    pause: () => player.pause(),
    seek: (t) => {
      // eslint-disable-next-line react-hooks/immutability -- the player is a native object, not React state
      player.currentTime = Math.max(0, Math.min(t, state.duration || t));
      setState((s) => ({ ...s, time: t }));
    },
  };
  return (
    <>
      <VideoView player={player} nativeControls={false} contentFit="contain" allowsPictureInPicture={false} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      {children(pb)}
    </>
  );
}

/** Mock mode: a dark surface and a clock, so the screen works without a server. */
function MockSurface({ access, children }: { access: StreamAccess; children: (p: Playback) => React.ReactNode }) {
  const duration = access.durationSeconds ?? 3600;
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(access.resumeSeconds);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => Math.min(duration, t + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, duration]);
  return <>{children({ playing, time, duration, ready: true, failed: null, play: () => setPlaying(true), pause: () => setPlaying(false), seek: (t) => setTime(Math.max(0, Math.min(duration, t))) })}</>;
}

/* ------------------------------------------------------------- controls */

function Scrubber({ time, duration, onSeek }: { time: number; duration: number; onSeek: (t: number) => void }) {
  const [w, setW] = React.useState(1);
  const [drag, setDrag] = React.useState<number | null>(null);
  const pct = duration ? Math.min(1, (drag ?? time) / duration) : 0;
  const at = (x: number) => Math.max(0, Math.min(1, x / w)) * duration;
  // Touch and drag along the line (the system responder: works the same on every platform).
  return (
      <View
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width || 1)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => setDrag(at(e.nativeEvent.locationX))}
        onResponderMove={(e) => setDrag(at(e.nativeEvent.locationX))}
        onResponderRelease={(e) => {
          onSeek(at(e.nativeEvent.locationX));
          setDrag(null);
        }}
        onResponderTerminate={() => setDrag(null)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Position in the lecture"
        accessibilityValue={{ text: `${clock(time)} of ${clock(duration)}` }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => onSeek(time + (e.nativeEvent.actionName === "increment" ? 30 : -30))}
        style={{ height: layout.target, justifyContent: "center", flex: 1 }}
      >
        <View pointerEvents="none" style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.3)", overflow: "visible" }}>
          <View style={{ width: `${pct * 100}%`, height: 4, borderRadius: 2, backgroundColor: "#cdf24b" }} />
          <View style={{ position: "absolute", left: `${pct * 100}%`, top: -6, width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: "#ffffff" }} />
        </View>
      </View>
  );
}

function RoundButton({ label, onPress, children, size = 48 }: { label: string; onPress: () => void; children: React.ReactNode; size?: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} style={({ pressed }) => ({ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? "rgba(255,255,255,0.22)" : "rgba(17,17,17,0.45)" })}>
      {children}
    </Pressable>
  );
}

function Controls({ pb, full, onFull, onFirstPlay }: { pb: Playback; full: boolean; onFull: () => void; onFirstPlay: () => void }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(true);
  // Controls fade away 3 s after the lecture starts playing; a tap brings them back.
  React.useEffect(() => {
    if (!pb.playing || !shown) return;
    const id = setTimeout(() => setShown(false), 3000);
    return () => clearTimeout(id);
  }, [pb.playing, shown]);
  const toggle = () => {
    haptic.select();
    if (pb.playing) pb.pause();
    else {
      onFirstPlay();
      pb.play();
    }
  };
  return (
    <Pressable accessibilityLabel={shown ? "Hide controls" : "Show controls"} onPress={() => setShown((s) => !s)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} testID="player-surface">
      {shown ? (
        <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.state)} exiting={reduce ? undefined : FadeOut.duration(motion.state)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.28)", justifyContent: "space-between" }}>
          <View />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[6] }}>
            <RoundButton label="Back 10 seconds" onPress={() => pb.seek(pb.time - 10)}>
              <RotateCcw size={22} color="#ffffff" />
            </RoundButton>
            <RoundButton label={pb.playing ? "Pause" : "Play"} onPress={toggle} size={64}>
              {pb.playing ? <Pause size={30} color="#ffffff" fill="#ffffff" /> : <Play size={30} color="#ffffff" fill="#ffffff" style={{ marginLeft: 3 }} />}
            </RoundButton>
            <RoundButton label="Forward 10 seconds" onPress={() => pb.seek(pb.time + 10)}>
              <RotateCw size={22} color="#ffffff" />
            </RoundButton>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[3] }}>
            <T v="caption" num style={{ color: "#ffffff", fontFamily: fonts.semibold }} maxFontSizeMultiplier={1.2}>
              {clock(pb.time)}
            </T>
            <Scrubber time={pb.time} duration={pb.duration} onSeek={pb.seek} />
            <T v="caption" num style={{ color: "#ffffff", fontFamily: fonts.semibold }} maxFontSizeMultiplier={1.2}>
              {clock(pb.duration)}
            </T>
            <Pressable accessibilityRole="button" accessibilityLabel={full ? "Leave full screen" : "Full screen"} onPress={onFull} hitSlop={6} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="player-full">
              {full ? <Minimize size={22} color="#ffffff" /> : <Maximize size={22} color="#ffffff" />}
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

/* --------------------------------------------------------------- player */

export type PlayerProps = {
  lessonId: string;
  /** Called about once a second while playing: position and length in seconds. */
  onTime?: (time: number, duration: number, playing: boolean) => void;
  /** For tests: skip the root check. */
  compromised?: boolean;
};

type Phase = { kind: "loading" } | { kind: "ready"; access: StreamAccess } | { kind: "refused"; message: string } | { kind: "error"; message: string };

export function ProtectedPlayer({ lessonId, onTime, compromised }: PlayerProps) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = React.useState<Phase>({ kind: "loading" });
  const [full, setFull] = React.useState(false);
  const [captured, setCaptured] = React.useState(isCaptured());
  const [attempt, setAttempt] = React.useState(0);
  const pbRef = React.useRef<Playback | null>(null);

  React.useEffect(() => {
    let live = true;
    void (async () => {
      const rooted = compromised ?? (Platform.OS === "android" ? await Device.isRootedExperimentalAsync().catch(() => false) : false);
      try {
        const access = await api.post<StreamAccess>(`/lectures/${encodeURIComponent(lessonId)}/stream`, { deviceCompromised: rooted });
        if (live) setPhase({ kind: "ready", access });
      } catch (e) {
        if (!live) return;
        if (e instanceof ApiFailure && e.code === "video_refused") setPhase({ kind: "refused", message: e.message });
        else setPhase({ kind: "error", message: messageOf(e) });
      }
    })();
    return () => {
      live = false;
    };
  }, [lessonId, attempt, compromised]);

  // iPhone: hide and pause while the screen is recorded or mirrored.
  React.useEffect(() => {
    const sub = onCaptureChange((on) => {
      setCaptured(on);
      if (on) pbRef.current?.pause();
    });
    return () => sub.remove();
  }, []);

  // Pause in the background.
  React.useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active") pbRef.current?.pause();
    });
    return () => sub.remove();
  }, []);

  // The lecture screen may turn; everything else stays upright.
  React.useEffect(() => {
    void allowRotation();
    return () => void holdPortrait();
  }, []);

  const toggleFull = React.useCallback(() => {
    haptic.select();
    setFull((f) => {
      if (f) void allowRotation();
      else void goLandscape();
      return !f;
    });
  }, []);

  React.useEffect(() => {
    if (!full) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      toggleFull();
      return true;
    });
    return () => sub.remove();
  }, [full, toggleFull]);

  const frame = full
    ? { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, paddingLeft: insets.left, paddingRight: insets.right }
    : { width: "100%" as const, aspectRatio: 16 / 9 };

  let body: React.ReactNode;
  if (phase.kind === "loading") {
    body = (
      <View testID="player-loading" accessibilityLabel="Loading the lecture" style={{ flex: 1, justifyContent: "flex-end", padding: space[4], gap: space[2] }}>
        <Skeleton h={4} r={2} style={{ backgroundColor: "rgba(255,255,255,0.18)" }} />
      </View>
    );
  } else if (phase.kind === "refused" || phase.kind === "error") {
    body = (
      <View testID={phase.kind === "refused" ? "player-refused" : "player-error"} style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: space[5], gap: space[3] }}>
        <T center style={{ color: "#ffffff" }}>
          {phase.message}
        </T>
        {phase.kind === "error" ? <Button kind="quiet" full={false} label="Try again" onPress={() => {
              setPhase({ kind: "loading" });
              setAttempt((a) => a + 1);
            }} style={{ backgroundColor: "#ffffff", borderRadius: layout.radius }} /> : null}
      </View>
    );
  } else {
    const Surface = phase.access.url.startsWith("mock://") ? MockSurface : RealSurface;
    body = (
      <Surface access={phase.access}>
        {(pb) => {
          pbRef.current = pb;
          return (
            <>
              <TimeReporter pb={pb} onTime={onTime} />
              {pb.failed ? (
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", padding: space[5], gap: space[3] }}>
                  <T center style={{ color: "#ffffff" }}>
                    The lecture stopped. Check your internet and try again.
                  </T>
                  <Button kind="quiet" full={false} label="Try again" onPress={() => {
              setPhase({ kind: "loading" });
              setAttempt((a) => a + 1);
            }} style={{ backgroundColor: "#ffffff", borderRadius: layout.radius }} />
                </View>
              ) : (
                <Controls pb={pb} full={full} onFull={toggleFull} onFirstPlay={() => undefined} />
              )}
              <Watermark text={phase.access.watermark.text} />
            </>
          );
        }}
      </Surface>
    );
  }

  return (
    <View testID="player" style={[frame, { backgroundColor: "#000000", overflow: "hidden" }]}>
      {full ? <StatusBar hidden /> : null}
      {body}
      {captured ? (
        <View testID="player-captured" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", padding: space[5] }}>
          <T center style={{ color: "#ffffff" }}>
            Screen recording or mirroring is on, so the lecture is hidden. Turn it off to carry on.
          </T>
        </View>
      ) : null}
    </View>
  );
}

/** Passes the position up without re-rendering the screen on every tick. */
function TimeReporter({ pb, onTime }: { pb: Playback; onTime?: PlayerProps["onTime"] }) {
  const t = Math.floor(pb.time);
  React.useEffect(() => {
    onTime?.(t, pb.duration, pb.playing);
  }, [t, pb.duration, pb.playing, onTime]);
  return null;
}
