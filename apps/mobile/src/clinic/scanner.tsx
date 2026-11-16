import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera } from "lucide-react-native";
import * as React from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";

import { Button, T } from "@/ds";
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

/**
 * The camera, reading QR codes only. `onRead` gets the text of each code it
 * sees while not `paused` (the screen pauses it while the server checks, so
 * one code is sent once). Asks for the camera first, in plain words; a phone
 * that said no is sent to Settings. The web build (screenshots) shows the
 * frame without a camera.
 */
export function CodeScanner({ onRead, paused, size }: { onRead: (text: string) => void; paused: boolean; size: number }) {
  const c = useTheme();
  const [perm, ask] = useCameraPermissions();
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
  if (!perm) return <View style={box} />;
  if (!perm.granted) {
    return (
      <View testID="scanner-ask" style={[box, { backgroundColor: c.tint, alignItems: "center", justifyContent: "center", padding: space[5], gap: space[3] }]}>
        <Camera size={32} color={c.ink} />
        <T center v="bodyStrong">
          Allow the camera to scan the code
        </T>
        <T center v="small" tone="muted">
          It is used only for this. You can also type the 6 letters below.
        </T>
        {perm.canAskAgain ? <Button kind="quiet" label="Allow camera" onPress={() => void ask()} testID="scanner-allow" /> : <Button kind="quiet" label="Open Settings" onPress={() => void Linking.openSettings()} testID="scanner-settings" />}
      </View>
    );
  }
  return (
    <View testID="scanner" style={box} accessible accessibilityLabel="Camera. Hold the code inside the frame.">
      <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={paused ? undefined : read} />
      <Corners />
    </View>
  );
}
