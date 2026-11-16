import { usePathname } from "expo-router";
import * as React from "react";
import { Modal } from "react-native";

import type { Home } from "@/api/contract";
import { keys, queryClient, useAchievements, useMe } from "@/api/queries";
import { api } from "@/auth";
import { prefs } from "@/lib/storage";
import { shareCertificate } from "@/screens/me/certificates";
import { ThemeProvider } from "@/theme";
import { CertificateMoment } from "./certificate";
import { closeMoment, devMoment, freshCertificates, moments, showMoment, today } from "./store";
import { StreakPanel } from "./streak";

/**
 * The full-screen moments, mounted once in the student tabs (src/moments).
 * Shown in a transparent Modal so they sit above every pushed screen.
 *  - Certificate earned: watches the achievements list (loaded with Home and
 *    refreshed by the Certificates screen); each new issued certificate plays
 *    once per phone.
 *  - Streak kept: `streakMoment.done()` after a finished activity; when the
 *    student leaves that result, once a day, if the server counts a streak.
 */

const STREAK_KEY = "vibha.moments.streakDay";
let pending = false;

export const streakMoment = {
  /** A lecture watched, a quiz done, a round won. Cheap: the check runs on the next screen change. */
  done() {
    pending = true;
  },
};

async function checkStreak(): Promise<void> {
  if (!pending) return;
  pending = false;
  const day = today();
  if ((await prefs.get(STREAK_KEY).catch(() => null)) === day) return;
  // Today's activity is saved on the server; ask for the count that includes it.
  const home = await api.get<Home>("/home").catch(() => null);
  if (!home) return;
  queryClient.setQueryData(keys.home, home);
  const days = home.goal?.streak ?? 0;
  if (days < 1) return;
  await prefs.set(STREAK_KEY, day).catch(() => undefined);
  showMoment({ kind: "streak", days });
}

function CertificateWatch() {
  const q = useAchievements();
  const data = q.data;
  React.useEffect(() => {
    if (!data) return;
    const issued = data.earned.filter((x) => x.type === "certificate" && x.status === "issued");
    if (devMoment() === "cert" && issued[0]) {
      showMoment({ kind: "cert", cert: issued[0] });
      return;
    }
    let live = true;
    void freshCertificates(issued).then((fresh) => {
      if (!live || !fresh.length) return;
      const newest = [...fresh].sort((a, b) => (b.issuedAt ?? "").localeCompare(a.issuedAt ?? ""))[0]!;
      showMoment({ kind: "cert", cert: newest });
    });
    return () => {
      live = false;
    };
  }, [data]);
  return null;
}

export function MomentHost() {
  const now = moments.use((s) => s.now);
  const me = useMe();
  const path = usePathname();
  React.useEffect(() => {
    if (devMoment() === "streak") showMoment({ kind: "streak", days: 6 });
  }, []);
  React.useEffect(() => {
    if (!pending) return;
    // Let the screen the student went to settle first.
    const id = setTimeout(() => void checkStreak(), 350);
    return () => clearTimeout(id);
  }, [path]);
  const close = React.useCallback(() => closeMoment(), []);
  return (
    <>
      {me.data?.access?.can.achievements ? <CertificateWatch /> : null}
      <Modal visible={!!now} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
        {now?.kind === "cert" ? (
          <ThemeProvider force="dark">
            <CertificateMoment key={now.cert.credentialId} cert={now.cert} onClose={close} onShare={(c) => void shareCertificate(c)} />
          </ThemeProvider>
        ) : now?.kind === "streak" ? (
          <StreakPanel days={now.days} onClose={close} />
        ) : null}
      </Modal>
    </>
  );
}
