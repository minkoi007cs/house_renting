-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Idempotent Enum types creation
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    CREATE TYPE property_type AS ENUM ('house', 'apartment', 'townhouse', 'land', 'other');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
    CREATE TYPE property_status AS ENUM ('active', 'inactive', 'sold');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unit_status') THEN
    CREATE TYPE unit_status AS ENUM ('available', 'occupied', 'maintenance', 'unavailable');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
    CREATE TYPE contract_status AS ENUM ('draft', 'signed', 'active', 'expired', 'terminated', 'renewed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_category') THEN
    CREATE TYPE transaction_category AS ENUM (
      'rent', 'service_fee', 'deposit_refund', 'other_income',
      'repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'other_expense',
      'deposit_received', 'tax', 'insurance', 'electricity', 'water_sewage', 'gas',
      'lawn_care', 'snow_removal', 'hoa_fee', 'pest_control', 'hvac_maintenance',
      'painting', 'appliance_repair'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_type') THEN
    CREATE TYPE reminder_type AS ENUM ('rent_payment_due', 'contract_expiring', 'maintenance_needed', 'custom_task');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_status') THEN
    CREATE TYPE reminder_status AS ENUM ('pending', 'done');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
    CREATE TYPE media_type AS ENUM ('image', 'contract', 'document');
  END IF;
END $$;


-- Users table
CREATE TABLE IF NOT EXISTS public.hr_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  google_sub VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hr_users_email ON public.hr_users(email);
CREATE INDEX IF NOT EXISTS idx_hr_users_created_at ON public.hr_users(created_at DESC);

-- Properties table
CREATE TABLE IF NOT EXISTS public.hr_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  type property_type NOT NULL,
  status property_status DEFAULT 'active',
  description TEXT,
  notes TEXT,
  monthly_rent NUMERIC(12,2),
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT hr_properties_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.hr_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hr_properties_user_id ON public.hr_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_hr_properties_status ON public.hr_properties(status);
CREATE INDEX IF NOT EXISTS idx_hr_properties_created_at ON public.hr_properties(created_at DESC);

-- Units table
CREATE TABLE IF NOT EXISTS public.hr_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status unit_status DEFAULT 'available',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT hr_units_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.hr_properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hr_units_property_id ON public.hr_units(property_id);
CREATE INDEX IF NOT EXISTS idx_hr_units_status ON public.hr_units(status);

-- Tenants table
CREATE TABLE IF NOT EXISTS public.hr_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT hr_tenants_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.hr_units(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hr_tenants_unit_id ON public.hr_tenants(unit_id);
CREATE INDEX IF NOT EXISTS idx_hr_tenants_phone ON public.hr_tenants(phone);
CREATE INDEX IF NOT EXISTS idx_hr_tenants_email ON public.hr_tenants(email);

-- Rental Contracts table
CREATE TABLE IF NOT EXISTS public.hr_rental_contracts (
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
  image_urls TEXT[] DEFAULT '{}',
  rent_due_day INTEGER CHECK (rent_due_day BETWEEN 1 AND 31),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP,
  CONSTRAINT hr_contracts_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.hr_units(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hr_contracts_unit_id ON public.hr_rental_contracts(unit_id);
CREATE INDEX IF NOT EXISTS idx_hr_contracts_status ON public.hr_rental_contracts(status);
CREATE INDEX IF NOT EXISTS idx_hr_contracts_end_date ON public.hr_rental_contracts(end_date);

-- Contract Tenants junction table
CREATE TABLE IF NOT EXISTS public.hr_contract_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'tenant',
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT hr_contract_tenants_contract_id_fkey FOREIGN KEY (contract_id)
    REFERENCES public.hr_rental_contracts(id) ON DELETE CASCADE,
  CONSTRAINT hr_contract_tenants_tenant_id_fkey FOREIGN KEY (tenant_id)
    REFERENCES public.hr_tenants(id) ON DELETE CASCADE,
  CONSTRAINT hr_contract_tenants_unique UNIQUE (contract_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_hr_contract_tenants_contract_id ON public.hr_contract_tenants(contract_id);
CREATE INDEX IF NOT EXISTS idx_hr_contract_tenants_tenant_id ON public.hr_contract_tenants(tenant_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.hr_transactions (
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
  CONSTRAINT hr_transactions_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.hr_properties(id) ON DELETE CASCADE,
  CONSTRAINT hr_transactions_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.hr_units(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_hr_transactions_property_id ON public.hr_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_hr_transactions_unit_id ON public.hr_transactions(unit_id);
CREATE INDEX IF NOT EXISTS idx_hr_transactions_type ON public.hr_transactions(type);
CREATE INDEX IF NOT EXISTS idx_hr_transactions_category ON public.hr_transactions(category);
CREATE INDEX IF NOT EXISTS idx_hr_transactions_date ON public.hr_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_hr_transactions_property_date ON public.hr_transactions(property_id, transaction_date DESC);

-- Media table
CREATE TABLE IF NOT EXISTS public.hr_media (
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
  CONSTRAINT hr_media_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.hr_properties(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hr_media_property_id ON public.hr_media(property_id);
CREATE INDEX IF NOT EXISTS idx_hr_media_type ON public.hr_media(type);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.hr_reminders (
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
  CONSTRAINT hr_reminders_property_id_fkey FOREIGN KEY (property_id)
    REFERENCES public.hr_properties(id) ON DELETE CASCADE,
  CONSTRAINT hr_reminders_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES public.hr_units(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_hr_reminders_property_id ON public.hr_reminders(property_id);
CREATE INDEX IF NOT EXISTS idx_hr_reminders_due_date ON public.hr_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_hr_reminders_status ON public.hr_reminders(status);

-- Trigger: Auto-create default unit when property is created
CREATE OR REPLACE FUNCTION create_default_unit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.hr_units (property_id, name, status)
  VALUES (NEW.id, NEW.name, 'available');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_create_default_unit
AFTER INSERT ON public.hr_properties
FOR EACH ROW
EXECUTE FUNCTION create_default_unit();

-- Enable RLS
ALTER TABLE public.hr_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_rental_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_contract_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
DROP POLICY IF EXISTS "Users can view their own record" ON public.hr_users;
CREATE POLICY "Users can view their own record"
  ON public.hr_users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own record" ON public.hr_users;
CREATE POLICY "Users can update their own record"
  ON public.hr_users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for properties
DROP POLICY IF EXISTS "Users can view their own properties" ON public.hr_properties;
CREATE POLICY "Users can view their own properties"
  ON public.hr_properties FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own properties" ON public.hr_properties;
CREATE POLICY "Users can insert their own properties"
  ON public.hr_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own properties" ON public.hr_properties;
CREATE POLICY "Users can update their own properties"
  ON public.hr_properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own properties" ON public.hr_properties;
CREATE POLICY "Users can delete their own properties"
  ON public.hr_properties FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for units (nested check via property)
CREATE OR REPLACE FUNCTION unit_belongs_to_user(unit_property_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.hr_properties p
    WHERE p.id = unit_property_id AND p.user_id = auth.uid()
  );
END;
$$;

DROP POLICY IF EXISTS "Users can manage units in their properties" ON public.hr_units;
CREATE POLICY "Users can manage units in their properties"
  ON public.hr_units FOR ALL
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
    SELECT 1 FROM public.hr_units u
    JOIN public.hr_properties p ON u.property_id = p.id
    WHERE u.id = tenant_unit_id AND p.user_id = auth.uid()
  );
END;
$$;

DROP POLICY IF EXISTS "Users can manage tenants in their units" ON public.hr_tenants;
CREATE POLICY "Users can manage tenants in their units"
  ON public.hr_tenants FOR ALL
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
    SELECT 1 FROM public.hr_units u
    JOIN public.hr_properties p ON u.property_id = p.id
    WHERE u.id = contract_unit_id AND p.user_id = auth.uid()
  );
END;
$$;

DROP POLICY IF EXISTS "Users can manage contracts in their units" ON public.hr_rental_contracts;
CREATE POLICY "Users can manage contracts in their units"
  ON public.hr_rental_contracts FOR ALL
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
    SELECT 1 FROM public.hr_rental_contracts rc
    JOIN public.hr_units u ON rc.unit_id = u.id
    JOIN public.hr_properties p ON u.property_id = p.id
    WHERE rc.id = ct_contract_id AND p.user_id = auth.uid()
  );
END;
$$;

DROP POLICY IF EXISTS "Users can manage contract tenants" ON public.hr_contract_tenants;
CREATE POLICY "Users can manage contract tenants"
  ON public.hr_contract_tenants FOR ALL
  USING (contract_tenant_belongs_to_user(contract_id))
  WITH CHECK (contract_tenant_belongs_to_user(contract_id));

-- RLS Policies for transactions
DROP POLICY IF EXISTS "Users can manage transactions in their properties" ON public.hr_transactions;
CREATE POLICY "Users can manage transactions in their properties"
  ON public.hr_transactions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hr_properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can manage media in their properties" ON public.hr_media;
CREATE POLICY "Users can manage media in their properties"
  ON public.hr_media FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hr_properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can manage reminders in their properties" ON public.hr_reminders;
CREATE POLICY "Users can manage reminders in their properties"
  ON public.hr_reminders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.hr_properties p
    WHERE p.id = property_id AND p.user_id = auth.uid()
  ));

-- Views for analytics
CREATE OR REPLACE VIEW public.hr_property_monthly_summary AS
SELECT
  p.id as property_id,
  p.user_id,
  DATE_TRUNC('month', t.transaction_date)::DATE as month,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) -
  SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as net_profit
FROM public.hr_properties p
LEFT JOIN public.hr_transactions t ON p.id = t.property_id
WHERE t.deleted_at IS NULL
GROUP BY p.id, p.user_id, DATE_TRUNC('month', t.transaction_date);
