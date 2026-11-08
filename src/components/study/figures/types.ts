import type { ReactNode } from "react";

/** One labelled part of a figure. x and y are the label's anchor in the figure's viewBox. */
export type FigureLabel = { id: string; name: string; x: number; y: number; about: string };

/** A real, labelled illustration: drawn as SVG paths inside `viewBox`, with tappable labels. */
export type FigureDef = {
  id: string;
  title: string;
  viewBox: string;
  /** The drawing itself (SVG elements only, no labels). Use currentColor and the token classes so it reads in both themes. */
  art: ReactNode;
  labels: FigureLabel[];
  /** One plain sentence on what the figure shows. */
  summary: string;
};
