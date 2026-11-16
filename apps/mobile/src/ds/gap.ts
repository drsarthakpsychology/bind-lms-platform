import * as React from "react";

/**
 * The gap of the column a block sits in (Screen: 32px between sections; Section: 12px).
 * Content that rises in after a load is wrapped in one animated view; it reads this so
 * its children keep the same spacing as when the content is drawn straight from the
 * phone's copy, with no wrapper.
 */
export const StackGap = React.createContext<number | undefined>(undefined);
