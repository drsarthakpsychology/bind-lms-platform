"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Choices } from "@/components/ds";
import { DocumentView } from "@/components/psychopharm/document-view";
import { SourcePanel } from "@/components/psychopharm/source-panel";
import { useMedicineEditor } from "@/components/psychopharm/editor-pane";
import type { MedicationDocument } from "@/lib/psychopharm/document";
import { AdminPage, Block, Empty, Field, Notice, Status, btn, control } from "./kit";

/**
 * The medicine editor (v2). One purpose: change a medicine page and publish
 * it. The page is the student page with an Edit, Sources and Remove line under
 * each block; on wide screens the publish and source panel sits on the right
 * and stays in view, on phones it follows the page.
 */
export function MedicineEditorV2(props: { drug: string; drugId: string; initialDocument: MedicationDocument; initialStatus: string }) {
  const ed = useMedicineEditor(props);
  const sourceRef = React.useRef<HTMLElement>(null);

  // On phones the source panel is below the page: bring it into view.
  function openSource(block: Parameters<typeof ed.setActiveBlock>[0]) {
    ed.setActiveBlock(block);
    if (typeof window !== "undefined" && window.matchMedia?.("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => sourceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const saved = ed.savedAt ? `Saved ${new Date(ed.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : null;

  return (
    <AdminPage
      title={props.drug}
      back={{ href: "/admin/psychopharm-review", label: "Medicines" }}
      lead={
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          <Status tone={ed.published ? "ok" : "warn"}>{ed.published ? "Published" : "Draft, not shown to students"}</Status>
          {ed.busy === "save" ? <span>Saving</span> : saved ? <span className="type-num">{saved}</span> : null}
        </span>
      }
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-6)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-[var(--ds-5)]">
          <Choices
            label="Preview as"
            options={[
              { id: "student" as const, label: "Student view" },
              { id: "clinician" as const, label: "Clinician view" },
            ]}
            value={ed.register}
            onChange={(v) => ed.setRegister(v)}
          />
          {ed.document.sections.length ? (
            <DocumentView
              document={ed.document}
              register={ed.register}
              editable
              look="v2"
              onEdit={ed.editBlock}
              onAddBlock={ed.addBlock}
              onRemoveBlock={ed.removeBlock}
              onSource={openSource}
            />
          ) : (
            <Empty>No sections yet.</Empty>
          )}
          <button type="button" onClick={ed.addSection} className={cn(btn.quiet, "w-full sm:w-fit")}>
            <Plus aria-hidden /> Add section
          </button>
        </div>

        <aside aria-label="Publish and sources" className="flex min-w-0 flex-col gap-[var(--ds-6)] border-t border-[var(--ds-hairline)] pt-[var(--ds-5)] lg:sticky lg:top-[calc(var(--top-h,0px)+1.5rem)] lg:self-start lg:border-t-0 lg:pt-0">
          <Block title="Publish">
            <div className="flex min-w-0 flex-col gap-3">
              <Field label="Change note">
                <input value={ed.reason} onChange={(e) => ed.setReason(e.target.value)} className={cn(control, "w-full")} />
              </Field>
              <button type="button" onClick={ed.publish} disabled={ed.busy !== null} className={cn(btn.primary, "w-full")}>
                {ed.busy === "publish" ? "Publishing" : ed.published ? "Publish changes" : "Publish to students"}
              </button>
              {ed.notice ? <Notice tone={/fail/i.test(ed.notice) ? "alert" : "warn"}>{ed.notice}</Notice> : null}
              {ed.errors.length ? (
                <Notice tone="alert">
                  <span className="flex min-w-0 flex-col gap-1">
                    {ed.errors.map((e, i) => (
                      <span key={i}>{e}</span>
                    ))}
                  </span>
                </Notice>
              ) : null}
            </div>
          </Block>

          <section ref={sourceRef} className="scroll-mt-24">
            <Block title="Source">
              {ed.activeBlock ? (
                <SourcePanel key={ed.activeBlock.id} block={ed.activeBlock} look="v2" onChange={(sources) => ed.setSources(ed.activeBlock!.id, sources)} />
              ) : (
                <p className="type-small text-muted-foreground">Choose Sources under a block.</p>
              )}
            </Block>
          </section>
        </aside>
      </div>
    </AdminPage>
  );
}
