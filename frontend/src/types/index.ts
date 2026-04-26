export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
}

export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'land' | 'other';
export type PropertyStatus = 'active' | 'inactive' | 'sold';

export interface Property {
  id: string;
  user_id: string;
  name: string;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  description?: string;
  notes?: string;
  units?: Unit[] | { count: number }[];
  transactions?: Transaction[];
  reminders?: Reminder[];
  media?: Media[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type UnitStatus = 'available' | 'occupied' | 'maintenance' | 'unavailable';

export interface Unit {
  id: string;
  property_id: string;
  name: string;
  status: UnitStatus;
  description?: string;
  tenants?: Tenant[];
  rental_contracts?: RentalContract[];
  property?: Property;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Tenant {
  id: string;
  unit_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  unit?: Unit;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type ContractStatus =
  | 'draft'
  | 'signed'
  | 'active'
  | 'expired'
  | 'terminated'
  | 'renewed';

export interface RentalContract {
  id: string;
  unit_id: string;
  signed_date?: string;
  start_date: string;
  end_date?: string;
  rent_amount: number;
  deposit_amount: number;
  payment_cycle: string;
  terms?: string;
  status: ContractStatus;
  notes?: string;
  unit?: Unit;
  contract_tenants?: { tenant: Tenant }[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  property_id: string;
  unit_id?: string;
  type: TxType;
  category: string;
  amount: number;
  transaction_date: string;
  note?: string;
  property?: Property;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Media {
  id: string;
  property_id: string;
  type: 'image' | 'contract' | 'document';
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type ReminderType =
  | 'rent_payment_due'
  | 'contract_expiring'
  | 'maintenance_needed'
  | 'custom_task';

export interface Reminder {
  id: string;
  property_id: string;
  unit_id?: string;
  type: ReminderType;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'done';
  property?: Property;
  unit?: Unit;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface DashboardData {
  summary: {
    total_properties: number;
    total_units: number;
    occupied_units: number;
    vacant_units: number;
    total_tenants: number;
    active_contracts: number;
    total_income: number;
    total_expense: number;
    net_profit: number;
    occupancy_rate: number;
  };
  by_month: { month: string; income: number; expense: number }[];
  by_category: {
    income: Record<string, number>;
    expense: Record<string, number>;
  };
  recent_transactions: Transaction[];
  upcoming_reminders: Reminder[];
  expiring_contracts: RentalContract[];
}
