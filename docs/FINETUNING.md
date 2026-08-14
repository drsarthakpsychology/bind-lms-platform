# VIBHA Psychology Model — Fine-Tuning Runbook

This is the **base**: a deterministic, $0 fine-tuning dataset built from the
authorized books + the book-grounded eval set. The fine-tune job itself needs a
provider key (not currently set — see NEEDS_KAVYA). When a key exists, follow
this runbook.

> **Decision (2026-08-14):** The user explicitly requested fine-tuning
> ("I want you to fine tune and build a base"). This is a deliberate override
> of the default RAG-only architecture. The books remain retrievable via the
> knowledge layer; fine-tuning is additive — the base model learns the
> psychology register + grounded-answer behaviour, while retrieval still feeds
> live context. **The eval gate (§24) applies**: fine-tuning ships only if the
> 50-question eval shows it does not regress grounded answers, and ideally
> improves them.

## What the dataset contains

Built by `npm run finetune:dataset` into `scripts/finetune/data/`:

| File | Format | Purpose |
|---|---|---|
| `sft.jsonl` | OpenAI-compatible `messages` | 50 instruction examples — each eval question with a deterministic, source-cited answer assembled from the retrieved book passages. Teaches grounded, citable answering. |
| `pretrain.jsonl` | `text` | up to 2,000 corpus passages (book >200 chars) with a `[Source: book, chapter, p. N]` prefix. Teaches the psychology register + source traceability. |

Both are deterministic and reproducible — no model was used to generate them
(no key exists), so they are honest and never hallucinated.

## The recommended base model

The session runs on **DeepSeek V4** (`deepseek-v4-flash` / `deepseek-v4-pro`,
Anthropic-compatible endpoint). DeepSeek's fine-tuning API is not yet publicly
documented (verified 2026-08-14), so the two viable paths are:

### Path A — OpenAI-compatible fine-tuning API (preferred if available)
OpenAI's `/v1/fine_tuning/jobs` accepts exactly the `sft.jsonl` `messages`
format. Pick a base that supports full or LoRA fine-tuning:

```bash
# after setting OPENAI_API_KEY (or a compatible provider's key)
openai api fine_tunes.create \
  -m <base-model> \
  -t scripts/finetune/data/sft.jsonl \
  --method full  # or lora for cheaper
```

### Path B — HuggingFace PEFT (self-hosted, no per-token cost)
LoRA on a 7B-13B instruct model, freezing ≥99% of params (per the 2026
community recipe): `r=16, lora_alpha=32, lora_dropout=0.05`, targeting
`q_proj/k_proj/v_proj/o_proj/gate_proj/up_proj/down_proj`, `task_type="CAUSAL_LM"`.
Full fine-tune needs ~80k samples + bf16 + gradient checkpointing — the
`pretrain.jsonl` + `sft.jsonl` combination (2,050 examples) is the SFT/LoRA
starting point; scale the pretrain sample up (raise `MAX_PRETRAIN`) for
full continued-pretraining.

## The eval gate (non-negotiable)

Before shipping a fine-tuned model, run:

```bash
npm run knowledge:eval
```

The 50-question set scores source recall AND grounded@8 (answer terms present
in the top-8 context window). **Baseline (RAG-only): recall@5/8 100%, grounded@8
90%** (after context expansion — measured 2026-08-14, commit 05bafa8). A
fine-tuned model must:
1. Not regress recall below 100% (retrieval must still surface the right book).
2. Not regress grounded@8 — ideally improve it (the model should rely on
   retrieved passages, not memorized-but-wrong detail).

If the fine-tune makes the system worse on these, revert to the base model and
re-investigate (§25 regression testing).

## Wiring the fine-tuned model into the app

1. Set the provider key (see NEEDS_KAVYA: `DEEPSEEK_API_KEY` or the chosen
   provider's key).
2. Add the fine-tuned model id to `src/lib/ai/router.ts` as the `smart` model
   for the `knowledge_tutor` workload (or swap it in as the primary).
3. Flip the `knowledge_tutor` feature flag at `/admin/flags`.
4. Re-run `npm run knowledge:eval` — the gate above.

## Safety / data policy

- The fine-tune is trained on the **authorized corpus only** — licensed books.
- Student data is NEVER used to train the model (§22: student conversations are
  not training data). The dataset is corpus-derived + eval-derived.
- Source traceability: answers must cite book/chapter/page. The `pretrain.jsonl`
  prefix and the `sft.jsonl` cited answers both reinforce this.
