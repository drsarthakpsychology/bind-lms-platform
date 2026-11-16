import { useEventListener } from "expo";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { Maximize, Minimize, RotateCcw, RotateCw } from "lucide-react-native";
import * as React from "react";
import { AppState, Platform, Pressable, View, type LayoutChangeEvent } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { isCaptured, onCaptureChange } from "../../modules/capture-guard/src";
import type { StreamAccess } from "@/api/contract";
import { ApiFailure, reasonOf } from "@/api/errors";
import { streamView } from "@/api/adapt-core";
import { api, session } from "@/auth";
import { Button, Skeleton, T } from "@/ds";
import { presets } from "@/motion";
import { ThemeProvider, fixed, fonts, layout, space } from "@/theme";
import { LectureIntro, type IntroInfo } from "./intro";
import { PlayPause } from "./playmorph";
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
 *  - Full screen is the app's own, so the watermark and these controls stay on
 *    top: the lecture screen owns it (src/lecture/fullscreen.ts: the side lock,
 *    hidden system bars, Back, turning the phone) and hides everything around the
 *    player, so the player is never moved or remounted and playback runs on.
 *  - Pauses when the app goes to the background.
 * In mock mode (no server) a stand-in surface plays a silent timeline so the
 * screen can be built and tested.
 */

export type Playback = { playing: boolean; time: number; duration: number; ready: boolean; failed: string | null; play: () => void; pause: () => void; seek: (t: number) => void; /** Playback speed, 1 is normal. */ rate: number; setRate: (r: number) => void };

/** The speeds the speed button steps through. */
export const SPEEDS = [1, 1.25, 1.5, 2] as const;
export const nextSpeed = (r: number): number => SPEEDS[(SPEEDS.findIndex((x) => x === r) + 1) % SPEEDS.length] ?? 1;
export const speedLabel = (r: number): string => `${r}x`;

export function clock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

/**
 * Where a lecture opens. A lecture watched to (nearly) the end starts again
 * from the top: it opened on its last seconds, so Play ended it at once.
 */
export function resumeFrom(resume: number, duration: number | null | undefined): number {
  const r = Number.isFinite(resume) ? resume : 0;
  if (r <= 5) return 0;
  return duration && duration > 0 && r >= duration - 15 ? 0 : r;
}

/** Play at the very end starts again from the top (the phone's player just stays ended). */
export const atEnd = (time: number, duration: number) => duration > 0 && time >= duration - 1;

/* ------------------------------------------------------------- surfaces */

function RealSurface({ access, children }: { access: StreamAccess; children: (p: Playback) => React.ReactNode }) {
  const player = useVideoPlayer({ uri: access.url, headers: access.headers, contentType: access.mediaType === "hls" ? "hls" : "progressive" }, (p) => {
    p.timeUpdateEventInterval = 1;
    p.staysActiveInBackground = false;
    const from = resumeFrom(access.resumeSeconds, access.durationSeconds);
    if (from) p.currentTime = from;
  });
  const [state, setState] = React.useState({ playing: false, time: resumeFrom(access.resumeSeconds, access.durationSeconds), duration: access.durationSeconds ?? 0, ready: false, failed: null as string | null, rate: 1 });
  useEventListener(player, "timeUpdate", (e) => setState((s) => ({ ...s, time: e.currentTime, duration: player.duration || s.duration })));
  useEventListener(player, "playingChange", (e) => setState((s) => ({ ...s, playing: e.isPlaying })));
  useEventListener(player, "statusChange", (e) => setState((s) => ({ ...s, ready: e.status === "readyToPlay" || s.ready, failed: e.status === "error" ? (e.error?.message ?? "The lecture could not play.") : null })));
  const pb: Playback = {
    ...state,
    play: () => player.play(),
    pause: () => player.pause(),
    seek: (t) => {
      const to = Math.max(0, Math.min(t, state.duration || t));
      // eslint-disable-next-line react-hooks/immutability -- the player is a native object, not React state
      player.currentTime = to;
      setState((s) => ({ ...s, time: to }));
    },
    setRate: (r) => {
      // eslint-disable-next-line react-hooks/immutability -- the player is a native object, not React state
      player.playbackRate = r;
      setState((s) => ({ ...s, rate: r }));
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
  const [time, setTime] = React.useState(() => resumeFrom(access.resumeSeconds, duration));
  const [rate, setRate] = React.useState(1);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => Math.min(duration, t + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, duration]);
  return <>{children({ playing, time, duration, ready: true, failed: null, play: () => setPlaying(true), pause: () => setPlaying(false), seek: (t) => setTime(Math.max(0, Math.min(duration, t))), rate, setRate })}</>;
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
        <View pointerEvents="none" style={{ height: 4, borderRadius: 2, backgroundColor: fixed.videoTrack, overflow: "visible" }}>
          <View style={{ width: `${pct * 100}%`, height: 4, borderRadius: 2, backgroundColor: fixed.lime }} />
          <View style={{ position: "absolute", left: `${pct * 100}%`, top: -6, width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: fixed.white }} />
        </View>
      </View>
  );
}

