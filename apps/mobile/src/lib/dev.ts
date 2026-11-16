import { Platform } from "react-native";

import { mock, type Scenario } from "@/api/mock/server";
import { config } from "./config";
import { settingsStore } from "./settings";

/**
 * Only for the web build with the mock server (development and screenshots):
 * the address can pick a mock scenario, a theme and who is signed in.
 *   ?mock=new|done|empty|error|slow|update|paused   ?theme=dark|light
 *   ?as=student|lecture|admin   (signs in with the mock server and opens)
 *   ?lock=1                     (then shows the PIN lock)
 *   ?pin=0                      (stops at "Choose a PIN")
 *   ?notice=device_replaced     (signs out as if opened on another phone)
 *   ?stress=1                   (long names and titles, large numbers)
 *   ?delay=300                  (every mock answer waits this long, like a slow network;
 *                                the calls made are on window.__vibhaCalls for speed checks)
 * Does nothing on phones or against the real server.
 */
function params(): URLSearchParams | null {
  if (Platform.OS !== "web" || config.apiMode !== "mock" || typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search);
}

export function applyMockFromUrl(): void {
  const q = params();
  if (!q) return;
  const s = q.get("mock");
  if (s) mock.setScenario(s as Scenario);
  if (q.get("stress") === "1") mock.setStress(true);
  // With ?as= the delay is set in applyDevSession.
  const delay = Number(q.get("delay"));
  if (delay > 0 && !q.get("as")) mock.setDelay(delay);
  (window as unknown as { __vibhaCalls?: () => { method: string; path: string; at: number }[] }).__vibhaCalls = () => mock.log().map((c) => ({ method: c.method, path: c.path, at: c.at ?? 0 }));
  const theme = q.get("theme");
  if (theme === "dark" || theme === "light") settingsStore.set({ theme });
}

/** After boot: sign in as the account named in ?as=, choose a PIN, and open (or lock). */
export async function applyDevSession(session: { signIn: (e: string, p: string) => Promise<void>; choosePin: (p: string) => Promise<void>; lock: () => void; signOut: (n: "device_replaced") => Promise<void>; store: { get: () => { phase: string } } }): Promise<void> {
  const q = params();
  const as = q?.get("as");
  if (!q || !as) return;
  // The "paused" and "update" scenarios refuse sign-in; sign in on the default and switch after.
  const scenario = q.get("mock") as Scenario | null;
  mock.setScenario("default");
  // The delay covers the sign-in too, so a call made the moment the account opens is timed fairly.
  const delay = Number(q.get("delay"));
  if (delay > 0) mock.setDelay(delay);
  await session.signIn(`${as}@example.com`, "mock-password");
  if (q.get("pin") === "0") return;
  await session.choosePin("2580");
  if (q.get("notice") === "device_replaced") {
    await session.signOut("device_replaced");
    return;
  }
  if (scenario) mock.setScenario(scenario);
  // Speed checks time a screen from here (the account is open).
  if (typeof performance !== "undefined" && typeof performance.mark === "function") performance.mark("vibha-open");
  if (q.get("lock") === "1") session.lock();
}
