import fs from "node:fs";
import path from "node:path";

import type { ConfigContext, ExpoConfig } from "expo/config";
import { AndroidConfig, withAndroidManifest, type ConfigPlugin } from "expo/config-plugins";

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
/**
 * Version shown in the stores. Raise it by hand for each public release (1.0.0, 1.0.1, 1.1.0).
 * The build number (Android versionCode, iPhone buildNumber) must go up on every upload:
 * the release workflow sets APP_BUILD_NUMBER from its run number, so nobody has to remember.
 */
const VERSION = "1.0.0";
const BUILD_NUMBER = Math.max(1, Number.parseInt(process.env.APP_BUILD_NUMBER ?? "1", 10) || 1);
/** Google Play requires apps to target Android 16 (API 36) since 31 August 2026. Raise when Play raises it. */
const TARGET_SDK = 36;

/**
 * Android: turning the phone (and folding, resizing, a keyboard) must never
 * restart the app's screen, or a lecture in full screen would close and start
 * over. The app handles these changes itself; this makes sure the main screen
 * says so, whatever the build template has.
 */
const HANDLED_CHANGES = ["keyboard", "keyboardHidden", "orientation", "screenSize", "screenLayout", "smallestScreenSize", "uiMode"];
export const withHandledConfigChanges: ConfigPlugin = (cfg) =>
  withAndroidManifest(cfg, (mod) => {
    const main = AndroidConfig.Manifest.getMainActivityOrThrow(mod.modResults);
    const have = (main.$["android:configChanges"] ?? "").split("|").filter(Boolean);
    main.$["android:configChanges"] = [...new Set([...have, ...HANDLED_CHANGES])].join("|");
    return mod;
  });

export default (ctx: ConfigContext): ExpoConfig => withHandledConfigChanges(base(ctx));

const base = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: "vibha-psychology",
  owner: undefined,
  version: VERSION,
  scheme: "vibha",
  // Portrait and landscape are both allowed by the system; the app holds
  // portrait everywhere except the lecture player (src/lib/orientation.ts).
  orientation: "default",
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  ios: {
    bundleIdentifier: PACKAGE,
    buildNumber: String(BUILD_NUMBER),
    // iPhone only for now: an iPad listing would need its own screenshots and layouts.
    // iPads can still run the iPhone app.
    supportsTablet: false,
    associatedDomains: [`applinks:${SITE}`],
    // Uses only standard HTTPS: answers "No" to the export-compliance question for every upload.
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      // Every connection is HTTPS to vibhapsychology.com and the video host: no plain-HTTP exceptions.
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: false },
      // The microphone string comes from the expo-audio plugin below. No background modes:
      // lectures and audio stop when the app leaves the screen (and Apple rejects unused ones).
      // Screen recording and mirroring are detected by modules/capture-guard, which hides and
      // pauses video; it needs no permission string.
      // NSFaceIDUsageDescription comes from the expo-local-authentication plugin below.
    },
    privacyManifests: {
      // What the app collects, as Apple's privacy manifest needs it. Matches docs/release/DATA_SAFETY.md.
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeName", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypePhoneNumber", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypePhotosorVideos", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeEmailAddress", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeUserID", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeDeviceID", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeAudioData", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeOtherUserContent", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
        { NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeProductInteraction", NSPrivacyCollectedDataTypeLinked: true, NSPrivacyCollectedDataTypeTracking: false, NSPrivacyCollectedDataTypePurposes: ["NSPrivacyCollectedDataTypePurposeAppFunctionality"] },
      ],
      NSPrivacyAccessedAPITypes: [
        // AsyncStorage and the saved settings use UserDefaults for the app's own data only.
        { NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults", NSPrivacyAccessedAPITypeReasons: ["CA92.1"] },
        { NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp", NSPrivacyAccessedAPITypeReasons: ["C617.1"] },
        { NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategorySystemBootTime", NSPrivacyAccessedAPITypeReasons: ["35F9.1"] },
        { NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace", NSPrivacyAccessedAPITypeReasons: ["E174.1"] },
      ],
    },
  },
  android: {
    package: PACKAGE,
    versionCode: BUILD_NUMBER,
    googleServicesFile: GOOGLE_SERVICES,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-foreground.png",
      backgroundImage: "./assets/images/adaptive-background.png",
      monochromeImage: "./assets/images/adaptive-monochrome.png",
      backgroundColor: BLUE,
    },
    predictiveBackGestureEnabled: true,
    softwareKeyboardLayoutMode: "resize",
    // USE_BIOMETRIC: the opt-in fingerprint or face unlock (Settings > This phone); a normal permission, no prompt.
    permissions: ["POST_NOTIFICATIONS", "VIBRATE", "RECORD_AUDIO", "MODIFY_AUDIO_SETTINGS", "USE_BIOMETRIC"],
    // The microphone is asked for only when a student records an assignment answer.
    // Files are chosen with the system picker, which needs no storage permission. READ_MEDIA_IMAGES
    // comes from expo-screen-capture's screenshot listener, which the app does not use (it blocks
    // capture with FLAG_SECURE); Google Play rejects apps that ask for photo access without a core need.
    blockedPermissions: [
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.SYSTEM_ALERT_WINDOW",
      // The signature picker library asks for the camera; the app never takes photos.
      "android.permission.CAMERA",
      // No advertising: the advertising id is never read.
      "com.google.android.gms.permission.AD_ID",
    ],
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
        // The VIBHA mark on blue, in light and dark mode alike (assets/brand, scripts/make-assets.py).
        image: "./assets/images/splash.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: BLUE,
        dark: { image: "./assets/images/splash.png", backgroundColor: BLUE },
      },
    ],
    "expo-secure-store",
    ["expo-local-authentication", { faceIDPermission: "Vibha Psychology can use Face ID to unlock the app instead of your PIN." }],
    // Admins pick a signature image for certificates from their photos. The system photo picker
    // needs no storage permission; the camera is not used, so it is blocked.
    ["expo-image-picker", { photosPermission: "Vibha Psychology opens your photos only when you choose a signature image for certificates.", cameraPermission: false }],
    ["expo-audio", { microphonePermission: "Vibha Psychology uses the microphone only when you record an answer to an assignment." }],
    ["expo-notifications", { icon: "./assets/images/notification.png", color: BLUE, defaultChannel: "default" }],
    ["expo-video", { supportsBackgroundPlayback: false, supportsPictureInPicture: false }],
    ["expo-screen-orientation", { initialOrientation: "DEFAULT" }],
    ["expo-build-properties", { android: { minSdkVersion: 24, targetSdkVersion: TARGET_SDK } }],
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
