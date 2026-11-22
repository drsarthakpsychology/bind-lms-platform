import { CheckCircle2, Trash2, UserX } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { Button, Field, Row, RowList, RowsSkeleton, Sheet, T } from "@/ds";
import { space, useTheme, fonts } from "@/theme";
import { useAdminAction } from "../api";
import { Block, Loaded, Quiet, ScrollTabs, SearchBox, SmallButton, Status } from "../kit";
import { nameMatches, REMOVE_WORDS, removalCalls, ROLE_LABEL, STATE_LABEL, useRemoval, type RemovalPerson, type RemovalRequest } from "../remove";
import { useAdminRole } from "../role";
import { Locked, Screen } from "../ui";
import { ago, day } from "../format";

export type RemoveTarget = { id: string; name: string; confirmWord: string; state: RemovalPerson["state"]; requestId?: string | null };
type Step = "menu" | "remove" | "delete" | "restore";

function Lines({ title, items, keep }: { title: string; items: readonly string[]; keep?: boolean }) {
  const c = useTheme();
  if (!items.length) return null;
  return (
    <View style={{ gap: space[2] }}>
      <T v="caption" tone="muted" style={{ fontFamily: fonts.bold }}>
        {title}
      </T>
      {items.map((t) => (
        <View key={t} style={{ flexDirection: "row", gap: space[2], alignItems: "flex-start" }}>
          {keep ? <CheckCircle2 size={16} color={c.link} accessibilityElementsHidden /> : <T v="small" tone="muted">•</T>}
          <T v="small" style={{ flex: 1 }}>
            {t}
          </T>
        </View>
      ))}
    </View>
  );
}

function Choice({ icon, title, meta, onPress, danger, testID }: { icon: React.ReactNode; title: string; meta: string; onPress: () => void; danger?: boolean; testID: string }) {
  const c = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${meta}`} onPress={onPress} testID={testID} style={({ pressed }) => ({ flexDirection: "row", gap: space[3], alignItems: "flex-start", minHeight: 56, padding: space[3], borderRadius: 14, borderWidth: 1, borderColor: c.hairline, backgroundColor: pressed ? c.raised : c.card })}>
      {icon}
      <View style={{ flex: 1, gap: 2 }}>
        <T v="body" tone={danger ? "danger" : undefined} style={{ fontFamily: fonts.bold }}>
          {title}
        </T>
        <T v="small" tone="muted">
          {meta}
        </T>
      </View>
    </Pressable>
  );
}

/**
 * The one sheet for taking someone off VIBHA, in the app: the choice (Remove
 * access, the default; Delete account), then a confirm step that says what
 * happens and what is kept. Delete needs the name typed out. The server
 * checks every rule again.
 */
export function RemoveSheet({ target: given, open, onClose, start }: { target: RemoveTarget | null; open: boolean; onClose: () => void; start?: Step }) {
  const c = useTheme();
  // Keep the last person while the sheet slides away, so it closes instead of vanishing.
  const last = React.useRef<RemoveTarget | null>(given);
  if (given) last.current = given;
  const target = given ?? last.current;
  const first: Step = start ?? (target?.state === "removed" ? "restore" : "menu");
  const [step, setStep] = React.useState<Step>(first);
  const [note, setNote] = React.useState("");
  const [typed, setTyped] = React.useState("");
  const { run, busy } = useAdminAction();
  React.useEffect(() => {
    if (open) {
      setStep(first);
      setNote("");
      setTyped("");
    }
  }, [open, first]);
  if (!target) return null;
  const name = target.name;
  const words = step === "menu" ? null : REMOVE_WORDS[step];
  const title = step === "menu" ? `Remove ${name} from VIBHA` : step === "remove" ? `Remove ${name}'s access?` : step === "delete" ? `Delete ${name}'s account?` : `Restore ${name}'s access?`;
  const ok = step !== "delete" || nameMatches(typed, target.confirmWord);
  const go = async () => {
    const r =
      step === "remove"
        ? await run("lock", () => removalCalls.remove(target.id, note.trim()), { tag: "remove", done: `${name} no longer has access` })
        : step === "delete"
          ? await run("lock", () => removalCalls.delete(target.id, typed, target.requestId), { tag: "remove", done: `${name}'s account is deleted` })
          : await run("lock", () => removalCalls.restore(target.id), { tag: "remove", done: `${name} can sign in again` });
    if (r) onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title={title} testID="remove-sheet">
      <View style={{ gap: space[4] }}>
        {step === "menu" ? (
          <>
            <Choice icon={<UserX size={22} color={c.ink} />} title={REMOVE_WORDS.remove.title} meta={`${REMOVE_WORDS.remove.short}. Signs them out and keeps their records.`} onPress={() => setStep("remove")} testID="remove-pick-access" />
            <Choice icon={<Trash2 size={22} color={c.danger} />} danger title={REMOVE_WORDS.delete.title} meta={`${REMOVE_WORDS.delete.short}. Removes their sign-in and personal details.`} onPress={() => setStep("delete")} testID="remove-pick-delete" />
            <Button kind="text" full label="Cancel" onPress={onClose} />
          </>
        ) : words ? (
          <>
            <Lines title="This will" items={words.does} />
            <Lines title="Kept" items={words.keeps} keep />
            <T v="small" style={{ fontFamily: fonts.bold }}>
              {words.after}
            </T>
            {step === "remove" ? <Field label="Why? (only admins see this)" value={note} onChangeText={setNote} maxLength={200} placeholder="For example: left the course" testID="remove-note" /> : null}
            {step === "delete" ? <Field label={`Type ${target.confirmWord} to confirm`} value={typed} onChangeText={setTyped} autoCapitalize="none" autoCorrect={false} testID="remove-typed" /> : null}
            <Button kind={step === "restore" ? "primary" : "danger"} label={step === "remove" ? "Remove access" : step === "delete" ? "Delete account for good" : "Restore access"} busy={busy === "remove"} disabled={!ok} onPress={() => void go()} testID="remove-confirm" />
            <Button kind="text" full label={start || target.state === "removed" ? "Cancel" : "Back"} onPress={() => (start || target.state === "removed" ? onClose() : setStep("menu"))} />
          </>
        ) : null}
      </View>
    </Sheet>
  );
}

