import { router, Stack, useLocalSearchParams } from "expo-router";
import { Award, Flame, Medal } from "lucide-react-native";
import * as React from "react";
import { Linking, Share, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import type { BadgeProgress, CertificatePdfLink, Credential } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { useAchievements } from "@/api/queries";
import { api } from "@/auth";
import { Button, Card, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { Confetti, presets, Press, staggerDelay, useNewWins } from "@/motion";
import { layout, space, useTheme } from "@/theme";

export function issued(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
}

export async function downloadCertificate(id: string): Promise<void> {
  try {
    const link = await api.get<CertificatePdfLink>(`/achievements/${encodeURIComponent(id)}/pdf`);
    await Linking.openURL(link.url);
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

function Badge({ b, i, onPress }: { b: Credential | BadgeProgress; i: number; onPress: () => void }) {
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
            backgroundColor: earned ? (b.tone === "lime" ? c.primary : c.brand) : c.tint,
          }}
        >
          <Icon size={26} color={earned ? (b.tone === "lime" ? c.onPrimary : c.onBrand) : c.muted} />
        </View>
        <T v="caption" center tone={earned ? "ink" : "muted"} style={{ paddingHorizontal: space[1] }}>
          {b.title}
        </T>
      </Press>
    </Animated.View>
  );
}

/** Certificates as a list with Download and Share; badges as a quiet grid; what is still to earn as rows. */
export function CertificatesScreen() {
  const c = useTheme();
  const q = useAchievements();
  const { show } = useLocalSearchParams<{ show?: string }>();
  const badgesOnly = show === "badges";
  const [badge, setBadge] = React.useState<Credential | BadgeProgress | null>(null);
  const close = React.useCallback(() => setBadge(null), []);
  // A newly earned badge gets confetti, once per phone (a new certificate gets its own full-screen moment, src/moments).
  const won = q.data ? q.data.earned.filter((x) => x.type === "badge").map((x) => x.credentialId) : null;
  const fire = useNewWins("achievements", won);
  return (
    <View style={{ flex: 1 }}>
      <Screen testID="certificates" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <Stack.Screen options={{ title: badgesOnly ? "Badges" : "Certificates" }} />
        <Loaded q={q} what="your certificates" skeleton={<RowsSkeleton rows={4} />}>
          {(a) => {
            const certs = a.earned.filter((x) => x.type === "certificate" && x.status !== "draft");
            const badges = a.earned.filter((x) => x.type === "badge");
            const toEarn = a.progress.filter((x) => !x.earned && (!badgesOnly || x.type === "badge"));
            return (
              <>
                {badgesOnly ? (
                  badges.length ? null : <EmptyState title="No badges yet" body="Badges come from studying, practising and finishing lectures." testID="badges-empty" />
                ) : certs.length ? (
                  <Section title="Earned">
                    {certs.map((x) => (
                      <Card key={x.credentialId} testID={`cert-${x.credentialId}`} onPress={() => router.push(`/certificate/${encodeURIComponent(x.credentialId)}`)} accessibilityLabel={`${x.title}. Issued ${issued(x.issuedAt)}`}>
                        <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
                          <Award size={24} color={c.link} />
                          <View style={{ flex: 1, gap: space[1] }}>
                            <T v="bodyStrong">{x.title}</T>
                            <T v="small" tone="muted">
                              {x.status === "revoked" ? "Withdrawn" : `Issued ${issued(x.issuedAt)}`}
                            </T>
                          </View>
                        </View>
                        {x.status === "issued" ? (
                          <View style={{ flexDirection: "row", gap: space[5] }}>
                            <Button kind="text" label="Download" onPress={() => void downloadCertificate(x.credentialId)} />
                            {x.verifyUrl ? <Button kind="text" label="Share" onPress={() => void shareCertificate(x)} /> : null}
                          </View>
                        ) : null}
                      </Card>
                    ))}
                  </Section>
                ) : (
                  <EmptyState title="No certificates yet" body="Finish a module and pass its test to earn your first certificate." testID="certs-empty" />
                )}
                {badges.length ? (
                  <Section title="Badges">
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {badges.map((b, i) => (
                        <Badge key={b.credentialId} b={b} i={i} onPress={() => setBadge(b)} />
                      ))}
                    </View>
                  </Section>
                ) : null}
                {toEarn.length ? (
                  <Section title="Still to earn">
                    <RowList>
                      {toEarn.map((p) => (
                        <Row key={p.id} title={p.title} meta={p.description ?? undefined} trailing={p.progress} onPress={() => setBadge(p)} chevron={false} />
                      ))}
                    </RowList>
                  </Section>
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
                  </View>
                </Sheet>
              </>
            );
          }}
        </Loaded>
      </Screen>
      <Confetti fire={fire} />
    </View>
  );
}
