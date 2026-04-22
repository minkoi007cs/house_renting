import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ReminderService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getRemindersByProperty(userId: string, propertyId: string) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('reminders')
      .select('*')
      .eq('property_id', propertyId)
      .is('deleted_at', null)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getUpcomingReminders(userId: string, days = 7) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const { data, error } = await this.supabase
      .from('reminders')
      .select('*, property:properties(id, name, user_id)')
      .eq('property:properties.user_id', userId)
      .gte('due_date', startDate.toISOString().split('T')[0])
      .lte('due_date', endDate.toISOString().split('T')[0])
      .eq('status', 'pending')
      .is('deleted_at', null)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async createReminder(userId: string, propertyId: string, dto: any) {
    const { data: property } = await this.supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('reminders')
      .insert([{ property_id: propertyId, ...dto }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateReminder(userId: string, reminderId: string, dto: any) {
    const { data: reminder } = await this.supabase
      .from('reminders')
      .select('property:properties(user_id)')
      .eq('id', reminderId)
      .single();

    if (!reminder || reminder.property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('reminders')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReminder(userId: string, reminderId: string) {
    const { data: reminder } = await this.supabase
      .from('reminders')
      .select('property:properties(user_id)')
      .eq('id', reminderId)
      .single();

    if (!reminder || reminder.property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { error } = await this.supabase
      .from('reminders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', reminderId);

    if (error) throw error;
  }
}
