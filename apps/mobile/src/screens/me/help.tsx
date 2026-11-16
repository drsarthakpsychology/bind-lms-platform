import { Mail, MessageCircle } from "lucide-react-native";
import * as React from "react";

import { useConfig } from "@/api/queries";
import { Button, Row, RowList, Screen, Section, T } from "@/ds";
import { BRAND } from "@/lib/brand";
import { openLink } from "@/lib/open";
import { useTheme } from "@/theme";

/** Help: a person on WhatsApp, the email, and the two questions people ask most. */
export function HelpScreen() {
  const c = useTheme();
  const cfg = useConfig();
  const whatsapp = cfg.data?.support.whatsapp ?? BRAND.whatsapp;
  const email = cfg.data?.support.email ?? "hello@vibhapsychology.com";
  return (
    <Screen testID="help" title="We are here to help" lead="A person from the school answers, usually the same day." footer={<Button label="Message us on WhatsApp" icon={<MessageCircle size={20} color={c.onPrimary} />} onPress={() => void openLink(whatsapp)} testID="help-whatsapp" />}>
      <RowList>
        <Row testID="help-email" title="Email us" meta={email} icon={<Mail size={20} color={c.muted} />} onPress={() => void openLink(`mailto:${email}`)} />
      </RowList>
      <Section title="I got a new phone">
        <T tone="muted">Sign in on the new phone. The old one signs out by itself. You can change phones twice a month; after that, message us.</T>
      </Section>
      <Section title="I forgot my PIN">
        <T tone="muted">Tap Forgot PIN on the lock screen, sign in with your password, and choose a new PIN.</T>
      </Section>
    </Screen>
  );
}
