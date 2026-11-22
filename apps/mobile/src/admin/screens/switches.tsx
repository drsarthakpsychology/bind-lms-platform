import { useQueryClient } from "@tanstack/react-query";
import { FlaskConical, RotateCcw, UserRound } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, Row, RowsSkeleton, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { ConfirmSheet, FilterChips, Loaded, OptionRow, Status } from "../kit";
import type { Tone } from "../format";
import { liveCalls, useSwitches, type Switch, type SwitchState } from "../live";
import { openAsTestStudent, setTestMode, testModeCalls, useTestMode } from "../test-mode";
import { ControlSwitch, Group, Locked, LockLine, Panel, Screen, Tiles } from "../ui";
import { guarded, useAdminRole } from "../role";

const TONE: Record<SwitchState, Tone> = { unlocked: "ok", live: "info", off: "quiet" };
const ORDER: SwitchState[] = ["unlocked", "live", "off"];
/** How open a state is, to tell "closing" (asks first) from "opening". */
const OPENNESS: Record<SwitchState, number> = { off: 0, live: 1, unlocked: 2 };
export const SWITCH_LABEL: Record<SwitchState, string> = { unlocked: "Open", live: "Shown, locked", off: "Hidden" };
export const SWITCH_ABOUT: Record<SwitchState, string> = { unlocked: "Students see it and can use it.", live: "Students see it with a lock and cannot open it yet.", off: "Students do not see it at all." };

/** One feature: who can see it. Changes that take something away from students ask first. */
function FeatureSheet({ f, onClose, onSave, busy }: { f: Switch | null; onClose: () => void; onSave: (key: string, state: SwitchState) => Promise<void>; busy: boolean }) {
  const { viewOnly } = useAdminRole();
  const [state, setState] = React.useState<SwitchState>(f?.state ?? "off");
  const [ask, setAsk] = React.useState(false);
  const [key, setKey] = React.useState<string | null>(null);
  if (f && f.key !== key) {
    setKey(f.key);
    setState(f.state);
  }
  if (!f) return <Sheet open={false} onClose={onClose} />;
  const changed = state !== f.state;
  const closing = OPENNESS[state] < OPENNESS[f.state];
  const save = async () => {
    setAsk(false);
    await onSave(f.key, state);
    onClose();
  };
  return (
    <>
      <Sheet open={!ask} onClose={onClose} title={f.name} testID="feature-sheet">
        <View style={{ gap: space[4] }}>
          {f.about ? (
            <T v="small" tone="muted">
              {f.about}
            </T>
          ) : null}
          <Locked>
            <View accessibilityRole="radiogroup" accessibilityLabel={`${f.name}: who can see it`}>
              {ORDER.map((s) => (
                <OptionRow key={s} label={SWITCH_LABEL[s]} meta={SWITCH_ABOUT[s]} on={state === s} onPress={() => setState(s)} testID={`feature-state-${s}`} />
              ))}
            </View>
          </Locked>
          {viewOnly ? null : <Button label={changed ? "Save" : "No changes"} disabled={!changed} busy={busy} onPress={() => (closing ? setAsk(true) : void save())} testID="feature-save" />}
          <Button kind="text" full label="Close" onPress={onClose} />
        </View>
      </Sheet>
      <ConfirmSheet
        open={ask}
        onClose={() => setAsk(false)}
        title={state === "off" ? `Hide ${f.name}?` : `Lock ${f.name}?`}
        body={`${state === "off" ? "It disappears from every student's app at once." : "Students still see it, but it will not open."} Their progress is kept. You can open it again any time.`}
        confirm={state === "off" ? "Hide it" : "Lock it"}
        danger
        busy={busy}
        onConfirm={() => void save()}
        testID="feature-confirm"
      />
    </>
  );
}

/**
 * Features for students: every feature students can reach, grouped by kind,
 * read from the website. One tap shows its three-way switch.
 */
export function SwitchesScreen() {
  const q = useSwitches();
  const qc = useQueryClient();
  const { role } = useAdminRole();
  const [show, setShow] = React.useState<"" | SwitchState>("");
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const all = (q.data ?? []).flatMap((g) => g.items);
  const count = (s: SwitchState) => all.filter((f) => f.state === s).length;
  const open = all.find((f) => f.key === openKey) ?? null;
  const onSave = async (key: string, state: SwitchState) => {
    await guarded(role, "switch", async () => {
      setBusy(true);
      try {
        await liveCalls.setSwitch(key, state);
        haptic.success();
        toast.show(`${all.find((f) => f.key === key)?.name ?? "Feature"}: ${SWITCH_LABEL[state].toLowerCase()}`);
        await qc.invalidateQueries({ queryKey: ["admin"] });
      } catch (e) {
        haptic.warn();
        toast.show(messageOf(e));
      } finally {
        setBusy(false);
      }
    });
  };
  return (
    <Screen title="Features for students" lead="Choose what students can see and open" testID="admin-switches" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="features" skeleton={<RowsSkeleton rows={6} />}>
        {(groups) => (
          <View style={{ gap: space[5] }}>
            <Tiles
              items={[
                { value: count("unlocked"), label: "open to students", onPress: () => setShow("unlocked") },
                { value: count("live"), label: "shown, locked", onPress: () => setShow("live") },
                { value: count("off"), label: "hidden", onPress: () => setShow("off") },
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
                      <Row key={f.key} testID={`feature-${f.key}`} title={f.name} meta={f.about || undefined} trailing={<Status tone={TONE[f.state]}>{SWITCH_LABEL[f.state]}</Status>} onPress={() => setOpenKey(f.key)} />
                    ))}
                  </Panel>
                </Group>
              );
            })}
            <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
              Admins can always open everything, whatever is set here.
            </T>
          </View>
        )}
      </Loaded>
      <FeatureSheet f={open} busy={busy} onClose={() => setOpenKey(null)} onSave={onSave} />
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
