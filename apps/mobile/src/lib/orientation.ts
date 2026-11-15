import * as ScreenOrientation from "expo-screen-orientation";
import { Platform } from "react-native";

/**
 * The app is upright everywhere except the lecture player, which may be
 * turned on its side for a full-screen video.
 */
export async function holdPortrait(): Promise<void> {
  if (Platform.OS === "web") return;
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => undefined);
}

export async function allowRotation(): Promise<void> {
  if (Platform.OS === "web") return;
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT).catch(() => undefined);
}

export async function goLandscape(): Promise<void> {
  if (Platform.OS === "web") return;
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => undefined);
}
