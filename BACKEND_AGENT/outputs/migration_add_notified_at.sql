-- Phase 3b: Add notified_at to hr_reminders for dedup email sends
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE hr_reminders ADD COLUMN IF NOT EXISTS notified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_hr_reminders_due_notified
  ON hr_reminders(due_date, notified_at)
  WHERE deleted_at IS NULL AND status = 'pending';
