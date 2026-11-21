import { FlaskConical, RotateCcw, UserRound } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { Stepper } from "@/clinic/admin/kit";
import { Button, Row, RowsSkeleton, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { LoadSwap } from "@/motion";
import { space, useTheme } from "@/theme";
import { ConfirmSheet, FilterChips, OptionRow, Status } from "../kit";
import { plural, type Tone } from "../format";
import { openAsTestStudent, setTestMode, testModeCalls, useTestMode } from "../test-mode";
import { ControlSwitch, Group, Locked, LockLine, MockNote, Panel, Screen, Tiles, useSample } from "../ui";
import { useAdminRole } from "../role";
import { FEATURES, SWITCH_ABOUT, SWITCH_LABEL, type FeatureSwitch, type SwitchState } from "./mock";

const TONE: Record<SwitchState, Tone> = { unlocked: "ok", live: "info", off: "quiet" };
const ORDER: SwitchState[] = ["unlocked", "live", "off"];
/** How open a state is, to tell "closing" (asks first) from "opening". */
const OPENNESS: Record<SwitchState, number> = { off: 0, live: 1, unlocked: 2 };

/** One feature: its state, its limit and who is using it. Changes that take something away from students ask first. */
function FeatureSheet({ f, onClose, onSave }: { f: FeatureSwitch | null; onClose: () => void; onSave: (key: string, state: SwitchState, limit: number | null) => void }) {
  const { viewOnly } = useAdminRole();
  const [state, setState] = React.useState<SwitchState>(f?.state ?? "off");
  const [limit, setLimit] = React.useState<number>(f?.limit?.value ?? 0);
  const [ask, setAsk] = React.useState(false);
  const [key, setKey] = React.useState<string | null>(null);
  if (f && f.key !== key) {
    setKey(f.key);
    setState(f.state);
    setLimit(f.limit?.value ?? 0);
  }
  if (!f) return <Sheet open={false} onClose={onClose} />;
  const changed = state !== f.state || (f.limit ? limit !== f.limit.value : false);
  const closing = OPENNESS[state] < OPENNESS[f.state];
  const save = () => {
    onSave(f.key, state, f.limit ? limit : null);
    setAsk(false);
    onClose();
  };
  return (
    <>
      <Sheet open={!ask} onClose={onClose} title={f.name} testID="feature-sheet">
        <View style={{ gap: space[4] }}>
          <T v="small" tone="muted">
            {f.about}
          </T>
          <Locked>
            <View accessibilityRole="radiogroup" accessibilityLabel={`${f.name}: who can see it`}>
              {ORDER.map((s) => (
                <OptionRow key={s} label={SWITCH_LABEL[s]} meta={SWITCH_ABOUT[s]} on={state === s} onPress={() => setState(s)} testID={`feature-state-${s}`} />
              ))}
            </View>
          </Locked>
          {f.limit ? (
            <Locked>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T v="bodyStrong">{f.limit.label}</T>
                  <T v="small" tone="muted" num>
                    Now {f.limit.value} {f.limit.unit}
                  </T>
                </View>
                <Stepper label={f.limit.label} value={limit} min={f.limit.min} max={f.limit.max} onChange={(n) => setLimit(Math.round(n / f.limit!.step) * f.limit!.step || n)} testID="feature-limit" />
              </View>
            </Locked>
          ) : null}
          <View style={{ gap: space[1] }}>
            <T v="label" tone="muted">
              Who is using it
            </T>
            {f.using ? (
              <>
                <T v="small" num>
                  {plural(f.using, "student")} in the last 7 days
                </T>
                {f.recent.map((r) => (
                  <T key={r.name} v="small" tone="muted">
                    {r.name} · {r.when}
                  </T>
                ))}
              </>
            ) : (
              <T v="small" tone="muted">
                Nobody yet. It is not open to students.
              </T>
            )}
          </View>
          {viewOnly ? null : <Button label={changed ? "Save" : "No changes"} disabled={!changed} needsServer onPress={() => (closing ? setAsk(true) : save())} testID="feature-save" />}
          <Button kind="text" full label="Close" onPress={onClose} />
        </View>
      </Sheet>
      <ConfirmSheet
        open={ask}
        onClose={() => setAsk(false)}
        title={state === "off" ? `Hide ${f.name}?` : `Lock ${f.name}?`}
        body={`${f.using ? `${plural(f.using, "student")} used it this week. ` : ""}${state === "off" ? "It disappears from their app at once." : "They will still see it, but it will not open."} You can open it again any time.`}
        confirm={state === "off" ? "Hide it" : "Lock it"}
        danger
        onConfirm={save}
        testID="feature-confirm"
      />
    </>
  );
}

/**
 * What is live: every feature students can reach, grouped by kind. One tap
 * shows its three-way switch, its limit and who is using it.
 */
export function SwitchesScreen() {
  const sample = useSample(FEATURES);
  const [over, setOver] = React.useState<Record<string, { state: SwitchState; limit: number | null }>>({});
  const [show, setShow] = React.useState<"" | SwitchState>("");
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const groups = FEATURES.map((g) => ({ ...g, items: g.items.map((f) => (over[f.key] ? { ...f, state: over[f.key]!.state, limit: f.limit && over[f.key]!.limit !== null ? { ...f.limit, value: over[f.key]!.limit! } : f.limit } : f)) }));
  const all = groups.flatMap((g) => g.items);
  const count = (s: SwitchState) => all.filter((f) => f.state === s).length;
  const open = all.find((f) => f.key === openKey) ?? null;
  return (
    <Screen title="What is live" lead="Every feature students can reach" testID="admin-switches">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[5] }}>
          <Tiles
            items={[
              { value: count("unlocked"), label: "open to students" },
              { value: count("live"), label: "shown, locked" },
              { value: count("off"), label: "hidden" },
            ]}
          />
          <FilterChips label="Show" value={show} onChange={setShow} testID="switch-filter" options={[{ id: "", name: "All" }, { id: "unlocked", name: "Open" }, { id: "live", name: "Shown, locked" }, { id: "off", name: "Hidden" }]} />
          {groups.map((g) => {
            const items = g.items.filter((f) => !show || f.state === show);
            if (!items.length) return null;
            return (
              <Group key={g.title} title={g.title} count={items.length}>
                <Panel rows>
                  {items.map((f) => (
                    <Row
                      key={f.key}
                      testID={`feature-${f.key}`}
                      title={f.name}
                      meta={`${f.using ? `${plural(f.using, "student")} this week` : "Not in use"}${f.limit ? ` · ${f.limit.label.toLowerCase()}: ${f.limit.value}` : ""}`}
                      trailing={<Status tone={TONE[f.state]}>{SWITCH_LABEL[f.state]}</Status>}
                      onPress={() => setOpenKey(f.key)}
                    />
                  ))}
                </Panel>
              </Group>
            );
          })}
          <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
            Admins can always open everything, whatever is set here. Uploading courses and lectures stays on the website.
          </T>
          <MockNote />
        </View>
      </LoadSwap>
      <FeatureSheet
        f={open}
        onClose={() => setOpenKey(null)}
        onSave={(key, state, limit) => {
          setOver((o) => ({ ...o, [key]: { state, limit } }));
          haptic.success();
          toast.show(`${all.find((f) => f.key === key)?.name ?? "Feature"}: ${SWITCH_LABEL[state].toLowerCase()}`);
        }}
      />
    </Screen>
  );
}

