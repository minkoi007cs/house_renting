-- ====================================================================
-- Renthub Data Migration Script
-- Copy existing data from old tables to the new hr_ prefixed tables.
-- Run this in your Supabase SQL Editor.
-- ====================================================================

-- 1. Copy Users
INSERT INTO public.hr_users 
SELECT * FROM public.users 
ON CONFLICT (id) DO NOTHING;

-- 2. Copy Properties
-- Note: Trigger trigger_create_default_unit is active on hr_properties.
-- Temporary disable trigger to prevent creating duplicate empty units during migration.
ALTER TABLE public.hr_properties DISABLE TRIGGER trigger_create_default_unit;

INSERT INTO public.hr_properties 
SELECT * FROM public.properties 
ON CONFLICT (id) DO NOTHING;

-- Re-enable the trigger after copying properties
ALTER TABLE public.hr_properties ENABLE TRIGGER trigger_create_default_unit;

-- 3. Copy Units
INSERT INTO public.hr_units 
SELECT * FROM public.units 
ON CONFLICT (id) DO NOTHING;

-- 4. Copy Tenants
INSERT INTO public.hr_tenants 
SELECT * FROM public.tenants 
ON CONFLICT (id) DO NOTHING;

-- 5. Copy Rental Contracts
INSERT INTO public.hr_rental_contracts 
SELECT * FROM public.rental_contracts 
ON CONFLICT (id) DO NOTHING;

-- 6. Copy Contract Tenants
INSERT INTO public.hr_contract_tenants 
SELECT * FROM public.contract_tenants 
ON CONFLICT (id) DO NOTHING;

-- 7. Copy Transactions
INSERT INTO public.hr_transactions 
SELECT * FROM public.transactions 
ON CONFLICT (id) DO NOTHING;

-- 8. Copy Media
INSERT INTO public.hr_media 
SELECT * FROM public.media 
ON CONFLICT (id) DO NOTHING;

-- 9. Copy Reminders
INSERT INTO public.hr_reminders 
SELECT * FROM public.reminders 
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- Optional: Clean up old tables
-- UNCOMMENT the lines below ONLY after you have verified that the new 
-- hr_ prefixed tables contain all your data and the app works fine.
-- ====================================================================
-- DROP TABLE IF EXISTS public.reminders CASCADE;
-- DROP TABLE IF EXISTS public.media CASCADE;
-- DROP TABLE IF EXISTS public.transactions CASCADE;
-- DROP TABLE IF EXISTS public.contract_tenants CASCADE;
-- DROP TABLE IF EXISTS public.rental_contracts CASCADE;
-- DROP TABLE IF EXISTS public.tenants CASCADE;
-- DROP TABLE IF EXISTS public.units CASCADE;
-- DROP TABLE IF EXISTS public.properties CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;