/** On a student's page (Access tab): the way off VIBHA, or back on. Reads the same list as Remove people, so the word to type and the state are the server's. */
export function RemoveBlock({ id, name }: { id: string; name: string }) {
  const q = useRemoval();
  const [open, setOpen] = React.useState<Step | null>(null);
  const p = q.data?.people.find((x) => x.id === id);
  const removed = p?.state === "removed";
  return (
    <Block title="Remove from VIBHA" testID="remove-block">
      <T v="small" tone="muted">
        {removed ? "They were removed. Restore them, or delete the account for good." : "Remove access can be undone. Delete account is permanent."}
      </T>
      {p ? (
        <Locked>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
            {removed ? <SmallButton label="Restore access" onPress={() => setOpen("restore")} testID="remove-restore" /> : <SmallButton label="Remove from VIBHA" danger onPress={() => setOpen("menu")} testID="remove-open" />}
            {removed ? <SmallButton label="Delete account" danger onPress={() => setOpen("delete")} testID="remove-delete" /> : null}
          </View>
        </Locked>
      ) : q.isLoading ? null : (
        <Quiet>Could not load this right now. Pull down to try again.</Quiet>
      )}
      <RemoveSheet target={p ? { id, name: p.name || name, confirmWord: p.confirmWord, state: p.state } : null} open={open !== null} start={open ?? undefined} onClose={() => setOpen(null)} />
    </Block>
  );
}

function PersonLine({ p, canWrite, onPick }: { p: RemovalPerson; canWrite: boolean; onPick: (p: RemovalPerson, step?: Step) => void }) {
  const locked = p.isYou || p.role === "admin";
  const meta = [ROLE_LABEL[p.role], p.rollNumber, p.email].filter(Boolean).join(" · ");
  return (
    <Row
      testID={`remove-row-${p.id}`}
      title={p.isYou ? `${p.name} (you)` : p.name}
      meta={p.state === "removed" ? `${meta}${p.removedAt ? ` · removed ${ago(p.removedAt).toLowerCase()}` : ""}${p.note ? ` · ${p.note}` : ""}` : meta}
      trailing={<Status tone={p.state === "removed" ? "alert" : p.state === "locked" ? "warn" : "ok"}>{STATE_LABEL[p.state]}</Status>}
      chevron={canWrite && !locked}
      onPress={canWrite && !locked ? () => onPick(p) : undefined}
    />
  );
}