/**
 * Test mode: the switch, what it does, the way into the student side as the
 * hidden test student, and the reset. While it is on, every admin screen
 * carries the test strip under its bar.
 */
export function TestModeScreen() {
  const c = useTheme();
  const on = useTestMode() === "admin";
  const { viewOnly } = useAdminRole();
  const [confirm, setConfirm] = React.useState(false);
  const reset = async () => {
    setConfirm(false);
    try {
      await testModeCalls.reset();
      haptic.success();
      toast.show("Test data reset");
    } catch (e) {
      toast.show(messageOf(e));
    }
  };
  return (
    <Screen title="Test mode" lead={on ? "On" : "Off"} testID="admin-test-mode">
      <Panel style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: on ? c.warnBg : c.bg, alignItems: "center", justifyContent: "center" }}>
            <FlaskConical size={18} color={on ? c.warnFg : c.muted} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <T v="bodyStrong">{on ? "Test mode is on" : "Test mode is off"}</T>
            <T v="small" tone="muted">
              {on ? "Messages, marks and posts you make now go only to the hidden test student. Real students see nothing." : "Turn it on to try lessons, practice, the clinic and doubts as a hidden test student, without touching real students."}
            </T>
          </View>
        </View>
      </Panel>
      <Group title="Switch">
        <Panel>
          <ControlSwitch title="Test mode" meta="Use the student side as a hidden test student" value={on} onChange={(v) => void setTestMode(v)} testID="test-mode-switch" />
        </Panel>
      </Group>
      <Group title="While it is on">
        <Panel rows>
          <Row title="Open as test student" meta={on ? "The student tabs open. A bar leads back here." : "Turn test mode on first"} icon={<UserRound size={20} color={on ? c.ink : c.faint} />} onPress={on ? () => void openAsTestStudent() : undefined} testID="test-mode-open" />
          <Row title="Reset test data" meta={viewOnly ? undefined : "Wipe the test student's progress and test posts"} icon={<RotateCcw size={20} color={on && !viewOnly ? c.ink : c.faint} />} onPress={on && !viewOnly ? () => setConfirm(true) : undefined} below={viewOnly ? <LockLine /> : undefined} testID="test-mode-reset" />
        </Panel>
      </Group>
      <Group title="What stays safe">
        <Panel>
          <View style={{ gap: space[2] }}>
            {["Real students never get a test message, mark or post.", "The class boards and numbers leave the test student out.", "Turning it off takes you back to normal at once."].map((line) => (
              <T key={line} v="small" tone="muted">
                {line}
              </T>
            ))}
          </View>
        </Panel>
      </Group>
      <ConfirmSheet open={confirm} onClose={() => setConfirm(false)} title="Reset test data?" body="The test student starts again from nothing. Real students are not touched." confirm="Reset" danger onConfirm={() => void reset()} testID="confirm-test-reset" />
    </Screen>
  );
}
