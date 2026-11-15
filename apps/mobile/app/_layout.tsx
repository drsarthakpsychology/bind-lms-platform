import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Stack, router, useSegments, type ErrorBoundaryProps } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { AppState, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { persistOptions, persister, queryClient, useConfig } from "@/api/queries";
import { session, useSession } from "@/auth";
import { ToastHost } from "@/ds";
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
    if (tabGroup && top !== groupFor(me)) go(homeHref(me));
    else if (ADMIN_ONLY.has(top) && groupFor(me) !== "(admin)") go(homeHref(me));
  }, [ready, phase, me, top]);
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
    ) : phase === "setPin" ? (
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
            <Stack.Screen name="(visitor)" options={{ headerShown: false }} />
            <Stack.Screen name="(student)" options={{ headerShown: false }} />
            <Stack.Screen name="(lecture)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
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
            <Stack.Screen name="certificates" options={{ title: "Certificates" }} />
            <Stack.Screen name="certificate/[id]" options={{ title: "" }} />
            <Stack.Screen name="verify/[certificateId]" options={{ title: "Verify a certificate" }} />
            <Stack.Screen name="search" options={{ headerShown: false, ...fadeMotion }} />
            <Stack.Screen name="game/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="case/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="prep/index" options={{ title: "Exam Prep" }} />
            <Stack.Screen name="prep/[subject]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="medicine/[id]" options={{ title: "" }} />
            <Stack.Screen name="student/[id]" options={{ title: "" }} />
            <Stack.Screen name="compose" options={{ title: "New message", presentation: "modal", ...(reduce ? null : modalMotion) }} />
          </Stack>
        }
      </View>
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
