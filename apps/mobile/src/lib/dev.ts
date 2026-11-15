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
  const theme = q.get("theme");
  if (theme === "dark" || theme === "light") settingsStore.set({ theme });
}

/** After boot: sign in as the account named in ?as=, choose a PIN, and open (or lock). */
export async function applyDevSession(session: { signIn: (e: string, p: string) => Promise<void>; choosePin: (p: string) => Promise<void>; lock: () => void; store: { get: () => { phase: string } } }): Promise<void> {
  const q = params();
  const as = q?.get("as");
  if (!q || !as) return;
  // The "paused" and "update" scenarios refuse sign-in; sign in on the default and switch after.
  const scenario = q.get("mock") as Scenario | null;
  mock.setScenario("default");
  await session.signIn(`${as}@example.com`, "mock-password");
  await session.choosePin("2580");
  if (scenario) mock.setScenario(scenario);
  if (q.get("lock") === "1") session.lock();
}
