import { requireOptionalNativeModule } from "expo";

type Native = { setNavigationBarDark(dark: boolean): Promise<void> };

/** Android only (android/ in this folder). Missing on iPhone, the web build and tests, where it does nothing. */
const native = requireOptionalNativeModule<Native>("SystemBars");

/** Light buttons on a dark app, dark buttons on a light app. Never throws. */
export function setNavigationBarDark(dark: boolean): void {
  if (!native) return;
  native.setNavigationBarDark(dark).catch(() => undefined);
}
