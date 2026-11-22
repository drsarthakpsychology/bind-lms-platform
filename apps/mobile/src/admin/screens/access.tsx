import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { Pills } from "@/clinic/admin/kit";
import { Button, Field, RowsSkeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";
import { useCohorts } from "../api";
import { plural } from "../format";
import { ConfirmSheet, Loaded, OptionRow, Quiet, Status } from "../kit";
import { liveCalls, useSections, useStudentAccess, type AddRow, type Section } from "../live";
import { guarded, useAdminRole, type AdminAction } from "../role";
import { ControlSwitch, Group, Locked, Panel, Screen } from "../ui";

const SCOPES = [
  { id: "full" as const, name: "Full platform", about: "Lectures, study, practice and everything that is switched on" },
  { id: "lectures_only" as const, name: "Lectures only", about: "Only the lectures. Everything else stays closed" },
];
type Scope = (typeof SCOPES)[number]["id"];

/** One write: refused for view-only first, then the server, then admin data read again. */
function useWrite() {
  const qc = useQueryClient();
  const { role } = useAdminRole();
  const [busy, setBusy] = React.useState<string | null>(null);
  const run = async <T,>(action: AdminAction, tag: string, call: () => Promise<T>, done?: (r: T) => string): Promise<T | undefined> =>
    guarded(role, action, async () => {
      setBusy(tag);
      try {
        const r = await call();
        haptic.success();
        if (done) toast.show(done(r));
        await qc.invalidateQueries({ queryKey: ["admin"] });
        return r;
      } catch (e) {
        haptic.warn();
        toast.show(messageOf(e));
        return undefined;
      } finally {
        setBusy(null);
      }
    });
  return { run, busy };
}

const byGroup = <S extends Section>(list: S[]) => {
  const out = new Map<string, S[]>();
  for (const s of list) out.set(s.group, [...(out.get(s.group) ?? []), s]);
  return [...out];
};

/* -------------------------------------------------------- one student */

/**
 * The student page's access switches, from the website: full platform or
 * lectures only, and each section open or closed for this one student.
 * Saves at once; closing asks first. Progress is always kept.
 */
export function StudentSections({ id, name }: { id: string; name: string }) {
  const q = useStudentAccess(id);
  const { run, busy } = useWrite();
  const [ask, setAsk] = React.useState<{ key: string; name: string } | null>(null);
  const first = name.split(" ")[0] ?? name;
  const set = (key: string, label: string, open: boolean) => void run("access", key, () => liveCalls.setSection(id, key, open), () => `${label} ${open ? "opened" : "closed"} for ${first}`);
  return (
    <Group title="What they can open" testID="student-sections">
      <Loaded q={q} what="their access" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => (
          <View style={{ gap: space[3] }}>
            <Locked>
              <Pills label="Access" value={d.scope} onChange={(s: Scope) => s !== d.scope && void run("access", "scope", () => liveCalls.setScope(id, s), () => `${first}: ${s === "full" ? "full platform" : "lectures only"}`)} options={SCOPES.map((s) => ({ id: s.id, name: s.name }))} testID="student-scope" />
            </Locked>
            {d.scope === "lectures_only" ? (
              <Quiet>Lectures only: every section below stays closed for {first} until you choose Full platform.</Quiet>
            ) : (
              byGroup(d.sections).map(([g, list]) => (
                <Panel key={g} rows>
                  {list.map((s) => (
                    <ControlSwitch key={s.key} title={s.name} value={s.open} onChange={(on) => (on ? set(s.key, s.name, true) : setAsk({ key: s.key, name: s.name }))} testID={`section-${s.key}`} />
                  ))}
                </Panel>
              ))
            )}
            {busy ? (
              <T v="caption" tone="muted">
                Saving...
              </T>
            ) : null}
          </View>
        )}
      </Loaded>
      <ConfirmSheet open={!!ask} onClose={() => setAsk(null)} title={ask ? `Close ${ask.name} for ${first}?` : "Close it?"} body="It disappears from their app at once. Their progress is kept, and you can open it again any time." confirm="Close it" danger onConfirm={() => { if (ask) set(ask.key, ask.name, false); setAsk(null); }} testID="section-confirm" />
    </Group>
  );
}

