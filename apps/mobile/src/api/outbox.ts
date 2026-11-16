import { api, onSignedOut } from "@/auth";
import { createOutbox } from "@/lib/outbox";
import { prefs } from "@/lib/storage";
import type { SaveResult } from "./contract";

/** The app's one save outbox (see src/lib/outbox.ts). */
export const outbox = createOutbox({ store: prefs, post: (items) => api.post<SaveResult>("/save", { items }) });
onSignedOut(() => void outbox.clear());
