export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  name: string;
  address: string;
  type: 'house' | 'apartment' | 'townhouse' | 'land' | 'other';
  status: 'active' | 'inactive' | 'sold';
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Unit {
  id: string;
  property_id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance' | 'unavailable';
  description?: string;
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
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

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
  status: 'draft' | 'signed' | 'active' | 'expired' | 'terminated' | 'renewed';
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Transaction {
  id: string;
  property_id: string;
  unit_id?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  transaction_date: string;
  note?: string;
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

export interface Reminder {
  id: string;
  property_id: string;
  unit_id?: string;
  type: 'rent_payment_due' | 'contract_expiring' | 'maintenance_needed' | 'custom_task';
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'done';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
