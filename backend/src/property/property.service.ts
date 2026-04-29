import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(@Inject('SUPABASE_CLIENT') private supabase: SupabaseClient) {}

  async createProperty(userId: string, dto: CreatePropertyDto) {
    console.log('[Property] createProperty: userId =', userId, '| dto =', dto);
    const { data, error } = await this.supabase
      .from('properties')
      .insert([{ user_id: userId, ...dto }])
      .select()
      .single();

    if (error) {
      console.error('[Property] createProperty: INSERT FAILED -', error);
      throw error;
    }
    console.log('[Property] createProperty: OK, id =', data.id);
    return data;
  }

  async getProperties(userId: string, skip: number = 0, take: number = 10) {
    console.log('[Property] getProperties: userId =', userId, '| skip =', skip, '| take =', take);
    const { data: items, error: itemsError } = await this.supabase
      .from('properties')
      .select('*, units(count)', { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(skip, skip + take - 1);

    if (itemsError) {
      console.error('[Property] getProperties: SELECT FAILED -', itemsError);
      throw itemsError;
    }

    const { count: total, error: countError } = await this.supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (countError) {
      console.error('[Property] getProperties: COUNT FAILED -', countError);
      throw countError;
    }

    console.log('[Property] getProperties: OK, total =', total, '| returned =', items?.length);
    return { items, pagination: { skip, take, total: total || 0 } };
  }

  async getPropertyDetail(userId: string, propertyId: string) {
    console.log('[Property] getPropertyDetail: userId =', userId, '| propertyId =', propertyId);
    const { data, error } = await this.supabase
      .from('properties')
      .select(
        `*, units(*, tenants(*), rental_contracts(*)), transactions(*), media(*), reminders(*)`,
      )
      .eq('id', propertyId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      console.error('[Property] getPropertyDetail: NOT FOUND -', error);
      throw new NotFoundException('Property not found');
    }

    console.log('[Property] getPropertyDetail: OK, name =', data.name);
    return data;
  }

  async updateProperty(userId: string, propertyId: string, dto: UpdatePropertyDto) {
    console.log(
      '[Property] updateProperty: userId =',
      userId,
      '| propertyId =',
      propertyId,
      '| dto =',
      dto,
    );
    const { data: property } = await this.supabase
      .from('properties')
      .select('user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      console.error(
        '[Property] updateProperty: FORBIDDEN - property.user_id =',
        property?.user_id,
        '!= userId =',
        userId,
      );
      throw new ForbiddenException('Access denied');
    }

    const { data, error } = await this.supabase
      .from('properties')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('[Property] updateProperty: UPDATE FAILED -', error);
      throw error;
    }
    console.log('[Property] updateProperty: OK');
    return data;
  }

  async deleteProperty(userId: string, propertyId: string) {
    console.log('[Property] deleteProperty: userId =', userId, '| propertyId =', propertyId);
    const { data: property } = await this.supabase
      .from('properties')
      .select('user_id')
      .eq('id', propertyId)
      .single();

    if (!property || property.user_id !== userId) {
      console.error('[Property] deleteProperty: FORBIDDEN');
      throw new ForbiddenException('Access denied');
    }

    const { error } = await this.supabase
      .from('properties')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', propertyId);

    if (error) {
      console.error('[Property] deleteProperty: UPDATE FAILED -', error);
      throw error;
    }
    console.log('[Property] deleteProperty: OK (soft delete)');
  }
}
