import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Pills } from "@/clinic/admin/kit";
import { Button, Field, Row, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";
import { ConfirmSheet, OptionRow, Status } from "../kit";
import { plural } from "../format";
import { ControlSwitch, Group, Locked, MockNote, Panel, Screen, ShareBar } from "../ui";
import { ACCESS_COHORTS, ACCESS_PRESETS, ACCESS_SECTIONS, STUDENT_RECORD, type AccessId, type AccessPreset } from "./mock";

const ALL_OPEN = Object.fromEntries(ACCESS_SECTIONS.map((s) => [s.id, true])) as Record<AccessId, boolean>;
const LECTURES_ONLY = Object.fromEntries(ACCESS_SECTIONS.map((s) => [s.id, s.id === "lectures"])) as Record<AccessId, boolean>;

/** The six section switches. Used for one student and for many. */
function Sections({ value, onChange, prefix }: { value: Record<AccessId, boolean>; onChange: (v: Record<AccessId, boolean>) => void; prefix: string }) {
  return (
    <Panel rows>
      {ACCESS_SECTIONS.map((s) => (
        <ControlSwitch key={s.id} title={s.name} meta={s.about} value={value[s.id]} onChange={(on) => onChange({ ...value, [s.id]: on })} testID={`${prefix}-${s.id}`} />
      ))}
    </Panel>
  );
}

/** What a set of switches means, in one line. */
function summary(v: Record<AccessId, boolean>): string {
  const off = ACCESS_SECTIONS.filter((s) => !v[s.id]).map((s) => s.name);
  if (!off.length) return "Everything open";
  if (off.length === ACCESS_SECTIONS.length) return "Everything closed";
  if (off.length === ACCESS_SECTIONS.length - 1) return `Only ${ACCESS_SECTIONS.find((s) => v[s.id])?.name.toLowerCase()} open`;
  return `Closed: ${off.join(", ")}`;
}

/* -------------------------------------------------------- one student */

/** The student page's section switches: what this one student can open. Saves at once; closing asks first. */
export function StudentSections({ name }: { name: string }) {
  const [value, setValue] = React.useState(ALL_OPEN);
  const [ask, setAsk] = React.useState<Record<AccessId, boolean> | null>(null);
  const apply = (v: Record<AccessId, boolean>) => {
    setValue(v);
    haptic.success();
    toast.show(summary(v));
  };
  const change = (v: Record<AccessId, boolean>) => {
    const closing = ACCESS_SECTIONS.some((s) => value[s.id] && !v[s.id]);
    if (closing) setAsk(v);
    else apply(v);
  };
  const closed = ask ? ACCESS_SECTIONS.find((s) => value[s.id] && !ask[s.id]) : null;
  return (
    <Group title="Sections" testID="student-sections">
      <Sections value={value} onChange={change} prefix="section" />
      <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
        {summary(value)}. Sample switches: not connected to the live site yet.
      </T>
      <ConfirmSheet open={!!ask} onClose={() => setAsk(null)} title={closed ? `Close ${closed.name} for ${name}?` : "Close this section?"} body="It disappears from their app at once. Their progress is kept." confirm="Close it" danger onConfirm={() => { if (ask) apply(ask); setAsk(null); }} testID="section-confirm" />
    </Group>
  );
}

/** The student page's Record tab: study progress by module, attendance, and cases against the target. */
export function StudentRecord({ name }: { name: string }) {
  const d = STUDENT_RECORD;
  const a = d.attendance;
  const came = Math.round((a.present / Math.max(1, a.expected)) * 100);
  return (
    <>
      <Group title="Study progress" action={{ label: "Class results", onPress: () => router.push("/admin/teaching") }}>
        <Panel style={{ gap: space[3] }}>
          {d.modules.map((m) => (
            <View key={m.id} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                <T v="small" style={{ flex: 1 }}>
                  {m.title}
                </T>
                <T v="caption" tone="muted" num>
                  {m.score === null ? "No checkpoint yet" : `Checkpoints ${m.score}%`}
                </T>
              </View>
              <ShareBar pct={m.pct} label={`${m.title}: ${m.pct} percent read`} />
            </View>
          ))}
          <T v="caption" tone="muted">
            Slips most on: {d.weak.join(", ")}.
          </T>
        </Panel>
      </Group>
      <Group title="Attendance" action={{ label: "Trackers", onPress: () => router.push("/admin/clinic/trackers") }}>
        <Panel style={{ gap: space[3] }}>
          <ShareBar pct={came} label={`Attendance ${came} percent`} tone={came < 75 ? "warn" : "plain"} />
          <T v="small" num>
            Came to {a.present} of {a.expected} sessions · {a.late} late · {a.leave} on leave · {a.missed} missed
          </T>
        </Panel>
        <Panel rows>
          {a.last.map((s) => (
            <Row key={s.when} title={s.title} meta={s.state} trailing={s.when} />
          ))}
        </Panel>
      </Group>
      <Group title="Cases" action={{ label: "OPD timetable", onPress: () => router.push("/admin/clinic/opd") }}>
        <Panel style={{ gap: space[3] }}>
          <ShareBar pct={Math.round((d.cases.logged / d.cases.target) * 100)} label={`${d.cases.logged} of ${d.cases.target} cases logged`} />
          <T v="small" num>
            {d.cases.logged} of {d.cases.target} cases logged this month
          </T>
        </Panel>
        <Panel rows>
          {d.cases.last.map((s) => (
            <Row key={s.when} title={s.title} meta={s.note} trailing={s.when} />
          ))}
        </Panel>
      </Group>
      <MockNote what={`${name.split(" ")[0]}'s record`} />
    </>
  );
}

/* --------------------------------------------------------- add a student */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Add a student: one at a time, or a pasted list (one email on each line).
 * The preview at the top says exactly what will happen before anything is sent.
 */
export function AddStudentScreen() {
  const [mode, setMode] = React.useState<"one" | "many">("one");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [roll, setRoll] = React.useState("");
  const [list, setList] = React.useState("");
  const [cohort, setCohort] = React.useState<string>(ACCESS_COHORTS[0]!.id);
  const [preset, setPreset] = React.useState<AccessPreset>("full");
  const [sendLink, setSendLink] = React.useState(true);
  const [err, setErr] = React.useState<{ name?: string; email?: string; list?: string }>({});
  const [busy, setBusy] = React.useState(false);
  const emails = list.split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean);
  const good = emails.filter((e) => EMAIL.test(e));
  const bad = emails.length - good.length;
  const n = mode === "one" ? 1 : good.length;
  const cohortName = ACCESS_COHORTS.find((x) => x.id === cohort)?.name ?? "";
  const add = () => {
    if (mode === "one") {
      const e = { name: name.trim() ? undefined : "Write the student's name.", email: EMAIL.test(email.trim()) ? undefined : "Write a full email address." };
      setErr(e);
      if (e.name || e.email) return haptic.warn();
    } else if (!good.length) {
      setErr({ list: "Paste at least one email address." });
      return haptic.warn();
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      haptic.success();
      toast.show(`${plural(n, "student")} added to ${cohortName}${sendLink ? ". Login links sent" : ""}`);
      router.back();
    }, 500);
  };
  return (
    <Screen
      title="Add a student"
      testID="admin-add-student"
      gap={space[4]}
      footer={
        <Locked>
          <Button label={mode === "one" ? "Add student" : n ? `Add ${plural(n, "student")}` : "Add students"} busy={busy} needsServer onPress={add} testID="add-student-go" />
        </Locked>
      }
    >
      <Panel testID="add-preview" style={{ gap: 2 }}>
        <T v="caption" tone="muted">
          What will happen
        </T>
        <T v="bodyStrong">
          {mode === "one" ? name.trim() || "A new student" : plural(n, "student")} joins {cohortName}
        </T>
        <T v="small" tone="muted">
          {ACCESS_PRESETS.find((p) => p.id === preset)?.about}. {sendLink ? "A login link goes to their email now." : "No email is sent. You send the login link later."}
        </T>
      </Panel>
      <Pills label="How many" value={mode} onChange={setMode} options={[{ id: "one", name: "One student" }, { id: "many", name: "Paste a list" }]} testID="add-mode" />
      {mode === "one" ? (
        <>
          <Field label="Full name" value={name} onChangeText={setName} error={err.name} autoCapitalize="words" returnKeyType="next" testID="add-name" />
          <Field label="Email" value={email} onChangeText={setEmail} error={err.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" testID="add-email" />
          <Field label="Mobile (optional)" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" hint="With the country code, for WhatsApp" returnKeyType="next" testID="add-mobile" />
          <Field label="Roll number (optional)" value={roll} onChangeText={setRoll} autoCapitalize="characters" returnKeyType="done" testID="add-roll" />
        </>
      ) : (
        <Field label="Email addresses" value={list} onChangeText={setList} area error={err.list} autoCapitalize="none" autoCorrect={false} hint={emails.length ? `${plural(good.length, "address", "addresses")} ready${bad ? ` · ${bad} not an email, left out` : ""}` : "One on each line, or separated by commas"} testID="add-list" />
      )}
      <Group title="Cohort">
        <Pills label="Cohort" value={cohort} onChange={setCohort} options={ACCESS_COHORTS.map((x) => ({ id: x.id, name: x.name }))} testID="add-cohort" />
      </Group>
      <Group title="Access">
        <Panel rows>
          {ACCESS_PRESETS.filter((p) => p.id !== "custom").map((p) => (
            <OptionRow key={p.id} label={p.name} meta={p.about} on={preset === p.id} onPress={() => setPreset(p.id)} testID={`add-access-${p.id}`} />
          ))}
        </Panel>
      </Group>
      <Panel>
        <ControlSwitch title="Email the login link now" meta="They set a password from the link" value={sendLink} onChange={setSendLink} testID="add-link" />
      </Panel>
      <MockNote what="Adding a student" />
    </Screen>
  );
}

