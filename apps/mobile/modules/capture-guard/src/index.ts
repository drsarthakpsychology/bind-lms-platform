import { requireOptionalNativeModule, type EventSubscription } from "expo";

type Native = { isCaptured(): boolean; addListener(name: "onChange", fn: (e: { captured: boolean }) => void): EventSubscription };

/** Present only in the iPhone build (see ios/CaptureGuardModule.swift). */
const native = requireOptionalNativeModule<Native>("CaptureGuard");

/** True while the iPhone screen is recorded or mirrored. Always false elsewhere. */
export function isCaptured(): boolean {
  try {
    return native?.isCaptured() ?? false;
  } catch {
    return false;
  }
}

/** Calls `fn` whenever recording or mirroring starts or stops. */
export function onCaptureChange(fn: (captured: boolean) => void): { remove: () => void } {
  if (!native) return { remove: () => undefined };
  const sub = native.addListener("onChange", (e) => fn(!!e.captured));
  return { remove: () => sub.remove() };
}
