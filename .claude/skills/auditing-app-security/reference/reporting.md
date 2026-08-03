# Severity, Prioritization & Reporting

## Score sources

- **CVSS v4.0** — Base (0.0–10.0) + Threat + Environmental + Supplemental. v4
  adds an exploit-maturity Threat metric. Known to be inconsistent; not
  designed for patch prioritization.
- **EPSS** (FIRST) — ML-predicted 30-day exploitation probability (0–1),
  updated daily; **EPSS v4 released March 2025**. Outperforms CVSS for
  prioritization.
- **CISA KEV** — confirmed-exploited list. A finding in KEV is urgent even if
  CVSS is medium.

### Why severity alone is misleading

- Only ~2.3% of CVEs scored CVSS ≥7 were actually observed exploited; ~28% of
  exploited CVEs carried only medium scores (FIRST EPSS matrix, via Orca).
- Example: CVE-2024-0646 (CVSS 7.0, EPSS 0.04%) vs CVE-2024-4577
  (EPSS ~94% before NVD even published its CVSS).
- Scores move: EPSS updates daily; CVSS differs between NVD and vendor
  advisories (Lovable CVE: NVD 9.3 vs vendor 8.26).

## Pragmatic prioritization

Combine **CVSS base** (severity) + **EPSS/KEV** (exploitation likelihood) +
**reachability** + **data sensitivity** (student PII, payments, paid content).

A CVSS 9.8 with EPSS ~0% and no reachable path is lower priority than a
directly-reachable IDOR on student PII.

## Finding format

```
### <Title>
- **Severity:** <CVSS v4 vector + score> · EPSS <p> · KEV? <yes/no> (where a CVE exists)
- **CWE:** <CWE-ID>
- **Affected:** <file:line or route/table>
- **Weakness:** <what is wrong>
- **Evidence:** <verbatim output or code>
- **Reproduction:** <exact steps, incl. anon/role replay>
- **Impact:** <what data/action at risk>
- **Remediation:** <code/config fix>
- **Effort:** S / M / L
```

## Common CWEs to reach for

- CWE-862 Missing Authorization · CWE-863 Incorrect Authorization
- CWE-269 Improper Privilege Management · CWE-284 Improper Access Control
- CWE-798 Hard-coded Credentials · CWE-434 Unrestricted Upload
- CWE-352 CSRF · CWE-89 SQL Injection · CWE-22 Path Traversal
- CWE-79 XSS · CWE-200 Exposure of Sensitive Information
- CWE-400 Uncontrolled Resource Consumption (rate limiting)
