import fs from "node:fs";
import path from "node:path";

import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * One place for the app's identity. Store name: "Vibha Psychology".
 * The package id never changes once the app is on Google Play.
 */
const APP_NAME = "Vibha Psychology";
const PACKAGE = "com.vibhapsychology.app";
const SITE = "vibhapsychology.com";
const BLUE = "#1d44d8";
/** Firebase file for push on Android. The build adds it when the owner has given it (docs/app/README.md). */
const GOOGLE_SERVICES = fs.existsSync(path.join(__dirname, "google-services.json")) ? "./google-services.json" : undefined;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: "vibha-psychology",
  owner: undefined,
  version: "1.0.0",
  scheme: "vibha",
  // Portrait and landscape are both allowed by the system; the app holds
  // portrait everywhere except the lecture player (src/lib/orientation.ts).
  orientation: "default",
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  ios: {
    bundleIdentifier: PACKAGE,
    supportsTablet: true,
    associatedDomains: [`applinks:${SITE}`],
    infoPlist: { ITSAppUsesNonExemptEncryption: false, UIBackgroundModes: ["audio"] },
  },
  android: {
    package: PACKAGE,
    versionCode: 1,
    googleServicesFile: GOOGLE_SERVICES,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-foreground.png",
      monochromeImage: "./assets/images/adaptive-monochrome.png",
      backgroundColor: BLUE,
    },
    predictiveBackGestureEnabled: true,
    softwareKeyboardLayoutMode: "resize",
    permissions: ["POST_NOTIFICATIONS", "VIBRATE", "RECORD_AUDIO", "MODIFY_AUDIO_SETTINGS"],
    // The microphone is asked for only when a student records an assignment answer.
    blockedPermissions: ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"],
    // Links to the website open the app (verified once /.well-known/assetlinks.json is on the site).
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          { scheme: "https", host: SITE, pathPrefix: "/setup" },
          { scheme: "https", host: SITE, pathPrefix: "/dashboard" },
          { scheme: "https", host: SITE, pathPrefix: "/courses" },
          { scheme: "https", host: SITE, pathPrefix: "/study" },
          { scheme: "https", host: SITE, pathPrefix: "/doubts" },
          { scheme: "https", host: SITE, pathPrefix: "/notifications" },
          { scheme: "https", host: SITE, pathPrefix: "/verify" },
          { scheme: "https", host: SITE, pathPrefix: "/achievements" },
          { scheme: "https", host: SITE, pathPrefix: "/practice" },
          { scheme: "https", host: SITE, pathPrefix: "/games" },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: { bundler: "metro", output: "single", favicon: "./assets/images/favicon.png" },
  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/Archivo-420.ttf",
          "./assets/fonts/Archivo-500.ttf",
          "./assets/fonts/Archivo-600.ttf",
          "./assets/fonts/Archivo-650.ttf",
          "./assets/fonts/Archivo-700.ttf",
          "./assets/fonts/Archivo-750.ttf",
          "./assets/fonts/Archivo-800.ttf",
          "./assets/fonts/Archivo-Wordmark.ttf",
          "./assets/fonts/Silkscreen.ttf",
          "./assets/fonts/PixDigits.ttf",
          "./assets/fonts/Kalam-Regular.ttf",
          "./assets/fonts/Kalam-Bold.ttf",
        ],
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash.png",
        imageWidth: 220,
        resizeMode: "contain",
        backgroundColor: "#f5f5f5",
        dark: { image: "./assets/images/splash-dark.png", backgroundColor: "#0d0d0d" },
      },
    ],
    "expo-secure-store",
    ["expo-audio", { microphonePermission: "Vibha Psychology uses the microphone only when you record an answer to an assignment." }],
    ["expo-notifications", { icon: "./assets/images/notification.png", color: BLUE, defaultChannel: "default" }],
    ["expo-video", { supportsBackgroundPlayback: false, supportsPictureInPicture: false }],
    ["expo-screen-orientation", { initialOrientation: "DEFAULT" }],
    ["expo-build-properties", { android: { minSdkVersion: 24 } }],
  ],
  experiments: { typedRoutes: false },
  extra: {
    // Where the app talks to. Change here or with EXPO_PUBLIC_API_URL at build time.
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? `https://${SITE}/api/app/v1`,
    // "mock" serves fixtures from inside the app (no server needed). "live" calls apiUrl.
    apiMode: process.env.EXPO_PUBLIC_API_MODE ?? "live",
    site: `https://${SITE}`,
    eas: { projectId: process.env.EAS_PROJECT_ID || undefined },
  },
});
