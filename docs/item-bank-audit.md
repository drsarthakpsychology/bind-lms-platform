# Quiz Item Bank Audit

Generated `2026-08-14T13:29:46.895Z` from `src/lib/quiz/quiz-bank.ts`
(127 items). **Content audit only — no fixes applied** (that is a clinical
content decision, not a code decision).

## Correct-answer positional distribution (authored order)

| Authored index | Count | Share |
|---|---|---|
| 0 | 62 | 49% |
| 1 | 59 | 46% |
| 2 | 1 | 1% |
| 3 | 5 | 4% |



## Length tell — correct option longer than its distractors

119 item(s) where the correct option is the longest.

| id | type | correct len | mean distractor len |
|---|---|---|---|
| `q-order-risk-1` | order_steps | 100 | 58 |
| `q-order-risk-2` | order_steps | 81 | 44.7 |
| `q-order-intake-1` | order_steps | 108 | 31.7 |
| `q-order-crisis-1` | order_steps | 92 | 37.3 |
| `q-order-mse-1` | order_steps | 116 | 23.3 |
| `q-report-pocso-1` | would_you_report | 65 | 35 |
| `q-report-pocso-2` | would_you_report | 68 | 31 |
| `q-report-pocso-3` | would_you_report | 106 | 34.3 |
| `q-report-mha-1` | would_you_report | 80 | 35 |
| `q-report-mha-2` | would_you_report | 97 | 37 |
| `q-report-mha-3` | would_you_report | 85 | 31 |
| `q-soc-1` | standard_vs_common | 72 | 42.7 |
| `q-soc-2` | standard_vs_common | 83 | 37 |
| `q-soc-3` | standard_vs_common | 87 | 43 |
| `q-br-1` | best_response | 74 | 25.3 |
| `q-br-2` | best_response | 84 | 31 |
| `q-spot-2` | spot_the_error | 39 | 20.7 |
| `q-order-osce-1` | order_steps | 86 | 32.7 |
| `q-order-osce-2` | order_steps | 54 | 31.7 |
| `q-decode-1` | best_response | 62 | 31.7 |
| `q-decode-2` | spot_the_error | 53 | 32 |
| `q-decode-3` | standard_vs_common | 92 | 41 |
| `q-decode-4` | order_steps | 67 | 23.7 |
| `q-decode-5` | would_you_report | 108 | 33.7 |
| `q-decode-6` | best_response | 64 | 31 |
| `q-decode-7` | spot_the_error | 44 | 23.7 |
| `q-decode-8` | standard_vs_common | 109 | 41.7 |
| `q-decode-9` | would_you_report | 121 | 35.3 |
| `q-decode-10` | best_response | 62 | 37.7 |
| `q-decode-11` | order_steps | 55 | 23 |
| `q-decode-12` | spot_the_error | 47 | 22 |
| `q-decode-13` | standard_vs_common | 96 | 40 |
| `q-decode-14` | best_response | 86 | 35 |
| `q-decode-15` | would_you_report | 91 | 34 |
| `q-mse-1` | spot_the_error | 42 | 29.3 |
| `q-mse-2` | spot_the_error | 44 | 22.3 |
| `q-mse-3` | order_steps | 69 | 30.7 |
| `q-mse-5` | order_steps | 73 | 25.7 |
| `q-mse-7` | order_steps | 94 | 28.7 |
| `q-mse-8` | spot_the_error | 63 | 23.3 |
| `q-mse-9` | order_steps | 41 | 26.3 |
| `q-mse-10` | spot_the_error | 37 | 22 |
| `q-mse-11` | order_steps | 89 | 24 |
| `q-mse-12` | spot_the_error | 106 | 26.3 |
| `q-mse-13` | order_steps | 96 | 32.7 |
| `q-mse-14` | spot_the_error | 69 | 23.3 |
| `q-mse-15` | order_steps | 108 | 31.7 |
| `q-mha-amend-1` | would_you_report | 106 | 40.3 |
| `q-mha-amend-2` | would_you_report | 105 | 30.7 |
| `q-mha-amend-3` | would_you_report | 94 | 34.7 |
| `q-pocso-proc-1` | standard_vs_common | 121 | 51 |
| `q-pocso-proc-2` | standard_vs_common | 116 | 48 |
| `q-pocso-proc-3` | standard_vs_common | 87 | 42.7 |
| `q-pocso-proc-4` | would_you_report | 153 | 27 |
| `q-pocso-proc-5` | standard_vs_common | 121 | 36.3 |
| `q-mha-amend-4` | would_you_report | 105 | 31.7 |
| `q-mha-amend-5` | would_you_report | 73 | 29.3 |
| `q-mha-amend-6` | standard_vs_common | 110 | 41 |
| `q-pocso-proc-6` | standard_vs_common | 128 | 41.7 |
| `q-mha-amend-7` | would_you_report | 98 | 27.3 |
| `q-mha-amend-8` | standard_vs_common | 117 | 46.7 |
| `q-mha-amend-9` | would_you_report | 112 | 30.3 |
| `q-decode-follow-1` | best_response | 61 | 23.7 |
| `q-decode-follow-2` | best_response | 78 | 23.3 |
| `q-decode-follow-3` | order_steps | 114 | 38.7 |
| `q-decode-follow-4` | best_response | 126 | 29.3 |
| `q-ood-audit-1` | spot_the_error | 82 | 27.7 |
| `q-ood-audit-2` | best_response | 190 | 30.3 |
| `q-ood-audit-3` | spot_the_error | 111 | 29.7 |
| `q-ood-audit-4` | order_steps | 128 | 27.7 |
| `q-decode-follow-5` | spot_the_error | 107 | 24 |
| `q-ood-audit-5` | best_response | 135 | 36.3 |
| `p1-decode-001` | decode_idiom | 79 | 51.7 |
| `p1-decode-002` | decode_idiom | 75 | 54 |
| `p1-decode-003` | decode_idiom | 49 | 20 |
| `p1-decode-004` | decode_idiom | 53 | 34 |
| `p1-decode-005` | decode_idiom | 67 | 45.3 |
| `p1-decode-006` | decode_idiom | 70 | 49 |
| `p1-missing-001` | whats_missing | 37 | 14.7 |
| `p1-missing-004` | whats_missing | 44 | 27 |
| `p1-predict-001` | predict_consequence | 68 | 25.3 |
| `p1-predict-002` | predict_consequence | 77 | 23.7 |
| `p1-predict-003` | predict_consequence | 98 | 40.7 |
| `p1-predict-004` | predict_consequence | 100 | 41 |
| `p1-predict-005` | predict_consequence | 68 | 29.3 |
| `p1-predict-006` | predict_consequence | 86 | 28.7 |
| `p1-conf-001` | confidence_mcq | 109 | 34 |
| `p1-conf-002` | confidence_mcq | 105 | 33.7 |
| `p1-conf-003` | confidence_mcq | 97 | 21.7 |
| `p1-conf-004` | confidence_mcq | 130 | 28 |
| `p1-conf-005` | confidence_mcq | 115 | 29.7 |
| `p1-conf-006` | confidence_mcq | 98 | 37 |
| `p1-unpop-001` | unpopular_right | 74 | 32.3 |
| `p1-unpop-002` | unpopular_right | 87 | 19.3 |
| `p1-unpop-003` | unpopular_right | 112 | 27 |
| `p1-unpop-004` | unpopular_right | 116 | 28 |
| `p1-unpop-005` | unpopular_right | 111 | 27 |
| `p1-unpop-006` | unpopular_right | 120 | 24.7 |
| `p1-restraint-001` | best_response | 106 | 34 |
| `p1-restraint-002` | best_response | 106 | 36.3 |
| `p1-restraint-003` | best_response | 80 | 33.7 |
| `p1-restraint-004` | best_response | 105 | 20.3 |
| `p1-restraint-005` | best_response | 106 | 35 |
| `p1-restraint-006` | best_response | 82 | 39 |
| `p1-decode-007` | decode_idiom | 70 | 34 |
| `p1-decode-008` | decode_idiom | 74 | 33.3 |
| `p1-decode-009` | decode_idiom | 68 | 21.7 |
| `p1-missing-007` | whats_missing | 16 | 11.7 |
| `p1-missing-008` | whats_missing | 55 | 19 |
| `p1-missing-009` | whats_missing | 44 | 12.3 |
| `p1-predict-007` | predict_consequence | 102 | 32 |
| `p1-predict-008` | predict_consequence | 84 | 23.7 |
| `p1-predict-009` | predict_consequence | 75 | 33.7 |
| `p1-conf-007` | confidence_mcq | 116 | 34.7 |
| `p1-conf-008` | confidence_mcq | 119 | 24 |
| `p1-conf-009` | confidence_mcq | 107 | 34 |
| `p1-unpop-007` | unpopular_right | 65 | 30.3 |
| `p1-unpop-008` | unpopular_right | 110 | 31 |
| `p1-unpop-009` | unpopular_right | 127 | 20.3 |

## Fewer than 3 options

None — all items have ≥3 options.

## Near-duplicate options (>80% token overlap)

None detected by token-overlap heuristic.

---

**Note for Dr. Dave:** the `order_steps` items are authored as *complete
pre-ordered sequences* (multiple choice), not as loose steps to re-order. The
interaction delivered is recognition, not ordering. If the curriculum intended
the harder ordering task, those items need re-authoring as discrete steps.
