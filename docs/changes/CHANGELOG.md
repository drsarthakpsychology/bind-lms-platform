# Documentation & Architecture Changelog
Format: newest first. Each entry lists what changed in **docs** and, when relevant, the code commit it was verified against. Application changes are summarised in [DEVELOPMENT_HISTORY](../history/DEVELOPMENT_HISTORY.md); git is authoritative for code.

## 2026-11-06 — Knowledge base established
- Added `docs/MASTER_ARCHITECTURE.md` and `docs/{architecture,modules,workflows,inventory,history,changes}/` (30+ files).
- Verified against `main` @ `b2a9698` (PR #45). Read-only audit; **no application code, schema or configuration changed**.
- Pre-existing flat docs (`docs/SYSTEM_MAP.md` etc.) left unchanged; drift recorded in `inventory/TECHNICAL_DEBT.md`.
- Findings recorded: D1–D5, S1–S4, R1–R4, C1–C4 (see TECHNICAL_DEBT).