/* --------------------------------------------------------- bulk access */

/**
 * Access for many students at once: pick who (a cohort, or the students ticked
 * in People), pick what is open, read the summary, then apply. Pausing and
 * resuming a whole group is here too.
 */
export function BulkAccessScreen() {
  const params = useLocalSearchParams<{ ids?: string }>();
  const ids = String(params.ids ?? "").split(",").filter(Boolean);
  const [cohort, setCohort] = React.useState<string>(ACCESS_COHORTS[0]!.id);
  const [preset, setPreset] = React.useState<AccessPreset>("custom");
  const [value, setValue] = React.useState(ALL_OPEN);
  const [ask, setAsk] = React.useState<"apply" | "pause" | "resume" | null>(null);
  const [busy, setBusy] = React.useState(false);
  const picked = ACCESS_COHORTS.find((x) => x.id === cohort);
  const n = ids.length || picked?.students || 0;
  const who = ids.length ? plural(ids.length, "picked student") : `${picked?.name ?? "Cohort"} (${plural(n, "student")})`;
  const pick = (p: AccessPreset) => {
    setPreset(p);
    if (p === "full") setValue(ALL_OPEN);
    if (p === "lectures_only") setValue(LECTURES_ONLY);
  };
  const run = (what: "apply" | "pause" | "resume") => {
    setAsk(null);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      haptic.success();
      toast.show(what === "apply" ? `Access changed for ${plural(n, "student")}` : what === "pause" ? `${plural(n, "student")} paused` : `${plural(n, "student")} can sign in again`);
      if (what === "apply") router.back();
    }, 500);
  };
  return (
    <Screen
      title="Access"
      lead="For many students at once"
      testID="admin-bulk-access"
      gap={space[4]}
      footer={
        <Locked>
          <Button label={`Apply to ${plural(n, "student")}`} busy={busy} needsServer onPress={() => setAsk("apply")} testID="bulk-apply" />
        </Locked>
      }
    >
      <Panel testID="bulk-preview" style={{ gap: 2 }}>
        <T v="caption" tone="muted">
          What will happen
        </T>
        <T v="bodyStrong">{who}</T>
        <T v="small" tone="muted">
          {summary(value)}. Progress and records are kept.
        </T>
      </Panel>
      {ids.length ? null : (
        <Group title="Who">
          <Pills label="Cohort" value={cohort} onChange={setCohort} options={ACCESS_COHORTS.map((x) => ({ id: x.id, name: x.name }))} testID="bulk-cohort" />
          <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
            To pick single students, press and hold a name in People, tick the others, then choose Access.
          </T>
        </Group>
      )}
      <Group title="What is open">
        <Pills label="Preset" value={preset} onChange={pick} options={ACCESS_PRESETS.map((p) => ({ id: p.id, name: p.name }))} testID="bulk-preset" />
        <Sections value={value} onChange={(v) => { setValue(v); setPreset("custom"); }} prefix="bulk-section" />
      </Group>
      <Group title="Pause or resume">
        <Panel style={{ gap: space[3] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <Status tone="quiet">Paused students cannot sign in. Nothing is deleted.</Status>
          </View>
          <Locked>
            <View style={{ flexDirection: "row", gap: space[2] }}>
              <View style={{ flex: 1 }}>
                <Button small kind="quiet" label="Pause all" onPress={() => setAsk("pause")} testID="bulk-pause" />
              </View>
              <View style={{ flex: 1 }}>
                <Button small kind="quiet" label="Resume all" onPress={() => setAsk("resume")} testID="bulk-resume" />
              </View>
            </View>
          </Locked>
        </Panel>
      </Group>
      <MockNote what="Access for many" />
      <ConfirmSheet
        open={!!ask}
        onClose={() => setAsk(null)}
        title={ask === "pause" ? `Pause ${plural(n, "student")}?` : ask === "resume" ? `Resume ${plural(n, "student")}?` : `Change access for ${plural(n, "student")}?`}
        body={ask === "pause" ? "They are signed out and cannot sign in until you resume them." : ask === "resume" ? "They can sign in again with their own password." : `${who}. ${summary(value)}. It takes effect at once.`}
        confirm={ask === "pause" ? "Pause them" : ask === "resume" ? "Resume them" : "Apply"}
        danger={ask === "pause"}
        onConfirm={() => ask && run(ask)}
        testID="bulk-confirm"
      />
    </Screen>
  );
}
