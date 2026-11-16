import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Button, Chips, EmptyState, Field, LoadError, ProgressLine, Row, RowList, Screen, SwitchRow, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useCertDrawing, useCohorts, useStudents, useStudioOptions } from "../api";
import { CertPreviewBlock } from "../cert-drawing";
import { CERT_KINDS, KIND_DEFAULTS, type CertKind, type IssueResult } from "../extra";
import { day, plural, todayIst } from "../format";
import { DateField } from "../date-field";
import { Facts, Notice, OptionRow, SearchBox, SelectRow } from "../kit";
import { useAdminRole } from "../role";
import { draftError, emptyDraft, STEPS, stepError, toIssueInput, withKind, type Draft } from "../studio";

function PickPeople({ d, set }: { d: Draft; set: (p: Partial<Draft>) => void }) {
  const [mode, setMode] = React.useState<"students" | "cohort">(d.cohortId ? "cohort" : "students");
  const [search, setSearch] = React.useState("");
  const students = useStudents();
  const cohorts = useCohorts();
  const members = useStudents({ cohort: d.cohortId ?? "__none__" });
  const picked = new Set(d.recipients.map((r) => r.userId));
  const n = search.trim().toLowerCase();
  const list = (students.data?.items ?? []).filter((r) => !n || `${r.name} ${r.rollNumber ?? ""}`.toLowerCase().includes(n));
  // A whole cohort: take its members once they load.
  const memberIds = (members.data?.items ?? []).map((r) => r.id).join(",");
  React.useEffect(() => {
    if (mode !== "cohort" || !d.cohortId || !members.data) return;
    set({ recipients: members.data.items.map((r) => ({ userId: r.id, name: r.name })) });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the cohort's members change
  }, [mode, d.cohortId, memberIds]);
  return (
    <View style={{ gap: space[4] }}>
      <Chips
        label="Who"
        value={mode}
        onChange={(m) => {
          setMode(m);
          set({ cohortId: null, recipients: [] });
        }}
        options={[
          { id: "students" as const, name: "Pick students" },
          { id: "cohort" as const, name: "A whole cohort" },
        ]}
      />
      {mode === "cohort" ? (
        <View accessibilityRole="radiogroup">
          {(cohorts.data?.items ?? [])
            .filter((x) => x.members > 0)
            .map((x) => (
              <OptionRow key={x.id} label={x.name} meta={plural(x.members, "student")} on={d.cohortId === x.id} onPress={() => set({ cohortId: x.id })} testID={`issue-cohort-${x.id}`} />
            ))}
        </View>
      ) : (
        <>
          <View style={{ flexDirection: "row" }}>
            <SearchBox value={search} onChange={setSearch} placeholder="Name or roll number" label="Search students" testID="issue-search" />
          </View>
          <View>
            {list.map((r) => (
              <SelectRow key={r.id} on={picked.has(r.id)} label={`Pick ${r.name}`} testID={`issue-pick-${r.id}`} onToggle={() => set({ recipients: picked.has(r.id) ? d.recipients.filter((x) => x.userId !== r.id) : [...d.recipients, { userId: r.id, name: r.name }] })}>
                <Row title={r.name} meta={[r.rollNumber, r.cohorts.map((c) => c.name).join(", ")].filter(Boolean).join(" · ")} />
              </SelectRow>
            ))}
          </View>
        </>
      )}
      <T v="small" tone="muted" num accessibilityLiveRegion="polite" testID="issue-count">
        {d.recipients.length ? `${plural(d.recipients.length, "certificate")} to issue` : "Nobody picked yet"}
      </T>
    </View>
  );
}

