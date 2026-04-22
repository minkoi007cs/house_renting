import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateTenantDto, UpdateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getTenantsByUnit(userId: string, unitId: string) {
    // Verify unit ownership via property
    const { data: unit } = await this.supabase
      .from('units')
      .select(
        `id,
        property:properties(id, user_id)`,
      )
      .eq('id', unitId)
      .single();

    if (!unit || unit.property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('tenants')
      .select('*')
      .eq('unit_id', unitId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getTenantDetail(userId: string, tenantId: string) {
    const { data, error } = await this.supabase
      .from('tenants')
      .select(
        `*,
        unit:units(id, property:properties(id, user_id))`,
      )
      .eq('id', tenantId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      throw new NotFoundException('Tenant not found');
    }

    // Verify ownership
    if (data.unit.property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return data;
  }

  async createTenant(userId: string, unitId: string, dto: CreateTenantDto) {
    // Verify unit ownership
    const { data: unit } = await this.supabase
      .from('units')
      .select(
        `id,
        property:properties(id, user_id)`,
      )
      .eq('id', unitId)
      .single();

    if (!unit || unit.property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('tenants')
      .insert([{ unit_id: unitId, ...dto }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTenant(userId: string, tenantId: string, dto: UpdateTenantDto) {
    // Verify ownership
    await this.getTenantDetail(userId, tenantId);

    const { data, error } = await this.supabase
      .from('tenants')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', tenantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTenant(userId: string, tenantId: string) {
    // Verify ownership
    await this.getTenantDetail(userId, tenantId);

    const { error } = await this.supabase
      .from('tenants')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', tenantId);

    if (error) throw error;
  }
}