function RequestLine({ r, canWrite, onDelete }: { r: RemovalRequest; canWrite: boolean; onDelete: (r: RemovalRequest) => void }) {
  const { run, busy } = useAdminAction();
  return (
    <View style={{ gap: space[2], paddingVertical: space[3] }} testID={`request-${r.id}`}>
      <T v="body" style={{ fontFamily: fonts.bold }}>
        {r.name}
      </T>
      <T v="small" tone="muted">
        Asked {day(r.createdAt)}
        {r.email ? ` · ${r.email}` : ""}
      </T>
      {r.reason ? <T v="small">“{r.reason}”</T> : null}
      {r.status !== "open" ? (
        <T v="small" tone="muted">
          {r.status === "done" ? "Account deleted" : "Declined"}
          {r.handledAt ? ` ${day(r.handledAt)}` : ""}
        </T>
      ) : canWrite ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {r.accountGone ? null : <SmallButton label="Approve and delete" danger onPress={() => onDelete(r)} testID={`request-approve-${r.id}`} />}
          <SmallButton label="Decline" busy={busy === "decline"} onPress={() => void run("lock", () => removalCalls.decline(r.id), { tag: "decline", done: "Request declined. The account stays." })} testID={`request-decline-${r.id}`} />
        </View>
      ) : null}
    </View>
  );
}

type View3 = "requests" | "everyone" | "removed";

/** More > Remove people: everyone (students and staff), who was removed, and the app's deletion requests. */
export function RemovePeopleScreen() {
  const q = useRemoval();
  const { canWrite } = useAdminRole();
  const [view, setView] = React.useState<View3 | null>(null);
  const [search, setSearch] = React.useState("");
  const [pick, setPick] = React.useState<{ t: RemoveTarget; step?: Step } | null>(null);
  const lastStep = React.useRef<Step | undefined>(undefined);
  if (pick) lastStep.current = pick.step;
  return (
    <Screen title="Remove people" lead="Take someone off VIBHA. Remove access can be undone. Delete account is permanent." testID="admin-remove" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="people" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => {
          const open = d.requests.filter((r) => r.status === "open");
          const removed = d.people.filter((p) => p.state === "removed");
          const v: View3 = view ?? (open.length ? "requests" : "everyone");
          const s = search.trim().toLowerCase();
          const list = (v === "removed" ? removed : d.people).filter((p) => !s || `${p.name} ${p.email ?? ""} ${p.rollNumber ?? ""}`.toLowerCase().includes(s));
          const write = canWrite && d.canWrite;
          return (
            <>
              <ScrollTabs
                tabs={[
                  { id: "requests" as const, name: `Asked to delete${open.length ? ` (${open.length})` : ""}` },
                  { id: "everyone" as const, name: "Everyone" },
                  { id: "removed" as const, name: `Removed${removed.length ? ` (${removed.length})` : ""}` },
                ]}
                value={v}
                onChange={setView}
              />
              {v === "requests" ? (
                <View style={{ gap: space[2] }}>
                  <T v="small" tone="muted">
                    People who asked, from the app, for their account to be deleted. Approve to delete it, or decline to keep it.
                  </T>
                  {!d.requestsReady ? (
                    <Quiet>Requests are not stored yet. Each one still reaches you as a notification.</Quiet>
                  ) : d.requests.length ? (
                    d.requests.map((r) => <RequestLine key={r.id} r={r} canWrite={write} onDelete={(x) => setPick({ t: { id: x.userId, name: x.name, confirmWord: x.confirmWord, state: "active", requestId: x.id }, step: "delete" })} />)
                  ) : (
                    <Quiet>No one has asked.</Quiet>
                  )}
                </View>
              ) : (
                <View style={{ gap: space[3] }}>
                  <SearchBox value={search} onChange={setSearch} placeholder="Name, email or roll number" label="Search people" testID="remove-search" />
                  {list.length ? (
                    <RowList>
                      {list.map((p) => (
                        <PersonLine key={p.id} p={p} canWrite={write} onPick={(x, step) => setPick({ t: { id: x.id, name: x.name, confirmWord: x.confirmWord, state: x.state }, step })} />
                      ))}
                    </RowList>
                  ) : (
                    <Quiet>{v === "removed" ? "No one is removed." : "No one matches."}</Quiet>
                  )}
                  <T v="caption" tone="muted">
                    A Super Admin cannot be removed here. Change them to a View Admin first, in Admins.
                  </T>
                </View>
              )}
            </>
          );
        }}
      </Loaded>
      <RemoveSheet target={pick?.t ?? null} open={!!pick} start={pick?.step ?? lastStep.current} onClose={() => setPick(null)} />
    </Screen>
  );
}

