import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowRight, Award, Flame, Medal } from "lucide-react-native";
import * as React from "react";
import { openLink } from "@/lib/open";
import { Share, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import type { BadgeProgress, CertificatePdfLink, Credential } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { useAchievements } from "@/api/queries";
import { api } from "@/auth";
import { Button, Jyo, Label, ProgressLine, QuietEmpty, Row, Screen, Sheet, Stone, T } from "@/ds";
import { toast } from "@/ds/toast";
import { Confetti, Enter, presets, Press, staggerDelay, useNewWins } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { Group, HubSkeleton, IconPatch, Load } from "./parts";

export function issued(iso: string | null): string {
  const t = iso ? Date.parse(iso) : NaN;
  // A date the phone cannot read shows nothing (never "Invalid Date").
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}

export async function downloadCertificate(id: string): Promise<void> {
  try {
    const link = await api.get<CertificatePdfLink>(`/achievements/${encodeURIComponent(id)}/pdf`);
    await openLink(link.url);
  } catch (e) {
    toast.show(messageOf(e));
  }
}

export async function shareCertificate(c: Credential): Promise<void> {
  if (!c.verifyUrl) return;
  await Share.share({
    message: `${c.title}, from VIBHA School of Psychology. Check it here: ${c.verifyUrl}`,
    url: c.verifyUrl,
  }).catch(() => undefined);
}

export function Badge({ b, i, onPress }: { b: Credential | BadgeProgress; i: number; onPress: () => void }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const earned = "credentialId" in b || b.earned;
  const Icon = b.icon === "flame" ? Flame : Medal;
  return (
    <Animated.View entering={reduce ? undefined : presets.pop(staggerDelay(i, 120))} style={{ width: "33.33%" }}>
      <Press
        accessibilityRole="button"
        accessibilityLabel={`${b.title}${earned ? "" : ", not earned yet"}`}
        onPress={onPress}
        scale={0.92}
        innerStyle={{
          alignItems: "center",
          gap: space[2],
          paddingVertical: space[3],
          minHeight: layout.target,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: earned ? (b.tone === "lime" ? c.lime : c.areas.me.wash) : c.tint,
          }}
        >
          <Icon size={26} color={earned ? (b.tone === "lime" ? c.onLime : c.areas.me.deep) : c.muted} />
        </View>
        <T v="caption" center tone={earned ? "ink" : "muted"} style={{ paddingHorizontal: space[1] }}>
          {b.title}
        </T>
      </Press>
    </Animated.View>
  );
}

/** "2 of 4" gives 50; anything else gives null. */
export function progressPct(text: string): number | null {
  const m = /^(\d+)\s*(?:of|\/)\s*(\d+)/.exec(text);
  return m && Number(m[2]) > 0 ? (Number(m[1]) / Number(m[2])) * 100 : null;
}

/**
 * Certificates and badges, in the Layers look. Earned certificates are stones
 * that grow into the certificate; what is still to earn shows a line that
 * fills; badges sit in a grid on one stone. A newly earned badge gets
 * confetti, once per phone (a new certificate has its own full-screen moment,
 * src/moments).
 */
export function CertificatesScreen() {
  const c = useTheme();
  const q = useAchievements();
  const { show } = useLocalSearchParams<{ show?: string }>();
  const badgesOnly = show === "badges";
  const [badge, setBadge] = React.useState<Credential | BadgeProgress | null>(null);
  const close = React.useCallback(() => setBadge(null), []);
  const won = q.data ? q.data.earned.filter((x) => x.type === "badge").map((x) => x.credentialId) : null;
  const fire = useNewWins("achievements", won);
  const earnedCerts = q.data?.earned.filter((x) => x.type === "certificate" && x.status !== "draft").length ?? 0;
  const earnedBadges = q.data?.earned.filter((x) => x.type === "badge").length ?? 0;
  const lead = q.data ? `${earnedCerts} certificate${earnedCerts === 1 ? "" : "s"} and ${earnedBadges} badge${earnedBadges === 1 ? "" : "s"} earned` : undefined;
  return (
    <View style={{ flex: 1 }}>
      <Screen testID="certificates" title={badgesOnly ? "Badges" : "Certificates"} lead={lead} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <Stack.Screen options={{ title: "" }} />
        <Load q={q} what="your certificates" skeleton={<HubSkeleton />}>
          {(a) => {
            const certs = a.earned.filter((x) => x.type === "certificate" && x.status !== "draft");
            const badges = a.earned.filter((x) => x.type === "badge");
            const certsToEarn = a.progress.filter((x) => !x.earned && x.type === "certificate");
            const badgesToEarn = a.progress.filter((x) => !x.earned && x.type === "badge");
            return (
              <View style={{ gap: space[5] }}>
                {badgesOnly ? null : certs.length ? (
                  <View style={{ gap: space[3] }}>
                    <Label>Earned</Label>
                    {certs.map((x, i) => (
                      <Enter key={x.credentialId} i={i}>
                        <Stone grow={() => router.push(`/certificate/${encodeURIComponent(x.credentialId)}`)} testID={`cert-${x.credentialId}`} accessibilityLabel={`${x.title}. ${x.status === "revoked" ? "Withdrawn" : `Issued ${issued(x.issuedAt)}`}. Open it`}>
                          <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
                            <IconPatch icon={Award} area="me" size={48} />
                            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                              <T v="h3">{x.title}</T>
                              <T v="small" tone="muted">
                                {x.status === "revoked" ? "Withdrawn" : `Issued ${issued(x.issuedAt)}`}
                              </T>
                            </View>
                            <ArrowRight size={20} color={c.muted} />
                          </View>
                        </Stone>
                      </Enter>
                    ))}
                  </View>
                ) : (
                  <QuietEmpty testID="certs-empty" title="No certificates yet" body="Finish a module and pass its test to earn your first one." art={<Jyo pose="resting" size={56} />} action={{ label: "Open your modules", onPress: () => router.push("/study") }} />
                )}

                {!badgesOnly && certsToEarn.length ? (
                  <View style={{ gap: space[3] }}>
                    <Label>Next to earn</Label>
                    {certsToEarn.map((p) => {
                      const pct = progressPct(p.progress);
                      return (
                        <Stone quiet key={p.id} onPress={() => setBadge(p)} testID={`cert-next-${p.id}`} accessibilityLabel={`${p.title}. ${p.progress}`}>
                          <View style={{ gap: space[3] }}>
                            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: space[3] }}>
                              <T v="bodyStrong" style={{ flex: 1 }}>
                                {p.title}
                              </T>
                              <T v="small" tone="muted" num>
                                {p.progress}
                              </T>
                            </View>
                            {pct !== null ? <ProgressLine value={pct} height={8} label={`${p.title}: ${p.progress}`} /> : null}
                          </View>
                        </Stone>
                      );
                    })}
                  </View>
                ) : null}

                <View style={{ gap: space[3] }}>
                  <Label>Badges</Label>
                  {badges.length ? (
                    <Stone pad={space[2]}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }} testID="cert-badges">
                        {badges.map((b, i) => (
                          <Badge key={b.credentialId} b={b} i={i} onPress={() => setBadge(b)} />
                        ))}
                      </View>
                    </Stone>
                  ) : (
                    <QuietEmpty testID="badges-empty" title="No badges yet" body="Badges come from studying, practising and finishing lectures." />
                  )}
                </View>

                {badgesToEarn.length ? (
                  <Group title="Badges still to earn">
                    {badgesToEarn.map((p) => (
                      <Row key={p.id} title={p.title} meta={p.description ?? undefined} trailing={p.progress} onPress={() => setBadge(p)} chevron={false} />
                    ))}
                  </Group>
                ) : null}

                <Sheet open={!!badge} onClose={close} title={badge?.title}>
                  <View style={{ gap: space[3] }}>
                    {badge?.description ? <T tone="muted">{badge.description}</T> : null}
                    {badge && "credentialId" in badge ? (
                      <T v="small" tone="muted">
                        Earned {issued(badge.issuedAt)}
                      </T>
                    ) : badge && "progress" in badge ? (
                      <T v="small" tone="muted">
                        {badge.progress}
                      </T>
                    ) : null}
                    <Button kind="quiet" label="Close" onPress={close} />
                  </View>
                </Sheet>
              </View>
            );
          }}
        </Load>
      </Screen>
      <Confetti fire={fire} />
    </View>
  );
}
