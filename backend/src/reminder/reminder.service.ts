import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ReminderService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getAllReminders(userId: string, status?: string) {
    let query = this.supabase
      .from('reminders')
      .select(
        `*,
        property:properties!inner(id, name, user_id),
        unit:units(id, name)`,
      )
      .eq('property.user_id', userId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('due_date', { ascending: true });
    if (error) throw error;
    return data;
  }

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

  async getReminderById(userId: string, reminderId: string) {
    const { data, error } = (await this.supabase
      .from('reminders')
      .select('*, property:properties(id, name, user_id)')
      .eq('id', reminderId)
      .single()) as any;

    if (error || !data) throw new NotFoundException('Reminder not found');
    if ((data.property as any)?.user_id !== userId) throw new ForbiddenException('Access denied');
    return data;
  }

  async updateReminder(userId: string, reminderId: string, dto: any) {
    const { data: reminder } = (await this.supabase
      .from('reminders')
      .select('property:properties(user_id)')
      .eq('id', reminderId)
      .single()) as any;

    if (!reminder || (reminder.property as any)?.user_id !== userId) {
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
    const { data: reminder } = (await this.supabase
      .from('reminders')
      .select('property:properties(user_id)')
      .eq('id', reminderId)
      .single()) as any;

    if (!reminder || (reminder.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { error } = await this.supabase
      .from('reminders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', reminderId);

    if (error) throw error;
  }
}
