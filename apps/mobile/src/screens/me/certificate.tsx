import { router, Stack, useLocalSearchParams } from "expo-router";
import { Download, Share2 } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { Credential } from "@/api/contract";
import { useAchievements, useMe } from "@/api/queries";
import { Button, Row, Screen, Skeleton, T } from "@/ds";
import { openLink } from "@/lib/open";
import { Enter } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { downloadCertificate, issued, shareCertificate } from "./certificates";
import { Group, Load, QuietNote } from "./parts";

/**
 * One certificate (docs/DESIGN.md, "Certificate"): the page shown whole on the
 * layer, its facts under it, then Download (lime, in the footer) and Share
 * (quiet). No companion here. The page drawn on the phone is a preview made
 * from the certificate's own facts; the real page is the PDF.
 */

/** The certificate as a printed page: paper, a double rule, the facts. Not restyled by the theme beyond the paper tone. */
export function CertificatePage({ x, name }: { x: Credential; name: string | null }) {
  const c = useTheme();
  const date = issued(x.issuedAt);
  return (
    <View testID="cert-page" accessible accessibilityRole="image" accessibilityLabel={`Certificate. ${x.title}.${name ? ` Awarded to ${name}.` : ""}${date ? ` Issued ${date}.` : ""}`} style={{ backgroundColor: c.paper, borderRadius: layout.radius, padding: space[2], aspectRatio: 842 / 595, borderWidth: 1, borderColor: c.paperLine }}>
      <View style={{ flex: 1, borderWidth: 2, borderColor: c.onPaper, borderRadius: 10, padding: 3 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: c.paperLine, borderRadius: 7, alignItems: "center", justifyContent: "center", paddingHorizontal: space[4], gap: 3 }}>
          <T maxFontSizeMultiplier={1} style={{ fontFamily: fonts.wordmark, fontSize: 15, lineHeight: 18, color: c.onPaper }}>
            VIBHA
          </T>
          <T v="caption" maxFontSizeMultiplier={1} style={{ color: c.onPaper, opacity: 0.7 }}>
            School of Psychology
          </T>
          <T center maxFontSizeMultiplier={1} numberOfLines={2} adjustsFontSizeToFit style={{ fontFamily: fonts.h1, fontSize: 19, lineHeight: 23, color: c.onPaper, marginTop: space[2] }}>
            {x.title}
          </T>
          {name ? (
            <T center maxFontSizeMultiplier={1} numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: c.onPaper }}>
              Awarded to {name}
            </T>
          ) : null}
          <T center maxFontSizeMultiplier={1} numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 10, lineHeight: 14, color: c.onPaper, opacity: 0.7, marginTop: space[1] }}>
            {[x.status === "revoked" ? "Withdrawn" : date, x.credentialId].filter(Boolean).join(" · ")}
          </T>
        </View>
      </View>
    </View>
  );
}

export function CertificateScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useAchievements();
  const name = useMe().data?.name ?? null;
  const cert = q.data?.earned.find((x) => x.credentialId === id);
  const live = cert?.status === "issued";
  return (
    <Screen
      testID="certificate"
      title={cert?.title ?? "Certificate"}
      lead={cert ? (cert.status === "revoked" ? "Withdrawn" : `Issued ${issued(cert.issuedAt)}`) : undefined}
      gap={space[5]}
      footer={
        live ? (
          <View style={{ flexDirection: "row", gap: space[3] }}>
            <Button style={{ flex: 1 }} label="Download" icon={<Download size={18} color={c.onLime} />} onPress={() => void downloadCertificate(String(id))} testID="cert-download" />
            {cert?.verifyUrl ? <Button style={{ flex: 1 }} kind="quiet" label="Share" icon={<Share2 size={18} color={c.ink} />} onPress={() => void shareCertificate(cert)} testID="cert-share" /> : null}
          </View>
        ) : undefined
      }
    >
      <Stack.Screen options={{ title: "" }} />
      <Load q={q} what="this certificate" skeleton={<Skeleton r={layout.radius} style={{ width: "100%", aspectRatio: 842 / 595 }} />}>
        {(a) => {
          const x = a.earned.find((e) => e.credentialId === id);
          if (!x) return <QuietNote testID="cert-missing" title="Certificate not found" body="It may have been withdrawn. Message us if you think this is wrong." action={{ label: "Open help", onPress: () => router.push("/help") }} />;
          return (
            <View style={{ gap: space[5] }}>
              <Enter i={0} kind="pop">
                <CertificatePage x={x} name={name} />
              </Enter>
              {x.description ? <T v="reading">{x.description}</T> : null}
              <Group title="About this certificate">
                <Row title="Issued" trailing={x.status === "revoked" ? "Withdrawn" : issued(x.issuedAt)} />
                <Row title="Certificate number" meta={x.credentialId} />
                {x.verifyUrl ? <Row testID="cert-check" title="Public check page" meta="Anyone with the link can check it is real" onPress={() => void openLink(x.verifyUrl!)} /> : null}
              </Group>
              {x.status === "revoked" && x.revokeReason ? (
                <T v="small" tone="muted">
                  {x.revokeReason}
                </T>
              ) : null}
            </View>
          );
        }}
      </Load>
    </Screen>
  );
}