function Wording({ d, set }: { d: Draft; set: (p: Partial<Draft>) => void }) {
  const def = KIND_DEFAULTS[d.kind ?? "completion"];
  const sigs = d.signatories.length ? d.signatories : [{ name: "", role: "" }];
  const images = useStudioOptions().data?.signatures ?? [];
  return (
    <View style={{ gap: space[4] }}>
      <Field label="Title" placeholder={def.titleHint} value={d.title} onChangeText={(title) => set({ title })} maxLength={120} testID="issue-title" />
      <Field label="Line at the top" value={d.heading} onChangeText={(heading) => set({ heading })} maxLength={80} />
      <Field label="Line above the name" value={d.lead} onChangeText={(lead) => set({ lead })} maxLength={80} />
      <Field label="Line under the name" value={d.connector} onChangeText={(connector) => set({ connector })} maxLength={80} />
      <DateField label="Issue date" value={d.issuedOn} onChange={(issuedOn) => set({ issuedOn })} testID="issue-date" />
      <DateField label="Runs out on" value={d.expiresOn} onChange={(expiresOn) => set({ expiresOn })} min={d.issuedOn || undefined} optional={def.needsExpiry ? undefined : "Never"} testID="issue-expiry" />
      {sigs.map((s, i) => (
        <View key={i} style={{ gap: space[3] }}>
          <Field label={`Signed by${sigs.length > 1 ? ` (${i + 1})` : ""}`} value={s.name} onChangeText={(name) => set({ signatories: sigs.map((x, j) => (j === i ? { ...x, name } : x)) })} maxLength={60} testID={`issue-sig-${i}`} />
          <Field label="Their role" value={s.role} onChangeText={(role) => set({ signatories: sigs.map((x, j) => (j === i ? { ...x, role } : x)) })} maxLength={60} />
          {images.length ? <Chips label="Signature" value={s.signatureFrom ?? ""} onChange={(v) => set({ signatories: sigs.map((x, j) => (j === i ? { ...x, signatureFrom: v || null } : x)) })} options={[{ id: "", name: "None" }, ...images.map((g) => ({ id: g.id, name: g.label }))]} /> : null}
        </View>
      ))}
      <View style={{ flexDirection: "row", gap: space[4] }}>
        {sigs.length < 3 ? <Button kind="text" label="Add someone who signs" onPress={() => set({ signatories: [...sigs, { name: "", role: "" }] })} /> : null}
        {sigs.length > 1 ? <Button kind="danger" label="Remove the last" onPress={() => set({ signatories: sigs.slice(0, -1) })} /> : null}
      </View>
    </View>
  );
}

