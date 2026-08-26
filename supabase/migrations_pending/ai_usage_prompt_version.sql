-- T173: trace which patient-prompt version produced each call. Additive only.
alter table ai_usage_log add column if not exists prompt_version text;
