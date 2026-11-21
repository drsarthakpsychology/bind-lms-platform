import * as React from "react";
import { Platform, Pressable, ScrollView, Text, View, useColorScheme } from "react-native";

import * as SplashScreen from "expo-splash-screen";

import { dark as darkPalette, light as lightPalette } from "@/theme/tokens";
import { crumb, describeCrumb } from "./breadcrumb";
import { createStore } from "./store";

/**
 * The app must never close itself. In a release build an uncaught JS error
 * (a render error, or one thrown in a callback) is "fatal" and React Native
 * ends the app. Three nets catch everything instead:
 *  1. <CrashBoundary> around the whole app catches render errors.
 *  2. installCrashHandlers() replaces the global error handler, so a thrown
 *     error in a press handler, timer or effect shows the same page.
 *  3. It also watches unhandled promise rejections: programming errors
 *     (TypeError and friends) show the page; a failed network call does not.
 * The page is calm: "Something went wrong", Try again, and the error text
 * folded away so the owner can screenshot it.
 *
 * Built only from React Native's own parts (no theme, no app fonts) so it
 * still draws when those are what broke.
 */

export type Crash = { message: string; detail: string; where: "render" | "global" | "promise" };

export const crashStore = createStore<{ crash: Crash | null }>({ crash: null });

export function describe(error: unknown, where: Crash["where"]): Crash {
  if (error instanceof Error) {
    const stack = (error.stack ?? "").split("\n").slice(0, 12).join("\n");
    return { message: `${error.name}: ${error.message}`, detail: stack, where };
  }
  let text = "";
  try {
    text = typeof error === "string" ? error : JSON.stringify(error);
  } catch {
    text = String(error);
  }
  return { message: text || "Unknown error", detail: "", where };
}

export function reportCrash(error: unknown, where: Crash["where"]): void {
  // Keep the first one: later errors are usually knock-on effects of it.
  if (crashStore.get().crash) return;
  crashStore.set({ crash: describe(error, where) });
}

/** A rejection worth stopping for: a bug in the app, not a failed request. */
export function isProgrammingError(e: unknown): boolean {
  return e instanceof TypeError || e instanceof ReferenceError || e instanceof RangeError || e instanceof SyntaxError;
}

type ErrorUtilsLike = { getGlobalHandler: () => (e: unknown, fatal?: boolean) => void; setGlobalHandler: (fn: (e: unknown, fatal?: boolean) => void) => void };
type HermesLike = { enablePromiseRejectionTracker?: (o: { allRejections: boolean; onUnhandled: (id: number, e: unknown) => void; onHandled: (id: number) => void }) => void };

let installed = false;

/** Call once, as early as possible (top of app/_layout.tsx). Safe on web and in tests. */
export function installCrashHandlers(g: { ErrorUtils?: ErrorUtilsLike; HermesInternal?: HermesLike } = globalThis as never): void {
  if (installed) return;
  installed = true;
  try {
    const eu = g.ErrorUtils;
    if (eu?.setGlobalHandler) {
      const previous = eu.getGlobalHandler?.();
      eu.setGlobalHandler((error, fatal) => {
        try {
          console.error("Caught by the crash net:", error);
        } catch {
          /* ignore */
        }
        reportCrash(error, "global");
        // In development keep the red screen; in a release build never hand a
        // fatal error on, because the default handler closes the app.
        if (__DEV__ && previous) previous(error, false);
      });
    }
  } catch {
    /* the net itself must never break start-up */
  }
  try {
    g.HermesInternal?.enablePromiseRejectionTracker?.({
      allRejections: true,
      onUnhandled: (_id, error) => {
        if (isProgrammingError(error)) reportCrash(error, "promise");
        else if (__DEV__) console.warn("Unhandled promise rejection:", error);
      },
      onHandled: () => undefined,
    });
  } catch {
    /* ignore */
  }
}

/** Test hook. */
export function resetCrashNet(): void {
  installed = false;
  crashStore.set({ crash: null });
}

