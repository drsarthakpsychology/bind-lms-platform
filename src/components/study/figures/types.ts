import type { ReactNode } from "react";

/**
 * One labelled part of a figure. x and y are the point ON the part (inside the
 * viewBox) that the label's leader line points to; the label itself is placed
 * in the margin by the figure component so labels never overlap.
 * Give an SVG element `data-part="<label id>"` (filled shapes) or
 * `data-line="<label id>"` (lines and tracts) and it lights up when the label
 * is tapped, and tapping it selects the label.
 */
export type FigureLabel = { id: string; name: string; x: number; y: number; about: string };

/** Makes an id unique to one rendered copy of a figure (for gradients and clip paths). */
export type FigureUid = (name: string) => string;

/** A real, labelled illustration: drawn as SVG paths inside `viewBox`, with tappable labels. */
export type FigureDef = {
  id: string;
  title: string;
  viewBox: string;
  /**
   * The drawing itself (SVG elements only, no labels). Use the figure palette
   * (fill="var(--f-t2)" and friends, see figure.module.css) so it reads in both
   * themes. A function receives `u` to make gradient and clip ids unique.
   */
  art: ReactNode | ((u: FigureUid) => ReactNode);
  labels: FigureLabel[];
  /** One plain sentence on what the figure shows. */
  summary: string;
};