/* --------------------------------------------------------- add a student */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OUTCOME: Record<AddRow["outcome"], string> = { created: "New account made", added: "Added to the cohort", already: "Already in this cohort", failed: "Could not be added" };

/**
 * Add students: paste one email or many (one on each line). New emails get
 * an account, existing ones join the cohort, and the login link goes out
 * when chosen. The panel at the top says exactly what will happen.
 */
export function AddStudentScreen() {
  const cohorts = useCohorts();
  const { run, busy } = useWrite();
  const [list, setList] = React.useState("");
  const [cohort, setCohort] = React.useState<string | null>(null);
  const [scope, setScope] = React.useState<Scope>("full");
  const [sendLink, setSendLink] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ rows: AddRow[]; invalid: string[] } | null>(null);
  const open = (cohorts.data?.items ?? []).filter((c) => c.status !== "ended");
  const picked = cohort ?? open[0]?.id ?? null;
  const cohortName = open.find((x) => x.id === picked)?.name ?? "a cohort";
  const emails = [...new Set(list.split(/[\s,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean))];
  const good = emails.filter((e) => EMAIL.test(e));
  const bad = emails.length - good.length;
  const add = async () => {
    if (!good.length) {
      setErr("Write at least one full email address.");
      return haptic.warn();
    }
    if (!picked) {
      setErr("Pick a cohort first.");
      return haptic.warn();
    }
    setErr(null);
    const r = await run("add-student", "add", () => liveCalls.addStudents({ emails: good, cohortId: picked, scope, sendEmail: sendLink }), (x) => `${plural(x.rows.filter((y) => y.outcome !== "failed").length, "student")} added to ${cohortName}`);
    if (r) setResult(r);
  };
  if (result) {
    return (
      <Screen title="Students added" testID="admin-add-result" footer={<Button label="Done" onPress={() => router.back()} testID="add-done" />}>
        <Panel rows>
          {result.rows.map((r) => (
            <View key={r.email} style={{ paddingVertical: space[2], gap: 2 }}>
              <T v="bodyStrong">{r.email}</T>
              <T v="small" tone={r.outcome === "failed" ? "danger" : "muted"}>
                {OUTCOME[r.outcome]}
                {r.reason ? `: ${r.reason}` : ""}
                {r.mailed ? ". Login link sent" : ""}
              </T>
            </View>
          ))}
        </Panel>
        {result.invalid.length ? <Quiet>Not an email, left out: {result.invalid.join(", ")}</Quiet> : null}
      </Screen>
    );
  }
  return (
    <Screen
      title="Add students"
      testID="admin-add-student"
      gap={space[4]}
      footer={
        <Locked>
          <Button label={good.length ? `Add ${plural(good.length, "student")}` : "Add students"} busy={busy === "add"} onPress={() => void add()} testID="add-student-go" />
        </Locked>
      }
    >
      <Panel testID="add-preview" style={{ gap: 2 }}>
        <T v="caption" tone="muted">
          What will happen
        </T>
        <T v="bodyStrong">
          {good.length ? plural(good.length, "student") : "The students you write"} join {cohortName}
        </T>
        <T v="small" tone="muted">
          {SCOPES.find((s) => s.id === scope)?.about}. {sendLink ? "A login link goes to each email now." : "No email is sent. You send the login link later."}
        </T>
      </Panel>
      <Field label="Email addresses" value={list} onChangeText={setList} area error={err ?? undefined} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" hint={emails.length ? `${plural(good.length, "address", "addresses")} ready${bad ? `, ${bad} not an email and left out` : ""}` : "One email, or many: one on each line"} testID="add-list" />
      <Group title="Cohort">
        <Loaded q={cohorts} what="cohorts" skeleton={<RowsSkeleton rows={2} />}>
          {() => (open.length ? <Pills label="Cohort" value={picked} onChange={setCohort} options={open.map((x) => ({ id: x.id, name: x.name }))} testID="add-cohort" /> : <Quiet>Make a cohort on the website first.</Quiet>)}
        </Loaded>
      </Group>
      <Group title="Access">
        <Panel rows>
          {SCOPES.map((p) => (
            <OptionRow key={p.id} label={p.name} meta={p.about} on={scope === p.id} onPress={() => setScope(p.id)} testID={`add-access-${p.id}`} />
          ))}
        </Panel>
      </Group>
      <Panel>
        <ControlSwitch title="Email the login link now" meta="They set their own password from the link" value={sendLink} onChange={setSendLink} testID="add-link" />
      </Panel>
    </Screen>
  );
}

