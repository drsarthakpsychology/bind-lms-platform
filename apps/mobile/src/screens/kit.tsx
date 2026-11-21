import { CalendarOff, NotebookText, Pill, QrCode, X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, ChoicePebbles, FieldCard, FieldProgress, Flood, HintBubble, HintText, HoldButton, Jyo, Label, OptionList, Pebbles, QuietEmpty, ResultSheet, RoundButton, Row, RowList, Screen, Stone, T, type JyoPose } from "@/ds";
import { space, useTheme } from "@/theme";

const OPTIONS = ["Major depressive episode", "Persistent depressive disorder", "Adjustment disorder", "Generalised anxiety disorder"];
const POSES: JyoPose[] = ["hello", "thinking", "wellDone", "resting"];

/**
 * The kit on one page (route /kit): every Layers part in its real states, for
 * builders and for the screenshot check. Not linked from anywhere in the app.
 * `?state=checked` opens it with the answer checked and the mark confirmed.
 */
export function KitScreen({ start }: { start?: string }) {
  const c = useTheme();
  const [picked, setPicked] = React.useState<number | null>(start ? 0 : null);
  const [checked, setChecked] = React.useState(!!start);
  const [hint, setHint] = React.useState(!!start);
  const [way, setWay] = React.useState<"in" | "out" | null>(start ? "in" : null);
  const [marked, setMarked] = React.useState(false);
  const noop = () => undefined;
  return (
    <View style={{ flex: 1 }}>
      <Screen
        testID="kit"
        title="Which diagnosis fits best?"
        lead="Case 14 of 20 · sample content"
        gap={space[5]}
        field={
          <View style={{ gap: space[3] }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <RoundButton onField label="Close" onPress={noop}>
                <X size={18} color={c.onField} />
              </RoundButton>
              <View style={{ flex: 1 }}>
                <FieldProgress done={14} total={20} />
              </View>
            </View>
            <FieldCard live title="OPD is open" meta="5 to 8 pm · VIBHA Clinic, OPD 2" action={{ label: "Scan in", onPress: noop }} />
          </View>
        }
        footer={<Button label={checked ? "Checked" : "Check"} disabled={picked === null || checked} onPress={() => setChecked(true)} testID="kit-check" />}
      >
        <View style={{ gap: space[2] }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Label>OptionList and HintBubble</Label>
            <HintBubble open={hint} onToggle={() => setHint((h) => !h)} />
          </View>
          {hint ? <HintText>Look at how long it has lasted, and whether he still gets to work.</HintText> : null}
          <OptionList options={OPTIONS} picked={picked} onPick={setPicked} checked={checked} answer={1} />
        </View>
        <View style={{ gap: space[2] }}>
          <Label>Buttons</Label>
          <Button label="Primary: the one lime thing" onPress={noop} />
          <Button kind="quiet" label="Quiet: a stone pill" onPress={noop} />
          <Button kind="ink" label="Ink: on a result" onPress={noop} />
          <View style={{ flexDirection: "row", gap: space[4], alignItems: "center" }}>
            <Button small label="Small" onPress={noop} />
            <Button kind="text" label="Text link" onPress={noop} />
            <Button kind="danger" label="Danger" onPress={noop} />
          </View>
        </View>
        <View style={{ gap: space[2] }}>
          <Label>Stone, quiet stone, rows</Label>
          <Stone>
            <T v="h2">A stone card rests on the layer</T>
            <T v="small" tone="muted">
              26px corners, no outline, no shadow.
            </T>
          </Stone>
          <Stone quiet>
            <T v="bodyStrong">The quieter second thing</T>
            <T v="small" tone="muted">
              An outline, for what comes after.
            </T>
          </Stone>
          <RowList>
            <Row title="A plain row" meta="For lists, menus and settings" chevron onPress={noop} />
            <Row title="A second row" trailing="12" onPress={noop} />
          </RowList>
        </View>
        <View style={{ gap: space[2] }}>
          <Label>Pebbles</Label>
          <Pebbles
            items={[
              { label: "Scan", icon: QrCode, live: true, onPress: noop },
              { label: "Medicines", icon: Pill, onPress: noop },
              { label: "Notes", icon: NotebookText, onPress: noop },
              { label: "Leave", icon: CalendarOff, onPress: noop },
            ]}
          />
        </View>
        <View style={{ gap: space[3] }}>
          <Label>ChoicePebbles, HoldButton, Flood</Label>
          <View style={{ borderRadius: 30, overflow: "hidden", gap: space[4] }}>
            <ChoicePebbles
              label="Arriving or leaving"
              value={way}
              onChange={setWay}
              options={[
                { id: "in", word: "IN", sub: "I am arriving", tone: "lime" },
                { id: "out", word: "OUT", sub: "I am leaving", tone: "field" },
              ]}
            />
            <HoldButton disabled={!way} label={way ? `Hold to mark ${way.toUpperCase()}` : "Pick one first"} tapLabel={way ? `Mark ${way.toUpperCase()}` : "Pick one first"} onConfirm={() => setMarked(true)} />
            <Flood on={marked} tone={way === "out" ? "field" : "lime"} title={`You are ${way === "out" ? "OUT" : "IN"}`} meta="9:54 am · Weekend class" action={{ label: "Start again", onPress: () => (setMarked(false), setWay(null)) }} />
          </View>
        </View>
        <View style={{ gap: space[2] }}>
          <Label>Jyo: four poses, rare moments only</Label>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {POSES.map((p) => (
              <View key={p} style={{ alignItems: "center", gap: 4 }}>
                <View style={{ backgroundColor: c.card, borderRadius: 18, padding: 6 }}>
                  <Jyo pose={p} size={64} testID={`jyo-${p}`} />
                </View>
                <T v="caption" tone="muted">
                  {p}
                </T>
              </View>
            ))}
          </View>
          <QuietEmpty art={<Jyo pose="resting" size={56} still />} title="Nothing due today" body="An empty screen is one of the few places Jyo may sit." />
        </View>
      </Screen>
      <ResultSheet open={checked} right={picked === 1} title={picked === 1 ? "Yes, that fits" : "Not quite"} why="Two years of low mood on most days, while still working: that is the long, milder pattern." action={{ label: "Try it again", onPress: () => (setChecked(false), setPicked(null)) }} />
    </View>
  );
}
