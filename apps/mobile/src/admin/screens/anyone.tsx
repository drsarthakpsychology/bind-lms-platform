import { File, Paths } from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { Check } from "lucide-react-native";
import * as React from "react";
import { Image, Linking, PixelRatio, Share, useWindowDimensions, View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, Chips, EmptyState, Field, Screen, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Burst, Reveal, Stamp } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { pdfPages } from "../../../modules/pdf-pages/src";
import { adminCalls, useAdminAction, useStudioOptions } from "../api";
import type { AnyoneInput, AnyoneResult } from "../extra";
import { day, todayIst } from "../format";
import { ConfirmSheet, Facts, Notice } from "../kit";
import { useAdminRole } from "../role";

const DEFAULT_HEADING = "Certificate of Appreciation";
const DEFAULT_LEAD = "is recognised for";
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** What stops it, in the website's words (checkAnyone), before the server says so. Pure, so it is tested. */
export function anyoneProblem(f: AnyoneInput): string | null {
  if (!f.name.trim()) return "Type their name.";
  if (!isEmail(f.email)) return "Type a real email address.";
  if (!f.title.trim()) return "Give the certificate a title.";
  if (!f.paragraph.trim()) return "Write a few lines about what they did.";
  if (f.issuedOn && !/^\d{4}-\d{2}-\d{2}$/.test(f.issuedOn)) return "Write the date as yyyy-mm-dd.";
  return null;
}

