/** What a clinic server action answers, as the website screens use it. */
export type Res<T> = { ok: true; data: T } | { ok: false; error: string };
