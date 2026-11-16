import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Stack, router, usePathname, useSegments, type ErrorBoundaryProps } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { AppState, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useViewingAsStudent, ViewAsBar } from "@/admin/view-as";
import { persistOptions, persister, queryClient, useConfig } from "@/api/queries";
import { session, useSession } from "@/auth";
import { handoff } from "@/auth/handoff";
import { ToastHost, toast } from "@/ds";
import { crumb, describeCrumb } from "@/lib/breadcrumb";
import { CrashBoundary, CrashScreen, describe, installCrashHandlers } from "@/lib/crash";
import { applyDevSession, applyMockFromUrl } from "@/lib/dev";
import { holdPortrait } from "@/lib/orientation";
import { loadSettings, settingsStore } from "@/lib/settings";
import { fadeMotion, modalMotion, stackMotion } from "@/motion";
import { groupFor, homeHref } from "@/nav/targets";
import { usePushRouting } from "@/push";
import { LockScreen, OtherDeviceScreen, PausedScreen, SetPinScreen, UpdateScreen } from "@/screens/auth/gates";
import { ThemeProvider, fonts, useTheme } from "@/theme";

installCrashHandlers();
// Read last run's breadcrumb before this run writes its own.
const lastRun = crumb.load();
void SplashScreen.preventAutoHideAsync().catch(() => undefined);
applyMockFromUrl();

/** Screens a visitor may see without signing in. */
const PUBLIC = new Set(["(visitor)", "setup", "verify", "forgot-password"]);
/** Screens only admins open. */
const ADMIN_ONLY = new Set(["(admin)", "student", "compose"]);

function useBoot(): boolean {
  const [fontsReady, fontError] = useFonts({
    "Archivo-420": require("../assets/fonts/Archivo-420.ttf"),
    "Archivo-500": require("../assets/fonts/Archivo-500.ttf"),
    "Archivo-600": require("../assets/fonts/Archivo-600.ttf"),
    "Archivo-650": require("../assets/fonts/Archivo-650.ttf"),
    "Archivo-700": require("../assets/fonts/Archivo-700.ttf"),
    "Archivo-750": require("../assets/fonts/Archivo-750.ttf"),
    "Archivo-800": require("../assets/fonts/Archivo-800.ttf"),
    "Archivo-Wordmark": require("../assets/fonts/Archivo-Wordmark.ttf"),
    Silkscreen: require("../assets/fonts/Silkscreen.ttf"),
    PixDigits: require("../assets/fonts/PixDigits.ttf"),
    "Kalam-Regular": require("../assets/fonts/Kalam-Regular.ttf"),
    "Kalam-Bold": require("../assets/fonts/Kalam-Bold.ttf"),
  });
  const phase = useSession((s) => s.phase);
  const settingsReady = settingsStore.use((s) => s.loaded);

  React.useEffect(() => {
    void loadSettings().catch(() => undefined);
    // boot() reads the keystore; if that fails the phone starts signed out instead of hanging on the splash.
    void session
      .boot()
      .catch(() => session.store.set({ phase: "visitor" }))
      .then(() => applyDevSession(session))
      .catch(() => undefined);
    void holdPortrait();
    // Android: FLAG_SECURE on the whole app (no screenshots, no screen recording,
    // blank in the recent-apps list). iOS: recordings come out blank.
    if (Platform.OS !== "web") {
      try {
        void ScreenCapture.preventScreenCaptureAsync("app").catch(() => undefined);
      } catch {
        /* Screen-capture blocking is optional: a failure only turns it off. */
      }
    }
  }, []);

  // Lock after five minutes in the background.
  React.useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      // A trip to the background is a normal stop; dying in the foreground is not (see lib/breadcrumb).
      crumb.foreground(s === "active");
      if (s === "active") session.onForeground();
      else session.onBackground();
    });
    return () => sub.remove();
  }, []);

  const ready = (fontsReady || !!fontError) && phase !== "loading" && settingsReady;
  React.useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);
  return ready;
}

