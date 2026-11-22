import * as React from "react";
import { View } from "react-native";

import { Tint, T } from "@/ds";
import type { MedDiagram } from "@/practise/contract";
import { WidgetView } from "@/study/widgets";
import { fonts, space } from "@/theme";
import { ReceptorScale } from "./diagrams";
import { SynapseSketch } from "./synapse";

/**
 * The "How it works" pictures of a medicine page, drawn from the server's
 * plan (MedicinePage.sections how-it-works .diagrams, the same plan the
 * website draws from src/lib/meds/diagrams.ts), in the same order. Each one
 * is native and interactive: the synapse with and without the medicine, the
 * journey through the body by route, the half-life and dose curves, the
 * pathways, the neuron, the nervous system, the brain map and a night of
 * sleep use the app's hand-drawn widgets.
 */
const ctx = { moduleId: "medicines", sectionId: "how-it-works" };
const widget = (kind: string, data: Record<string, unknown>, key: string) => <WidgetView key={key} block={{ t: "widget", kind, v: 1, data } as never} ctx={ctx} />;

export function MedicineDiagram({ d, k }: { d: MedDiagram; k: string }) {
  switch (d.kind) {
    case "note":
      return <T v="reading">{d.text}</T>;
    case "target":
      return (
        <Tint style={{ gap: space[1] }}>
          <T v="small" tone="muted">
            Main target
          </T>
          <T v="reading" style={{ fontFamily: fonts.semibold }} testID="d-main-target">
            {d.target}
          </T>
          <T v="reading">{`What ${d.medName.toLowerCase()} does there: ${d.action.charAt(0).toLowerCase()}${d.action.slice(1)}.`}</T>
          <T v="small" tone="muted">{`${d.effect}.`}</T>
        </Tint>
      );
    case "receptor":
      return <ReceptorScale r={{ name: d.receptor, pick: d.pick, note: d.note }} who={d.medName} />;
    case "messenger":
      return <ReceptorScale r={{ name: d.receptor, pick: "Full agonist", note: d.note }} who={`${d.messenger}, the body's own messenger,`} />;
    case "journey":
      return widget("journey", { drug: d.medName, target: d.target, routes: d.routes, ...(d.notes ? { notes: d.notes } : {}), title: `${d.medName} through the body` }, k);
    case "synapse":
      return <SynapseSketch medName={d.medName} action={d.action} transmitter={d.transmitter} title={d.title} caption={d.caption ?? undefined} />;
    case "halfLife":
      return (
        <View style={{ gap: space[2] }}>
          {widget("curve", { kind: "half-life", title: d.title, caption: `Half-life ${d.hl}. ${d.meaning}` }, k)}
        </View>
      );
    case "dose":
      return widget("curve", { kind: d.shape === "window" ? "inverted-u" : "dose-response", title: d.title, ...(d.caption ? { caption: d.caption } : {}) }, k);
    case "pathways":
      return widget("pathways", { system: "dopamine", title: d.focus ? "What an antipsychotic does on the dopamine pathways" : `What ${d.medName} does in the dopamine pathways`, start: d.partial ? "partial" : d.atypical ? "d2-2a" : "d2", ...(d.caption ? { caption: d.caption } : {}) }, k);
    case "compare":
      return widget("compare", { title: d.title, a: d.a, b: d.b }, k);
    case "neuron":
      return widget("neuron", { title: d.title, ...(d.caption ? { caption: d.caption } : {}) }, k);
    case "nervous":
      return widget("nervoussystem", { title: d.title, ...(d.caption ? { caption: d.caption } : {}) }, k);
    case "brainmap":
      return widget("brainmap", { title: d.title, focus: d.focus, notes: d.notes, ...(d.caption ? { caption: d.caption } : {}) }, k);
    case "hypnogram":
      return widget("hypnogram", { title: d.title, ...(d.caption ? { caption: d.caption } : {}) }, k);
    default:
      return null;
  }
}

export function MedicineDiagrams({ diagrams }: { diagrams: MedDiagram[] }) {
  return (
    <View style={{ gap: space[4] }} testID="med-diagrams">
      {diagrams.map((d, i) => (
        <MedicineDiagram key={`${d.kind}-${i}`} k={`${d.kind}-${i}`} d={d} />
      ))}
    </View>
  );
}