/* --------------------------------------------------------- bulk access */

type Change = Record<string, boolean>;

/** What a set of changes means, in one line. Pure, so it is tested. */
export function changeLine(scope: Scope | null, change: Change, names: Record<string, string>): string {
  const opened = Object.keys(change).filter((k) => change[k]).map((k) => names[k] ?? k);
  const closed = Object.keys(change).filter((k) => !change[k]).map((k) => names[k] ?? k);
  const parts = [scope === "full" ? "Full platform" : scope === "lectures_only" ? "Lectures only" : null, opened.length ? `Open: ${opened.join(", ")}` : null, closed.length ? `Close: ${closed.join(", ")}` : null].filter(Boolean);
  return parts.length ? parts.join(". ") : "Nothing chosen yet";
}

/**
 * Access for many students at once: pick who (a cohort, or the students ticked
 * in People), pick what changes, read the summary, then apply. Only what you
 * change is changed. Pausing and resuming a whole group is here too.
 */
export function BulkAccessScreen() {
  const params = useLocalSearchParams<{ ids?: string }>();
  const ids = String(params.ids ?? "").split(",").filter(Boolean);
  const cohorts = useCohorts();
  const sections = useSections();
  const { run, busy } = useWrite();
  const [cohort, setCohort] = React.useState<string | null>(null);
  const [scope, setScope] = React.useState<Scope | null>(null);
  const [change, setChange] = React.useState<Change>({});
  const [ask, setAsk] = React.useState<"apply" | "pause" | "resume" | null>(null);
  const list = (cohorts.data?.items ?? []).filter((c) => c.status !== "ended");
  const picked = list.find((x) => x.id === (cohort ?? list[0]?.id));
  const n = ids.length || picked?.members || 0;
  const who = ids.length ? plural(ids.length, "picked student") : picked ? `${picked.name} (${plural(n, "student")})` : "Pick a cohort";
  const names = Object.fromEntries((sections.data ?? []).map((s) => [s.key, s.name]));
  const line = changeLine(scope, change, names);
  const target = ids.length ? { ids } : picked ? { cohortId: picked.id } : null;
  const nothing = !scope && !Object.keys(change).length;
  const go = (what: "apply" | "pause" | "resume") => {
    setAsk(null);
    if (!target) return;
    const body = what === "apply" ? { ...target, ...(scope ? { scope } : {}), ...(Object.keys(change).length ? { sections: change } : {}) } : { ...target, account: what };
    void run("access", what, () => liveCalls.bulkAccess(body), (k) => (what === "apply" ? `Access changed for ${plural(k, "student")}` : what === "pause" ? `${plural(k, "student")} paused` : `${plural(k, "student")} can sign in again`)).then((r) => {
      if (r !== undefined && what === "apply") router.back();
    });
  };
  return (
    <Screen
      title="Access for many"
      lead="Change what a group of students can open"
      testID="admin-bulk-access"
      gap={space[4]}
      footer={
        <Locked>
          <Button label={n ? `Apply to ${plural(n, "student")}` : "Apply"} disabled={nothing || !target} busy={busy === "apply"} onPress={() => setAsk("apply")} testID="bulk-apply" />
        </Locked>
      }
    >
      <Panel testID="bulk-preview" style={{ gap: 2 }}>
        <T v="caption" tone="muted">
          What will happen
        </T>
        <T v="bodyStrong">{who}</T>
        <T v="small" tone="muted">
          {line}. Anything you do not change stays as it is. Progress is kept.
        </T>
      </Panel>
      {ids.length ? null : (
        <Group title="Who">
          <Loaded q={cohorts} what="cohorts" skeleton={<RowsSkeleton rows={2} />}>
            {() => <Pills label="Cohort" value={picked?.id ?? null} onChange={setCohort} options={list.map((x) => ({ id: x.id, name: x.name }))} testID="bulk-cohort" />}
          </Loaded>
          <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
            To pick single students, press and hold a name in People, tick the others, then choose Access.
          </T>
        </Group>
      )}
      <Group title="Access">
        <Pills label="Access" value={scope} onChange={(s: Scope) => setScope(s === scope ? null : s)} options={SCOPES.map((s) => ({ id: s.id, name: s.name }))} testID="bulk-scope" />
      </Group>
      <Group title="Sections to change">
        <Loaded q={sections} what="sections" skeleton={<RowsSkeleton rows={4} />}>
          {(all) => (
            <View style={{ gap: space[3] }}>
              {byGroup(all).map(([g, items]) => (
                <Panel key={g} rows>
                  {items.map((s) => (
                    <View key={s.key} style={{ gap: space[1], paddingVertical: space[2] }}>
                      <Pills
                        label={s.name}
                        value={s.key in change ? (change[s.key] ? "open" : "close") : "keep"}
                        onChange={(v: "keep" | "open" | "close") =>
                          setChange((c) => {
                            const next = { ...c };
                            if (v === "keep") delete next[s.key];
                            else next[s.key] = v === "open";
                            return next;
                          })
                        }
                        options={[{ id: "keep", name: "Keep" }, { id: "open", name: "Open" }, { id: "close", name: "Close" }]}
                        testID={`bulk-section-${s.key}`}
                      />
                    </View>
                  ))}
                </Panel>
              ))}
            </View>
          )}
        </Loaded>
      </Group>
      <Group title="Pause or resume sign-in">
        <Panel style={{ gap: space[3] }}>
          <Status tone="quiet">Paused students cannot sign in. Nothing is deleted.</Status>
          <Locked>
            <View style={{ flexDirection: "row", gap: space[2] }}>
              <View style={{ flex: 1 }}>
                <Button small kind="quiet" label="Pause all" disabled={!target} busy={busy === "pause"} onPress={() => setAsk("pause")} testID="bulk-pause" />
              </View>
              <View style={{ flex: 1 }}>
                <Button small kind="quiet" label="Resume all" disabled={!target} busy={busy === "resume"} onPress={() => setAsk("resume")} testID="bulk-resume" />
              </View>
            </View>
          </Locked>
        </Panel>
      </Group>
      <ConfirmSheet
        open={!!ask}
        onClose={() => setAsk(null)}
        title={ask === "pause" ? `Pause ${plural(n, "student")}?` : ask === "resume" ? `Resume ${plural(n, "student")}?` : `Change access for ${plural(n, "student")}?`}
        body={ask === "pause" ? "They are signed out and cannot sign in until you resume them." : ask === "resume" ? "They can sign in again with their own password." : `${who}. ${line}. It takes effect at once.`}
        confirm={ask === "pause" ? "Pause them" : ask === "resume" ? "Resume them" : "Apply"}
        danger={ask === "pause"}
        onConfirm={() => ask && go(ask)}
        testID="bulk-confirm"
      />
    </Screen>
  );
}
