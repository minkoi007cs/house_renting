-- ====================================================================
-- Renthub Workspace Currency preference setup
-- Add currency preference (VND / USD) to users table.
-- ====================================================================

ALTER TABLE public.hr_users 
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'VND' CHECK (currency IN ('VND', 'USD'));
