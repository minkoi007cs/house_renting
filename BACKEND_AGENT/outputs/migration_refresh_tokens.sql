-- Phase 3: Refresh token table
-- Run once in Supabase SQL editor (Dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS hr_refresh_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES hr_users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_hr_refresh_tokens_user_id    ON hr_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_hr_refresh_tokens_token_hash ON hr_refresh_tokens(token_hash);

-- RLS: backend uses service role key → bypassed.
-- Enabling RLS anyway for defense-in-depth if key ever leaks.
ALTER TABLE hr_refresh_tokens ENABLE ROW LEVEL SECURITY;
