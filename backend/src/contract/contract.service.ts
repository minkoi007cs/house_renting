import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateContractDto, UpdateContractDto } from './dto/create-contract.dto';

@Injectable()
export class ContractService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async getAllContracts(userId: string, status?: string) {
    let query = this.supabase
      .from('rental_contracts')
      .select(
        `*,
        unit:units!inner(
          id, name,
          property:properties!inner(id, name, user_id)
        ),
        contract_tenants(tenant:tenants(*))`,
      )
      .eq('unit.property.user_id', userId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('start_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getContractsByUnit(userId: string, unitId: string, status?: string) {
    const { data: unit } = (await this.supabase
      .from('units')
      .select('id, property:properties(id, user_id)')
      .eq('id', unitId)
      .single()) as any;

    if (!unit || (unit.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    let query = this.supabase
      .from('rental_contracts')
      .select(`*, contract_tenants(tenant:tenants(*))`)
      .eq('unit_id', unitId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('signed_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getContractDetail(userId: string, contractId: string) {
    const { data, error } = (await this.supabase
      .from('rental_contracts')
      .select(
        `
        *,
        unit:units(id, name, property:properties(id, user_id)),
        contract_tenants(tenant:tenants(*))
      `,
      )
      .eq('id', contractId)
      .is('deleted_at', null)
      .single()) as any;

    if (error || !data) {
      throw new NotFoundException('Contract not found');
    }

    if ((data.unit as any)?.property?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return data;
  }

  async createContract(userId: string, unitId: string, dto: CreateContractDto) {
    const { data: unit } = (await this.supabase
      .from('units')
      .select('id, property:properties(id, user_id)')
      .eq('id', unitId)
      .single()) as any;

    if (!unit || (unit.property as any)?.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { tenant_ids, ...contractData } = dto;

    const { data: contract, error } = await this.supabase
      .from('rental_contracts')
      .insert([{ unit_id: unitId, ...contractData }])
      .select()
      .single();

    if (error) throw error;

    // Link tenants if provided
    if (tenant_ids && tenant_ids.length > 0) {
      const tenantLinks = tenant_ids.map((tenantId) => ({
        contract_id: contract.id,
        tenant_id: tenantId,
      }));
      await this.supabase.from('contract_tenants').insert(tenantLinks);
    }

    return contract;
  }

  async updateContract(userId: string, contractId: string, dto: UpdateContractDto) {
    await this.getContractDetail(userId, contractId);

    const { data, error } = await this.supabase
      .from('rental_contracts')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteContract(userId: string, contractId: string) {
    await this.getContractDetail(userId, contractId);

    const { error } = await this.supabase
      .from('rental_contracts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', contractId);

    if (error) throw error;
  }
}
