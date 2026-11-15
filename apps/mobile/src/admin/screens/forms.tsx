import { router, useLocalSearchParams } from "expo-router";
import { Mail } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useForm, useForms, useRefreshAdmin } from "../api";
import type { FormResponse } from "../extra";
import { ago, plural } from "../format";
import { ActionBar, Check, Quiet, SelectRow, SmallButton, Status } from "../kit";
import { openStudent } from "../nav";
import { useAdminRole } from "../role";
import { ContactSheet } from "./people";

/** Forms: each form with how many answered. */
export function AdminFormsScreen() {
  const q = useForms();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen title="Forms" testID="admin-forms" onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} soon what="forms" skeleton={<RowsSkeleton rows={3} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((f) => (
                <Row key={f.id} testID={`form-${f.id}`} title={f.title} meta={`${plural(f.responses, "answer")} · updated ${ago(f.updatedAt).toLowerCase()}`} trailing={<Status tone={f.open ? "ok" : "quiet"}>{f.open ? "Open" : "Closed"}</Status>} onPress={() => router.push(`/admin/form/${f.id}`)} />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="sleepy" title="No forms yet" body="Make one on the website." />
          )
        }
      </Loaded>
    </Screen>
  );
}

/** One form: who answered and what they said; email one of them, some, or everyone. */
export function AdminFormScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useForm(String(id));
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [reading, setReading] = React.useState<FormResponse | null>(null);
  const [emailTo, setEmailTo] = React.useState<string[] | "all" | null>(null);
  const total = q.data?.respondents.length ?? 0;
  const footer = !canWrite || !total ? undefined : picked.size ? (
    <ActionBar count={picked.size} onClear={() => setPicked(new Set())} testID="form-bar">
      <SmallButton label={`Email ${picked.size}`} icon={<Mail size={18} color={c.ink} />} onPress={() => setEmailTo([...picked])} testID="form-email-some" />
    </ActionBar>
  ) : (
    <Button label={`Email all ${total}`} onPress={() => setEmailTo("all")} testID="form-email-all" />
  );
  return (
    <Screen testID="admin-form" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={footer}>
      <Loaded q={q} soon what="this form" skeleton={<RowsSkeleton rows={5} />}>
        {(f) => {
          const all = f.respondents.length > 0 && f.respondents.every((r) => picked.has(r.id));
          return (
            <>
              <View style={{ gap: space[2] }}>
                <T v="h1">{f.title}</T>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                  <Status tone={f.open ? "ok" : "quiet"}>{f.open ? "Open" : "Closed"}</Status>
                  <T v="small" tone="muted">
                    {plural(f.respondents.length, "answer")}
                  </T>
                </View>
              </View>
              {f.respondents.length ? (
                <View style={{ gap: space[1] }}>
                  {canWrite ? (
                    <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -space[2] }}>
                      <Check on={all} onPress={() => setPicked(all ? new Set() : new Set(f.respondents.map((r) => r.id)))} label="Select everyone" testID="form-all" />
                      <T v="small" tone="muted">
                        Everyone who answered
                      </T>
                    </View>
                  ) : null}
                  <View style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                    {f.respondents.map((r) => {
                      const line = <Row testID={`resp-${r.id}`} title={r.name} meta={`${ago(r.at)} · ${r.answers[0]?.a ?? ""}`} trailing={r.emailed ? <Status tone="ok">Emailed</Status> : undefined} onPress={() => setReading(r)} />;
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
                    {reading.answers.map((a) => (
                      <View key={a.q} style={{ gap: 2 }}>
                        <T v="caption" tone="muted">
                          {a.q}
                        </T>
                        <T>{a.a}</T>
                      </View>
                    ))}
                    {canWrite ? (
                      <Button
                        kind="quiet"
                        label={`Email ${reading.name.split(" ")[0]}`}
                        onPress={() => {
                          const who = reading.id;
                          setReading(null);
                          setEmailTo([who]);
                        }}
                        testID="response-email"
                      />
                    ) : null}
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
                count={emailTo === "all" ? f.respondents.length : (emailTo?.length ?? 0)}
                busy={busy === "email-form"}
                onSend={(subject, text) =>
                  void run("email-form", () => adminCalls.emailForm(f.id, { ids: emailTo ?? [], subject, text }), { done: (r) => `Sent ${r.sent}${r.failed ? `, ${r.failed} failed` : ""}` }).then((r) => {
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
