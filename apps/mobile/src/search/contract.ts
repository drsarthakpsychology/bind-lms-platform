/** GET /search?q=&types=&perType= (src/app/api/app/v1/search/route.ts). */
export type SearchType = "lecture" | "file" | "module" | "section" | "note" | "medicine" | "glossary" | "case" | "student";

export type SearchResult = {
  id: string;
  type: SearchType;
  title: string;
  meta: string;
  /** The website page. */
  href: string;
  /** The screen to open in the app. */
  app: string;
};

export type SearchAnswer = {
  v: 1;
  q: string;
  /** Best first, a few of each type. */
  results: SearchResult[];
  /** The groups this account can search. */
  types: SearchType[];
};
