import { CameraView } from "expo-camera";
import { Camera, CameraOff } from "lucide-react-native";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { Button, T } from "@/ds";
import { openPhoneSettings, usePermission, type PermState } from "@/lib/permissions";
import { fixed, space, useTheme } from "@/theme";

/** Four corner marks over the camera: where to hold the code. */
function Corners() {
  const len = 28;
  const w = 4;
  const corner = (pos: object) => <View style={[{ position: "absolute", width: len, height: len, borderColor: fixed.white }, pos]} />;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { margin: 24 }]}>
      {corner({ top: 0, left: 0, borderTopWidth: w, borderLeftWidth: w, borderTopLeftRadius: 10 })}
      {corner({ top: 0, right: 0, borderTopWidth: w, borderRightWidth: w, borderTopRightRadius: 10 })}
      {corner({ bottom: 0, left: 0, borderBottomWidth: w, borderLeftWidth: w, borderBottomLeftRadius: 10 })}
      {corner({ bottom: 0, right: 0, borderBottomWidth: w, borderRightWidth: w, borderBottomRightRadius: 10 })}
    </View>
  );
}

/** What the scanner box says for each camera state (null: show the camera). */
export function scannerCopy(state: PermState, failed: boolean): { title: string; body: string; action: "allow" | "settings" | "retry" | null; testID: string } | null {
  if (failed) return { title: "The camera did not start", body: "Close other apps using the camera and try again, or type the code below.", action: "retry", testID: "scanner-failed" };
  switch (state) {
    case "granted":
      return null;
    case "ask":
      return { title: "Allow the camera to scan the code", body: "It is used only for this. You can also type the code below.", action: "allow", testID: "scanner-ask" };
    case "retry":
      return { title: "The camera is off for this app", body: "Allow it to scan, or type the code below.", action: "allow", testID: "scanner-retry" };
    case "blocked":
      return { title: "The camera is off for this app", body: "Turn on Camera in the phone's settings for Vibha Psychology, or type the code below.", action: "settings", testID: "scanner-blocked" };
    case "unavailable":
      return { title: "No camera here", body: "Type the code below.", action: null, testID: "scanner-none" };
    default:
      return { title: "", body: "", action: null, testID: "scanner-wait" };
  }
}

/**
 * The camera, reading QR codes only. `onRead` gets the text of each code it
 * sees while not `paused` (the screen pauses it while the server checks, so
 * one code is sent once). Every camera state has its own words and button:
 * never asked (Allow), said no (Allow again), said no for good (Open
 * settings; the state is read again when the app comes back), a camera that
 * would not start (Try again). Typing the code always works under it. The
 * web build (screenshots) shows the frame without a camera.
 */
export function CodeScanner({ onRead, paused, size }: { onRead: (text: string) => void; paused: boolean; size: number }) {
  const c = useTheme();
  const perm = usePermission("camera");
  const [failed, setFailed] = React.useState(false);
  const [mountKey, setMountKey] = React.useState(0);
  const last = React.useRef<{ text: string; at: number } | null>(null);
  const read = React.useCallback(
    (r: { data: string }) => {
      if (paused || !r?.data) return;
      // The camera reports the same code many times a second: once every 2 seconds is enough.
      const now = Date.now();
      if (last.current && last.current.text === r.data && now - last.current.at < 2000) return;
      last.current = { text: r.data, at: now };
      onRead(r.data);
    },
    [onRead, paused],
  );
  const box = { width: size, height: size, borderRadius: 20, overflow: "hidden" as const, backgroundColor: fixed.ink, alignSelf: "center" as const };
  if (Platform.OS === "web") {
    return (
      <View testID="scanner-frame" style={[box, { alignItems: "center", justifyContent: "center" }]} accessibilityLabel="Camera">
        <Camera size={36} color={fixed.white} />
        <Corners />
      </View>
    );
  }
  const copy = scannerCopy(perm.state, failed);
  if (copy && perm.state === "unknown" && !failed) return <View testID={copy.testID} style={box} />;
  if (copy) {
    const Icon = copy.action === "allow" ? Camera : CameraOff;
    return (
      <View testID={copy.testID} accessibilityLiveRegion="polite" style={[box, { backgroundColor: c.tint, alignItems: "center", justifyContent: "center", padding: space[5], gap: space[3] }]}>
        <Icon size={32} color={c.ink} />
        <T center v="bodyStrong">
          {copy.title}
        </T>
        <T center v="small" tone="muted">
          {copy.body}
        </T>
        {copy.action === "allow" ? <Button kind="quiet" label="Allow camera" onPress={() => void perm.ask()} testID="scanner-allow" /> : null}
        {copy.action === "settings" ? <Button kind="quiet" label="Open settings" onPress={openPhoneSettings} testID="scanner-settings" /> : null}
        {copy.action === "retry" ? (
          <Button
            kind="quiet"
            label="Try again"
            onPress={() => {
              setFailed(false);
              setMountKey((n) => n + 1);
            }}
            testID="scanner-again"
          />
        ) : null}
      </View>
    );
  }
  return (
    <View testID="scanner" style={box} accessible accessibilityLabel="Camera. Hold the code inside the frame.">
      <CameraView key={mountKey} style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={paused ? undefined : read} onMountError={() => setFailed(true)} />
      <Corners />
    </View>
  );
}
