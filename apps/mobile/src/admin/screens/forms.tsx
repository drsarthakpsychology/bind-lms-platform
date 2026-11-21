import { router, useLocalSearchParams } from "expo-router";
import { Mail } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Row, RowList, RowsSkeleton, Sheet, T } from "@/ds";
import { EmptyState, Screen, Locked } from "../ui";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useForm, useForms, useRefreshAdmin } from "../api";
import type { FormResponse } from "../extra";
import { ago, plural } from "../format";
import { ActionBar, Check, FilterChips, Loaded, Notice, Quiet, SelectRow, SmallButton, Status, SwipeRow } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole } from "../role";
import { ContactSheet } from "./people";

/** Forms: each form with how many answered. */
export function AdminFormsScreen() {
  const q = useForms();
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen title="Forms" testID="admin-forms" onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} soon what="forms" skeleton={<RowsSkeleton rows={3} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((f) => (
                <SwipeRow key={f.id} enabled={canWrite && f.responses > 0} action={{ label: "Email all", onPress: () => router.push(`/admin/form/${f.id}?email=all` as never) }} testID={`swipe-form-${f.id}`}>
                  <Row testID={`form-${f.id}`} title={f.title} meta={[plural(f.responses, "answer"), f.updatedAt ? `last ${ago(f.updatedAt).toLowerCase()}` : ""].filter(Boolean).join(" · ")} trailing={<Status tone={f.open ? "ok" : "quiet"}>{f.open ? "Open" : "Closed"}</Status>} onPress={() => router.push(`/admin/form/${f.id}`)} />
                </SwipeRow>
              ))}
            </RowList>
          ) : (
            <EmptyState mood="empty" title="No forms yet" body="Make one on the website." />
          )
        }
      </Loaded>
    </Screen>
  );
}