function RoundButton({ label, onPress, children, size = 48 }: { label: string; onPress: () => void; children: React.ReactNode; size?: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} style={({ pressed }) => ({ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? fixed.videoButtonPressed : fixed.videoButton })}>
      {children}
    </Pressable>
  );
}

function Controls({ pb, full, onFull, onFirstPlay, sides }: { pb: Playback; full: boolean; onFull?: () => void; onFirstPlay: () => void; sides: { left: number; right: number; bottom: number } }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(true);
  // Controls fade away 3 s after the lecture starts playing; a tap brings them back.
  React.useEffect(() => {
    if (!pb.playing || !shown) return;
    const id = setTimeout(() => setShown(false), 3000);
    return () => clearTimeout(id);
  }, [pb.playing, shown]);
  const toggle = () => {
    if (pb.playing) pb.pause();
    else {
      onFirstPlay();
      if (atEnd(pb.time, pb.duration)) pb.seek(0);
      pb.play();
    }
  };
  return (
    <Pressable accessibilityLabel={shown ? "Hide controls" : "Show controls"} onPress={() => setShown((s) => !s)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} testID="player-surface">
      {shown ? (
        <Animated.View entering={reduce ? undefined : presets.fadeState()} exiting={reduce ? undefined : presets.out()} style={{ flex: 1, backgroundColor: fixed.videoWash, justifyContent: "space-between" }}>
          <View />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[6] }}>
            <RoundButton label="Back 10 seconds" onPress={() => pb.seek(pb.time - 10)}>
              <RotateCcw size={22} color={fixed.onVideo} />
            </RoundButton>
            <RoundButton label={pb.playing ? "Pause" : "Play"} onPress={toggle} size={64}>
              <PlayPause playing={pb.playing} color={fixed.onVideo} />
            </RoundButton>
            <RoundButton label="Forward 10 seconds" onPress={() => pb.seek(pb.time + 10)}>
              <RotateCw size={22} color={fixed.onVideo} />
            </RoundButton>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], paddingLeft: space[3] + sides.left, paddingRight: space[3] + sides.right, paddingBottom: sides.bottom }}>
            <T v="caption" num style={{ color: fixed.onVideo, fontFamily: fonts.semibold }} maxFontSizeMultiplier={1.2}>
              {clock(pb.time)}
            </T>
            <Scrubber time={pb.time} duration={pb.duration} onSeek={pb.seek} />
            <T v="caption" num style={{ color: fixed.onVideo, fontFamily: fonts.semibold }} maxFontSizeMultiplier={1.2}>
              {clock(pb.duration)}
            </T>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Speed ${speedLabel(pb.rate)}. Change speed`}
              onPress={() => {
                pb.setRate(nextSpeed(pb.rate));
              }}
              hitSlop={6}
              style={{ minWidth: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}
              testID="player-speed"
            >
              <T v="caption" num style={{ color: "#ffffff", fontFamily: fonts.bold }} maxFontSizeMultiplier={1.2}>
                {speedLabel(pb.rate)}
              </T>
            </Pressable>
            {onFull ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={full ? "Leave full screen" : "Full screen"}
                onPress={() => {
                  onFull();
                }}
                hitSlop={6}
                style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}
                testID="player-full"
              >
                {full ? <Minimize size={22} color={fixed.onVideo} /> : <Maximize size={22} color={fixed.onVideo} />}
              </Pressable>
            ) : null}
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
  /** The intro shown over the video until the first Play (storyboard 5). */
  intro?: IntroInfo;
  /** Full screen (owned by the lecture screen, see src/lecture/fullscreen.ts). */
  full?: boolean;
  /** The full-screen button. No button without it. */
  onFull?: () => void;
};

type Phase = { kind: "loading" } | { kind: "ready"; access: StreamAccess } | { kind: "refused"; message: string } | { kind: "error"; message: string };

export function ProtectedPlayer({ lessonId, onTime, compromised, intro, full = false, onFull }: PlayerProps) {
  // Per lecture: Next and Previous replace the lecture in the same player.
  const [playedFor, setPlayedFor] = React.useState<string | null>(null);
  const played = playedFor === lessonId;
  const firstPlay = React.useCallback(() => setPlayedFor(lessonId), [lessonId]);
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = React.useState<Phase>({ kind: "loading" });
  const [captured, setCaptured] = React.useState(isCaptured());
  const [attempt, setAttempt] = React.useState(0);
  const pbRef = React.useRef<Playback | null>(null);
  // Where the lecture was when its address ran out, to carry on from there with a new one.
  const carryOn = React.useRef(0);
  const renewed = React.useRef(0);

  React.useEffect(() => {
    let live = true;
    void (async () => {
      const rooted = compromised ?? (Platform.OS === "android" ? await Device.isRootedExperimentalAsync().catch(() => false) : false);
      try {
        const access = streamView(await api.post<unknown>(`/lectures/${encodeURIComponent(lessonId)}/stream`, { deviceCompromised: rooted }), session.store.get().me?.watermark.text);
        if (!live) return;
        if (access) setPhase({ kind: "ready", access: carryOn.current > 5 ? { ...access, resumeSeconds: carryOn.current } : access });
        else setPhase({ kind: "error", message: "The lecture could not start. Try again in a minute." });
      } catch (e) {
        if (!live) return;
        if (e instanceof ApiFailure && e.code === "video_refused") setPhase({ kind: "refused", message: e.message });
        else setPhase({ kind: "error", message: reasonOf(e) });
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

  /** Playback stopped: if the address ran out, get a new one and carry on from the same place. */
  const renewIfExpired = (access: StreamAccess, time: number) => {
    if (!shouldRenew(access, renewed.current)) return;
    renewed.current += 1;
    carryOn.current = time;
    setPhase({ kind: "loading" });
    setAttempt((a) => a + 1);
  };

  // Full screen fills what the lecture screen gives it (the whole screen: it hides
  // everything else). The same view either way, so the video is never remounted.
  const frame = full ? { flex: 1 } : { width: "100%" as const, aspectRatio: 16 / 9 };
  // Clear of a camera cutout and the gesture line when the bars show for a moment.
  const sides = full ? { left: insets.left, right: insets.right, bottom: Math.min(insets.bottom, space[3]) } : { left: 0, right: 0, bottom: 0 };

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
        <T center style={{ color: fixed.onVideo }}>
          {phase.message}
        </T>
        {phase.kind === "error" ? <ThemeProvider force="light">
                <Button kind="quiet" full={false} label="Try again" onPress={() => {
              setPhase({ kind: "loading" });
              setAttempt((a) => a + 1);
            }} style={{ backgroundColor: fixed.white, borderRadius: layout.radius }} />
              </ThemeProvider> : null}
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
                  <Renew onFail={() => renewIfExpired(phase.access, pb.time)} />
                  <T center style={{ color: fixed.onVideo }}>
                    {`The lecture stopped. ${reasonOf(pb.failed)}`}
                  </T>
                  <ThemeProvider force="light">
                    <Button
                      kind="quiet"
                      full={false}
                      label="Try again"
                      onPress={() => {
                        carryOn.current = pb.time;
                        setPhase({ kind: "loading" });
                        setAttempt((a) => a + 1);
                      }}
                      style={{ backgroundColor: fixed.white, borderRadius: layout.radius }}
                    />
                  </ThemeProvider>
                </View>
              ) : (
                <Controls pb={pb} full={full} onFull={onFull} onFirstPlay={firstPlay} sides={sides} />
              )}
              <Watermark text={phase.access.watermark.text} />
            </>
          );
        }}
      </Surface>
    );
  }

  return (
    <View testID="player" style={[frame, { backgroundColor: fixed.black, overflow: "hidden" }]}>
      {full ? <StatusBar hidden /> : null}
      {body}
      {intro ? <LectureIntro info={intro} gone={played} /> : null}
      {captured ? (
        <View testID="player-captured" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: fixed.black, alignItems: "center", justifyContent: "center", padding: space[5] }}>
          <T center style={{ color: fixed.onVideo }}>
            Screen recording or mirroring is on, so the lecture is hidden. Turn it off to carry on.
          </T>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The stream's address is short-lived. When playback stops after it ran out
 * (a long pause), ask for a new one at once and carry on from the same place,
 * instead of showing "The lecture stopped". Once per address, so a real fault
 * still shows Try again.
 */
export function shouldRenew(access: StreamAccess, renewedTimes: number, now = Date.now()): boolean {
  const end = Date.parse(access.expiresAt);
  return renewedTimes < 3 && Number.isFinite(end) && end - now < 60_000;
}

function Renew({ onFail }: { onFail: () => void }) {
  React.useEffect(() => {
    onFail();
    // Once, when the failure shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Passes the position up without re-rendering the screen on every tick. */
function TimeReporter({ pb, onTime }: { pb: Playback; onTime?: PlayerProps["onTime"] }) {
  const t = Math.floor(pb.time);
  React.useEffect(() => {
    onTime?.(t, pb.duration, pb.playing);
  }, [t, pb.duration, pb.playing, onTime]);
  return null;
}
