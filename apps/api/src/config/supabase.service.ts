import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async query(table: string, options?: any) {
    return this.supabase.from(table).select('*', options);
  }

  async insert(table: string, data: any) {
    return this.supabase.from(table).insert([data]).select();
  }

  async update(table: string, id: string, data: any) {
    return this.supabase.from(table).update(data).eq('id', id).select();
  }

  async delete(table: string, id: string) {
    return this.supabase.from(table).delete().eq('id', id);
  }
}