/** One form: who answered and what they said; email one of them, some, or everyone. */
export function AdminFormScreen() {
  const c = useTheme();
  const { id = "", email } = useLocalSearchParams<{ id: string; email?: string }>();
  const [emailed, setEmailed] = React.useState<"" | "yes" | "no">("");
  const q = useForm(String(id), emailed);
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [reading, setReading] = React.useState<FormResponse | null>(null);
  const [emailTo, setEmailTo] = React.useState<string[] | "all" | null>(email === "all" ? "all" : null);
  const total = q.data?.responses ?? q.data?.respondents.length ?? 0;
  const shownCount = q.data?.respondents.length ?? 0;
  const footer = !canWrite || !total ? undefined : picked.size ? (
    <ActionBar count={picked.size} onClear={() => setPicked(new Set())} testID="form-bar" noun="answers">
      <SmallButton label={`Email ${picked.size}`} icon={<Mail size={18} color={c.ink} />} onPress={() => setEmailTo([...picked])} testID="form-email-some" />
    </ActionBar>
  ) : (
    <Button label={emailed ? `Email these ${shownCount}` : `Email all ${total}`} onPress={() => setEmailTo(emailed ? (q.data?.respondents.map((r) => r.id) ?? []) : "all")} testID="form-email-all" />
  );
  return (
    <Screen title={q.data?.title ?? "Form"} testID="admin-form" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={footer}>
      <Loaded q={q} soon what="this form" skeleton={<RowsSkeleton rows={5} />}>
        {(f) => {
          const all = f.respondents.length > 0 && f.respondents.every((r) => picked.has(r.id));
          return (
            <>
              <View style={{ gap: space[2] }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                  <Status tone={f.open ? "ok" : "quiet"}>{f.open ? "Open" : "Closed"}</Status>
                  <T v="small" tone="muted">
                    {plural(f.responses, "answer")}
                  </T>
                </View>
              </View>
              <FilterChips
                label="Show"
                value={emailed}
                onChange={(v) => {
                  setEmailed(v);
                  setPicked(new Set());
                }}
                options={[
                  { id: "" as const, name: "Everyone" },
                  { id: "no" as const, name: "Not emailed" },
                  { id: "yes" as const, name: "Emailed" },
                ]}
                testID="form-show"
              />
              {f.waiting ? <Locked><Notice testID="form-waiting" action={<SmallButton label="Send now" busy={busy === "send-waiting"} onPress={() => void run("send-waiting", () => adminCalls.sendWaitingForm(f.id), { done: (r) => `Sent ${r.sent}${r.left ? `, ${r.left} still waiting` : ""}` })} />}>
                  {`${plural(f.waiting, "email")} from this form waiting for today's allowance.`}
                </Notice></Locked> : null}
              {f.respondents.length ? (
                <View style={{ gap: space[1] }}>
                  <Locked><View style={{ flexDirection: "row", alignItems: "center", marginLeft: -space[2] }}>
                      <Check on={all} onPress={() => setPicked(all ? new Set() : new Set(f.respondents.map((r) => r.id)))} label="Select everyone" testID="form-all" />
                      <T v="small" tone="muted">
                        Everyone who answered
                      </T>
                    </View></Locked>
                  <View style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                    {f.respondents.map((r) => {
                      const line = <Row testID={`resp-${r.id}`} title={r.name} meta={[r.when ?? ago(r.at), r.answers[0]?.a].filter(Boolean).join(" · ")} trailing={r.emailed ? <Status tone="ok">Emailed</Status> : r.emailWaiting ? <Status tone="warn">Waiting</Status> : undefined} onPress={() => setReading(r)} />;
                      return (
                        <View key={r.id} style={{ borderBottomWidth: 1, borderColor: c.hairline }}>
                          {canWrite ? (
                            <SelectRow
                              on={picked.has(r.id)}
                              label={`Select ${r.name}`}
                              onToggle={() =>
                                setPicked((s) => {
                                  const n = new Set(s);
                                  if (n.has(r.id)) n.delete(r.id);
                                  else n.add(r.id);
                                  return n;
                                })
                              }
                            >
                              {line}
                            </SelectRow>
                          ) : (
                            line
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <Quiet>Nobody has answered yet.</Quiet>
              )}
              <Sheet open={!!reading} onClose={() => setReading(null)} title={reading?.name} testID="response-sheet">
                {reading ? (
                  <View style={{ gap: space[4] }}>
                    <T v="small" tone="muted">
                      {reading.email} · {ago(reading.at)}
                    </T>
                    {reading.answers.map((a, i) => (
                      <View key={`${i}-${a.q}`} style={{ gap: 2 }}>
                        <T v="caption" tone="muted">
                          {a.q}
                        </T>
                        <T>{a.a}</T>
                      </View>
                    ))}
                    <Locked><Button
                        kind="quiet"
                        label={`Email ${reading.name.split(" ")[0]}`}
                        onPress={() => {
                          const who = reading.id;
                          setReading(null);
                          setEmailTo([who]);
                        }}
                        testID="response-email"
                      /></Locked>
                    {reading.studentId ? (
                      <Button
                        kind="text"
                        full
                        label="Open their page"
                        onPress={() => {
                          const sid = reading.studentId!;
                          setReading(null);
                          openStudent(sid);
                        }}
                      />
                    ) : null}
                  </View>
                ) : null}
              </Sheet>
              <ContactSheet
                open={emailTo !== null}
                onClose={() => setEmailTo(null)}
                count={emailTo === "all" ? f.responses : (emailTo?.length ?? 0)}
                busy={busy === "email-form"}
                mergeFields={f.mergeFields}
                allowance={f.allowance}
                preview={(subject, text) => {
                  const who = emailTo === "all" || !emailTo?.length ? f.respondents[0]?.id : emailTo[0];
                  return adminCalls.previewFormEmail(f.id, who ?? "", subject, text);
                }}
                onSend={(subject, text) =>
                  void run("email-form", () => adminCalls.emailForm(f.id, { ids: emailTo ?? [], subject, text }), { done: (r) => [`Sent ${r.sent}`, r.queued ? `${r.queued} wait for tomorrow` : "", r.failed ? `${r.failed} failed` : "", r.noEmail ? `${r.noEmail} had no email` : ""].filter(Boolean).join(", ") }).then((r) => {
                    if (r) {
                      setEmailTo(null);
                      setPicked(new Set());
                    }
                  })
                }
              />
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
