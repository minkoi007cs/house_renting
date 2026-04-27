import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async createProperty(userId: string, dto: CreatePropertyDto) {
    const { data, error } = await this.supabase
      .from('properties')
      .insert([
        {
          user_id: userId,
          ...dto,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProperties(userId: string, skip: number = 0, take: number = 10) {
    const { data: items, error: itemsError } = await this.supabase
      .from('properties')
      .select('*, units(count)', {
        count: 'exact',
      })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(skip, skip + take - 1);

    if (itemsError) throw itemsError;

    const { count: total, error: countError } = await this.supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (countError) throw countError;

    return {
      items,
      pagination: {
        skip,
        take,
        total: total || 0,
      },
    };
  }

  async getPropertyDetail(userId: string, propertyId: string) {
    const { data, error } = await this.supabase
      .from('properties')
      .select(
        `
        *,
        units(
          *,
          tenants(*),
          rental_contracts(*)
        ),
        transactions(*),
        media(*),
        reminders(*)
      `,
      )
      .eq('id', propertyId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      throw new NotFoundException('Property not found');
    }

    return data;
  }

  async updateProperty(userId: string, propertyId: string, dto: UpdatePropertyDto) {
    // Verify ownership
    const { data: property } = await this.supabase
      .from('properties')
      .select('user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('properties')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProperty(userId: string, propertyId: string) {
    // Verify ownership
    const { data: property } = await this.supabase
      .from('properties')
      .select('user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { error } = await this.supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId);

    if (error) throw error;
  }
}
