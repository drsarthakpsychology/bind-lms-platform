/** Shared class strings so every game's buttons and cards look the same. */
export const btn =
  "inline-flex min-h-11 select-none items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 py-2 text-base font-bold transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-px active:translate-y-px active:shadow-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
export const btnPrimary = `${btn} bg-primary text-primary-foreground hard-shadow-sm`;
export const btnSecondary = `${btn} bg-card text-foreground hard-shadow-xs`;
export const btnInk = `${btn} bg-foreground text-background hard-shadow-xs`;
export const card = "rounded-lg border-2 border-foreground bg-card";
export const chip = "inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-2.5 py-0.5 text-sm font-bold";
