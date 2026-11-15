/**
 * The one Back link at the top of a page: a bordered 44px rectangle with an
 * arrow and the name of where it goes ("rectangle = do"). Shared by BackPill,
 * Exam Prep, Study, Medicines, Games and the More pages. A plain module (not
 * a client one) so server pages can use the class too.
 */
export const backLinkClass =
  "inline-flex min-h-11 max-w-full shrink-0 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold transition-[transform,translate,scale,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 " +
  // New design: the same link as a quiet line of text (no box), like the ds BackLink.
  "v2:-ml-2 v2:border-0 v2:bg-transparent v2:px-2 v2:text-muted-foreground v2:hover:translate-y-0 v2:hover:text-foreground v2:hover:shadow-none";
