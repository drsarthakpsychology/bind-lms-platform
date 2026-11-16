import * as React from "react";
import { View } from "react-native";

import { Chips, Row, Sheet, T, TextScale } from "@/ds";
import { space, useTheme } from "@/theme";
import { settingsStore, updateSettings, type LocalSettings } from "./settings";

/**
 * Reading text size and line spacing, kept on this phone. One setting shared
 * by the reader's Aa sheet and the Settings "Text size" row; the reader,
 * notes and quick reference follow it (wrap their text in `ReadingSize`).
 */

export type TextSize = LocalSettings["textSize"];
export type LineSpacing = LocalSettings["lineSpacing"];

export const TEXT_SIZES: { id: TextSize; name: string; scale: number }[] = [
  { id: "small", name: "Small", scale: 0.9 },
  { id: "normal", name: "Normal", scale: 1 },
  { id: "large", name: "Large", scale: 1.15 },
  { id: "larger", name: "Larger", scale: 1.3 },
];

export const LINE_SPACINGS: { id: LineSpacing; name: string; line: number }[] = [
  { id: "normal", name: "Normal", line: 1 },
  { id: "roomy", name: "Roomy", line: 1.2 },
];

/** The reading setting and its setters. Use it for the Settings row or your own control. */
export function useTextSize() {
  const size = settingsStore.use((s) => s.textSize ?? "normal");
  const spacing = settingsStore.use((s) => s.lineSpacing ?? "normal");
  const scale = TEXT_SIZES.find((t) => t.id === size)?.scale ?? 1;
  const line = LINE_SPACINGS.find((t) => t.id === spacing)?.line ?? 1;
  const name = TEXT_SIZES.find((t) => t.id === size)?.name ?? "Normal";
  const setSize = React.useCallback((v: TextSize) => updateSettings({ textSize: v }), []);
  const setSpacing = React.useCallback((v: LineSpacing) => updateSettings({ lineSpacing: v }), []);
  return { size, spacing, scale, line, name, setSize, setSpacing };
}

/** Text inside follows the reading text size and line spacing. */
export function ReadingSize({ children }: { children: React.ReactNode }) {
  const { scale, line } = useTextSize();
  const value = React.useMemo(() => ({ scale, line }), [scale, line]);
  return <TextScale.Provider value={value}>{children}</TextScale.Provider>;
}

/** The sheet with both choices and a live preview line. */
export function TextSizeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const c = useTheme();
  const { size, spacing, setSize, setSpacing } = useTextSize();
  return (
    <Sheet open={open} onClose={onClose} title="Text size" testID="text-size-sheet">
      <View style={{ gap: space[5] }}>
        <View style={{ borderRadius: 12, backgroundColor: c.tint, padding: space[4] }}>
          <ReadingSize>
            <T v="reading" testID="text-size-preview">
              Low mood most of the day, nearly every day, for at least two weeks.
            </T>
          </ReadingSize>
        </View>
        <View style={{ gap: space[2] }}>
          <T v="small" tone="muted">
            Size
          </T>
          <Chips label="Text size" options={TEXT_SIZES} value={size} onChange={setSize} />
        </View>
        <View style={{ gap: space[2] }}>
          <T v="small" tone="muted">
            Line spacing
          </T>
          <Chips label="Line spacing" options={LINE_SPACINGS} value={spacing} onChange={setSpacing} />
        </View>
      </View>
    </Sheet>
  );
}

/** The Settings row: "Text size" with the current choice; opens the same sheet. */
export function TextSizeRow({ icon }: { icon?: React.ReactNode }) {
  const { name } = useTextSize();
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <Row testID="settings-text-size" title="Text size" meta="Reading, notes and quick reference" icon={icon} trailing={name} onPress={() => setOpen(true)} />
      <TextSizeSheet open={open} onClose={close} />
    </>
  );
}
