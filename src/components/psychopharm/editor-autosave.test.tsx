// @vitest-environment jsdom
import * as React from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MedicationDocument, MedBlock } from "@/lib/psychopharm/document";
import { useMedicineEditor } from "./editor-pane";

const block = { id: "b1", type: "note", value: "Start low", order: 1, sources: [] } as unknown as MedBlock;
const doc = { sections: [{ id: "s1", title: "Dose", blocks: [block] }] } as unknown as MedicationDocument;

describe("medicine editor autosave", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ status: "draft" }) }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("does not save on open (strict mode) or while typing the reason, and saves once after an edit", async () => {
    const { result } = renderHook(() => useMedicineEditor({ drug: "lithium", drugId: "d1", initialDocument: doc, initialStatus: "published" }), { wrapper: React.StrictMode });
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(fetchMock).not.toHaveBeenCalled();

    act(() => result.current.setReason("Dose update"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(fetchMock).not.toHaveBeenCalled();

    act(() => result.current.editBlock(block, "Start at 300 mg"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/psychopharm/document");
  });
});