export function CrashScreen({ crash, onRetry }: { crash: Crash; onRetry: () => void }) {
  const dark = useColorScheme() === "dark";
  const [open, setOpen] = React.useState(false);
  const [where] = React.useState(() => {
    try {
      return describeCrumb(crumb.current());
    } catch {
      return "";
    }
  });
  // A crash before the first screen would otherwise stay hidden behind the splash.
  React.useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);
  // Outside the theme (it may be what broke): the Layers palette, read straight from the tokens.
  const c = dark ? darkPalette : lightPalette;
  const mono = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
  return (
    <View testID="crash-screen" accessibilityViewIsModal style={{ flex: 1, backgroundColor: c.field }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 72, paddingBottom: 24 + 28, gap: 6, width: "100%", maxWidth: 460, alignSelf: "center" }}>
        <Text accessibilityRole="header" style={{ fontSize: 30, lineHeight: 35, fontWeight: "700", letterSpacing: -0.5, color: c.onField }}>
          Something went wrong
        </Text>
        <Text style={{ fontSize: 14, lineHeight: 20, fontWeight: "500", color: c.onFieldMuted }}>Your work is saved.</Text>
      </View>
      <View style={{ flex: 1, marginTop: -28, backgroundColor: c.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}>
        <View style={{ flex: 1, gap: 12, width: "100%", maxWidth: 420, alignSelf: "center" }}>
          <Text style={{ fontSize: 17, lineHeight: 28, color: c.ink }}>The app ran into a problem on this screen. Try again, and if it keeps happening, send us a screenshot of this page.</Text>
          {where ? (
            <Text testID="crash-where" style={{ fontSize: 14, lineHeight: 20, color: c.muted }}>
              {`It happened on: ${where}`}
            </Text>
          ) : null}
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((o) => !o)} testID="crash-details-toggle" hitSlop={6} style={{ minHeight: 48, justifyContent: "center", alignSelf: "flex-start" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: c.link }}>{open ? "Hide details" : "Show details"}</Text>
          </Pressable>
          {open ? (
            <ScrollView style={{ maxHeight: 220, borderRadius: 18, backgroundColor: c.card }} contentContainerStyle={{ padding: 16 }}>
              <Text selectable testID="crash-details" style={{ fontFamily: mono, fontSize: 12, lineHeight: 17, color: c.ink }}>
                {`${crash.message}\n(${crash.where})${where ? `\nScreen: ${where}` : ""}${crash.detail ? `\n\n${crash.detail}` : ""}`}
              </Text>
            </ScrollView>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" onPress={onRetry} testID="crash-retry" style={({ pressed }) => ({ minHeight: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: c.lime, opacity: pressed ? 0.85 : 1, width: "100%", maxWidth: 420, alignSelf: "center" })}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: c.onLime }}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Wraps the whole app. Shows CrashScreen for a render error or for anything
 * the global handlers reported. Try again clears it, runs `onReset` (drop
 * cached server data, go back to the first screen) and draws the app again.
 */
export class CrashBoundary extends React.Component<{ children: React.ReactNode; onReset?: () => void }, { renderCrash: Crash | null; crash: Crash | null; round: number }> {
  override state = { renderCrash: null as Crash | null, crash: crashStore.get().crash, round: 0 };
  private unsub: (() => void) | null = null;

  static getDerivedStateFromError(error: unknown) {
    return { renderCrash: describe(error, "render") };
  }

  override componentDidMount() {
    this.unsub = crashStore.subscribe(() => this.setState({ crash: crashStore.get().crash }));
  }

  override componentWillUnmount() {
    this.unsub?.();
  }

  override componentDidCatch(error: unknown) {
    try {
      console.error("Caught by the app's error page:", error);
    } catch {
      /* ignore */
    }
  }

  retry = () => {
    crashStore.set({ crash: null });
    try {
      this.props.onReset?.();
    } catch {
      /* ignore */
    }
    this.setState((s) => ({ renderCrash: null, crash: null, round: s.round + 1 }));
  };

  override render() {
    const crash = this.state.renderCrash ?? this.state.crash;
    if (crash) return <CrashScreen crash={crash} onRetry={this.retry} />;
    return <React.Fragment key={this.state.round}>{this.props.children}</React.Fragment>;
  }
}
