/** What a clinic server action answers, as the website screens use it. `code` is the server's error code ("unavailable", "conflict"...). */
export type Res<T> = { ok: true; data: T } | { ok: false; error: string; code?: string; /** Why a scan step was refused. */ reason?: string };
