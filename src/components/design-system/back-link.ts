/**
 * The one Back link at the top of a page: a bordered 44px rectangle with an
 * arrow and the name of where it goes ("rectangle = do"). Shared by BackPill,
 * Exam Prep, Study, Medicines, Games and the More pages. A plain module (not
 * a client one) so server pages can use the class too.
 */
export const backLinkClass =
  "inline-flex min-h-11 max-w-full shrink-0 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";