function bytesOf(b64: string): Uint8Array {
  const bin = globalThis.atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** The PDF the server made, drawn as a picture by the phone's own PDF renderer (nothing is kept after). */
function usePdfPicture() {
  const { width } = useWindowDimensions();
  const [pic, setPic] = React.useState<{ uri: string; ratio: number } | null>(null);
  const [file, setFile] = React.useState<string | null>(null);
  const made = React.useRef<string[]>([]);
  React.useEffect(
    () => () => {
      for (const uri of made.current) {
        try {
          const f = new File(uri);
          if (f.exists) f.delete();
        } catch {
          /* already gone */
        }
      }
    },
    [],
  );
  const show = React.useCallback(
    async (b64: string) => {
      const f = new File(Paths.cache, `certificate-preview-${made.current.length}.pdf`);
      if (f.exists) f.delete();
      f.create();
      f.write(bytesOf(b64));
      made.current.push(f.uri);
      setFile(f.uri);
      if (!pdfPages.available()) return setPic(null);
      const page = await pdfPages.renderPage(f.uri, 0, Math.round((width - layout.gutter * 2) * PixelRatio.get()));
      made.current.push(page.uri);
      setPic({ uri: page.uri, ratio: page.width / Math.max(1, page.height) });
    },
    [width],
  );
  return { pic, file, show };
}

/**
 * A certificate for someone without an account: a guest speaker, a
 * volunteer. They get it as a PDF by email and a public check page; no login.
 * If the email belongs to a student it shows on their Achievements too.
 */
export function AdminAnyoneScreen() {
  const c = useTheme();
  const { canWrite } = useAdminRole();
  const options = useStudioOptions();
  const { run, busy } = useAdminAction();
  const [f, setF] = React.useState<AnyoneInput>({ name: "", email: "", phone: "", title: "", paragraph: "", heading: DEFAULT_HEADING, lead: DEFAULT_LEAD, issuedOn: todayIst(), signatureFrom: null, emailIt: true });
  const set = (p: Partial<AnyoneInput>) => setF((x) => ({ ...x, ...p }));
  const [error, setError] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [done, setDone] = React.useState<AnyoneResult | null>(null);
  const [previewing, setPreviewing] = React.useState(false);
  const pdf = usePdfPicture();

  if (!canWrite) {
    return (
      <Screen testID="anyone">
        <EmptyState mood="puzzled" title="View-only access" body="Only a Super Admin can issue certificates." action={{ label: "Back", onPress: () => router.back() }} />
      </Screen>
    );
  }

  if (done) {
    return (
      <Screen testID="anyone-done" footer={<Button label="Done" onPress={() => router.back()} testID="anyone-finish" />}>
        <View style={{ alignItems: "center", gap: space[4], paddingTop: space[6] }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Stamp fire={1} rotate={-4}>
              <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.primary, alignItems: "center", justifyContent: "center" }}>
                <Check size={36} color={c.onPrimary} />
              </View>
            </Stamp>
            <Burst fire={1} reach={44} />
          </View>
          <T v="h1" center>
            Issued to {f.name.trim()}
          </T>
          <T v="body" tone="muted" center>
            {[done.linkedStudent ? `Also on ${done.linkedStudent}'s Achievements.` : null, done.emailNote ? `Email not sent: ${done.emailNote}` : f.emailIt ? "Emailed with the PDF." : null].filter(Boolean).join(" ")}
          </T>
        </View>
        <Facts items={[{ label: "Number", value: done.credentialId }]} />
        <Button kind="quiet" label="Open the check page" onPress={() => void Linking.openURL(done.verifyUrl)} testID="anyone-verify" />
        <Button kind="text" full label="Share the check page" onPress={() => void Share.share({ message: done.verifyUrl })} />
      </Screen>
    );
  }

  const check = () => {
    const p = anyoneProblem(f);
    setError(p);
    if (p) haptic.warn();
    return !p;
  };
  const preview = async () => {
    if (!check()) return;
    setPreviewing(true);
    try {
      await pdf.show(await adminCalls.anyonePreview(f));
      haptic.select();
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setPreviewing(false);
    }
  };
  const issue = async () => {
    const r = await run("issue-certificate", () => adminCalls.anyoneIssue(f));
    setConfirm(false);
    if (r) setDone(r);
  };
  const sigs = options.data?.signatures ?? [];

  return (
    <Screen
      title="No account"
      testID="anyone"
      gap={space[4]}
      footer={
        <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
          <Button kind="text" label="Preview" busy={previewing} onPress={() => void preview()} testID="anyone-preview" />
          <View style={{ flex: 1 }}>
            <Button label="Issue" onPress={() => check() && setConfirm(true)} testID="anyone-issue" />
          </View>
        </View>
      }
    >
      <T v="small" tone="muted">
        For a guest speaker or a volunteer. They get the PDF by email and a check page, no login.
      </T>
      <Field label="Their name" value={f.name} onChangeText={(name) => set({ name })} maxLength={80} testID="anyone-name" />
      <Field label="Email" value={f.email} onChangeText={(email) => set({ email })} keyboardType="email-address" autoCapitalize="none" maxLength={200} testID="anyone-email" />
      <Field label="Phone (optional)" value={f.phone ?? ""} onChangeText={(phone) => set({ phone })} keyboardType="phone-pad" maxLength={20} />
      <Field label="Title" value={f.title} onChangeText={(title) => set({ title })} maxLength={120} placeholder="Guest lecture on child assessment" testID="anyone-title" />
      <Field label="What they did" value={f.paragraph} onChangeText={(paragraph) => set({ paragraph })} maxLength={600} multiline testID="anyone-paragraph" />
      <Field label="Line at the top" value={f.heading ?? ""} onChangeText={(heading) => set({ heading })} maxLength={80} />
      <Field label="Line under the name" value={f.lead ?? ""} onChangeText={(lead) => set({ lead })} maxLength={80} />
      <Field label="Date" hint="yyyy-mm-dd" value={f.issuedOn ?? ""} onChangeText={(issuedOn) => set({ issuedOn })} maxLength={10} keyboardType="numbers-and-punctuation" />
      {sigs.length ? <Chips label="Signature" value={f.signatureFrom ?? ""} onChange={(v) => set({ signatureFrom: v || null })} options={[{ id: "", name: "None" }, ...sigs.map((g) => ({ id: g.id, name: g.label }))]} /> : null}
      <SwitchRow title="Email it with the PDF" value={f.emailIt !== false} onChange={(emailIt) => set({ emailIt })} testID="anyone-emailit" />
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="anyone-error">
          {error}
        </T>
      ) : null}
      {pdf.pic ? (
        <Reveal key={pdf.pic.uri} style={{ gap: space[2] }}>
          <Image source={{ uri: pdf.pic.uri }} style={{ width: "100%", aspectRatio: pdf.pic.ratio, borderRadius: layout.radius, borderWidth: 1, borderColor: c.hairline }} accessibilityLabel={`Preview of ${f.title} for ${f.name}`} testID="anyone-picture" />
        </Reveal>
      ) : pdf.file ? (
        <Notice action={<Button kind="text" full={false} label="Open the PDF" onPress={() => void Sharing.shareAsync(pdf.file!, { mimeType: "application/pdf" }).catch(() => toast.show("Could not open the PDF."))} />}>Preview ready.</Notice>
      ) : null}
      <ConfirmSheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Issue to ${f.name.trim() || "them"}?`}
        body={`${f.title.trim()}, dated ${day(f.issuedOn)}. ${f.emailIt !== false ? `It is emailed to ${f.email.trim()}.` : "It is not emailed."} You can revoke it later from Issued.`}
        confirm="Issue"
        busy={busy === "issue-certificate"}
        onConfirm={() => void issue()}
        testID="confirm-anyone"
      />
    </Screen>
  );
}
