-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE property_type AS ENUM ('house', 'apartment', 'townhouse', 'land', 'other');
CREATE TYPE property_status AS ENUM ('active', 'inactive', 'sold');
CREATE TYPE unit_status AS ENUM ('available', 'occupied', 'maintenance', 'unavailable');
CREATE TYPE contract_status AS ENUM ('draft', 'signed', 'active', 'expired', 'terminated', 'renewed');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_category AS ENUM (
  'rent', 'service_fee', 'deposit_refund', 'other_income',
  'repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'other_expense'
);
CREATE TYPE reminder_type AS ENUM ('rent_payment_due', 'contract_expiring', 'maintenance_needed', 'custom_task');
CREATE TYPE reminder_status AS ENUM ('pending', 'done');
CREATE TYPE media_type AS ENUM ('image', 'contract', 'document');

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);

-- Properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  type property_type NOT NULL,
  status property_status DEFAULT 'active',
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT properties_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);

-- Units table
CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status unit_status DEFAULT 'available',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT units_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_units_property_id ON public.units(property_id);
CREATE INDEX idx_units_status ON public.units(status);

-- Tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT tenants_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.units(id) ON DELETE CASCADE
);

CREATE INDEX idx_tenants_unit_id ON public.tenants(unit_id);
CREATE INDEX idx_tenants_phone ON public.tenants(phone);
CREATE INDEX idx_tenants_email ON public.tenants(email);

-- Rental Contracts table
CREATE TABLE IF NOT EXISTS public.rental_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL,
  signed_date DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(12, 2) NOT NULL,
  deposit_amount DECIMAL(12, 2) DEFAULT 0,
  payment_cycle VARCHAR(50) NOT NULL,
  terms TEXT,
  notes TEXT,
  status contract_status DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT contracts_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.units(id) ON DELETE CASCADE
);

CREATE INDEX idx_contracts_unit_id ON public.rental_contracts(unit_id);
CREATE INDEX idx_contracts_status ON public.rental_contracts(status);
CREATE INDEX idx_contracts_end_date ON public.rental_contracts(end_date);

-- Contract Tenants junction table
CREATE TABLE IF NOT EXISTS public.contract_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'tenant',
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT contract_tenants_contract_id_fkey FOREIGN KEY (contract_id)
    REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  CONSTRAINT contract_tenants_tenant_id_fkey FOREIGN KEY (tenant_id)
    REFERENCES public.tenants(id) ON DELETE CASCADE,
  CONSTRAINT contract_tenants_unique UNIQUE (contract_id, tenant_id)
);

CREATE INDEX idx_contract_tenants_contract_id ON public.contract_tenants(contract_id);
CREATE INDEX idx_contract_tenants_tenant_id ON public.contract_tenants(tenant_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  unit_id UUID,
  type transaction_type NOT NULL,
  category transaction_category NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  transaction_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT transactions_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.properties(id) ON DELETE CASCADE,
  CONSTRAINT transactions_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.units(id) ON DELETE SET NULL
);

CREATE INDEX idx_transactions_property_id ON public.transactions(property_id);
CREATE INDEX idx_transactions_unit_id ON public.transactions(unit_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date DESC);
CREATE INDEX idx_transactions_property_date ON public.transactions(property_id, transaction_date DESC);

-- Media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  type media_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT,
  mime_type VARCHAR(100),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT media_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_property_id ON public.media(property_id);
CREATE INDEX idx_media_type ON public.media(type);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  unit_id UUID,
  type reminder_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status reminder_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT reminders_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.properties(id) ON DELETE CASCADE,
  CONSTRAINT reminders_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.units(id) ON DELETE SET NULL
);

CREATE INDEX idx_reminders_property_id ON public.reminders(property_id);
CREATE INDEX idx_reminders_due_date ON public.reminders(due_date);
CREATE INDEX idx_reminders_status ON public.reminders(status);

-- Trigger: Auto-create default unit when property is created
CREATE OR REPLACE FUNCTION create_default_unit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.units (property_id, name, status)
  VALUES (NEW.id, NEW.name, 'available');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_unit
AFTER INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION create_default_unit();

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for properties
CREATE POLICY "Users can view their own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for units (nested check via property)
CREATE OR REPLACE FUNCTION unit_belongs_to_user(unit_property_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = unit_property_id AND p.user_id = auth.uid()
  );
END;
$$;

CREATE POLICY "Users can manage units in their properties"
  ON public.units FOR ALL
  USING (unit_belongs_to_user(property_id))
  WITH CHECK (unit_belongs_to_user(property_id));

-- RLS Policies for tenants
CREATE OR REPLACE FUNCTION tenant_belongs_to_user(tenant_unit_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.units u
    JOIN public.properties p ON u.property_id = p.id
    WHERE u.id = tenant_unit_id AND p.user_id = auth.uid()
  );
END;
$$;

CREATE POLICY "Users can manage tenants in their units"
  ON public.tenants FOR ALL
  USING (tenant_belongs_to_user(unit_id))
  WITH CHECK (tenant_belongs_to_user(unit_id));

-- RLS Policies for rental_contracts
CREATE OR REPLACE FUNCTION contract_belongs_to_user(contract_unit_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.units u
    JOIN public.properties p ON u.property_id = p.id
    WHERE u.id = contract_unit_id AND p.user_id = auth.uid()
  );
END;
$$;

CREATE POLICY "Users can manage contracts in their units"
  ON public.rental_contracts FOR ALL
  USING (contract_belongs_to_user(unit_id))
  WITH CHECK (contract_belongs_to_user(unit_id));

-- RLS Policies for contract_tenants
CREATE OR REPLACE FUNCTION contract_tenant_belongs_to_user(ct_contract_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.rental_contracts rc
    JOIN public.units u ON rc.unit_id = u.id
    JOIN public.properties p ON u.property_id = p.id
    WHERE rc.id = ct_contract_id AND p.user_id = auth.uid()
  );
END;
$$;

CREATE POLICY "Users can manage contract tenants"
  ON public.contract_tenants FOR ALL
  USING (contract_tenant_belongs_to_user(contract_id))
  WITH CHECK (contract_tenant_belongs_to_user(contract_id));

-- RLS Policies for transactions
CREATE POLICY "Users can manage transactions in their properties"
  ON public.transactions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

-- RLS Policies for media
CREATE POLICY "Users can manage media in their properties"
  ON public.media FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

-- RLS Policies for reminders
CREATE POLICY "Users can manage reminders in their properties"
  ON public.reminders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

-- Views for analytics
CREATE OR REPLACE VIEW property_monthly_summary AS
SELECT
  p.id as property_id,
  p.user_id,
  DATE_TRUNC('month', t.transaction_date)::DATE as month,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) -
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as net_profit
FROM public.properties p
LEFT JOIN public.transactions t ON p.id = t.property_id
WHERE t.deleted_at IS NULL
GROUP BY p.id, p.user_id, DATE_TRUNC('month', t.transaction_date);

-- ============================================================
-- Phase 1 migration — run in Supabase SQL Editor
-- ============================================================

-- New columns on properties
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS monthly_rent    NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_urls      TEXT[] DEFAULT '{}';

-- New columns on rental_contracts
ALTER TABLE public.rental_contracts
  ADD COLUMN IF NOT EXISTS image_urls    TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rent_due_day  INTEGER CHECK (rent_due_day BETWEEN 1 AND 31);

-- New transaction categories
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'deposit_received';
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'tax';
ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS 'insurance';

-- New column on tenants
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
