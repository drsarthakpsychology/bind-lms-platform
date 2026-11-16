import { useLocalSearchParams } from "expo-router";
import { CircleCheck, CircleX } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useVerify } from "@/api/queries";
import { Loaded, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { issued } from "./certificates";

const WORD = { valid: "This certificate is genuine", provisional: "A genuine provisional certificate", revoked: "This certificate was withdrawn", expired: "This certificate has expired", not_issued: "This certificate has not been issued yet", unknown: "We could not find this certificate" } as const;

/** Public: anyone with the link can check a certificate. */
export function VerifyScreen() {
  const c = useTheme();
  const { certificateId = "" } = useLocalSearchParams<{ certificateId: string }>();
  const q = useVerify(String(certificateId));
  return (
    <Screen testID="verify">
      <Loaded q={q} what="this certificate" skeleton={<RowsSkeleton rows={3} />}>
        {(v) => (
          <>
            <View style={{ gap: space[3] }}>
              {v.status === "valid" || v.status === "provisional" ? <CircleCheck size={36} color={c.link} /> : <CircleX size={36} color={c.danger} />}
              <T v="h1">{WORD[v.status]}</T>
            </View>
            {v.found ? (
              <RowList>
                {v.recipientName ? <Row title="Awarded to" trailing={v.recipientName} /> : null}
                {v.what ? <Row title="Kind" trailing={v.what} /> : null}
                {v.title ? <Row title="For" meta={v.title} /> : null}
                {v.issuedAt ? <Row title="Issued" trailing={issued(v.issuedAt)} /> : null}
                <Row title="Issued by" meta={v.issuer} />
                <Row title="Number" meta={v.certificateId} />
              </RowList>
            ) : null}
            {v.paragraph ? <T v="reading" tone="muted">{v.paragraph}</T> : null}
            {v.replacedBy ? <T tone="muted">This certificate was replaced by {v.replacedBy}.</T> : null}
            {v.found ? null : (
              <T tone="muted">Check the number and try again, or ask the person to share the link from their app.</T>
            )}
          </>
        )}
      </Loaded>
    </Screen>
  );
}