/** The server's own drawing of the certificate, one person at a time, with what still stops it. */
function Preview({ d }: { d: Draft }) {
  const c = useTheme();
  const [i, setI] = React.useState(0);
  const at = Math.min(i, Math.max(0, d.recipients.length - 1));
  const who = d.recipients[at];
  const body = React.useMemo(() => toIssueInput(d), [d]);
  const q = useCertDrawing(body, at);
  const nav = (dir: -1 | 1) => {
    haptic.select();
    setI((x) => Math.max(0, Math.min(d.recipients.length - 1, x + dir)));
  };
  return (
    <View style={{ gap: space[3] }}>
      {q.error && !q.data ? (
        <LoadError what="the preview" error={q.error} onRetry={() => void q.refetch()} />
      ) : (
        <CertPreviewBlock drawing={q.data} loading={q.isFetching} label={`Certificate for ${who?.name ?? "the student"}: ${d.title || "no title yet"}`} />
      )}
      {d.recipients.length > 1 ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Previous person" disabled={at === 0} onPress={() => nav(-1)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center", opacity: at === 0 ? 0.3 : 1 }}>
            <ChevronLeft size={22} color={c.ink} />
          </Pressable>
          <T v="small" tone="muted" num accessibilityLiveRegion="polite">
            {who?.name ?? ""} · {at + 1} of {d.recipients.length}
          </T>
          <Pressable accessibilityRole="button" accessibilityLabel="Next person" disabled={at >= d.recipients.length - 1} onPress={() => nav(1)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center", opacity: at >= d.recipients.length - 1 ? 0.3 : 1 }}>
            <ChevronRight size={22} color={c.ink} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

/** Issue certificates as five short steps: type, people, wording, preview, send. */
export function AdminIssueScreen() {
  const params = useLocalSearchParams<{ kind?: string; to?: string; replaces?: string; title?: string }>();
  const replaces = params.replaces ? String(params.replaces) : null;
  const today = todayIst();
  const options = useStudioOptions();
  const students = useStudents();
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [step, setStep] = React.useState(0);
  const [d, setD] = React.useState<Draft>(() => {
    const base = { ...emptyDraft(today), title: params.title ? String(params.title) : "" };
    return params.kind && (CERT_KINDS as readonly string[]).includes(params.kind) ? withKind(base, params.kind as CertKind) : base;
  });
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<IssueResult | null>(null);
  const set = React.useCallback((p: Partial<Draft>) => setD((x) => ({ ...x, ...p })), []);

  // Fill in the saved signatory, and the student this was opened for, once they load.
  const [filled, setFilled] = React.useState({ sig: false, to: false });
  if (!filled.sig && options.data) {
    setFilled((f) => ({ ...f, sig: true }));
    if (!d.signatories.some((s) => s.name.trim())) set({ signatories: options.data.signatories, email: options.data.emailReady });
  }
  if (!filled.to && params.to && students.data) {
    setFilled((f) => ({ ...f, to: true }));
    const r = students.data.items.find((x) => x.id === params.to);
    if (r) set({ recipients: [{ userId: r.id, name: r.name }] });
  }

  if (!canWrite) {
    return (
      <Screen testID="issue">
        <EmptyState mood="locked" title="View-only access" body="Only a Super Admin can issue certificates." action={{ label: "Back", onPress: () => router.back() }} />
      </Screen>
    );
  }

  if (done) {
    return (
      <Screen testID="issue-done" footer={<Button label="Done" onPress={() => router.back()} testID="issue-finish" />}>
        <EmptyState mood="win" title={replaces ? "Corrected and issued again" : `${plural(done.issued, "certificate")} issued`} body={done.queued ? `Emails are going out now (${done.queued}). Each student also sees it in the app.` : "Each student sees it in the app now."} />
        <RowList>
          {done.ids.slice(0, 8).map((id, i) => (
            <Row key={id} title={d.recipients[i]?.name ?? id} meta={id} />
          ))}
        </RowList>
      </Screen>
    );
  }

  const next = async () => {
    const e = stepError(step, d, today);
    if (e) {
      haptic.warn();
      return setError(e);
    }
    setError(null);
    if (step < STEPS.length - 1) {
      haptic.select();
      return setStep(step + 1);
    }
    const bad = draftError(d, today);
    if (bad) {
      setStep(bad.step);
      return setError(bad.error);
    }
    const r = await run("issue-certificate", () => adminCalls.issue(toIssueInput(d), replaces));
    if (r) setDone(r);
  };
  const back = () => {
    setError(null);
    if (step === 0) router.back();
    else setStep(step - 1);
  };
  const last = step === STEPS.length - 1;
  const def = d.kind ? KIND_DEFAULTS[d.kind] : null;

  return (
    <Screen
      testID="issue"
      gap={space[5]}
      footer={
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <Button kind="text" label={step === 0 ? "Cancel" : "Back"} onPress={back} testID="issue-back" />
          <View style={{ flex: 1 }}>
            <Button label={last ? `Issue ${plural(d.recipients.length, "certificate")}` : "Next"} busy={busy === "issue-certificate"} onPress={() => void next()} testID="issue-next" />
          </View>
        </View>
      }
    >
      <View style={{ gap: space[3] }}>
        <T v="small" tone="muted" num testID="issue-step">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </T>
        {replaces ? (
          <Notice testID="issue-replaces">{`This corrects ${replaces}. The old one is revoked and points to the new one.`}</Notice>
        ) : null}
        <ProgressLine value={((step + 1) / STEPS.length) * 100} label={`Step ${step + 1} of ${STEPS.length}`} height={4} />
        <T v="h1">{["What kind of certificate?", "Who gets it?", "What it says", "Check it", "Send"][step]}</T>
      </View>
      {step === 0 ? (
        <View accessibilityRole="radiogroup">
          {CERT_KINDS.map((k) => (
            <OptionRow key={k} label={KIND_DEFAULTS[k].label} meta={KIND_DEFAULTS[k].about} on={d.kind === k} onPress={() => setD((x) => withKind(x, k))} testID={`kind-${k}`} />
          ))}
        </View>
      ) : step === 1 ? (
        <PickPeople d={d} set={set} />
      ) : step === 2 ? (
        <Wording d={d} set={set} />
      ) : step === 3 ? (
        <Preview d={d} />
      ) : (
        <View style={{ gap: space[4] }}>
          <Facts
            items={[
              { label: "Type", value: def?.label ?? "" },
              { label: "Students", value: String(d.recipients.length) },
              { label: "Title", value: d.title },
              { label: "Issued on", value: day(d.issuedOn) },
              { label: "Runs out", value: d.expiresOn ? day(d.expiresOn) : "Never" },
              { label: "Signed by", value: d.signatories.filter((s) => s.name.trim()).map((s) => s.name).join(", ") },
            ]}
          />
          <SwitchRow title="Email each student a copy" meta="They always see it in the app" value={d.email} onChange={(email) => set({ email })} testID="issue-email" />
          <T v="small" tone="muted">
            Each one gets its own number and a check page. You can revoke or issue a corrected one later.
          </T>
        </View>
      )}
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="issue-error">
          {error}
        </T>
      ) : null}
    </Screen>
  );
}
