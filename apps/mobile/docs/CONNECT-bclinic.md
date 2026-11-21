# To connect: student clinic screens (bclinic)

Every student clinic screen reads real data through `src/clinic/api.ts`. No mock data was added for them.

| Screen | File | What it needs | Where the website has it |
|---|---|---|---|
| None | | Nothing to connect | |

Notes for the backend phase:

- Scan uses the two-step routes `/clinic/scan/identify` and `/clinic/scan/confirm` (from the scanfix branch). Both must be live on the server before the app ships, or every scan says "That code did not work".
- `src/clinic/mock.ts` now also puts `clinicMock` on `globalThis.__clinicMock` in the browser build, so screenshots can read today's code. It only exists where the mock server is loaded.