/** Keeps every account inside its own screens: visitors out of the app, students out of the visitor tabs. */
function useGuard(ready: boolean): void {
  const segments = useSegments();
  const phase = useSession((s) => s.phase);
  const me = useSession((s) => s.me);
  const top = segments[0] as string | undefined;
  // An admin looking at the student side (More > View as student).
  const viewing = useViewingAsStudent() && groupFor(me) === "(admin)";
  React.useEffect(() => {
    if (!ready || top === undefined) return;
    // A redirect must never throw out of an effect (that closes a release build).
    const go = (href: string) => {
      try {
        router.replace(href);
      } catch (e) {
        console.warn("Redirect failed:", e);
      }
    };
    if (phase === "visitor") {
      if (!PUBLIC.has(top)) go("/welcome");
      return;
    }
    if (top === "(visitor)" && phase === "ready") {
      go(homeHref(me));
      return;
    }
    const tabGroup = top === "(student)" || top === "(lecture)" || top === "(admin)";
    if (tabGroup && top !== groupFor(me) && !(viewing && top === "(student)")) go(homeHref(me));
    else if (ADMIN_ONLY.has(top) && groupFor(me) !== "(admin)") go(homeHref(me));
  }, [ready, phase, me, top, viewing]);
}

/**
 * Right after a new PIN is chosen the session is open but the navigator still
 * shows the sign-in screen. The PIN screen stays up while the guard routes to
 * Home underneath; once Home has mounted and painted (two frames), the gate
 * lifts away and reveals it. The old form never shows again, and the two tab
 * bars are never on screen together.
 */
function useOpening(phase: string, top: string | undefined): boolean {
  const opening = handoff.use((s) => s.opening);
  const inApp = top === "(student)" || top === "(lecture)" || top === "(admin)";
  React.useEffect(() => {
    if (!opening) return;
    const done = () => handoff.set({ opening: false });
    // Never keep the gate up for long: if routing is slow, open anyway.
    const safety = setTimeout(done, 1500);
    let raf = 0;
    if (phase !== "ready") {
      // Signed out meanwhile (keystore refused, server said no): nothing to reveal.
      if (phase === "visitor") done();
    } else if (inApp) {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(done);
      });
    }
    return () => {
      clearTimeout(safety);
      cancelAnimationFrame(raf);
    };
  }, [opening, phase, inApp]);
  return opening && phase !== "visitor";
}

