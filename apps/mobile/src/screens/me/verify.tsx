import { useLocalSearchParams } from "expo-router";
import { Check, X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useVerify } from "@/api/queries";
import { Row, RowsSkeleton, Screen, Stone, T } from "@/ds";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";
import { issued } from "./certificates";
import { Group, Load } from "./parts";

const WORD = { valid: "This certificate is genuine", provisional: "A genuine provisional certificate", revoked: "This certificate was withdrawn", expired: "This certificate has expired", not_issued: "This certificate has not been issued yet", unknown: "We could not find this certificate" } as const;

/** Public: anyone with the link can check a certificate. The answer first, in words and a mark; the facts under it. */
export function VerifyScreen() {
  const c = useTheme();
  const { certificateId = "" } = useLocalSearchParams<{ certificateId: string }>();
  const q = useVerify(String(certificateId));
  return (
    <Screen testID="verify" title="Check a certificate" lead="From VIBHA School of Psychology" gap={space[5]}>
      <Load q={q} what="this certificate" skeleton={<RowsSkeleton rows={3} />}>
        {(v) => {
          const good = v.status === "valid" || v.status === "provisional";
          return (
            <View style={{ gap: space[5] }}>
              <Enter i={0}>
                <Stone pad={space[5]} testID="verify-answer">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: good ? c.lime : c.alertBg }}>{good ? <Check size={26} color={c.onLime} strokeWidth={3} /> : <X size={26} color={c.alertFg} strokeWidth={3} />}</View>
                    <T v="h2" style={{ flex: 1 }}>
                      {WORD[v.status]}
                    </T>
                  </View>
                </Stone>
              </Enter>
              {v.found ? (
                <Group title="What it says">
                  {v.recipientName ? <Row title="Awarded to" trailing={v.recipientName} /> : null}
                  {v.what ? <Row title="Kind" trailing={v.what} /> : null}
                  {v.title ? <Row title="For" meta={v.title} /> : null}
                  {v.issuedAt ? <Row title="Issued" trailing={issued(v.issuedAt)} /> : null}
                  <Row title="Issued by" meta={v.issuer} />
                  <Row title="Number" meta={v.certificateId} />
                </Group>
              ) : null}
              {v.paragraph ? <T v="reading">{v.paragraph}</T> : null}
              {v.replacedBy ? <T tone="muted">This certificate was replaced by {v.replacedBy}.</T> : null}
              {v.found ? null : <T tone="muted">Check the number and try again, or ask the person to share the link from their app.</T>}
            </View>
          );
        }}
      </Load>
    </Screen>
  );
}
