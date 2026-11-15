import type { CompareRow } from "./store";

/** The comparison's fields, one at a time on a phone, in this order. Shared by the compare page and the mobile app. */
export const COMPARE_FIELDS: Array<{ label: string; key: keyof CompareRow }> = [
  { label: "Class", key: "class" },
  { label: "Band", key: "band_label" },
  { label: "Purpose at this dose", key: "purpose" },
  { label: "Mechanism", key: "mechanism" },
  { label: "Dose range", key: "dose_range" },
  { label: "How quickly it starts working", key: "onset" },
  { label: "Half-life (how long it stays)", key: "half_life" },
  { label: "Main side effects / watch", key: "side_effects" },
  { label: "Published equivalence", key: "published_equivalence" },
];

/** At most this many medicines side by side. */
export const COMPARE_MAX = 5;
