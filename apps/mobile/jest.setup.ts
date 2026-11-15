/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Test setup: the mock API, and stand-ins for native parts that do not exist
 * in Node (keystore, haptics, video, notifications, bottom sheets).
 */
process.env.EXPO_PUBLIC_API_MODE = "mock";

require("react-native-gesture-handler/jestSetup");

jest.mock("react-native-worklets", () => ({ scheduleOnRN: (fn: Function, ...rest: unknown[]) => fn(...rest), runOnJS: (fn: unknown) => fn }));
// A small stand-in for Reanimated: values are plain, animations finish at once.
jest.mock("react-native-reanimated", () => {
  const RN = require("react-native");
  const anim = () => {
    const a: Record<string, unknown> = {};
    a.duration = () => a;
    a.delay = () => a;
    return a;
  };
  const Easing = { bezier: () => (t: number) => t, inOut: () => (t: number) => t, out: () => (t: number) => t, quad: (t: number) => t, linear: (t: number) => t };
  const Animated = { View: RN.View, Text: RN.Text, ScrollView: RN.ScrollView, createAnimatedComponent: (c: unknown) => c };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    Easing,
    useSharedValue: (v: unknown) => {
      const sv = { value: v, get: () => sv.value, set: (n: unknown) => void (sv.value = typeof n === "function" ? (n as Function)(sv.value) : n) };
      return sv;
    },
    useAnimatedStyle: (fn: () => object) => fn(),
    useAnimatedProps: (fn: () => object) => fn(),
    withTiming: (v: unknown) => v,
    withSpring: (v: unknown) => v,
    // Gesture Handler 3 asks whether a prop is a shared value.
    isSharedValue: (v: unknown) => !!v && typeof v === "object" && "value" in (v as object) && "get" in (v as object),
    withRepeat: (v: unknown) => v,
    withSequence: (...v: unknown[]) => v[v.length - 1],
    cancelAnimation: () => undefined,
    useReducedMotion: () => true,
    FadeIn: anim(),
    FadeOut: anim(),
    FadeInDown: anim(),
    FadeOutDown: anim(),
  };
});
jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));

jest.mock("expo-secure-store", () => {
  const m = new Map<string, string>();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
    getItemAsync: jest.fn(async (k: string) => m.get(k) ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => void m.set(k, v)),
    deleteItemAsync: jest.fn(async (k: string) => void m.delete(k)),
  };
});

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(async () => undefined),
  impactAsync: jest.fn(async () => undefined),
  notificationAsync: jest.fn(async () => undefined),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

jest.mock("expo-crypto", () => {
  let n = 0;
  return {
    CryptoDigestAlgorithm: { SHA256: "SHA-256" },
    digestStringAsync: jest.fn(async (_a: string, text: string) => `h(${text})`),
    randomUUID: jest.fn(() => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`),
  };
});

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ granted: false, canAskAgain: true })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: "ExponentPushToken[test]" })),
  setNotificationChannelAsync: jest.fn(async () => undefined),
  scheduleNotificationAsync: jest.fn(async () => "id"),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => undefined),
  getLastNotificationResponseAsync: jest.fn(async () => null),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DAILY: "daily" },
}));

jest.mock("expo-screen-capture", () => ({
  preventScreenCaptureAsync: jest.fn(async () => undefined),
  allowScreenCaptureAsync: jest.fn(async () => undefined),
  addScreenshotListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock("expo-screen-orientation", () => ({
  lockAsync: jest.fn(async () => undefined),
  OrientationLock: { DEFAULT: 0, PORTRAIT_UP: 3, LANDSCAPE: 5 },
}));

jest.mock("expo-video", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    useVideoPlayer: jest.fn(() => ({ play: jest.fn(), pause: jest.fn(), currentTime: 0, duration: 0, playing: false, addListener: jest.fn(() => ({ remove: jest.fn() })), replace: jest.fn() })),
    VideoView: (props: object) => React.createElement(View, { ...props, testID: "video-view" }),
  };
});

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  return {
    router: { push, replace, back, canGoBack: jest.fn(() => true), dismissTo: jest.fn() },
    useRouter: () => ({ push, replace, back }),
    useLocalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    useNavigation: jest.fn(() => ({ setOptions: jest.fn(), addListener: jest.fn(() => jest.fn()) })),
    useFocusEffect: jest.fn(),
    Stack: { Screen: () => null },
    Redirect: () => null,
    Link: ({ children }: { children: unknown }) => children,
  };
});