function Shell() {
  const c = useTheme();
  const reduce = !!useReducedMotion();
  const ready = useBoot();
  useGuard(ready);
  usePushRouting();
  const phase = useSession((s) => s.phase);
  const gate = useSession((s) => s.gate);
  const notice = useSession((s) => s.notice);
  const cfg = useConfig();
  const segments = useSegments();
  const viewing = useViewingAsStudent() && segments[0] === "(student)";
  const opening = useOpening(phase, segments[0] as string | undefined);
  const holdPin = handoff.use((s) => s.holdPin);
  const pathname = usePathname();

  // Breadcrumb: the screen on every navigation, so a native crash can be located next time.
  React.useEffect(() => {
    crumb.screen(pathname || `/${segments.join("/")}`);
  }, [pathname, segments]);

  // Last run closed itself (a native crash the error page could not catch): say where, once.
  const [closedOn, setClosedOn] = React.useState("");
  React.useEffect(() => {
    void lastRun.then((p) => setClosedOn(describeCrumb(p)));
  }, []);
  React.useEffect(() => {
    if (ready && closedOn) toast.show(`The app closed last time on: ${closedOn}`, 8000);
  }, [ready, closedOn]);

  // The server may change the lock time without an app release.
  React.useEffect(() => {
    const secs = cfg.data?.security?.lockAfterBackgroundSeconds;
    if (secs) session.setLockAfter(secs * 1000);
  }, [cfg.data]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;

  const overlay =
    gate?.kind === "update" ? (
      <UpdateScreen storeUrl={gate.storeUrl} />
    ) : gate?.kind === "paused" ? (
      <PausedScreen message={gate.message} />
    ) : (phase === "setPin" && !holdPin) || opening ? (
      <SetPinScreen />
    ) : phase === "locked" ? (
      <LockScreen />
    ) : phase === "visitor" && notice === "device_replaced" ? (
      <OtherDeviceScreen
        onContinue={() => {
          session.clearNotice();
          router.replace("/sign-in");
        }}
      />
    ) : null;

  const header = {
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.ink,
    headerTitleStyle: { fontFamily: fonts.h3, fontSize: 18, color: c.ink },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal" as const,
    headerTitleAlign: "left" as const,
    contentStyle: { backgroundColor: c.bg },
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style={c.dark ? "light" : "dark"} />
      <View style={{ flex: 1 }} accessibilityElementsHidden={!!overlay} importantForAccessibility={overlay ? "no-hide-descendants" : "auto"}>
        {/* The navigator always stays mounted (Expo Router needs it); the lock covers it completely. */}
        {
          <Stack screenOptions={{ ...header, ...stackMotion(reduce) }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* The groups change only when the account changes: signed out fades to Welcome; the app itself
                appears under the PIN screen with no slide, so the gate lifting away is the only move. */}
            <Stack.Screen name="(visitor)" options={{ headerShown: false, ...fadeMotion }} />
            <Stack.Screen name="(student)" options={{ headerShown: false, animation: "none" }} />
            <Stack.Screen name="(lecture)" options={{ headerShown: false, animation: "none" }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false, animation: "none" }} />
            <Stack.Screen name="setup" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ title: "" }} />
            <Stack.Screen name="lectures" options={{ title: "Lectures" }} />
            <Stack.Screen name="course/[courseId]" options={{ title: "" }} />
            <Stack.Screen name="lecture/[lessonId]" options={{ headerShown: false }} />
            <Stack.Screen name="material/[id]" options={{ title: "" }} />
            <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
            <Stack.Screen name="notification/[id]" options={{ title: "" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen name="help" options={{ title: "Help" }} />
            <Stack.Screen name="doubts/index" options={{ title: "Doubts" }} />
            <Stack.Screen name="doubts/ask" options={{ title: "Ask a doubt", presentation: "modal", ...(reduce ? null : modalMotion) }} />
            <Stack.Screen name="doubt/[id]" options={{ title: "" }} />
            <Stack.Screen name="study/index" options={{ title: "Study" }} />
            <Stack.Screen name="study/[moduleId]/index" options={{ title: "" }} />
            <Stack.Screen name="study/[moduleId]/[sectionId]" options={{ headerShown: false }} />
            <Stack.Screen name="study/[moduleId]/checkpoint/[n]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="study/[moduleId]/test" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="progress" options={{ title: "Progress" }} />
            <Stack.Screen name="map/index" options={{ title: "Your map" }} />
            <Stack.Screen name="map/practice" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="wall" options={{ title: "Class wall" }} />
            <Stack.Screen name="certificates" options={{ title: "Certificates" }} />
            <Stack.Screen name="certificate/[id]" options={{ title: "" }} />
            <Stack.Screen name="verify/[certificateId]" options={{ title: "Verify a certificate" }} />
            <Stack.Screen name="search" options={{ headerShown: false, ...fadeMotion }} />
            <Stack.Screen name="game/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="game/leaderboard" options={{ title: "" }} />
            <Stack.Screen name="shop" options={{ title: "" }} />
            <Stack.Screen name="case/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="case/library" options={{ title: "" }} />
            <Stack.Screen name="practise/[group]" options={{ title: "" }} />
            <Stack.Screen name="prep/index" options={{ title: "" }} />
            <Stack.Screen name="prep/[subject]" options={{ title: "" }} />
            <Stack.Screen name="prep/set" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="prep/long" options={{ title: "" }} />
            <Stack.Screen name="prep/mock/index" options={{ title: "" }} />
            <Stack.Screen name="prep/mock/[spec]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="prep/mock/result/[id]" options={{ title: "" }} />
            <Stack.Screen name="medicine/[id]" options={{ title: "" }} />
            <Stack.Screen name="medicine/compare" options={{ title: "Compare" }} />
            <Stack.Screen name="student/[id]" options={{ title: "" }} />
            <Stack.Screen name="compose" options={{ title: "New message", presentation: "modal", ...(reduce ? null : modalMotion) }} />
          </Stack>
        }
      </View>
      <ViewAsBar visible={viewing && !overlay} />
      {overlay}
      <ToastHost />
    </View>
  );
}

/** Try again on the error page: drop the saved server answers (one of them may be what broke) and start from the front door. */
function resetAfterCrash(): void {
  queryClient.clear();
  void persister.removeClient();
  void SplashScreen.hideAsync().catch(() => undefined);
  setTimeout(() => {
    try {
      router.replace("/");
    } catch {
      /* the navigator is not ready yet; it opens on the front door anyway */
    }
  }, 0);
}

/** Expo Router's own net for an error in this layout itself: the same calm page. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <CrashScreen
      crash={describe(error, "render")}
      onRetry={() => {
        resetAfterCrash();
        void retry();
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CrashBoundary onReset={resetAfterCrash}>
          <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <ThemeProvider>
              <Shell />
            </ThemeProvider>
          </PersistQueryClientProvider>
        </CrashBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
