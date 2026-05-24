import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUnitDto, UpdateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getUnitsByProperty(userId: string, propertyId: string) {
    // Verify property ownership
    const { data: property } = await this.supabase
      .from('hr_properties')
      .select('id')
      .eq('id', propertyId)
      .eq('user_id', userId)
      .single();

    if (!property) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('hr_units')
      .select(
        `*,
        tenants:hr_tenants(id, name, phone, email),
        rental_contracts:hr_rental_contracts(id, status, rent_amount, start_date, end_date)`,
      )
      .eq('property_id', propertyId)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getUnitDetail(userId: string, unitId: string) {
    const { data, error } = (await this.supabase
      .from('hr_units')
      .select(
        `*,
        property:hr_properties(id, user_id),
        tenants:hr_tenants(*),
        rental_contracts:hr_rental_contracts(*)`,
      )
      .eq('id', unitId)
      .is('deleted_at', null)
      .single()) as any;

    if (error || !data) {
      throw new NotFoundException('Unit not found');
    }

    // Verify ownership
    if ((data.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return data;
  }

  async createUnit(userId: string, propertyId: string, dto: CreateUnitDto) {
    // Verify property ownership
    const { data: property } = await this.supabase
      .from('hr_properties')
      .select('id')
      .eq('id', propertyId)
      .eq('user_id', userId)
      .single();

    if (!property) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('hr_units')
      .insert([{ property_id: propertyId, ...dto }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUnit(userId: string, unitId: string, dto: UpdateUnitDto) {
    // Verify ownership
    await this.getUnitDetail(userId, unitId);

    const { data, error } = await this.supabase
      .from('hr_units')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', unitId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteUnit(userId: string, unitId: string) {
    // Verify ownership
    await this.getUnitDetail(userId, unitId);

    const { error } = await this.supabase
      .from('hr_units')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', unitId);

    if (error) throw error;
  }
}
