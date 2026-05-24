-- ====================================================================
-- Renthub Data Migration Script
-- Copy existing data from old tables to the new hr_ prefixed tables.
-- Run this in your Supabase SQL Editor.
-- ====================================================================

-- 1. Copy Users
INSERT INTO public.hr_users (id, email, name, avatar_url, google_sub, created_at, updated_at, deleted_at)
SELECT id, email, name, avatar_url, google_sub, created_at, updated_at, deleted_at FROM public.users
ON CONFLICT (id) DO NOTHING;

-- 2. Copy Properties
-- Note: Trigger trigger_create_default_unit is active on hr_properties.
-- Temporary disable trigger to prevent creating duplicate empty units during migration.
ALTER TABLE public.hr_properties DISABLE TRIGGER trigger_create_default_unit;

INSERT INTO public.hr_properties (id, user_id, name, address, type, status, description, notes, monthly_rent, cover_image_url, image_urls, created_at, updated_at, deleted_at)
SELECT id, user_id, name, address, type, status, description, notes, monthly_rent, cover_image_url, image_urls, created_at, updated_at, deleted_at FROM public.properties
ON CONFLICT (id) DO NOTHING;

-- Re-enable the trigger after copying properties
ALTER TABLE public.hr_properties ENABLE TRIGGER trigger_create_default_unit;

-- 3. Copy Units
INSERT INTO public.hr_units (id, property_id, name, description, status, order_index, created_at, updated_at, deleted_at)
SELECT id, property_id, name, description, status, order_index, created_at, updated_at, deleted_at FROM public.units
ON CONFLICT (id) DO NOTHING;

-- 4. Copy Tenants
INSERT INTO public.hr_tenants (id, unit_id, name, phone, email, address, notes, emergency_contact, created_at, updated_at, deleted_at)
SELECT id, unit_id, name, phone, email, address, notes, emergency_contact, created_at, updated_at, deleted_at FROM public.tenants
ON CONFLICT (id) DO NOTHING;

-- 5. Copy Rental Contracts
INSERT INTO public.hr_rental_contracts (id, unit_id, signed_date, start_date, end_date, rent_amount, deposit_amount, payment_cycle, terms, notes, status, image_urls, rent_due_day, created_at, updated_at, deleted_at)
SELECT id, unit_id, signed_date, start_date, end_date, rent_amount, deposit_amount, payment_cycle, terms, notes, status, image_urls, rent_due_day, created_at, updated_at, deleted_at FROM public.rental_contracts
ON CONFLICT (id) DO NOTHING;

-- 6. Copy Contract Tenants
INSERT INTO public.hr_contract_tenants (id, contract_id, tenant_id, role, created_at)
SELECT id, contract_id, tenant_id, role, created_at FROM public.contract_tenants
ON CONFLICT (id) DO NOTHING;

-- 7. Copy Transactions
INSERT INTO public.hr_transactions (id, property_id, unit_id, type, category, amount, transaction_date, note, created_at, updated_at, deleted_at)
SELECT id, property_id, unit_id, type, category, amount, transaction_date, note, created_at, updated_at, deleted_at FROM public.transactions
ON CONFLICT (id) DO NOTHING;

-- 8. Copy Media
INSERT INTO public.hr_media (id, property_id, type, file_url, file_name, file_size, mime_type, order_index, created_at, updated_at, deleted_at)
SELECT id, property_id, type, file_url, file_name, file_size, mime_type, order_index, created_at, updated_at, deleted_at FROM public.media
ON CONFLICT (id) DO NOTHING;

-- 9. Copy Reminders
INSERT INTO public.hr_reminders (id, property_id, unit_id, type, title, description, due_date, status, created_at, updated_at, deleted_at)
SELECT id, property_id, unit_id, type, title, description, due_date, status, created_at, updated_at, deleted_at FROM public.reminders
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
