import Constants from "expo-constants";

/**
 * Every default the owner may want to change lives here.
 */
const extra = (Constants.expoConfig?.extra ?? {}) as { apiUrl?: string; apiMode?: string; site?: string };

export const config = {
  appName: "Vibha Psychology",
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? "https://vibhapsychology.com/api/app/v1",
  /** "mock": fixtures inside the app. "live": the real server. */
  apiMode: (process.env.EXPO_PUBLIC_API_MODE ?? extra.apiMode ?? "live") as "mock" | "live",
  site: extra.site ?? "https://vibhapsychology.com",
  appVersion: Constants.expoConfig?.version ?? "1.0.0",
  /** The build number (Android versionCode), which goes up on every upload even when the version stays. */
  appBuild: String(Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber ?? "1"),
  pin: {
    length: 4,
    /** Lock after this long in the background. */
    lockAfterMs: 5 * 60 * 1000,
    /** This many wrong tries signs the account out. */
    maxTries: 5,
  },
  /** Send the watch position this often while a lecture plays. */
  progressPingMs: 15_000,
  /** A lecture counts as watched from this share. */
  completeAt: 0.9,
  /** Biometric unlock: the hook exists (src/auth/biometric.ts) but is off in v1. */
  biometrics: false,
} as const;
