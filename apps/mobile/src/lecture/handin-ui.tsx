import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { File } from "expo-file-system";
import { Circle, FileText, Mic, Pause, Play, Square, X } from "lucide-react-native";
import * as React from "react";
import { Linking, Pressable, View } from "react-native";

import type { Assignment, Submission } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { Button, Field, ProgressLine, Row, RowList, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { clock } from "@/lecture/player";
import { layout, space, useTheme } from "@/theme";
import { checkFile, handInFiles, handInRecording, mimeTypesFor, type Picked } from "./handin";

/* ------------------------------------------------------------------ files */

export function FileHandIn({ a, onDone }: { a: Assignment; onDone: (s: Submission) => void }) {
  const c = useTheme();
  const [files, setFiles] = React.useState<Picked[]>([]);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const room = a.maxFiles - files.length;

  const pick = async () => {
    setError(null);
    try {
      const r = await File.pickFileAsync({ mimeTypes: mimeTypesFor(a.acceptedFormats), multipleFiles: true } as never);
      const res = r as { canceled: boolean; result: File | File[] | null };
      if (res.canceled || !res.result) return;
      const picked = (Array.isArray(res.result) ? res.result : [res.result]).map((f) => ({ uri: f.uri, name: f.name, size: typeof f.size === "number" ? f.size : null }));
      const problems = picked.map((f) => checkFile(f, a)).filter(Boolean);
      const good = picked.filter((f) => !checkFile(f, a)).slice(0, room);
      if (problems.length) setError(problems[0]!);
      else if (picked.length > room) setError(`This assignment takes ${a.maxFiles} file${a.maxFiles === 1 ? "" : "s"} at most.`);
      if (good.length) haptic.select();
      setFiles((fs) => [...fs, ...good]);
    } catch {
      setError("The file picker did not open. Try again.");
    }
  };

  const send = async () => {
    if (!files.length) return setError("Add a file first.");
    setError(null);
    setProgress(0);
    try {
      const r = await handInFiles(a.id, files, note, (done, total) => setProgress(Math.round((done / total) * 100)));
      haptic.success();
      setFiles([]);
      onDone(r.submission);
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setProgress(null);
    }
  };

  return (
    <View style={{ gap: space[3] }} testID="handin-files">
      {files.length ? (
        <RowList>
          {files.map((f, i) => (
            <Row
              key={`${f.uri}${i}`}
              title={f.name}
              meta={f.size ? `${(f.size / 1_000_000).toFixed(1)} MB` : undefined}
              icon={<FileText size={20} color={c.muted} />}
              trailing={
                <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${f.name}`} onPress={() => setFiles((fs) => fs.filter((_, j) => j !== i))} hitSlop={8} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
                  <X size={20} color={c.muted} />
                </Pressable>
              }
            />
          ))}
        </RowList>
      ) : null}
      {room > 0 ? <Button kind="quiet" label={files.length ? "Add another file" : "Choose a file"} onPress={() => void pick()} disabled={progress !== null} testID="handin-pick" /> : null}
      <T v="small" tone="muted">
        {a.acceptedFormats.length ? a.acceptedFormats.map((x) => x.toUpperCase()).join(", ") : "Any file"} · up to {a.maxFiles} file{a.maxFiles === 1 ? "" : "s"}, {a.maxFileMb} MB each
      </T>
      <Field label="A note for your teacher (optional)" value={note} onChangeText={setNote} area maxLength={2000} />
      {progress !== null ? <ProgressLine value={progress} label={`Sending: ${progress}%`} /> : null}
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="handin-error">
          {error}
        </T>
      ) : null}
      <Button kind="quiet" label="Hand in" busy={progress !== null} disabled={!files.length} onPress={() => void send()} testID="handin-send" />
    </View>
  );
}

/* -------------------------------------------------------------- recording */

const MAX_SECONDS = 10 * 60;

export function RecordingHandIn({ a, onDone }: { a: Assignment; onDone: (s: Submission) => void }) {
  const c = useTheme();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const rec = useAudioRecorderState(recorder, 250);
  const [uri, setUri] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const player = useAudioPlayer(uri ? { uri } : null);
  const status = useAudioPlayerStatus(player);

  const start = async () => {
    setError(null);
    const p = await requestRecordingPermissionsAsync().catch(() => ({ granted: false, canAskAgain: false }));
    if (!p.granted) {
      setError(p.canAskAgain ? "Allow the microphone to record your answer." : "The microphone is off for this app. Turn it on in the phone's settings.");
      if (!p.canAskAgain) void Linking.openSettings();
      return;
    }
    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: MAX_SECONDS } as never);
      setUri(null);
      haptic.tap();
    } catch {
      setError("Recording could not start. Close other apps that use the microphone and try again.");
    }
  };
  const stop = async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false }).catch(() => undefined);
    haptic.select();
    setUri(recorder.uri);
  };
  const send = async () => {
    if (!uri) return;
    setBusy(true);
    setError(null);
    try {
      const r = await handInRecording(a.id, uri);
      haptic.success();
      onDone(r.submission);
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };

  const secs = Math.floor((rec.durationMillis ?? 0) / 1000);
  return (
    <View style={{ gap: space[4] }} testID="handin-recording">
      <View style={{ alignItems: "center", gap: space[3], paddingVertical: space[3] }}>
        <T style={{ fontFamily: "PixDigits", fontSize: 32, lineHeight: 40 }} num maxFontSizeMultiplier={1.2} accessibilityLabel={`${secs} seconds recorded`}>
          {clock(rec.isRecording ? secs : uri ? status.duration : 0)}
        </T>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={rec.isRecording ? "Stop recording" : uri ? "Record again" : "Start recording"}
          onPress={() => void (rec.isRecording ? stop() : start())}
          style={({ pressed }) => ({ width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", backgroundColor: rec.isRecording ? c.danger : c.primary, borderWidth: 2, borderColor: c.dark ? "#111111" : c.line, transform: [{ scale: pressed ? 0.96 : 1 }] })}
          testID="record-toggle"
        >
          {rec.isRecording ? <Square size={26} color="#ffffff" fill="#ffffff" /> : uri ? <Circle size={26} color={c.onPrimary} fill={c.danger} /> : <Mic size={28} color={c.onPrimary} />}
        </Pressable>
        <T v="small" tone="muted" center>
          {rec.isRecording ? "Recording. Tap to stop." : uri ? "Listen back, record again, or hand it in." : "Tap to start. Find a quiet place first."}
        </T>
      </View>
      {uri && !rec.isRecording ? (
        <Button kind="quiet" label={status.playing ? "Pause" : "Listen back"} icon={status.playing ? <Pause size={18} color={c.ink} /> : <Play size={18} color={c.ink} />} onPress={() => (status.playing ? player.pause() : (player.seekTo(0), player.play()))} testID="record-play" />
      ) : null}
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
      <Button kind="quiet" label="Hand in the recording" disabled={!uri || rec.isRecording} busy={busy} onPress={() => void send()} testID="record-send" />
    </View>
  );
}
