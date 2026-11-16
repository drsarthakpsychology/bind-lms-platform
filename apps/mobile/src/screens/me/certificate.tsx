import { useLocalSearchParams } from "expo-router";
import { Award } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { useAchievements } from "@/api/queries";
import { Button, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { downloadCertificate, issued, shareCertificate } from "./certificates";

/** One certificate: what it is for, when it was issued, its public check page. */
export function CertificateScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useAchievements();
  return (
    <Screen testID="certificate" footer={q.data?.earned.find((x) => x.credentialId === id)?.status === "issued" ? <Button label="Download the PDF" onPress={() => void downloadCertificate(String(id))} testID="cert-download" /> : undefined}>
      <Loaded q={q} what="this certificate" skeleton={<RowsSkeleton rows={3} />}>
        {(a) => {
          const x = a.earned.find((e) => e.credentialId === id);
          if (!x) return <EmptyState mood="missing" title="Certificate not found" body="It may have been withdrawn. Message us if you think this is wrong." />;
          return (
            <>
              <View style={{ gap: space[3] }}>
                <Award size={32} color={c.link} />
                <T v="h1">{x.title}</T>
                {x.description ? <T v="reading" tone="muted">{x.description}</T> : null}
              </View>
              <RowList>
                <Row title="Issued" trailing={x.status === "revoked" ? "Withdrawn" : issued(x.issuedAt)} />
                <Row title="Certificate number" meta={x.credentialId} />
                {x.verifyUrl ? <Row title="Public check page" meta={x.verifyUrl.replace(/^https?:\/\//, "")} onPress={() => void Linking.openURL(x.verifyUrl!)} /> : null}
              </RowList>
              {/* The one Share: it sends the public check page. */}
              {x.verifyUrl && x.status === "issued" ? <Button kind="quiet" label="Share" onPress={() => void shareCertificate(x)} testID="cert-share" /> : null}
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
