import * as React from "react";

import { InkUnderline } from "./ink";

/** Section titles already drawn in this app session: the underline draws on the first visit only. */
const drawn = new Set<string>();

/**
 * The small hand-drawn underline under a tab's title (Learn, Practise,
 * Library, Me). It draws itself in 260ms the first time the section opens
 * in a session and is simply there after that.
 */
export function TitleInk({ title }: { title: string }) {
  const [first] = React.useState(() => !drawn.has(title));
  React.useEffect(() => {
    drawn.add(title);
  }, [title]);
  return <InkUnderline width={64} k={`title-${title}`} delay={first ? 120 : -1} still={!first} />;
}
