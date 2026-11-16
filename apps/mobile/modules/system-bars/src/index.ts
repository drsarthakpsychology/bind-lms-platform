import { requireOptionalNativeModule, type EventSubscription } from "expo";

type Native = {
  setNavigationBarDark(dark: boolean): Promise<void>;
  setImmersive?(on: boolean): Promise<void>;
  startTilt?(): Promise<boolean>;
  stopTilt?(): Promise<void>;
  addListener?(name: "onTilt", fn: (e: { landscape: boolean }) => void): EventSubscription;
};

/** Android only (android/ in this folder). Missing on iPhone, the web build and tests, where it does nothing. */
const native = requireOptionalNativeModule<Native>("SystemBars");

/** Light buttons on a dark app, dark buttons on a light app. Never throws. */
export function setNavigationBarDark(dark: boolean): void {
  if (!native) return;
  native.setNavigationBarDark(dark).catch(() => undefined);
}

/** Full screen: hides the status and navigation bars (a swipe from the edge shows them for a moment). Never throws. */
export function setImmersive(on: boolean): void {
  native?.setImmersive?.(on).catch(() => undefined);
}

/**
 * Which way the phone is physically held (upright or on its side), even while
 * the screen is locked to one side. `fn` gets each change. Returns a stop
 * function. Does nothing where the phone (or the build) cannot tell.
 */
export function watchTilt(fn: (landscape: boolean) => void): () => void {
  if (!native?.startTilt || !native.addListener) return () => undefined;
  const sub = native.addListener("onTilt", (e) => fn(!!e.landscape));
  native.startTilt().catch(() => false);
  return () => {
    sub.remove();
    native.stopTilt?.().catch(() => undefined);
  };
}
